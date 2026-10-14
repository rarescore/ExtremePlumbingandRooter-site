import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { ReviewCard, ReviewSummary } from "@/components/ReviewCard";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { canonical, reviews, socialLinks } from "@/lib/site";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Reviews | Extreme Plumbing & Rooter Los Angeles" },
      {
        name: "description",
        content:
          "Extreme Plumbing & Rooter is rated 4.6 on Yelp from 252 reviews in Van Nuys, with featured Google reviews for fast, clean plumbing work in Los Angeles.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/reviews") }],
  }),
});

function ReviewsPage() {
  const google = socialLinks.find((item) => item.shortLabel === "Google");
  const yelp = socialLinks.find((item) => item.shortLabel === "Yelp");
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Yelp 4.6 · 252 reviews"
          title="Reviews from people we worked for."
          intro="252 reviews on Yelp at 4.6, plus Google notes from customers who named the crew. License checked on Yelp. California contractor #1086230."
        />
        <section className="bg-[#f8f9fa] py-12 md:py-16">
          <div className="shell">
            <div className="rounded-xl border border-[#dadce0] bg-white p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-[#5f6368]">Extreme Plumbing & Rooter · Van Nuys</p>
                  <h2 className="mt-1 font-sans text-2xl font-medium tracking-normal text-[#202124] normal-case">
                    Yelp and Google
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-medium">
                  {yelp ? (
                    <a href={yelp.href} target="_blank" rel="noreferrer" className="text-[#d32323]">
                      252 reviews on Yelp
                    </a>
                  ) : null}
                  {google ? (
                    <a href={google.href} target="_blank" rel="noreferrer" className="text-[#1a73e8]">
                      Google
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="mt-6">
                <ReviewSummary />
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
          </div>
        </section>
        <CtaBand title="Need the same kind of visit?" />
      </main>
    </SiteShell>
  );
}
