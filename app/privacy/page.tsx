import type { Metadata } from 'next';
import { readPublicContent } from '../../lib/site-server';
import { pageMetadata, jsonLd, organizationSchema, siteOrigin } from '../../lib/seo';
import PrivacyView from '../privacy-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  canonical: '/privacy',
  arPath: '/privacy',
  enPath: '/en/privacy',
  title: 'سياسة الخصوصية وحماية البيانات الطبية | VIARA',
  description: 'توضح سياسة VIARA بيانات الموقع التعريفي وطلبات التواصل وأغراض استخدامها وخيارات الوصول والحذف.',
});

export default async function PrivacyPage() {
  const { content, updatedAt } = await readPublicContent();
  const org = organizationSchema(content);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'سياسة الخصوصية وحماية البيانات الطبية | VIARA',
    url: `${siteOrigin()}/privacy`,
    inLanguage: 'ar',
    ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString() } : {}),
    publisher: {
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: org.logo,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <PrivacyView content={content} locale="ar" />
    </>
  );
}
