import { createServerFn } from "@tanstack/react-start";
import { COMPANY, SITE_URL } from "@/lib/site";

export type PaymentIntentInput = {
  invoiceNumber: string;
  amount: number | string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

export type PaymentIntentResult =
  | {
      ok: true;
      mode: "stripe";
      clientSecret: string;
      paymentIntentId: string;
      publishableKey: string;
      amountCents: number;
      invoiceNumber: string;
      description: string;
    }
  | {
      ok: true;
      mode: "preview";
      publishableKey: null;
      amountCents: number;
      invoiceNumber: string;
      description: string;
      message: string;
    };

export type CheckoutSessionResult =
  | {
      ok: true;
      mode: "stripe";
      url: string;
      sessionId: string;
      amountCents: number;
      invoiceNumber: string;
    }
  | {
      ok: true;
      mode: "preview";
      url: null;
      amountCents: number;
      invoiceNumber: string;
      message: string;
    };

function clean(value: unknown, max = 160): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function normalizeInvoiceNumber(raw: unknown): string {
  const trimmed = clean(raw, 64).replace(/^#+\s*/, "");
  if (!trimmed || trimmed.length < 2) {
    throw new Error("Please enter a valid invoice number (for example, #INV-1042).");
  }
  return trimmed;
}

export function parseAmountCents(raw: unknown): number {
  const cleaned = String(raw ?? "")
    .replace(/[$,\s]/g, "")
    .trim();
  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error("Please enter a valid payment amount of at least $1.00.");
  }
  if (parsed > 100000) {
    throw new Error("For invoice payments over $100,000.00, please call the office at 818-631-7296.");
  }
  return Math.round(parsed * 100);
}

export function resolveStripeKeys(): {
  secretKey: string | null;
  publishableKey: string | null;
  configured: boolean;
} {
  const secretKey =
    process.env.STRIPE_SECRET_KEY?.trim() ||
    process.env.STRIPE_API_KEY?.trim() ||
    null;
  const publishableKey =
    process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.STRIPE_PUBLISHABLE_KEY?.trim() ||
    null;
  return {
    secretKey,
    publishableKey,
    configured: Boolean(secretKey && publishableKey),
  };
}

export async function createStripePaymentIntentServer(input: PaymentIntentInput): Promise<PaymentIntentResult> {
  const invoiceNumber = normalizeInvoiceNumber(input.invoiceNumber);
  const amountCents = parseAmountCents(input.amount);
  const customerName = clean(input.customerName, 120);
  const customerEmail = clean(input.customerEmail, 160);
  const customerPhone = clean(input.customerPhone, 40);
  const description = `${COMPANY} - Invoice #${invoiceNumber}`;

  const { secretKey, publishableKey, configured } = resolveStripeKeys();
  if (!configured || !secretKey || !publishableKey) {
    return {
      ok: true,
      mode: "preview",
      publishableKey: null,
      amountCents,
      invoiceNumber,
      description,
      message:
        "Preview mode active. Live Apple Pay, Google Pay, and Card charges activate automatically once STRIPE_SECRET_KEY and VITE_STRIPE_PUBLISHABLE_KEY (or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) are set.",
    };
  }

  const params = new URLSearchParams();
  params.set("amount", String(amountCents));
  params.set("currency", "usd");
  params.set("automatic_payment_methods[enabled]", "true");
  params.set("description", description);
  params.set("metadata[invoice_number]", invoiceNumber);
  params.set("metadata[source]", "rooter-plumber.com");
  if (customerName) params.set("metadata[customer_name]", customerName);
  if (customerEmail) {
    params.set("metadata[customer_email]", customerEmail);
    if (/^\S+@\S+\.\S+$/.test(customerEmail)) {
      params.set("receipt_email", customerEmail);
    }
  }
  if (customerPhone) params.set("metadata[customer_phone]", customerPhone);

  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const payload = (await response.json()) as {
    id?: string;
    client_secret?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.client_secret || !payload.id) {
    throw new Error(payload.error?.message || "Unable to initialize Stripe payment right now.");
  }

  return {
    ok: true,
    mode: "stripe",
    clientSecret: payload.client_secret,
    paymentIntentId: payload.id,
    publishableKey,
    amountCents,
    invoiceNumber,
    description,
  };
}

export async function createStripeCheckoutSessionServer(
  input: PaymentIntentInput & { origin?: string },
): Promise<CheckoutSessionResult> {
  const invoiceNumber = normalizeInvoiceNumber(input.invoiceNumber);
  const amountCents = parseAmountCents(input.amount);
  const customerName = clean(input.customerName, 120);
  const customerEmail = clean(input.customerEmail, 160);
  const description = `${COMPANY} - Invoice #${invoiceNumber}`;

  const { secretKey } = resolveStripeKeys();
  if (!secretKey) {
    return {
      ok: true,
      mode: "preview",
      url: null,
      amountCents,
      invoiceNumber,
      message:
        "Preview mode active. Add STRIPE_SECRET_KEY to enable live Stripe Checkout redirects.",
    };
  }

  const baseOrigin = clean(input.origin, 200) || SITE_URL;
  const amountFormatted = (amountCents / 100).toFixed(2);
  const successUrl = `${baseOrigin}/pay?payment=success&invoice=${encodeURIComponent(invoiceNumber)}&amount=${encodeURIComponent(amountFormatted)}`;
  const cancelUrl = `${baseOrigin}/pay?payment=cancelled&invoice=${encodeURIComponent(invoiceNumber)}&amount=${encodeURIComponent(amountFormatted)}`;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amountCents));
  params.set("line_items[0][price_data][product_data][name]", description);
  params.set(
    "line_items[0][price_data][product_data][description]",
    `Online invoice payment for Invoice #${invoiceNumber}`,
  );
  params.set("payment_intent_data[description]", description);
  params.set("payment_intent_data[metadata][invoice_number]", invoiceNumber);
  params.set("metadata[invoice_number]", invoiceNumber);
  if (customerName) {
    params.set("payment_intent_data[metadata][customer_name]", customerName);
    params.set("metadata[customer_name]", customerName);
  }
  if (customerEmail && /^\S+@\S+\.\S+$/.test(customerEmail)) {
    params.set("customer_email", customerEmail);
    params.set("payment_intent_data[receipt_email]", customerEmail);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const payload = (await response.json()) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.url || !payload.id) {
    throw new Error(payload.error?.message || "Unable to create Stripe Checkout session.");
  }

  return {
    ok: true,
    mode: "stripe",
    url: payload.url,
    sessionId: payload.id,
    amountCents,
    invoiceNumber,
  };
}

