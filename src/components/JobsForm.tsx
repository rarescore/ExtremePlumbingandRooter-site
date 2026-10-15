"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { deliverLead } from "@/lib/leads";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const field =
  "mt-1.5 w-full min-h-11 rounded-md border border-navy/12 bg-paper px-3 text-ink outline-none transition-[border-color,box-shadow] duration-150 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_22%,transparent)]";

export function JobsForm() {
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
      setMessage("Add your name and a phone number we can call.");
      return;
    }
    setStatus("sending");
    const experience = String(form.get("experience") || "").trim();
    const companies = String(form.get("companies") || "").trim();
    try {
      const mailed = await deliverLead({
        kind: "job",
        name,
        phone,
        email: String(form.get("email") || ""),
        company: companies,
        property: String(form.get("area") || ""),
        extra: `Experience: ${experience || "not given"}.`,
        details: String(form.get("details") || ""),
      });
      if (!mailed) throw new Error("mail");
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("That didn’t send. Call the shop and ask for hiring.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-navy px-6 py-10 text-cream" role="status">
        <p className="kicker kicker-light">Application sent</p>
        <h2 className="display text-4xl">We’ll look it over.</h2>
        <p className="mt-3 max-w-md text-cream/75">
          Your note is on its way to the shop. If it looks like a fit, we’ll call.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4 rounded-xl border-t-4 border-brand bg-cream p-6 shadow-card md:p-8" onSubmit={submit}>
      <div>
        <p className="kicker">Apply</p>
        <h2 className="display text-3xl text-navy md:text-4xl">Tell us about your work.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Name and phone are required. The rest helps us call the right people back.
        </p>
      </div>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Name
        <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Phone
          <input name="phone" required inputMode="tel" autoComplete="tel" className={field} placeholder="(818) 555-0123" />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Email
          <input name="email" type="email" autoComplete="email" className={field} placeholder="Optional" />
        </label>
      </div>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Years in the trade
        <input name="experience" className={field} placeholder="Example: 6" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Companies you’ve worked for
        <input name="companies" className={field} placeholder="Optional" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        Where you can work
        <input name="area" className={field} placeholder="Van Nuys, the Valley, all of LA…" />
      </label>
      <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
        What you do
        <textarea
          name="details"
          rows={4}
          className={`${field} min-h-28 py-2`}
          placeholder="Service, drains, sewer, water heaters — and whether you want full-time or on-call."
        />
      </label>
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send application"}
      </Button>
      {status === "error" ? (
        <p className="text-sm text-brand" role="alert">
          {message}
        </p>
      ) : null}
      <p className="text-xs text-muted">
        Applications email the shop. Questions first? Call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
      </p>
    </form>
  );
}
