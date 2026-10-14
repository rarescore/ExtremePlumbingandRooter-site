import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import {
  areas,
  EMAIL,
  LICENSE_NUMBER,
  PHONE_DISPLAY,
  PHONE_HREF,
  services,
  socialLinks,
} from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy text-cream">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/65">
            Clear answers, careful work, and no-pressure estimates throughout Los Angeles since 1997.
          </p>
          <a href={PHONE_HREF} className="mt-5 inline-block font-display text-3xl tracking-wide text-cream">
            {PHONE_DISPLAY}
          </a>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold tracking-[0.12em] text-cream/60 uppercase">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="hover:text-cream">
                {item.shortLabel}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm tracking-[0.16em] text-cream/50">Explore</h2>
          <div className="grid gap-2 text-sm text-cream/80">
            <Link to="/services">Services</Link>
            <Link to="/service-areas">Service areas</Link>
            <Link to="/about">About us</Link>
            <Link to="/our-workers">Our team</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/property-managers">HOAs & managers</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm tracking-[0.16em] text-cream/50">Popular services</h2>
          <div className="grid gap-2 text-sm text-cream/80">
            {services.slice(0, 6).map((service) => (
              <Link key={service.slug} to="/services/$slug" params={{ slug: service.slug }}>
                {service.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm tracking-[0.16em] text-cream/50">Contact</h2>
          <div className="grid gap-2 text-sm text-cream/80">
            <a href={PHONE_HREF}>Call {PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <p>
              P.O. Box 14641
              <br />
              Van Nuys, CA 91409
            </p>
            <p className="text-cream/55">
              Serving {areas.slice(0, 5).join(", ")} and the greater LA area. Available 24/7.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="shell flex flex-col gap-3 py-5 text-xs tracking-wide text-cream/50 md:flex-row md:items-center md:justify-between">
          <span>© {year} Extreme Plumbing & Rooter, Inc.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy-policy">Privacy policy</Link>
            <a href={`https://www.cslb.ca.gov/${LICENSE_NUMBER}`} target="_blank" rel="noreferrer">
              CA contractor license #{LICENSE_NUMBER}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
