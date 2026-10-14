import { Link, createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { HomeHero } from "@/components/HeroSequence";
import { ReviewCard, ReviewSummary } from "@/components/ReviewCard";
import { SiteShell } from "@/components/layout/SiteShell";
import { articleCards as articles } from "@/lib/articles-meta";
import { formatArticleDate } from "@/lib/article-covers";
import { areas, canonical, processSteps, reviews, services } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Extreme Plumbing & Rooter | 24/7 Los Angeles Plumber" },
      {
        name: "description",
        content:
          "24/7 licensed plumbing and rooter service throughout Los Angeles. Camera inspections, drain cleaning, sewer repair, water heaters, and free no-pressure estimates.",
      },
    ],
    links: [
      { rel: "canonical", href: canonical("/") },
      { rel: "preload", as: "image", href: "/media/video/hero-seq/01-broken-line.jpg" },
    ],
  }),
});

function Home() {
  return (
    <SiteShell overlayHeader>
      <main id="main">
        <HomeHero />

        <section className="border-b border-line bg-cream">
          <div className="shell grid gap-8 py-8 md:grid-cols-3 md:py-10">
            {[
              ["Free inspection", "Look first. Quote before any work."],
              ["You approve it", "No repair starts until you say so."],
              ["Greater Los Angeles", "Homes, businesses, and high-rises."],
            ].map(([title, copy]) => (
              <p key={title}>
                <strong className="block text-sm font-semibold text-navy">{title}</strong>
                <span className="mt-1 block text-sm text-muted">{copy}</span>
              </p>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-24" id="services">
          <div className="shell">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="display text-4xl text-navy md:text-5xl">Services</h2>
              <Link to="/services" className="text-link">
                All services
              </Link>
            </div>
            <div className="border-t border-line">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  className="grid grid-cols-[5.5rem_1fr] items-center gap-4 border-b border-line py-4 transition-colors duration-150 hover:bg-cream sm:grid-cols-[7.5rem_1fr_auto] sm:gap-6"
                >
                  <img
                    src={service.image}
                    alt=""
                    width={160}
                    height={120}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span>
                    <span className="block font-semibold text-navy">{service.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{service.short}</span>
                  </span>
                  <span className="hidden text-sm font-semibold text-brand sm:block">View</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy py-16 text-cream md:py-24">
          <div className="shell">
            <h2 className="display max-w-xl text-4xl md:text-5xl">Inspect. Explain. Then you decide.</h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <li key={step.n}>
                  <span className="text-xs font-bold tracking-[0.16em] text-brand">{step.n}</span>
                  <h3 className="mt-3 font-sans text-lg font-semibold tracking-normal text-cream normal-case">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-line py-16 md:py-20">
          <div className="shell max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.14em] text-brand uppercase">Since 1997</p>
            <h2 className="display mt-3 text-4xl text-navy md:text-5xl">A local company. Same standard since the beginning.</h2>
            <p className="mt-5 text-muted">
              Extreme Plumbing & Rooter started as family work in the trades and grew into a licensed company for
              homes, businesses, and high-rises across Los Angeles. We still diagnose before we sell a repair.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <Link to="/about" className="text-link">
                Our story
              </Link>
              <Link to="/our-workers" className="text-link">
                The crew
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f8f9fa] py-16 md:py-20">
          <div className="shell">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-sans text-2xl font-medium tracking-normal text-[#202124] normal-case">
                  4.6 on Yelp · 252 reviews
                </h2>
                <div className="mt-4">
                  <ReviewSummary />
                </div>
              </div>
              <Link to="/reviews" className="text-sm font-medium text-[#d32323]">
                Yelp and Google reviews
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 9).map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="shell grid items-center gap-8 border border-line bg-cream px-6 py-8 md:grid-cols-[1.3fr_auto] md:px-10">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-brand uppercase">HOAs and property managers</p>
              <h2 className="mt-2 font-sans text-3xl font-semibold tracking-normal text-navy normal-case">
                A direct line for buildings, not just houses.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                After-hours leaks, stacks, and common-area repairs. Tell us the property and we’ll set up a manager contact.
              </p>
            </div>
            <Link to="/property-managers" className="text-link">
              Manager signup
            </Link>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="shell">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display text-3xl text-navy md:text-4xl">Where we work</h2>
              <Link to="/service-areas" className="text-link">
                Areas
              </Link>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">{areas.join(" · ")}</p>
          </div>
        </section>

        <section className="border-t border-line py-16 md:py-20">
          <div className="shell">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="display text-3xl text-navy md:text-4xl">From the journal</h2>
              <Link to="/articles" className="text-link">
                All articles
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <article key={article.slug}>
                  <Link to="/articles/$slug" params={{ slug: article.slug }} className="block overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.imageAlt}
                      width={1400}
                      height={933}
                      loading="lazy"
                      className="aspect-[3/2] w-full object-cover"
                    />
                    <time className="mt-3 block text-xs font-semibold tracking-[0.12em] text-muted uppercase" dateTime={article.publishedAt}>
                      {formatArticleDate(article.publishedAt)}
                    </time>
                    <h3 className="mt-2 font-sans text-lg font-semibold tracking-normal text-navy normal-case">
                      {article.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CtaBand kicker="Free inspection" title="Tell us what’s going on." />
      </main>
    </SiteShell>
  );
}
