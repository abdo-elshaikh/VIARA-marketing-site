'use client';
import { Activity, Bell, CalendarDays, ChartNoAxesColumnIncreasing, ClipboardCheck, CreditCard, FileText, HeartPulse, MessageSquare, Package, ScanLine, ShieldCheck, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Locale } from '../lib/site-content';
import './care-capabilities.css';

const capabilities = [
  {
    category: 'clinical',
    icon: CalendarDays,
    title: { ar: 'استقبال المرضى والمواعيد', en: 'Patient reception & appointments' },
    description: {
      ar: 'نظّم بيانات المرضى والإحالات والمواعيد، وتابع الوصول والانتظار من مساحة عمل واحدة.',
      en: 'Organize patient records, referrals and appointments, then track arrivals and waiting lists in one workspace.',
    },
    items: {
      ar: ['ملفات المرضى والأطباء المحيلون', 'جدولة المواعيد والغرف والأجهزة', 'متابعة الوصول وقوائم الانتظار'],
      en: ['Patient and referring physician records', 'Appointment, room and modality scheduling', 'Arrival and waiting-list tracking'],
    },
  },
  {
    category: 'clinical',
    icon: ScanLine,
    title: { ar: 'سير عمل الأشعة والتقارير', en: 'Radiology workflow & reporting' },
    description: {
      ar: 'تابع الفحص من قائمة العمل إلى التصوير ثم إعداد التقرير ومراجعته واعتماده.',
      en: 'Track each examination from the worklist through imaging, report preparation, review and approval.',
    },
    items: {
      ar: ['قوائم عمل مرتبة حسب الحالة والأولوية', 'متابعة مهام الأجهزة والفحوصات', 'قوالب تقارير ومراجعة واعتماد'],
      en: ['Worklists organized by status and priority', 'Modality and examination task tracking', 'Structured reports, review and approval'],
    },
  },
  {
    category: 'clinical',
    icon: FileText,
    title: { ar: 'الصور الطبية وأرشيف PACS', en: 'Medical imaging & PACS archive' },
    description: {
      ar: 'اربط الدراسات بسجل المريض والفحص، وادعم مراجعتها ومطابقتها ضمن إجراءات المركز.',
      en: 'Link studies to patient and examination records, and support review and reconciliation within center workflows.',
    },
    items: {
      ar: ['عرض ومراجعة دراسات الصور الطبية', 'مطابقة دراسات DICOM مع الفحوصات المجدولة', 'إظهار حالات التعارض أو نقص بيانات المطابقة'],
      en: ['View and review imaging studies', 'Reconcile DICOM studies with scheduled exams', 'Identify conflicts and missing matching details'],
    },
  },
  {
    category: 'clinical',
    icon: Sparkles,
    title: { ar: 'مساندة الذكاء الاصطناعي لفرز الأشعة', en: 'Radiology AI assistance & triage' },
    description: {
      ar: 'أدوات مساندة لفرز دراسات الصدر (CXR) وإعداد مسودات ضمن سير عمل الأشعة. تقتصر على صور صدر البالغين؛ يبقى القرار السريري للطبيب المختص.',
      en: 'Assistance tools for chest X-ray (CXR) triage and report drafting within the radiology workflow. Limited to adult chest radiographs; the clinician retains all clinical decisions.',
    },
    items: {
      ar: ['فرز وتصنيف أولوية دراسات صدر البالغين ضمن قائمة العمل', 'مسودات تقارير مبنية على نتائج النموذج لمراجعة الطبيب المختص', 'متابعة حالة المهام وإمكانية إعادة المحاولة'],
      en: ['Chest X-ray case triage and priority flagging within the worklist', 'Model-based report drafts for qualified radiologist review and approval', 'Job status tracking and retry controls'],
    },
  },
  {
    category: 'operations',
    icon: CreditCard,
    title: { ar: 'الفوترة والمالية والتأمين', en: 'Billing, finance & insurance' },
    description: {
      ar: 'تابع الجانب المالي المرتبط بالخدمة الطبية، من الفاتورة والتحصيل إلى التسويات والمطالبات.',
      en: 'Manage the financial activity connected to care, from invoices and collections to reconciliation and claims.',
    },
    items: {
      ar: ['الفواتير والمدفوعات وإغلاق وردية الخزينة', 'المطالبات والموافقات التأمينية', 'المصروفات والمستحقات والتقارير المالية'],
      en: ['Invoices, payments and cashier shift closeout', 'Insurance claims and approvals', 'Expenses, receivables and financial reports'],
    },
  },
  {
    category: 'operations',
    icon: Users,
    title: { ar: 'الموارد البشرية والورديات', en: 'People, shifts & attendance' },
    description: {
      ar: 'نسّق جداول الفريق وسجلات الدوام والإجازات والرواتب وفق الورديات والصلاحيات.',
      en: 'Coordinate team schedules, attendance, leave and payroll around shifts and permissions.',
    },
    items: {
      ar: ['جداول الورديات وطلبات التبديل والتعديل', 'حضور وانصراف مع متابعة التأخير والإضافي', 'الإجازات والأذونات والرواتب والإنتاجية'],
      en: ['Shift schedules and swap or change requests', 'Attendance with late and overtime tracking', 'Leave, permissions, payroll and productivity'],
    },
  },
  {
    category: 'access',
    icon: Users,
    title: { ar: 'بوابات المرضى والأطباء المحيلين', en: 'Patient & referring physician portals' },
    description: {
      ar: 'وفّر قنوات رقمية تتيح للمريض والطبيب المحيل الوصول إلى الخدمات والمعلومات المصرح بها.',
      en: 'Give patients and referring physicians digital access to services and information they are authorized to view.',
    },
    items: {
      ar: ['بوابة للمريض وبوابة للطبيب المحيل', 'متابعة المواعيد والفحوصات والتقارير', 'التحقق من صحة التقارير عبر رمز QR'],
      en: ['Separate patient and referring-physician portals', 'Appointment, examination and report access', 'QR-based report verification'],
    },
  },
  {
    category: 'access',
    icon: MessageSquare,
    title: { ar: 'التواصل والإشعارات', en: 'Communication & notifications' },
    description: {
      ar: 'اجمع قنوات تواصل الفريق ومراسلات المرضى والأطباء المحيلين في واجهات مخصصة حسب الدور.',
      en: 'Bring team channels and patient and referring-physician messages into role-appropriate workspaces.',
    },
    items: {
      ar: ['محادثات فردية وقنوات داخلية للفريق', 'رسائل مع المرضى والأطباء المحيلين', 'مركز إشعارات قابل للمتابعة حسب النوع والأولوية'],
      en: ['Staff direct messages and internal channels', 'Messaging with patients and referring physicians', 'Notifications organized by category and priority'],
    },
  },
  {
    category: 'clinical',
    icon: ClipboardCheck,
    title: { ar: 'التمريض وسلامة الفحوصات', en: 'Nursing & examination safety' },
    description: {
      ar: 'جهّز الحالات وتابع إجراءات السلامة ومراحل الفحص قبل انتقاله إلى جهاز التصوير.',
      en: 'Prepare cases and follow safety checks and examination stages before imaging begins.',
    },
    items: {
      ar: ['قائمة تجهيز ومراجعة السلامة', 'متابعة الحالات المسندة والمرحلة الحالية', 'ترتيب المهام ومتابعة زمن المرحلة'],
      en: ['Preparation and safety-check worklists', 'Assigned cases and current-stage tracking', 'Prioritized tasks and stage-time monitoring'],
    },
  },
  {
    category: 'access',
    icon: Bell,
    title: { ar: 'شاشات الانتظار ونداء المرضى', en: 'Waiting-room display & patient calling' },
    description: {
      ar: 'أدر شاشة عرض خارجية للحالات والنداء، مع تحكم في الإعلانات وبعض إعدادات الخصوصية.',
      en: 'Manage an external display for queue status and patient calls, with controls for announcements and selected privacy settings.',
    },
    items: {
      ar: ['عرض الحالات والنداء إلى الغرفة', 'إدارة الإعلانات المعروضة', 'التحكم في إظهار أسماء المرضى'],
      en: ['Queue status and room-call display', 'Announcement management', 'Control over patient-name visibility'],
    },
  },
  {
    category: 'operations',
    icon: Package,
    title: { ar: 'الموارد والتشغيل اليومي', en: 'Resources & daily operations' },
    description: {
      ar: 'تابع موارد المركز ومهامه التشغيلية من مكان واحد، مع أدوات للإدارة والمتابعة.',
      en: 'Track center resources and operational work in one place, with tools for management and follow-up.',
    },
    items: {
      ar: ['الأجهزة والغرف ومحطات العمل والصيانة', 'الأصناف والمخزون وأوامر الشراء', 'حركات المخزون والتنبيهات ومستلزمات الفحوصات'],
      en: ['Equipment, rooms, workstations and maintenance', 'Catalog, inventory and purchase orders', 'Stock movements, alerts and examination supplies'],
    },
  },
  {
    category: 'operations',
    icon: ChartNoAxesColumnIncreasing,
    title: { ar: 'التسويق وعلاقات المرضى', en: 'Marketing & patient relationships' },
    description: {
      ar: 'نظّم أنشطة التواصل والمتابعة، واحتفظ برؤية أوضح للإحالات وملاحظات المرضى.',
      en: 'Organize outreach and follow-up activities, with clearer visibility into referrals and patient feedback.',
    },
    items: {
      ar: ['الحملات والمهام التسويقية', 'ملاحظات وتجارب المرضى', 'متابعة الأطباء المحيلين ومؤشرات الإحالات'],
      en: ['Campaigns and marketing tasks', 'Patient feedback', 'Referring physicians and referral analytics'],
    },
  },
  {
    category: 'operations',
    icon: ClipboardCheck,
    title: { ar: 'الطلبات ومسارات الموافقات', en: 'Requests & approval workflows' },
    description: {
      ar: 'اجمع الطلبات التي تتطلب مراجعة واعتمادًا، مع إظهار الحالة والقرار للجهات المعنية.',
      en: 'Bring requests that need review and approval into a shared workflow, with status and decisions visible to the relevant teams.',
    },
    items: {
      ar: ['طلبات الإجازات وأذونات الحضور', 'مراجعة الرواتب والعمولات', 'موافقات التأمين والاسترداد المالي'],
      en: ['Leave and attendance-permission requests', 'Payroll and commission review', 'Insurance approvals and refunds'],
    },
  },
  {
    category: 'insights',
    icon: Activity,
    title: { ar: 'مؤشرات الأداء والتحليلات', en: 'Performance indicators & analytics' },
    description: {
      ar: 'حوّل بيانات التشغيل إلى تقارير تساعد الإدارة على متابعة حجم العمل والأداء.',
      en: 'Turn operational data into reports that help management monitor workload and performance.',
    },
    items: {
      ar: ['أحجام الفحوصات والإيرادات', 'أداء الأجهزة وساعات الذروة', 'الإجراءات ومؤشرات الأداء السريري'],
      en: ['Examination volumes and revenue', 'Modality performance and peak hours', 'Procedures and clinical performance indicators'],
    },
  },
  {
    category: 'insights',
    icon: ShieldCheck,
    title: { ar: 'إدارة المستخدمين والتدقيق', en: 'User access & audit' },
    description: {
      ar: 'نظّم وصول الفرق إلى بيانات النظام وراجع الأنشطة والقرارات وفق الصلاحيات.',
      en: 'Govern team access to system data and review activity and decisions according to permissions.',
    },
    items: {
      ar: ['إدارة حسابات المستخدمين والأدوار', 'سجل تدقيق لنشاط المستخدمين', 'صلاحيات حسب الدور ومسارات للموافقات'],
      en: ['User accounts and role management', 'Audit trail for user activity', 'Role-based access and approval workflows'],
    },
  },
];

