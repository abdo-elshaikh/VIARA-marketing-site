'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, Layers3, Mail, MessageCircle, Phone, Plus, Quote, X, HardDrive, Gift, Sparkles, CalendarDays, CheckCircle2, Tag, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { isOfferActive, cairoDay, txt, type Locale, type PublicReview, type SiteContent } from '../lib/site-content';
import { marketingSystemIds, marketingFacilityProfiles } from '../lib/healthcare-catalog.mjs';
import { scopeEstimateSchema, type ScopeEstimate } from '../lib/inquiry';
import { useSiteText } from '../lib/site-copy';
import CareFrame from './care-frame';
import CareHero from './care-hero';
import HomePageNavigation from './home-page-navigation';
import HomeSystemShowcase from './home-system-showcase';
import { HomeOrientation, HomeWorkflow, HomePreparation, HomeContactSteps } from './home-overview';
import LeadForm from './lead-form';
import ScopeCalculator from './scope-calculator';
import SystemSynergyMap from './system-synergy-map';
import './brand-editorial.css';
import './home-redesign.css';
import './home-offers.css';
import './home-complete.css';
import './systems-enhanced.css';

export default function CareHome({ content, locale = 'ar', reviews = [] }: { content: SiteContent; locale?: Locale; reviews?: PublicReview[] }) {
  const en = locale === 'en';
  const prefix = en ? '/en' : '';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const [interest, setInterest] = useState('CONSULT');
  const [plan, setPlan] = useState('لم أحدد بعد');
  const [offer, setOffer] = useState('');
  const [requestedSystems, setRequestedSystems] = useState<string[]>([]);
  const [requestedFacility, setRequestedFacility] = useState('');
  const [scope, setScope] = useState<ScopeEstimate | null>(null);
  const [dialogName, setDialogName] = useState<'privacy' | 'calculator' | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState('RIS');

  const goToContact = (systems: string[] = [], facility = '', estimate: ScopeEstimate | null = null) => {
    setRequestedSystems(systems);
    setRequestedFacility(facility);
    setInterest(systems.length === 1 ? systems[0] : 'CONSULT');
    setScope(estimate);
    requestAnimationFrame(() => {
      document.getElementById('home-contact-title')?.focus({ preventScroll: true });
      document.getElementById('contact')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const query = new URLSearchParams(location.search);
      const systems = [...new Set((query.get('systems') || '').split(','))].filter(id => marketingSystemIds.includes(id) && content.products.some(product => product.id === id && product.enabled)).slice(0, 6);
      const facility = query.get('facility') || '';
      const product = query.get('interest') || '';
      if (systems.length) { setRequestedSystems(systems); setActiveId(systems[0]); }
      if (marketingFacilityProfiles.some(item => item.id === facility)) setRequestedFacility(facility);
      if (content.products.some(item => item.id === product && item.enabled)) { setInterest(product); setActiveId(product); }
      const selectedPlan = query.get('plan');
      if (content.plans.some(item => item.id === selectedPlan && item.enabled)) setPlan(selectedPlan!);
      try {
        const stored = sessionStorage.getItem('viara-planned-scope');
        if (stored) { const parsed = scopeEstimateSchema.safeParse(JSON.parse(stored)); if (parsed.success) setScope(parsed.data); sessionStorage.removeItem('viara-planned-scope'); }
      } catch { /* Browser storage is optional. */ }
      if (location.hash === '#calculator') {
        trigger.current = document.getElementById('home-archive-trigger');
        setDialogName('calculator');
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [content, locale]);

  useEffect(() => {
    if (dialogName && !dialog.current?.open) dialog.current?.showModal();
    if (!dialogName && dialog.current?.open) dialog.current.close();
  }, [dialogName]);

  const openDialog = (name: 'privacy' | 'calculator') => { trigger.current = document.activeElement as HTMLElement; setDialogName(name); };
  const closeDialog = () => { setDialogName(null); requestAnimationFrame(() => trigger.current?.focus()); };
  const activeOffers = content.sections.offers ? content.offers.filter(offerItem => isOfferActive(offerItem)) : [];
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);

  const safeOfferIndex = activeOffers.length > 0 ? (activeOfferIndex % activeOffers.length) : 0;
  const currentOffer = activeOffers[safeOfferIndex];

  return <CareFrame content={content} locale={locale}>
    <div className="ve-page home-redesign home-complete">
      <CareHero content={content} locale={locale} onDiscuss={goToContact} />

      <section className="home-proof-band" aria-label={t('نطاق VIARA', 'VIARA scope')}>
        <div className="care-wrap home-proof-grid">
          <span>{t('حلول مخصصة للأشعة وتشغيل المراكز الطبية', 'Purpose-built for radiology and medical centers')}</span>
          <span>{t('واجهة عربية وإنجليزية', 'Arabic and English experience')}</span>
          <span>{t('نطاق يحدد بعد فهم طريقة العمل', 'Scope defined around your workflow')}</span>
        </div>
      </section>

      <HomePageNavigation content={content} locale={locale} />
      <HomeOrientation content={content} locale={locale} onSelect={setActiveId} onDiscuss={goToContact} />
      <SystemSynergyMap locale={locale} activeId={activeId} onSelectSystem={setActiveId} />
      <HomeSystemShowcase content={content} locale={locale} activeId={activeId} onSelect={setActiveId} onDiscuss={goToContact} />
      <HomeWorkflow content={content} locale={locale} />

      {content.sections.about && <section className="home-company-section"><div className="care-wrap home-company-grid"><div className="home-brand-signature"><img src={content.brand.logo} width={130} height={130} loading="lazy" alt="" /><span>{content.brand.name}</span><small>HEALTHCARE TECHNOLOGY</small></div><div><span className="home-kicker">{t('تقنية أقرب إلى فريقك', 'TECHNOLOGY CLOSER TO YOUR TEAM')}</span><h2>{txt(content.about.title, locale)}</h2><p>{txt(content.about.body, locale)}</p><Link className="care-link" href={`${prefix}/about`}>{t('تعرف على VIARA وطريقة عملنا', 'Meet VIARA and how we work')}<Arrow size={18} /></Link></div></div></section>}

      {activeOffers.length > 0 && currentOffer && (
        <section className="home-offers-section" id="offers" aria-labelledby="home-offers-title">
          <div className="care-wrap">
            <header className="home-offers-compact-header">
              <div className="home-offers-header-info">
                <span className="home-offers-kicker">
                  <ShieldCheck size={13} />
                  {t('شراكات ومبادرات التدشين', 'LAUNCH & CLINICAL PARTNERSHIPS')}
                </span>
                <h2 id="home-offers-title" className="home-offers-compact-title">
                  {t('مبادرات التدشين ', 'Launch Initiatives ')}
                  <span className="home-offers-title-accent">{t('والتأهيل السريري للمراكز', '& Clinical Facility Programs')}</span>
                </h2>
              </div>

              {activeOffers.length > 1 && (
                <div className="home-offers-tabs" role="group" aria-label={t('قائمة المبادرات', 'Initiatives list')}>
                  {activeOffers.map((offerItem, index) => {
                    const fullText = `${txt(offerItem.badge, locale)} ${txt(offerItem.title, locale)}`;
                    const disc = fullText.match(/(\d{1,2}%)/)?.[1] || '';
                    const isActive = index === safeOfferIndex;

                    return (
                      <button
                        key={offerItem.id}
                        type="button"
                        aria-pressed={isActive}
                        className={`home-offers-tab-btn ${isActive ? 'is-active' : ''}`}
                        onClick={() => {
                          setActiveOfferIndex(index);
                        }}
                      >
                        {disc && <span className="home-offers-tab-badge">{disc}</span>}
                        <span>{txt(offerItem.title, locale).slice(0, 22)}…</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </header>

            {(() => {
              const offerImg = currentOffer.image || '/assets/systems/viara-ris-pro.jpg';
              const badgeText = currentOffer.badge ? txt(currentOffer.badge, locale) : (locale === 'ar' ? 'مبادرة خاصة' : 'Clinical Initiative');
              const planLabel = currentOffer.plan ? `${t('باقة', 'Plan')}: ${currentOffer.plan}` : null;
              const expiryDate = currentOffer.endDate;
              const expiresFormatted = expiryDate ? (() => {
                try {
                  return new Date(expiryDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                } catch {
                  return expiryDate;
                }
              })() : null;

              const fullText = `${txt(currentOffer.badge, locale)} ${txt(currentOffer.title, locale)}`;
              const discountMatch = fullText.match(/(\d{1,2}%)/);
              const discount = discountMatch ? discountMatch[1] : null;

              const nextOffer = () => {
                setActiveOfferIndex((prev) => (prev + 1) % activeOffers.length);
              };

              const prevOffer = () => {
                setActiveOfferIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
              };

              return (
                <article
                  className="home-offers-compact-card"
                >
                  <div className="compact-offer-media">
                    <img
                      key={currentOffer.id}
                      src={offerImg}
                      alt={txt(currentOffer.title, locale)}
                      className="compact-offer-img"
                      loading="lazy"
                    />
                    <div className="compact-offer-overlay" />

                    {discount && (
                      <span className="compact-offer-discount">
                        <Sparkles size={12} />
                        <span>{t('ميزة تشغيلية: ', 'Program Benefit: ')}{discount}</span>
                      </span>
                    )}

                    {expiresFormatted && (
                      <div className="compact-offer-expiry">
                        <CalendarDays size={13} />
                        <span>
                          {`${t('متاح للتأهيل حتى: ', 'Available for qualification until: ')}${expiresFormatted}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="compact-offer-content" key={`content-${currentOffer.id}`}>
                    <div className="compact-offer-top">
                      <div className="compact-offer-meta-group">
                        <span className="compact-offer-badge-pill">
                          <ShieldCheck size={11} />
                          {badgeText}
                        </span>
                        <span className="compact-offer-clinical-pill">
                          <CheckCircle2 size={11} />
                          {t('برنامج اعتماد سريري', 'Clinical Program')}
                        </span>
                        {planLabel && (
                          <span className="compact-offer-plan-pill">
                            {planLabel}
                          </span>
                        )}
                      </div>
                      <span className="compact-offer-counter">
                        {String(safeOfferIndex + 1).padStart(2, '0')} / {String(activeOffers.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="compact-offer-title">{txt(currentOffer.title, locale)}</h3>
                    <p className="compact-offer-desc">{txt(currentOffer.description, locale)}</p>

                    <div className="compact-offer-perks">
                      {content.plans.find(item => item.id === currentOffer.plan && item.enabled)?.features.slice(0, 3).map((feature, index) => <span className="compact-offer-perk-chip" key={index}><CheckCircle2 size={12} />{txt(feature, locale)}</span>)}
                    </div>

                    <div className="compact-offer-actions">
                      <button
                        type="button"
                        className="compact-offer-cta-btn"
                        onClick={() => {
                          setOffer(txt(currentOffer.title, locale));
                          setPlan(currentOffer.plan);
                          goToContact();
                        }}
                      >
                        <Gift size={16} />
                        <span>{t('أضف العرض إلى استفسارك', 'Include this offer in your inquiry')}</span>
                        <Arrow size={16} />
                      </button>

                      {activeOffers.length > 1 && (
                        <div className="compact-offer-nav-btns" aria-label={t('التنقل بين العروض', 'Navigate offers')}>
                          <button
                            type="button"
                            className="compact-offer-arrow-btn"
                            onClick={prevOffer}
                            aria-label={t('العرض السابق', 'Previous offer')}
                          >
                            {en ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                          </button>
                          <button
                            type="button"
                            className="compact-offer-arrow-btn"
                            onClick={nextOffer}
                            aria-label={t('العرض التالي', 'Next offer')}
                          >
                            {en ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </article>
              );
            })()}
          </div>
        </section>
      )}

      <section className="care-wrap home-planning-section" aria-labelledby="home-planning-title"><div className="home-planning-card"><div><span className="home-kicker">{t('من الاستكشاف إلى خطة', 'FROM EXPLORATION TO A PLAN')}</span><h2 id="home-planning-title">{t('قبل أن تبدأ،', 'Before you begin,')}<br /><em>{t('اجعل النطاق واضحًا.', 'make the scope clear.')}</em></h2><p>{t('الأنظمة المشمولة، متطلبات الربط، التهيئة والتدريب؛ تفاصيل نراجعها معك قبل تحديد التنفيذ.', 'Included systems, integration needs, setup and training: details to review together before defining the rollout.')}</p></div><div className="home-planning-options"><Link href={`${prefix}/planning#packages`}><Layers3 size={23} /><span><strong>{t('الباقات وخطوات التنفيذ', 'Packages & rollout steps')}</strong><small>{t('راجع ما يشمله كل نطاق وما يحتاج إلى مناقشة.', 'Review what each scope includes and what needs discussion.')}</small></span><Arrow size={18} /></Link><button id="home-archive-trigger" type="button" onClick={() => openDialog('calculator')}><HardDrive size={23} /><span><strong>{t('قدّر سعة أرشفة الصور', 'Estimate imaging archive capacity')}</strong><small>{t('حجم العمل ومدة الاحتفاظ؛ تقدير أولي قابل للمراجعة.', 'Workload and retention: a preliminary estimate to review.')}</small></span><Arrow size={18} /></button></div></div><HomePreparation content={content} locale={locale} /></section>

      {content.faqs.length > 0 && <section className="care-wrap home-faq" aria-labelledby="home-faq-title"><div><span className="home-kicker">{t('قبل التواصل', 'BEFORE YOU TALK')}</span><h2 id="home-faq-title">{t('أسئلة عملية، وإجابات مباشرة.', 'Practical questions. Direct answers.')}</h2><p>{t('إجابات مختصرة تساعدك على تحديد ما تريد مناقشته مع فريق VIARA.', 'Short answers to help you decide what to discuss with the VIARA team.')}</p></div><div>{content.faqs.map(faq => <details key={faq.id}><summary>{txt(faq.question, locale)}<Plus size={17} /></summary><p>{txt(faq.answer, locale)}</p></details>)}</div></section>}

      {content.sections.reviews && reviews.length > 0 && <section className="care-wrap home-reviews" aria-label={t('تجارب منشورة', 'Published experiences')}><span className="home-kicker">{t('من تجارب المستخدمين', 'USER PERSPECTIVES')}</span><div>{reviews.slice(0, 3).map(review => <blockquote key={review.id} lang={review.locale} dir={review.locale === 'ar' ? 'rtl' : 'ltr'}><Quote size={26} aria-hidden="true" /><p>{review.quote}</p><cite>{review.name}<span>{review.organization}</span></cite></blockquote>)}</div></section>}

      <section className="home-contact-section" id="contact"><div className="care-wrap home-contact-grid"><div><span className="home-kicker">{t('الخطوة التالية', 'YOUR NEXT STEP')}</span><h2 id="home-contact-title" tabIndex={-1}>{t('لنحدد ما يحتاجه مركزك.', 'Let’s define what your center needs.')}</h2><p>{t('شاركنا طبيعة العمل والأنظمة التي تهمك. نرتب جلسة تحليل وعرضًا توضيحيًا، ثم نراجع معك نطاقًا مناسبًا قبل التنفيذ.', 'Tell us about your operation and the systems that matter. We will arrange a workflow review and demonstration, then review a suitable scope before rollout.')}</p><HomeContactSteps content={content} locale={locale} /><div className="home-contact-reassurance"><ShieldCheck size={18} aria-hidden="true" /><span>{t('لا ترسل بيانات المرضى أو التقارير الطبية عبر النموذج. يكفي وصف عام لطريقة العمل.', 'Do not send patient data or clinical reports through the form. A general description of your workflow is enough.')}</span></div><div className="home-contact-links">{content.contact.email && <a href={`mailto:${content.contact.email}`}><Mail size={16} />{content.contact.email}</a>}{content.contact.phone && <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`}><Phone size={16} />{content.contact.phone}</a>}{content.contact.whatsapp && <a href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />{t('واتساب', 'WhatsApp')}</a>}</div><Link href={`${prefix}/requests`} className="care-link">{t('متابعة طلب سابق', 'Track an existing request')}<Arrow size={16} /></Link></div><div className="home-form"><LeadForm locale={locale} content={content} interest={interest} setInterest={setInterest} plan={plan} setPlan={setPlan} offer={offer} setOffer={setOffer} scope={scope} setScope={setScope} requestedSystems={requestedSystems} requestedFacility={requestedFacility} clearRequestedSystems={() => { setRequestedSystems([]); setRequestedFacility(''); }} onPrivacy={() => openDialog('privacy')} onEditScope={() => openDialog('calculator')} /></div></div></section>

      <dialog ref={dialog} className="care-dialog home-dialog" onCancel={closeDialog} onClick={event => { if (event.target === event.currentTarget) closeDialog(); }} aria-labelledby="home-dialog-title"><div className="care-dialog-heading"><h2 id="home-dialog-title">{dialogName === 'calculator' ? t('تقدير سعة الأرشفة', 'Archive capacity estimate') : t('الخصوصية', 'Privacy')}</h2><button type="button" className="care-menu" onClick={closeDialog} aria-label={t('إغلاق', 'Close')}><X /></button></div>{dialogName === 'calculator' ? <ScopeCalculator locale={locale} onChoose={estimate => { closeDialog(); goToContact(['PACS'], requestedFacility, estimate); }} /> : <p>{t('نستخدم بيانات التواصل وتفاصيل المنشأة لمراجعة الطلب والرد عليه. لا ترسل معلومات المرضى أو التقارير الطبية عبر نموذج الموقع.', 'We use contact and facility details to review and respond to your request. Do not send patient information or clinical reports through this website form.')}</p>}</dialog>
    </div>
  </CareFrame>;
}
