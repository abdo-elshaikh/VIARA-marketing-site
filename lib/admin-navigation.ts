export type AdminLocale = 'ar' | 'en';
const L = (ar: string, en: string) => ({ ar, en });

export const adminTabs = [
  { id: 'overview', group: 'workspace', label: L('مساحة العمل', 'Workspace'), description: L('نظرة على النشاط ووصول مباشر إلى أدوات الإدارة.', 'Activity at a glance and direct access to administration tools.') },
  { id: 'content', group: 'content', label: L('الصفحات والمحتوى', 'Pages & content'), description: L('المقدمة والتعريف والأسئلة ورحلة العمل.', 'Homepage, introduction, FAQs and workflows.') },
  { id: 'company', group: 'content', label: L('عن VIARA', 'About VIARA'), description: L('تعريف الشركة والمكاتب والفريق والمعلومات المنشورة.', 'Company profile, offices, team and published information.') },
  { id: 'copy', group: 'content', label: L('النصوص والترجمة', 'Copy & translation'), description: L('البحث في نصوص الصفحات وتخصيص العربية والإنجليزية.', 'Find page copy and customize Arabic and English text.') },
  { id: 'products', group: 'content', label: L('الأنظمة والباقات', 'Systems & packages'), description: L('إدارة الحلول والمزايا والباقات المعروضة.', 'Manage published solutions, features and packages.') },
  { id: 'offers', group: 'operations', label: L('العروض', 'Offers'), description: L('إدارة العروض وشروطها وفترات إتاحتها.', 'Manage offers, terms and availability periods.') },
  { id: 'reviews', group: 'operations', label: L('آراء العملاء', 'Customer reviews'), description: L('مراجعة الموافقات وإدارة الآراء المنشورة.', 'Review consent and manage published testimonials.') },
  { id: 'leads', group: 'operations', label: L('طلبات العملاء', 'Customer requests'), description: L('البحث في الطلبات وتحديث مراحل المتابعة.', 'Search requests and update follow-up stages.') },
  { id: 'settings', group: 'settings', label: L('إعدادات الموقع', 'Site settings'), description: L('الهوية والصور وبيانات التواصل ومحركات البحث.', 'Brand identity, imagery, contact details and search metadata.') },
];

export const adminSections = [
  { tab: 'content', id: 'cms-section-home', label: L('مقدمة الرئيسية', 'Homepage hero'), keywords: 'hero عنوان description cta الرئيسية الهيرو المقدمة' },
  { tab: 'content', id: 'cms-section-about', label: L('التعريف المختصر', 'Short introduction'), keywords: 'about تعريف من نحن' },
  { tab: 'content', id: 'cms-section-faq', label: L('الأسئلة الشائعة', 'Frequently asked questions'), keywords: 'faq سؤال إجابة' },
  { tab: 'content', id: 'cms-section-journey', label: L('رحلة العمل', 'Workflow journey'), keywords: 'journey مراحل الرعاية' },
  { tab: 'content', id: 'cms-section-metrics', label: L('مؤشرات الصفحة', 'Page metrics'), keywords: 'metrics بيانات مؤشرات' },
  { tab: 'products', id: 'cms-section-systems', label: L('الأنظمة', 'Systems'), keywords: 'ris pacs cms ai portal حلول features مزايا' },
  { tab: 'products', id: 'cms-section-facilities', label: L('أنواع المنشآت', 'Facility types'), keywords: 'facility عيادات اشعة مركز' },
  { tab: 'products', id: 'cms-section-plans', label: L('الباقات والأسعار', 'Packages & pricing'), keywords: 'plans pricing اسعار تراخيص packages' },
  { tab: 'settings', id: 'cms-section-brand', label: L('الشعار والألوان', 'Logo & colors'), keywords: 'brand logo color هوية شعار الوان اسم تخصيص' },
  { tab: 'settings', id: 'cms-section-imagery', label: L('الصور', 'Imagery'), keywords: 'images media صور photograph وسائط' },
  { tab: 'settings', id: 'cms-section-contact', label: L('التواصل والشبكات الاجتماعية', 'Contact & social links'), keywords: 'contact phone email whatsapp social بريد هاتف واتساب انستجرام فيسبوك تواصل' },
  { tab: 'settings', id: 'cms-section-seo', label: L('محركات البحث SEO', 'Search metadata SEO'), keywords: 'seo meta title description محركات عنوان وصف بحث' },
  { tab: 'reviews', id: 'cms-section-moderation', label: L('مراجعة الآراء', 'Moderation'), keywords: 'review consent نشر موافقة تقييم' },
  { tab: 'reviews', id: 'cms-section-add-review', label: L('إضافة رأي', 'Add a review'), keywords: 'testimonial شهادة عميل اضافة' },
  { tab: 'company', id: 'cms-company-profile', label: L('تعريف الشركة', 'Company profile'), keywords: 'company story legal اسم قصة تعريف شركة' },
  { tab: 'company', id: 'cms-company-principles', label: L('مبادئ العمل', 'Principles'), keywords: 'values principles مبادئ قيم' },
  { tab: 'company', id: 'cms-company-offices', label: L('المكاتب والمقرات', 'Offices'), keywords: 'office location address عنوان مقرات مكاتب' },
  { tab: 'company', id: 'cms-company-support', label: L('قنوات الدعم', 'Support channels'), keywords: 'support hours دعم ساعات' },
  { tab: 'company', id: 'cms-company-team', label: L('فريق العمل', 'Team'), keywords: 'team people فريق اشخاص' },
  { tab: 'company', id: 'cms-company-milestones', label: L('محطات التطوير', 'Milestones'), keywords: 'milestones history تاريخ مراحل' },
  { tab: 'company', id: 'cms-company-credentials', label: L('الوثائق والاعتمادات', 'Documents & credentials'), keywords: 'documents credentials وثائق اعتماد مصادر' },
];

