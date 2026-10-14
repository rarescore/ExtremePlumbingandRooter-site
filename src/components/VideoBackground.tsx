"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePosterFirstVideo(src: string, { autoplay }: { autoplay: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    let attached = false;

    const detach = () => {
      attached = false;
      vid.pause();
      vid.removeAttribute("src");
      while (vid.firstChild) vid.removeChild(vid.firstChild);
      vid.load();
      setReady(false);
    };

    const attach = () => {
      if (attached || reducedMotion()) return;
      const mp4 = document.createElement("source");
      mp4.src = src;
      mp4.type = "video/mp4";
      vid.appendChild(mp4);
      vid.preload = "auto";
      vid.load();
      attached = true;
    };

    const onReady = () => {
      setReady(true);
      if (autoplay && attached && !reducedMotion() && !document.hidden) {
        void vid.play().catch(() => undefined);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const near = entries.some((e) => e.isIntersecting);
        if (reducedMotion()) {
          detach();
          return;
        }
        if (near) {
          attach();
          if (autoplay && attached) void vid.play().catch(() => undefined);
        } else if (attached) {
          vid.pause();
        }
      },
      { rootMargin: "280px 0px", threshold: 0.01 },
    );

    io.observe(el);
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;
    vid.addEventListener("loadeddata", onReady);

    const onVis = () => {
      if (document.hidden) vid.pause();
      else if (autoplay && attached && !reducedMotion()) void vid.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      vid.removeEventListener("loadeddata", onReady);
      document.removeEventListener("visibilitychange", onVis);
      detach();
    };
  }, [src, autoplay]);

  return { rootRef, videoRef, ready };
}

export function VideoBackground({
  src,
  poster,
  className,
  priority = false,
}: {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
}) {
  const { rootRef, videoRef, ready } = usePosterFirstVideo(src, { autoplay: true });

  return (
    <div ref={rootRef} className={cn("absolute inset-0 overflow-hidden bg-navy", className)} aria-hidden="true">
      <img
        src={poster}
        alt=""
        width={1280}
        height={720}
        className="hero-poster absolute inset-0 size-full object-cover"
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
      />
      <video
        ref={videoRef}
        className={cn("hero-video absolute inset-0 size-full object-cover", ready && "is-ready")}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        width={1280}
        height={720}
      />
    </div>
  );
}

export function InViewVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const { rootRef, videoRef, ready } = usePosterFirstVideo(src, { autoplay: true });

  return (
    <div ref={rootRef} className={cn("absolute inset-0 overflow-hidden bg-navy", className)} aria-hidden="true">
      <img src={poster} alt="" width={1280} height={720} className="absolute inset-0 size-full object-cover" decoding="async" />
      <video
        ref={videoRef}
        className={cn("hero-video absolute inset-0 size-full object-cover", ready && "is-ready")}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        width={1280}
        height={720}
      />
    </div>
  );
}
