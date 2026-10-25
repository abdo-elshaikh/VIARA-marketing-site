import type { Metadata } from 'next';
import { readPublicContent } from '../../../lib/site-server';
import { pageMetadata, jsonLd, organizationSchema, siteOrigin } from '../../../lib/seo';
import PrivacyView from '../../privacy-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  canonical: '/en/privacy',
  arPath: '/privacy',
  enPath: '/en/privacy',
  title: 'Privacy Policy & Healthcare Data Safeguards | VIARA',
  description: 'How the VIARA marketing website collects, uses and protects inquiry data, including access and deletion choices.',
});

export default async function PrivacyPageEn() {
  const { content, updatedAt } = await readPublicContent();
  const org = organizationSchema(content);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy & Healthcare Data Safeguards | VIARA',
    url: `${siteOrigin()}/en/privacy`,
    inLanguage: 'en',
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
      <PrivacyView content={content} locale="en" />
    </>
  );
}
