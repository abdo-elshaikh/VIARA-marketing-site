'use client';
import { useState, useId } from 'react';
import { ArrowUpLeft, ArrowUpRight, TrendingUp, RotateCcw, Clock, ShieldCheck, DollarSign } from 'lucide-react';
import { useSiteText } from '../lib/site-copy';
import type { Locale } from '../lib/site-content';
import './roi-calculator.css';

interface RoiState {
  dailyScans: number;
  operatingDays: number;
  filmCost: number;
  digitalAdoption: number;
  hoursSavedWeekly: number;
  currency: 'EGP' | 'USD' | 'SAR';
}

const defaultState: Record<'EGP' | 'USD' | 'SAR', RoiState> = {
  EGP: { dailyScans: 45, operatingDays: 300, filmCost: 55, digitalAdoption: 85, hoursSavedWeekly: 14, currency: 'EGP' },
  USD: { dailyScans: 45, operatingDays: 300, filmCost: 3.5, digitalAdoption: 85, hoursSavedWeekly: 14, currency: 'USD' },
  SAR: { dailyScans: 45, operatingDays: 300, filmCost: 14, digitalAdoption: 85, hoursSavedWeekly: 14, currency: 'SAR' },
};

export default function RoiCalculator({ locale, onAttach }: { locale: Locale; onAttach?: (summary: string) => void }) {
  const en = locale === 'en';
  const t = useSiteText(locale);
  const uid = useId();
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  const [currency, setCurrency] = useState<'EGP' | 'USD' | 'SAR'>('EGP');
  const [state, setState] = useState<RoiState>(defaultState.EGP);

  const setCurr = (curr: 'EGP' | 'USD' | 'SAR') => {
    setCurrency(curr);
    setState(defaultState[curr]);
  };

  const annualScans = Math.max(0, state.dailyScans * state.operatingDays);
  const annualFilmGross = annualScans * state.filmCost;
  const annualFilmSavings = Math.round(annualFilmGross * (Math.min(100, Math.max(0, state.digitalAdoption)) / 100));
  const annualHoursSaved = Math.round(state.hoursSavedWeekly * 50);

  const formatMoney = (val: number) => {
    const sym = currency === 'USD' ? '$' : currency === 'SAR' ? (en ? 'SAR ' : ' ر.س ') : (en ? 'EGP ' : ' ج.م ');
    return `${sym}${val.toLocaleString(en ? 'en-US' : 'ar-EG')}`;
  };

  const handleAttach = () => {
    const summary = en
      ? `Estimated Annual Savings: ${formatMoney(annualFilmSavings)} (film reduction: ${state.digitalAdoption}%, ${annualHoursSaved} reporting hrs/yr saved).`
      : `وفورات سنوية تقديرية: ${formatMoney(annualFilmSavings)} (استغناء عن ${state.digitalAdoption}% من الأفلام المطبوعة وتوفير ${annualHoursSaved} ساعة تقارير سنوية).`;
    if (onAttach) onAttach(summary);
  };

  return (
    <section className="roi-calculator" id="roi-calculator" aria-labelledby={`${uid}-title`} dir={en ? 'ltr' : 'rtl'}>
      <div className="roi-layout">
        <div className="roi-inputs">
          <div className="roi-input-heading">
            <span className="roi-heading-icon"><TrendingUp size={22} /></span>
            <div>
              <h3 id={`${uid}-title`}>{t('حاسبة التوفير والعائد المالي (ROI)', 'HealthTech ROI & Cost Savings')}</h3>
              <p>{t('قدّر حجم الوفورات السنوية المباشرة عند التحول الرقمي مع VIARA.', 'Estimate direct annual financial savings with VIARA digital portals.')}</p>
            </div>
            <button
              type="button"
              className="roi-reset"
              onClick={() => setState(defaultState[currency])}
              aria-label={t('استعادة الافتراضي', 'Reset')}
              title={t('استعادة الافتراضي', 'Reset')}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="roi-currencies" role="radiogroup" aria-label={t('العملة', 'Currency')}>
            {(['EGP', 'SAR', 'USD'] as const).map(curr => (
              <button
                key={curr}
                type="button"
                role="radio"
                aria-checked={currency === curr}
                aria-pressed={currency === curr}
                onClick={() => setCurr(curr)}
              >
                {curr === 'EGP' ? (en ? 'EGP (Egyptian Pound)' : 'ج.م (الجنيه المصري)') : curr === 'SAR' ? (en ? 'SAR (Saudi Riyal)' : 'ر.س (الريال السعودي)') : 'USD ($)'}
              </button>
            ))}
          </div>

          <div className="roi-fields">
            <label className="roi-number" htmlFor={`${uid}-daily`}>
              <span>{t('الفحوصات يومياً', 'Daily examinations')}</span>
              <input
                id={`${uid}-daily`}
                type="number"
                dir="ltr"
                min={1}
                max={5000}
                value={state.dailyScans || ''}
                onChange={e => setState(s => ({ ...s, dailyScans: e.target.valueAsNumber || 0 }))}
              />
              <small>{t('متوسط عدد الدراسات المنجزة في اليوم', 'Average exams per day')}</small>
            </label>

            <label className="roi-number" htmlFor={`${uid}-cost`}>
              <span>{t('تكلفة الفيلم الورقي/الليزر', 'Average film print cost')}</span>
              <input
                id={`${uid}-cost`}
                type="number"
                dir="ltr"
                min={0}
                max={500}
                step={0.5}
                value={state.filmCost || ''}
                onChange={e => setState(s => ({ ...s, filmCost: e.target.valueAsNumber || 0 }))}
              />
              <small>{t('تكلفة الفيلم والأحبار لكل مريض', 'Film + ink cost per exam')}</small>
            </label>

            <label className="roi-number" htmlFor={`${uid}-adoption`}>
              <span>{t('نسبة الاستغناء عن الطباعة (%)', 'Digital delivery rate (%)')}</span>
              <input
                id={`${uid}-adoption`}
                type="number"
                dir="ltr"
                min={10}
                max={100}
                value={state.digitalAdoption || ''}
                onChange={e => setState(s => ({ ...s, digitalAdoption: e.target.valueAsNumber || 0 }))}
              />
              <small>{t('تسليم الصور بروابط QR وبوابة المريض', 'Via patient & doctor QR portals')}</small>
            </label>

            <label className="roi-number" htmlFor={`${uid}-hours`}>
              <span>{t('ساعات توفير التقارير أسبوعياً', 'Weekly reporting hours saved')}</span>
              <input
                id={`${uid}-hours`}
                type="number"
                dir="ltr"
                min={1}
                max={60}
                value={state.hoursSavedWeekly || ''}
                onChange={e => setState(s => ({ ...s, hoursSavedWeekly: e.target.valueAsNumber || 0 }))}
              />
              <small>{t('بفضل مسودات الذكاء الاصطناعي والإملاء', 'Via AI draft & voice dictation')}</small>
            </label>
          </div>
        </div>

        <div className="roi-output">
          <div className="roi-output-label">
            <DollarSign size={17} />
            <span>{t('إجمالي الوفورات المباشرة سنوياً', 'ANNUAL DIRECT SAVINGS')}</span>
            <bdi>VIARA ROI</bdi>
          </div>

          <div className="roi-result" role="status" aria-live="polite">
            <span>{t('توفير سنوي مباشر في تكاليف الطباعة والأفلام', 'Direct annual savings on film and consumables')}</span>
            <strong>{formatMoney(annualFilmSavings)}</strong>
          </div>

          <div className="roi-metrics-grid">
            <div className="roi-metric-item">
              <span>{t('ساعات عمل موفرة سنوياً للأطباء', 'Annual reporting hours saved')}</span>
              <b>{annualHoursSaved.toLocaleString(en ? 'en-US' : 'ar-EG')} {en ? 'hrs' : 'ساعة'}</b>
            </div>
            <div className="roi-metric-item">
              <span>{t('فحوصات رقمية معتمدة سنوياً', 'Digital exams delivered')}</span>
              <b>{annualScans.toLocaleString(en ? 'en-US' : 'ar-EG')}</b>
            </div>
          </div>

          <dl className="roi-breakdown">
            <div>
              <dt>{t('نسبة خفض تكلفة الأفلام', 'Film cost reduction')}</dt>
              <dd>{state.digitalAdoption}%</dd>
            </div>
            <div>
              <dt>{t('أيام التشغيل السنوية', 'Operating days')}</dt>
              <dd>{state.operatingDays} {en ? 'days' : 'يوم'}</dd>
            </div>
          </dl>

          <p className="roi-disclaimer">
            {t(
              'تقدير استرشادي مبني على متوسط أسعار خامات الطباعة وتكاليف التشغيل. يختلف العائد الفعلي باختلاف أجهزة المركز ونسبة إقبال المراجعين على البوابة الرقمية.',
              'Illustrative estimate based on typical consumable costs. Actual savings vary with facility modality mix and digital portal adoption.'
            )}
          </p>

          {onAttach && (
            <button type="button" className="roi-choose" onClick={handleAttach}>
              <span>{t('أرفق تقدير التوفير المالي بطلب العرض', 'Attach savings estimate to inquiry')}</span>
              <Arrow size={17} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
