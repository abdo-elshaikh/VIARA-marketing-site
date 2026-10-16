'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Check,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  X,
  Hospital,
  Stethoscope,
  Building2,
  Activity,
  HeartPulse,
  Workflow,
  Cpu,
  ScanLine,
  Eye,
  TestTube2,
  Microscope,
  ShieldCheck,
  Layers3,
  DollarSign,
  Users,
  Smartphone,
  Video,
  Route,
  Share2,
  Network,
  Sparkles,
  Filter,
  Layers
} from 'lucide-react';
import {
  healthcareCategories,
  healthcareSystems,
  facilityProfiles,
  normalizeCatalogSearch
} from '../lib/healthcare-catalog.mjs';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { findSolution, solutionPath, solutionSlugs } from '../lib/solutions';
import { systemImage } from '../lib/system-stories';
import CareFrame from './care-frame';

interface SystemMeta {
  badge: { ar: string; en: string };
  highlight: { ar: string; en: string };
  icon: any;
}

const systemMetadata: Record<string, SystemMeta> = {
  HIS: {
    badge: { ar: 'HL7 FHIR · ADT', en: 'HL7 FHIR · ADT' },
    highlight: { ar: 'تنسيق التنويم وإدارة الأسرّة وغرف العمليات', en: 'Inpatient, Bed Census & Surgical Coordination' },
    icon: Hospital,
  },
  EHR: {
    badge: { ar: 'SNOMED-CT · CPOE', en: 'SNOMED-CT · CPOE' },
    highlight: { ar: 'الملف السريري الذكي وتنبيه التداخلات الدوائية', en: 'Clinical SOAP, E-Rx & Allergy Safety Checks' },
    icon: Stethoscope,
  },
  CMS: {
    badge: { ar: 'Saudi EHR · E-Rx', en: 'Saudi EHR · E-Rx' },
    highlight: { ar: 'مواعيد العيادات والتدفق السلس للمراجعين والفروع', en: 'Outpatient Scheduling & Multi-Branch Flow' },
    icon: Building2,
  },
  DENTAL: {
    badge: { ar: '3D Charting · Dental', en: '3D Charting · Dental' },
    highlight: { ar: 'مخطط الأسنان الرقمي وجلسات العلاج والمتابعة', en: '3D Odontogram & Dental Treatment Plans' },
    icon: Activity,
  },
  REHAB: {
    badge: { ar: 'Physio · Milestones', en: 'Physio · Milestones' },
    highlight: { ar: 'برامج التأهيل وقياس التقدم الحركي والوظيفي', en: 'Rehabilitation Protocols & Progress Tracking' },
    icon: HeartPulse,
  },
  NURSING: {
    badge: { ar: 'eMAR · Shift Handover', en: 'eMAR · Shift Handover' },
    highlight: { ar: 'إعطاء الأدوية بالباركود وتسليم الورديات الرقمي', en: 'Bedside Barcode eMAR & Digital Handovers' },
    icon: Workflow,
  },
  OR: {
    badge: { ar: 'WHO Safety · Scheduling', en: 'WHO Safety · Scheduling' },
    highlight: { ar: 'جدولة العمليات وقائمة التحقق الجراحية المعتمدة', en: 'Surgical Theater Booking & Safety Checklists' },
    icon: Cpu,
  },
  RIS: {
    badge: { ar: 'DICOM MWL · MPPS', en: 'DICOM MWL · MPPS' },
    highlight: { ar: 'إدارة مواعيد الأشعة وقوائم عمل الأجهزة الطبية', en: 'Modality Worklist & Radiology Scheduling' },
    icon: ScanLine,
  },
  PACS: {
    badge: { ar: 'DICOM 3.0 · Web 3D', en: 'DICOM 3.0 · Web 3D' },
    highlight: { ar: 'أرشفة سحابية وهجينة وعارض 3D فائق السرعة', en: 'Cloud/Hybrid Archive & Sub-second 3D Review' },
    icon: Eye,
  },
  LIS: {
    badge: { ar: 'ASTM E1381 · LOINC', en: 'ASTM E1381 · LOINC' },
    highlight: { ar: 'أتمتة المحللات المخبرية وتتبع الباركود الدقيق', en: 'Bidirectional Analyzers & Sample Barcoding' },
    icon: TestTube2,
  },
  PATH: {
    badge: { ar: 'Digital Histology', en: 'Digital Histology' },
    highlight: { ar: 'تتبع الشرائح النسيجية والفحص المجهري الرقمي', en: 'Histopathology Slide Tracking & Telepathology' },
    icon: Microscope,
  },
  BLOOD: {
    badge: { ar: 'ISBT 128 · Cold Chain', en: 'ISBT 128 · Cold Chain' },
    highlight: { ar: 'تتبع وحدات الدم وسلسلة التبريد الموثوقة للتبرع', en: 'Blood Donation Tracking & Cold Chain Security' },
    icon: ShieldCheck,
  },
  PHARM: {
    badge: { ar: 'Barcode Dispensing', en: 'Barcode Dispensing' },
    highlight: { ar: 'الصرف الآلي للمستودعات وتواريخ الصلاحية والوصفات', en: 'Automated Pharmacy Dispensing & Stock Expiry' },
    icon: Layers3,
  },
  RCM: {
    badge: { ar: 'NPHIES v1.3 · Clean Claims', en: 'NPHIES v1.3 · Clean Claims' },
    highlight: { ar: 'التحقق اللحظي من الأهلية وتدقيق المطالبات التأمينية', en: 'Instant Eligibility & Claim Scrubber Engine' },
    icon: DollarSign,
  },
  ERP: {
    badge: { ar: 'Supply Chain · Finance', en: 'Supply Chain · Finance' },
    highlight: { ar: 'الحسابات والمشتريات الطبية وسلاسل إمداد المستشفيات', en: 'Hospital Accounting & Medical Procurement' },
    icon: Building2,
  },
  HR: {
    badge: { ar: 'Clinical Rostering', en: 'Clinical Rostering' },
    highlight: { ar: 'جداول الكوادر الطبية والمناوبات والامتيازات السريرية', en: 'Physician Rostering & Credentialing' },
    icon: Users,
  },
  ASSET: {
    badge: { ar: 'Biomedical Maintenance', en: 'Biomedical Maintenance' },
    highlight: { ar: 'الصيانة الوقائية للأجهزة الطبية وتتبع الأعطال', en: 'Preventive Calibration & Equipment Uptime' },
    icon: Cpu,
  },
  BI: {
    badge: { ar: 'FHIR Analytics · OMOP', en: 'FHIR Analytics · OMOP' },
    highlight: { ar: 'لوحات قيادة المؤشرات الحيوية والتشغيلية للإدارة', en: 'Executive Dashboards & Clinical KPI Analytics' },
    icon: Activity,
  },
  PORTAL: {
    badge: { ar: 'Mobile App · Booking', en: 'Mobile App · Booking' },
    highlight: { ar: 'حجز المواعيد والوصول للأشعة والنتائج فورا عبر الجوال', en: 'Self-Service Booking, Reports & Imaging App' },
    icon: Smartphone,
  },
  TELE: {
    badge: { ar: 'WebRTC AES-256', en: 'WebRTC AES-256' },
    highlight: { ar: 'عيادات افتراضية مشفرة واستشارات مرئية عالية الدقة', en: 'Encrypted HD Video Care & Remote Consultations' },
    icon: Video,
  },
  HOME: {
    badge: { ar: 'GPS Route · Field Care', en: 'GPS Route · Field Care' },
    highlight: { ar: 'تنسيق زيارات الرعاية المنزلية والفرق الطبية المتنقلة', en: 'Mobile Care Team Dispatch & Home Visit EHR' },
    icon: Route,
  },
  REFERRAL: {
    badge: { ar: 'Care Continuity', en: 'Care Continuity' },
    highlight: { ar: 'إدارة الإحالات الطبية بين المراكز والمستشفيات بسلاسة', en: 'Cross-Facility Referrals & Closed-Loop Care' },
    icon: Share2,
  },
  INTEROP: {
    badge: { ar: 'HL7 v2/v3 · FHIR · API', en: 'HL7 v2/v3 · FHIR · API' },
    highlight: { ar: 'محرك الربط الشامل ومزامنة البيانات بين كافة الأنظمة', en: 'Enterprise Integration Bus & Data Exchange' },
    icon: Network,
  },
  AI: {
    badge: { ar: 'STAT CAD · CE-MDR', en: 'STAT CAD · CE-MDR' },
    highlight: { ar: 'فرز الحالات الحرجة والإملاء الصوتي الطبي الذكي', en: 'STAT Emergency Triage & Clinical Voice Dictation' },
    icon: Sparkles,
  },
};

