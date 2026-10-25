import { L, type Localized } from './site-content';
import { healthcareSystems } from './healthcare-catalog.mjs';

// Editorial workflow concepts, not a declaration of implemented integrations.
const workflows: Record<string, [string, string][]> = {
  HIS: [['القبول وتخصيص الأسرّة','Admission & bed allocation'],['تنسيق الأقسام والرعاية','Department & care coordination'],['متابعة الإقامة والخدمات','Stay & service tracking'],['تخطيط الخروج والمتابعة','Discharge & follow-up']],
  EHR: [['التاريخ الطبي والزيارات','History & encounters'],['الملاحظات السريرية','Clinical documentation'],['الأوامر وخطة الرعاية','Orders & care planning'],['المراجعة والمتابعة','Review & follow-up']],
  CMS: [['المواعيد والاستقبال','Appointments & reception'],['تنظيم زيارة العيادة','Clinic encounter'],['الفواتير والتحصيل','Billing & collection'],['متابعة الفروع','Branch oversight']],
  DENTAL: [['ملف الأسنان والتقييم','Dental chart & assessment'],['خطة العلاج والمراحل','Treatment plan & stages'],['جدولة الجلسات','Session scheduling'],['المراجعة والمتابعة','Recall & follow-up']],
  REHAB: [['التقييم الوظيفي الأولي','Initial functional assessment'],['خطة التأهيل','Rehabilitation plan'],['تنظيم الجلسات','Therapy scheduling'],['توثيق التقدم','Progress documentation']],
  NURSING: [['توزيع فرق الرعاية','Care team allocation'],['قائمة المهام التمريضية','Nursing task lists'],['توثيق إجراءات الرعاية','Care documentation'],['تسليم الورديات','Shift handover']],
  OR: [['تخطيط قوائم العمليات','Surgical list planning'],['جدولة الفرق والموارد','Team & resource scheduling'],['توثيق الإجراء والرعاية','Procedure & care documentation'],['متابعة ما بعد العملية','Post-operative follow-up']],
  RIS: [['الحجز وتجهيز الطلب','Booking & order preparation'],['قوائم عمل الأجهزة','Modality worklists'],['التقارير والمراجعة','Reporting & review'],['التسليم والحسابات','Delivery & billing']],
  PACS: [['استقبال الدراسات','Study ingestion'],['تنظيم الأرشيف','Archive organization'],['مراجعة الصور الطبية','Image review'],['الصلاحيات والمشاركة','Access & sharing']],
  LIS: [['تسجيل الطلب والباركود','Order & barcode registration'],['تتبع رحلة العينة','Specimen tracking'],['مراجعة النتائج','Result validation'],['إتاحة التقرير','Report delivery']],
  PATH: [['استلام العينات','Specimen reception'],['تجهيز الشرائح وتتبعها','Slide preparation & tracking'],['توثيق الفحص','Examination documentation'],['مراجعة التقرير','Report review']],
  BLOOD: [['تسجيل التبرع','Donation registration'],['الفحوصات والتصنيف','Testing & classification'],['تتبع الوحدات والمخزون','Unit & stock tracking'],['الصرف والتوثيق','Issue & documentation']],
  PHARM: [['استلام الوصفة','Prescription reception'],['مراجعة طلب الصرف','Dispensing review'],['المخزون والصلاحية','Stock & expiry tracking'],['المشتريات والتوريد','Procurement & supply']],
  RCM: [['بيانات التغطية والأهلية','Coverage & eligibility'],['الموافقات الطبية','Prior authorizations'],['تجهيز المطالبات','Claim preparation'],['التسويات والتحصيل','Reconciliation & collection']],
  ERP: [['طلبات الأقسام','Department requisitions'],['المشتريات والموردون','Procurement & suppliers'],['المخزون والاستلام','Stock & receiving'],['الحسابات والتقارير','Accounts & reporting']],
  HR: [['ملفات فريق العمل','Workforce profiles'],['الأدوار والجداول','Roles & schedules'],['الحضور والإجازات','Attendance & leave'],['مراجعة التغطية','Coverage review']],
  ASSET: [['سجل الأجهزة والأصول','Equipment register'],['خطط الصيانة','Maintenance planning'],['طلبات الإصلاح','Repair requests'],['متابعة التوقفات','Downtime tracking']],
  BI: [['تعريف المؤشرات','Metric definitions'],['تحديد مصادر البيانات','Data source mapping'],['استعراض المؤشرات','Indicator exploration'],['مراجعة الاتجاهات','Trend review']],
  PORTAL: [['بوابة المريض وحجز المواعيد','Patient portal & booking'],['بوابة الأطباء المحيلين','Referring doctor portal'],['الوصول إلى التقارير والصور','Results & images access'],['التحقق والتواصل والمتابعة','Verification & clinical follow-up']],
  TELE: [['حجز الموعد الافتراضي','Virtual appointment booking'],['الاستعداد للاستشارة','Consultation preparation'],['توثيق الزيارة','Encounter documentation'],['خطة المتابعة','Follow-up planning']],
  HOME: [['طلب الزيارة المنزلية','Home visit request'],['جدولة الفريق والمسار','Team & route scheduling'],['توثيق الزيارة','Visit documentation'],['متابعة خطة الرعاية','Care plan follow-up']],
  REFERRAL: [['تسجيل الإحالة','Referral registration'],['تحديد الجهة المستقبلة','Receiving facility selection'],['متابعة الاستجابة','Response tracking'],['إغلاق حلقة المتابعة','Follow-up closure']],
  INTEROP: [['حصر الأنظمة القائمة','Existing system mapping'],['تحديد واجهات الربط','Interface scoping'],['اختبار تبادل البيانات','Data exchange testing'],['مراقبة التشغيل','Operational monitoring']],
  AI: [['تحديد حالة الاستخدام','Use case definition'],['مراجعة البيانات والمدخلات','Input & data review'],['مراجعة المخرجات','Output review'],['اعتماد المختص','Specialist sign-off']],
};

