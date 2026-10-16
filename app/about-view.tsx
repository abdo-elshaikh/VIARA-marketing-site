'use client';

import { useEffect } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Activity,
  Workflow,
  Stethoscope,
  Users,
  Cpu,
  Lock,
  Network,
  CheckCircle2,
  Building2,
  Route
} from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import CareFrame from './care-frame';

const pillars = [
  {
    icon: Stethoscope,
    title: { ar: 'النزاهة والموثوقية السريرية', en: 'Clinical Rigor & Zero Error' },
    desc: {
      ar: 'في الرعاية الصحية، كل ثانية وكل تشخيص يمس حياة إنسان. صُممت أنظمتنا بمعايير التكرار الجغرافي والتحقق المزدوج لمنع أي انقطاع.',
      en: 'In healthcare, every second and every diagnosis affects human life. Our systems are built with fault tolerance and dual verification.',
    },
  },
  {
    icon: Network,
    title: { ar: 'المعايير المفتوحة والربط الشامل', en: 'Open Standards & Interoperability' },
    desc: {
      ar: 'نرفض الانغلاق التقني. نعتمد معايير HL7 FHIR و DICOM 3.0 و NPHIES لنضمن تكاملاً حراً وموثوقاً بين أجهزتك وكافة فروعك.',
      en: 'We reject vendor lock-in. Native HL7 FHIR, DICOM 3.0, and NPHIES compliance ensures seamless multi-branch integration.',
    },
  },
  {
    icon: HeartPulse,
    title: { ar: 'تمكين الطبيب وراحة المريض', en: 'Physician-First & Patient-Centric' },
    desc: {
      ar: 'واجهات مدروسة بعناية تقلل النقرات والإرهاق الإداري عن الطبيب والتمريض، وتتيح للمريض وصولاً فورياً لنتائجه وتقاريره الطبية.',
      en: 'Ergonomic clinical interfaces that eliminate physician burnout, while empowering patients with instant access to their health records.',
    },
  },
  {
    icon: ShieldCheck,
    title: { ar: 'شراكة تشغيلية مستدامة', en: 'Long-Term Healthcare Partnership' },
    desc: {
      ar: 'لسنا مجرد مزود برمجيات؛ نحن شريك هندسي سريري يرافق منشأتك في دراسة الاحتياج، التدريب الميداني، ومواكبة كل مرحلة توسع.',
      en: 'More than software vendors, we act as clinical engineering partners providing continuous onboarding, training, and strategic expansion.',
    },
  },
];

const standards = [
  {
    icon: Activity,
    code: 'HL7 FHIR Release 4',
    title: { ar: 'الربط السريري الموحد', en: 'Unified Clinical Interoperability' },
    desc: {
      ar: 'تبادل السجلات والمواعيد والنتائج المخبرية لحظياً بين كافة الأقسام الطبية.',
      en: 'Real-time record and lab exchange across hospital and clinic departments.',
    },
  },
  {
    icon: Cpu,
    code: 'DICOM Part 10 & 3.0',
    title: { ar: 'أرشفة الصور الطبية', en: 'Diagnostic Imaging Standards' },
    desc: {
      ar: 'توافق كامل مع أجهزة الرنين، الأشعة المقطعية، والموجات الصوتية وعارضات 3D.',
      en: 'Native compatibility with CT, MRI, Ultrasound modalities and Web 3D viewers.',
    },
  },
  {
    icon: Lock,
    code: 'NPHIES v1.3 Certified',
    title: { ar: 'بوابة التأمين الصحي', en: 'Saudi Insurance Gateway' },
    desc: {
      ar: 'التحقق اللحظي من أهلية العلاج وتدقيق المطالبات الطبية مسبقاً قبل الإرسال.',
      en: 'Instant eligibility verification and pre-submission clean claim scrubbing.',
    },
  },
  {
    icon: ShieldCheck,
    code: 'ISO 27001 & ISO 27799',
    title: { ar: 'أمن البيانات الصحية', en: 'Health Information Security' },
    desc: {
      ar: 'تشفير AES-256، سيادة البيانات، والامتثال لضوابط الهيئة الوطنية للأمن السيبراني.',
      en: 'AES-256 encryption, data sovereignty, and national cybersecurity compliance.',
    },
  },
  {
    icon: Workflow,
    code: 'SNOMED-CT & LOINC',
    title: { ar: 'المصطلحات الطبية المعيارية', en: 'Standard Medical Terminologies' },
    desc: {
      ar: 'ترميز دولي دقيق للتشخيصات والفحوصات المخبرية يدعم دقة التحليلات والذكاء الاصطناعي.',
      en: 'Standard clinical coding ensuring research-grade analytics and AI readiness.',
    },
  },
  {
    icon: Building2,
    code: 'Hybrid / Cloud Ready',
    title: { ar: 'بنية استضافة مرنة', en: 'Flexible Infrastructure' },
    desc: {
      ar: 'دعم الاستضافة المحلية داخل المستشفى (On-Premise) أو عبر السحابة الصحية الخاصة.',
      en: 'Deployable on-premise within hospital data centers or via certified private health cloud.',
    },
  },
];

