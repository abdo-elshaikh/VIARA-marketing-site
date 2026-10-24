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
  FileText,
  ShieldCheck,
  Monitor,
  HardDrive,
  Calendar,
  Receipt,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { careCatalog, txt, type Locale, type SiteContent } from '../lib/site-content';
import { marketingSystemIds, normalizeCatalogSearch } from '../lib/healthcare-catalog.mjs';
import { useSiteText } from '../lib/site-copy';
import { solutionPath } from '../lib/solutions';
import { systemCaptures } from '../lib/system-captures';
import CareFrame from './care-frame';
import SystemComparison from './system-comparison';
import BrandPageHero from './brand-page-hero';
import SystemSynergyMap from './system-synergy-map';
import './systems-directory.css';
import './systems-usability.css';
import './systems-enhanced.css';

const MAX_SCOPE_SYSTEMS = 6;

const techSpecs: Record<string, { label: { ar: string; en: string }; icon: typeof ScanLine }[]> = {
  RIS: [
    { label: { ar: 'تكامل DICOM MWL', en: 'DICOM MWL Integration' }, icon: ScanLine },
    { label: { ar: 'تقارير وفحوصات الأشعة', en: 'Radiology Reporting' }, icon: FileText },
    { label: { ar: 'ربط الفوترة والتعاقدات', en: 'Billing & Payer Sync' }, icon: ShieldCheck },
  ],
  PACS: [
    { label: { ar: 'تكاملات DICOM: MWL وC-STORE وC-FIND', en: 'DICOM MWL, C-STORE & C-FIND Integration' }, icon: Layers3 },
    { label: { ar: 'عارض ويب تشخيصي متقدم', en: 'Diagnostic Web Viewer' }, icon: Monitor },
    { label: { ar: 'أرشفة سحابية / محلية مشفرة', en: 'Hybrid Encrypted Archive' }, icon: HardDrive },
  ],
  CMS: [
    { label: { ar: 'ملف طبي إلكتروني EMR', en: 'Clinical EMR Records' }, icon: Building2 },
    { label: { ar: 'جدولة العيادات والمواعيد', en: 'Multi-clinic Scheduling' }, icon: Calendar },
    { label: { ar: 'فواتير ودفع إلكتروني', en: 'Insurance & POS Billing' }, icon: Receipt },
  ],
  PORTAL: [
    { label: { ar: 'بوابات المرضى والأطباء', en: 'Patient & Doctor Portals' }, icon: Users },
    { label: { ar: 'تحقق إلكتروني فوري بالـ QR', en: 'Instant QR Verification' }, icon: QrCode },
    { label: { ar: 'عرض الصور والتقارير بالموبايل', en: 'Mobile DICOM & Reports' }, icon: Smartphone },
  ],
  AI: [
    { label: { ar: 'فرز الحالات حسب الأولوية', en: 'Priority-based case triage' }, icon: Sparkles },
    { label: { ar: 'مسودات تقارير بمراجعة الطبيب', en: 'Radiologist-reviewed report drafts' }, icon: FileText },
    { label: { ar: 'مساندة القرار وليست بديلاً عن الطبيب', en: 'Decision support, not a replacement for clinicians' }, icon: ShieldCheck },
  ],
};

