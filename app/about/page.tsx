import type { Metadata } from 'next';
import { readPublicContent } from '../../lib/site-server';
import AboutView from '../about-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'عن VIARA | التقنية وسيلة. الرعاية هي الغاية.',
  description: 'تعرف على رؤية VIARA، ركائزنا السريرية والهندسية، المعايير الدولية المعتمدة، وفريق العمل المكرس لتطوير المنشآت الطبية.',
};

export default async function AboutPage({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const { content } = await readPublicContent();
  return <AboutView content={content} locale={locale} />;
}
