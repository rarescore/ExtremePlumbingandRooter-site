import { Link, createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Extreme Plumbing & Rooter | Los Angeles Since 1997" },
      {
        name: "description",
        content:
          "Extreme Plumbing & Rooter has served homes and businesses throughout greater Los Angeles for more than 25 years. Licensed CA contractor #1086230.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/about") }],
  }),
});

const values = [
  { n: "01", title: "Diagnose before recommending", copy: "We use experience and modern tools to understand the cause before discussing solutions." },
  { n: "02", title: "Protect the property", copy: "We work carefully, keep the area orderly, and plan repairs around the building." },
  { n: "03", title: "Explain the options", copy: "You receive clear information and an estimate before work begins." },
  { n: "04", title: "Stand behind the work", copy: "Customer satisfaction and professional workmanship guide every job." },
];

function AboutPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Local experience since 1997"
          title="A family foundation. A professional standard."
          intro="More than 25 years of hands-on plumbing and construction experience, serving greater Los Angeles with care and clear communication."
        />
        <section className="py-16 md:py-24">
          <div className="shell max-w-3xl">
            <p className="kicker">Company history</p>
            <h2 className="display text-4xl text-navy md:text-5xl">Built by learning the work firsthand.</h2>
              <p className="mt-5 text-muted">
                Extreme Plumbing & Rooter was formed in 1997, when company founder Hakob was a teenager helping his
                father with plumbing and construction projects after school and during vacations.
              </p>
              <p className="mt-4 text-muted">
                Together they worked across the trades — from plumbing and concrete to home improvement and
                landscaping. That early experience created a practical understanding of how buildings work and how one
                repair can affect the rest of a property.
              </p>
              <p className="mt-4 text-muted">
                Over time, that foundation grew into a plumbing company equipped for residential repairs, commercial
                systems, high-rise properties, and advanced diagnostic work throughout Los Angeles.
              </p>
              <Link to="/our-workers" className="text-link mt-6">
                Meet our field team
              </Link>
          </div>
        </section>
        <section className="bg-navy py-16 text-cream md:py-24">
          <div className="shell">
            <div className="mb-10">
              <p className="kicker kicker-light">How we work</p>
              <h2 className="display text-4xl md:text-5xl">Standards customers can feel.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => (
                <article key={item.n} className="border-t border-cream/20 pt-5">
                  <span className="text-xs font-bold tracking-[0.16em] text-brand">{item.n}</span>
                  <h3 className="mt-3 font-sans text-lg font-semibold tracking-normal text-cream normal-case">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <CtaBand kicker="Have a plumbing concern?" title="Let’s take a look." />
      </main>
    </SiteShell>
  );
}
