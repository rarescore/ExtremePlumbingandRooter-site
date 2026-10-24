"use client";

import { CheckCircle2, CreditCard, Lock, Receipt, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  createInvoiceCheckoutSession,
  createInvoicePaymentIntent,
  EXTREME_PLUMBING_STRIPE_PUBLISHABLE_KEY,
  getStripePaymentConfig,
} from "@/lib/payments";
import { COMPANY, LICENSE_NUMBER, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

type StripeInstance = {
  elements: (options: Record<string, unknown>) => StripeElementsInstance;
  confirmPayment: (options: {
    elements: StripeElementsInstance;
    confirmParams: { return_url: string; receipt_email?: string };
  }) => Promise<{ error?: { message?: string } }>;
};

type StripeElementsInstance = {
  create: (
    type: "payment" | "expressCheckout",
    options?: Record<string, unknown>,
  ) => {
    mount: (selectorOrEl: string | HTMLElement) => void;
    unmount: () => void;
    on?: (event: string, handler: (ev: any) => void) => void;
  };
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

let stripeScriptPromise: Promise<void> | null = null;

function loadStripeJs(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Stripe) return Promise.resolve();
  if (stripeScriptPromise) return stripeScriptPromise;

  stripeScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.stripe.com/v3/"]',
    );
    if (existing) {
      if (window.Stripe) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Stripe.js")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Stripe.js"));
    document.head.appendChild(script);
  });

  return stripeScriptPromise;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }
  return digits;
}

function parseUsdAmount(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, "").trim();
  if (!cleaned) return null;
  const num = Number.parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 1 || num > 100000) return null;
  return Math.round(num * 100) / 100;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

