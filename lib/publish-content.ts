import { z } from 'zod';
import { siteContentSchema } from './site-content.ts';
import { isSecureUrl } from './site-url.ts';

export const secureLinkSchema = z.string().trim().max(600).refine(value => !value || isSecureUrl(value), 'Use a complete https:// URL');
export const secureImageSchema = z.string().trim().max(600).refine(value => isSecureUrl(value) || /^\/(assets|api\/media)\/[a-zA-Z0-9/_().-]+$/.test(value) && !value.includes('..'), 'Use a complete image URL or website asset path');

export const settingsSchemas = {
  brand: siteContentSchema.shape.brand.extend({ logo: secureImageSchema }),
  imagery: z.object({ hero: secureImageSchema, care: secureImageSchema }),
  contact: siteContentSchema.shape.contact.extend({ facebook: secureLinkSchema, instagram: secureLinkSchema, linkedin: secureLinkSchema, youtube: secureLinkSchema, x: secureLinkSchema, telegram: secureLinkSchema, snapchat: secureLinkSchema, github: secureLinkSchema }),
  seo: siteContentSchema.shape.seo,
};

// Validate new publications more strictly without making legacy records impossible to open and repair.
export const publishContentSchema = siteContentSchema.superRefine((content, context) => {
  const check = (value: string, path: (string | number)[], image = false, optional = true) => {
    if (!value && optional) return;
    if (!(image ? secureImageSchema : secureLinkSchema).safeParse(value).success) context.addIssue({ code: 'custom', path, message: image ? 'Invalid image URL' : 'Use a complete https:// URL' });
  };
  check(content.brand.logo, ['brand', 'logo'], true, false);
  for (const key of ['hero', 'care'] as const) check(content.imagery[key], ['imagery', key], true, false);
  for (const key of ['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'telegram', 'snapchat', 'github'] as const) check(content.contact[key], ['contact', key]);
  content.products.forEach((item, index) => check(item.image, ['products', index, 'image'], true));
  content.offers.forEach((item, index) => check(item.image || '', ['offers', index, 'image'], true));
  content.company.team.forEach((item, index) => check(item.image, ['company', 'team', index, 'image'], true));
  content.company.offices.forEach((item, index) => check(item.mapUrl, ['company', 'offices', index, 'mapUrl']));
  for (const group of ['support', 'credentials'] as const) content.company[group].forEach((item, index) => check(item.url, ['company', group, index, 'url']));
});
