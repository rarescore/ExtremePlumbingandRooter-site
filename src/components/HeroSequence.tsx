"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { heroSequence } from "@/lib/videos";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const [index, setIndex] = useState(0);
  const [reduce, setReduce] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const current = videos.current[index];
    if (!current) return;
    current.currentTime = 0;
    const pending = current.play();
    pending?.catch(() => {});
    return () => current.pause();
  }, [index, reduce]);

  const clip = heroSequence[index] ?? heroSequence[0];

  return (
    <section
      className="relative isolate h-svh overflow-hidden bg-navy"
      aria-label="A broken sewer line, a new pipe, and the replacement"
    >
      <img src={heroSequence[0].poster} alt="" className="absolute inset-0 size-full object-cover" />
      {reduce
        ? null
        : heroSequence.map((item, i) => (
            <video
              key={item.src}
              ref={(node) => {
                videos.current[i] = node;
              }}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-300",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              src={item.src}
              poster={item.poster}
              muted
              playsInline
              preload={i === index || i === (index + 1) % heroSequence.length ? "auto" : "metadata"}
              onEnded={() => setIndex((n) => (n + 1) % heroSequence.length)}
              onError={() => setIndex((n) => (n + 1) % heroSequence.length)}
            />
          ))}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%]"
        style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, #071525 82%, transparent))" }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="shell pb-24 md:pb-14">
          <p className="mb-4 flex items-center gap-1.5" aria-label={`${clip.label}, clip ${index + 1} of ${heroSequence.length}`}>
            {heroSequence.map((item, i) => (
              <span
                key={item.src}
                className={cn("h-0.5 w-7", i === index ? "bg-cream" : "bg-cream/40")}
              />
            ))}
          </p>
          <h1 className="display max-w-3xl text-4xl text-cream sm:text-5xl lg:text-6xl">
            Professional plumbing services in Los Angeles
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/90 md:text-base">
            Rough-in through repair, 24/7. We inspect first and give a free estimate before any work begins.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/contact" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              Get a free estimate
            </Link>
            <a
              href={PHONE_HREF}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "hidden border-cream/70 bg-transparent md:inline-flex",
              )}
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
