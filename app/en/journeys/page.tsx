import type { Metadata } from 'next';
import { readPublicContent } from '../../../lib/site-server';
import { pageMetadata } from '../../../lib/seo';
import JourneysView from '../../journeys-view';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMetadata({
  locale: 'en',
  canonical: '/en/journeys',
  arPath: '/journeys',
  enPath: '/en/journeys',
  title: 'Radiology & Medical Center Workflows | VIARA',
  description: 'Explore appointment, examination, reporting, archive and billing workflows for radiology and medical centers.'
});
export default async function JourneysPage() {
  const { content } = await readPublicContent();
  return <JourneysView content={content} locale="en" />;
}