function getSynergyInsight(selectedIds: string[], locale: Locale) {
  const en = locale === 'en';
  if (selectedIds.length === 0) return null;
  const hasRis = selectedIds.includes('RIS');
  const hasPacs = selectedIds.includes('PACS');
  const hasCms = selectedIds.includes('CMS');
  const hasPortal = selectedIds.includes('PORTAL');

  if (hasRis && hasPacs && hasCms && hasPortal) {
    return {
      text: en
        ? 'Comprehensive Healthcare Ecosystem: Full coverage from clinic bookings to diagnostic imaging and digital patient delivery.'
        : 'المنظومة الرقمية الشاملة: تغطية متكاملة تبدأ من العيادات وحجز المواعيد حتى الفحص التشخيصي والتسليم الرقمي للمراجع.',
      recommended: null,
    };
  }
  if (hasRis && hasPacs && hasPortal) {
    return {
      text: en
        ? 'Complete Digital Radiology Workflow: Modality worklists, DICOM archiving and direct report/image access.'
        : 'منظومة الأشعة الرقمية المتكاملة: جدولة الأجهزة، الأرشفة التشخيصية وتسليم التقارير والصور للمراجع والطبيب.',
      recommended: !hasCms ? 'CMS' : null,
    };
  }
  if (hasRis && hasPacs) {
    return {
      text: en
        ? 'Full Radiology & Archive Pairing: Worklists matched directly with DICOM studies and diagnostic viewing.'
        : 'تناغم الأشعة والأرشفة: ربط مباشر بين قوائم عمل الفحص ودراسات DICOM والعارض التشخيصي.',
      recommended: !hasPortal ? 'PORTAL' : null,
    };
  }
  if (hasCms && hasPortal) {
    return {
      text: en
        ? 'Modern Clinic Operations: Smooth clinic appointments and verified digital patient results.'
        : 'تشغيل متقدم للمركز: إدارة العيادات والمواعيد مع تسليم النتائج الطبية رقمياً.',
      recommended: !hasRis ? 'RIS' : null,
    };
  }
  if (hasRis) {
    return {
      text: en
        ? 'Radiology Suite selected: Best paired with PACS for seamless DICOM study storage and viewing.'
        : 'نظام الأشعة RIS: يُنصح بدمجه مع PACS لربط الفحوصات مباشرة بأرشفة وعارض الصور الطبية.',
      recommended: 'PACS',
    };
  }
  if (hasPacs) {
    return {
      text: en
        ? 'PACS Archive selected: Pair with RIS to generate Modality Worklists (MWL) for imaging devices.'
        : 'أرشفة صور PACS: يُنصح بدمجها مع RIS لربط الأجهزة التشخيصية بقوائم العمل التلقائية (MWL).',
      recommended: 'RIS',
    };
  }
  if (hasCms) {
    return {
      text: en
        ? 'Medical Center CMS selected: Pair with PORTAL to let patients and doctors access results online.'
        : 'إدارة المركز CMS: يُنصح بدمجه مع PORTAL لإتاحة حجز المواعيد وتسليم النتائج للمراجعين إلكترونياً.',
      recommended: 'PORTAL',
    };
  }
  if (hasPortal) {
    return {
      text: en
        ? 'Digital Portals selected: Pair with RIS or CMS to connect with your center’s actual clinical records.'
        : 'بوابات PORTAL: يُنصح بربطها مع RIS أو CMS للتكامل مع المواعيد وسجلات الفحوصات الفعلية.',
      recommended: 'RIS',
    };
  }
  return null;
}

