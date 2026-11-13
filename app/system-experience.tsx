'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  ScanLine,
  Layers3,
  Building2,
  Monitor,
  Workflow,
  Route,
  Users,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Globe2,
  Activity,
  FileCheck2,
  CheckCircle2,
  Lock,
  Server,
  Zap,
  Stethoscope,
  Network,
  Maximize2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { txt, type Locale, type PublicReview, type SiteContent } from '../lib/site-content';
import { solutionPath, type SolutionData } from '../lib/solutions';
import { systemStory } from '../lib/system-stories';
import { systemGuides } from '../lib/system-guides';
import { systemCaptures } from '../lib/system-captures';
import { useSiteText } from '../lib/site-copy';
import CareFrame from './care-frame';
import CustomerReviews from './customer-reviews';
import ReviewForm from './review-form';
import SystemLiveGallery from './system-live-gallery';
import BrandPageHero from './brand-page-hero';
import './system-detail-redesign.css';
import './systems-usability.css';
import './system-decision.css';

// Bespoke 3D Brand Visuals matching each system with VIARA Emerald & Gold Palette
const systemBrandVisuals: Record<
  string,
  {
    image: string;
    alt: { ar: string; en: string };
    tag: { ar: string; en: string };
    subtitle: { ar: string; en: string };
  }
> = {
  RIS: {
    image: '/assets/systems/viara-ris-pro.jpg',
    alt: {
      ar: 'بيئة عمل نظام إدارة مراكز الأشعة RIS واستقبال المراجعين وأجهزة التصوير بهوية فيارا الزمردية',
      en: 'VIARA RIS Radiology Center Suite with modality scheduling and patient reception in signature emerald brand',
    },
    tag: { ar: 'بيئة مراكز الأشعة RIS', en: 'Radiology Suite 3D' },
    subtitle: { ar: 'استقبال وجدولة فحوصات الموداليتي وقوائم العمل MWL', en: 'Reception, modality scheduling and MWL worklists' },
  },
  PACS: {
    image: '/assets/systems/viara-pacs-pro.jpg',
    alt: {
      ar: 'محطة تشخيص وأرشفة الصور الطبية PACS وعارض DICOM ثلاثي الأبعاد بهوية فيارا الزمردية والذهبية',
      en: 'VIARA PACS Diagnostic Reading Suite with calibrated DICOM monitors in emerald and gold styling',
    },
    tag: { ar: 'محطة التشخيص والأرشفة PACS', en: 'Diagnostic Reading Room 3D' },
    subtitle: { ar: 'عارض ويب تشخيصي متقدم وأرشفة DICOM هجينة', en: 'Zero-footprint web viewer & hybrid DICOM archive' },
  },
  CMS: {
    image: '/assets/systems/viara-cms-pro.jpg',
    alt: {
      ar: 'مركز استقبال وعيادات المجمع الطبي CMS والملف الطبي الموحد بالرخام والزمرد والذهب',
      en: 'VIARA CMS Luxury Medical Center & Clinics Reception with electronic health records in emerald and champagne gold',
    },
    tag: { ar: 'إدارة المراكز والعيادات CMS', en: 'Medical Center & Clinics 3D' },
    subtitle: { ar: 'بهو الاستقبال وإدارة مواعيد العيادات والملفات الطبية', en: 'Luxury reception and clinic appointment scheduling' },
  },
  AI: {
    image: '/assets/systems/hero-20261025/ai.webp',
    alt: {
      ar: 'منظومة فرز أشعة الصدر والتشخيص بالذكاء الاصطناعي السريري بهوية فيارا',
      en: 'VIARA Clinical AI Radiology Triage and acute findings detection in signature brand styling',
    },
    tag: { ar: 'ذكاء الأشعة الاصطناعي AI', en: 'Clinical AI Triage 3D' },
    subtitle: { ar: 'فرز دراسات الأشعة واكتشاف الحالات الحرجة ومسودات التقارير', en: 'Automated scan triage, acute flags, and report drafts' },
  },
  PORTAL: {
    image: '/assets/systems/hero-20261025/portal.webp',
    alt: {
      ar: 'بوابات المرضى والأطباء المحيلين الرقمية عبر الهواتف والتابلت بهوية فيارا',
      en: 'VIARA Patient & Referring Physician Connected Portals on mobile and tablet devices',
    },
    tag: { ar: 'بوابات المرضى والأطباء PORTAL', en: 'Patient & Doctor Portals 3D' },
    subtitle: { ar: 'وصول رقمي موحد للمرضى والأطباء المحيلين وتحقق فوري بالـ QR', en: 'Connected mobile access with instant QR report verification' },
  },
};

