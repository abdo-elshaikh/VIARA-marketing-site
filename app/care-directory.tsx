'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ScanLine,
  Layers3,
  Building2,
  Search,
  X,
  Check,
  Plus,
  SlidersHorizontal,
  Users,
  Sparkles,
  LayoutGrid,
  List,
  Columns3,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Activity,
  HardDrive,
  Cpu,
  MonitorCheck,
} from 'lucide-react';
import { careCatalog, txt, type Locale, type SiteContent } from '../lib/site-content';
import { marketingSystemIds, normalizeCatalogSearch } from '../lib/healthcare-catalog.mjs';
import { useSiteText } from '../lib/site-copy';
import { solutionPath } from '../lib/solutions';
import { systemCaptures } from '../lib/system-captures';
import CareFrame from './care-frame';
import SystemComparison from './system-comparison';
import BrandPageHero from './brand-page-hero';
import './systems-directory.css';
import './systems-usability.css';
import './systems-enhanced.css';

const MAX_SCOPE_SYSTEMS = 6;

// Bespoke 3D Brand Visuals matching each system with VIARA Emerald & Gold Palette
const systemBrandVisuals: Record<
  string,
  {
    image: string;
    alt: { ar: string; en: string };
    tag: { ar: string; en: string };
    subtitle: { ar: string; en: string };
  }
> = {
  RIS: {
    image: '/assets/systems/viara-ris-pro.jpg',
    alt: {
      ar: 'بيئة عمل نظام إدارة مراكز الأشعة RIS واستقبال المراجعين وأجهزة التصوير بهوية فيارا الزمردية',
      en: 'VIARA RIS Radiology Center Suite with modality scheduling and patient reception in signature emerald brand',
    },
    tag: { ar: 'بيئة مراكز الأشعة RIS', en: 'Radiology Suite 3D' },
    subtitle: { ar: 'استقبال وجدولة فحوصات الموداليتي وقوائم العمل MWL', en: 'Reception, modality scheduling and MWL worklists' },
  },
  PACS: {
    image: '/assets/systems/viara-pacs-pro.jpg',
    alt: {
      ar: 'محطة تشخيص وأرشفة الصور الطبية PACS وعارض DICOM ثلاثي الأبعاد بهوية فيارا الزمردية والذهبية',
      en: 'VIARA PACS Diagnostic Reading Suite with calibrated DICOM monitors in emerald and gold styling',
    },
    tag: { ar: 'محطة التشخيص والأرشفة PACS', en: 'Diagnostic Reading Room 3D' },
    subtitle: { ar: 'عارض ويب تشخيصي متقدم وأرشفة DICOM هجينة', en: 'Zero-footprint web viewer & hybrid DICOM archive' },
  },
  CMS: {
    image: '/assets/systems/viara-cms-pro.jpg',
    alt: {
      ar: 'مركز استقبال وعيادات المجمع الطبي CMS والملف الطبي الموحد بالرخام والزمرد والذهب',
      en: 'VIARA CMS Luxury Medical Center & Clinics Reception with electronic health records in emerald and champagne gold',
    },
    tag: { ar: 'إدارة المراكز والعيادات CMS', en: 'Medical Center & Clinics 3D' },
    subtitle: { ar: 'بهو الاستقبال وإدارة مواعيد العيادات والملفات الطبية', en: 'Luxury reception and clinic appointment scheduling' },
  },
  AI: {
    image: '/assets/systems/hero-20261025/ai.webp',
    alt: {
      ar: 'منظومة فرز أشعة الصدر والتشخيص بالذكاء الاصطناعي السريري بهوية فيارا',
      en: 'VIARA Clinical AI Radiology Triage and acute findings detection in signature brand styling',
    },
    tag: { ar: 'ذكاء الأشعة الاصطناعي AI', en: 'Clinical AI Triage 3D' },
    subtitle: { ar: 'فرز دراسات الأشعة واكتشاف الحالات الحرجة ومسودات التقارير', en: 'Automated scan triage, acute flags, and report drafts' },
  },
  PORTAL: {
    image: '/assets/systems/hero-20261025/portal.webp',
    alt: {
      ar: 'بوابات المرضى والأطباء المحيلين الرقمية عبر الهواتف والتابلت بهوية فيارا',
      en: 'VIARA Patient & Referring Physician Connected Portals on mobile and tablet devices',
    },
    tag: { ar: 'بوابات المرضى والأطباء PORTAL', en: 'Patient & Doctor Portals 3D' },
    subtitle: { ar: 'وصول رقمي موحد للمرضى والأطباء المحيلين وتحقق فوري بالـ QR', en: 'Connected mobile access with instant QR report verification' },
  },
};