const disciplines = [
  {
    icon: Stethoscope,
    title: { ar: 'فريق الاستشارات السريرية', en: 'Clinical Advisory & Medical Informatics' },
    role: { ar: 'أطباء وأخصائيو معلوماتية صحية', en: 'Physicians & Health Informatics Specialists' },
    desc: {
      ar: 'يراجعون مسارات العمل ويصممون قوائم الفحص والملف السريري بما يضمن سهولة الاستخدام ومطابقة الإرشادات الطبية المعتمدة.',
      en: 'Designing clinical workflows and SOAP templates that respect actual physician habits and international practice guidelines.',
    },
  },
  {
    icon: Cpu,
    title: { ar: 'الهندسة الطبية والأنظمة الموزعة', en: 'Biomedical & Distributed Systems' },
    role: { ar: 'مهندسو شبكات ومعالجة صور طبية', en: 'Imaging & High-Availability Cloud Engineers' },
    desc: {
      ar: 'يضمنون استجابة عارض الأشعة في أقل من ثانية، واستقرار قواعد البيانات بنسبة 99.98%، وتكامل بروتوكولات DICOM و HL7.',
      en: 'Delivering sub-second 3D radiology loading, high-availability data clustering, and low-latency biomedical integrations.',
    },
  },
  {
    icon: Users,
    title: { ar: 'العمليات الميدانية والدعم 24/7', en: 'Healthcare Operations & 24/7 Reliability' },
    role: { ar: 'خبراء التدريب والتشغيل الميداني', en: 'Hospital Onboarding & Rapid Response Leads' },
    desc: {
      ar: 'مرافقة كوادر المنشأة يوماً بيوم في الورديات، وتقديم استجابة فورية وحلول تشغيلية لضمان استقرار العمليات دون انقطاع.',
      en: 'Accompanying hospital staff through daily shifts and delivering instant response to guarantee zero clinical disruption.',
    },
  },
];

