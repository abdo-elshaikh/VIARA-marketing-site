import { L, type Locale, type SiteContent, type Localized } from './site-content';
import { healthcareSystems } from './healthcare-catalog.mjs';
import { catalogSolution, systemImage } from './system-stories';

export const solutionSlugs: Record<string, string> = {
  ...Object.fromEntries(healthcareSystems.map(system => [system.id, system.id.toLowerCase()])),
  RIS: 'ris',
  PACS: 'pacs',
  CMS: 'medical-centers',
  HIS: 'his',
  EMR: 'emr',
  LIS: 'lis',
  RCM: 'rcm',
  TELE: 'telehealth',
  AI: 'ai',
};

export const solutionPath = (id: string, locale: Locale) => {
  const slug = solutionSlugs[id] || id.toLowerCase();
  return `${locale === 'en' ? '/en' : ''}/solutions/${slug}`;
};

export interface SolutionData {
  id: string;
  name: Localized;
  headline: Localized;
  description: Localized;
  features: Localized[];
  note: Localized;
  image?: string;
  enabled: boolean;
}

export const additionalSolutions: Record<string, SolutionData> = {
  HIS: {
    id: 'HIS',
    name: L('نظام إدارة المستشفيات (HIS)', 'Hospital Information System (HIS)'),
    headline: L('إدارة متكاملة للأجنحة، الأسرّة، وغرف العمليات.', 'Comprehensive inpatient, bed, and surgical management.'),
    description: L('نظام سحابي متكامل يربط التنويم، الأقسام الداخلية، الجداول الجراحية، التمريض، والخدمات الطبية المساندة في مسار عمل موحد عالي الكفاءة.', 'An enterprise cloud platform unifying admissions, inpatient wards, surgical schedules, nursing handovers, and hospital operations in one cohesive ecosystem.'),
    features: [
      L('إدارة التنويم والأسرّة وحالات الدخول والخروج الفورية', 'Real-time bed management, admissions, and discharge workflows'),
      L('جدولة غرف العمليات (OR) ومتابعة الرعاية المركزة (ICU)', 'Operating room scheduling and critical care (ICU) tracking'),
      L('تنسيق مهام التمريض وتسليم الورديات الإلكتروني', 'Digital nursing task coordination and shift handovers'),
      L('لوحات قيادة مركزية لمتابعة إشغال الأقسام والمؤشرات الحيوية', 'Centralized dashboards for ward occupancy and operational KPIs'),
    ],
    note: L('يتكامل مع أجهزة المراقبة الحيوية والأنظمة السريرية الأخرى.', 'Integrates with patient vital monitors and clinical systems.'),
    image: '/assets/scenes/hospital-inpatient.jpg',
    enabled: true,
  },
  EMR: {
    id: 'EMR',
    name: L('الملف الطبي الإلكتروني (EMR / EHR)', 'Electronic Medical Records (EMR / EHR)'),
    headline: L('سجل سريري ذكي يضع بيانات المريض في متناول الطبيب.', 'Intelligent clinical documentation empowering care teams.'),
    description: L('توثيق سريري فائق السرعة، قوالب تخصصية، أوامر فحص إلكترونية (CPOE)، وتنبيهات ذكية للتداخلات الدوائية والحساسية.', 'High-velocity clinical documentation, specialty templates, electronic orders (CPOE), and automated drug-allergy interaction checks.'),
    features: [
      L('سجل طبي موحد يرافق المريض عبر كافة العيادات والأقسام', 'Unified patient record accessible across all clinics and wards'),
      L('أوامر الفحوصات والأدوية الإلكترونية (CPOE) المباشرة', 'Direct computerized physician order entry (CPOE)'),
      L('تنبيهات فورية للتعارضات الدوائية وموانع الاستعمال', 'Instant drug-drug and drug-allergy clinical decision alerts'),
      L('قوالب فحص ذكية مدعومة بالتعرف الصوتي والاختصارات الطبية', 'Smart specialty clinical notes with voice-to-text dictation'),
    ],
    note: L('متوافق تمامًا مع معايير HL7 FHIR v4 والترميز الطبي ICD-10.', 'Fully compliant with HL7 FHIR v4 standards and ICD-10 coding.'),
    image: '/assets/scenes/hospital-inpatient.jpg',
    enabled: true,
  },
  LIS: {
    id: 'LIS',
    name: L('إدارة المختبرات والتحاليل الطبية (LIS)', 'Laboratory Information System (LIS)'),
    headline: L('أتمتة كاملة لدورة العينة وربط مباشر مع أجهزة التحاليل.', 'Full specimen automation and bidirectional analyzer interfacing.'),
    description: L('من طباعة الباركود وسحب العينة، إلى المعالجة الآلية على أجهزة التحاليل واعتماد النتائج الحرجة فوريًا وبثها لملف المريض.', 'End-to-end specimen journey from barcode generation to bidirectional analyzer processing, instant critical value alerts, and digital reporting.'),
    features: [
      L('ربط ثنائي الاتجاه (Bidirectional) مع أجهزة التحاليل الآلية', 'Bidirectional interface with modern automated clinical analyzers'),
      L('تتبع الباركود وسلسلة حيازة العينة من السحب إلى الأرشفة', 'Barcode tracking and complete sample chain of custody'),
      L('تنبيهات تلقائية للقيم الحرجة (Critical Values Alert STAT)', 'Automated STAT critical value notifications to attending physicians'),
      L('إدارة مراقبة الجودة (QC) وضبط المعايرة المخبرية', 'Integrated Quality Control (QC) and calibration management'),
    ],
    note: L('يدعم بروتوكولات ASTM وHL7 لكافة مصنعي أجهزة التحاليل العالمية.', 'Supports ASTM and HL7 protocols for leading global analyzer manufacturers.'),
    image: '/assets/scenes/healthcare-command.jpg',
    enabled: true,
  },
  RCM: {
    id: 'RCM',
    name: L('إدارة دورة الإيرادات والتأمين (RCM)', 'Revenue Cycle Management & NPHIES (RCM)'),
    headline: L('أتمتة المطالبات التأمينية والتحقق من الأهلية ورفع التحصيل.', 'Automate claims, real-time eligibility, and maximize collections.'),
    description: L('منصة متقدمة للتحقق الفوري من أهلية التأمين، رفع الموافقات الطبية، تدقيق المطالبات قبل الإرسال، وتقليل نسب الرفض إلى أدنى المستويات.', 'Advanced engine for instant insurance eligibility verification, pre-authorization, automated claim scrubbing, and drastic denial reduction.'),
    features: [
      L('ربط مباشر مع منصة نفيس (NPHIES) والشبكات التأمينية المعتمدة', 'Direct integration with NPHIES platform and approved payer networks'),
      L('تحقق آلي من أهلية المريض وسقف التغطية قبل الزيارة', 'Instant real-time patient eligibility and coverage limits verification'),
      L('نظام تدقيق ذكي للمطالبات (Claim Scrubber) لكشف الأخطاء مسبقًا', 'Intelligent claim scrubbing preventing coding errors and denials'),
      L('متابعة التدفقات المالية والمقبوضات والحسابات المتعثرة بدقة', 'Granular accounts receivable (AR) and financial recovery tracking'),
    ],
    note: L('تحديث مستمر لقواعد الفوترة والترميز المعتمد من هيئات التأمين.', 'Continually updated with current regulatory payer rules and coding guides.'),
    image: '/assets/scenes/healthcare-command.jpg',
    enabled: true,
  },
  TELE: {
    id: 'TELE',
    name: L('الرعاية عن بُعد وبوابة المريض (Telehealth)', 'Telehealth & Patient Portal'),
    headline: L('استشارات مرئية وحجز إلكتروني وبوابة متكاملة للمريض.', 'Virtual video consultations, online booking, and patient app.'),
    description: L('منح المريض تجربة رقمية استثنائية لحجز المواعيد، متابعة نتائج الفحوصات والتقارير الطبية، وإجراء استشارات الفيديو المشفرة مع الأطباء.', 'Delight patients with a seamless mobile portal for instant appointment booking, remote lab/radiology results, and encrypted virtual consultations.'),
    features: [
      L('عيادة افتراضية مشفرة بالكامل للاستشارات الطبية المرئية', 'HIPAA-compliant encrypted video consultation rooms for physicians'),
      L('بوابة مريض وتطبيق جوال لعرض التقارير والأشعة والنتائج', 'Branded patient mobile app for reports, imaging access, and records'),
      L('حجز ذاتي ودفع إلكتروني آمن مع تذكيرات عبر واتساب وSMS', 'Self-service scheduling, secure digital payments, and automated reminders'),
      L('إرسال الوصفات الطبية الإلكترونية المباشرة لصيدلية المريض', 'Direct digital e-prescriptions sent straight to pharmacies'),
    ],
    note: L('متوافق مع الهواتف الذكية ومتصفحات الويب دون الحاجة لتثبيت برامج معقدة.', 'Works seamlessly across web and mobile without complex downloads.'),
    image: '/assets/scenes/healthcare-command.jpg',
    enabled: true,
  },
  AI: {
    id: 'AI',
    name: L('ذكاء الرعاية الاصطناعي (VIARA AI)', 'Clinical Artificial Intelligence (VIARA AI)'),
    headline: L('مساعد سريري وتشخيصي فوري يرفع سرعة ودقة القرارات الطبية.', 'Instant diagnostic triage and clinical decision assistance.'),
    description: L('خوارزميات ذكاء اصطناعي سريرية مدربة على تصنيف الفحوصات العاجلة، كشف العلامات الدقيقة في الأشعة، والإملاء الصوتي الطبي الذكي.', 'Clinical AI algorithms trained to triage emergency studies, flag radiological findings, and automate complex medical dictation.'),
    features: [
      L('فرز فوري للحالات الحرجة في الأشعة (ICH, Pneumothorax, Fractures)', 'Automated STAT triage for urgent imaging findings'),
      L('إملاء صوتي طبي ذكي باللغتين العربية والإنجليزية مع فهم المصطلحات', 'Bilingual medical voice dictation with specialized medical terminology'),
      L('دعم القرارات السريرية المتقدم (CDSS) المبني على الأدلة العلمية', 'Evidence-based Clinical Decision Support System (CDSS)'),
      L('تحليلات تنبؤية لمعدلات إعادة التنويم والتدفق اليومي للمرضى', 'Predictive analytics for readmission risks and patient flow'),
    ],
    note: L('أداة دعم ومساندة للأطباء تخضع للمراجعة والاعتماد البشري الكامل.', 'Diagnostic decision support tool subject to physician review and sign-off.'),
    image: '/assets/scenes/diagnostic-pacs.jpg',
    enabled: true,
  },
};

