'use client';
import { Plus, Trash2 } from 'lucide-react';
import type { SiteContent, Localized, Locale } from '../../lib/site-content';
import { createCompanyDraft } from '../../lib/company-draft';

type Company = SiteContent['company'];
type Group = 'principles' | 'offices' | 'team' | 'milestones' | 'support' | 'credentials';
type Row = Record<string, string | boolean | Localized>;
const groups: { key: Group; ar: string; en: string; fields: string[] }[] = [
  { key: 'principles', ar: 'مبادئ العمل', en: 'Principles', fields: ['title', 'body'] },
  { key: 'offices', ar: 'المقرات', en: 'Offices', fields: ['name', 'address', 'hours', 'phone', 'email', 'mapUrl'] },
  { key: 'support', ar: 'قنوات الدعم', en: 'Support channels', fields: ['label', 'description', 'hours', 'phone', 'email', 'url'] },
  { key: 'team', ar: 'فريق العمل', en: 'Team', fields: ['name', 'role', 'bio', 'image'] },
  { key: 'milestones', ar: 'محطات التطوير', en: 'Milestones', fields: ['period', 'title', 'body'] },
  { key: 'credentials', ar: 'الوثائق والاعتمادات', en: 'Documents & credentials', fields: ['title', 'body', 'url'] },
];
const labels: Record<string, [string, string]> = {
  legalName: ['الاسم القانوني — اختياري', 'Legal name — optional'], eyebrow: ['الشارة التعريفية', 'Eyebrow'], storyTitle: ['عنوان القصة', 'Story title'], storyBody: ['نص القصة', 'Story text'], imageCaption: ['وصف الصورة ومصدرها', 'Image description & source'], title: ['العنوان', 'Title'], body: ['التفاصيل', 'Details'], name: ['الاسم', 'Name'], address: ['العنوان التفصيلي', 'Address'], hours: ['ساعات العمل', 'Working hours'], phone: ['الهاتف', 'Phone'], email: ['البريد الإلكتروني', 'Email'], mapUrl: ['رابط الخريطة (HTTPS)', 'Map URL (HTTPS)'], label: ['اسم القناة', 'Channel name'], description: ['الوصف', 'Description'], url: ['الرابط / مصدر الوثيقة (HTTPS)', 'Link / document source (HTTPS)'], role: ['الصفة الوظيفية', 'Role'], bio: ['نبذة', 'Biography'], image: ['رابط صورة معتمدة — اختياري', 'Approved image URL — optional'], period: ['التاريخ أو الفترة', 'Date or period'],
};

export function BilingualField({ label, value, onChange }: { label: string; value: Localized; onChange: (value: Localized) => void }) {
  return <div className="cms-pair"><span className="cms-field-label">{label}</span><div>{(['ar', 'en'] as const).map(lang => <label key={lang}><span>{lang === 'ar' ? 'العربية' : 'ENGLISH'}</span><textarea rows={2} lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} value={value[lang]} maxLength={3000} onChange={e => onChange({ ...value, [lang]: e.target.value })} /></label>)}</div></div>;
}

export default function CompanyEditor({ value, onChange, locale, section = '' }: { value: Company; onChange: (next: Company) => void; locale: Locale; section?: string }) {
  const en = locale === 'en';
  const label = (key: string) => labels[key]?.[en ? 1 : 0] || key;
  function update(group: Group, index: number, key: string, nextValue: string | boolean | Localized) {
    const next = structuredClone(value);
    const rows = next[group] as unknown as Row[];
    rows[index][key] = nextValue;
    onChange(next);
  }
  return <>
    <p className="cms-company-note">{en ? 'Starter drafts are unpublished. Enter accurate details and enable each entry to display it. Credentials require a source link. Header and footer use the same configured contact information.' : 'المسودات المبدئية غير منشورة. أدخل بيانات صحيحة ثم فعّل عرض كل عنصر. نشر الاعتمادات يتطلب رابط مصدر. يستخدم الرأس والتذييل بيانات التواصل نفسها.'}</p>
    <section id="cms-company-profile" tabIndex={-1} hidden={Boolean(section && section !== 'cms-company-profile')}>{(['legalName', 'eyebrow', 'storyTitle', 'storyBody', 'imageCaption'] as const).map(key => <BilingualField key={key} label={label(key)} value={value[key]} onChange={v => onChange({ ...value, [key]: v })} />)}</section>
    {groups.map(group => <section key={group.key} id={`cms-company-${group.key}`} tabIndex={-1} hidden={Boolean(section && section !== `cms-company-${group.key}`)} className="cms-company-group"><h3>{en ? group.en : group.ar}</h3><div className="cms-accordion-list">{value[group.key].map((item, i) => {
      const row = item as unknown as Row;
      const heading = row.name || row.title || row.label;
      return <details key={item.id}><summary><b>{typeof heading === 'object' ? heading[locale] || (en ? 'New draft' : 'مسودة جديدة') : en ? group.en : group.ar}</b><span className={item.enabled ? 'cms-state live' : 'cms-state'}>{item.enabled ? (en ? 'Visible' : 'ظاهر') : (en ? 'Draft / hidden' : 'مسودة / مخفي')}</span></summary><div><label className="cms-toggle"><input type="checkbox" checked={item.enabled} onChange={e => update(group.key, i, 'enabled', e.target.checked)} /><span />{en ? 'Publish this entry' : 'عرض هذا العنصر على الموقع'}</label>{group.fields.map(field => typeof row[field] === 'object' ? <BilingualField key={field} label={label(field)} value={row[field] as Localized} onChange={v => update(group.key, i, field, v)} /> : <label className="cms-company-field" key={field}><span>{label(field)}</span><input dir="ltr" value={String(row[field] || '')} maxLength={field === 'period' ? 80 : 600} onChange={e => update(group.key, i, field, e.target.value)} /></label>)}<button className="cms-secondary" type="button" onClick={() => { const next = structuredClone(value); next[group.key].splice(i, 1); onChange(next); }}><Trash2 size={15} />{en ? 'Delete entry' : 'حذف العنصر'}</button></div></details>;
    })}</div><button className="cms-secondary" type="button" disabled={value[group.key].length >= (group.key === 'principles' ? 12 : group.key === 'team' || group.key === 'milestones' ? 30 : 20)} onClick={() => { const next = structuredClone(value); (next[group.key] as unknown as Row[]).push(createCompanyDraft(group.key, crypto.randomUUID())); onChange(next); }}><Plus size={15} />{en ? 'Add draft' : 'إضافة مسودة'}</button></section>)}
  </>;
}
