import articleData from "./articles.json";
import { coverAltFor, coverFor } from "./article-covers";

export type Article = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keyword?: string;
};

export const articles: Article[] = (articleData as Omit<Article, "imageAlt">[]).map((item) => ({
  ...item,
  image: coverFor(item.slug, item.title),
  imageAlt: coverAltFor(item.slug),
}));

export function getArticle(slug: string) {
  return articles.find((item) => item.slug === slug);
}

export function relatedArticles(slug: string, limit = 3) {
  const current = getArticle(slug);
  const rest = articles.filter((item) => item.slug !== slug);
  if (!current) return rest.slice(0, limit);
  const tokens = `${current.slug} ${current.title} ${current.keyword ?? ""}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  return rest
    .map((item) => {
      const hay = `${item.slug} ${item.title}`.toLowerCase();
      const score = tokens.reduce((n, token) => n + (hay.includes(token) ? 1 : 0), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || b.item.publishedAt.localeCompare(a.item.publishedAt))
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function sanitizeArticleHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/📞\s*/g, "")
    .replace(/href="\/articles\/([^"]+?)\/"/g, 'href="/articles/$1"')
    .replace(/href="\/blog\//g, 'href="/articles/');
}

export { formatArticleDate } from "./article-covers";