export default function AboutView({ content, locale = 'ar' }: { content: SiteContent; locale?: Locale }) {
  const en = locale === 'en';
  const home = en ? '/en' : '/';
  const t = (ar: string, english: string) => (en ? english : ar);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  const journeyItems = [
    {
      year: '2018',
      title: { ar: 'انطلاق VIARA', en: 'VIARA Founded' },
      body: {
        ar: 'بدأت الفكرة في مختبر بحثي طبي: كيف نجعل الأنظمة الصحية تخدم الطبيب لا تُثقله.',
        en: 'The idea emerged in a medical research lab: how to make health systems serve physicians, not burden them.',
      },
    },
    {
      year: '2020',
      title: { ar: 'أول عميل مؤسسي', en: 'First Enterprise Client' },
      body: {
        ar: 'إطلاق أول تشغيل حي في مستشفى كبير، مع نظامَي HIS وRIS في وقت واحد.',
        en: 'First live deployment in a major hospital running HIS and RIS simultaneously.',
      },
    },
    {
      year: '2022',
      title: { ar: 'التوسع الإقليمي', en: 'Regional Expansion' },
      body: {
        ar: 'دخول أسواق الخليج وشمال أفريقيا مع شراكات محلية معتمدة في أكثر من 8 دول.',
        en: 'Expanding into Gulf and North Africa markets with certified local partnerships in over 8 countries.',
      },
    },
    {
      year: '2024',
      title: { ar: 'منظومة متكاملة: 24 نظاماً', en: 'Complete Ecosystem: 24 Systems' },
      body: {
        ar: 'الإعلان عن منظومة VIARA الكاملة بـ 24 نظاماً متخصصاً تغطي جميع مجالات الرعاية الصحية.',
        en: 'Announcing the complete VIARA ecosystem with 24 specialized systems covering all healthcare domains.',
      },
    },
  ];

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

  return (
    <CareFrame content={content} locale={locale} current="about">
      <div className="care-wrap ca-page-wrap">
        {/* Executive About Hero */}
        <section className="ca-hero" aria-labelledby="ca-heading">
          <div className="ca-hero-copy">
            <span className="ca-eyebrow">
              <Sparkles size={13} />
              {t('رؤية VIARA للرعاية الصحية', 'THE VIARA HEALTHCARE VISION')}
            </span>

            <h1 id="ca-heading">
              {txt(content.about.title, locale)}
            </h1>

            <p>
              {txt(content.about.body, locale)}
            </p>

            <a className="care-btn" href={`${home}#contact`}>
              <span>{t('تواصل مع فريقنا القيادي والاستشاري', 'Connect with Our Leadership Team')}</span>
              <Arrow size={17} />
            </a>
          </div>

          <div className="ca-hero-visual">
            <img
              src="/assets/scenes/arab-care-team.webp"
              alt={t('فريق طبي واستشاري عربي متخصص', 'Arab clinical leadership and engineering team')}
              loading="eager"
            />
            <div className="ca-visual-tag">
              <ShieldCheck size={16} />
              <span>{t('فريق هندسي وسريري متخصص بمراكز الرعاية', 'Dedicated Clinical Engineering & Medical Informatics')}</span>
            </div>
          </div>
        </section>

        {/* Core Clinical Pillars */}
        <section className="ca-pillars-section" aria-labelledby="ca-pillars-head">
          <div className="ca-section-head">
            <span className="care-eyebrow">
              <HeartPulse size={14} />
              {t('ركائزنا وقيمنا السريرية', 'OUR CLINICAL PILLARS')}
            </span>
            <h2 id="ca-pillars-head">
              {t('مبادئ نبني عليها كل سطر برمجي وكل واجهة طبية.', 'Principles guiding every line of code and interface.')}
            </h2>
            <p>
              {t(
                'الرعاية الصحية تتطلب التزاماً لا يقبل التهاون. هذه المبادئ هي البوصلة التي توجه ابتكاراتنا وشراكاتنا مع المستشفيات والمراكز.',
                'Healthcare demands uncompromising discipline. These values serve as our compass in every hospital partnership.'
              )}
            </p>
          </div>

          <div className="ca-pillars-grid">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <article key={i} className="ca-pillar-card animate-on-scroll">
                  <div className="ca-pillar-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{txt(pillar.title, locale)}</h3>
                  <p>{txt(pillar.desc, locale)}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="ca-vision-section" aria-labelledby="ca-vm-head">
          <div className="ca-section-head">
            <span className="care-eyebrow">
              <Sparkles size={14} />
              {t('رؤيتنا ورسالتنا', 'OUR VISION & MISSION')}
            </span>
            <h2 id="ca-vm-head">{t('نحو رعاية صحية أفضل.', 'Towards better healthcare.')}</h2>
          </div>
          <div className="ca-vm-grid">
            <div className="ca-vm-card ca-vm-vision">
              <span className="ca-vm-tag">
                <Sparkles size={11} />
                {t('الرؤية', 'VISION')}
              </span>
              <h3>{t('قيادة التحول الرقمي الصحي في المنطقة.', 'Leading digital healthcare transformation in the region.')}</h3>
              <p>
                {t(
                  'أن نكون الشريك التقني الأول لكل منشأة صحية في العالم العربي، من العيادة الصغيرة إلى شبكة المستشفيات الكبرى، بأنظمة تجمع بين الموثوقية السريرية وسهولة الاستخدام.',
                  'To be the leading technology partner for every healthcare facility in the Arab world, from small clinics to large hospital networks, with systems combining clinical reliability and ease of use.'
                )}
              </p>
            </div>
            <div className="ca-vm-card ca-vm-mission">
              <span className="ca-vm-tag">
                <HeartPulse size={11} />
                {t('الرسالة', 'MISSION')}
              </span>
              <h3>{t('تمكين الطبيب. إتاحة الرعاية.', 'Empowering physicians. Enabling care.')}</h3>
              <p>
                {t(
                  'تصميم منظومة صحية متكاملة تقلل التعقيد الإداري وتمنح الفريق الطبي أدوات موثوقة، بينما تتيح للمريض وصولاً رقمياً سريعاً ومباشراً لخدماته الصحية.',
                  'Building an integrated health ecosystem that reduces administrative complexity and gives medical teams reliable tools, while giving patients fast digital access to their health services.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Story Section: Inside Clinical Care */}
        <section className="ca-story-section" aria-labelledby="ca-story-head">
          <div className="ca-story-grid">
            <div className="ca-story-image">
              <img
                src="/assets/scenes/hospital-inpatient.jpg"
                alt={t('بيئة رعاية سريرية ومستشفى متطور', 'Modern hospital inpatient ward scene')}
                loading="lazy"
              />
            </div>

            <div className="ca-story-copy">
              <span className="care-eyebrow">
                <Workflow size={14} />
                {t('في قلب الرعاية الطبية', 'AT THE HEART OF CARE')}
              </span>
              <h2 id="ca-story-head">
                {t('جسر يعبر بين الأنظمة المعقدة والتشغيل الهادئ.', 'Bridging complex technology & serene clinical care.')}
              </h2>
              <p>
                {t(
                  'انطلقت VIARA من ملاحظة عميقة في الميدان الطبي: الأنظمة التقليدية كانت تفرض أعباءً إدارية مرهقة على الأطباء، وتخلق عزلة بين أقسام الأشعة والمختبر والتأمين.',
                  'VIARA was born out of direct clinical observation: legacy hospital software overwhelmed physicians with administrative friction and isolated diagnostics from billing.'
                )}
              </p>
              <p>
                {t(
                  'قمنا بإعادة صياغة المنظومة الصحية من الصفر وفق معمارية حديثة تجمع بين السرعة الفائقة، أمان البيانات، وبساطة الواجهات التي تمنح الطبيب والتمريض وقتاً أطول للتفرغ للمريض.',
                  'We redesigned healthcare architecture from the ground up: sub-second imaging, sovereign security, and clean workflows returning clinical time back to patients.'
                )}
              </p>

              <ul className="ca-story-bullets">
                <li>
                  <CheckCircle2 size={16} />
                  <span>{t('تقليل وقت التوثيق السريري وإصدار التقارير بأكثر من 40%', 'Over 40% reduction in documentation & diagnostic turnaround')}</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>{t('تكامل غير محدود بين أجهزة الأشعة والمختبر والفوترة الطبية', 'Unified interoperability across modalities, analyzers & billing')}</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>{t('امتثال كامل ومسبق لكافة متطلبات التأمين والأمن السيبراني', 'Pre-configured compliance with national insurance & cyber frameworks')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Compliance & Standards Grid */}
        <section className="ca-standards-section" aria-labelledby="ca-standards-head">
          <div className="ca-section-head">
            <span className="care-eyebrow">
              <ShieldCheck size={14} />
              {t('الامتثال والمعايير الدولية والوطنية', 'REGULATORY & TECHNICAL STANDARDS')}
            </span>
            <h2 id="ca-standards-head">
              {t('معايير عالمية معتمدة لحماية وتكامل بياناتك.', 'Certified standards safeguarding your health ecosystem.')}
            </h2>
            <p>
              {t(
                'نلتزم بأعلى مواصفات التشغيل البيني وأمان المعلومات الصحية المعتمدة دولياً ومحلياً.',
                'Rigorous adherence to international healthcare interoperability and national cybersecurity protocols.'
              )}
            </p>
          </div>

          <div className="ca-standards-grid">
            {standards.map((std, i) => {
              const Icon = std.icon;
              return (
                <div key={i} className="ca-standard-card">
                  <Icon size={24} />
                  <div>
                    <b>{std.code}</b>
                    <span>{txt(std.title, locale)}: {txt(std.desc, locale)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Company Journey Timeline */}
        <section className="ca-journey-section" aria-labelledby="ca-journey-head">
          <div className="ca-section-head">
            <span className="care-eyebrow">
              <Route size={14} />
              {t('رحلتنا', 'OUR JOURNEY')}
            </span>
            <h2 id="ca-journey-head">{t('مسيرة بُنيت خطوة بخطوة.', 'A path built step by step.')}</h2>
            <p>
              {t(
                'من فكرة إلى منظومة رعاية صحية شاملة تخدم المنشآت في أكثر من 15 دولة.',
                'From an idea to a comprehensive healthcare system serving facilities in over 15 countries.'
              )}
            </p>
          </div>
          <div className="ca-journey-timeline">
            {journeyItems.map((item, i) => (
              <div key={i} className="ca-journey-item animate-on-scroll">
                <div className="ca-journey-dot" />
                <div className="ca-journey-year">{item.year}</div>
                <h3>{txt(item.title, locale)}</h3>
                <p>{txt(item.body, locale)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Multidisciplinary Team Structure */}
        <section className="ca-team-section" aria-labelledby="ca-team-head">
          <div className="ca-section-head">
            <span className="care-eyebrow">
              <Users size={14} />
              {t('الكفاءات والتخصصات', 'MULTIDISCIPLINARY EXPERTISE')}
            </span>
            <h2 id="ca-team-head">
              {t('فريق يجمع بين الخبرة الطبية والهندسة المتقدمة.', 'Uniting clinical expertise with advanced engineering.')}
            </h2>
            <p>
              {t(
                'يعمل في VIARA نخبة من المتخصصين الذين يفهمون تفاصيل المناوبات الليلية وأجهزة الفحص الطبي بقدر ما يفهمون الخوادم السحابية والأمن السيبراني.',
                'Our team brings together leaders who understand hospital night shifts as deeply as they understand cloud microservices.'
              )}
            </p>
          </div>

          <div className="ca-team-grid">
            {disciplines.map((team, i) => {
              const Icon = team.icon;
              return (
                <article key={i} className="ca-team-card">
                  <div className="ca-team-card-head">
                    <div className="ca-team-avatar">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3>{txt(team.title, locale)}</h3>
                      <small>{txt(team.role, locale)}</small>
                    </div>
                  </div>
                  <p>{txt(team.desc, locale)}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Executive CTA Banner */}
        <section className="ca-cta-banner">
          <div className="ca-cta-copy">
            <h2>{t('جاهز لتطوير المنظومة التقنية في منشأتك؟', 'Ready to elevate your healthcare technology?')}</h2>
            <p>
              {t(
                'تواصل مع فريقنا التقني والاستشاري لمناقشة احتياجات أقسامك، أو حجز عرض فني وتجربة محاكاة مباشرة لنظام العمل.',
                'Schedule an executive consultation with our engineers to review your departmental workflows or book a live simulation.'
              )}
            </p>
          </div>
          <a className="care-btn ca-cta-btn" href={`${home}#contact`}>
            <span>{t('احجز جلسة استشارية فنية', 'Book Technical Briefing')}</span>
            <Arrow size={17} />
          </a>
        </section>
      </div>
    </CareFrame>
  );
}
