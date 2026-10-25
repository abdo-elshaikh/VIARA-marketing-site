import PlanningPage from '../../planning/page';
import type { Metadata } from 'next';
import { pageMetadata } from '../../../lib/seo';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = pageMetadata({
  locale: 'en',
  canonical: '/en/planning',
  arPath: '/planning',
  enPath: '/en/planning',
  title: 'Radiology & Medical Center Planning | VIARA',
  description: 'Compare starting scopes, explore rollout steps and estimate medical image archive capacity for your center.'
});
export default async function EnglishPlanningPage() {
  return <PlanningPage locale="en" />;
}
