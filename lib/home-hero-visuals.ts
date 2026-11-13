import type { Localized } from './site-content';

const L = (ar: string, en: string): Localized => ({ ar, en });
const asset = (id: string) => `/assets/systems/hero-20261025/${id}.webp`;

export const heroVisuals = [
  { id: 'RIS', facility: 'radiology', image: asset('ris'), captures: ['worklist', 'modality'],
    title: L('تنظيم يوم مركز الأشعة', 'Coordinate the radiology workday'),
    alt: L('تصور توضيحي لجهاز تصوير طبي ولوحة تنظيم مواعيد بألوان VIARA', 'Concept illustration of a medical scanner and scheduling board in VIARA colors') },
  { id: 'PACS', facility: 'radiology', image: asset('pacs'), captures: ['viewer', 'matching'],
    title: L('الصور والدراسات في مسار واضح', 'A clear path for images and studies'),
    alt: L('تصور توضيحي لمحطة مراجعة الصور الطبية وأرشيف الدراسات', 'Concept illustration of a medical imaging review workstation and study archive') },
  { id: 'CMS', facility: 'medical', image: asset('cms'), captures: ['appointments'],
    title: L('المواعيد وتشغيل المركز', 'Appointments and center operations'),
    alt: L('تصور توضيحي لاستقبال عيادة ولوحة مواعيد باللونين العاجي والأخضر', 'Concept illustration of clinic reception and an appointment board in ivory and emerald') },
  { id: 'AI', facility: 'radiology', image: asset('ai'), captures: [],
    title: L('مساندة المختص ضمن نطاق محدد', 'Specialist assistance within a defined scope'),
    alt: L('تصور توضيحي لأدوات مساندة المختص بجانب صورة صدر وورقة تقرير مجردتين', 'Concept illustration of specialist assistance beside an abstract chest image and report sheet') },
  { id: 'PORTAL', facility: 'medical', image: asset('portal'), captures: ['hub', 'patient', 'doctor'],
    title: L('وصول المراجع إلى المواعيد والنتائج', 'Patient access to appointments and results'),
    alt: L('تصور توضيحي لهاتف وجهاز لوحي يعرضان بطاقات مواعيد وتقارير مجردة', 'Concept illustration of a phone and tablet with abstract appointment and report cards') },
];

export const HERO_ROTATION_MS = 6500;

export function enabledHeroVisuals(products: { id: string; enabled: boolean; image?: string }[]) {
  return heroVisuals.filter(visual => products.some(product => product.id === visual.id && product.enabled))
    .map(visual => ({ ...visual, image: products.find(product => product.id === visual.id)?.image || visual.image }));
}

export function nextHeroId(ids: string[], selected: string) {
  if (!ids.length) return '';
  return ids[(ids.indexOf(selected) + 1) % ids.length];
}
