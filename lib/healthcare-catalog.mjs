// Editorial scope directory: entries beyond configured products require assessment.
const entries = [
    ['HIS', 'clinical', 'إدارة المستشفيات', 'Hospital management', 'تنسيق التنويم والأقسام والخدمات داخل المستشفى.', 'Coordinate inpatient, department and hospital service requirements.'],
    ['EHR', 'clinical', 'الملف الطبي الإلكتروني', 'Electronic health records', 'تنظيم تاريخ المريض والزيارات والتوثيق السريري.', 'Organize patient history, encounters and clinical documentation.'],
    ['CMS', 'clinical', 'المراكز الطبية والعيادات', 'Medical centers & clinics', 'المواعيد والزيارات والفواتير وتنسيق الأقسام.', 'Appointments, visits, billing and department coordination.'],
    ['DENTAL', 'clinical', 'إدارة عيادات الأسنان', 'Dental practice management', 'تخطيط زيارات الأسنان والعلاج والمتابعة.', 'Plan dental visits, treatment workflows and follow-up.'],
    ['REHAB', 'clinical', 'التأهيل والعلاج الطبيعي', 'Rehabilitation & physiotherapy', 'تنظيم الجلسات وخطط التأهيل ومتابعة التقدم.', 'Organize sessions, rehabilitation plans and progress tracking.'],
    ['NURSING', 'clinical', 'إدارة التمريض', 'Nursing workflows', 'تحديد المهام والتسليم بين الفرق وتوثيق الرعاية.', 'Define tasks, team handovers and care documentation.'],
    ['OR', 'clinical', 'العمليات والعناية المركزة', 'Operating rooms & intensive care', 'تحديد احتياجات جدولة العمليات والتوثيق والمتابعة.', 'Assess surgery scheduling, documentation and critical care workflows.'],
    ['RIS', 'diagnostics', 'إدارة مراكز الأشعة', 'Radiology management', 'تنظيم الفحوصات وقوائم العمل والتقارير.', 'Organize examinations, worklists and reporting.'],
    ['PACS', 'diagnostics', 'أرشفة الصور الطبية', 'Medical imaging archive', 'تحديد احتياجات أرشفة الدراسات وعرضها والوصول إليها.', 'Scope study archiving, viewing and access requirements.'],
    ['AI', 'diagnostics', 'ذكاء الأشعة الاصطناعي السريري', 'Clinical & Radiology AI', 'فرز الحالات الحرجة واكتشاف النتائج العاجلة ومساندة التشخيص الشعاعي.', 'Automated scan triage, acute finding detection, and diagnostic radiology intelligence.'],
    ['LIS', 'diagnostics', 'إدارة المختبرات', 'Laboratory management', 'دورة العينة من التسجيل إلى مراجعة النتائج.', 'Plan the specimen journey from registration to result review.'],
    ['PATH', 'diagnostics', 'الباثولوجي والأنسجة', 'Pathology & histology', 'تتبع العينات والشرائح ومسار إعداد التقارير.', 'Track specimens, slides and reporting workflows.'],
    ['BLOOD', 'diagnostics', 'بنوك الدم', 'Blood bank workflows', 'تحديد احتياجات التبرع والمخزون والتتبع.', 'Assess donation, inventory and traceability requirements.'],
    ['PHARM', 'operations', 'الصيدليات والدواء', 'Pharmacy & medication', 'تخطيط الصرف والمخزون والمشتريات الدوائية.', 'Plan dispensing, inventory and medication procurement.'],
    ['RCM', 'operations', 'الإيرادات والتأمين', 'Revenue cycle & insurance', 'تحديد دورة الفوترة والتحصيل والمطالبات.', 'Define billing, collection and claims workflows.'],
    ['ERP', 'operations', 'المالية والمشتريات', 'Finance & procurement', 'تنظيم متطلبات الحسابات والموردين والمخازن.', 'Organize accounting, supplier and inventory requirements.'],
    ['HR', 'operations', 'الموارد البشرية والجداول', 'Workforce & scheduling', 'تخطيط الأدوار والجداول واحتياجات فرق العمل.', 'Plan staff roles, schedules and workforce requirements.'],
    ['ASSET', 'operations', 'الأجهزة والصيانة', 'Equipment & maintenance', 'حصر الأجهزة وخطط الصيانة ومتابعة التوقفات.', 'Map equipment, maintenance plans and downtime tracking.'],
    ['BI', 'operations', 'التحليلات وذكاء الأعمال', 'Analytics & business intelligence', 'تعريف مؤشرات التشغيل ولوحات المتابعة للإدارة.', 'Define operational indicators and management dashboards.'],
    ['PORTAL', 'digital', 'بوابة المريض والأطباء المحيلين', 'Patient & Referring Physicians Portal', 'بوابات رقمية متصلة للمرضى والأطباء المحيلين لحجز المواعيد ومتابعة الفحوصات والوصول المباشر للتقارير والصور الطبية.', 'Connected digital portals for patients and referring physicians to schedule appointments, track examinations, and access reports and medical images.'],
    ['TELE', 'digital', 'الرعاية عن بُعد', 'Telehealth', 'تخطيط المواعيد الافتراضية والتواصل والمتابعة.', 'Plan virtual appointments, communication and follow-up.'],
    ['HOME', 'digital', 'الرعاية المنزلية', 'Home care', 'تنسيق الزيارات الميدانية والفرق وخطط المتابعة.', 'Coordinate field visits, care teams and follow-up plans.'],
    ['REFERRAL', 'digital', 'الإحالات وتنسيق الرعاية', 'Referrals & care coordination', 'تتبع الإحالات بين المنشآت واستمرارية المتابعة.', 'Track referrals between facilities and continuity of follow-up.'],
    ['INTEROP', 'digital', 'التكامل وتبادل البيانات', 'Integration & interoperability', 'مراجعة الأنظمة الحالية وواجهات الربط المطلوبة.', 'Review existing systems and required integration interfaces.'],
];
export const healthcareSystems = entries.map(([id, category, ar, en, descriptionAr, descriptionEn]) => ({ id, category, name: { ar, en }, description: { ar: descriptionAr, en: descriptionEn } }));
export const healthcareCategories = [
    { id: 'clinical', name: { ar: 'الرعاية السريرية', en: 'Clinical care' } },
    { id: 'diagnostics', name: { ar: 'التشخيص والفحوصات', en: 'Diagnostics' } },
    { id: 'operations', name: { ar: 'التشغيل والإدارة', en: 'Operations' } },
    { id: 'digital', name: { ar: 'الرعاية الرقمية والتكامل', en: 'Digital care' } },
];
export const facilityProfiles = [
    { id: 'hospital', name: { ar: 'مستشفى', en: 'Hospital' }, systems: ['HIS', 'EHR', 'NURSING', 'LIS', 'PHARM', 'RCM'] },
    { id: 'medical', name: { ar: 'مركز طبي أو عيادات', en: 'Medical center / clinics' }, systems: ['CMS', 'EHR', 'PORTAL', 'RCM'] },
    { id: 'radiology', name: { ar: 'مركز أشعة', en: 'Radiology center' }, systems: ['RIS', 'PACS', 'PORTAL', 'RCM'] },
    { id: 'laboratory', name: { ar: 'مختبر تحاليل', en: 'Laboratory' }, systems: ['LIS', 'PORTAL', 'RCM', 'INTEROP'] },
    { id: 'network', name: { ar: 'مجموعة منشآت', en: 'Facility network' }, systems: ['HIS', 'CMS', 'EHR', 'BI', 'ERP', 'INTEROP'] },
];
// Public marketing scope includes core radiology, imaging, AI, medical center and portals.
export const marketingSystemIds = ['RIS', 'PACS', 'AI', 'CMS', 'PORTAL'];
export const marketingCategories = [
    { id: 'clinical', name: { ar: 'إدارة المراكز والعيادات', en: 'Clinics & medical centers' } },
    { id: 'diagnostics', name: { ar: 'الأشعة والتصوير الطبي والذكاء الاصطناعي', en: 'Radiology, imaging & clinical AI' } },
    { id: 'digital', name: { ar: 'بوابات المرضى والأطباء', en: 'Patient & doctor portals' } },
];
export const marketingFacilityProfiles = facilityProfiles.filter(profile => ['radiology', 'medical'].includes(profile.id));
/** @param {string} value */
export function normalizeCatalogSearch(value) { return value.normalize('NFKD').replace(/[\u064b-\u065f\u0670\u0300-\u036f]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').toLowerCase().trim(); }
/** @param {string[]} ids @param {string} locale */
export function formatSystemsSummary(ids, locale) {
    const selected = healthcareSystems.filter(system => ids.includes(system.id));
    if (!selected.length) return '';
    const en = locale === 'en';
    return (en ? 'Requested healthcare scope (subject to assessment):' : 'نطاق الرعاية المطلوب (يخضع لدراسة الاحتياج):') + '\n' + selected.map(system => `${system.id} — ${en ? system.name.en : system.name.ar}`).join('\n');
}