const contexts = [
  L('وضوح من نقطة البداية: نظّم المدخلات والمتطلبات التي يحتاجها الفريق قبل بدء العمل.', 'Start with clarity: organize the information and requirements your team needs before work begins.'),
  L('خطوة أقرب للفريق: حدد المسؤوليات والموارد المطلوبة ومسار انتقال العمل بين الأدوار.', 'Bring teams closer: define ownership, required resources and how work moves between roles.'),
  L('تفاصيل أسهل للمراجعة: اجمع الملاحظات والمستندات وحالة العمل في سياق مفهوم.', 'Make review easier: bring notes, documents and work status into a clear context.'),
  L('متابعة أوضح: راجع المخرجات والخطوات التالية وفق الصلاحيات والإجراءات المتفق عليها.', 'Keep follow-up clear: review outcomes and next steps within agreed access and operating procedures.'),
];

const signatures: Record<string, [string, string]> = {
  HIS: ['من أول استقبال، إلى رعاية أكثر ترابطاً.', 'From the first admission to more connected care.'],
  EHR: ['تاريخ المريض، في سياق يفهمه الفريق.', 'Patient history, in a context your team can follow.'],
  CMS: ['موعد منظم. زيارة أوضح. متابعة أقرب.', 'Organized appointments. Clearer visits. Closer follow-up.'],
  DENTAL: ['خطة العلاج تبدأ بصورة أوضح.', 'A clearer picture for every treatment plan.'],
  REHAB: ['خطوات صغيرة، وتقدم يستحق المتابعة.', 'Small steps. Progress worth following.'],
  NURSING: ['كل وردية تعرف من أين تبدأ.', 'Every shift knows where to start.'],
  OR: ['تنسيق يسبق كل خطوة في الرعاية.', 'Coordination ahead of every step in care.'],
  RIS: ['من الحجز إلى التقرير، رحلة أوضح.', 'A clearer journey from booking to reporting.'],
  PACS: ['صور طبية مترابطة. مراجعة في سياقها.', 'Connected imaging. Reviews with context.'],
  LIS: ['لكل عينة رحلة. ولكل نتيجة سياق.', 'Every specimen has a journey. Every result has context.'],
  PATH: ['من العينة إلى التقرير، التفاصيل تصنع الفرق.', 'From specimen to report, the details matter.'],
  BLOOD: ['تتبع أوضح، من التبرع إلى الصرف.', 'Clearer traceability, from donation to issue.'],
  PHARM: ['الدواء والمخزون في صورة أكثر وضوحاً.', 'A clearer view of medication and inventory.'],
  RCM: ['من التغطية إلى التحصيل، رؤية أوضح.', 'A clearer view from coverage to collection.'],
  ERP: ['احتياجات الأقسام تلتقي بخطة الموارد.', 'Department needs meet resource planning.'],
  HR: ['فرق تعرف دورها. وجداول ترى الصورة.', 'Teams know their roles. Schedules show the picture.'],
  ASSET: ['اعرف أصولك. وخطط لخطوتها القادمة.', 'Know your assets. Plan their next step.'],
  BI: ['ابدأ بالسؤال. وافهم المؤشر.', 'Start with a question. Understand the indicator.'],
  PORTAL: ['تجربة رقمية متكاملة للمريض والأطباء المحيلين، قبل الزيارة وبعدها.', 'A connected digital experience for patients and referring physicians, before and after the visit.'],
  TELE: ['المسافة تتغير. والاهتمام يبقى.', 'Distance changes. Attention remains.'],
  HOME: ['الرعاية تصل إلى حيث يحتاجها الإنسان.', 'Care reaches people where they need it.'],
  REFERRAL: ['إحالة واضحة. ورحلة رعاية متصلة.', 'Clear referrals. A connected care journey.'],
  INTEROP: ['أنظمة متعددة. ومسار مفهوم للبيانات.', 'Multiple systems. A clear path for information.'],
  AI: ['مساندة مدروسة، والقرار للمختص.', 'Considered assistance. Specialist judgment.'],
};

