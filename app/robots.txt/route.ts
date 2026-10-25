import { siteOrigin } from '../../lib/seo';
export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nAllow: /api/media/\nDisallow: /admin\nDisallow: /requests\nDisallow: /en/requests\nSitemap: ${siteOrigin()}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
