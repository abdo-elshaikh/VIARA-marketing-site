import type { Metadata } from 'next';
import { readPublicContent } from '../../../lib/site-server';
import AboutView from '../../about-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About VIARA | Technology is the Means. Care is the Purpose.',
  description: 'Learn about the VIARA vision, clinical pillars, engineering standards, and multidisciplinary healthcare team.',
};

export default async function EnglishAboutPage() {
  const { content } = await readPublicContent();
  return <AboutView content={content} locale="en" />;
}