export const getStripePaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { publishableKey, configured } = resolveStripeKeys();
  return {
    configured,
    publishableKey,
  };
});

export const createInvoicePaymentIntent = createServerFn({ method: "POST" })
  .validator((input: unknown): PaymentIntentInput => {
    const data = (input ?? {}) as Partial<PaymentIntentInput>;
    return {
      invoiceNumber: clean(data.invoiceNumber, 64),
      amount: data.amount ?? "",
      customerName: clean(data.customerName, 120),
      customerEmail: clean(data.customerEmail, 160),
      customerPhone: clean(data.customerPhone, 40),
    };
  })
  .handler(async ({ data }) => {
    return createStripePaymentIntentServer(data);
  });

export const createInvoiceCheckoutSession = createServerFn({ method: "POST" })
  .validator((input: unknown): PaymentIntentInput & { origin?: string } => {
    const data = (input ?? {}) as Partial<PaymentIntentInput & { origin?: string }>;
    return {
      invoiceNumber: clean(data.invoiceNumber, 64),
      amount: data.amount ?? "",
      customerName: clean(data.customerName, 120),
      customerEmail: clean(data.customerEmail, 160),
      customerPhone: clean(data.customerPhone, 40),
      origin: clean(data.origin, 200),
    };
  })
  .handler(async ({ data }) => {
    return createStripeCheckoutSessionServer(data);
  });
