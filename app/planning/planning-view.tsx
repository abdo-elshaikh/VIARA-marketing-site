'use client';

import { useEffect, useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  Sparkles,
  Building2,
  Clock,
  ShieldCheck,
  Server,
  Layers,
  Activity,
  Plus,
  Route,
  Stethoscope,
  Users,
  Cpu
} from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../../lib/site-content';
import ScopeCalculator from '../scope-calculator';
import type { ScopeEstimate } from '../../lib/inquiry';
import CareFrame from '../care-frame';

interface PlanDetail {
  id: string;
  facilityScope: { ar: string; en: string };
  timeline: { ar: string; en: string };
  sla: { ar: string; en: string };
  highlights: { ar: string; en: string }[];
}

const planDetails: Record<string, PlanDetail> = {
  أساس: {
    id: 'أساس',
    facilityScope: { ar: 'العيادات والمراكز الأولية (1 - 3 فروع)', en: 'Clinics & Primary Care (1 - 3 Branches)' },
    timeline: { ar: 'جاهزية خلال 2 - 3 أسابيع', en: 'Ready in 2 - 3 weeks' },
    sla: { ar: 'دعم فني واستجابة سريعة في ساعات العمل', en: 'Standard Business Hours Support & SLA' },
    highlights: [
      { ar: 'الملف الطبي السريري وجدولة المواعيد الذكية', en: 'Core Electronic Medical Record & Smart Scheduling' },
      { ar: 'إدارة الفواتير والتقارير المالية الأساسية', en: 'Essential Billing, Invoices & Financial Reports' },
      { ar: 'إعداد قاعدة البيانات واستيراد سجلات المرضى', en: 'Initial Database Setup & Patient Data Import' },
      { ar: 'تدريب تفاعلي للكوادر الطبية والاستقبال', en: 'Interactive Clinical & Reception Team Training' },
    ],
  },
  نمو: {
    id: 'نمو',
    facilityScope: { ar: 'المجمعات المتنامية ومراكز الأشعة والمختبر', en: 'Growing Polyclinics, Radiology & Labs' },
    timeline: { ar: 'جاهزية خلال 3 - 5 أسابيع', en: 'Ready in 3 - 5 weeks' },
    sla: { ar: 'دعم متقدم 24/7 مع مدير حساب سريري', en: '24/7 Priority Support & Dedicated Account Manager' },
    highlights: [
      { ar: 'جميع مزايا باقة أساس مع توسعة غير محدودة', en: 'All Essential features with multi-specialty expansion' },
      { ar: 'ربط أجهزة الأشعة DICOM أو المحللات المخبرية', en: 'DICOM Modality Worklist or Analyzer Integration' },
      { ar: 'بوابة المريض الرقمية لحجز المواعيد والنتائج', en: 'Patient Portal for Reports, Images & Mobile Booking' },
      { ar: 'محرك التحقق اللحظي من الأهلية والمطالبات NPHIES', en: 'NPHIES Instant Eligibility & Clean Claim Scrubber' },
      { ar: 'لوحات مؤشرات تشغيلية حية للإدارة والإنتاجية', en: 'Live Clinical & Financial Performance Dashboards' },
    ],
  },
  مؤسسات: {
    id: 'مؤسسات',
    facilityScope: { ar: 'المستشفيات والشبكات الطبية والمراكز الكبرى', en: 'Hospitals, Multi-Hospital Networks & Enterprise' },
    timeline: { ar: 'خطة تنفيذ مخصصة متعددة المراحل', en: 'Phased Enterprise Rollout Blueprint' },
    sla: { ar: 'اتفاقية مستوى خدمة 99.98% مع مهندسي موقع', en: '99.98% High-Availability SLA & On-Site Engineers' },
    highlights: [
      { ar: 'نطاق استضافة مؤسسي كامل (سحابي خاص أو محلي On-Premise)', en: 'Enterprise Private Cloud or On-Premise Cluster' },
      { ar: 'محرك الربط الشامل HL7 FHIR ومزامنة الأنظمة القائمة', en: 'HL7 FHIR Interoperability Bus & Legacy Data Migration' },
      { ar: 'إدارة التنويم والأسرّة وغرف العمليات وبنوك الدم', en: 'Inpatient Census, OR Surgical Scheduling & Blood Bank' },
      { ar: 'محاكاة سريرية ميدانية وتدريب شامل على الورديات', en: 'Clinical Simulation Dry-Runs & Shift Training' },
      { ar: 'فريق دعم ومراقبة سيبرانية مخصص على مدار الساعة', en: 'Dedicated 24/7/365 Medical Ops & Cyber Defense' },
    ],
  },
};

