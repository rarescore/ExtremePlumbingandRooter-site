export const videos = {
  hero: { src: "/media/video/hero.mp4", poster: "/media/video/hero-poster.jpg" },
  inner: { src: "/media/video/inner-hero.mp4", poster: "/media/video/inner-poster.jpg" },
  camera: { src: "/media/video/camera.mp4", poster: "/media/video/camera-poster.jpg" },
  hydro: { src: "/media/video/hydro.mp4", poster: "/media/video/hydro-poster.jpg" },
  emergency: { src: "/media/video/emergency.mp4", poster: "/media/video/emergency-poster.jpg" },
  drain: { src: "/media/video/drain.mp4", poster: "/media/video/drain-poster.jpg" },
  waterHeater: { src: "/media/video/water-heater.mp4", poster: "/media/video/water-heater-poster.jpg" },
  trenchless: { src: "/media/video/trenchless.mp4", poster: "/media/video/trenchless-poster.jpg" },
} as const;

export const heroSequence = [
  {
    src: "/media/video/hero-seq/01-broken-line.mp4",
    poster: "/media/video/hero-seq/01-broken-line.jpg",
    label: "Broken sewer line",
  },
  {
    src: "/media/video/hero-seq/02-new-pipe.mp4",
    poster: "/media/video/hero-seq/02-new-pipe.jpg",
    label: "New pipe ready",
  },
  {
    src: "/media/video/hero-seq/03-sewer-line.mp4",
    poster: "/media/video/hero-seq/03-sewer-line.jpg",
    label: "Sewer line replacement",
  },
  {
    src: "/media/video/hero-seq/04-coupling.mp4",
    poster: "/media/video/hero-seq/04-coupling.jpg",
    label: "New line coupled",
  },
  {
    src: "/media/video/hero-seq/05-flow.mp4",
    poster: "/media/video/hero-seq/05-flow.jpg",
    label: "Flow test",
  },
] as const;

export function videoForService(slug: string) {
  switch (slug) {
    case "camera-inspection":
      return videos.camera;
    case "hydro-jetter":
      return videos.hydro;
    case "drain-cleaning-rooter-service":
      return videos.drain;
    case "water-heaters":
    case "boilers-replace-repairs":
      return videos.waterHeater;
    case "trenchless-sewer-replacement":
      return videos.trenchless;
    case "leak-detection":
      return videos.emergency;
    default:
      return videos.inner;
  }
}
