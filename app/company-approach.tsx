'use client';
import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight, CalendarDays, Check, Network, ScanLine, Workflow } from 'lucide-react';
import type { Locale } from '../lib/site-content';
import './company-approach.css';

const steps = [
  {
    icon: CalendarDays,
    number: '01',
    title: { ar: 'نفهم طريقة العمل', en: 'Understand the workflow' },
    description: {
      ar: 'نبدأ من رحلة المراجع: الاستقبال والمواعيد والفحوصات والتقارير والفوترة.',
      en: 'Start with the patient journey: reception, appointments, examinations, reports and billing.',
    },
  },
  {
    icon: ScanLine,
    number: '02',
    title: { ar: 'نحدد الأنظمة المناسبة', en: 'Identify suitable systems' },
    description: {
      ar: 'نراجع احتياجات المركز ونحدد دور أنظمة RIS وPACS وCMS والبوابات ضمن النطاق المطلوب.',
      en: 'Review the center’s needs and define the role of RIS, PACS, CMS and portals in the proposed scope.',
    },
  },
  {
    icon: Network,
    number: '03',
    title: { ar: 'نراجع نقاط الربط', en: 'Review integration needs' },
    description: {
      ar: 'نحصر الأجهزة والأنظمة الحالية ونقاط التكامل التي تحتاج إلى تقييم فني.',
      en: 'Identify existing devices and systems, and the integration points that require technical assessment.',
    },
  },
  {
    icon: Workflow,
    number: '04',
    title: { ar: 'نناقش خطة التنفيذ', en: 'Discuss the rollout plan' },
    description: {
      ar: 'نرتب نطاق التهيئة والأدوار وخطوات التنفيذ والتدريب المقترحة في العرض الفني.',
      en: 'Outline the configuration scope, roles, rollout steps and proposed training in the technical proposal.',
    },
  },
];

export default function CompanyApproach({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = (ar: string, eng: string) => en ? eng : ar;
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  return <section className="co-approach" aria-labelledby="co-approach-title">
    <div className="co-approach-heading">
      <div>
        <span className="care-eyebrow">{t('من الاحتياج إلى نطاق واضح', 'FROM NEEDS TO A CLEAR SCOPE')}</span>
        <h2 id="co-approach-title">{t('خطوات تبدأ من طريقة عملك.', 'A process shaped around your work.')}</h2>
      </div>
      <p>{t('نرتب النقاش حول واقع المنشأة، ثم نراجع الأنظمة ونقاط الربط قبل الاتفاق على نطاق التنفيذ.', 'We ground the conversation in your facility’s day-to-day work, then review systems and integrations before agreeing on a rollout scope.')}</p>
    </div>

    <div className="co-approach-layout">
      <ol className="co-approach-steps">
        {steps.map(({ icon: Icon, number, title, description }) => (
          <li key={number}>
            <span className="co-approach-step-icon"><Icon size={20} strokeWidth={1.7} /></span>
            <span className="co-approach-step-copy">
              <span className="co-approach-step-label">{t('الخطوة', 'STEP')} <bdi>{number}</bdi></span>
              <strong>{en ? title.en : title.ar}</strong>
              <span>{en ? description.en : description.ar}</span>
            </span>
            <Check className="co-approach-check" size={17} aria-hidden="true" />
          </li>
        ))}
      </ol>

      <aside className="co-approach-note">
        <span className="co-approach-note-kicker">{t('نطاق مدروس، لا افتراضات جاهزة', 'A THOUGHTFUL SCOPE, NOT ASSUMPTIONS')}</span>
        <div className="co-approach-note-mark" aria-hidden="true"><Network size={24} strokeWidth={1.5} /></div>
        <h3>{t('كل منشأة لها احتياجاتها.', 'Every facility has its own needs.')}</h3>
        <p>{t('تُراجع الأجهزة والتكاملات والوحدات المطلوبة فنيًا، ويُوضح ما يشمله التنفيذ في العرض المخصص للمنشأة.', 'Devices, integrations and required modules are assessed technically; the facility-specific proposal defines the agreed delivery scope.')}</p>
        <Link href={en ? '/en/systems' : '/systems'}>{t('استكشف الأنظمة', 'Explore the systems')}<Arrow size={16} /></Link>
      </aside>
    </div>

    <div className="co-security">
      <div className="co-approach-heading" style={{marginTop: '3rem'}}>
        <div>
          <span className="care-eyebrow">{t('موثق في النظام', 'VERIFIED IN SYSTEM')}</span>
          <h2>{t('أمان وخصوصية مدمجان.', 'Security and privacy built in.')}</h2>
        </div>
        <p>{t('الضمانات التالية موثقة في قاعدة الكود ومُفعّلة في بيئات الإنتاج. لا تعتمد على شهادات خارجية بل على آليات تقنية مُحكمة.', 'These controls are documented in the codebase and active in production. They rely on verified technical mechanisms, not third-party certifications.')}</p>
      </div>
      <ul className="co-steps" style={{listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.5rem'}}>
        {(en ? [
          'AES-256-GCM field-level encryption',
          'Blind indexing for encrypted field search',
          'Tamper-evident audit chain',
          '2FA and Passkeys authentication support',
          'ClamAV malware scanning on uploads',
          'On-premises and offline deployment option',
        ] : [
          'تشفير على مستوى الحقول بـ AES-256-GCM',
          'فهرسة عمياء للبحث في الحقول المشفرة',
          'سجل تدقيق مضاد للتلاعب',
          'دعم المصادقة الثنائية (2FA) ومفاتيح المرور',
          'فحص الملفات المرفوعة بـ ClamAV',
          'نشر محلي وبدون اتصال إنترنت',
        ]).map((item, i) => (
          <li key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'var(--co-step-bg, #f8fafc)', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.9rem', lineHeight: 1.5}}>
            <Check size={16} style={{flexShrink: 0, marginTop: '0.15rem', color: '#007b61'}} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>;
}
