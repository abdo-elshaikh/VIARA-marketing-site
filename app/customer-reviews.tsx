'use client';
import Link from 'next/link';
import { useSiteText } from '../lib/site-copy';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, Quote, Star } from 'lucide-react';
import type { Locale, PublicReview } from '../lib/site-content';
import { solutionPath } from '../lib/solutions';
import './customer-reviews.css';

export default function CustomerReviews({ reviews, locale }: { reviews: PublicReview[]; locale: Locale }) {
  const en = locale === 'en';
  const t = useSiteText(locale);
  const [index, setIndex] = useState(0);
  if (!reviews.length) return null;

  const currentIndex = Math.min(index, reviews.length - 1);
  const current = reviews[currentIndex];
  const average = (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1);
  const initials = current.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('');
  const Previous = en ? ArrowLeft : ArrowRight, Next = en ? ArrowRight : ArrowLeft;
  const LinkArrow = en ? ArrowUpRight : ArrowUpLeft;
  const number = (value: number) => value.toLocaleString(en ? 'en-US' : 'ar-EG');

  return <section className="care-wrap customer-reviews" id="customer-reviews" aria-labelledby="customer-reviews-heading">
    <div className="cr-intro">
      <span className="care-eyebrow">{t('من واقع التجربة', 'FROM EVERYDAY EXPERIENCE')}</span>
      <h2 id="customer-reviews-heading">{t('أصوات من', 'Perspectives from')}<br /><span>{t('مجتمع الرعاية.', 'the care community.')}</span></h2>
      <p>{t('تجارب يشاركها عملاؤنا وفرق الرعاية، بكلماتهم ومن واقع استخدامهم.', 'Experiences shared by our customers and care teams, in their own words.')}</p>
      <div className="cr-summary">
        <div className="cr-average"><Star size={20} fill="currentColor" aria-hidden="true" /><strong><bdi>{average}</bdi><small> / 5</small></strong></div>
        <p>{t('متوسط التقييم من الآراء المنشورة', 'Average rating from published reviews')}</p>
        <span>{number(reviews.length)} {reviews.length === 1 ? t('رأي منشور', 'published review') : t('آراء منشورة', 'published reviews')}</span>
      </div>
    </div>

    <div className="cr-carousel" role="region" aria-roledescription={t('عارض آراء', 'carousel')} aria-label={t('آراء العملاء', 'Customer reviews')}>
      <figure className="cr-card" aria-live="polite" aria-atomic="true">
        <div className="cr-card-top">
          <span className="cr-quote-symbol" aria-hidden="true"><Quote size={32} strokeWidth={1.3} /></span>
          <span className="cr-rating" role="img" aria-label={`${t('التقييم', 'Rating')}: ${current.rating} ${t('من خمسة', 'out of five')}`}>
            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill={star <= current.rating ? 'currentColor' : 'none'} aria-hidden="true" />)}
          </span>
        </div>
        <blockquote className="cr-quote" lang={current.locale} dir={current.locale === 'ar' ? 'rtl' : 'ltr'}><p>{current.quote}</p></blockquote>
        <figcaption className="cr-person" lang={current.locale} dir={current.locale === 'ar' ? 'rtl' : 'ltr'}>
          <span className="cr-avatar" aria-hidden="true">{initials}</span>
          <div><strong>{current.name}</strong>{(current.role || current.organization) && <span>{[current.role, current.organization].filter(Boolean).join(' · ')}</span>}</div>
        </figcaption>
        {current.systemId && <Link className="cr-system" href={solutionPath(current.systemId, locale)}>{t('استكشف النظام المرتبط بالتجربة', 'Explore the system behind this experience')}<bdi>{current.systemId}</bdi><LinkArrow size={14} /></Link>}
      </figure>

      {reviews.length > 1 && <div className="cr-navigation">
        <div className="cr-position"><span role="status" aria-live="polite" aria-atomic="true">{number(currentIndex + 1)} / {number(reviews.length)}</span><span className="cr-progress" aria-hidden="true"><i style={{ width: `${((currentIndex + 1) / reviews.length) * 100}%` }} /></span></div>
        <div className="cr-navigation-buttons"><button type="button" disabled={currentIndex === 0} aria-label={t('الرأي السابق', 'Previous review')} onClick={() => setIndex(currentIndex - 1)}><Previous size={19} /></button><button type="button" disabled={currentIndex === reviews.length - 1} aria-label={t('الرأي التالي', 'Next review')} onClick={() => setIndex(currentIndex + 1)}><Next size={19} /></button></div>
      </div>}
    </div>
  </section>;
}
