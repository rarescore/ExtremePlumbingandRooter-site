import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF, areas, canonical } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/service-areas")({
  component: AreasPage,
  head: () => ({
    meta: [
      { title: "Los Angeles Service Areas | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content:
          "Extreme Plumbing & Rooter serves Los Angeles, the San Fernando Valley, and surrounding communities 24/7 — Van Nuys, Sherman Oaks, Glendale, Pasadena, and more.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/service-areas") }],
  }),
});

function AreasPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Greater Los Angeles"
          title="Local plumbing service across LA."
          intro="From the Valley to the Westside and surrounding communities, our team serves homes, businesses, and high-rise properties 24 hours a day."
        />
        <section className="py-16 md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="kicker">Communities we serve</p>
              <h2 className="display text-4xl text-navy md:text-5xl">One call for plumbing help throughout the region.</h2>
              <p className="mt-4 text-muted">
                Our primary service area includes the communities below and nearby Los Angeles neighborhoods. If you do
                not see your city listed, call us — there is a good chance we can still help.
              </p>
              <a href={PHONE_HREF} className={cn(buttonVariants({ variant: "navy" }), "mt-6")}>
                Check availability · {PHONE_DISPLAY}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2">
              {areas.map((area, index) => (
                <div key={area} className="flex items-center gap-3 bg-cream px-4 py-4">
                  <span className="text-xs font-bold tracking-[0.12em] text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="font-semibold">{area}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CtaBand kicker="Schedule a visit" title="Free estimate. No pressure." />
      </main>
    </SiteShell>
  );
}
