import { eq, desc, and, inArray } from 'drizzle-orm';
import { getDb } from '../db';
import { siteSettings, reviews } from '../db/schema';
import { siteContentSchema, defaultContent, type PublicReview, type SiteContent } from './site-content';
import { marketingSystemIds } from './healthcare-catalog.mjs';
import { preparePublicContent } from './public-content';
const CONTENT_CACHE_TTL_MS = 30_000;
let contentCache: { value: { content: SiteContent; version: number; updatedAt: number }; expiresAt: number } | null = null;

/** Clears the short-lived public content cache (called after admin publishes). */
export function invalidatePublicContent() {
  contentCache = null;
}

export async function readContent() {
  try {
    const row = await getDb().select().from(siteSettings).where(eq(siteSettings.key, 'main')).get();
    if (!row) return { content:defaultContent, version:0, updatedAt:0 };
    return { content:siteContentSchema.parse(JSON.parse(row.value)),version:row.version,updatedAt:row.updatedAt };
  } catch (error) {
    console.error('Failed to read saved site content:', error);
    throw error;
  }
}

async function loadPublicContent() {
  const result = await readContent();
  return { ...result, content: preparePublicContent(result.content) };
}

export async function readPublicContent() {
  const now = Date.now();
  if (contentCache && contentCache.expiresAt > now) return contentCache.value;
  try {
    const value = await loadPublicContent();
    contentCache = { value, expiresAt: Date.now() + CONTENT_CACHE_TTL_MS };
    return value;
  } catch (error) {
    console.error('Failed to build public content; serving defaults:', error);
    return { content:defaultContent,version:0,updatedAt:0 };
  }
}
export async function readPublishedReviews(systemId?: string): Promise<PublicReview[]> {
  try {
    const condition = systemId
      ? and(eq(reviews.status, 'approved'), inArray(reviews.systemId, [systemId]))
      : and(eq(reviews.status, 'approved'), inArray(reviews.systemId, marketingSystemIds));
    return await getDb().select({ id:reviews.id,name:reviews.name,role:reviews.role,organization:reviews.organization,quote:reviews.quote,rating:reviews.rating,locale:reviews.locale,createdAt:reviews.createdAt,systemId:reviews.systemId }).from(reviews).where(condition).orderBy(desc(reviews.createdAt)).limit(100);
  } catch (error) {
    console.error('Failed to read published reviews:', error);
    return [];
  }
}
