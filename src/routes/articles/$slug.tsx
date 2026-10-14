import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { buttonVariants } from "@/components/ui/button";
import { formatArticleDate, getArticle, relatedArticles, sanitizeArticleHtml } from "@/lib/articles";
import { COMPANY, PHONE_DISPLAY, PHONE_HREF, SITE_URL, canonical } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    const related = relatedArticles(article.slug, 3);
    return { article, related };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    const title = article?.metaTitle || (article ? `${article.title} | Extreme Plumbing` : "Article");
    const description = article?.metaDescription || article?.excerpt || "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
      ],
      links: article ? [{ rel: "canonical", href: canonical(`/articles/${article.slug}`) }] : [],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article, related } = Route.useLoaderData();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt.replace(" ", "T"),
    description: article.metaDescription || article.excerpt,
    author: { "@type": "Organization", name: COMPANY },
    publisher: { "@type": "Organization", name: COMPANY, url: SITE_URL },
    mainEntityOfPage: canonical(`/articles/${article.slug}`),
    image: `${SITE_URL}${article.image}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Articles", item: canonical("/articles") },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical(`/articles/${article.slug}`) },
    ],
  };

  return (
    <SiteShell>
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <PageHero
          kicker={`Plumbing guide · ${formatArticleDate(article.publishedAt)}`}
          title={article.title}
          intro={article.excerpt}
        />
        <section className="py-16 md:py-24">
          <div className="shell grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <article>
              <nav className="mb-8 text-xs font-semibold tracking-[0.08em] text-muted uppercase" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-navy">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/articles" className="hover:text-navy">Articles</Link>
                <span className="mx-2">/</span>
                <span className="text-navy">Guide</span>
              </nav>
              <img
                src={article.image}
                alt={article.imageAlt}
                width={1400}
                height={933}
                className="mb-10 aspect-[16/9] w-full rounded-lg object-cover outline outline-1 -outline-offset-1 outline-ink/10"
              />
              <div
                className="article-prose max-w-[68ch]"
                dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
              />
            </article>
            <aside className="grid gap-6 lg:sticky lg:top-28">
              <div className="rounded-lg bg-navy p-6 text-cream">
                <p className="kicker kicker-light">Need help now?</p>
                <h2 className="display text-3xl">Let us inspect it.</h2>
                <p className="mt-3 text-sm text-cream/70">
                  Get a clear diagnosis and a free, no-obligation estimate from a Los Angeles plumbing professional.
                </p>
                <Link to="/contact" className={cn(buttonVariants({ variant: "primary" }), "mt-5 w-full")}>
                  Send a message
                </Link>
                <a href={PHONE_HREF} className="mt-3 block text-center text-sm font-semibold">
                  Call {PHONE_DISPLAY}
                </a>
              </div>
              <div className="rounded-lg bg-cream p-6">
                <h2 className="mb-4 font-sans text-sm font-semibold tracking-[0.14em] text-navy uppercase">
                  More homeowner guides
                </h2>
                <div className="grid gap-4">
                  {related.map((item) => (
                    <Link key={item.slug} to="/articles/$slug" params={{ slug: item.slug }} className="block">
                      <span className="block text-[0.7rem] tracking-[0.1em] text-muted uppercase">
                        {formatArticleDate(item.publishedAt)}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-navy">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
