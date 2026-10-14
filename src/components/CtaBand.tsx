import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CtaBand({
  title = "Tell us what’s going on.",
}: {
  kicker?: string;
  title?: string;
}) {
  return (
    <section className="bg-navy py-12 text-cream md:py-14">
      <div className="shell flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <h2 className="display text-3xl md:text-4xl">{title}</h2>
        <div className="flex flex-wrap gap-3">
          <a href={PHONE_HREF} className={cn(buttonVariants({ variant: "invert" }))}>
            Call {PHONE_DISPLAY}
          </a>
          <Link to="/contact" className={cn(buttonVariants({ variant: "primary" }))}>
            Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}