const rolloutRoadmap = [
  {
    num: '01',
    time: { ar: 'الأسبوع الأول', en: 'Week 1' },
    title: { ar: 'الاستكشاف وتحليل الفجوات السريرية', en: 'Discovery & Clinical Gap Analysis' },
    body: {
      ar: 'نجلس مع قيادات الأقسام الطبية والإدارية لفهم سير العمل القائم، فحص الأجهزة الطبية، وتحديد أولويات الربط ونطاق الصلاحيات بدقة.',
      en: 'We consult with department heads to audit existing workflows, evaluate biomedical devices, and define integration priorities and security roles.',
    },
    deliverable: { ar: 'مخرجات: وثيقة النطاق المعماري وخطة الربط', en: 'Deliverable: Architectural Blueprint' },
  },
  {
    num: '02',
    time: { ar: 'الأسبوع الثاني والثالث', en: 'Weeks 2 - 3' },
    title: { ar: 'هندسة التكامل والأمان السيبراني', en: 'Integration & Cyber-Architecture' },
    body: {
      ar: 'تهيئة الخوادم وقواعد البيانات، عزل السجلات الطبية وفق معايير الأمن السيبراني، وتفعيل قنوات الربط المعياري (HL7 FHIR, DICOM, NPHIES).',
      en: 'Provisioning secure servers, data isolation per healthcare compliance, and enabling standard protocols (HL7 FHIR, DICOM, NPHIES).',
    },
    deliverable: { ar: 'مخرجات: بيئة تجريبية متصلة بالكامل', en: 'Deliverable: Staging Test Environment' },
  },
  {
    num: '03',
    time: { ar: 'الأسبوع الرابع', en: 'Week 4' },
    title: { ar: 'المحاكاة السريرية وتدريب الكوادر', en: 'Clinical Simulation & Staff Training' },
    body: {
      ar: 'تشغيل تجريبي يحاكي يوماً طبياً كاملاً، تدريب عملي للأطباء والتمريض وموظفي الاستقبال، والتأكد من سهولة استخدام كافة الواجهات.',
      en: 'Conducting full-day clinical dry-runs, hands-on training for physicians, nurses, and reception, ensuring fluid daily workflows.',
    },
    deliverable: { ar: 'مخرجات: شهادة الجاهزية التشغيلية للفرق', en: 'Deliverable: Operational Readiness Sign-off' },
  },
  {
    num: '04',
    time: { ar: 'الانطلاق وما بعده', en: 'Go-Live & Beyond' },
    title: { ar: 'التشغيل الحي والرعاية الفائقة 24/7', en: 'Live Go-Live & 24/7 Hypercare' },
    body: {
      ar: 'بدء استقبال المرضى على النظام الجديد مع تواجد مباشر لمهندسينا، مراقبة حية لمعدلات الاستجابة والأرشفة، واستقرار تشغيلي تام بدون انقطاع.',
      en: 'Commencing live patient admissions with on-site engineering presence, real-time telemetry monitoring, and zero clinical disruption.',
    },
    deliverable: { ar: 'مخرجات: تقرير الاستقرار ومتابعة SLA', en: 'Deliverable: Live Hypercare & SLA Assurance' },
  },
];

