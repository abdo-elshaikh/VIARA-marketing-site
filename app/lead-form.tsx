'use client';
import Link from 'next/link';
import { useSiteText } from '../lib/site-copy';
import { useState, useEffect, useRef, useId, type FormEvent } from 'react';
import { CalendarDays, ArrowUpLeft, ArrowUpRight, LoaderCircle, Download, CheckCircle2, X, ChevronDown, ExternalLink, AlertCircle } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { branchBand, formatScopeSummary, formatInquiryMessage, type ScopeEstimate } from '../lib/inquiry';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import './lead-form.css';
import { trackMarketingEvent } from '../lib/marketing-analytics';

export default function LeadForm({
  locale,
  content,
  interest,
  setInterest,
  plan,
  setPlan,
  offer,
  setOffer,
  scope,
  setScope,
  requestedSystems,
  clearRequestedSystems,
  requestedFacility,
  onEditScope,
  onPrivacy
}: {
  locale: Locale;
  content: SiteContent;
  interest: string;
  setInterest: (s: string) => void;
  plan: string;
  setPlan: (s: string) => void;
  offer: string;
  setOffer: (s: string) => void;
  scope: ScopeEstimate | null;
  setScope: (scope: ScopeEstimate | null) => void;
  requestedSystems: string[];
  clearRequestedSystems: () => void;
  requestedFacility: string;
  onEditScope?: () => void;
  onPrivacy: () => void;
}) {
  const en = locale === 'en';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const formId = useId();
  const errorId = `${formId}-error`;
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const [state, setState] = useState('idle');
  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
  }, [state]);
  const [error, setError] = useState('');
  const invalidFields = useRef<string[]>([]);
  const [reference, setReference] = useState('');
  const [receipt, setReceipt] = useState('');
  const inquiryTracked = useRef(false);
  const handleInteraction = () => {
    if (!inquiryTracked.current) {
      inquiryTracked.current = true;
      trackMarketingEvent('start_inquiry', { locale });
    }
  };

  function markInvalid(fields: string[]) {
    invalidFields.current = fields;
    const form = formRef.current;
    if (!form) return;
    let first: HTMLElement | null = null;
    for (const name of fields) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLElement) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorId);
        const details = field.closest('details');
        if (details) details.open = true;
        first ||= field;
      }
    }
    requestAnimationFrame(() => {
      const details = first?.closest('details');
      if (details) details.open = true;
      first?.focus();
    });
  }

  function clearInvalid() {
    invalidFields.current = [];
    const form = formRef.current;
    if (!form) return;
    for (const field of Array.from(form.elements)) {
      if (field instanceof HTMLElement) { field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby'); }
    }
  }

  const systems = [
    ...content.products.filter(p => p.enabled && marketingSystemIds.includes(p.id)).map(p => ({ id: p.id, label: txt(p.name, locale) })),
   { id: 'SUITE', label: t('الحل المتكامل', 'Integrated solution') },
    { id: 'CONSULT', label: t('مساعدة في اختيار النظام', 'Help me choose a system') }
  ];

  useEffect(() => {
    const facility = formRef.current?.elements.namedItem('facility');
    const labels: Record<string,string> = {medical:'مركز طبي',radiology:'مركز أشعة',network:'مجموعة فروع'};
    if (requestedFacility && labels[requestedFacility] && facility instanceof HTMLSelectElement) facility.value = labels[requestedFacility];
  }, [requestedFacility, requestedSystems]);

  useEffect(() => {
    if (!scope) return;
    const branches = formRef.current?.elements.namedItem('branches');
    const facility = formRef.current?.elements.namedItem('facility');
    if (branches instanceof HTMLSelectElement) branches.value = branchBand(scope.branches);
    if (facility instanceof HTMLSelectElement) facility.value = scope.branches > 1 ? 'مجموعة فروع' : 'مركز أشعة';
  }, [scope]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = sessionStorage.getItem('viara-request-draft');
        if (!raw) return;
        const draft = JSON.parse(raw);
        const validInterest = draft.interest === 'SUITE' || draft.interest === 'CONSULT' ||
          content.products.some(product => product.enabled && marketingSystemIds.includes(product.id) && product.id === draft.interest);
        if (draft.interest && validInterest) setInterest(draft.interest);
        if (draft.plan && (draft.plan === 'لم أحدد بعد' || content.plans.some(item => item.enabled && item.id === draft.plan))) setPlan(draft.plan);
        if (draft.offer) setOffer(draft.offer);
        for (const [key, value] of Object.entries(draft)) {
          if (key === 'interest' || key === 'plan') continue;
          const f = formRef.current?.elements.namedItem(key);
          if (f instanceof HTMLInputElement || f instanceof HTMLSelectElement || f instanceof HTMLTextAreaElement) {
            if (f instanceof HTMLInputElement && f.type === 'checkbox') f.checked = value === true;
            else f.value = String(value);
          }
        }
        sessionStorage.removeItem('viara-request-draft');
      } catch {
        // Ignore draft read errors
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [content.plans, content.products, setInterest, setOffer, setPlan]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    setError('');

    const f = new FormData(event.currentTarget);
    const data = {
      ...Object.fromEntries(f),
      id: id.current || (id.current = crypto.randomUUID()),
      interest,
      plan,
      offer,
      scope: scope || undefined,
      systems: requestedSystems,
      branches: scope ? branchBand(scope.branches) : String(f.get('branches')),
      locale,
      consent: f.get('consent') === 'on'
    };

    try {
      const response = await fetch(`/api/inquiries?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json() as { reference?: string; error?: string; fields?: string[] };
      if (!response.ok) {
        if (Array.isArray(result.fields) && result.fields.length) markInvalid(result.fields);
        throw new Error(
          result.error ||
          (en
            ? (response.status === 429 ? 'You have reached the request limit. Please try later.' : 'We could not save your request. Check your details and try again.')
            : 'تعذر حفظ طلبك. حاول مجددًا.')
        );
      }
      if (!result.reference) {
        throw new Error(t('لم يتم تأكيد الحفظ. حاول مجددًا.', 'Saving was not confirmed. Please try again.'));
      }
      clearInvalid();
      setReference(result.reference);
      setReceipt(
        `${content.brand.name} — ${result.reference}\n` +
        `${String(f.get('name'))}\n` +
        `${String(f.get('organization'))}\n` +
        `${String(f.get('email'))}\n` +
        `${String(f.get('phone'))}\n` +
        `${systems.find(s => s.id === interest)?.label}\n` +
        `${content.plans.find(p => p.id === plan) ? txt(content.plans.find(p => p.id === plan)!.name, locale) : plan}\n` +
        `${offer ? (locale === 'ar' ? `العرض المختار: ${offer}\n` : `Selected Offer: ${offer}\n`) : ''}` +
        `${formatInquiryMessage(String(f.get('message') || ''), scope || undefined, locale, requestedSystems)}\n`
      );
      setState('success');
      trackMarketingEvent('submit_inquiry_success', { locale, product: interest });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('حدث خطأ. حاول مجددًا.', 'Something went wrong. Try again.'));
      setState('error');
      trackMarketingEvent('submit_inquiry_failure', { locale, product: interest });
    }
  }

  function download() {
    trackMarketingEvent('download_request_receipt', { locale });
    const url = URL.createObjectURL(new Blob(['\uFEFF' + receipt], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reference}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (state === 'success') {
    return <div className="vf-success" role="status" ref={successRef} tabIndex={-1}>
      <span className="vf-success-icon"><CheckCircle2 size={35} strokeWidth={1.5} /></span>
      <span className="vf-kicker">{t('تم استلام طلبك', 'REQUEST RECEIVED')}</span>
      <h3>{t('خطوتك التالية أصبحت واضحة.', 'Your next step is in motion.')}</h3>
      <p>{t('حُفظ طلبك للمراجعة والتواصل عبر البيانات التي أدخلتها. إرسال الطلب لا يؤكد موعدًا تلقائيًا.', 'Your request is saved for review and follow-up using the details you provided. Submitting it does not automatically confirm an appointment.')}</p>
      <div className="vf-reference"><span>{t('الرقم المرجعي لطلبك', 'YOUR REQUEST REFERENCE')}</span><strong dir="ltr">{reference}</strong></div>
      <div className="vf-success-actions"><Link className="care-btn" href={en ? '/en/requests' : '/requests'}>{t('متابعة الطلب', 'Track your request')}<Arrow size={17} /></Link><button type="button" onClick={download}><Download size={16} />{t('تنزيل ملخص الطلب', 'Download summary')}</button></div>
      <p className="vf-success-note">{t('احتفظ بالرقم المرجعي. ترتبط متابعة الطلب بهذا المتصفح ما دامت بيانات الموقع محفوظة.', 'Keep your reference. Request tracking is linked to this browser while its site data is retained.')}</p>
      <button className="vf-new-request" type="button" onClick={() => { setState('idle'); setError(''); setScope(null); clearRequestedSystems(); id.current = crypto.randomUUID(); requestAnimationFrame(() => { const field = formRef.current?.elements.namedItem('name'); if (field instanceof HTMLElement) field.focus(); }); }}>{t('إنشاء طلب جديد', 'Start a new request')}</button>
    </div>;
  }

  const selectedPlanObj = content.plans.find(p => p.enabled && p.id === plan);
  const sending = state === 'sending';
  const hasContext = Boolean(selectedPlanObj || offer || scope || requestedSystems.length);

  return <form className="vf-form" ref={formRef} onSubmit={submit} aria-busy={sending} aria-labelledby={`${formId}-title`} onFocusCapture={handleInteraction} onInput={clearInvalid}>
    <header className="vf-heading"><div><h3 id={`${formId}-title`}>{t('ابدأ بجلسة تحليل لفريقك', 'Start with a workflow review')}</h3><p>{t('شاركنا صورة عامة عن منشأتك؛ نراجع احتياجك ثم نحدد العرض المناسب. الحقول * مطلوبة، والتفاصيل الإضافية اختيارية.', 'Share a general view of your facility. We review your needs first, then define the right demonstration. Fields marked * are required; additional details are optional.')}</p></div><span className="vf-heading-icon" aria-hidden="true"><CalendarDays size={21} strokeWidth={1.5} /></span></header>

    <fieldset className="vf-body" disabled={sending}>
      <legend className="vf-sr-only">{t('بيانات جلسة التحليل', 'Workflow review details')}</legend>
      {hasContext && <section className="vf-context" aria-label={t('اختيارات مرفقة بطلبك', 'Selections included in your request')}>
        <span className="vf-context-label">{t('مرفق بطلبك', 'INCLUDED IN YOUR REQUEST')}</span>
        {requestedSystems.length > 0 && <div className="vf-context-card"><div className="vf-context-top"><h4>{t('الأنظمة المختارة', 'Selected systems')}</h4><button type="button" className="vf-remove" onClick={clearRequestedSystems} aria-label={t('إزالة الأنظمة المختارة', 'Remove selected systems')}><X size={16} /></button></div><ul className="vf-system-chips">{requestedSystems.map(systemId => <li key={systemId}><bdi>{systemId}</bdi><span>{systems.find(item => item.id === systemId)?.label || systemId}</span></li>)}</ul></div>}
        {selectedPlanObj && <div className="vf-context-card"><div className="vf-context-top"><h4>{t('الباقة المقترحة للمناقشة', 'Package to discuss')}</h4><button type="button" className="vf-remove" onClick={() => setPlan('لم أحدد بعد')} aria-label={t('إلغاء تحديد الباقة', 'Clear selected package')}><X size={16} /></button></div><strong>{txt(selectedPlanObj.name, locale)}</strong><p>{txt(selectedPlanObj.description, locale)}</p></div>}
        {offer && <div className="vf-context-card"><div className="vf-context-top"><h4>{t('العرض المختار', 'Selected offer')}</h4><button type="button" className="vf-remove" onClick={() => setOffer('')} aria-label={t('إلغاء اختيار العرض', 'Remove selected offer')}><X size={16} /></button></div><p>{offer}</p></div>}
        {scope && <div className="vf-context-card"><div className="vf-context-top"><h4>{t('تقدير أولي للأرشفة', 'Preliminary archive estimate')}</h4><button type="button" className="vf-remove" onClick={() => setScope(null)} aria-label={t('إزالة تقدير الحاسبة', 'Remove calculator estimate')}><X size={16} /></button></div><details className="vf-estimate"><summary>{t('راجع المدخلات والتقدير', 'Review inputs and estimate')}<ChevronDown size={14} /></summary><p>{formatScopeSummary(scope, locale)}</p></details><a className="vf-edit" href="#calculator" onClick={event => { if (onEditScope) { event.preventDefault(); onEditScope(); } }}>{t('تعديل التقدير', 'Edit estimate')}<Arrow size={14} /></a></div>}
      </section>}

      <fieldset className="vf-section"><legend className="vf-sr-only">{t('بيانات التواصل والمنشأة', 'Contact and facility details')}</legend><div className="vf-grid">
        <label>{t('الاسم الكامل', 'Full name')} <span className="vf-required" aria-hidden="true">*</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder={t('الاسم الذي تفضّل التواصل به', 'Your full name')} /></label>
        <label>{t('اسم المركز أو المؤسسة', 'Organization')} <span className="vf-required" aria-hidden="true">*</span><input name="organization" autoComplete="organization" minLength={2} maxLength={150} required placeholder={t('اسم منشأتك', 'Your facility name')} /></label>
        <label>{t('البريد الإلكتروني', 'Email address')} <span className="vf-required" aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" dir="ltr" maxLength={200} required placeholder="name@company.com" /></label>
        <label>{t('رقم التواصل', 'Phone number')} <span className="vf-required" aria-hidden="true">*</span><input name="phone" type="tel" autoComplete="tel" dir="ltr" minLength={7} maxLength={25} required placeholder={t('رقم الهاتف مع رمز الدولة', 'Phone number with country code')} /></label>
        <label>{t('نوع المنشأة', 'Facility type')} <span className="vf-required" aria-hidden="true">*</span><select name="facility" required defaultValue=""><option value="" disabled>{t('اختر نوع المنشأة', 'Choose facility type')}</option>{[['مركز أشعة','Radiology center'],['مركز طبي','Medical center'],['عيادات تخصصية','Specialty clinics'],['مجموعة فروع','Radiology / medical center group']].map(([ar,english]) => <option key={ar} value={ar}>{en ? english : ar}</option>)}</select></label>
        <label>{t('النظام الذي يهمك', 'System of interest')} <small className="vf-optional">{t('اختياري', 'Optional')}</small><select name="interest" value={interest} onChange={event => setInterest(event.target.value)}>{systems.map(system => <option key={system.id} value={system.id}>{system.label}</option>)}</select></label>
      </div></fieldset>

      <details className="vf-extra"><summary><span>{t('تفاصيل إضافية', 'Additional details')}<small>{t('اختياري', 'Optional')}</small></span><ChevronDown size={17} /></summary><div className="vf-grid">
        <label>{t('عدد الفروع', 'Number of branches')}<select name="branches" defaultValue="فرع واحد" onChange={() => setScope(null)}>{[['فرع واحد','One branch'],['2–5 فروع','2–5 branches'],['أكثر من 5 فروع','More than 5 branches']].map(([ar,english]) => <option key={ar} value={ar}>{en ? english : ar}</option>)}</select></label>
        <label>{t('الباقة المبدئية', 'Preferred package')}<select name="plan" value={plan} onChange={event => setPlan(event.target.value)}><option value="لم أحدد بعد">{t('لم أحدد بعد', 'Help me choose')}</option>{content.plans.filter(item => item.enabled).map(item => <option key={item.id} value={item.id}>{txt(item.name, locale)}</option>)}</select></label>
        <label className="vf-full">{t('ما الذي تريد تنظيمه أو تحسينه؟', 'What would you like to organize or improve?')}<textarea name="message" rows={3} maxLength={2000} placeholder={t('صف احتياج فريقك باختصار، دون بيانات مرضى.', 'Briefly describe your team’s needs without patient information.')} /></label>
      </div></details>

      <label className="vf-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="vf-consent"><input id={`${formId}-consent`} type="checkbox" name="consent" required /><div><label htmlFor={`${formId}-consent`}>{t('أوافق على معالجة بياناتي وربط الطلب بمعرّف هذا المتصفح، دون بيانات مرضى.', 'I agree to processing my details and linking this request to this browser’s identifier, without patient data.')}</label>{' '}<span className="vf-privacy-actions"><button type="button" onClick={onPrivacy}>{t('سياسة الخصوصية', 'Privacy policy')}</button><a href={en ? '/en/privacy' : '/privacy'} target="_blank" rel="noopener noreferrer" aria-label={t('فتح سياسة الخصوصية في نافذة جديدة', 'Open privacy policy in a new tab')} title={t('فتح الصفحة', 'Open page')}><ExternalLink size={13} /></a></span></div></div>
    </fieldset>

    {error && <div className="vf-error" id={errorId} role="alert"><AlertCircle size={18} /><span>{error}</span></div>}
    <button className="vf-submit" type="submit" disabled={sending}><span>{sending ? t('جارٍ حفظ طلبك…', 'Saving your request…') : t('إرسال طلب جلسة التحليل', 'Send workflow review request')}</span>{sending ? <LoaderCircle className="vf-spinner" size={19} /> : <Arrow size={19} />}</button>
    <p className="vf-fineprint">{t('إرسال الطلب لا يحجز موعدًا تلقائيًا ولا يرتب التزامًا بالتعاقد.', 'Submitting does not automatically book an appointment or create an obligation to purchase.')}</p>
  </form>;
}
