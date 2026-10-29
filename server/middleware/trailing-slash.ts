/**
 * Single-hop permanent (301) redirects (GSC fix 2026-10-29).
 * Resolves, in ONE hop: trailing slash (/about/ -> /about), legacy /service/<x>
 * -> /services/<x>, legacy root-level WordPress article slugs -> /articles/<slug>,
 * and a few renamed pages. The homepage "/" is left alone; query is preserved.
 * (Previously trailing-slash stripped first, then the client router 307'd
 * /service/* and old slugs 404'd, so Google saw chains and 404s.)
 */
interface TrailingSlashEvent {
  url: URL;
}

const ARTICLE_SLUGS = new Set<string>([
  "plumber-cost-los-angeles",
  "emergency-plumber-los-angeles-first-10-minutes",
  "clogged-drain-los-angeles-snaking-not-enough",
  "hydro-jetting-vs-snaking-los-angeles",
  "tree-roots-sewer-line-los-angeles",
  "no-hot-water-los-angeles-checklist",
  "tankless-water-heater-los-angeles-worth-it",
  "high-ladwp-bill-hidden-water-leak-los-angeles",
  "older-los-angeles-home-plumbing-inspection",
  "earthquake-plumbing-los-angeles-checklist",
  "why-does-my-drain-smell-bad-common-causes-and-solutions",
  "how-hard-water-affects-your-plumbing-system-in-los-angeles",
  "signs-you-need-sewer-line-repair-before-it-becomes-an-emergency",
  "why-is-my-water-pressure-low-in-my-home-common-causes-and-solutions",
  "how-much-does-a-plumber-cost-in-los-angeles-2026-guide",
  "top-plumbing-mistakes-homeowners-make-and-how-to-avoid-them",
  "what-to-do-before-calling-an-emergency-plumber-in-los-angeles",
  "how-to-read-plumbing-blueprints-and-diagrams-like-a-pro",
  "signs-your-water-heater-is-about-to-explode-and-what-to-do-about-it",
  "do-green-copper-pipes-need-to-be-replaced-a-complete-guide-for-homeowners",
  "understanding-venting-systems-in-plumbing",
  "potable-vs-non-potable-water-systems-what-every-homeowner-should-know",
  "protecting-your-water-supply-with-backflow-prevention-and-cross-connection-control",
  "how-to-prevent-rust-stains-in-your-toilet",
  "plumbing-priorities-before-you-leave-for-vacation",
  "plumbing-myths",
  "water-heater-noises",
  "signs-you-need-water-heater-replacement",
  "prevent-fix-sewer-line-backups",
  "common-causes-clogged-drains",
  "what-is-rooter-service",
  "5-warning-signs",
  "what-causes-low-water-pressure",
  "how-to-fix-leaky-faucet",
  "sewer-line-repair-pasadena",
  "drain-cleaning-glendale-ca",
  "should-you-diy-or-hire-a-pro-for-water-heater-repairs",
  "what-makes-hiring-a-local-plumber-a-smart-choice-for-your-home",
  "trenchless-sewer-replacement-santa-monica",
  "leak-detection-services-extreme-plumbing",
  "reliable-plumbing-solutions-los-angeles",
  "plumbing-maintenance-los-angeles",
  "repiping-services-woodland-hills",
  "drain-healthy-plumbing-rooter",
  "trenchless-sewer-replacement-van-nuys-los-angeles",
  "camera-inspection-extreme-plumbing-van-nuys-los-angeles",
  "why-copper-repiping-is-essential-for-older-homes-in-van-nuys",
  "water-heater-replacement-van-nuys",
  "the-power-of-hydrojetting-the-best-way-to-clean-drains-in-van-nuys",
  "rooter-services-in-van-nuys-when-and-why-you-need-them",
  "how-to-unclog-drains-in-van-nuys",
  "the-benefits-of-hydro-jetting-services-in-van-nuys",
  "do-you-need-new-pipes-in-your-van-nuys-home-signs-and-solutions",
  "the-top-5-plumbing-emergencies-you-should-know",
  "top-10-common-plumbing-issues-and-how-to-solve-them",
  "conquer-broken-sewer-woes-with-24-7-service-extreme-plumbing",
  "hydro-jetting-your-drains-before-the-rain-arrives",
  "5-culprits-behind-clogged-pipes",
  "los-angeles-plumbing-problems",
]);

const MOVED: Record<string, string> = {
  "/location": "/service-areas",
  "/contact-us": "/contact",
  "/book-an-appointment": "/book",
  "/service": "/services",
  "/articles/$slug": "/articles",
};

function resolve(path: string): string {
  if (MOVED[path]) return MOVED[path];
  const svc = /^\/service\/([^/]+)$/.exec(path);
  if (svc) return `/services/${svc[1]}`;
  const root = /^\/([^/]+)$/.exec(path);
  if (root && ARTICLE_SLUGS.has(root[1])) return `/articles/${root[1]}`;
  return path;
}

export default (event: TrailingSlashEvent) => {
  const { pathname, search } = event.url;
  if (pathname === "/" || pathname.startsWith("/api/") || pathname.startsWith("/__")) return;
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    /* keep raw */
  }
  path = path.length > 1 ? path.replace(/\/+$/, "") || "/" : path;
  const target = resolve(path);
  const rawStripped = pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
  if (target === path && rawStripped === pathname) return;
  const loc = (target === path ? rawStripped : encodeURI(target)) + search;
  return new Response(null, { status: 301, headers: { location: loc } });
};
