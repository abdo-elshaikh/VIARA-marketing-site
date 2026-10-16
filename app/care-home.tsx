'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight,
  Check, Plus, X, Hospital, ScanLine, Stethoscope,
  Microscope, Network, Layers3, HeartPulse, Route, ShieldCheck,
} from 'lucide-react';
import { txt, type Locale, type SiteContent, type PublicReview } from '../lib/site-content';
import { healthcareCategories, healthcareSystems, facilityProfiles } from '../lib/healthcare-catalog.mjs';
import { scopeEstimateSchema, type ScopeEstimate } from '../lib/inquiry';
import CareFrame from './care-frame';
import CareHero from './care-hero';
import LeadForm from './lead-form';
import ScopeCalculator from './scope-calculator';

export default function CareHome({
  content,
  locale = 'ar',
  reviews = [],
}: {
  content: SiteContent;
  locale?: Locale;
  reviews?: PublicReview[];
}) {
  const en = locale === 'en';
  const prefix = en ? '/en' : '';
  const t = (ar: string, english: string) => en ? english : ar;
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  const [profile, setProfile] = useState('hospital');
  const [interest, setInterest] = useState('CONSULT');
  const [plan, setPlan] = useState('لم أحدد بعد');
  const [offer, setOffer] = useState('');
  const [requestedSystems, setRequestedSystems] = useState<string[]>([]);
  const [requestedFacility, setRequestedFacility] = useState('');
  const [scope, setScope] = useState<ScopeEstimate | null>(null);
  const [modal, setModal] = useState<'privacy' | 'calculator' | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const allowed = healthcareSystems.filter(
    system => !content.products.some(p => p.id === system.id && !p.enabled)
  );
  const selectedProfile = facilityProfiles.find(p => p.id === profile)!;
  const suggested = allowed.filter(s => selectedProfile.systems.includes(s.id));

  const scroll = () =>
    requestAnimationFrame(() =>
      document.getElementById('contact')?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    );

  const statsData = [
    { number: '500', suffix: '+', label: t('منشأة طبية', 'Healthcare facilities') },
    { number: '15', suffix: '+', label: t('دولة حول العالم', 'Countries worldwide') },
    { number: '99.9', suffix: '%', label: t('وقت التشغيل المضمون', 'Guaranteed uptime') },
    { number: '50', suffix: '+', label: t('نظاماً صحياً متخصصاً', 'Specialized health systems') },
  ];

  const hiwSteps = [
    {
      icon: Route,
      title: t('نفهم سير عملك', 'We understand your workflow'),
      body: t(
        'نجلس مع فريقك لفهم الأقسام والأنظمة القائمة وتحديد أولويات الربط.',
        'We meet your team to map current workflows, systems and integration priorities.'
      ),
    },
    {
      icon: ShieldCheck,
      title: t('نصمم النطاق الأمثل', 'We design the optimal scope'),
      body: t(
        'نختار الأنظمة المناسبة وخطة التنفيذ المرحلية وفق بيئتك التقنية.',
        'We select the right systems and phased rollout plan for your technical environment.'
      ),
    },
    {
      icon: HeartPulse,
      title: t('ننفذ ونرافقك دائماً', 'We deliver and stay with you'),
      body: t(
        'تشغيل حي مع تدريب الكوادر ودعم مستمر طوال رحلة التحول الرقمي.',
        'Live go-live with staff training and ongoing support throughout your digital transformation.'
      ),
    },
  ];

  // Read browser-only request context after hydration.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const query = new URLSearchParams(location.search);
      const ids = [...new Set((query.get('systems') || '').split(','))]
        .filter(
          id =>
            healthcareSystems.some(s => s.id === id) &&
            !content.products.some(p => p.id === id && !p.enabled)
        )
        .slice(0, 6);
      if (ids.length) setRequestedSystems(ids);
      const facility = query.get('facility') || '';
      if (facilityProfiles.some(p => p.id === facility)) setRequestedFacility(facility);
      const packageId = query.get('plan');
      if (content.plans.some(p => p.enabled && p.id === packageId)) setPlan(packageId!);
      const product = query.get('interest');
      if (content.products.some(p => p.enabled && p.id === product)) setInterest(product!);
      try {
        const stored = sessionStorage.getItem('viara-planned-scope');
        if (stored) {
          const parsed = scopeEstimateSchema.safeParse(JSON.parse(stored));
          if (parsed.success) setScope(parsed.data);
          sessionStorage.removeItem('viara-planned-scope');
        }
      } catch {
        /* Storage is optional. */
      }
      if (location.hash === '#calculator') {
        trigger.current = document.getElementById('care-calculator-link');
        setModal('calculator');
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [content]);

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

  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
    else if (!modal && dialog.current?.open) dialog.current.close();
  }, [modal]);

  const open = (name: 'privacy' | 'calculator') => {
    trigger.current = document.activeElement as HTMLElement;
    setModal(name);
  };
  const close = () => {
    setModal(null);
    requestAnimationFrame(() => trigger.current?.focus());
  };

  const domainDescriptions = [
    t('المستشفيات والملف الطبي والعيادات والتمريض.', 'Hospitals, records, clinics and nursing.'),
    t('الأشعة والصور الطبية والمختبرات وبنوك الدم.', 'Radiology, imaging, laboratories and blood banks.'),
    t('الإيرادات والصيدليات والموارد وذكاء الأعمال.', 'Revenue, pharmacy, resources and analytics.'),
    t('بوابة المريض والرعاية عن بُعد والتكامل.', 'Patient portals, telehealth and interoperability.'),
  ];

  const domainIcons = [HeartPulse, ScanLine, Layers3, Network];

  const facilityIcons = [Hospital, Stethoscope, ScanLine, Microscope, Network];

  const marqueeLabels = [
    t('المستشفيات', 'Hospitals'),
    t('العيادات', 'Clinics'),
    t('الأشعة', 'Radiology'),
    t('المختبرات', 'Laboratories'),
    t('الرعاية الرقمية', 'Digital care'),
  ];

  return (
    <CareFrame content={content} locale={locale}>
      <CareHero
        content={content}
        locale={locale}
        onDiscuss={(ids, facility) => {
          setRequestedSystems(ids);
          setRequestedFacility(facility);
          setInterest('CONSULT');
          setScope(null);
          scroll();
        }}
      />

      {/* Context bar with marquee */}
      <div className="care-context-bar">
        <div className="care-wrap">
          <span>{t('لرعاية تتجاوز حدود القسم الواحد', 'CARE BEYOND A SINGLE DEPARTMENT')}</span>
          <div className="care-marquee-track" aria-hidden="true">
            {marqueeLabels.map(label => <span key={label}>{label}</span>)}
            {marqueeLabels.map(label => <span key={`dup-${label}`}>{label}</span>)}
          </div>
        </div>
      </div>

      {/* Stats section */}
      <section className="care-stats animate-on-scroll">
        <div className="care-wrap">
          <div className="care-stats-grid">
            {statsData.map(stat => (
              <div key={stat.label} className="care-stat-item">
                <span className="care-stat-number">
                  {stat.number}
                  <span className="care-stat-suffix">{stat.suffix}</span>
                </span>
                <p className="care-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Systems / domains section */}
      <section className="care-section care-wrap" id="systems">
        <div className="care-section-heading animate-on-scroll">
          <div>
            <span className="care-eyebrow">{t('منظومة تستوعب طموحك', 'ROOM FOR YOUR AMBITION')}</span>
            <h2>
              {t('كل تفاصيل الرعاية.', 'Every aspect of care.')}
              <br />
              <span>{t('في صورة أوضح.', 'A clearer picture.')}</span>
            </h2>
          </div>
          <p>
            {t(
              'أربعة مجالات تجمع احتياجات الرعاية السريرية والتشخيص والتشغيل وتجربة المريض. التفاصيل في دليل مستقل، لتصل مباشرة إلى ما يهمك.',
              'Four areas bring clinical care, diagnostics, operations and the patient experience together. A dedicated directory helps you find what matters.'
            )}
          </p>
        </div>
        <div className="care-domain-grid">
          {healthcareCategories.map((category, index) => {
            const Icon = domainIcons[index];
            return (
              <a
                href={`${prefix}/systems?area=${category.id}`}
                className="care-domain animate-on-scroll"
                key={category.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="care-domain-gradient" aria-hidden="true" />
                <div>
                  <Icon size={25} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{txt(category.name, locale)}</h3>
                <p>{domainDescriptions[index]}</p>
                <span className="care-domain-bottom">
                  {allowed.filter(s => s.category === category.id).length}{' '}
                  {t('مجالات للاستكشاف', 'areas to explore')}
                  <Arrow size={19} />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* How it Works section */}
      <section className="care-how-it-works">
        <div className="care-wrap">
          <div className="care-section-heading animate-on-scroll">
            <div>
              <span className="care-eyebrow">{t('كيف نعمل معك', 'HOW WE WORK')}</span>
              <h2>
                {t('ثلاث خطوات.', 'Three steps.')}
                <br />
                <span>{t('من الفكرة إلى التشغيل.', 'From idea to operations.')}</span>
              </h2>
            </div>
            <p>
              {t(
                'نبدأ بفهم احتياجاتك، ثم نصمم النطاق المناسب، وننفذ بمنهجية واضحة تضمن الاستقرار التشغيلي.',
                'We start by understanding your needs, design the right scope, then deliver with a clear methodology that ensures operational stability.'
              )}
            </p>
          </div>
          <div className="care-hiw-grid">
            {hiwSteps.map((step, i) => (
              <article
                key={i}
                className="care-hiw-step animate-on-scroll"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="care-hiw-num">0{i + 1}</div>
                <div className="care-hiw-icon">
                  <step.icon size={28} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Facility type selector */}
      <section className="care-facility-section">
        <div className="care-wrap">
          <div className="care-section-heading">
            <div>
              <span className="care-eyebrow">{t('مسارك يبدأ من هنا', 'FIND YOUR STARTING POINT')}</span>
              <h2>{t('ما نوع منشأتك؟', "What's your facility?")}</h2>
            </div>
            <p>
              {t(
                'اختر نوع المنشأة لتتعرف على نطاق مبدئي للنقاش. نراجع معك التفاصيل قبل تحديد الحل والتنفيذ.',
                'Choose your facility for a starting scope. We review the details with you before defining the solution and rollout.'
              )}
            </p>
          </div>
          <div className="care-facility-tabs" aria-label={t('نوع المنشأة', 'Facility type')}>
            {facilityProfiles.map((p, index) => {
              const Icon = facilityIcons[index];
              return (
                <button type="button" key={p.id} aria-pressed={profile === p.id} onClick={() => setProfile(p.id)}>
                  <Icon size={19} />
                  {txt(p.name, locale)}
                </button>
              );
            })}
          </div>
          <div className="care-facility-panel">
            <div className="care-facility-title">
              <span className="care-eyebrow">{t('نقطة بداية مقترحة', 'A SUGGESTED START')}</span>
              <h3>{txt(selectedProfile.name, locale)}</h3>
              <p>{t('نطاق يناسب سير عملك، مع مساحة للتوسع.', 'A scope shaped around your workflow, with room to grow.')}</p>
              <button
                type="button"
                className="care-link"
                onClick={() => {
                  setRequestedSystems(suggested.map(s => s.id));
                  setRequestedFacility(profile);
                  setInterest('CONSULT');
                  setScope(null);
                  scroll();
                }}
              >
                {t('ناقش هذا النطاق', 'Discuss this scope')}
                <Arrow size={18} />
              </button>
            </div>
            <div className="care-scope-list" aria-live="polite">
              {suggested.map(s => (
                <div key={s.id}>
                  <Check size={16} />
                  <span>{txt(s.name, locale)}</span>
                  <bdi>{s.id}</bdi>
                </div>
              ))}
            </div>
          </div>
          <p className="care-note">
            {t(
              'الدليل يشمل الحلول الحالية ومجالات التوسع. الإتاحة والتكاملات تُحدد في العرض الفني.',
              'The directory includes current solutions and expansion areas. Availability and integrations are defined in the technical proposal.'
            )}
          </p>
        </div>
      </section>

      {/* Story / about section */}
      <section className="care-section care-wrap care-story" id="about">
        <figure className="animate-on-scroll">
          <img
            src="/assets/scenes/arab-diagnostics.webp"
            width={1536}
            height={1024}
            loading="lazy"
            alt={t(
              'أخصائية عربية في بيئة تشخيص طبي حديثة، مشهد توضيحي مولد',
              'Generated illustrative scene of an Arab specialist in a modern diagnostic setting'
            )}
          />
          <figcaption>{t('مشهد توضيحي مولد بالذكاء الاصطناعي', 'AI-generated illustrative scene')}</figcaption>
        </figure>
        <div className="animate-on-scroll">
          <span className="care-eyebrow">{t('تفاصيل أقل تعقيداً', 'LESS COMPLEXITY, MORE CLARITY')}</span>
          <h2>
            {t('مساحة لفريقك.', 'Space for your team.')}
            <br />
            <span>{t('واهتمام أكبر بالمريض.', 'More focus on patients.')}</span>
          </h2>
          <p>
            {t(
              'نبدأ بفهم طريقة عمل منشأتك: المواعيد، الفحوصات، التقارير، والحسابات. ثم نحدد معك الأنظمة والأدوار ونقاط الربط، في نطاق واضح وقابل للتنفيذ.',
              'We start by understanding your appointments, examinations, reports and billing. Together, we define systems, roles and integration requirements in a clear, practical scope.'
            )}
          </p>
          <div className="care-values">
            {[
              {
                icon: Route,
                title: t('تنفيذ على مراحل', 'A phased rollout'),
                text: t('أولويات واضحة من البداية إلى التدريب.', 'Clear priorities, from discovery to training.'),
              },
              {
                icon: ShieldCheck,
                title: t('متطلبات واضحة', 'Defined requirements'),
                text: t(
                  'الاستضافة والصلاحيات والربط ضمن الدراسة الفنية.',
                  'Hosting, access and integration reviewed together.'
                ),
              },
            ].map(item => (
              <div key={item.title}>
                <item.icon size={22} />
                <span>
                  <b>{item.title}</b>
                  <small>{item.text}</small>
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <a className="care-btn care-btn-small" href={`${prefix}/about`}>
              {t('اقرأ المزيد عن VIARA', 'More about VIARA')}
              <Arrow size={16} />
            </a>
            <a className="care-link" href={`${prefix}/planning`}>
              {t('تعرف على خطوات البداية', 'Explore the rollout steps')}
              <Arrow size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Planning banner */}
      <section className="care-planning-banner care-wrap animate-on-scroll">
        <div>
          <span className="care-eyebrow">{t('من الفكرة إلى خطة واضحة', 'FROM AN IDEA TO A CLEAR PLAN')}</span>
          <h2>{t('ابدأ صغيراً. فكر أبعد.', 'Start focused. Think ahead.')}</h2>
          <p>
            {t(
              'استكشف الباقات، وقدّر احتياجات الأرشفة، وافهم مراحل التنفيذ في صفحة واحدة مخصصة للتخطيط.',
              'Explore packages, estimate archive needs and understand rollout stages in one dedicated planning page.'
            )}
          </p>
        </div>
        <a className="care-btn" href={`${prefix}/planning`}>
          {t('خطط لبدايتك', 'Plan your rollout')}
          <Arrow size={18} />
        </a>
      </section>

      {/* Reviews slider */}
      {content.sections.reviews && reviews.length > 0 && (
        <section className="care-section care-wrap">
          <span className="care-eyebrow">{t('من تجارب العملاء', 'CUSTOMER PERSPECTIVES')}</span>
          <div className="care-reviews-slider">
            <div
              className="care-reviews-track"
              style={{ transform: `translateX(${en ? '' : '-'}${currentSlide * (100 / reviews.length)}%)` }}
            >
              {reviews.map(review => (
                <div key={review.id} className="care-review-slide">
                  <blockquote lang={review.locale} dir={review.locale === 'ar' ? 'rtl' : 'ltr'}>
                    <p>&ldquo;{review.quote}&rdquo;</p>
                    <cite>{review.name} · {review.organization}</cite>
                  </blockquote>
                </div>
              ))}
            </div>
            <div className="care-slider-controls">
              <button
                type="button"
                className="care-slider-btn"
                onClick={() => setCurrentSlide(i => Math.max(0, i - 1))}
                aria-label={t('السابق', 'Previous')}
              >
                <ArrowLeft />
              </button>
              <button
                type="button"
                className="care-slider-btn"
                onClick={() => setCurrentSlide(i => Math.min(reviews.length - 1, i + 1))}
                aria-label={t('التالي', 'Next')}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ section */}
      <section className="care-section care-wrap care-faq" id="faq">
        <div className="animate-on-scroll">
          <span className="care-eyebrow">{t('قبل خطوتك الأولى', 'BEFORE YOUR FIRST STEP')}</span>
          <h2>
            {t('بعض الأسئلة.', 'A few questions.')}
            <br />
            <span>{t('وإجابات واضحة.', 'Clear answers.')}</span>
          </h2>
        </div>
        <div>
          {content.faqs.map(faq => (
            <details key={faq.id}>
              <summary>
                {txt(faq.question, locale)}
                <Plus size={18} />
              </summary>
              <p>{txt(faq.answer, locale)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact section */}
      <section className="care-contact-section" id="contact">
        <div className="care-wrap care-contact-grid">
          <div className="animate-on-scroll">
            <span className="care-eyebrow">{t('لنبنِ خطوتك القادمة', "LET'S SHAPE YOUR NEXT STEP")}</span>
            <h2>
              {t('أخبرنا عن منشأتك.', 'Tell us about your facility.')}
              <br />
              <span>{t('نبدأ بالاستماع.', 'We start by listening.')}</span>
            </h2>
            <p>
              {t(
                'شاركنا احتياجات فريقك وما تطمح إلى تحسينه. نراجع معك الخيارات ونحدد نطاقاً يناسب بيئتك.',
                "Share your team's needs and what you want to improve. We'll review the options and define a scope for your environment."
              )}
            </p>
            <ol>
              {[
                t('نفهم سير العمل وأولوياتك', 'Understand your workflows and priorities'),
                t('نراجع الأنظمة ونقاط الربط', 'Review systems and integration requirements'),
                t('نقترح نطاقاً وخطوات تنفيذ', 'Propose a scope and rollout steps'),
              ].map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <button className="care-link" id="care-calculator-link" type="button" onClick={() => open('calculator')}>
              {t('هل تحتاج تقدير سعة الأرشفة؟', 'Need an archive capacity estimate?')}
              <Arrow size={18} />
            </button>
          </div>
          <div className="care-form animate-on-scroll">
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
              requestedFacility={requestedFacility}
              clearRequestedSystems={() => {
                setRequestedSystems([]);
                setRequestedFacility('');
              }}
              onPrivacy={() => open('privacy')}
              onEditScope={() => open('calculator')}
            />
          </div>
        </div>
      </section>

      {/* Dialog */}
      <dialog
        className="care-dialog"
        ref={dialog}
        onCancel={close}
        onClick={event => {
          if (event.target === event.currentTarget) close();
        }}
        aria-labelledby="care-dialog-title"
      >
        <div className="care-dialog-heading">
          <h2 id="care-dialog-title">
            {modal === 'calculator'
              ? t('تقدير سعة الأرشفة', 'Archive capacity estimator')
              : t('الخصوصية', 'Privacy')}
          </h2>
          <button type="button" className="care-menu" onClick={close} aria-label={t('إغلاق', 'Close')}>
            <X />
          </button>
        </div>
        {modal === 'calculator' ? (
          <ScopeCalculator
            locale={locale}
            onChoose={estimate => {
              setScope(estimate);
              setInterest('PACS');
              setRequestedSystems([]);
              setRequestedFacility('');
              close();
              scroll();
            }}
          />
        ) : (
          <div>
            <p>
              {t(
                '?????? ?????? ??????? ??????? ??????? ??????? ???? ????? ????. ?????? ??????? ?????? ????? ??? ????? ?? ??? ???????? ??? ????? ??? ??? ?????? ?????? ?? ??????? ???? ???. ?? ????? ?????? ???? ?? ???????.',
                'We use your contact and facility details to review and respond to your request. Request history is linked to a guest identifier in this browser and may differ after clearing site data or changing devices. Do not include patient information.'
              )}
            </p>
          </div>
        )}
      </dialog>
    </CareFrame>
  );
}
