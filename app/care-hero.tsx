'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, ScanLine, Images, CalendarDays, BrainCircuit, PanelsTopLeft, Pause, Play, Expand, X } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';
import { getSystemCaptures } from '../lib/system-captures';
import { solutionPath } from '../lib/solutions';
import { enabledHeroVisuals, HERO_ROTATION_MS, nextHeroId } from '../lib/home-hero-visuals';
import './care-hero.css';

const icons = { RIS: ScanLine, PACS: Images, CMS: CalendarDays, AI: BrainCircuit, PORTAL: PanelsTopLeft };
const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const readMotion = () => window.matchMedia(motionQuery).matches;
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
  const [autoPlay, setAutoPlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverTrue);
  const visible = useSyncExternalStore(subscribeVisibility, readVisibility, serverTrue);
  const viewer = useRef<HTMLDialogElement>(null);
  const current = options.find(item => item.id === selected) || options[0];
  const currentId = current?.id || '';
  const product = content.products.find(item => item.id === currentId);
  const captures = current ? (getSystemCaptures(currentId, locale)).filter(item => current.captures.includes(item.id)) : [];
  const capture = captures.find(item => item.id === screen);
  const customImage = Boolean(product?.image && !capture);
  const image = capture?.image || current?.image;
  const title = capture?.title || (customImage ? product?.headline : current?.title);
  const alt = capture?.description || (customImage ? product?.name : current?.alt);
  const nextImage = options.find(item => item.id === nextHeroId(ids, currentId))?.image;
  const running = autoPlay && !reducedMotion && visible && !hovered && !focused && options.length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setSelected(nextHeroId(idsKey.split(','), currentId));
      setScreen('concept');
    }, HERO_ROTATION_MS);
    return () => window.clearTimeout(timer);
  }, [running, idsKey, currentId]);

  useEffect(() => {
    if (!nextImage) return;
    const preload = new window.Image();
    preload.src = nextImage;
  }, [nextImage]);

  const choose = (id: string) => {
    setSelected(id);
    setScreen('concept');
    setAutoPlay(false);
  };
  const discuss = () => {
    setAutoPlay(false);
    onDiscuss(current ? [currentId] : [], current?.facility || '');
  };

  return <section className="vhero" aria-labelledby="vhero-title" onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="care-wrap">
      <div className="vhero-topline"><span>VIARA / HEALTHCARE TECHNOLOGY</span><span>{t('تقنية تتصل بيومك', 'TECHNOLOGY FOR YOUR WORKDAY')}</span></div>
      <div className="vhero-grid">
        <div className="vhero-copy">
          <span className="vhero-kicker">{txt(content.hero.badge, locale)}</span>
          <h1 id="vhero-title">{txt(content.hero.title, locale)}<em>{txt(content.hero.accent, locale)}</em></h1>
          <p>{txt(content.hero.description, locale)}</p>
          <div className="vhero-actions"><button className="care-btn" type="button" onClick={discuss}>{t('اطلب جلسة تحليل لفريقك', 'Book a workflow review')}<Arrow size={18} /></button><a href="#systems">{txt(content.hero.cta, locale)}<Forward size={17} /></a></div>
          <div className="vhero-audience"><span>{t('لمراكز الأشعة', 'Radiology centers')}</span><span>{t('للمراكز الطبية والعيادات', 'Medical centers & clinics')}</span></div>
        </div>
        <div className="vhero-gallery" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)}>
          {current && image && title && alt ? <>
            <figure className={`vhero-figure ${capture ? 'is-capture' : ''}`} id="vhero-preview">
              <a href={capture?.original || image} target="_blank" rel="noreferrer" aria-label={t('تكبير معاينة النظام', 'Enlarge system preview')} aria-haspopup="dialog" onClick={event => { if (viewer.current) { event.preventDefault(); setAutoPlay(false); viewer.current.showModal(); } }}>
                <img key={image} src={image} width={capture?.width || 1586} height={capture?.height || 992} fetchPriority="high" alt={txt(alt, locale)} />
                <span className="vhero-expand"><Expand size={17} /></span>
              </a>
              <figcaption>{capture ? t('واجهة فعلية من بيئة التشغيل السريرية؛ بيانات تجريبية.', 'Live clinical interface from demonstration environment.') : customImage ? t('صورة النظام المعتمدة من إدارة المنظومة.', 'Certified system capture from clinical management.') : t('واجهة تشغيل المنظومة المعتمدة لدى المنشآت الطبية.', 'Certified clinical interface for healthcare facilities.')}</figcaption>
            </figure>
            <div className="vhero-product" aria-live={autoPlay && !reducedMotion ? 'off' : 'polite'}><div><span><bdi>{currentId}</bdi> / {product ? txt(product.name, locale) : ''}</span><h2>{txt(title, locale)}</h2></div><Link href={solutionPath(currentId, locale)} aria-label={t('تفاصيل النظام المختار', 'Explore the selected system')}><Arrow size={21} /></Link></div>
            {captures.length > 0 && <div className="vhero-captures" role="group" aria-label={t('نوع المعاينة', 'Preview type')}><button type="button" aria-pressed={!capture} onClick={() => { setScreen('concept'); setAutoPlay(false); }}>{t('بيئة العمل السريرية (3D)', 'Clinical Suite (3D)')}</button>{captures.map(item => <button key={item.id} type="button" aria-pressed={capture?.id === item.id} onClick={() => { setScreen(item.id); setAutoPlay(false); }}>{txt(item.title, locale)}</button>)}</div>}
          </> : <div className="vhero-empty"><span>VIARA</span><h2>{t('لنبدأ من احتياجات فريقك.', 'Let’s start with your team’s needs.')}</h2><a href="#systems">{t('استكشف الحلول المتاحة', 'Explore available solutions')}<Forward size={18} /></a></div>}
        </div>
      </div>
      <div className="vhero-navigation" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)}>
        <div className="vhero-system-list" style={{ gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))` }} role="group" aria-label={t('اختر النظام', 'Choose a system')}>{options.map(item => {
          const Icon = icons[item.id as keyof typeof icons];
          const name = content.products.find(p => p.id === item.id)?.name;
          return <button type="button" key={item.id} aria-label={name ? txt(name, locale) : item.id} aria-pressed={currentId === item.id} aria-controls="vhero-preview" onClick={() => choose(item.id)}><Icon size={20} strokeWidth={1.5} /><span><bdi>{item.id}</bdi><small>{name ? txt(name, locale) : txt(item.title, locale)}</small></span>{currentId === item.id && <i key={`${currentId}-${running}`} className={running ? 'is-running' : ''} style={{ animationDuration: `${HERO_ROTATION_MS}ms` }} aria-hidden="true" />}</button>;
        })}</div>
        {options.length > 1 && <button className="vhero-playback" type="button" disabled={reducedMotion} onClick={() => setAutoPlay(value => !value)} aria-pressed={autoPlay && !reducedMotion} aria-label={reducedMotion ? t('التنقل التلقائي متوقف وفق إعداد تقليل الحركة', 'Autoplay disabled by reduced motion preference') : autoPlay ? t('إيقاف التنقل التلقائي', 'Pause automatic rotation') : t('تشغيل التنقل التلقائي', 'Start automatic rotation')}>{autoPlay && !reducedMotion ? <Pause size={17} /> : <Play size={17} />}</button>}
      </div>
    </div>
    <dialog className="vhero-dialog" ref={viewer} aria-labelledby="vhero-dialog-title" onClick={event => { if (event.target === event.currentTarget) viewer.current?.close(); }}><header><div><span>{capture ? t('واجهة التطبيق السريرية', 'CLINICAL APPLICATION SCREEN') : customImage ? t('صورة النظام المعتمدة', 'CERTIFIED SYSTEM IMAGE') : t('منظومة VIARA الطبية', 'VIARA HEALTHCARE PLATFORM')}</span><h2 id="vhero-dialog-title">{title ? txt(title, locale) : t('معاينة النظام', 'System preview')}</h2></div><button type="button" autoFocus onClick={() => viewer.current?.close()} aria-label={t('إغلاق المعاينة', 'Close preview')}><X size={22} /></button></header>{image && alt && <><img src={image} width={capture?.width || 1586} height={capture?.height || 992} alt={txt(alt, locale)} /><p>{txt(alt, locale)} · {t('واجهة مطابقة لمعايير التشغيل السريري والامتثال الطبي.', 'Compliant with clinical operational and medical standards.')}</p></>}</dialog>
  </section>;
}
