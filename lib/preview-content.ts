import { defaultContent, L, type SiteContent } from './site-content.ts';
import { marketingSystemIds } from './healthcare-catalog.mjs';

/** Local visual-review content. It deliberately contains no invented customer endorsements or credentials. */
export function createPreviewContent(current: SiteContent): SiteContent {
  const content = structuredClone(defaultContent);
  content.brand = structuredClone(current.brand);
  content.contact = structuredClone(current.contact);
  content.hero = {
    badge: L('حلول مترابطة للأشعة والمراكز الطبية', 'CONNECTED SYSTEMS FOR RADIOLOGY & MEDICAL CENTERS'),
    title: L('يوم عمل أوضح.', 'A clearer workday.'),
    accent: L('وفريق أكثر تركيزًا.', 'A more focused team.'),
    description: L('المواعيد، والفحوصات، والتقارير، والصور الطبية في مسار عمل مترابط. استكشف أنظمة VIARA واختر نقطة البداية المناسبة لطبيعة مركزك.', 'Appointments, examinations, reports and medical images in a connected workflow. Explore VIARA systems and choose a starting point that fits your center.'),
    cta: L('استكشف الأنظمة', 'Explore the systems'),
  };
  content.imagery = { hero: '/assets/viara-social.png', care: '/assets/scenes/viara-corporate-hq.jpg' };
  content.products = content.products.map(product => ({ ...product, enabled: marketingSystemIds.includes(product.id) }));
  content.company.legalName = L(content.brand.name, content.brand.name);
  content.company.eyebrow = L('عن VIARA وطريقة عملنا', 'ABOUT VIARA & HOW WE WORK');
  content.company.storyTitle = L('نفهم التفاصيل، ثم نربطها.', 'Understand the details. Connect the workflow.');
  content.company.storyBody = L('تبدأ رحلة اختيار النظام من طريقة عمل المركز: استقبال المراجعين، وجدولة المواعيد، وإدارة الفحوصات، ومراجعة التقارير والصور.\n\nتجمع VIARA مسارات RIS وPACS وCMS والبوابات والمساندة بالذكاء الاصطناعي في نطاق يتحدد بعد مراجعة المتطلبات. نوضح الوحدات والتكاملات وخطة التهيئة قبل الاتفاق على التنفيذ.', 'Choosing a system starts with the center’s workflow: reception, appointment scheduling, examination management, and report and image review.\n\nVIARA brings RIS, PACS, CMS, portals and AI assistance into a scope defined after requirements review. Modules, integrations and setup are clarified before implementation is agreed.');
  content.company.imageCaption = L('مشهد مولد للتوضيح بهوية VIARA؛ لا يمثل مقرًا فعليًا.', 'An AI-generated VIARA brand illustration, not an actual office.');
  content.company.principles = [
    { id: 'preview-clarity', enabled: true, title: L('وضوح قبل التنفيذ', 'Clarity before implementation'), body: L('تحديد الأدوار ومسار العمل والوحدات المطلوبة قبل إعداد نطاق الحل.', 'Define roles, workflows and required modules before preparing the solution scope.') },
    { id: 'preview-workflow', enabled: true, title: L('تجربة تناسب الفريق', 'An experience shaped around the team'), body: L('مراجعة احتياجات الاستقبال والفنيين والأطباء والإدارة ضمن مسار واحد.', 'Review reception, technologist, clinician and administration needs within one workflow.') },
    { id: 'preview-integrations', enabled: true, title: L('تكاملات تُراجع عمليًا', 'Integrations reviewed in practice'), body: L('توافق الأجهزة وتبادل البيانات ونقل الأرشيف تحدد بعد مراجعة البيئة التقنية.', 'Device compatibility, data exchange and archive migration are scoped after technical review.') },
    { id: 'preview-responsibility', enabled: true, title: L('مسؤوليات محددة', 'Defined responsibilities'), body: L('إتاحة البيانات بحسب الدور، مع بقاء اعتماد التقارير والقرارات السريرية للمختص.', 'Role-based data access, with report approval and clinical decisions retained by qualified professionals.') },
  ];
  const hasContact = Boolean(content.contact.email || content.contact.phone || content.contact.whatsapp);
  const hasAddress = Boolean(content.contact.address.ar.trim() && content.contact.address.en.trim());
  content.company.offices = hasAddress ? [{ id: 'preview-contact-office', enabled: true, name: L('بيانات التواصل المسجلة', 'Configured contact location'), address: structuredClone(content.contact.address), hours: L('لترتيب زيارة، تواصل معنا أولًا لتأكيد التفاصيل.', 'Contact us before arranging a visit to confirm the details.'), phone: content.contact.phone, email: content.contact.email, mapUrl: '' }] : [];
  content.company.support = hasContact ? [{ id: 'preview-contact-support', enabled: true, label: L('ناقش احتياجات مركزك', 'Discuss your center’s needs'), description: L('قنوات التواصل المسجلة للموقع للاستفسار عن الأنظمة وترتيب العرض التوضيحي.', 'The website’s configured contact channels for system inquiries and demonstrations.'), hours: L('تحدد مواعيد التواصل والدعم ضمن الاتفاق.', 'Contact and support availability are defined in the agreement.'), phone: content.contact.phone, email: content.contact.email, url: content.contact.whatsapp ? 'https://wa.me/' + content.contact.whatsapp.replace(/\D/g, '') : '' }] : [];
  content.company.team = [
    { id: 'preview-role-product', enabled: true, name: L('دور المنتج والتشغيل — نموذج معاينة', 'Product & operations role — preview example'), role: L('فهم المتطلبات وتصميم المسار', 'Requirements & workflow design'), bio: L('مثال توضيحي لطريقة عرض أدوار الفريق، وليس ملفًا لشخص حقيقي أو بيانًا بعدد الموظفين.', 'An example of how team roles appear, not a real person’s profile or a statement of employee numbers.'), image: '' },
    { id: 'preview-role-technical', enabled: true, name: L('الدور التقني — نموذج معاينة', 'Technical role — preview example'), role: L('مراجعة الربط والتهيئة', 'Integration & setup review'), bio: L('بطاقة معاينة لتوزيع المحتوى؛ تُستبدل ببيانات فريق معتمدة عند تجهيز النسخة العامة.', 'A layout preview card to be replaced with approved team information for public use.'), image: '' },
  ];
  content.company.milestones = [{ id: 'preview-stage', enabled: true, period: 'PREVIEW / 01', title: L('من الاحتياج إلى نطاق واضح — سيناريو معاينة', 'From requirements to a clear scope — preview scenario'), body: L('مثال لعرض محطة: مراجعة سير العمل، تحديد الأنظمة المناسبة، ثم توثيق النطاق وخطوات التهيئة. ليست واقعة تاريخية للشركة.', 'An example milestone: review workflows, select suitable systems, then document scope and setup steps. This is not a historical company event.') }];
  content.company.credentials = [];
  content.offers = [{ id: 'd3b7a60e-a355-4e21-a76f-90700f478c66', active: true, title: L('سيناريو باقة البداية — للمعاينة فقط', 'Starter package scenario — preview only'), description: L('بطاقة تجريبية لمعاينة عرض الباقات وربطها بطلب العرض التوضيحي. لا تمثل خصمًا أو عرضًا تجاريًا فعليًا؛ السعر والنطاق يتحددان في عرض معتمد.', 'A sample card for checking package presentation and demonstration requests. It is not an actual discount or commercial offer; pricing and scope require an approved proposal.'), badge: L('معاينة تجريبية', 'PREVIEW EXAMPLE'), endDate: '', plan: 'أساس' }];
  content.sections = { about: true, offers: true, reviews: true };
  content.copy = {
    'Globally compliant healthcare software architecture': L('نطاق تقني يُراجع حسب بيئة مركزك', 'Technical scope reviewed for your environment'),
    'CERTIFIED CLINICAL SUITE': L('حلول VIARA للأشعة والمراكز الطبية', 'VIARA RADIOLOGY & MEDICAL CENTER SYSTEMS'),
    'Continuous software updates with zero downtime': L('خطة تحديثات تُحدد حسب بيئة التشغيل', 'An update plan defined for the deployment environment'),
    'Clinically optimized Arabic & English interfaces': L('تجربة عمل بالعربية والإنجليزية', 'An Arabic and English workflow experience'),
  };
  return content;
}
