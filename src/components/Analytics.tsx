"use client";

import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const GA_ID = "G-3T17L2W33Z";

export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const href = useRouterState({ select: (s) => s.location.href });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("config", GA_ID, { page_path: href });
  }, [pathname, href]);

  return null;
}
