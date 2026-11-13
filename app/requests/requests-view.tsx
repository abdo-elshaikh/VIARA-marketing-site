'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, ChevronDown, Download, Trash2, X, ClipboardList, LoaderCircle, Search, Clock3, CheckCircle2, Plus, FileText } from 'lucide-react';
import { useSiteText } from '../../lib/site-copy';
import { txt, type Locale, type SiteContent } from '../../lib/site-content';
import { statuses } from '../../lib/request-status';
import { choiceLabel } from '../../lib/choice-labels';
import CareFrame from '../care-frame';
import BrandPageHero from '../brand-page-hero';

type RequestRecord = { id: string; name: string; email: string; phone: string; organization: string; facility: string; branches: string; interest: string; plan: string; message: string; status: string; createdAt: number; offer?: string };
export default function RequestsView({ records: initial, loadError, locale = 'ar', content }: { records: RequestRecord[]; loadError: boolean; locale?: Locale; content: SiteContent }) {
  const en = locale === 'en', base = en ? '/en' : '/';
  const t = useSiteText(locale, content), Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const [records, setRecords] = useState(initial);
  const [deleting, setDeleting] = useState<RequestRecord | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('all');
  const dialog = useRef<HTMLDialogElement>(null), deletionTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { if (deleting && !dialog.current?.open) dialog.current?.showModal(); else if (!deleting && dialog.current?.open) dialog.current.close(); }, [deleting]);
  const reference = (record: RequestRecord) => `VR-${record.id.slice(0, 8).toUpperCase()}`;
  const statusLabel = (status: string) => statuses[status as keyof typeof statuses]?.[locale] || status;
  const system = (id: string) => { const product = content.products.find(item => item.id === id); return product ? txt(product.name, locale) : id === 'SUITE' ? t('الحل المتكامل', 'Integrated solution') : t('استشارة اختيار النظام', 'Solution consultation'); };
  const packageName = (id: string) => { const plan = content.plans.find(item => item.id === id); return plan ? txt(plan.name, locale) : t('لم أحدد بعد', 'Not selected'); };
  const filtered = records.filter(record => (filter === 'all' || record.status === filter) && (!query.trim() || `${record.organization} ${reference(record)} ${system(record.interest)}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
  function download(record: RequestRecord) {
    const body = `${content.brand.name} — ${reference(record)}\n${t('الاسم', 'Name')}: ${record.name}\n${t('المؤسسة', 'Organization')}: ${record.organization}\n${t('البريد', 'Email')}: ${record.email}\n${t('الهاتف', 'Phone')}: ${record.phone}\n${t('النظام', 'System')}: ${system(record.interest)}\n${t('الباقة', 'Package')}: ${packageName(record.plan)}\n${t('العرض', 'Offer')}: ${record.offer || '—'}\n${t('الاحتياجات', 'Requirements')}: ${record.message || '—'}\n`;
    const url = URL.createObjectURL(new Blob(['\uFEFF' + body], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${reference(record)}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function closeDeletion() { if (busy) return; setDeleting(null); requestAnimationFrame(() => deletionTrigger.current?.focus()); }
  async function remove() {
    if (!deleting || busy) return;
    setBusy(true); setError('');
    try { const response = await fetch(`/api/inquiries/${deleting.id}`, { method: 'DELETE' }); if (!response.ok) throw new Error(t('تعذر حذف الطلب. حاول مجدداً.', 'Could not delete the request. Please retry.')); setRecords(items => items.filter(item => item.id !== deleting.id)); setDeleting(null); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Error'); } finally { setBusy(false); }
  }
  const metrics = [
    { icon: ClipboardList, value: records.length, label: t('إجمالي الطلبات', 'Total requests') },
    { icon: Clock3, value: records.filter(item => ['new', 'contacted', 'proposal'].includes(item.status)).length, label: t('قيد المتابعة', 'In progress') },
    { icon: CheckCircle2, value: records.filter(item => item.status === 'won').length, label: t('طلبات مكتملة', 'Completed') },
  ];
  return <CareFrame content={content} locale={locale} current="requests"><BrandPageHero locale={locale} kind="requests" eyebrow={t('مساحتك مع VIARA', 'YOUR SPACE WITH VIARA')} title={t('كل خطوة،', 'Every step,')} accent={t('يمكنك متابعتها.', 'in view.')} description={t('راجع طلبات مركزك، وتابع حالتها، واحتفظ بملخصاتها في مكان واحد.', 'Review your center’s requests, follow their status and keep their summaries in one place.')}>
    <Link className="care-btn" href={`${base}#contact`}><Plus size={18} />{t('بدء جلسة تحليل جديدة', 'Start a new workflow review')}</Link>
  </BrandPageHero><div className="care-wrap br-requests">
    {!loadError && <div className="br-request-metrics">{metrics.map(item => <div key={item.label}><span><item.icon size={22} /></span><div><strong>{item.value.toLocaleString(en ? 'en-US' : 'ar-EG-u-nu-latn')}</strong><small>{item.label}</small></div></div>)}</div>}
    <p className="br-browser-note"><FileText size={15} />{t('تظهر هنا أحدث 100 طلب مرتبط بهذا المتصفح. قد يختلف السجل عند تغيير الجهاز أو مسح بيانات الموقع.', 'The latest 100 requests linked to this browser appear here. History may differ on another device or after clearing site data.')}</p>
    {loadError && <div className="br-alert" role="alert"><p>{t('تعذر تحميل الطلبات. أعد المحاولة لتحميل السجل.', 'Could not load your requests. Retry to load your history.')}</p><button type="button" onClick={() => location.reload()}>{t('إعادة المحاولة', 'Retry')}</button></div>}
    {!loadError && records.length > 0 && <div className="br-request-tools"><label className="br-request-search"><Search size={18} /><span className="br-sr-only">{t('البحث في الطلبات', 'Search requests')}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t('اسم المركز أو رقم الطلب...', 'Center name or request reference…')} /></label><label><span className="br-sr-only">{t('تصفية حسب الحالة', 'Filter by status')}</span><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">{t('كل الحالات', 'All statuses')}</option>{Object.keys(statuses).map(status => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></label><span role="status">{filtered.length} {t('طلب', 'requests')}</span></div>}
    {!loadError && !filtered.length && <section className="br-request-empty"><span><ClipboardList size={36} strokeWidth={1.2} /></span><h2>{records.length ? t('لا توجد طلبات مطابقة.', 'No matching requests.') : t('بدايتك معنا، من هنا.', 'Your journey starts here.')}</h2><p>{records.length ? t('جرّب كلمة أخرى أو اعرض كل الحالات.', 'Try a different term or show all statuses.') : t('عندما ترسل طلب جلسة تحليل لمركزك، ستجد تفاصيله وحالته هنا.', 'When you request a workflow review for your center, its details and status will appear here.')}</p>{records.length ? <button type="button" className="care-btn" onClick={() => { setQuery(''); setFilter('all'); }}>{t('عرض كل الطلبات', 'Show all requests')}</button> : <Link className="care-btn" href={`${base}#contact`}>{t('استكشف ما يناسب مركزك', 'Find the right fit for your center')}<Arrow size={17} /></Link>}</section>}
    <div className="br-request-list">{!loadError && filtered.map(record => <article className="br-request-card" key={record.id}>
      <div className="br-request-card-top"><span className="br-request-card-icon"><FileText size={23} /></span><div><h2>{record.organization}</h2><code dir="ltr">{reference(record)}</code></div><span className="br-request-state" data-state={record.status}>{statusLabel(record.status)}</span></div>
      <div className="br-request-meta"><span>{system(record.interest)}</span><span>{packageName(record.plan)}</span>{record.offer && <span>{record.offer}</span>}<time suppressHydrationWarning dateTime={new Date(record.createdAt).toISOString()}>{new Date(record.createdAt).toLocaleDateString(en ? 'en-GB' : 'ar-EG', { timeZone: 'Africa/Cairo', day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
      <details><summary>{t('عرض تفاصيل الطلب', 'View request details')}<ChevronDown size={17} /></summary><dl>{[[t('الاسم', 'Name'), record.name], [t('البريد الإلكتروني', 'Email'), record.email], [t('رقم التواصل', 'Phone'), record.phone], [t('المنشأة والفروع', 'Facility & branches'), `${choiceLabel(record.facility, locale)} · ${choiceLabel(record.branches, locale)}`], [t('الاحتياجات', 'Requirements'), record.message || t('لم تضف تفاصيل أخرى.', 'No additional details.')]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd><bdi>{value}</bdi></dd></div>)}</dl></details>
      <div className="br-request-actions"><button type="button" onClick={() => download(record)}><Download size={16} />{t('تنزيل الملخص', 'Download summary')}</button><button type="button" className="br-danger-link" onClick={event => { deletionTrigger.current = event.currentTarget; setError(''); setDeleting(record); }}><Trash2 size={16} />{t('حذف الطلب', 'Delete request')}</button></div>
    </article>)}</div>
    <dialog ref={dialog} className="care-dialog br-request-dialog" aria-labelledby="br-delete-title" onCancel={event => { if (busy) event.preventDefault(); else closeDeletion(); }}><div className="care-dialog-heading"><h2 id="br-delete-title">{t('حذف هذا الطلب؟', 'Delete this request?')}</h2><button type="button" className="care-menu" disabled={busy} aria-label={t('إغلاق', 'Close')} onClick={closeDeletion}><X size={20} /></button></div><p>{t('سيُحذف الطلب وبيانات التواصل المرتبطة به نهائياً. يمكنك إنشاء طلب جديد في أي وقت.', 'This request and its contact details will be permanently deleted. You can create a new request at any time.')}</p>{error && <p className="br-alert" role="alert">{error}</p>}<div className="br-dialog-actions"><button type="button" className="care-btn" disabled={busy} onClick={closeDeletion}>{t('الاحتفاظ بالطلب', 'Keep request')}</button><button type="button" className="br-danger-button" disabled={busy} onClick={remove}>{busy ? <LoaderCircle size={17} className="spin" /> : <Trash2 size={17} />}{t('حذف نهائي', 'Delete permanently')}</button></div></dialog>
  </div></CareFrame>;
}
