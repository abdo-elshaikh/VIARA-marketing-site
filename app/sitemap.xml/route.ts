import { readPublicContent } from '../../lib/site-server';
import { solutionPath, solutionSlugs, findSolution } from '../../lib/solutions';
import { siteOrigin } from '../../lib/seo';
export const dynamic = 'force-dynamic';
export async function GET() {
  const { content } = await readPublicContent();
  const origin = siteOrigin();
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const groups = [{ ar: '/', en: '/en' }, { ar: '/systems', en: '/en/systems' }, { ar: '/planning', en: '/en/planning' }, ...Object.keys(solutionSlugs).filter(id => findSolution(content, solutionSlugs[id])).map(id => ({ ar: solutionPath(id, 'ar'), en: solutionPath(id, 'en') }))];
  const entries = groups.flatMap(paths => (['ar', 'en'] as const).map(locale => `<url><loc>${escape(origin + paths[locale])}</loc>${(['ar', 'en'] as const).map(language => `<xhtml:link rel="alternate" hreflang="${language}" href="${escape(origin + paths[language])}"/>`).join('')}</url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}
