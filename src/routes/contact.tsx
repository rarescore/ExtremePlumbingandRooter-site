import { Link, createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/ContactForm";
import { InvoicePaymentForm } from "@/components/InvoicePaymentForm";
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
          "Call 818-631-7296, send a short message for a free plumbing inspection in Los Angeles, or pay your plumbing invoice online. 24/7 emergency service.",
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
              <div className="rounded-xl border border-line bg-navy px-6 py-6 text-cream">
                <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">Online Billing</p>
                <h2 className="display mt-2 text-2xl text-cream">Have an invoice to pay?</h2>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">
                  Pay your invoice online with Apple Pay, Google Pay, or any major credit or debit card.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <a href="#pay-invoice" className="text-link text-cream hover:text-brand">
                    Pay below
                  </a>
                  <Link to="/pay" className="text-link text-cream/80 hover:text-cream">
                    Open /pay page
                  </Link>
                </div>
              </div>
            </aside>
            <ContactForm />
          </div>
        </section>

        <section id="pay-invoice" className="border-t border-line py-16 md:py-24">
          <div className="shell grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-lg">
              <p className="kicker">Online Billing</p>
              <h2 className="display text-4xl text-navy md:text-5xl">Pay an existing invoice.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                If our technician has already completed your service and provided an invoice number, you can settle your
                balance right here using Apple Pay, Google Pay, or any Visa, Mastercard, American Express, or Discover
                card.
              </p>
              <div className="mt-6 rounded-xl border border-line bg-cream p-5 text-sm text-muted">
                <p className="font-semibold text-navy">What to enter:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-4">
                  <li>
                    <strong className="text-navy">Invoice Number:</strong> From the top of your written or emailed work
                    order (for example, <code className="text-navy">#INV-1042</code>).
                  </li>
                  <li>
                    <strong className="text-navy">Amount (USD):</strong> The total approved on your invoice.
                  </li>
                </ul>
              </div>
            </div>
            <InvoicePaymentForm compact />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
