export type MediaTier = "mobile" | "desktop";

export type PremiumSource = {
  mp4: string;
  poster: string;
  width: number;
  height: number;
};

/** Viewport tiers so phones never download the desktop film. */
export function mediaTier(width = typeof window === "undefined" ? 1440 : window.innerWidth): MediaTier {
  return width < 900 ? "mobile" : "desktop";
}

export const films = {
  hero: { mp4: "/media/video/hero.mp4", poster: "/media/video/hero-poster.jpg", width: 1280, height: 720 },
  inner: { mp4: "/media/video/inner-hero.mp4", poster: "/media/video/inner-poster.jpg", width: 1280, height: 720 },
  camera: { mp4: "/media/video/camera.mp4", poster: "/media/video/camera-poster.jpg", width: 1280, height: 720 },
  hydro: { mp4: "/media/video/hydro.mp4", poster: "/media/video/hydro-poster.jpg", width: 1280, height: 720 },
  emergency: { mp4: "/media/video/emergency.mp4", poster: "/media/video/emergency-poster.jpg", width: 1280, height: 720 },
  drain: { mp4: "/media/video/drain.mp4", poster: "/media/video/drain-poster.jpg", width: 1280, height: 720 },
  waterHeater: { mp4: "/media/video/water-heater.mp4", poster: "/media/video/water-heater-poster.jpg", width: 1280, height: 720 },
  trenchless: { mp4: "/media/video/trenchless.mp4", poster: "/media/video/trenchless-poster.jpg", width: 1280, height: 720 },
} as const;

/** First-frame poster for the homepage sewer sequence. Preload this only. */
export const HERO_POSTER_PRELOAD = "/media/sewer/f01.jpg";
