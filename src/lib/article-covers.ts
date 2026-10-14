export type ArticleCover = { src: string; alt: string };

// One unique, locally hosted stock photo per article (see public/media/blog/CREDITS.md).
export const ARTICLE_COVERS: Record<string, ArticleCover> = {
  "plumber-cost-los-angeles": {
    src: "/media/blog/wrenches-arranged-in-circle.webp",
    alt: "Set of steel wrenches arranged in a circle on a dark surface",
  },
  "emergency-plumber-los-angeles-first-10-minutes": {
    src: "/media/blog/yellow-lever-ball-valve.webp",
    alt: "Yellow lever handle on a galvanized ball valve shutoff",
  },
  "clogged-drain-los-angeles-snaking-not-enough": {
    src: "/media/blog/foamy-water-around-clogged-drain.webp",
    alt: "Murky brown water and foam pooling around a clogged drain",
  },
  "hydro-jetting-vs-snaking-los-angeles": {
    src: "/media/blog/high-pressure-water-spray.webp",
    alt: "High-pressure stream of water spraying into the air",
  },
  "tree-roots-sewer-line-los-angeles": {
    src: "/media/blog/tangled-tree-roots.webp",
    alt: "Dense tangle of exposed brown tree roots",
  },
  "no-hot-water-los-angeles-checklist": {
    src: "/media/blog/rain-shower-head-tiled-bathroom.webp",
    alt: "Stainless steel rain shower head in a tiled bathroom",
  },
  "tankless-water-heater-los-angeles-worth-it": {
    src: "/media/blog/wall-mounted-water-heater-above-sink.webp",
    alt: "Compact wall-mounted water heater installed above a sink",
  },
  "high-ladwp-bill-hidden-water-leak-los-angeles": {
    src: "/media/blog/blue-water-meter-on-pipe.webp",
    alt: "Blue residential water meter on a grey supply pipe against a stone wall",
  },
  "older-los-angeles-home-plumbing-inspection": {
    src: "/media/blog/old-metal-pipes-brick-wall.webp",
    alt: "Black and white photo of old flanged metal pipes along a brick wall",
  },
  "earthquake-plumbing-los-angeles-checklist": {
    src: "/media/blog/yellow-gas-pipe-shutoff-valve.webp",
    alt: "Yellow gas line with a shutoff valve outside a building",
  },
  "why-does-my-drain-smell-bad-common-causes-and-solutions": {
    src: "/media/blog/stainless-sink-drain-strainer.webp",
    alt: "Close-up of a stainless steel sink drain strainer",
  },
  "how-hard-water-affects-your-plumbing-system-in-los-angeles": {
    src: "/media/blog/brass-tap-with-water-droplets.webp",
    alt: "Weathered brass tap on a textured, mineral-stained wall",
  },
  "signs-you-need-sewer-line-repair-before-it-becomes-an-emergency": {
    src: "/media/blog/rusty-sewer-manhole-cover.webp",
    alt: "Rusty cast-iron sewer manhole cover set in stone pavement",
  },
  "why-is-my-water-pressure-low-in-my-home-common-causes-and-solutions": {
    src: "/media/blog/brass-pressure-gauge-on-pipe.webp",
    alt: "Brass water pressure gauge mounted on a pipe fitting",
  },
  "how-much-does-a-plumber-cost-in-los-angeles-2026-guide": {
    src: "/media/blog/calculator-and-pen-on-paperwork.webp",
    alt: "Calculator and pen resting on a sheet of paperwork",
  },
  "top-plumbing-mistakes-homeowners-make-and-how-to-avoid-them": {
    src: "/media/blog/orange-pipes-with-valves-dark-wall.webp",
    alt: "Orange utility pipes with fittings and valves on a dark wall",
  },
  "what-to-do-before-calling-an-emergency-plumber-in-los-angeles": {
    src: "/media/blog/orange-gate-valve-handwheel.webp",
    alt: "Orange handwheel on an outdoor gate valve",
  },
  "how-to-read-plumbing-blueprints-and-diagrams-like-a-pro": {
    src: "/media/blog/architectural-drawings-elevations-floor-plan.webp",
    alt: "Architectural drawing sheet with building elevations and a floor plan",
  },
  "signs-your-water-heater-is-about-to-explode-and-what-to-do-about-it": {
    src: "/media/blog/rusty-relief-valve-with-gauges.webp",
    alt: "Rusty pressure relief valve with two analog pressure gauges",
  },
  "do-green-copper-pipes-need-to-be-replaced-a-complete-guide-for-homeowners": {
    src: "/media/blog/green-oxidized-copper-patina.webp",
    alt: "Close-up of green and teal oxidized copper patina",
  },
  "understanding-venting-systems-in-plumbing": {
    src: "/media/blog/roof-vent-on-clay-tiles.webp",
    alt: "Vent cap on a red clay tile roof under a blue sky",
  },
  "potable-vs-non-potable-water-systems-what-every-homeowner-should-know": {
    src: "/media/blog/water-poured-into-glass.webp",
    alt: "Clear drinking water being poured into a glass",
  },
  "protecting-your-water-supply-with-backflow-prevention-and-cross-connection-control": {
    src: "/media/blog/two-gate-valves-on-pipes.webp",
    alt: "Two weathered gate valves with handwheels on water pipes",
  },
  "how-to-prevent-rust-stains-in-your-toilet": {
    src: "/media/blog/white-toilet-bowl-lid-open.webp",
    alt: "White ceramic toilet bowl with the lid open",
  },
  "plumbing-priorities-before-you-leave-for-vacation": {
    src: "/media/blog/blue-suitcase-on-wooden-deck.webp",
    alt: "Blue hard-shell suitcase standing on a wooden deck",
  },
  "plumbing-myths": {
    src: "/media/blog/toilet-paper-roll-unrolled.webp",
    alt: "Roll of toilet paper partly unrolled on a light blue background",
  },
  "water-heater-noises": {
    src: "/media/blog/laundry-room-with-water-heater.webp",
    alt: "Home laundry room with a washing machine and a tank water heater",
  },
  "signs-you-need-water-heater-replacement": {
    src: "/media/blog/row-of-water-heater-tanks.webp",
    alt: "Row of stainless steel hot water tanks lined up in a utility room",
  },
  "prevent-fix-sewer-line-backups": {
    src: "/media/blog/floor-drain-wet-concrete.webp",
    alt: "Metal floor drain grate on wet concrete",
  },
  "common-causes-clogged-drains": {
    src: "/media/blog/sink-drain-close-up.webp",
    alt: "Close-up of a stainless steel sink drain opening",
  },
  "what-is-rooter-service": {
    src: "/media/blog/flexible-coiled-metal-hose.webp",
    alt: "Close-up of a flexible coiled metal hose bending in a curve",
  },
  "5-warning-signs": {
    src: "/media/blog/water-swirling-into-sink-drain.webp",
    alt: "Water swirling into a white sink drain",
  },
  "what-causes-low-water-pressure": {
    src: "/media/blog/faucet-with-hanging-water-drop.webp",
    alt: "Kitchen faucet with a single water drop hanging from the spout",
  },
  "how-to-fix-leaky-faucet": {
    src: "/media/blog/dripping-faucet.webp",
    alt: "Water dripping from a chrome faucet",
  },
  "sewer-line-repair-pasadena": {
    src: "/media/blog/excavator-trench-large-pipes.webp",
    alt: "Excavator beside an open trench with large pipes",
  },
  "drain-cleaning-glendale-ca": {
    src: "/media/blog/white-basin-drain.webp",
    alt: "Chrome drain in a white basin",
  },
  "should-you-diy-or-hire-a-pro-for-water-heater-repairs": {
    src: "/media/blog/pipe-wrench-and-adjustable-wrench.webp",
    alt: "Pipe wrench and adjustable wrench on a black background",
  },
  "what-makes-hiring-a-local-plumber-a-smart-choice-for-your-home": {
    src: "/media/blog/house-with-dormer-and-shrubs.webp",
    alt: "Brick and white siding house with a dormer and front shrubs",
  },
  "trenchless-sewer-replacement-santa-monica": {
    src: "/media/blog/large-pipes-at-construction-site.webp",
    alt: "Black and white photo of large pipes lying at a construction site",
  },
  "leak-detection-services-extreme-plumbing": {
    src: "/media/blog/water-stained-peeling-ceiling.webp",
    alt: "Water-stained ceiling corner with peeling paint",
  },
  "reliable-plumbing-solutions-los-angeles": {
    src: "/media/blog/hillside-homes-palm-trees-view.webp",
    alt: "Hillside homes with palm trees and a city view under a blue sky",
  },
  "plumbing-maintenance-los-angeles": {
    src: "/media/blog/white-pipes-with-valves-on-wall.webp",
    alt: "Black and white photo of white pipes with valves mounted on a wall",
  },
  "repiping-services-woodland-hills": {
    src: "/media/blog/new-white-pipe-runs-on-wall.webp",
    alt: "Neat runs of new white water pipes along a wall",
  },
  "drain-healthy-plumbing-rooter": {
    src: "/media/blog/white-bathtub-and-vessel-sink.webp",
    alt: "Bright bathroom with a freestanding white bathtub and vessel sink",
  },
  "trenchless-sewer-replacement-van-nuys-los-angeles": {
    src: "/media/blog/view-through-concrete-pipe.webp",
    alt: "View through the inside of a large concrete pipe",
  },
  "camera-inspection-extreme-plumbing-van-nuys-los-angeles": {
    src: "/media/blog/inside-pipe-with-light.webp",
    alt: "View down the inside of a pipe toward a lit opening",
  },
  "why-copper-repiping-is-essential-for-older-homes-in-van-nuys": {
    src: "/media/blog/copper-pipes-bent-in-parallel.webp",
    alt: "Parallel copper pipes bent at right angles on a blue background",
  },
  "water-heater-replacement-van-nuys": {
    src: "/media/blog/water-heater-in-bathroom-niche.webp",
    alt: "Grey electric water heater installed in a bathroom niche",
  },
  "the-power-of-hydrojetting-the-best-way-to-clean-drains-in-van-nuys": {
    src: "/media/blog/water-gushing-from-pipe.webp",
    alt: "Strong stream of water gushing from a white pipe",
  },
  "rooter-services-in-van-nuys-when-and-why-you-need-them": {
    src: "/media/blog/drain-access-cover.webp",
    alt: "Round metal access cover stamped DRAIN set in asphalt",
  },
  "how-to-unclog-drains-in-van-nuys": {
    src: "/media/blog/sink-strainer-stainless-basin.webp",
    alt: "Stainless steel sink basin with a mesh drain strainer",
  },
  "the-benefits-of-hydro-jetting-services-in-van-nuys": {
    src: "/media/blog/water-flowing-from-large-pipe.webp",
    alt: "Water flowing out of a large grey pipe at street level",
  },
  "do-you-need-new-pipes-in-your-van-nuys-home-signs-and-solutions": {
    src: "/media/blog/pile-of-old-rusty-pipes.webp",
    alt: "Pile of old, corroded metal pipes and fittings",
  },
  "the-top-5-plumbing-emergencies-you-should-know": {
    src: "/media/blog/flooded-hallway-floor.webp",
    alt: "Dark hallway with water pooled across the floor",
  },
  "top-10-common-plumbing-issues-and-how-to-solve-them": {
    src: "/media/blog/bathroom-vanity-toilet-tub.webp",
    alt: "Bathroom with a grey vanity, toilet and bathtub",
  },
  "conquer-broken-sewer-woes-with-24-7-service-extreme-plumbing": {
    src: "/media/blog/broken-corroded-pipe.webp",
    alt: "Broken, corroded pipe with eroded sections among weeds",
  },
  "hydro-jetting-your-drains-before-the-rain-arrives": {
    src: "/media/blog/leaves-clogging-storm-drain-rain.webp",
    alt: "Wet autumn leaves clogging a storm drain on a rainy street",
  },
  "5-culprits-behind-clogged-pipes": {
    src: "/media/blog/dirty-dishes-in-kitchen-sink.webp",
    alt: "Dishes and cups left in a dark kitchen sink",
  },
  "los-angeles-plumbing-problems": {
    src: "/media/blog/palm-lined-road-los-angeles-skyline.webp",
    alt: "Palm-lined road leading toward the Los Angeles skyline at golden hour",
  },
};

