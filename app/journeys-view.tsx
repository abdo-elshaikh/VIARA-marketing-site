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
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import CareFrame from './care-frame';
import BrandPageHero from './brand-page-hero';
import { careCatalog, txt, type SiteContent, type Locale } from '../lib/site-content';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import { solutionPath } from '../lib/solutions';
import './journeys.css';

const MAX_SCOPE_SYSTEMS = 6;

const journeys = [
  { icon: CalendarDays, systems: ['CMS', 'RIS'] },
  { icon: HeartPulse, systems: ['CMS', 'RIS'] },
  { icon: ScanLine, systems: ['RIS', 'PACS', 'AI'] },
  { icon: Layers3, systems: ['PACS'] },
  { icon: Receipt, systems: ['RIS', 'CMS', 'PORTAL'] },
];

export default function JourneysView({ content, locale }: { content: SiteContent; locale: Locale }) {
  const en = locale === 'en', prefix = en ? '/en' : '', home = en ? '/en' : '/';
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
          setSelected([...new Set(saved.filter((id): id is string => typeof id === 'string' && marketingSystemIds.includes(id) && content.products.some(product => product.id === id && product.enabled)))].slice(0, MAX_SCOPE_SYSTEMS));
        }
      } catch { /* Selection is optional when browser storage is unavailable. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [content.products]);
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem('viara-system-selection', JSON.stringify(selected)); } catch { /* Selection still works without storage. */ }
  }, [selected, ready]);

  const journey = journeys[step];
  const journeyText = content.journeys[step];
  const Icon = journey.icon;
  const systems = careCatalog(content).filter(s => journey.systems.includes(s.id));

  return (
    <CareFrame content={content} locale={locale} current="journeys">
      {/* ── Hero ── */}
      <BrandPageHero locale={locale} kind="journeys" eyebrow={t('رحلة المراجع، خطوة بخطوة', 'THE PATIENT JOURNEY, STEP BY STEP')} title={t('من أول موعد،', 'From the first booking,')} accent={t('إلى صورة مكتملة.', 'to the complete picture.')} description={t('اكتشف أين يخدمك كل نظام خلال رحلة المراجع. تنقل بين مراحل العمل، ثم اختر أنظمة الأشعة والمركز الطبي التي تريد مناقشتها.', 'See where each system fits in the patient journey. Explore the stages and choose the radiology and medical center systems you want to discuss.')}>
        <a className="care-btn" href="#journey-explorer">{t('استكشف المراحل', 'Explore the stages')}<Arrow size={18} /></a><Link className="care-link" href={`${prefix}/systems`}>{t('تعرّف على الأنظمة', 'Meet the systems')}<Arrow size={17} /></Link>
      </BrandPageHero>

      {/* ── Explorer ── */}
      <section
        className="care-wrap jrn-explorer" id="journey-explorer"
        aria-label={t('مستكشف رحلة الرعاية', 'Care journey explorer')}
      >
        <div className="jrn-explorer-grid">
          {/* Left: stage tabs */}
          <nav className="jrn-stages" aria-label={t('مراحل الرعاية', 'Care stages')}>
            {journeys.map((j, i) => (
              <button
                type="button"
                key={i}
                className="jrn-stage-btn"
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
                  <j.icon size={20} />
                </div>
                <div>
                  <span className="jrn-stage-num">0{i + 1}</span>
                  <span className="jrn-stage-label">{txt(content.journeys[i].title, locale)}</span>
                </div>
                <Arrow size={15} className="jrn-stage-arrow" />
              </button>
            ))}
          </nav>

          {/* Right: panel */}
          <div className="jrn-panel" id="jrn-panel" aria-live="polite">
            {/* Panel header */}
            <div className="jrn-panel-top">
              <div className="jrn-panel-badge">
                <div className="jrn-panel-icon">
                  <Icon size={26} />
                </div>
                <div>
                  <div className="jrn-panel-label">0{step + 1} / 05</div>
                  <div style={{ fontSize: 13, color: 'var(--care-muted)', marginTop: 2 }}>
                    {t('المرحلة الحالية', 'Current stage')}
                  </div>
                </div>
              </div>
            </div>

            <h2>{txt(journeyText.title, locale)}</h2>
            <p className="jrn-panel-desc">{txt(journeyText.description, locale)}</p>

            {/* Team bar */}
            <div className="jrn-team-bar">
              <Users size={15} />
              <span>{txt(journeyText.team, locale)}</span>
            </div>

            {/* Systems */}
            <div className="jrn-systems-heading">
              <h3>{t('الأنظمة المرتبطة بهذه المرحلة', 'Systems for this stage')}</h3>
              <span className="jrn-systems-count">{systems.length}</span>
            </div>

            <div className="jrn-systems-grid">
              {systems.map(s => (
                <article key={s.id} className={`jrn-system-card${selected.includes(s.id) ? ' is-selected' : ''}`}>
                  <div className="jrn-system-card-info">
                    <bdi className="jrn-system-id">{s.id}</bdi>
                      <div className="jrn-system-name-row">
                        <Link href={solutionPath(s.id, locale)}>
                          {txt(s.name, locale)}
                          <Arrow size={14} />
                        </Link>
                      </div>
                    <p className="jrn-system-desc">{txt(s.description, locale)}</p>
                  </div>
                  <button
                    type="button"
                    className="jrn-add-btn"
                    aria-pressed={selected.includes(s.id)}
                    disabled={!selected.includes(s.id) && selected.length >= MAX_SCOPE_SYSTEMS}
                    onClick={() =>
                      setSelected(ids =>
                        ids.includes(s.id) ? ids.filter(id => id !== s.id) : [...ids, s.id],
                      )
                    }
                  >
                    {selected.includes(s.id) && <Check size={14} />}
                    {selected.includes(s.id) ? t('تم الاختيار', 'Selected') : t('أضف للنطاق', 'Add to scope')}
                  </button>
                </article>
              ))}
            </div>

            {/* Starter question */}
            <aside className="jrn-question">
              <div className="jrn-question-label">{t('سؤال نبدأ به معك', 'A starting question')}</div>
              <p>{txt(journeyText.question, locale)}</p>
            </aside>

            {/* Pager */}
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
                {t('المرحلة السابقة', 'Previous stage')}
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
                {t('المرحلة التالية', 'Next stage')}
                <NextIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Summary / scope section ── */}
      <div className="care-wrap">
        <section className="jrn-summary">
          <div className="jrn-summary-copy">
            <span className="care-eyebrow">
              <i />
              {t('نطاقك المبدئي', 'YOUR INITIAL SCOPE')}
            </span>
            <h2>{t('حوّل استكشافك إلى خطوة عملية.', 'Turn exploration into a next step.')}</h2>
            {selected.length > 0 ? (
              <div className="jrn-summary-chips" role="status" aria-live="polite">
                {selected.map(id => (
                  <span key={id} className="jrn-chip">{id}</span>
                ))}
                <span className="jrn-chip" style={{ background: 'var(--care-green)', color: '#fff', borderColor: 'var(--care-green)' }}>
                  {selected.length}/{MAX_SCOPE_SYSTEMS}
                </span>
              </div>
            ) : (
              <p className="jrn-summary-status" role="status">
                {t(
                  'اختر الأنظمة من أي مرحلة، أو ابدأ بمحادثة عن احتياجات منشأتك.',
                  'Choose systems from any stage, or start with a conversation about your facility.',
                )}
              </p>
            )}
          </div>
          <div className="jrn-summary-actions">
            <Link
              className="care-btn"
              href={selected.length ? `${home}?systems=${encodeURIComponent(selected.join(','))}#contact` : `${home}#contact`}
            >
              {t('ناقش احتياجاتك', 'Discuss your needs')}
              <Arrow size={18} />
            </Link>
            {selected.length > 0 && (
              <button type="button" className="jrn-clear-btn" onClick={() => setSelected([])}>
                {t('مسح الاختيارات', 'Clear selection')}
              </button>
            )}
          </div>
        </section>
      </div>

      {/* ── Footnote ── */}
      <p className="care-wrap jrn-note">
        {t(
          'خريطة استرشادية للاحتياجات؛ تُراجع الإتاحة والتكاملات والاشتراطات المحلية في العرض الفني. لتصفح الأنظمة الحالية،',
          'An illustrative requirements map. Availability, integrations and local requirements are reviewed in the technical proposal. Explore the current systems,',
        )}{' '}
        <Link href={`${prefix}/systems`}>{t('انتقل إلى دليل الأنظمة', 'visit the systems directory')}</Link>.
      </p>
    </CareFrame>
  );
}
