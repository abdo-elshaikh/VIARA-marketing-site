'use client';
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import {
  ArrowUpLeft, ArrowLeft, ArrowRight, Menu, X, Play, Pause, Check, CheckCircle2, ChevronDown,
  CalendarDays, ScanLine, Building2, Layers3, Users, ShieldCheck, Network, Headphones,
  SlidersHorizontal, Star, Quote, Mail, Phone, MapPin, MessageCircle, ExternalLink, Gift, Clock3,
  LockKeyhole, Moon, Sun, Globe2, Sparkles, Stethoscope, Pill, Cpu
} from 'lucide-react';
import { txt, isOfferActive, type SiteContent, type Locale, type PublicReview } from '../lib/site-content';
import LeadForm from './lead-form';
import { Facebook, Instagram, Linkedin, Youtube } from './social-icons';
import ReviewForm from './review-form';
import ScopeCalculator from './scope-calculator';
import type { ScopeEstimate } from '../lib/inquiry';
import { solutionPath } from '../lib/solutions';
import HealthcareExplorer from './healthcare-explorer';
import SystemsUniverse from './systems-universe';
import { healthcareSystems, facilityProfiles } from '../lib/healthcare-catalog.mjs';
import './viara-redesign.css'; // App Router: fine here. Pages Router: move this import to _app.tsx.

const productIcons = { RIS: ScanLine, PACS: Layers3, CMS: Building2 };

function Tag({ children }: { children: ReactNode }) {
  return <span className="eyebrow"><span />{children}</span>;
}

