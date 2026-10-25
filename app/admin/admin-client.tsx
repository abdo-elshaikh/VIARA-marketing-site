'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, Layers3, Gift, MessageSquare, Mail, Settings2, Search, Save,
  ExternalLink, Globe2, Plus, Trash2, Upload, CheckCircle2, LoaderCircle, ChevronDown, Star,
  Download, RefreshCw, Menu, X, ShieldCheck, ArrowUpLeft, MessageCircle, Copy, Sparkles, Check, History
} from 'lucide-react';
import { isOfferActive, siteContentSchema, txt, L, type SiteContent, type Localized, type Locale, type PublicReview } from '../../lib/site-content';
import { createDemoContent } from '../../lib/demo-content';
import { healthcareSystems, marketingSystemIds, marketingCategories, marketingFacilityProfiles } from '../../lib/healthcare-catalog.mjs';
import { statuses } from '../../lib/request-status';
import { choiceLabel } from '../../lib/choice-labels';
import CompanyEditor from './company-editor';
import CopyEditor from './copy-editor';

type Initial = { content: SiteContent; version: number; updatedAt: number };
type Lead = {
  id: string; name: string; email: string; phone: string; organization: string;
  facility: string; branches: string; interest: string; plan: string;
  message: string; status: string; offer: string; locale: string; createdAt: number;
};
type Review = PublicReview & { status: string; consent: number };
type Revision = { id: string; version: number; updatedBy: string; createdAt: number };

async function api<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

