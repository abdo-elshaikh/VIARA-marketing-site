'use client';
import { useSiteText } from '../lib/site-copy';
import { useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  CalendarDays,
  HeartPulse,
  ScanLine,
  Pill,
  House,
  Check,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import CareFrame from './care-frame';
import { careCatalog, txt, type SiteContent, type Locale } from '../lib/site-content';
import { healthcareSystems } from '../lib/healthcare-catalog.mjs';
import { solutionPath } from '../lib/solutions';

const journeys = [
  {
    icon: CalendarDays,
    title: { ar: 'الوصول والحجز', en: 'Access & booking' },
    description: {
      ar: 'تبدأ الرعاية قبل الوصول إلى المنشأة: حجز الموعد، تنظيم العيادات، والتعرف على احتياجات المراجع.',
      en: 'Care starts before arrival: booking appointments, organizing clinics and understanding patient needs.',
    },
    team: { ar: 'الاستقبال · العيادات · تجربة المريض', en: 'Reception · Clinics · Patient experience' },
    systems: ['CMS', 'PORTAL', 'REFERRAL'],
    question: {
      ar: 'كيف يحجز المريض؟ وكيف تنتقل الإحالة إلى الفريق المناسب؟',
      en: 'How do patients book, and how do referrals reach the right team?',
    },
  },
  {
    icon: HeartPulse,
    title: { ar: 'الزيارة والرعاية السريرية', en: 'Encounter & clinical care' },
    description: {
      ar: 'من توثيق التاريخ المرضي إلى التنويم والتمريض والتخصصات؛ حدد احتياجات كل فريق ضمن ملف رعاية متصل.',
      en: 'From documenting history to inpatient care, nursing and specialties: define each team\u2019s needs around a connected care record.',
    },
    team: { ar: 'الأطباء · التمريض · الأقسام السريرية', en: 'Physicians · Nursing · Clinical departments' },
    systems: ['HIS', 'EHR', 'NURSING', 'OR', 'DENTAL', 'REHAB'],
    question: {
      ar: 'ما الأقسام والتخصصات التي تحتاج سجلات ونماذج عمل مشتركة؟',
      en: 'Which departments and specialties need shared records and workflows?',
    },
  },
  {
    icon: ScanLine,
    title: { ar: 'الفحص والتشخيص', en: 'Testing & diagnostics' },
    description: {
      ar: 'تتبع طلب الفحص والعينة والصورة والتقرير، وحدد نقاط الاتصال بين المختبر والأشعة والفريق المعالج.',
      en: 'Trace test orders, specimens, images and reports, and map the connections between labs, imaging and the treating team.',
    },
    team: { ar: 'الأشعة · المختبرات · الباثولوجي · بنك الدم', en: 'Radiology · Laboratory · Pathology · Blood bank' },
    systems: ['RIS', 'PACS', 'LIS', 'PATH', 'BLOOD'],
    question: {
      ar: 'ما الأجهزة المطلوب ربطها؟ ومن يراجع النتائج ويعتمدها؟',
      en: 'Which devices need integration, and who reviews and signs off results?',
    },
  },
  {
    icon: Pill,
    title: { ar: 'العلاج والتشغيل', en: 'Treatment & operations' },
    description: {
      ar: 'اربط متطلبات الدواء والفوترة والمطالبات مع الموارد والمشتريات والصيانة، لتكوين صورة أوضح عن تشغيل المنشأة.',
      en: 'Connect medication, billing and claims requirements with staffing, procurement and maintenance for a clearer operational picture.',
    },
    team: { ar: 'الصيدلية · المالية · الموارد البشرية · الإدارة', en: 'Pharmacy · Finance · HR · Management' },
    systems: ['PHARM', 'RCM', 'ERP', 'HR', 'ASSET', 'BI'],
    question: {
      ar: 'ما أولويات المخزون والتحصيل والجداول التي تريد تحسينها؟',
      en: 'Which inventory, collection and scheduling priorities do you want to improve?',
    },
  },
  {
    icon: House,
    title: { ar: 'المتابعة واستمرارية الرعاية', en: 'Follow-up & continuity' },
    description: {
      ar: 'تستمر رحلة المريض خارج المنشأة: متابعة عن بُعد، زيارات منزلية، إحالات، وتبادل للبيانات وفق النطاق المتفق عليه.',
      en: 'Care continues beyond the facility through remote follow-up, home visits, referrals and data exchange within an agreed scope.',
    },
    team: { ar: 'الرعاية المنزلية · المتابعة · تقنية المعلومات', en: 'Home care · Follow-up · IT' },
    systems: ['TELE', 'HOME', 'PORTAL', 'REFERRAL', 'INTEROP'],
    question: {
      ar: 'كيف تنتقل خطة الرعاية والنتائج بين المريض والفروع والفرق؟',
      en: 'How do care plans and results move between patients, branches and teams?',
    },
  },
];

export default function JourneysView({ content, locale }: { content: SiteContent; locale: Locale }) {
  const en = locale === 'en', prefix = en ? '/en' : '', home = en ? '/en' : '/';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const PrevIcon = en ? ChevronLeft : ChevronRight;
  const NextIcon = en ? ChevronRight : ChevronLeft;

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const journey = journeys[step];
  const Icon = journey.icon;
  const systems = careCatalog(content).filter(s => journey.systems.includes(s.id));

  return (
    <CareFrame content={content} locale={locale} current="journeys">
      {/* ── Hero ── */}
      <section className="jrn-hero">
        <div className="care-wrap jrn-hero-inner">
          <span className="care-eyebrow">
            <i />
            {t('من منظور المريض، إلى خريطة الأنظمة', 'FROM PATIENT EXPERIENCE TO SYSTEM DESIGN')}
          </span>
          <h1>
            {t('رحلة واحدة.', 'One journey.')}{' '}
            <em>{t('فرق متصلة.', 'Connected teams.')}</em>
          </h1>
          <p>
            {t(
              'استكشف خمس مراحل للرعاية، وتعرف على الأنظمة التي تدعم كل مرحلة. اجمع حتى ستة أنظمة لبناء نطاق تناقشه مع فريقنا.',
              'Explore five stages of care and the systems behind each one. Select up to six systems to build a scope to discuss with our team.',
            )}
          </p>
        </div>
      </section>

      {/* ── Explorer ── */}
      <section
        className="care-wrap jrn-explorer"
        aria-label={t('مستكشف رحلة الرعاية', 'Care journey explorer')}
      >
        <div className="jrn-explorer-grid">
          {/* Left: stage tabs */}
          <nav className="jrn-stages" aria-label={t('مراحل الرعاية', 'Care stages')}>
            {journeys.map((j, i) => (
              <button
                type="button"
                key={j.title.en}
                className="jrn-stage-btn"
                aria-pressed={i === step}
                aria-controls="jrn-panel"
                onClick={() => setStep(i)}
              >
                <div className="jrn-stage-icon">
                  <j.icon size={20} />
                </div>
                <div>
                  <span className="jrn-stage-num">0{i + 1}</span>
                  <span className="jrn-stage-label">{txt(j.title, locale)}</span>
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

            <h2>{txt(journey.title, locale)}</h2>
            <p className="jrn-panel-desc">{txt(journey.description, locale)}</p>

            {/* Team bar */}
            <div className="jrn-team-bar">
              <Users size={15} />
              <span>{txt(journey.team, locale)}</span>
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
                      <a href={solutionPath(s.id, locale)}>
                        {txt(s.name, locale)}
                        <Arrow size={14} />
                      </a>
                    </div>
                    <p className="jrn-system-desc">{txt(s.description, locale)}</p>
                  </div>
                  <button
                    type="button"
                    className="jrn-add-btn"
                    aria-pressed={selected.includes(s.id)}
                    disabled={!selected.includes(s.id) && selected.length >= 6}
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
              <p>{txt(journey.question, locale)}</p>
            </aside>

            {/* Pager */}
            <div className="jrn-pager">
              <button
                type="button"
                className="jrn-pager-btn"
                disabled={step === 0}
                onClick={() => setStep(s => s - 1)}
              >
                <PrevIcon size={16} />
                {t('المرحلة السابقة', 'Previous stage')}
              </button>
              <button
                type="button"
                className="jrn-pager-btn"
                disabled={step === journeys.length - 1}
                onClick={() => setStep(s => s + 1)}
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
                  {selected.length}/6
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
            <a
              className="care-btn"
              href={`${home}?systems=${encodeURIComponent(selected.join(','))}#contact`}
            >
              {t('ناقش احتياجاتك', 'Discuss your needs')}
              <Arrow size={18} />
            </a>
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
          'خريطة استرشادية للاحتياجات؛ الإتاحة والتكاملات والاشتراطات المحلية تحدد في العرض الفني. لتصفح كل المجالات،',
          'An illustrative requirements map. Availability, integrations and local requirements are defined in the technical proposal. For all areas,',
        )}{' '}
        <a href={`${prefix}/systems`}>{t('انتقل إلى دليل الأنظمة', 'visit the systems directory')}</a>.
      </p>
    </CareFrame>
  );
}
