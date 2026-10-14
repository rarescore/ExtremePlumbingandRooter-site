"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { deliverLead } from "@/lib/leads";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const field =
  "mt-1.5 w-full min-h-11 rounded-md border border-navy/12 bg-paper px-3 text-ink outline-none transition-[border-color,box-shadow] duration-150 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_22%,transparent)]";

export function HoaForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (String(form.get("website") || "")) {
      setStatus("success");
      return;
    }
    const phone = String(form.get("phone") || "");
    const name = String(form.get("name") || "");
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setStatus("error");
      setMessage("Add your name and a phone number the board or manager can be reached at.");
      return;
    }
    setStatus("sending");
    const payload = {
      kind: "hoa" as const,
      name,
      phone,
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      property: String(form.get("property") || ""),
      extra: `Units: ${String(form.get("units") || "not given")}`,
      details: String(form.get("details") || ""),
    };
    try {
      const mailed = await deliverLead(payload);
      if (!mailed) throw new Error("mail");
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("We couldn’t send that just now. Call the shop and we’ll set the account up by phone.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-navy px-6 py-10 text-cream" role="status">
        <h2 className="display text-4xl">Request received.</h2>
        <p className="mt-3 text-cream/75">We’ll reply to the manager on the form. For a live leak, call now.</p>
      </div>
    );
  }

  return (
    <form className="grid gap-4 rounded-xl bg-cream p-6 md:p-8" onSubmit={submit}>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Your name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        HOA or management company
        <input name="company" required className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Phone
          <input name="phone" required inputMode="tel" autoComplete="tel" className={field} />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Property
        <input name="property" required className={field} placeholder="Building name and city" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Units
        <input name="units" className={field} placeholder="Optional" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        What do you need?
        <textarea name="details" rows={4} className={`${field} min-h-28 py-2`} />
      </label>
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request a manager account"}
      </Button>
      {status === "error" ? (
        <p className="text-sm text-brand" role="alert">
          {message}
        </p>
      ) : null}
      <p className="text-xs text-muted">
        Or call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>. Submissions email extreme.plumbing@yahoo.com.
      </p>
    </form>
  );
}
