'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandPageHero from '../brand-page-hero';
import { useSiteText } from '../../lib/site-copy';
import { useState, useRef, useEffect } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  Plus,
  Building2,
  Network,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  ScanLine,
  Sparkles,
  ChevronDown,
  TrendingUp,
  X
} from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../../lib/site-content';
import ScopeCalculator from '../scope-calculator';
import RoiCalculator from '../roi-calculator';
import type { ScopeEstimate } from '../../lib/inquiry';
import CareFrame from '../care-frame';
import LeadForm from '../lead-form';
import '../care-planning.css';
import '../planning-enhanced.css';
import PlanningGovernanceCard from '../planning-governance-card';
import PlanningPackagesMatrix from '../planning-packages-matrix';
import PlanningRolloutRoadmap from '../planning-rollout-roadmap';
import packageCatalog from '../../../backend/src/config/packageCatalog.json';

type FacilityFilter = 'all' | 'single' | 'radiology' | 'network';

const planLicenseDetails = Object.fromEntries(
  Object.values(packageCatalog.packages).map(plan => [
    plan.id,
    {
      edition: { ar: `الإعداد التقني: ${plan.edition}`, en: `Technical baseline: ${plan.edition}` },
      details: [
        {
          ar: `المستخدمون: ${plan.defaultMaxUsers === -1 ? 'بلا حد مسبق' : plan.defaultMaxUsers}؛ الفروع: ${plan.defaultMaxBranches === -1 ? 'بلا حد مسبق' : plan.defaultMaxBranches}.`,
          en: `Users: ${plan.defaultMaxUsers === -1 ? 'unlimited' : plan.defaultMaxUsers}; branches: ${plan.defaultMaxBranches === -1 ? 'unlimited' : plan.defaultMaxBranches}.`
        },
        {
          ar: plan.defaultDays
            ? `مدة الإصدار الافتراضية ${plan.defaultDays} يوماً؛ مدة العقد تعتمد منفصلة.`
            : 'الإصدار الافتراضي دون تاريخ انتهاء؛ الدعم والتجديد وفق العقد.',
          en: plan.defaultDays
            ? `Default issuance: ${plan.defaultDays} days; contract term is agreed separately.`
            : 'Default issuance has no expiry; support and renewal follow the contract.'
        },
        {
          ar: `الوحدات التقنية المشمولة: ${plan.modules.join('، ')}`,
          en: `Included technical modules: ${plan.modules.join(', ')}`
        }
      ]
    }
  ])
);

const quickSpecs: Record<
  string,
  {
    branches: { ar: string; en: string };
    users: { ar: string; en: string };
    scopeSummary: { ar: string; en: string };
    recommendationTag: { ar: string; en: string };
  }
> = {
  أساس: {
    branches: { ar: 'فرع واحد مرخص', en: '1 Licensed Branch' },
    users: { ar: 'حتى 25 مستخدماً', en: 'Up to 25 Users' },
    scopeSummary: { ar: 'استقبال، مواعيد، ورديات الصندوق، وملف طبي', en: 'Reception, booking, billing & EMR' },
    recommendationTag: { ar: 'الخيار الأنسب للعيادات والمراكز بفرع واحد', en: 'Ideal for single-branch clinics' }
  },
  نمو: {
    branches: { ar: 'فرع واحد (توسعة موثقة)', en: '1 Branch (Expandable)' },
    users: { ar: 'حتى 25 مستخدماً مرخصاً', en: 'Up to 25 Licensed Users' },
    scopeSummary: { ar: 'تكامل كامل: RIS + PACS + بوابة المرضى QR', en: 'Full synergy: RIS + PACS + QR Portal' },
    recommendationTag: { ar: 'الأكثر طلباً لمراكز الأشعة والتشخيص', en: 'Most Popular for Radiology Centers' }
  },
  مؤسسات: {
    branches: { ar: 'فروع متعددة بلا حد مسبق', en: 'Unlimited Branches' },
    users: { ar: 'مستخدمون بلا حد مسبق', en: 'Unlimited Users' },
    scopeSummary: { ar: 'Enterprise شامل مع SSO/OIDC وحوكمة مركزية', en: 'Full Enterprise with SSO/OIDC & Governance' },
    recommendationTag: { ar: 'الخيار الأنسب للشبكات ومجموعات المستشفيات', en: 'Ideal for Healthcare Groups & Networks' }
  }
};

