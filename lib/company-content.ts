import { z } from 'zod';

const text = (ar = '', en = '') => ({ ar, en });
const bilingual = z.object({ ar: z.string().trim().max(3000), en: z.string().trim().max(3000) });
const url = z.string().trim().max(600).refine(v => !v || /^https:\/\//i.test(v), 'Use https://');
const image = z.string().trim().max(600).refine(v => !v || /^https:\/\//i.test(v) || /^\/(assets|api\/media)\/[a-zA-Z0-9/_().-]+$/.test(v) && !v.includes('..'), 'Invalid image');
const phone = z.string().trim().max(30).refine(v => !v || /^[+\d ()-]+$/.test(v) && v.replace(/\D/g, '').length >= 7, 'Invalid phone');
const email = z.string().trim().max(200).refine(v => !v || z.string().email().safeParse(v).success, 'Invalid email');
const item = { id: z.string().min(1).max(100), enabled: z.boolean() };
const filled = (v: { ar: string; en: string }) => Boolean(v.ar && v.en);
const unique = (items: { id: string }[]) => new Set(items.map(i => i.id)).size === items.length;

export const initialCompany = {
  legalName: text('VIARA Healthcare Technologies & Software Solutions', 'VIARA Healthcare Technologies & Software Solutions'),
  eyebrow: text('تقنية متخصصة لمراكز الأشعة والتشخيص والمراكز الطبية', 'SPECIALIZED TECHNOLOGY FOR RADIOLOGY & MEDICAL CENTERS'),
  storyTitle: text('هندسة برمجية متقدمة لخدمة الطب والتشخيص الشعاعي.', 'Advanced software engineering serving medicine and diagnostic imaging.'),
  storyBody: text('نحن مطور ومبتكر منظومة VIARA: فريق يعمل على برمجيات سير عمل الأشعة والمراكز الطبية وأرشفة الصور والبوابات الرقمية. نحدد الوحدات والتكاملات والاستضافة مع كل منشأة ضمن عرض فني واضح، مع إبقاء المزايا السريرية المساندة تحت إشراف المختصين.', 'We develop VIARA as a healthcare software platform for radiology workflows, medical centers, imaging archives and digital portals. Modules, integrations and hosting are defined with each facility in a technical proposal, while clinical assistance remains under qualified specialist oversight.'),
  imageCaption: text('مشهد توضيحي لبيئة التشخيص المتطورة من VIARA.', 'Illustrative scene of modern diagnostic and clinical environment by VIARA.'),
  principles: [
    { id: 'people', enabled: true, title: text('مسار سلس للمريض والفريق الطبي', 'Seamless workflow for patients and clinicians'), body: text('ربط دورة عمل المريض من الحجز والاستقبال، مروراً بقوائم عمل الأجهزة MWL، وصولاً للتقرير والفوترة دون هدر في الوقت.', 'Connecting patient touchpoints from booking and reception through modality worklists (MWL) to verified reports and billing.') },
    { id: 'interop', enabled: true, title: text('تكاملات تراجع حسب بيئتك', 'Integrations reviewed around your environment'), body: text('ندرس أجهزة الأشعة والأنظمة الحالية ونحدد خدمات DICOM ونقاط الربط المطلوبة في العرض الفني، بدلاً من افتراض توافق موحد لكل بيئة.', 'We review modalities and existing systems, then define required DICOM services and integration points in the technical proposal rather than assuming identical compatibility everywhere.') },
    { id: 'security', enabled: true, title: text('أمان مؤسسي وحماية خصوصية PHI', 'Enterprise security & PHI privacy'), body: text('تشفير بيانات الحقول الحساسة بـ AES-256-GCM، فهرسة عمياء للبحث المشفر، وسجلات تدقيق غير قابلة للتلاعب.', 'AES-256-GCM field-level encryption, blind indexing for encrypted search, and tamper-evident audit chaining.') },
    { id: 'ai', enabled: true, title: text('ذكاء اصطناعي تحت إشراف المختص', 'Clinician-supervised AI assistance'), body: text('أدوات مساندة للفرز وإعداد المسودات، مع مراجعة واعتماد الطبيب المختص لكل قرار أو تقرير سريري.', 'Assistance tools for triage and drafting, with qualified clinician review and approval for every clinical decision or report.') },
  ],
  offices: [
    { id: 'head-office', enabled: true, name: text('المكتب الإقليمي ومركز الدعم الفني', 'Regional Office & Technical Support Hub'), address: text('مدينة القاهرة / الجيزة — جمهورية مصر العربية (تغطية الشرق الأوسط وشمال أفريقيا)', 'Cairo / Giza, Egypt (Serving MENA Region)'), hours: text('الأحد إلى الخميس: 9:00 ص – 6:00 م (طوارئ الدعم الفني 24/7)', 'Sun–Thu: 9:00 AM – 6:00 PM (24/7 Emergency Support)'), phone: '+20 100 000 0000', email: 'support@viara.health', mapUrl: 'https://viara.health' },
  ],
  team: [
    { id: 'engineering-team', enabled: true, name: text('فريق هندسة النظم الطبية', 'Healthcare Systems Engineering Team'), role: text('تطوير البرمجيات وهندسة الذكاء الاصطناعي', 'Software Architecture & Clinical AI'), bio: text('فريق متخصص في تطوير برمجيات الرعاية الصحية ونظم أرشفة الصور الطبية والاتصال DICOM والحماية التشفيرية للبيانات السريرية.', 'Specialized in healthcare informatics, DICOM network protocols, clinical AI pipelines, and cryptographic data security.'), image: '' },
  ],
  milestones: [
    { id: 'v1-release', enabled: true, period: '2024 - 2026', title: text('إطلاق منصة VIARA Enterprise المتكاملة', 'VIARA Enterprise Platform Release'), body: text('تطوير وإطلاق المنظومة الشاملة: RIS, PACS مع OHIF Viewer 3.12, وبوابات الأطباء والمرضى، وتكامل الذكاء الاصطناعي الهجين واجتياز فحوصات الأمان HIPAA/GDPR.', 'Comprehensive platform release featuring full RIS, OHIF v3.12 PACS, patient/physician portals, hybrid AI worker, and HIPAA/GDPR verified security.') },
  ],
  support: [
    { id: 'tech-support', enabled: true, label: text('الدعم الفني وخدمة العملاء', 'Technical Support & Client Services'), description: text('دعم فني واستشارات متخصصة لمراكز الأشعة والمستشفيات، وتهيئة الخوادم وتكامل الأجهزة.', 'Specialized support and consulting for imaging centers and hospitals, server provisioning and modality integrations.'), hours: text('دعم فني على مدار الساعة 24/7 لمراكز الطوارئ والأشعة', '24/7 operational support for emergency imaging facilities'), phone: '+20 100 000 0000', email: 'support@viara.health', url: 'https://viara.health' },
  ],
  credentials: [
    { id: 'dicom-cert', enabled: true, title: text('التوافق مع بروتوكولات DICOM 3.0 وIHE', 'DICOM 3.0 & IHE Conformance'), body: text('توافق كامل مع خدمات C-STORE وC-FIND وC-MOVE وModality Worklist (MWL) لإدارة أجهزة الأشعة.', 'Full compliance with C-STORE, C-FIND, C-MOVE and Modality Worklist (MWL) services for imaging modality management.'), url: 'https://viara.health' },
    { id: 'security-cert', enabled: true, title: text('أمان البيانات وتوافقية HIPAA وGDPR', 'HIPAA & GDPR Security Compliance'), body: text('تشفير متقدم لمعلومات المرضى المحمية (PHI) بـ AES-256-GCM وسجلات تدقيق تشفيرية وسيرفرات معزولة.', 'AES-256-GCM encryption for protected health information (PHI), cryptographic audit logs and hardened deployments.'), url: 'https://viara.health' },
  ],
};

// Do not publish placeholder contact channels or unverified credentials by default.
initialCompany.offices = [];
initialCompany.support = [];
initialCompany.credentials = [];
initialCompany.milestones[0].body = text(
  'تطوير منظومة VIARA التشغيلية لسير عمل الأشعة والأرشفة والبوابات والذكاء الاصطناعي المساند، مع مراجعة نطاق كل بيئة قبل التفعيل.',
  'Development of VIARA workflows for radiology, imaging archives, portals and assisted AI, with each environment reviewed before activation.'
);

export const companySchema = z.object({
  legalName: bilingual, eyebrow: bilingual, storyTitle: bilingual, storyBody: bilingual, imageCaption: bilingual,
  principles: z.array(z.object({ ...item, title: bilingual, body: bilingual }).refine(v => !v.enabled || filled(v.title) && filled(v.body), 'Complete both languages before publishing')).max(12).refine(unique),
  offices: z.array(z.object({ ...item, name: bilingual, address: bilingual, hours: bilingual, phone, email, mapUrl: url }).refine(v => !v.enabled || filled(v.name) && filled(v.address), 'Complete office name and address before publishing')).max(20).refine(unique),
  team: z.array(z.object({ ...item, name: bilingual, role: bilingual, bio: bilingual, image }).refine(v => !v.enabled || filled(v.name) && filled(v.role), 'Complete team name and role before publishing')).max(30).refine(unique),
  milestones: z.array(z.object({ ...item, period: z.string().trim().max(80), title: bilingual, body: bilingual }).refine(v => !v.enabled || Boolean(v.period) && filled(v.title) && filled(v.body), 'Complete milestone before publishing')).max(30).refine(unique),
  support: z.array(z.object({ ...item, label: bilingual, description: bilingual, hours: bilingual, phone, email, url }).refine(v => !v.enabled || filled(v.label) && Boolean(v.phone || v.email || v.url), 'Provide a contact channel before publishing')).max(20).refine(unique),
  credentials: z.array(z.object({ ...item, title: bilingual, body: bilingual, url }).refine(v => !v.enabled || filled(v.title) && Boolean(v.url), 'Provide a source link before publishing a credential')).max(20).refine(unique),
});
