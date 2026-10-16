'use client';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { CalendarDays, ArrowUpLeft, LoaderCircle, Download, CheckCircle2, ShieldCheck, X, ChevronDown } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { branchBand, formatScopeSummary, formatInquiryMessage, type ScopeEstimate } from '../lib/inquiry';
import { formatSystemsSummary } from '../lib/healthcare-catalog.mjs';

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
  const t = (ar: string, enText: string) => en ? enText : ar;
  const formRef = useRef<HTMLFormElement>(null);
  const [id, setId] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [receipt, setReceipt] = useState('');

  const systems = [
    ...content.products.filter(p => p.enabled).map(p => ({ id: p.id, label: txt(p.name, locale) })),
    { id: 'SUITE', label: t('الحل المتكامل', 'Integrated solution') },
    { id: 'CONSULT', label: t('مساعدة في اختيار النظام', 'Help me choose a system') }
  ];

  useEffect(() => {
    const facility = formRef.current?.elements.namedItem('facility');
    const labels: Record<string,string> = {hospital:'مستشفى',medical:'مركز طبي',radiology:'مركز أشعة',laboratory:'مختبر تحاليل',network:'مجموعة فروع'};
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
    setId(crypto.randomUUID());
    try {
      const raw = sessionStorage.getItem('viara-request-draft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.interest) setInterest(draft.interest);
      if (draft.plan) setPlan(draft.plan);
      if (draft.offer) setOffer(draft.offer);
      for (const [key, value] of Object.entries(draft)) {
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
      const result = await response.json() as { reference?: string; error?: string };
      if (!response.ok) {
        throw new Error(
          en
            ? (response.status === 429 ? 'You have reached the request limit. Please try later.' : 'We could not save your request. Check your details and try again.')
            : result.error || 'تعذر حفظ طلبك. حاول مجددًا.'
        );
      }
      if (!result.reference) {
        throw new Error(t('لم يتم تأكيد الحفظ. حاول مجددًا.', 'Saving was not confirmed. Please try again.'));
      }
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
    } catch (err) {
      setError(err instanceof Error ? err.message : t('حدث خطأ. حاول مجددًا.', 'Something went wrong. Try again.'));
      setState('error');
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + receipt], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reference}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (state === 'success') {
    return (
      <div className="form-success" role="status">
        <span className="success-icon"><CheckCircle2 size={42} /></span>
        <h3>{t('تم حفظ طلبك بنجاح.', 'Your request is saved.')}</h3>
        <p>{t('احتفظ بالرقم المرجعي. يمكنك مراجعة الطلب من هذا المتصفح ما دامت بيانات الموقع محفوظة؛ إرسال الطلب لا يؤكد موعدًا تلقائيًا.', 'Keep your reference number. You can review this request in this browser while its site data is retained. Submitting a request does not automatically book an appointment.')}</p>
        <strong dir="ltr">{reference}</strong>
        <button type="button" className="button" onClick={download}>
          <Download size={17} />
          {t('تنزيل ملخص الطلب', 'Download request summary')}
        </button>
        <a className="text-link" href={en ? '/en/requests' : '/requests'}>
          {t('مراجعة طلباتي', 'View my requests')}
          <ArrowUpLeft size={17} />
        </a>
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

  return (
    <form ref={formRef} onSubmit={submit}>
      <div className="form-heading">
        <span className="form-icon"><CalendarDays size={22} /></span>
        <div>
          <h3>{t('لنبدأ الحديث.', 'Let’s start a conversation.')}</h3>
          <p>{t('طلب عرض توضيحي يناسب احتياجاتك.', 'A demonstration shaped around your needs.')}</p>
        </div>
      </div>
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
              ['مجموعة فروع', 'Branch network'],
              ['مستشفى', 'Hospital'], ['مختبر تحاليل', 'Laboratory'], ['منشأة أخرى', 'Other healthcare facility']
            ].map(([ar, eng]) => (
              <option value={ar} key={ar}>{en ? eng : ar}</option>
            ))}
          </select>
        </label>
        <details className="form-extra"><summary>{t('تفاصيل إضافية — اختياري','Additional details — optional')}<ChevronDown size={16}/></summary><div className="form-extra-fields">
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
          {t('أوافق على استخدام بياناتي لمعالجة طلبي وفق ', 'I agree to the use of my contact details to process this request under the ')}
          <button type="button" onClick={onPrivacy}>{t('سياسة الخصوصية', 'privacy policy')}</button>.
        </span>
      </label>
      {error && <div className="form-error" role="alert">{error}</div>}
      <button className="button submit-button" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? <LoaderCircle className="spin" size={18} /> : <ArrowUpLeft size={18} />}
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