export type AdminDestination = { tab: string; section: string };

export function resolveAdminDestination(tab: string, section = ''): AdminDestination {
  const validTab = adminTabs.some(item => item.id === tab) ? tab : 'overview';
  const sections = adminSections.filter(item => item.tab === validTab);
  return { tab: validTab, section: sections.find(item => item.id === section)?.id || sections[0]?.id || '' };
}

export function parseAdminHash(hash: string): AdminDestination {
  const raw = hash.replace(/^#/, '');
  const legacy = adminSections.find(item => item.id === raw);
  if (legacy) return { tab: legacy.tab, section: legacy.id };
  const [tab, section] = raw.split('/');
  return resolveAdminDestination(tab, section);
}

export function adminHash(destination: AdminDestination) {
  const target = resolveAdminDestination(destination.tab, destination.section);
  return `#${target.tab}${target.section ? `/${target.section}` : ''}`;
}

export function adminFieldDestination(path: readonly PropertyKey[]) {
  const [root, field] = path.map(String);
  const groups: Record<string, [string, string]> = {
    brand: ['settings', 'cms-section-brand'], imagery: ['settings', 'cms-section-imagery'],
    contact: ['settings', 'cms-section-contact'], seo: ['settings', 'cms-section-seo'],
    hero: ['content', 'cms-section-home'], about: ['content', 'cms-section-about'],
    faqs: ['content', 'cms-section-faq'], journeys: ['content', 'cms-section-journey'], metrics: ['content', 'cms-section-metrics'],
    products: ['products', 'cms-section-systems'], catalog: ['products', 'cms-section-facilities'], plans: ['products', 'cms-section-plans'],
    offers: ['offers', ''], copy: ['copy', ''],
  };
  const [tab, section] = root === 'company'
    ? ['company', adminSections.some(item => item.id === `cms-company-${field}`) ? `cms-company-${field}` : 'cms-company-profile']
    : groups[root] || ['overview', ''];
  const destination = resolveAdminDestination(tab, section);
  const label = adminSections.find(item => item.id === destination.section)?.label || adminTabs.find(item => item.id === destination.tab)!.label;
  return { ...destination, label };
}

const normalize = (value: string) => value.toLocaleLowerCase().normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي');

export function searchAdminDestinations(query: string) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const entries = [
    ...adminTabs.map(item => ({ tab: item.id, section: '', label: item.label, parent: item.label, description: item.description, keywords: '' })),
    ...adminSections.map(item => {
      const parent = adminTabs.find(tab => tab.id === item.tab)!;
      return { tab: item.tab, section: item.id, label: item.label, parent: parent.label, description: parent.description, keywords: item.keywords };
    }),
  ];
  const matches = entries.filter(item => terms.every(term => normalize(`${item.label.ar} ${item.label.en} ${item.parent.ar} ${item.parent.en} ${item.keywords}`).includes(term)));
  if (!terms.length) return matches;
  const score = (item: typeof entries[number]) => {
    const label = normalize(`${item.label.ar} ${item.label.en}`);
    return (terms.every(term => label.includes(term)) ? 100 : 0) + (item.section ? 10 : 0);
  };
  return matches.sort((a, b) => score(b) - score(a));
}