const faqs = [
  {
    q: { ar: 'هل تمنح الباقة صلاحيات تلقائياً؟', en: 'Does a package automatically grant permissions?' },
    a: {
      ar: 'لا. الترخيص يحدد الوحدات والحدود مثل المستخدمين والفروع، بينما تحدد صلاحيات RBAC ما يستطيع كل دور تنفيذه. نراجع مصفوفة الأدوار والصلاحيات ونختبرها قبل التشغيل.',
      en: 'No. The license controls modules and limits such as users and branches; RBAC permissions determine what each role can do. We review and test the role-permission matrix before launch.'
    }
  },
  {
    q: { ar: 'هل تشمل باقة نمو فروعاً إضافية؟', en: 'Does Growth include additional branches?' },
    a: {
      ar: 'لا تضيف باقة نمو فروعاً بحد ذاتها. إعداد Standard الافتراضي يقتصر على فرع واحد؛ تشغيل عدة فروع يتطلب رخصة Enterprise أو توسعة موثقة في العرض.',
      en: 'Growth does not add branches by itself. Standard defaults to one branch; multi-branch operation requires an Enterprise license or an expansion documented in the proposal.'
    }
  },
  {
    q: { ar: 'كيف تُحدد مدة الاشتراك والسعر؟', en: 'How are subscription term and price determined?' },
    a: {
      ar: 'السعر المعروض هو السعر المعتمد للباقة أو «عرض مخصص» عند غياب سعر منشور. مدد الرخص الافتراضية إعدادات إصدار فنية وليست مدة عقد؛ يحدد العرض التجاري المعتمد مدة الاشتراك والتجديد والحدود النهائية.',
      en: 'The displayed amount is the approved package price, or “Tailored quote” when no price is published. Default license durations are technical issuance settings, not contract terms; the approved commercial proposal defines subscription term, renewal and final limits.'
    }
  },
  {
    q: { ar: 'ما حدود النسخة التجريبية؟', en: 'What are the trial limits?' },
    a: {
      ar: 'إعداد التجربة الافتراضي 30 يوماً و3 مستخدمين، مع سقوف تشغيلية للمرضى والمواعيد والتقارير. نوضح الوحدات والحدود في مفتاح التجربة قبل تفعيله.',
      en: 'The default trial is 30 days and 3 users, with operational quotas for patients, appointments and reports. Included modules and limits are confirmed before activation.'
    }
  },
  {
    q: { ar: 'كيف أختار الباقة المناسبة؟', en: 'How do I choose the right package?' },
    a: {
      ar: 'ابدأ بالأنظمة المطلوبة وعدد الفروع والأدوار وطريقة عمل فريقك. الباقات نقاط بداية للنقاش؛ نراجع المتطلبات معك قبل الاتفاق على النطاق والتكلفة.',
      en: 'Start with the systems, branches, roles and workflows you need. Packages are starting points for discussion; requirements are reviewed before agreeing on scope and cost.'
    }
  },
  {
    q: { ar: 'هل يمكن نقل بيانات النظام الحالي؟', en: 'Can existing data be migrated?' },
    a: {
      ar: 'نراجع مصادر البيانات وصيغ التصدير وجودتها وحجم الأرشيف أولاً، ثم نحدد ما يمكن نقله واختبارات التحقق وخطة الانتقال ضمن العرض الفني.',
      en: 'First review data sources, export formats, quality and archive size, then define what can be migrated, validation tests and a transition plan in the technical proposal.'
    }
  },
  {
    q: { ar: 'كيف نحدد الاستضافة وربط الأجهزة؟', en: 'How are hosting and device integrations defined?' },
    a: {
      ar: 'نحدد متطلبات الاستضافة والخصوصية والنسخ الاحتياطي، ونراجع واجهات الأجهزة والأنظمة المتاحة. تُوثق التكاملات المطلوبة وتوافقها في الدراسة الفنية.',
      en: 'Define hosting, privacy and backup requirements and review available device and system interfaces. Required integrations and compatibility are documented during technical discovery.'
    }
  },
  {
    q: { ar: 'هل التقدير في الحاسبة يشمل كل احتياجات التخزين؟', en: 'Does the calculator cover all storage needs?' },
    a: {
      ar: 'التقدير مبني على المدخلات الظاهرة فقط. لا يشمل الأرشيف السابق أو النمو المستقبلي أو مساحة تشغيل التخزين. نراجع هذه العوامل قبل اعتماد السعة والتكلفة.',
      en: 'The estimate uses only the displayed inputs. Existing archives, future growth and storage overhead are excluded and reviewed before capacity and cost are agreed.'
    }
  }
];

