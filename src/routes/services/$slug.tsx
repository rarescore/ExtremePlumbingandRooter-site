import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF, canonical, getService, services } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const service = loaderData?.service;
    return {
      meta: [
        { title: `${service?.title ?? "Service"} in Los Angeles | Extreme Plumbing` },
        { name: "description", content: service?.description ?? "" },
      ],
      links: service ? [{ rel: "canonical", href: canonical(`/services/${service.slug}`) }] : [],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const extraImage = service.slug === "camera-inspection" ? "/media/camera-pipe.jpg" : undefined;

  return (
    <SiteShell>
      <main id="main">
        <PageHero kicker="Free on-site estimate" title={service.title} intro={service.short} />
        <section className="py-16 md:py-24">
          <div className="shell grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="grid gap-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <img
                  src={service.image}
                  alt={service.alt}
                  width={1400}
                  height={875}
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
              {extraImage ? (
                <img
                  src={extraImage}
                  alt="Live sewer camera view of tree roots inside a pipe"
                  width={1400}
                  height={1050}
                  loading="lazy"
                  className="w-full rounded-lg object-cover outline outline-1 -outline-offset-1 outline-ink/10"
                />
              ) : null}
            </div>
            <div>
              <p className="kicker">What to expect</p>
              <h2 className="display text-4xl text-navy md:text-5xl">Start with a careful inspection.</h2>
              <p className="mt-4 text-muted">{service.description}</p>
              <p className="mt-4 text-muted">{service.process}</p>
              <h3 className="mt-8 font-sans text-sm font-semibold tracking-[0.14em] text-navy uppercase">
                Common signs
              </h3>
              <ul className="mt-3 grid gap-2">
                {service.signs.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {service.highlights.map((item) => (
                  <li key={item} className="relative pl-4 text-sm font-semibold text-navy before:absolute before:top-1.5 before:left-0 before:size-1.5 before:bg-brand">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact" className={cn(buttonVariants({ variant: "primary" }))}>
                  Send a message
                </Link>
                <a href={PHONE_HREF} className={cn(buttonVariants({ variant: "navy" }))}>
                  Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-line bg-cream py-16">
          <div className="shell">
            <p className="kicker">Related services</p>
            <h2 className="display mb-8 text-3xl text-navy">Other work we handle</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/services/$slug"
                  params={{ slug: item.slug }}
                  className="overflow-hidden rounded-lg bg-paper shadow-card"
                >
                  <img src={item.image} alt={item.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="p-4">
                    <h3 className="font-sans text-base font-semibold tracking-normal text-navy normal-case">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.short}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CtaBand />
      </main>
    </SiteShell>
  );
}
