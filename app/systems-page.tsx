import type { Locale } from '../lib/site-content';
import { readPublicContent } from '../lib/site-server';
import CareDirectory from './care-directory';
export default async function SystemsPage({ locale }: { locale: Locale }) {
  const { content } = await readPublicContent();
  return <CareDirectory locale={locale} content={content} />;
}
