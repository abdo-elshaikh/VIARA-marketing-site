'use client';

import Link from 'next/link';
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ScanLine,
  Network,
  Workflow,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import type { Locale } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';
import './company-approach.css';

const steps = [
  {
    icon: CalendarDays,
    number: '01',
    phase: { ar: 'المرحلة الأولى', en: 'Phase 01' },
    title: { ar: 'فهم وتوثيق سير العمل الفعلي', en: 'Workflow Discovery & Analysis' },
    subtitle: { ar: 'تحليل دقيق لرحلة المريض والفريق الطبي', en: 'In-depth patient & clinical path analysis' },
    description: {
      ar: 'نبدأ من الواقع الميداني لمركزك: من يستقبل المراجع؟ كيف تسجل بياناته؟ ما هي مسارات الفحوصات العادية والمستعجلة؟ وأين يُعتمد التقرير الشعاعي وتصدر الفواتير.',
      en: 'We start from your clinical floor: who greets the patient? How is booking handled? What are routine vs emergency scanning paths? And where are reports signed and billed.',
    },
    deliverables: {
      ar: ['خريطة مسار المريض والفريق', 'تحديد نقاط الاختناق الحالية', 'حصر الأدوار والصلاحيات المطلوبة'],
      en: ['Patient & team journey map', 'Current bottleneck identification', 'Required roles & permissions scope'],
    },
  },
  {
    icon: ScanLine,
    number: '02',
    phase: { ar: 'المرحلة الثانية', en: 'Phase 02' },
    title: { ar: 'تحديد الأنظمة والوحدات المناسبة', en: 'System & Modality Scope Definition' },
    subtitle: { ar: 'مواءمة دقيقة لحلول RIS وPACS وCMS والبوابات', en: 'Tailored alignment of RIS, PACS, CMS & Portals' },
    description: {
      ar: 'نحدد بدقة الأنظمة التي تحقق أهداف مركزك دون زيادات غير مبررة: هل تحتاج RIS متقدم فقط؟ أم PACS مع عارض تشخيصي هجين؟ أم بوابات إلكترونية تفاعلية للأطباء المحيلين.',
      en: 'We accurately scope solutions that meet your goals without unnecessary overhead: a standalone RIS, hybrid PACS with web viewer, or connected doctor/patient portals.',
    },
    deliverables: {
      ar: ['تحديد حزمة الأنظمة المعتمدة', 'تقدير أحجام التخزين والأرشفة', 'هيكلة قواعد البيانات والسيرفرات'],
      en: ['Approved system package scope', 'Storage & PACS capacity sizing', 'Database & server architecture plan'],
    },
  },
  {
    icon: Network,
    number: '03',
    phase: { ar: 'المرحلة الثالثة', en: 'Phase 03' },
    title: { ar: 'فحص الربط الفني وتكامل DICOM / HL7', en: 'Integration & DICOM Connectivity' },
    subtitle: { ar: 'تنسيق قنوات الاتصال مع أجهزة التصوير والأنظمة الخارجية', en: 'Seamless interface with modalities & external systems' },
    description: {
      ar: 'نحصر كافة أجهزة الأشعة (CT, MRI, X-Ray, Ultrasound) وندرس دعمها لبروتوكول Modality Worklist (MWL) وتخزين C-STORE، إضافة إلى التكامل مع الأنظمة المحاسبية أو التأمينية.',
      en: 'We inventory all modalities (CT, MRI, X-Ray, Ultrasound), verify MWL and C-STORE compliance, and plan interfaces with existing billing or insurance engines.',
    },
    deliverables: {
      ar: ['مخطط شبكة الربط الإشعاعي DICOM', 'اختبار توافق قوائم العمل MWL', 'توثيق واجهات API ونقاط التبادل'],
      en: ['DICOM network topology map', 'Modality Worklist (MWL) validation', 'API & exchange endpoints documentation'],
    },
  },
  {
    icon: Workflow,
    number: '04',
    phase: { ar: 'المرحلة الرابعة', en: 'Phase 04' },
    title: { ar: 'التنفيذ والتدريب العملي والإطلاق الحي', en: 'Deployment, Staff Training & Go-Live' },
    subtitle: { ar: 'انتقال منظم ومرافقة مباشرة لضمان استقرار العمل', en: 'Structured rollout with live side-by-side assistance' },
    description: {
      ar: 'نضع جدولاً زمنياً واضحاً لتهيئة البيئة التشغيلية، تدريب الاستقبال وفنيي الأشعة والأطباء على مهامهم الفعلية، ومرافقة الفريق لحظة بلحظة أثناء الإطلاق الحي لضمان عدم توقف الفحوصات.',
      en: 'We execute a clear timetable for environment provisioning, role-specific staff training (reception, radiographers, doctors), and hands-on side-by-side launch support.',
    },
    deliverables: {
      ar: ['تدريب عملي لكل دور وتخصص', 'فحوصات القبول والاعتماد (UAT)', 'مرافقة تشغيلية مباشرة وضمان كامل'],
      en: ['Role-specific hands-on training', 'Acceptance testing & sign-off (UAT)', 'Live operational floor accompaniment'],
    },
  },
];

