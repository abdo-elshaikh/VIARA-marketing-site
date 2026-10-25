'use client';
import { useState } from 'react';
import { Building2, ScanLine, Network, Check, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import type { Locale } from '../lib/site-content';

interface FacilityProfile {
  id: string;
  icon: typeof Building2;
  badge: { ar: string; en: string };
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  recommendedPlanId: 'أساس' | 'نمو' | 'مؤسسات';
  recommendedPlanName: { ar: string; en: string };
  tagline: { ar: string; en: string };
  highlights: Array<{ ar: string; en: string }>;
}

const facilityProfiles: FacilityProfile[] = [
  {
    id: 'single-branch',
    icon: Building2,
    badge: { ar: 'فرع واحد', en: 'Single Branch' },
    title: { ar: 'عيادة تخصصية أو مركز بفرع واحد', en: 'Specialty Clinic or Single-branch Center' },
    description: {
      ar: 'تحتاج تنظيم الاستقبال والمواعيد والملفات الطبية والفوترة بسلاسة وبأعلى كفاءة تشغيلية دون تعقيد فني زائد.',
      en: 'Streamline reception, scheduling, medical records, and billing with maximum operational efficiency and zero unnecessary complexity.'
    },
    recommendedPlanId: 'أساس',
    recommendedPlanName: { ar: 'باقة أساس (Essential)', en: 'Essential Package' },
    tagline: {
      ar: 'انطلاقة مثالية مدروسة تغطي جميع العمليات اليومية لفرعك.',
      en: 'An ideal, well-considered launch covering all daily branch operations.'
    },
    highlights: [
      { ar: 'حتى 25 مستخدماً مرخصاً لفرع واحد', en: 'Up to 25 licensed users for a single branch' },
      { ar: 'إدارة ملفات المرضى، المواعيد، وورديات الصندوق', en: 'Patient records, appointments, and cashier shifts' },
      { ar: 'مصفوفة أدوار وصلاحيات تشغيلية محددة ومنضبطة', en: 'Defined, strict operational RBAC permissions' }
    ]
  },
  {
    id: 'radiology-center',
    icon: ScanLine,
    badge: { ar: 'الأكثر اختياراً', en: 'Most Popular' },
    title: { ar: 'مركز أشعة وفحوصات تشخيصية متكامل', en: 'Full Diagnostic Radiology Center' },
    description: {
      ar: 'تحتاج ربط أجهزة الأشعة بقوائم العمل (MWL) وأرشفة الصور الطبية (PACS) وتسليم التقارير الفورية للمرضى والأطباء عبر QR.',
      en: 'Connect imaging modalities to DICOM MWL, archive scans with PACS, and deliver instant verified reports to patients via QR.'
    },
    recommendedPlanId: 'نمو',
    recommendedPlanName: { ar: 'باقة نمو (Growth)', en: 'Growth Package' },
    tagline: {
      ar: 'تكامل سريري كامل بين RIS وPACS وبوابة المرضى لتسريع التقارير.',
      en: 'Complete clinical synergy between RIS, PACS, and patient portal to speed turnaround.'
    },
    highlights: [
      { ar: 'تكامل وحدات RIS والأرشفة السريعة PACS', en: 'Seamless RIS and rapid PACS archiving integration' },
      { ar: 'بوابة رقمية للمرضى والأطباء المحولين مع تحقق QR', en: 'Patient & referring physician portal with QR verification' },
      { ar: 'إدارة متكاملة للتأمين الطبي، العقود، والتقارير المتقدمة', en: 'Integrated medical insurance, contracts, and analytics' }
    ]
  },
  {
    id: 'multisite-network',
    icon: Network,
    badge: { ar: 'شبكات ومجموعات', en: 'Healthcare Groups' },
    title: { ar: 'مجموعة مراكز أو شبكة فروع ومستشفيات', en: 'Multi-branch Group or Hospital Network' },
    description: {
      ar: 'تحتاج إدارة موحدة لعدة فروع، حوكمة مركزية للمرضى، ربط الدخول الموحد (SSO)، وتحليلات مقارنة شاملة.',
      en: 'Unified multi-branch governance, centralized patient registry, SSO/OIDC integration, and comprehensive comparative analytics.'
    },
    recommendedPlanId: 'مؤسسات',
    recommendedPlanName: { ar: 'باقة مؤسسات (Multi-site)', en: 'Multi-site Enterprise' },
    tagline: {
      ar: 'رخصة Enterprise شاملة تدعم تشغيل الفروع اللامحدودة.',
      en: 'Full Enterprise license supporting unlimited branches and users.'
    },
    highlights: [
      { ar: 'دعم تشغيل فروع متعددة ومستخدمين بلا حد مسبق', en: 'Multi-branch & unlimited user capacity by default' },
      { ar: 'ربط الدخول الموحد (SSO / SAML / OIDC) وتكاملات مخصصة', en: 'SSO/OIDC integration and custom clinical interfaces' },
      { ar: 'أرشفة موزعة، حوكمة مركزية، وسجلات تدقيق متقدمة', en: 'Distributed archiving, central governance & deep audit logs' }
    ]
  }
];

export default function PlanningFacilityMatcher({
  locale,
  onSelectPlan,
  activePlanId
}: {
  locale: Locale;
  onSelectPlan: (planId: 'أساس' | 'نمو' | 'مؤسسات') => void;
  activePlanId?: string;
}) {
  const en = locale === 'en';
  const [selectedProfileId, setSelectedProfileId] = useState<string>('radiology-center');
  const Arrow = en ? ArrowRight : ArrowLeft;

  const currentProfile = facilityProfiles.find(p => p.id === selectedProfileId) || facilityProfiles[1];

  return (
    <section className="cpm-matcher-section" aria-labelledby="cpm-matcher-title">
      <div className="cpm-matcher-header">
        <span className="care-eyebrow">
          <Sparkles size={14} />
          {en ? 'SMART SCOPE RECOMMENDER' : 'مساعد اختيار الباقة الذكي'}
        </span>
        <h2 id="cpm-matcher-title">
          {en ? 'Which facility profile matches your center?' : 'أي الملفات التشغيلية يصف منشأتك بدقة؟'}
        </h2>
        <p>
          {en
            ? 'Select your operational scale to see the recommended package and baseline architecture tailored to your daily workflow.'
            : 'اختر حجم وطبيعة عمل منشأتك لنقترح لك الباقة الأنسب ونقاط التجهيز الموصى بها قبل طلب العرض الفني.'}
        </p>
      </div>

      <div className="cpm-profiles-selector" role="tablist" aria-label={en ? 'Facility profiles' : 'ملفات المنشآت'}>
        {facilityProfiles.map(profile => {
          const Icon = profile.icon;
          const isSelected = profile.id === selectedProfileId;
          return (
            <button
              key={profile.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`cpm-profile-btn ${isSelected ? 'is-active' : ''}`}
              onClick={() => setSelectedProfileId(profile.id)}
            >
              <div className="cpm-profile-btn-top">
                <span className="cpm-profile-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="cpm-profile-badge">{en ? profile.badge.en : profile.badge.ar}</span>
              </div>
              <strong>{en ? profile.title.en : profile.title.ar}</strong>
            </button>
          );
        })}
      </div>

      <div className="cpm-recommendation-card">
        <div className="cpm-rec-details">
          <div className="cpm-rec-kicker">
            <ShieldCheck size={16} />
            <span>{en ? 'RECOMMENDED STARTING BASELINE' : 'الباقة الموصى بها لنشاطك'}</span>
          </div>
          <h3>{en ? currentProfile.recommendedPlanName.en : currentProfile.recommendedPlanName.ar}</h3>
          <p className="cpm-rec-desc">{en ? currentProfile.description.en : currentProfile.description.ar}</p>

          <ul className="cpm-rec-highlights">
            {currentProfile.highlights.map((h, i) => (
              <li key={i}>
                <Check size={16} />
                <span>{en ? h.en : h.ar}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cpm-rec-action-box">
          <span className="cpm-rec-tagline">{en ? currentProfile.tagline.en : currentProfile.tagline.ar}</span>
          <div className="cpm-rec-meta">
            <span className="cpm-rec-scope-label">
              {en ? 'Included Baseline Architecture:' : 'المعمارية التقنية المتضمنة:'}
            </span>
            <div className="cpm-rec-pills">
              {currentProfile.recommendedPlanId === 'أساس' && (
                <>
                  <span className="cpm-rec-pill">Standard Edition</span>
                  <span className="cpm-rec-pill">Single Branch</span>
                  <span className="cpm-rec-pill">25 Users</span>
                </>
              )}
              {currentProfile.recommendedPlanId === 'نمو' && (
                <>
                  <span className="cpm-rec-pill">RIS + PACS + PORTAL</span>
                  <span className="cpm-rec-pill">Standard Expanded</span>
                  <span className="cpm-rec-pill">QR Verification</span>
                </>
              )}
              {currentProfile.recommendedPlanId === 'مؤسسات' && (
                <>
                  <span className="cpm-rec-pill">Enterprise Edition</span>
                  <span className="cpm-rec-pill">Unlimited Branches</span>
                  <span className="cpm-rec-pill">SSO / SAML 2.0</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            className="care-btn cpm-rec-btn"
            onClick={() => onSelectPlan(currentProfile.recommendedPlanId)}
          >
            <span>
              {en
                ? `Highlight ${currentProfile.recommendedPlanName.en}`
                : `استعراض ${currentProfile.recommendedPlanName.ar}`}
            </span>
            <Arrow size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
