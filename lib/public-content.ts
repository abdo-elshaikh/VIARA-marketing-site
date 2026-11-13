import type { SiteContent } from './site-content.ts';
import { marketingSystemIds, marketingCategories, marketingFacilityProfiles } from './healthcare-catalog.mjs';

/** Restrict catalog identifiers without rewriting copy explicitly saved by the publisher. */
export function preparePublicContent(content: SiteContent): SiteContent {
  return {
    ...content,
    products: content.products.map(product => ({ ...product, enabled: product.enabled && marketingSystemIds.includes(product.id) })),
    catalog: {
      categories: marketingCategories.map(category => content.catalog.categories.find(item => item.id === category.id) || category),
      facilities: marketingFacilityProfiles.map(profile => {
        const saved = content.catalog.facilities.find(item => item.id === profile.id);
        return saved ? { ...saved, systems: saved.systems.filter(id => marketingSystemIds.includes(id)) } : profile;
      }),
    },
    offers: content.offers.filter(offer => !offer.plan || content.plans.some(plan => plan.id === offer.plan && plan.enabled)),
  };
}
