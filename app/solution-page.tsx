import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readPublicContent, readPublishedReviews } from '../lib/site-server';
import { txt, type Locale } from '../lib/site-content';
import { findSolution, solutionPath, solutionSlugs } from '../lib/solutions';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import { jsonLd, siteOrigin } from '../lib/seo';
import SystemExperience from './system-experience';
import { trackMarketingEvent } from '../lib/marketing-analytics';

export async function solutionMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const { content } = await readPublicContent();
  const product = findSolution(content, slug);
  if (!product) return { title: '404 | VIARA', robots: { index: false } };
  const title = `${txt(product.name, locale)} | ${content.brand.name}`;
  const description = txt(product.description, locale);
  return {
    title,
    description,
    alternates: {
      canonical: solutionPath(product.id, locale),
      languages: { ar: solutionPath(product.id, 'ar'), en: solutionPath(product.id, 'en'), 'x-default': solutionPath(product.id, 'ar') },
    },
    openGraph: {
      title,
      description,
      url: solutionPath(product.id, locale),
      locale: locale === 'ar' ? 'ar_EG' : 'en_GB',
      images: [{ url: product.image || '/assets/viara-social.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [product.image || '/assets/viara-social.png'] },
  };
}

export default async function SolutionPage({ slug, locale }: { slug: string; locale: Locale }) {
  const { content } = await readPublicContent();
  const product = findSolution(content, slug);
  if (!product) notFound();
  const reviews = content.sections.reviews ? await readPublishedReviews(product.id) : [];
  const related = marketingSystemIds.filter(id => id !== product.id).map(id => findSolution(content, solutionSlugs[id])).filter((item): item is NonNullable<typeof item> => Boolean(item)).map(item => ({ id: item.id, name: item.name }));
  const origin = siteOrigin(), home = locale === 'en' ? '/en' : '/';
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', name: txt(product.name, locale), description: txt(product.description, locale), url: origin + solutionPath(product.id, locale), inLanguage: locale },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Home' : 'الرئيسية', item: origin + home },
        { '@type': 'ListItem', position: 2, name: locale === 'en' ? 'Systems' : 'الأنظمة', item: origin + (locale === 'en' ? '/en/systems' : '/systems') },
        { '@type': 'ListItem', position: 3, name: txt(product.name, locale), item: origin + solutionPath(product.id, locale) },
      ] },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} /><SystemExperience content={content} product={product} locale={locale} reviews={content.sections.reviews ? reviews : []} related={related} /></>;
}
