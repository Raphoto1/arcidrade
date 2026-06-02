import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";
import { ArticleItem } from "@/types/articles";

const ARTICLES_SECTION_KEY = "articles";

export type ArticlesSectionVisibility = {
  sectionKey: string;
  isActive: boolean;
};

function mapArticleRecord(item: any): ArticleItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    shortText: item.shortText,
    image: item.image,
    contentHtml: item.contentHtml,
    publishedAt: new Date(item.publishedAt).toISOString().slice(0, 10),
    isActive: Boolean(item.isActive),
  };
}

export async function getArticlesSectionVisibilityService(): Promise<boolean> {
  const record = await withPrismaRetry(() =>
    (prisma as any).siteSectionVisibility.findUnique({
      where: { sectionKey: ARTICLES_SECTION_KEY },
    })
  );

  return Boolean((record as any)?.isActive);
}

export async function upsertArticlesSectionVisibilityService(isActive: boolean): Promise<ArticlesSectionVisibility> {
  const updated = await withPrismaRetry(() =>
    (prisma as any).siteSectionVisibility.upsert({
      where: { sectionKey: ARTICLES_SECTION_KEY },
      create: { sectionKey: ARTICLES_SECTION_KEY, isActive },
      update: { isActive },
    })
  );

  return {
    sectionKey: String((updated as any).sectionKey),
    isActive: Boolean((updated as any).isActive),
  };
}

export async function getAdminArticlesService(): Promise<ArticleItem[]> {
  const articlesRaw = await withPrismaRetry(() =>
    (prisma as any).article.findMany({
      orderBy: [{ publishedAt: "desc" }, { created_at: "desc" }],
    })
  );
  const articles = Array.isArray(articlesRaw) ? articlesRaw : [];

  return articles.map(mapArticleRecord);
}

export async function getArticlesCountService(): Promise<number> {
  const count = await withPrismaRetry(() => (prisma as any).article.count());
  return Number(count ?? 0);
}

export async function getPublicArticlesService(): Promise<ArticleItem[]> {
  const articlesRaw = await withPrismaRetry(() =>
    (prisma as any).article.findMany({
      where: { isActive: true },
      orderBy: [{ publishedAt: "desc" }, { created_at: "desc" }],
    })
  );
  const articles = Array.isArray(articlesRaw) ? articlesRaw : [];

  return articles.map(mapArticleRecord);
}

export async function getPublicArticleBySlugService(slug: string): Promise<ArticleItem | null> {
  const articleRaw = await withPrismaRetry(() =>
    (prisma as any).article.findUnique({
      where: { slug },
    })
  );
  const article = articleRaw as any;

  if (!article || !article.isActive) {
    return null;
  }

  return mapArticleRecord(article);
}

export async function ensureArticleSlugAvailableService(slug: string, idToIgnore?: number) {
  const existingRaw = await withPrismaRetry(() =>
    (prisma as any).article.findUnique({
      where: { slug },
    })
  );
  const existing = existingRaw as any;

  if (!existing) {
    return true;
  }

  if (idToIgnore && existing.id === idToIgnore) {
    return true;
  }

  return false;
}
