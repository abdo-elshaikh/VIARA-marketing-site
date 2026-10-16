'use client';
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  ArrowUpLeft, Check, Plus, Search, X, LayoutGrid, Hospital, ClipboardList, Stethoscope, BedDouble,
  ScanLine, Layers3, Microscope, Cpu, Pill, Boxes, Receipt, Briefcase, ChartNoAxesCombined,
  Smartphone, Video, MessageCircle, type LucideIcon
} from 'lucide-react';
import type { Locale } from '../lib/site-content';

/* [arabic, english] */
type L = [string, string];
type CatId = 'all' | 'clinical' | 'diagnostics' | 'operations' | 'digital';
type SystemItem = { id: string; icon: LucideIcon; cat: Exclude<CatId, 'all'>; name: L; short: L; caps: L[]; links: string[] };

const MAX_PICKS = 6;

const CATEGORIES: { id: CatId; icon: LucideIcon; label: L }[] = [
  { id: 'all', icon: LayoutGrid, label: ['كل الأنظمة', 'All systems'] },
  { id: 'clinical', icon: Stethoscope, label: ['سريرية', 'Clinical'] },
  { id: 'diagnostics', icon: ScanLine, label: ['تشخيصية', 'Diagnostics'] },
  { id: 'operations', icon: Briefcase, label: ['تشغيلية ومالية', 'Operations & finance'] },
  { id: 'digital', icon: Smartphone, label: ['رعاية رقمية', 'Digital care'] }
];