const systemSpecs: Record<string, { ar: string[]; en: string[] }> = {
  RIS: {
    ar: ['قوائم عمل الأجهزة MWL', 'إدارة مواعيد وغرف الفحص', 'قوالب التقارير المنظمة', 'محرك ربط بروتوكول HL7'],
    en: ['Modality Worklist (MWL)', 'Exam & Room Scheduling', 'Structured Report Templates', 'HL7 Brokering Engine'],
  },
  PACS: {
    ar: ['أرشفة DICOM 3.0 هجينة', 'عارض تشخيصي بدون تثبيت Web Viewer', 'إعادة بناء ثلاثي الأبعاد MPR & 3D', 'مطابقة الفحوصات السابقة'],
    en: ['DICOM 3.0 Hybrid Archive', 'Zero-Footprint Diagnostic Viewer', 'Multi-Planar 3D MPR', 'Prior Study Matching'],
  },
  CMS: {
    ar: ['الملف الطبي الإلكتروني EMR', 'جدولة العيادات والأطباء', 'الفوترة والمطالبات التأمينية', 'إغلاق ورديات الخزينة'],
    en: ['Electronic Medical Records (EMR)', 'Clinic & Doctor Scheduling', 'Insurance Claims & Billing', 'Cashier Shift Reconciliation'],
  },
  AI: {
    ar: ['فرز دراسات صدر البالغين CXR', 'تصنيف الحالات الحرجة أولاً', 'مسودات تقارير شعاعية مؤتمتة', 'مراجعة واعتماد الاستشاري'],
    en: ['Adult CXR Case Triage', 'Acute Finding Prioritization', 'Automated Report Drafting', 'Radiologist Clinical Sign-off'],
  },
  PORTAL: {
    ar: ['بوابة المريض الرقمية', 'بوابة دخول الأطباء المحيلين', 'التحقق برمز الاستجابة السريعة QR', 'تحميل الصور والتقارير المعتمدة'],
    en: ['Patient Health Portal', 'Referring Physician Hub', 'Instant QR Report Verification', 'Direct DICOM & PDF Download'],
  },
};

