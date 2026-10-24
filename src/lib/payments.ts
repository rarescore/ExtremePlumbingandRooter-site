import { createServerFn } from "@tanstack/react-start";

export const EXTREME_PLUMBING_STRIPE_ACCOUNT_ID = "acct_1P3oY0L3QsTTzrJj";
export const EXTREME_PLUMBING_STRIPE_ACCOUNT_NAME = "Extreme Plumbing & Rooter Inc";
export const EXTREME_PLUMBING_STRIPE_PUBLISHABLE_KEY =
  "pk_live_51P3oY0L3QsTTzrJjGajpEwLIohimvRIw7XiyTNCRUre8hK7GXmCgqcG58TvUZL3bLEjPxWvZwpi2dkyalmohPNDr00c11RRMwg";

export type CreateInvoicePaymentInput = {
  invoiceNumber: string;
  amount: string | number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethodChoice?: "card" | "apple_pay" | "google_pay";
};

export type StripePaymentConfigResult = {
  ok: true;
  configured: boolean;
  publishableKey: string | null;
  accountId: string;
  accountName: string;
  keyMode: "live" | "test" | "preview";
};

export type CreatePaymentIntentResult =
  | {
      ok: true;
      mode: "stripe";
      clientSecret: string;
      paymentIntentId: string;
      publishableKey: string | null;
      accountId: string;
      livemode: boolean;
      amountCents: number;
      invoiceNumber: string;
      description: string;
    }
  | {
      ok: true;
      mode: "preview";
      publishableKey: string | null;
      accountId: string;
      amountCents: number;
      invoiceNumber: string;
      description: string;
      message: string;
    };

export type CreateCheckoutSessionResult =
  | {
      ok: true;
      mode: "stripe";
      url: string;
      sessionId: string;
      accountId: string;
      amountCents: number;
      invoiceNumber: string;
    }
  | {
      ok: true;
      mode: "preview";
      accountId: string;
      amountCents: number;
      invoiceNumber: string;
      message: string;
    };

function clean(value: unknown, max = 160): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function normalizeInvoiceNumber(raw: unknown): string {
  const str = clean(raw, 64).replace(/^#+\s*/, "");
  return str;
}

export function parseDollarAmountToCents(raw: unknown): number {
  const str =
    typeof raw === "number"
      ? String(raw)
      : clean(raw, 32).replace(/[$,\s]/g, "");
  if (!str || !/^\d+(\.\d{1,2})?$/.test(str)) {
    throw new Error("Please enter a valid dollar amount (for example, 185.00).");
  }
  const amountFloat = Number(str);
  if (!Number.isFinite(amountFloat)) {
    throw new Error("Please enter a valid dollar amount.");
  }
  const cents = Math.round(amountFloat * 100);
  if (cents < 100) {
    throw new Error("Minimum online invoice payment is $1.00.");
  }
  if (cents > 5000000) {
    throw new Error("For invoices above $50,000.00, please call our office at 818-631-7296.");
  }
  return cents;
}

export function resolveStripeKeys(): {
  secretKey: string | null;
  publishableKey: string;
  accountId: string;
  webhookSecret: string | null;
  keyMode: "live" | "test" | "preview";
} {
  const secretKey =
    clean(process.env.STRIPE_SECRET_KEY, 256) ||
    clean(process.env.STRIPE_API_KEY, 256) ||
    null;
  const publishableKey =
    clean(process.env.VITE_STRIPE_PUBLISHABLE_KEY, 256) ||
    clean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, 256) ||
    clean(process.env.STRIPE_PUBLISHABLE_KEY, 256) ||
    EXTREME_PLUMBING_STRIPE_PUBLISHABLE_KEY;
  const accountId =
    clean(process.env.STRIPE_ACCOUNT_ID, 128) ||
    EXTREME_PLUMBING_STRIPE_ACCOUNT_ID;
  const webhookSecret = clean(process.env.STRIPE_WEBHOOK_SECRET, 256) || null;
  const keyMode: "live" | "test" | "preview" = !secretKey
    ? "preview"
    : secretKey.startsWith("sk_live_")
      ? "live"
      : "test";
  return { secretKey, publishableKey, accountId, webhookSecret, keyMode };
}

