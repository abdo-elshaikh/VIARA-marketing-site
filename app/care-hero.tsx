'use client';

import { useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Hospital,
  ScanLine,
  Stethoscope,
  Microscope,
  HeartPulse,
  Workflow,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { solutionPath } from '../lib/solutions';
import './care-hero.css';

interface CareHeroProps {
  content: SiteContent;
  locale: Locale;
  onDiscuss: (systems: string[], facility: string) => void;
}

export default function CareHero({ content, locale, onDiscuss }: CareHeroProps) {
  const en = locale === 'en';
  const t = (ar: string, english: string) => (en ? english : ar);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;

  const rawOptions = [
    {
      id: 'HIS',
      facility: 'hospital',
      label: t('المستشفيات', 'Hospitals'),
      tag: t('مراكز القيادة والتنويم', 'Command & Inpatient'),
      name: t('إدارة المستشفيات والمدن الطبية (HIS)', 'Hospital Information & Medical Cities (HIS)'),
      icon: Hospital,
      image: '/assets/scenes/healthcare-command.jpg',
      systems: ['HIS', 'EHR', 'NURSING', 'OR'],
      stats: [
        { label: t('جاهزية الأسرّة', 'Bed Readiness'), value: '94.8%' },
        { label: t('زمن التنسيق', 'Coordination TAT'), value: '-42%' },
        { label: t('معيار الربط', 'Interoperability'), value: 'HL7 FHIR' },
      ],
      steps: [
        { title: t('القبول وتوزيع الأسرّة (ADT)', 'Admission & Bed Triage'), desc: t('تصنيف فوري وتوزيع ذكي للأجنحة والعناية المركزة', 'Instant triage & bed allocation for inpatient wards') },
        { title: t('التنسيق السريري والملاحظات', 'Clinical Care Coordination'), desc: t('ربط مباشر بين الأطباء والتمريض والصيدلية والعمليات', 'Live sync across clinicians, nursing, pharmacy & OR') },
        { title: t('خطة الخروج والمتابعة', 'Discharge & Continuity'), desc: t('إصدار الفاتورة الموحدة وجدولة المراجعة إلكترونياً', 'Consolidated billing, digital discharge & follow-up') },
      ],
    },
    {
      id: 'RIS',
      facility: 'radiology',
      label: t('الأشعة والتصوير', 'Radiology & Imaging'),
      tag: t('تشخيص ثلاثي الأبعاد وذكاء اصطناعي', '3D Diagnostics & AI'),
      name: t('مراكز الأشعة والتصوير الطبي (RIS / PACS)', 'Radiology & PACS Imaging Suite'),
      icon: ScanLine,
      image: '/assets/scenes/diagnostic-pacs.jpg',
      systems: ['RIS', 'PACS', 'RCM'],
      stats: [
        { label: t('تحميل 3D DICOM', '3D DICOM Load'), value: '< 0.8s' },
        { label: t('معيار التصوير', 'Imaging Protocol'), value: 'DICOM 3.0' },
        { label: t('فرز AI للحالات الحرجة', 'AI STAT Triage'), value: '98.7%' },
      ],
      steps: [
        { title: t('حجز الفحص وModality Worklist', 'Booking & Modality Worklist'), desc: t('جدولة الفحوصات وإرسال بيانات المريض لأجهزة الأشعة آلياً', 'Automated study dispatch to MRI/CT scanners') },
        { title: t('الفحص والأرشفة والتقرير الصوتي', 'Scan, Archive & Voice Dictation'), desc: t('أرشفة سحابية وهجينة مشفرة وإملاء صوتي استشاري فوري', 'Zero-latency streaming with specialized medical voice AI') },
        { title: t('اعتماد الاستشاري وتسليم البوابة', 'Consultant Sign-off & Delivery'), desc: t('بث الصور والتقرير لملف المريض وتطبيق الجوال فوراً', 'Instant report & key images sent to patient app and EMR') },
      ],
    },
    {
      id: 'LIS',
      facility: 'laboratory',
      label: t('المختبرات والتحاليل', 'Medical Laboratories'),
      tag: t('ربط مباشر مع المحللات الآلية', 'Bidirectional Telemetry'),
      name: t('إدارة المختبرات الطبية والتحاليل (LIS)', 'Laboratory Information System (LIS)'),
      icon: Microscope,
      image: '/assets/scenes/arab-diagnostics.webp',
      systems: ['LIS', 'PORTAL', 'RCM'],
      stats: [
        { label: t('الاعتماد الآلي', 'Auto-Validation'), value: '99.4%' },
        { label: t('تتبع العينات', 'Sample Tracking'), value: '100% Barcode' },
        { label: t('فحص الطوارئ STAT', 'STAT Emergency TAT'), value: '12 min' },
      ],
      steps: [
        { title: t('الباركود وسحب العينة', 'Barcode & Specimen Intake'), desc: t('طباعة باركود مشفر يضمن سلسلة حيازة العينة من البداية', 'Encoded barcode chain of custody from phlebotomy') },
        { title: t('معالجة المحللات والتحقق الآلي', 'Analyzer Run & Delta Auto-Check'), desc: t('سحب النتائج آلياً مع التحقق الفوري من قواعد Delta Checks', 'Direct bidirectional analyzer feed with automated validation') },
        { title: t('تنبيه القيم الحرجة وإرسال التقرير', 'STAT Critical Alert & Push'), desc: t('إشعار فوري للأطباء عبر الرسائل والملف السريري للقيم الحرجة', 'Immediate alert and push report for panic values') },
      ],
    },
    {
      id: 'CMS',
      facility: 'medical',
      label: t('المراكز والعيادات', 'Clinics & Centers'),
      tag: t('انسيابية تدفق المراجعين والعيادات', 'Smooth Outpatient Flow'),
      name: t('المراكز الطبية والعيادات التخصصية (CMS)', 'Medical Centers & Specialty Practice (CMS)'),
      icon: Stethoscope,
      image: '/assets/scenes/arab-care-team.webp',
      systems: ['CMS', 'EHR', 'PORTAL'],
      stats: [
        { label: t('تقليص الانتظار', 'Wait Time Saved'), value: '-45%' },
        { label: t('الوصفات الإلكترونية', 'E-Prescription Rate'), value: '100%' },
        { label: t('مزامنة الفروع', 'Branch Sync'), value: 'Realtime' },
      ],
      steps: [
        { title: t('الحجز الذكي وتأكيد الحضور', 'Smart Booking & Self-Check-in'), desc: t('جدولة متقدمة وتأكيد آلي للمواعيد عبر واتساب وSMS', 'Self-scheduling and automated instant confirmations') },
        { title: t('الملف السريري والوصفة الرقمية', 'Clinical Encounter & E-Rx'), desc: t('سجل طبي موحد مع فحص آلي للتعارضات الدوائية والحساسية', 'Unified SOAP chart with drug-allergy contraindication checks') },
        { title: t('المحاسبة الفورية وجدولة المتابعة', 'Billing & Recall Scheduling'), desc: t('فوترة إلكترونية معتمدة وحجز موعد المراجعة القادم', 'Instant POS invoice and automated recall booking') },
      ],
    },
    {
      id: 'RCM',
      facility: 'finance',
      label: t('التأمين ونفيز', 'Insurance & NPHIES'),
      tag: t('مطالبات خالية من الرفض وتحصيل أسرع', 'Clean Claims & Instant Approvals'),
      name: t('إدارة دورة الإيرادات والتأمين الطبي (RCM)', 'Revenue Cycle Management & NPHIES (RCM)'),
      icon: HeartPulse,
      image: '/assets/scenes/healthcare-command.jpg',
      systems: ['RCM', 'EHR', 'CMS'],
      stats: [
        { label: t('قبول المطالبات الأولى', 'Clean Claim Rate'), value: '98.9%' },
        { label: t('تحقق الأهلية اللحظي', 'Eligibility Check'), value: '< 2.1s' },
        { label: t('اعتماد المنصة', 'Platform Standard'), value: 'NPHIES v1.3' },
      ],
      steps: [
        { title: t('التحقق اللحظي من أهلية التأمين', 'Instant Eligibility Verification'), desc: t('فحص وثيقة التأمين والتغطية وسقف التحمل خلال ثوانٍ', 'Live policy check, deductibles & coverage verification') },
        { title: t('الموافقات المسبقة وتدقيق الأكواد', 'Prior Authorizations & Scrubber'), desc: t('تدقيق أكواد ICD-10 وSBS لمنع الرفض قبل الإرسال', 'Intelligent claim scrubber catching discrepancies before filing') },
        { title: t('رفع المطالبات والتسوية الرقمية', 'Claim Batch & Auto-Reconcile'), desc: t('إرسال الدفعات الإلكترونية ومطابقة الإيداعات آلياً', 'Digital submission and automated bank reconciliation') },
      ],
    },
  ];

  const options = rawOptions.filter(
    option => !content.products.some(product => product.id === option.id && !product.enabled)
  );

  const [selected, setSelected] = useState(options[0]?.id || 'HIS');
  const [activeStep, setActiveStep] = useState(0);

  const current = options.find(option => option.id === selected) || options[0] || rawOptions[0];
  const Icon = current.icon;
  const requested = current.systems.filter(
    id => !content.products.some(product => product.id === id && !product.enabled)
  );

  const customHero = !['أنظمة إدارة', 'رعاية متصلة.', 'تقنية تجمع', 'رعاية أفضل تبدأ'].includes(
    content.hero.title.ar
  );

  const photo =
    content.imagery.hero !== '/assets/scenes/radiology-care.webp' && content.imagery.hero
      ? content.imagery.hero
      : current.image;

  return (
    <section className="care-hero care-wrap ch-hero ch-hero-upgraded" aria-labelledby="ch-heading">
      <div className="ch-copy">
        <span className="ch-eyebrow">
          <i className="ch-pulse-dot" />
          {t('VIARA · منظومة الرعاية الصحية المتكاملة · 24+ نظاماً متخصصاً', 'VIARA · INTEGRATED HEALTHCARE ECOSYSTEM · 24+ SPECIALIZED SYSTEMS')}
        </span>

        <h1 id="ch-heading">
          {customHero ? (
            txt(content.hero.title, locale)
          ) : (
            <>
              {t('كل رعايتك.', 'All your care.')}
              <br />
              <em>{t('أقرب للاتصال والتميز.', 'Closer, connected, superior.')}</em>
            </>
          )}
          <span className="ch-title-mark" aria-hidden="true">✳</span>
        </h1>

        <p>
          {customHero
            ? txt(content.hero.description, locale)
            : t(
                'نصل تفاصيل العمل الطبي والإداري والتشخيصي، لتمنح الإنسان اهتمامك الكامل. استكشف حلول المستشفيات والمدن الطبية والأشعة والمختبرات والمراكز التخصصية، مع تكامل معتمد ومعايير عالمية.',
                'Unify clinical, operational, and diagnostic workflows so your team can focus entirely on patient care. Explore enterprise solutions for hospitals, medical centers, radiology, and laboratories, powered by certified global standards.'
              )}
        </p>

        <div className="ch-actions">
          <button
            className="care-btn ch-primary-cta"
            type="button"
            onClick={() => onDiscuss(requested, current.facility)}
          >
            <span>{t('لنخطط لرعاية أفضل', 'Let’s plan better care')}</span>
            <Arrow size={19} />
          </button>

          <a className="care-link ch-secondary-link" href={en ? '/en/systems' : '/systems'}>
            <span>{t('استكشف المنظومة كاملة (24+)', 'Explore all 24+ systems')}</span>
            <Forward size={18} />
          </a>
        </div>

        <div className="ch-assurance">
          <span>
            <Check size={14} />
            {t('معايير HL7 FHIR & DICOM', 'HL7 FHIR & DICOM 3.0')}
          </span>
          <span>
            <Check size={14} />
            {t('ربط نفيز NPHIES معتمد', 'NPHIES Certified')}
          </span>
          <span>
            <Check size={14} />
            {t('أرشفة سحابية وهجينة مشفرة', 'Encrypted Hybrid Archiving')}
          </span>
          <span>
            <Check size={14} />
            {t('توسع وتدرج على مراحل', 'Phased Modular Rollout')}
          </span>
        </div>
      </div>

      <div className="ch-visual">
        <span className="ch-visual-line" aria-hidden="true" />
        
        <figure className="ch-figure">
          <img
            key={photo}
            src={photo}
            width={1536}
            height={1024}
            fetchPriority="high"
            alt={t(
              'بيئة رعاية صحية متقدمة وفريق طبي يتعاون، مشهد توضيحي',
              'Illustrative scene of modern healthcare collaboration'
            )}
          />
          <div className="ch-image-shade" />
          <div className="ch-photo-copy">
            <span className="ch-photo-pill">
              <Cpu size={12} />
              {current.tag.toUpperCase()}
            </span>
            <strong>
              {t('خلف كل نظام طبي متصل،', 'Behind every connected clinical system,')}
              <br />
              {t('إنسان يستحق أسرع وأدق رعاية.', 'a person deserves the fastest, safest care.')}
            </strong>
          </div>
          <figcaption>{t('مشهد توضيحي من بيئات العمل الطبية المعتمدة', 'Illustrative clinical workflow environment')}</figcaption>
        </figure>

        <span className="ch-corner-symbol" aria-hidden="true">
          <HeartPulse size={26} />
        </span>

        {/* Live Clinical Command HUD */}
        <div className="ch-connection-card ch-connection-card-upgraded" aria-live="polite">
          <div className="ch-hud-status-bar">
            <span className="ch-live-indicator">
              <i className="ch-pulse" />
              {t('مباشر ومستقر · استجابة < 25ms', 'LIVE & STABLE · < 25ms')}
            </span>
            <span className="ch-hud-domain-badge">{current.id}</span>
          </div>

          <div className="ch-connection-head">
            <span className="ch-head-icon">
              <Icon size={20} />
            </span>
            <div>
              <small>{current.tag}</small>
              <b>{current.name}</b>
            </div>
            <Workflow size={19} className="ch-workflow-icon" />
          </div>

          {/* Quick Domain Metrics Bar */}
          <div className="ch-live-stats" aria-label={t('مؤشرات الأداء التشغيلي', 'Operational metrics')}>
            {current.stats.map(s => (
              <div key={s.label} className="ch-stat-pill">
                <strong>{s.value}</strong>
                <small>{s.label}</small>
              </div>
            ))}
          </div>

          {/* Interactive Journey Steps */}
          <div className="ch-connection-steps ch-steps-interactive">
            {current.steps.map((st, i) => (
              <button
                type="button"
                key={st.title}
                className={`ch-step-node ${activeStep === i ? 'is-active' : ''}`}
                onClick={() => setActiveStep(i)}
                aria-pressed={activeStep === i}
              >
                <i>{activeStep > i ? <Check size={11} /> : `0${i + 1}`}</i>
                <span>{st.title}</span>
              </button>
            ))}
          </div>

          {/* Step Detail Callout */}
          <div className="ch-step-snippet">
            <Sparkles size={13} />
            <p>{current.steps[activeStep]?.desc || current.steps[0].desc}</p>
          </div>

          <div className="ch-connection-foot">
            <div className="ch-chips">
              {requested.map(id => (
                <bdi key={id}>{id}</bdi>
              ))}
            </div>
            <a className="ch-hud-solution-link" href={solutionPath(current.id, locale)}>
              <span>{t('استكشف النظام كاملاً', 'Explore full system')}</span>
              <Arrow size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Segmented Facility Selector */}
      <div className="ch-discover ch-discover-upgraded">
        <div className="ch-discover-heading">
          <span>01 / FACILITY ECOSYSTEM</span>
          <p>{t('اختر المنشأة لاستعراض مسار العمل المتخصص:', 'Select your facility to preview tailored workflows:')}</p>
        </div>

        <div className="ch-facility-options" aria-label={t('استكشف حسب منشأتك', 'Explore by facility')}>
          {options.map(option => (
            <button
              type="button"
              key={option.id}
              aria-pressed={current.id === option.id}
              onClick={() => {
                setSelected(option.id);
                setActiveStep(0);
              }}
            >
              <option.icon size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <a className="ch-selected-link" href={solutionPath(current.id, locale)}>
          <span>{t('صفحة النظام والمواصفات', 'System specifications')}</span>
          <Arrow size={18} />
        </a>
      </div>
    </section>
  );
}
