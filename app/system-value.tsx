'use client';
import { useState } from 'react';
import { Users, Compass, Network, Check, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { txt, type Locale } from '../lib/site-content';
import { systemStory } from '../lib/system-stories';

export default function SystemValue({ id, locale, contact }: { id: string; locale: Locale; contact: string }) {
  const en = locale === 'en', t = (ar: string, english: string) => en ? english : ar, story = systemStory(id), Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const [selected, setSelected] = useState(0);
  const roles = [
    { icon: Users, title: t('لفريق العمل', 'For your team'), heading: t('خطوة يعرف الفريق ما بعدها.', 'A team that knows the next step.'), copy: t('نراجع كيف يبدأ العمل، ومن يتسلمه، وما يحتاجه كل دور. الهدف أن يكون سير العمل مفهوماً للفريق في تفاصيل يومه.', 'We review how work starts, who takes ownership and what each role needs, so the workflow makes sense in everyday practice.'), tag: t('الوضوح في العمل اليومي', 'CLARITY IN DAILY WORK'), steps: [0, 1] },
    { icon: Compass, title: t('لإدارة المنشأة', 'For facility leaders'), heading: t('تفاصيل تساعدك على رؤية الصورة.', 'Details that help you see the picture.'), copy: t('نحدد معك نقاط المتابعة ومخرجات كل مرحلة، والتقارير التي تحتاجها الإدارة، قبل اعتماد نطاق التنفيذ.', 'Together we define checkpoints, stage outcomes and the reports management needs before agreeing the rollout scope.'), tag: t('متابعة أقرب للاحتياج', 'OVERSIGHT THAT FITS'), steps: [2, 3] },
    { icon: Network, title: t('لتقنية المعلومات', 'For IT teams'), heading: t('نطاق واضح، قبل بدء الربط.', 'A clear scope, before integration.'), copy: t('نراجع الأنظمة الحالية وصيغ البيانات والصلاحيات والاستضافة. ونحدد اختبارات الربط ونقل البيانات ضمن العرض الفني.', 'We review existing systems, data formats, access and hosting, then define integration and migration tests in the technical proposal.'), tag: t('قرارات تقنية مدروسة', 'CONSIDERED TECHNICAL DECISIONS'), steps: [0, 3] },
  ];
  const current = roles[selected], Icon = current.icon;
  return <section className="care-wrap sv-section sx-reveal" aria-labelledby="sv-title"><div className="sv-heading"><span className="sx-eyebrow">{t('القيمة من زاويتك', 'VALUE, FROM YOUR PERSPECTIVE')}</span><h2 id="sv-title">{t('نظام واحد.', 'One system.')}<br /><span>{t('وأكثر من منظور.', 'More than one perspective.')}</span></h2><p>{t('اختر فريقك، واكتشف ما نركز عليه عند تصميم نطاق الحل.', 'Choose your team to explore what we focus on when shaping the solution.')}</p><div className="sv-roles" aria-label={t('اختر منظور الفريق', 'Choose a team perspective')}>{roles.map((role, i) => <button type="button" key={role.title} aria-pressed={selected === i} onClick={() => setSelected(i)}><role.icon size={19} /><span>{role.title}</span></button>)}</div></div><div className="sv-panel" aria-live="polite"><div key={selected} className="sv-panel-content"><div className="sv-panel-top"><span><Icon size={26} /></span><bdi>0{selected + 1} / {id}</bdi></div><span className="sx-eyebrow">{current.tag}</span><h3>{current.heading}</h3><p>{current.copy}</p><div className="sv-checkpoints">{current.steps.map(index => <span key={index}><Check size={16} />{txt(story.steps[index].title, locale)}</span>)}</div><a className="care-link" href={contact}>{t('ناقش أولويات فريقك', 'Discuss your team’s priorities')}<Arrow size={17} /></a></div></div></section>;
}
