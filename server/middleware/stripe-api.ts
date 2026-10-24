/**
 * Serverless API endpoints for Stripe Invoice Payments on Netlify / Nitro:
 * - GET  /api/stripe/config
 * - POST /api/stripe/create-payment-intent
 * - POST /api/stripe/create-checkout-session
 */
import {
  createStripeCheckoutSessionServer,
  createStripePaymentIntentServer,
  resolveStripeKeys,
  type PaymentIntentInput,
} from "../../src/lib/payments";

interface StripeMiddlewareEvent {
  url: URL;
  req: Request & { method: string; headers: Headers };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default async function stripeApiMiddleware(
  event: StripeMiddlewareEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const { pathname } = event.url;
  if (!pathname.startsWith("/api/stripe/")) {
    return next();
  }

  const method = (event.req.method ?? "GET").toUpperCase();

  if (pathname === "/api/stripe/config" && method === "GET") {
    const { publishableKey, configured } = resolveStripeKeys();
    return jsonResponse({ ok: true, configured, publishableKey });
  }

  if (
    (pathname === "/api/stripe/create-payment-intent" ||
      pathname === "/api/stripe/create-checkout-session") &&
    method === "POST"
  ) {
    try {
      const body = (await event.req.json()) as Partial<PaymentIntentInput & { origin?: string }>;
      if (pathname === "/api/stripe/create-payment-intent") {
        const result = await createStripePaymentIntentServer({
          invoiceNumber: String(body.invoiceNumber ?? ""),
          amount: body.amount ?? "",
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
        });
        return jsonResponse(result, 200);
      }

      const origin =
        body.origin ||
        `${event.url.protocol}//${event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host}`;
      const result = await createStripeCheckoutSessionServer({
        invoiceNumber: String(body.invoiceNumber ?? ""),
        amount: body.amount ?? "",
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        origin,
      });
      return jsonResponse(result, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment initialization failed.";
      return jsonResponse({ ok: false, error: message }, 400);
    }
  }

  return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
}
