import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF, canonical, faqs } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "Plumbing FAQ | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content:
          "Answers about free estimates, 24/7 plumbing service, camera inspections, pricing, service areas, and what to do during a plumbing emergency in Los Angeles.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/faq") }],
  }),
});

function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <SiteShell>
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <PageHero
          kicker="Straight answers"
          title="Questions before you call?"
          intro="Here are the practical details customers ask most often. If your situation is urgent or unusual, call us directly."
        />
        <section className="py-16 md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="kicker">Frequently asked</p>
              <h2 className="display text-4xl text-navy">What to expect from Extreme Plumbing.</h2>
              <p className="mt-4 text-muted">Our goal is to make the next step simple and low-pressure.</p>
              <a href={PHONE_HREF} className={cn(buttonVariants({ variant: "navy" }), "mt-6")}>
                Call {PHONE_DISPLAY}
              </a>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((item, index) => (
                <details key={item.q} className="group py-5" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
                    {item.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line text-brand group-open:bg-navy group-open:text-cream">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-prose pr-12 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <CtaBand kicker="Still unsure?" title="Show us the problem." />
      </main>
    </SiteShell>
  );
}
