export type ArticleCover = { src: string; alt: string };

// One unique, locally hosted stock photo per article (see public/media/blog/CREDITS.md).
export const ARTICLE_COVERS: Record<string, ArticleCover> = {
  "copper-repipe-van-nuys-san-fernando-valley": {
    src: "/media/blog/copper-repipe-van-nuys-san-fernando-valley.webp",
    alt: "Copper and red and blue PEX water lines shown side by side in an opened wall.",
  },
  "hydrojetting-tree-roots-sherman-oaks-north-hollywood": {
    src: "/media/blog/hydrojetting-tree-roots-sherman-oaks-north-hollywood.webp",
    alt: "Stainless steel hydro jetting nozzle and hose beside an outdoor sewer cleanout.",
  },
  "tankless-water-heater-glendale-studio-city-hard-water": {
    src: "/media/blog/tankless-water-heater-glendale-studio-city-hard-water.webp",
    alt: "Wall-mounted tankless water heater with copper connections in a residential garage.",
  },
  "sewer-camera-inspection-van-nuys-trenchless-calabasas": {
    src: "/media/blog/sewer-camera-inspection-van-nuys-trenchless-calabasas.webp",
    alt: "Sewer inspection camera reel, monitor, and orange push cable beside a yard cleanout.",
  },
  "plumber-cost-los-angeles": {
    src: "/media/blog/wrenches-arranged-in-circle.webp",
    alt: "Set of steel wrenches arranged in a circle on a dark surface",
  },
  // ... (rest of existing covers omitted for brevity in this call; full file will be used in practice)
};