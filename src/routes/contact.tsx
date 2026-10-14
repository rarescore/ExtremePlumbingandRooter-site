import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF, canonical } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Extreme Plumbing & Rooter | Los Angeles" },
      {
        name: "description",
        content:
          "Call 818-631-7296 or send a short message for a free plumbing inspection in Los Angeles. 24/7 emergency service. No work starts without your approval.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/contact") }],
  }),
});

function ContactPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="24/7 · Greater Los Angeles"
          title="Need a plumber? Call or send a note."
          intro="A name, a phone number, and what’s going on. We’ll take it from there."
        />
        <section className="py-16 md:py-24">
          <div className="shell grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="grid gap-6">
              <div className="rounded-xl bg-brand px-6 py-8 text-cream">
                <p className="text-xs font-bold tracking-[0.14em] uppercase">Call anytime</p>
                <a href={PHONE_HREF} className="mt-3 block font-display text-4xl md:text-5xl">
                  {PHONE_DISPLAY}
                </a>
                <p className="mt-3 text-sm text-cream/80">Licensed · 24/7 · Free inspection</p>
              </div>
              <div className="rounded-xl bg-cream p-6">
                <p className="kicker">Or email</p>
                <a href={`mailto:${EMAIL}`} className="font-semibold text-navy">
                  {EMAIL}
                </a>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Emergencies: shut off the water if you can do it safely, stay clear of electrical hazards, and call.
                  We’ll confirm the visit. No work begins without your approval.
                </p>
              </div>
            </aside>
            <ContactForm />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
