"use client";

import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <div key={pathname} className="route-progress" aria-hidden="true" />
      <div key={`${pathname}-page`} className="page-enter">
        {children}
      </div>
    </>
  );
}
