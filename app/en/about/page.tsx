import type { Metadata } from 'next';
import { readPublicContent } from '../../../lib/site-server';
import { pageMetadata, jsonLd, organizationSchema, siteOrigin } from '../../../lib/seo';
import AboutView from '../../about-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  canonical: '/en/about',
  arPath: '/about',
  enPath: '/en/about',
  title: 'About VIARA | Radiology & Medical Center Systems',
  description: 'Learn how VIARA scopes workflows, systems, integrations and rollout for radiology and medical centers.'
});

export default async function EnglishAboutPage() {
  const { content, updatedAt } = await readPublicContent();
  const org = organizationSchema(content);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About VIARA | Radiology & Medical Center Systems',
    url: `${siteOrigin()}/en/about`,
    inLanguage: 'en',
    ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString() } : {}),
    about: {
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: org.logo,
      ...(org.sameAs && org.sameAs.length ? { sameAs: org.sameAs } : {})
    }
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} /><AboutView content={content} locale="en" /></>;
}
