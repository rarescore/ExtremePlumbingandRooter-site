"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { navLinks, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onVideo = overlay && !solid;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setSolid(window.scrollY > window.innerHeight - 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overlay]);

  return (
    <header
      className={cn(
        "z-40 overflow-x-clip",
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0 bg-navy shadow-[0_1px_0_rgba(255,255,255,0.06)]",
        onVideo && "bg-transparent",
        overlay && solid && "bg-paper/95 shadow-[0_1px_0_rgba(7,21,37,0.08)] backdrop-blur-md",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-cream focus:px-3 focus:py-2 focus:text-navy"
      >
        Skip to content
      </a>
      <div className="shell flex h-[4.5rem] items-center gap-4 md:h-[5.25rem] lg:gap-5">
        <Logo
          variant={onVideo || !overlay ? "onDark" : "onLight"}
          className={onVideo ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.72)]" : undefined}
        />
        <nav className="ml-auto hidden min-w-0 items-center gap-4 lg:flex xl:gap-5" aria-label="Primary">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "nav-item relative whitespace-nowrap text-[0.68rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-150",
                  onVideo && "text-cream [text-shadow:0_1px_2px_rgba(0,0,0,0.9)] hover:text-white",
                  onVideo && active && "text-white",
                  overlay && solid && "text-navy/75 hover:text-navy",
                  overlay && solid && active && "text-navy",
                  !overlay && "text-cream/75 hover:text-cream",
                  !overlay && active && "text-cream",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href={PHONE_HREF}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-md px-3.5 text-sm font-bold tracking-wide whitespace-nowrap transition-transform duration-150 active:translate-y-px",
              onVideo || !overlay ? "bg-cream text-navy" : "bg-navy text-cream",
            )}
          >
            <Phone className="size-4 text-brand" aria-hidden="true" />
            {PHONE_DISPLAY}
          </a>
          <Link to="/contact" className={cn(buttonVariants({ variant: "primary" }))}>
            Contact
          </Link>
        </div>
        <button
          type="button"
          className={cn(
            "ml-auto grid size-11 place-items-center lg:hidden",
            onVideo || !overlay ? "text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : "text-navy",
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-navy px-6 pt-6 pb-8 transition-[opacity,visibility] duration-200 ease-out lg:hidden",
          open ? "visible opacity-100" : "invisible pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <Logo compact />
          <button
            type="button"
            className="grid size-11 place-items-center text-cream"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="size-6" />
          </button>
        </div>
        <nav className="mt-10 grid gap-1" aria-label="Mobile">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="menu-item display py-2 text-4xl text-cream"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/contact" className="menu-item display py-2 text-4xl text-brand" onClick={() => setOpen(false)}>
            Contact
          </Link>
        </nav>
        <div className="mt-auto grid gap-3">
          <a href={PHONE_HREF} className={cn(buttonVariants({ variant: "invert", size: "lg" }), "w-full")}>
            Call {PHONE_DISPLAY}
          </a>
          <Link
            to="/contact"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
            onClick={() => setOpen(false)}
          >
            Send a message
          </Link>
        </div>
      </div>
    </header>
  );
}