function Pair({ label, value, onChange, area = false }: { label: string; value: Localized; onChange: (v: Localized) => void; area?: boolean }) {
  return (
    <div className="cms-pair">
      <span className="cms-field-label">{label}</span>
      <div>
        {(['ar', 'en'] as const).map(lang => (
          <label key={lang}>
            <span>{lang === 'ar' ? 'العربية' : 'ENGLISH'}</span>
            {area ? (
              <textarea
                rows={3}
                lang={lang}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                value={value[lang]}
                maxLength={3000}
                onChange={e => onChange({ ...value, [lang]: e.target.value })}
              />
            ) : (
              <input
                lang={lang}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                value={value[lang]}
                maxLength={3000}
                onChange={e => onChange({ ...value, [lang]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function FeatureEditor({ value, onChange, label }: { value: Localized[]; onChange: (v: Localized[]) => void; label: string }) {
  return (
    <div className="cms-features">
      <h4>{label}</h4>
      {value.map((v, i) => (
        <div key={i}>
          <Pair label={`${i + 1}`} value={v} onChange={next => onChange(value.map((item, n) => n === i ? next : item))} />
          <button type="button" className="cms-icon danger" disabled={value.length <= 1} onClick={() => onChange(value.filter((_, n) => n !== i))} aria-label="Remove feature / حذف الميزة">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="cms-secondary" disabled={value.length >= 12} onClick={() => onChange([...value, L('', '')])}>
        <Plus size={14} /> {label} +
      </button>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="cms-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span />
      {label}
    </label>
  );
}

function Panel({ title, description, children, id }: { title: string; description?: string; children: ReactNode; id?: string }) {
  return (
    <section className="cms-panel" id={id}>
      <div className="cms-panel-head">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function AdminClient({ initial, name }: { initial: Initial; name: string }) {
  const [locale, setLocale] = useState<Locale>('ar');
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;

  const [tab, setTab] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navSearchRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(initial.content);
  const [version, setVersion] = useState(initial.version);
  const [updated, setUpdated] = useState(initial.updatedAt);
  const [dirty, setDirty] = useState(false);
  const [demoDraft, setDemoDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copyNotice, setCopyNotice] = useState('');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadError, setLeadError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [actionBusy, setActionBusy] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const [manual, setManual] = useState({ name: '', role: '', organization: '', quote: '', rating: 5, locale: 'ar', consent: false, systemId: '' });

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: t('نظرة عامة', 'Overview'), description: t('ملخص سريع للطلبات والمراجعات والعناصر التي تحتاج إلى متابعة.', 'A quick view of requests, reviews and items that need attention.') },
    { id: 'content', icon: FileText, label: t('محتوى الموقع', 'Site content'), description: t('حرر محتوى الصفحة الرئيسية والأسئلة الشائعة ورحلة الرعاية.', 'Edit homepage content, FAQs and the care journey.') },
    { id: 'company', icon: ShieldCheck, label: t('بيانات الشركة', 'Company information'), description: t('حدّث صفحة عن VIARA والمعلومات المؤسسية القابلة للنشر.', 'Update the About VIARA page and publishable company information.') },
    { id: 'copy', icon: Globe2, label: t('نصوص جميع الصفحات', 'All page text'), description: t('ابحث عن نصوص الواجهات والصفحات وعدّل النسختين العربية والإنجليزية.', 'Find page and interface copy, then edit Arabic and English versions.') },
    { id: 'products', icon: Layers3, label: t('الأنظمة والباقات', 'Systems & plans'), description: t('أدر تفاصيل الأنظمة والباقات ونطاقها التجاري.', 'Manage system details, package content and commercial scope.') },
    { id: 'offers', icon: Gift, label: t('العروض', 'Offers'), description: t('أنشئ العروض الفعلية وحدد شروطها وتاريخ انتهائها.', 'Create actual offers and set their terms and expiry dates.') },
    { id: 'reviews', icon: MessageSquare, label: t('آراء العملاء', 'Customer reviews'), description: t('راجع موافقات النشر واربط الآراء بالأنظمة ذات الصلة.', 'Review publication consent and link testimonials to relevant systems.') },
    { id: 'leads', icon: Mail, label: t('طلبات العملاء', 'Customer requests'), description: t('ابحث في الطلبات الواردة وحدّث مراحل المتابعة.', 'Search incoming requests and update their follow-up status.') },
    { id: 'settings', icon: Settings2, label: t('الهوية والتواصل', 'Brand & contact'), description: t('اضبط أصول الهوية وبيانات التواصل التي تظهر للزوار.', 'Configure brand assets and contact details shown to visitors.') }
  ];
  const navGroups = [
    { label: t('المساحة والمحتوى', 'Workspace & content'), ids: ['overview', 'content', 'company', 'copy'] },
    { label: t('إدارة الأعمال', 'Business operations'), ids: ['products', 'offers', 'reviews', 'leads'] },
    { label: t('إعدادات النظام', 'System settings'), ids: ['settings'] }
  ];
  const searchTerm = navSearch.trim().toLocaleLowerCase();
  const filteredNavGroups = navGroups.map(group => {
    const groupMatches = group.label.toLocaleLowerCase().includes(searchTerm);
    return { ...group, items: tabs.filter(item => group.ids.includes(item.id) && (!searchTerm || groupMatches || item.label.toLocaleLowerCase().includes(searchTerm))) };
  }).filter(group => group.items.length > 0);
  const currentGroup = navGroups.find(group => group.ids.includes(tab));
  const sectionLinks: Record<string, { id: string; label: string }[]> = {
    content: [
      { id: 'cms-section-home', label: t('الواجهة الرئيسية', 'Homepage') },
      { id: 'cms-section-about', label: t('عن VIARA', 'About VIARA') },
      { id: 'cms-section-faq', label: t('الأسئلة الشائعة', 'FAQs') },
      { id: 'cms-section-journey', label: t('رحلة الرعاية', 'Care journey') },
      { id: 'cms-section-metrics', label: t('مؤشرات الصفحة', 'Page metrics') }
    ],
    products: [
      { id: 'cms-section-systems', label: t('الأنظمة', 'Systems') },
      { id: 'cms-section-facilities', label: t('أنواع المنشآت', 'Facility types') },
      { id: 'cms-section-plans', label: t('الباقات والأسعار', 'Packages & pricing') }
    ],
    settings: [
      { id: 'cms-section-brand', label: t('الهوية البصرية', 'Brand identity') },
      { id: 'cms-section-imagery', label: t('صور الصفحة', 'Page imagery') },
      { id: 'cms-section-contact', label: t('بيانات التواصل', 'Contact details') },
      { id: 'cms-section-seo', label: t('محركات البحث', 'Search metadata') }
    ],
    reviews: [
      { id: 'cms-section-moderation', label: t('مراجعة الآراء', 'Review moderation') },
      { id: 'cms-section-add-review', label: t('إضافة رأي', 'Add a review') }
    ]
  };

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navSearchRef.current?.focus();
      }
      if (event.key === 'Escape' && navSearch) setNavSearch('');
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [navSearch]);

  useEffect(() => {
    function leave(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', leave);
    return () => window.removeEventListener('beforeunload', leave);
  }, [dirty]);

  useEffect(() => {
    void loadLists();
  }, []);

  async function copyToClipboard(text: string, id: string) {
    setError('');
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotice(id);
      setTimeout(() => setCopyNotice(''), 2500);
    } catch {
      setError(t('تعذر نسخ البيانات. تحقق من صلاحية الحافظة في المتصفح.', 'Could not copy the information. Check browser clipboard permissions.'));
    }
  }

  function mutate(fn: (next: SiteContent) => void) {
    setDraft(previous => {
      const next = structuredClone(previous);
      fn(next);
      return next;
    });
    setDirty(true);
    setMessage('');
  }

  function loadDemoContent() {
    if (!window.confirm(t(
      'سيتم استبدال مسودة محتوى الموقع الحالية ببيانات تجريبية. ستبقى الهوية وبيانات التواصل كما هي، ولن تُنشأ طلبات أو آراء عملاء. متابعة؟',
      'This replaces the current site-content draft with sample data. Branding and contact details stay unchanged; no customer requests or reviews will be created. Continue?'
    ))) return;
    setDraft(current => createDemoContent(current));
    setDirty(true);
    setDemoDraft(true);
    setTab('content');
    setMessage(t('حُمّلت البيانات التجريبية كمسودة. راجعها واستبدل البيانات الإرشادية قبل النشر.', 'Sample data loaded as a draft. Review it and replace guidance fields before publishing.'));
    setError('');
  }

  async function loadLists() {
    setLoading(true);
    setLeadError('');
    setReviewError('');
    const result = await Promise.allSettled([
      api<{ records: Lead[] }>('/api/admin/inquiries'),
      api<{ records: Review[] }>('/api/admin/reviews'),
      api<{ revisions: Revision[] }>('/api/admin/revisions')
    ]);
    const message = (reason: unknown) => reason instanceof Error ? reason.message : String(reason);
    if (result[0].status === 'fulfilled') setLeads(result[0].value.records);
    else setLeadError(message(result[0].reason));
    if (result[1].status === 'fulfilled') setReviews(result[1].value.records);
    else setReviewError(message(result[1].reason));
    if (result[2].status === 'fulfilled') setRevisions(result[2].value.revisions);
    setLoading(false);
  }

  async function restoreFromRevision(revision: Revision) {
    if (actionBusy || saving) return;
    if (!window.confirm(t(
      `استعادة النسخة ${revision.version}؟ سيُنشر محتوى هذه النسخة كإصدار جديد، ولا يُحذف أي سجل.`,
      `Restore version ${revision.version}? Its content is published as a new version; no history is deleted.`
    ))) return;
    setActionBusy(revision.id);
    setError('');
    setMessage('');
    try {
      await api<{ version: number }>('/api/admin/revisions', 'POST', { revisionId: revision.id });
      const result = await api<Initial>('/api/admin/content');
      setDraft(result.content);
      setVersion(result.version);
      setUpdated(result.updatedAt);
      setDirty(false);
      setDemoDraft(false);
      setMessage(t('تمت استعادة النسخة ونشرها كإصدار جديد.', 'Revision restored and published as a new version.'));
      await loadLists();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('تعذر استعادة النسخة.', 'Could not restore the revision.'));
    } finally {
      setActionBusy('');
    }
  }

  async function publish() {
    if (saving || uploading) return;
    if (demoDraft && !window.confirm(t(
      'هذه المسودة تحتوي بيانات تجريبية. لا تنشرها قبل استبدال كل البيانات الإرشادية والتحقق من التفاصيل. هل تريد المتابعة؟',
      'This draft contains sample data. Replace all guidance fields and verify the details before publishing. Publish anyway?'
    ))) return;
    setError('');
    setMessage('');
    const parsed = siteContentSchema.safeParse(draft);
    if (!parsed.success) {
      setError(t('راجع هذه الحقول: ', 'Check these fields: ') + parsed.error.issues.map(i => `${i.path.join('.')} — ${i.message}`).slice(0, 8).join(' | '));
      return;
    }
    setSaving(true);
    try {
      const result = await api<{ version: number; updatedAt: number }>('/api/admin/content', 'PUT', { content: parsed.data, version });
      setVersion(result.version);
      setUpdated(result.updatedAt);
      setDirty(false);
      setDemoDraft(false);
      setMessage(t('تم حفظ ونشر المحتوى بنجاح. يظهر للزوار فورًا عند تحديث الصفحة.', 'Content published. Visitors will see it when they refresh.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function reload() {
    if (dirty && !window.confirm(t('سيتم استبدال التعديلات غير المحفوظة. متابعة؟', 'Replace your unsaved changes with the published content?'))) return;
    setSaving(true);
    setError('');
    try {
      const result = await api<Initial>('/api/admin/content');
      setDraft(result.content);
      setVersion(result.version);
      setUpdated(result.updatedAt);
      setDirty(false);
      setDemoDraft(false);
      setMessage(t('تم تحميل النسخة المنشورة.', 'Published content loaded.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reload failed');
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File | undefined, target: 'logo' | 'hero' | 'care' = 'logo') {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.set('file', file);
      const response = await fetch('/api/admin/media', { method: 'POST', body: form });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || 'Upload failed');
      mutate(next => {
        if (target === 'logo') next.brand.logo = data.url!;
        else next.imagery[target] = data.url!;
      });
      setMessage(t('تم رفع الصورة. انشر التعديلات لإظهارها على الموقع.', 'Image uploaded. Publish your changes to display it.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function leadStatus(id: string, next: string) {
    setActionBusy(id);
    setError('');
    try {
      await api('/api/admin/inquiries', 'PATCH', { id, status: next });
      setLeads(items => items.map(l => l.id === id ? { ...l, status: next } : l));
      setMessage(t('تم تحديث حالة الطلب بنجاح.', 'Request status updated successfully.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('تعذر تحديث حالة الطلب.', 'Could not update request status.'));
    } finally {
      setActionBusy('');
    }
  }

  async function reviewAction(row: Review, next: string, systemId?: string) {
    if (next === 'delete' && !window.confirm(t('حذف هذا الرأي نهائيًا؟', 'Permanently delete this review?'))) return;
    setActionBusy(row.id);
    setError('');
    try {
      await api(`/api/admin/reviews${next === 'delete' ? `?id=${row.id}` : ''}`, next === 'delete' ? 'DELETE' : 'PATCH', next === 'delete' ? undefined : { id: row.id, status: next, ...(systemId !== undefined ? { systemId: systemId || null } : {}) });
      setReviews(items => next === 'delete' ? items.filter(r => r.id !== row.id) : items.map(r => r.id === row.id ? { ...r, status: next, ...(systemId !== undefined ? { systemId: systemId || null } : {}) } : r));
      setMessage(t('تم تحديث الرأي.', 'Review updated.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('تعذر حفظ التغيير.', 'Could not save the change.'));
    } finally {
      setActionBusy('');
    }
  }

  async function addReview(e: React.FormEvent) {
    e.preventDefault();
    if (actionBusy) return;
    setActionBusy('manual');
    setError('');
    try {
      await api('/api/admin/reviews', 'POST', { ...manual, systemId: manual.systemId || null, id: crypto.randomUUID() });
      setManual({ name: '', role: '', organization: '', quote: '', rating: 5, locale: 'ar', consent: false, systemId: '' });
      await loadLists();
      setMessage(t('تم نشر الرأي بموافقة العميل.', 'Review published with customer consent.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('تعذر حفظ الرأي.', 'Could not save the review.'));
    } finally {
      setActionBusy('');
    }
  }

  function exportLeads() {
    const cell = (v: unknown) => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"';
    const rows = [
      ['ID', 'Name', 'Organization', 'Email', 'Phone', 'System', 'Plan', 'Offer', 'Status', 'Message', 'Created'],
      ...leads.map(l => [l.id, l.name, l.organization, l.email, l.phone, l.interest, l.plan, l.offer, l.status, l.message, new Date(l.createdAt).toISOString()])
    ];
    const blob = new Blob(['\uFEFF' + rows.map(r => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'viara-requests.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleLeads = leads.filter(l => (
    (status === 'all' || l.status === status) &&
    [l.name, l.organization, l.email, l.phone, l.id, l.facility, l.branches, l.interest, l.plan, l.offer, l.message]
      .some(value => value.toLocaleLowerCase().includes(normalizedQuery))
  ));
  const current = tabs.find(v => v.id === tab)!;

  return (
    <div className="cms brand-admin" style={{ '--brand-primary': draft.brand.primary } as React.CSSProperties} lang={locale} dir={en ? 'ltr' : 'rtl'}>
      <a className="cms-skip-link" href="#admin-main">{t('انتقل إلى المحتوى الرئيسي', 'Skip to main content')}</a>
      <aside id="admin-sidebar" className={`cms-sidebar ${mobileNav ? 'open' : ''}`} aria-label={t('قائمة الإدارة', 'Administration menu')}>
        <Link href="/" className="cms-brand">
          <img src={draft.brand.logo} alt="" width={46} height={42} />
          <span dir="ltr">{draft.brand.name}<small>CONTROL CENTER</small></span>
        </Link>
        <span className="cms-sidebar-label">{t('لوحة التحكم', 'CONTROL CENTER')}</span>
        <label className="cms-nav-search">
          <Search size={16} aria-hidden="true" />
          <input
            ref={navSearchRef}
            type="search"
            value={navSearch}
            onChange={event => setNavSearch(event.target.value)}
            placeholder={t('ابحث في أقسام الإدارة', 'Search workspace')}
            aria-label={t('ابحث في أقسام الإدارة', 'Search workspace')}
          />
          <kbd>Ctrl K</kbd>
        </label>
        <nav aria-label={t('أقسام الإدارة', 'Administration navigation')}>
          {filteredNavGroups.map(group => (
            <div className="cms-nav-group" key={group.label}>
              <span className="cms-nav-group-label">{group.label}</span>
              {group.items.map(item => (
                <button
                  type="button"
                  key={item.id}
                  className={tab === item.id ? 'active' : ''}
                  aria-current={tab === item.id ? 'page' : undefined}
                  onClick={() => {
                    setTab(item.id);
                    setMobileNav(false);
                    setNavSearch('');
                    setMessage('');
                  }}
                >
                  <item.icon size={19} />
                  <span>{item.label}</span>
                  {item.id === 'reviews' && !reviewError && reviews.some(r => r.status === 'pending') && (
                    <i>{reviews.filter(r => r.status === 'pending').length}</i>
                  )}
                  {item.id === 'leads' && !leadError && leads.some(l => l.status === 'new') && (
                    <i style={{ background: '#f5c748', color: '#173c34' }}>{leads.filter(l => l.status === 'new').length}</i>
                  )}
                </button>
              ))}
            </div>
          ))}
          {filteredNavGroups.length === 0 && <p className="cms-nav-empty">{t('لا توجد أقسام تطابق بحثك.', 'No sections match your search.')}</p>}
        </nav>
        <div className="cms-sidebar-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={19} />
            <div>
              <b>{t('دخول المسؤول', 'Administrator access')}</b>
              <span>{name}</span>
            </div>
          </div>
          <a
            href="/api/admin/logout"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#d4a59a',
              background: '#2b1b1a',
              border: '1px solid #4a2d2a',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            {t('تسجيل الخروج', 'Sign out')}
          </a>
        </div>
      </aside>

      {mobileNav && (
        <button type="button" className="cms-nav-backdrop" onClick={() => setMobileNav(false)} aria-label={t('إغلاق القائمة', 'Close navigation')} />
      )}

      <div className="cms-workspace">
        <header className="cms-topbar">
      <button type="button" className="cms-mobile-menu cms-icon" onClick={() => setMobileNav(!mobileNav)} aria-label={t('قائمة الإدارة', 'Administration menu')} aria-expanded={mobileNav} aria-controls="admin-sidebar">
            <Menu size={20} />
          </button>
          <div>
            <small>{currentGroup?.label} / VIARA</small>
            <h1>{current.label}</h1>
            <p className="cms-page-description">{current.description}</p>
          </div>
          <div className="cms-top-actions">
            <button type="button" className="cms-icon" onClick={() => setLocale(en ? 'ar' : 'en')} aria-label={en ? 'العربية' : 'English'} title={t('تغيير اللغة', 'Change language')}>
              <Globe2 size={18} />
            </button>
            <a href={en ? '/en' : '/'} target="_blank" rel="noopener noreferrer" className="cms-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span>{t('معاينة الموقع المنشور', 'Live preview')}</span>
              <ExternalLink size={14} />
            </a>
            <button type="button" className="cms-publish" disabled={saving || uploading || !dirty} onClick={publish}>
              {saving ? <LoaderCircle size={16} className="spin" /> : <Save size={16} />}
              <span>{saving ? t('جارٍ الحفظ', 'Publishing') : t('حفظ ونشر', 'Save & publish')}</span>
            </button>
          </div>
        </header>

        <div className="cms-statusbar">
          <span className={dirty ? 'unsaved' : ''}>
            <i />
            {dirty ? t('تعديلات غير منشورة', 'Unpublished changes') : t('المحتوى محدث ومنشور', 'Content up to date')}
          </span>
          <span suppressHydrationWarning>
            {t('الإصدار', 'Revision')} {version}
            {updated > 0 && <> · {new Date(updated).toLocaleString(en ? 'en-GB' : 'ar-EG', { timeZone: 'Africa/Cairo', dateStyle: 'short', timeStyle: 'short' })}</>}
          </span>
          <button type="button" onClick={reload} disabled={saving}>
            <RefreshCw size={13} />
            {t('تحديث المحتوى', 'Reload content')}
          </button>
        </div>

        <main className="cms-main" id="admin-main" tabIndex={-1}>
          {demoDraft && (
            <div className="cms-alert demo-warning" role="status">
              <ShieldCheck size={18} />
              <span>{t(
                'مسودة تجريبية فقط: لا تُنشر قبل استبدال النصوص الإرشادية والتحقق من كل التفاصيل. الهوية وبيانات التواصل محفوظة كما هي، ولا تتضمن المسودة طلبات أو آراء عملاء.',
                'Sample draft only: replace guidance text and verify every detail before publishing. Existing branding and contact details are preserved; no customer requests or reviews are included.'
              )}</span>
            </div>
          )}
          {error && (
            <div className="cms-alert error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => setError('')} aria-label="Close"><X size={15} /></button>
            </div>
          )}
          {message && (
            <div className="cms-alert success" role="status">
              <CheckCircle2 size={17} />
              <span>{message}</span>
            </div>
          )}

          {sectionLinks[tab] && (
            <nav className="cms-section-jump" aria-label={t('انتقال إلى قسم', 'Jump to section')}>
              <span>{t('انتقال سريع', 'JUMP TO')}</span>
              {sectionLinks[tab].map(section => (
                <a key={section.id} href={`#${section.id}`}>{section.label}</a>
              ))}
            </nav>
          )}

          <fieldset className="cms-form-area" disabled={saving}>
            {tab === 'overview' && (
              <>
                <div className="cms-welcome">
                  <div>
                    <span className="cms-overline">YOUR VIARA, CONNECTED.</span>
                    <h2>{t('أهلًا بك في مساحة التحكم والتشغيل.', 'Welcome to your control center.')}</h2>
                    <p>{t('أدر محتوى الموقع وأنظمة الأشعة والعيادات والعروض وطلبات العملاء من مكان واحد موحد.', 'Manage website content, healthcare systems, offers and customer inquiries in one unified place.')}</p>
                  </div>
                  <div className="cms-welcome-symbol"><Layers3 size={70} /></div>
                </div>

                <section className="cms-quick-actions" aria-label={t('إجراءات سريعة', 'Quick actions')}>
                  <div className="cms-quick-actions-heading">
                    <div><span>{t('ابدأ من هنا', 'GET STARTED')}</span><h2>{t('إجراءات سريعة', 'Quick actions')}</h2></div>
                    <p>{t('انتقل مباشرة إلى أكثر المهام استخدامًا.', 'Jump straight to frequently used tasks.')}</p>
                  </div>
                  <div className="cms-quick-actions-grid">
                    {[
                      { id: 'content', icon: FileText, title: t('تحديث محتوى الموقع', 'Update website content'), detail: t('الواجهة والأسئلة الشائعة', 'Homepage and FAQs') },
                      { id: 'products', icon: Layers3, title: t('مراجعة الأنظمة والباقات', 'Review systems & plans'), detail: t('النطاق والمزايا المعروضة', 'Published scope and features') },
                      { id: 'leads', icon: Mail, title: t('متابعة طلبات العملاء', 'Follow up on requests'), detail: t('عرض الطلبات وحالاتها', 'View requests and statuses') },
                      { id: 'settings', icon: Settings2, title: t('ضبط الهوية والتواصل', 'Set brand & contact'), detail: t('الشعار وبيانات الوصول', 'Logo and contact details') }
                    ].map(action => (
                      <button key={action.id} type="button" onClick={() => setTab(action.id)}>
                        <span className="cms-quick-action-icon"><action.icon size={19} /></span>
                        <span><b>{action.title}</b><small>{action.detail}</small></span>
                        <ArrowUpLeft size={16} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </section>

                <Panel title={t('تهيئة بيانات تجريبية قابلة للتعديل', 'Prepare editable sample data')} description={t(
                  'حمّل محتوى ثنائي اللغة للصفحات والأنظمة والباقات، مع مسودات مخفية للشركة وعرض توضيحي غير مفعّل. لن يُنشر شيء قبل مراجعتك واختيار «حفظ ونشر».',
                  'Load bilingual page, system and package content, with hidden company drafts and an inactive sample offer. Nothing is published until you review it and choose Save & publish.'
                )}>
                  <div className="cms-demo-action">
                    <p>{t(
                      'تبقى بيانات الهوية والتواصل الحالية كما هي. لا تُضاف سجلات طلبات أو آراء تجريبية حتى لا تختلط ببيانات العملاء.',
                      'Current branding and contact details are kept. No sample requests or reviews are added, so they cannot be confused with customer records.'
                    )}</p>
                    <button type="button" className="cms-secondary" onClick={loadDemoContent}>
                      <Sparkles size={15} />{t('تحميل البيانات التجريبية', 'Load sample data')}
                    </button>
                  </div>
                </Panel>

                <div className="cms-metrics">
                  {[
                    { label: t('طلبات العملاء', 'Customer requests'), value: loading ? '—' : leadError ? t('خطأ', 'Error') : leads.length, icon: Mail, go: 'leads' },
                    { label: t('طلبات جديدة', 'New requests'), value: loading ? '—' : leadError ? t('خطأ', 'Error') : leads.filter(l => l.status === 'new').length, icon: FileText, go: 'leads' },
                    { label: t('آراء قيد المراجعة', 'Reviews to moderate'), value: loading ? '—' : reviewError ? t('خطأ', 'Error') : reviews.filter(r => r.status === 'pending').length, icon: MessageSquare, go: 'reviews' },
                    { label: t('عروض مفعلة', 'Enabled offers'), value: draft.offers.filter(o => o.active).length, icon: Gift, go: 'offers' }
                  ].map(m => (
                    <button type="button" key={m.label} onClick={() => setTab(m.go)}>
                      <span><m.icon size={20} />{m.label}</span>
                      <strong>{loading ? '—' : m.value}</strong>
                      <small>{t('عرض التفاصيل', 'View details')}<ArrowUpLeft size={13} /></small>
                    </button>
                  ))}
                </div>

                <Panel title={t('نسخ المحتوى السابقة', 'Previous content versions')} description={t(
                  'يُحفظ آخر 20 نسخة عند كل عملية نشر. الاستعادة تُصدر النسخة المختارة كإصدار جديد ولا تمحو التاريخ.',
                  'The last 20 publishes are kept. Restoring publishes the chosen version as a new version and never erases history.'
                )}>
                  {revisions.length === 0 ? (
                    <p className="cms-revisions-empty">{t('لا توجد نسخ محفوظة بعد. تُنشئ النسخ الأولى تلقائيًا مع أول عملية نشر للمحتوى.', 'No saved versions yet. The first versions are created automatically when you publish content.')}</p>
                  ) : (
                    <ul className="cms-revisions">
                      {revisions.map(revision => (
                        <li key={revision.id}>
                          <span>
                            <b>{t('إصدار', 'Version')} {revision.version}</b>
                            <small>{new Date(revision.createdAt).toLocaleString(en ? 'en-GB' : 'ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}{revision.updatedBy ? ` · ${revision.updatedBy}` : ''}</small>
                          </span>
                          <button
                            type="button"
                            className="cms-secondary"
                            disabled={actionBusy === revision.id || saving || revision.version === version}
                            onClick={() => { void restoreFromRevision(revision); }}
                          >
                            {actionBusy === revision.id ? <LoaderCircle size={15} className="spin" /> : <History size={15} />}
                            {revision.version === version ? t('النسخة الحالية', 'Current version') : t('استعادة', 'Restore')}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <div className="cms-two-columns">
                  <Panel title={t('خطوات تجهيز الموقع', 'Make it yours')} description={t('المحتوى الافتراضي جاهز باللغتين ومُعرب بالكامل مع هوية VIARA.', 'The default bilingual content is pre-configured with your healthcare branding.')}>
                    <div className="cms-checklist">
                      {[
                        { done: !!(draft.contact.email || draft.contact.phone || draft.contact.whatsapp), title: t('بيانات التواصل', 'Contact details'), detail: t('الهاتف والبريد وواتساب وروابط التواصل.', 'Phone, email, WhatsApp and social links.'), go: 'settings' },
                        { done: draft.offers.length > 0, title: t('العروض الحقيقية', 'Your actual offers'), detail: t('عنوان ووصف وتاريخ انتهاء لكل عرض.', 'A title, description and expiry for each offer.'), go: 'offers' },
                        { done: reviews.some(r => r.status === 'approved'), title: t('آراء موثوقة', 'Authentic reviews'), detail: t('انشر الآراء بعد موافقة أصحابها.', 'Publish reviews with their authors’ consent.'), go: 'reviews' }
                      ].map(item => (
                        <button type="button" key={item.go} onClick={() => setTab(item.go)}>
                          <span className={item.done ? 'done' : ''}><CheckCircle2 size={20} /></span>
                          <div>
                            <b>{item.title}</b>
                            <small>{item.detail}</small>
                          </div>
                          <ArrowUpLeft size={16} />
                        </button>
                      ))}
                    </div>
                  </Panel>

                  <Panel title={t('آخر طلبات العملاء', 'Recent customer requests')} description={t('صندوق الطلبات الواردة من موقع VIARA.', 'Inbox of inquiries submitted via the VIARA website.')}>
                    {loading ? (
                      <div className="cms-empty"><LoaderCircle className="spin" /></div>
                    ) : leadError ? (
                      <div className="cms-empty">
                        {leadError}
                        <button type="button" className="cms-secondary" onClick={loadLists}>{t('إعادة المحاولة', 'Retry')}</button>
                      </div>
                    ) : leads.length ? (
                      <div className="cms-recent">
                        {leads.slice(0, 5).map(l => (
                          <button key={l.id} type="button" onClick={() => setTab('leads')}>
                            <span>{l.name.slice(0, 1)}</span>
                            <div>
                              <b>{l.organization}</b>
                              <small>{l.name} · {new Date(l.createdAt).toLocaleDateString(en ? 'en-GB' : 'ar-EG')}</small>
                            </div>
                            <i>{statuses[l.status as keyof typeof statuses]?.[locale] || l.status}</i>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="cms-empty">
                        <Mail size={30} />
                        <p>{t('ستظهر طلبات العملاء هنا فور إرسالها من الموقع.', 'Customer requests will appear here when submitted.')}</p>
                        <span hidden />
                      </div>
                    )}
                  </Panel>
                </div>
              </>
            )}

            {tab === 'content' && (
              <>
                <Panel id="cms-section-home" title={t('الواجهة الرئيسية', 'Hero content')} description={t('تعديل النصوص العربية والإنجليزية للواجهة الرئيسية.', 'Edit each language. Text appears in its corresponding version.')}>
                  <Pair label={t('الشارة العلوية', 'Eyebrow')} value={draft.hero.badge} onChange={v => mutate(n => { n.hero.badge = v; })} />
                  <Pair label={t('العنوان الرئيسي', 'Main heading')} value={draft.hero.title} onChange={v => mutate(n => { n.hero.title = v; })} />
                  <Pair label={t('الجزء الملون من العنوان', 'Highlighted heading')} value={draft.hero.accent} onChange={v => mutate(n => { n.hero.accent = v; })} />
                  <Pair label={t('الوصف', 'Description')} value={draft.hero.description} area onChange={v => mutate(n => { n.hero.description = v; })} />
                  <Pair label={t('نص زر التواصل', 'Primary button text')} value={draft.hero.cta} onChange={v => mutate(n => { n.hero.cta = v; })} />
                </Panel>

                <Panel id="cms-section-about" title={t('عن VIARA', 'About VIARA')}>
                  <Toggle label={t('عرض قسم من نحن', 'Show About section')} checked={draft.sections.about} onChange={v => mutate(n => { n.sections.about = v; })} />
                  <Pair label={t('العنوان', 'Heading')} value={draft.about.title} onChange={v => mutate(n => { n.about.title = v; })} />
                  <Pair label={t('التعريف', 'Description')} value={draft.about.body} area onChange={v => mutate(n => { n.about.body = v; })} />
                </Panel>

                <Panel id="cms-section-faq" title={t('الأسئلة الشائعة', 'Frequently asked questions')}>
                  <div className="cms-accordion-list">
                    {draft.faqs.map((f, i) => (
                      <details key={f.id}>
                        <summary>
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          <b>{txt(f.question, locale) || t('سؤال جديد', 'New question')}</b>
                          <ChevronDown size={16} />
                        </summary>
                        <div>
                          <Pair label={t('السؤال', 'Question')} value={f.question} onChange={v => mutate(n => { n.faqs[i].question = v; })} />
                          <Pair label={t('الإجابة', 'Answer')} value={f.answer} area onChange={v => mutate(n => { n.faqs[i].answer = v; })} />
                          <button type="button" className="cms-secondary danger" onClick={() => mutate(n => { n.faqs.splice(i, 1); })}>
                            <Trash2 size={14} />{t('حذف السؤال', 'Remove question')}
                          </button>
                        </div>
                      </details>
                    ))}
                  </div>
                  <button type="button" className="cms-secondary" disabled={draft.faqs.length >= 20} onClick={() => mutate(n => { n.faqs.push({ id: crypto.randomUUID(), question: L('', ''), answer: L('', '') }); })}>
                    <Plus size={15} />{t('إضافة سؤال', 'Add question')}
                  </button>
                </Panel>

                <Panel id="cms-section-journey" title={t('مراحل رحلة الرعاية', 'Care journey stages')} description={t('تتحكم هذه النصوص في صفحة الرحلات. روابط الأنظمة والأيقونات تظل ثابتة لضمان صحة التنقل.', 'These fields control the journey page copy. System links and icons stay fixed to preserve navigation.')}>
                  <div className="cms-accordion-list">
                    {draft.journeys.map((journey, i) => (
                      <details key={i}>
                        <summary>
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          <b>{txt(journey.title, locale) || t('مرحلة جديدة', 'Journey stage')}</b>
                          <ChevronDown size={16} />
                        </summary>
                        <div>
                          <Pair label={t('عنوان المرحلة', 'Stage title')} value={journey.title} onChange={v => mutate(n => { n.journeys[i].title = v; })} />
                          <Pair label={t('الوصف', 'Description')} value={journey.description} area onChange={v => mutate(n => { n.journeys[i].description = v; })} />
                          <Pair label={t('الفرق المعنية', 'Teams involved')} value={journey.team} onChange={v => mutate(n => { n.journeys[i].team = v; })} />
                          <Pair label={t('السؤال الإرشادي', 'Guiding question')} value={journey.question} area onChange={v => mutate(n => { n.journeys[i].question = v; })} />
                        </div>
                      </details>
                    ))}
                  </div>
                </Panel>

                <Panel id="cms-section-metrics" title={t('مؤشرات الصفحة الرئيسية', 'Homepage metrics')} description={t('تحقق من دقة كل رقم ومصدره قبل نشره؛ هذه مؤشرات تسويقية تظهر للزوار.', 'Verify every figure and its source before publishing; these are public-facing marketing claims.')}>
                  {draft.metrics.map((metric, i) => (
                    <div key={i}>
                      <Pair label={t(`قيمة المؤشر ${i + 1}`, `Metric ${i + 1} value`)} value={metric.value} onChange={v => mutate(n => { n.metrics[i].value = v; })} />
                      <Pair label={t('التسمية', 'Label')} value={metric.label} onChange={v => mutate(n => { n.metrics[i].label = v; })} />
                    </div>
                  ))}
                </Panel>
              </>
            )}

            {tab === 'company' && <Panel title={t('بيانات الشركة وصفحة عنا', 'Company information & About page')}><CompanyEditor value={draft.company} locale={locale} onChange={v => mutate(n => { n.company = v; })} /></Panel>}
            {tab === 'copy' && <Panel title={t('نصوص جميع الصفحات', 'All page text')} description={t('ابحث باسم الصفحة أو النص. الأنظمة وبيانات الشركة والباقات لها حقول مستقلة.', 'Search by page or text. Systems, company information and packages have dedicated editors.')}><CopyEditor value={draft.copy} locale={locale} onChange={v => mutate(n => { n.copy = v; })} /></Panel>}
            {tab === 'products' && (
              <>
                <Panel id="cms-section-systems" title={t('حلول الأشعة والمراكز الطبية', 'Radiology & medical center systems')} description={t('إدارة محتوى RIS وPACS وCMS الظاهر للزوار.', 'Manage visitor-facing RIS, PACS and CMS content.')}>
                  <div className="cms-accordion-list">
                    {draft.products.map((p, i) => marketingSystemIds.includes(p.id) && (
                      <details key={p.id} open={i === 0}>
                        <summary>
                          <span>{p.id}</span>
                          <b>{txt(p.name, locale)}</b>
                          <i className={p.enabled ? 'cms-state live' : 'cms-state'}>{p.enabled ? t('ظاهر', 'Visible') : t('مخفي', 'Hidden')}</i>
                          <ChevronDown size={16} />
                        </summary>
                        <div>
                          <Toggle label={t('عرض النظام على الموقع', 'Show this system')} checked={p.enabled} onChange={v => mutate(n => { n.products[i].enabled = v; })} />
                          <Pair label={t('اسم النظام', 'System name')} value={p.name} onChange={v => mutate(n => { n.products[i].name = v; })} />
                          <Pair label={t('عنوان التفاصيل', 'Detail heading')} value={p.headline} onChange={v => mutate(n => { n.products[i].headline = v; })} />
                          <Pair label={t('الوصف', 'Description')} value={p.description} area onChange={v => mutate(n => { n.products[i].description = v; })} />
                          <FeatureEditor label={t('مزايا النظام', 'System features')} value={p.features} onChange={v => mutate(n => { n.products[i].features = v; })} />
                          <label className="cms-company-field"><span>{t('صورة النظام — اختياري', 'System image — optional')}</span><input dir="ltr" value={p.image} maxLength={600} onChange={e => mutate(n => { n.products[i].image = e.target.value; })} /></label>
                          <Pair label={t('ملاحظة النطاق', 'Scope note')} value={p.note} onChange={v => mutate(n => { n.products[i].note = v; })} />
                        </div>
                      </details>
                    ))}
                  </div>
                </Panel>

                <Panel id="cms-section-facilities" title={t('مجالات الأشعة والمراكز الطبية', 'Radiology & medical center areas')}>
                  {draft.catalog.categories.map((c, i) => marketingCategories.some(item => item.id === c.id) && <Pair key={c.id} label={c.id} value={c.name} onChange={v => mutate(n => { n.catalog.categories[i].name = v; })} />)}
                  {draft.catalog.facilities.map((f, i) => marketingFacilityProfiles.some(item => item.id === f.id) && <details key={f.id} className="cms-copy-entry"><summary>{txt(f.name, locale)}</summary><Pair label={t('اسم نوع المركز', 'Center type')} value={f.name} onChange={v => mutate(n => { n.catalog.facilities[i].name = v; })} /><div className="cms-catalog-systems">{draft.products.filter(p => marketingSystemIds.includes(p.id)).map(p => <label key={p.id}><input type="checkbox" checked={f.systems.includes(p.id)} disabled={!f.systems.includes(p.id) && f.systems.filter(id => marketingSystemIds.includes(id)).length >= marketingSystemIds.length} onChange={e => mutate(n => { n.catalog.facilities[i].systems = e.target.checked ? [...f.systems, p.id] : f.systems.filter(id => id !== p.id); })} />{p.id}</label>)}</div></details>)}
                </Panel>
                <Panel id="cms-section-plans" title={t('الباقات والأسعار', 'Packages & pricing')} description={t('حدّث النطاق التجاري والأسعار المعتمدة فقط. الباقات لا تمنح صلاحيات RBAC؛ حدود الترخيص التقنية موضحة في صفحة التخطيط.', 'Edit commercial scope and approved prices only. Packages do not grant RBAC permissions; technical license limits are documented on the planning page.')}>
                  <div className="cms-accordion-list">
                    {draft.plans.map((p, i) => (
                      <details key={p.id}>
                        <summary>
                          <span>{p.label}</span>
                          <b>{txt(p.name, locale)}</b>
                          <ChevronDown size={16} />
                        </summary>
                        <div>
                          <div className="cms-inline">
                            <Toggle label={t('عرض الباقة', 'Show package')} checked={p.enabled} onChange={v => mutate(n => { n.plans[i].enabled = v; })} />
                            <Toggle label={t('تمييز الباقة', 'Highlight package')} checked={p.featured} onChange={v => mutate(n => { n.plans[i].featured = v; })} />
                          </div>
                          <Pair label={t('اسم الباقة', 'Package name')} value={p.name} onChange={v => mutate(n => { n.plans[i].name = v; })} />
                          <label className="cms-field">{t('الرمز العلوي', 'Eyebrow label')}
                            <input value={p.label} maxLength={220} onChange={e => mutate(n => { n.plans[i].label = e.target.value; })} />
                          </label>
                          <Pair label={t('وصف الباقة', 'Package description')} value={p.description} onChange={v => mutate(n => { n.plans[i].description = v; })} />
                          <Pair label={t('نص التسعير', 'Pricing text')} value={p.price} onChange={v => mutate(n => { n.plans[i].price = v; })} />
                          <FeatureEditor label={t('مزايا الباقة', 'Package features')} value={p.features} onChange={v => mutate(n => { n.plans[i].features = v; })} />
                        </div>
                      </details>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {tab === 'offers' && (
              <Panel title={t('إدارة العروض والفرص', 'Offer management')} description={t('تحديد العروض الخاصة وتاريخ انتهائها.', 'Publish real offers. Offers expire at the end of the selected date in Cairo time.')}>
                <Toggle label={t('عرض قسم العروض', 'Show offers section')} checked={draft.sections.offers} onChange={v => mutate(n => { n.sections.offers = v; })} />
                {!draft.offers.length && (
                  <div className="cms-empty">
                    <Gift size={33} />
                    <p>{t('لا توجد عروض بعد. أضف عرضك الأول ببياناته الفعلية.', 'No offers yet. Add your first offer with its actual details.')}</p>
                  </div>
                )}
                <div className="cms-accordion-list">
                  {draft.offers.map((o, i) => (
                    <details key={o.id} open>
                      <summary>
                        <span><Gift size={18} /></span>
                        <b>{txt(o.title, locale) || t('عرض جديد', 'New offer')}</b>
                        <i className={o.active ? 'cms-state live' : 'cms-state'}>
                          {o.active ? (isOfferActive(o) ? t('نشط', 'Active') : t('منتهي', 'Expired')) : t('مسودة', 'Draft')}
                        </i>
                        <ChevronDown size={16} />
                      </summary>
                      <div>
                        <Toggle label={t('تفعيل العرض', 'Enable offer')} checked={o.active} onChange={v => mutate(n => { n.offers[i].active = v; })} />
                        <Pair label={t('عنوان العرض', 'Offer title')} value={o.title} onChange={v => mutate(n => { n.offers[i].title = v; })} />
                        <Pair label={t('الوصف والشروط', 'Description & conditions')} value={o.description} area onChange={v => mutate(n => { n.offers[i].description = v; })} />
                        <Pair label={t('الشارة', 'Badge text')} value={o.badge} onChange={v => mutate(n => { n.offers[i].badge = v; })} />
                        <div className="cms-grid-fields">
                          <label className="cms-field">{t('تاريخ الانتهاء — اختياري', 'End date — optional')}
                            <input type="date" value={o.endDate} onChange={e => mutate(n => { n.offers[i].endDate = e.target.value; })} />
                          </label>
                          <label className="cms-field">{t('الباقة المرتبطة', 'Related package')}
                            <select value={o.plan} onChange={e => mutate(n => { n.offers[i].plan = e.target.value as typeof o.plan; })}>
                              <option value="لم أحدد بعد">{t('أي باقة', 'Any package')}</option>
                              {draft.plans.map(p => <option key={p.id} value={p.id}>{txt(p.name, locale)}</option>)}
                            </select>
                          </label>
                        </div>
                        <button type="button" className="cms-secondary danger" onClick={() => mutate(n => { n.offers.splice(i, 1); })}>
                          <Trash2 size={14} />{t('حذف العرض', 'Remove offer')}
                        </button>
                      </div>
                    </details>
                  ))}
                </div>
                <button
                  type="button"
                  className="cms-secondary"
                  disabled={draft.offers.length >= 20}
                  onClick={() => mutate(n => {
                    n.offers.push({ id: crypto.randomUUID(), title: L('', ''), description: L('', ''), badge: L('عرض خاص', 'SPECIAL OFFER'), endDate: '', active: false, plan: 'لم أحدد بعد' });
                  })}
                >
                  <Plus size={16} />{t('إضافة عرض', 'Add offer')}
                </button>
              </Panel>
            )}

            {tab === 'settings' && (
              <>
                <Panel id="cms-section-brand" title={t('الهوية البصرية', 'Brand identity')}>
                  <div className="cms-logo-editor">
                    <div><img src={draft.brand.logo} alt={draft.brand.name} width={96} height={84} loading="lazy" /></div>
                    <label className="cms-secondary">
                      {uploading ? <LoaderCircle size={16} className="spin" /> : <Upload size={16} />}
                      {t('رفع شعار', 'Upload logo')}
                      <input hidden type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} />
                    </label>
                    <small>PNG, JPEG, WebP · 3 MB</small>
                  </div>
                  <div className="cms-grid-fields">
                    <label className="cms-field">{t('الاسم التجاري', 'Brand name')}
                      <input value={draft.brand.name} maxLength={35} onChange={e => mutate(n => { n.brand.name = e.target.value; })} />
                    </label>
                    <label className="cms-field">{t('اللون الأساسي', 'Primary color')}
                      <div className="cms-color">
                        <input type="color" value={draft.brand.primary} onChange={e => mutate(n => { n.brand.primary = e.target.value; })} />
                        <code>{draft.brand.primary}</code>
                      </div>
                    </label>
                  </div>
                  <label className="cms-field">{t('رابط الشعار', 'Logo URL')}
                    <input dir="ltr" value={draft.brand.logo} maxLength={600} onChange={e => mutate(n => { n.brand.logo = e.target.value; })} />
                  </label>
                  <Pair label={t('الجملة التعريفية', 'Brand tagline')} value={draft.brand.tagline} onChange={v => mutate(n => { n.brand.tagline = v; })} />
                </Panel>

                <Panel id="cms-section-imagery" title={t('صور الصفحة', 'Page photography')} description={t('صور توضيحية قابلة للاستبدال بصور منشأتك المعتمدة.', 'Replace these illustrative scenes with your approved photography.')}>
                  <div className="cms-scene-editors">
                    {(['hero', 'care'] as const).map(key => (
                      <div className="cms-scene-editor" key={key}>
                        <img src={draft.imagery[key]} alt={key === 'hero' ? t('الصورة الرئيسية', 'Hero image') : t('صورة الفريق', 'Team image')} width={640} height={427} loading="lazy" />
                        <label className="cms-field">
                          {key === 'hero' ? t('الصورة الرئيسية', 'Hero photography') : t('صورة قسم من نحن', 'About section photography')}
                          <input dir="ltr" value={draft.imagery[key]} maxLength={600} onChange={e => mutate(n => { n.imagery[key] = e.target.value; })} />
                        </label>
                        <label className="cms-secondary">
                          {uploading ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}
                          {t('استبدال الصورة', 'Replace image')}
                          <input hidden type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={e => { void upload(e.target.files?.[0], key); e.target.value = ''; }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel id="cms-section-contact" title={t('بيانات التواصل', 'Contact information')} description={t('بيانات التواصل المعروضة للزوار على الموقع.', 'Only configured channels are displayed.')}>
                  <div className="cms-grid-fields">
                    {([['email', t('البريد الإلكتروني', 'Email')], ['phone', t('الهاتف', 'Phone')], ['whatsapp', t('واتساب — رمز الدولة والرقم', 'WhatsApp — country code & number')]] as const).map(([key, label]) => (
                      <label className="cms-field" key={key}>{label}
                        <input dir="ltr" type={key === 'email' ? 'email' : 'tel'} value={draft.contact[key]} maxLength={key === 'email' ? 200 : 30} onChange={e => mutate(n => { n.contact[key] = e.target.value; })} />
                      </label>
                    ))}
                  </div>
                  <Pair label={t('العنوان — اختياري', 'Address — optional')} value={draft.contact.address} area onChange={v => mutate(n => { n.contact.address = v; })} />
                  <div className="cms-grid-fields">
                    {(['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'telegram', 'snapchat', 'github'] as const).map(key => (
                      <label className="cms-field" key={key}>{key.toUpperCase()}
                        <input type="url" dir="ltr" value={draft.contact[key]} placeholder="https://…" maxLength={600} onChange={e => mutate(n => { n.contact[key] = e.target.value; })} />
                      </label>
                    ))}
                  </div>
                </Panel>

                <Panel id="cms-section-seo" title={t('بيانات محركات البحث', 'Search engine metadata')}>
                  <Pair label={t('عنوان الموقع', 'Page title')} value={draft.seo.title} onChange={v => mutate(n => { n.seo.title = v; })} />
                  <Pair label={t('وصف الموقع', 'Page description')} value={draft.seo.description} area onChange={v => mutate(n => { n.seo.description = v; })} />
                </Panel>
              </>
            )}

            {tab === 'reviews' && (
              <>
                <Panel id="cms-section-moderation" title={t('آراء العملاء ومراجعتها', 'Customer reviews & moderation')} description={t('النشر والإخفاء يحدثان فورًا. الآراء المنشورة فقط تظهر للزوار.', 'Publishing and hiding take effect immediately. Only approved reviews appear to visitors.')}>
                  <Toggle label={t('عرض قسم آراء العملاء', 'Show reviews section')} checked={draft.sections.reviews} onChange={v => mutate(n => { n.sections.reviews = v; })} />
                  <div className="cms-toolbar">
                    <span>{reviews.length} {t('رأي ضمن السجل', 'reviews in record')}</span>
                    <button type="button" className="cms-secondary" onClick={loadLists} disabled={loading}>
                      <RefreshCw size={14} />{t('تحديث', 'Refresh')}
                    </button>
                    {!reviews.length && (
                      <span hidden />
                    )}
                  </div>
                  {loading ? (
                    <div className="cms-empty"><LoaderCircle className="spin" /></div>
                  ) : reviewError ? (
                    <div className="cms-empty">
                      {reviewError}
                      <button type="button" className="cms-secondary" onClick={loadLists}>{t('إعادة المحاولة', 'Retry')}</button>
                    </div>
                  ) : !reviews.length ? (
                    <div className="cms-empty">
                      <MessageSquare size={32} />
                      <p>{t('لا توجد آراء بعد. ستظهر التقييمات الجديدة هنا للمراجعة.', 'No reviews yet. New submissions will appear here for moderation.')}</p>
                      <span hidden />
                    </div>
                  ) : (
                    <div className="cms-reviews">
                      {reviews.map(r => (
                        <article key={r.id}>
                          <div>
                            <span className={`cms-state ${r.status === 'approved' ? 'live' : ''}`}>
                              {r.status === 'approved' ? t('منشور', 'Published') : r.status === 'pending' ? t('قيد المراجعة', 'Pending') : t('مخفي', 'Hidden')}
                            </span>
                            <span className="cms-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                          </div>
                          <blockquote lang={r.locale} dir={r.locale === 'ar' ? 'rtl' : 'ltr'}>{r.quote}</blockquote>
                          <b>{r.name}</b>
                          <small>{[r.role, r.organization].filter(Boolean).join(' · ')}</small>
                          <label className="cms-field">{t('النظام المرتبط بالرأي', 'System reviewed')}<select value={r.systemId || ''} disabled={!!actionBusy} onChange={event => reviewAction(r, r.status, event.target.value)}><option value="">{t('رأي عام عن VIARA', 'General VIARA review')}</option>{healthcareSystems.filter(system => marketingSystemIds.includes(system.id)).map(system => <option value={system.id} key={system.id}>{txt(system.name, locale)}</option>)}</select></label>
                          <div className="cms-review-actions">
                            <button type="button" className="cms-secondary" disabled={!!actionBusy || r.status === 'approved'} onClick={() => reviewAction(r, 'approved')}>
                              <CheckCircle2 size={14} />{t('نشر الرأي', 'Publish')}
                            </button>
                            <button type="button" className="cms-secondary" disabled={!!actionBusy || r.status === 'rejected'} onClick={() => reviewAction(r, 'rejected')}>
                              {t('إخفاء', 'Hide')}
                            </button>
                            <button type="button" className="cms-icon danger" disabled={!!actionBusy} onClick={() => reviewAction(r, 'delete')} aria-label={t('حذف الرأي', 'Delete review')}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel id="cms-section-add-review" title={t('إضافة رأي بموافقة العميل', 'Add a review with customer consent')} description={t('أدخل تقييمًا معتمدًا ومصرحًا بنشره من العميل.', 'Enter an authentic review with customer permission to publish.')}>
                  <form onSubmit={addReview}>
                    <div className="cms-grid-fields">
                      <label className="cms-field">{t('اسم العميل', 'Customer name')} *
                        <input required minLength={2} maxLength={100} value={manual.name} onChange={e => setManual({ ...manual, name: e.target.value })} />
                      </label>
                      <label className="cms-field">{t('المسمى الوظيفي', 'Role')}
                        <input maxLength={100} value={manual.role} onChange={e => setManual({ ...manual, role: e.target.value })} />
                      </label>
                      <label className="cms-field">{t('المؤسسة', 'Organization')}
                        <input maxLength={150} value={manual.organization} onChange={e => setManual({ ...manual, organization: e.target.value })} />
                      </label>
                      <label className="cms-field">{t('لغة الرأي', 'Review language')}
                        <select value={manual.locale} onChange={e => setManual({ ...manual, locale: e.target.value })}>
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                        </select>
                      </label>
                      <label className="cms-field">{t('النظام المرتبط بالرأي', 'System reviewed')}
                        <select value={manual.systemId} onChange={event => setManual({ ...manual, systemId: event.target.value })}>
                          <option value="">{t('رأي عام عن VIARA', 'General VIARA review')}</option>
                          {healthcareSystems.filter(system => marketingSystemIds.includes(system.id)).map(system => <option value={system.id} key={system.id}>{txt(system.name, locale)}</option>)}
                        </select>
                      </label>
                      <label className="cms-field">{t('التقييم', 'Rating')}
                        <select value={manual.rating} onChange={e => setManual({ ...manual, rating: Number(e.target.value) })}>
                          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="cms-field">{t('نص الرأي', 'Review text')} *
                      <textarea required minLength={10} maxLength={1500} rows={4} lang={manual.locale} dir={manual.locale === 'ar' ? 'rtl' : 'ltr'} value={manual.quote} onChange={e => setManual({ ...manual, quote: e.target.value })} />
                    </label>
                    <label className="cms-consent">
                      <input type="checkbox" required checked={manual.consent} onChange={e => setManual({ ...manual, consent: e.target.checked })} />
                      {t('أؤكد أن الرأي حقيقي وأن العميل وافق على نشر اسمه ومؤسسته ورأيه.', 'I confirm the review is authentic and the customer has agreed to publication of their name, organization and review.')}
                    </label>
                    <button type="submit" className="cms-publish" disabled={!!actionBusy}>
                      {actionBusy === 'manual' ? <LoaderCircle size={16} className="spin" /> : <Plus size={16} />}
                      {t('حفظ ونشر الرأي', 'Save & publish review')}
                    </button>
                  </form>
                </Panel>
              </>
            )}

            {tab === 'leads' && (
              <Panel title={t('صندوق طلبات العملاء (CRM Inbox)', 'Customer request inbox')} description={t('تصفية ومتابعة طلبات العروض الواردة، والتواصل المباشر مع مدراء المراكز.', 'Filter, export and update customer proposals. Communicate directly via WhatsApp or Email.')}>
                <div className="cms-toolbar">
                  <label className="cms-search">
                    <Search size={17} />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('بحث بالاسم أو المركز أو البريد أو الهاتف', 'Search name, organization, email or phone')} />
                  </label>
                  <select className="cms-filter" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="all">{t('كل الحالات', 'All statuses')}</option>
                    {Object.entries(statuses).map(([id, label]) => (
                      <option value={id} key={id}>{label[locale]}</option>
                    ))}
                  </select>
                  <span role="status" aria-live="polite">
                    {t(`عرض ${visibleLeads.length} من ${leads.length}`, `Showing ${visibleLeads.length} of ${leads.length}`)}
                  </span>
                  {(normalizedQuery || status !== 'all') && (
                    <button type="button" className="cms-secondary" onClick={() => { setQuery(''); setStatus('all'); }}>
                      {t('مسح التصفية', 'Clear filters')}
                    </button>
                  )}
                  <button type="button" className="cms-secondary" onClick={loadLists} disabled={loading}>
                    <RefreshCw size={14} />{t('تحديث', 'Refresh')}
                  </button>
                  <button type="button" className="cms-secondary" onClick={exportLeads} disabled={!leads.length}>
                    <Download size={14} />CSV
                  </button>
                </div>

                {loading ? (
                  <div className="cms-empty"><LoaderCircle className="spin" /></div>
                ) : leadError ? (
                  <div className="cms-empty">
                    {leadError}
                    <button type="button" className="cms-secondary" onClick={loadLists}>{t('إعادة المحاولة', 'Retry')}</button>
                  </div>
                ) : visibleLeads.length ? (
                  <div className="cms-leads">
                    {visibleLeads.map(l => (
                      <details key={l.id}>
                        <summary>
                          <span className="cms-lead-avatar">{l.organization.slice(0, 1)}</span>
                          <div>
                            <b>{l.organization}</b>
                            <small>{l.name} · {new Date(l.createdAt).toLocaleDateString(en ? 'en-GB' : 'ar-EG', { timeZone: 'Africa/Cairo' })} · {l.phone}</small>
                          </div>
                          <span className={`cms-state ${l.status === 'new' ? 'live' : ''}`}>
                            {statuses[l.status as keyof typeof statuses]?.[locale] || l.status}
                          </span>
                          <ChevronDown size={16} />
                        </summary>

                        <div className="cms-lead-detail">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <code dir="ltr">VR-{l.id.slice(0, 8).toUpperCase()}</code>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <a
                                href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cms-secondary"
                                style={{ color: '#166534', borderColor: '#86efac', background: '#f0fdf4' }}
                              >
                                <MessageCircle size={14} />
                                {t('محادثة واتساب', 'WhatsApp')}
                              </a>
                              <button
                                type="button"
                                className="cms-secondary"
                                onClick={() => copyToClipboard(`${l.name} | ${l.organization} | ${l.phone} | ${l.email}`, l.id)}
                              >
                                {copyNotice === l.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                {copyNotice === l.id ? t('تم النسخ ✓', 'Copied ✓') : t('نسخ البيانات', 'Copy info')}
                              </button>
                            </div>
                          </div>

                          <dl>
                            <dt>{t('الاسم', 'Name')}</dt>
                            <dd>{l.name}</dd>
                            <dt>{t('المؤسسة', 'Organization')}</dt>
                            <dd><b>{l.organization}</b></dd>
                            <dt>{t('البريد', 'Email')}</dt>
                            <dd><a href={`mailto:${l.email}`} dir="ltr">{l.email}</a></dd>
                            <dt>{t('الهاتف', 'Phone')}</dt>
                            <dd><a href={`tel:${l.phone}`} dir="ltr">{l.phone}</a></dd>
                            <dt>{t('نوع المنشأة', 'Facility')}</dt>
                            <dd>{choiceLabel(l.facility, locale)} · {choiceLabel(l.branches, locale)}</dd>
                            <dt>{t('النظام والباقة', 'System & package')}</dt>
                            <dd>{l.interest} · {draft.plans.find(p => p.id === l.plan) ? txt(draft.plans.find(p => p.id === l.plan)!.name, locale) : choiceLabel(l.plan, locale)}</dd>
                            {l.offer && (
                              <>
                                <dt>{t('العرض المختار', 'Offer')}</dt>
                                <dd>{l.offer}</dd>
                              </>
                            )}
                            <dt>{t('الاحتياجات', 'Requirements')}</dt>
                            <dd>{l.message || '—'}</dd>
                          </dl>

                          <label className="cms-field">{t('تحديث حالة الطلب والمتابعة', 'Update request status')}
                            <select value={l.status} disabled={actionBusy === l.id} onChange={e => leadStatus(l.id, e.target.value)}>
                              {Object.entries(statuses).map(([id, label]) => (
                                <option value={id} key={id}>{label[locale]}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <div className="cms-empty">
                    <Mail size={32} />
                    <p>{t('لا توجد طلبات تطابق معايير البحث.', 'No matching requests found.')}</p>
                    <span hidden />
                  </div>
                )}
              </Panel>
            )}
          </fieldset>

          <div className="cms-bottom-note">
            <ShieldCheck size={15} />
            {t('تعديلات النصوص والإعدادات تحتاج «حفظ ونشر». تحديث حالات الطلبات والآراء فوري.', 'Content and settings need Save & publish. Request statuses and review moderation update immediately.')}
          </div>
        </main>
      </div>
    </div>
  );
}
