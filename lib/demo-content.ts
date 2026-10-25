import { defaultContent, L, type SiteContent } from './site-content.ts';

export function createDemoContent(current: SiteContent): SiteContent {
  const content = structuredClone(defaultContent);
  content.brand = structuredClone(current.brand);
  content.contact = structuredClone(current.contact);
  content.company.legalName = structuredClone(current.company.legalName);
  content.company.offices = [{
    id: 'demo-office',
    enabled: false,
    name: L('مقر تجريبي — غير منشور', 'Sample office — unpublished'),
    address: L('أدخل عنوان المنشأة المعتمد قبل النشر.', 'Enter the approved facility address before publishing.'),
    hours: L('أدخل ساعات العمل المعتمدة.', 'Enter the approved business hours.'),
    phone: '',
    email: '',
    mapUrl: '',
  }];
  content.company.support = [{
    id: 'demo-support',
    enabled: false,
    label: L('قناة دعم تجريبية — غير منشورة', 'Sample support channel — unpublished'),
    description: L('استبدل هذا النص بوصف قناة الدعم الفعلية.', 'Replace this text with the actual support channel description.'),
    hours: L('أدخل ساعات الدعم المعتمدة.', 'Enter the approved support hours.'),
    phone: '',
    email: '',
    url: '',
  }];
  content.company.team = [{
    id: 'demo-team',
    enabled: false,
    name: L('اسم عضو الفريق التجريبي', 'Sample team member'),
    role: L('المسمى الوظيفي التجريبي', 'Sample role'),
    bio: L('نص تعريفي تجريبي؛ استبدله بمعلومات معتمدة قبل النشر.', 'Sample biography; replace with approved information before publishing.'),
    image: '',
  }];
  content.company.milestones = [{
    id: 'demo-milestone',
    enabled: false,
    period: 'DEMO',
    title: L('محطة تطوير تجريبية', 'Sample milestone'),
    body: L('أضف محطة موثقة وتاريخها قبل النشر.', 'Add a verified milestone and date before publishing.'),
  }];
  content.company.credentials = [{
    id: 'demo-credential',
    enabled: false,
    title: L('وثيقة تجريبية — غير منشورة', 'Sample credential — unpublished'),
    body: L('أضف وثيقة موثقة ورابط مصدرها قبل النشر.', 'Add a verified document and its source link before publishing.'),
    url: '',
  }];
  content.offers = [{
    id: 'd3b7a60e-a355-4e21-a76f-90700f478c66',
    title: L('عرض تجريبي — غير حقيقي', 'Sample offer — not real'),
    description: L('هذا نص تجريبي للتحقق من عرض تفاصيل الباقة. استبدله بشروط عرض معتمد قبل التفعيل.', 'This sample checks how package offer details appear. Replace it with approved offer terms before activation.'),
    badge: L('بيانات تجريبية', 'SAMPLE DATA'),
    endDate: '',
    active: false,
    plan: 'أساس',
  }];
  return content;
}
