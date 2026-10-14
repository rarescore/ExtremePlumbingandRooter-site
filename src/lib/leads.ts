import { createServerFn } from "@tanstack/react-start";
import { EMAIL } from "@/lib/site";

export type LeadInput = {
  kind: "service" | "estimate" | "hoa";
  name: string;
  phone: string;
  email?: string;
  details?: string;
  company?: string;
  property?: string;
  extra?: string;
  website?: string;
};

// Free FormSubmit relay (no API key). Delivers to EMAIL once the address has
// confirmed FormSubmit's one-time "Activate Form" email.
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent(EMAIL)}`;
const SITE_ORIGIN = "https://www.rooter-plumber.com";

function subjectFor(data: LeadInput) {
  return data.kind === "hoa"
    ? `HOA / property manager request from ${data.name}`
    : data.kind === "estimate"
      ? `Estimate request from ${data.name}`
      : `Service request from ${data.name}`;
}

function formSubmitBody(data: LeadInput) {
  return JSON.stringify({
    _subject: subjectFor(data),
    _template: "table",
    _captcha: "false",
    _replyto: data.email || undefined,
    name: data.name,
    phone: data.phone,
    email: data.email || "not provided",
    company: data.company || "",
    property: data.property || "",
    details: [data.extra, data.details].filter(Boolean).join("\n\n") || "None provided",
    form: data.kind,
  });
}

/** FormSubmit answers HTTP 200 even when it did not deliver; trust only `success`. */
async function readFormSubmit(response: Response) {
  let body: { success?: unknown; message?: unknown } = {};
  try {
    body = await response.json();
  } catch {
    // non-JSON (e.g. an HTML block page) means not delivered
  }
  const delivered = response.ok && (body.success === true || body.success === "true");
  return { delivered, message: typeof body.message === "string" ? body.message : "" };
}

export async function emailLeadFromBrowser(data: LeadInput) {
  try {
    const response = await fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: formSubmitBody(data),
    });
    return (await readFormSubmit(response)).delivered;
  } catch {
    return false;
  }
}

function clean(value: unknown, max = 500) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export const sendLead = createServerFn({ method: "POST" })
  .validator((input: unknown): LeadInput => {
    const data = (input ?? {}) as Partial<LeadInput>;
    const kind = data.kind === "estimate" || data.kind === "hoa" ? data.kind : "service";
    const name = clean(data.name, 120);
    const phone = clean(data.phone, 40);
    if (name.length < 2 || phone.replace(/\D/g, "").length < 10) {
      throw new Error("Name and a reachable phone number are required.");
    }
    return {
      kind,
      name,
      phone,
      email: clean(data.email, 160),
      details: clean(data.details, 2000),
      company: clean(data.company, 160),
      property: clean(data.property, 200),
      extra: clean(data.extra, 400),
      website: clean(data.website, 80),
    };
  })
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const, emailed: true as const };

    // No filesystem writes here: Vercel functions run on a read-only disk, and
    // the old `data/leads.jsonl` append threw EROFS, failing every submission.
    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: SITE_ORIGIN,
          Referer: `${SITE_ORIGIN}/contact`,
        },
        body: formSubmitBody(data),
      });
      const result = await readFormSubmit(response);
      if (!result.delivered) {
        console.warn(`[leads] FormSubmit did not deliver (${response.status}): ${result.message}`);
      }
      return { ok: true as const, emailed: result.delivered };
    } catch (error) {
      console.warn("[leads] FormSubmit request failed", error);
      return { ok: true as const, emailed: false };
    }
  });

/**
 * Deliver a lead to the shop inbox: server relay first, then the visitor's
 * browser straight to FormSubmit if the server path fails. Resolves true only
 * when FormSubmit confirms delivery.
 */
export async function deliverLead(data: LeadInput): Promise<boolean> {
  try {
    const saved = await sendLead({ data });
    if (saved.emailed) return true;
  } catch {
    // fall through to the browser relay
  }
  return emailLeadFromBrowser(data);
}
