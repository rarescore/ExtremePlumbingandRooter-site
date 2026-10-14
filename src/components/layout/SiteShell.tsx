import type { ReactNode } from "react";
import { PageFrame } from "@/components/PageFrame";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export function SiteShell({
  children,
  overlayHeader = false,
}: {
  children: ReactNode;
  overlayHeader?: boolean;
}) {
  return (
    <div className="min-h-svh bg-paper pb-20 md:pb-0">
      <SiteHeader overlay={overlayHeader} />
      <PageFrame>{children}</PageFrame>
      <SiteFooter />
      <a
        href={PHONE_HREF}
        className="fixed inset-x-0 bottom-0 z-30 bg-brand px-4 py-3.5 text-center text-sm font-bold tracking-wide text-cream transition-[filter] duration-150 active:brightness-95 md:hidden"
      >
        Call {PHONE_DISPLAY}
      </a>
    </div>
  );
}