export const SYSTEMS: SystemItem[] = [
  {
    id: 'HIS', icon: Hospital, cat: 'clinical',
    name: ['نظام إدارة المستشفى HIS', 'Hospital information system (HIS)'],
    short: ['التنويم والأقسام والعمليات اليومية', 'Admissions, wards and daily operations'],
    caps: [['إدخال وخروج وتحويل المرضى', 'Admission, discharge and transfer'], ['إدارة الأقسام والأسرّة', 'Departments and bed management'], ['تقارير تشغيلية موحدة', 'Unified operational reporting']],
    links: ['EMR', 'NURSE', 'RCM']
  },
  {
    id: 'EMR', icon: ClipboardList, cat: 'clinical',
    name: ['السجل الطبي الإلكتروني EMR', 'Electronic medical record (EMR)'],
    short: ['ملف سريري واحد لكل مريض', 'One clinical record per patient'],
    caps: [['ملاحظات وتشخيصات وخطط علاج', 'Notes, diagnoses and care plans'], ['طلبات الفحوصات إلكترونيًا CPOE', 'Electronic orders (CPOE)'], ['تنبيهات الحساسية والتداخلات', 'Allergy and interaction alerts']],
    links: ['HIS', 'LIS', 'PHARM']
  },
  {
    id: 'CMS', icon: Stethoscope, cat: 'clinical',
    name: ['إدارة العيادات CMS', 'Clinic management (CMS)'],
    short: ['مواعيد وطوابير وعيادات متعددة', 'Appointments, queues and multiple clinics'],
    caps: [['حجز المواعيد وقوائم الانتظار', 'Booking, scheduling and queues'], ['جداول الأطباء والغرف', 'Doctor and room schedules'], ['فوترة العيادة وتحصيلها', 'Clinic billing and collection']],
    links: ['EMR', 'RCM', 'PORTAL']
  },
  {
    id: 'NURSE', icon: BedDouble, cat: 'clinical',
    name: ['التمريض والأجنحة', 'Nursing and wards'],
    short: ['متابعة المنوّمين ومهام الورديات', 'Inpatient follow-up and shift tasks'],
    caps: [['العلامات الحيوية وخطط التمريض', 'Vitals and nursing care plans'], ['جدول الأدوية والمهام', 'Medication and task schedule'], ['تسليم الورديات', 'Shift handover']],
    links: ['HIS', 'EMR', 'PHARM']
  },
  {
    id: 'RIS', icon: ScanLine, cat: 'diagnostics',
    name: ['نظام الأشعة RIS', 'Radiology information system (RIS)'],
    short: ['قوائم عمل الأجهزة والتقارير', 'Modality worklists and reporting'],
    caps: [['جدولة الفحوص وقوائم الأجهزة', 'Exam scheduling and modality worklists'], ['إملاء وتقارير مهيكلة', 'Dictation and structured reports'], ['متابعة الحالات العاجلة', 'Urgent case tracking']],
    links: ['PACS', 'AI', 'RCM']
  },
  {
    id: 'PACS', icon: Layers3, cat: 'diagnostics',
    name: ['أرشفة وعرض الصور PACS', 'Imaging archive and viewer (PACS)'],
    short: ['أرشيف DICOM وعارض عبر المتصفح', 'DICOM archive with a browser viewer'],
    caps: [['عارض ويب دون تثبيت برامج', 'Zero-install web viewer'], ['أرشفة محلية وسحابية', 'Local and cloud archive'], ['مشاركة آمنة للدراسات', 'Secure study sharing']],
    links: ['RIS', 'AI', 'PORTAL']
  },
  {
    id: 'LIS', icon: Microscope, cat: 'diagnostics',
    name: ['نظام المختبر LIS', 'Laboratory system (LIS)'],
    short: ['العينات والنتائج وأجهزة التحليل', 'Samples, results and analyzers'],
    caps: [['باركود العينات وتتبعها', 'Sample barcoding and tracking'], ['ربط أجهزة التحليل', 'Analyzer interfacing'], ['اعتماد النتائج وإصدارها', 'Result validation and release']],
    links: ['EMR', 'HIS', 'PORTAL']
  },
  {
    id: 'AI', icon: Cpu, cat: 'diagnostics',
    name: ['الذكاء الاصطناعي السريري', 'Clinical AI'],
    short: ['دعم القراءة والتقارير وترتيب الأولويات', 'Assistive reading, reporting and prioritization'],
    caps: [['ترتيب الحالات حسب الأولوية', 'Case prioritization'], ['مسودات تقارير للمراجعة', 'Draft reports for clinician review'], ['إملاء صوتي بالعربية والإنجليزية', 'Arabic and English voice dictation']],
    links: ['RIS', 'PACS']
  },
  {
    id: 'PHARM', icon: Pill, cat: 'operations',
    name: ['الصيدلية', 'Pharmacy'],
    short: ['وصفات وصرف ومخزون دوائي', 'Prescriptions, dispensing and drug stock'],
    caps: [['وصفة إلكترونية وصرف', 'e-Prescription and dispensing'], ['فحص التداخلات الدوائية', 'Drug interaction checks'], ['الدفعات وتواريخ الصلاحية', 'Batches and expiry dates']],
    links: ['EMR', 'INV', 'NURSE']
  },
  {
    id: 'INV', icon: Boxes, cat: 'operations',
    name: ['المخازن والمشتريات', 'Inventory and procurement'],
    short: ['مستلزمات طبية وأوامر شراء', 'Medical supplies and purchase orders'],
    caps: [['حدود إعادة الطلب', 'Reorder thresholds'], ['أوامر الشراء والموردون', 'Purchase orders and suppliers'], ['الاستهلاك حسب القسم', 'Consumption by department']],
    links: ['PHARM', 'ERP']
  },
  {
    id: 'RCM', icon: Receipt, cat: 'operations',
    name: ['الفوترة والتأمين RCM', 'Billing and insurance (RCM)'],
    short: ['فوترة ومطالبات وتحصيل', 'Billing, claims and collections'],
    caps: [['التحقق من أهلية التأمين', 'Insurance eligibility checks'], ['مراجعة المطالبات قبل الإرسال', 'Claim review before submission'], ['فواتير إلكترونية متوافقة', 'Compliant e-invoicing']],
    links: ['CMS', 'HIS', 'ERP']
  },
  {
    id: 'ERP', icon: Briefcase, cat: 'operations',
    name: ['المالية والموارد البشرية', 'Finance and HR'],
    short: ['حسابات ورواتب وإدارة الموظفين', 'Accounting, payroll and staff'],
    caps: [['دليل حسابات وقيود', 'Ledger and journal entries'], ['الورديات والرواتب', 'Shifts and payroll'], ['دعم الفروع المتعددة', 'Multi-branch support']],
    links: ['RCM', 'INV', 'BI']
  },
  {
    id: 'BI', icon: ChartNoAxesCombined, cat: 'operations',
    name: ['التقارير والتحليلات', 'Reports and analytics'],
    short: ['لوحات متابعة للإدارة', 'Dashboards for management'],
    caps: [['مؤشرات التشغيل والإيراد', 'Operations and revenue indicators'], ['مقارنة الفروع والأقسام', 'Branch and department comparison'], ['تقارير قابلة للتصدير', 'Exportable reports']],
    links: ['ERP', 'HIS', 'RCM']
  },
  {
    id: 'PORTAL', icon: Smartphone, cat: 'digital',
    name: ['بوابة وتطبيق المريض', 'Patient portal and app'],
    short: ['حجز ونتائج وملف شخصي', 'Booking, results and profile'],
    caps: [['حجز وإعادة جدولة المواعيد', 'Booking and rescheduling'], ['نتائج وتقارير بروابط آمنة', 'Results and reports via secure links'], ['إشعارات وتذكيرات', 'Notifications and reminders']],
    links: ['CMS', 'LIS', 'PACS']
  },
  {
    id: 'TELE', icon: Video, cat: 'digital',
    name: ['التطبيب عن بعد', 'Telehealth'],
    short: ['استشارات فيديو ومتابعة عن بعد', 'Video visits and remote follow-up'],
    caps: [['غرف فيديو آمنة', 'Secure video rooms'], ['مشاركة الملفات أثناء الجلسة', 'File sharing during the visit'], ['ربط الجلسة بالموعد والملف', 'Visit linked to appointment and record']],
    links: ['EMR', 'PORTAL']
  },
  {
    id: 'CRM', icon: MessageCircle, cat: 'digital',
    name: ['تواصل المرضى CRM', 'Patient engagement (CRM)'],
    short: ['واتساب وحملات ومتابعة', 'WhatsApp, campaigns and follow-up'],
    caps: [['رسائل وتذكيرات واتساب', 'WhatsApp messages and reminders'], ['استبيانات رضا المرضى', 'Patient satisfaction surveys'], ['تقسيم المرضى إلى شرائح', 'Patient segments']],
    links: ['PORTAL', 'CMS']
  }
];

