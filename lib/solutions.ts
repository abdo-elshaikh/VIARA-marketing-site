import { type Locale, type SiteContent, type Localized } from './site-content';
import { healthcareSystems } from './healthcare-catalog.mjs';

export const solutionSlugs: Record<string, string> = {
  ...Object.fromEntries(healthcareSystems.map(system => [system.id, system.id.toLowerCase()])),
  RIS: 'ris',
  PACS: 'pacs',
  CMS: 'medical-centers',
  PORTAL: 'portal',
  HIS: 'his',
  EMR: 'emr',
  LIS: 'lis',
  RCM: 'rcm',
  TELE: 'telehealth',
  AI: 'ai',
};

export const solutionPath = (id: string, locale: Locale) => {
  const slug = solutionSlugs[id] || id.toLowerCase();
  return `${locale === 'en' ? '/en' : ''}/solutions/${slug}`;
};

export interface SolutionData {
  id: string;
  name: Localized;
  headline: Localized;
  description: Localized;
  features: Localized[];
  note: Localized;
  image?: string;
  enabled: boolean;
}

export function findSolution(content: SiteContent, slug: string): SolutionData | undefined {
  const normalized = (slug || '').toLowerCase();
  const id = Object.keys(solutionSlugs).find(key => solutionSlugs[key].toLowerCase() === normalized || key.toLowerCase() === normalized);
  const canonical = id === 'EMR' ? 'EHR' : id;
  const product = content.products.find(p => p.id === canonical && p.enabled);
  if (!product) return undefined;
  return { ...product, image: product.image || undefined };
}
