'use client';
import Link from 'next/link';
import { useSiteText } from '../lib/site-copy';
import { useEffect, useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  CalendarDays,
  HeartPulse,
  ScanLine,
  Layers3,
  Receipt,
  Check,
  Plus,
  Users,
  Building2,
  Sparkles,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import CareFrame from './care-frame';
import BrandPageHero from './brand-page-hero';
import { careCatalog, txt, type SiteContent, type Locale } from '../lib/site-content';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import { solutionPath } from '../lib/solutions';
import './journeys.css';

const MAX_SCOPE_SYSTEMS = 6;

const systemBrandVisuals: Record<string, string> = {
  RIS: '/assets/systems/viara-ris-pro.jpg',
  PACS: '/assets/systems/viara-pacs-pro.jpg',
  CMS: '/assets/systems/viara-cms-pro.jpg',
  AI: '/assets/systems/hero-20261025/ai.webp',
  PORTAL: '/assets/systems/hero-20261025/portal.webp',
};

const systemIcons: Record<string, typeof ScanLine> = {
  RIS: ScanLine,
  PACS: Layers3,
  CMS: Building2,
  AI: Sparkles,
  PORTAL: Users,
};

const systemBadges: Record<string, { ar: string[]; en: string[] }> = {
  RIS: { ar: ['قوائم MWL', 'جدولة الفحوصات', 'معيار HL7'], en: ['MWL Worklists', 'Modality Scheduling', 'HL7 Standard'] },
  PACS: { ar: ['DICOM 3.0', 'عارض تشخيصي Web', 'أرشفة هجينة'], en: ['DICOM 3.0', 'Zero-Footprint Web', 'Hybrid Cloud'] },
  CMS: { ar: ['الملف الطبي EMR', 'إدارة المواعيد', 'الفوترة والتأمين'], en: ['EMR Records', 'Appointment Ops', 'Billing & Claims'] },
  AI: { ar: ['فرز الحالات الحرجة', 'فحوصات الصدر CXR', 'مسودات التقارير'], en: ['Acute Triage', 'CXR Findings', 'Report Drafts'] },
  PORTAL: { ar: ['بوابة المراجع', 'بوابة الطبيب المحيل', 'تحقق فوري QR'], en: ['Patient Portal', 'Referring Hub', 'Instant QR'] },
};

const journeys = [
  { icon: CalendarDays, systems: ['CMS', 'RIS'] },
  { icon: HeartPulse, systems: ['CMS', 'RIS'] },
  { icon: ScanLine, systems: ['RIS', 'PACS', 'AI'] },
  { icon: Layers3, systems: ['PACS'] },
  { icon: Receipt, systems: ['RIS', 'CMS', 'PORTAL'] },
];

export default function JourneysView({ content, locale }: { content: SiteContent; locale: Locale }) {
  const en = locale === 'en',
    prefix = en ? '/en' : '',
    home = en ? '/en' : '/';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const PrevIcon = en ? ChevronLeft : ChevronRight;
  const NextIcon = en ? ChevronRight : ChevronLeft;

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Share the same scope selection store as the systems directory so both pages stay in sync.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(sessionStorage.getItem('viara-system-selection') || '[]');
        if (Array.isArray(saved)) {
          setSelected(
            [
              ...new Set(
                saved.filter(
                  (id): id is string =>
                    typeof id === 'string' &&
                    marketingSystemIds.includes(id) &&
                    content.products.some(product => product.id === id && product.enabled)
                )
              ),
            ].slice(0, MAX_SCOPE_SYSTEMS)
          );
        }
      } catch {
        /* Selection is optional when browser storage is unavailable. */
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [content.products]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem('viara-system-selection', JSON.stringify(selected));
    } catch {
      /* Selection still works without storage. */
    }
  }, [selected, ready]);

  const journey = journeys[step];
  const journeyText = content.journeys[step];
  const Icon = journey.icon;
  const systems = careCatalog(content).filter(s => journey.systems.includes(s.id));

  return (
    <CareFrame content={content} locale={locale} current="journeys">
      <div className="jrn-page-wrap">
        {/* ── Master Brand Hero ── */}
        <BrandPageHero
          locale={locale}
          kind="journeys"
          eyebrow={t('رحلة المراجع السريرية، خطوة بخطوة', 'THE CLINICAL PATIENT JOURNEY, STEP BY STEP')}
          title={t('من أول حجز،', 'From the initial booking,')}
          accent={t('إلى تشخيص مكتمل واعتماد فوري.', 'to complete diagnosis and verified results.')}
          description={t(
            'اكتشف أين يخدمك كل نظام من منظومة VIARA خلال رحلة المراجع والعمل اليومي. تنقل بين مراحل العمل السريرية، ثم حدد الأنظمة الملائمة لمنشأتك لمناقشة نطاق التدشين.',
            'See where each VIARA system elevates clinical workflows across the patient journey. Explore the operational stages and select the optimal systems for your healthcare facility.'
          )}
        >
          <div className="jrn-hero-actions">
            <a className="care-btn" href="#journey-explorer">
              {t('استكشف المراحل السريرية', 'Explore clinical stages')}
              <Arrow size={18} />
            </a>
            <Link className="care-link" href={`${prefix}/systems`}>
              {t('كتالوج الأنظمة الشامل', 'Systems directory')}
              <Arrow size={17} />
            </Link>
          </div>

          {/* Quick accreditation badges */}
          <div className="jrn-hero-stats-row">
            <span className="jrn-hero-stat-pill">
              <Activity size={14} />
              <span>{t('5 مراحل عمل سريرية مترابطة', '5 Interconnected Clinical Stages')}</span>
            </span>
            <span className="jrn-hero-stat-pill">
              <ShieldCheck size={14} />
              <span>{t('تكامل تام مع بروتوكولات HL7 & DICOM', 'Full HL7 & DICOM Protocol Synergy')}</span>
            </span>
            <span className="jrn-hero-stat-pill">
              <Sparkles size={14} />
              <span>{t('مسار عمل مؤتمت بالذكاء الاصطناعي', 'AI-Augmented Radiology Triage')}</span>
            </span>
          </div>
        </BrandPageHero>

        {/* ── Main Interactive Journey Explorer ── */}
        <section
          className="care-wrap jrn-explorer"
          id="journey-explorer"
          aria-label={t('مستكشف رحلة الرعاية والتشخيص', 'Care journey explorer')}
        >
          <div className="jrn-explorer-grid">
            {/* Left: Stage Navigation Tabs */}
            <nav className="jrn-stages" aria-label={t('مراحل الرعاية', 'Care stages')}>
              {journeys.map((j, i) => (
                <button
                  type="button"
                  key={i}
                  className={`jrn-stage-btn ${i === step ? 'is-active' : ''}`}
                  aria-pressed={i === step}
                  aria-controls="jrn-panel"
                  onClick={() => {
                    setStep(i);
                    if (typeof window !== 'undefined' && window.innerWidth <= 850) {
                      document.getElementById('jrn-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                >
                  <div className="jrn-stage-icon">
                    <j.icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="jrn-stage-text">
                    <span className="jrn-stage-num">0{i + 1}</span>
                    <span className="jrn-stage-label">{txt(content.journeys[i].title, locale)}</span>
                  </div>
                  <Arrow size={15} className="jrn-stage-arrow" />
                </button>
              ))}
            </nav>

            {/* Right: Active Stage Detailed Panel */}
            <div className="jrn-panel" id="jrn-panel" aria-live="polite">
              {/* Panel Header */}
              <div className="jrn-panel-top">
                <div className="jrn-panel-badge">
                  <div className="jrn-panel-icon">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="jrn-panel-label">
                      {t('المرحلة السريرية', 'Clinical Stage')} 0{step + 1} / 05
                    </div>
                    <div className="jrn-panel-sub">{t('محطة العمل الحالية', 'Current Active Stage')}</div>
                  </div>
                </div>
              </div>

              <h2 className="jrn-stage-title">{txt(journeyText.title, locale)}</h2>
              <p className="jrn-panel-desc">{txt(journeyText.description, locale)}</p>

              {/* Responsible Clinical Team Bar */}
              <div className="jrn-team-bar">
                <Users size={16} className="jrn-team-icon" />
                <span>
                  <strong>{t('الفريق المسؤول والبيئة:', 'Responsible Team & Environment:')}</strong>{' '}
                  {txt(journeyText.team, locale)}
                </span>
              </div>

              {/* Linked Clinical Systems */}
              <div className="jrn-systems-heading">
                <h3>{t('الأنظمة المعتمدة لهذه المرحلة السريرية', 'Certified systems for this stage')}</h3>
                <span className="jrn-systems-count">
                  {systems.length} {t('أنظمة', 'systems')}
                </span>
              </div>

              <div className="jrn-systems-grid">
                {systems.map(s => {
                  const IconComp = systemIcons[s.id] || ScanLine;
                  const isChosen = selected.includes(s.id);
                  const visual = systemBrandVisuals[s.id];
                  const badges = systemBadges[s.id];

                  return (
                    <article key={s.id} className={`jrn-system-card ${isChosen ? 'is-selected' : ''}`}>
                      {/* System 3D / Brand Thumbnail */}
                      <div className="jrn-card-media">
                        <Link
                          href={solutionPath(s.id, locale)}
                          className="jrn-media-link"
                          title={txt(s.name, locale)}
                        >
                          {visual ? (
                            <img
                              src={visual}
                              alt={txt(s.name, locale)}
                              width={140}
                              height={90}
                              className="jrn-media-img"
                              loading="lazy"
                            />
                          ) : (
                            <div className="jrn-media-placeholder">
                              <IconComp size={24} />
                            </div>
                          )}
                          <span className="jrn-media-code">{s.id}</span>
                        </Link>
                      </div>

                      {/* Content Info */}
                      <div className="jrn-system-card-info">
                        <div className="jrn-system-name-row">
                          <Link href={solutionPath(s.id, locale)} className="jrn-system-title-link">
                            <span className="jrn-system-icon-mini">
                              <IconComp size={15} />
                            </span>
                            <strong>{txt(s.name, locale)}</strong>
                            <Arrow size={14} className="jrn-title-arrow" />
                          </Link>
                        </div>
                        <p className="jrn-system-desc">{txt(s.description, locale)}</p>

                        {/* Technology Badges */}
                        {badges && (
                          <div className="jrn-system-badges-row">
                            {(en ? badges.en : badges.ar).map((badge, idx) => (
                              <span key={idx} className="jrn-tech-pill">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add to Scope Button */}
                      <div className="jrn-card-action">
                        <button
                          type="button"
                          className={`jrn-add-btn ${isChosen ? 'is-active' : ''}`}
                          aria-pressed={isChosen}
                          disabled={!isChosen && selected.length >= MAX_SCOPE_SYSTEMS}
                          onClick={() =>
                            setSelected(ids =>
                              ids.includes(s.id) ? ids.filter(id => id !== s.id) : [...ids, s.id]
                            )
                          }
                          title={isChosen ? t('إزالة من النطاق', 'Remove from scope') : t('إضافة للنطاق', 'Add to scope')}
                        >
                          {isChosen ? <Check size={14} /> : <Plus size={14} />}
                          <span>{isChosen ? t('في نطاقك', 'In scope') : t('أضف للنطاق', 'Add to scope')}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Starter Question Box */}
              <aside className="jrn-question" aria-label={t('سؤال استشاري للبدء', 'Starter Advisory Question')}>
                <div className="jrn-question-header">
                  <span className="jrn-question-icon">
                    <HelpCircle size={15} />
                  </span>
                  <span className="jrn-question-label">
                    {t('نقطة انطلاق استشارية لمنشأتك', 'Consultative Starting Point for Your Facility')}
                  </span>
                </div>
                <p className="jrn-question-text">{txt(journeyText.question, locale)}</p>
              </aside>

              {/* Pager controls */}
              <div className="jrn-pager">
                <button
                  type="button"
                  className="jrn-pager-btn"
                  disabled={step === 0}
                  onClick={() => {
                    setStep(s => s - 1);
                    if (typeof window !== 'undefined' && window.innerWidth <= 850) {
                      document.getElementById('jrn-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                >
                  <PrevIcon size={16} />
                  <span>{t('المرحلة السابقة', 'Previous stage')}</span>
                </button>
                <button
                  type="button"
                  className="jrn-pager-btn"
                  disabled={step === journeys.length - 1}
                  onClick={() => {
                    setStep(s => s + 1);
                    if (typeof window !== 'undefined' && window.innerWidth <= 850) {
                      document.getElementById('jrn-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                >
                  <span>{t('المرحلة التالية', 'Next stage')}</span>
                  <NextIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Master Scope Consultation Banner ── */}
        <div className="care-wrap">
          <section className="jrn-summary" aria-labelledby="jrn-summary-title">
            <div className="jrn-summary-copy">
              <span className="jrn-summary-kicker">
                {t('الخطوة التالية · استشارة النطاق المخصص', 'NEXT STEP · CUSTOM SCOPE CONSULTATION')}
              </span>
              <h2 id="jrn-summary-title">
                {t(
                  'حوّل استكشاف المسار إلى خطة تشغيل سريرية متكاملة.',
                  'Turn your journey exploration into an integrated clinical rollout.'
                )}
              </h2>

              {selected.length > 0 ? (
                <div className="jrn-summary-chips" role="status" aria-live="polite">
                  {selected.map(id => (
                    <span key={id} className="jrn-chip">
                      <bdi>{id}</bdi>
                      <button
                        type="button"
                        onClick={() => setSelected(ids => ids.filter(item => item !== id))}
                        aria-label={`${t('إزالة', 'Remove')} ${id}`}
                        className="jrn-chip-remove"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                  <span className="jrn-chip jrn-chip-count">
                    {selected.length}/{MAX_SCOPE_SYSTEMS} {t('أنظمة مختارة', 'systems in scope')}
                  </span>
                </div>
              ) : (
                <p className="jrn-summary-status" role="status">
                  {t(
                    'اختر الأنظمة التي تخدم منشأتك خلال كل مرحلة، أو ابدأ بمناقشة مباشرة مع فريقنا الاستشاري والتقني.',
                    'Select the systems that serve your facility across each stage, or start a direct conversation with our clinical advisory team.'
                  )}
                </p>
              )}
            </div>

            <div className="jrn-summary-actions">
              <Link
                className="jrn-summary-primary-btn"
                href={
                  selected.length
                    ? `${home}?systems=${encodeURIComponent(selected.join(','))}#contact`
                    : `${home}#contact`
                }
              >
                <span>{t('ناقش متطلبات منشأتك الآن', 'Discuss your facility requirements')}</span>
                <Arrow size={18} />
              </Link>
              {selected.length > 0 && (
                <button type="button" className="jrn-clear-btn" onClick={() => setSelected([])}>
                  {t('مسح كافة الاختيارات', 'Clear all selections')}
                </button>
              )}
            </div>
          </section>
        </div>

        {/* ── Footnote ── */}
        <p className="care-wrap jrn-note">
          {t(
            'خريطة استرشادية لمسار العمل السريري؛ تُراجع متطلبات التوافق والربط المحلي والأجهزة الطبية في العرض الفني المخصص. لتصفح جميع الأنظمة بمواصفاتها،',
            'An illustrative clinical workflow map. Local integration requirements, modality connectivity, and technical specifications are reviewed in your tailored proposal. To explore all systems,'
          )}{' '}
          <Link href={`${prefix}/systems`}>{t('انتقل إلى دليل الأنظمة الكامل', 'visit the full systems directory')}</Link>.
        </p>
      </div>
    </CareFrame>
  );
}
