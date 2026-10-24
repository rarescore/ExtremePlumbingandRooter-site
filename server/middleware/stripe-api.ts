import { createHmac, timingSafeEqual } from "node:crypto";
import { defineEventHandler } from "nitro/h3";
import {
  EXTREME_PLUMBING_STRIPE_ACCOUNT_NAME,
  createStripeCheckoutSessionServer,
  createStripePaymentIntentServer,
  resolveStripeKeys,
} from "../../src/lib/payments";

function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [k, v] = part.trim().split("=");
      return [k, v];
    }),
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(v1, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

export default defineEventHandler(async (event) => {
  const rawUrl = event.req?.url ?? "";
  let pathname = rawUrl;
  try {
    pathname = new URL(rawUrl, "http://localhost").pathname;
  } catch {
    const q = rawUrl.indexOf("?");
    if (q !== -1) pathname = rawUrl.slice(0, q);
  }

  if (!pathname.startsWith("/api/stripe/")) {
    return;
  }

  const method = (event.req?.method ?? "GET").toUpperCase();

  if (pathname === "/api/stripe/config" && method === "GET") {
    const { secretKey, publishableKey, accountId, keyMode } = resolveStripeKeys();
    return new Response(
      JSON.stringify({
        ok: true,
        configured: Boolean(secretKey && publishableKey),
        publishableKey,
        accountId,
        accountName: EXTREME_PLUMBING_STRIPE_ACCOUNT_NAME,
        keyMode,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }

  if (pathname === "/api/stripe/webhook" && method === "POST") {
    try {
      const { webhookSecret, accountId } = resolveStripeKeys();
      const rawBody = event.req?.text ? await event.req.text() : "";
      const sigHeader = event.req?.headers?.get("stripe-signature") ?? "";
      if (webhookSecret) {
        const valid = verifyStripeWebhookSignature(rawBody, sigHeader, webhookSecret);
        if (!valid) {
          return new Response(
            JSON.stringify({ ok: false, error: "Invalid Stripe webhook signature." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json; charset=utf-8" },
            },
          );
        }
      }
      const parsed = rawBody ? JSON.parse(rawBody) : {};
      return new Response(
        JSON.stringify({
          ok: true,
          received: true,
          accountId,
          type: parsed?.type ?? "unknown",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook processing error.";
      return new Response(JSON.stringify({ ok: false, error: message }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
  }

  if (
    (pathname === "/api/stripe/create-payment-intent" ||
      pathname === "/api/stripe/create-checkout-session") &&
    method === "POST"
  ) {
    try {
      const bodyText = event.req?.text ? await event.req.text() : "{}";
      const body = bodyText ? JSON.parse(bodyText) : {};

      if (pathname === "/api/stripe/create-payment-intent") {
        const result = await createStripePaymentIntentServer(body);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }

      const originHeader =
        event.req?.headers?.get("origin") ||
        "https://www.rooter-plumber.com";
      const result = await createStripeCheckoutSessionServer({
        ...body,
        origin: body.origin || originHeader,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to process payment request.";
      return new Response(JSON.stringify({ ok: false, error: message }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
  }

  return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
});
