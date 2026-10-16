'use client';
import { useState, useRef, useEffect, type CSSProperties } from 'react';
import {
  ArrowUpLeft, ArrowLeft, ArrowRight, Menu, X, Sun, Moon, Check, CheckCircle2,
  ScanLine, Layers3, Building2, Hospital, Stethoscope, Microscope, Receipt,
  ShieldCheck, Activity, Cpu, Sparkles, SlidersHorizontal, Calculator, Route,
  ChevronDown, Phone, Mail, MessageCircle, Plus, Users, Globe2, FileText
} from 'lucide-react';
import { txt, type SiteContent, type Locale, type PublicReview } from '../lib/site-content';
import { solutionPath } from '../lib/solutions';
import LeadForm from './lead-form';
import InteractiveShowcase from './interactive-showcase';
import FacilityNavigator from './facility-navigator';
import ReviewForm from './review-form';
import ScopeCalculator from './scope-calculator';
import type { ScopeEstimate } from '../lib/inquiry';
import { createTranslator, I18nProvider, getDirection } from '../lib/i18n';
import './modern-home.css';

export default function ModernHome({
  content,
  locale = 'ar',
  reviews = [],
}: {
  content: SiteContent;
  locale?: Locale;
  reviews?: PublicReview[];
}) {
  const en = locale === 'en';
  const t = createTranslator(locale);
  const home = en ? '/en' : '/';

  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [modal, setModal] = useState<string | null>(null);

  // Form selections
  const [interest, setInterest] = useState('CONSULT');
  const [plan, setPlan] = useState('لم أحدد بعد');
  const [offer, setOffer] = useState('');
  const [scope, setScope] = useState<ScopeEstimate | null>(null);
  const [requestedSystems, setRequestedSystems] = useState<string[]>([]);
  const [requestedFacility, setRequestedFacility] = useState('');

  const dialogRef = useRef<HTMLDialogElement>(null);

  const clearSystems = () => {
    setRequestedSystems([]);
    setRequestedFacility('');
  };

  const handleSelectFacilityScope = (systems: string[], facilityId: string) => {
    setRequestedSystems(systems);
    setRequestedFacility(facilityId);
    setInterest('CONSULT');
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    if (modal && !dialogRef.current?.open) dialogRef.current?.showModal();
    else if (!modal && dialogRef.current?.open) dialogRef.current?.close();
  }, [modal]);

  return (
    <I18nProvider locale={locale}>
      <div
        className="vx-shell"
        data-theme={dark ? 'dark' : 'light'}
        dir={getDirection(locale)}
        lang={locale}
        style={{ '--vx-primary': content.brand.primary } as CSSProperties}
      >
      {/* Top Navigation */}
      <header className="vx-header">
        <div className="vx-container vx-header-inner">
          <a href={home} className="vx-brand" aria-label={content.brand.name}>
            <img
              src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo}
              alt=""
              width={40}
              height={40}
            />
            <div className="vx-brand-text">
              <span className="vx-brand-title">{content.brand.name}</span>
              <span className="vx-brand-sub">HEALTHCARE TECHNOLOGY</span>
            </div>
          </a>

          <nav className="vx-desktop-nav" aria-label={t('التنقل الرئيسي', 'Main Navigation')}>
            <a href={home} className="vx-nav-link active">{t('الرئيسية', 'Home')}</a>
            <a href={en ? '/en/systems' : '/systems'} className="vx-nav-link">
              <span>{t('منظومة الرعاية', 'All Systems')}</span>
              <span className="nav-counter-badge">23</span>
            </a>
            <a href="#interactive-demo" className="vx-nav-link">{t('العرض التفاعلي', 'Live Demo')}</a>
            <a href={en ? '/en/planning' : '/planning'} className="vx-nav-link">{t('تخطيط التشغيل', 'Planning & ROI')}</a>
            <a href="#faq" className="vx-nav-link">{t('الأسئلة الشائعة', 'FAQs')}</a>
          </nav>

          <div className="vx-header-actions">
            <a className="vx-lang-btn" href={en ? '/' : '/en'} hrefLang={en ? 'ar' : 'en'}>
              {en ? 'العربية' : 'EN'}
            </a>
            <button
              type="button"
              className="vx-icon-toggle"
              onClick={() => setDark(!dark)}
              aria-label={t('تبديل المظهر', 'Toggle Theme')}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="#contact" className="vx-btn-primary">
              <span>{t('احجز عرضًا توضيحيًا', 'Book a Demo')}</span>
              <ArrowUpLeft size={16} />
            </a>
            <button
              type="button"
              className="vx-icon-toggle vx-mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t('القائمة', 'Menu')}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Drawer */}
        <div className={`vx-mobile-drawer ${menuOpen ? 'is-open' : ''}`}>
          <a href={home} onClick={() => setMenuOpen(false)}>{t('الرئيسية', 'Home')}</a>
          <a href={en ? '/en/systems' : '/systems'} onClick={() => setMenuOpen(false)}>
            {t('منظومة الأنظمة الكاملة (23 نظامًا)', 'All Systems Directory (23 Systems)')}
          </a>
          <a href="#interactive-demo" onClick={() => setMenuOpen(false)}>{t('العرض التفاعلي الحي', 'Live Interactive Demo')}</a>
          <a href={en ? '/en/planning' : '/planning'} onClick={() => setMenuOpen(false)}>{t('تخطيط النطاق والتشغيل', 'Planning & Sizing')}</a>
          <a href={solutionPath('HIS', locale)} onClick={() => setMenuOpen(false)}>{t('إدارة المستشفيات والتنويم HIS', 'Hospital Inpatient HIS')}</a>
          <a href={solutionPath('PACS', locale)} onClick={() => setMenuOpen(false)}>{t('أرشفة وعارض الأشعة PACS', 'Cloud PACS & DICOM')}</a>
          <a href={solutionPath('LIS', locale)} onClick={() => setMenuOpen(false)}>{t('المختبرات والتحاليل LIS', 'Laboratory LIS')}</a>
          <a href={solutionPath('RCM', locale)} onClick={() => setMenuOpen(false)}>{t('دورة الإيرادات والتأمين RCM', 'Revenue Cycle & NPHIES')}</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>{t('طلب استشارة وعرض فني', 'Request Technical Proposal')}</a>
        </div>
      </header>

      <main id="main">
        {/* =====================================================================
            HERO: Spacious, Confident, Modern
            ===================================================================== */}
        <section className="vx-hero">
          <div className="vx-container">
            <div className="vx-hero-content">
              <span className="vx-kicker-badge">
                <Sparkles size={14} />
                {t('VIARA · السحابة الصحية المتكاملة الموحدة', 'VIARA · THE UNIFIED HEALTHCARE CLOUD')}
              </span>
              <h1>
                {t('رعاية صحية متصلة.', 'Connected Healthcare.')}
                <br />
                <span className="gradient-text">{t('منظومة واحدة لكل أقسام منشأتك.', 'One Platform for Every Facility Department.')}</span>
              </h1>
              <p className="vx-hero-desc">
                {t(
                  'من المستشفيات العامة ومراكز الأشعة إلى المختبرات والعيادات التخصصية. نربط رحلة المريض والتوثيق السريري والتشغيل المالي في بيئة سحابية فائقة الأمان والسرعة.',
                  'From enterprise hospitals and diagnostic imaging centers to laboratories and outpatient clinics. Unifying patient records, clinical workflows, and revenue cycle management in one lightning-fast, secure cloud.'
                )}
              </p>

              <div className="vx-hero-ctas">
                <a href="#contact" className="vx-btn-primary">
                  <span>{t('احجز عرضًا حيًا لمنشأتك', 'Schedule Live Facility Demo')}</span>
                  <ArrowUpLeft size={18} />
                </a>
                <a href={en ? '/en/systems' : '/systems'} className="vx-btn-secondary">
                  <Layers3 size={18} />
                  <span>{t('استكشف الـ 23 نظامًا بالكامل', 'Explore All 23 Systems')}</span>
                </a>
              </div>

              <div className="vx-trust-pills">
                <div className="trust-item">
                  <ShieldCheck size={16} />
                  <span>{t('معتمد ومتوافق مع نفيس (NPHIES)', 'NPHIES Certified')}</span>
                </div>
                <div className="trust-item">
                  <Activity size={16} />
                  <span>{t('معايير DICOM 3.0 & HL7 FHIR v4', 'DICOM 3.0 & HL7 FHIR')}</span>
                </div>
                <div className="trust-item">
                  <Cpu size={16} />
                  <span>{t('تشفير بنكي كامل AES-256 · TLS 1.3', 'AES-256 Bank-Grade Encryption')}</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={16} />
                  <span>{t('جاهزية تشغيلية سحابية 99.98%', '99.98% Cloud Uptime SLA')}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Media with Command Center Image */}
            <div className="vx-hero-media">
              <img
                src="/assets/scenes/healthcare-command.jpg"
                alt={t('مركز القيادة والتحكم الصحي المتكامل VIARA', 'VIARA Unified Healthcare Command Center')}
                width={1536}
                height={864}
                fetchPriority="high"
              />
              <div className="vx-media-hud">
                <div className="hud-item">
                  <small>{t('مركز القيادة الصحي الموحد', 'Hospital Command System')}</small>
                  <strong>VIARA ENTERPRISE SUITE</strong>
                </div>
                <div className="hud-item">
                  <small>{t('نسبة إشغال الأسرّة اللحظية', 'Live Inpatient Occupancy')}</small>
                  <strong>94.2% · 320 Beds</strong>
                </div>
                <div className="hud-item">
                  <small>{t('فحوصات الأشعة المنجزة اليوم', 'Completed Radiology Exams')}</small>
                  <strong>184 Studies (0 Denials)</strong>
                </div>
                <div className="hud-item">
                  <small>{t('زمن استجابة الربط التكاملي', 'FHIR API Response Time')}</small>
                  <strong>18ms (Real-time)</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            ECOSYSTEM DOMAINS: 4 Pillars of Comprehensive Healthcare
            ===================================================================== */}
        <section className="vx-section" id="systems-overview">
          <div className="vx-container">
            <div className="vx-section-head">
              <span className="vx-section-kicker">{t('المنظومة الموسعة', 'COMPREHENSIVE ECOSYSTEM')}</span>
              <h2>
                {t('أربعة أركان متكاملة', 'Four Pillars of Unified Care')}<br />
                <span>{t('تغطي كل زاوية في الرعاية الصحية.', 'Covering Every Healthcare Dimension.')}</span>
              </h2>
              <p>
                {t(
                  'تصميم معماري متناسق يضمن تدفق البيانات بين الأطباء، أقسام الأشعة والمختبرات، وإدارة الإيرادات دون تكرار أو انقطاع.',
                  'Harmonious architectural design ensuring seamless data flow between clinicians, imaging diagnostics, laboratory analyzers, and finance.'
                )}
              </p>
            </div>

            <div className="vx-ecosystem-grid">
              {/* Pillar 1 */}
              <a href={solutionPath('HIS', locale)} className="ecosystem-card">
                <div className="ecosystem-card-icon">
                  <Hospital size={26} />
                </div>
                <h3>{t('الرعاية السريرية والمستشفيات', 'Clinical Care & Hospitals')}</h3>
                <p>{t('إدارة التنويم والأجنحة، جدولة العمليات الجراحية، الملف الطبي الإلكتروني، وتنسيق التمريض والعناية المركزة.', 'Inpatient wards, surgical theater scheduling, electronic medical records, and intensive care coordination.')}</p>
                <div className="ecosystem-card-pills">
                  <span className="eco-pill">HIS</span>
                  <span className="eco-pill">EMR</span>
                  <span className="eco-pill">NURSING</span>
                  <span className="eco-pill">OR / ICU</span>
                </div>
                <span className="ecosystem-card-link">
                  {t('استكشف حلول المستشفيات', 'Explore Hospital Suite')}
                  <ArrowUpLeft size={16} />
                </span>
              </a>

              {/* Pillar 2 */}
              <a href={solutionPath('PACS', locale)} className="ecosystem-card">
                <div className="ecosystem-card-icon">
                  <ScanLine size={26} />
                </div>
                <h3>{t('التشخيص والتصوير الطبي والمختبر', 'Diagnostics, Imaging & Labs')}</h3>
                <p>{t('نظام إدارة الأشعة RIS، أرشفة DICOM سحابية فائقة السرعة، ربط ثنائي الاتجاه لأجهزة التحاليل المخبرية، وبنوك الدم.', 'Radiology RIS, scalable cloud PACS with zero-footprint 3D viewer, bidirectional laboratory LIS, and blood banks.')}</p>
                <div className="ecosystem-card-pills">
                  <span className="eco-pill">RIS</span>
                  <span className="eco-pill">PACS</span>
                  <span className="eco-pill">LIS</span>
                  <span className="eco-pill">PATHOLOGY</span>
                </div>
                <span className="ecosystem-card-link">
                  {t('استكشف حلول التشخيص', 'Explore Diagnostic Suite')}
                  <ArrowUpLeft size={16} />
                </span>
              </a>

              {/* Pillar 3 */}
              <a href={solutionPath('RCM', locale)} className="ecosystem-card">
                <div className="ecosystem-card-icon">
                  <Receipt size={26} />
                </div>
                <h3>{t('التشغيل المالي ودورة الإيرادات', 'Operations & Revenue Cycle')}</h3>
                <p>{t('ربط مباشر مع منصة نفيس NPHIES، تدقيق آلي للمطالبات يمنع الرفض، إدارة سلاسل إمداد الأدوية، ولوحات ذكاء أعمال BI.', 'Direct NPHIES payer integration, automated clean-claim scrubbing, medical inventory supply chain, and executive BI dashboards.')}</p>
                <div className="ecosystem-card-pills">
                  <span className="eco-pill">RCM</span>
                  <span className="eco-pill">NPHIES</span>
                  <span className="eco-pill">ERP</span>
                  <span className="eco-pill">BI ANALYTICS</span>
                </div>
                <span className="ecosystem-card-link">
                  {t('استكشف حلول الإيرادات', 'Explore Revenue Suite')}
                  <ArrowUpLeft size={16} />
                </span>
              </a>

              {/* Pillar 4 */}
              <a href={solutionPath('TELE', locale)} className="ecosystem-card">
                <div className="ecosystem-card-icon">
                  <Activity size={26} />
                </div>
                <h3>{t('الرعاية الرقمية والذكاء الاصطناعي', 'Digital Health & Clinical AI')}</h3>
                <p>{t('بوابة وتطبيق المريض للحجز والنتائج، عيادة افتراضية مشفرة للاستشارات المرئية، وفرز ذكي للفحوصات الشعاعية العاجلة.', 'Patient mobile portal, encrypted virtual telehealth consultations, and AI-powered radiological study triage.')}</p>
                <div className="ecosystem-card-pills">
                  <span className="eco-pill">TELEHEALTH</span>
                  <span className="eco-pill">PORTAL</span>
                  <span className="eco-pill">CLINICAL AI</span>
                  <span className="eco-pill">FHIR API</span>
                </div>
                <span className="ecosystem-card-link">
                  {t('استكشف الرعاية الرقمية', 'Explore Digital Health')}
                  <ArrowUpLeft size={16} />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================================
            LIVE INTERACTIVE SIMULATION (Interactive Showcase Sandbox)
            ===================================================================== */}
        <section className="vx-section" style={{ paddingTop: '1rem' }}>
          <div className="vx-container">
            <InteractiveShowcase locale={locale} />
          </div>
        </section>

        {/* =====================================================================
            SPLIT SHOWCASES WITH GENERATED PHOTOREALISTIC ASSETS
            ===================================================================== */}
        <section className="vx-section" id="deep-dives">
          <div className="vx-container">
            {/* Split 1: PACS & Diagnostic Imaging */}
            <div className="vx-split-showcase">
              <div className="split-copy">
                <span className="vx-section-kicker">{t('التشخيص الشعاعي فائق الدقة', 'DIAGNOSTIC EXCELLENCE')}</span>
                <h3>{t('أرشفة سحابية وعارض DICOM ثلاثي الأبعاد معتمد سريريًا.', 'Cloud Archiving & Clinical 3D DICOM Review.')}</h3>
                <p>
                  {t(
                    'تخلص من قيود الخوادم المحلية وتكاليف الصيانة الباهظة. يمنحك عارض VIARA ويب فائق السرعة إمكانية الوصول للدراسات الطبية من أي جهاز ومكان، بدقة تشخيصية كاملة ودعم معايير OHIF v3.',
                    'Liberate your facility from on-premise hardware bottlenecks. VIARA zero-footprint web viewer delivers instant access to multi-gigabyte studies with multi-planar reconstruction (MPR) and AI assistance.'
                  )}
                </p>
                <ul className="split-bullets">
                  <li>
                    <Check size={18} />
                    <span>{t('عارض DICOM سحابي فوري يعمل دون الحاجة لتثبيت برامج', 'Instant zero-install web viewer compatible with Mac, PC, and tablets')}</span>
                  </li>
                  <li>
                    <Check size={18} />
                    <span>{t('أدوات قياس متقدمة، إعادة بناء ثلاثية الأبعاد (MPR/MIP)', 'Advanced caliper tools, 3D multi-planar reconstruction (MPR)')}</span>
                  </li>
                  <li>
                    <Check size={18} />
                    <span>{t('إملاء صوتي طبي ذكي يختصر زمن كتابة التقارير بأكثر من 40%', 'Integrated medical voice dictation cutting reporting time by 40%')}</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href={solutionPath('PACS', locale)} className="vx-btn-primary">
                    <span>{t('تفاصيل نظام PACS والأشعة', 'Explore PACS & RIS')}</span>
                    <ArrowUpLeft size={16} />
                  </a>
                  <a href={en ? '/en/planning' : '/planning'} className="vx-btn-secondary">
                    <Calculator size={16} />
                    <span>{t('حساب سعة التخزين المطلوبة', 'Estimate Storage Scope')}</span>
                  </a>
                </div>
              </div>

              <div className="split-image-wrap">
                <img
                  src="/assets/scenes/diagnostic-pacs.jpg"
                  alt={t('محطة قراءة الأشعة وعارض DICOM الطبي VIARA', 'VIARA Diagnostic Radiology Reading Suite')}
                  width={1536}
                  height={864}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Split 2: Inpatient & Hospital Care */}
            <div className="vx-split-showcase reverse">
              <div className="split-copy">
                <span className="vx-section-kicker">{t('إدارة المستشفيات والأجنحة', 'ENTERPRISE INPATIENT')}</span>
                <h3>{t('تنسيق لا تشوبه شائبة بين الأطباء، التمريض، وغرف العمليات.', 'Flawless Coordination between Doctors, Nurses, and Operating Rooms.')}</h3>
                <p>
                  {t(
                    'لوحة قيادة مركزية توفر رؤية شاملة لمعدلات إشغال الأسرّة، وتتبع مسار المريض من قسم الطوارئ وحتى الخروج، مع تسليم ورديات إلكتروني يقلل الأخطاء الطبية ويضمن استمرارية الرعاية.',
                    'Centralized hospital command system providing complete visibility into bed occupancy, surgical bookings, and shift handovers, eliminating communication gaps and driving clinical excellence.'
                  )}
                </p>
                <ul className="split-bullets">
                  <li>
                    <Check size={18} />
                    <span>{t('توزيع ذكي للأسرّة والأجنحة ومتابعة العناية المركزة (ICU)', 'Real-time bed assignment, ward transfers, and critical care monitoring')}</span>
                  </li>
                  <li>
                    <Check size={18} />
                    <span>{t('أوامر علاج وفحوصات إلكترونية مباشرة (CPOE) مع فحص التعارضات', 'Direct CPOE orders with real-time drug interaction checks')}</span>
                  </li>
                  <li>
                    <Check size={18} />
                    <span>{t('ربط آلي مع صيدلية المستشفى ونظام الفوترة والتأمين', 'Automated linkage with inpatient pharmacy and billing workflows')}</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href={solutionPath('HIS', locale)} className="vx-btn-primary">
                    <span>{t('تفاصيل نظام إدارة المستشفيات HIS', 'Explore Hospital HIS')}</span>
                    <ArrowUpLeft size={16} />
                  </a>
                  <a href="#contact" className="vx-btn-secondary">
                    <span>{t('طلب استشارة فنية', 'Request Technical Call')}</span>
                  </a>
                </div>
              </div>

              <div className="split-image-wrap">
                <img
                  src="/assets/scenes/hospital-inpatient.jpg"
                  alt={t('محطة التمريض والأجنحة في المستشفى الرقمي VIARA', 'VIARA Hospital Inpatient & Nursing Station')}
                  width={1536}
                  height={864}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            FACILITY SCOPE NAVIGATOR (Uncluttered, Personalized Recommendations)
            ===================================================================== */}
        <section className="vx-section" id="facility-suite">
          <div className="vx-container">
            <div className="vx-section-head">
              <span className="vx-section-kicker">{t('الحزمة المصممة لمنشأتك', 'TAILORED SCOPE')}</span>
              <h2>
                {t('اختر نوع منشأتك', 'Select Your Facility Type')}<br />
                <span>{t('لنقترح النطاق الأنسب لاحتياجاتك.', 'To Preview Your Ideal Architecture.')}</span>
              </h2>
              <p>{t('صممت منظومة VIARA لتتناسب بمرونة فائقة مع مختلف أحجام المنشآت الطبية.', 'Engineered for seamless modular scalability across various healthcare facility scales.')}</p>
            </div>

            <FacilityNavigator locale={locale} onSelectScope={handleSelectFacilityScope} />
          </div>
        </section>

        {/* =====================================================================
            METRICS STRIP
            ===================================================================== */}
        <section className="vx-container">
          <div className="vx-metrics-strip">
            <div className="metric-box">
              <strong>99.98%</strong>
              <span>{t('نسبة الجاهزية السحابية المعتمدة', 'Certified Cloud Availability')}</span>
            </div>
            <div className="metric-box">
              <strong>100+</strong>
              <span>{t('تكامل مباشر مع أجهزة الأشعة والتحاليل', 'Direct Modality & Analyzer Interfaces')}</span>
            </div>
            <div className="metric-box">
              <strong>4.8M+</strong>
              <span>{t('دراسة وفحص طبي مؤرشف وموثق', 'Archived Diagnostic Studies')}</span>
            </div>
            <div className="metric-box">
              <strong>98.6%</strong>
              <span>{t('نسبة قبول المطالبات الأولية (Clean Claims)', 'First-Pass Clean Claim Rate')}</span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            MULTI-PAGE ARCHITECTURE BANNER (Direct discovery of dedicated pages)
            ===================================================================== */}
        <section className="vx-container">
          <div className="vx-multipage-banner">
            <div className="banner-copy">
              <span className="vx-section-kicker">{t('دليل الأنظمة المتخصص', 'SYSTEMS REPOSITORY')}</span>
              <h3>{t('هل تبحث عن مواصفات تفصيلية لنظام بعينه؟', 'Looking for Deep Architectural Specifications?')}</h3>
              <p>{t('تفضل بزيارة الدليل الموسع للأنظمة الـ 23، أو استخدم حاسبة التخزين وتخطيط التشغيل لتقدير النطاق فورياً.', 'Explore our complete 23-system directory with live terminal previews, or launch our interactive capacity planner.')}</p>
            </div>
            <div className="banner-links">
              <a href={en ? '/en/systems' : '/systems'} className="vx-btn-primary">
                <Layers3 size={17} />
                <span>{t('دليل الأنظمة الـ 23 الكامل', 'Complete 23 Systems Catalog')}</span>
              </a>
              <a href={en ? '/en/planning' : '/planning'} className="vx-btn-secondary">
                <Calculator size={17} />
                <span>{t('حاسبة سعة الأرشفة والتشغيل', 'Capacity & Rollout Planner')}</span>
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================================
            FAQ SECTION (Accordion)
            ===================================================================== */}
        <section className="vx-section" id="faq">
          <div className="vx-container">
            <div className="vx-faq-grid">
              <div>
                <span className="vx-section-kicker">{t('أسئلة وإجابات', 'FREQUENTLY ASKED')}</span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25 }}>
                  {t('كل ما تحتاج معرفته', 'Clear answers')}<br />
                  <span style={{ color: 'var(--vx-primary-light)' }}>{t('قبل اتخاذ القرار.', 'before you begin.')}</span>
                </h2>
                <p style={{ color: 'var(--vx-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {t('نؤمن بالشفافية المطلقة في كل ما يخص البنية التقنية، معايير الأمان، ونقل البيانات السابقة.', 'We believe in absolute transparency regarding technical architecture, compliance, and data migration.')}
                </p>
                <a href="#contact" className="vx-btn-secondary">
                  <span>{t('لديك استفسار تقني خاص؟', 'Have a specific question?')}</span>
                  <ArrowUpLeft size={16} />
                </a>
              </div>

              <div className="faq-accordion">
                {content.faqs.map(faq => (
                  <details key={faq.id} className="faq-item">
                    <summary className="faq-summary">
                      <span>{txt(faq.question, locale)}</span>
                      <Plus size={18} />
                    </summary>
                    <p className="faq-answer">{txt(faq.answer, locale)}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            LEAD & DEMO BOOKING FORM
            ===================================================================== */}
        <section className="vx-section" id="contact" style={{ background: 'var(--vx-surface-raised)', borderTop: '1px solid var(--vx-border)' }}>
          <div className="vx-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '3.5rem', alignItems: 'start' }}>
              <div>
                <span className="vx-section-kicker">{t('ابدأ اليوم', 'GET IN TOUCH')}</span>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25 }}>
                  {t('خطوتك القادمة،', 'Your next step,')}<br />
                  <span style={{ color: 'var(--vx-primary-light)' }}>{t('تبدأ بمناقشة احتياج منشأتك.', 'begins with your facility.')}</span>
                </h2>
                <p style={{ color: 'var(--vx-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {t(
                    'أخبرنا عن نوع منشأتك والأولويات التشغيلية لفريقك. يقوم مستشارونا السريريون والتقنيون بمراجعة النطاق وخيارات التهيئة والربط وإعداد عرض فني مخصص.',
                    'Tell us about your facility type and priorities. Our clinical and technical consultants will assess your scope and deliver a tailored technical proposal.'
                  )}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {content.contact.phone && (
                    <a href={`tel:${content.contact.phone.replace(/[^+0-9]/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--vx-text)', textDecoration: 'none', fontSize: '1.05rem' }}>
                      <Phone size={20} style={{ color: 'var(--vx-primary-light)' }} />
                      <bdi>{content.contact.phone}</bdi>
                    </a>
                  )}
                  {content.contact.email && (
                    <a href={`mailto:${content.contact.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--vx-text)', textDecoration: 'none', fontSize: '1.05rem' }}>
                      <Mail size={20} style={{ color: 'var(--vx-primary-light)' }} />
                      <bdi>{content.contact.email}</bdi>
                    </a>
                  )}
                  {content.contact.whatsapp && (
                    <a href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--vx-text)', textDecoration: 'none', fontSize: '1.05rem' }}>
                      <MessageCircle size={20} style={{ color: '#25d366' }} />
                      <span>{t('تواصل مباشر عبر واتساب', 'Direct WhatsApp Chat')}</span>
                    </a>
                  )}
                </div>

                <div style={{ background: 'var(--vx-surface)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--vx-border)', fontSize: '0.86rem', color: 'var(--vx-text-muted)', lineHeight: 1.6 }}>
                  <ShieldCheck size={18} style={{ color: 'var(--vx-primary-light)', marginBottom: '0.35rem' }} />
                  <p>{t('التزام بالخصوصية: لا تُدخل أي بيانات مرضى أو معلومات طبية سرية في هذا النموذج. البيانات مخصصة للتواصل الإداري والتنسيق الفني فقط.', 'Privacy commitment: Please do not enter patient data or sensitive medical records in this form. Details are strictly used for organizational coordination.')}</p>
                </div>
              </div>

              <div style={{ background: 'var(--vx-surface)', padding: '2.5rem', borderRadius: '1.25rem', border: '1px solid var(--vx-border)', boxShadow: 'var(--vx-shadow)' }}>
                <LeadForm
                  locale={locale}
                  content={content}
                  interest={interest}
                  setInterest={setInterest}
                  plan={plan}
                  setPlan={setPlan}
                  offer={offer}
                  setOffer={setOffer}
                  scope={scope}
                  setScope={setScope}
                  requestedSystems={requestedSystems}
                  clearRequestedSystems={clearSystems}
                  requestedFacility={requestedFacility}
                  onPrivacy={() => setModal('privacy')}
                  onEditScope={() => setModal('calculator')}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          MULTI-PAGE COMPREHENSIVE FOOTER
          ===================================================================== */}
      <footer className="vx-footer">
        <div className="vx-container">
          <div className="vx-footer-grid">
            <div className="footer-col">
              <a href={home} className="vx-brand" style={{ marginBottom: '1.25rem' }}>
                <img
                  src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo}
                  alt=""
                  width={38}
                  height={38}
                />
                <div className="vx-brand-text">
                  <span className="vx-brand-title" style={{ color: '#fff' }}>{content.brand.name}</span>
                  <span className="vx-brand-sub">HEALTHCARE TECHNOLOGY</span>
                </div>
              </a>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, maxWidth: '340px' }}>
                {t(
                  'المنظومة السحابية الموحدة لإدارة المستشفيات، مراكز الأشعة، المختبرات، والعيادات التخصصية.',
                  'Enterprise cloud platform unifying hospitals, imaging centers, clinical laboratories, and polyclinics.'
                )}
              </p>
            </div>

            <div className="footer-col">
              <h4>{t('الحلول التخصصية', 'Core Solutions')}</h4>
              <ul>
                <li><a href={solutionPath('HIS', locale)}>{t('إدارة المستشفيات (HIS)', 'Hospital Management (HIS)')}</a></li>
                <li><a href={solutionPath('PACS', locale)}>{t('أرشفة وعارض DICOM (PACS)', 'Cloud PACS & DICOM')}</a></li>
                <li><a href={solutionPath('RIS', locale)}>{t('إدارة مراكز الأشعة (RIS)', 'Radiology Management (RIS)')}</a></li>
                <li><a href={solutionPath('LIS', locale)}>{t('إدارة المختبرات (LIS)', 'Laboratory System (LIS)')}</a></li>
                <li><a href={solutionPath('EMR', locale)}>{t('السجل الطبي الذكي (EMR)', 'Electronic Medical Record (EMR)')}</a></li>
                <li><a href={solutionPath('RCM', locale)}>{t('دورة الإيرادات والتأمين (RCM)', 'Revenue Cycle & NPHIES')}</a></li>
                <li><a href={solutionPath('CMS', locale)}>{t('إدارة العيادات (CMS)', 'Clinic Management (CMS)')}</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>{t('التخطيط والمنظومة', 'Ecosystem & Tools')}</h4>
              <ul>
                <li><a href={en ? '/en/systems' : '/systems'}>{t('دليل الأنظمة الـ 23 بالكامل', 'All 23 Healthcare Systems')}</a></li>
                <li><a href={en ? '/en/planning' : '/planning'}>{t('حاسبة سعة التخزين والأرشفة', 'Archive Capacity Calculator')}</a></li>
                <li><a href={en ? '/en/planning' : '/planning'}>{t('مراحل التحول والتشغيل الميداني', 'Rollout Methodology')}</a></li>
                <li><a href={en ? '/en/requests' : '/requests'}>{t('متابعة طلباتي', 'Track My Requests')}</a></li>
                <li><a href="/admin">{t('بوابة الإدارة', 'Admin Portal')}</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>{t('الأمان والسياسات', 'Trust & Governance')}</h4>
              <ul>
                <li><button type="button" onClick={() => setModal('privacy')} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'inherit' }}>{t('سياسة الخصوصية وأمن البيانات', 'Privacy & Data Security')}</button></li>
                <li><button type="button" onClick={() => setModal('terms')} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'inherit' }}>{t('شروط الاستخدام والخدمة', 'Terms of Use')}</button></li>
                {content.sections.reviews && (
                  <li><button type="button" onClick={() => setModal('review')} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'inherit' }}>{t('شارك تجربتك مع VIARA', 'Share Your Experience')}</button></li>
                )}
                <li><span style={{ fontSize: '0.82rem', color: '#64748b' }}>ISO 27001 · HIPAA · NPHIES</span></li>
              </ul>
            </div>
          </div>

          <div className="vx-footer-bottom">
            <span>© {new Date().getFullYear()} {content.brand.name} HEALTHCARE TECHNOLOGY. ALL RIGHTS RESERVED.</span>
            <span>A BETTER WAY TO CARE.</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <dialog
        ref={dialogRef}
        className="modal"
        onCancel={() => setModal(null)}
        onClick={e => {
          if (e.target === e.currentTarget) setModal(null);
        }}
        aria-label={modal || ''}
      >
        <div className="modal-head">
          <h2>
            {modal === 'calculator' ? t('تقدير سعة الأرشفة والتخزين', 'Archive Capacity Estimator') :
             modal === 'privacy' ? t('الخصوصية وأمن البيانات', 'Privacy & Data Security') :
             modal === 'terms' ? t('شروط الاستخدام', 'Terms of Use') :
             modal === 'review' ? t('شارك تجربتك', 'Share Review') : ''}
          </h2>
          <button type="button" onClick={() => setModal(null)} className="icon-button" aria-label={t('إغلاق', 'Close')}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {modal === 'calculator' && (
            <ScopeCalculator
              locale={locale}
              onChoose={est => {
                setScope(est);
                setInterest('PACS');
                setModal(null);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
          {modal === 'privacy' && (
            <div style={{ lineHeight: 1.7, fontSize: '0.95rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('بيانات الطلب والتواصل', 'Contact and Request Data')}</h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--vx-text-muted)' }}>
                {t(
                  'نجمع بيانات التواصل والمنشأة والاحتياجات لمعالجة طلبك وإعداد العرض الفني. لا تُستخدم البيانات لأي أغراض دعائية خارجية ولا تُباع لأطراف ثالثة.',
                  'We collect facility and contact information strictly to evaluate requirements and prepare technical proposals. Data is never sold or shared with external parties.'
                )}
              </p>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('حماية البيانات الطبية', 'Medical Data Protection')}</h3>
              <p style={{ color: 'var(--vx-text-muted)' }}>
                {t(
                  'يلتزم موقع VIARA بأعلى معايير التشفير (TLS 1.3 / AES-256). يرجى عدم إرسال سجلات طبية أو أسماء مرضى عبر النماذج العامة.',
                  'VIARA adheres to advanced encryption standards. Please do not submit confidential patient medical files through public contact forms.'
                )}
              </p>
            </div>
          )}
          {modal === 'terms' && (
            <div style={{ lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--vx-text-muted)' }}>
              <p>
                {t(
                  'الموقع للتعريف بالحلول وطلب العروض الهندسية والتقنية. المزايا والتكاملات والتكلفة وخطط الدعم والتدريب تعتمد نهائيًا في العرض الفني والمالي المعتمد قبل التعاقد.',
                  'This marketing website introduces software solutions and facilitates proposal requests. Actual features, integrations, licensing, and SLAs are confirmed in approved proposals.'
                )}
              </p>
            </div>
          )}
          {modal === 'review' && <ReviewForm locale={locale} />}
        </div>
      </dialog>
    </div>
    </I18nProvider>
  );
}
