import type { Metadata } from 'next';
import type { Locale, SiteContent } from './site-content';

export function siteOrigin() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://viara.health').origin;
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
export function homeMetadata(content: SiteContent, locale: Locale): Metadata {
  const title = content.seo.title[locale];
  const description = content.seo.description[locale];
  return { title, description, alternates: { canonical: locale === 'en' ? '/en' : '/', languages: { ar: '/', en: '/en' } },
    openGraph: { title, description, locale: locale === 'en' ? 'en_GB' : 'ar_EG', type: 'website', images: [{ url: '/assets/viara-social.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/viara-social.png'] } };
}
export function organizationSchema(content: SiteContent) {
  return { '@context': 'https://schema.org', '@type': 'Organization', name: content.brand.name, url: siteOrigin(),
    logo: new URL(content.brand.logo, siteOrigin()).href,
    ...(content.contact.email ? { email: content.contact.email } : {}),
    ...(content.contact.phone ? { telephone: content.contact.phone } : {}),
    sameAs: [content.contact.facebook, content.contact.instagram, content.contact.linkedin, content.contact.youtube, content.contact.x].filter(Boolean) };
}
