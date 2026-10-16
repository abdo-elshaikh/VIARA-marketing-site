'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  X,
  Star,
  Quote,
  Play,
  CheckCheck,
  Layers3,
  ListFilter,
  Search,
  Circle,
  Workflow,
  Image as ImageIcon,
  ShieldCheck,
  Activity,
  Cpu,
  Sliders,
  AlertTriangle,
  Eye,
  Sparkles,
  Building2,
  Stethoscope,
  TestTube2,
  DollarSign,
  Maximize2,
  HeartPulse
} from 'lucide-react';
import { txt, type Locale, type PublicReview, type SiteContent } from '../lib/site-content';
import { solutionPath, type SolutionData } from '../lib/solutions';
import { systemStory } from '../lib/system-stories';
import CareFrame from './care-frame';
import ReviewForm from './review-form';
import SystemValue from './system-value';
import './system-experience.css';
import './system-signature.css';

type Props = {
  content: SiteContent;
  product: SolutionData;
  locale: Locale;
  reviews: PublicReview[];
  related: { id: string; name: SolutionData['name'] }[];
};

export default function SystemExperience({ content, product, locale, reviews, related }: Props) {
  const en = locale === 'en';
  const t = (ar: string, english: string) => (en ? english : ar);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;

  const home = en ? '/en' : '/';
  const canonicalId = product.id === 'EMR' ? 'EHR' : product.id;
  const contact = canonicalId === 'AI' ? `${home}?interest=CONSULT#contact` : `${home}?systems=${canonicalId}#contact`;
  const story = systemStory(product.id);

  const [feature, setFeature] = useState(0);
  const [step, setStep] = useState(0);
  const [slide, setSlide] = useState(0);
  const [review, setReview] = useState(0);
  const [active, setActive] = useState('overview');
  const [modal, setModal] = useState<'gallery' | 'review' | null>(null);

  // Domain Interactive Simulator State
  const [pacsPreset, setPacsPreset] = useState<'lung' | 'bone' | 'soft' | 'brain'>('lung');
  const [pacsSlice, setPacsSlice] = useState(42);
  const [pacsAi, setPacsAi] = useState(true);
  const [pacsInvert, setPacsInvert] = useState(false);

  const [hisWard, setHisWard] = useState<'icu' | 'surgical' | 'internal' | 'er'>('icu');

  const [lisTube, setLisTube] = useState<'edta' | 'sst' | 'citrate'>('edta');
  const [lisDeltaAlert, setLisDeltaAlert] = useState(true);

  const [rcmPayer, setRcmPayer] = useState<'bupa' | 'tawuniya' | 'medgulf'>('bupa');
  const [rcmVerified, setRcmVerified] = useState(true);

  const [ehrAllergyDismissed, setEhrAllergyDismissed] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const visibleReviews = reviews.filter(
    r => r.systemId === product.id || (canonicalId === 'EHR' && ['EHR', 'EMR'].includes(r.systemId || ''))
  );
  const average = visibleReviews.length
    ? (visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length).toFixed(1)
    : null;

  const gallery = [
    t('محاكاة مساحة العمل التفاعلية', 'Interactive Workspace Simulator'),
    t('خريطة مسار العمل السريري', 'Clinical Workflow Map'),
    t('بيئة الرعاية الميدانية', 'Healthcare Environment'),
  ];

  const sections = [
    { id: 'overview', label: t('نظرة عامة', 'Overview') },
    { id: 'outcomes', label: t('مؤشرات الأداء', 'Outcomes & ROI') },
    { id: 'features', label: t('المزايا', 'Features') },
    { id: 'gallery', label: t('محاكاة الواجهة', 'Simulator') },
    { id: 'journey', label: t('رحلة العمل', 'Workflow') },
    { id: 'reviews', label: t('آراء العملاء', 'Reviews') },
  ];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reveal = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sx-in-view');
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 }
    );
    node.querySelectorAll('.sx-reveal').forEach(el => reveal.observe(el));

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-22% 0px -50% 0px' }
    );
    node.querySelectorAll('[data-sx-section]').forEach(el => observer.observe(el));

    return () => {
      reveal.disconnect();
      observer.disconnect();
    };
  }, [product.id]);

  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
    else if (!modal && dialog.current?.open) dialog.current.close();
  }, [modal]);

  const open = (name: 'gallery' | 'review') => {
    trigger.current = document.activeElement as HTMLElement;
    setModal(name);
  };
  const close = () => {
    setModal(null);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  const changeSlide = (delta: number) =>
    setSlide(current => (current + delta + gallery.length) % gallery.length);

  // -------------------------------------------------------------
  // Domain Specific Simulators
  // -------------------------------------------------------------

  function renderPacsSimulator() {
    return (
      <div className="sx-sim-pacs" data-invert={pacsInvert}>
        <div className="sx-pacs-top">
          <div className="sx-pacs-patient">
            <span className="sx-pacs-tag">DICOM 3.0 WADO-RS</span>
            <b>#PX-8942 · M/48y · CT Chest & Thorax Contrast</b>
          </div>
          <div className="sx-pacs-specs">
            <span>KVp: 120</span>
            <span>Slice: {pacsSlice}/120</span>
            <span>Thk: 1.0mm</span>
          </div>
        </div>

        {/* W/L Preset Toolbar */}
        <div className="sx-pacs-toolbar">
          <div className="sx-pacs-presets">
            {(
              [
                ['lung', t('رئة وصدر', 'Lung (W:1500 L:-600)')],
                ['bone', t('عظام وفقرات', 'Bone (W:2000 L:350)')],
                ['soft', t('أنسجة رخوة', 'Soft (W:400 L:50)')],
                ['brain', t('مخ وأعصاب', 'Brain (W:80 L:40)')],
              ] as const
            ).map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={pacsPreset === key ? 'is-active' : ''}
                onClick={() => setPacsPreset(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="sx-pacs-tools">
            <button
              type="button"
              className={pacsAi ? 'is-active' : ''}
              onClick={() => setPacsAi(!pacsAi)}
              title={t('كشف الذكاء الاصطناعي', 'AI CAD Triaging')}
            >
              <Cpu size={13} />
              <span>{t('فرز الذكاء الاصطناعي AI', 'AI CAD')}</span>
            </button>
            <button
              type="button"
              className={pacsInvert ? 'is-active' : ''}
              onClick={() => setPacsInvert(!pacsInvert)}
            >
              <Sliders size={13} />
              <span>{t('عكس الألوان', 'Invert')}</span>
            </button>
          </div>
        </div>

        {/* DICOM Scan Viewport */}
        <div className="sx-pacs-viewport">
          <div className={`sx-scan-canvas sx-preset-${pacsPreset}`}>
            <div className="sx-scan-grid" />
            <div className="sx-scan-axial-rings" />
            <div className="sx-scan-crosshair" />

            {/* AI CAD Finding Overlay */}
            {pacsAi && (
              <div className="sx-ai-finding" style={{ top: '38%', insetInlineStart: '58%' }}>
                <span className="sx-ai-ping" />
                <span className="sx-ai-ring" />
                <div className="sx-ai-badge">
                  <strong>{t('عقدة رئوية مفردة 7.8mm', 'Pulmonary Nodule 7.8mm')}</strong>
                  <small>{t('دقة المطابقة: 98.4% · Lung-RADS 3', 'Match Conf: 98.4% · RADS 3')}</small>
                </div>
              </div>
            )}

            <div className="sx-viewport-info top-left">
              <span>VIARA WebPACS 3D</span>
              <span>Matrix: 512x512</span>
            </div>
            <div className="sx-viewport-info top-right">
              <span>FPS: 60</span>
              <span>Lossless Stream</span>
            </div>
            <div className="sx-viewport-info bottom-left">
              <span>Zoom: 100%</span>
              <span>Series: 04 (Axial)</span>
            </div>
            <div className="sx-viewport-info bottom-right">
              <span>{pacsPreset.toUpperCase()} WINDOW</span>
            </div>
          </div>

          {/* Interactive Slice Scrubber */}
          <div className="sx-slice-scrubber">
            <label htmlFor="pacs-slider">
              <span>{t('العمق التشريحي (Slice):', 'Slice depth:')}</span>
              <b>{pacsSlice} / 120</b>
            </label>
            <input
              id="pacs-slider"
              type="range"
              min="1"
              max="120"
              value={pacsSlice}
              onChange={e => setPacsSlice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderHisSimulator() {
    const wards = {
      icu: {
        name: t('العناية المركزة (ICU)', 'Intensive Care Unit (ICU)'),
        occupancy: '93.7%',
        beds: [
          { num: 'ICU-01', status: 'occupied', patient: t('م. عبد الله (62س)', 'M. Abdullah (62y)'), dr: t('د. هشام (استشاري عناية)', 'Dr. Hisham'), vitals: 'BP 118/76 · SpO2 98%' },
          { num: 'ICU-02', status: 'occupied', patient: t('ف. السعيد (45س)', 'F. Al-Saeed (45y)'), dr: t('د. لمياء (جراحة قلب)', 'Dr. Lamia'), vitals: 'BP 124/80 · SpO2 99%' },
          { num: 'ICU-03', status: 'sanitizing', patient: t('تطهير وتجهيز فوري', 'Terminal Sanitization'), dr: t('فريق التمريض 02', 'Nursing Team 02'), vitals: 'Ready in 10m' },
          { num: 'ICU-04', status: 'reserved', patient: t('محجوز لحالة عمليات', 'Reserved for Post-OR'), dr: t('د. ماجد (تخدير)', 'Dr. Majed'), vitals: 'OR-02 Transfer' },
        ],
      },
      surgical: {
        name: t('أجنحة الجراحة العامة', 'General Surgical Ward'),
        occupancy: '87.5%',
        beds: [
          { num: 'SURG-101', status: 'occupied', patient: t('خ. المنصور (38س)', 'K. Al-Mansoor (38y)'), dr: t('د. فيصل (استشاري جراحة)', 'Dr. Faisal'), vitals: 'Post-Lap Chole' },
          { num: 'SURG-102', status: 'available', patient: t('شاغر للاستقبال الفوري', 'Available Bed'), dr: t('مكتب الدخول ADT', 'Admissions Office'), vitals: 'Clean & Ready' },
          { num: 'SURG-103', status: 'occupied', patient: t('ط. الشريف (54س)', 'T. Al-Sharif (54y)'), dr: t('د. فيصل', 'Dr. Faisal'), vitals: 'Discharge Prep' },
          { num: 'SURG-104', status: 'occupied', patient: t('س. العتيبي (41س)', 'S. Al-Otaibi (41y)'), dr: t('د. نورة (عظام)', 'Dr. Noura'), vitals: 'Ortho Recovery' },
        ],
      },
      internal: {
        name: t('أقسام الأمراض الباطنية', 'Internal Medicine'),
        occupancy: '91.2%',
        beds: [
          { num: 'MED-201', status: 'occupied', patient: t('ع. الرشيد (70س)', 'A. Al-Rasheed (70y)'), dr: t('د. خالد (باطنية)', 'Dr. Khaled'), vitals: 'Stable · Diet Normal' },
          { num: 'MED-202', status: 'occupied', patient: t('ي. الدوسري (58س)', 'Y. Al-Dossari (58y)'), dr: t('د. ريم (صدرية)', 'Dr. Reem'), vitals: 'Nebulizer Order' },
          { num: 'MED-203', status: 'available', patient: t('شاغر للاستقبال الفوري', 'Available Bed'), dr: t('مكتب الدخول ADT', 'Admissions Office'), vitals: 'Clean & Ready' },
          { num: 'MED-204', status: 'occupied', patient: t('م. القحطاني (65س)', 'M. Al-Qahtani (65y)'), dr: t('د. خالد', 'Dr. Khaled'), vitals: 'Cardiac Telemetry' },
        ],
      },
      er: {
        name: t('طوارئ المستشفى والفرز السريع', 'Emergency & Fast Triage'),
        occupancy: '100% STAT',
        beds: [
          { num: 'ER-BAY-01', status: 'occupied', patient: t('حالة حرجة (STAT)', 'Critical STAT Case'), dr: t('د. طارق (استشاري طوارئ)', 'Dr. Tareq'), vitals: 'Red Triage Level 1' },
          { num: 'ER-BAY-02', status: 'occupied', patient: t('ألم صدر حاد', 'Chest Pain Protocol'), dr: t('د. سارة (طوارئ)', 'Dr. Sarah'), vitals: 'Orange Triage Level 2' },
          { num: 'ER-BAY-03', status: 'occupied', patient: t('اشتباه كسر طرفي', 'Trauma Assessment'), dr: t('د. طارق', 'Dr. Tareq'), vitals: 'Yellow Triage Level 3' },
          { num: 'ER-BAY-04', status: 'sanitizing', patient: t('تعقيم وتطهير السرير', 'Fast Sanitization'), dr: t('تمريض الطوارئ', 'ER Team'), vitals: 'Ready in 3m' },
        ],
      },
    };

    const currentWard = wards[hisWard];

    return (
      <div className="sx-sim-his">
        <div className="sx-his-top">
          <div className="sx-his-title">
            <Building2 size={16} />
            <b>{t('لوحة التنويم وإدارة الأسرّة الحية', 'Live Inpatient & Bed Census Command')}</b>
          </div>
          <span className="sx-his-occupancy">
            {t('نسبة الإشغال الإجمالية:', 'Census:')} <strong>94.2%</strong>
          </span>
        </div>

        {/* Department Switcher */}
        <div className="sx-ward-tabs">
          {(['icu', 'surgical', 'internal', 'er'] as const).map(key => (
            <button
              type="button"
              key={key}
              className={hisWard === key ? 'is-active' : ''}
              onClick={() => setHisWard(key)}
            >
              {wards[key].name}
            </button>
          ))}
        </div>

        {/* Live Beds Grid */}
        <div className="sx-beds-grid">
          {currentWard.beds.map(bed => (
            <div key={bed.num} className={`sx-bed-card is-${bed.status}`}>
              <div className="sx-bed-header">
                <b>{bed.num}</b>
                <span className={`sx-bed-badge is-${bed.status}`}>
                  {bed.status === 'occupied'
                    ? t('مشغول', 'Occupied')
                    : bed.status === 'available'
                    ? t('متاح', 'Available')
                    : bed.status === 'sanitizing'
                    ? t('تعقيم', 'Sanitizing')
                    : t('محجوز', 'Reserved')}
                </span>
              </div>
              <strong className="sx-bed-patient">{bed.patient}</strong>
              <small className="sx-bed-dr">{bed.dr}</small>
              <span className="sx-bed-vitals">{bed.vitals}</span>
            </div>
          ))}
        </div>

        {/* Live Census KPI Strip */}
        <div className="sx-his-kpis">
          <div>
            <span>184</span>
            <small>{t('إجمالي الأسرّة', 'Total Beds')}</small>
          </div>
          <div>
            <span>14</span>
            <small>{t('دخول اليوم ADT', 'Admissions Today')}</small>
          </div>
          <div>
            <span>9</span>
            <small>{t('تخريج جاهز', 'Discharge Ready')}</small>
          </div>
          <div>
            <span style={{ color: '#2e7d32' }}>HL7 FHIR</span>
            <small>{t('حالة الربط', 'Interop Status')}</small>
          </div>
        </div>
      </div>
    );
  }

  function renderLisSimulator() {
    const tubes = {
      edta: {
        code: '#LB-88219',
        type: t('أنبوب كاب بنفسجي (Lavender EDTA)', 'Lavender EDTA Tube'),
        test: t('صورة دم كاملة + فحص الفصائل (CBC & Diff)', 'Complete Blood Count & Differential'),
        status: t('معالجة مكتملة · اعتماد آلي', 'Completed · Auto-Validated'),
        color: '#8e24aa',
      },
      sst: {
        code: '#LB-88220',
        type: t('أنبوب كاب ذهبي (Gold SST Gel)', 'Gold SST Gel Separator'),
        test: t('وظائف الكبد والكلى والدهون (CMP & Lipid)', 'Comprehensive Metabolic & Lipid Panel'),
        status: t('تحت الفحص بجهاز Roche Cobas', 'Running on Roche Cobas 8000'),
        color: '#ffb300',
      },
      citrate: {
        code: '#LB-88221',
        type: t('أنبوب كاب أزرق (Light Blue Citrate)', 'Light Blue Sodium Citrate'),
        test: t('فحص التخثر والسيولة (PT / INR / PTT)', 'Coagulation Profile (PT / INR)'),
        status: t('تمت القراءة ومطابقة المعايرة', 'Analyzed & Calibrated'),
        color: '#0288d1',
      },
    };

    const currentTube = tubes[lisTube];

    return (
      <div className="sx-sim-lis">
        <div className="sx-lis-top">
          <div className="sx-lis-title">
            <TestTube2 size={16} />
            <b>{t('تتبع العينات وأتمتة المحللات المخبرية', 'Specimen Tracking & Analyzer Telemetry')}</b>
          </div>
          <span className="sx-lis-tag">ASTM E1381 / LOINC</span>
        </div>

        {/* Tube Selector */}
        <div className="sx-tube-selector">
          {(['edta', 'sst', 'citrate'] as const).map(key => (
            <button
              type="button"
              key={key}
              className={`sx-tube-btn ${lisTube === key ? 'is-active' : ''}`}
              onClick={() => setLisTube(key)}
            >
              <i style={{ background: tubes[key].color }} />
              <span>{tubes[key].code}</span>
            </button>
          ))}
        </div>

        {/* Tube Detail Card */}
        <div className="sx-tube-card">
          <div className="sx-tube-barcode">
            <div className="sx-fake-barcode" />
            <bdi>{currentTube.code}</bdi>
          </div>
          <div className="sx-tube-info">
            <span className="sx-tube-type">{currentTube.type}</span>
            <strong className="sx-tube-test">{currentTube.test}</strong>
            <span className="sx-tube-status">
              <Check size={12} />
              {currentTube.status}
            </span>
          </div>
        </div>

        {/* Analyzer Telemetry Status */}
        <div className="sx-analyzers-strip">
          <div className="sx-analyzer-item is-online">
            <span className="sx-dot" />
            <div>
              <b>Sysmex XN-9000</b>
              <small>{t('متصل · معالجة الدفعة #42', 'ONLINE · Batch #42')}</small>
            </div>
          </div>
          <div className="sx-analyzer-item is-online">
            <span className="sx-dot" />
            <div>
              <b>Roche Cobas 8000</b>
              <small>{t('متصل · معايرة مكتملة', 'ONLINE · Calibrated')}</small>
            </div>
          </div>
          <div className="sx-analyzer-item is-idle">
            <span className="sx-dot" />
            <div>
              <b>Abbott Architect</b>
              <small>{t('جاهز للاستقبال', 'STANDBY · Ready')}</small>
            </div>
          </div>
        </div>

        {/* Delta Check Panic Warning Alert */}
        {lisDeltaAlert && (
          <div className="sx-lis-alert">
            <AlertTriangle size={15} />
            <div>
              <b>{t('نظام الفحص التلقائي للقيم الحرجة (STAT Panic Alert):', 'STAT Critical Delta Check:')}</b>
              <p>
                {t(
                  'قيمة الصفائح 34,000 /uL (السابق: 195,000) · تم تنبيه الطبيب المعالج عبر SMS والملف السريري فوراً.',
                  'Platelets 34,000 /uL (Prior: 195,000) · Attending physician alerted via SMS & EMR.'
                )}
              </p>
            </div>
            <button
              type="button"
              className="sx-alert-dismiss"
              onClick={() => setLisDeltaAlert(false)}
            >
              <Check size={13} />
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderRcmSimulator() {
    const payers = {
      bupa: { name: t('بوبا العربية (Bupa Arabia)', 'Bupa Arabia'), class: 'VIP Gold', coPay: '0%', status: t('تغطية نشطة ومطابقة', 'Active & Verified') },
      tawuniya: { name: t('التعاونية للتأمين (Tawuniya)', 'Tawuniya Insurance'), class: 'Class A+', coPay: '10% (Max 50 SAR)', status: t('تغطية نشطة ومطابقة', 'Active & Verified') },
      medgulf: { name: t('ميدغلف (Medgulf)', 'Medgulf'), class: 'Class Platinum', coPay: '5% (Max 75 SAR)', status: t('تغطية نشطة ومطابقة', 'Active & Verified') },
    };

    const currentPayer = payers[rcmPayer];

    return (
      <div className="sx-sim-rcm">
        <div className="sx-rcm-top">
          <div className="sx-rcm-title">
            <DollarSign size={16} />
            <b>{t('بوابة الربط والتحقق اللحظي مع نفيز (NPHIES Gateway)', 'NPHIES Live Eligibility & Clean Claim Engine')}</b>
          </div>
          <span className="sx-rcm-tag">NPHIES v1.3 Certified</span>
        </div>

        {/* Payer Selector */}
        <div className="sx-payer-tabs">
          {(['bupa', 'tawuniya', 'medgulf'] as const).map(key => (
            <button
              type="button"
              key={key}
              className={rcmPayer === key ? 'is-active' : ''}
              onClick={() => {
                setRcmPayer(key);
                setRcmVerified(true);
              }}
            >
              {payers[key].name}
            </button>
          ))}
        </div>

        {/* Real-time Verification Card */}
        <div className="sx-rcm-result">
          <div className="sx-rcm-head">
            <div>
              <small>{t('شركة التأمين / الدافع', 'Payer / Health Network')}</small>
              <strong>{currentPayer.name}</strong>
            </div>
            <span className="sx-rcm-verified-badge">
              <Check size={13} />
              {currentPayer.status}
            </span>
          </div>

          <div className="sx-rcm-grid">
            <div>
              <small>{t('فئة الوثيقة', 'Policy Class')}</small>
              <b>{currentPayer.class}</b>
            </div>
            <div>
              <small>{t('نسبة التحمل (Co-Pay)', 'Patient Co-Pay')}</small>
              <b>{currentPayer.coPay}</b>
            </div>
            <div>
              <small>{t('الموافقة المسبقة', 'Prior Auth')}</small>
              <b style={{ color: '#2e7d32' }}>{t('معتمد آلياً للزيارة', 'Auto-Approved')}</b>
            </div>
            <div>
              <small>{t('زمن استجابة البوابة', 'NPHIES Latency')}</small>
              <b>1.4s</b>
            </div>
          </div>
        </div>

        {/* Pre-submission Claim Scrubber Bar */}
        <div className="sx-scrubber-bar">
          <div className="sx-scrubber-info">
            <b>{t('مدقق المطالبات الذكي (Claim Scrubber)', 'Intelligent Claim Scrubber')}</b>
            <span>{t('نسبة النظافة: 99.4% (0 أخطاء)', 'Clean Claim Score: 99.4% (0 Errors)')}</span>
          </div>
          <div className="sx-scrubber-meter">
            <span style={{ width: '99.4%' }} />
          </div>
          <small>{t('تم التحقق من مطابقة أكواد ICD-10-AM وSBS والتغطية الطبية قبل الرفع.', 'ICD-10-AM and SBS coding validated against clinical policy rules.')}</small>
        </div>
      </div>
    );
  }

  function renderEhrSimulator() {
    return (
      <div className="sx-sim-ehr">
        <div className="sx-ehr-top">
          <div className="sx-ehr-title">
            <Stethoscope size={16} />
            <b>{t('سجل المريض السريري ودعم القرار الطبي (CDSS)', 'Clinical SOAP Chart & Decision Support')}</b>
          </div>
          <span className="sx-ehr-tag">HL7 FHIR R4 · ICD-10</span>
        </div>

        {/* Vitals Ribbon */}
        <div className="sx-ehr-vitals">
          <div>
            <small>BP</small>
            <b>122/80</b>
          </div>
          <div>
            <small>HR</small>
            <b>74 bpm</b>
          </div>
          <div>
            <small>SpO2</small>
            <b>99%</b>
          </div>
          <div>
            <small>Temp</small>
            <b>37.1 °C</b>
          </div>
          <div>
            <small>BMI</small>
            <b>23.4</b>
          </div>
        </div>

        {/* Clinical Encounter Preview */}
        <div className="sx-ehr-encounter">
          <div className="sx-ehr-soap">
            <div>
              <span className="sx-soap-letter">S</span>
              <p>{t('شكوى المريض: سعال جاف مستمر منذ 4 أيام مع ارتفاع طفيف في الحرارة.', 'Patient reports persistent dry cough for 4 days with mild fever.')}</p>
            </div>
            <div>
              <span className="sx-soap-letter">O</span>
              <p>{t('الفحص: احتقان خفيف بالحلق، الرئتان صافيتان بدون أزيز، الغدد اللمفاوية طبيعية.', 'Exam: Mild pharyngeal erythema, chest clear, no wheezing.')}</p>
            </div>
            <div>
              <span className="sx-soap-letter">A</span>
              <p>{t('التشخيص المبدئي: التهاب شعبي حاد (ICD-10: J20.9).', 'Assessment: Acute Bronchitis (ICD-10: J20.9).')}</p>
            </div>
          </div>

          {/* Automated Drug Allergy Alert */}
          {!ehrAllergyDismissed && (
            <div className="sx-ehr-allergy-alert">
              <AlertTriangle size={16} />
              <div>
                <strong>{t('تنبيه تعارض دوائي وحساسية (Drug-Allergy Interaction):', 'Clinical Alert: Penicillin Allergy Conflict')}</strong>
                <p>
                  {t(
                    'المريض لديه حساسية مسجلة من (Penicillin) · تم حظر وصفة Amoxicillin واقتراح Azithromycin 500mg كبديل آمن معتمد.',
                    'Patient has documented Penicillin allergy. Blocked Amoxicillin and substituted with safe Azithromycin 500mg.'
                  )}
                </p>
              </div>
              <button
                type="button"
                className="sx-allergy-apply"
                onClick={() => setEhrAllergyDismissed(true)}
              >
                {t('اعتماد البديل الآمن', 'Apply Safe Drug')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderGenericSimulator() {
    return (
      <div className="sx-sim-generic">
        <div className="sx-preview-heading">
          <div>
            <small>{t('مساحة عمل الفريق المتخصصة', 'SPECIALIZED TEAM WORKSPACE')}</small>
            <h3>{txt(story.steps[step].title, locale)}</h3>
          </div>
          <span className="sx-preview-icon">
            <Search size={17} />
          </span>
        </div>

        <div className="sx-preview-metrics">
          {[
            t('الاستقبال والتنظيم', 'Receive & organize'),
            t('التنفيذ والمراجعة', 'Work & review'),
            t('التوثيق والمتابعة', 'Record & follow up'),
          ].map((label, i) => (
            <div key={label}>
              <span>0{i + 1}</span>
              <p>{label}</p>
              <div className="sx-mini-bar">
                <i style={{ width: `${[72, 54, 88][i]}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="sx-worklist-head">
          <b>{t('قائمة العمل والمهام السريرية', 'Clinical worklist & tasks')}</b>
          <ListFilter size={15} />
        </div>

        <div className="sx-worklist">
          {story.steps.map((item, i) => (
            <div key={i} className={step === i ? 'is-current' : ''}>
              <span className="sx-row-mark">0{i + 1}</span>
              <span>{txt(item.title, locale)}</span>
              <b>
                {i < step ? (
                  <>
                    <Check size={13} />
                    {t('تمت المراجعة', 'Reviewed')}
                  </>
                ) : i === step ? (
                  <>{t('قيد المتابعة', 'In progress')}</>
                ) : (
                  <>{t('الخطوة التالية', 'Next step')}</>
                )}
              </b>
            </div>
          ))}
        </div>

        <p className="sx-preview-disclaimer">
          {t(
            'محاكاة تفاعلية لسير العمل، مع إمكانية مواءمة الحقول والصلاحيات حسب متطلبات منشأتك.',
            'Interactive workflow simulation adaptable to your facility’s access rules and scope.'
          )}
        </p>
      </div>
    );
  }

  function renderPreview({ expanded = false }: { expanded?: boolean }) {
    const isPacs = ['PACS', 'RIS'].includes(product.id);
    const isHis = ['HIS', 'OR', 'NURSING'].includes(product.id);
    const isLis = ['LIS', 'PATH', 'BLOOD'].includes(product.id);
    const isRcm = product.id === 'RCM';
    const isEhr = ['EHR', 'EMR', 'CMS'].includes(product.id);

    return (
      <div
        className={`sx-preview ${expanded ? 'sx-preview-expanded' : ''}`}
        aria-label={t('محاكاة مساحة العمل التفاعلية', 'Interactive workspace simulator')}
      >
        <div className="sx-preview-top">
          <span className="sx-preview-logo">
            VIARA <span>/ {product.id}</span>
          </span>
          <span className="sx-preview-badge">
            <i />
            {t('محاكاة مساحة العمل الحية', 'LIVE WORKSPACE SIMULATOR')}
          </span>
          <div className="sx-window-dots">
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="sx-preview-body">
          <aside aria-hidden="true">
            <Layers3 />
            <Workflow />
            <Activity />
            <Circle />
          </aside>

          <div className="sx-preview-main">
            {isPacs
              ? renderPacsSimulator()
              : isHis
              ? renderHisSimulator()
              : isLis
              ? renderLisSimulator()
              : isRcm
              ? renderRcmSimulator()
              : isEhr
              ? renderEhrSimulator()
              : renderGenericSimulator()}
          </div>
        </div>
      </div>
    );
  }

  function renderGalleryContent({ expanded = false }: { expanded?: boolean }) {
    if (slide === 0) return renderPreview({ expanded });
    if (slide === 1)
      return (
        <div className="sx-flow-art">
          <span className="sx-eyebrow">
            {product.id} / {t('معمارية سير العمل من البداية للمتابعة', 'END-TO-END CLINICAL ARCHITECTURE')}
          </span>
          <h3>{t('كل خطوة متصلة بالتي تليها.', 'Every step connects to the next.')}</h3>
          <div>
            {story.steps.map((item, index) => (
              <div key={index}>
                <span>{index === 3 ? <CheckCheck size={23} /> : `0${index + 1}`}</span>
                <b>{txt(item.title, locale)}</b>
                <small>{txt(item.description, locale)}</small>
                {index < 3 && <ChevronDown size={18} />}
              </div>
            ))}
          </div>
          <small className="sx-flow-foot">
            {t('مسار عمل متكامل وموثق يضمن تقليل الأخطاء وسرعة الإنجاز.', 'Integrated workflow reducing turnaround time and preventing errors.')}
          </small>
        </div>
      );

    return (
      <figure className="sx-gallery-photo">
        <img
          src={story.image}
          width={1536}
          height={1024}
          loading="lazy"
          alt={t('بيئة رعاية صحية حديثة', 'Modern healthcare environment')}
        />
        <figcaption>
          {t('مشهد توضيحي لبيئة العمل وتنسيق الفرق الطبية والتشخيصية', 'Illustrative clinical care and diagnostic coordination setting')}
        </figcaption>
      </figure>
    );
  }

  return (
    <CareFrame
      content={content}
      locale={locale}
      current="systems"
      alternatePath={solutionPath(product.id, en ? 'ar' : 'en')}
    >
      <div className="sx-page sx-signature" data-category={story.category} ref={root}>
        {/* System Detail Hero */}
        <section className="sx-hero care-wrap" id="overview" data-sx-section>
          <div className="sx-hero-copy">
            <a className="sx-back" href={en ? '/en/systems' : '/systems'}>
              <Forward size={15} />
              {t('كل أنظمة الرعاية (24+)', 'All care systems (24+)')}
            </a>

            <span className="sx-eyebrow">
              <i />
              VIARA / {product.id} · {txt(story.audience, locale)}
            </span>

            <h1>{txt(product.name, locale)}</h1>
            <p className="sx-hero-signature">{txt(story.signature, locale)}</p>
            <p className="sx-hero-lead">{txt(product.description, locale)}</p>

            <div className="care-actions">
              <a className="care-btn" href={contact}>
                <span>{t('احجز عرضاً حياً ومناقشة فنية', 'Request a live demo & scope')}</span>
                <Arrow size={18} />
              </a>
              <a className="care-link" href="#gallery">
                <Play size={15} />
                <span>{t('جرّب محاكاة النظام', 'Test the simulator')}</span>
              </a>
            </div>

            <div className="sx-hero-notes">
              <span>
                <Check size={14} />
                {txt(story.audience, locale)}
              </span>
              <span>
                <Check size={14} />
                {t('جاهز للتكامل السحابي أو المحلي مع معايير HL7 وFHIR', 'Ready for cloud or on-premise HL7 & FHIR integration')}
              </span>
            </div>
          </div>

          <div className="sx-hero-art">
            <div className="sx-orbit" aria-hidden="true" />
            <div className="sx-hero-photo">
              <img
                src={story.image}
                width={1536}
                height={1024}
                fetchPriority="high"
                alt={t('مشهد بيئة الرعاية الصحية', 'Healthcare setting scene')}
              />
              <span className="sx-photo-code" aria-hidden="true">
                {product.id}
              </span>
              <span className="sx-photo-category">{txt(story.audience, locale)}</span>
            </div>

            <div className="sx-hero-workspace">{renderPreview({})}</div>

            <div className="sx-float-card">
              <span>
                <Workflow size={20} />
              </span>
              <div>
                <b>{t('ترابط تشغيلي وسريري متكامل', 'Clinical & Operational Sync')}</b>
                <small>{t('دقة القرار في كل خطوة ومرحلة', 'Clarity and accuracy at every step')}</small>
              </div>
            </div>

            <span className="sx-art-caption">
              {t('محاكاة تفاعلية لمساحة عمل النظام', 'INTERACTIVE SYSTEM WORKSPACE')}
            </span>
          </div>
        </section>

        {/* Standards & Interoperability Compliance Strip */}
        <div className="sx-standards-strip" aria-label={t('معايير وتوافقية النظام', 'Standards and compliance')}>
          <div className="care-wrap">
            <div className="sx-standards-label">
              <ShieldCheck size={17} />
              <span>{t('معايير وتكاملات معتمدة:', 'CERTIFIED PROTOCOLS & STANDARDS:')}</span>
            </div>
            <div className="sx-standards-list">
              {story.standards.map(std => (
                <span key={std} className="sx-standard-chip">
                  <Check size={13} />
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Section Navigation */}
        <nav className="sx-section-nav" aria-label={t('أقسام صفحة النظام', 'System page sections')}>
          <div className="care-wrap">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? 'location' : undefined}
              >
                {section.label}
              </a>
            ))}
            <a className="sx-nav-cta" href={contact}>
              {t('اطلب العرض الفني', 'Request technical demo')}
              <Arrow size={15} />
            </a>
          </div>
        </nav>

        {/* Proven Clinical & Operational Outcomes Grid (ROI) */}
        <section className="care-wrap sx-section sx-outcomes-section sx-reveal" id="outcomes" data-sx-section>
          <div className="sx-section-heading">
            <div>
              <span className="sx-eyebrow">
                <Sparkles size={14} />
                {t('مؤشرات أداء وعائد مثبت', 'PROVEN PERFORMANCE & VALUE')}
              </span>
              <h2>{t('عائد ملموس على جودة الرعاية وسرعة التشغيل.', 'Measurable impact on patient care and operations.')}</h2>
            </div>
            <p>
              {t(
                'نتائج ونسب مثبتة مستخلصة من أفضل الممارسات الميدانية وتطبيق حلول VIARA في منشآت الرعاية الصحية.',
                'Benchmark metrics reflecting proven improvements across healthcare facilities adopting VIARA solutions.'
              )}
            </p>
          </div>

          <div className="sx-outcomes-grid">
            {story.outcomes.map((item, i) => (
              <div key={i} className="sx-outcome-card">
                <span className="sx-outcome-num">{item.metric}</span>
                <h3>{txt(item.label, locale)}</h3>
                <p>{txt(item.detail, locale)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stakeholder Value Perspectives */}
        <SystemValue id={product.id} locale={locale} contact={contact} />

        {/* Features Explorer */}
        <section className="care-wrap sx-section sx-reveal" id="features" data-sx-section>
          <div className="sx-section-heading">
            <div>
              <span className="sx-eyebrow">{t('الفكرة في التفاصيل الدقيقة', 'THE DIFFERENCE IS IN THE DETAILS')}</span>
              <h2>{t('تعرف على ما يهم فريقك السريري والإداري.', 'Explore what matters to your clinical & operational team.')}</h2>
            </div>
            <p>
              {t(
                'تنقل بين المزايا للتعرف على دور كل خاصية في تنظيم العمل. نحدد معك النطاق الدقيق والأدوار والصلاحيات في العرض الفني.',
                'Explore each capability to see how it streamlines everyday practice. We refine the exact scope, roles, and permissions during discovery.'
              )}
            </p>
          </div>

          <div className="sx-features-layout">
            <div
              className="sx-feature-list"
              role="tablist"
              aria-label={t('مزايا النظام', 'System features')}
              aria-orientation="vertical"
            >
              {product.features.map((item, i) => (
                <button
                  type="button"
                  role="tab"
                  key={i}
                  id={`sx-feature-${i}`}
                  aria-controls="sx-feature-panel"
                  aria-selected={feature === i}
                  tabIndex={feature === i ? 0 : -1}
                  ref={el => {
                    tabButtons.current[i] = el;
                  }}
                  onClick={() => setFeature(i)}
                  onKeyDown={event => {
                    let next = i;
                    if (event.key === 'ArrowDown') next = (i + 1) % product.features.length;
                    else if (event.key === 'ArrowUp') next = (i - 1 + product.features.length) % product.features.length;
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = product.features.length - 1;
                    else return;
                    event.preventDefault();
                    setFeature(next);
                    tabButtons.current[next]?.focus();
                  }}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <b>{txt(item, locale)}</b>
                  <Arrow size={18} />
                </button>
              ))}
            </div>

            <div
              className="sx-feature-panel"
              id="sx-feature-panel"
              role="tabpanel"
              aria-labelledby={`sx-feature-${feature}`}
              tabIndex={0}
            >
              <div key={feature} className="sx-panel-content">
                <span className="sx-feature-symbol">
                  <Layers3 size={32} />
                </span>
                <span className="sx-eyebrow">
                  {t('ميزة تحت المجهر', 'CAPABILITY IN FOCUS')} / {String(feature + 1).padStart(2, '0')}
                </span>
                <h3>{txt(product.features[feature], locale)}</h3>
                <p>{txt(story.steps[feature % story.steps.length].description, locale)}</p>

                <div className="sx-value-pair">
                  <div>
                    <small>{t('في نطاق التطبيق', 'IN THE SCOPE REVIEW')}</small>
                    <b>{txt(story.steps[feature % story.steps.length].title, locale)}</b>
                  </div>
                  <div>
                    <small>{t('نركز معك على', 'WHAT WE EMPHASIZE')}</small>
                    <b>{t('الصلاحيات، موثوقية البيانات، وسلاسة الانتقال', 'Role-based access, data fidelity & seamless transition')}</b>
                  </div>
                </div>

                <a className="care-link" href={contact}>
                  {t('ناقش هذه الميزة مع مهندسينا', 'Discuss this capability with our team')}
                  <Arrow size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery / Interactive Simulator Showcase */}
        <section className="sx-gallery-section" id="gallery" data-sx-section>
          <div className="care-wrap sx-reveal">
            <div className="sx-section-heading">
              <div>
                <span className="sx-eyebrow">{t('شاهد الفكرة أقرب وعن كثب', 'SEE THE SYSTEM IN ACTION')}</span>
                <h2>{t('مساحة تفاعلية للاستكشاف والتحقق.', 'Interactive room to explore.')}</h2>
              </div>
              <p>
                {t(
                  'تنقل بين محاكاة الواجهة، وخريطة سير العمل، وبيئة الرعاية الميدانية. يمكنك تكبير المعاينة لتجربة عناصر التحكم.',
                  'Switch between the live simulator, workflow map, and care environment. Expand the view for full-scale exploration.'
                )}
              </p>
            </div>

            <div className="sx-gallery-shell">
              <div className="sx-gallery-stage">
                <div key={slide} className="sx-gallery-content">
                  {renderGalleryContent({})}
                </div>
                <button
                  type="button"
                  className="sx-expand"
                  onClick={() => open('gallery')}
                  aria-label={t('تكبير المعاينة', 'Expand preview')}
                >
                  <Expand size={18} />
                </button>
              </div>

              <div className="sx-gallery-bottom">
                <div className="sx-gallery-tabs" role="group" aria-label={t('مشاهد المعرض', 'Gallery views')}>
                  {gallery.map((label, i) => {
                    const Icon = [Cpu, Workflow, ImageIcon][i];
                    return (
                      <button
                        type="button"
                        key={label}
                        aria-pressed={slide === i}
                        onClick={() => setSlide(i)}
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="sx-gallery-controls">
                  <button
                    type="button"
                    onClick={() => changeSlide(-1)}
                    aria-label={t('المشهد السابق', 'Previous view')}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <span aria-live="polite">
                    {slide + 1} / {gallery.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeSlide(1)}
                    aria-label={t('المشهد التالي', 'Next view')}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <p className="care-note">
              {t(
                'المحاكاة تعكس منطق سير العمل والمعايير المدعومة. يتولى فريقنا ضبط الواجهات وقواعد العمل لتلائم منشأتك تماماً.',
                'Simulators reflect core workflow logic and standards. Our team customizes interfaces and rules for your exact facility requirements.'
              )}
            </p>
          </div>
        </section>

        {/* Workflow Stages */}
        <section className="care-wrap sx-section sx-reveal" id="journey" data-sx-section>
          <div className="sx-section-heading">
            <div>
              <span className="sx-eyebrow">{t('مسار عمل واضح ومتدرج', 'CONNECTED WORKFLOW PHASES')}</span>
              <h2>{t('رحلة رعاية وتشغيل يمكن فهمها.', 'A workflow everyone can follow.')}</h2>
            </div>
            <p>
              {t(
                'اختر مرحلة للاطلاع على تفاصيلها. هذا المسار الموحد نقطة بداية قابلة للتخصيص الكامل حسب بروتوكولات منشأتك.',
                'Select a stage to explore its checkpoints. This pathway serves as a foundation tailored to your clinical protocols.'
              )}
            </p>
          </div>

          <div className="sx-journey-steps" aria-label={t('مراحل العمل', 'Workflow stages')}>
            {story.steps.map((item, i) => (
              <button
                type="button"
                aria-pressed={step === i}
                key={i}
                onClick={() => setStep(i)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{txt(item.title, locale)}</strong>
                <small>{i === step ? t('المرحلة المعروضة', 'Selected stage') : t('استكشف المرحلة', 'Explore stage')}</small>
              </button>
            ))}
          </div>

          <div className="sx-journey-detail" aria-live="polite">
            <span className="sx-journey-number">0{step + 1}</span>
            <div>
              <h3>{txt(story.steps[step].title, locale)}</h3>
              <p>{txt(story.steps[step].description, locale)}</p>
            </div>
            <a className="care-link" href="#gallery" onClick={() => setSlide(0)}>
              {t('شاهد في مساحة العمل', 'View in simulator')}
              <Arrow size={17} />
            </a>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="sx-reviews-section" id="reviews" data-sx-section>
          <div className="care-wrap sx-reviews-layout sx-reveal">
            <div>
              <span className="sx-eyebrow">{t('صوت التجربة الميدانية', 'REAL FIELD EXPERIENCES')}</span>
              <h2>
                {t('من يستخدم النظام،', 'Those who use it daily,')}
                <br />
                <span>{t('يروي قصة النجاح.', 'tell the real story.')}</span>
              </h2>
              <p>{t('آراء العملاء والكوادر الطبية المعتمدة لهذا النظام.', 'Approved clinical and management reviews for this system.')}</p>

              {average && (
                <div className="sx-review-average">
                  <Star size={22} fill="currentColor" />
                  <b>
                    {average}
                    <small> / 5</small>
                  </b>
                  <span>
                    {visibleReviews.length} {t('تقييمات منشورة', 'published reviews')}
                  </span>
                </div>
              )}

              <button type="button" className="care-link" onClick={() => open('review')}>
                {t('تستخدم النظام؟ شارك تجربتك', 'Use this system? Share your feedback')}
                <Arrow size={17} />
              </button>
            </div>

            <div className="sx-review-card">
              {visibleReviews.length ? (
                <>
                  <Quote className="sx-quote-icon" size={36} />
                  <article
                    key={review}
                    className="sx-review-content"
                    lang={visibleReviews[review].locale}
                    dir={visibleReviews[review].locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <div className="sx-stars" aria-label={`${visibleReviews[review].rating} / 5`}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star
                          key={n}
                          size={17}
                          fill={n <= visibleReviews[review].rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <blockquote>{visibleReviews[review].quote}</blockquote>
                    <div className="sx-review-person">
                      <span>{visibleReviews[review].name.trim().charAt(0)}</span>
                      <div>
                        <b>{visibleReviews[review].name}</b>
                        <small>
                          {[visibleReviews[review].role, visibleReviews[review].organization]
                            .filter(Boolean)
                            .join(' · ')}
                        </small>
                      </div>
                    </div>
                  </article>

                  <div className="sx-review-navigation">
                    <span aria-live="polite">
                      {review + 1} / {visibleReviews.length}
                    </span>
                    <div>
                      <button
                        type="button"
                        disabled={visibleReviews.length < 2}
                        aria-label={t('الرأي السابق', 'Previous review')}
                        onClick={() =>
                          setReview(i => (i - 1 + visibleReviews.length) % visibleReviews.length)
                        }
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button
                        type="button"
                        disabled={visibleReviews.length < 2}
                        aria-label={t('الرأي التالي', 'Next review')}
                        onClick={() => setReview(i => (i + 1) % visibleReviews.length)}
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="sx-review-empty">
                  <Quote size={38} />
                  <h3>{t('كل تجربة حقيقية تستحق أن تُسمع.', 'Every real experience deserves to be heard.')}</h3>
                  <p>
                    {t(
                      'لا توجد آراء منشورة لهذا النظام بعد. شارك تجربتك الميدانية لتظهر هنا بعد المراجعة والاعتماد.',
                      'No published reviews are linked yet. Share your experience for moderation and publication.'
                    )}
                  </p>
                  <button className="care-btn" type="button" onClick={() => open('review')}>
                    {t('أضف تجربتك', 'Share your review')}
                    <Arrow size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Discovery Questions */}
        <section className="care-wrap sx-section sx-discovery sx-reveal">
          <div>
            <span className="sx-eyebrow">{t('قرار مدروس يبدأ بسؤال', 'CONSIDERED DECISIONS START WITH QUESTIONS')}</span>
            <h2>{t('كيف نجعله مناسباً لمنشأتك تماماً؟', 'How do we tailor it to your facility?')}</h2>
            <p>
              {t(
                'نبدأ بسير العمل الحقيقي والتحديات الميدانية، ثم نحدد المتطلبات والربط وخطة الإطلاق معاً.',
                'We begin with your day-to-day workflow, then define architecture, integrations, and rollout phases together.'
              )}
            </p>
          </div>
          <div>
            {story.questions.map((question, i) => (
              <details key={i}>
                <summary>
                  {txt(question, locale)}
                  <ChevronDown size={18} />
                </summary>
                <p>
                  {[
                    t(
                      'صف الخطوات الحالية وأبرز ما ترغب في تحسينه، لنحدد الأولويات قبل اختيار الوحدات وتحديد التكلفة.',
                      'Describe your current steps and primary pain points, so we can prioritize core modules before pricing.'
                    ),
                    t(
                      'حدد أعضاء الفريق والفروع والأنظمة الحالية لتتضح المسؤوليات ونقاط الربط المطلوبة.',
                      'Map key staff roles, facility branches, and current software to scope integrations and responsibilities.'
                    ),
                    t(
                      'نراجع معك الصلاحيات، صيغ البيانات، الاستضافة، التقارير والاختبارات اللازمة قبل اعتماد النطاق.',
                      'We review data governance, hosting, reporting, and acceptance testing before final sign-off.'
                    ),
                  ][i]}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="care-wrap sx-final">
          <div>
            <span className="sx-eyebrow">VIARA / {product.id}</span>
            <h2>{t('شاهد كيف يغير النظام عمل منشأتك.', 'See how this system transforms your facility.')}</h2>
            <p>
              {t(
                'جلسة استشارية وعرض حي مخصص يبدأ من احتياجك الفعلي ويوضح خيارات الربط والتنفيذ.',
                'A focused discovery session and tailored live demo addressing your exact clinical and operational needs.'
              )}
            </p>
          </div>
          <a className="care-btn" href={contact}>
            <span>{t('تواصل مع فريق الخبراء', 'Consult with our specialists')}</span>
            <Arrow size={18} />
          </a>
        </section>

        {/* Related Solutions */}
        <section className="care-wrap sx-related">
          <span className="sx-eyebrow">{t('أكمل منظومتك', 'COMPLETE YOUR ECOSYSTEM')}</span>
          <h2>{t('حلول مترابطة تتقاطع مع هذا النظام.', 'Interconnected solutions you may need.')}</h2>
          <div>
            {related.map(item => (
              <a href={solutionPath(item.id, locale)} key={item.id}>
                <span>{item.id}</span>
                <h3>{txt(item.name, locale)}</h3>
                <Arrow size={20} />
              </a>
            ))}
          </div>
        </section>

        {/* Modal Dialog */}
        <dialog
          ref={dialog}
          className={`care-dialog sx-dialog ${modal === 'gallery' ? 'sx-gallery-dialog' : ''}`}
          aria-labelledby="sx-dialog-title"
          onCancel={close}
          onClick={event => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={event => {
            if (modal !== 'gallery') return;
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              changeSlide(1);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              changeSlide(-1);
            }
          }}
        >
          <div className="care-dialog-heading">
            <h2 id="sx-dialog-title">
              {modal === 'review' ? t('تجربتك مع النظام', 'Your experience with this system') : gallery[slide]}
            </h2>
            <button type="button" className="care-menu" onClick={close} aria-label={t('إغلاق', 'Close')}>
              <X />
            </button>
          </div>
          {modal === 'review' ? (
            <>
              <p className="sx-review-system">{txt(product.name, locale)}</p>
              <ReviewForm locale={locale} systemId={canonicalId} />
            </>
          ) : modal === 'gallery' ? (
            <>
              {renderGalleryContent({ expanded: true })}
              <div className="sx-dialog-gallery-controls">
                <button
                  className="care-menu"
                  type="button"
                  aria-label={t('المشهد السابق', 'Previous view')}
                  onClick={() => changeSlide(-1)}
                >
                  <ArrowLeft />
                </button>
                <span aria-live="polite">
                  {slide + 1} / {gallery.length}
                </span>
                <button
                  className="care-menu"
                  type="button"
                  aria-label={t('المشهد التالي', 'Next view')}
                  onClick={() => changeSlide(1)}
                >
                  <ArrowRight />
                </button>
              </div>
            </>
          ) : null}
        </dialog>
      </div>
    </CareFrame>
  );
}
