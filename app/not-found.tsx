import { headers } from 'next/headers';
import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { readPublicContent } from '../lib/site-server';
import CareFrame from './care-frame';
import BrandPageHero from './brand-page-hero';
export default async function NotFound() {
  const en = (await headers()).get('x-viara-locale') === 'en';
  const { content } = await readPublicContent();
  const locale = en ? 'en' : 'ar', prefix = en ? '/en' : '', home = en ? '/en' : '/';
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  return <CareFrame content={content} locale={locale} current="not-found" alternatePath={en ? '/' : '/en'}><BrandPageHero locale={locale} kind="not-found" eyebrow="VIARA / 404" title={en ? 'A different path starts here.' : 'نصل معك إلى المسار الصحيح.'} description={en ? 'This page is unavailable. Explore our radiology and medical center systems, or start again from the home page.' : 'هذه الصفحة غير متاحة. يمكنك استكشاف أنظمة الأشعة والمراكز الطبية أو العودة إلى البداية.'}>
    <Link className="care-btn" href={`${prefix}/systems`}>{en ? 'Explore our systems' : 'استكشف الأنظمة'}<Arrow size={18} /></Link><Link className="care-link" href={home}>{en ? 'Back to home' : 'العودة إلى الرئيسية'}</Link>
  </BrandPageHero></CareFrame>;
}