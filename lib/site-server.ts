import { eq, desc, and, inArray } from 'drizzle-orm';
import { getDb } from '../db';
import { siteSettings, reviews } from '../db/schema';
import { siteContentSchema, defaultContent, type PublicReview, type SiteContent } from './site-content';
import { marketingSystemIds, marketingCategories, marketingFacilityProfiles } from './healthcare-catalog.mjs';
const outOfScopeCopy = /\b(hospitals?|health systems?|laborator(?:y|ies)|blood banks?|telehealth|home care|pharmacies?|operating rooms?|inpatient|facility networks?)\b|المستشف(?:ى|يات)|المختبر(?:ات)?|بنوك الدم|الرعاية عن بعد|الرعاية المنزلية|الصيدليات|غرف العمليات|التنويم|مجموعات المنشآت/iu;
function containsOutOfScopeCopy(value: unknown): boolean {
  if (typeof value === 'string') return outOfScopeCopy.test(value);
  if (Array.isArray(value)) return value.some(containsOutOfScopeCopy);
  if (value && typeof value === 'object') return Object.values(value).some(containsOutOfScopeCopy);
  return false;
}
function keepFocusedCopy<T>(value: T, fallback: T): T {
  return containsOutOfScopeCopy(value) ? fallback : value;
}

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
    console.error('Failed to read site content; serving defaults:', error);
    return { content:defaultContent, version:0, updatedAt:0 };
  }
}

async function loadPublicContent() {
  const result = await readContent();
  const defaultProducts = new Map(defaultContent.products.map(product => [product.id, product]));
  const products = result.content.products.map(product => {
    const fallback = defaultProducts.get(product.id);
    if (!marketingSystemIds.includes(product.id) || !fallback) return { ...product, enabled: false };
    const isLegacyPortal = product.id === 'PORTAL' && (product.features.length <= 1 || product.name.ar === 'بوابة المريض والحجز' || !product.features.some(f => f.ar.includes('الأطباء')));
    return {
      ...product,
      name: isLegacyPortal ? fallback.name : keepFocusedCopy(product.name, fallback.name),
      headline: isLegacyPortal ? fallback.headline : keepFocusedCopy(product.headline, fallback.headline),
      description: isLegacyPortal ? fallback.description : keepFocusedCopy(product.description, fallback.description),
      features: isLegacyPortal ? fallback.features : keepFocusedCopy(product.features, fallback.features),
      note: isLegacyPortal ? fallback.note : keepFocusedCopy(product.note, fallback.note),
      enabled: product.enabled,
    };
  });
  return {
    ...result,
    content: {
      ...result.content,
      // Keep older saved settings from bringing unsupported product areas back to public pages.
      seo: keepFocusedCopy(result.content.seo, defaultContent.seo),
      hero: keepFocusedCopy(result.content.hero, defaultContent.hero),
      about: keepFocusedCopy(result.content.about, defaultContent.about),
      catalog: {
        categories: marketingCategories.map(category => result.content.catalog.categories.find(item => item.id === category.id) || category),
        facilities: marketingFacilityProfiles.map(profile => {
          const saved = result.content.catalog.facilities.find(item => item.id === profile.id);
          return saved ? { ...saved, systems: saved.systems.filter(id => marketingSystemIds.includes(id)) } : profile;
        }),
      },
      products,
      journeys: keepFocusedCopy(result.content.journeys, defaultContent.journeys),
      metrics: defaultContent.metrics,
      plans: result.content.plans,
      offers: result.content.offers.filter(offer => !containsOutOfScopeCopy(offer) && (!offer.plan || result.content.plans.some(plan => plan.id === offer.plan && plan.enabled))),
      faqs: keepFocusedCopy(result.content.faqs, defaultContent.faqs),
      copy: Object.fromEntries(Object.entries(result.content.copy).filter(([, value]) => !containsOutOfScopeCopy(value))),
      company: {
        ...defaultContent.company,
        ...result.content.company,
        legalName: defaultContent.company.legalName,
        eyebrow: keepFocusedCopy(result.content.company.eyebrow, defaultContent.company.eyebrow),
        storyTitle: defaultContent.company.storyTitle,
        storyBody: defaultContent.company.storyBody,
        principles: (result.content.company.principles?.filter(p => p.enabled).length >= defaultContent.company.principles.length)
          ? keepFocusedCopy(result.content.company.principles, defaultContent.company.principles)
          : defaultContent.company.principles,
        offices: (result.content.company.offices?.some(o => o.enabled) && result.content.company.offices.length >= defaultContent.company.offices.length)
          ? result.content.company.offices
          : defaultContent.company.offices,
        team: result.content.company.team?.some(t => t.enabled)
          ? result.content.company.team
          : defaultContent.company.team,
        milestones: result.content.company.milestones?.some(m => m.enabled)
          ? result.content.company.milestones
          : defaultContent.company.milestones,
        credentials: result.content.company.credentials?.some(c => c.enabled)
          ? result.content.company.credentials
          : defaultContent.company.credentials,
        support: result.content.company.support?.some(s => s.enabled)
          ? result.content.company.support
          : defaultContent.company.support,
      },
    },
  };
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
