"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { deliverLead } from "@/lib/leads";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

type Fields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  details: string;
  website: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  service: "",
  date: "",
  time: "",
  details: "",
  website: "",
};

const services = [
  "Drain or sewer problem",
  "Camera inspection",
  "Leak detection",
  "Water heater",
  "Copper repipe",
  "Hydro-jetting",
  "Boiler",
  "Commercial / high-rise",
  "Other plumbing issue",
];

function valid(input: Fields) {
  return (
    input.name.trim().length >= 2 &&
    input.phone.replace(/\D/g, "").length >= 10 &&
    /\S+@\S+\.\S+/.test(input.email) &&
    !!input.date &&
    !!input.time
  );
}

function todayInLosAngeles() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

export function EstimateForm({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<Fields>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const minDate = useMemo(() => (mounted ? todayInLosAngeles() : ""), [mounted]);

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
      setMessage("Please complete your name, phone, email, date, and time.");
      return;
    }
    setStatus("sending");
    try {
      const payload = {
        kind: "estimate" as const,
        name: form.name,
        phone: form.phone,
        email: form.email,
        extra: `Service: ${form.service || "Not selected"}\nPreferred visit: ${form.date} · ${form.time}`,
        details: form.details,
      };
      const mailed = await deliverLead(payload);
      if (!mailed) throw new Error("mail");
      setStatus("success");
      setMessage("Request sent to the shop. Call if you need us there today — no work begins without your approval.");
      setForm(empty);
    } catch {
      setStatus("error");
      setMessage("That didn’t send. Call the shop and we’ll book the visit by phone.");
    }
  }

  const field =
    "mt-1.5 w-full min-h-11 rounded-md border border-navy/12 bg-cream px-3 text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand)_22%,transparent)]";

  if (!mounted) {
    return <div className="min-h-[32rem] rounded-xl bg-cream" aria-hidden="true" />;
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-navy px-6 py-10 text-cream" role="status">
        <p className="kicker kicker-light">Request received</p>
        <h2 className="display text-4xl">We’ll take a look.</h2>
        <p className="mt-4 max-w-md text-cream/70">{message}</p>
        <a href={PHONE_HREF} className="mt-6 inline-flex min-h-11 items-center text-sm font-bold tracking-wide">
          Need help now? Call {PHONE_DISPLAY}
        </a>
      </div>
    );
  }

  return (
    <form className="rounded-xl bg-cream p-6 shadow-card md:p-8" onSubmit={submit}>
      <div className="mb-6">
        <p className="kicker">Free on-site estimate</p>
        <h2 className="display text-3xl text-navy md:text-4xl">Choose a time that works.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We’ll confirm the visit. No obligation — and no work begins without your approval.
        </p>
      </div>
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Full name
          <input className={field} required autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Phone number
          <input className={field} required inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(818) 555-0123" />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Email address
          <input className={field} required type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          What can we help with?
          <select className={field} value={form.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">Select a service</option>
            {services.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Preferred date
          <input className={field} required type="date" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} />
        </label>
        <label className="text-xs font-semibold tracking-[0.08em] text-navy uppercase">
          Preferred time
          <select className={field} required value={form.time} onChange={(e) => set("time", e.target.value)}>
            <option value="">Choose a window</option>
            <option>8:00 AM – 10:00 AM</option>
            <option>10:00 AM – 12:00 PM</option>
            <option>12:00 PM – 2:00 PM</option>
            <option>2:00 PM – 4:00 PM</option>
            <option>4:00 PM – 6:00 PM</option>
            <option>Emergency / ASAP</option>
          </select>
        </label>
        <label className={`text-xs font-semibold tracking-[0.08em] text-navy uppercase ${compact ? "" : "md:col-span-2"}`}>
          Anything we should know?
          <textarea
            className={`${field} min-h-24 py-2`}
            rows={compact ? 3 : 5}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="What you’re seeing, hearing, or smelling (optional)."
          />
        </label>
      </div>
      <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-muted">
        <input required type="checkbox" className="mt-1 size-4 accent-brand" />
        <span>
          I agree that Extreme Plumbing may contact me about this request by phone, email, or text. Consent is not a
          condition of purchase.
        </span>
      </label>
      <Button type="submit" className="mt-5 w-full md:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Opening request…" : "Request my free estimate"}
      </Button>
      {status === "error" && (
        <p className="mt-3 text-sm text-brand" role="alert">
          {message}
        </p>
      )}
      <p className="mt-4 text-xs text-muted">
        For urgent service, call <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>. Message and data rates may apply. Reply STOP
        to opt out.
      </p>
    </form>
  );
}