export function systemImage(id: string, category: string): string {
  const canonical = id === 'EMR' ? 'EHR' : id;
  if (['PACS', 'RIS', 'AI'].includes(canonical)) return '/assets/scenes/diagnostic-pacs.jpg';
  if (['HIS', 'OR', 'NURSING', 'REHAB'].includes(canonical)) return '/assets/scenes/hospital-inpatient.jpg';
  if (['LIS', 'PATH', 'BLOOD'].includes(canonical)) return '/assets/scenes/arab-diagnostics.webp';
  if (['CMS', 'EHR', 'DENTAL', 'HOME'].includes(canonical)) return '/assets/scenes/arab-care-team.webp';
  if (['RCM', 'ERP', 'BI', 'ASSET', 'INTEROP', 'TELE', 'REFERRAL', 'PORTAL', 'HR'].includes(canonical)) return '/assets/scenes/healthcare-command.jpg';
  return category === 'diagnostics' ? '/assets/scenes/diagnostic-pacs.jpg' : '/assets/scenes/healthcare-command.jpg';
}

export interface SystemOutcome {
  metric: string;
  label: Localized;
  detail: Localized;
}

export function systemStory(id: string) {
  const canonical = id === 'EMR' ? 'EHR' : id;
  const system = healthcareSystems.find(s => s.id === canonical);
  const category = system?.category || 'digital';
  const steps = workflows[canonical] || workflows.INTEROP;
  const image = systemImage(canonical, category);
  const standards: string[] = [];
  const outcomes: SystemOutcome[] = [];

  return {
    category, image,
    standards, outcomes,
    signature: L(...(signatures[canonical] || signatures.INTEROP)),
    steps: steps.map(([ar, en], i) => ({ title: L(ar, en), description: contexts[i] })),
    audience: category === 'clinical' ? L('للفرق السريرية وإدارات المنشآت', 'For clinical teams and facility leaders') : category === 'diagnostics' ? L('لفرق التشخيص والمختبرات وتقنية المعلومات', 'For diagnostic, laboratory and IT teams') : category === 'operations' ? L('لفرق التشغيل والإدارة والموارد', 'For operations, management and resource teams') : L('لفرق الرعاية الرقمية وتجربة المريض', 'For digital care and patient experience teams'),
    questions: [L('كيف تديرون هذا المسار اليوم، وأين يستهلك الفريق وقتاً أكبر؟', 'How do you manage this workflow today, and where does your team spend the most time?'), L('ما الأدوار والفروع والأنظمة المطلوب تضمينها في النطاق؟', 'Which roles, branches and existing systems should be included?'), L('ما متطلبات الصلاحيات والبيانات والربط والتقارير؟', 'What access, data, integration and reporting requirements do you have?')],
  };
}

export function catalogSolution(id: string) {
  const system = healthcareSystems.find(s => s.id === id);
  if (!system) return undefined;
  const story = systemStory(id);
  return { id, name: system.name as Localized, headline: system.name as Localized, description: system.description as Localized, features: story.steps.map(step => step.title), note: L('مجال لتحديد الاحتياج؛ المزايا والإتاحة والتكاملات تُعتمد في العرض الفني.', 'An area for requirements assessment; features, availability and integrations are confirmed in your technical proposal.'), image: story.image, enabled: true };
}