function Modal({ open, close, title, children }: { open: boolean; close: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else if (ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog ref={ref} className="modal" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-label={title}>
      <div className="modal-head">
        <h2>{title}</h2>
        <button type="button" onClick={close} className="icon-button" aria-label={title.startsWith('Privacy') || title.startsWith('Share') ? 'Close' : 'إغلاق / Close'}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}

/* One slim row replaces the old five-card trust strip and the audience bar. */
function StandardsStrip({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const items = [
    { icon: ScanLine, label: 'DICOM 3.0' },
    { icon: Network, label: 'HL7 FHIR v4' },
    { icon: ShieldCheck, label: 'NPHIES' },
    { icon: Layers3, label: 'OHIF v3' },
    { icon: LockKeyhole, label: 'AES-256 · TLS 1.3' }
  ];
  return (
    <div className="vx-standards">
      <div className="container">
        <span className="vx-standards-label">{t('معايير وتكاملات تُؤكَّد تفاصيلها في العرض الفني', 'Standards and integrations, confirmed in your technical proposal')}</span>
        <ul>
          {items.map(i => <li key={i.label}><i.icon size={16} /><span dir="ltr">{i.label}</span></li>)}
        </ul>
      </div>
    </div>
  );
}

function RisModalityPreview({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const [filter, setFilter] = useState('ALL');
  const items = [
    { id: 'VR-9021', patient: t('أحمد م. ع (42 سنة)', 'Ahmed M. (42y)'), modality: 'MR', exam: t('رنين مغناطيسي للفقرات القطنية', 'MRI Lumbar Spine 3D'), stat: 'STAT', status: 'scan', statusText: t('جارٍ الفحص', 'Scanning') },
    { id: 'VR-9022', patient: t('سارة ك. ح (34 سنة)', 'Sarah K. (34y)'), modality: 'CT', exam: t('أشعة مقطعية بالصبغة على الصدر', 'CT Chest w/ Contrast'), stat: 'ROUTINE', status: 'dict', statusText: t('قيد الإملاء والتقرير', 'Dictating') },
    { id: 'VR-9023', patient: t('خالد ع. س (58 سنة)', 'Khaled A. (58y)'), modality: 'DX', exam: t('أشعة سينية رقمية على الركبة', 'Digital X-Ray Knee AP/LAT'), stat: 'ROUTINE', status: 'done', statusText: t('معتمد وموقع', 'Signed') },
    { id: 'VR-9024', patient: t('مريم ح. ن (29 سنة)', 'Mariam H. (29y)'), modality: 'US', exam: t('موجات صوتية للبطن والحوض', 'Ultrasound Abdomen & Pelvis'), stat: 'STAT', status: 'sched', statusText: t('مجدول بالانتظار', 'Scheduled') }
  ];
  const visible = items.filter(i => filter === 'ALL' || i.modality === filter);
  return (
    <div className="modality-showcase ris-showcase">
      <div className="modality-head">
        <div className="modality-title">
          <ScanLine size={16} />
          <span>{t('قائمة عمل الأشعة (Modality Worklist)', 'Modality worklist')}</span>
        </div>
        <span className="modality-badge">{t('بيانات تجريبية', 'SAMPLE DATA')}</span>
      </div>
      <div className="ris-worklist-wrap">
        <div className="ris-filter-bar">
          {[['ALL', t('الكل (4)', 'All (4)')], ['MR', 'MRI'], ['CT', 'CT'], ['DX', 'X-Ray'], ['US', 'Ultrasound']].map(([code, label]) => (
            <button key={code} type="button" className={`ris-chip ${filter === code ? 'active' : ''}`} onClick={() => setFilter(code)}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="ris-table">
            <thead>
              <tr>
                <th>{t('المريض والملف', 'Patient & ID')}</th>
                <th>{t('الجهاز', 'Mod')}</th>
                <th>{t('الفحص المطلوب', 'Study Description')}</th>
                <th>{t('الأولوية', 'Priority')}</th>
                <th>{t('حالة الفحص', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(row => (
                <tr key={row.id}>
                  <td>
                    <b>{row.patient}</b>
                    <div style={{ fontSize: '9px', color: '#769b85', fontFamily: 'monospace' }}>{row.id}</div>
                  </td>
                  <td><span className={`ris-modality-tag tag-${row.modality.toLowerCase()}`}>{row.modality}</span></td>
                  <td>{row.exam}</td>
                  <td>
                    <span className={`ris-stat-badge ${row.stat === 'STAT' ? 'stat-urgent' : 'stat-routine'}`}>{row.stat}</span>
                  </td>
                  <td><span className={`ris-status-cell ${row.status}`}>● {row.statusText}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PacsDicomPreview({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const [preset, setPreset] = useState('BRAIN');
  const [slice, setSlice] = useState(72);
  const [aiAssist, setAiAssist] = useState(true);
  const [caliper, setCaliper] = useState(true);
  const [inverted, setInverted] = useState(false);

  const presets: { [key: string]: { name: string; w: number; l: number; filter: string } } = {
    BRAIN: { name: t('المخ والأعصاب', 'Brain W/L'), w: 80, l: 40, filter: 'contrast(1.1) brightness(1.0)' },
    BONE: { name: t('العظام', 'Bone W/L'), w: 2000, l: 500, filter: 'contrast(1.7) brightness(0.85)' },
    LUNG: { name: t('الرئة', 'Lung W/L'), w: 1500, l: -600, filter: 'contrast(1.35) brightness(1.25)' },
    SOFT: { name: t('أنسجة رخوة', 'Soft Tissue'), w: 400, l: 50, filter: 'contrast(0.95) brightness(1.1)' }
  };

  return (
    <div className="modality-showcase pacs-showcase" id="dicom-ai">
      <div className="modality-head">
        <div className="modality-title">
          <Layers3 size={16} />
          <span>{t('عارض DICOM مع دعم الذكاء الاصطناعي', 'DICOM viewer with clinical AI assist')}</span>
        </div>
        <div className="pacs-live-indicators">
          <span className="pacs-tag-ai"><Sparkles size={12} /> OHIF v3</span>
          <span className="modality-badge">{t('بيانات تجريبية', 'SAMPLE DATA')}</span>
        </div>
      </div>
      <div className="pacs-viewer-wrap">
        <div className="pacs-toolbar">
          <div className="pacs-tools">
            <span style={{ fontSize: '10px', color: '#84ab96', marginInlineEnd: '4px' }}>{t('نافذة الرؤية:', 'W/L:')}</span>
            {Object.entries(presets).map(([k, p]) => (
              <button key={k} type="button" className={`pacs-tool-btn ${preset === k ? 'active' : ''}`} onClick={() => setPreset(k)}>
                {p.name}
              </button>
            ))}
          </div>
          <div className="pacs-tools">
            <button type="button" className={`pacs-tool-btn ${aiAssist ? 'active-ai' : ''}`} onClick={() => setAiAssist(!aiAssist)}>
              <Cpu size={12} /> {aiAssist ? t('الذكاء الاصطناعي: نشط', 'AI: Active') : t('تشغيل الـ AI', 'Enable AI')}
            </button>
            <button type="button" className={`pacs-tool-btn ${caliper ? 'active' : ''}`} onClick={() => setCaliper(!caliper)}>
              📏 {t('قياس Caliper', 'Caliper')}
            </button>
            <button type="button" className={`pacs-tool-btn ${inverted ? 'active' : ''}`} onClick={() => setInverted(!inverted)}>
              ◐ {inverted ? t('عادي', 'Normal') : t('عكس الألوان', 'Invert')}
            </button>
          </div>
        </div>
        <div className="pacs-viewport" style={{ filter: `${presets[preset].filter} ${inverted ? 'invert(1)' : ''}` }}>
          <div className="dicom-overlay-tl">
            <div>VIARA MEDICAL RADIOLOGY</div>
            <div>MR BRAIN 3D AXIAL T1+C</div>
            <div>SERIES: 04 / SLICE: {String(slice).padStart(2, '0')}/144</div>
          </div>
          <div className="dicom-overlay-tr">
            <div>ANONYMOUS #84920</div>
            <div>AGE: 42Y | SEX: M</div>
            <div>ACC: VR-2026-9021</div>
          </div>
          <div className="dicom-canvas-art">
            <div className="dicom-crosshair-h" />
            <div className="dicom-crosshair-v" />
            {caliper && <div className="dicom-caliper"><span>24.8 mm</span></div>}
            {aiAssist && (
              <div className="dicom-ai-box">
                <span className="ai-box-tag">AI: Normal Parenchyma (99.2%)</span>
                <span className="ai-box-vol">Vol: 0.0 mm³</span>
              </div>
            )}
          </div>
          <div className="dicom-overlay-bl">
            <div>FOV: 230 mm | THK: 1.0 mm</div>
            <div>TE: 2.8 ms | TR: 6.4 ms</div>
            <div>MATRIX: 512 x 512 | LOSSLESS</div>
          </div>
          <div className="dicom-overlay-br">
            <div>W: {presets[preset].w} | L: {presets[preset].l}</div>
            <div>ZOOM: 135%</div>
            <div>{aiAssist ? 'AI STAT: NO CRITICAL LESION' : 'MANUAL VIEW'}</div>
          </div>
        </div>
        <div className="pacs-slice-scrubber">
          <span className="scrubber-label">{t('تصفح الشرائح:', 'Slice navigator:')}</span>
          <input type="range" min="1" max="144" value={slice} onChange={e => setSlice(Number(e.target.value))} className="slice-slider" aria-label={t('رقم الشريحة', 'Slice number')} />
          <span className="slice-counter">{slice} / 144</span>
        </div>
      </div>
    </div>
  );
}

function CmsClinicPreview({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  return (
    <div className="modality-showcase cms-showcase">
      <div className="modality-head">
        <div className="modality-title">
          <Building2 size={16} />
          <span>{t('إدارة العيادات والمراكز التخصصية', 'Clinic and specialty center management')}</span>
        </div>
        <span className="modality-badge">{t('بيانات تجريبية', 'SAMPLE DATA')}</span>
      </div>
      <div className="cms-flow-wrap">
        <div className="cms-flow-cards">
          <div className="cms-clinic-card">
            <b>{t('عيادة الباطنة', 'Internal Medicine')}</b>
            <small>{t('د. أحمد كمال · غرفة 101', 'Dr. Ahmed K. · Room 101')}</small>
            <strong>{t('18 مريض اليوم', '18 Patients')}</strong>
            <span style={{ fontSize: '10px', color: '#ffd885' }}>{t('انتظار: 6 دقائق', 'Wait: 6 mins')}</span>
          </div>
          <div className="cms-clinic-card">
            <b>{t('عيادة العظام', 'Orthopedics')}</b>
            <small>{t('د. سارة عثمان · غرفة 103', 'Dr. Sarah O. · Room 103')}</small>
            <strong>{t('14 مريض اليوم', '14 Patients')}</strong>
            <span style={{ fontSize: '10px', color: '#7ee0a7' }}>{t('انتظار: 11 دقيقة', 'Wait: 11 mins')}</span>
          </div>
          <div className="cms-clinic-card">
            <b>{t('عيادة الأطفال', 'Pediatrics')}</b>
            <small>{t('د. عمر خالد · غرفة 105', 'Dr. Omar K. · Room 105')}</small>
            <strong>{t('9 مرضى اليوم', '9 Patients')}</strong>
            <span style={{ fontSize: '10px', color: '#82e4b4' }}>{t('انتظار: 4 دقائق', 'Wait: 4 mins')}</span>
          </div>
        </div>
        <div className="cms-nphies-banner">
          <span>
            <ShieldCheck size={16} color="#82e4b4" />
            {t('مسار توضيحي لمتابعة التأمين؛ التكاملات تُراجع في العرض الفني.', 'Illustrative insurance workflow; integrations are confirmed in your technical proposal.')}
          </span>
        </div>
      </div>
    </div>
  );
}

function EnterpriseArchitectureMatrix({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 'modalities',
      title: t('الأجهزة الطبية ومراكز الأشعة', 'Medical modalities and devices'),
      protocol: 'DICOM 3.0 · MWL · C-STORE · ASTM',
      desc: t(
        'ربط ثنائي الاتجاه مع أجهزة الرنين المغناطيسي والأشعة المقطعية والسينية والموجات الصوتية وأجهزة التحليل المخبرية.',
        'Two-way integration with MRI, CT, digital X-ray, ultrasound and laboratory analyzers.'
      ),
      tags: ['Modality Worklist (MWL)', 'C-STORE / C-MOVE / Q-R', 'Storage Commitment', 'MPPS', 'ASTM Lab Interfaces']
    },
    {
      id: 'core',
      title: t('المنظومة السريرية المركزية', 'Central clinical platform'),
      protocol: 'HL7 FHIR v4 · RESTful API · WebSocket',
      desc: t(
        'محرك هجين يجمع ذاكرة محلية داخل المركز مع أرشيف سحابي مشفر لإدارة الفروع والأرشفة المركزية.',
        'A hybrid engine pairing an on-premise local cache with an encrypted cloud archive for branch governance.'
      ),
      tags: ['OHIF v3 viewer', 'AES-256 GCM archive', 'Automated failover', 'Multi-tenant isolation']
    },
    {
      id: 'national',
      title: t('المنصات الوطنية والتأمين', 'National platforms and payers'),
      protocol: 'NPHIES REST · CCHI · ZATCA Phase 2',
      desc: t(
        'ربط مع منصة نفيس ومجلس الضمان الصحي، مع مراجعة المطالبات قبل الإرسال وفوترة إلكترونية متوافقة مع الزكاة والضريبة والجمارك.',
        'Integration with NPHIES and CCHI, claim review before submission and ZATCA Phase 2 e-invoicing.'
      ),
      tags: ['Pre-authorization', 'Claim scrubbing', 'ICD-10 & CPT mapping', 'Electronic resubmission']
    },
    {
      id: 'digital',
      title: t('محطات الأطباء وبوابة المريض', 'Clinician workstations and patient access'),
      protocol: 'WebRTC · WhatsApp API · iOS / Android',
      desc: t(
        'محطة تشخيص لاستشاريي الأشعة مع الإملاء الصوتي، وبوابة مريض ترسل رابط الفحص والتقرير عبر واتساب دون تثبيت برامج.',
        'A diagnostic workstation for radiologists with voice dictation, and a patient portal that sends viewer links over WhatsApp.'
      ),
      tags: ['WhatsApp secure links', 'Bilingual dictation', 'Telehealth video', 'Patient mobile portal']
    }
  ];
  const layer = layers[activeLayer];

  return (
    <section className="section architecture-section" id="architecture">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Tag>{t('البنية والربط', 'ARCHITECTURE')}</Tag>
            <h2>
              {t('بنية متصلة.', 'Connected infrastructure.')}<br />
              <span>{t('ربط وأمان وفق معايير معروفة.', 'Built on recognized standards.')}</span>
            </h2>
          </div>
          <p>
            {t(
              'تربط VIARA الأجهزة والمختبرات والأقسام وجهات التأمين والأطباء في شبكة واحدة آمنة.',
              'VIARA connects modalities, laboratories, departments, payers and clinicians in one secure network.'
            )}
          </p>
        </div>

        <div className="arch-interactive-matrix" data-reveal>
          <div className="arch-layer-nav">
            {layers.map((l, i) => (
              <button type="button" key={l.id} className={`arch-nav-item ${activeLayer === i ? 'active' : ''}`} onClick={() => setActiveLayer(i)} aria-pressed={activeLayer === i}>
                <span className="arch-num">0{i + 1}</span>
                <div className="arch-nav-text">
                  <b>{l.title}</b>
                  <small dir="ltr">{l.protocol}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="arch-display-card" aria-live="polite">
            <div className="arch-display-head">
              <div>
                <span className="arch-tag">{layer.protocol}</span>
                <h3>{layer.title}</h3>
              </div>
            </div>
            <p>{layer.desc}</p>
            <div className="arch-tags-row">
              {layer.tags.map(item => (
                <span key={item} className="arch-feature-tag"><Check size={13} /> {item}</span>
              ))}
            </div>
            <div className="arch-spec-footer">
              <span><ShieldCheck size={16} /> {t('تشفير البيانات أثناء النقل والتخزين، وتفاصيل الامتثال تُحدد في العرض الفني', 'Encryption in transit and at rest; compliance details are confirmed in your proposal')}</span>
              <span dir="ltr">AES-256 GCM · TLS 1.3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ViaraSite({ content, locale = 'ar', reviews = [] }: { content: SiteContent; locale?: Locale; reviews?: PublicReview[] }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const reviewTrack = useRef<HTMLDivElement>(null);

  const [readingRoom, setReadingRoom] = useState(false);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [product, setProduct] = useState(0);
  const [stage, setStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [interest, setInterest] = useState('CONSULT');
  const [plan, setPlan] = useState('لم أحدد بعد');
  const [offer, setOffer] = useState('');
  const [scope, setScope] = useState<ScopeEstimate | null>(null);
  const [requestedSystems, setRequestedSystems] = useState<string[]>([]);
  const [requestedFacility, setRequestedFacility] = useState('');
  const hero = ['رعاية أفضل تبدأ', 'أنظمة إدارة'].includes(content.hero.title.ar) ? {
    ...content.hero,
    title: { ar: 'تقنية تجمع', en: 'Technology for' },
    accent: { ar: 'منظومة الرعاية.', en: 'connected healthcare.' },
    description: { ar: 'من المستشفى والعيادة إلى المختبر والأشعة والرعاية الرقمية؛ استكشف الأنظمة وابنِ نطاقًا يناسب فريقك ومنشأتك.', en: 'From hospitals and clinics to laboratories, imaging and digital care. Explore healthcare systems and build a scope around your facility and team.' },
    cta: { ar: 'ناقش احتياجات منشأتك', en: 'Discuss your facility’s needs' },
  } : content.hero;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('interest');
    const modules = [...new Set((params.get('systems') || '').split(','))].filter(id => healthcareSystems.some(system => system.id === id) && !content.products.some(p => p.id === id && !p.enabled)).slice(0, 6);
    if (modules.length) { setRequestedSystems(modules); setInterest('CONSULT'); }
    const facilityId = params.get('facility') || '';
    if (facilityProfiles.some(p => p.id === facilityId)) setRequestedFacility(facilityId);
    if (requested && content.products.some(p => p.enabled && p.id === requested)) {
      setInterest(requested);
      setProduct(content.products.filter(p => p.enabled).findIndex(p => p.id === requested));
    }
  }, [content.products]);

  useEffect(() => {
    if (!menu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenu(false);
      root.current?.querySelector<HTMLButtonElement>('.menu-button')?.focus();
    };
    const closeOutsideHeader = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.querySelector('header')?.contains(event.target)) setMenu(false);
    };
    const desktop = window.matchMedia('(min-width: 1201px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenu(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutsideHeader);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutsideHeader);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menu]);

  const products = content.products.filter(p => p.enabled);
  const plans = content.plans.filter(p => p.enabled);
  const activeProduct = products[product] || products[0];
  const offers = content.offers.filter(o => isOfferActive(o));
  const showReviews = content.sections.reviews && reviews.length > 0;
  const showOffers = content.sections.offers && offers.length > 0;
  const contact = content.contact;
  const base = en ? '/en' : '/';

  const journey = [
    {
      icon: CalendarDays,
      dept: t('الاستقبال والطوارئ', 'Front desk & triage'),
      tat: t('تحقق فوري من الأهلية', 'Instant eligibility check'),
      title: t('حجز وتصنيف واستقبال', 'Booking, triage and reception'),
      text: t('حجز موعد إلكتروني منظم، تحقق من أهلية التأمين، إصدار تذكرة انتظار، وفتح الملف الطبي الموحد.', 'Online booking, insurance eligibility verification, digital queue ticketing and opening the longitudinal health record.'),
      tags: [t('المواعيد الذكية', 'Smart booking'), t('مطابقة نفيس', 'NPHIES sync'), t('ملف المريض الموحد', 'Single patient record'), t('تصنيف الطوارئ', 'Triage')]
    },
    {
      icon: Stethoscope,
      dept: t('العيادات والتمريض', 'Consultation & nursing'),
      tat: t('توثيق لحظي', 'Real-time entry'),
      title: t('الفحص السريري والملف الطبي', 'Clinical encounter and EMR'),
      text: t('توثيق الأعراض وتسجيل العلامات الحيوية ومراجعة التاريخ المرضي والحساسيات، وطلب الفحوصات والتحاليل بنقرة واحدة.', 'Symptom documentation, vitals capture, allergy alerts and one-click electronic orders for lab and radiology.'),
      tags: [t('الملف السريري', 'Clinical EMR'), t('العلامات الحيوية', 'Vitals'), t('أوامر CPOE', 'CPOE orders'), t('تنبيه الحساسية', 'Allergy alerts')]
    },
    {
      icon: ScanLine,
      dept: t('الأشعة والمختبر', 'Imaging & laboratory'),
      tat: t('بث DICOM مباشر', 'Direct DICOM streaming'),
      title: t('التشخيص المتكامل (LIS و RIS/PACS)', 'Integrated diagnostics (LIS & PACS)'),
      text: t('إرسال أوامر الفحص إلى أجهزة الأشعة عبر Modality Worklist وتتبع باركود عينات المختبر على أجهزة التحليل.', 'Exam orders flow to modalities via DICOM Modality Worklist, with tube barcode tracking on laboratory analyzers.'),
      tags: [t('قوائم الأجهزة', 'MWL worklist'), t('أرشفة PACS', 'PACS archive'), t('باركود العينات', 'Sample barcoding'), t('ربط المحللات', 'Analyzer interfacing')]
    },
    {
      icon: Cpu,
      dept: t('الذكاء الاصطناعي والأطباء', 'AI & radiologists'),
      tat: t('تقارير أسرع', 'Faster reporting'),
      title: t('الذكاء الاصطناعي والإملاء الصوتي', 'Clinical AI and voice reporting'),
      text: t('إملاء طبي بالعربية والإنجليزية، ودعم بالذكاء الاصطناعي لترتيب الحالات الحرجة وتجهيز مسودة التقرير لمراجعة الطبيب.', 'Bilingual medical dictation, plus AI assistance to prioritize critical cases and draft reports for clinician review.'),
      tags: [t('إملاء صوتي', 'Voice dictation'), t('ترتيب الأولويات', 'Prioritization'), t('تنبيه الحالات الحرجة', 'Critical flag'), t('توقيع إلكتروني', 'Digital sign-off')]
    },
    {
      icon: Pill,
      dept: t('الصيدلية', 'Pharmacy'),
      tat: t('صرف مراجَع', 'Checked dispensing'),
      title: t('الصيدلية والوصفة الإلكترونية', 'Pharmacy and e-prescription'),
      text: t('استلام الوصفة فور توقيعها، وفحص التداخلات الدوائية وملاءمة الجرعات، وطباعة ملصق الجرعة بالباركود.', 'Prescriptions arrive once signed, with drug-interaction and dosage checks and barcoded labels.'),
      tags: [t('الوصفة الإلكترونية', 'e-Prescription'), t('فحص التداخلات', 'Interaction checks'), t('الدفعات والصلاحية', 'Batch tracking'), t('وصفتي', 'Wasfati')]
    },
    {
      icon: ShieldCheck,
      dept: t('التأمين وبوابة المريض', 'Billing & patient portal'),
      tat: t('مطالبة نظيفة من أول مرة', 'Clean first-pass claims'),
      title: t('المطالبة المالية وبوابة المريض', 'Claims and patient delivery'),
      text: t('إرسال المطالبة إلى نفيس مع الفاتورة الضريبية، وإرسال رابط التقرير وصور الأشعة إلى هاتف المريض عبر واتساب.', 'Claims go to the NPHIES gateway with a ZATCA invoice, while results are delivered to the patient on WhatsApp.'),
      tags: [t('مطالبات نفيس', 'NPHIES claims'), t('فاتورة ضريبية', 'ZATCA invoice'), t('رابط واتساب', 'WhatsApp delivery'), t('بوابة المريض', 'Patient app')]
    }
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => setStage(s => (s + 1) % journey.length), 4500);
    return () => clearInterval(interval);
  }, [autoPlay, journey.length]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = en ? 'ltr' : 'rtl';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'IntersectionObserver' in window) {
      const nodes = root.current?.querySelectorAll('[data-reveal]');
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.08 });
      root.current?.classList.add('motion-ready');
      nodes?.forEach(n => observer.observe(n));
      const onScroll = () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
        root.current?.classList.toggle('is-scrolled', window.scrollY > 20);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
      };
    }
  }, [locale, en]);

  function choose(id = 'CONSULT', packageId = 'لم أحدد بعد', offerTitle = '') {
    setScope(null);
    setRequestedSystems([]);
    setRequestedFacility('');
    setInterest(id);
    setPlan(packageId);
    setOffer(offerTitle);
    setModal(null);
    setMenu(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  /* From the systems universe: only ids that exist in the catalog reach the lead form. */
  function requestSystems(ids: string[]) {
    const valid = ids.filter(id => healthcareSystems.some(system => system.id === id)).slice(0, 6);
    choose('CONSULT');
    setRequestedSystems(valid);
  }

  function scrollReviews(amount: number) {
    reviewTrack.current?.scrollBy({ left: amount, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function Brand({ light = false }: { light?: boolean }) {
    return (
      <a className={`brand ${light ? 'brand-light' : ''}`} href={base} aria-label={content.brand.name}>
        <img src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo} alt="" width={58} height={44} />
        <span>
          <b dir="ltr">{content.brand.name}<span className="brand-dot">.</span></b>
          <small dir="ltr">HEALTHCARE TECHNOLOGY</small>
        </span>
      </a>
    );
  }

  const socials = [
    { url: contact.facebook, icon: Facebook, name: 'Facebook' },
    { url: contact.instagram, icon: Instagram, name: 'Instagram' },
    { url: contact.linkedin, icon: Linkedin, name: 'LinkedIn' },
    { url: contact.youtube, icon: Youtube, name: 'YouTube' },
    { url: contact.x, icon: ExternalLink, name: 'X' }
  ].filter(s => s.url);

  function preferences(placement: 'desktop' | 'mobile') {
    return (
      <div className={`nav-preferences nav-preferences-${placement}`}>
        <a className="language-switch" href={en ? '/' : '/en'} hrefLang={en ? 'ar' : 'en'} aria-label={en ? 'التبديل إلى العربية' : 'Switch to English'}>
          <Globe2 size={16} />
          <span>{placement === 'mobile' ? (en ? 'العربية' : 'English') : (en ? 'العربية' : 'EN')}</span>
        </a>
        <button type="button" className="reading-room-btn" onClick={() => setReadingRoom(!readingRoom)} aria-pressed={readingRoom} aria-label={t('نمط غرفة القراءة', 'Reading room mode')}>
          {readingRoom ? <Sun size={15} /> : <Moon size={15} />}
          <span>{readingRoom ? t('نهاري', 'Light') : t('ليلي', 'Dark')}</span>
        </button>
      </div>
    );
  }

  const whatsappText = encodeURIComponent(en ? 'Hello VIARA, I would like to inquire about healthcare management systems.' : 'مرحبًا VIARA، أود الاستفسار عن أنظمة إدارة المنشآت الصحية.');

  return (
    <div ref={root} className={`site-shell modern-site ${readingRoom ? 'reading-room-mode' : ''}`} lang={locale} dir={en ? 'ltr' : 'rtl'} style={{ '--green': content.brand.primary } as CSSProperties}>
      <div className="scroll-meter" ref={progress} aria-hidden="true" />
      <a href="#main" className="skip-link">{t('انتقل إلى المحتوى', 'Skip to content')}</a>

      <header className="header">
        <div className="container nav-wrap">
          <Brand />
          <nav id="site-nav" className={`nav ${menu ? 'mobile-open' : ''}`} aria-label={t('التنقل الرئيسي', 'Main navigation')}>
            {[
              ['#systems', t('الأنظمة', 'Systems')],
              ['#solutions', t('الحلول', 'Solutions')],
              ['#care-pathway', t('مسار الرعاية', 'Care pathway')],
              ['#architecture', t('البنية والربط', 'Architecture')],
              ['#plans', t('الباقات', 'Plans')],
              ['#faq', t('الأسئلة الشائعة', 'FAQ')]
            ].map(([href, label]) => (
              <a href={href} key={href} onClick={() => setMenu(false)}>{label}</a>
            ))}
            {preferences('mobile')}
          </nav>

          <div className="nav-actions">
            {preferences('desktop')}
            <a href="#contact" className="button button-small header-cta" onClick={() => setMenu(false)}>
              {t('اطلب عرضًا', 'Book a demo')}
              <ArrowUpLeft size={16} />
            </a>
            <button type="button" className="menu-button icon-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="site-nav" aria-label={t('القائمة', 'Menu')}>
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO — one message, one photo, one chip */}
        <section className="hero modern-hero vx-hero">
          <div className="hero-ambient" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="live-dot" />
                {txt(hero.badge, locale)}
              </div>
              <h1>
                {txt(hero.title, locale)}<br />
                <span>{txt(hero.accent, locale)}</span>
              </h1>
              <p>{txt(hero.description, locale)}</p>
              <div className="hero-actions">
                <a href="#contact" className="button">
                  {txt(hero.cta, locale)}
                  <ArrowUpLeft size={19} />
                </a>
                <a href="#systems" className="vx-hero-link">
                  {t('تصفح الأنظمة', 'Browse the systems')}
                  {en ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
                </a>
              </div>
              <div className="hero-checks">
                {[t('حول احتياجاتك', 'Built around your needs'), t('واجهات واضحة', 'Clear interfaces'), t('مساحة للتطور', 'Room to grow')].map(v => (
                  <span key={v}><Check size={12} />{v}</span>
                ))}
              </div>
            </div>

            <div
              className="hero-visual modern-visual photographic-visual"
              ref={visual}
              onPointerMove={e => {
                if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                const b = e.currentTarget.getBoundingClientRect();
                visual.current?.style.setProperty('--tilt-y', `${((e.clientX - b.left) / b.width - .5) * 5}deg`);
                visual.current?.style.setProperty('--tilt-x', `${-((e.clientY - b.top) / b.height - .5) * 4}deg`);
              }}
              onPointerLeave={() => {
                visual.current?.style.setProperty('--tilt-x', '0deg');
                visual.current?.style.setProperty('--tilt-y', '0deg');
              }}
            >
              <div className="visual-grid" aria-hidden="true" />
              <div className="floating-tag tag-top">
                <span className="tag-icon"><Network size={18} /></span>
                <div>
                  <b>{t('رحلة عمل متصلة', 'One connected workflow')}</b>
                  <small>{t('من الاستقبال إلى الإدارة', 'From reception to management')}</small>
                </div>
                <CheckCircle2 size={17} />
              </div>
              <div className="hero-photo-frame">
                <img
                  src={content.imagery.hero}
                  width={1536}
                  height={1024}
                  fetchPriority="high"
                  decoding="async"
                  alt={t('مشهد توضيحي لفريق أشعة داخل مركز طبي حديث', 'Illustrative scene of a radiology team in a contemporary medical center')}
                />
                <div className="photo-story-label">
                  <ScanLine size={20} />
                  <div>
                    <span>{t('الإنسان في قلب التقنية', 'PEOPLE AT THE HEART OF TECHNOLOGY')}</span>
                    <b>{t('رعاية متصلة. تجربة أفضل.', 'Connected care. A better experience.')}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StandardsStrip locale={locale} />

        {/* ALL SYSTEMS — the interactive centerpiece */}
        <SystemsUniverse locale={locale} onRequest={requestSystems} />

        <div id="find-solution" />
        <HealthcareExplorer locale={locale} products={content.products} compact onRequest={(ids, facilityId) => { choose('CONSULT'); setRequestedSystems(ids); setRequestedFacility(facilityId); }} />

        {/* SOLUTIONS DEEP DIVE */}
        <section id="solutions" className="section solutions">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <Tag>{t('نظرة أقرب', 'A CLOSER LOOK')}</Tag>
                <h2>
                  {t('ابدأ من حيث تحتاج.', 'Start where you need to.')}<br />
                  <span>{t('وتوسع عندما تكون جاهزًا.', 'Grow when you are ready.')}</span>
                </h2>
              </div>
              <p>{t('جرّب واجهات الأنظمة الأكثر طلبًا بنفسك.', 'Try the interfaces of our most requested systems yourself.')}</p>
            </div>

            <div className="product-tabs" role="tablist" aria-label={t('الأنظمة', 'Solutions')} data-reveal>
              {products.map((p, i) => {
                const I = productIcons[p.id as keyof typeof productIcons] || ScanLine;
                return (
                  <button
                    type="button"
                    key={p.id}
                    role="tab"
                    id={`tab-${p.id}`}
                    aria-controls={`panel-${p.id}`}
                    aria-selected={i === product}
                    tabIndex={i === product ? 0 : -1}
                    className={i === product ? 'active' : ''}
                    onClick={() => setProduct(i)}
                    onKeyDown={e => {
                      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        const next = (i + (e.key === (en ? 'ArrowRight' : 'ArrowLeft') ? 1 : products.length - 1)) % products.length;
                        setProduct(next);
                        document.getElementById(`tab-${products[next].id}`)?.focus();
                      }
                    }}
                  >
                    <I size={23} />
                    <div>
                      <b>{txt(p.name, locale)}</b>
                      <span dir="ltr">VIARA {p.id}</span>
                    </div>
                    <ArrowUpLeft size={17} />
                  </button>
                );
              })}
            </div>

            {activeProduct && (
              <div className={`product-panel product-${activeProduct.id.toLowerCase()}`} role="tabpanel" id={`panel-${activeProduct.id}`} aria-labelledby={`tab-${activeProduct.id}`} key={activeProduct.id}>
                <div className="product-text">
                  <span className="product-code" dir="ltr">VIARA {activeProduct.id}</span>
                  <h3>{txt(activeProduct.headline, locale)}</h3>
                  <p>{txt(activeProduct.description, locale)}</p>
                  <ul className="feature-list">
                    {activeProduct.features.map((f, i) => (
                      <li key={i}><span><Check size={13} /></span>{txt(f, locale)}</li>
                    ))}
                  </ul>
                  <a className="text-link" href={solutionPath(activeProduct.id, locale)}>
                    {t('اكتشف هذا الحل', 'Explore this solution')}
                    <ArrowUpLeft size={18} />
                  </a>
                  <small className="scope-note">{txt(activeProduct.note, locale)}</small>
                </div>
                <div className="product-art">
                  {activeProduct.id === 'RIS' ? <RisModalityPreview locale={locale} />
                    : activeProduct.id === 'PACS' ? <PacsDicomPreview locale={locale} />
                      : <CmsClinicPreview locale={locale} />}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CARE PATHWAY */}
        <section className="workflow section care-pathway-section" id="care-pathway">
          <span id="workflow" style={{ position: 'relative', top: '-100px', display: 'block', visibility: 'hidden' }} />
          <div className="container">
            <div className="workflow-header" data-reveal>
              <div>
                <Tag>{t('رحلة واحدة متصلة', 'ONE CONNECTED PATHWAY')}</Tag>
                <h2>
                  {t('من الاستقبال', 'From the front desk')}<br />
                  <span>{t('إلى القرار السريري وبوابة المريض.', 'to the clinical decision and patient delivery.')}</span>
                </h2>
              </div>
              <div className="care-pathway-controls">
                <button
                  type="button"
                  className={`auto-play-btn ${autoPlay ? 'active' : ''}`}
                  onClick={() => setAutoPlay(!autoPlay)}
                  aria-pressed={autoPlay}
                  aria-label={autoPlay ? t('إيقاف التشغيل التلقائي', 'Pause autoplay') : t('تشغيل تلقائي', 'Autoplay')}
                >
                  {autoPlay ? <Pause size={14} /> : <Play size={14} />}
                  <span>{autoPlay ? t('إيقاف', 'Pause') : t('تشغيل تلقائي', 'Autoplay')}</span>
                </button>
                <span className="care-step-counter">{stage + 1} / {journey.length}</span>
              </div>
            </div>

            <div className="journey-tabs" data-reveal aria-label={t('مراحل رحلة العمل', 'Workflow stages')}>
              {journey.map((j, i) => (
                <button
                  type="button"
                  key={j.title}
                  onClick={() => { setStage(i); setAutoPlay(false); }}
                  aria-pressed={stage === i}
                  className={stage === i ? 'active' : ''}
                >
                  <div className="journey-tab-top">
                    <span className="journey-number">0{i + 1}</span>
                    <span className="journey-dept-badge">{j.dept}</span>
                  </div>
                  <div className="journey-tab-title">
                    <j.icon size={18} />
                    <b>{j.title}</b>
                  </div>
                </button>
              ))}
            </div>
            <div className="vx-progress" aria-hidden="true"><i style={{ width: `${((stage + 1) / journey.length) * 100}%` }} /></div>

            <div className="journey-detail" aria-live="polite">
              <span className="journey-detail-icon">
                {(() => { const I = journey[stage].icon; return <I size={32} />; })()}
              </span>
              <div className="journey-detail-body">
                <div className="journey-detail-meta">
                  <span className="journey-dept-pill">{journey[stage].dept}</span>
                  <span className="journey-tat-pill"><Clock3 size={13} /> {journey[stage].tat}</span>
                </div>
                <h3>{journey[stage].title}</h3>
                <p>{journey[stage].text}</p>
                <div className="journey-tags">
                  {journey[stage].tags.map(v => <span key={v}><Check size={12} /> {v}</span>)}
                </div>
              </div>
              <div className="journey-nav-actions">
                <button type="button" className="journey-prev-btn" onClick={() => { setStage((stage - 1 + journey.length) % journey.length); setAutoPlay(false); }} aria-label={t('المرحلة السابقة', 'Previous stage')}>
                  {en ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
                <button type="button" className="journey-next-btn" onClick={() => { setStage((stage + 1) % journey.length); setAutoPlay(false); }} aria-label={t('المرحلة التالية', 'Next stage')}>
                  {en ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        <EnterpriseArchitectureMatrix locale={locale} />

        {/* WHY VIARA — three pillars instead of six cards */}
        <section className="section why-section vx-why" id="why-viara">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <Tag>{t('لماذا VIARA؟', 'WHY VIARA')}</Tag>
                <h2>
                  {t('تعقيد أقل.', 'Less friction.')}<br />
                  <span>{t('تركيز أكبر على الرعاية.', 'More focus on care.')}</span>
                </h2>
              </div>
              <p>{t('نبدأ بفهم فريقك وطريقة عمله، ثم نحدد الأدوات التي تخدمه فعلًا.', 'We start by understanding your team and the way you work, then define the tools that serve you.')}</p>
            </div>
            <div className="benefits-grid">
              {[
                { icon: Users, title: t('تجربة يفهمها فريقك', 'Designed for your team'), body: t('واجهات واضحة وأدوار محددة، مع خطة تدريب تناسب المستخدمين.', 'Clear interfaces, defined roles and training scoped to your users.') },
                { icon: SlidersHorizontal, title: t('نطاق يناسب احتياجاتك', 'A scope that fits'), body: t('حدد الوحدات التي تحتاجها اليوم وما تنوي إضافته لاحقًا ضمن خطة واضحة.', 'Define the modules you need today and what you plan to add later.') },
                { icon: Headphones, title: t('بداية منظمة', 'An organized start'), body: t('تُراجع أنظمتك وأجهزتك الحالية قبل الاتفاق على التكامل، ويُحدد التدريب والدعم في التعاقد.', 'Existing systems and devices are reviewed before integrations are agreed; training and support are defined in your agreement.') }
              ].map((b, i) => (
                <article className="benefit" key={i} data-reveal>
                  <span className={`benefit-icon benefit-${i}`}><b.icon size={24} /></span>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ScopeCalculator locale={locale} onChoose={estimate => { choose('SUITE'); setScope(estimate); }} />

        {/* PLANS */}
        <section className="section plans-section" id="plans">
          <div className="container">
            <div className="center-heading" data-reveal>
              <Tag>{t('باقات تناسب رحلتك', 'A SCOPE FOR YOUR NEXT STEP')}</Tag>
              <h2>{t('اختر نطاقك.', 'Choose your scope.')} <span>{t('ودعنا نصمم عرضك.', 'We’ll shape your proposal.')}</span></h2>
              <p>{t('كل مركز له احتياجاته. هذه نقاط بداية لعرض فني ومالي مخصص.', 'Every facility is different. These packages are starting points for a tailored proposal.')}</p>
            </div>
            <div className="plans-grid">
              {plans.map(p => (
                <article className={`plan-card ${p.featured ? 'featured' : ''}`} key={p.id} data-reveal>
                  {p.featured && <span className="featured-label"><Sparkles size={13} />{t('مساحة أكبر للتوسع', 'MORE ROOM TO GROW')}</span>}
                  <span className="plan-en" dir="ltr">{p.label}</span>
                  <h3>{txt(p.name, locale)}</h3>
                  <p>{txt(p.description, locale)}</p>
                  <div className="plan-price">
                    <b>{txt(p.price, locale)}</b>
                    <small>{t('وفق نطاق العرض المعتمد', 'Subject to your agreed scope')}</small>
                  </div>
                  <button type="button" className={`button ${p.featured ? '' : 'button-outline'}`} onClick={() => choose('CONSULT', p.id)}>
                    {t('اطلب هذه الباقة', 'Explore this package')}
                    <ArrowUpLeft size={17} />
                  </button>
                  <div className="plan-divider" />
                  <ul>
                    {p.features.map((f, i) => <li key={i}><Check size={15} />{txt(f, locale)}</li>)}
                  </ul>
                </article>
              ))}
            </div>
            <div className="plans-bottom">
              <span>{t('المزايا والأسعار والتكاملات تعتمد ضمن العرض الفني والمالي.', 'Features, pricing and integrations are confirmed in your proposal.')}</span>
              <button type="button" className="text-link" onClick={() => setModal('compare')}>
                {t('قارن الباقات', 'Compare packages')}
                <ArrowUpLeft size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* OFFERS */}
        {showOffers && (
          <section className="offers-section" id="offers">
            <div className="container">
              <div className="section-heading" data-reveal>
                <div>
                  <Tag>{t('العروض المتاحة', 'CURRENT OPPORTUNITIES')}</Tag>
                  <h2>
                    {t('خطوة أقرب', 'One step closer')}<br />
                    <span>{t('لبداية أفضل.', 'to a better start.')}</span>
                  </h2>
                </div>
                <p>{t('استكشف العروض المنشورة أو اطلب عرضًا مخصصًا حسب احتياجات مركزك.', 'Explore published offers or request a proposal based on your facility’s needs.')}</p>
              </div>
              {offers.length ? (
                <div className="offers-grid">
                  {offers.map(o => (
                    <article className="offer-card" data-reveal key={o.id}>
                      <div>
                        <Gift size={25} />
                        <span>{txt(o.badge, locale) || t('عرض خاص', 'SPECIAL OFFER')}</span>
                      </div>
                      <h3>{txt(o.title, locale)}</h3>
                      <p>{txt(o.description, locale)}</p>
                      {o.endDate && (
                        <small>
                          <Clock3 size={13} />
                          {t('متاح حتى ', 'Available until ')}
                          {new Date(o.endDate + 'T12:00:00Z').toLocaleDateString(en ? 'en-GB' : 'ar-EG', { timeZone: 'Africa/Cairo' })}
                        </small>
                      )}
                      <button type="button" className="text-link" onClick={() => choose('CONSULT', o.plan, txt(o.title, locale))}>
                        {t('اطلب هذا العرض', 'Request this offer')}
                        <ArrowUpLeft size={17} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="custom-offer" data-reveal>
                  <span className="offer-orbit"><Gift size={32} /></span>
                  <div>
                    <h3>{t('أفضل عرض يبدأ بفهم احتياجاتك.', 'The right proposal starts with your needs.')}</h3>
                    <p>{t('اطلب نطاقًا يناسب حجم مركزك وتخصصه وأولوياته.', 'Tell us your facility’s size, specialty and priorities for a tailored scope.')}</p>
                  </div>
                  <button type="button" className="button button-outline" onClick={() => choose()}>
                    {t('صمم عرضك معنا', 'Shape your proposal')}
                    <ArrowUpLeft size={17} />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        {showReviews && (
          <section className="section reviews-section" id="reviews">
            <div className="container">
              <div className="section-heading" data-reveal>
                <div>
                  <Tag>{t('صوت عملائنا', 'CUSTOMER PERSPECTIVES')}</Tag>
                  <h2>
                    {t('تجارب حقيقية.', 'Real experiences.')}<br />
                    <span>{t('تستحق أن تُسمع.', 'Worth sharing.')}</span>
                  </h2>
                </div>
                <div className="reviews-heading-action">
                  <p>{t('آراء يشاركها أصحابها، وتنشر بعد المراجعة والموافقة.', 'Experiences shared by their authors, published after moderation and consent.')}</p>
                  <button type="button" className="text-link" onClick={() => setModal('review')}>
                    {t('شارك تجربتك', 'Share your experience')}
                    <ArrowUpLeft size={18} />
                  </button>
                </div>
              </div>
              <div className="review-track" ref={reviewTrack}>
                {reviews.map(r => (
                  <article className="review-card" key={r.id} lang={r.locale} dir={r.locale === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="review-stars" aria-label={`${r.rating} / 5`}>
                      {[1, 2, 3, 4, 5].map(n => <Star size={15} key={n} fill={n <= r.rating ? 'currentColor' : 'none'} />)}
                    </div>
                    <Quote className="quote-icon" size={28} />
                    <blockquote>{r.quote}</blockquote>
                    <div className="review-author">
                      <span>{r.name.slice(0, 1)}</span>
                      <div>
                        <b>{r.name}</b>
                        <small>{[r.role, r.organization].filter(Boolean).join(' · ')}</small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="review-controls">
                <button type="button" className="icon-button" aria-label={t('الآراء السابقة', 'Previous reviews')} onClick={() => scrollReviews(en ? -370 : 370)}>
                  <ArrowRight size={17} />
                </button>
                <button type="button" className="icon-button" aria-label={t('الآراء التالية', 'Next reviews')} onClick={() => scrollReviews(en ? 370 : -370)}>
                  <ArrowLeft size={17} />
                </button>
                <span>{t('اسحب لاستكشاف الآراء', 'Swipe to explore')}</span>
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {content.sections.about && (
          <section className="about-section">
            <div className="container about-grid">
              <div className="about-identity about-photography" data-reveal>
                <img
                  className="scene-image"
                  src={content.imagery.care}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  alt={t('مشهد توضيحي لطبيبة ومسؤول مركز طبي يتعاونان عبر جهاز لوحي', 'Illustrative scene of a doctor and medical administrator collaborating with a tablet')}
                />
                <span className="photo-editorial-tag">{t('لأن الرعاية تبدأ بالإنسان', 'CARE BEGINS WITH PEOPLE')}</span>
                <div className="about-brand-stamp">
                  <img src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo} width={52} height={42} loading="lazy" alt="" />
                  <div>
                    <strong dir="ltr">{content.brand.name}</strong>
                    <span>{txt(content.brand.tagline, locale)}</span>
                  </div>
                  <ShieldCheck size={23} />
                </div>
              </div>
              <div className="about-copy" data-reveal>
                <Tag>{t('عن VIARA', 'ABOUT VIARA')}</Tag>
                <h2>{txt(content.about.title, locale)}</h2>
                <p>{txt(content.about.body, locale)}</p>
                <div className="about-values">
                  <span><i className="dot-green" />{t('وضوح', 'Clarity')}</span>
                  <span><i className="dot-yellow" />{t('ترابط', 'Connection')}</span>
                  <span><i className="dot-red" />{t('رعاية', 'Care')}</span>
                </div>
                <a href="#contact" className="text-link">
                  {t('لنتحدث عن مركزك', 'Tell us about your center')}
                  <ArrowUpLeft size={18} />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="section faq-section" id="faq">
          <div className="container faq-grid">
            <div data-reveal>
              <Tag>{t('الأسئلة الشائعة', 'A FEW THINGS TO KNOW')}</Tag>
              <h2>
                {t('قبل أن نبدأ،', 'Before we begin,')}<br />
                <span>{t('دعنا نوضح التفاصيل.', 'let’s make it clear.')}</span>
              </h2>
              <p>{t('لديك سؤال آخر؟ أضفه إلى طلب العرض ليكون جزءًا من النقاش.', 'Have another question? Add it to your request so it is part of the conversation.')}</p>
              <a href="#contact" className="text-link">
                {t('اسأل عن احتياجاتك', 'Ask your question')}
                <ArrowUpLeft size={17} />
              </a>
            </div>
            <div className="faq-list" data-reveal>
              {content.faqs.map((f, i) => (
                <details key={f.id}>
                  <summary>
                    <span className="faq-number">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{txt(f.question, locale)}</h3>
                    <ChevronDown size={18} />
                  </summary>
                  <p>{txt(f.answer, locale)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy" data-reveal>
              <Tag>{t('لنخطط لخطوتك التالية', 'LET’S PLAN YOUR NEXT STEP')}</Tag>
              <h2>
                {t('مركزك يستحق', 'Your center deserves')}<br />
                <span>{t('طريقة أفضل للإدارة.', 'a better way to work.')}</span>
              </h2>
              <p>{t('أخبرنا عن منشأتك وما تحتاجه. نبدأ بفهم أولوياتك لنحدد نقطة البداية المناسبة.', 'Tell us about your facility and your priorities. We start by understanding what matters to you.')}</p>
              <div className="contact-channels">
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <Mail size={18} />
                    <span dir="ltr">{contact.email}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>
                    <Phone size={18} />
                    <span dir="ltr">{contact.phone}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {contact.whatsapp && (
                  <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} />
                    <span>{t('تواصل عبر واتساب', 'Chat on WhatsApp')}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {txt(contact.address, locale) && (
                  <div>
                    <MapPin size={18} />
                    <span>{txt(contact.address, locale)}</span>
                  </div>
                )}
              </div>
              <div className="next-steps">
                <h3>{t('ما الذي نناقشه في العرض؟', 'What will your proposal cover?')}</h3>
                {[t('احتياجات المركز وأولويات الفريق', 'Your center’s needs and team priorities'), t('الأنظمة والوحدات والتكاملات', 'Systems, modules and integrations'), t('خطة التنفيذ والتدريب والتكلفة', 'Implementation, training and costs')].map((v, i) => (
                  <span key={v}><i>0{i + 1}</i>{v}</span>
                ))}
              </div>
              {socials.length > 0 && (
                <div className="social-links">
                  {socials.map(s => (
                    <a href={s.url} key={s.name} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                      <s.icon size={18} />
                    </a>
                  ))}
                </div>
              )}
              <div className="contact-note">
                <ShieldCheck size={19} />
                <span>{t('لا تدخل بيانات مرضى أو معلومات طبية في النموذج.', 'Please do not enter patient details or medical information.')}</span>
              </div>
            </div>

            <div className="contact-form-wrap" data-reveal>
              <LeadForm
                locale={locale}
                content={content}
                interest={interest}
                setInterest={setInterest}
                plan={plan}
                setPlan={setPlan}
                offer={offer}
                setOffer={setOffer}
                scope={scope}
                setScope={setScope}
                requestedSystems={requestedSystems}
                clearRequestedSystems={() => { setRequestedSystems([]); setRequestedFacility(''); }}
                requestedFacility={requestedFacility}
                onPrivacy={() => setModal('privacy')}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Brand light />
              <p>{txt(content.brand.tagline, locale)}</p>
              {socials.length > 0 && (
                <div className="social-links footer-social">
                  {socials.map(s => (
                    <a href={s.url} key={s.name} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                      <s.icon size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="footer-links">
              <h3>{t('استكشف VIARA', 'Explore VIARA')}</h3>
              <a href="#systems">{t('كل الأنظمة', 'All systems')}</a>
              <a href={en ? '/en/systems' : '/systems'}>{t('دليل أنظمة الرعاية الصحية', 'Healthcare systems directory')}</a>
              {products.map(p => <a href={solutionPath(p.id, locale)} key={p.id}>{txt(p.name, locale)}</a>)}
              <a href="#calculator">{t('حاسبة النطاق', 'Scope calculator')}</a>
              <a href="#plans">{t('الباقات', 'Packages')}</a>
            </div>
            <div className="footer-links">
              <h3>{t('خطوتك التالية', 'Your next step')}</h3>
              <a href="#contact">{t('طلب عرض توضيحي', 'Request a demo')}</a>
              <a href="#find-solution">{t('اختيار الحل المناسب', 'Find your solution')}</a>
              <a href={en ? '/en/requests' : '/requests'}>{t('طلباتي', 'My requests')}</a>
              {content.sections.reviews && <button type="button" className="text-link" onClick={() => setModal('review')}>{t('شارك تجربتك', 'Share your experience')}</button>}
            </div>
            <div className="footer-signature">
              <span dir="ltr">A BETTER<br />WAY TO <em>CARE.</em></span>
              <div><i className="dot-green" /><i className="dot-yellow" /><i className="dot-red" /></div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {content.brand.name}. {t('جميع الحقوق محفوظة.', 'All rights reserved.')}</span>
            <div>
              <a href="/admin" className="admin-link"><LockKeyhole size={11} />{t('لوحة الإدارة', 'Admin dashboard')}</a>
              <button type="button" onClick={() => setModal('privacy')}>{t('الخصوصية', 'Privacy')}</button>
              <button type="button" onClick={() => setModal('terms')}>{t('شروط الاستخدام', 'Terms')}</button>
              <a href="#main">{t('العودة للأعلى', 'Back to top')} ↑</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Compact floating WhatsApp: icon only, label on hover/focus */}
      {contact.whatsapp && (
        <a
          className="floating-whatsapp"
          href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('تواصل عبر واتساب', 'Chat on WhatsApp')}
        >
          <MessageCircle size={24} />
          <span>{t('تحدث مع مستشار الحلول', 'Talk to a solutions advisor')}</span>
        </a>
      )}

      {/* MODALS */}
      <Modal open={modal === 'review'} close={() => setModal(null)} title={t('شارك تجربتك', 'Share your experience')}>
        <ReviewForm locale={locale} />
      </Modal>

      <Modal open={modal === 'compare'} close={() => setModal(null)} title={t('مقارنة الباقات', 'Compare packages')}>
        <div className="comparison-scroll">
          <table className="comparison">
            <thead>
              <tr>
                <th>{t('نطاق الباقة', 'Package scope')}</th>
                {plans.map(p => <th key={p.id}>{txt(p.name, locale)}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t('الوصف', 'Overview')}</th>
                {plans.map(p => <td key={p.id}>{txt(p.description, locale)}</td>)}
              </tr>
              <tr>
                <th scope="row">{t('ما يشمله النطاق', 'Included scope')}</th>
                {plans.map(p => <td key={p.id}><ul>{p.features.map((feature, index) => <li key={index}>{txt(feature, locale)}</li>)}</ul></td>)}
              </tr>
              <tr>
                <th scope="row">{t('التسعير', 'Pricing')}</th>
                {plans.map(p => <td key={p.id}>{txt(p.price, locale)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="modal-plan-actions">
          {plans.map(p => (
            <button type="button" key={p.id} className="button button-outline" onClick={() => choose('CONSULT', p.id)}>
              {txt(p.name, locale)}
              <ArrowUpLeft size={15} />
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={modal === 'privacy'} close={() => setModal(null)} title={t('سياسة الخصوصية', 'Privacy policy')}>
        <div className="policy">
          <h3>{t('بيانات طلبات العروض', 'Proposal requests')}</h3>
          <p>{t('نجمع الاسم وبيانات التواصل والمنشأة والاحتياجات لمعالجة طلب العرض. ترتبط الطلبات بمعرّف ضيف في هذا المتصفح لتتمكن من مراجعتها وحذفها. قد لا تظهر من جهاز آخر أو بعد حذف بيانات الموقع. يمكن لمسؤول الموقع مراجعة الطلبات وتحديث حالتها.', 'We collect your name, contact and facility details, and requirements to process your proposal request. Requests are linked to a guest identifier in this browser for review and deletion. They may not appear on another device or after clearing site data. The site administrator can review requests and update their status.')}</p>
          <h3>{t('آراء العملاء', 'Customer reviews')}</h3>
          <p>{t('تنشر الآراء فقط بعد موافقة صاحب الرأي ومراجعة الإدارة. تشمل البيانات المنشورة الاسم والمسمى والمؤسسة والرأي والتقييم.', 'Reviews are published only with the author’s consent and administrator moderation. Published details include the name, role, organization, review and rating.')}</p>
          <h3>{t('التخزين والاختيارات', 'Storage and choices')}</h3>
          <p>{t('تحفظ البيانات على خادم الموقع. يستخدم الموقع ملف ارتباط وظيفيًا لربط طلباتك بهذا المتصفح، وقد يستعيد مسودة محفوظة في جلسة المتصفح. لا نستخدم ملفات تعريف ارتباط تسويقية. روابط منصات التواصل الخارجية تخضع لسياساتها الخاصة.', 'Data is stored on the site’s server. A functional cookie links requests to this browser; a draft stored in this browser session may also be restored. We do not use marketing cookies. External social platforms operate under their own policies.')}</p>
          <h3>{t('التصحيح والحذف', 'Corrections and deletion')}</h3>
          <p>{t('يمكنك حذف طلباتك من «طلباتي». لطلب تصحيح أو إزالة رأي منشور، استخدم بيانات التواصل المتاحة أو أرسل طلبًا يحدد الرأي المعني. لا ترسل معلومات مرضى.', 'You can delete your requests from My requests. To correct or remove a published review, use the available contact channels or submit a request identifying the review. Do not send patient information.')}</p>
        </div>
      </Modal>

      <Modal open={modal === 'terms'} close={() => setModal(null)} title={t('شروط الاستخدام', 'Terms of use')}>
        <div className="policy">
          <p>{t('الموقع للتعريف بالحلول وطلب العروض. الواجهات المعروضة توضيحية، والتفاصيل الفنية والمالية والتوافق والتدريب والدعم تحدد في عرض معتمد. إرسال طلب لا يمثل تعاقدًا أو موعدًا مؤكدًا.', 'This website introduces solutions and accepts proposal requests. Interfaces shown are illustrative. Features, pricing, compatibility, training and support are defined in an agreed proposal. Submitting a request does not create a contract or a confirmed appointment.')}</p>
          <p>{t('تنطبق العروض المنشورة خلال المدة الموضحة ووفق شروطها، ويعتمد النطاق النهائي في عرض رسمي. ينبغي أن تعكس الآراء تجربة حقيقية وألا تتضمن بيانات سرية أو بيانات مرضى. الموقع لا يقدم تشخيصًا أو رعاية طبية.', 'Published offers apply during the indicated period and under their stated conditions; final scope is confirmed in a formal proposal. Reviews must reflect real experiences and exclude confidential or patient information. This website does not provide diagnosis or medical care.')}</p>
        </div>
      </Modal>
    </div>
  );
}
