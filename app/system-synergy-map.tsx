'use client';
import { ArrowRight, ArrowLeft, Building2, ScanLine, Layers3, Globe2, CheckCircle2, ArrowDown } from 'lucide-react';
import type { Locale } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';

type Props = {
  locale: Locale;
  activeId?: string | null;
  onSelectSystem?: (id: string) => void;
};

export default function SystemSynergyMap({ locale, activeId, onSelectSystem }: Props) {
  const en = locale === 'en';
  const t = useSiteText(locale);
  const NextArrow = en ? ArrowRight : ArrowLeft;

  const steps = [
    {
      id: 'CMS',
      icon: Building2,
      phase: en ? 'Step 01 / Registration' : 'المرحلة 01 / الاستقبال والتسجيل',
      title: en ? 'CMS — Medical Center' : 'CMS — إدارة المركز والعيادات',
      role: en ? 'Patient entry, appointments & billing' : 'تسجيل المراجع، جدولة المواعيد والفوترة',
      handoff: en ? 'Patient & Visit Data' : 'بيانات المراجع والزيارة',
      badge: en ? 'Reception & EMR' : 'الاستقبال والملف الطبي',
      color: '#b44e46',
      bg: '#fcf0ec',
      border: '#f0d7d0',
    },
    {
      id: 'RIS',
      icon: ScanLine,
      phase: en ? 'Step 02 / Radiology' : 'المرحلة 02 / سير عمل الأشعة',
      title: en ? 'RIS — Radiology Suite' : 'RIS — إدارة مراكز الأشعة',
      role: en ? 'Modality worklists, tracking & reports' : 'قوائم عمل الأجهزة، متابعة الفحص وإعداد التقارير',
      handoff: en ? 'DICOM Worklist (MWL)' : 'أمر الفحص وقائمة العمل (MWL)',
      badge: en ? 'Worklist & Reports' : 'قوائم العمل والتقارير',
      color: '#007b61',
      bg: '#edf6f0',
      border: '#cfe6d9',
    },
    {
      id: 'PACS',
      icon: Layers3,
      phase: en ? 'Step 03 / Imaging' : 'المرحلة 03 / الصور التشخيصية',
      title: en ? 'PACS — Image Archive' : 'PACS — أرشفة وعرض الصور الطبية',
      role: en ? 'DICOM storage, web viewer & matching' : 'أرشفة دراسات DICOM، العارض الطبي ومطابقة الفحوصات',
      handoff: en ? 'Diagnostic Studies' : 'الصور الطبية المعتمدة',
      badge: en ? 'DICOM 3.0 Archive' : 'أرشفة DICOM التشخيصية',
      color: '#8a6413',
      bg: '#fff8e5',
      border: '#f1e1b4',
    },
    {
      id: 'PORTAL',
      icon: Globe2,
      phase: en ? 'Step 04 / Delivery' : 'المرحلة 04 / البوابات والتسليم',
      title: en ? 'PORTAL — Access Hub' : 'PORTAL — بوابات المرضى والأطباء',
      role: en ? 'Online results, image viewing & QR verify' : 'استعراض التقارير والصور، وبوابة الأطباء والتحقق بالـ QR',
      handoff: en ? 'End-to-End Complete' : 'اكتمال دورة الرعاية',
      badge: en ? 'Patient & Physician' : 'المرضى والأطباء المحيلين',
      color: '#1d6f8a',
      bg: '#eef7fa',
      border: '#cde4ed',
    },
  ];

  return (
    <section className="care-wrap vsm-section" aria-labelledby="vsm-heading">
      <div className="vsm-header">
        <div>
          <span className="vsd-kicker">{t('دورة عمل متصلة', 'CONNECTED WORKFLOW')}</span>
          <h2 id="vsm-heading">{t('كيف تعمل منظومة VIARA بتناغم واحد؟', 'How VIARA systems work together')}</h2>
        </div>
        <p>
          {t(
            'تترابط أنظمة VIARA في مسار موحد ينقل بيانات المراجع من الحجز إلى أجهزة الأشعة ثم التقارير والأرشفة والبوابات الرقمية، دون الحاجة لإعادة إدخال البيانات يدوياً.',
            'VIARA systems communicate in a unified loop, transferring patient data from booking to imaging modalities, diagnostic reporting, archiving and digital portals without redundant data entry.',
          )}
        </p>
      </div>

      <div className="vsm-flow-container">
        <div className="vsm-flow-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeId === step.id;
            return (
              <div key={step.id} className="vsm-node-wrapper">
                <article
                  className={`vsm-node ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    '--node-color': step.color,
                    '--node-bg': step.bg,
                    '--node-border': step.border,
                  } as React.CSSProperties}
                  onClick={() => onSelectSystem && onSelectSystem(step.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSystem && onSelectSystem(step.id);
                    }
                  }}
                  aria-label={`${step.title} - ${step.role}`}
                >
                  <div className="vsm-node-top">
                    <span className="vsm-node-icon">
                      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="vsm-node-phase">{step.phase}</span>
                    <span className="vsm-node-tag" dir="ltr">{step.id}</span>
                  </div>

                  <h3 className="vsm-node-title">{step.title}</h3>
                  <p className="vsm-node-role">{step.role}</p>

                  <div className="vsm-node-badge">
                    <CheckCircle2 size={13} aria-hidden="true" />
                    <span>{step.badge}</span>
                  </div>
                </article>

                {idx < steps.length - 1 && (
                  <div className="vsm-connector" aria-hidden="true">
                    <div className="vsm-connector-line">
                      <span className="vsm-connector-arrow">
                        <NextArrow size={16} />
                      </span>
                      <span className="vsm-connector-down">
                        <ArrowDown size={16} />
                      </span>
                    </div>
                    <span className="vsm-connector-label">{step.handoff}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="vsm-guarantee">
          <div className="vsm-guarantee-pill">
            <span className="vsm-dot" />
            <span>
              {t(
                'بروتوكولات قياسية متوافقة: DICOM 3.0 · HL7 · REST API · تشفير كامل للبيانات',
                'Standards-compliant: DICOM 3.0 · HL7 · REST API · End-to-end encryption',
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
