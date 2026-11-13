'use client';

import { useEffect, useState } from 'react';
import { type Locale, type SiteContent } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';

const targets = ['choose-your-path', 'systems', 'home-workflow', 'home-planning-title', 'contact'];

export default function HomePageNavigation({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = useSiteText(locale, content);
  const [active, setActive] = useState('');
  const labels = [t('لمن صُممت؟', 'Who is it for?'), t('الأنظمة', 'Systems'), t('سير العمل', 'Workflow'), t('الباقات والتنفيذ', 'Plans & rollout'), t('تحدث معنا', 'Talk to us')];
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      let current = '';
      for (const id of targets) {
        const element = document.getElementById(id);
        const section = element?.closest('section') || element;
        if (section && section.getBoundingClientRect().top <= 210) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(read); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <nav className="home-page-nav care-wrap" aria-label={t('أقسام الصفحة الرئيسية', 'Homepage sections')}><span>{t('اكتشف VIARA', 'EXPLORE VIARA')}</span>{targets.map((id, index) => <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined}>{labels[index]}</a>)}</nav>;
}
