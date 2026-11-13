'use client';

import Link from 'next/link';
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ScanLine,
  Images,
  CalendarDays,
  BrainCircuit,
  PanelsTopLeft,
  Layers3,
  Check,
  Expand,
  X,
  Sparkles,
  ShieldCheck,
  MonitorCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRightCircle,
  Activity,
  Layers,
  Lock,
} from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import { heroVisuals } from '../lib/home-hero-visuals';
import { getSystemCaptures } from '../lib/system-captures';
import { solutionPath } from '../lib/solutions';
import { useSiteText } from '../lib/site-copy';
import './home-system-showcase.css';

const icons: Record<string, typeof ScanLine> = {
  RIS: ScanLine,
  PACS: Images,
  CMS: CalendarDays,
  AI: BrainCircuit,
  PORTAL: PanelsTopLeft,
};

const systemBadges: Record<string, { ar: string; en: string; color: string }> = {
  RIS: { ar: 'منظومة الأشعة الشاملة', en: 'Radiology Workflow', color: '#00875a' },
  PACS: { ar: 'أرشيف وعارض OHIF الطبي', en: 'PACS & OHIF Viewer', color: '#0284c7' },
  AI: { ar: 'ذكاء اصطناعي سريري', en: 'Clinical AI Engine', color: '#7c3aed' },
  CMS: { ar: 'إدارة العيادات والمراكز', en: 'Clinic Operations', color: '#2563eb' },
  PORTAL: { ar: 'بوابات المريض والأطباء', en: 'Portals & Verification', color: '#d97706' },
};

const systemMetaSpecs: Record<string, { ar: string[]; en: string[] }> = {
  RIS: {
    ar: ['قوائم عمل DICOM Worklist', 'إدارة دورة حياة الفحص', 'ربط الحسابات والتأمين', 'تقارير إحصائية دقيقة'],
    en: ['DICOM Worklist Protocol', 'Examination Lifecycle', 'Billing & Payers', 'Operational Analytics'],
  },
  PACS: {
    ar: ['عارض ويب OHIF v3.12 مدمج', 'إعادة بناء 3D / MPR', 'أرشفة سحابية ومحلية', 'توافق كامل DICOM 3.0'],
    en: ['Integrated OHIF v3.12 Web Viewer', '3D Volume & MPR', 'Hybrid Cloud Archive', 'DICOM 3.0 Standard'],
  },
  AI: {
    ar: ['فرز فوري للحالات الحرجة', 'توليد مسودات التقارير آلياً', 'دعم القرار الإكلينيكي', 'تحت إشراف واستقلالية الطبيب'],
    en: ['Critical Case Triage', 'Automated Report Drafting', 'Clinical Decision Support', 'Clinician Retains Oversight'],
  },
  CMS: {
    ar: ['جدولة متقدمة للمواعيد', 'إدارة شاملة لملفات المرضى', 'ربط العيادات الخارجية', 'تحصيل الفواتير والمدفوعات'],
    en: ['Advanced Scheduling', 'Unified Patient Files', 'Outpatient Clinics', 'Billing & Claims Workflow'],
  },
  PORTAL: {
    ar: ['بوابة وصول مريض سريعة', 'بوابة للأطباء المحيلين', 'تحقق فوري من التقارير بالـ QR', 'استعراض الصور والدراسات أونلاين'],
    en: ['Patient Web Portal', 'Referring Physician Portal', 'Instant QR Verification', 'Online DICOM Viewing'],
  },
};

