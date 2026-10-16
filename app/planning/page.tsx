import type { Metadata } from 'next';
import { readPublicContent } from '../../lib/site-server';
import PlanningView from './planning-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'تخطيط النطاق والأرشفة والتشغيل | VIARA',
  description: 'قدّر حجم التخزين والأرشفة المطلوبة لمنشأتك، وقارن باقات التشغيل وخطوات التحول الرقمي مع VIARA.',
};

export default async function PlanningPage({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const { content } = await readPublicContent();
  return <PlanningView content={content} locale={locale} />;
}
