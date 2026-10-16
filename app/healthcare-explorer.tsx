'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, ArrowUpLeft, Plus, Check, X, SlidersHorizontal, Building2, Layers3,
  ChevronDown, ScanLine, Stethoscope, Microscope, Pill, Video, Cpu, ShieldCheck,
  Activity, ArrowRight, Play, Sparkles, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react';
import { healthcareSystems, healthcareCategories, facilityProfiles, normalizeCatalogSearch } from '../lib/healthcare-catalog.mjs';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { solutionPath } from '../lib/solutions';
import './healthcare-explorer.css';

interface SystemPreviewProps {
  id: string;
  locale: Locale;
}

function LiveSystemPreview({ id, locale }: SystemPreviewProps) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;

  if (id === 'LIS') {
    return (
      <div className="hc-live-terminal lis-terminal">
        <div className="terminal-header">
          <div className="terminal-badge"><Microscope size={14} /><span>VIARA LIS · {t('نظام إدارة المختبرات والتحاليل الطبية', 'Laboratory Information System')}</span></div>
          <span className="terminal-live-tag"><i />{t('ربط مباشر بالأجهزة', 'Analyzers Connected')}</span>
        </div>
        <div className="terminal-body">
          <div className="lis-sample-strip">
            <div className="tube-card">
              <span className="tube-code">BARCODE #984210</span>
              <b>{t('عينة دم كاملة (EDTA)', 'Whole Blood EDTA')}</b>
              <small>{t('المريض: محمد عبد الله · طوارئ', 'Patient: M. Abdullah · ER')}</small>
              <div className="tube-status status-analyzing">{t('قيد التحليل الآلي', 'Auto-Analyzing')} (Roche Cobas)</div>
            </div>
            <div className="tube-card">
              <span className="tube-code">BARCODE #984211</span>
              <b>{t('لوحة الكيمياء الحيوية (Serum)', 'Biochemistry Profile')}</b>
              <small>{t('المريض: هدى فاروق · عيادة 2', 'Patient: H. Farooq · Clinic 2')}</small>
              <div className="tube-status status-verified">{t('معتمد وموثق', 'Verified & Signed')}</div>
            </div>
          </div>
          <div className="lis-results-table">
            <div className="lis-row lis-head">
              <span>{t('الفحص المخبري', 'Lab Test')}</span>
              <span>{t('النتيجة', 'Result')}</span>
              <span>{t('المعدل الطبيعي', 'Reference')}</span>
              <span>{t('الحالة', 'Status')}</span>
            </div>
            <div className="lis-row">
              <span>Hemoglobin (Hb)</span>
              <strong className="val-critical">7.4 g/dL ⚠️</strong>
              <span>12.0 - 16.0</span>
              <span className="flag-alert">{t('قيمة حرجة STAT', 'CRITICAL LOW')}</span>
            </div>
            <div className="lis-row">
              <span>WBC Count</span>
              <strong>8.2 x10³/µL</strong>
              <span>4.5 - 11.0</span>
              <span className="flag-normal">{t('طبيعي', 'NORMAL')}</span>
            </div>
            <div className="lis-row">
              <span>Platelets</span>
              <strong>240 x10³/µL</strong>
              <span>150 - 450</span>
              <span className="flag-normal">{t('طبيعي', 'NORMAL')}</span>
            </div>
          </div>
          <div className="terminal-footer">
            <span>⚡ {t('إشعار فوري لطبيب الطوارئ عبر النظام والـ SMS', 'Instant STAT SMS & EMR alert triggered to attending physician')}</span>
            <span dir="ltr">ASTM / HL7 READY</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === 'HIS') {
    return (
      <div className="hc-live-terminal his-terminal">
        <div className="terminal-header">
          <div className="terminal-badge"><Building2 size={14} /><span>VIARA HIS · {t('نظام إدارة المستشفيات والتنويم', 'Hospital Information & Inpatient Hub')}</span></div>
          <span className="terminal-live-tag"><i />{t('غرف العمليات والطوارئ نشطة', 'Live Operations')}</span>
        </div>
        <div className="terminal-body">
          <div className="his-metrics-grid">
            <div className="his-stat-tile">
              <small>{t('نسبة إشغال الأسرة', 'Bed Occupancy')}</small>
              <strong>88.4%</strong>
              <span>{t('142 من 160 سرير', '142 / 160 Beds')}</span>
            </div>
            <div className="his-stat-tile">
              <small>{t('العناية المركزة (ICU)', 'ICU Capacity')}</small>
              <strong className="text-warning">4 {t('متاحة', 'Available')}</strong>
              <span>{t('من إجمالي 24 سرير', 'Out of 24 beds')}</span>
            </div>
            <div className="his-stat-tile">
              <small>{t('حالات الطوارئ (ER)', 'ER Active Cases')}</small>
              <strong>28 {t('حالة', 'Patients')}</strong>
              <span>{t('متوسط الانتظار: 7 دقائق', 'Avg wait: 7 mins')}</span>
            </div>
            <div className="his-stat-tile">
              <small>{t('العمليات الجراحية اليوم', 'Surgical Schedule')}</small>
              <strong>12 {t('عملية', 'Surgeries')}</strong>
              <span>{t('3 قيد الإجراء حاليًا', '3 in progress')}</span>
            </div>
          </div>
          <div className="his-ward-preview">
            <div className="ward-card">
              <b>{t('جناح الجراحة العامة — الطابق الثالث', 'Surgical Ward — 3rd Floor')}</b>
              <div className="ward-progress-bar"><div className="ward-fill" style={{ width: '85%' }} /></div>
              <div className="ward-info">
                <span>{t('رئيس التمريض: نورة السعيد', 'Head Nurse: Nora S.')}</span>
                <span className="tag-ok">● {t('تسليم الورديات مكتمل', 'Handover Recorded')}</span>
              </div>
            </div>
          </div>
          <div className="terminal-footer">
            <span>🛡️ {t('تنسيق آلي بين الاستقبال، الأقسام، وبنك الدم والأشعة', 'Unified inpatient coordination across departments, nursing and labs')}</span>
            <span dir="ltr">HL7 FHIR v4 · CBAHI</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === 'PHARM') {
    return (
      <div className="hc-live-terminal pharm-terminal">
        <div className="terminal-header">
          <div className="terminal-badge"><Pill size={14} /><span>VIARA PHARM · {t('الصيدليات الذكية وسلاسل الإمداد الدوائي', 'Smart Pharmacy & Medication Management')}</span></div>
          <span className="terminal-live-tag"><i />{t('فحص التعارضات الآلي مفعل', 'DDI Safety Active')}</span>
        </div>
        <div className="terminal-body">
          <div className="pharm-rx-box">
            <div className="rx-head">
              <div>
                <b>{t('وصفة إلكترونية رقم: #RX-2026-891', 'Electronic Rx: #RX-2026-891')}</b>
                <small>{t('د. خالد العمري (استشاري باطنة) → مريض: عبد الله س.', 'Dr. Khaled O. → Patient: Abdullah S.')}</small>
              </div>
              <span className="rx-badge">{t('جاهز للصرف', 'Ready for Dispensing')}</span>
            </div>
            <div className="pharm-items">
              <div className="pharm-item">
                <span>Augmentin 1g Tab (1x2 · 7 days)</span>
                <span className="stock-ok">✓ {t('متوفر: 140 عبوة', 'In Stock: 140')}</span>
              </div>
              <div className="pharm-item">
                <span>Paracetamol 500mg ( عند اللزوم )</span>
                <span className="stock-ok">✓ {t('متوفر: 850 عبوة', 'In Stock: 850')}</span>
              </div>
            </div>
            <div className="pharm-safety-check">
              <CheckCircle2 size={16} color="#80e7b0" />
              <span>{t('تم فحص التعارضات الدوائية والتاريخ المرضي والحساسية: آمن تماماً (0 تداخلات).', 'Automated Drug-Drug Interaction (DDI) & allergy check passed: 100% safe.')}</span>
            </div>
          </div>
          <div className="terminal-footer">
            <span>📦 {t('تتبع أرقام التشغيلات وتواريخ الصلاحية والربط بنظام المشتريات', 'Batch tracking, expiry alerts and automated purchase order reorder triggers')}</span>
            <span dir="ltr">eRx · WASFATI READY</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === 'RCM') {
    return (
      <div className="hc-live-terminal rcm-terminal">
        <div className="terminal-header">
          <div className="terminal-badge"><ShieldCheck size={14} /><span>VIARA RCM · {t('دورة الإيرادات والتكامل مع منصة نفيس والتأمين', 'Revenue Cycle Management & NPHIES Hub')}</span></div>
          <span className="terminal-live-tag"><i />{t('بوابة الربط المعتمدة نشطة', 'NPHIES Live')}</span>
        </div>
        <div className="terminal-body">
          <div className="rcm-stats-row">
            <div className="rcm-stat">
              <small>{t('نسبة قبول المطالبات النظيفة', 'Clean Claim Rate')}</small>
              <strong>99.2%</strong>
              <span>{t('فحص استباقي للأخطاء', 'Pre-submission validation')}</span>
            </div>
            <div className="rcm-stat">
              <small>{t('زمن إصدار الموافقة اللحظية', 'Pre-Auth Approval TAT')}</small>
              <strong>1.4 {t('ثانية', 'sec')}</strong>
              <span>{t('ربط إلكتروني مباشر', 'Real-time NPHIES gateway')}</span>
            </div>
            <div className="rcm-stat">
              <small>{t('تقليص رفض المطالبات', 'Denial Reduction')}</small>
              <strong className="text-success">-84%</strong>
              <span>{t('مقارنة بالأنظمة التقليدية', 'Vs legacy billing')}</span>
            </div>
          </div>
          <div className="rcm-claim-sample">
            <div className="claim-line">
              <span>{t('المطالبة: #CLM-90412 — بوبا للتأمين', 'Claim: #CLM-90412 — Bupa')}</span>
              <span className="claim-approved">✓ {t('موافقة إلكترونية فورية معتمدة', 'Pre-Auth Approved')}</span>
            </div>
            <div className="claim-codes">
              <span>ICD-10: M54.5 (Lumbago)</span>
              <span>CPT: 72148 (MRI Lumbar Spine)</span>
              <span>Pre-Auth: #AUTH-89104-SA</span>
            </div>
          </div>
          <div className="terminal-footer">
            <span>💳 {t('التدقيق الآلي للترميز الطبي والفواتير الضريبية وتفادي تسرب الإيرادات', 'Automated medical coding audit, e-invoicing and revenue leakage prevention')}</span>
            <span dir="ltr">NPHIES · CCHI · ZATCA</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === 'PORTAL' || id === 'TELE') {
    return (
      <div className="hc-live-terminal digital-terminal">
        <div className="terminal-header">
          <div className="terminal-badge"><Video size={14} /><span>VIARA DIGITAL · {t('بوابة المريض والتطبيب والاستشارات عن بُعد', 'Patient Portal & Telemedicine Suite')}</span></div>
          <span className="terminal-live-tag"><i />{t('قنوات التواصل مشفرة', 'End-to-End Encrypted')}</span>
        </div>
        <div className="terminal-body">
          <div className="digital-features-grid">
            <div className="digital-card">
              <div className="digital-card-icon"><Activity size={18} /></div>
              <div>
                <b>{t('رابط استعراض الأشعة والتقرير عبر واتساب', 'Instant WhatsApp DICOM Viewer Link')}</b>
                <small>{t('المريض يفتح دراسته التشخيصية بنقرة واحدة من هاتفه دون تنزيل برامج.', 'Zero-install diagnostic mobile viewing for patients and referring physicians.')}</small>
              </div>
            </div>
            <div className="digital-card">
              <div className="digital-card-icon"><Video size={18} /></div>
              <div>
                <b>{t('عيادة افتراضية واستشارات صوت وصورة HD', 'HD Telehealth Virtual Consultations')}</b>
                <small>{t('غرفة استشارة آمنة، تبادل ملفات، وإصدار الوصفات والتقارير إلكترونيًا.', 'Encrypted video room, live screen study review, e-Prescription and notes.')}</small>
              </div>
            </div>
          </div>
          <div className="terminal-footer">
            <span>📱 {t('تطبيق للهواتف الذكية وبوابة ويب بتجربة استثنائية تقلل الضغط على الاستقبال', 'Mobile and web app reducing front-desk load and elevating patient satisfaction')}</span>
            <span dir="ltr">WHATSAPP API · WEB-RTC</span>
          </div>
        </div>
      </div>
    );
  }

  // Default / Diagnostics preview
  return (
    <div className="hc-live-terminal generic-terminal">
      <div className="terminal-header">
        <div className="terminal-badge"><Cpu size={14} /><span>VIARA {id} · {t('محرك التشغيل السريري المتطور', 'Advanced Clinical Engine')}</span></div>
        <span className="terminal-live-tag"><i />{t('نظام متكامل السحابة', 'Cloud Synchronized')}</span>
      </div>
      <div className="terminal-body">
        <p style={{ color: '#cfe8dc', fontSize: '14px', lineHeight: '1.9', margin: 0 }}>
          {t(
            'بنية سحابية وهجينة فائقة الأمان، تضمن تدفق البيانات بسلاسة بين الأقسام، مع لوحات تحكم لحظية وإدارة متكاملة للأدوار والصلاحيات.',
            'High-security hybrid and cloud architecture ensuring seamless data flow between departments, with real-time operational dashboards and granular role-based access control.'
          )}
        </p>
        <div className="terminal-tags-strip">
          <span>● 99.98% High Availability</span>
          <span>● Encrypted AES-256</span>
          <span>● Audit Trail Log</span>
          <span>● RESTful Clinical APIs</span>
        </div>
        <div className="terminal-footer">
          <span>🛡️ {t('متوافق مع أحدث المعايير الصحية العالمية والمحلية', 'Compliant with international and regional healthcare data governance')}</span>
          <span dir="ltr">ISO 27001 · HIPAA</span>
        </div>
      </div>
    </div>
  );
}

export default function HealthcareExplorer({
  locale,
  products,
  onRequest,
  compact = false
}: {
  locale: Locale;
  products: SiteContent['products'];
  onRequest?: (ids: string[], facility: string) => void;
  compact?: boolean;
}) {
  const en = locale === 'en';
  const Heading = compact ? 'h2' : 'h1';
  const t = (ar: string, english: string) => en ? english : ar;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [profile, setProfile] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState('');
  const [previewId, setPreviewId] = useState<string>('HIS');
  const previewPanel=useRef<HTMLDetailsElement>(null);
  useEffect(()=>{
    const params=new URLSearchParams(location.search),area=params.get('area'),q=params.get('q');
    if(area&&healthcareCategories.some(c=>c.id===area))setCategory(area);
    if(q)setQuery(q.slice(0,100));
    const facility=params.get('facility');if(facility&&facilityProfiles.some(p=>p.id===facility))setProfile(facility);
  },[]);
  function showPreview(id:string){setPreviewId(id);if(previewPanel.current){previewPanel.current.open=true;previewPanel.current.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}}

  const activeProducts = products.filter(p => p.enabled);
  const activeIds = activeProducts.map(p => p.id as string);
  const profileData = facilityProfiles.find(p => p.id === profile);

  const filtered = useMemo(() => healthcareSystems.filter(system => {
    if (products.some(p => p.id === system.id && !p.enabled)) return false;
    return (category === 'all' || system.category === category) &&
      (!profileData || profileData.systems.includes(system.id)) &&
      normalizeCatalogSearch(`${system.id} ${system.name.ar} ${system.name.en} ${system.description.ar} ${system.description.en}`).includes(normalizeCatalogSearch(query));
  }).sort((a, b) => Number(activeIds.includes(b.id)) - Number(activeIds.includes(a.id))), [category, query, profileData, products]);

  const chosen = healthcareSystems.filter(system => selected.includes(system.id));
  const visible = expanded ? filtered : filtered.slice(0, 6);
  const home = en ? '/en' : '/';
  const requestHref = `${home}?systems=${selected.join(',')}${profile ? `&facility=${profile}` : ''}#contact`;

  function toggle(id: string) {
    setNotice('');
    if (!selected.includes(id) && selected.length >= 6) {
      setNotice(t('يمكنك اختيار حتى ستة أنظمة في باقة العرض الواحدة.', 'You can include up to six systems per proposal request.'));
      return;
    }
    if (selected.includes(id) && selected.length <= 2) setComparing(false);
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  function applyProfile(pId: string) {
    setProfile(pId);
    setExpanded(false);
    const p = facilityProfiles.find(item => item.id === pId);
    if (p) {
      setSelected(p.systems.slice(0, 6));
      if (p.systems[0]) setPreviewId(p.systems[0]);
    }
  }

  function reset() {
    setQuery('');
    setCategory('all');
    setProfile('');
    setExpanded(false);
  }

  return (
    <section className="healthcare-explorer hc-directory-quiet" id="healthcare-systems" aria-labelledby="healthcare-title">
      <div className="container">
        {/* HEADING */}
        <div className="hc-heading">
          <div>
            <span className="eyebrow"><span />{t('منظومة الرعاية الصحية الشاملة', 'COMPREHENSIVE HEALTHCARE ECOSYSTEM')}</span>
            <Heading id="healthcare-title">
              {t('دليل منظومة الرعاية.', 'The healthcare directory.')}<br />
              <span>{t('استكشف، وقارن، وحدد نطاقك.', 'Explore. Compare. Define your scope.')}</span>
            </Heading>
          </div>
          <p>
            {t(
              'اختر مجالًا أو نوع منشأة، ثم أضف الأنظمة التي ترغب في مناقشتها. تفاصيل التوفر والتكامل تُراجع في العرض الفني.',
              'Choose an area or facility type, then add the systems you want to discuss. Availability and integrations are reviewed in your technical proposal.'
            )}
          </p>
        </div>

        {/* LIVE SYSTEM INTERACTIVE TERMINAL SHOWCASE */}
        <details className="hc-demo-disclosure" ref={previewPanel}><summary>{t('استكشف نماذج الواجهات','Explore interface concepts')}<ChevronDown size={18}/></summary><p className="hc-demo-note">{t('نماذج توضيحية ببيانات تجريبية؛ لا تمثل اتصالًا فعليًا أو نتائج مرضى.','Illustrative concepts using sample data; no live connections or real patient results.')}</p>
        <div className="hc-terminal-wrapper">
          <div className="terminal-picker">
            <div className="picker-title">
              <Sparkles size={16} />
              <span>{t('معاينة حية لواجهات الأنظمة السريرية', 'Interactive Clinical Systems Showcase')}</span>
            </div>
            <div className="picker-tabs">
              {[
                { id: 'HIS', label: t('المستشفيات (HIS)', 'Hospital (HIS)'), icon: Building2 },
                { id: 'LIS', label: t('المختبرات (LIS)', 'Laboratory (LIS)'), icon: Microscope },
                { id: 'PHARM', label: t('الصيدليات (PHARM)', 'Pharmacy (eRx)'), icon: Pill },
                { id: 'RCM', label: t('نفيس والتأمين (RCM)', 'RCM & NPHIES'), icon: ShieldCheck },
                { id: 'PORTAL', label: t('الرعاية الرقمية (Digital)', 'Digital Health'), icon: Video }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  className={`terminal-tab-btn ${previewId === item.id ? 'active' : ''}`}
                  aria-pressed={previewId===item.id}
                  onClick={() => setPreviewId(item.id)}
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <LiveSystemPreview id={previewId} locale={locale} />
        </div>
        </details>

        {/* TOOLBAR SEARCH & FILTERS */}
        <div className="hc-toolbar">
          <label className="hc-search">
            <Search size={19} />
            <span className="hc-sr-only">{t('ابحث في الأنظمة', 'Search healthcare systems')}</span>
            <input
              type="search"
              value={query}
              onChange={e => { setQuery(e.target.value); setExpanded(false); }}
              placeholder={t('ابحث بالاسم أو الاختصار: مختبر، صيدلية، تنويم، LIS، HIS، رنين…', 'Search by name or code: lab, pharmacy, inpatient, LIS, HIS, MRI…')}
            />
          </label>
          <label className="hc-profile">
            <Building2 size={18} />
            <span className="hc-sr-only">{t('نوع منشأتك', 'Your facility type')}</span>
            <select value={profile} onChange={e => { setProfile(e.target.value); setExpanded(false); }}>
              <option value="">{t('جميع تصنيفات المنشآت الطبية', 'All facility categories')}</option>
              {facilityProfiles.map(p => <option key={p.id} value={p.id}>{txt(p.name, locale)}</option>)}
            </select>
          </label>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="hc-filters" aria-label={t('تصفية حسب المجال', 'Filter by area')}>
          <button
            type="button"
            onClick={() => { setCategory('all'); setExpanded(false); }}
            aria-pressed={category === 'all'}
          >
            {t('كافة الأنظمة والمجالات', 'All systems (23)')}
          </button>
          {healthcareCategories.map(c => {
            const count = healthcareSystems.filter(s => s.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => { setCategory(c.id); setExpanded(false); }}
              >
                {txt(c.name, locale)} <span className="cat-count">({count})</span>
              </button>
            );
          })}
        </div>

        {/* RESULTS META */}
        <div className="hc-results-meta">
          <span role="status" aria-live="polite">
            <strong>{filtered.length}</strong> {t('نظامًا طبيًا متاحًا للدراسة والتطبيق', 'systems available for scoping & deployment')}
            {profileData ? ` · ${t('مفلترة لـ: ', 'Filtered for: ')}${txt(profileData.name, locale)}` : ''}
          </span>
          {(query || profile || category !== 'all') && (
            <button type="button" onClick={reset}>
              {t('إعادة ضبط الفلاتر', 'Reset filters')}
              <X size={14} />
            </button>
          )}
        </div>

        {/* SYSTEMS GRID */}
        <div className="hc-grid">
          {visible.map(system => {
            const product = activeProducts.find(p => p.id === system.id);
            const isSelected = selected.includes(system.id);
            return (
              <article key={system.id} className={`hc-system ${isSelected ? 'hc-selected' : ''}`} data-reveal>
                <div className="hc-card-top">
                  <span className="hc-code" dir="ltr">{system.id}</span>
                  <span className={product ? 'hc-status hc-current' : 'hc-status'}>
                    {product ? t('حل حالي', 'CURRENT SOLUTION') : t('نطاق للدراسة', 'SCOPE ASSESSMENT')}
                  </span>
                </div>
                <h3>{product ? txt(product.name, locale) : txt(system.name, locale)}</h3>
                <p>{txt(system.description, locale)}</p>
                <div className="hc-card-actions">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? t('إزالة', 'Remove') : t('إضافة', 'Add')} ${txt(system.name, locale)}`}
                    onClick={() => { toggle(system.id); setPreviewId(system.id); }}
                    className={isSelected ? 'btn-selected' : ''}
                  >
                    {isSelected ? <Check size={16} /> : <Plus size={16} />}
                    {isSelected ? t('مضاف للنطاق', 'In Your Scope') : t('أضف للنطاق', 'Add to Scope')}
                  </button>
                  {product ? (
                    <a href={solutionPath(product.id, locale)}>
                      {t('التفاصيل الفنية', 'Details')}
                      <ArrowUpLeft size={15} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="preview-link"
                      onClick={() => showPreview(system.id)}
                    >
                      {t('معاينة', 'Preview')}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {!filtered.length && (
          <div className="hc-empty">
            <Search size={36} />
            <h3>{t('لا توجد أنظمة تطابق هذه المعايير.', 'No healthcare systems match these filters.')}</h3>
            <p>{t('جرّب البحث باسم النظام أو الاختصار الطبي (مثل: LIS, HIS, PACS)، أو أعد ضبط الفلاتر.', 'Try searching by system name, specialty or acronym (e.g., LIS, HIS, PACS), or reset filters.')}</p>
            <button type="button" onClick={reset}>{t('استعراض كافة الأنظمة (23 نظامًا)', 'Show All 23 Systems')}</button>
          </div>
        )}

        {visible.length < filtered.length && (
          <button type="button" className="hc-more" onClick={() => setExpanded(true)}>
            {t('عرض بقية الأنظمة السريرية والإدارية', 'Explore all remaining clinical & operational systems')} ({filtered.length - visible.length})
            <ChevronDown size={18} />
          </button>
        )}

        {/* BUILDER SUMMARY & PROPOSAL ACTION */}
        <div className="hc-builder" data-reveal>
          <div className="hc-builder-heading">
            <div>
              <span className="hc-code">{t('نطاق منظومة مركزك', 'CUSTOM HEALTHCARE SCOPE BUILDER')}</span>
              <h3>{t('اجمع كافة احتياجات منشأتك الطبية في عرض فني ومالي واحد.', 'Consolidate your healthcare software scope into a single tailored proposal.')}</h3>
            </div>
            <span className="hc-count">{selected.length} / 6</span>
          </div>
          <p>
            {t(
              'اختر حتى 6 أنظمة متكاملة لبناء نطاقك المخصص. يتم تقييم واجهات الربط (APIs)، ونقل البيانات، والتوافق مع بيئتك السريرية ضمن العرض المعتمد.',
              'Select up to 6 systems to shape your tailored solution. Modality integration, data migration, and technical compliance are scoped in your formal proposal.'
            )}
          </p>

          <div className="hc-selection" aria-live="polite">
            {chosen.length ? chosen.map(system => (
              <button
                type="button"
                key={system.id}
                onClick={() => toggle(system.id)}
                aria-label={`${t('إزالة', 'Remove')} ${txt(system.name, locale)}`}
              >
                <b>{system.id}</b>
                <span>{txt(system.name, locale)}</span>
                <X size={14} />
              </button>
            )) : (
              <span className="empty-selection-note">
                {t('انقر على «أضف للنطاق» في أي بطاقة نظام أعلاه للبدء في تجميع حزمتك.', 'Click «Add to Scope» on any system card above to begin shaping your customized package.')}
              </span>
            )}
          </div>

          {notice && <p className="hc-notice" role="alert">{notice}</p>}

          <div className="hc-builder-actions">
            <button
              type="button"
              className="hc-compare"
              disabled={selected.length < 2}
              onClick={() => setComparing(!comparing)}
              aria-expanded={comparing}
            >
              <SlidersHorizontal size={17} />
              {comparing ? t('إخفاء جدول المقارنة السريرية', 'Hide Comparison') : t('مقارنة نطاق الأنظمة المختارة', 'Compare Selected Systems Scope')}
            </button>

            {onRequest ? (
              <button
                type="button"
                className="button hc-cta-btn"
                disabled={!selected.length}
                onClick={() => onRequest(selected, profile)}
              >
                <span>{t('طلب عرض فني للأنظمة المختارة', 'Request Proposal for Selected Scope')}</span>
                <ArrowUpLeft size={18} />
              </button>
            ) : (
              <a
                className={`button hc-cta-btn ${!selected.length ? 'hc-disabled' : ''}`}
                href={selected.length ? requestHref : undefined}
                aria-disabled={!selected.length}
              >
                <span>{t('طلب عرض فني للأنظمة المختارة', 'Request Proposal for Selected Scope')}</span>
                <ArrowUpLeft size={18} />
              </a>
            )}
          </div>
        </div>

        {/* COMPARISON TABLE */}
        {comparing && chosen.length > 1 && (
          <div className="hc-comparison" tabIndex={0} role="region" aria-label={t('مقارنة نطاق الأنظمة المختارة', 'Selected systems scope comparison')}>
            <table>
              <caption>{t('مقارنة النطاق والغرض السريري والتوافق الفني للأنظمة المختارة', 'Scope, clinical purpose, and technical compatibility comparison')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('النظام', 'System')}</th>
                  <th scope="col">{t('الغرض السريري والتشغيلي', 'Clinical & Operational Purpose')}</th>
                  <th scope="col">{t('المجال الصحي', 'Healthcare Domain')}</th>
                  <th scope="col">{t('جاهزية الربط والتوافق', 'Interoperability Standard')}</th>
                  <th scope="col">{t('حالة النطاق', 'Scope Status')}</th>
                </tr>
              </thead>
              <tbody>
                {chosen.map(system => (
                  <tr key={system.id}>
                    <th scope="row">
                      <strong>{system.id}</strong>
                      <bdi>{txt(system.name, locale)}</bdi>
                    </th>
                    <td>{txt(system.description, locale)}</td>
                    <td>{txt(healthcareCategories.find(c => c.id === system.category)!.name, locale)}</td>
                    <td>
                      <span className="std-pill">
                        {system.id === 'RIS' || system.id === 'PACS' ? 'DICOM 3.0 / HL7' :
                         system.id === 'LIS' ? 'ASTM / LOINC / HL7' :
                         system.id === 'RCM' ? 'NPHIES / CCHI / FHIR' :
                         system.id === 'PHARM' ? 'eRx / GS1 / Wasfati' : 'HL7 FHIR v4'}
                      </span>
                    </td>
                    <td>
                      {activeIds.includes(system.id) ? (
                        <span className="status-current-tag">{t('حل أساسي مباشر', 'Core Solution Ready')}</span>
                      ) : (
                        <span className="status-eval-tag">{t('نطاق مؤسسي مخصص', 'Enterprise Scoped')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {compact && (
          <a className="hc-directory-link" href={en ? '/en/systems' : '/systems'}>
            <Layers3 size={17} />
            <span>{t('افتح دليل الأنظمة الصحية الموسع الكامل (23 نظامًا وتطبيقًا)', 'Open Complete Healthcare Systems Directory (All 23 Systems)')}</span>
            <ArrowUpLeft size={17} />
          </a>
        )}
      </div>
    </section>
  );
}
