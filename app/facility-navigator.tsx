'use client';
import { useState } from 'react';
import {
  Hospital, ScanLine, Stethoscope, Microscope, Building2,
  ArrowUpLeft, CheckCircle2, ChevronRight, Layers3, Activity, ShieldCheck
} from 'lucide-react';
import { txt, type Locale } from '../lib/site-content';
import { createTranslator } from '../lib/i18n';
import { solutionPath } from '../lib/solutions';

interface FacilityProfile {
  id: string;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  icon: any;
  coreSystems: string[];
  features: { ar: string; en: string }[];
  statLabel: { ar: string; en: string };
  statValue: string;
}

const profiles: FacilityProfile[] = [
  {
    id: 'hospital',
    name: { ar: 'مستشفى عام أو تخصصي', en: 'General / Specialty Hospital' },
    tagline: { ar: 'إدارة متكاملة من الطوارئ والتنويم إلى العمليات وغرف العناية.', en: 'Comprehensive acute care, inpatient, surgery, and ICU management.' },
    icon: Hospital,
    coreSystems: ['HIS', 'EMR', 'NURSING', 'OR', 'LIS', 'PHARM', 'RCM'],
    features: [
      { ar: 'إدارة الأجنحة والأسرّة وغرف العمليات لحظة بلحظة', en: 'Real-time bed, ward, and OR surgical scheduling' },
      { ar: 'ملف سريري موحد وربط الصيدلية ومختبر الطوارئ', en: 'Unified EMR connecting pharmacy, lab, and wards' },
      { ar: 'دورة فوترة تأمينية مؤتمتة متوافقة مع منصة نفيس', en: 'Automated insurance billing with NPHIES compliance' },
    ],
    statLabel: { ar: 'كفاءة تشغيل الأسرّة', en: 'Bed Turnover Efficiency' },
    statValue: '+34%',
  },
  {
    id: 'radiology',
    name: { ar: 'مركز أشعة وتصوير تشخيصي', en: 'Radiology & Imaging Center' },
    tagline: { ar: 'من حجز الفحص وقوائم العمل إلى أرشفة DICOM وكتابة التقارير.', en: 'From exam booking and worklists to cloud DICOM and diagnostic reporting.' },
    icon: ScanLine,
    coreSystems: ['RIS', 'PACS', 'PORTAL', 'RCM', 'AI'],
    features: [
      { ar: 'قوائم عمل Modality Worklist آلية لكافة أجهزة الأشعة', en: 'Automated modality worklists for CT, MRI, X-Ray, US' },
      { ar: 'أرشفة سحابية غير محدودة وعارض DICOM ثلاثي الأبعاد', en: 'Scalable cloud PACS with zero-footprint 3D viewer' },
      { ar: 'بوابة مريض فورية وبث الصور والتقارير عبر الهاتف', en: 'Instant patient portal delivering imaging & reports to mobile' },
    ],
    statLabel: { ar: 'زمن تسليم التقرير الشعاعي', en: 'Report Turnaround Time' },
    statValue: '-45%',
  },
  {
    id: 'medical',
    name: { ar: 'مجمع عيادات ومراكز تخصصية', en: 'Polyclinic & Specialty Clinics' },
    tagline: { ar: 'تنسيق سلس للمواعيد، العيادات، الفواتير، ومتابعة الأطباء.', en: 'Seamless appointments, clinic queues, billing, and doctor schedules.' },
    icon: Stethoscope,
    coreSystems: ['CMS', 'EMR', 'PORTAL', 'RCM', 'DENTAL'],
    features: [
      { ar: 'جدولة المواعيد وحجز ذاتي عبر واتساب وتطبيق الجوال', en: 'Self-service online and WhatsApp appointment booking' },
      { ar: 'نماذج سريرية تخصصية (جلدية، عيون، باطنة، أسنان)', en: 'Specialty-tailored clinical forms and treatment plans' },
      { ar: 'إصدار الفواتير الضريبية والمطالبات التأمينية الفورية', en: 'Compliant e-invoicing and instant insurance eligibility' },
    ],
    statLabel: { ar: 'تقليل فترات انتظار المرضى', en: 'Waiting Time Reduction' },
    statValue: '-50%',
  },
  {
    id: 'laboratory',
    name: { ar: 'مختبر تحاليل طبية وبنك دم', en: 'Diagnostic Laboratory & Blood Bank' },
    tagline: { ar: 'دورة العينة الآلية من السحب والباركود إلى التحليل والاعتماد.', en: 'Automated specimen lifecycle from accessioning to analyzer validation.' },
    icon: Microscope,
    coreSystems: ['LIS', 'PATH', 'BLOOD', 'PORTAL', 'INTEROP'],
    features: [
      { ar: 'ربط ثنائي الاتجاه مباشر مع أجهزة التحاليل الكيميائية والدموية', en: 'Bidirectional analyzer interfacing for chemistry and hematology' },
      { ar: 'تنبيهات فورية للقيم الحرجة ترسل مباشرة للأطباء', en: 'Automated STAT critical value alerts to attending doctors' },
      { ar: 'مراقبة الجودة QC ومعايرة الأجهزة وتتبع سلسلة العينات', en: 'Integrated QC management and specimen chain of custody' },
    ],
    statLabel: { ar: 'تقليل أخطاء الإدخال اليدوي', en: 'Manual Transcription Errors' },
    statValue: '0%',
  },
  {
    id: 'network',
    name: { ar: 'شبكة منشآت ومجموعات قابضة', en: 'Healthcare Group & Multi-Branch' },
    tagline: { ar: 'رؤية مركزية موحدة لكافة الفروع، المستشفيات، والكوادر الطبية.', en: 'Unified centralized visibility across branches, hospitals, and staff.' },
    icon: Building2,
    coreSystems: ['HIS', 'CMS', 'EMR', 'BI', 'ERP', 'INTEROP'],
    features: [
      { ar: 'ملف طبي موحد للمريض ينتقل معه بين كافة فروع المجموعة', en: 'One master patient index accessible across all branches' },
      { ar: 'لوحات تحليلات ذكاء أعمال BI تنفيذية موحدة للإدارة العليا', en: 'Executive BI dashboards for group-level operational analytics' },
      { ar: 'إدارة مركزية للمشتريات وسلاسل الإمداد ومستودعات الأدوية', en: 'Consolidated procurement, inventory, and supply chain' },
    ],
    statLabel: { ar: 'الرؤية المركزية الشاملة', en: 'Multi-Branch Visibility' },
    statValue: '100%',
  },
];

