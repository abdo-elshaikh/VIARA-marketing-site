'use client';

import Link from 'next/link';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Zap,
  Network,
  HeartPulse,
  ScanLine,
  Layers,
  Database,
  Globe2,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Activity,
  Cpu,
  Building2,
} from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import CareFrame from './care-frame';
import CompanyApproach from './company-approach';
import CompanyDetails from './company-details';
import BrandPageHero from './brand-page-hero';
import { useSiteText } from '../lib/site-copy';
import './brand-editorial.css';
import './company-about.css';

export default function AboutView({
  content,
  locale = 'ar',
}: {
  content: SiteContent;
  locale?: Locale;
}) {
  const en = locale === 'en';
  const prefix = en ? '/en' : '';
  const home = en ? '/en' : '/';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;
  const company = content.company;
  const offices = company.offices.filter(item => item.enabled);

  // Core Platform Pillars
  const pillars = [
    {
      id: 'RIS',
      code: 'VIARA RIS',
      badge: t('إدارة مراكز الأشعة', 'Radiology Information System'),
      title: t('محرك سير عمل الأشعة والمواعيد', 'Radiology Workflow & Modality Scheduling'),
      desc: t(
        'تنظيم استقبال المراجعين، إدارة قوائم العمل (MWL) لأجهزة التصوير، تتبع حالة الفحوصات والتقارير، والحسابات الإشعاعية المتخصصة.',
        'Patient reception, Modality Worklist (MWL) integration, exam and report tracking, and specialized radiology billing.'
      ),
      icon: ScanLine,
      color: '#007b61',
      link: `${prefix}/systems#RIS`,
      highlights: [
        t('قوائم عمل آلية (MWL) لأجهزة CT, MRI, X-Ray', 'Automated Modality Worklists (MWL)'),
        t('توزيع ذكي للمهام بين الفنيين وأطباء الأشعة', 'Smart task assignment for techs & radiologists'),
        t('متابعة لحظية لحالة الفحص والاعتماد والفوترة', 'Real-time exam status, sign-off & billing'),
      ],
    },
    {
      id: 'PACS',
      code: 'VIARA PACS',
      badge: t('أرشفة وعارض الصور الطبية', 'Medical Imaging Archive & Viewer'),
      title: t('أرشفة DICOM سحابية وهجينة مع عارض متقدم', 'Hybrid DICOM Archive & Zero-Footprint Web Viewer'),
      desc: t(
        'حفظ آمن واسترجاع فائق السرعة لدراسات الأشعة، مع عارض ويب تشخيصي متقدم يدعم أدوات القياس والمقارنة ثلاثية الأبعاد.',
        'High-speed retrieval and secure archiving of diagnostic imaging with a zero-footprint DICOM viewer supporting 3D measurements.'
      ),
      icon: Database,
      color: '#073e32',
      link: `${prefix}/systems#PACS`,
      highlights: [
        t('عارض ويب متطور دون حاجة لتثبيت برامج', 'Zero-footprint calibrated web viewer'),
        t('أرشفة هجينة محلية وسحابية مقاومة للانقطاع', 'Resilient local & cloud hybrid storage'),
        t('أدوات قياس ومقارنة دراسات سابقة فورية', 'Instant prior-study comparison & measurement tools'),
      ],
    },
    {
      id: 'CMS',
      code: 'VIARA CMS',
      badge: t('إدارة المراكز الطبية والعيادات', 'Clinic & Medical Center Management'),
      title: t('إدارة العيادات والملف الموحد والمالية', 'Clinical Records, Appointments & Financial Control'),
      desc: t(
        'ربط جميع أقسام المركز والعيادات التخصصية في ملف طبي إلكتروني موحد، مع جدولة المواعيد وإدارة المطالبات وشركات التأمين.',
        'Connecting all medical center specialties and clinics into one electronic health record, with appointment scheduling and billing.'
      ),
      icon: Building2,
      color: '#0d4637',
      link: `${prefix}/systems#CMS`,
      highlights: [
        t('ملف طبي إلكتروني موحد وشامل للمراجع', 'Unified electronic health record for patients'),
        t('جدولة مواعيد دقيقة لكافة العيادات والأطباء', 'Accurate clinic & specialist scheduling'),
        t('إدارة المطالبات المالية والتعاقدات التأمينية', 'Insurance claims, contracts & revenue control'),
      ],
    },
    {
      id: 'PORTAL',
      code: 'VIARA PORTALS',
      badge: t('بوابات المرضى والأطباء المحولين', 'Patient & Doctor Connected Portals'),
      title: t('وصول رقمي فوري للنتائج مع تحقق بالـ QR', 'Instant Digital Access with Verified QR Tracking'),
      desc: t(
        'بوابات مخصصة للهواتف والويب تتيح للمريض والطبيب المحيل استعراض التقارير والصور الطبية فور اعتمادها دون انتظار.',
        'Responsive web and mobile portals providing patients and referring physicians instant, secure access to approved reports and imaging.'
      ),
      icon: Globe2,
      color: '#007b61',
      link: `${prefix}/systems#PORTAL`,
      highlights: [
        t('استعراض مباشر للتقارير المعتمدة والصور', 'Instant review of verified reports & DICOM images'),
        t('رمز QR مشفر للتحقق من صحة التقرير فوراً', 'Encrypted QR code for instant report validation'),
        t('بوابة مستقلة للأطباء المحولين لمتابعة مرضاهم', 'Dedicated portal for referring physicians to track cases'),
      ],
    },
  ];

  // Engineering & Company Values
  const values = [
    {
      icon: Zap,
      number: '01',
      title: t('السرعة السريرية واختصار زمن الفحص', 'Clinical Velocity & Zero Friction'),
      subtitle: t('كل ثانية تصنع فرقاً في رعاية المريض', 'Every second matters in patient care'),
      body: t(
        'نصمم واجهات العمل لتقليل عدد النقرات والتحويل بين الشاشات إلى أقصى حد، مع تحميل فوري لدراسات الـ DICOM الكبيرة، حتى يتفرغ الكادر الطبي للتشخيص دون إجهاد تقني.',
        'We design user interfaces to minimize clicks and screen switching, ensuring zero-latency loading of heavy DICOM studies so clinical teams stay focused on diagnostic decisions.'
      ),
    },
    {
      icon: ShieldCheck,
      number: '02',
      title: t('أمان البيانات وخصوصية السجلات الصحية', 'Enterprise PHI Privacy & AES-256'),
      subtitle: t('حماية مشددة للمعلومات الصحية الحساسة', 'Rigorous protection for patient information'),
      body: t(
        'نعتمد تشفير الحقول الحساسة بـ AES-256-GCM، وفهرسة عمياء للبحث المشفر، وسجلات تدقيق تشفيرية غير قابلة للتلاعب، مع التوافق التام مع متطلبات HIPAA وGDPR.',
        'We enforce field-level AES-256-GCM encryption, blind indexing for encrypted searches, and tamper-evident audit chaining in strict alignment with HIPAA and GDPR.'
      ),
    },
    {
      icon: Network,
      number: '03',
      title: t('تكامل مفتوح مع مختلف أجهزة الموداليتي', 'Universal Modality Interoperability'),
      subtitle: t('تواصل حر ببروتوكولات DICOM 3.0 وHL7', 'Open communication across DICOM & HL7'),
      body: t(
        'نتكامل مباشرة مع أجهزة التصوير (CT, MRI, X-Ray, Ultrasound) من مختلف المصنعين العالميين دون قيود احتكارية، عبر معايير C-STORE وC-FIND وقوائم MWL الموثوقة.',
        'We interface directly with modalities (CT, MRI, X-Ray, Ultrasound) from global vendors without vendor lock-in, through proven C-STORE, C-FIND, and MWL standards.'
      ),
    },
    {
      icon: HeartPulse,
      number: '04',
      title: t('تجربة إنسانية مصممة للفريق الطبي', 'Human-Centric Clinical Experience'),
      subtitle: t('واجهات تقلل الإجهاد وتمنع الأخطاء', 'Interfaces designed to reduce burnout & errors'),
      body: t(
        'نعامل البرمجيات الطبية كأداة حيوية لإنقاذ الأرواح، لذلك نعتمد خطوطاً عربية مريحة، وتبايناً مدروساً لمحطات قراءة الأشعة، وتنبيهات بصرية ذكية تمنع السهو الإداري.',
        'We treat medical software as a critical clinical tool. We engineer ergonomic typography, calibrated dark themes for reading rooms, and intelligent alerts that prevent administrative errors.'
      ),
    },
  ];

  return (
    <CareFrame content={content} locale={locale} current="about">
      <div className="ve-page about-editorial-page">
        {/* ── 1. Luxury Unified Brand Hero ── */}
        <BrandPageHero
          locale={locale}
          kind="about"
          eyebrow={txt(company.eyebrow, locale) || t('هندسة النظم الطبية والتشخيص الشعاعي', 'HEALTHCARE SYSTEMS & RADIOLOGY INFORMATICS')}
          title={t('التقنية تبدأ', 'Technology starts')}
          accent={t('من فهم واقعك السريري.', 'from your clinical reality.')}
          description={t(
            'نحن مطور ومبتكر منظومة VIARA: فريق هندسي يكرس خبراته لتطوير برمجيات سير عمل الأشعة، أرشفة الصور الطبية PACS، أنظمة إدارة العيادات والمراكز CMS، والبوابات الرقمية المترابطة. نضع سرعة الفحص وأمان السجلات في صلب كل تفصيلة.',
            'We are the creators of VIARA: a specialized healthcare informatics team dedicated to engineering radiology workflows (RIS), diagnostic imaging archives (PACS), clinic management (CMS), and connected portals. We engineer clinical speed and data security into every detail.'
          )}
        >
          <div className="about-hero-actions-cluster">
            <Link className="care-btn care-btn-primary" href={`${home}#contact`}>
              <span>{t('ناقش متطلبات مركزك معنا', 'Discuss your center requirements')}</span>
              <Arrow size={18} />
            </Link>
            <a className="care-btn care-btn-secondary" href="#about-pillars">
              <span>{t('أركان المنظومة', 'Platform Pillars')}</span>
              <Forward size={16} />
            </a>
            <a className="care-link about-hero-link" href="#about-approach">
              <span>{t('منهجية التحول الرقمي', 'Our Methodology')}</span>
              <Forward size={15} />
            </a>
          </div>
        </BrandPageHero>

        {/* ── 2. Credibility & Strategic Metrics Strip ── */}
        <section className="about-metrics-bar" aria-label={t('مؤشرات المنظومة', 'Platform Highlights')}>
          <div className="care-wrap">
            <div className="about-metrics-grid">
              <div className="about-metric-item">
                <span className="about-metric-value">RIS · CMS</span>
                <span className="about-metric-title">{t('تخصص في الأشعة والمراكز', 'Radiology & Clinic Focus')}</span>
                <span className="about-metric-sub">{t('برمجيات صممت خصيصاً للرعاية الطبية', 'Engineered strictly for healthcare')}</span>
              </div>
              <div className="about-metric-item">
                <span className="about-metric-value">DICOM & HL7</span>
                <span className="about-metric-title">{t('معايير الاتصال الطبي المعتمدة', 'Global Diagnostic Standards')}</span>
                <span className="about-metric-sub">{t('ربط مباشر مع أجهزة CT, MRI, X-Ray', 'Direct modality interconnectivity')}</span>
              </div>
              <div className="about-metric-item">
                <span className="about-metric-value">AES-256</span>
                <span className="about-metric-title">{t('تشفير الحقول وسجلات التدقيق', 'Field-Level Data Encryption')}</span>
                <span className="about-metric-sub">{t('حماية صارمة لخصوصية بيانات المرضى', 'Enterprise PHI security & privacy')}</span>
              </div>
              <div className="about-metric-item">
                <span className="about-metric-value">Hybrid & Cloud</span>
                <span className="about-metric-title">{t('نشر سحابي ومحلي On-Premise', 'Hybrid Cloud & On-Premise')}</span>
                <span className="about-metric-sub">{t('مرونة في التثبيت حسب متطلبات المركز', 'Deployment options tailored to your facility')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Origin Story & Corporate Innovation Suite ── */}
        <section className="care-wrap about-story-showcase" id="about-story" aria-labelledby="about-story-title">
          <div className="about-story-grid">
            {/* Story Text */}
            <div className="about-story-narrative">
              <div className="about-kicker-badge">
                <Sparkles size={14} className="about-badge-sparkle" />
                <span>{t('قصة التأسيس والرؤية', 'OUR ORIGIN & VISION')}</span>
              </div>

              <h2 id="about-story-title">{txt(company.storyTitle, locale)}</h2>
              <p className="about-story-lead" style={{ whiteSpace: 'pre-line' }}>{txt(company.storyBody, locale)}</p>

              {/* Luxury Quote Card */}
              <blockquote className="about-quote-box">
                <div className="about-quote-line" aria-hidden="true" />
                <p>
                  {t(
                    '«هدفنا ليس مجرد بيع رخص برمجية، بل بناء بنية تحتية رقمية تمنح الطبيب هدوء التركيز، وتمنح المريض سرعة الخدمة، وتوفر للإدارة حوكمة وشفافية كاملة.»',
                    '“Our mission is not merely selling software licenses; it is crafting a resilient digital infrastructure that gives clinicians diagnostic peace of mind, offers patients rapid service, and provides leadership with absolute operational clarity.”'
                  )}
                </p>
                <cite>
                  <strong>{t('فريق هندسة النظم وتطوير المنظومة', 'VIARA Healthcare Engineering Team')}</strong>
                  <span>{txt(company.legalName, locale)}</span>
                </cite>
              </blockquote>

              <div className="about-story-points">
                <div className="about-st-point">
                  <CheckCircle2 size={16} />
                  <span>{t('واجهات عربية وإنجليزية مدروسة سريرياً', 'Clinically optimized Arabic & English interfaces')}</span>
                </div>
                <div className="about-st-point">
                  <CheckCircle2 size={16} />
                  <span>{t('تحديثات برمجية مرنة ومصممة لاستمرارية التشغيل', 'Continuous software updates designed for operational continuity')}</span>
                </div>
                <div className="about-st-point">
                  <CheckCircle2 size={16} />
                  <span>{t('عقد فني واضح بنطاق عمل شفاف ومعتمد', 'Crystal-clear technical scope and SLA agreement')}</span>
                </div>
              </div>
            </div>

            {/* Visual Corporate Presentation */}
            <div className="about-story-visual-wrap">
              <figure className="about-corporate-card">
                <div className="about-corp-header">
                  <div className="about-corp-brand">
                    <span className="about-corp-dot" />
                    <strong>VIARA HEALTHCARE TECHNOLOGIES</strong>
                  </div>
                  <span className="about-corp-tag">{t('مختبر الابتكار السريري', 'CLINICAL SUITE')}</span>
                </div>

                <div className="about-corp-img-box">
                  <img
                    src={content.imagery.care}
                    alt={t(
                      'صورة تعريفية عن الشركة وفريق العمل',
                      'Company and team illustration'
                    )}
                    width={1280}
                    height={720}
                    loading="lazy"
                  />
                  <div className="about-corp-overlay">
                    <div className="about-corp-badge">
                      <Activity size={14} className="about-pulse-icon" />
                      <span>{t('منظومة برمجية حية ومتطورة باستمرار', 'Continuous Healthcare Platform Evolution')}</span>
                    </div>
                  </div>
                </div>

                <figcaption className="about-corp-caption">
                  <div className="about-corp-cap-row">
                    <span className="about-corp-location">
                      <MapPin size={13} />
                      {txt(company.imageCaption, locale)}
                    </span>
                    <span className="about-corp-spec">DICOM · HL7 · AES-256</span>
                  </div>
                  <p>
                    {t(
                      'نعمل جنباً إلى جنب مع نخبة من أطباء الأشعة ومديري المراكز لتطوير حلول برمجية حقيقية تناسب الاحتياج الفعلي.',
                      'Collaborating directly with radiologists and center managers to engineer purpose-built clinical software solutions.'
                    )}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── 4. Unified Platform Pillars ── */}
        <section className="about-pillars-section" id="about-pillars" aria-labelledby="about-pillars-title">
          <div className="care-wrap">
            <div className="about-section-head">
              <div className="about-kicker-badge">
                <Layers size={14} className="about-badge-sparkle" />
                <span>{t('أركان المنظومة المتكاملة', 'THE UNIFIED PLATFORM PILLARS')}</span>
              </div>
              <h2 id="about-pillars-title">
                {t('أربعة حلول متناغمة تغطي', 'Four integrated solutions covering')}{' '}
                <em>{t('كل زاوية في منشأتك الطبية.', 'every aspect of your clinical facility.')}</em>
              </h2>
              <p>
                {t(
                  'صممت أنظمة VIARA لتتكامل تلقائياً كوحدة رقمية موحدة تمنع تكرار إدخال البيانات، مع إمكانية تفعيل كل نظام مستقلاً وتكامله مع برامجك القائمة.',
                  'Engineered to operate seamlessly as one synchronized ecosystem preventing duplicate data entry, while remaining modular enough to integrate with existing legacy infrastructure.'
                )}
              </p>
            </div>

            <div className="about-pillars-grid">
              {pillars.map(pillar => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.id} className="about-pillar-card">
                    <div className="about-pillar-top">
                      <div className="about-pillar-icon-box">
                        <Icon size={24} strokeWidth={1.7} />
                      </div>
                      <span className="about-pillar-badge">{pillar.badge}</span>
                    </div>

                    <span className="about-pillar-code">{pillar.code}</span>
                    <h3 className="about-pillar-title">{pillar.title}</h3>
                    <p className="about-pillar-desc">{pillar.desc}</p>

                    <div className="about-pillar-highlights">
                      <ul>
                        {pillar.highlights.map((hl, hIdx) => (
                          <li key={hIdx}>
                            <CheckCircle2 size={13} className="about-hl-icon" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="about-pillar-footer">
                      <Link href={pillar.link} className="about-pillar-link">
                        <span>{t('تفاصيل النظام ومزاياه', 'Explore system features')}</span>
                        <Forward size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Core Engineering Values ── */}
        <section className="about-values-section" id="about-values" aria-labelledby="about-values-title">
          <div className="care-wrap">
            <div className="about-section-head">
              <div className="about-kicker-badge">
                <Cpu size={14} className="about-badge-sparkle" />
                <span>{t('المبادئ الهندسية والأخلاقية', 'CORE ENGINEERING PRINCIPLES')}</span>
              </div>
              <h2 id="about-values-title">
                {t('وضوح في المعمارية..', 'Clarity in architecture..')}{' '}
                <em>{t('وعناية فائقة بالتفاصيل السريرية.', 'and meticulous clinical detail.')}</em>
              </h2>
              <p>
                {t(
                  'لا نعتبر البرمجيات مجرد واجهات أو أكواد، بل وسيطاً حيوياً يؤثر مباشرة في صحة المريض وسرعة التشخيص وراحة الطبيب. لذلك تحكمنا مبادئ هندسية لا نحيد عنها.',
                  'We do not treat software as mere screens and code; it is a vital clinical instrument directly impacting patient diagnosis and caregiver wellbeing. We adhere to uncompromising engineering standards.'
                )}
              </p>
            </div>

            <div className="about-values-grid">
              {company.principles.filter(item => item.enabled).map((item, index) => ({ ...values[index % values.length], number: item.id, title: txt(item.title, locale), subtitle: '', body: txt(item.body, locale) })).map(val => {
                const Icon = val.icon;
                return (
                  <article key={val.number} className="about-val-card">
                    <div className="about-val-top">
                      <div className="about-val-icon">
                        <Icon size={22} strokeWidth={1.6} />
                      </div>
                      <span className="about-val-num">{val.number}</span>
                    </div>

                    <h3 className="about-val-title">{val.title}</h3>
                    <span className="about-val-subtitle">{val.subtitle}</span>
                    <p className="about-val-body">{val.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. Phased Transformation Roadmap (CompanyApproach) ── */}
        <div className="care-wrap about-approach-container">
          <CompanyApproach locale={locale} />
        </div>
        <CompanyDetails company={company} locale={locale} />

        {/* ── 8. Interactive Conversation & Next Steps Card ── */}
        <section className="care-wrap about-conversation-wrap" id="about-contact" aria-labelledby="about-contact-title">
          <div className="about-convo-card">
            <div className="about-convo-info">
              <span className="about-convo-kicker">{t('لنتحدث عن مركزك الطبي', 'LET’S DISCUSS YOUR FACILITY')}</span>
              <h2 id="about-contact-title">
                {t('ابدأ بتحديد ما تريد', 'Start by identifying what you')}{' '}
                <em>{t('تطويره وتنظيمه اليوم.', 'want to streamline today.')}</em>
              </h2>
              <p>
                {t(
                  'سواء كنت تؤسس مركز أشعة جديداً، أو ترغب في استبدال أنظمة قديمة، أو تبحث عن عارض PACS ويب وأرشفة سحابية آمنة؛ فريقنا التقني جاهز لمناقشة التفاصيل وتحديد الخطوة العملية القادمة معك.',
                  'Whether launching a new imaging center, replacing legacy systems, or seeking a zero-footprint web PACS archive; our engineering team is ready to analyze your workflow and propose tailored next steps.'
                )}
              </p>

              <div className="about-convo-actions">
                <Link className="care-btn care-btn-primary" href={`${home}#contact`}>
                  <span>{t('احجز جلسة استعراض فني (Live Demo)', 'Book a Live Technical Demo')}</span>
                  <Arrow size={18} />
                </Link>
                <Link className="about-convo-track-link" href={`${prefix}/requests`}>
                  <FileCheck2 size={16} />
                  <span>{t('لديك طلب سابق؟ تابع حالته الآن', 'Already submitted a request? Track status')}</span>
                </Link>
              </div>
            </div>

            <aside className="about-convo-card-side">
              <div className="about-corp-identity">
                <img src="/assets/viara-symbol.webp" width={56} height={56} loading="lazy" alt="VIARA Symbol" className="about-symbol-img" />
                <div>
                  <strong>{txt(company.legalName, locale)}</strong>
                  <span>{t('هندسة النظم الطبية وحلول البرمجيات', 'Healthcare Technologies & Software Solutions')}</span>
                </div>
              </div>

              <div className="about-convo-channels">
                {content.contact.email && (
                  <a href={`mailto:${content.contact.email}`} className="about-convo-chan">
                    <Mail size={16} />
                    <div>
                      <small>{t('البريد الإلكتروني الرسمي', 'Official Email')}</small>
                      <bdi>{content.contact.email}</bdi>
                    </div>
                  </a>
                )}

                {content.contact.phone && (
                  <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="about-convo-chan">
                    <Phone size={16} />
                    <div>
                      <small>{t('هاتف الاستفسارات والدعم', 'Direct Phone Line')}</small>
                      <bdi>{content.contact.phone}</bdi>
                    </div>
                  </a>
                )}

                {content.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-convo-chan about-chan-wa"
                  >
                    <MessageCircle size={16} />
                    <div>
                      <small>{t('المحادثة المباشرة', 'Instant Messaging')}</small>
                      <span>{t('تواصل سريع عبر واتساب', 'WhatsApp Direct Chat')}</span>
                    </div>
                  </a>
                )}
              </div>

              <div className="about-convo-side-footer">
                <span className="about-convo-guarantee">
                  <ShieldCheck size={14} />
                  {t('استشارة فنية مجانية وسرية كاملة للبيانات', 'Complimentary consultation & full NDA compliance')}
                </span>
              </div>
            </aside>
          </div>
        </section>

        {/* ── 9. Published Offices (if enabled) ── */}
        {offices.length > 0 && (
          <section className="care-wrap about-offices-wrap" aria-labelledby="about-offices-title">
            <div className="about-section-head">
              <div className="about-kicker-badge">
                <MapPin size={13} />
                <span>{t('المكاتب ومراكز الدعم', 'OFFICES & HUBS')}</span>
              </div>
              <h2 id="about-offices-title">{t('أين تجدنا وتتواصل مع فرقنا', 'Where to find and meet our team')}</h2>
            </div>

            <div className="about-offices-grid">
              {offices.map(office => (
                <article key={office.id} className="about-office-card">
                  <div className="about-office-icon">
                    <MapPin size={22} />
                  </div>
                  <div className="about-office-content">
                    <h3>{txt(office.name, locale)}</h3>
                    <p className="about-office-addr">{txt(office.address, locale)}</p>
                    {txt(office.hours, locale) && (
                      <p className="about-office-hours">{txt(office.hours, locale)}</p>
                    )}
                    {office.mapUrl && (
                      <a
                        href={office.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-office-map"
                      >
                        <span>{t('عرض الموقع على الخريطة والتفاصيل', 'View on map & details')}</span>
                        <Arrow size={15} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </CareFrame>
  );
}
