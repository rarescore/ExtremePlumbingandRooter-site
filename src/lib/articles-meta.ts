import meta from "./articles-meta.json";
import { coverAltFor, coverFor } from "./article-covers";

export type ArticleCard = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  metaTitle?: string;
  metaDescription?: string;
};

export const articleCards: ArticleCard[] = (meta as Omit<ArticleCard, "image" | "imageAlt">[]).map((item) => ({
  ...item,
  image: coverFor(item.slug, item.title),
  imageAlt: coverAltFor(item.slug),
}));
