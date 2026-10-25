import type { Metadata } from 'next';
import { readPublicContent } from '../../lib/site-server';
import { pageMetadata } from '../../lib/seo';
import JourneysView from '../journeys-view';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  canonical: '/journeys',
  arPath: '/journeys',
  enPath: '/en/journeys',
  title: 'سير عمل مراكز الأشعة والمراكز الطبية | VIARA',
  description: 'استكشف خطوات تنظيم المواعيد والفحوصات والتقارير والأرشفة والفوترة في مراكز الأشعة والمراكز الطبية.'
});
export default async function JourneysPage() {
  const { content } = await readPublicContent();
  return <JourneysView content={content} locale="ar" />;
}
