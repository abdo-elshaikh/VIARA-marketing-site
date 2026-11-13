import type { Metadata } from 'next';
import type { Locale, SiteContent } from './site-content';

export function siteOrigin() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://viara.health').origin;
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function languageAlternates(arPath: string, enPath: string) {
  return { ar: arPath, en: enPath, 'x-default': arPath };
}

export function homeMetadata(content: SiteContent, locale: Locale): Metadata {
  const title = content.seo.title[locale];
  const description = content.seo.description[locale];
  return { title, description, alternates: { canonical: locale === 'en' ? '/en' : '/', languages: languageAlternates('/', '/en') },
    openGraph: { title, description, locale: locale === 'en' ? 'en_GB' : 'ar_EG', type: 'website', images: [{ url: content.imagery.hero }] },
    twitter: { card: 'summary_large_image', title, description, images: [content.imagery.hero] } };
}

/** Metadata for a bilingual subpage: canonical, hreflang (incl. x-default) and per-locale social cards. */
export function pageMetadata(options: {
  locale: Locale;
  canonical: string;
  arPath: string;
  enPath: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, canonical, arPath, enPath, title, description } = options;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(arPath, enPath) },
    openGraph: { title, description, locale: locale === 'en' ? 'en_GB' : 'ar_EG', type: 'website', images: [{ url: '/assets/viara-social.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/viara-social.png'] }
  };
}

export function organizationSchema(content: SiteContent) {
  return { '@context': 'https://schema.org', '@type': 'Organization', name: content.brand.name, url: siteOrigin(),
    logo: new URL(content.brand.logo, siteOrigin()).href,
    ...(content.contact.email ? { email: content.contact.email } : {}),
    ...(content.contact.phone ? { telephone: content.contact.phone } : {}),
    sameAs: [content.contact.facebook, content.contact.instagram, content.contact.linkedin, content.contact.youtube, content.contact.x, content.contact.telegram, content.contact.snapchat, content.contact.github].filter(Boolean) };
}

export function websiteSchema(content: SiteContent, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: content.brand.name,
    url: siteOrigin() + (locale === 'en' ? '/en' : '/'),
    inLanguage: locale === 'en' ? 'en' : 'ar',
    description: content.seo.description[locale]
  };
}

export function faqSchema(content: SiteContent, locale: Locale) {
  if (!content.faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question[locale] || faq.question[locale === 'ar' ? 'en' : 'ar'],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale] || faq.answer[locale === 'ar' ? 'en' : 'ar']
      }
    }))
  };
}
