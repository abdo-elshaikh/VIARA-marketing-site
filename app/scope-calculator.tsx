'use client';
import { useState } from 'react';
import { ArrowUpLeft, Sparkles } from 'lucide-react';
import { scopeEstimateSchema, estimateArchive, type ScopeEstimate } from '../lib/inquiry';
import type { Locale } from '../lib/site-content';

export default function ScopeCalculator({ locale, onChoose }: { locale: Locale; onChoose: (scope: ScopeEstimate) => void }) {
  const en = locale === 'en';
  const t = (ar: string, english: string) => en ? english : ar;
  const [scope, setScope] = useState<ScopeEstimate>({ modalities: ['MR', 'CT', 'DX'], dailyScans: 45, branches: 1, operatingDays: 300, averageMiB: 120, retentionYears: 1, backupCopies: 0 });
  const parsed = scopeEstimateSchema.safeParse(scope);
  const estimate = parsed.success ? estimateArchive(parsed.data) : null;
  const capacity = (gib: number) => gib >= 1024 ? `${(gib / 1024).toFixed(1)} TiB` : `${Math.ceil(gib)} GiB`;
  function numeric(name: Exclude<keyof ScopeEstimate, 'modalities'>, label: string, min: number, max: number) {
    return <label className="scope-number" htmlFor={`scope-${name}`}>
      <span>{label}</span>
      <input id={`scope-${name}`} type="number" inputMode="numeric" min={min} max={max} step={1} value={scope[name]}
        aria-invalid={scope[name] < min || scope[name] > max || !Number.isInteger(scope[name])}
        onChange={e => setScope(current => ({ ...current, [name]: Number(e.target.value) }))} />
      <small dir="ltr">{min}–{max}</small>
    </label>;
  }
  return <section className="calc-section" id="calculator" aria-labelledby="scope-heading">
    <div className="container calc-grid">
      <div className="calc-card-input" data-reveal>
        <span className="eyebrow"><span />{t('تخطيط الأرشفة', 'ARCHIVE PLANNING')}</span>
        <h2 id="scope-heading">{t('ابدأ بتقدير واضح', 'Start with an estimate.')}<br /><span>{t('لاحتياجات الأرشفة.', 'Plan your archive.')}</span></h2>
        <p className="scope-intro">{t('تقدير أولي مبني على مدخلاتك. يتحدد النطاق النهائي بعد مراجعة طبيعة الفحوصات والبيئة التقنية.', 'A preliminary estimate based on your inputs. Final capacity depends on your studies and technical environment.')}</p>
        <fieldset className="scope-modalities">
          <legend>{t('أنواع الأجهزة في مركزك', 'Modalities at your facility')}</legend>
          <div className="modality-pill-group">{([
            ['MR', t('رنين مغناطيسي', 'MRI')], ['CT', t('أشعة مقطعية', 'CT')], ['DX', t('أشعة سينية', 'X-ray')], ['US', t('موجات صوتية', 'Ultrasound')], ['MG', t('تصوير الثدي', 'Mammography')]
          ] as const).map(([code, label]) => <button type="button" key={code} className={`modality-pill ${scope.modalities.includes(code) ? 'active' : ''}`} aria-pressed={scope.modalities.includes(code)}
            onClick={() => setScope(current => ({ ...current, modalities: current.modalities.includes(code) ? current.modalities.length > 1 ? current.modalities.filter(value => value !== code) : current.modalities : [...current.modalities, code] }))}>{label}</button>)}</div>
        </fieldset>
        <div className="scope-input-grid">
          {numeric('dailyScans', t('الفحوصات يوميًا لكل فرع', 'Daily exams per branch'), 1, 10000)}
          {numeric('branches', t('عدد الفروع الفعلي', 'Exact branch count'), 1, 100)}
        </div>
        <details className="scope-assumptions" open>
          <summary>{t('افتراضات الحساب — عدّلها وفق مركزك', 'Calculation assumptions — adjust for your facility')}</summary>
          <div className="scope-input-grid">
            {numeric('operatingDays', t('أيام العمل في السنة', 'Operating days per year'), 1, 366)}
            {numeric('averageMiB', t('متوسط حجم الفحص (MiB)', 'Average study size (MiB)'), 1, 10000)}
            {numeric('retentionYears', t('سنوات الاحتفاظ', 'Retention years'), 1, 20)}
            {numeric('backupCopies', t('نسخ احتياطية إضافية', 'Additional backup copies'), 0, 5)}
          </div>
          <p>{t('متوسط الحجم افتراض قابل للتعديل لكل الفحوصات؛ اختيار نوع الجهاز لا يغيّر هذا المتوسط تلقائيًا. MiB = 1024² بايت.', 'The average size is an editable assumption across all studies; modality selection does not automatically change it. MiB = 1024² bytes.')}</p>
        </details>
      </div>
      <div className="calc-card-output" data-reveal>
        <div className="scope-output-label"><Sparkles size={20} /><span>{t('تقدير أولي • ليس عرض سعر', 'PRELIMINARY ESTIMATE • NOT A QUOTE')}</span></div>
        <h3>{t('حجم العمل والسعة التقديرية', 'Estimated volume & capacity')}</h3>
        <div className="calc-result-metrics" role="status" aria-live="polite" aria-atomic="true">
          <div className="calc-stat-box"><small>{t('فحوصات سنوية عبر الفروع', 'Annual exams across branches')}</small><strong>{estimate ? estimate.annualScans.toLocaleString(en ? 'en-US' : 'ar-EG') : '—'}</strong></div>
          <div className="calc-stat-box"><small>{t('السعة مع الاحتفاظ والنسخ', 'Capacity with retention & copies')}</small><strong dir="ltr">{estimate ? capacity(estimate.totalGiB) : '—'}</strong></div>
        </div>
        {!parsed.success && <p className="scope-error" role="alert">{t('أدخل أرقامًا صحيحة ضمن الحدود الموضحة لإكمال التقدير.', 'Enter whole numbers within the displayed limits to complete the estimate.')}</p>}
        <div className="calc-rec-box"><b>{t('كيف نقرأ هذا التقدير؟', 'What does this estimate include?')}</b><p>{t('الفحوصات اليومية × أيام العمل × الفروع × متوسط حجم الفحص × سنوات الاحتفاظ × (1 + النسخ الإضافية). لا يشمل النمو المستقبلي أو الأرشيف السابق أو مساحة تشغيل التخزين؛ تُراجع هذه العوامل في العرض الفني.', 'Daily exams × operating days × branches × average study size × retention years × (1 + additional copies). Future growth, existing archives and storage overhead require a separate technical review.')}</p></div>
        <button type="button" className="calc-cta-btn" disabled={!parsed.success} onClick={() => { if (parsed.success) onChoose(parsed.data); }}><span>{t('اطلب عرضًا بهذه المدخلات', 'Request a proposal with these inputs')}</span><ArrowUpLeft size={18} /></button>
      </div>
    </div>
  </section>;
}