export default function PlanningView({ content, locale = 'ar' }: { content: SiteContent; locale?: Locale }) {
  const en = locale === 'en', home = en ? '/en' : '/', prefix = en ? '/en' : '';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft, Forward = en ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const [facilityFilter, setFacilityFilter] = useState<FacilityFilter>('all');
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const enabledPlans = content.plans.filter(p => p.enabled);

  function handleFilterChange(filter: FacilityFilter) {
    setFacilityFilter(filter);
    if (filter === 'single') setHighlightedPlan('أساس');
    else if (filter === 'radiology') setHighlightedPlan('نمو');
    else if (filter === 'network') setHighlightedPlan('مؤسسات');
    else setHighlightedPlan(null);
  }

  function handleSelectPlan(planId: 'أساس' | 'نمو' | 'مؤسسات') {
    setHighlightedPlan(planId);
    const target = document.getElementById(`plan-${planId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function choose(estimate: ScopeEstimate) {
    try {
      sessionStorage.setItem('viara-planned-scope', JSON.stringify(estimate));
      router.push(`${home}?interest=PACS#contact`);
    } catch {
      setStorageError(true);
    }
  }

  const [calcTab, setCalcTab] = useState<'archive' | 'roi'>('archive');

  function attachRoi(summary: string) {
    try {
      sessionStorage.setItem('viara-roi-summary', summary);
      router.push(`${home}?interest=CONSULT#contact`);
    } catch {
      setStorageError(true);
    }
  }

  const [modalPlan, setModalPlan] = useState<string | null>(null);
  const [interest, setInterest] = useState('CONSULT');
  const [offer, setOffer] = useState('');
  const [scope, setScope] = useState<ScopeEstimate | null>(null);
  const [requestedSystems, setRequestedSystems] = useState<string[]>([]);
  const [requestedFacility, setRequestedFacility] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const planDialogRef = useRef<HTMLDialogElement>(null);

  function openPlanModal(planId: string) {
    setModalPlan(planId);
    if (planDialogRef.current) {
      if (!planDialogRef.current.open) {
        planDialogRef.current.showModal();
      }
    }
  }

  function closePlanModal() {
    if (planDialogRef.current) {
      planDialogRef.current.close();
    }
    setModalPlan(null);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get('plan');
    if (p && content.plans.some(item => item.enabled && item.id === p)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalPlan(p);
      if (planDialogRef.current && !planDialogRef.current.open) {
        planDialogRef.current.showModal();
      }
    }
  }, [content.plans]);

  return (
    <CareFrame content={content} locale={locale} current="planning">
      <BrandPageHero
        locale={locale}
        kind="planning"
        eyebrow={t('بداية مدروسة. ونطاق يناسبك.', 'A CONSIDERED START. A SCOPE THAT FITS.')}
        title={t('حل يناسب يومك.', 'A fit for today.')}
        accent={t('وخطة لمستقبلك.', 'A plan for tomorrow.')}
        description={t(
          'قارن نقاط البداية، واستكشف مراحل التنفيذ، وقدّر سعة الأرشفة. نساعدك على تحويل احتياج مركزك إلى خطة واضحة وموثقة.',
          'Compare starting scopes, explore rollout phases and estimate archive capacity. Turn your center’s needs into a clear, documented plan.'
        )}
      >
        <a className="care-btn" href="#packages">
          {t('استكشف الباقات والتراخيص', 'Explore packages')}
          <Arrow size={18} />
        </a>
        <a className="care-link" href="#package-matrix">
          {t('مصفوفة المقارنة الفنية', 'Comparison matrix')}
          <Forward size={17} />
        </a>
        <a className="care-link" href="#archive">
          {t('قدّر سعة الأرشفة', 'Estimate archive capacity')}
          <Forward size={17} />
        </a>
      </BrandPageHero>

      <div className="care-wrap cp-page-wrap">
        {/* Navigation Bar */}
        <nav className="cp-section-nav" aria-label={t('أقسام صفحة الخطط', 'Planning page sections')}>
          <a href="#packages">
            <span>01</span>
            {t('الباقات والترخيص', 'Packages & Scope')}
          </a>
          <a href="#package-matrix">
            <span>02</span>
            {t('المقارنة الفنية', 'Comparison Matrix')}
          </a>
          <a href="#rollout">
            <span>03</span>
            {t('مراحل التنفيذ', 'Rollout Roadmap')}
          </a>
          <a href="#archive">
            <span>04</span>
            {t('حاسبة الأرشفة', 'Archive Estimator')}
          </a>
          <a href="#faq">
            <span>05</span>
            {t('الأسئلة الشائعة', 'FAQ')}
          </a>
        </nav>

        {/* ── 01. Unified Packages & Integrated Facility Filter ── */}
        <section className="cp-section" id="packages" aria-labelledby="cp-packages-head">
          <div className="cp-section-head">
            <div>
              <span className="care-eyebrow">
                <Sparkles size={14} />
                {t('01 / نقاط بداية مدروسة', '01 / SYSTEM PACKAGES & SCOPE')}
              </span>
              <h2 id="cp-packages-head">
                {t('اختر النطاق الملائم لمركزك،', 'Choose the scope for your facility,')}
                <br />
                <span>{t('وابدأ بثقة تامة.', 'and launch with full confidence.')}</span>
              </h2>
            </div>
            <p>
              {t(
                'ثلاث باقات رئيسية تغطي كافة أحجام العمل السريري والتشخيصي، مع إمكانية التخصيص الكامل وفق متطلباتك التعاقدية.',
                'Three core tiers covering all clinical and diagnostic workloads, fully customizable around your operational scale.'
              )}
            </p>
          </div>

          {/* Integrated Facility Filter Strip (Eliminates Repetitive Recommender Block) */}
          <div className="cpm-facility-filter-strip">
            <div className="cpm-filter-heading">
              <Sparkles size={15} />
              <span>{t('طابق حجم منشأتك لتسليط الضوء على الباقة الأنسب:', 'Match your facility type to highlight the recommended tier:')}</span>
            </div>
            <div className="cpm-filter-pills" role="tablist">
              <button
                type="button"
                className={`cpm-segment-pill ${facilityFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                {t('جميع الباقات', 'All Packages')}
              </button>
              <button
                type="button"
                className={`cpm-segment-pill ${facilityFilter === 'single' ? 'is-active' : ''}`}
                onClick={() => handleFilterChange('single')}
              >
                <Building2 size={15} />
                <span>{t('عيادة أو مركز بفرع واحد', 'Single Clinic / Branch')}</span>
              </button>
              <button
                type="button"
                className={`cpm-segment-pill ${facilityFilter === 'radiology' ? 'is-active' : ''}`}
                onClick={() => handleFilterChange('radiology')}
              >
                <ScanLine size={15} />
                <span>{t('مركز أشعة تشخيصي', 'Diagnostic Radiology')}</span>
                <span className="cpm-badge-rec">{t('الأكثر طلباً', 'Most Popular')}</span>
              </button>
              <button
                type="button"
                className={`cpm-segment-pill ${facilityFilter === 'network' ? 'is-active' : ''}`}
                onClick={() => handleFilterChange('network')}
              >
                <Network size={15} />
                <span>{t('مجموعة مراكز وشبكات', 'Multi-site Groups')}</span>
              </button>
            </div>

            {facilityFilter !== 'all' && (
              <div className="cpm-filter-insight-pill">
                <Sparkles size={15} />
                <span>
                  {facilityFilter === 'single' &&
                    t(
                      'التوصية التشغيلية: باقة أساس توفر ضبطاً كاملاً لعمليات الفرع المستقل من استقبال ومواعيد وفواتير بكفاءة وانضباط.',
                      'Operational guidance: Essential covers all single-branch workflows (booking, reception, billing) with speed and discipline.'
                    )}
                  {facilityFilter === 'radiology' &&
                    t(
                      'التوصية التشغيلية: باقة نمو هي المعيار الأنسب لمراكز الأشعة لربط الأجهزة بقوائم العمل MWL وأرشفة PACS وتسليم التقارير الفورية بترميز QR.',
                      'Operational guidance: Growth is the benchmark for radiology centers, unifying DICOM MWL, PACS archiving, and QR report delivery.'
                    )}
                  {facilityFilter === 'network' &&
                    t(
                      'التوصية التشغيلية: باقة مؤسسات تمنحك حوكمة سحابية موحدة لجميع الفروع مع دعم الدخول الموحد SSO وتحليلات مقارنة.',
                      'Operational guidance: Multi-site delivers unified multi-branch governance, SSO/OIDC support, and comparative analytics.'
                    )}
                </span>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="cp-plans-grid">
            {enabledPlans.map((plan, i) => {
              const specs = quickSpecs[plan.id];
              const isMatch = highlightedPlan === plan.id;
              return (
                <article
                  key={plan.id}
                  id={`plan-${plan.id}`}
                  className={`cp-plan-card ${plan.featured ? 'is-featured' : ''} ${isMatch ? 'is-highlighted' : ''}`}
                >
                  {isMatch && specs && (
                    <div className="cp-plan-recommendation-tag">
                      <Sparkles size={12} />
                      <span>{txt(specs.recommendationTag, locale)}</span>
                    </div>
                  )}

                  <div className="cp-plan-top">
                    <span className="cp-plan-label-badge">{plan.label}</span>
                    <span className="cp-plan-num">0{i + 1}</span>
                  </div>

                  <h3>{txt(plan.name, locale)}</h3>
                  <p className="cp-plan-desc">{txt(plan.description, locale)}</p>

                  {/* Micro Specs Grid */}
                  {specs && (
                    <div className="cp-plan-quick-specs">
                      <div className="cp-spec-cell">
                        <span className="cp-spec-lbl">{t('الفروع', 'Branches')}</span>
                        <strong className="cp-spec-val">{txt(specs.branches, locale)}</strong>
                      </div>
                      <div className="cp-spec-cell">
                        <span className="cp-spec-lbl">{t('المستخدمون', 'Users')}</span>
                        <strong className="cp-spec-val">{txt(specs.users, locale)}</strong>
                      </div>
                      <div className="cp-spec-cell is-full">
                        <span className="cp-spec-lbl">{t('التركيز التشغيلي', 'Core Focus')}</span>
                        <strong className="cp-spec-val">{txt(specs.scopeSummary, locale)}</strong>
                      </div>
                    </div>
                  )}

                  <ul className="cp-plan-features">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li key={index}>
                        <Check size={16} />
                        <span>{txt(feature, locale)}</span>
                      </li>
                    ))}
                  </ul>

                  {planLicenseDetails[plan.id] && (
                    <div className="cp-plan-license-pill">
                      <ShieldCheck size={15} />
                      <span>{txt(planLicenseDetails[plan.id].edition, locale)}</span>
                    </div>
                  )}

                  <div className="cp-plan-card-actions">
                    <button
                      type="button"
                      className="care-btn"
                      onClick={() => openPlanModal(plan.id)}
                    >
                      {t('ناقش هذه الباقة', 'Discuss this package')}
                      <Arrow size={16} />
                    </button>
                    <a className="cp-plan-compare-jump" href="#package-matrix">
                      <span>{t('عرض المواصفات في الجدول', 'View full specs in matrix')}</span>
                      <ChevronDown size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Compact Technical Governance & Security Card (Replaces Bulky Access Model) */}
          <PlanningGovernanceCard locale={locale} />
        </section>

        {/* ── 02. Comprehensive Feature Comparison Matrix with Category Tabs ── */}
        <PlanningPackagesMatrix
          locale={locale}
          onChoosePlan={handleSelectPlan}
          onDiscussPlan={planId => openPlanModal(planId)}
          activePlanId={highlightedPlan}
        />

        {/* ── 03. Rollout Roadmap & Peace-of-Mind Guarantees ── */}
        <PlanningRolloutRoadmap locale={locale} />

        {/* ── 04. Medical Imaging Archive & Financial ROI Estimator ── */}
        <section className="cp-section cp-estimator" id="archive" aria-labelledby="cp-calc-head">
          <div className="cp-section-head">
            <div>
              <span className="care-eyebrow">
                <Sparkles size={14} />
                {t('04 / أدوات التخطيط وحساب الجدوى', '04 / PLANNING & ROI TOOLS')}
              </span>
              <h2 id="cp-calc-head">
                {t('تخطيط السعة والعائد المالي،', 'Capacity & financial ROI,')}
                <br />
                <span>{t('بتقدير أقرب لواقع مركزك.', 'calculated around your operations.')}</span>
              </h2>
            </div>
            <p>
              {t(
                'قدّر سعة أرشفة الصور الطبية المطلوبة، أو احسب حجم التوفير المالي السنوي المباشر الناتج عن الاستغناء عن الأفلام المطبوعة وتسريع التقارير.',
                'Estimate required imaging storage capacity, or calculate direct annual financial savings from digital delivery and AI drafting.'
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`care-btn ${calcTab === 'archive' ? '' : 'care-btn-secondary'}`}
              style={{ fontSize: '13px', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => setCalcTab('archive')}
              aria-pressed={calcTab === 'archive'}
            >
              <ScanLine size={16} />
              {t('تقدير سعة أرشفة الصور (PACS Storage)', 'PACS Storage Estimator')}
            </button>
            <button
              type="button"
              className={`care-btn ${calcTab === 'roi' ? '' : 'care-btn-secondary'}`}
              style={{ fontSize: '13px', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => setCalcTab('roi')}
              aria-pressed={calcTab === 'roi'}
            >
              <TrendingUp size={16} />
              {t('حاسبة التوفير والعائد المالي (ROI Calculator)', 'Financial ROI Calculator')}
            </button>
          </div>
          <div className="cp-estimator-box">
            {calcTab === 'archive' ? (
              <ScopeCalculator locale={locale} onChoose={choose} />
            ) : (
              <RoiCalculator locale={locale} onAttach={attachRoi} />
            )}
            {storageError && (
              <p role="alert" className="cp-storage-error">
                {t(
                  'تعذر حفظ التقدير في هذا المتصفح. يمكنك استخدام الحاسبة داخل نموذج التواصل لإرفاق المدخلات.',
                  'This browser could not save the estimate. Use the calculator in the contact form to attach your inputs.'
                )}
              </p>
            )}
          </div>
        </section>

        {/* ── 05. Frequently Asked Questions ── */}
        <section className="cp-section cp-faq" id="faq" aria-labelledby="cp-faq-head">
          <div>
            <span className="care-eyebrow">{t('قبل اتخاذ القرار', 'BEFORE YOUR NEXT STEP')}</span>
            <h2 id="cp-faq-head">
              {t('أسئلة متوقعة.', 'Expected questions.')}
              <br />
              <span>{t('إجابات واضحة.', 'Clear answers.')}</span>
            </h2>
            <p>{t('تفاصيل تساعدك على تحديد ما تحتاج مناقشته مع فريقنا.', 'Details to help you decide what to discuss with our team.')}</p>
          </div>
          <div>
            {faqs.map(faq => (
              <details key={faq.q.en}>
                <summary>
                  {txt(faq.q, locale)}
                  <Plus size={18} />
                </summary>
                <p>{txt(faq.a, locale)}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 06. Final CTA ── */}
        <section className="cp-next-step">
          <div>
            <span className="care-eyebrow">{t('لست متأكداً من نقطة البداية؟', 'UNSURE WHERE TO START?')}</span>
            <h2>{t('لنرسم خطتك معاً.', 'Let’s shape your plan together.')}</h2>
            <p>{t('أخبرنا عن منشأتك وما تريد تحسينه أولاً وسيقوم مستشارونا التقنيون بإعداد دراسة النطاق المناسبة.', 'Tell us about your facility and our technical specialists will prepare the tailored scope study.')}</p>
          </div>
          <button
            type="button"
            className="care-btn"
            onClick={() => openPlanModal('لم أحدد بعد')}
          >
            {t('تحدث مع فريقنا', 'Talk to our team')}
            <Arrow size={18} />
          </button>
        </section>
      </div>

      {/* ── In-Page Package Discussion Modal ── */}
      <dialog
        ref={planDialogRef}
        className="care-dialog cp-plan-modal"
        aria-labelledby="cp-plan-modal-title"
        onCancel={closePlanModal}
        onClick={event => {
          if (event.target === event.currentTarget) closePlanModal();
        }}
      >
        <div className="cp-plan-modal-heading">
          <div className="cp-plan-modal-title-wrap">
            <span className="care-eyebrow">
              <Sparkles size={14} />
              {t('مناقشة المتطلبات والنطاق المباشر', 'DIRECT SCOPE & PACKAGE CONSULTATION')}
            </span>
            <h2 id="cp-plan-modal-title">
              {modalPlan && modalPlan !== 'لم أحدد بعد'
                ? t(`طلب مناقشة باقة ${modalPlan}`, `Discuss ${modalPlan} Package`)
                : t('طلب استشارة ومناقشة باقة', 'Package Consultation Request')}
            </h2>
          </div>
          <button
            type="button"
            className="care-menu"
            onClick={closePlanModal}
            aria-label={t('إغلاق', 'Close')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="cp-plan-modal-body">
          <LeadForm
            locale={locale}
            content={content}
            interest={interest}
            setInterest={setInterest}
            plan={modalPlan || 'لم أحدد بعد'}
            setPlan={setModalPlan}
            offer={offer}
            setOffer={setOffer}
            scope={scope}
            setScope={setScope}
            requestedSystems={requestedSystems}
            clearRequestedSystems={() => setRequestedSystems([])}
            requestedFacility={requestedFacility}
            onPrivacy={() => setPrivacyOpen(true)}
            onEditScope={() => {
              closePlanModal();
              document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </dialog>

      {/* Privacy modal */}
      {privacyOpen && (
        <dialog
          className="care-dialog cp-privacy-dialog"
          open
          onClick={event => {
            if (event.target === event.currentTarget) setPrivacyOpen(false);
          }}
        >
          <div className="care-dialog-heading">
            <h2>{t('الخصوصية', 'Privacy')}</h2>
            <button
              type="button"
              className="care-menu"
              onClick={() => setPrivacyOpen(false)}
              aria-label={t('إغلاق', 'Close')}
            >
              <X size={18} />
            </button>
          </div>
          <p>
            {t(
              'نستخدم بيانات التواصل وتفاصيل منشأتك لمراجعة طلبك والرد عليه. يُحفظ سجل الطلبات مرتبطاً بمعرّف زائر في هذا المتصفح، ولا تُدرج أي معلومات مرضى.',
              'We use your contact and facility details to review and respond to your request. Request history is linked to a browser identifier, and no patient information is ever included.'
            )}
          </p>
        </dialog>
      )}
    </CareFrame>
  );
}
