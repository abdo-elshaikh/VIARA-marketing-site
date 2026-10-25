'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpLeft, ArrowUpRight, Check, Layers3, Mail, MessageCircle, Phone, Plus, Quote, ScanLine, X, Images, CalendarDays, BrainCircuit, PanelsTopLeft, HardDrive } from 'lucide-react';
import { isOfferActive, txt, type Locale, type PublicReview, type SiteContent } from '../lib/site-content';
import { marketingSystemIds, marketingFacilityProfiles } from '../lib/healthcare-catalog.mjs';
import { scopeEstimateSchema, type ScopeEstimate } from '../lib/inquiry';
import { solutionPath } from '../lib/solutions';
import { systemCaptures } from '../lib/system-captures';
import { heroVisuals } from '../lib/home-hero-visuals';
import { useSiteText } from '../lib/site-copy';
import CareFrame from './care-frame';
import CareHero from './care-hero';
import LeadForm from './lead-form';
import ScopeCalculator from './scope-calculator';
import './brand-editorial.css';
import './home-redesign.css';

const iconBySystem: Record<string, typeof ScanLine> = { RIS: ScanLine, PACS: Images, CMS: CalendarDays, AI: BrainCircuit, PORTAL: PanelsTopLeft };

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
  const tabButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const products = marketingSystemIds.flatMap(id => content.products.filter(product => product.id === id && product.enabled));
  const [activeId, setActiveId] = useState(products[0]?.id || 'RIS');
  const activeProduct = products.find(product => product.id === activeId) || products[0];
  const visual = heroVisuals.find(item => item.id === activeProduct?.id);
  const activeCapture = activeProduct && visual ? (systemCaptures[activeProduct.id] || []).find(item => visual.captures.includes(item.id)) : undefined;
  const previewImage = activeCapture?.image || visual?.image;

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
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = products.length - 1;
    else if (event.key === 'ArrowRight') next = (index + (en ? 1 : -1) + products.length) % products.length;
    else if (event.key === 'ArrowLeft') next = (index + (en ? -1 : 1) + products.length) % products.length;
    else return;
    event.preventDefault();
    setActiveId(products[next].id);
    tabButtons.current[products[next].id]?.focus();
  };

  return <CareFrame content={content} locale={locale}>
    <div className="ve-page home-redesign">
      <CareHero content={content} locale={locale} onDiscuss={goToContact} />

      <section className="home-proof-band" aria-label={t('نطاق VIARA', 'VIARA scope')}>
        <div className="care-wrap home-proof-grid">
          <span>{t('حلول مخصصة للأشعة وتشغيل المراكز الطبية', 'Purpose-built for radiology and medical centers')}</span>
          <span>{t('واجهة عربية وإنجليزية', 'Arabic and English experience')}</span>
          <span>{t('نطاق يحدد بعد فهم طريقة العمل', 'Scope defined around your workflow')}</span>
        </div>
      </section>

      <section className="care-wrap home-system-showcase" id="systems" aria-labelledby="home-systems-title">
        <div className="home-section-heading">
          <div><span className="home-kicker">{t('المنتج أولاً', 'THE PRODUCT, FIRST')}</span><h2 id="home-systems-title">{t('شاهد ما يدير يوم مركزك.', 'See what runs your center.')}</h2></div>
          <p>{t('اختر النظام الذي يهم فريقك، وتعرف على وظيفته ومتطلبات تهيئته وربطه. نعرض لقطات التطبيق الفعلية حيث تتوفر، ونوضح الصور التوضيحية.', 'Choose a system and explore its role, configuration and integration needs. Actual application captures are shown where available, with conceptual images clearly labeled.')}</p>
        </div>
        <div className="home-system-tabs" role="tablist" aria-label={t('أنظمة VIARA', 'VIARA systems')}>
          {products.map((product, index) => {
            const Icon = iconBySystem[product.id] || Layers3;
            return <button key={product.id} ref={element => { tabButtons.current[product.id] = element; }} id={`home-tab-${product.id}`} type="button" role="tab" aria-selected={activeProduct?.id === product.id} aria-controls="home-system-panel" tabIndex={activeProduct?.id === product.id ? 0 : -1} onKeyDown={event => navigateTabs(event, index)} onClick={() => setActiveId(product.id)}><Icon size={18} /><bdi>{product.id}</bdi><span>{txt(product.name, locale)}</span></button>;
          })}
        </div>
        {activeProduct && <div className="home-system-panel" id="home-system-panel" role="tabpanel" aria-labelledby={`home-tab-${activeProduct.id}`} tabIndex={0}>
          <div className="home-system-copy"><span className="home-system-code"><bdi>{activeProduct.id}</bdi> / {t('حل لفريقك', 'A solution for your team')}</span><h3>{txt(activeProduct.headline, locale)}</h3><p>{txt(activeProduct.description, locale)}</p><ul>{activeProduct.features.slice(0, 3).map((feature, index) => <li key={index}><Check size={16} />{txt(feature, locale)}</li>)}</ul><div className="home-actions"><Link className="care-btn" href={solutionPath(activeProduct.id, locale)}>{t('استكشف النظام', 'Explore system')}<Arrow size={17} /></Link><button type="button" className="care-link" onClick={() => goToContact([activeProduct.id])}>{t('ناقش هذا النظام', 'Discuss this system')}<Arrow size={16} /></button></div></div>
          <figure className="home-system-image">{previewImage ? <><Link href={solutionPath(activeProduct.id, locale)}><img key={previewImage} src={previewImage} width={activeCapture?.width || 1586} height={activeCapture?.height || 992} loading="lazy" alt={txt(activeCapture?.description || visual!.alt, locale)} /></Link><figcaption>{activeCapture ? t('واجهة فعلية من النسخة المحلية؛ بيانات عرض.', 'Actual local application screen; demonstration data.') : t('تصور توضيحي مولّد بهوية VIARA، وليس واجهة فعلية.', 'AI-generated VIARA illustration, not an actual interface.')}</figcaption></> : <div className="home-image-empty"><bdi>{activeProduct.id}</bdi><span>{t('راجع تفاصيل الحل ونطاقه في صفحته.', 'Review this solution and its scope on its page.')}</span></div>}</figure>
        </div>}
      </section>

      {content.sections.about && <section className="home-company-section"><div className="care-wrap home-company-grid"><div className="home-brand-signature"><img src="/assets/viara-symbol.webp" width={130} height={130} loading="lazy" alt="" /><span>VIARA</span><small>HEALTHCARE TECHNOLOGY</small></div><div><span className="home-kicker">{t('تقنية أقرب إلى فريقك', 'TECHNOLOGY CLOSER TO YOUR TEAM')}</span><h2>{txt(content.about.title, locale)}</h2><p>{txt(content.about.body, locale)}</p><Link className="care-link" href={`${prefix}/about`}>{t('تعرف على VIARA وطريقة عملنا', 'Meet VIARA and how we work')}<Arrow size={18} /></Link></div></div></section>}

      {activeOffers.length > 0 && <section className="care-wrap home-offers" aria-labelledby="home-offers-title"><span className="home-kicker">{t('عرض متاح', 'AVAILABLE OFFER')}</span><h2 id="home-offers-title">{t('ابدأ من نطاق واضح.', 'Start with a clear scope.')}</h2><div>{activeOffers.map(offerItem => <article key={offerItem.id}><b>{txt(offerItem.title, locale)}</b><p>{txt(offerItem.description, locale)}</p><button type="button" className="care-link" onClick={() => { setOffer(txt(offerItem.title, locale)); setPlan(offerItem.plan); goToContact(); }}>{t('استخدم العرض في طلبك', 'Use this offer in your request')}<Arrow size={16} /></button></article>)}</div></section>}

      <section className="care-wrap home-planning-section" aria-labelledby="home-planning-title"><div className="home-planning-card"><div><span className="home-kicker">{t('من الاستكشاف إلى خطة', 'FROM EXPLORATION TO A PLAN')}</span><h2 id="home-planning-title">{t('قبل أن تبدأ،', 'Before you begin,')}<br /><em>{t('اجعل النطاق واضحًا.', 'make the scope clear.')}</em></h2><p>{t('الأنظمة المشمولة، متطلبات الربط، التهيئة والتدريب؛ تفاصيل نراجعها معك قبل تحديد التنفيذ.', 'Included systems, integration needs, setup and training: details to review together before defining the rollout.')}</p></div><div className="home-planning-options"><Link href={`${prefix}/planning#packages`}><Layers3 size={23} /><span><strong>{t('الباقات وخطوات التنفيذ', 'Packages & rollout steps')}</strong><small>{t('راجع ما يشمله كل نطاق وما يحتاج إلى مناقشة.', 'Review what each scope includes and what needs discussion.')}</small></span><Arrow size={18} /></Link><button id="home-archive-trigger" type="button" onClick={() => openDialog('calculator')}><HardDrive size={23} /><span><strong>{t('قدّر سعة أرشفة الصور', 'Estimate imaging archive capacity')}</strong><small>{t('حجم العمل ومدة الاحتفاظ؛ تقدير أولي قابل للمراجعة.', 'Workload and retention: a preliminary estimate to review.')}</small></span><Arrow size={18} /></button></div></div></section>

      {content.faqs.length > 0 && <section className="care-wrap home-faq" aria-labelledby="home-faq-title"><div><span className="home-kicker">{t('قبل التواصل', 'BEFORE YOU TALK')}</span><h2 id="home-faq-title">{t('أسئلة عملية، وإجابات مباشرة.', 'Practical questions. Direct answers.')}</h2><p>{t('إجابات مختصرة تساعدك على تحديد ما تريد مناقشته مع فريق VIARA.', 'Short answers to help you decide what to discuss with the VIARA team.')}</p></div><div>{content.faqs.map(faq => <details key={faq.id}><summary>{txt(faq.question, locale)}<Plus size={17} /></summary><p>{txt(faq.answer, locale)}</p></details>)}</div></section>}

      {content.sections.reviews && reviews.length > 0 && <section className="care-wrap home-reviews" aria-label={t('تجارب منشورة', 'Published experiences')}><span className="home-kicker">{t('من تجارب المستخدمين', 'USER PERSPECTIVES')}</span><div>{reviews.slice(0, 3).map(review => <blockquote key={review.id} lang={review.locale} dir={review.locale === 'ar' ? 'rtl' : 'ltr'}><Quote size={26} aria-hidden="true" /><p>{review.quote}</p><cite>{review.name}<span>{review.organization}</span></cite></blockquote>)}</div></section>}

      <section className="home-contact-section" id="contact"><div className="care-wrap home-contact-grid"><div><span className="home-kicker">{t('الخطوة التالية', 'YOUR NEXT STEP')}</span><h2 id="home-contact-title" tabIndex={-1}>{t('لنحدد ما يحتاجه مركزك.', 'Let’s define what your center needs.')}</h2><p>{t('شاركنا طبيعة العمل والأنظمة التي تهمك. نرتب عرضًا توضيحيًا ونراجع معك نطاقًا مناسبًا.', 'Tell us about your operation and the systems that matter. We will arrange a demonstration and review a suitable scope.')}</p><div className="home-contact-links">{content.contact.email && <a href={`mailto:${content.contact.email}`}><Mail size={16} />{content.contact.email}</a>}{content.contact.phone && <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`}><Phone size={16} />{content.contact.phone}</a>}{content.contact.whatsapp && <a href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />{t('واتساب', 'WhatsApp')}</a>}</div><Link href={`${prefix}/requests`} className="care-link">{t('متابعة طلب سابق', 'Track an existing request')}<Arrow size={16} /></Link></div><div className="home-form"><LeadForm locale={locale} content={content} interest={interest} setInterest={setInterest} plan={plan} setPlan={setPlan} offer={offer} setOffer={setOffer} scope={scope} setScope={setScope} requestedSystems={requestedSystems} requestedFacility={requestedFacility} clearRequestedSystems={() => { setRequestedSystems([]); setRequestedFacility(''); }} onPrivacy={() => openDialog('privacy')} onEditScope={() => openDialog('calculator')} /></div></div></section>

      <dialog ref={dialog} className="care-dialog home-dialog" onCancel={closeDialog} onClick={event => { if (event.target === event.currentTarget) closeDialog(); }} aria-labelledby="home-dialog-title"><div className="care-dialog-heading"><h2 id="home-dialog-title">{dialogName === 'calculator' ? t('تقدير سعة الأرشفة', 'Archive capacity estimate') : t('الخصوصية', 'Privacy')}</h2><button type="button" className="care-menu" onClick={closeDialog} aria-label={t('إغلاق', 'Close')}><X /></button></div>{dialogName === 'calculator' ? <ScopeCalculator locale={locale} onChoose={estimate => { closeDialog(); goToContact(['PACS'], requestedFacility, estimate); }} /> : <p>{t('نستخدم بيانات التواصل وتفاصيل المنشأة لمراجعة الطلب والرد عليه. لا ترسل معلومات المرضى أو التقارير الطبية عبر نموذج الموقع.', 'We use contact and facility details to review and respond to your request. Do not send patient information or clinical reports through this website form.')}</p>}</dialog>
    </div>
  </CareFrame>;
}
