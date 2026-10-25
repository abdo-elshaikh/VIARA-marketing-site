'use client';

import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, Workflow, Focus, SlidersHorizontal, Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import CareFrame from './care-frame';
import CompanyApproach from './company-approach';
import { useSiteText } from '../lib/site-copy';
import './brand-editorial.css';
import './company-about.css';

export default function AboutView({ content, locale = 'ar' }: { content: SiteContent; locale?: Locale }) {
  const en = locale === 'en';
  const prefix = en ? '/en' : '';
  const home = en ? '/en' : '/';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;
  const company = content.company;
  const offices = company.offices.filter(item => item.enabled);
  const values = [
    { icon: Focus, title: t('نبدأ من المهمة', 'Start with the task'), body: t('من يستقبل المراجع؟ كيف ينتقل الفحص؟ وأين يُعتمد التقرير؟ نرتب النقاش حول مهام الفريق الفعلية.', 'Who receives the patient? How does an examination move forward? Where is the report approved? We frame the conversation around actual team tasks.') },
    { icon: SlidersHorizontal, title: t('نوضح النطاق', 'Make the scope clear'), body: t('الأنظمة والأدوار والتكاملات المطلوبة تُراجع ضمن بيئة المنشأة، ويُوضح ما يشمله العرض الفني.', 'Systems, roles and integration requirements are reviewed in the facility’s environment, with the technical proposal defining what is included.') },
    { icon: Workflow, title: t('نخطط الانتقال', 'Plan the transition'), body: t('نناقش التهيئة والتدريب وخطوات القبول مع فريقك، لتصبح البداية خطة يمكن مراجعتها.', 'We discuss configuration, training and acceptance steps with your team, turning the start into a plan you can review.') },
  ];

  return <CareFrame content={content} locale={locale} current="about">
    <div className="ve-page about-editorial">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="care-wrap">
          <nav className="ve-breadcrumb" aria-label={t('مسار الصفحة', 'Breadcrumb')}><Link href={home}>{t('الرئيسية', 'Home')}</Link><span aria-hidden="true" /><span aria-current="page">{t('عن VIARA', 'About VIARA')}</span></nav>
          <div className="about-hero-grid">
            <div className="about-hero-copy">
              <span className="ve-kicker">{txt(company.eyebrow, locale)}</span>
              <h1 id="about-hero-title">{t('التقنية تبدأ', 'Technology starts')}<br /><em>{t('من فهم يومك.', 'with your workday.')}</em></h1>
              <p>{txt(content.about.body, locale)}</p>
              <div className="ve-actions"><Link className="care-btn" href={`${home}#contact`}>{t('لنتحدث عن مركزك', 'Let’s talk about your center')}<Arrow size={18} /></Link><a className="care-link" href="#about-approach">{t('كيف نعمل معك', 'How we work with you')}<Forward size={17} /></a></div>
            </div>
            <figure className="about-hero-visual">
              <div className="about-image-header"><span>VIARA</span><span>{t('تقنية أقرب للرعاية', 'TECHNOLOGY CLOSER TO CARE')}</span></div>
              <img src="/assets/systems/hero-20261025/cms.webp" width={1586} height={992} fetchPriority="high" alt={t('تصور توضيحي مولد لاستقبال مركز طبي يحمل هوية VIARA', 'AI-generated illustration of a medical center reception with VIARA branding')} />
              <figcaption><span>{t('مراكز طبية. فرق عمل. تفاصيل مترابطة.', 'Medical centers. Teams. Connected details.')}</span><small>{t('تصور توضيحي مولد، وليس منشأة عميل.', 'AI-generated concept, not a customer facility.')}</small></figcaption>
            </figure>
          </div>
          <div className="about-hero-footer"><span>{t('نفهم العمل. نحدد النطاق. نخطط البداية.', 'UNDERSTAND THE WORK. DEFINE THE SCOPE. PLAN THE START.')}</span><bdi>VIARA / ABOUT</bdi></div>
        </div>
      </section>

      <section className="care-wrap about-story" aria-labelledby="about-story-title">
        <div className="about-story-label"><span className="ve-kicker">{t('من نحن', 'WHO WE ARE')}</span><span className="about-story-mark" aria-hidden="true"><img src={content.brand.logo} width={68} height={68} loading="lazy" alt="" /></span></div>
        <div className="about-story-copy"><h2 id="about-story-title">{txt(company.storyTitle, locale)}</h2><p>{txt(company.storyBody, locale)}</p><Link className="care-link" href={`${prefix}/systems`}>{t('تعرّف على الحلول التي نطوّرها', 'Explore the solutions we develop')}<Forward size={18} /></Link></div>
      </section>

      <section className="about-values-section" aria-labelledby="about-values-title"><div className="care-wrap"><div className="about-section-heading"><div><span className="ve-kicker">{t('ما يوجّه العمل', 'WHAT GUIDES THE WORK')}</span><h2 id="about-values-title">{t('وضوح في الفكرة.', 'Clarity in the idea.')}<br /><em>{t('وعناية بالتفاصيل.', 'Care in the details.')}</em></h2></div><p>{t('ننظر إلى البرنامج ضمن طريقة تشغيل المنشأة: الأشخاص الذين يستخدمونه، والمهام التي تنتقل بينهم، والتفاصيل التي يجب الاتفاق عليها.', 'We consider software within the facility’s operation: the people who use it, the tasks they hand over, and the details that need agreement.')}</p></div><div className="about-values-grid">{values.map((value, index) => <article key={value.title}><div><value.icon size={25} strokeWidth={1.5} /><span aria-hidden="true">0{index + 1}</span></div><h3>{value.title}</h3><p>{value.body}</p></article>)}</div></div></section>

      <div className="care-wrap about-approach-wrap"><CompanyApproach locale={locale} /></div>

      <section className="care-wrap about-conversation" aria-labelledby="about-contact-title"><div className="about-conversation-card"><div><span className="ve-kicker">{t('لنتعرف على بيئتك', 'LET’S UNDERSTAND YOUR ENVIRONMENT')}</span><h2 id="about-contact-title">{t('ابدأ بما تريد', 'Start with what you')}<br /><em>{t('تحسينه في مركزك.', 'want to improve.')}</em></h2><p>{t('شاركنا طبيعة المنشأة، والأنظمة الحالية، وما يحتاج فريقك إلى تنظيمه. نحدد معك الأسئلة والخطوة التالية.', 'Tell us about your facility, existing systems and what your team needs to organize. We will define the questions and the next step together.')}</p><Link className="care-btn" href={`${home}#contact`}>{t('ناقش احتياجاتك معنا', 'Discuss your needs with us')}<Arrow size={18} /></Link></div><aside className="about-contact-card"><img src="/assets/viara-symbol.webp" width={74} height={74} loading="lazy" alt="" /><strong>{txt(company.legalName, locale)}</strong><p>{t('للاستفسارات ومناقشة النطاق', 'FOR ENQUIRIES & SCOPE DISCUSSIONS')}</p><div className="ve-contact-links">{content.contact.email && <a href={`mailto:${content.contact.email}`}><Mail size={17} /><bdi>{content.contact.email}</bdi></a>}{content.contact.phone && <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`}><Phone size={17} /><bdi>{content.contact.phone}</bdi></a>}{content.contact.whatsapp && <a href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />{t('تواصل عبر واتساب', 'Contact via WhatsApp')}</a>}</div><Link href={`${prefix}/requests`}>{t('لديك طلب سابق؟ تابع حالته', 'Already sent a request? Track its status')}<Forward size={16} /></Link></aside></div></section>

      {offices.length > 0 && <section className="care-wrap about-offices" aria-labelledby="about-offices-title"><span className="ve-kicker">{t('بيانات التواصل المنشورة', 'PUBLISHED CONTACT DETAILS')}</span><h2 id="about-offices-title">{t('أين تجدنا', 'Where to find us')}</h2><div>{offices.map(office => <article key={office.id}><MapPin size={21} /><div><h3>{txt(office.name, locale)}</h3><p>{txt(office.address, locale)}</p>{txt(office.hours, locale) && <p>{txt(office.hours, locale)}</p>}{office.mapUrl && <a href={office.mapUrl} target="_blank" rel="noopener noreferrer">{t('الموقع والتفاصيل', 'Location & details')}<Arrow size={16} /></a>}</div></article>)}</div></section>}
    </div>
  </CareFrame>;
}
