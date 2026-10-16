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
  PORTAL: [['الحجز والتسجيل','Booking & registration'],['تنظيم المواعيد','Appointment management'],['الوصول إلى النتائج','Results access'],['التواصل والمتابعة','Communication & follow-up']],
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
  PORTAL: ['تجربة أقرب للمريض، قبل الزيارة وبعدها.', 'Closer to patients, before and after the visit.'],
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

const defaultStandards: string[] = ['HL7 FHIR v4', 'ISO 27001', 'HIPAA Ready', 'Audit Trail', 'Web API'];

const standardsBySystem: Record<string, string[]> = {
  PACS: ['DICOM 3.0', 'HL7 FHIR v4', 'IHE XDS-I', 'WADO-RS API', 'ISO 27001'],
  RIS: ['DICOM MWL', 'MPPS', 'HL7 ADT/ORM', 'IHE BIR', 'Voice AI'],
  HIS: ['HL7 v2.5 / FHIR', 'ICD-10-AM', 'CPT-4', 'JCI Compliant', 'NPHIES Ready'],
  EHR: ['HL7 FHIR R4', 'SNOMED-CT', 'RxNorm', 'CDA / CCD', 'ISO 13606'],
  CMS: ['Saudi EHR Standards', 'NPHIES Outpatient', 'Wasfaty E-Rx', 'ICD-10-CM'],
  LIS: ['LOINC Coding', 'ASTM E1381 / E1394', 'HL7 LRI', 'ISO 15189', 'CAP Ready'],
  RCM: ['NPHIES Certified v1.3', 'CCHI Standards', 'SBS Coding', 'Waseel Direct', 'PCI-DSS'],
  TELE: ['WebRTC AES-256', 'HL7 Telehealth', 'Saudi MOH Standards', 'HIPAA Ready'],
  AI: ['CE-MDR / FDA SaMD Guidance', 'DICOM SR', 'HL7 FHIR AI Triage'],
  OR: ['WHO Safety Checklist', 'HL7 Scheduling SIU', 'Telemetry Integration'],
  BI: ['FHIR Analytics', 'OMOP Data Model', 'Realtime ETL', 'HIPAA De-ID'],
};

const defaultOutcomes: SystemOutcome[] = [
  { metric: '-40%', label: L('تسريع زمن إنجاز المعاملات', 'Workflow Turnaround Time'), detail: L('أتمتة المراحل وتقليل الانتظار اليدوي بين الفرق', 'Automating steps and reducing manual wait across roles') },
  { metric: '99.9%', label: L('موثوقية التشغيل وحفظ البيانات', 'Operational Reliability & Uptime'), detail: L('أرشفة سحابية وهجينة مع نسخ احتياطي فوري واستمرارية عمل', 'Hybrid cloud archiving with continuous backup and continuity') },
  { metric: '100%', label: L('تكامل سلس مع الأنظمة والبروتوكولات', 'Interoperability Compliance'), detail: L('ربط مباشر مع معايير الرعاية الصحية المعتمدة محلياً وعالمياً', 'Seamless interfacing with global and national healthcare standards') },
];