type Props = {
  content: SiteContent;
  product: SolutionData;
  locale: Locale;
  reviews: PublicReview[];
  related: { id: string; name: SolutionData['name'] }[];
};

export default function SystemExperience({ content, product, locale, reviews, related }: Props) {
  const en = locale === 'en',
    home = en ? '/en' : '/',
    prefix = en ? '/en' : '';
  const t = useSiteText(locale, content),
    Arrow = en ? ArrowUpRight : ArrowUpLeft,
    Forward = en ? ArrowRight : ArrowLeft;
  const story = systemStory(product.id),
    hasCaptures = Boolean(systemCaptures[product.id]?.length);
  const icons: Record<string, typeof ScanLine> = {
    RIS: ScanLine,
    PACS: Layers3,
    AI: Sparkles,
    CMS: Building2,
    PORTAL: Users,
  };
  const Icon = icons[product.id] || Monitor;
  const guide = systemGuides[product.id];
  const brandVisual = systemBrandVisuals[product.id];
  const inquiry = `${home}?systems=${encodeURIComponent(product.id)}#contact`;

  const [activeSection, setActiveSection] = useState(hasCaptures ? 'live-system-preview' : 'capabilities');
  const navigation = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = [
      hasCaptures ? 'live-system-preview' : '',
      'capabilities',
      'workflow',
      'architecture',
      related.length ? 'related' : '',
    ].filter(Boolean);

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const boundary = (navigation.current?.getBoundingClientRect().bottom || 180) + 64;
        const current = [...ids]
          .reverse()
          .find(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= boundary);
        setActiveSection(current || ids[0]);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [product.id, hasCaptures, related.length]);

  return (
    <CareFrame content={content} locale={locale} current="systems" alternatePath={solutionPath(product.id, en ? 'ar' : 'en')}>
      <div className="vsp-detail-redesign" data-system={product.id}>
        {/* ── 1. Unified Brand Page Hero ── */}
        <BrandPageHero
          locale={locale}
          kind="product"
          eyebrow={`${content.brand.name} / ${product.id} · ${t('المنظومة السريرية المعتمدة', 'CERTIFIED CLINICAL SUITE')}`}
          title={txt(product.name, locale)}
          accent={txt(product.headline, locale)}
          description={txt(product.description, locale)}
          breadcrumbs={[
            { label: en ? 'Systems' : 'الأنظمة', href: en ? '/en/systems' : '/systems' },
            { label: txt(product.name, locale) },
          ]}
        >
          <div className="vsp-hero-actions-cluster">
            <Link className="care-btn care-btn-primary" href={inquiry}>
              <span>{t('احجز استعراضاً فنياً للنظام', 'Book a Technical Demo')}</span>
              <Arrow size={18} />
            </Link>
            {hasCaptures && (
              <a className="care-btn care-btn-secondary" href="#live-system-preview">
                <Monitor size={17} />
                <span>{t('شاهد واجهات العمل الحية', 'Inspect Live Interfaces')}</span>
              </a>
            )}
            <a className="care-link vsp-hero-link" href="#workflow">
              <Workflow size={16} />
              <span>{t('سير العمل السريري', 'Clinical Workflow')}</span>
              <Forward size={14} />
            </a>
          </div>
        </BrandPageHero>

        {/* ── 2. System Spotlight & Fast Specifications Section ── */}
        <section className="care-wrap vsp-spotlight-section" aria-label={t('نظرة عامة على النظام', 'System Overview')}>
          <div className="vsp-spotlight-grid">
            {/* 3D Brand Visual Card */}
            {brandVisual && (
              <figure className="vsp-visual-card">
                <div className="vsp-visual-header">
                  <div className="vsp-visual-brand">
                    <span className="vsp-visual-dot" />
                    <strong>VIARA {product.id}</strong>
                  </div>
                  <span className="vsp-visual-tag">{t(brandVisual.tag.ar, brandVisual.tag.en)}</span>
                </div>

                <div className="vsp-visual-img-box">
                  <img
                    src={brandVisual.image}
                    alt={t(brandVisual.alt.ar, brandVisual.alt.en)}
                    width={1280}
                    height={720}
                    loading="lazy"
                  />
                  <div className="vsp-visual-overlay">
                    <div className="vsp-visual-badge">
                      <Activity size={14} className="vsp-pulse-icon" />
                      <span>{t('محطة عمل مهيأة لأعلى أداء تشغيلي', 'Calibrated for High-Volume Operations')}</span>
                    </div>
                  </div>
                </div>

                <figcaption className="vsp-visual-caption">
                  <div className="vsp-visual-cap-row">
                    <span className="vsp-visual-sub">{t(brandVisual.subtitle.ar, brandVisual.subtitle.en)}</span>
                    <span className="vsp-visual-spec">DICOM · HL7 · AES-256</span>
                  </div>
                </figcaption>
              </figure>
            )}

            {/* Fast Specifications Card */}
            <aside className="vsp-specs-card">
              <div className="vsp-specs-header">
                <span className="vsp-specs-kicker">{t('المواصفات والنطاق التشغيلي', 'TECHNICAL SPECS & SCOPE')}</span>
                <span className="vsp-specs-code">CORE INFRASTRUCTURE</span>
              </div>

              <h3>{t('بيئة برمجية صممت لرفع كفاءة منشأتك', 'Engineered to elevate your clinical operational throughput')}</h3>

              <div className="vsp-specs-list">
                {guide && (
                  <div className="vsp-spec-item">
                    <div className="vsp-spec-icon-box">
                      <Users size={18} />
                    </div>
                    <div>
                      <strong>{t('الفئات والفرق المستهدفة', 'Target Teams & Users')}</strong>
                      <p>{txt(guide.team, locale)}</p>
                    </div>
                  </div>
                )}

                <div className="vsp-spec-item">
                  <div className="vsp-spec-icon-box">
                    <Server size={18} />
                  </div>
                  <div>
                    <strong>{t('نمط النشر والاستضافة', 'Deployment & Architecture')}</strong>
                    <p>{t('سحابي متقدم عالي التوافر أو خوادم محلية On-Premise داخل المركز', 'High-availability secure cloud or on-premise local servers')}</p>
                  </div>
                </div>

                <div className="vsp-spec-item">
                  <div className="vsp-spec-icon-box">
                    <Network size={18} />
                  </div>
                  <div>
                    <strong>{t('معايير الاتصال والربط', 'Interoperability Protocols')}</strong>
                    <p>{t('بروتوكولات DICOM 3.0، وHL7، وقوائم العمل MWL، وواجهات RESTful API', 'DICOM 3.0, HL7 messaging, Modality Worklists (MWL), and REST APIs')}</p>
                  </div>
                </div>

                <div className="vsp-spec-item">
                  <div className="vsp-spec-icon-box">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>{t('الأمان وحماية خصوصية المرضى', 'Security & PHI Protection')}</strong>
                    <p>{t('تشفير الحقول بـ AES-256-GCM وسجلات تدقيق غير قابلة للتلاعب وتوافق HIPAA', 'AES-256-GCM field encryption, immutable audit chaining, HIPAA compliance')}</p>
                  </div>
                </div>
              </div>

              {guide?.discussion && (
                <div className="vsp-spec-discuss">
                  <Sparkles size={16} className="vsp-sparkle-icon" />
                  <div>
                    <strong>{t('ما نناقشه خلال العرض الفني:', 'What we review in the demonstration:')}</strong>
                    <span>{txt(guide.discussion, locale)}</span>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* ── 3. Sticky Interactive Navigation Dock ── */}
        <div className="care-wrap vsp-dock-wrapper" ref={navigation}>
          <div className="vsp-overview-dock">
            <div className="vsp-dock-identity">
              <span className="vsp-dock-icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <div>
                <bdi>{product.id}</bdi>
                <strong>{txt(product.name, locale)}</strong>
              </div>
            </div>

            <nav aria-label={t('أقسام الصفحة', 'Page sections')}>
              {hasCaptures && (
                <a
                  href="#live-system-preview"
                  className={activeSection === 'live-system-preview' ? 'is-active' : ''}
                >
                  <Monitor size={15} />
                  <span>{t('الواجهات الحية', 'Live Interfaces')}</span>
                </a>
              )}
              <a
                href="#capabilities"
                className={activeSection === 'capabilities' ? 'is-active' : ''}
              >
                <SlidersHorizontal size={15} />
                <span>{t('القدرات والمزايا', 'Capabilities')}</span>
              </a>
              <a
                href="#workflow"
                className={activeSection === 'workflow' ? 'is-active' : ''}
              >
                <Workflow size={15} />
                <span>{t('سير العمل السريري', 'Clinical Workflow')}</span>
              </a>
              <a
                href="#architecture"
                className={activeSection === 'architecture' ? 'is-active' : ''}
              >
                <Cpu size={15} />
                <span>{t('المعمارية والربط', 'Architecture')}</span>
              </a>
              {related.length > 0 && (
                <a
                  href="#related"
                  className={activeSection === 'related' ? 'is-active' : ''}
                >
                  <Layers3 size={15} />
                  <span>{t('بقية المنظومة', 'Other Systems')}</span>
                </a>
              )}
            </nav>

            <Link className="vsp-dock-btn" href={inquiry}>
              <span>{t('اطلب استعراضاً', 'Book Demo')}</span>
              <Arrow size={14} />
            </Link>
          </div>
        </div>

        {/* ── 4. Live System Interfaces Gallery (Workstation Terminal) ── */}
        <div className="care-wrap vsp-gallery-container">
          <SystemLiveGallery key={product.id} currentSystemId={product.id} locale={locale} />
        </div>

        {/* ── 5. Modular System Capabilities & Features Grid ── */}
        <section className="care-wrap vsp-capabilities-section" id="capabilities" aria-labelledby="vsp-cap-title">
          <div className="vsp-section-heading">
            <div>
              <div className="vsp-kicker-badge">
                <SlidersHorizontal size={13} />
                <span>{t('القدرات والوحدات الوظيفية', 'SYSTEM CAPABILITIES & MODULES')}</span>
              </div>
              <h2 id="vsp-cap-title">
                {t('أدوات صممت حول', 'Tools engineered around')}{' '}
                <em>{t('طبيعة يومك السريري.', 'your clinical workday.')}</em>
              </h2>
            </div>
            <p>
              {t(
                'نحدد الوحدات والصلاحيات المطلوبة بدقة مع فريقك، ونراجع توافق الأجهزة ونقاط الربط والاستضافة ضمن العرض الفني المخصص لمركزك.',
                'We tailor required modules and permissions with your clinical team, verifying modality compatibility and integration scope in your center’s dedicated proposal.'
              )}
            </p>
          </div>

          <div className="vsp-features-grid">
            {product.features.map((feature, i) => (
              <article key={i} className="vsp-feature-card">
                <div className="vsp-feat-top">
                  <div className="vsp-feat-icon-box">
                    <CheckCircle2 size={20} strokeWidth={1.8} />
                  </div>
                  <span className="vsp-feat-num">0{i + 1}</span>
                </div>
                <h3>{txt(feature, locale)}</h3>
                <p>
                  {t(
                    'تم تصميم هذه الوحدة لتقليل الأعباء اليدوية، وتسريع معالجة الفحوصات، وتوفير دقة تامة في تدفق البيانات عبر أقسام المركز.',
                    'Engineered to eliminate manual bottlenecks, accelerate study turnaround, and ensure total data accuracy across departments.'
                  )}
                </p>
              </article>
            ))}
          </div>

          {txt(product.note, locale) && (
            <div className="vsp-note-banner">
              <SlidersHorizontal size={19} className="vsp-note-icon" />
              <div>
                <strong>{t('ملاحظة النطاق والتهيئة:', 'Scope & Configuration Note:')}</strong>
                <p>{txt(product.note, locale)}</p>
              </div>
            </div>
          )}
        </section>

        {/* ── 6. Connected Clinical Workflow Journey ── */}
        <section className="vsp-workflow-section" id="workflow" aria-labelledby="vsp-workflow-title">
          <div className="care-wrap">
            <div className="vsp-section-heading vsp-workflow-head">
              <div>
                <div className="vsp-kicker-badge">
                  <Workflow size={13} />
                  <span>{t('مسار العمل السريري المتصل', 'CONNECTED CLINICAL WORKFLOW')}</span>
                </div>
                <h2 id="vsp-workflow-title">
                  {txt(story.signature, locale)}
                </h2>
              </div>
              <p>
                {t(
                  'انتقال منظم وواضح للبيانات من أول اتصال بالمراجع حتى إغلاق الفحص، مع توزيع الأدوار والصلاحيات بين أعضاء الفريق.',
                  'A structured, transparent flow of information from patient intake to study closure, defining clear handoffs across team roles.'
                )}
              </p>
            </div>

            <div className="vsp-workflow-timeline">
              {story.steps.map((step, idx) => (
                <div key={idx} className="vsp-wf-card">
                  <div className="vsp-wf-rail">
                    <div className="vsp-wf-num-badge">
                      <span>0{idx + 1}</span>
                    </div>
                    {idx < story.steps.length - 1 && <div className="vsp-wf-connector" />}
                  </div>

                  <div className="vsp-wf-content">
                    <span className="vsp-wf-phase-tag">
                      {t(`المرحلة 0${idx + 1}`, `Phase 0${idx + 1}`)}
                    </span>
                    <h3>{txt(step.title, locale)}</h3>
                    <p>{txt(step.description, locale)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="vsp-workflow-footer">
              <Link className="care-link vsp-journey-link" href={`${prefix}/journeys`}>
                <Route size={16} />
                <span>{t('استكشف ترابط الفرق والأنظمة عبر كافة مسارات العمل', 'Explore how teams and systems connect across full clinical workflows')}</span>
                <Forward size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 7. Architecture & Interoperability Guarantee ── */}
        <section className="care-wrap vsp-architecture-section" id="architecture" aria-labelledby="vsp-arch-title">
          <div className="vsp-arch-card">
            <div className="vsp-arch-text">
              <div className="vsp-kicker-badge">
                <Cpu size={13} />
                <span>{t('المعمارية التقنية والربط', 'TECHNICAL ARCHITECTURE & INTEROPERABILITY')}</span>
              </div>
              <h2 id="vsp-arch-title">
                {t('جاهزية فورية للاندماج مع', 'Instant readiness to interface with')}{' '}
                <em>{t('أجهزتك وأنظمتك القائمة.', 'your modalities and existing systems.')}</em>
              </h2>
              <p>
                {t(
                  'لا نجبرك على تغيير أجهزة الأشعة أو البنية التحتية القائمة. صممت فيارا لتدعم بروتوكولات DICOM 3.0 وHL7 ومعايير الربط الحديثة عبر واجهات RESTful API لضمان استقرار دائم دون تعطل سير العمل.',
                  'We do not force you to replace existing imaging hardware. VIARA is engineered to interface natively via DICOM 3.0, HL7, and modern REST APIs to guarantee long-term operational stability without workflow interruptions.'
                )}
              </p>

              <div className="vsp-arch-points">
                <div className="vsp-arch-pt">
                  <CheckCircle2 size={16} />
                  <span>{t('دعم كامل لأجهزة CT, MRI, X-Ray, Ultrasound من مختلف الشركات', 'Universal modality support (CT, MRI, X-Ray, Ultrasound)')}</span>
                </div>
                <div className="vsp-arch-pt">
                  <CheckCircle2 size={16} />
                  <span>{t('أرشفة مشفرة محلياً وسحابياً مع استرجاع سريع لدراسات الـ DICOM', 'Encrypted local & cloud archive with low-latency DICOM retrieval')}</span>
                </div>
                <div className="vsp-arch-pt">
                  <CheckCircle2 size={16} />
                  <span>{t('سجلات تدقيق تشفيرية وتوافق مع لوائح الخصوصية الصحية', 'Cryptographic audit trails and healthcare privacy compliance')}</span>
                </div>
              </div>

              <div className="vsp-arch-links">
                <Link className="care-btn care-btn-primary" href={`${prefix}/planning`}>
                  <span>{t('مراجعة خطط النطاق والتنفيذ', 'Review Rollout & Scope Options')}</span>
                  <Arrow size={16} />
                </Link>
              </div>
            </div>

            <div className="vsp-arch-grid-box">
              <div className="vsp-arch-stat">
                <span className="vsp-arch-val">DICOM 3.0</span>
                <span className="vsp-arch-lbl">{t('خدمات C-STORE, C-FIND, MWL', 'C-STORE, C-FIND, MWL Services')}</span>
              </div>
              <div className="vsp-arch-stat">
                <span className="vsp-arch-val">HL7 Ready</span>
                <span className="vsp-arch-lbl">{t('تبادل رسائل المرضى والفحوصات', 'Clinical Message Exchange')}</span>
              </div>
              <div className="vsp-arch-stat">
                <span className="vsp-arch-val">AES-256</span>
                <span className="vsp-arch-lbl">{t('تشفير متقدم لبيانات المرضى PHI', 'Field-Level Data Encryption')}</span>
              </div>
              <div className="vsp-arch-stat">
                <span className="vsp-arch-val">99.9%</span>
                <span className="vsp-arch-lbl">{t('ضمان الجاهزية التشغيلية SLA', 'High Availability Uptime SLA')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. Related Systems within the VIARA Ecosystem ── */}
        {related.length > 0 && (
          <section className="care-wrap vsp-related-section" id="related" aria-labelledby="vsp-related-title">
            <div className="vsp-section-heading">
              <div>
                <div className="vsp-kicker-badge">
                  <Layers3 size={13} />
                  <span>{t('منظومة VIARA المتكاملة', 'THE CONNECTED VIARA ECOSYSTEM')}</span>
                </div>
                <h2 id="vsp-related-title">{t('استكشف بقية حلول المنظومة.', 'Explore other connected solutions.')}</h2>
              </div>
              <Link className="care-link" href={`${prefix}/systems`}>
                <span>{t('دليل كافة الأنظمة', 'All Systems Directory')}</span>
                <Forward size={16} />
              </Link>
            </div>

            <div className="vsp-related-grid">
              {related.map(item => {
                const RelatedIcon = icons[item.id] || Monitor;
                const relVisual = systemBrandVisuals[item.id];
                return (
                  <Link
                    key={item.id}
                    href={solutionPath(item.id, locale)}
                    className="vsp-related-card"
                    data-system={item.id}
                  >
                    <div className="vsp-rel-card-top">
                      <span className="vsp-related-icon">
                        <RelatedIcon size={24} strokeWidth={1.6} />
                      </span>
                      <span className="vsp-rel-code">VIARA {item.id}</span>
                    </div>

                    <div className="vsp-rel-content">
                      <h3>{txt(item.name, locale)}</h3>
                      <p>
                        {relVisual
                          ? t(relVisual.subtitle.ar, relVisual.subtitle.en)
                          : t('تعرّف على القدرات والواجهات ومسار العمل السريري', 'Explore capabilities, interfaces and clinical workflow')}
                      </p>
                    </div>

                    <div className="vsp-rel-footer">
                      <span>{t('استكشف النظام', 'Explore system')}</span>
                      <Arrow size={16} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 9. Strategic Call-to-Action Card ── */}
        <section className="care-wrap vsp-cta-section" aria-labelledby="vsp-cta-title">
          <div className="vsp-cta-card">
            <div className="vsp-cta-info">
              <span className="vsp-cta-kicker">{t('الخطوة التالية لمركزك', 'YOUR CENTER’S NEXT STEP')}</span>
              <h2 id="vsp-cta-title">
                {t('لنرَ كيف يناسب', 'See how')}{' '}
                <em>VIARA {product.id}</em>{' '}
                {t('طريقة عمل فريقك.', 'fits your team.')}
              </h2>
              <p>
                {t(
                  'شاركنا عدد الفروع والأجهزة الحالية وحجم الفحوصات المتوقع. نرتب معك جلسة استعراض حي (Live Demo) على النظام الفعلي ونراجع النطاق الأنسب لمركزك الطبي.',
                  'Tell us about your branches, modalities, and daily examination workload. We will arrange a live technical demonstration and review the most cost-effective scope for your facility.'
                )}
              </p>

              <div className="vsp-cta-actions">
                <Link className="care-btn care-btn-primary" href={inquiry}>
                  <span>{t('احجز جلسة استعراض فني (Live Demo)', 'Book a Live Technical Demo')}</span>
                  <Arrow size={18} />
                </Link>
                <Link className="vsp-cta-sublink" href={`${prefix}/planning`}>
                  <span>{t('استكشف الباقات والنطاق الفني', 'Explore packages & technical scope')}</span>
                  <Forward size={14} />
                </Link>
              </div>
            </div>

            <aside className="vsp-cta-aside">
              <div className="vsp-cta-guarantee-box">
                <ShieldCheck size={28} className="vsp-guard-icon" />
                <div>
                  <strong>{t('استشارة فنية متخصصة بدون التزام', 'No-Obligation Clinical Consultation')}</strong>
                  <p>{t('جلسة نقاش مع مهندسي نظم الرعاية لمراجعة أجهزة مركزك ونقاط الربط فنيًا.', 'In-depth consultation with healthcare systems engineers to assess your facility’s equipment and integration needs.')}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ── 10. Customer Reviews & Community Feedback ── */}
        {content.sections.reviews && (
          <>
            <CustomerReviews reviews={reviews} locale={locale} />
            <section className="care-wrap vsp-review-form">
              <details>
                <summary>
                  <span>{t('تستخدم هذا النظام في مركزك؟ شارك تجربتك', 'Use this system in your facility? Share your experience')}</span>
                  <Plus size={18} />
                </summary>
                <ReviewForm locale={locale} systemId={product.id} />
              </details>
            </section>
          </>
        )}
      </div>
    </CareFrame>
  );
}