export default function FacilityNavigator({
  locale = 'ar',
  onSelectScope,
}: {
  locale?: Locale;
  onSelectScope: (systems: string[], facilityId: string) => void;
}) {
  const en = locale === 'en';
  const t = createTranslator(locale);
  const [selectedId, setSelectedId] = useState('hospital');
  const activeProfile = profiles.find(p => p.id === selectedId) || profiles[0];

  return (
    <div className="vx-facility-navigator">
      <div className="facility-tabs" role="tablist" aria-label={t('نوع المنشأة الصحية', 'Healthcare Facility Type')}>
        {profiles.map(p => {
          const Icon = p.icon;
          const isSelected = p.id === selectedId;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isSelected}
              className={`facility-tab ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedId(p.id)}
            >
              <Icon size={19} />
              <span>{txt(p.name, locale)}</span>
            </button>
          );
        })}
      </div>

      <div className="facility-card">
        <div className="facility-card-info">
          <div className="facility-card-header">
            <span className="facility-tag">{t('الحزمة الموصى بها لمنشأتك', 'RECOMMENDED SUITE')}</span>
            <h3>{txt(activeProfile.name, locale)}</h3>
            <p>{txt(activeProfile.tagline, locale)}</p>
          </div>

          <div className="facility-systems-row">
            <span className="systems-label">{t('الأنظمة المتكاملة في هذه الحزمة:', 'Integrated Systems in this Suite:')}</span>
            <div className="systems-pills">
              {activeProfile.coreSystems.map(sysId => (
                <a
                  key={sysId}
                  href={solutionPath(sysId, locale)}
                  className="sys-pill"
                  title={t('عرض تفاصيل هذا النظام', 'View system details')}
                >
                  <b>{sysId}</b>
                </a>
              ))}
            </div>
          </div>

          <div className="facility-features-list">
            {activeProfile.features.map((feat, idx) => (
              <div key={idx} className="feat-item">
                <CheckCircle2 size={16} className="feat-check" />
                <span>{txt(feat, locale)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="facility-card-side">
          <div className="stat-callout">
            <span className="stat-title">{txt(activeProfile.statLabel, locale)}</span>
            <span className="stat-number">{activeProfile.statValue}</span>
            <small>{t('بناءً على قياسات تشغيلية موثقة لدى عملاء VIARA', 'Based on validated operational benchmarks')}</small>
          </div>

          <button
            type="button"
            className="btn-discuss-scope"
            onClick={() => onSelectScope(activeProfile.coreSystems, activeProfile.id)}
          >
            <span>{t('ناقش هذا النطاق لمنشأتك', 'Discuss this Scope for your Facility')}</span>
            <ArrowUpLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
