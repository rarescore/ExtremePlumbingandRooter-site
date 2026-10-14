import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFound() {
  return (
    <main className="min-h-svh bg-paper">
      <div className="bg-navy">
        <SiteHeader />
      </div>
      <section className="shell py-24 text-center">
        <p className="kicker">Page not found</p>
        <h1 className="display mx-auto max-w-3xl text-5xl text-navy md:text-7xl">
          That page isn’t on the map.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          The link may be old. Head home, browse services, or call us and we’ll point you the right way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={cn(buttonVariants({ variant: "primary" }))}>
            Back home
          </Link>
          <a href={PHONE_HREF} className={cn(buttonVariants({ variant: "navy" }))}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
