import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { canonical, team } from "@/lib/site";

export const Route = createFileRoute("/our-workers")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Our Plumbing Team | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content:
          "Meet the real field team behind Extreme Plumbing & Rooter's residential, commercial, and emergency plumbing service in Los Angeles.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/our-workers") }],
  }),
});

const roles = [
  { n: "01", title: "We inspect first", copy: "We listen, examine the system carefully, and explain what we find before recommending a repair." },
  { n: "02", title: "We respect your property", copy: "Our crew arrives prepared, keeps the work area organized, and treats your home or business with care." },
  { n: "03", title: "We give clear options", copy: "You receive a straightforward, no-obligation estimate so you can choose the next step with confidence." },
];

function TeamPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="The people behind the service"
          title="Meet the Extreme Plumbing team."
          intro="These are the real people who show up, diagnose the problem, and help keep homes and businesses across Los Angeles running smoothly."
        />
        <section className="py-16 md:py-24">
          <div className="shell">
            <div className="mb-10 max-w-2xl">
              <p className="kicker">Our dedicated crew</p>
              <h2 className="display text-4xl text-navy md:text-5xl">Experience you can count on.</h2>
              <p className="mt-4 text-muted">
                Practical field experience, modern diagnostic tools, and a clean, respectful visit. No stock photos —
                just the people behind Extreme Plumbing & Rooter.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {team.map((member, index) => (
                <figure key={member.src} className="overflow-hidden rounded-lg bg-navy-mid">
                  <img
                    src={member.src}
                    alt={member.alt}
                    width={270}
                    height={384}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-top"
                  />
                  <figcaption className="flex items-center gap-3 bg-navy px-3 py-3 text-cream">
                    <span className="text-xs font-bold tracking-[0.14em] text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-semibold tracking-wide uppercase">Field crew</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-navy py-16 text-cream md:py-24">
          <div className="shell">
            <p className="kicker kicker-light">What you can expect</p>
            <h2 className="display mb-10 text-4xl">A clear, professional visit.</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {roles.map((role) => (
                <article key={role.n}>
                  <span className="text-xs font-bold tracking-[0.16em] text-brand">{role.n}</span>
                  <h3 className="mt-3 font-sans text-xl font-semibold tracking-normal text-cream normal-case">
                    {role.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{role.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <CtaBand kicker="No pressure and no obligation" title="Let our team take a look." />
      </main>
    </SiteShell>
  );
}
