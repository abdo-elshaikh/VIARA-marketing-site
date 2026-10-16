import { eq, desc, and, inArray } from 'drizzle-orm';
import { getDb } from '../db';
import { siteSettings, reviews } from '../db/schema';
import { siteContentSchema, defaultContent, type PublicReview } from './site-content';
export async function readContent() {
  try {
    const row = await getDb().select().from(siteSettings).where(eq(siteSettings.key, 'main')).get();
    if (!row) return { content:defaultContent, version:0, updatedAt:0 };
    return { content:siteContentSchema.parse(JSON.parse(row.value)),version:row.version,updatedAt:row.updatedAt };
  } catch {
    return { content:defaultContent, version:0, updatedAt:0 };
  }
}
export async function readPublicContent() {
  try { return await readContent(); } catch { return { content:defaultContent,version:0,updatedAt:0 }; }
}
export async function readPublishedReviews(systemId?: string): Promise<PublicReview[]> {
  try {
    const condition = systemId ? and(eq(reviews.status, 'approved'), inArray(reviews.systemId, ['EMR', 'EHR'].includes(systemId) ? ['EMR', 'EHR'] : [systemId])) : eq(reviews.status, 'approved');
    return await getDb().select({ id:reviews.id,name:reviews.name,role:reviews.role,organization:reviews.organization,quote:reviews.quote,rating:reviews.rating,locale:reviews.locale,createdAt:reviews.createdAt,systemId:reviews.systemId }).from(reviews).where(condition).orderBy(desc(reviews.createdAt)).limit(100);
  } catch { return []; }
}