export function coverFor(slug: string, title: string): string {
  const unique = ARTICLE_COVERS[slug];
  if (unique) return unique.src;
  return legacyCoverFor(slug, title);
}

export function coverAltFor(slug: string): string {
  return ARTICLE_COVERS[slug]?.alt ?? "";
}

// Keyword fallback for articles added later without a dedicated cover.
function legacyCoverFor(slug: string, title: string): string {
  const t = `${slug} ${title}`.toLowerCase();
  if (t.includes("camera") || t.includes("inspection") || t.includes("buying"))
    return "/media/camera-inspection.jpg";
  if (t.includes("hydro") || t.includes("jet")) return "/media/hydro-jetting.jpg";
  if (
    t.includes("tankless") ||
    t.includes("water heater") ||
    t.includes("water-heater") ||
    t.includes("explode") ||
    t.includes("hot water")
  )
    return "/media/water-heaters.jpg";
  if (t.includes("tree") || t.includes("roots") || t.includes("sewer") || t.includes("trenchless") || t.includes("backup"))
    return "/media/trenchless-sewer.jpg";
  if (
    t.includes("copper") ||
    t.includes("repipe") ||
    t.includes("pex") ||
    t.includes("earthquake") ||
    t.includes("seismic") ||
    t.includes("new-pipes") ||
    t.includes("new pipes")
  )
    return "/media/copper-repipe.jpg";
  if (t.includes("leak") || t.includes("ladwp") || t.includes("pressure") || t.includes("rust") || t.includes("faucet"))
    return "/media/leak-detection.jpg";
  if (t.includes("hard water") || t.includes("hard-water")) return "/media/articles/hard-water.jpg";
  if (t.includes("venting") || t.includes("vent stack")) return "/media/articles/vents.jpg";
  if (t.includes("backflow") || t.includes("potable") || t.includes("cross-connection"))
    return "/media/articles/backflow.jpg";
  if (t.includes("emergenc") || t.includes("24-7") || t.includes("24/7") || t.includes("first-10") || t.includes("vacation"))
    return "/media/articles/shutoff.jpg";
  if (t.includes("boiler")) return "/media/boilers.jpg";
  if (t.includes("drain") || t.includes("clog") || t.includes("rooter") || t.includes("smell") || t.includes("unclog") || t.includes("snake"))
    return "/media/clogged-drain.jpg";
  if (t.includes("high-rise") || t.includes("high rise")) return "/media/high-rise.jpg";
  return "/media/articles/open-wall.jpg";
}

export function formatArticleDate(value: string) {
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date(`${iso}-07:00`));
}