export default function SystemsUniverse({ locale, onRequest }: { locale: Locale; onRequest: (ids: string[]) => void }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => (en ? eng : ar);
  const p = (v: L) => v[en ? 1 : 0];

  const [cat, setCat] = useState<CatId>('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('HIS');
  const [picked, setPicked] = useState<string[]>([]);
  const [limitHit, setLimitHit] = useState(false);
  const detail = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SYSTEMS.filter(s =>
      (cat === 'all' || s.cat === cat) &&
      (!q || `${s.id} ${s.name.join(' ')} ${s.short.join(' ')}`.toLowerCase().includes(q))
    );
  }, [cat, query]);

  const active = SYSTEMS.find(s => s.id === activeId) ?? SYSTEMS[0];
  const byId = (id: string) => SYSTEMS.find(s => s.id === id);
  const countFor = (id: CatId) => (id === 'all' ? SYSTEMS.length : SYSTEMS.filter(s => s.cat === id).length);

  function select(id: string) {
    setActiveId(id);
    if (window.matchMedia('(max-width: 1099px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      detail.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  function toggle(id: string) {
    setLimitHit(false);
    setPicked(cur => {
      if (cur.includes(id)) return cur.filter(x => x !== id);
      if (cur.length >= MAX_PICKS) { setLimitHit(true); return cur; }
      return [...cur, id];
    });
  }

  function spotlight(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse') return;
    const b = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - b.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - b.top}px`);
  }

  const ActiveIcon = active.icon;
  const activePicked = picked.includes(active.id);

  return (
    <section className="section vx-universe" id="systems" aria-labelledby="systems-title">
      <div className="container">
        <div className="vx-head" data-reveal>
          <h2 id="systems-title">
            {t('كل أنظمة الرعاية، ', 'Every healthcare system, ')}
            {t('في مكان واحد.', 'in one place.')}
          </h2>
          <p>{t('استكشف الأنظمة، واختر ما يناسب منشأتك، ثم اطلب عرضًا يضم ما اخترته فقط.', 'Browse the systems, pick what fits your facility, and request a proposal that covers only what you chose.')}</p>
        </div>

        <div className="vx-toolbar" data-reveal>
          <div className="vx-tabs" role="tablist" aria-label={t('تصنيف الأنظمة', 'System categories')}>
            {CATEGORIES.map(c => {
              const I = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === c.id}
                  className={cat === c.id ? 'active' : ''}
                  onClick={() => setCat(c.id)}
                >
                  <I size={16} />
                  <span>{p(c.label)}</span>
                  <em>{countFor(c.id)}</em>
                </button>
              );
            })}
          </div>
          <label className="vx-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('ابحث عن نظام…', 'Search for a system…')}
              aria-label={t('ابحث عن نظام', 'Search for a system')}
            />
          </label>
        </div>

        <div className="vx-layout">
          <div className="vx-grid" role="list">
            {visible.map((s, i) => {
              const I = s.icon;
              const isPicked = picked.includes(s.id);
              return (
                <div
                  role="listitem"
                  key={s.id}
                  className={`vx-card ${s.id === active.id ? 'is-active' : ''} ${isPicked ? 'is-picked' : ''}`}
                  style={{ '--i': i } as CSSProperties}
                  onPointerMove={spotlight}
                >
                  <button type="button" className="vx-card-main" onClick={() => select(s.id)} aria-pressed={s.id === active.id}>
                    <span className="vx-card-icon"><I size={22} /></span>
                    <b>{p(s.name)}</b>
                    <small>{p(s.short)}</small>
                  </button>
                  <button
                    type="button"
                    className="vx-add"
                    onClick={() => toggle(s.id)}
                    aria-pressed={isPicked}
                    aria-label={`${isPicked ? t('إزالة من نطاقي', 'Remove from my scope') : t('إضافة إلى نطاقي', 'Add to my scope')}: ${p(s.name)}`}
                  >
                    {isPicked ? <Check size={15} /> : <Plus size={15} />}
                  </button>
                </div>
              );
            })}
            {visible.length === 0 && (
              <div className="vx-empty">
                <p>{t('لا يوجد نظام بهذا الاسم.', 'No system matches that search.')}</p>
                <button type="button" className="text-link" onClick={() => { setQuery(''); setCat('all'); }}>
                  {t('عرض كل الأنظمة', 'Show all systems')}
                </button>
              </div>
            )}
          </div>

          <aside className="vx-detail" ref={detail} aria-live="polite" key={active.id}>
            <span className="vx-detail-icon"><ActiveIcon size={30} /></span>
            <h3>{p(active.name)}</h3>
            <p className="vx-detail-lead">{p(active.short)}</p>
            <ul className="vx-caps">
              {active.caps.map(c => (
                <li key={c[0]}><Check size={15} />{p(c)}</li>
              ))}
            </ul>
            <div className="vx-links">
              <span>{t('يعمل مع', 'Works with')}</span>
              <div>
                {active.links.map(id => {
                  const l = byId(id);
                  if (!l) return null;
                  const LI = l.icon;
                  return (
                    <button type="button" key={id} onClick={() => select(id)}>
                      <LI size={14} />{p(l.name).replace(/\s*\(.*\)$/, '')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="vx-detail-actions">
              <button type="button" className={`button ${activePicked ? 'button-outline' : ''}`} onClick={() => toggle(active.id)}>
                {activePicked ? t('أضيف إلى نطاقي', 'In my scope') : t('أضف إلى نطاقي', 'Add to my scope')}
                {activePicked ? <Check size={17} /> : <Plus size={17} />}
              </button>
            </div>
          </aside>
        </div>

        <div className={`vx-scopebar ${picked.length ? 'is-open' : ''}`} role="region" aria-label={t('نطاقي', 'My scope')}>
          <div className="vx-scopebar-chips">
            <span>{t('نطاقك', 'Your scope')} ({picked.length}/{MAX_PICKS})</span>
            {picked.map(id => {
              const s = byId(id);
              return s ? (
                <button type="button" key={id} onClick={() => toggle(id)} aria-label={`${t('إزالة', 'Remove')} ${p(s.name)}`}>
                  {p(s.name).replace(/\s*\(.*\)$/, '')}
                  <X size={13} />
                </button>
              ) : null;
            })}
            {limitHit && <small>{t('الحد الأقصى ٦ أنظمة في الطلب الواحد.', 'Up to 6 systems per request.')}</small>}
          </div>
          <button type="button" className="button" onClick={() => onRequest(picked)} disabled={!picked.length}>
            {t('اطلب عرضًا لهذه الأنظمة', 'Request a proposal')}
            <ArrowUpLeft size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
