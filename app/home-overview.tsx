'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, ScanLine, Building2, Check, ArrowLeft, ArrowRight, Workflow, ChevronDown } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';
import { startingGoals, startingSystems } from '../lib/home-starting-scope';
import './home-decision.css';

export function HomeOrientation({ content, locale, onSelect, onDiscuss }: { content: SiteContent; locale: Locale; onSelect: (id: string) => void; onDiscuss: (systems: string[], facility: string) => void }) {
  const t = useSiteText(locale, content);
  const Arrow = locale === 'ar' ? ArrowUpLeft : ArrowUpRight;
  const [facility, setFacility] = useState('radiology');
  const [goal, setGoal] = useState('operations');
  const selectedSystems = startingSystems(content.products, facility, goal);
  const goals: Record<string, string> = { operations: t('تنظيم التشغيل', 'Daily operations'), imaging: t('أرشفة الصور', 'Image archiving'), access: t('الوصول للنتائج', 'Results access'), assistance: t('مساندة الذكاء الاصطناعي', 'AI assistance'), connected: t('مسار مترابط', 'A connected workflow') };
  const chooseFacility = (id: string) => {
    setFacility(id);
    setGoal('operations');
    requestAnimationFrame(() => {
      const result = document.getElementById('home-scope-finder');
      result?.focus({ preventScroll: true });
      result?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  };
  const audiences = [
    { id: 'radiology', icon: ScanLine, name: t('لمراكز الأشعة', 'For radiology centers'), title: t('من الموعد إلى الصورة والتقرير.', 'From appointment to image and report.'), body: t('ابدأ بتنظيم قوائم الفحوصات والتقارير، ثم راجع احتياجات أرشفة الدراسات والبوابات والمساندة بالذكاء الاصطناعي.', 'Start with examination worklists and reporting, then review study archiving, portals and AI assistance.'), systems: ['RIS', 'PACS', 'AI', 'PORTAL'] },
    { id: 'medical', icon: Building2, name: t('للمراكز الطبية والعيادات', 'For medical centers & clinics'), title: t('تشغيل يومي يجمع فريقك.', 'Daily operations that connect your team.'), body: t('استكشف تنظيم المواعيد والزيارات والتحصيل، والوصول الرقمي للمراجعين والأطباء، وفق نطاق عمل مركزك.', 'Explore appointments, visits, collections and digital access for patients and physicians within your center’s scope.'), systems: ['CMS', 'PORTAL'] },
  ];
  return <section className="home-orientation care-wrap" id="choose-your-path" aria-labelledby="home-orientation-title">
    <div className="home-section-heading"><div><span className="home-kicker">{t('ابدأ من طبيعة عملك', 'START WITH YOUR WORKFLOW')}</span><h2 id="home-orientation-title">{t('الحل المناسب يبدأ', 'The right solution starts')}<br /><em>{t('من احتياج مركزك.', 'with your center’s needs.')}</em></h2></div><p>{t('لا تحتاج إلى كل شيء دفعة واحدة. اختر نقطة البداية، ثم حدّد الأنظمة والربط الذي يخدم فريقك.', 'You don’t need everything at once. Choose a starting point, then define the systems and connections your team needs.')}</p></div>
    <div className="home-audience-grid" role="group" aria-label={t('نوع المنشأة', 'Facility type')}>{audiences.map(audience => {
      const products = audience.systems.flatMap(id => content.products.filter(product => product.id === id && product.enabled));
      const Icon = audience.icon;
      return <article key={audience.id} className={facility === audience.id ? 'is-chosen' : ''}><div className="home-audience-top"><span className="home-audience-icon"><Icon size={25} strokeWidth={1.5} /></span><span>{audience.name}</span><bdi>{audience.id === 'radiology' ? '01' : '02'}</bdi></div><h3>{audience.title}</h3><p>{audience.body}</p><div className="home-audience-systems">{products.map(product => <span key={product.id}><Check size={12} /><bdi>{product.id}</bdi></span>)}</div><button type="button" className="home-audience-choose" aria-label={audience.name} aria-controls="home-scope-result" aria-pressed={facility === audience.id} onClick={() => chooseFacility(audience.id)}><span>{facility === audience.id ? t('نوع المنشأة المحدد', 'Selected facility type') : t('اختر هذا المسار', 'Choose this path')}</span>{facility === audience.id ? <Check size={17} /> : <Arrow size={17} />}</button></article>;
    })}</div>
    <div className="home-scope-finder" id="home-scope-finder" tabIndex={-1} role="region" aria-label={t('تحديد أولوية العمل ونطاق البداية', 'Choose your workflow priority and starting scope')}>
      <div className="home-scope-questions"><span className="home-kicker">{t('وما أولويتك الآن؟', 'WHAT IS YOUR PRIORITY?')}</span><p>{t('اختر ما تريد البدء به؛ سنقترح أنظمة لمناقشتها مع فريقك.', 'Choose a starting point to see systems you can discuss with your team.')}</p><div role="group" aria-label={t('أولوية العمل', 'Workflow priority')}>{startingGoals(facility).map(id => <button key={id} type="button" aria-controls="home-scope-result" aria-pressed={goal === id} onClick={() => setGoal(id)}>{goal === id && <Check size={14} />}{goals[id]}</button>)}</div></div>
      <div className="home-scope-result" id="home-scope-result" tabIndex={-1}><div aria-live="polite" aria-atomic="true"><small>{t('نقطة بداية للمناقشة', 'A STARTING POINT TO DISCUSS')}</small><h3>{goals[goal]}</h3><ul>{selectedSystems.map(id => { const product = content.products.find(item => item.id === id)!; return <li key={id}><bdi>{id}</bdi><span>{txt(product.name, locale)}</span></li>; })}</ul>{selectedSystems.length === 0 && <p>{t('لا يوجد نظام مفعّل لهذا الاختيار حاليًا. تواصل معنا لمراجعة الاحتياج.', 'No system is currently enabled for this selection. Contact us to review your needs.')}</p>}</div><p className="home-scope-note">{t('اختيار مبدئي؛ الإتاحة والتكاملات والسعر تُحدد بعد مراجعة المتطلبات.', 'A preliminary selection; availability, integrations and pricing follow requirements review.')}</p><div className="home-scope-actions"><button type="button" onClick={() => onDiscuss(selectedSystems, facility)}>{t('ناقش هذا النطاق معنا', 'Discuss this scope')}<Arrow size={16} /></button>{selectedSystems[0] && <a href="#systems" onClick={() => onSelect(selectedSystems[0])}>{t('استعرض النظام أولًا', 'Explore the system first')}</a>}</div></div>
    </div>
  </section>;
}

export function HomeWorkflow({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = useSiteText(locale, content);
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  return <section className="home-workflow" id="home-workflow" aria-labelledby="home-workflow-title"><div className="care-wrap">
    <div className="home-section-heading"><div><span className="home-kicker"><Workflow size={15} />{t('الصورة الكاملة لسير العمل', 'THE COMPLETE WORKFLOW')}</span><h2 id="home-workflow-title">{t('خطوات مترابطة.', 'Connected steps.')}<br /><em>{t('ومسؤوليات أوضح.', 'Clearer responsibilities.')}</em></h2></div><p>{t('راجع الرحلة كاملة قبل اختيار الوحدات: أين تبدأ البيانات، ومن يراجعها، وكيف تصل النتيجة للمراجع.', 'Review the whole journey before choosing modules: where information starts, who reviews it, and how results reach the patient.')}</p></div>
    <ol className="home-workflow-steps">{content.journeys.map((stage, index) => <li key={index}><div><span>{String(index + 1).padStart(2, '0')}</span><Arrow size={18} aria-hidden="true" /></div><h3>{txt(stage.title, locale)}</h3><p>{txt(stage.description, locale)}</p></li>)}</ol>
    <div className="home-workflow-bottom"><span>{t('نراجع معك الأدوار والربط ونقاط التسليم قبل تحديد التنفيذ.', 'We review roles, integrations and handoffs before defining the rollout.')}</span><Link href={`${locale === 'en' ? '/en' : ''}/journeys`}>{t('تعرّف على رحلة العمل', 'Explore the workflow')}<Arrow size={17} /></Link></div>
  </div></section>;
}

export function HomePreparation({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = useSiteText(locale, content);
  const items = [
    { title: t('بيئة التشغيل الحالية', 'Your current environment'), body: t('أنواع الأجهزة، النظام الحالي، طريقة تصدير البيانات، وحجم الأرشيف. تساعد هذه التفاصيل على دراسة التوافق وخيارات النقل.', 'Device types, current software, data export options and archive size help assess compatibility and migration options.') },
    { title: t('النطاق والأدوار', 'Scope & responsibilities'), body: t('الفروع والمستخدمون والوحدات المطلوبة، ومن يطّلع على البيانات أو يعتمد التقارير. نراجع حدود كل دور ونقاط الربط.', 'Branches, users and required modules, including who can access information or approve reports. We review roles and integration points.') },
    { title: t('التهيئة وبداية الفريق', 'Setup & team readiness'), body: t('جهة التواصل الفنية، خطوات اختبار البيئة، واحتياجات التدريب. تُحدد خطة البدء والدعم ضمن النطاق المتفق عليه.', 'A technical contact, environment testing steps and training needs. Rollout and support are defined within the agreed scope.') },
  ];
  return <div className="home-preparation"><div><h3>{t('ما الذي سنراجعه معك؟', 'What will we review together?')}</h3><p>{t('ثلاثة محاور تساعد على تجهيز مناقشة عملية بدل عرض عام.', 'Three topics to prepare a practical discussion, rather than a generic presentation.')}</p></div><div className="home-preparation-grid">{items.map((item, index) => <details key={index}><summary><bdi>{'0' + (index + 1)}</bdi><span>{item.title}</span><ChevronDown size={17} /></summary><p>{item.body}</p></details>)}</div></div>;
}

export function HomeContactSteps({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = useSiteText(locale, content);
  return <ol className="home-contact-steps" aria-label={t('ماذا يحدث بعد الطلب؟', 'What happens after your request?')}>{[
    t('تشاركنا تفاصيل منشأتك وأولوياتك.', 'Share your facility details and priorities.'),
    t('نراجع الأنظمة والربط المطلوب.', 'We review the systems and integrations needed.'),
    t('نتواصل لترتيب جلسة وعرض يناسبان النطاق.', 'We contact you to arrange a workflow review and demonstration around that scope.'),
  ].map((text, index) => <li key={index}><span>{'0' + (index + 1)}</span><p>{text}</p></li>)}</ol>;
}
