'use client';
import { useSiteText } from '../lib/site-copy';
import { useId, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, Database, ScanLine, ChevronDown, RotateCcw, Check, SlidersHorizontal } from 'lucide-react';
import { scopeEstimateSchema, estimateArchive, type ScopeEstimate } from '../lib/inquiry';
import type { Locale } from '../lib/site-content';
import './archive-estimator.css';

const initialScope: ScopeEstimate = { modalities: ['MR', 'CT', 'DX'], dailyScans: 45, branches: 1, operatingDays: 300, averageMiB: 120, retentionYears: 1, backupCopies: 0 };
export default function ScopeCalculator({ locale, onChoose }: { locale: Locale; onChoose: (scope: ScopeEstimate) => void }) {
  const en = locale === 'en', t = useSiteText(locale), uid = useId();
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const [scope, setScope] = useState<ScopeEstimate>(initialScope);
  const parsed = scopeEstimateSchema.safeParse(scope);
  const estimate = parsed.success ? estimateArchive(parsed.data) : null;
  const number = (value: number) => value.toLocaleString(en ? 'en-US' : 'ar-EG');
  const capacity = (gib: number) => gib >= 1024 ? `${(gib / 1024).toFixed(1)} TiB` : `${Math.ceil(gib)} GiB`;
  function numeric(name: Exclude<keyof ScopeEstimate, 'modalities'>, label: string, min: number, max: number) {
    const invalid = !Number.isInteger(scope[name]) || scope[name] < min || scope[name] > max;
    return <label className="ae-number" htmlFor={`${uid}-${name}`}><span>{label}</span><input id={`${uid}-${name}`} type="number" inputMode="numeric" dir="ltr" min={min} max={max} step={1} value={Number.isNaN(scope[name]) ? '' : scope[name]} aria-invalid={invalid} aria-describedby={`${uid}-${name}-range`} onChange={event => setScope(current => ({ ...current, [name]: event.target.valueAsNumber }))} /><small id={`${uid}-${name}-range`}>{t('الحد المسموح:', 'Allowed range:')} <bdi>{min}–{max}</bdi></small></label>;
  }
  return <section className="archive-estimator" id="calculator" aria-labelledby={`${uid}-heading`} dir={en ? 'ltr' : 'rtl'}>
    <div className="ae-layout">
      <div className="ae-inputs">
        <div className="ae-input-heading"><span className="ae-heading-icon"><ScanLine size={21} /></span><div><h3 id={`${uid}-heading`}>{t('بيانات مركزك', 'Your center’s activity')}</h3><p>{t('عدّل المدخلات وشاهد التقدير مباشرة.', 'Adjust your inputs to see the estimate update.')}</p></div><button type="button" className="ae-reset" onClick={() => setScope(initialScope)} aria-label={t('استعادة القيم الافتراضية', 'Reset to default values')} title={t('استعادة القيم الافتراضية', 'Reset to default values')}><RotateCcw size={16} /></button></div>
        <fieldset className="ae-modalities"><legend>{t('أنواع الأجهزة', 'Modalities')}</legend><div>{([
          ['MR', t('رنين مغناطيسي', 'MRI')], ['CT', t('أشعة مقطعية', 'CT')], ['DX', t('أشعة سينية', 'X-ray')], ['US', t('موجات صوتية', 'Ultrasound')], ['MG', t('تصوير الثدي', 'Mammography')]
        ] as const).map(([code, label]) => <button type="button" key={code} aria-pressed={scope.modalities.includes(code)} onClick={() => setScope(current => ({ ...current, modalities: current.modalities.includes(code) ? current.modalities.length > 1 ? current.modalities.filter(value => value !== code) : current.modalities : [...current.modalities, code] }))}>{scope.modalities.includes(code) && <Check size={12} />}<span>{label}</span></button>)}</div><p>{t('اختيار الأجهزة لا يغيّر متوسط حجم الفحص تلقائياً.', 'Modality selection does not change average study size automatically.')}</p></fieldset>
        <div className="ae-fields">{numeric('dailyScans', t('الفحوصات يومياً لكل فرع', 'Daily exams per branch'), 1, 10000)}{numeric('branches', t('عدد الفروع', 'Number of branches'), 1, 100)}</div>
        <details className="ae-assumptions"><summary><SlidersHorizontal size={16} /><span>{t('تخصيص افتراضات الحساب', 'Customize calculation assumptions')}</span><ChevronDown size={16} /></summary><div className="ae-fields">{numeric('operatingDays', t('أيام العمل سنوياً', 'Operating days per year'), 1, 366)}{numeric('averageMiB', t('متوسط حجم الفحص (MiB)', 'Average study size (MiB)'), 1, 10000)}{numeric('retentionYears', t('سنوات الاحتفاظ', 'Retention years'), 1, 20)}{numeric('backupCopies', t('نسخ احتياطية إضافية', 'Additional backup copies'), 0, 5)}</div><p>{t('متوسط الحجم افتراض قابل للتعديل لجميع الفحوصات. MiB = 1024² بايت.', 'Average size is an editable assumption across all studies. MiB = 1024² bytes.')}</p></details>
      </div>
      <div className="ae-output"><div className="ae-output-label"><Database size={18} /><span>{t('السعة التقديرية', 'ESTIMATED CAPACITY')}</span><bdi>PACS</bdi></div>
        <div className="ae-result" role="status" aria-live="polite" aria-atomic="true"><span>{t('إجمالي الأرشفة مع الاحتفاظ والنسخ', 'Total archive with retention and copies')}</span><strong dir="ltr">{estimate ? capacity(estimate.totalGiB) : '—'}</strong><div className="ae-annual"><span>{t('الفحوصات السنوية عبر الفروع', 'Annual exams across branches')}</span><b>{estimate ? number(estimate.annualScans) : '—'}</b></div></div>
        <dl className="ae-summary"><div><dt>{t('أيام العمل / سنة', 'Operating days / year')}</dt><dd>{Number.isInteger(scope.operatingDays) ? number(scope.operatingDays) : '—'}</dd></div><div><dt>{t('متوسط حجم الفحص', 'Average study size')}</dt><dd dir="ltr">{Number.isInteger(scope.averageMiB) ? `${scope.averageMiB} MiB` : '—'}</dd></div><div><dt>{t('الاحتفاظ / سنة', 'Retention / years')}</dt><dd>{Number.isInteger(scope.retentionYears) ? number(scope.retentionYears) : '—'}</dd></div><div><dt>{t('نسخ إضافية', 'Additional copies')}</dt><dd>{Number.isInteger(scope.backupCopies) ? number(scope.backupCopies) : '—'}</dd></div></dl>
        {!parsed.success && <p className="ae-error" role="alert">{t('أدخل أعداداً صحيحة ضمن الحدود الموضحة لإكمال التقدير.', 'Enter whole numbers within the shown limits to complete the estimate.')}</p>}
        <details className="ae-method"><summary>{t('كيف تُحسب السعة؟', 'How is capacity calculated?')}<ChevronDown size={14} /></summary><p>{t('الفحوصات اليومية × أيام العمل × الفروع × متوسط حجم الفحص × سنوات الاحتفاظ × (1 + النسخ الإضافية).', 'Daily exams × operating days × branches × average study size × retention years × (1 + additional copies).')}</p><p>{t('GiB = 1024 MiB، وTiB = 1024 GiB.', 'GiB = 1024 MiB; TiB = 1024 GiB.')}</p></details>
        <p className="ae-disclaimer">{t('تقدير أولي وليس عرض سعر. لا يشمل النمو المستقبلي أو الأرشيف السابق أو مساحة تشغيل التخزين؛ تُراجع هذه العوامل فنياً.', 'A preliminary estimate, not a quote. Future growth, existing archives and storage overhead require technical review.')}</p>
        <button type="button" className="ae-choose" disabled={!parsed.success} onClick={() => { if (parsed.success) onChoose(parsed.data); }}><span>{t('أرفق التقدير بطلب العرض', 'Use estimate in my inquiry')}</span><Arrow size={17} /></button>
      </div>
    </div>
  </section>;
}