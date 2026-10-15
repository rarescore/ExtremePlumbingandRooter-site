import { createFileRoute } from "@tanstack/react-router";
import { JobsForm } from "@/components/JobsForm";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { PHONE_DISPLAY, PHONE_HREF, EMAIL, canonical } from "@/lib/site";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
  head: () => ({
    meta: [
      { title: "Plumbers Needed | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content:
          "Extreme Plumbing & Rooter is hiring plumbers in Los Angeles. Send your name, phone, and experience. Applications go straight to the shop.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/careers") }],
  }),
});

const lookingFor = [
  "Service plumbers who diagnose before they sell a repair",
  "Drain, rooter, and sewer experience",
  "People who can work homes, businesses, and after-hours calls",
  "Able to work across Los Angeles",
];

function CareersPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Employment · Los Angeles"
          title="Plumbers needed."
          intro="We’re adding plumbers to the crew. Send a short note and we’ll call if it’s a fit."
        />
        <section className="py-14 md:py-20">
          <div className="shell grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-normal text-navy normal-case">
                Who we’re looking for
              </h2>
              <ul className="mt-4 grid gap-2 text-sm text-navy">
                {lookingFor.map((item) => (
                  <li key={item} className="border-t border-line py-3">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                You’ll work under our license. Tell us what you actually do in the field. Applications go to{" "}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-navy">
                  {EMAIL}
                </a>
                . Prefer to talk first? Call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
              </p>
            </div>
            <JobsForm />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
