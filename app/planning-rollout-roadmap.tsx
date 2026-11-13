'use client';
import { useState } from 'react';
import { Building2, Network, Users, ShieldCheck, Check, Clock, FileCheck2, ArrowLeft, ArrowRight, Zap, Award } from 'lucide-react';
import type { Locale } from '../lib/site-content';

interface RolloutStage {
  step: string;
  icon: typeof Building2;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  duration: { ar: string; en: string };
  summary: { ar: string; en: string };
  viaraDeliverables: Array<{ ar: string; en: string }>;
  clientCommitments: Array<{ ar: string; en: string }>;
  deliverable: { ar: string; en: string };
}

const rolloutStages: RolloutStage[] = [
  {
    step: '01',
    icon: Building2,
    title: { ar: 'نفهم منشأتك', en: 'Discover & Map' },
    subtitle: { ar: 'دراسة سير العمل والأنظمة القائمة', en: 'Workflow & Modality Discovery' },
    duration: { ar: '3 - 5 أيام عمل', en: '3 - 5 Business Days' },
    summary: {
      ar: 'نجتمع مع إدارتكم والأقسام الطبية لحصر الأجهزة الطبية (Modality Inventory)، والأنظمة القائمة، وتحديد مصفوفة الصلاحيات المطلوبة.',
      en: 'We meet with clinical and admin leaders to map medical modalities, existing software, and operational permission boundaries.'
    },
    viaraDeliverables: [
      { ar: 'حصر فني لأجهزة الأشعة وتوافق بروتوكولات DICOM', en: 'Technical modality audit & DICOM compatibility matrix' },
      { ar: 'توثيق مسارات حركة المريض من الاستقبال حتى التقرير', en: 'Documenting patient flow from reception to signed report' },
      { ar: 'إعداد وثيقة نطاق العمل التفصيلي (Scope Document)', en: 'Drafting the detailed Technical Scope of Work (SOW)' }
    ],
    clientCommitments: [
      { ar: 'تعيين منسق مشروع تشغيلي من جهة المركز', en: 'Assign an internal clinical project lead' },
      { ar: 'توفير قوائم الأطباء والتخصصات والخدمات والأسعار', en: 'Provide doctor rosters, specialties, and service tariffs' }
    ],
    deliverable: { ar: 'وثيقة النطاق والمواصفات الفنية المعتمدة', en: 'Approved Technical Scope of Work (SOW)' }
  },
  {
    step: '02',
    icon: Network,
    title: { ar: 'نُهيئ ونربط', en: 'Configure & Connect' },
    subtitle: { ar: 'بناء البيئة وتوصيل الأجهزة والأرشفة', en: 'Environment Setup & Integration' },
    duration: { ar: '1 - 2 أسابيع', en: '1 - 2 Weeks' },
    summary: {
      ar: 'نضبط إعدادات الخوادم، ونبرمج قوالب التقارير الطبية، ونربط أجهزة التصوير بخادم الـ PACS وقوائم عمل الـ RIS عبر DICOM MWL.',
      en: 'We configure server environments, build diagnostic report templates, and link imaging modalities to PACS and RIS MWL.'
    },
    viaraDeliverables: [
      { ar: 'تهيئة خوادم الأرشفة وعارض DICOM الويب', en: 'Configuring storage servers & browser DICOM viewer' },
      { ar: 'ضبط الربط الثنائي بين أجهزة الأشعة وقوائم العمل (MWL)', en: 'Configuring two-way DICOM Modality Worklist (MWL)' },
      { ar: 'تجهيز بيئة الاختبار المعزولة للتحقق السريري (Staging)', en: 'Setting up an isolated staging test environment' }
    ],
    clientCommitments: [
      { ar: 'تأمين الاتصال الشبكي الداخلي للأجهزة', en: 'Ensure internal LAN access for connected modalities' },
      { ar: 'مراجعة واعتماد قوالب التقارير والترويسة الرسمية', en: 'Review and approve diagnostic templates and letterhead' }
    ],
    deliverable: { ar: 'بيئة تشغيل مهيأة ومختبرة الربط بنجاح', en: 'Configured & Verified Integration Staging Environment' }
  },
  {
    step: '03',
    icon: Users,
    title: { ar: 'نُدرب ونتحقق', en: 'Train & Validate' },
    subtitle: { ar: 'تأهيل الكوادر ومحاكاة يوم العمل الحقيقي', en: 'Staff Training & Acceptance (UAT)' },
    duration: { ar: '5 - 7 أيام عمل', en: '5 - 7 Business Days' },
    summary: {
      ar: 'ندرب كل قسم على مهامه الخاصة، ونجري محاكاة كاملة لاستقبال مريض، وإجراء فحص، وكتابة تقرير، وتسليم النتيجة إلكترونياً.',
      en: 'We conduct role-specific hands-on training and simulate end-to-end patient visits, scans, reporting, and QR delivery.'
    },
    viaraDeliverables: [
      { ar: 'ورش تدريب عملية لموظفي الاستقبال، الفنيين، والأطباء', en: 'Interactive training for reception, radiographers, and radiologists' },
      { ar: 'اختبار دقيق لمنع الوصول غير المصرح به وفق مصفوفة RBAC', en: 'RBAC verification to prevent unauthorized access' },
      { ar: 'إشراف على سيناريوهات اختبار القبول التشغيلي (UAT)', en: 'Guiding user acceptance testing (UAT) scenarios' }
    ],
    clientCommitments: [
      { ar: 'إتاحة وقت تدريب كافٍ للطواقم الطبية والإدارية', en: 'Allocating dedicated training hours for clinical staff' },
      { ar: 'مراجعة وتوقيع محضر الجاهزية والقبول التشغيلي', en: 'Reviewing and signing the operational UAT readiness sign-off' }
    ],
    deliverable: { ar: 'محضر الجاهزية والقبول التشغيلي (UAT Sign-off)', en: 'Operational Readiness & Acceptance (UAT Sign-off)' }
  },
  {
    step: '04',
    icon: ShieldCheck,
    title: { ar: 'نُشغل ونتابع', en: 'Go-Live & Support' },
    subtitle: { ar: 'الانطلاق المباشر ومرافقة الفريق لحظياً', en: 'Live Operations & Continuous SLA' },
    duration: { ar: 'مستمر (مع أسبوع دعم حي مكثف)', en: 'Ongoing (with 1st week intensive on-site/live support)' },
    summary: {
      ar: 'إطلاق النظام رسمياً مع تواجد فريقنا لدعم الكوادر لحظياً، وضمان تدفق الفحوصات والتقارير بسلاسة دون أدنى توقف تشغيلي.',
      en: 'Official go-live with our team monitoring live transactions, verifying report delivery, and providing instant on-hand support.'
    },
    viaraDeliverables: [
      { ar: 'مرافقة تشغيلية مباشرة لطاقم العمل في أول أيام التشغيل', en: 'Live on-hand operational accompaniment during go-live days' },
      { ar: 'مراقبة استقرار خوادم الأرشفة وسرعة عارض الـ DICOM', en: 'Real-time telemetry on storage, MWL queues & DICOM speed' },
      { ar: 'تفعيل قنوات الدعم الفني السريع ومستويات الخدمة (SLA)', en: 'Activating priority technical support channels & SLA response' }
    ],
    clientCommitments: [
      { ar: 'بدء تسجيل المرضى والفحوصات الفعلية على المنظومة', en: 'Begin processing live patient registrations and examinations' },
      { ar: 'مشاركة الملاحظات اليومية مع مدير الحساب التقني', en: 'Share operational notes with the assigned technical manager' }
    ],
    deliverable: { ar: 'منظومة رقمية متكاملة تعمل بكفاءة 100%', en: 'Fully Operational Clinical Ecosystem Operating at 100%' }
  }
];