const categories = [
  { id: 'clinical', icon: HeartPulse, title: { ar: 'الرعاية والتشخيص', en: 'Care & diagnostics' }, description: { ar: 'تنسيق الفحص من الاستقبال إلى التقرير.', en: 'Coordinate the exam from reception to report.' } },
  { id: 'access', icon: Users, title: { ar: 'الوصول والتواصل', en: 'Access & communication' }, description: { ar: 'قنوات واضحة للمرضى والفرق.', en: 'Clear channels for patients and teams.' } },
  { id: 'operations', icon: Package, title: { ar: 'تشغيل وإدارة المركز', en: 'Center operations' }, description: { ar: 'موارد ومالية وفريق عمل ضمن منظومة واحدة.', en: 'Resources, finance and teams in one system.' } },
  { id: 'insights', icon: ChartNoAxesColumnIncreasing, title: { ar: 'التحليلات والحوكمة', en: 'Insights & governance' }, description: { ar: 'متابعة الأداء وإدارة الصلاحيات والتدقيق.', en: 'Monitor performance, access and audit.' } },
];

export default function CareCapabilities({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const [activeCategory, setActiveCategory] = useState('clinical');
  const activeItems = capabilities.filter(item => item.category === activeCategory);
  const selectedCategory = categories.find(category => category.id === activeCategory) || categories[0];

  return <section className="vp-capabilities" id="capabilities" aria-labelledby="vp-capabilities-title">
    <div className="care-wrap">
      <div className="vp-capabilities-heading">
        <div className="vp-capabilities-title">
          <span className="vp-kicker">{t('إمكانات تغطي يوم العمل', 'CAPABILITIES FOR EVERY WORKDAY')}</span>
          <h2 id="vp-capabilities-title">
            {t('كل خطوة أوضح.', 'Clarity in every step.')}<br />
            <span>{t('كل فريق في مساره.', 'Every team in sync.')}</span>
          </h2>
        </div>
        <div className="vp-capabilities-intro">
          <span>{t('مصممة حول سير العمل اليومي', 'DESIGNED AROUND THE WORKDAY')}</span>
          <p>{t('من استقبال المراجع إلى متابعة الأداء، تساعد أدوات VIARA الفرق على تنسيق العمل والاطلاع على ما يخص مهامها.', 'From patient reception to performance review, VIARA helps teams coordinate work and see what matters to their role.')}</p>
        </div>
      </div>
      <div className="vp-capabilities-layout">
        <nav className="vp-capability-categories" aria-label={t('مجالات الإمكانات', 'Capability categories')}>
          {categories.map(({ id, icon: Icon, title, description }) => {
            const selected = activeCategory === id;
            return <button key={id} type="button" aria-pressed={selected} onClick={() => setActiveCategory(id)}>
              <span className="vp-capability-category-icon"><Icon size={19} strokeWidth={1.8} /></span>
              <span className="vp-capability-category-copy">
                <strong>{en ? title.en : title.ar}</strong>
                <small>{en ? description.en : description.ar}</small>
              </span>
              <bdi>0{categories.findIndex(category => category.id === id) + 1}</bdi>
            </button>;
          })}
        </nav>
        <div className="vp-capability-detail" aria-live="polite">
          <div className="vp-capability-detail-heading">
            <div>
              <span>{t('مجال الإمكانات', 'CAPABILITY AREA')}</span>
              <h3>{en ? selectedCategory.title.en : selectedCategory.title.ar}</h3>
            </div>
            <bdi>{String(activeItems.length).padStart(2, '0')} {t('إمكانات', 'CAPABILITIES')}</bdi>
          </div>
          <div className="vp-capabilities-grid">
            {activeItems.map(({ icon: Icon, title, description, items }, index) => (
              <article className="vp-capability-card" key={title.en}>
                <div className="vp-capability-card-top">
                  <span className="vp-capability-icon"><Icon size={20} strokeWidth={1.8} /></span>
                  <bdi>0{index + 1}</bdi>
                </div>
                <h4>{en ? title.en : title.ar}</h4>
                <p>{en ? description.en : description.ar}</p>
                <ul>
                  {(en ? items.en : items.ar).map(item => <li key={item}><span aria-hidden="true" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
      <p className="vp-capabilities-note">{t('تُحدّث قوائم المحادثات والإشعارات دوريًا، وتتحدد إتاحة الوحدات بحسب الدور والصلاحيات ونطاق تهيئة المنشأة.', 'Conversation lists and notifications refresh periodically; module availability depends on role, permissions and facility configuration.')}</p>
    </div>
  </section>;
}
