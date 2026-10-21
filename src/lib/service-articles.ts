import { articles, type Article } from "./articles";
import { getService, type Service } from "./site";

// Topic map: article slug -> the one service page it supports.
// Assigned from each article's own title/slug/keyword. Articles not listed are
// general guides and link to the /services hub instead.
export const ARTICLE_SERVICE: Record<string, string> = {
  // Drain Cleaning & Rooter
  "clogged-drain-los-angeles-snaking-not-enough": "drain-cleaning-rooter-service",
  "why-does-my-drain-smell-bad-common-causes-and-solutions": "drain-cleaning-rooter-service",
  "prevent-fix-sewer-line-backups": "drain-cleaning-rooter-service",
  "common-causes-clogged-drains": "drain-cleaning-rooter-service",
  "what-is-rooter-service": "drain-cleaning-rooter-service",
  "5-warning-signs": "drain-cleaning-rooter-service",
  "drain-cleaning-glendale-ca": "drain-cleaning-rooter-service",
  "drain-healthy-plumbing-rooter": "drain-cleaning-rooter-service",
  "rooter-services-in-van-nuys-when-and-why-you-need-them": "drain-cleaning-rooter-service",
  "how-to-unclog-drains-in-van-nuys": "drain-cleaning-rooter-service",
  "5-culprits-behind-clogged-pipes": "drain-cleaning-rooter-service",
  // Trenchless Sewer Replacement
  "tree-roots-sewer-line-los-angeles": "trenchless-sewer-replacement",
  "signs-you-need-sewer-line-repair-before-it-becomes-an-emergency": "trenchless-sewer-replacement",
  "sewer-line-repair-pasadena": "trenchless-sewer-replacement",
  "trenchless-sewer-replacement-santa-monica": "trenchless-sewer-replacement",
  "trenchless-sewer-replacement-van-nuys-los-angeles": "trenchless-sewer-replacement",
  "conquer-broken-sewer-woes-with-24-7-service-extreme-plumbing": "trenchless-sewer-replacement",
  // Water Heaters
  "no-hot-water-los-angeles-checklist": "water-heaters",
  "tankless-water-heater-los-angeles-worth-it": "water-heaters",
  "signs-your-water-heater-is-about-to-explode-and-what-to-do-about-it": "water-heaters",
  "water-heater-noises": "water-heaters",
  "signs-you-need-water-heater-replacement": "water-heaters",
  "should-you-diy-or-hire-a-pro-for-water-heater-repairs": "water-heaters",
  "water-heater-replacement-van-nuys": "water-heaters",
  // Copper Repipe
  "why-is-my-water-pressure-low-in-my-home-common-causes-and-solutions": "copper-repipe",
  "do-green-copper-pipes-need-to-be-replaced-a-complete-guide-for-homeowners": "copper-repipe",
  "what-causes-low-water-pressure": "copper-repipe",
  "repiping-services-woodland-hills": "copper-repipe",
  "why-copper-repiping-is-essential-for-older-homes-in-van-nuys": "copper-repipe",
  "do-you-need-new-pipes-in-your-van-nuys-home-signs-and-solutions": "copper-repipe",
  // Hydro-Jetting
  "hydro-jetting-vs-snaking-los-angeles": "hydro-jetter",
  "the-power-of-hydrojetting-the-best-way-to-clean-drains-in-van-nuys": "hydro-jetter",
  "the-benefits-of-hydro-jetting-services-in-van-nuys": "hydro-jetter",
  "hydro-jetting-your-drains-before-the-rain-arrives": "hydro-jetter",
  // Camera Inspection
  "older-los-angeles-home-plumbing-inspection": "camera-inspection",
  "camera-inspection-extreme-plumbing-van-nuys-los-angeles": "camera-inspection",
  // Leak Detection
  "high-ladwp-bill-hidden-water-leak-los-angeles": "leak-detection",
  "leak-detection-services-extreme-plumbing": "leak-detection",
};

export function serviceForArticle(slug: string): Service | undefined {
  const s = ARTICLE_SERVICE[slug];
  return s ? getService(s) : undefined;
}

export function articlesForService(serviceSlug: string, limit = 6): Article[] {
  return articles
    .filter((a) => ARTICLE_SERVICE[a.slug] === serviceSlug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
