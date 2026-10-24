'use client';
import { useState } from 'react';
import { ShieldCheck, Users, Check, Lock, Info, Sparkles } from 'lucide-react';
import type { Locale } from '../lib/site-content';

interface RoleItem {
  name: { ar: string; en: string };
  access: { ar: string; en: string };
  badge: { ar: string; en: string };
}

const defaultRoles: RoleItem[] = [
  {
    name: { ar: 'الاستقبال والتسجيل', en: 'Receptionist' },
    badge: { ar: 'مكتب الاستقبال', en: 'Front Desk' },
    access: {
      ar: 'تسجيل المرضى، تأكيد المواعيد، وإدارة صالة الانتظار مع عزل تام للتقارير غير المعتمدة.',
      en: 'Patient check-in, appointments, and waiting lounge queue with strict masking of unapproved reports.'
    }
  },
  {
    name: { ar: 'فني الأشعة والتصوير', en: 'Radiographer / Tech' },
    badge: { ar: 'غرف الفحص', en: 'Scan Rooms' },
    access: {
      ar: 'استقبال قوائم العمل (MWL)، تنفيذ الفحوصات، وتوثيق استبيانات السلامة وحجم الصبغة.',
      en: 'Executing modality worklists (MWL), exam completion, contrast logs, and safety questionnaires.'
    }
  },
  {
    name: { ar: 'طبيب الأشعة والاستشاري', en: 'Radiologist' },
    badge: { ar: 'التشخيص والتقارير', en: 'Diagnostic Reading' },
    access: {
      ar: 'فتح صور DICOM، كتابة ومراجعة التقارير، التسجيل الصوتي، والاعتماد النهائي بالتوقيع الإلكتروني.',
      en: 'Reviewing DICOM imaging, dictation, drafting reports, and verified electronic sign-off.'
    }
  },
  {
    name: { ar: 'أمين الصندوق والمحاسبة', en: 'Cashier / Billing' },
    badge: { ar: 'المالية والتأمين', en: 'Billing & Cash' },
    access: {
      ar: 'إصدار الفواتير الضريبية، سداد المطالبات، إدارة ورديات الصندوق، ومعالجة الموافقات التأمينية.',
      en: 'Tax invoices, patient co-payments, cashier shift handovers, and insurance approvals.'
    }
  }
];

const trialQuotasList = [
  { label: { ar: 'مدة التجربة الافتراضية', en: 'Default Trial Duration' }, val: { ar: '30 يوماً', en: '30 Days' } },
  { label: { ar: 'المستخدمون الافتراضيون', en: 'Default Active Users' }, val: { ar: '3 مستخدمين', en: '3 Users' } },
  { label: { ar: 'سقف المرضى الإجمالي', en: 'Total Patient Quota' }, val: { ar: '50 مريضاً', en: '50 Patients' } },
  { label: { ar: 'سقف المواعيد الشهرية', en: 'Monthly Appointments' }, val: { ar: '100 موعد', en: '100 Bookings' } },
  { label: { ar: 'سقف التقارير اليومية', en: 'Daily Diagnostic Reports' }, val: { ar: '10 تقارير', en: '10 Reports' } }
];

export default function PlanningGovernanceCard({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const [activeTab, setActiveTab] = useState<'roles' | 'trial'>('roles');

  return (
    <div className="cpg-governance-card" aria-labelledby="cpg-gov-title">
      <div className="cpg-gov-header">
        <div className="cpg-gov-kicker">
          <ShieldCheck size={16} />
          <span>{en ? 'TECHNICAL GOVERNANCE & SECURITY' : 'حوكمة التراخيص وصلاحيات الأدوار'}</span>
        </div>
        <h3 id="cpg-gov-title">
          {en ? 'A licensed module is not unrestricted access.' : 'الوحدة المرخصة لا تعني صلاحية مفتوحة.'}
        </h3>
        <p>
          {en
            ? 'The architecture enforces strict two-layer isolation: licenses govern available modules and facility/user capacity; granular RBAC then defines each clinical role’s permissions to safeguard patient data privacy.'
            : 'تطبق المنظومة فصلاً أمنياً صارماً من مستويين: الرخصة تتيح الأنظمة وتحدد سقف الفروع والمستخدمين؛ بينما تضبط مصفوفة RBAC صلاحيات كل دور بدقة لحماية سرية المرضى وسير العمل.'}
        </p>
      </div>

      <div className="cpg-gov-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'roles'}
          className={`cpg-gov-tab-btn ${activeTab === 'roles' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <Users size={15} />
          <span>{en ? 'Default RBAC Role Matrix' : 'مصفوفة الأدوار التشغيلية الافتراضية (RBAC)'}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'trial'}
          className={`cpg-gov-tab-btn ${activeTab === 'trial' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('trial')}
        >
          <Lock size={15} />
          <span>{en ? 'Trial Quotas & Limits' : 'ضوابط وسقوف النسخة التجريبية'}</span>
        </button>
      </div>

      <div className="cpg-gov-body">
        {activeTab === 'roles' ? (
          <div className="cpg-roles-grid">
            {defaultRoles.map((role, idx) => (
              <div key={idx} className="cpg-role-card">
                <div className="cpg-role-top">
                  <strong>{en ? role.name.en : role.name.ar}</strong>
                  <span className="cpg-role-badge">{en ? role.badge.en : role.badge.ar}</span>
                </div>
                <p>{en ? role.access.en : role.access.ar}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="cpg-trial-grid">
              {trialQuotasList.map((item, idx) => (
                <div key={idx} className="cpg-trial-item">
                  <span className="cpg-trial-label">{en ? item.label.en : item.label.ar}</span>
                  <strong className="cpg-trial-val">{en ? item.val.en : item.val.ar}</strong>
                </div>
              ))}
              <div className="cpg-trial-note">
                <Info size={16} />
                <span>
                  {en
                    ? 'Trial access has preset limits; advanced PACS clustering and comparative multi-branch analytics require a production deployment.'
                    : 'النسخة التجريبية مخصصة للتقييم الأولي؛ الأرشفة السحابية الموزعة والتحليلات المقارنة للفروع تتطلب بيئة إنتاج معتمدة.'}
                </span>
              </div>
            </div>
            <div style={{marginTop: '1.25rem', textAlign: 'center'}}>
              <a
                href="#contact"
                style={{display: 'inline-block',
                  background: '#007b61',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  padding: '0.6rem 1.5rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.95rem',}}
              >
                {en ? 'Start a trial' : 'ابدأ تجربة النظام'}
              </a>
            </div>
          </>
        )}
      </div>

      <div className="cpg-gov-footer">
        <ShieldCheck size={16} />
        <small>
          {en
            ? 'Displayed user quotas and issuance durations are technical defaults, not commercial contract terms. The approved proposal defines the final operational scope, support SLA, and renewal terms.'
            : 'سقوف المستخدمين ومدد الإصدار المعروضة هي إعدادات تشغيلية مرجعية؛ وتعتمد الشروط التجارية النهائية ومستويات الخدمة في العرض الفني المتفق عليه.'}
        </small>
      </div>
    </div>
  );
}