export default function CareDirectory({ content, locale }: { content: SiteContent; locale: Locale }) {
  const en = locale === 'en';
  const home = en ? '/en' : '/';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;

  const icons: Record<string, typeof ScanLine> = {
    RIS: ScanLine,
    PACS: Layers3,
    AI: Sparkles,
    CMS: Building2,
    PORTAL: Users,
  };

  const allowed = careCatalog(content).sort(
    (a, b) => marketingSystemIds.indexOf(a.id) - marketingSystemIds.indexOf(b.id)
  );
  const categories = content.catalog.categories.filter(category =>
    allowed.some(system => system.category === category.id)
  );

  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [activeCaptures, setActiveCaptures] = useState<Record<string, number>>({});
  const [cardVisualModes, setCardVisualModes] = useState<Record<string, 'brand' | 'ui'>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);
  const comparisonDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') || '');
      const requested = params.get('area');
      if (content.catalog.categories.some(category => category.id === requested)) setArea(requested!);
      try {
        const saved = JSON.parse(sessionStorage.getItem('viara-system-selection') || '[]');
        if (Array.isArray(saved)) {
          setSelected(
            [
              ...new Set(
                saved.filter(
                  (id): id is string =>
                    typeof id === 'string' &&
                    marketingSystemIds.includes(id) &&
                    content.products.some(product => product.id === id && product.enabled)
                )
              ),
            ].slice(0, MAX_SCOPE_SYSTEMS)
          );
        }
      } catch {
        /* Scope selection is optional when browser storage is unavailable. */
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [content.catalog.categories, content.products]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (area !== 'all') url.searchParams.set('area', area);
    else url.searchParams.delete('area');
    history.replaceState(null, '', url);
  }, [query, area, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem('viara-system-selection', JSON.stringify(selected));
    } catch {
      /* Selection still works without storage. */
    }
  }, [selected, ready]);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Sync comparison dialog
  useEffect(() => {
    if (showComparisonModal) {
      comparisonDialogRef.current?.showModal();
    } else {
      comparisonDialogRef.current?.close();
    }
  }, [showComparisonModal]);

  const results = allowed.filter(
    system =>
      (area === 'all' || system.category === area) &&
      normalizeCatalogSearch(
        `${system.id} ${system.name.ar} ${system.name.en} ${system.description.ar} ${system.description.en}`
      ).includes(normalizeCatalogSearch(query))
  );

  const toggle = (id: string) =>
    setSelected(ids =>
      ids.includes(id)
        ? ids.filter(item => item !== id)
        : ids.length >= MAX_SCOPE_SYSTEMS
        ? ids
        : [...ids, id]
    );

  const reset = () => {
    setQuery('');
    setArea('all');
  };

  const roles: Record<string, [string, string]> = {
    RIS: ['من الحجز إلى التقرير والفوترة', 'From booking to reporting & billing'],
    PACS: ['أرشفة طبية وبث فوري للدراسات', 'Medical image streaming & hybrid archive'],
    CMS: ['إدارة متكاملة للعيادات والمراكز', 'Unified clinic & patient workflow'],
    PORTAL: ['بوابات تفاعلية للمرضى والأطباء', 'Interactive patient & doctor portals'],
    AI: ['فرز ذكي للحالات الحرجة والأشعة', 'AI critical findings triage'],
  };

  const fits: Record<string, [string, string]> = {
    RIS: ['لفرق الاستقبال وفنيي وأطباء الأشعة', 'For reception, radiology techs & radiologists'],
    PACS: ['لأطباء الأشعة وفرق التشخيص والأرشفة', 'For radiologists, diagnosticians & IT archive teams'],
    CMS: ['لإدارة المراكز والعيادات التخصصية', 'For medical centers & outpatient clinics'],
    PORTAL: ['للمرضى والأطباء المحيلين وفرق المتابعة', 'For patients, referring doctors & care coordinators'],
    AI: ['لأطباء الأشعة وغرف الطوارئ والعناية', 'For radiologists, ER teams & acute care units'],
  };

  const pipeline = [
    { id: 'CMS', num: '01', title: en ? 'Registration & EMR' : 'الاستقبال والملف الطبي' },
    { id: 'RIS', num: '02', title: en ? 'Exam Worklist (MWL)' : 'أمر الفحص وقائمة MWL' },
    { id: 'PACS', num: '03', title: en ? 'Diagnostic Archive' : 'أرشفة وعرض الصور' },
    { id: 'AI', num: '04', title: en ? 'Clinical AI Triage' : 'فرز دراسات الأشعة' },
    { id: 'PORTAL', num: '05', title: en ? 'Results & Delivery' : 'البوابات وتسليم النتائج' },
  ];

  return (
    <CareFrame content={content} locale={locale} current="systems">
      <div className={`vsd-page ${selected.length ? 'has-selection' : ''}`}>
        {/* ── Hero ── */}
        <BrandPageHero
          locale={locale}
          kind="systems"
          eyebrow={t('حلول متخصصة. نطاق يناسب مركزك.', 'SPECIALIZED SYSTEMS. A SCOPE THAT FITS.')}
          title={t('اختر النظام المناسب', 'Choose the right system')}
          accent={t('لطريقة عمل مركزك.', 'for the way your center works.')}
          description={t(
            'إدارة رحلة الأشعة، وتنظيم الصور الطبية، وتشغيل المراكز والعيادات. استعرض حلول VIARA بتصميم مريح وتصورات معمارية وواجهات حية، واختر ما يلائم احتياجك.',
            'Radiology workflows, medical imaging and daily clinic operations. Explore VIARA solutions with architectural previews, live interfaces, and clear clinical scope.'
          )}
        >
          <div className="vsd-hero-actions-group">
            <a className="care-btn" href="#system-directory">
              {t('استكشف الأنظمة', 'Explore systems')}
              <Arrow size={18} />
            </a>
            <button
              type="button"
              className="vsd-hero-compare-btn"
              onClick={() => setShowComparisonModal(true)}
            >
              <Columns3 size={17} />
              <span>{t('مصفوفة مقارنة الأنظمة', 'System comparison matrix')}</span>
            </button>
          </div>

          {/* Quick High-Trust Badges */}
          <div className="vsd-hero-stats-row" aria-label={t('مؤشرات الاعتماد الطبي', 'Clinical accreditation specs')}>
            <span className="vsd-hero-stat-pill">
              <Cpu size={14} />
              <span>{t('5 أنظمة متكاملة ومترابطة', '5 Native Integrated Systems')}</span>
            </span>
            <span className="vsd-hero-stat-pill">
              <ShieldCheck size={14} />
              <span>{t('100% معايير DICOM 3.0 & HL7', '100% DICOM 3.0 & HL7 Compliant')}</span>
            </span>
            <span className="vsd-hero-stat-pill">
              <HardDrive size={14} />
              <span>{t('نشر محلي وسحابي هجين', 'Hybrid On-prem & Cloud')}</span>
            </span>
            <span className="vsd-hero-stat-pill">
              <Activity size={14} />
              <span>{t('دعم فني وتدريب ميداني', 'Clinical SLA & Hands-on Onboarding')}</span>
            </span>
          </div>
        </BrandPageHero>

        {/* ── Main Systems Directory Section ── */}
        <section className="care-wrap vsd-directory-clean" id="system-directory" aria-labelledby="vsd-directory-title">
          {/* Header & Subtitle */}
          <div className="vsd-clean-heading">
            <div className="vsd-heading-text">
              <span className="vsd-clean-kicker">
                <Sparkles size={13} />
                {t('دليل الأنظمة الطبية المعتمدة', 'CERTIFIED CLINICAL SYSTEMS DIRECTORY')}
              </span>
              <h2 id="vsd-directory-title">
                {t('أنظمة متخصصة. أدوار تشغيلية واضحة.', 'Specialized systems. Focused roles.')}
              </h2>
              <p>
                {t(
                  'استعرض الأنظمة بأناقة وسهولة. يمكنك التبديل بين التصور المعماري بهوية فيارا وواجهات التطبيق الفعلية، أو إضافة أي نظام إلى نطاقك بضغطة واحدة.',
                  'Browse systems effortlessly. Toggle between branded architectural 3D previews and live clinical screens, or add any system to your scope with a click.'
                )}
              </p>
            </div>

            {/* Quick Action Matrix Button */}
            <div className="vsd-heading-actions">
              <button
                type="button"
                className="vsd-compare-pill-btn"
                onClick={() => setShowComparisonModal(true)}
              >
                <Columns3 size={15} />
                <span>{t('مقارنة سريعة بين الأنظمة', 'Quick compare matrix')}</span>
              </button>
            </div>
          </div>

          {/* ── Connected Clinical Synergy Pipeline ── */}
          <div className="vsd-synergy-pipeline" aria-label={t('مسار الترابط السريري بين الأنظمة', 'Clinical Synergy Pipeline')}>
            <div className="vsd-pipeline-heading">
              <span className="vsd-pipeline-dot" />
              <span>{t('مسار العمل السريري المتصل بين أنظمة VIARA:', 'Connected clinical workflow across VIARA systems:')}</span>
            </div>
            <div className="vsd-pipeline-steps">
              {pipeline.map((step, idx) => (
                <div key={step.id} className="vsd-pipeline-node">
                  <button
                    type="button"
                    className="vsd-pipeline-btn"
                    onClick={() => {
                      const el = document.getElementById(`system-${step.id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    title={t('انتقل إلى هذا النظام', 'Jump to this system')}
                  >
                    <bdi className="vsd-pipe-badge">{step.id}</bdi>
                    <span className="vsd-pipe-num">{step.num}</span>
                    <span className="vsd-pipe-title">{step.title}</span>
                  </button>
                  {idx < pipeline.length - 1 && (
                    <span className="vsd-pipeline-arrow" aria-hidden="true">
                      {en ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Smart Control Hub (Filters, Search & View Switcher) ── */}
          <div className="vsd-control-hub">
            {/* Domain Tabs */}
            <div className="vsd-domain-tabs" role="tablist" aria-label={t('تصفية الأنظمة حسب التخصص', 'Filter by domain')}>
              <button
                type="button"
                role="tab"
                aria-selected={area === 'all'}
                className={`vsd-domain-tab ${area === 'all' ? 'is-active' : ''}`}
                onClick={() => setArea('all')}
              >
                <span>{t('الكل', 'All')}</span>
                <span className="vsd-tab-count">{allowed.length}</span>
              </button>

              {categories.map(category => {
                const count = allowed.filter(s => s.category === category.id).length;
                const isSelected = area === category.id;
                return (
                  <button
                    type="button"
                    key={category.id}
                    role="tab"
                    aria-selected={isSelected}
                    className={`vsd-domain-tab ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setArea(category.id)}
                  >
                    <span>{txt(category.name, locale)}</span>
                    <span className="vsd-tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Field & View Switcher */}
            <div className="vsd-actions-dock">
              <div className="vsd-search-box">
                <Search size={16} className="vsd-search-icon" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="search"
                  aria-label={t('ابحث في الأنظمة', 'Search systems')}
                  placeholder={t('ابحث باسم النظام أو الاختصار (/ للتركيز)', 'Search by name or code (/ to focus)')}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="vsd-clear-search"
                    aria-label={t('مسح البحث', 'Clear search')}
                    onClick={() => setQuery('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* View Mode Toggle: Grid vs Compact List */}
              <div className="vsd-view-toggle" role="group" aria-label={t('طريقة العرض', 'View mode')}>
                <button
                  type="button"
                  aria-pressed={viewMode === 'grid'}
                  className={`vsd-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title={t('عرض البطاقات الشبكية', 'Grid cards view')}
                >
                  <LayoutGrid size={16} />
                  <span className="vsd-view-btn-text">{t('بطاقات', 'Cards')}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={viewMode === 'table'}
                  className={`vsd-view-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title={t('عرض القائمة المدمجة', 'Compact list view')}
                >
                  <List size={16} />
                  <span className="vsd-view-btn-text">{t('قائمة سريعة', 'Compact list')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Status Line */}
          <div className="vsd-status-line" role="status" aria-live="polite">
            <span className="vsd-count-text">
              {results.length} {t('أنظمة مطابقة للبحث والتصفية', 'systems match your selection')}
            </span>
            {selected.length > 0 && (
              <span className="vsd-basket-indicator">
                <CheckCircle2 size={13} />
                {selected.length} {t('أنظمة مضافة لنطاقك المختار', 'systems in your custom scope')}
              </span>
            )}
          </div>

          {/* ── View 1: Streamlined Grid Cards with Dual 3D / Live UI Visuals ── */}
          {viewMode === 'grid' && (
            <div className="vsd-cards-grid">
              {results.map(system => {
                const product = content.products.find(item => item.id === system.id)!;
                const Icon = icons[system.id] || Building2;
                const chosen = selected.includes(system.id);
                const captures = systemCaptures[system.id] || [];
                const captureIdx = activeCaptures[system.id] || 0;
                const currentCapture = captures[captureIdx] || captures[0];
                const brandVisual = systemBrandVisuals[system.id];
                const visualMode = cardVisualModes[system.id] || 'brand'; // default to brand visual

                return (
                  <article
                    key={system.id}
                    id={`system-${system.id}`}
                    className={`vsd-clean-card ${chosen ? 'is-selected' : ''}`}
                    data-system={system.id}
                  >
                    {/* Top Identity Header */}
                    <div className="vsd-card-header">
                      <div className="vsd-brand-ident">
                        <span className="vsd-icon-badge">
                          <Icon size={20} strokeWidth={1.7} />
                        </span>
                        <div>
                          <bdi className="vsd-code-badge">{system.id}</bdi>
                          <span className="vsd-role-kicker">{t(...(roles[system.id] || ['', '']))}</span>
                        </div>
                      </div>

                      {/* Quick Scope Toggle Button */}
                      <button
                        type="button"
                        className={`vsd-scope-quick-btn ${chosen ? 'is-added' : ''}`}
                        aria-pressed={chosen}
                        onClick={() => toggle(system.id)}
                        title={chosen ? t('إزالة من النطاق', 'Remove from scope') : t('إضافة للنطاق', 'Add to scope')}
                      >
                        {chosen ? <Check size={14} /> : <Plus size={14} />}
                        <span>{chosen ? t('في نطاقك', 'In scope') : t('أضف للنطاق', 'Add')}</span>
                      </button>
                    </div>

                    {/* Dual-Perspective Preview Container: 3D Brand Architectural Render OR Live System UI */}
                    <div className="vsd-preview-container">
                      <Link
                        href={solutionPath(system.id, locale)}
                        className="vsd-preview-link"
                        aria-label={`${t('عرض واجهات ومواصفات', 'View interfaces and specs for')} ${txt(product.name, locale)}`}
                      >
                        {visualMode === 'brand' && brandVisual ? (
                          <img
                            src={brandVisual.image}
                            alt={txt(brandVisual.alt, locale)}
                            width={640}
                            height={400}
                            loading="lazy"
                            className="vsd-preview-img vsd-preview-img-brand"
                          />
                        ) : currentCapture ? (
                          <img
                            src={currentCapture.thumbnail || currentCapture.image}
                            alt={txt(currentCapture.title, locale)}
                            width={640}
                            height={400}
                            loading="lazy"
                            className="vsd-preview-img vsd-preview-img-ui"
                          />
                        ) : null}

                        <div className="vsd-preview-shade" />

                        {/* Informative Overlay Tag */}
                        {visualMode === 'brand' && brandVisual ? (
                          <span className="vsd-screen-tag vsd-screen-tag-brand">
                            <Sparkles size={12} />
                            <span>{txt(brandVisual.tag, locale)}</span>
                          </span>
                        ) : currentCapture ? (
                          <span className="vsd-screen-tag">
                            <MonitorCheck size={12} />
                            <span>{txt(currentCapture.title, locale)}</span>
                          </span>
                        ) : null}
                      </Link>

                      {/* Interactive Visual Switcher Pill: [ 3D Brand | Live UI ] */}
                      <div className="vsd-preview-toggle-dock" role="group" aria-label={t('نمط المعاينة', 'Preview perspective')}>
                        <button
                          type="button"
                          className={`vsd-toggle-pill ${visualMode === 'brand' ? 'is-active' : ''}`}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardVisualModes(prev => ({ ...prev, [system.id]: 'brand' }));
                          }}
                          title={t('عرض التصور المعماري بهوية فيارا', 'View 3D brand visual')}
                        >
                          <Sparkles size={11} />
                          <span>{t('بيئة النظام', '3D Scene')}</span>
                        </button>

                        <button
                          type="button"
                          className={`vsd-toggle-pill ${visualMode === 'ui' ? 'is-active' : ''}`}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardVisualModes(prev => ({ ...prev, [system.id]: 'ui' }));
                          }}
                          title={t('عرض واجهة التطبيق الفعلية', 'View live system interface')}
                        >
                          <MonitorCheck size={11} />
                          <span>{t('واجهة النظام', 'Live UI')}</span>
                        </button>
                      </div>

                      {/* UI Screen Sub-dots if in UI mode and has multiple screens */}
                      {visualMode === 'ui' && captures.length > 1 && (
                        <div className="vsd-preview-dots">
                          {captures.map((c, i) => (
                            <button
                              key={c.id}
                              type="button"
                              className={`vsd-dot-btn ${i === captureIdx ? 'is-active' : ''}`}
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveCaptures(prev => ({ ...prev, [system.id]: i }));
                              }}
                              title={txt(c.title, locale)}
                              aria-label={`${t('واجهة', 'Screen')} 0${i + 1}`}
                            >
                              0{i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="vsd-card-content">
                      <h3 className="vsd-card-title">{txt(product.name, locale)}</h3>
                      <p className="vsd-card-desc">{txt(product.description, locale)}</p>

                      {/* Target Audience Pill */}
                      <div className="vsd-target-team">
                        <Icon size={13} className="vsd-team-icon" />
                        <span>{t(...(fits[system.id] || ['', '']))}</span>
                      </div>

                      {/* Technical Standards and Protocols Badges */}
                      {systemSpecs[system.id] && (
                        <div className="vsd-spec-badges" aria-label={t('المعايير والمواصفات المدعومة', 'Supported specs')}>
                          {(en ? systemSpecs[system.id].en : systemSpecs[system.id].ar).map(spec => (
                            <span key={spec} className="vsd-spec-badge">{spec}</span>
                          ))}
                        </div>
                      )}

                      {/* Top 3 Feature Highlights */}
                      <div className="vsd-highlights-list">
                        {product.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="vsd-highlight-item">
                            <Check size={13} className="vsd-highlight-check" />
                            <span>{txt(feat, locale)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Single Unified Primary CTA Button */}
                      <div className="vsd-card-footer">
                        <Link className="vsd-details-btn" href={solutionPath(system.id, locale)}>
                          <span>{t('استكشف الواجهات والتفاصيل', 'Explore screens & specs')}</span>
                          <Arrow size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* ── View 2: Compact High-Efficiency Table Mode ── */}
          {viewMode === 'table' && (
            <div className="vsd-table-wrapper">
              <table className="vsd-compact-table">
                <caption className="vsd-visually-hidden">
                  {t('جدول مقارنة واستعراض أنظمة VIARA', 'VIARA systems overview and spec table')}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t('النظام والكود', 'System & Code')}</th>
                    <th scope="col">{t('الدور التشغيلي', 'Operational Role')}</th>
                    <th scope="col">{t('الفريق المستفيد', 'Target Team')}</th>
                    <th scope="col">{t('الواجهة السريرية', 'Preview')}</th>
                    <th scope="col">{t('الإجراءات', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(system => {
                    const product = content.products.find(item => item.id === system.id)!;
                    const Icon = icons[system.id] || Building2;
                    const chosen = selected.includes(system.id);
                    const brandVisual = systemBrandVisuals[system.id];
                    const captures = systemCaptures[system.id] || [];
                    const currentCapture = captures[0];

                    return (
                      <tr key={system.id} className={chosen ? 'is-row-selected' : ''}>
                        {/* System & Code */}
                        <td className="vsd-td-identity">
                          <div className="vsd-row-id-cell">
                            <span className="vsd-row-icon">
                              <Icon size={18} />
                            </span>
                            <div>
                              <bdi className="vsd-row-code">{system.id}</bdi>
                              <strong className="vsd-row-name">{txt(product.name, locale)}</strong>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="vsd-td-role">
                          <span className="vsd-row-role-text">{t(...(roles[system.id] || ['', '']))}</span>
                          <p className="vsd-row-desc-text">{txt(product.description, locale)}</p>
                        </td>

                        {/* Audience */}
                        <td className="vsd-td-audience">
                          <span className="vsd-audience-badge">{t(...(fits[system.id] || ['', '']))}</span>
                        </td>

                        {/* Preview Thumbnail */}
                        <td className="vsd-td-preview">
                          <Link
                            href={solutionPath(system.id, locale)}
                            className="vsd-row-thumb-link"
                            title={txt(product.name, locale)}
                          >
                            <img
                              src={brandVisual ? brandVisual.image : (currentCapture?.thumbnail || currentCapture?.image || '')}
                              alt={txt(product.name, locale)}
                              width={120}
                              height={75}
                              className="vsd-row-thumb-img"
                            />
                          </Link>
                        </td>

                        {/* Actions */}
                        <td className="vsd-td-actions">
                          <div className="vsd-row-actions">
                            <button
                              type="button"
                              className={`vsd-row-scope-btn ${chosen ? 'is-active' : ''}`}
                              onClick={() => toggle(system.id)}
                            >
                              {chosen ? <Check size={14} /> : <Plus size={14} />}
                              <span>{chosen ? t('في نطاقك', 'In scope') : t('أضف', 'Add')}</span>
                            </button>
                            <Link href={solutionPath(system.id, locale)} className="vsd-row-view-btn">
                              <span>{t('التفاصيل', 'Details')}</span>
                              <Arrow size={14} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty Search State */}
          {!results.length && (
            <div className="vsd-clean-empty">
              <Search size={36} className="vsd-empty-icon" />
              <h3>{t('لم نجد نظاماً يطابق بحثك.', 'No systems match your search query.')}</h3>
              <p>
                {t(
                  'جرّب البحث باسم مختصر مثل RIS أو PACS أو CMS أو AI، أو أعد عرض كافة الأنظمة.',
                  'Try searching for RIS, PACS, CMS or AI, or reset filters to display all systems.'
                )}
              </p>
              <button type="button" className="care-btn" onClick={reset}>
                {t('عرض كافة الأنظمة', 'Show all systems')}
                <Forward size={16} />
              </button>
            </div>
          )}
        </section>

        {/* ── System Comparison Dialog Modal ── */}
        <dialog
          ref={comparisonDialogRef}
          className="vsd-modal-dialog"
          aria-labelledby="vsd-modal-title"
          onClick={e => {
            if (e.target === comparisonDialogRef.current) setShowComparisonModal(false);
          }}
        >
          <div className="vsd-modal-sheet">
            <div className="vsd-modal-header">
              <div>
                <span className="vsd-modal-kicker">
                  <Columns3 size={15} />
                  {t('مصفوفة المقارنة السريرية والتقنية', 'TECHNICAL & CLINICAL COMPARISON MATRIX')}
                </span>
                <h3 id="vsd-modal-title">
                  {t('قارن بين قدرات وأدوار أنظمة VIARA', 'Compare VIARA systems roles and capabilities')}
                </h3>
              </div>
              <button
                type="button"
                className="vsd-modal-close"
                onClick={() => setShowComparisonModal(false)}
                aria-label={t('إغلاق المقارنة', 'Close comparison')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="vsd-modal-body">
              <SystemComparison
                content={content}
                locale={locale}
                selected={selected}
                onToggle={toggle}
              />
            </div>
          </div>
        </dialog>

        {/* ── Next Step Call to Action ── */}
        <section className="care-wrap vsd-next-clean" aria-labelledby="vsd-next-clean-title">
          <div className="vsd-next-clean-card">
            <div className="vsd-next-copy">
              <span className="vsd-next-kicker">{t('الخطوة التالية · استشارة النطاق', 'NEXT STEP · SCOPE CONSULTATION')}</span>
              <h2 id="vsd-next-clean-title">
                {t('لنحوّل احتياج منشأتك إلى نطاق عملي مدروس.', 'Turn your clinical needs into a solid plan.')}
              </h2>
              <p>
                {t(
                  'أرسل الأنظمة التي اخترتها إلى فريقنا الاستشاري، وسنراجع معك متطلبات الربط والأجهزة وخطة التدشين المرحلية.',
                  'Submit your chosen systems directly. Our clinical engineers will review workflow requirements, modality integrations, and phased rollout milestones.'
                )}
              </p>
            </div>

            <div className="vsd-next-buttons">
              <Link
                className="vsd-next-primary-btn"
                href={
                  selected.length
                    ? `${home}?systems=${encodeURIComponent(selected.join(','))}#contact`
                    : `${home}#contact`
                }
              >
                <span>{t('ناقش احتياجات مركزك الآن', 'Discuss your facility needs now')}</span>
                <Arrow size={18} />
              </Link>
              <Link className="vsd-next-secondary-link" href={`${en ? '/en' : ''}/planning`}>
                <span>{t('خارطة طريق التنفيذ والجدوى', 'Rollout roadmap & ROI')}</span>
                <Forward size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Floating Smart Scope Builder Basket ── */}
        {selected.length > 0 && (
          <aside className="vsd-floating-basket" aria-label={t('نطاقك المختار', 'Your selected scope')}>
            <div className="vsd-basket-info">
              <span className="vsd-basket-badge">
                <Sparkles size={13} />
                <span>{t('نطاقك المختار', 'Your scope')} ({selected.length}/{MAX_SCOPE_SYSTEMS})</span>
              </span>

              <div className="vsd-basket-chips">
                {selected.map(id => (
                  <span key={id} className="vsd-basket-chip">
                    <bdi>{id}</bdi>
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      aria-label={`${t('إزالة', 'Remove')} ${id}`}
                      className="vsd-chip-remove"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="vsd-basket-actions">
              <button
                type="button"
                className="vsd-basket-clear"
                onClick={() => setSelected([])}
              >
                {t('مسح الكل', 'Clear all')}
              </button>

              <Link
                href={`${home}?systems=${encodeURIComponent(selected.join(','))}#contact`}
                className="vsd-basket-submit"
              >
                <span>{t('طلب دراسة هذا النطاق', 'Request scope proposal')}</span>
                <Arrow size={16} />
              </Link>
            </div>
          </aside>
        )}
      </div>
    </CareFrame>
  );
}