const outcomesBySystem: Record<string, SystemOutcome[]> = {
  PACS: [
    { metric: '+65%', label: L('سرعة كتابة التقارير للأطباء', 'Radiologist Reporting Speed'), detail: L('تحميل فوري للدراسات الكبيرة ودعم عارض الويب ثلاثي الأبعاد 3D', 'Instant 3D Web review and zero-latency study streaming') },
    { metric: '< 0.8s', label: L('زمن فتح فحوصات الرنين والمفراس', 'High-Res Study Load Time'), detail: L('بث ذكي للشرائح من الأرشيف دون انتظار اكتمال التنزيل', 'Dynamic streaming without waiting for entire volume download') },
    { metric: '99.999%', label: L('موثوقية حفظ وأرشفة الصور الطبية', 'Archive Durability & Security'), detail: L('أرشفة طبية مشفرة متعددة النطاقات متوافقة مع متطلبات HIPAA', 'Encrypted multi-region archiving compliant with healthcare regulations') },
  ],
  HIS: [
    { metric: '-38%', label: L('تقليص زمن دوران السرير', 'Bed Turnover Time Reduction'), detail: L('إشعار فوري لفرق النظافة والتمريض فور خروج المريض لاستقبال حالة جديدة', 'Instant notification to housekeeping and nursing upon discharge') },
    { metric: '100%', label: L('تتبع الأدوية ومنع الأخطاء الطبية', 'Medication Administration Accuracy'), detail: L('مسح الباركود للأساور والأدوية عند سرير المريض (eMAR)', 'Bedside barcode verification matching patient wristband to prescription') },
    { metric: '+45%', label: L('كفاءة التنسيق بين الأجنحة والأقسام', 'Cross-Ward Coordination Efficiency'), detail: L('لوحة قيادة مركزية توضح حالة كل مريض وفحوصاته المعلقة وجاهزية الجراحة', 'Live census dashboard showing patient status, pending orders and OR readiness') },
  ],
  LIS: [
    { metric: '99.4%', label: L('نسبة التحقق والاعتماد الآلي للنتائج', 'Routine Auto-Validation Rate'), detail: L('فحص تلقائي لقواعد Delta Checks والمطابقة المخبرية الفورية', 'Automated delta-check rules and instant reference range validation') },
    { metric: '12 دقيقة', label: L('متوسط زمن نتائج طوارئ العينات الحرجة', 'STAT Emergency Turnaround Time'), detail: L('تنبيه فوري للأطباء عبر الرسائل والملف السريري للقيم الحرجة', 'Immediate SMS and EMR push notifications for critical panic values') },
    { metric: '0%', label: L('نسبة الخطأ في هوية العينات المخبرية', 'Specimen Identification Errors'), detail: L('تتبع باركود محكم من نقطة السحب حتى جهاز التحليل والأرشفة', 'Rigorous barcode chain of custody from phlebotomy to analyzer') },
  ],
  RCM: [
    { metric: '98.9%', label: L('قبول المطالبات من الإرسال الأول', 'First-Pass Clean Claim Rate'), detail: L('فلترة ذكية وكشف أخطاء الترميز والموافقات قبل الرفع التأميني', 'Pre-submission rule engine catching coding discrepancies') },
    { metric: '< 2.1s', label: L('التحقق اللحظي من أهلية التأمين', 'Instant Eligibility Verification'), detail: L('ربط مباشر وفوري مع منصة نفيس وشبكات التأمين الطبي المعتمدة', 'Direct bidirectional gateway with NPHIES and insurance payers') },
    { metric: '-40%', label: L('تقليص مدة دورة التحصيل النقدي', 'Days in Accounts Receivable (A/R)'), detail: L('تسريع الموافقات الطبية الإلكترونية وأتمتة المطالبات والتسويات', 'Accelerated prior authorizations and automated digital reconciliation') },
  ],
  CMS: [
    { metric: '-45%', label: L('تقليص أوقات انتظار المراجعين', 'Patient Waiting Time Reduction'), detail: L('جدولة ذكية للمواعيد وحجز ذاتي ينظم التدفق بالعيادات بسلاسة', 'Optimized appointment slots and self-check-in queuing') },
    { metric: '100%', label: L('إصدار الوصفات الطبية الإلكترونية', 'Electronic Prescribing Rate'), detail: L('ربط مباشر مع منصات الوصفات المعتمدة وتنبيه التفاعلات الدوائية', 'Direct integration with e-prescription networks and safety checks') },
    { metric: 'لحظي', label: L('مزامنة الفروع والملف الموحد للمريض', 'Real-time Multi-Branch Sync'), detail: L('سجل طبي موحد يتيح بيانات المريض عند زيارة أي فرع من الفروع', 'Unified health record accessible across all clinic locations') },
  ],
  EHR: [
    { metric: '-50%', label: L('وقت التوثيق السريري للطبيب', 'Physician Charting Time Saved'), detail: L('قوالب تخصصية ذكية وإملاء صوتي طبي سريع', 'Specialty-focused SOAP templates with medical voice dictation') },
    { metric: '100%', label: L('كشف التداخلات الدوائية والحساسيات', 'Drug-Allergy Interaction Detection'), detail: L('تنبيه فوري للطبيب قبل اعتماد الوصفة عند وجود تعارض مع حساسية مسجلة', 'Instant clinical decision alert triggered before order sign-off') },
    { metric: '+30%', label: L('الالتزام بالإرشادات السريرية المعتمدة', 'Clinical Guideline Adherence'), detail: L('حزم أوامر علاجية قياسية لكل حالة تشخيصية لضمان جودة الرعاية', 'Evidence-based standard order sets tailored to diagnoses') },
  ],
  TELE: [
    { metric: '+70%', label: L('توسع نطاق وصول خدمات المنشأة', 'Geographic Patient Reach'), detail: L('تقديم الرعاية والاستشارات التخصصية للمرضى في أي مكان عبر الفيديو', 'Delivering consultations to patients regardless of geography') },
    { metric: '< 3 دقائق', label: L('زمن بدء الاستشارة المرئية من الحجز', 'Consultation Connect Time'), detail: L('غرفة استشارة مباشرة مشفرة تعمل من المتصفح دون تعقيد التنزيل', 'Zero-install browser-based HD WebRTC encrypted video clinic') },
    { metric: '96.5%', label: L('نسبة رضا المرضى عن التجربة الرقمية', 'Patient Satisfaction Score'), detail: L('تطبيق متكامل للتقارير والأشعة والوصفات والدفع الإلكتروني السريع', 'Convenient mobile app for imaging, results, and digital payments') },
  ],
  AI: [
    { metric: '98.7%', label: L('دقة كشف الحالات الحرجة والمستعجلة', 'STAT Emergency Triage Accuracy'), detail: L('فرز تلقائي لنزيف المخ واسترواح الصدر والكسور العاجلة لتقديمها في قائمة العمل', 'Automated flagging of ICH, pneumothorax, and urgent fractures') },
    { metric: '-60%', label: L('زمن صياغة التقرير الإشعاعي الأولي', 'Draft Report Generation Time'), detail: L('اقتراح الصياغة الطبية وتعبئة القياسات التلقائية لدعم اختصاصي الأشعة', 'Automated measurement ingestion and structured text drafting') },
    { metric: '100%', label: L('تحت إشراف واعتماد الطبيب البشري', 'Physician Oversight & Control'), detail: L('أداة دعم قرار سريري تعزز ثقة الطبيب وسرعته دون استبدال حكمه المهني', 'Decision support tool designed to empower physician judgment') },
  ],
};

export function systemStory(id: string) {
  const canonical = id === 'EMR' ? 'EHR' : id;
  const system = healthcareSystems.find(s => s.id === canonical);
  const category = system?.category || 'digital';
  const steps = workflows[canonical] || workflows.INTEROP;
  const image = systemImage(canonical, category);
  const standards = standardsBySystem[canonical] || defaultStandards;
  const outcomes = outcomesBySystem[canonical] || defaultOutcomes;

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
