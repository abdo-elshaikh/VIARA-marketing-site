import type { Metadata } from 'next';
import { readPublicContent } from '../../lib/site-server';
import { pageMetadata } from '../../lib/seo';
import PlanningView from './planning-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  canonical: '/planning',
  arPath: '/planning',
  enPath: '/en/planning',
  title: 'تخطيط أنظمة الأشعة والمراكز الطبية | VIARA',
  description: 'قارن نقاط البداية، وتعرف على مراحل التنفيذ، وقدّر سعة أرشفة الصور الطبية لمركزك مع VIARA.'
});

export default async function PlanningPage({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const { content } = await readPublicContent();
  return <PlanningView content={content} locale={locale} />;
}
