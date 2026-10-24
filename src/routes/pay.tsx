import { Link, createFileRoute } from "@tanstack/react-router";
import { CreditCard, FileText, Phone, ShieldCheck } from "lucide-react";
import { InvoicePaymentForm } from "@/components/InvoicePaymentForm";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { EMAIL, LICENSE_NUMBER, PHONE_DISPLAY, PHONE_HREF, canonical } from "@/lib/site";

type PaySearch = {
  invoice?: string;
  amount?: string;
  payment?: string;
  redirect_status?: string;
};

export const Route = createFileRoute("/pay")({
  validateSearch: (search: Record<string, unknown>): PaySearch => ({
    invoice: typeof search.invoice === "string" ? search.invoice : undefined,
    amount: typeof search.amount === "string" ? search.amount : undefined,
    payment: typeof search.payment === "string" ? search.payment : undefined,
    redirect_status:
      typeof search.redirect_status === "string" ? search.redirect_status : undefined,
  }),
  component: PayInvoicePage,
  head: () => ({
    meta: [
      { title: "Pay Your Plumbing Invoice Online | Extreme Plumbing & Rooter | Los Angeles" },
      {
        name: "description",
        content:
          "Pay your Extreme Plumbing & Rooter invoice online with Apple Pay, Google Pay, or any major credit or debit card. Fast, secure Stripe checkout for Los Angeles homeowners, HOAs, and property managers.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/pay") }],
  }),
});

function PayInvoicePage() {
  const search = Route.useSearch();
  const initialStatus =
    search.payment === "success" || search.redirect_status === "succeeded"
      ? "success"
      : search.payment === "cancelled"
        ? "cancelled"
        : null;

  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Online Billing · Greater Los Angeles"
          title="Pay your invoice online."
          intro="Enter your invoice number and amount below to pay securely with Apple Pay, Google Pay, or any major credit or debit card."
        />

        <section className="py-16 md:py-24">
          <div className="shell grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <InvoicePaymentForm
              initialInvoice={search.invoice ?? ""}
              initialAmount={search.amount ?? ""}
              initialStatus={initialStatus}
            />

            <aside className="grid gap-6">
              <div className="rounded-xl bg-navy px-6 py-8 text-cream">
                <p className="text-xs font-bold tracking-[0.14em] text-brand uppercase">
                  How online billing works
                </p>
                <h2 className="display mt-2 text-3xl text-cream">
                  Simple, transparent, and receipted.
                </h2>
                <ul className="mt-5 grid gap-4 text-sm leading-relaxed text-cream/80">
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-cream">1. Locate your invoice #:</strong>{" "}
                      Find the invoice or work-order number (for example,{" "}
                      <code className="text-cream">#INV-1042</code>) at the top of your written or
                      emailed invoice.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CreditCard className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-cream">
                        2. Choose Apple Pay, Google Pay, or Card:
                      </strong>{" "}
                      Enter the agreed dollar amount and pay with one tap or any Visa, Mastercard,
                      American Express, or Discover card.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-cream">3. Instant confirmation:</strong>{" "}
                      Your payment is tagged directly with your invoice number so the office marks
                      your job paid right away.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-brand px-6 py-7 text-cream">
                <p className="text-xs font-bold tracking-[0.14em] uppercase">
                  Questions about your invoice?
                </p>
                <a
                  href={PHONE_HREF}
                  className="mt-2.5 flex items-center gap-2.5 font-display text-4xl md:text-5xl"
                >
                  <Phone className="size-7 shrink-0 text-cream/90" aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
                <p className="mt-2.5 text-sm text-cream/85">
                  Or email{" "}
                  <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
                    {EMAIL}
                  </a>{" "}
                  · CA License #{LICENSE_NUMBER}
                </p>
              </div>

              <div className="rounded-xl border border-line bg-cream p-6">
                <p className="kicker">Helpful links</p>
                <div className="grid gap-2.5 text-sm font-semibold text-navy">
                  <Link
                    to="/articles/$slug"
                    params={{ slug: "plumber-cost-los-angeles" }}
                    className="text-link w-fit"
                  >
                    Plumbing cost & invoice guide
                  </Link>
                  <Link to="/property-managers" className="text-link w-fit">
                    HOA & commercial billing setup
                  </Link>
                  <Link to="/faq" className="text-link w-fit">
                    Frequently asked questions
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
