'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, ScanLine, CalendarDays, Images, BrainCircuit, PanelsTopLeft, Expand, X, Pause, Play } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';
import { systemCaptures } from '../lib/system-captures';
import { solutionPath } from '../lib/solutions';
import { enabledHeroVisuals, HERO_ROTATION_MS, nextHeroId } from '../lib/home-hero-visuals';
import './care-hero.css';

const icons = { RIS: ScanLine, PACS: Images, CMS: CalendarDays, AI: BrainCircuit, PORTAL: PanelsTopLeft };
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const readMotion = () => window.matchMedia(reducedMotionQuery).matches;
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
};
const readVisibility = () => !document.hidden;
const serverTrue = () => true;

export default function CareHero({ content, locale, onDiscuss }: {
  content: SiteContent;
  locale: Locale;
  onDiscuss: (systems: string[], facility: string) => void;
}) {
  const t = useSiteText(locale);
  const en = locale === 'en';
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;
  const options = enabledHeroVisuals(content.products);
  const ids = options.map(item => item.id);
  const idsKey = ids.join(',');
  const [selected, setSelected] = useState('RIS');
  const [screen, setScreen] = useState('concept');
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverTrue);
  const visible = useSyncExternalStore(subscribeVisibility, readVisibility, serverTrue);
  const viewer = useRef<HTMLDialogElement>(null);
  const current = options.find(item => item.id === selected) || options[0];
  const currentId = current?.id || '';
  const nextImage = options.find(item => item.id === nextHeroId(ids, currentId))?.image;
  const running = autoPlay && !reducedMotion && visible && !hovered && !focused && options.length > 1;
  const captures = current ? (systemCaptures[current.id] || []).filter(item => current.captures.includes(item.id)) : [];
  const capture = captures.find(item => item.id === screen);
  const product = content.products.find(item => item.id === currentId);
  const image = capture?.image || current?.image;
  const title = capture?.title || current?.title;
  const description = capture?.description || current?.alt;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setSelected(nextHeroId(idsKey.split(','), currentId));
      setScreen('concept');
    }, HERO_ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [running, currentId, idsKey]);

  useEffect(() => {
    if (nextImage) {
      const preload = new window.Image();
      preload.src = nextImage;
    }
  }, [nextImage]);

  const selectSystem = (id: string) => {
    setSelected(id);
    setScreen('concept');
    setAutoPlay(false);
  };

  return (
    <section className="home-hero vh-hero" aria-labelledby="home-hero-title">
      <div className="care-wrap vh-layout">
        <div className="vh-copy">
          <span className="vh-eyebrow"><span aria-hidden="true" />{txt(content.hero.badge, locale)}</span>
          <h1 id="home-hero-title">{txt(content.hero.title, locale)}<em>{txt(content.hero.accent, locale)}</em></h1>
          <p className="vh-intro">{txt(content.hero.description, locale)}</p>
          <div className="vh-actions">
            <button className="care-btn" type="button" onClick={() => { setAutoPlay(false); onDiscuss(current ? [current.id] : [], current?.facility || ''); }}>{t('اطلب عرضًا لفريقك', 'Request a demo for your team')}<Arrow size={19} /></button>
            <a href="#systems">{txt(content.hero.cta, locale)}<Forward size={17} /></a>
          </div>
          <div className="vh-audience"><span><ScanLine size={17} />{t('مراكز الأشعة', 'Radiology centers')}</span><span><CalendarDays size={17} />{t('المراكز الطبية والعيادات', 'Medical centers & clinics')}</span></div>
          <a className="vh-workflow" href={en ? '/en/journeys' : '/journeys'}><span>{t('من الموعد إلى التقرير', 'From appointment to report')}<small>{t('اكتشف كيف يترابط يوم العمل', 'Explore how the workday connects')}</small></span><Forward size={19} /></a>
        </div>

        <div className="vh-showcase" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
          <div className="vh-showcase-top"><span className="vh-wordmark">VIARA<span>HEALTHCARE TECHNOLOGY</span></span><span className="vh-showcase-caption">{t('مساحات تخدم فريقك', 'WORKSPACES FOR YOUR TEAM')}</span></div>
          {current && image && title && description ? <>
            <figure id="home-preview-screen" className={`vh-artwork ${capture ? 'vh-artwork-capture' : ''}`}>
              <a href={capture?.original || image} target="_blank" rel="noreferrer" aria-haspopup="dialog" aria-label={t('تكبير الصورة', 'Enlarge image')} onClick={event => { if (viewer.current) { event.preventDefault(); setAutoPlay(false); viewer.current.showModal(); } }}><img key={image} src={image} width={capture?.width || 1586} height={capture?.height || 992} fetchPriority="high" alt={txt(description, locale)} /><span className="vh-enlarge"><Expand size={16} /></span></a>
              <figcaption>{capture ? t('واجهة فعلية من النسخة المحلية؛ بيانات عرض.', 'Actual local application screen; demonstration data.') : t('تصور توضيحي مولّد بهوية VIARA، وليس واجهة فعلية.', 'AI-generated VIARA illustration, not an actual interface.')}</figcaption>
            </figure>
            <div className="vh-product-heading" aria-live={autoPlay && !reducedMotion ? 'off' : 'polite'}><div><span className="vh-product-code"><bdi>{current.id}</bdi><span aria-hidden="true" />{product ? txt(product.name, locale) : ''}</span><h2>{txt(title, locale)}</h2></div><a href={solutionPath(current.id, locale)} aria-label={t('تفاصيل النظام المختار', 'Explore the selected system')}><Arrow size={22} /></a></div>
            {captures.length > 0 && <div className="vh-capture-picker" role="group" aria-label={t('نوع المعاينة', 'Preview type')}><button type="button" aria-pressed={!capture} onClick={() => { setScreen('concept'); setAutoPlay(false); }}>{t('التصور التوضيحي', 'Illustration')}</button>{captures.map(item => <button type="button" key={item.id} aria-pressed={capture?.id === item.id} onClick={() => { setScreen(item.id); setAutoPlay(false); }}>{txt(item.title, locale)}</button>)}</div>}
            <div className="vh-controls"><div className="vh-system-selector" role="group" aria-label={t('اختر النظام', 'Choose a system')}>{options.map(item => { const Icon = icons[item.id as keyof typeof icons]; const name = content.products.find(p => p.id === item.id)?.name; return <button key={item.id} type="button" aria-label={name ? txt(name, locale) : item.id} aria-pressed={currentId === item.id} aria-controls="home-preview-screen" onClick={() => selectSystem(item.id)}><Icon size={17} /><bdi>{item.id}</bdi></button>; })}</div>
              {options.length > 1 && <button className="vh-playback" type="button" disabled={reducedMotion} onClick={() => setAutoPlay(value => !value)} aria-label={reducedMotion ? t('التنقل التلقائي متوقف وفق إعداد تقليل الحركة', 'Autoplay disabled by reduced motion preference') : autoPlay ? t('إيقاف التنقل التلقائي', 'Pause automatic rotation') : t('تشغيل التنقل التلقائي', 'Start automatic rotation')} aria-pressed={autoPlay && !reducedMotion}>{autoPlay && !reducedMotion ? <Pause size={16} /> : <Play size={16} />}</button>}
            </div>
            <div className="vh-progress" aria-hidden="true"><span key={`${currentId}-${running}`} className={running ? 'is-running' : ''} style={{ animationDuration: `${HERO_ROTATION_MS}ms` }} /></div>
          </> : <div className="vh-empty"><h2>{t('نبدأ باحتياجات فريقك.', 'Start with your team’s needs.')}</h2><p>{t('استكشف الحلول المتاحة وحدد النطاق الذي تريد مناقشته.', 'Explore available solutions and choose the scope you want to discuss.')}</p><a href="#systems">{t('استكشف الحلول', 'Explore solutions')}<Forward size={18} /></a></div>}
        </div>
      </div>
      <dialog className="vh-dialog" ref={viewer} aria-labelledby="home-screen-dialog-title" onClick={event => { if (event.target === event.currentTarget) viewer.current?.close(); }}>
        <header><div><span>{capture ? t('من داخل النظام', 'INSIDE THE SYSTEM') : t('تصور توضيحي بهوية VIARA', 'VIARA BRAND ILLUSTRATION')}</span><h2 id="home-screen-dialog-title">{title ? txt(title, locale) : t('معاينة النظام', 'System preview')}</h2></div><button type="button" autoFocus onClick={() => viewer.current?.close()} aria-label={t('إغلاق المعاينة', 'Close preview')}><X size={22} /></button></header>
        {image && description && <><img src={image} width={capture?.width || 1586} height={capture?.height || 992} alt={txt(description, locale)} /><p>{txt(description, locale)}{!capture && ` · ${t('صورة مولدة بالذكاء الاصطناعي، وليست واجهة فعلية.', 'AI-generated illustration, not an actual interface.')}`}</p></>}
      </dialog>
    </section>
  );
}
