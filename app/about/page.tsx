import type { Metadata } from 'next';
import { readPublicContent } from '../../lib/site-server';
import { pageMetadata, jsonLd, organizationSchema, siteOrigin } from '../../lib/seo';
import AboutView from '../about-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  canonical: '/about',
  arPath: '/about',
  enPath: '/en/about',
  title: 'عن VIARA | أنظمة لمراكز الأشعة والمراكز الطبية',
  description: 'تعرف على طريقة VIARA في دراسة سير العمل ومتطلبات الأنظمة والتكامل والتنفيذ لمراكز الأشعة والمراكز الطبية.'
});

export default async function AboutPage({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const { content, updatedAt } = await readPublicContent();
  const org = organizationSchema(content);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'عن VIARA | أنظمة لمراكز الأشعة والمراكز الطبية',
    url: `${siteOrigin()}/about`,
    inLanguage: 'ar',
    ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString() } : {}),
    about: {
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: org.logo,
      ...(org.sameAs && org.sameAs.length ? { sameAs: org.sameAs } : {})
    }
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} /><AboutView content={content} locale={locale} /></>;
}