export function InvoicePaymentForm({
  kicker = "Online Invoice Payment",
  title = "Pay your plumbing invoice.",
  intro = "Enter the invoice number from your work order and the amount due. Pay securely with Apple Pay, Google Pay, or any major credit or debit card.",
  compact = false,
  initialInvoice = "",
  initialAmount = "",
  initialStatus = null,
}: {
  kicker?: string;
  title?: string;
  intro?: string;
  compact?: boolean;
  initialInvoice?: string;
  initialAmount?: string;
  initialStatus?: "success" | "cancelled" | null;
}) {
  const formId = useId();
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoice);
  const [amountInput, setAmountInput] = useState(initialAmount);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Card inputs for preview / instant card UI before live intent initializes
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardZip, setCardZip] = useState("");

  // Stripe live mode vs preview mode state
  const clientEnvKey =
    (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
    (import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
    EXTREME_PLUMBING_STRIPE_PUBLISHABLE_KEY;

  const [stripeConfigured, setStripeConfigured] = useState<boolean>(false);
  const [publishableKey, setPublishableKey] = useState<string | null>(clientEnvKey);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [stripeElementsReady, setStripeElementsReady] = useState(false);
  const [expressWalletAvailable, setExpressWalletAvailable] = useState(false);

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">(
    initialStatus === "success" ? "success" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState(
    initialStatus === "cancelled"
      ? "Checkout was canceled. Your card was not charged — you can try again below."
      : "",
  );
  const [receipt, setReceipt] = useState<{
    invoiceNumber: string;
    amountFormatted: string;
    methodLabel: string;
    referenceId: string;
    isPreview: boolean;
  } | null>(
    initialStatus === "success"
      ? {
          invoiceNumber: initialInvoice || "INV-PAID",
          amountFormatted: parseUsdAmount(initialAmount)
            ? formatCurrency(parseUsdAmount(initialAmount)!)
            : "$—",
          methodLabel: "Stripe Checkout",
          referenceId: `EPR-${Date.now().toString().slice(-6)}`,
          isPreview: false,
        }
      : null,
  );

  const stripeRef = useRef<StripeInstance | null>(null);
  const elementsRef = useRef<StripeElementsInstance | null>(null);
  const paymentMountRef = useRef<HTMLDivElement | null>(null);
  const expressMountRef = useRef<HTMLDivElement | null>(null);
  const lastIntentKeyRef = useRef<string>("");

  useEffect(() => {
    let active = true;
    fetch("/api/stripe/config")
      .then((res) => (res.ok ? res.json() : getStripePaymentConfig()))
      .catch(() => getStripePaymentConfig())
      .then((cfg) => {
        if (!active || !cfg) return;
        if (cfg.configured && cfg.publishableKey) {
          setStripeConfigured(true);
          setPublishableKey(cfg.publishableKey);
          loadStripeJs().catch(() => null);
        }
      })
      .catch(() => {
        // Stay in preview mode if server check fails
      });
    return () => {
      active = false;
    };
  }, []);

  const parsedAmount = parseUsdAmount(amountInput);
  const cleanInvoiceValue = invoiceNumber.replace(/^#+\s*/, "").trim();

  // Automatically create a live Stripe PaymentIntent when invoiceNumber & amount are valid
  useEffect(() => {
    if (!stripeConfigured || !publishableKey) return;
    if (cleanInvoiceValue.length < 2 || !parsedAmount || parsedAmount < 1) return;

    const intentKey = `${cleanInvoiceValue}::${Math.round(parsedAmount * 100)}`;
    if (lastIntentKeyRef.current === intentKey && clientSecret) return;

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceNumber: cleanInvoiceValue,
            amount: parsedAmount,
            customerName,
            customerEmail,
          }),
        });
        const data = await res.json();
        if (res.ok && data?.mode === "stripe" && data.clientSecret) {
          lastIntentKeyRef.current = intentKey;
          setStripeElementsReady(false);
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId || null);
          if (data.publishableKey) setPublishableKey(data.publishableKey);
        }
      } catch {
        // Fall back to on-demand creation on submit/button click
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [stripeConfigured, publishableKey, cleanInvoiceValue, parsedAmount, customerName, customerEmail, clientSecret]);

  // Mount Stripe PaymentElement + ExpressCheckoutElement when a live clientSecret is created
  useEffect(() => {
    if (!stripeConfigured || !publishableKey || !clientSecret) return;
    let cancelled = false;

    loadStripeJs()
      .then(() => {
        if (cancelled || !window.Stripe) return;
        const stripe = window.Stripe(publishableKey);
        stripeRef.current = stripe;

        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#dc2239",
              colorBackground: "#faf8f3",
              colorText: "#071525",
              colorDanger: "#dc2239",
              fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif",
              borderRadius: "6px",
            },
          },
        });
        elementsRef.current = elements;

        if (expressMountRef.current) {
          expressMountRef.current.innerHTML = "";
          const expressEl = elements.create("expressCheckout", {
            buttonType: { applePay: "check-out", googlePay: "pay" },
          });
          expressEl.mount(expressMountRef.current);
          expressEl.on?.("ready", (ev: { availablePaymentMethods?: Record<string, boolean> }) => {
            if (cancelled) return;
            const available = Boolean(
              ev?.availablePaymentMethods &&
                Object.values(ev.availablePaymentMethods).some(Boolean),
            );
            setExpressWalletAvailable(available);
          });
          expressEl.on?.("confirm", async () => {
            const returnUrl = `${window.location.origin}/pay?payment=success&invoice=${encodeURIComponent(
              invoiceNumber.replace(/^#+\s*/, "").trim(),
            )}&amount=${encodeURIComponent(amountInput.trim())}`;
            const { error } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: returnUrl,
                ...(customerEmail.trim() ? { receipt_email: customerEmail.trim() } : {}),
              },
            });
            if (error?.message) {
              setStatus("error");
              setErrorMessage(error.message);
            }
          });
        }

        if (paymentMountRef.current) {
          paymentMountRef.current.innerHTML = "";
          const paymentEl = elements.create("payment", { layout: "tabs" });
          paymentEl.mount(paymentMountRef.current);
          paymentEl.on?.("ready", () => {
            if (!cancelled) setStripeElementsReady(true);
          });
        }

        setStripeElementsReady(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Could not load Stripe Elements.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [stripeConfigured, publishableKey, clientSecret]);

  const formattedButtonAmount = parsedAmount ? ` ${formatCurrency(parsedAmount)}` : "";

  function validateBaseFields(): { cleanInvoice: string; validAmount: number } | null {
    const cleanInvoice = invoiceNumber.replace(/^#+\s*/, "").trim();
    if (cleanInvoice.length < 2) {
      setStatus("error");
      setErrorMessage("Please enter your invoice number (for example, #INV-1042).");
      return null;
    }
    const validAmount = parseUsdAmount(amountInput);
    if (!validAmount) {
      setStatus("error");
      setErrorMessage("Please enter a valid payment amount of at least $1.00.");
      return null;
    }
    return { cleanInvoice, validAmount };
  }

  function validatePreviewCardFields(): boolean {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      setStatus("error");
      setErrorMessage("Please enter a valid 15- or 16-digit card number.");
      return false;
    }
    const expDigits = cardExpiry.replace(/\D/g, "");
    if (expDigits.length !== 4) {
      setStatus("error");
      setErrorMessage("Please enter your card expiration date in MM / YY format.");
      return false;
    }
    const month = Number.parseInt(expDigits.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      setStatus("error");
      setErrorMessage("Expiration month must be between 01 and 12.");
      return false;
    }
    const cvcDigits = cardCvc.replace(/\D/g, "");
    if (cvcDigits.length < 3 || cvcDigits.length > 4) {
      setStatus("error");
      setErrorMessage("Please enter the 3- or 4-digit security code (CVC) on your card.");
      return false;
    }
    const zipDigits = cardZip.replace(/\D/g, "");
    if (zipDigits.length < 5) {
      setStatus("error");
      setErrorMessage("Please enter a 5-digit billing ZIP code.");
      return false;
    }
    return true;
  }

  async function handleWalletClick(walletName: "Apple Pay" | "Google Pay") {
    setErrorMessage("");
    const base = validateBaseFields();
    if (!base) return;

    setStatus("processing");
    try {
      if (stripeConfigured) {
        if (!clientSecret) {
          const intent = await createInvoicePaymentIntent({
            data: {
              invoiceNumber: base.cleanInvoice,
              amount: base.validAmount,
              customerName,
              customerEmail,
            },
          });
          if (intent.mode === "stripe") {
            lastIntentKeyRef.current = `${base.cleanInvoice}::${Math.round(base.validAmount * 100)}`;
            setClientSecret(intent.clientSecret);
            setPaymentIntentId(intent.paymentIntentId);
            setPublishableKey(intent.publishableKey);
            setStatus("idle");
            return;
          }
        } else {
          // If ExpressCheckoutElement is mounted but browser wallet wasn't triggered directly, open Hosted Checkout with Apple Pay / Google Pay enabled
          await handleHostedCheckout();
          return;
        }
      }

      // Preview mode wallet authorization simulation
      await new Promise((resolve) => setTimeout(resolve, 450));
      setReceipt({
        invoiceNumber: `#${base.cleanInvoice}`,
        amountFormatted: formatCurrency(base.validAmount),
        methodLabel: walletName,
        referenceId: `PREVIEW-${base.cleanInvoice.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        isPreview: true,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Could not start wallet checkout. Please try again.",
      );
    }
  }

  async function handleHostedCheckout() {
    setErrorMessage("");
    const base = validateBaseFields();
    if (!base) return;

    setStatus("processing");
    try {
      const session = await createInvoiceCheckoutSession({
        data: {
          invoiceNumber: base.cleanInvoice,
          amount: base.validAmount,
          customerName,
          customerEmail,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (session.mode === "stripe") {
        window.location.href = session.url;
        return;
      }
      setStatus("error");
      setErrorMessage(session.message);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to open Stripe Checkout right now.",
      );
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    const base = validateBaseFields();
    if (!base) return;

    // Live Stripe mode with mounted Elements
    if (stripeConfigured && clientSecret && stripeRef.current && elementsRef.current) {
      setStatus("processing");
      const returnUrl = `${window.location.origin}/pay?payment=success&invoice=${encodeURIComponent(
        base.cleanInvoice,
      )}&amount=${encodeURIComponent(base.validAmount.toFixed(2))}`;
      const { error } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        confirmParams: {
          return_url: returnUrl,
          ...(customerEmail.trim() ? { receipt_email: customerEmail.trim() } : {}),
        },
      });
      if (error?.message) {
        setStatus("error");
        setErrorMessage(error.message);
      }
      return;
    }

    // Live Stripe mode — first step creates the PaymentIntent and mounts Stripe Elements
    if (stripeConfigured && !clientSecret) {
      setStatus("processing");
      try {
        const result = await createInvoicePaymentIntent({
          data: {
            invoiceNumber: base.cleanInvoice,
            amount: base.validAmount,
            customerName,
            customerEmail,
          },
        });
        if (result.mode === "stripe") {
          lastIntentKeyRef.current = `${base.cleanInvoice}::${Math.round(base.validAmount * 100)}`;
          setClientSecret(result.clientSecret);
          setPaymentIntentId(result.paymentIntentId);
          setPublishableKey(result.publishableKey);
          setStatus("idle");
          return;
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Could not initialize Stripe payment.",
        );
        return;
      }
    }

    // Preview mode — validate card inputs and show interactive confirmation receipt
    if (!validatePreviewCardFields()) return;

    setStatus("processing");
    try {
      await createInvoicePaymentIntent({
        data: {
          invoiceNumber: base.cleanInvoice,
          amount: base.validAmount,
          customerName,
          customerEmail,
        },
      }).catch(() => null);

      const digits = cardNumber.replace(/\D/g, "");
      const last4 = digits.slice(-4);
      const brand = detectCardBrand(digits);

      setReceipt({
        invoiceNumber: `#${base.cleanInvoice}`,
        amountFormatted: formatCurrency(base.validAmount),
        methodLabel: `${brand} ending in •••• ${last4}`,
        referenceId: `PREVIEW-${base.cleanInvoice.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        isPreview: true,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Could not process payment preview. Please call us at " + PHONE_DISPLAY + ".");
    }
  }

  const field =
    "mt-1.5 w-full min-h-11 rounded-md border border-navy/15 bg-paper px-3 text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_22%,transparent)]";

  if (status === "success" && receipt) {
    return (
      <div
        className="rounded-xl border-t-4 border-brand bg-navy px-6 py-8 text-cream shadow-card md:p-10"
        role="status"
        data-testid="payment-receipt"
      >
        <div className="flex items-center gap-2.5 text-brand">
          <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
          <p className="text-xs font-bold tracking-[0.16em] uppercase">
            {receipt.isPreview ? "Payment Preview Confirmed" : "Payment Confirmed"}
          </p>
        </div>
        <h2 className="display mt-2 text-3xl text-cream md:text-4xl">
          Thank you — Invoice {receipt.invoiceNumber}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/75">
          {receipt.isPreview
            ? "This interactive preview verified your invoice details and payment flow. No live charge was made because Stripe keys are not yet attached."
            : `Your payment to ${COMPANY} has been received and applied to invoice ${receipt.invoiceNumber}.`}
        </p>

        <dl className="mt-6 grid gap-3 rounded-lg border border-cream/15 bg-navy-mid/90 p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-[0.1em] text-cream/55 uppercase">
              Invoice Number
            </dt>
            <dd className="mt-1 font-semibold text-cream">{receipt.invoiceNumber}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.1em] text-cream/55 uppercase">
              Amount
            </dt>
            <dd className="mt-1 font-display text-2xl text-cream">{receipt.amountFormatted}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.1em] text-cream/55 uppercase">
              Payment Method
            </dt>
            <dd className="mt-1 font-medium text-cream">{receipt.methodLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.1em] text-cream/55 uppercase">
              Reference
            </dt>
            <dd className="mt-1 font-mono text-xs text-cream/85">{receipt.referenceId}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="invert"
            onClick={() => {
              setStatus("idle");
              setReceipt(null);
              setErrorMessage("");
            }}
          >
            Pay another invoice
          </Button>
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-11 items-center px-3 text-sm font-bold tracking-wide text-cream/85 hover:text-cream"
          >
            Questions? Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      id={`invoice-payment-${formId}`}
      className={cn(
        "rounded-xl border-t-4 border-brand bg-cream shadow-card",
        compact ? "p-5 sm:p-6" : "p-6 md:p-8",
      )}
      onSubmit={handleSubmit}
      noValidate
      data-stripe-configured={stripeConfigured ? "true" : "false"}
      data-payment-intent-id={paymentIntentId ?? undefined}
    >
      <div className={compact ? "mb-5" : "mb-6"}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="kicker !mb-0">{kicker}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/12 bg-paper px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.08em] text-navy uppercase">
            <Lock className="size-3 text-brand" aria-hidden="true" />
            Stripe Secure
          </span>
        </div>
        <h2
          className={cn(
            "display mt-2 text-navy",
            compact ? "text-3xl sm:text-4xl" : "text-3xl md:text-4xl",
          )}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{intro}</p>
      </div>

      {/* Step 1: Invoice Number & Amount */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          <span>
            Invoice Number <span className="text-brand">*</span>
          </span>
          <div className="relative mt-1.5">
            <Receipt
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              name="invoiceNumber"
              className={cn(field, "mt-0 pl-9 font-medium")}
              required
              autoComplete="off"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="#INV-1042"
              aria-label="Invoice Number"
            />
          </div>
        </label>

        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          <span>
            Amount (USD) <span className="text-brand">*</span>
          </span>
          <div className="relative mt-1.5">
            <span
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-sans text-sm font-bold text-navy"
              aria-hidden="true"
            >
              $
            </span>
            <input
              name="amount"
              className={cn(field, "mt-0 pr-14 pl-8 font-medium tabular-nums")}
              required
              inputMode="decimal"
              autoComplete="off"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.]/g, ""))}
              onBlur={() => {
                const parsed = parseUsdAmount(amountInput);
                if (parsed !== null) {
                  setAmountInput(parsed.toFixed(2));
                }
              }}
              placeholder="245.00"
              aria-label="Payment Amount in US Dollars"
            />
            <span
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[0.68rem] font-bold tracking-[0.08em] text-muted uppercase"
              aria-hidden="true"
            >
              USD
            </span>
          </div>
        </label>

        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Customer Name (Optional)
          <input
            name="customerName"
            className={field}
            autoComplete="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your name or property"
          />
        </label>

        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Email for Receipt (Optional)
          <input
            name="customerEmail"
            type="email"
            className={field}
            autoComplete="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
      </div>

      {/* Step 2: Express Wallets (Apple Pay & Google Pay) */}
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold tracking-[0.12em] text-navy uppercase">
            Express Checkout
          </p>
          <span className="text-xs text-muted">Instant wallet payment</span>
        </div>

        {stripeConfigured && clientSecret && (
          <div
            ref={expressMountRef}
            data-testid="stripe-express-checkout-element"
            className={cn(expressWalletAvailable ? "mt-3 min-h-11" : "mt-2")}
          />
        )}

        {(!stripeConfigured || !clientSecret || !expressWalletAvailable) && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleWalletClick("Apple Pay")}
              disabled={status === "processing"}
              aria-label="Pay with Apple Pay"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-black px-4 text-white transition-[transform,opacity] duration-150 hover:opacity-90 active:translate-y-px disabled:opacity-50"
            >
              <svg
                className="size-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
              </svg>
              <span className="font-sans text-base font-semibold tracking-tight">Apple Pay</span>
            </button>

            <button
              type="button"
              onClick={() => handleWalletClick("Google Pay")}
              disabled={status === "processing"}
              aria-label="Pay with Google Pay"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-navy/20 bg-navy px-4 text-white transition-[transform,background-color] duration-150 hover:bg-navy-mid active:translate-y-px disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span className="font-sans text-base font-semibold tracking-tight">Google Pay</span>
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="w-full border-t border-line" />
        <span className="bg-cream px-3 text-[0.68rem] font-bold tracking-[0.14em] text-muted uppercase">
          Or pay with card
        </span>
        <div className="w-full border-t border-line" />
      </div>

      {/* Step 3: Card Details / Live Stripe Payment Element */}
      {stripeConfigured && clientSecret ? (
        <div
          className="rounded-lg border border-navy/15 bg-paper p-4"
          data-testid="stripe-payment-element"
        >
          <div ref={paymentMountRef} className="min-h-36" />
          {!stripeElementsReady && (
            <p className="text-xs text-muted">Loading secure Stripe payment fields…</p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-navy/12 bg-paper/70 p-4 sm:p-5">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-navy uppercase">
              <CreditCard className="size-4 text-brand" aria-hidden="true" />
              Credit or Debit Card
            </span>
            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold tracking-wider text-navy/70 uppercase">
              <span className="rounded border border-navy/15 bg-cream px-1.5 py-0.5">Visa</span>
              <span className="rounded border border-navy/15 bg-cream px-1.5 py-0.5">MC</span>
              <span className="rounded border border-navy/15 bg-cream px-1.5 py-0.5">Amex</span>
              <span className="rounded border border-navy/15 bg-cream px-1.5 py-0.5">Discover</span>
            </div>
          </div>

          <div className="grid gap-3.5">
            <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
              Card Number
              <input
                name="cardNumber"
                className={cn(field, "bg-cream font-mono text-sm tracking-wide")}
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                aria-label="Card Number"
              />
            </label>

            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
                Expiration
                <input
                  name="cardExpiry"
                  className={cn(field, "bg-cream font-mono text-sm")}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM / YY"
                  aria-label="Expiration Date MM / YY"
                />
              </label>

              <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
                CVC
                <input
                  name="cardCvc"
                  className={cn(field, "bg-cream font-mono text-sm")}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  aria-label="Security Code CVC"
                />
              </label>

              <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
                Billing ZIP
                <input
                  name="cardZip"
                  className={cn(field, "bg-cream font-mono text-sm")}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={cardZip}
                  onChange={(e) => setCardZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="91409"
                  aria-label="Billing ZIP Code"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <p
          className="mt-4 rounded-md border border-brand/30 bg-brand/8 px-3.5 py-2.5 text-sm font-medium text-brand"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-5 grid gap-2.5">
        <Button
          type="submit"
          size="lg"
          className="w-full text-xs"
          disabled={status === "processing"}
        >
          {status === "processing"
            ? "Processing secure payment…"
            : `Pay${formattedButtonAmount} Invoice Now`}
        </Button>

        {stripeConfigured && (
          <button
            type="button"
            onClick={handleHostedCheckout}
            disabled={status === "processing"}
            className="text-center text-xs font-semibold text-navy/75 underline underline-offset-4 hover:text-brand"
          >
            Prefer Stripe Hosted Checkout? Open full-page checkout →
          </button>
        )}
      </div>

      {!stripeConfigured && (
        <div
          className="mt-4 flex items-start gap-2.5 rounded-lg border border-navy/12 bg-paper px-3.5 py-3 text-xs leading-relaxed text-muted"
          data-testid="stripe-preview-notice"
        >
          <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          <p>
            <strong className="font-semibold text-navy">Preview mode active:</strong> Apple Pay,
            Google Pay, and card fields are ready to test right now. Live Stripe charges activate
            automatically as soon as <code className="font-mono text-navy">STRIPE_SECRET_KEY</code>{" "}
            and <code className="font-mono text-navy">VITE_STRIPE_PUBLISHABLE_KEY</code> are added.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-brand" aria-hidden="true" />
          CA Contractor License #{LICENSE_NUMBER}
        </span>
        <span>
          Need billing help? Call{" "}
          <a href={PHONE_HREF} className="font-semibold text-navy hover:text-brand">
            {PHONE_DISPLAY}
          </a>
        </span>
      </div>
    </form>
  );
}
