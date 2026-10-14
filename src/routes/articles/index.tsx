import { Link, createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { articleCards as articles } from "@/lib/articles-meta";
import { formatArticleDate } from "@/lib/article-covers";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/articles/")({
  component: ArticlesPage,
  head: () => ({
    meta: [
      { title: "Los Angeles Plumbing Articles | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content:
          "Practical Los Angeles plumbing guides from Extreme Plumbing & Rooter: plumber cost, drain cleaning, hydro jetting, leaks, water heaters, and emergency checklists.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/articles") }],
  }),
});

function ArticlesPage() {
  const [featured, ...rest] = articles;

  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Practical plumbing guidance"
          title="Answers that help you protect your property."
          intro="Clear, locally focused guides for Los Angeles homeowners — written to help you recognize problems early and know when it is time to call a professional."
        />
        <section className="py-16 md:py-24">
          <div className="shell">
            {featured ? (
              <article className="mb-12 grid overflow-hidden rounded-lg bg-cream shadow-card lg:grid-cols-2">
                <Link to="/articles/$slug" params={{ slug: featured.slug }} className="block">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    width={1400}
                    height={933}
                    className="h-full min-h-64 w-full object-cover"
                  />
                </Link>
                <div className="p-6 md:p-10">
                  <p className="kicker">Latest guide</p>
                  <time className="text-xs font-semibold tracking-[0.12em] text-muted uppercase" dateTime={featured.publishedAt}>
                    {formatArticleDate(featured.publishedAt)}
                  </time>
                  <h2 className="mt-3 font-sans text-2xl font-semibold tracking-normal text-navy normal-case md:text-3xl">
                    <Link to="/articles/$slug" params={{ slug: featured.slug }}>
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-muted">{featured.excerpt}</p>
                  <Link to="/articles/$slug" params={{ slug: featured.slug }} className="text-link mt-5">
                    Read the guide
                  </Link>
                </div>
              </article>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <article key={article.slug} className="overflow-hidden rounded-lg bg-cream shadow-card">
                  <Link to="/articles/$slug" params={{ slug: article.slug }} className="block aspect-[3/2] overflow-hidden">
                    <img src={article.image} alt={article.imageAlt} width={1400} height={933} loading="lazy" className="size-full object-cover" />
                  </Link>
                  <div className="p-5">
                    <time className="text-xs font-semibold tracking-[0.12em] text-muted uppercase" dateTime={article.publishedAt}>
                      {formatArticleDate(article.publishedAt)}
                    </time>
                    <h2 className="mt-2 font-sans text-lg font-semibold tracking-normal text-navy normal-case">
                      <Link to="/articles/$slug" params={{ slug: article.slug }}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm text-muted">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <CtaBand kicker="Need a professional opinion?" title="Start with a free inspection." />
      </main>
    </SiteShell>
  );
}
