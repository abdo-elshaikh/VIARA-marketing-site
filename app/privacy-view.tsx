'use client';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileText,
  Database,
  EyeOff,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Layers,
  ArrowUpLeft,
  ArrowUpRight,
} from 'lucide-react';
import type { Locale, SiteContent } from '../lib/site-content';
import { txt } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';
import CareFrame from './care-frame';
import BrandPageHero from './brand-page-hero';
import './privacy.css';

export default function PrivacyView({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const en = locale === 'en';
  const t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: t('نطاق سياسة واضح', 'Clear policy scope'),
      desc: t('تخص الموقع التعريفي وطلبات التواصل', 'For this website and its inquiries'),
    },
    {
      icon: EyeOff,
      title: t('لا ترسل بيانات المرضى', 'Do not send patient data'),
      desc: t('النماذج مخصصة لبيانات المنشأة فقط', 'Forms are for facility details only'),
    },
    {
      icon: Lock,
      title: t('بيانات تواصل محدودة', 'Limited contact data'),
      desc: t('نجمع ما يلزم لمراجعة الطلب', 'Collected only to review a request'),
    },
    {
      icon: FileCheck2,
      title: t('تحكم في سجل طلباتك', 'Control your request history'),
      desc: t('يمكنك حذف بيانات الطلب من المتصفح', 'You can delete request data from this browser'),
    },
  ];

  const sections = [
    {
      id: 'scope',
      num: '01',
      title: t('نطاق السياسة وطبيعة المنصة', 'Policy Scope & Platform Nature'),
      icon: FileText,
    },
    {
      id: 'phi',
      num: '02',
      title: t('سرية بيانات المرضى ودراسات الأشعة (PHI / DICOM)', 'Patient Health Data & DICOM PHI Isolation'),
      icon: EyeOff,
    },
    {
      id: 'data',
      num: '03',
      title: t('البيانات المجمعة عبر الموقع وأغراضها', 'Collected Information & Purposes'),
      icon: Database,
    },
    {
      id: 'security',
      num: '04',
      title: t('الأمان والتشفير المؤسسي', 'Enterprise Security & Safeguards'),
      icon: Lock,
    },
    {
      id: 'cookies',
      num: '05',
      title: t('ملفات تعريف الارتباط وميزة «طلباتي»', 'Cookies & Guest Request Tracking'),
      icon: Layers,
    },
    {
      id: 'rights',
      num: '06',
      title: t('حقوق المنشآت الطبية وأصحاب البيانات', 'Healthcare Facility & User Rights'),
      icon: UserCheck,
    },
    {
      id: 'contact',
      num: '07',
      title: t('التواصل ومسؤول حماية البيانات (DPO)', 'Data Protection Officer & Contact'),
      icon: Mail,
    },
  ];

  return (
    <CareFrame content={content} locale={locale} current="privacy">
      {/* ── Brand Page Hero with Islamic Girih & DICOM Telemetry ── */}
      <BrandPageHero
        locale={locale}
        kind="privacy"
        eyebrow={en ? 'Healthcare Privacy & Data Governance' : 'حوكمة وسرية البيانات الصحية والطبية'}
        title={en ? 'VIARA Privacy' : 'وثيقة سياسة الخصوصية'}
        accent={en ? 'How this website handles data.' : 'وكيف يعالج الموقع بياناتك.'}
        description={
          en
            ? 'A clear explanation of the information collected through this website, why it is used, and how to request access or deletion.'
            : 'شرح واضح للبيانات التي يجمعها هذا الموقع، وأغراض استخدامها، وكيفية طلب الوصول إليها أو حذفها.'
        }
        note={en ? 'Last updated: October 2026 · Marketing website policy' : 'آخر تحديث: أكتوبر 2026 · سياسة الموقع التعريفي'}
      />

      <div className="care-wrap vp-privacy-page">
        {/* ── Healthcare Trust Badges Strip ── */}
        <section className="vp-trust-strip" aria-label={t('شارات الأمان والامتثال', 'Security and Compliance Badges')}>
          <div className="vp-trust-grid">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="vp-trust-badge">
                  <div className="vp-trust-icon">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div className="vp-trust-text">
                    <strong>{badge.title}</strong>
                    <span>{badge.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Main Layout: Sticky Nav Index + Policy Cards Stream ── */}
        <div className="vp-privacy-layout">
          {/* Quick Index Navigation */}
          <aside className="vp-privacy-nav" aria-label={t('فهرس وثيقة الخصوصية', 'Privacy Policy Index')}>
            <h3>
              <FileCheck2 size={16} aria-hidden="true" />
              <span>{t('فهرس البنود', 'Policy Sections')}</span>
            </h3>
            <ul>
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`}>
                    <span className="vp-privacy-nav-num">{sec.num}</span>
                    <span>{sec.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Detailed Content Stream */}
          <div className="vp-privacy-content">
            {/* 1. Scope & Demarcation */}
            <article id="scope" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <FileText size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('1. نطاق السياسة وطبيعة المنصة', '1. Scope of Policy & Platform Nature')}</h2>
                  <span>{t('تحديد حدود المعالجة بين الموقع التعريفي والمنظومات السريرية', 'Demarcation between marketing website and clinical deployments')}</span>
                </div>
              </header>
              <p>
                {t(
                  'تنطبق هذه السياسة حصراً على الموقع الإلكتروني التعريفي لمنصة VIARA (المتاح عبر هذا النطاق)، وتهدف إلى بيان كيفية التعامل مع استفسارات ممثلي مراكز الأشعة والمرافق الطبية، وطلبات العروض التوضيحية، وتخطيط النطاق التشغيلي لأنظمة (RIS / PACS / AI / CMS).',
                  'This privacy policy applies strictly to the informational website of VIARA. It governs how we collect, handle, and protect inquiries from representatives of radiology centers and medical facilities, live demo requests, and operational scope planning for RIS, PACS, AI, and CMS systems.',
                )}
              </p>
              <div className="vp-alert vp-alert-emerald">
                <CheckCircle2 size={18} aria-hidden="true" />
                <div className="vp-alert-text">
                  <strong>{t('استقلالية المنظومات السريرية المشغلة', 'Clinical System Independence')}</strong>
                  {t(
                    'أنظمة VIARA التشغيلية المعتمدة لدى المستشفيات والمراكز تعمل في بيئات سحابية أو محلية معزولة ومحمية باتفاقيات مستوى خدمة (SLA) وعقود معالجة بيانات صحية (DPA) مستقلة تماماً عن الموقع التسويقي.',
                    'Production clinical systems deployed at partner facilities operate in isolated cloud or on-premise environments governed by dedicated Service Level Agreements (SLAs) and Data Processing Agreements (DPAs) separate from this marketing site.',
                  )}
                </div>
              </div>
            </article>

            {/* 2. Patient PHI & DICOM Isolation */}
            <article id="phi" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <EyeOff size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('2. سرية بيانات المرضى ودراسات الأشعة (PHI / DICOM)', '2. Patient Health Information & DICOM PHI')}</h2>
                  <span>{t('حظر كامل لإدراج البيانات الطبية السريرية عبر قنوات الموقع', 'Strict prohibition of clinical medical records on public forms')}</span>
                </div>
              </header>
              <p>
                {t(
                  'نلتزم بأعلى معايير السرية والأخلاقيات الطبية المنصوص عليها في الأنظمة الصحية الوطنية والدولية. يُحظر حظراً قاطعاً إدخال أو إرسال أو إرفاق أي معلومات صحية محمية (PHI) أو دراسات تصوير إشعاعي (DICOM) أو تقارير تشخيصية تخص المرضى عبر أي من نماذج التواصل بالموقع.',
                  'We adhere to the highest confidentiality standards established in national and international health regulations. You must never enter, submit, or attach Protected Health Information (PHI), DICOM radiological imaging, or clinical diagnostic reports via any contact form on this website.',
                )}
              </p>
              <div className="vp-alert vp-alert-amber">
                <AlertTriangle size={18} aria-hidden="true" />
                <div className="vp-alert-text">
                  <strong>{t('تنبيه هام لممثلي المنشآت الطبية', 'Important Notice for Healthcare Representatives')}</strong>
                  {t(
                    'نماذج الموقع مخصصة للاستفسارات الإدارية، مثل: حجم العمل اليومي، عدد الأجهزة، والفروع المطلوبة. في حال تم استلام أي ملف أو معلومة طبية حساسة بالخطأ، يتم حذفها وإتلافها فوراً من خوادمنا دون معالجة أو أرشفة.',
                    'Website forms are designed solely for institutional planning (e.g. daily modality volume, number of devices, facility branches). If any clinical patient file is submitted inadvertently, it is immediately expunged from our servers without processing or archiving.',
                  )}
                </div>
              </div>
            </article>

            {/* 3. Collected Data & Purpose */}
            <article id="data" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <Database size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('3. البيانات المجمعة عبر الموقع وأغراضها', '3. Information We Collect & Why')}</h2>
                  <span>{t('بيانات التواصل المؤسسي ودراسة الاحتياج التقني', 'Institutional contact details & technical scope assessment')}</span>
                </div>
              </header>
              <p>
                {t(
                  'عند تفاعلك مع الموقع أو إرسال طلب عرض تجريبي، نقوم بجمع البيانات التالية بالقدر اللازم فقط لتحقيق الغرض:',
                  'When interacting with our website or requesting a demonstration, we collect only the necessary institutional information:',
                )}
              </p>
              <div className="vp-data-grid">
                <div className="vp-data-item">
                  <strong>{t('بيانات مسؤول التواصل', 'Contact Representative')}</strong>
                  <span>{t('الاسم الكامل، المسمى الوظيفي، والبريد الإلكتروني المؤسسي.', 'Full name, job title, and institutional email address.')}</span>
                </div>
                <div className="vp-data-item">
                  <strong>{t('بيانات المنشأة الطبية', 'Healthcare Facility')}</strong>
                  <span>{t('اسم المركز أو المستشفى، الدولة والمدينة، ورقم هاتف المتابعة.', 'Facility name, location, and official business phone number.')}</span>
                </div>
                <div className="vp-data-item">
                  <strong>{t('نطاق الأنظمة والاهتمامات', 'System Scope & Interests')}</strong>
                  <span>{t('الأنظمة المختارة (RIS / PACS / AI / CMS)، وحجم الفروع التقريبي.', 'Selected systems (RIS / PACS / AI / CMS) and estimated facility branch count.')}</span>
                </div>
                <div className="vp-data-item">
                  <strong>{t('الملاحظات الفنية الاختيارية', 'Optional Technical Notes')}</strong>
                  <span>{t('أي استفسارات إدارية أو تقنية تخص التكامل مع أجهزة الأشعة.', 'Any administrative or technical integration queries with modality scanners.')}</span>
                </div>
              </div>
              <ul className="vp-list">
                <li>
                  {t(
                    'الأساس النظامي: معالجة البيانات تتم بناءً على طلب صاحب البيانات لاتخاذ خطوات سابقة للتعاقد وتقديم العرض المناسب.',
                    'Legal basis: Processing is conducted upon the data subject’s request to initiate pre-contractual steps and prepare suitable proposals.',
                  )}
                </li>
                <li>
                  {t(
                    'عدم المشاركة الإعلانية: لا نقوم ببيع أو تأجير أو مشاركة هذه البيانات مع أي أطراف ثالثة لأغراض دعائية أو تجارية.',
                    'Zero commercial sharing: We never sell, lease, or distribute institutional inquiries to third parties for advertising or marketing campaigns.',
                  )}
                </li>
              </ul>
            </article>

            {/* 4. Enterprise Security */}
            <article id="security" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <Lock size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('4. الأمان والتشفير المؤسسي', '4. Enterprise Security & Safeguards')}</h2>
                  <span>{t('حماية القنوات الرقمية ومنع الوصول غير المصرح به', 'Encrypted communication channels & zero unauthorized access')}</span>
                </div>
              </header>
              <p>
                {t(
                  'نطبق منظومة ضوابط أمنية وتقنية صارمة متوافقة مع ممارسات حماية البيانات العالمية، وتشمل:',
                  'We enforce rigorous technical and administrative safeguards consistent with international data protection frameworks, including:',
                )}
              </p>
              <ul className="vp-list">
                <li>
                  <strong>{t('تشفير النقل المشدد (TLS 1.3 / HTTPS):', 'In-Transit Encryption (TLS 1.3 / HTTPS):')}</strong>{' '}
                  {t(
                    'تشفير كافة البيانات المتدفقة بين متصفحك وخوادم المنصة لمنع أي اعتراض أو استراق غير مشروع.',
                    'End-to-end transport encryption between your browser and our infrastructure prevents interception.',
                  )}
                </li>
                <li>
                  <strong>{t('التحكم الصارم بالوصول (RBAC):', 'Strict Role-Based Access Control (RBAC):')}</strong>{' '}
                  {t(
                    'قصر الاطلاع على استفسارات المراكز على فريق الدعم والتنفيذ المعتمد فقط والمقيد باتفاقيات سرية صارمة.',
                    'Access to center inquiries is restricted strictly to authorized rollout teams subject to binding non-disclosure agreements.',
                  )}
                </li>
                <li>
                  <strong>{t('جدر الحماية ومنع الهجمات:', 'Threat Detection & Firewalls:')}</strong>{' '}
                  {t(
                    'فحص مستمر ضد هجمات حقن الأوامر (Injection)، والبريد العشوائي، وإخضاع البنية لاختبارات أمان دورية.',
                    'Continuous screening against code injection and automated spam, paired with regular security reviews.',
                  )}
                </li>
              </ul>
            </article>

            {/* 5. Cookies & Tracking */}
            <article id="cookies" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <Layers size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('5. ملفات تعريف الارتباط وميزة «طلباتي»', '5. Cookies & Guest Request Tracking')}</h2>
                  <span>{t('ملفات وظيفية حصرية دون تتبع تجسسي متقاطع', 'Functional-only cookies with zero cross-site surveillance')}</span>
                </div>
              </header>
              <p>
                {t(
                  'نعتمد في VIARA سياسة ملفات تعريف ارتباط (Cookies) وظيفية حصرية تركز على راحة وخصوصية المستخدم:',
                  'VIARA operates a strictly functional cookie policy focused on client privacy and operational convenience:',
                )}
              </p>
              <ul className="vp-list">
                <li>
                  <strong>{t('معرّف الزائر الفريد (Guest ID):', 'Guest Session Identifier:')}</strong>{' '}
                  {t(
                    'ملف تعريف مؤقت ومشفّر يخزن معرفاً محلياً عشوائياً لربط استفسارات منشأتك بصفحة «متابعة طلباتي» الخاصة بك على نفس الجهاز، دون إلزامك بإنشاء حساب أو كلمة مرور عامة.',
                    'An encrypted local identifier that links your facility inquiries to the "My Requests" dashboard on the same device without requiring account registration.',
                  )}
                </li>
                <li>
                  <strong>{t('تفضيل اللغة والوضع المخصص:', 'Language & Locale Preference:')}</strong>{' '}
                  {t('حفظ اختيارك للغة (العربية أو الإنجليزية) لتيسير جلسات التصفح اللاحقة.', 'Remembers your language choice (Arabic or English) for subsequent sessions.')}
                </li>
                <li>
                  <strong>{t('انعدام التتبع التجسسي (No Cross-Site Tracking):', 'No Cross-Site Surveillance:')}</strong>{' '}
                  {t(
                    'لا نستخدم أي ملفات تتبع إعلانية لأطراف ثالثة تلاحق نشاطك عبر الإنترنت.',
                    'We do not employ third-party advertising cookies that track your footprint across external websites.',
                  )}
                </li>
              </ul>
              <p>
                {t(
                  'يمكنك في أي وقت مسح بيانات الموقع أو ملفات تعريف الارتباط من إعدادات متصفحك، مع الإحاطة بأن ذلك سيؤدي إلى إعادة تعيين سجل استعراض الطلبات على هذا الجهاز.',
                  'You may clear cookies or site data at any time via your browser settings; note that doing so resets local access to your past inquiry summaries on that device.',
                )}
              </p>
            </article>

            {/* 6. User Rights */}
            <article id="rights" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <UserCheck size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('6. حقوق المنشآت الطبية وأصحاب البيانات', '6. Healthcare Facility & User Rights')}</h2>
                  <span>{t('التحكم الكامل والشفافية وفق الأنظمة الوطنية', 'Full control and transparency under applicable data protection laws')}</span>
                </div>
              </header>
              <p>
                {t(
                  'بموجب نظام حماية البيانات الشخصية ولائحته التنفيذية، يتمتع مسؤولو المنشآت بالحقوق التالية فيما يخص بياناتهم:',
                  'Under the Personal Data Protection Law (PDPL) and applicable health regulations, institutional representatives possess clear rights:',
                )}
              </p>
              <ul className="vp-list">
                <li>
                  <strong>{t('حق العلم والاطلاع:', 'Right to Know & Access:')}</strong>{' '}
                  {t('معرفة البيانات التي نحتفظ بها عن منشأتك وطلب نسخة منها.', 'Request confirmation and a clear copy of the contact data retained about your center.')}
                </li>
                <li>
                  <strong>{t('حق التصحيح والتحديث:', 'Right to Rectification:')}</strong>{' '}
                  {t('تحديث أو تصحيح أي بيانات تواصل أو معلومات غير دقيقة عن مركزك.', 'Amend or update inaccurate facility or representative information.')}
                </li>
                <li>
                  <strong>{t('حق الإتلاف والمحو:', 'Right to Erasure:')}</strong>{' '}
                  {t('طلب حذف سجل الاستفسارات وبيانات التواصل عند انتهاء الغرض منها.', 'Request complete deletion of past inquiries when no longer required.')}
                </li>
                <li>
                  <strong>{t('سحب الموافقة:', 'Right to Withdraw Consent:')}</strong>{' '}
                  {t('سحب موافقتك على متابعة التواصل في أي وقت دون أي تبعات.', 'Opt-out of further follow-up communications at any time without penalty.')}
                </li>
              </ul>
            </article>

            {/* 7. DPO & Contact */}
            <article id="contact" className="vp-card">
              <header className="vp-card-header">
                <div className="vp-card-icon">
                  <Mail size={22} aria-hidden="true" />
                </div>
                <div className="vp-card-title">
                  <h2>{t('7. التواصل ومسؤول حماية البيانات (DPO)', '7. Data Protection Officer & Contacts')}</h2>
                  <span>{t('قنوات الاتصال المباشرة للاستفسارات وممارسة الحقوق', 'Direct communication channels for governance and privacy inquiries')}</span>
                </div>
              </header>
              <p>
                {t(
                  'لممارسة أي من حقوقك أو لتقديم استفسار يخص حماية وسرية البيانات في VIARA، يسعدنا تواصلك المباشر مع فريق الحوكمة والامتثال:',
                  'To exercise your privacy rights or discuss healthcare compliance and security safeguards at VIARA, contact our governance team directly:',
                )}
              </p>

              <div className="vp-contact-box">
                {content.contact.email && (
                  <a href={`mailto:${content.contact.email}`} className="vp-contact-item">
                    <Mail size={18} className="vp-contact-icon" aria-hidden="true" />
                    <span>{content.contact.email}</span>
                  </a>
                )}
                {content.contact.phone && (
                  <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="vp-contact-item">
                    <Phone size={18} className="vp-contact-icon" aria-hidden="true" />
                    <bdi>{content.contact.phone}</bdi>
                  </a>
                )}
                {txt(content.contact.address, locale) && (
                  <div className="vp-contact-item">
                    <MapPin size={18} className="vp-contact-icon" aria-hidden="true" />
                    <span>{txt(content.contact.address, locale)}</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link href={en ? '/en#contact' : '/#contact'} className="care-btn care-btn-small">
                  <span>{t('تواصل مع فريق التنفيذ', 'Contact Rollout Team')}</span>
                  <Arrow size={16} />
                </Link>
                <Link href={en ? '/en' : '/'} className="care-link">
                  <span>{t('العودة للرئيسية', 'Return to Home')}</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </CareFrame>
  );
}
