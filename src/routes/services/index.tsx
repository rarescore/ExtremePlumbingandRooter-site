import { Link, createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { buttonVariants } from "@/components/ui/button";
import { canonical, services } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Los Angeles Plumbing Services | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content:
          "Drain cleaning, camera inspection, leak detection, water heaters, sewer replacement, copper repipe, hydro-jetting, boiler and high-rise plumbing across Los Angeles.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/services") }],
  }),
});

function ServicesPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Residential · Commercial · 24/7"
          title="Plumbing services built around the right diagnosis."
          intro="Tell us what is happening. We’ll inspect it, explain the options, and provide a free estimate before any work begins."
        />
        <section>
          <div className="shell">
            {services.map((service) => (
                <article key={service.slug} id={service.slug} className="grid items-start gap-6 border-t border-line py-10 last:border-b md:grid-cols-[16rem_1fr] md:gap-12">
                  <img
                    src={service.image}
                    alt={service.alt}
                    width={1400}
                    height={1050}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div>
                    <h2 className="font-sans text-2xl font-semibold tracking-normal text-navy normal-case">{service.title}</h2>
                    <p className="mt-3 max-w-2xl text-muted">{service.description}</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {service.highlights.map((item) => (
                        <li key={item} className="text-sm text-navy">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-5">
                      <Link
                        to="/services/$slug"
                        params={{ slug: service.slug }}
                        className={cn(buttonVariants({ variant: "navy" }))}
                      >
                        Service details
                      </Link>
                      <Link to="/contact" className="text-link">
                        Free estimate
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
        <CtaBand kicker="Not sure which service you need?" title="That’s what the inspection is for." />
      </main>
    </SiteShell>
  );
}