export default function CompanyApproach({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const t = useSiteText(locale);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const Forward = en ? ArrowRight : ArrowLeft;
  const prefix = en ? '/en' : '';
  const home = en ? '/en' : '/';

  return (
    <section className="co-approach" id="about-approach" aria-labelledby="co-approach-title">
      <div className="co-approach-header">
        <div className="co-approach-kicker-row">
          <span className="co-approach-badge">
            <Sparkles size={14} className="co-approach-badge-icon" />
            {t('منهجية التحول الرقمي المدروس', 'PROVEN ROLLOUT METHODOLOGY')}
          </span>
          <span className="co-approach-code">VIARA / METHODOLOGY</span>
        </div>

        <div className="co-approach-heading-grid">
          <div>
            <h2 id="co-approach-title">
              {t('خطوات مدروسة تبدأ من', 'Structured steps starting from')}{' '}
              <em>{t('طريقة عمل فريقك اليومية.', 'your daily team operations.')}</em>
            </h2>
          </div>
          <p>
            {t(
              'لا نعتمد على الافتراضات الجاهزة ولا نفرض حلولاً نمطية. نجلس مع فريقك، ونفهم تفاصيل الفحوصات والربط، لنبني نطاق عمل واضحاً وشفافاً يضمن نجاح المنظومة دون مفاجآت.',
              'We do not believe in one-size-fits-all assumptions. We sit with your clinical team, analyze imaging flows and integration points, and agree on a transparent proposal that ensures success without surprises.'
            )}
          </p>
        </div>
      </div>

      <div className="co-approach-main-layout">
        {/* Left / Steps sequence */}
        <div className="co-approach-timeline">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="co-step-card">
                <div className="co-step-rail">
                  <div className="co-step-indicator">
                    <span className="co-step-num">{step.number}</span>
                    <Icon size={18} className="co-step-indicator-icon" />
                  </div>
                  {idx < steps.length - 1 && <div className="co-step-connector" />}
                </div>

                <div className="co-step-content">
                  <div className="co-step-header">
                    <span className="co-step-phase-tag">{t(step.phase.ar, step.phase.en)}</span>
                    <h3 className="co-step-title">{t(step.title.ar, step.title.en)}</h3>
                    <p className="co-step-subtitle">{t(step.subtitle.ar, step.subtitle.en)}</p>
                  </div>

                  <p className="co-step-desc">{t(step.description.ar, step.description.en)}</p>

                  <div className="co-step-deliverables">
                    <span className="co-deliverables-label">
                      <FileCheck2 size={13} />
                      {t('المخرجات والضمانات الملموسة:', 'Key deliverables & milestones:')}
                    </span>
                    <ul>
                      {step.deliverables[locale === 'en' ? 'en' : 'ar'].map((item, dIdx) => (
                        <li key={dIdx}>
                          <CheckCircle2 size={14} className="co-deliv-check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right / Strategic Scope Card */}
        <aside className="co-approach-sidecard">
          <div className="co-sidecard-inner">
            <div className="co-sidecard-top">
              <span className="co-sidecard-tag">{t('ميثاق التنفيذ', 'EXECUTION PLEDGE')}</span>
              <div className="co-sidecard-mark">
                <Cpu size={26} strokeWidth={1.5} />
              </div>
            </div>

            <h3>{t('كل منشأة لها خصوصيتها.. ولها عرضها الفني المفصل.', 'Every facility is unique with its dedicated technical scope.')}</h3>

            <p>
              {t(
                'تراجع الأجهزة الحالية والتكاملات والسعة التخزينية المطلوبة فنيًا قبل أي خطوة تنفيذية، ويحدد كل دور ونظام في العرض الفني المتفق عليه.',
                'Existing imaging modalities, integration endpoints, and storage requirements are assessed prior to kickoff; every system and role is codified in the agreed proposal.'
              )}
            </p>

            <div className="co-sidecard-highlights">
              <div className="co-side-hl">
                <ShieldCheck size={18} />
                <div>
                  <strong>{t('ضمان الاستقرار الفني', 'High Availability SLA')}</strong>
                  <span>{t('اختبارات قبول شاملة قبل الإطلاق', 'Comprehensive UAT prior to go-live')}</span>
                </div>
              </div>

              <div className="co-side-hl">
                <Layers size={18} />
                <div>
                  <strong>{t('لا رسوم خفية أو بنود غامضة', 'Transparent Scoping')}</strong>
                  <span>{t('نطاق العمل محدد بدقة تعاقدية', 'Crystal-clear deliverables & modules')}</span>
                </div>
              </div>
            </div>

            <div className="co-sidecard-action">
              <Link href={`${home}#contact`} className="co-sidecard-btn">
                <span>{t('ناقش نطاق مركزك معنا', 'Discuss your center scope')}</span>
                <Arrow size={16} />
              </Link>
              <Link href={`${prefix}/systems`} className="co-sidecard-sublink">
                <span>{t('استكشف الأنظمة المتاحة', 'Explore available systems')}</span>
                <Forward size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
