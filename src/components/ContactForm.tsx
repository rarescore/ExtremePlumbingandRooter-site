"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { deliverLead } from "@/lib/leads";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

type Fields = {
  name: string;
  phone: string;
  details: string;
  website: string;
};

const empty: Fields = { name: "", phone: "", details: "", website: "" };

function valid(input: Fields) {
  return input.name.trim().length >= 2 && input.phone.replace(/\D/g, "").length >= 10;
}

export function ContactForm({
  kicker = "Contact",
  title = "Tell us what’s happening.",
  intro = "Name, phone, and a short note. We’ll call back. No work starts without your approval.",
  submitLabel = "Send message",
  compact = false,
}: {
  kicker?: string;
  title?: string;
  intro?: string;
  submitLabel?: string;
  compact?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<Fields>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.website) {
      setStatus("success");
      return;
    }
    if (!valid(form)) {
      setStatus("error");
      setMessage("Please add your name and a phone number we can reach.");
      return;
    }
    setStatus("sending");
    try {
      const mailed = await deliverLead({
        kind: "service",
        name: form.name,
        phone: form.phone,
        details: form.details,
      });
      if (!mailed) throw new Error("mail");
      setStatus("success");
      setMessage("Your note is on its way to the shop. Call if you need someone there today.");
      setForm(empty);
    } catch {
      setStatus("error");
      setMessage("That didn’t send. Call us and we’ll take it from the phone.");
    }
  }

  const field =
    "mt-1.5 w-full min-h-11 rounded-md border border-navy/12 bg-paper px-3 text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_22%,transparent)]";

  if (!mounted) {
    return <div className={cn("rounded-xl bg-cream", compact ? "min-h-72" : "min-h-80")} aria-hidden="true" />;
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-navy px-6 py-10 text-cream" role="status">
        <p className="kicker kicker-light">Got it</p>
        <h2 className="display text-4xl">We’ll be in touch.</h2>
        <p className="mt-4 max-w-md text-cream/70">{message}</p>
        <a href={PHONE_HREF} className="mt-6 inline-flex min-h-11 items-center text-sm font-bold tracking-wide">
          Prefer to talk now? {PHONE_DISPLAY}
        </a>
      </div>
    );
  }

  return (
    <form
      className={cn("rounded-xl border-t-4 border-brand bg-cream shadow-card", compact ? "p-4 sm:p-5" : "p-6 md:p-8")}
      onSubmit={submit}
    >
      <div className={compact ? "mb-4" : "mb-6"}>
        <p className="kicker">{kicker}</p>
        <h2 className={cn("display text-navy", compact ? "text-2xl sm:text-3xl" : "text-3xl md:text-4xl")}>{title}</h2>
        <p className={cn("mt-2 text-sm leading-relaxed text-muted", compact && "hidden sm:block")}>{intro}</p>
      </div>
      <div className={compact ? "grid gap-3" : "grid gap-4"}>
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Name
          <input
            className={field}
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Phone
          <input
            className={field}
            required
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(818) 555-0123"
          />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          What’s going on?
          <textarea
            className={cn(field, compact ? "min-h-16 py-2" : "min-h-28 py-2")}
            rows={compact ? 2 : 4}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="Slow drain, leak, no hot water — a sentence is enough."
          />
        </label>
      </div>
      <Button type="submit" className="mt-5 w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : submitLabel}
      </Button>
      {status === "error" && (
        <p className="mt-3 text-sm text-brand" role="alert">
          {message}
        </p>
      )}
      <p className={cn("mt-4 text-xs text-muted", compact && "lg:hidden")}>
        For urgent service, call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
      </p>
    </form>
  );
}
