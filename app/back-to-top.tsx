'use client';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './back-to-top.css';

/**
 * Back to Top button.
 * Appears once the page is scrolled past one viewport height.
 */
export default function BackToTop({ locale = 'ar' }: { locale?: 'ar' | 'en' }) {
  const [visible, setVisible] = useState(false);
  const en = locale === 'en';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true });
  }

  const label = en ? 'Back to top' : 'العودة إلى الأعلى';
  return (
    <button
      type="button"
      className={`care-to-top${visible ? ' is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <ArrowUp size={20} strokeWidth={1.9} aria-hidden="true" />
    </button>
  );
}