export default function CareDirectory({ content, locale }: { content: SiteContent; locale: Locale }) {
  const en = locale === 'en';
  const home = en ? '/en' : '/';
  const t = (ar: string, english: string) => (en ? english : ar);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') || '');
      const requested = params.get('area');
      if (healthcareCategories.some(c => c.id === requested)) setArea(requested!);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (area !== 'all') url.searchParams.set('area', area);
    else url.searchParams.delete('area');
    history.replaceState(null, '', url);
  }, [query, area, ready]);

  const allowed = healthcareSystems.filter(
    s => !content.products.some(p => p.id === s.id && !p.enabled)
  );

  const results = allowed.filter(
    s =>
      (area === 'all' || s.category === area) &&
      normalizeCatalogSearch(
        `${s.id} ${s.name.ar} ${s.name.en} ${s.description.ar} ${s.description.en} ${
          systemMetadata[s.id]?.badge.ar || ''
        } ${systemMetadata[s.id]?.badge.en || ''}`
      ).includes(normalizeCatalogSearch(query))
  );

  // Quick preset apply
  const applyProfile = (profileId: string) => {
    const profile = facilityProfiles.find(p => p.id === profileId);
    if (!profile) return;
    setActiveProfile(profileId);
    const validIds = profile.systems.filter(id => allowed.some(s => s.id === id)).slice(0, 6);
    setSelected(validIds);
  };

  const getSystemMeta = (id: string): SystemMeta => {
    return (
      systemMetadata[id] || {
        badge: { ar: 'معيار معتمد', en: 'Certified Protocol' },
        highlight: { ar: 'تكامل سريري وإداري موحد', en: 'Integrated Clinical Workflow' },
        icon: Sparkles,
      }
    );
  };

  return (
    <CareFrame content={content} locale={locale} current="systems">
      <div className="care-wrap cd-page-wrap">
        {/* Executive Directory Header */}
        <section className="cd-header" aria-labelledby="cd-heading">
          <div className="cd-header-copy">
            <span className="cd-eyebrow">
              <i className="cd-pulse-dot" />
              {t('دليل منظومة أنظمة الرعاية الصحية', 'HEALTHCARE SYSTEMS DIRECTORY')} · {allowed.length} {t('نظاماً متخصصاً', 'SYSTEMS')}
            </span>

            <h1 id="cd-heading">
              {t('منظومة رعاية متكاملة.', 'A complete healthcare ecosystem.')}
              <br />
              <em>{t('24 نظاماً لكل قسم في منشأتك.', '24 systems for every department in your facility.')}</em>
            </h1>

            <p>
              {t(
                'استكشف كافة الحلول السريرية والتشخيصية والإدارية والرقمية. يمكنك تحديد حتى 6 أنظمة لتصميم نطاق متكامل يناسب احتياجات منشأتك، ومناقشته مع فريقنا الهندسي والاستشاري في عرض فني مخصص.',
                'Browse clinical, diagnostic, operational, and digital healthcare solutions. Select up to 6 systems to configure a tailored scope for your facility, then discuss it with our engineering team in a dedicated technical demonstration.'
              )}
            </p>
          </div>

          {/* Quick Facility Profiles Preset Bar */}
          <div className="cd-presets-strip" aria-label={t('نطاقات جاهزة حسب نوع المنشأة', 'Facility presets')}>
            <span className="cd-presets-label">
              <Building2 size={15} />
              {t('نطاقات مقترحة حسب المنشأة:', 'Suggested facility scopes:')}
            </span>
            <div className="cd-presets-buttons">
              {facilityProfiles.map(p => {
                const isActive = activeProfile === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    className={`cd-preset-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => applyProfile(p.id)}
                  >
                    <span>{txt(p.name, locale)}</span>
                    <bdi>({p.systems.length})</bdi>
                  </button>
                );
              })}
              {selected.length > 0 && (
                <button
                  type="button"
                  className="cd-preset-clear"
                  onClick={() => {
                    setSelected([]);
                    setActiveProfile(null);
                  }}
                >
                  <X size={13} />
                  <span>{t('مسح التحديد', 'Clear')}</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="cd-controls-section" aria-label={t('أدوات التصفية والبحث', 'Filter and search')}>
          <div className="cd-controls-bar">
            {/* Search Input */}
            <label className="cd-search">
              <Search size={19} className="cd-search-icon" />
              <input
                aria-label={t('ابحث عن نظام بالاسم أو الاختصار أو المعيار', 'Search by name, code or protocol')}
                placeholder={t(
                  'ابحث عن نظام (مثال: HIS, PACS, LIS, تأمين, نفيز, أشعة…)',
                  'Search system (e.g. HIS, PACS, LIS, NPHIES, Radiology…)'
                )}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="cd-search-clear"
                  onClick={() => setQuery('')}
                  aria-label={t('مسح البحث', 'Clear search')}
                >
                  <X size={15} />
                </button>
              )}
            </label>

            {/* Category Pills */}
            <div className="cd-categories-tabs" role="tablist" aria-label={t('تصفية حسب المجال', 'Filter by area')}>
              <button
                type="button"
                role="tab"
                aria-selected={area === 'all'}
                className={area === 'all' ? 'is-active' : ''}
                onClick={() => setArea('all')}
              >
                <span>{t('كل الأنظمة', 'All systems')}</span>
                <bdi>({allowed.length})</bdi>
              </button>

              {healthcareCategories.map(c => {
                const count = allowed.filter(s => s.category === c.id).length;
                return (
                  <button
                    type="button"
                    role="tab"
                    key={c.id}
                    aria-selected={area === c.id}
                    className={area === c.id ? 'is-active' : ''}
                    onClick={() => setArea(c.id)}
                  >
                    <span>{txt(c.name, locale)}</span>
                    <bdi>({count})</bdi>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cd-results-meta">
            <span role="status">
              <strong>{results.length}</strong> {t('نظاماً مطابقاً للبحث', 'matching systems found')}
            </span>
            <span>
              {t(
                'يمكنك اختيار حتى 6 أنظمة لإرسالها مباشرة مع طلبك الاستشاري',
                'Select up to 6 systems to attach to your consultation request'
              )}
            </span>
          </div>
        </section>

        {/* Enhanced System Cards Grid */}
        <section className="cd-grid-section" aria-label={t('شبكة أنظمة الرعاية', 'Care systems grid')}>
          <div className="cd-system-grid">
            {results.map(system => {
              const chosen = selected.includes(system.id);
              const solution = solutionSlugs[system.id] && findSolution(content, solutionSlugs[system.id]);
              const meta = getSystemMeta(system.id);
              const Icon = meta.icon;
              const imgSrc = systemImage(system.id, system.category);
              const categoryObj = healthcareCategories.find(c => c.id === system.category);

              return (
                <article
                  key={system.id}
                  className={`cd-card ${chosen ? 'is-selected' : ''}`}
                  data-category={system.category}
                >
                  {/* Expressive System Image Banner */}
                  <div className="cd-card-media">
                    <img src={imgSrc} alt={txt(system.name, locale)} loading="lazy" />
                    <div className="cd-card-overlay" />

                    <div className="cd-card-top-tags">
                      <bdi className="cd-code-pill">{system.id}</bdi>
                      <span className="cd-category-pill">
                        {categoryObj ? txt(categoryObj.name, locale) : system.category}
                      </span>
                    </div>

                    <div className="cd-card-icon-bubble">
                      <Icon size={19} />
                    </div>

                    {chosen && (
                      <span className="cd-chosen-check" aria-hidden="true">
                        <Check size={16} />
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="cd-card-body">
                    {/* Protocol Badge */}
                    <div className="cd-protocol-row">
                      <span className="cd-protocol-tag">
                        <Sparkles size={11} />
                        {txt(meta.badge, locale)}
                      </span>
                    </div>

                    <h2>{txt(system.name, locale)}</h2>

                    {/* Operational Highlight */}
                    <div className="cd-highlight-row">
                      <Check size={13} className="cd-check-icon" />
                      <span>{txt(meta.highlight, locale)}</span>
                    </div>

                    <p className="cd-description">{txt(system.description, locale)}</p>

                    {/* Card Actions Footer */}
                    <div className="cd-card-footer">
                      <button
                        className={`cd-select-btn ${chosen ? 'is-chosen' : ''}`}
                        type="button"
                        aria-pressed={chosen}
                        aria-label={`${chosen ? t('إزالة', 'Remove') : t('إضافة', 'Add')} ${txt(
                          system.name,
                          locale
                        )}`}
                        disabled={!chosen && selected.length >= 6}
                        onClick={() =>
                          setSelected(ids => (chosen ? ids.filter(id => id !== system.id) : [...ids, system.id]))
                        }
                      >
                        {chosen ? <Check size={15} /> : <Plus size={15} />}
                        <span>
                          {chosen ? t('ضمن نطاقك المختار', 'In Your Scope') : t('أضف إلى نطاقك', 'Add to Scope')}
                        </span>
                      </button>

                      {solution ? (
                        <a className="cd-details-link" href={solutionPath(system.id, locale)}>
                          <span>{t('صفحة النظام والمحاكاة', 'Explore & Simulate')}</span>
                          <Arrow size={14} />
                        </a>
                      ) : (
                        <a className="cd-details-link" href={`${home}?systems=${system.id}#contact`}>
                          <span>{t('ناقش المتطلبات', 'Discuss Needs')}</span>
                          <Arrow size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Empty Results State */}
          {results.length === 0 && (
            <div className="cd-empty-state">
              <Search size={38} />
              <h2>{t('لم نعثر على أنظمة مطابقة لبحثك.', 'No matching healthcare systems found.')}</h2>
              <p>
                {t(
                  'جرب البحث بكلمات أخرى أو أعد ضبط تصنيف التصفية للاطلاع على كافة الأنظمة.',
                  'Try searching with other medical keywords or reset your filters to see all available systems.'
                )}
              </p>
              <button
                className="care-btn"
                type="button"
                onClick={() => {
                  setQuery('');
                  setArea('all');
                }}
              >
                <span>{t('عرض كل الأنظمة الـ 24', 'View all 24 systems')}</span>
                <Arrow size={17} />
              </button>
            </div>
          )}

          {/* Floating Selected Scope Drawer */}
          {selected.length > 0 && (
            <aside className="cd-selection-drawer" aria-label={t('نطاقك المختار', 'Your selected scope')}>
              <div className="cd-drawer-left">
                <span className="cd-drawer-counter">
                  <b>{selected.length} / 6</b> {t('أنظمة محددة في نطاقك', 'systems in your scope')}
                </span>
                <div className="cd-drawer-chips">
                  {selected.map(id => (
                    <button
                      type="button"
                      key={id}
                      className="cd-chip-btn"
                      onClick={() => setSelected(ids => ids.filter(i => i !== id))}
                      title={t('إزالة هذا النظام من النطاق', 'Remove from scope')}
                    >
                      <bdi>{id}</bdi>
                      <X size={11} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="cd-drawer-actions">
                <button
                  type="button"
                  className="cd-drawer-clear"
                  onClick={() => {
                    setSelected([]);
                    setActiveProfile(null);
                  }}
                >
                  {t('مسح الاختيارات', 'Clear all')}
                </button>
                <a className="care-btn cd-drawer-submit" href={`${home}?systems=${selected.join(',')}#contact`}>
                  <span>{t('ناقش هذا النطاق المخصص', 'Discuss this custom scope')}</span>
                  <Arrow size={17} />
                </a>
              </div>
            </aside>
          )}
        </section>
      </div>
    </CareFrame>
  );
}