const planningFaqs = [
  {
    id: 'pfaq-migration',
    question: {
      ar: 'هل يمكن نقل سجلات المرضى والأشعة من أنظمتنا القديمة؟',
      en: 'Can we migrate patient records and imaging studies from our legacy systems?',
    },
    answer: {
      ar: 'نعم بالتأكيد. لدينا محركات ترحيل متخصصة تستخرج السجلات وتفحص سلامتها وتطابقها مع معايير HL7 FHIR و DICOM Part 10 دون فقدان أي دراسات سابقة، مع توفير خطة تدريجية تضمن استمرار العمل دون توقف.',
      en: 'Yes. We employ specialized healthcare ETL pipelines that extract, cleanse, and validate data against HL7 FHIR and DICOM Part 10 standards with zero study loss and zero clinic downtime.',
    },
  },
  {
    id: 'pfaq-cloud-prem',
    question: {
      ar: 'هل يمكن الاستضافة محلياً (On-Premise) أم سحابياً فقط؟',
      en: 'Do you offer On-Premise deployment or cloud-only hosting?',
    },
    answer: {
      ar: 'ندعم كلا النموذجين بكفاءة متطابقة: استضافة سحابية خاصة معتمدة محلياً تلبي أعلى متطلبات حماية البيانات الصحية، أو تركيب محلي داخل مركز بيانات المستشفى (On-Premise Cluster) مع خيارات التكرار الجغرافي والنسخ الاحتياطي الهجين.',
      en: 'We support both models: certified local private healthcare clouds meeting data sovereignty standards, or on-premise hospital clusters with automated geographic replication.',
    },
  },
  {
    id: 'pfaq-devices',
    question: {
      ar: 'كيف يتم ربط أجهزة الأشعة والمختبر القائمة؟',
      en: 'How are existing radiology modalities and laboratory analyzers connected?',
    },
    answer: {
      ar: 'يتكامل نظامنا مباشرة عبر بروتوكولات DICOM 3.0 (C-STORE, C-FIND, MWL, MPPS) لأجهزة الرنين والأشعة المقطعية والموجات الصوتية، وعبر ASTM / HL7 لمحللات الدم والمختبر بمجرد إعداد الشبكة الطبية الداخلية.',
      en: 'Our platform interfaces natively via DICOM 3.0 (C-STORE, C-FIND, MWL, MPPS) for MRI, CT, and Ultrasound, and via ASTM / HL7 protocols for automated lab analyzers.',
    },
  },
  {
    id: 'pfaq-pricing',
    question: {
      ar: 'كيف يتم احتساب تكلفة الباقات والمشاريع؟',
      en: 'How is package and project pricing calculated?',
    },
    answer: {
      ar: 'تعتمد التكلفة على عدد المستخدمين الفعالين، عدد الفروع، وحدات الأنظمة المطلوبة، وحجم تخزين الأرشفة. نقدم عروضاً مرنة تشمل نموذج الاشتراك التشغيلي (SaaS) أو الترخيص الدائم مع اتفاقيات صيانة سنوية محددة.',
      en: 'Pricing is based on active users, branch volume, selected modules, and archive storage requirements. We offer flexible SaaS subscription models or perpetual enterprise licenses with maintenance SLAs.',
    },
  },
];