export async function createStripePaymentIntentServer(
  raw: CreateInvoicePaymentInput,
): Promise<CreatePaymentIntentResult> {
  const invoiceNumber = normalizeInvoiceNumber(raw?.invoiceNumber);
  if (!invoiceNumber) {
    throw new Error("Please enter your Invoice Number (for example, #INV-1042).");
  }

  const amountCents = parseDollarAmountToCents(raw?.amount);
  const customerName = clean(raw?.customerName, 120);
  const customerEmail = clean(raw?.customerEmail, 160);
  const customerPhone = clean(raw?.customerPhone, 40);
  const description = `Extreme Plumbing & Rooter - Invoice #${invoiceNumber}`;

  const { secretKey, publishableKey, accountId } = resolveStripeKeys();

  if (!secretKey) {
    return {
      ok: true,
      mode: "preview",
      publishableKey,
      accountId,
      amountCents,
      invoiceNumber,
      description,
      message:
        "Preview mode active (Stripe account Extreme Plumbing & Rooter Inc · acct_1P3oY0L3QsTTzrJj). Live Apple Pay, Google Pay, and Card charges activate automatically once STRIPE_SECRET_KEY is set.",
    };
  }

  const params = new URLSearchParams();
  params.set("amount", String(amountCents));
  params.set("currency", "usd");
  params.set("description", description);
  params.set("automatic_payment_methods[enabled]", "true");
  params.set("metadata[invoice_number]", invoiceNumber);
  params.set("metadata[stripe_account]", accountId);
  params.set("metadata[business_name]", EXTREME_PLUMBING_STRIPE_ACCOUNT_NAME);
  params.set("metadata[source]", "rooter-plumber.com/pay");
  if (customerName) params.set("metadata[customer_name]", customerName);
  if (customerEmail) {
    params.set("metadata[customer_email]", customerEmail);
    params.set("receipt_email", customerEmail);
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

  const data = (await response.json()) as {
    id?: string;
    client_secret?: string;
    livemode?: boolean;
    error?: { message?: string };
  };

  if (!response.ok || !data.client_secret || !data.id) {
    throw new Error(
      data?.error?.message ||
        "Unable to initialize Stripe payment right now. Please try again or call 818-631-7296.",
    );
  }

  return {
    ok: true,
    mode: "stripe",
    clientSecret: data.client_secret,
    paymentIntentId: data.id,
    publishableKey,
    accountId,
    livemode: Boolean(data.livemode),
    amountCents,
    invoiceNumber,
    description,
  };
}

export async function createStripeCheckoutSessionServer(
  raw: CreateInvoicePaymentInput & { origin?: string },
): Promise<CreateCheckoutSessionResult> {
  const invoiceNumber = normalizeInvoiceNumber(raw?.invoiceNumber);
  if (!invoiceNumber) {
    throw new Error("Please enter your Invoice Number (for example, #INV-1042).");
  }

  const amountCents = parseDollarAmountToCents(raw?.amount);
  const customerName = clean(raw?.customerName, 120);
  const customerEmail = clean(raw?.customerEmail, 160);
  const description = `Extreme Plumbing & Rooter - Invoice #${invoiceNumber}`;
  const origin =
    clean(raw?.origin, 200) ||
    clean(process.env.SITE_URL, 200) ||
    "https://www.rooter-plumber.com";

  const { secretKey, accountId } = resolveStripeKeys();
  if (!secretKey) {
    return {
      ok: true,
      mode: "preview",
      accountId,
      amountCents,
      invoiceNumber,
      message:
        "Preview mode active (Stripe account Extreme Plumbing & Rooter Inc · acct_1P3oY0L3QsTTzrJj). Live Stripe Checkout activates once STRIPE_SECRET_KEY is configured.",
    };
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set(
    "success_url",
    `${origin}/pay?status=success&invoice=${encodeURIComponent(invoiceNumber)}`,
  );
  params.set(
    "cancel_url",
    `${origin}/pay?status=cancelled&invoice=${encodeURIComponent(invoiceNumber)}`,
  );
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amountCents));
  params.set(
    "line_items[0][price_data][product_data][name]",
    `Invoice #${invoiceNumber}`,
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    description,
  );
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[invoice_number]", invoiceNumber);
  params.set("metadata[stripe_account]", accountId);
  params.set("payment_intent_data[description]", description);
  params.set("payment_intent_data[metadata][invoice_number]", invoiceNumber);
  params.set("payment_intent_data[metadata][stripe_account]", accountId);
  if (customerName) {
    params.set("metadata[customer_name]", customerName);
    params.set("payment_intent_data[metadata][customer_name]", customerName);
  }
  if (customerEmail) {
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

  const data = (await response.json()) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.url || !data.id) {
    throw new Error(
      data?.error?.message ||
        "Unable to start Stripe Checkout right now. Please call 818-631-7296.",
    );
  }

  return {
    ok: true,
    mode: "stripe",
    url: data.url,
    sessionId: data.id,
    accountId,
    amountCents,
    invoiceNumber,
  };
}

export const getStripePaymentConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<StripePaymentConfigResult> => {
    const { secretKey, publishableKey, accountId, keyMode } = resolveStripeKeys();
    return {
      ok: true,
      configured: Boolean(secretKey && publishableKey),
      publishableKey,
      accountId,
      accountName: EXTREME_PLUMBING_STRIPE_ACCOUNT_NAME,
      keyMode,
    };
  },
);

export const createInvoicePaymentIntent = createServerFn({ method: "POST" })
  .inputValidator((raw: CreateInvoicePaymentInput) => raw)
  .handler(async ({ data }): Promise<CreatePaymentIntentResult> => {
    return createStripePaymentIntentServer(data);
  });

export const createInvoiceCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((raw: CreateInvoicePaymentInput & { origin?: string }) => raw)
  .handler(async ({ data }): Promise<CreateCheckoutSessionResult> => {
    return createStripeCheckoutSessionServer(data);
  });
