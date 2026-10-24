'use client';
import Link from 'next/link';
import { useSiteText } from '../lib/site-copy';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { CalendarDays, ArrowUpLeft, ArrowUpRight, LoaderCircle, Download, CheckCircle2, ShieldCheck, X, ChevronDown, Sparkles } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { branchBand, formatScopeSummary, formatInquiryMessage, type ScopeEstimate } from '../lib/inquiry';
import { formatSystemsSummary, marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import './forms.css';
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
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState(() => crypto.randomUUID());
  const [state, setState] = useState('idle');
  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
  }, [state]);
  const [error, setError] = useState('');
  const invalidFields = useRef<string[]>([]);
  const [reference, setReference] = useState('');
  const [receipt, setReceipt] = useState('');
  useEffect(() => { trackMarketingEvent('start_inquiry', { locale }); }, [locale]);

  function markInvalid(fields: string[]) {
    invalidFields.current = fields;
    const form = formRef.current;
    if (!form) return;
    let first: HTMLElement | null = null;
    for (const name of fields) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLElement) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', 'lead-form-error');
        const details = field.closest('details');
        if (details) details.open = true;
        first ||= field;
      }
    }
    first?.focus();
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
        if (draft.interest && systems.some(system => system.id === draft.interest)) setInterest(draft.interest);
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
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    setError('');

    const f = new FormData(event.currentTarget);
    const data = {
      ...Object.fromEntries(f),
      id: id || crypto.randomUUID(),
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
    return (
      <div className="form-success" role="status" ref={successRef} tabIndex={-1}>
        <span className="success-icon"><CheckCircle2 size={42} /></span>
        <h3>{t('تم حفظ طلبك بنجاح.', 'Your request is saved.')}</h3>
        <p>{t('تم تسجيل طلبك للمراجعة والتواصل عبر البيانات التي أدخلتها. احتفظ بالرقم المرجعي؛ يمكنك مراجعة الطلب من هذا المتصفح ما دامت بيانات الموقع محفوظة، وإرسال الطلب لا يؤكد موعدًا تلقائيًا.', 'Your request has been recorded for review and follow-up using your contact details. Keep your reference number; you can review this request in this browser while its site data is retained, and submitting a request does not automatically book an appointment.')}</p>
        <strong dir="ltr">{reference}</strong>
        <button type="button" className="button" onClick={download}>
          <Download size={17} />
          {t('تنزيل ملخص الطلب', 'Download request summary')}
        </button>
        <Link className="text-link" href={en ? '/en/requests' : '/requests'}>
          {t('مراجعة طلباتي', 'View my requests')}
          <Arrow size={17} />
        </Link>
        <button
          className="plain-button"
          type="button"
          onClick={() => {
            setState('idle');
            setScope(null);
            clearRequestedSystems();
            setId(crypto.randomUUID());
          }}
        >
          {t('إنشاء طلب جديد', 'Start a new request')}
        </button>
      </div>
    );
  }

  const selectedPlanObj = content.plans.find(p => p.id === plan);

  return (
    <form ref={formRef} onSubmit={submit} aria-busy={state === 'sending'} onInput={clearInvalid}>
      <div className="form-heading">
        <span className="form-icon"><CalendarDays size={22} /></span>
        <div>
          <h3>
            {selectedPlanObj
              ? t(`طلب مناقشة باقة ${txt(selectedPlanObj.name, locale)}`, `Discuss the ${txt(selectedPlanObj.name, locale)} package`)
              : t('اطلب عرضاً توضيحياً', 'Book a demonstration')}
          </h3>
          <p>
            {selectedPlanObj
              ? t('راجعنا تفاصيل الباقة المبدئية؛ سنناقش معك نطاق العمل والتجهيز بما يلائم منشأتك.', 'We noted your selected tier; we will tailor the rollout scope to your facility.')
              : t('ابدأ ببيانات التواصل؛ تفاصيل الأنظمة اختيارية.', 'Start with your contact details; system details are optional.')}
          </p>
        </div>
      </div>
      {selectedPlanObj && (
        <div className="selected-plan-badge" role="status">
          <div className="selected-plan-content">
            <div className="selected-plan-top-row">
              <span className="selected-plan-kicker">
                <Sparkles size={14} />
                {t('الباقة المحددة للمناقشة', 'Selected Package for Discussion')}
              </span>
              <span className="selected-plan-edition">
                <ShieldCheck size={13} />
                {selectedPlanObj.id === 'مؤسسات'
                  ? t('ترخيص المؤسسات والشبكات', 'Enterprise Multi-Branch License')
                  : selectedPlanObj.id === 'نمو'
                  ? t('ترخيص المركز المتكامل', 'Integrated Facility License')
                  : t('ترخيص العيادة والفرع', 'Standard Branch License')}
              </span>
            </div>
            <div className="selected-plan-name-row">
              <strong>{txt(selectedPlanObj.name, locale)}</strong>
            </div>
            <p>{txt(selectedPlanObj.description, locale)}</p>
          </div>
          <button
            type="button"
            className="selected-plan-clear"
            onClick={() => setPlan('لم أحدد بعد')}
            title={t('إلغاء تحديد الباقة', 'Clear selected package')}
            aria-label={t('إلغاء تحديد الباقة', 'Clear selected package')}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {offer && (
        <div className="selected-offer">
          <span>{t('العرض المختار: ', 'Selected offer: ')}{offer}</span>
          <button type="button" onClick={() => setOffer('')} aria-label={t('إلغاء اختيار العرض', 'Remove selected offer')}>
            <X size={15} />
          </button>
        </div>
      )}
      {scope && <div className="scope-request-summary" role="status">
        <div><h4>{t('مدخلات الحاسبة المرفقة بطلبك', 'Calculator inputs included in your request')}</h4>
          <button type="button" className="icon-button" aria-label={t('إزالة تقدير الحاسبة', 'Remove calculator estimate')} onClick={() => setScope(null)}><X size={18} /></button></div>
        <p>{formatScopeSummary(scope, locale)}</p>
        <a href="#calculator" onClick={event=>{if(onEditScope){event.preventDefault();onEditScope();}}}>{t('تعديل المدخلات وإعادة إرفاقها', 'Edit inputs and attach the updated estimate')}</a>
      </div>}
      {requestedSystems.length>0&&<div className="scope-request-summary" role="status"><div><h4>{t('الأنظمة المرفقة بطلبك','Systems included in your request')}</h4><button className="icon-button" type="button" onClick={clearRequestedSystems} aria-label={t('إزالة الأنظمة المختارة','Remove selected systems')}><X size={18}/></button></div><p>{formatSystemsSummary(requestedSystems,locale)}</p></div>}
      <div className="form-fields">
        <label>
          {t('الاسم الكامل', 'Full name')} *
          <input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder={t('كيف نناديك؟', 'Your full name')} />
        </label>
        <label>
          {t('اسم المركز أو المؤسسة', 'Organization')} *
          <input name="organization" autoComplete="organization" minLength={2} maxLength={150} required placeholder={t('اسم منشأتك', 'Your facility name')} />
        </label>
        <label>
          {t('البريد الإلكتروني', 'Email address')} *
          <input name="email" type="email" autoComplete="email" dir="ltr" maxLength={200} required placeholder="you@your-center.com" />
        </label>
        <label>
          {t('رقم التواصل', 'Phone number')} *
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" minLength={7} maxLength={25} required placeholder="+20 ..." />
        </label>
        <label>
          {t('نوع المنشأة', 'Facility type')} *
          <select name="facility" required defaultValue="">
            <option value="" disabled>{t('اختر نوع المنشأة', 'Choose facility type')}</option>
            {[
              ['مركز أشعة', 'Radiology center'],
              ['مركز طبي', 'Medical center'],
              ['عيادات تخصصية', 'Specialty clinics'],
              ['مجموعة فروع', 'Radiology / medical center group']
              
            ].map(([ar, eng]) => (
              <option value={ar} key={ar}>{en ? eng : ar}</option>
            ))}
          </select>
        </label>
        <details className="form-extra" open={Boolean(selectedPlanObj || requestedSystems.length > 0 || scope)}>
          <summary>
            <span>
              {t('تفاصيل إضافية — اختياري', 'Additional details — optional')}
              {selectedPlanObj && (
                <span style={{ marginInlineStart: '8px', fontSize: '12px', fontWeight: 600, color: '#245a45' }}>
                  ({txt(selectedPlanObj.name, locale)})
                </span>
              )}
            </span>
            <ChevronDown size={16}/>
          </summary>
          <div className="form-extra-fields">
        <label>
          {t('عدد الفروع', 'Number of branches')}
          <select name="branches" defaultValue="فرع واحد" onChange={() => setScope(null)}>
            {[
              ['فرع واحد', 'One branch'],
              ['2–5 فروع', '2–5 branches'],
              ['أكثر من 5 فروع', 'More than 5']
            ].map(([ar, eng]) => (
              <option value={ar} key={ar}>{en ? eng : ar}</option>
            ))}
          </select>
        </label>
        <label>
          {t('النظام الذي يهمك', 'System of interest')}
          <select name="interest" value={interest} onChange={e => setInterest(e.target.value)}>
            {systems.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <label>
          {t('الباقة المبدئية', 'Preferred package')}
          <select name="plan" value={plan} onChange={e => setPlan(e.target.value)}>
            <option value="لم أحدد بعد">{t('لم أحدد بعد', 'Help me choose')}</option>
            {content.plans.filter(p => p.enabled).map(p => (
              <option key={p.id} value={p.id}>{txt(p.name, locale)}</option>
            ))}
          </select>
        </label>
        <label className="full-width">
          {t('ما الذي ترغب في تحسينه؟', 'What would you like to improve?')}
          <textarea name="message" rows={3} maxLength={2000} placeholder={t('أخبرنا باحتياجاتك دون بيانات مرضى.', 'Tell us about your needs. Please do not include patient information.')} />
        </label>
        </div></details>
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          {t('أوافق على استخدام بياناتي لمعالجة طلبي، وربط هذا الطلب بمعرّف خاص بهذا المتصفح دون بيانات مرضى، وفق ', 'I agree to the use of my details to process this request, linked to an identifier specific to this browser without patient data, under the ')}
          <button type="button" onClick={onPrivacy}>{t('سياسة الخصوصية', 'privacy policy')}</button>{' '}(<a href={en ? '/en/privacy' : '/privacy'} target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>{t('عرض الصفحة', 'view page')}</a>).
        </span>
      </label>
      {error && <div className="form-error" id="lead-form-error" role="alert">{error}</div>}
      <button className="button submit-button" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? <LoaderCircle className="spin" size={18} /> : <Arrow size={18} />}
        {' '}
        {state === 'sending' ? t('جارٍ حفظ طلبك…', 'Saving your request…') : t('إرسال طلب العرض', 'Request a demonstration')}
      </button>
      <p className="form-fineprint">
        <ShieldCheck size={13} />
        {t('طلب العرض لا يرتب التزامًا بالتعاقد.', 'No obligation to purchase.')}
      </p>
    </form>
  );
}