export default function PlanningRolloutRoadmap({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const currentStage = rolloutStages[activeStageIndex];
  const CurrentIcon = currentStage.icon;
  const Arrow = en ? ArrowRight : ArrowLeft;

  return (
    <section className="cpr-roadmap-section" id="rollout" aria-labelledby="cpr-roadmap-head">
      <div className="cp-section-head">
        <div>
          <span className="care-eyebrow">
            <Clock size={14} />
            {en ? '03 / IMPLEMENTATION TIMELINE' : '03 / مسار وجدول التنفيذ الزمني'}
          </span>
          <h2 id="cpr-roadmap-head">
            {en ? 'Four structured phases.' : 'أربع مراحل تنفيذ مدروسة.'}
            <br />
            <span>{en ? 'Designed to protect workflow continuity.' : 'مصمم لحماية استمرارية سير العمل السريري.'}</span>
          </h2>
        </div>
        <p>
          {en
            ? 'We ensure a seamless transition that protects your daily patient appointments while establishing robust, standardized digital workflows.'
            : 'نضمن لك انتقالاً سلساً يحافظ على مواعيد المرضى اليومية دون توقف، مع بناء بيئة تشغيلية رقمية موثوقة ومطابقة لأعلى المعايير.'}
        </p>
      </div>

      {/* Interactive Step Bar */}
      <div className="cpr-timeline-nav" role="tablist" aria-label={en ? 'Rollout phases' : 'مراحل التنفيذ'}>
        {rolloutStages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStageIndex;
          const isPassed = idx < activeStageIndex;
          return (
            <button
              key={stage.step}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cpr-timeline-step-btn ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}
              onClick={() => setActiveStageIndex(idx)}
            >
              <div className="cpr-step-indicator">
                <span className="cpr-step-num">{stage.step}</span>
                <span className="cpr-step-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
              </div>
              <div className="cpr-step-labels">
                <strong>{en ? stage.title.en : stage.title.ar}</strong>
                <small>{en ? stage.duration.en : stage.duration.ar}</small>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detailed Display */}
      <div className="cpr-stage-card" aria-live="polite">
        <div className="cpr-card-header">
          <div className="cpr-header-identity">
            <span className="cpr-stage-badge">
              <CurrentIcon size={20} />
              <span>{en ? `PHASE ${currentStage.step} OF 04` : `المرحلة ${currentStage.step} من 04`}</span>
            </span>
            <h3>{en ? currentStage.title.en : currentStage.title.ar}</h3>
            <p className="cpr-stage-subtitle">{en ? currentStage.subtitle.en : currentStage.subtitle.ar}</p>
          </div>

          <div className="cpr-duration-pill">
            <Clock size={16} />
            <span>{en ? `Estimated Duration: ${currentStage.duration.en}` : `المدة التقديرية: ${currentStage.duration.ar}`}</span>
          </div>
        </div>

        <p className="cpr-stage-summary">{en ? currentStage.summary.en : currentStage.summary.ar}</p>

        <div className="cpr-responsibilities-grid">
          {/* VIARA Responsibilities */}
          <div className="cpr-resp-box is-viara">
            <div className="cpr-resp-title">
              <Zap size={16} />
              <h4>{en ? 'What VIARA Delivers' : 'ما يقدمه وينفذه فريق VIARA'}</h4>
            </div>
            <ul>
              {currentStage.viaraDeliverables.map((item, i) => (
                <li key={i}>
                  <Check size={16} />
                  <span>{en ? item.en : item.ar}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Responsibilities */}
          <div className="cpr-resp-box is-client">
            <div className="cpr-resp-title">
              <Building2 size={16} />
              <h4>{en ? 'Your Facility’s Preparation' : 'ما توفره وتنسقه منشأتكم'}</h4>
            </div>
            <ul>
              {currentStage.clientCommitments.map((item, i) => (
                <li key={i}>
                  <Check size={16} />
                  <span>{en ? item.en : item.ar}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Milestone Deliverable Footer */}
        <div className="cpr-stage-deliverable-bar">
          <div className="cpr-deliv-badge">
            <FileCheck2 size={20} />
            <div>
              <span className="cpr-deliv-label">{en ? 'Phase Milestone Deliverable' : 'مُخرج وميثاق اعتماد المرحلة'}</span>
              <strong>{en ? currentStage.deliverable.en : currentStage.deliverable.ar}</strong>
            </div>
          </div>

          <div className="cpr-nav-actions">
            {activeStageIndex > 0 && (
              <button
                type="button"
                className="cpr-prev-btn"
                onClick={() => setActiveStageIndex(activeStageIndex - 1)}
              >
                <span>{en ? 'Previous Phase' : 'المرحلة السابقة'}</span>
              </button>
            )}
            {activeStageIndex < rolloutStages.length - 1 && (
              <button
                type="button"
                className="care-btn cpr-next-btn"
                onClick={() => setActiveStageIndex(activeStageIndex + 1)}
              >
                <span>{en ? 'Next Phase' : 'المرحلة التالية'}</span>
                <Arrow size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Assurance Banner */}
      <div className="cpr-guarantee-banner">
        <div className="cpr-guar-item">
          <Award size={22} />
          <div>
            <strong>{en ? 'Zero Clinical Interruption' : 'ضمان استمرارية العمل السريري'}</strong>
            <p>{en ? 'Parallel operation safeguards your existing patient booking during testing and migration.' : 'تشغيل متوازٍ يضمن عدم توقف مواعيد المرضى أو تأخر الفحوصات أثناء التهيئة والتحقق.'}</p>
          </div>
        </div>
        <div className="cpr-guar-item">
          <ShieldCheck size={22} />
          <div>
            <strong>{en ? '100% Data Sovereignty' : 'ملكية كاملة ومطلقة للبيانات'}</strong>
            <p>{en ? 'All imaging archives and patient records remain exclusively yours with complete export autonomy.' : 'سجلات مرضاك وصور الأشعة ملك حصري لمنشأتك مع صلاحية تصدير كاملة في أي وقت.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