const layoutQuery = '(max-width: 900px)';
const subscribeLayout = (notify: () => void) => {
  const media = window.matchMedia(layoutQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const readLayout = () => window.matchMedia(layoutQuery).matches;
const serverLayout = () => false;

export default function HomeSystemShowcase({
  content,
  locale,
  activeId,
  onSelect,
  onDiscuss,
}: {
  content: SiteContent;
  locale: Locale;
  activeId: string;
  onSelect: (id: string) => void;
  onDiscuss: (systems: string[], facility: string) => void;
}) {
  const t = useSiteText(locale, content);
  const en = locale === 'en';
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;

  const products = marketingSystemIds.flatMap((id) =>
    content.products.filter((product) => product.id === id && product.enabled)
  );
  const current = products.find((product) => product.id === activeId) || products[0];
  const visual = heroVisuals.find((item) => item.id === current?.id);

  // Load all system screens for the active product
  const systemScreens = current ? getSystemCaptures(current.id, locale) : [];
  const brandView = visual
    ? {
        id: 'brand-view',
        title: { ar: 'بيئة العمل السريرية (3D)', en: 'Clinical Suite (3D)' },
        description: visual.alt,
        image: visual.image,
        original: visual.image,
        width: 1586,
        height: 992,
      }
    : null;

  const captures = brandView ? [brandView, ...systemScreens] : systemScreens;

  const [screenId, setScreenId] = useState('brand-view');
  const capture = captures.find((item) => item.id === screenId) || captures[0];
  const image = capture?.image || visual?.image;
  const description = capture?.description || visual?.alt;

  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const viewer = useRef<HTMLDialogElement>(null);
  const isMobile = useSyncExternalStore(subscribeLayout, readLayout, serverLayout);

  const choose = (id: string) => {
    setScreenId('brand-view');
    onSelect(id);
  };

  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = products.length - 1;
    else if (event.key === 'ArrowDown' || event.key === (en ? 'ArrowRight' : 'ArrowLeft')) {
      next = (index + 1) % products.length;
    } else if (event.key === 'ArrowUp' || event.key === (en ? 'ArrowLeft' : 'ArrowRight')) {
      next = (index - 1 + products.length) % products.length;
    } else return;
    event.preventDefault();
    choose(products[next].id);
    tabs.current[products[next].id]?.focus();
  };

  if (!current) return null;

  const currentBadge = systemBadges[current.id] || { ar: 'حل متكامل', en: 'Integrated Solution', color: '#10b981' };
  const currentSpecs = systemMetaSpecs[current.id] || { ar: [], en: [] };

  return (
    <section className="care-site home-system-showcase" id="systems" aria-labelledby="home-systems-title">
      <div className="care-wrap">
        {/* Showcase Header */}
        <div className="hss-header-block">
          <div className="hss-header-text">
            <span className="hss-kicker">
              <Sparkles size={13} />
              <span>{t('حلول VIARA عن قرب · تفاعل واستكشف', 'VIARA SOLUTIONS IN FOCUS · INTERACTIVE LAB')}</span>
            </span>
            <h2 id="home-systems-title" className="hss-title">
              {t('اختر مسار العمل.', 'Choose your workflow.')}{' '}
              <span className="hss-title-accent">{t('تعرّف على نظامك.', 'Meet your system.')}</span>
            </h2>
            <p className="hss-subtitle">
              {t(
                'استكشف شاشات وأنظمة VIARA التشخيصية والإدارية من الداخل. تنقّل بين الأنظمة وشاهد واجهات العمل الحقيقية المجهزة لمركزك.',
                'Explore VIARA diagnostic and operational systems from within. Switch between systems and preview live workspaces tailored for your center.'
              )}
            </p>
          </div>

          <div className="hss-header-action">
            <Link href={en ? '/en/systems' : '/systems'} className="hss-catalog-btn">
              <span>{t('دليل مقارنة الأنظمة الشامل', 'Full Systems Directory & Comparison')}</span>
              <Arrow size={16} />
            </Link>
          </div>
        </div>

        {/* System Switcher Navigation Pill Bar */}
        <div
          className="hss-systems-nav"
          role="tablist"
          aria-label={t('قائمة أنظمة VIARA', 'VIARA Systems Navigation')}
        >
          {products.map((product, index) => {
            const Icon = icons[product.id] || Layers3;
            const isSelected = current.id === product.id;
            const badge = systemBadges[product.id];

            return (
              <button
                type="button"
                role="tab"
                id={`home-tab-${product.id}`}
                key={product.id}
                ref={(element) => {
                  tabs.current[product.id] = element;
                }}
                aria-selected={isSelected}
                aria-controls="home-system-panel"
                tabIndex={isSelected ? 0 : -1}
                className={`hss-nav-card ${isSelected ? 'is-selected' : ''}`}
                style={{ '--system-theme': badge?.color || '#10b981' } as React.CSSProperties}
                onKeyDown={(event) => navigate(event, index)}
                onClick={() => choose(product.id)}
              >
                <div className="hss-nav-card-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="hss-nav-card-text">
                  <div className="hss-nav-card-code">
                    <span>{product.id}</span>
                    {isSelected && <span className="hss-nav-card-dot" aria-hidden="true" />}
                  </div>
                  <strong className="hss-nav-card-name">{txt(product.name, locale)}</strong>
                </div>
              </button>
            );
          })}
        </div>

        {/* Showcase Main Stage: Glassmorphic Display Frame + Content Panel */}
        <div className="hss-stage-card" id="home-system-panel" role="tabpanel" aria-labelledby={`home-tab-${current.id}`}>
          {/* Top Panel Bar */}
          <div className="hss-stage-topbar">
            <div className="hss-stage-badge-group">
              <span className="hss-stage-code-badge" style={{ borderColor: currentBadge.color, color: currentBadge.color }}>
                <bdi>VIARA / {current.id}</bdi>
              </span>
              <span className="hss-stage-type-badge">
                <Activity size={12} style={{ color: currentBadge.color }} />
                <span>{en ? currentBadge.en : currentBadge.ar}</span>
              </span>
            </div>

            <Link href={solutionPath(current.id, locale)} className="hss-stage-link">
              <span>{t('صفحة النظام التفصيلية', 'Detailed System Page')}</span>
              <Arrow size={14} />
            </Link>
          </div>

          {/* Dual Column Layout: Content Details (Start) & Interactive Studio Monitor (End) */}
          <div className="hss-stage-grid">
            {/* Start Column: Solution Persona & Capabilities */}
            <div className="hss-stage-details">
              <div className="hss-stage-intro">
                <h3 className="hss-stage-headline">{txt(current.headline, locale)}</h3>
                <p className="hss-stage-desc">{txt(current.description, locale)}</p>
              </div>

              {/* Supported Tasks */}
              <div className="hss-stage-features-box">
                <span className="hss-box-title">
                  <ShieldCheck size={14} />
                  <span>{t('أبرز مهام وسير عمل المنظومة', 'CORE SYSTEM WORKFLOWS')}</span>
                </span>
                <ul className="hss-features-list">
                  {current.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="hss-feature-item">
                      <span className="hss-feature-check">
                        <Check size={13} strokeWidth={2.4} />
                      </span>
                      <span>{txt(feature, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Specs Tags */}
              <div className="hss-stage-specs-box">
                <span className="hss-box-title">
                  <Layers size={13} />
                  <span>{t('المواصفات والبروتوكولات المدعومة', 'SUPPORTED PROTOCOLS & SPECS')}</span>
                </span>
                <div className="hss-specs-chips">
                  {(en ? currentSpecs.en : currentSpecs.ar).map((spec, sIdx) => (
                    <span key={sIdx} className="hss-spec-chip">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hss-stage-actions">
                <Link className="hss-btn-primary" href={solutionPath(current.id, locale)}>
                  <Sparkles size={16} />
                  <span>{t('استكشف تفاصيل الحل الكاملة', 'Explore Complete Solution')}</span>
                  <Arrow size={16} />
                </Link>

                <button
                  type="button"
                  className="hss-btn-discuss"
                  onClick={() => onDiscuss([current.id], visual?.facility || '')}
                >
                  <ArrowRightCircle size={17} />
                  <span>{t('ناقش هذا النظام معنا', 'Discuss This System')}</span>
                </button>
              </div>
            </div>

            {/* End Column: Interactive Studio Frame with Live Screen Switcher */}
            <div className="hss-stage-screen-col">
              <div className="hss-monitor-frame">
                {/* Simulated Desktop Window Titlebar */}
                <div className="hss-monitor-bar">
                  <div className="hss-monitor-dots" aria-hidden="true">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>

                  <div className="hss-monitor-address">
                    <Lock size={11} className="hss-lock-icon" />
                    <span className="hss-address-url">VIARA / {current.id} / {t('معاينة ثابتة', 'STATIC PREVIEW')}</span>
                  </div>

                  <button
                    type="button"
                    className="hss-monitor-expand-btn"
                    aria-label={t('تكبير الشاشة بدقة فائقة', 'Enlarge system preview in HD')}
                    onClick={() => viewer.current?.showModal()}
                  >
                    <Expand size={14} />
                    <span className="hss-expand-label">{t('تكبير', 'Zoom')}</span>
                  </button>
                </div>

                {/* Multiple Screens Switcher Tabs (Segmented Control) */}
                {captures.length > 1 && (
                  <div className="hss-screen-switcher" role="group" aria-label={t('شاشات النظام', 'System screens')}>
                    {captures.map((item) => {
                      const isScreenActive = (capture?.id || captures[0]?.id) === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          className={`hss-screen-switch-btn ${isScreenActive ? 'is-active' : ''}`}
                          aria-pressed={isScreenActive}
                          onClick={() => setScreenId(item.id)}
                        >
                          <MonitorCheck size={13} />
                          <span>{txt(item.title, locale)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Screen Preview Visual Box */}
                {image && description && (
                  <figure className="hss-preview-box">
                    <div
                      className="hss-preview-media"
                      tabIndex={0}
                      role="button"
                      aria-label={t('تكبير معاينة الشاشة', 'Zoom preview screen')}
                      onClick={() => viewer.current?.showModal()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          viewer.current?.showModal();
                        }
                      }}
                    >
                      <img
                        key={image}
                        src={image}
                        width={capture?.width || 1680}
                        height={capture?.height || 1050}
                        loading="lazy"
                        alt={txt(description, locale)}
                        className="hss-preview-img"
                      />
                      <div className="hss-preview-overlay">
                        <span className="hss-preview-zoom-pill">
                          <Expand size={16} />
                          <span>{t('تكبير المعاينة بدقة عالية', 'Enlarge High-Definition Preview')}</span>
                        </span>
                      </div>
                    </div>

                    <figcaption className="hss-preview-caption">
                      <div className="hss-caption-title">
                        <MonitorCheck size={13} />
                        <strong>{capture ? txt(capture.title, locale) : txt(visual!.title, locale)}</strong>
                      </div>
                      <small className="hss-caption-note">
                        {capture
                          ? t(
                              'لقطة واجهة حقيقية من بيئة التشغيل التجريبية للنظام؛ آمنة وخالية من بيانات المرضى.',
                              'Real interface capture from demonstration environment; safe with zero patient records.'
                            )
                          : t('واجهة تشغيل النظام المعتمدة لدى المنشآت الطبية.', 'Certified clinical interface for healthcare facilities.')}
                      </small>
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High Definition Zoom Modal Dialog */}
      <dialog
        className="hss-zoom-dialog"
        ref={viewer}
        aria-labelledby="hss-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) viewer.current?.close();
        }}
      >
        <div className="hss-dialog-inner">
          <header className="hss-dialog-header">
            <div className="hss-dialog-title-group">
              <span className="hss-dialog-kicker">
                <Lock size={12} />
                <span>VIARA / {current.id} — {capture ? t('واجهة النظام الحقيقية', 'LIVE APPLICATION SCREEN') : t('واجهة تشغيل معتمدة', 'CERTIFIED CLINICAL INTERFACE')}</span>
              </span>
              <h2 id="hss-dialog-title" className="hss-dialog-heading">
                {capture ? txt(capture.title, locale) : txt(current.name, locale)}
              </h2>
            </div>
            <button
              type="button"
              autoFocus
              className="hss-dialog-close-btn"
              aria-label={t('إغلاق المعاينة', 'Close preview')}
              onClick={() => viewer.current?.close()}
            >
              <X size={20} />
            </button>
          </header>

          {image && description && (
            <div className="hss-dialog-body">
              <img
                src={capture?.original || image}
                width={capture?.width || 1680}
                height={capture?.height || 1050}
                alt={txt(description, locale)}
                className="hss-dialog-img"
              />
              <div className="hss-dialog-footer">
                <p className="hss-dialog-desc">
                  {txt(description, locale)}
                  {!capture && ` · ${t('صورة توضيحية لبيئة العمل.', 'Demonstration environment illustration.')}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </section>
  );
}
