'use client';
import { useState, Fragment } from 'react';
import { Check, X, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Sparkles, SlidersHorizontal, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import type { Locale } from '../lib/site-content';

interface MatrixRow {
  name: { ar: string; en: string };
  hint?: { ar: string; en: string };
  essential: { ar: string; en: string; status: 'yes' | 'no' | 'partial' };
  growth: { ar: string; en: string; status: 'yes' | 'no' | 'partial' };
  multisite: { ar: string; en: string; status: 'yes' | 'no' | 'partial' };
}

interface MatrixCategory {
  id: string;
  title: { ar: string; en: string };
  rows: MatrixRow[];
}

const matrixCategories: MatrixCategory[] = [
  {
    id: 'systems',
    title: { ar: 'الأنظمة الطبية والتشغيلية المشمولة', en: 'Core Clinical & Operational Systems' },
    rows: [
      {
        name: { ar: 'نظام إدارة مراكز الأشعة (RIS)', en: 'Radiology Information System (RIS)' },
        hint: { ar: 'جدولة مواعيد الأشعة، الاستقبال، وقوائم العمل الفنية', en: 'Exam scheduling, patient reception, and technician worklists' },
        essential: { ar: 'وحدة أساسية (جدولة واستقبال)', en: 'Core module (scheduling & desk)', status: 'partial' },
        growth: { ar: 'شامل بالكامل مع الفوترة والتقارير', en: 'Full module with billing & reporting', status: 'yes' },
        multisite: { ar: 'شامل مع سير عمل مخصص للفروع', en: 'Full module with multi-branch workflows', status: 'yes' }
      },
      {
        name: { ar: 'أرشفة الصور الطبية (PACS & DICOM)', en: 'Medical Image Archiving (PACS & DICOM)' },
        hint: { ar: 'تخزين صور الأشعة DICOM وعارض ويب سريع للتشخيص', en: 'DICOM imaging storage and lightweight web viewer' },
        essential: { ar: 'إضافة اختيارية منفصلة', en: 'Optional add-on', status: 'partial' },
        growth: { ar: 'مشمول مع عارض ويب خفيف', en: 'Included with fast web viewer', status: 'yes' },
        multisite: { ar: 'أرشفة موزعة ومزامنة مركزية لكافة الفروع', en: 'Distributed archiving & multi-site sync', status: 'yes' }
      },
      {
        name: { ar: 'إدارة المراكز والعيادات (CMS & EMR)', en: 'Clinic & Medical Center Management (CMS)' },
        hint: { ar: 'الملف الطبي الموحد للمريض، العيادات، وسجل الزيارات', en: 'Unified EMR, specialty clinics, and patient visit tracking' },
        essential: { ar: 'إدارة الاستقبال والملفات والمواعيد', en: 'Reception, EMR & appointments', status: 'yes' },
        growth: { ar: 'شامل التأمين والمطالبات والمخزون', en: 'Full insurance, claims & inventory', status: 'yes' },
        multisite: { ar: 'حوكمة موحدة لكافة التخصصات والفروع', en: 'Unified governance across all specialties', status: 'yes' }
      },
      {
        name: { ar: 'بوابة المريض والأطباء المحولين (PORTAL)', en: 'Patient & Referring Physician Portal' },
        hint: { ar: 'تسليم التقارير الفوري بروابط مشفرة ورمز QR', en: 'Instant report delivery via encrypted links and QR code' },
        essential: { ar: 'إضافة اختيارية', en: 'Optional add-on', status: 'partial' },
        growth: { ar: 'مشمول مع تحقق QR وروابط مشفرة', en: 'Included with QR & encrypted links', status: 'yes' },
        multisite: { ar: 'بوابات مخصصة بهوية المنشأة وتكامل شامل', en: 'Branded portals with deep integration', status: 'yes' }
      },
      {
        name: { ar: 'التقارير الصوتية المسجلة وتفريغ الفحوصات', en: 'Audio Dictation & Diagnostic Reporting' },
        hint: { ar: 'تسجيل الملاحظات الصوتية وقوالب التقارير المعتمدة', en: 'Voice recording and certified reporting templates' },
        essential: { ar: 'قوالب نصية قياسية', en: 'Standard text templates', status: 'partial' },
        growth: { ar: 'مشمول مع تسجيل صوتي مدمج', en: 'Included with embedded audio recording', status: 'yes' },
        multisite: { ar: 'مشمول مع قوالب موحدة وتوقيع إلكتروني', en: 'Included with unified templates & e-sign', status: 'yes' }
      }
    ]
  },
  {
    id: 'licensing',
    title: { ar: 'سعة الترخيص وحدود التشغيل', en: 'Licensing Capacity & Scale' },
    rows: [
      {
        name: { ar: 'عدد الفروع المرخصة افتراضياً', en: 'Licensed Branches by Default' },
        hint: { ar: 'عدد المواقع الجغرافية المشغلة للأنظمة', en: 'Number of physical locations operating the software' },
        essential: { ar: 'فرع واحد', en: '1 Branch', status: 'yes' },
        growth: { ar: 'فرع واحد (توسعة موثقة بالعرض)', en: '1 Branch (documented expansions)', status: 'yes' },
        multisite: { ar: 'فروع متعددة بلا حد مسبق', en: 'Multi-branch without preset limit', status: 'yes' }
      },
      {
        name: { ar: 'عدد المستخدمين المسموح بهم', en: 'Default User Seat Limit' },
        hint: { ar: 'الحسابات النشطة للطواقم الطبية والإدارية', en: 'Active user accounts for clinical and admin staff' },
        essential: { ar: 'حتى 25 مستخدماً', en: 'Up to 25 users', status: 'yes' },
        growth: { ar: 'حتى 25 مستخدماً (قابل للتوسعة)', en: 'Up to 25 users (expandable)', status: 'yes' },
        multisite: { ar: 'مستخدمون بلا حد مسبق (-1)', en: 'Unlimited users (-1)', status: 'yes' }
      },
      {
        name: { ar: 'طراز وخيار الاستضافة', en: 'Deployment Architecture' },
        hint: { ar: 'بيئة تشغيل السيرفرات وقواعد البيانات', en: 'Hosting servers and database topology' },
        essential: { ar: 'سحابية مدارة أو خادم محلي', en: 'Managed Cloud or Local Server', status: 'yes' },
        growth: { ar: 'استضافة هجينة (محلي + سحابي)', en: 'Hybrid (Local + Cloud)', status: 'yes' },
        multisite: { ar: 'استضافة هجينة خاصة أو سحابة المؤسسة', en: 'Enterprise Private Cloud / On-Prem', status: 'yes' }
      }
    ]
  },
  {
    id: 'security',
    title: { ar: 'الأمان والحوكمة والربط التقني', en: 'Security, RBAC & Integrations' },
    rows: [
      {
        name: { ar: 'التحكم بالصلاحيات حسب الدور (RBAC)', en: 'Role-Based Access Control (RBAC)' },
        hint: { ar: 'فصل صلاحيات الاستقبال، الفني، الطبيب، والمحاسب', en: 'Strict isolation of reception, tech, doctor, and cashier roles' },
        essential: { ar: 'مصفوفة أدوار قياسية جاهزة', en: 'Standard ready role matrix', status: 'yes' },
        growth: { ar: 'مصفوفة صلاحيات تفصيلية متعددة المستويات', en: 'Multi-level granular permissions', status: 'yes' },
        multisite: { ar: 'صلاحيات مخصصة لكل فرع وقسم مع حوكمة مركزية', en: 'Per-branch & per-department custom RBAC', status: 'yes' }
      },
      {
        name: { ar: 'الدخول الموحد المؤسسي (SSO / SAML / OIDC)', en: 'Enterprise Single Sign-On (SSO / OIDC)' },
        hint: { ar: 'ربط تسجيل الدخول مع Active Directory أو Okta أو Google', en: 'Federated login with Active Directory, Okta, or Google' },
        essential: { ar: 'غير متاح', en: 'Not included', status: 'no' },
        growth: { ar: 'غير متاح', en: 'Not included', status: 'no' },
        multisite: { ar: 'مشمول ومدعوم بالكامل', en: 'Fully supported & included', status: 'yes' }
      },
      {
        name: { ar: 'سجلات التدقيق الأمني (Audit Logs)', en: 'Audit Trails & Compliance Logging' },
        hint: { ar: 'تتبع كافة عمليات فتح الملفات والتعديلات والطباعة', en: 'Tracking file views, edits, approvals, and exports' },
        essential: { ar: 'سجلات العمليات المالية والطبية الأساسية', en: 'Standard financial & medical logs', status: 'yes' },
        growth: { ar: 'سجلات نشاط سريري تفصيلية', en: 'Granular clinical activity logs', status: 'yes' },
        multisite: { ar: 'سجلات تدقيق مركزية وتقارير امتثال متقدمة', en: 'Centralized audit & compliance reports', status: 'yes' }
      },
      {
        name: { ar: 'بروتوكولات ربط الأجهزة (DICOM 3.0 / HL7)', en: 'Modality Protocols (DICOM / HL7)' },
        hint: { ar: 'دعم قوائم العمل Modality Worklist وتخزين الصور', en: 'Modality Worklist (MWL) & DICOM Storage integration' },
        essential: { ar: 'ربط محدود للأجهزة الأساسية', en: 'Basic modality connections', status: 'partial' },
        growth: { ar: 'خدمات DICOM: MWL وC-STORE وC-FIND (النطاق يُحدد في العرض)', en: 'DICOM MWL, C-STORE and C-FIND services (scope confirmed in proposal)', status: 'partial' },
        multisite: { ar: 'توجيه DICOM مخصص ونطاق التكاملات يُحدد في العرض', en: 'Custom DICOM routing and integration scope, confirmed in proposal', status: 'yes' }
      }
    ]
  },
  {
    id: 'support',
    title: { ar: 'التنفيذ والتدريب ومستويات الخدمة (SLA)', en: 'Rollout, Training & Support SLA' },
    rows: [
      {
        name: { ar: 'برنامج تدريب الكوادر السريرية والإدارية', en: 'Staff & Clinical Training Program' },
        hint: { ar: 'ورش عمل عملية لطواقم الاستقبال والأطباء والفنيين', en: 'Hands-on workshops for reception, doctors, and technicians' },
        essential: { ar: 'جلسات تدريب أساسية للمستخدمين', en: 'Core user training sessions', status: 'yes' },
        growth: { ar: 'برنامج تدريب متخصص لكل قسم تشغيلي', en: 'Specialized departmental training program', status: 'yes' },
        multisite: { ar: 'برنامج تدريب وتأهيل مدربين معتمدين (Train-the-Trainer)', en: 'Train-the-trainer & certified rollouts', status: 'yes' }
      },
      {
        name: { ar: 'زمن الاستجابة للدعم الفني (SLA)', en: 'Technical Support SLA' },
        hint: { ar: 'سرعة التفاعل مع الاستفسارات وحالات الطوارئ الفنية', en: 'Response time for routine inquiries & urgent tickets' },
        essential: { ar: 'خلال ساعات العمل الرسمية', en: 'Business hours standard SLA', status: 'yes' },
        growth: { ar: 'أولوية متقدمة 12/7 مع متابعة دورية', en: 'Priority 12/7 with periodic check-ins', status: 'yes' },
        multisite: { ar: 'دعم مخصص 24/7 مع مدير حساب تقني مخصص', en: 'Dedicated 24/7 VIP with assigned TAM', status: 'yes' }
      },
      {
        name: { ar: 'النسخ الاحتياطي وحماية الأرشيف الطبي', en: 'Automated Backup & Archive Protection' },
        hint: { ar: 'حماية مستمرة من فقدان البيانات وتكرار الأرشيف', en: 'Continuous data protection and archive redundancy' },
        essential: { ar: 'نسخ احتياطي يومي محلي', en: 'Daily local backup', status: 'yes' },
        growth: { ar: 'نسخ احتياطي هجين مجدول آلياً', en: 'Automated scheduled hybrid backup', status: 'yes' },
        multisite: { ar: 'نسخ احتياطي موزع مع خطة استعادة كوارث (DR)', en: 'Distributed backup with Disaster Recovery', status: 'yes' }
      }
    ]
  }
];

export default function PlanningPackagesMatrix({
  locale,
  onChoosePlan,
  onDiscussPlan,
  activePlanId
}: {
  locale: Locale;
  onChoosePlan?: (planId: 'أساس' | 'نمو' | 'مؤسسات') => void;
  onDiscussPlan?: (planId: 'أساس' | 'نمو' | 'مؤسسات') => void;
  activePlanId?: string | null;
}) {
  const en = locale === 'en';
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const [isOpen, setIsOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoriesToDisplay = activeCategory === 'all'
    ? matrixCategories
    : matrixCategories.filter(c => c.id === activeCategory);

  return (
    <section className="cpm-matrix-section" id="package-matrix" aria-labelledby="cpm-matrix-head">
      <div className="cpm-matrix-head-wrap">
        <div>
          <span className="care-eyebrow">
            <SlidersHorizontal size={14} />
            {en ? 'DETAILED CAPABILITY MATRIX' : 'مصفوفة المقارنة الفنية الشاملة'}
          </span>
          <h2 id="cpm-matrix-head">
            {en ? 'Direct comparison without ambiguity.' : 'مقارنة فنية دقيقة ومباشرة دون غموض.'}
          </h2>
          <p>
            {en
              ? 'Filter by technical dimension to examine systems, capacity limits, security layers, and support SLAs.'
              : 'استعرض الفروق الفنية الجوهرية حسب البعد التقني للأنظمة، التراخيص، الأمان، ومستويات الخدمة.'}
          </p>
        </div>

        <button
          type="button"
          className="cpm-toggle-matrix-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>{isOpen ? (en ? 'Collapse Table' : 'طي جدول المقارنة') : (en ? 'Expand Table' : 'عرض جدول المقارنة')}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Category Tabs Filter */}
      {isOpen && (
        <div className="cpm-matrix-category-tabs" role="tablist" aria-label={en ? 'Matrix categories' : 'أقسام مصفوفة المقارنة'}>
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            className={`cpm-cat-tab ${activeCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            {en ? 'All Specifications' : 'جميع المواصفات (شامل)'}
          </button>
          {matrixCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`cpm-cat-tab ${activeCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {en ? cat.title.en : cat.title.ar}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="cpm-table-container">
          <table className="cpm-matrix-table">
            <thead>
              <tr>
                <th className="cpm-th-feature">
                  <span>{en ? 'Specification & Architecture' : 'المواصفة والمعمارية التقنية'}</span>
                </th>
                <th className="cpm-th-plan cpm-th-essential">
                  <div className="cpm-th-badge">01</div>
                  <strong>{en ? 'Essential' : 'باقة أساس'}</strong>
                  <small>{en ? 'Core Single-Branch' : 'تشغيل أساسي لفرع واحد'}</small>
                </th>
                <th className="cpm-th-plan cpm-th-growth is-popular">
                  <div className="cpm-popular-pill">{en ? 'Recommended for Radiology' : 'الأكثر طلباً لمراكز الأشعة'}</div>
                  <div className="cpm-th-badge">02</div>
                  <strong>{en ? 'Growth' : 'باقة نمو'}</strong>
                  <small>{en ? 'Full Radiology Synergy' : 'تكامل تشخيصي وسريري كامل'}</small>
                </th>
                <th className="cpm-th-plan cpm-th-multisite">
                  <div className="cpm-th-badge">03</div>
                  <strong>{en ? 'Multi-site' : 'باقة مؤسسات'}</strong>
                  <small>{en ? 'Multi-Branch & Groups' : 'للشبكات والمجموعات الكبيرة'}</small>
                </th>
              </tr>
            </thead>
            <tbody>
              {categoriesToDisplay.map(category => (
                <Fragment key={category.id}>
                  <tr key={category.id} className="cpm-category-row">
                    <td colSpan={4}>
                      <span className="cpm-cat-title">{en ? category.title.en : category.title.ar}</span>
                    </td>
                  </tr>
                  {category.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="cpm-data-row">
                      <td className="cpm-td-feature">
                        <strong>{en ? row.name.en : row.name.ar}</strong>
                        {row.hint && <small>{en ? row.hint.en : row.hint.ar}</small>}
                      </td>
                      <td className={`cpm-td-val cpm-val-${row.essential.status}`}>
                        <div className="cpm-val-wrap">
                          {row.essential.status === 'yes' && <Check size={16} className="cpm-icon-yes" />}
                          {row.essential.status === 'no' && <X size={16} className="cpm-icon-no" />}
                          {row.essential.status === 'partial' && <HelpCircle size={16} className="cpm-icon-partial" />}
                          <span>{en ? row.essential.en : row.essential.ar}</span>
                        </div>
                      </td>
                      <td className={`cpm-td-val is-featured cpm-val-${row.growth.status}`}>
                        <div className="cpm-val-wrap">
                          {row.growth.status === 'yes' && <Check size={16} className="cpm-icon-yes" />}
                          {row.growth.status === 'no' && <X size={16} className="cpm-icon-no" />}
                          {row.growth.status === 'partial' && <HelpCircle size={16} className="cpm-icon-partial" />}
                          <span>{en ? row.growth.en : row.growth.ar}</span>
                        </div>
                      </td>
                      <td className={`cpm-td-val cpm-val-${row.multisite.status}`}>
                        <div className="cpm-val-wrap">
                          {row.multisite.status === 'yes' && <Check size={16} className="cpm-icon-yes" />}
                          {row.multisite.status === 'no' && <X size={16} className="cpm-icon-no" />}
                          {row.multisite.status === 'partial' && <HelpCircle size={16} className="cpm-icon-partial" />}
                          <span>{en ? row.multisite.en : row.multisite.ar}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="cpm-tfoot-row">
                <td className="cpm-td-feature">
                  <strong>{en ? 'Ready to discuss?' : 'مستعد لمناقشة المتطلبات؟'}</strong>
                  <small>{en ? 'Direct consultation for your center' : 'طلب مناقشة فوري للباقة المناسبة'}</small>
                </td>
                <td className="cpm-td-val">
                  <button
                    type="button"
                    className="cpm-table-action-btn"
                    onClick={() => (onDiscussPlan ? onDiscussPlan('أساس') : onChoosePlan?.('أساس'))}
                  >
                    <span>{en ? 'Discuss Essential' : 'ناقش باقة أساس'}</span>
                    <Arrow size={14} />
                  </button>
                </td>
                <td className="cpm-td-val is-featured">
                  <button
                    type="button"
                    className="cpm-table-action-btn is-growth"
                    onClick={() => (onDiscussPlan ? onDiscussPlan('نمو') : onChoosePlan?.('نمو'))}
                  >
                    <span>{en ? 'Discuss Growth' : 'ناقش باقة نمو'}</span>
                    <Arrow size={14} />
                  </button>
                </td>
                <td className="cpm-td-val">
                  <button
                    type="button"
                    className="cpm-table-action-btn"
                    onClick={() => (onDiscussPlan ? onDiscussPlan('مؤسسات') : onChoosePlan?.('مؤسسات'))}
                  >
                    <span>{en ? 'Discuss Multi-site' : 'ناقش باقة مؤسسات'}</span>
                    <Arrow size={14} />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}