export default function CareDirectory({ content, locale }: { content: SiteContent; locale: Locale }) {
  const en = locale === 'en', home = en ? '/en' : '/', t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft, Forward = en ? ArrowRight : ArrowLeft;
  const icons: Record<string, typeof ScanLine> = { RIS: ScanLine, PACS: Layers3, AI: Sparkles, CMS: Building2, PORTAL: Users };
  const allowed = careCatalog(content).sort((a, b) => marketingSystemIds.indexOf(a.id) - marketingSystemIds.indexOf(b.id));
  const categories = content.catalog.categories.filter(category => allowed.some(system => system.category === category.id));
  const profiles = content.catalog.facilities.filter(profile => ['radiology', 'medical'].includes(profile.id)).map(profile => ({ ...profile, systems: profile.systems.filter(id => allowed.some(system => system.id === id)) })).filter(profile => profile.systems.length);

  const [query, setQuery] = useState(''), [area, setArea] = useState('all');
  const [selected, setSelected] = useState<string[]>([]), [activeProfile, setActiveProfile] = useState<string | null>(null), [ready, setReady] = useState(false);
  const [activeCaptures, setActiveCaptures] = useState<Record<string, number>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') || '');
      const requested = params.get('area');
      if (content.catalog.categories.some(category => category.id === requested)) setArea(requested!);
      try {
        const saved = JSON.parse(sessionStorage.getItem('viara-system-selection') || '[]');
        if (Array.isArray(saved)) setSelected([...new Set(saved.filter((id): id is string => typeof id === 'string' && marketingSystemIds.includes(id) && content.products.some(product => product.id === id && product.enabled)))].slice(0, MAX_SCOPE_SYSTEMS));
      } catch { /* Scope selection is optional when browser storage is unavailable. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [content.catalog.categories, content.products]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (area !== 'all') url.searchParams.set('area', area); else url.searchParams.delete('area');
    history.replaceState(null, '', url);
  }, [query, area, ready]);

  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem('viara-system-selection', JSON.stringify(selected)); } catch { /* Selection still works without storage. */ }
  }, [selected, ready]);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = allowed.filter(system => (area === 'all' || system.category === area) && normalizeCatalogSearch(`${system.id} ${system.name.ar} ${system.name.en} ${system.description.ar} ${system.description.en}`).includes(normalizeCatalogSearch(query)));

  const toggle = (id: string) => {
    setActiveProfile(null);
    setSelected(ids => ids.includes(id) ? ids.filter(item => item !== id) : (ids.length >= MAX_SCOPE_SYSTEMS ? ids : [...ids, id]));
  };

  const reset = () => { setQuery(''); setArea('all'); };

  const handleSynergySelect = (id: string) => {
    const el = document.getElementById(`system-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('is-highlighted');
      setTimeout(() => el.classList.remove('is-highlighted'), 2000);
    }
  };

  const roles: Record<string, [string, string]> = {
    RIS: ['من الحجز إلى التقرير', 'From booking to reporting'],
    PACS: ['الصور في سياق أوضح', 'Imaging in clearer context'],
    CMS: ['يوم عمل منظم لمركزك', 'A more organized center day'],
    PORTAL: ['بوابات تفاعلية للمرضى والأطباء', 'Interactive patient and doctor portals'],
  };

  const fits: Record<string, [string, string]> = {
    RIS: ['لفرق الاستقبال والأشعة والتقارير', 'For reception, radiology and reporting teams'],
    PACS: ['لفرق التصوير ومراجعة الدراسات', 'For imaging and study review teams'],
    CMS: ['لإدارة المراكز الطبية والعيادات', 'For medical center and clinic management'],
    PORTAL: ['للمرضى والأطباء المحيلين وفرق المتابعة', 'For patients, referring doctors and follow-up teams'],
  };

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
            'إدارة رحلة الأشعة، وتنظيم الصور الطبية، وتشغيل المراكز والعيادات. تعرّف على حلول VIARA واختر الأنظمة التي تريد مناقشتها مع فريقنا.',
            'Radiology workflows, medical imaging and daily center operations. Explore VIARA solutions and choose the systems you would like to discuss with our team.',
          )}
        >
          <a className="care-btn" href="#system-directory">
            {t('استكشف الأنظمة', 'Explore the systems')}
            <Arrow size={18} />
          </a>
          <a
            className="care-link"
            href="#system-comparison"
            onClick={() => {
              const comparison = document.getElementById('system-comparison');
              if (comparison instanceof HTMLDetailsElement) comparison.open = true;
            }}
          >
            {t('قارن بين الأنظمة', 'Compare systems')}
            <Forward size={17} />
          </a>
        </BrandPageHero>

        {/* ── Connected Healthcare Synergy Map ── */}
        <SystemSynergyMap
          locale={locale}
          activeId={selected[0] || null}
          onSelectSystem={handleSynergySelect}
        />

        {/* ── Systems Directory ── */}
        <section className="care-wrap vsd-directory" id="system-directory" aria-labelledby="vsd-directory-title">
          <div className="vsd-section-heading">
            <div>
              <span className="vsd-kicker">{t('حلول VIARA', 'THE VIARA SYSTEMS')}</span>
              <h2 id="vsd-directory-title">{t('حلول متخصصة. أدوار واضحة.', 'Specialized systems. Clear roles.')}</h2>
            </div>
            <p>{t('استعرض دور كل نظام وقدراته، ثم أضفه إلى نطاقك المبدئي. يمكنك اختيار أكثر من نظام.', 'Review each system’s role and capabilities, then add it to your initial scope. You can select more than one.')}</p>
          </div>

          {/* Interactive Comparison Tool */}
          <SystemComparison content={content} locale={locale} selected={selected} onToggle={toggle} />

          {/* Toolbar: Filters and Search */}
          <div className="vsd-toolbar">
            <div className="vsd-filters" role="group" aria-label={t('تصفية الأنظمة', 'Filter systems')}>
              <SlidersHorizontal size={16} aria-hidden="true" />
              <button type="button" aria-pressed={area === 'all'} onClick={() => setArea('all')}>
                {t('كل الأنظمة', 'All systems')}
                <bdi>{allowed.length}</bdi>
              </button>
              {categories.map(category => (
                <button
                  type="button"
                  key={category.id}
                  aria-pressed={area === category.id}
                  onClick={() => setArea(category.id)}
                >
                  {txt(category.name, locale)}
                </button>
              ))}
            </div>

            <div className="vsd-search">
              <Search size={17} aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                aria-label={t('ابحث عن نظام (اضغط / للتركيز)', 'Search systems (press / to focus)')}
                placeholder={t('ابحث باسم النظام أو اختصاره (اضغط /)', 'Search by system name or code (/ to focus)')}
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
              {query && (
                <button type="button" aria-label={t('مسح البحث', 'Clear search')} onClick={() => setQuery('')}>
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="vsd-results" role="status" aria-live="polite">
            <span>{results.length} {t('أنظمة متاحة للاستكشاف', 'systems to explore')}</span>
            <span>
              {selected.length ? (
                <>{selected.length} {t('أنظمة في نطاقك المختار', 'systems in your selected scope')}</>
              ) : (
                t('اختر ما يناسب طريقة عملك', 'Choose what fits the way you work')
              )}
            </span>
          </div>

          {/* Grid of System Cards */}
          <div className="vsd-grid">
            {results.map(system => {
              const product = content.products.find(item => item.id === system.id)!;
              const Icon = icons[system.id] || Building2;
              const chosen = selected.includes(system.id);
              const captures = systemCaptures[system.id] || [];
              const captureIdx = activeCaptures[system.id] || 0;
              const currentCapture = captures[captureIdx] || captures[0];
              const specs = techSpecs[system.id] || [];

              return (
                <article
                  className={`vsd-card ${chosen ? 'is-selected' : ''}`}
                  data-system={system.id}
                  key={system.id}
                  id={`system-${system.id}`}
                >
                  {/* Interactive Screenshot Preview */}
                  {currentCapture && (
                    <div className="vsd-capture-wrapper">
                      <Link
                        className="vsd-product-preview"
                        href={solutionPath(system.id, locale)}
                        aria-label={`${t('تفاصيل وواجهات', 'Details and interfaces for')} ${txt(product.name, locale)}`}
                      >
                        <img
                          src={currentCapture.thumbnail || currentCapture.image}
                          width={840}
                          height={525}
                          alt={txt(currentCapture.title, locale)}
                          loading="lazy"
                        />
                      </Link>

                      <div className="vsd-capture-nav">
                        <span className="vsd-capture-badge">
                          <ScanLine size={13} />
                          {txt(currentCapture.title, locale)}
                        </span>

                        {captures.length > 1 && (
                          <div className="vsd-capture-tabs" role="tablist" aria-label={t('واجهات النظام', 'System screens')}>
                            {captures.map((c, i) => (
                              <button
                                key={c.id}
                                type="button"
                                className={`vsd-capture-tab ${i === captureIdx ? 'is-active' : ''}`}
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
                    </div>
                  )}

                  <div className="vsd-card-top">
                    <span className="vsd-system-icon">
                      <Icon size={30} strokeWidth={1.4} />
                    </span>
                    <bdi>{system.id}</bdi>
                    <span className="vsd-card-index">0{allowed.findIndex(item => item.id === system.id) + 1}</span>
                  </div>

                  <div className="vsd-card-body">
                    <span className="vsd-role">{t(...(roles[system.id] || ['', '']))}</span>
                    <h3>{txt(product.name, locale)}</h3>
                    <p>{txt(product.description, locale)}</p>

                    {/* Technical Specifications Pills */}
                    {specs.length > 0 && (
                      <div className="vsd-tech-strip" aria-label={t('المعايير الفنية', 'Technical specifications')}>
                        {specs.map((spec, i) => {
                          const SpecIcon = spec.icon;
                          return (
                            <span key={i} className="vsd-tech-badge">
                              <SpecIcon size={12} aria-hidden="true" />
                              <span>{en ? spec.label.en : spec.label.ar}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="vsd-audience">
                      <Icon size={15} />
                      <span>{t(...(fits[system.id] || ['', '']))}</span>
                    </div>

                    <span className="vsd-feature-label">{t('ضمن قدرات النظام', 'SYSTEM CAPABILITIES')}</span>
                    <ul className="vsd-features">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>
                          <Check size={15} />
                          <span>{txt(feature, locale)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="vsd-card-actions">
                      <Link href={solutionPath(system.id, locale)}>
                        {t('التفاصيل والواجهات', 'Details and interfaces')}
                        <Arrow size={17} />
                      </Link>
                      <button type="button" aria-pressed={chosen} onClick={() => toggle(system.id)}>
                        {chosen ? <Check size={16} /> : <Plus size={16} />}
                        {chosen ? t('تمت الإضافة', 'Added to scope') : t('أضف إلى نطاقك', 'Add to scope')}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!results.length && (
            <div className="vsd-empty">
              <Search size={32} />
              <h3>{t('لم نجد نظاماً يطابق بحثك.', 'No systems match your search.')}</h3>
              <p>{t('جرّب RIS أو PACS أو AI أو CMS أو PORTAL، أو أعد عرض جميع الأنظمة.', 'Try RIS, PACS, AI, CMS or PORTAL, or view all systems again.')}</p>
              <button type="button" className="care-btn" onClick={reset}>
                {t('عرض كل الأنظمة', 'Show all systems')}
                <Forward size={17} />
              </button>
            </div>
          )}
        </section>

        {/* ── Facility Profiles Presets ── */}
        {profiles.length > 0 && (
          <section className="vsd-facilities" id="facility-scope" aria-labelledby="vsd-facility-title">
            <div className="care-wrap">
              <div className="vsd-section-heading">
                <div>
                  <span className="vsd-kicker">{t('ابدأ من منشأتك', 'START WITH YOUR FACILITY')}</span>
                  <h2 id="vsd-facility-title">{t('نقطة بداية تناسب مركزك.', 'A starting point for your center.')}</h2>
                </div>
                <p>{t('اختر نوع المنشأة لإضافة نطاق مبدئي، ثم عدّل اختيارك حسب احتياجاتك. المتطلبات والربط تُراجع في العرض الفني.', 'Select your facility type to add an initial scope, then adjust it to your needs. Requirements and integrations are reviewed in the technical proposal.')}</p>
              </div>

              <div className="vsd-profile-grid">
                {profiles.map(profile => {
                  const Icon = profile.id === 'radiology' ? ScanLine : Building2;
                  return (
                    <button
                      type="button"
                      key={profile.id}
                      className={`vsd-profile ${activeProfile === profile.id ? 'is-active' : ''}`}
                      aria-pressed={activeProfile === profile.id}
                      onClick={() => {
                        setActiveProfile(profile.id);
                        setSelected(profile.systems);
                      }}
                    >
                      <span className="vsd-profile-icon">
                        <Icon size={27} strokeWidth={1.5} />
                      </span>
                      <span className="vsd-profile-copy">
                        <strong>{txt(profile.name, locale)}</strong>
                        <small>
                          {profile.id === 'radiology'
                            ? t('لتنظيم الفحوصات والتقارير والصور الطبية.', 'For examinations, reporting and medical imaging.')
                            : t('لتنظيم المواعيد والزيارات وإدارة المركز.', 'For appointments, visits and center operations.')}
                          <span>
                            {profile.systems.map(id => (
                              <bdi key={id}>{id}</bdi>
                            ))}
                          </span>
                        </small>
                      </span>
                      <span className="vsd-profile-check">
                        {activeProfile === profile.id ? <Check size={18} /> : <Plus size={18} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Next Step Call to Action ── */}
        <section className="care-wrap vsd-next" aria-labelledby="vsd-next-title">
          <div className="vsd-next-inner">
            <div>
              <span className="vsd-kicker">{t('الخطوة التالية', 'YOUR NEXT STEP')}</span>
              <h2 id="vsd-next-title">{t('لنحوّل احتياجك إلى نطاق واضح.', 'Turn your needs into a clear scope.')}</h2>
              <p>{t('نراجع طريقة العمل الحالية، والأدوار والفروع، والبيانات والتكاملات المطلوبة، ثم نحدد معك خطة التنفيذ المناسبة.', 'We review your current workflow, roles, branches, data and integration needs, then define a suitable rollout plan with you.')}</p>
            </div>
            <div className="vsd-next-actions">
              <Link
                className="care-btn"
                href={selected.length ? `${home}?systems=${encodeURIComponent(selected.join(','))}#contact` : `${home}#contact`}
              >
                {t('ناقش احتياجات مركزك', 'Discuss your center’s needs')}
                <Arrow size={18} />
              </Link>
              <Link href={`${en ? '/en' : ''}/planning`}>
                {t('تعرّف على خطوات التنفيذ', 'See the rollout process')}
                <Forward size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Floating Smart Scope Builder Drawer ── */}
        {selected.length > 0 && (() => {
          const insight = getSynergyInsight(selected, locale);
          return (
            <aside className="vsd-selection" aria-label={t('نطاقك المختار', 'Your selected scope')}>
              <div className="vsd-selection-main">
                <div className="vsd-selection-chips-row">
                  <span className="vsd-selection-label">
                    <Sparkles size={14} className="vsd-sparkle" aria-hidden="true" />
                    {t('نطاقك المبدئي', 'Your initial scope')}:
                  </span>
                  <div className="vsd-selected-chips">
                    {selected.map(id => (
                      <button
                        type="button"
                        key={id}
                        onClick={() => toggle(id)}
                        aria-label={`${t('إزالة', 'Remove')} ${id}`}
                        title={txt(allowed.find(system => system.id === id)?.name || { ar: id, en: id }, locale)}
                      >
                        <bdi>{id}</bdi>
                        <X size={13} />
                      </button>
                    ))}
                  </div>
                </div>

                {insight && (
                  <div className="vsd-selection-synergy">
                    <span className="vsd-selection-hint">{insight.text}</span>
                    {insight.recommended && !selected.includes(insight.recommended) && (
                      <span className="vsd-selection-recommend">
                        {t('اقتراح مكمل:', 'Suggested addition:')}{' '}
                        <button type="button" onClick={() => toggle(insight.recommended!)}>
                          <Plus size={11} /> {insight.recommended}
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="vsd-selection-actions">
                <button
                  type="button"
                  onClick={() => {
                    setSelected([]);
                    setActiveProfile(null);
                  }}
                >
                  {t('مسح', 'Clear')}
                </button>
                <Link
                  href={`${home}?systems=${encodeURIComponent(selected.join(','))}#contact`}
                  className="care-btn"
                >
                  {t('ناقش هذا النطاق', 'Discuss this scope')} ({selected.length})
                  <Arrow size={17} />
                </Link>
              </div>
            </aside>
          );
        })()}
      </div>
    </CareFrame>
  );
}