export default function PlanningView({ content, locale = 'ar' }: { content: SiteContent; locale?: Locale }) {
  const en = locale === 'en';
  const home = en ? '/en' : '/';
  const t = (ar: string, english: string) => (en ? english : ar);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  const [storageError, setStorageError] = useState(false);

  function choose(estimate: ScopeEstimate) {
    try {
      sessionStorage.setItem('viara-planned-scope', JSON.stringify(estimate));
      location.href = `${home}?interest=PACS#contact`;
    } catch {
      setStorageError(true);
    }
  }

  // Intersection Observer for scroll animations.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const enabledPlans = content.plans.filter(p => p.enabled);

  return (
    <CareFrame content={content} locale={locale} current="planning">
      <div className="care-wrap cp-page-wrap">
        {/* Executive Planning Hero Banner */}
        <section className="cp-hero" aria-labelledby="cp-heading">
          <img
            src="/assets/scenes/healthcare-command.jpg"
            alt={t('غرفة قيادة وتحكم تقني صحي', 'Healthcare command center scene')}
            className="cp-hero-bg"
            loading="eager"
          />
          <div className="cp-hero-content">
            <span className="cp-eyebrow">
              <Sparkles size={13} />
              {t('منهجية تنفيذ معتمدة لمنشأتك', 'CERTIFIED IMPLEMENTATION METHODOLOGY FOR YOUR FACILITY')}
            </span>

            <h1 id="cp-heading">
              {t('خطط انتقالك الرقمي.', 'Plan your digital health rollout.')}
              <br />
              <em>{t('خطوة بخطوة، بلا انقطاع.', 'Step by step, with zero disruption.')}</em>
            </h1>

            <p>
              {t(
                'استكشف الباقات المعتمدة، وافهم مراحل التنفيذ خطوة بخطوة، وقدّر سعة الأرشفة التخزينية المطلوبة لمنشأتك. نوفر لك كل ما تحتاجه لاتخاذ قرار مدروس قبل الانطلاق دون أي انقطاع لخدمة المرضى.',
                'Explore certified tiers, follow our phased rollout step by step, and estimate your archive storage needs. Everything you need to make an informed decision before go-live — with zero disruption to patient care.'
              )}
            </p>

            <a className="care-btn" href="#packages">
              <span>{t('استكشف الباقات ومراحل التنفيذ', 'Explore Packages & Roadmap')}</span>
              <Arrow size={17} />
            </a>
          </div>

          {/* Operational Metrics Telemetry Strip */}
          <div className="cp-telemetry-grid" aria-label={t('مؤشرات الجاهزية التشغيلية', 'Operational readiness stats')}>
            <div className="cp-telemetry-item">
              <span className="cp-telemetry-val">99.98%</span>
              <span className="cp-telemetry-lbl">{t('توافق تشغيلي معتمد (SLA Uptime)', 'Guaranteed SLA Uptime')}</span>
            </div>
            <div className="cp-telemetry-item">
              <span className="cp-telemetry-val">100%</span>
              <span className="cp-telemetry-lbl">{t('معايير HL7 FHIR و DICOM مفتوحة', 'Standard HL7 FHIR & DICOM')}</span>
            </div>
            <div className="cp-telemetry-item">
              <span className="cp-telemetry-val">4 {t('مراحل', 'Phases')}</span>
              <span className="cp-telemetry-lbl">{t('منهجية تدريجية بدون انقطاع', 'Seamless Phased Rollout')}</span>
            </div>
            <div className="cp-telemetry-item">
              <span className="cp-telemetry-val">2 - 4 {t('أسابيع', 'Wks')}</span>
              <span className="cp-telemetry-lbl">{t('متوسط مدة الإطلاق الأولي', 'Avg. Initial Deployment')}</span>
            </div>
          </div>
        </section>

        {/* Plans & Packages Comparator Section */}
        <section className="cp-plans-section" id="packages" aria-labelledby="cp-packages-head">
          <div className="cp-section-head">
            <span className="care-eyebrow">
              <Layers size={14} />
              {t('باقات النطاق والتشغيل', 'TIERS & SCOPES')}
            </span>
            <h2 id="cp-packages-head">{t('اختر النطاق الذي يلائم مرحلة منشأتك.', 'Select the scope that fits your stage.')}</h2>
            <p>
              {t(
                'باقات متدرجة مصممة هندسياً لتمنحك الأدوات الأساسية للتشغيل، مع قابلية توسع فورية لربط الفروع والأقسام الإضافية في أي وقت.',
                'Engineered tiers providing core operational workflows with instant scalability to connect branches and modalities as you grow.'
              )}
            </p>
          </div>

          <div className="cp-plans-grid">
            {enabledPlans.map(p => {
              const detail = planDetails[p.id];
              const isGrowth = p.id === 'نمو';

              return (
                <article key={p.id} className={`cp-plan-card ${isGrowth ? 'is-featured' : ''}`}>
                  {isGrowth && (
                    <span className="cp-plan-featured-tag">
                      <Sparkles size={12} />
                      {t('الباقة الأكثر طلباً', 'Most Popular')}
                    </span>
                  )}

                  <div className="cp-plan-card-head">
                    <bdi className="cp-plan-code">{p.label}</bdi>
                    <span className="cp-plan-sla">
                      {detail ? txt(detail.sla, locale) : t('دعم فني معتمد', 'Standard SLA')}
                    </span>
                  </div>

                  <h3>{txt(p.name, locale)}</h3>
                  <p className="cp-plan-desc">{txt(p.description, locale)}</p>

                  <div className="cp-plan-price-wrap">
                    <span className="cp-plan-price">{txt(p.price, locale)}</span>
                    <span className="cp-plan-sla">{t('دراسة فنية مخصصة', 'Tailored proposal')}</span>
                  </div>

                  {/* Metadata Pills */}
                  {detail && (
                    <div className="cp-plan-meta-pills">
                      <div className="cp-plan-pill">
                        <Building2 size={14} />
                        <span>{txt(detail.facilityScope, locale)}</span>
                      </div>
                      <div className="cp-plan-pill">
                        <Clock size={14} />
                        <span>{txt(detail.timeline, locale)}</span>
                      </div>
                    </div>
                  )}

                  {/* Features List */}
                  <ul className="cp-plan-features-list">
                    {(detail?.highlights || p.features.map(f => ({ ar: txt(f, 'ar'), en: txt(f, 'en') }))).map(
                      (item, i) => (
                        <li key={i}>
                          <Check size={16} />
                          <span>{txt(item, locale)}</span>
                        </li>
                      )
                    )}
                  </ul>

                  <a
                    className="care-btn"
                    href={`${home}?plan=${encodeURIComponent(p.id)}#contact`}
                  >
                    <span>{t('ناقش هذه الباقة مع خبرائنا', 'Discuss this tier with our team')}</span>
                    <Arrow size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4-Phase Rollout Roadmap */}
        <section className="cp-rollout-section" aria-labelledby="cp-roadmap-head">
          <div className="cp-section-head">
            <span className="care-eyebrow">
              <Route size={14} />
              {t('مسار التنفيذ المعتمد', 'THE CERTIFIED ROLLOUT PATH')}
            </span>
            <h2 id="cp-roadmap-head">{t('من دراسة الاحتياج إلى التشغيل الكامل.', 'From gap analysis to operational go-live.')}</h2>
            <p>
              {t(
                'منهجية تدريجية في 4 محطات واضحة تضمن تدريب الكوادر، تكامل الأجهزة، وسلامة تدفق البيانات السريرية.',
                'A rigorous 4-stage methodology guaranteeing clinical training, device interoperability, and data security.'
              )}
            </p>
          </div>

          <div className="cp-timeline">
            <div className="cp-timeline-grid">
              {rolloutRoadmap.map(step => (
                <div key={step.num} className="cp-tl-step animate-on-scroll">
                  <div className="cp-tl-dot">{step.num}</div>
                  <div className="cp-tl-body">
                    <div className="cp-tl-time">{txt(step.time, locale)}</div>
                    <h3>{txt(step.title, locale)}</h3>
                    <p>{txt(step.body, locale)}</p>
                    <div className="cp-tl-deliverable">
                      <ShieldCheck size={13} />
                      <span>{txt(step.deliverable, locale)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Archive Storage Estimator */}
        <section className="cp-estimator-section" aria-labelledby="cp-calc-head">
          <div className="cp-section-head">
            <span className="care-eyebrow">
              <Cpu size={14} />
              {t('أداة التخطيط السحابي والتخزين', 'STORAGE & ARCHIVE ESTIMATOR')}
            </span>
            <h2 id="cp-calc-head">{t('قدّر سعة أرشفة الصور الطبية (PACS).', 'Estimate PACS archive capacity.')}</h2>
            <p>
              {t(
                'احسب حجم التخزين التقديري سنوياً بناءً على عدد الأجهزة ومعدل الفحوصات وسنوات الحفظ القانونية، مع إمكانية إرفاق التقدير مباشرة مع طلبك.',
                'Calculate your yearly medical data footprint based on modalities, daily study volume, and regulatory retention requirements.'
              )}
            </p>
          </div>

          <div className="cp-estimator-box">
            <ScopeCalculator locale={locale} onChoose={choose} />
            {storageError && (
              <p role="alert" className="care-note" style={{ color: '#b91c1c' }}>
                {t(
                  'تعذر حفظ التقدير محلياً. يمكنك تدوين الأرقام أو استخدام الحاسبة داخل نموذج التواصل مباشرة.',
                  'Local storage is restricted in this browser. You can reference your numbers directly in the inquiry form.'
                )}
              </p>
            )}
          </div>
        </section>

        {/* Rollout & Planning FAQs */}
        <section className="cp-faq-section" aria-labelledby="cp-faq-head">
          <div className="cp-faq-grid">
            <div className="cp-section-head">
              <span className="care-eyebrow">
                <Activity size={14} />
                {t('أسئلة واستفسارات شائعة', 'FREQUENT QUESTIONS')}
              </span>
              <h2 id="cp-faq-head">{t('إجابات هندسية وتطبيقية.', 'Practical engineering answers.')}</h2>
              <p>
                {t(
                  'كل ما تحتاج معرفته حول ترحيل البيانات، ربط الأجهزة الطبية، ونماذج الاستضافة السحابية والمحلية.',
                  'Everything you need to know about healthcare data migration, device connectivity, and hosting.'
                )}
              </p>
            </div>

            <div className="cp-faq-list">
              {planningFaqs.map(faq => (
                <details key={faq.id} className="cp-faq-item">
                  <summary>
                    <span>{txt(faq.question, locale)}</span>
                    <Plus size={18} />
                  </summary>
                  <p>{txt(faq.answer, locale)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </CareFrame>
  );
}