export function findSolution(content: SiteContent, slug: string): SolutionData | undefined {
  if (content.products.some(product => !product.enabled && solutionSlugs[product.id] === slug)) return undefined;
  // Check in content.products first
  const existing = content.products.find(product => product.enabled && solutionSlugs[product.id] === slug);
  if (existing) {
    const defaultImg = systemImage(existing.id, 'diagnostics');
    return {
      id: existing.id,
      name: existing.name,
      headline: existing.headline,
      description: existing.description,
      features: existing.features,
      note: existing.note,
      image: defaultImg,
      enabled: existing.enabled,
    };
  }

  // Check additional solutions
  const matchKey = Object.keys(solutionSlugs).find(key => solutionSlugs[key] === slug);
  if (matchKey && additionalSolutions[matchKey]) {
    return additionalSolutions[matchKey];
  }

  return matchKey ? catalogSolution(matchKey) : undefined;
}

export const solutionGuides: Record<string, {
  audience: Localized;
  steps: Localized[];
  questions: Localized[];
}> = {
  RIS: {
    audience: L('لمديري مراكز الأشعة وفرق الاستقبال والتقارير', 'For radiology managers, reception and reporting teams'),
    steps: [L('حجز الفحص وقوائم العمل', 'Book examination & worklists'), L('توزيع الحالات على أجهزة الأشعة', 'Dispatch to imaging modalities'), L('الإملاء وكتابة التقارير الطبية', 'Dictation & diagnostic reporting'), L('مراجعة الحسابات والتشغيل', 'Billing review & operations')],
    questions: [L('ما أنواع الفحوصات والأجهزة المستخدمة (MRI, CT, X-Ray)؟', 'Which modalities and scanners do you operate?'), L('كيف ينتقل الطلب من الاستقبال إلى الطبيب المراجع؟', 'How do studies move from reception to radiologist?'), L('ما جهات التعاقد والتأمين المعتمدة لمركزكم؟', 'Which payers and billing workflows do you support?')],
  },
  PACS: {
    audience: L('لمراكز الأشعة وفرق تقنية المعلومات والأرشفة', 'For imaging centers, IT and archive teams'),
    steps: [L('استقبال دراسات DICOM من الأجهزة', 'Receive DICOM studies from modalities'), L('تنظيم الأرشيف السحابي فائق الأمان', 'Organize ultra-secure cloud archive'), L('عرض الفحوصات عبر عارض الويب 3D', 'Web 3D diagnostic review & MPR'), L('إدارة الصلاحيات والتوزيع للطبيب والمريض', 'Control access & patient study sharing')],
    questions: [L('ما حجم الدراسات اليومي وحجم الأرشيف التاريخي؟', 'What is your daily study volume and existing archive size?'), L('ما خدمات DICOM المطلوبة (Store, Worklist, Query/Retrieve)؟', 'Which DICOM services does each scanner require?'), L('ما خطة الاحتفاظ والنسخ الاحتياطي المفضلة لديكم؟', 'What retention, backup and hosting strategy do you require?')],
  },
  CMS: {
    audience: L('لمديري المراكز الطبية والعيادات ومجموعات الفروع', 'For medical centers, specialty clinics and branch networks'),
    steps: [L('تنسيق المواعيد والانتظار الذكي', 'Coordinate appointments & queue'), L('تنظيم زيارة العيادة والملف الطبي', 'Organize visit & clinical chart'), L('متابعة الفواتير والتأمين والتحصيل', 'Track billing, insurance & payments'), L('مراجعة مؤشرات أداء الفروع والأطباء', 'Review clinic & doctor performance')],
    questions: [L('ما التخصصات والعيادات والفروع التي تديرها المنشأة؟', 'Which specialties, clinics and branches do you run?'), L('كيف تُنظم ملفات المرضى والحجوزات اليوم؟', 'How are appointments and charts organized today?'), L('ما متطلبات الربط التأميني والفوترة الإلكترونية؟', 'What billing and insurance interfaces do you require?')],
  },
  HIS: {
    audience: L('لإدارات المستشفيات، رؤساء الأقسام، وفرق التمريض والعمليات', 'For hospital executives, department heads, nursing and surgical teams'),
    steps: [L('إدخال المريض وتوزيع الأسرّة (ADT)', 'Patient admission & bed assignment'), L('جدولة غرف العمليات وإدارة العناية المركزة', 'Operating room & ICU coordination'), L('التوثيق التمريضي وتسليم الورديات', 'Nursing documentation & handover'), L('التخريج الآلي وإصدار الفاتورة الموحدة', 'Discharge planning & consolidated billing')],
    questions: [L('ما السعة السريرية الإجمالية وعدد الأجنحة وغرف العمليات؟', 'What is your total bed capacity, wards, and OR count?'), L('كيف يتم التنسيق حاليًا بين التمريض والأطباء والصيدلية؟', 'How do nursing, physicians, and pharmacy coordinate today?'), L('ما الأنظمة المساندة المطلوب الربط معها؟', 'Which auxiliary systems require integration?')],
  },
  EMR: {
    audience: L('للأطباء، الاستشاريين، والكوادر السريرية في المستشفيات والمراكز', 'For physicians, clinical consultants, and healthcare practitioners'),
    steps: [L('فتح الملف الطبي ومراجعة التاريخ المرضي', 'Open clinical chart & review history'), L('تدوين الملاحظات السريرية (SOAP Notes)', 'Record clinical SOAP notes & diagnosis'), L('طلب الفحوصات والأدوية إلكترونيًا (CPOE)', 'Electronic orders for labs & prescriptions'), L('متابعة مسار العلاج والزيارات اللاحقة', 'Track treatment plan & follow-up')],
    questions: [L('ما القوالب السريرية التخصصية التي يحتاجها أطباؤكم؟', 'Which specialty clinical templates do your doctors need?'), L('هل تستخدمون بروتوكولات ترميز محددة (ICD-10 / CPT / ACHI)؟', 'Which coding standard does your facility follow?'), L('ما آلية إدارة الحساسيات والتفاعلات الدوائية الحالية؟', 'How are allergy and drug interactions currently managed?')],
  },
  LIS: {
    audience: L('لمديري المختبرات الطبية، فنيي التحاليل، وأطباء الباثولوجي', 'For laboratory directors, technicians, and clinical pathologists'),
    steps: [L('تسجيل طلب التحليل وطباعة الباركود', 'Order registration & barcode generation'), L('معالجة العينة عبر أجهزة التحاليل الآلية', 'Automated analyzer specimen processing'), L('المراجعة المخبرية واعتماد النتائج', 'Technical validation & sign-off'), L('الإرسال الفوري لملف المريض والطبيب', 'Instant result delivery to EMR & patient')],
    questions: [L('ما أنواع وموديلات أجهزة التحاليل العاملة في المختبر؟', 'Which analyzer brands and models are in your lab?'), L('ما متوسط عدد العينات والفحوصات اليومية؟', 'What is your average daily specimen workload?'), L('هل ترغبون في إتاحة النتائج للمرضى عبر تطبيق وبوابة إلكترونية؟', 'Do you require a patient portal for instant lab results?')],
  },
  RCM: {
    audience: L('لمديري الإيرادات، مسؤولي التأمين الطبي، والمحاسبين الماليين', 'For revenue cycle leaders, insurance officers, and medical billers'),
    steps: [L('التحقق اللحظي من أهلية التأمين', 'Instant real-time eligibility check'), L('تقديم ومتابعة الموافقات الطبية المسبقة', 'Submit & track prior authorizations'), L('تدقيق وتجهيز المطالبات الطبية (Clean Claims)', 'Automated claim scrubbing & batching'), L('متابعة التسويات والتحصيل ومعالجة الرفوضات', 'Reconciliation & denial management')],
    questions: [L('ما شركات وهيئات التأمين الرئيسية التي تتعاملون معها؟', 'Which insurance companies and TPAs do you contract with?'), L('ما هي النسبة الحالية لرفض المطالبات التأمينية في منشأتكم؟', 'What is your current claim rejection rate?'), L('هل تحتاجون لتكامل مباشر مع بوابة نفيس NPHIES؟', 'Do you require automated direct integration with NPHIES?')],
  },
  TELE: {
    audience: L('للعيادات التخصصية، المنشآت الطبية، وفرق الرعاية الرقمية', 'For specialty clinics, medical centers, and digital health teams'),
    steps: [L('حجز الموعد الافتراضي والدفع الإلكتروني', 'Book virtual visit & secure payment'), L('جلسة استشارة مرئية مشفرة عالية الجودة', 'HD encrypted video consultation'), L('إصدار الوصفة الطبية والتقرير فورًا', 'Instant e-prescription & digital report'), L('المتابعة الرقمية المستمرة مع المريض', 'Continuous patient follow-up & chat')],
    questions: [L('ما هي التخصصات المقترح إتاحتها للاستشارات عن بُعد؟', 'Which specialties will offer virtual care?'), L('ما هي بوابات الدفع الإلكتروني المفضلة لمنشأتكم؟', 'Which online payment gateways do you prefer?'), L('هل ترغبون بتطبيق خاص يحمل هوية وشعار منشأتكم؟', 'Do you want a customized mobile app with your branding?')],
  },
  AI: {
    audience: L('للأطباء، مديري المراكز التشخيصية، ومسؤولي الجودة السريرية', 'For physicians, diagnostic center heads, and clinical quality leads'),
    steps: [L('فحص تلقائي فوري فور وصول البيانات', 'Automated scan analysis upon ingestion'), L('إشعار الحالات الحرجة وقائمة العمل العاجلة', 'STAT triage alerts & worklist prioritization'), L('اقتراح الصياغة والتشخيص التقديري', 'Draft preliminary findings & auto-reporting'), L('اعتماد الطبيب البشري والتعديل النهائي', 'Physician verification & final approval')],
    questions: [L('ما هي البروتوكولات المستهدفة للفرز السريع (مخ، صدر، عظام)؟', 'Which priority clinical protocols do you target?'), L('هل تستخدمون إملاءً صوتيًا في كتابة التقارير حاليًا؟', 'Do your specialists currently use voice dictation?'), L('ما بيئة الخوادم المفضلة لتشغيل النماذج (سحابية أو محلية)؟', 'Do you prefer cloud-hosted or on-premise AI inference?')],
  },
};
