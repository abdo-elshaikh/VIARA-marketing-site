'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, Check, Plus, ScanLine, Layers3, Building2, Monitor, Workflow, Route, Users, SlidersHorizontal, Sparkles } from 'lucide-react';
import { txt, type Locale, type PublicReview, type SiteContent } from '../lib/site-content';
import { solutionPath, type SolutionData } from '../lib/solutions';
import { systemStory } from '../lib/system-stories';
import { systemGuides } from '../lib/system-guides';
import { systemCaptures } from '../lib/system-captures';
import { useSiteText } from '../lib/site-copy';
import CareFrame from './care-frame';
import CustomerReviews from './customer-reviews';
import ReviewForm from './review-form';
import SystemLiveGallery from './system-live-gallery';
import './system-detail-redesign.css';
import './systems-usability.css';
import './system-decision.css';

type Props = { content: SiteContent; product: SolutionData; locale: Locale; reviews: PublicReview[]; related: { id: string; name: SolutionData['name'] }[] };
export default function SystemExperience({ content, product, locale, reviews, related }: Props) {
  const en = locale === 'en', home = en ? '/en' : '/', prefix = en ? '/en' : '';
  const t = useSiteText(locale, content), Arrow = en ? ArrowUpRight : ArrowUpLeft, Forward = en ? ArrowRight : ArrowLeft;
  const story = systemStory(product.id), hasCaptures = Boolean(systemCaptures[product.id]?.length);
  const icons: Record<string, typeof ScanLine> = { RIS: ScanLine, PACS: Layers3, AI: Sparkles, CMS: Building2, PORTAL: Users }, Icon = icons[product.id] || Monitor;
  const [activeSection, setActiveSection] = useState(hasCaptures ? 'live-system-preview' : 'capabilities');
  const navigation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ids = [hasCaptures ? 'live-system-preview' : '', 'capabilities', 'workflow', related.length ? 'related' : ''].filter(Boolean);
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const boundary = (navigation.current?.getBoundingClientRect().bottom || 180) + 64;
        const current = [...ids].reverse().find(id => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= boundary);
        setActiveSection(current || ids[0]);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [product.id, hasCaptures, related.length]);
  const guide = systemGuides[product.id];
  const inquiry = `${home}?systems=${encodeURIComponent(product.id)}#contact`;
  return <CareFrame content={content} locale={locale} current="systems" alternatePath={solutionPath(product.id, en ? 'ar' : 'en')}>
    <div className="vsp-detail" data-system={product.id}>
      <section className="product-intro" aria-labelledby="product-title"><div className="care-wrap">
        <nav className="product-breadcrumbs" aria-label={t('مسار الصفحة', 'Breadcrumbs')}><Link href={home}>{t('الرئيسية', 'Home')}</Link><span aria-hidden="true">/</span><Link href={`${prefix}/systems`}>{t('الأنظمة', 'Systems')}</Link><span aria-hidden="true">/</span><span aria-current="page">{txt(product.name, locale)}</span></nav>
        <span className="vp-kicker"><bdi>{content.brand.name} / {product.id}</bdi></span>
        <h1 id="product-title">{txt(product.headline, locale)}</h1><p>{txt(product.description, locale)}</p>
        <div className="product-intro-actions"><Link className="care-btn" href={inquiry}>{t('اطلب عرض هذا النظام', 'Book this system’s demo')}<Arrow size={18} /></Link><a className="care-link" href={hasCaptures ? '#live-system-preview' : '#capabilities'}>{hasCaptures ? <Monitor size={17} /> : <SlidersHorizontal size={17} />}{hasCaptures ? t('شاهد الواجهات', 'See the interfaces') : t('استكشف القدرات', 'Explore capabilities')}</a></div>
      </div></section>
      <div className="care-wrap vsp-overview" ref={navigation}><div className="vsp-overview-identity"><span><Icon size={24} strokeWidth={1.5} /></span><div><bdi>{product.id}</bdi><strong>{txt(product.name, locale)}</strong></div></div><nav aria-label={t('في هذه الصفحة', 'On this page')}>{hasCaptures && <a href="#live-system-preview" aria-current={activeSection === 'live-system-preview' ? 'location' : undefined}><Monitor size={16} />{t('الواجهات', 'Interfaces')}</a>}<a href="#capabilities" aria-current={activeSection === 'capabilities' ? 'location' : undefined}><SlidersHorizontal size={16} />{t('القدرات', 'Capabilities')}</a><a href="#workflow" aria-current={activeSection === 'workflow' ? 'location' : undefined}><Workflow size={16} />{t('سير العمل', 'Workflow')}</a>{related.length > 0 && <a href="#related" aria-current={activeSection === 'related' ? 'location' : undefined}><Layers3 size={16} />{t('أنظمة أخرى', 'Other systems')}</a>}</nav><Link className="vsp-nav-demo" href={inquiry}>{t('اطلب عرضاً', 'Book a demo')}<Arrow size={16} /></Link></div>
      <div className="care-wrap vsp-content">
        {guide && <aside className="product-context" aria-label={t('الفريق والنطاق', 'Team and scope')}><div><span>{t('مناسب لـ', 'BUILT FOR')}</span><p>{txt(guide.team, locale)}</p></div><div><span>{t('ما نراجعه في العرض', 'YOUR DEMONSTRATION')}</span><p>{txt(guide.discussion, locale)}</p></div></aside>}
        <SystemLiveGallery key={product.id} currentSystemId={product.id} locale={locale} />
        <section className="vsp-capabilities" id="capabilities" aria-labelledby="vsp-cap-title"><div className="vsp-section-heading"><div><span className="vsp-eyebrow">{t('قدرات النظام', 'SYSTEM CAPABILITIES')}</span><h2 id="vsp-cap-title">{t('أدوات أقرب إلى', 'Tools shaped around')}<br /><em>{t('طريقة عمل فريقك.', 'your team’s working day.')}</em></h2></div><p>{t('نبدأ بالقدرات التي يحتاجها مركزك، ونراجع مع فريقك تفاصيل الصلاحيات والاستضافة وتوافق الأجهزة ونقاط الربط ضمن العرض الفني.', 'Start with the capabilities your center needs. Access, hosting, device compatibility and integration requirements are reviewed with your team in the technical proposal.')}</p></div>
          <ul className="product-feature-list">{product.features.map((feature, i) => <li key={i}><Check size={18} /><span>{txt(feature, locale)}</span></li>)}</ul>
          {txt(product.note, locale) && <div className="vsp-note"><SlidersHorizontal size={18} /><p>{txt(product.note, locale)}</p></div>}
        </section>
      </div>
      <section className="care-wrap product-workflow" id="workflow" aria-labelledby="product-workflow-title">
        <details><summary><span><small>{t('سير العمل', 'WORKFLOW')}</small><strong id="product-workflow-title">{txt(story.signature, locale)}</strong></span><Plus size={20} /></summary><ol>{story.steps.map((step, i) => <li key={i}><bdi>{String(i + 1).padStart(2, '0')}</bdi><div><h3>{txt(step.title, locale)}</h3><p>{txt(step.description, locale)}</p></div></li>)}</ol><Link className="care-link" href={`${prefix}/journeys`}>{t('استكشف ترابط الفرق والأنظمة', 'Explore how teams and systems connect')}<Forward size={17} /></Link></details>
      </section>
      <div className="care-wrap">
        <div className="product-rollout"><Route size={23} /><p>{t('تُحدد الصلاحيات والاستضافة وتوافق الأجهزة ونقل البيانات في العرض الفني الخاص بمركزك.', 'Access, hosting, device compatibility and data migration are defined in your center’s technical proposal.')}</p><Link className="care-link" href={`${prefix}/planning`}>{t('التنفيذ والباقات', 'Rollout & packages')}<Forward size={17} /></Link></div>
        {related.length > 0 && <section className="vsp-related" id="related" aria-labelledby="vsp-related-title"><div className="vsp-section-heading"><div><span className="vsp-eyebrow">{t('ضمن نطاق VIARA الحالي', 'WITHIN THE CURRENT VIARA SCOPE')}</span><h2 id="vsp-related-title">{t('استكشف بقية الأنظمة.', 'Explore the other systems.')}</h2></div><Link href={`${prefix}/systems`}>{t('دليل الأنظمة', 'All systems')}<Forward size={17} /></Link></div><div className="vsp-related-grid">{related.map(item => { const RelatedIcon = icons[item.id] || Monitor; return <Link key={item.id} href={solutionPath(item.id, locale)} data-system={item.id}><span className="vsp-related-icon"><RelatedIcon size={27} strokeWidth={1.5} /></span><div><bdi>{item.id}</bdi><h3>{txt(item.name, locale)}</h3><small>{t('تعرّف على القدرات والواجهات', 'Explore capabilities and interfaces')}</small></div><Arrow size={21} /></Link>; })}</div></section>}
        <section className="vsp-cta" aria-labelledby="vsp-cta-title"><div><span className="vsp-eyebrow">{t('الخطوة التالية لمركزك', 'YOUR CENTER’S NEXT STEP')}</span><h2 id="vsp-cta-title">{t('لنرَ كيف يناسب', 'See how')} <bdi>{product.id}</bdi> {t('فريقك.', 'fits your team.')}</h2><p>{t('شاركنا طريقة العمل واحتياجات المركز، لنرتّب عرضاً توضيحياً ونراجع النطاق المناسب معك.', 'Tell us about your workflows and center needs to arrange a demonstration and review a suitable scope together.')}</p></div><Link className="care-btn" href={inquiry}>{t('رتّب عرضاً توضيحياً', 'Arrange a demonstration')}<Arrow size={18} /></Link></section>
      </div>
      {content.sections.reviews && <><CustomerReviews reviews={reviews} locale={locale} /><section className="care-wrap vsp-review-form"><details><summary>{t('تستخدم هذا النظام؟ شارك تجربتك', 'Use this system? Share your experience')}<Plus size={18} /></summary><ReviewForm locale={locale} systemId={product.id} /></details></section></>}
    </div>
  </CareFrame>;
}
