'use client';
import { useState, type ReactNode } from 'react';
import {
  Hospital, ScanLine, Microscope, Receipt, Stethoscope, Video, Sparkles,
  CheckCircle2, AlertTriangle, Activity, ArrowRight, BedDouble, ChevronRight,
  ShieldCheck, Cpu, Clock, Layers3, SlidersHorizontal
} from 'lucide-react';
import type { Locale } from '../lib/site-content';
import { createTranslator } from '../lib/i18n';

type TabId = 'his' | 'pacs' | 'emr' | 'lis' | 'rcm';

export default function InteractiveShowcase({ locale = 'ar' }: { locale?: Locale }) {
  const en = locale === 'en';
  const t = createTranslator(locale);
  const [activeTab, setActiveTab] = useState<TabId>('pacs');

  // PACS states
  const [wlPreset, setWlPreset] = useState<'brain' | 'bone' | 'lung'>('brain');
  const [sliceIndex, setSliceIndex] = useState(72);
  const [aiOverlay, setAiOverlay] = useState(true);

  // HIS states
  const [selectedWard, setSelectedWard] = useState<'icu' | 'surg' | 'cardio'>('icu');

  // RCM states
  const [claimed, setClaimed] = useState(false);

  // EMR states
  const [rxAlert, setRxAlert] = useState(true);

  const tabs: { id: TabId; label: string; icon: any; badge: string }[] = [
    { id: 'pacs', label: t('الأشعة وPACS السحابي', 'Cloud PACS & DICOM'), icon: ScanLine, badge: 'OHIF v3 / 3D' },
    { id: 'his', label: t('المستشفى وإدارة الأسرّة HIS', 'Hospital & Inpatient HIS'), icon: Hospital, badge: t('إشغال لحظي', 'Live Census') },
    { id: 'emr', label: t('السجل السريري الذكي EMR', 'Intelligent EMR Chart'), icon: Stethoscope, badge: 'CPOE / CDSS' },
    { id: 'lis', label: t('أجهزة المختبر الآلية LIS', 'Automated Lab LIS'), icon: Microscope, badge: 'Bidirectional' },
    { id: 'rcm', label: t('التأمين ومطالبات NPHIES', 'RCM & Insurance Claims'), icon: Receipt, badge: 'NPHIES Ready' },
  ];

  return (
    <div className="vx-interactive-showcase" id="interactive-demo">
      <div className="showcase-header">
        <div className="showcase-header-text">
          <span className="showcase-kicker">
            <Sparkles size={14} />
            {t('تجربة تفاعلية حية', 'LIVE INTERACTIVE SIMULATION')}
          </span>
          <h3>{t('انظر كيف تعمل أنظمة VIARA بتناغم فائق', 'Experience VIARA Systems Working in Perfect Sync')}</h3>
          <p>{t('اختر أي نظام لاختبار واجهة العمل والتحكم في الإعدادات بشكل تفاعلي ومباشر.', 'Select any system module below to interact with real-time controls, telemetry, and clinical workflows.')}</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="showcase-tabs" role="tablist" aria-label={t('أنظمة العرض التفاعلي', 'Interactive System Tabs')}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`showcase-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span className="tab-label">{tab.label}</span>
              <span className="tab-badge">{tab.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Showcase Screen Frame */}
      <div className="showcase-frame">
        {/* TOP BAR / TERMINAL HEADER */}
        <div className="frame-top-bar">
          <div className="traffic-lights">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="frame-title">
            VIARA HEALTH CLOUD · {tabs.find(t => t.id === activeTab)?.label}
          </div>
          <div className="frame-status">
            <span className="live-pulsar" />
            <span className="status-text">{t('اتصال مشفر TLS 1.3 نشط', 'Encrypted TLS 1.3 Active')}</span>
          </div>
        </div>

        {/* TAB 1: PACS & DIAGNOSTIC DICOM */}
        {activeTab === 'pacs' && (
          <div className="sandbox-view pacs-sandbox">
            <div className="sandbox-toolbar">
              <div className="tool-group">
                <span className="tool-label">{t('نافذة الرؤية W/L:', 'Window/Level:')}</span>
                <button
                  type="button"
                  className={`sub-btn ${wlPreset === 'brain' ? 'active' : ''}`}
                  onClick={() => setWlPreset('brain')}
                >
                  {t('المخ (Brain W/L)', 'Brain W/L')}
                </button>
                <button
                  type="button"
                  className={`sub-btn ${wlPreset === 'bone' ? 'active' : ''}`}
                  onClick={() => setWlPreset('bone')}
                >
                  {t('العظام (Bone W/L)', 'Bone W/L')}
                </button>
                <button
                  type="button"
                  className={`sub-btn ${wlPreset === 'lung' ? 'active' : ''}`}
                  onClick={() => setWlPreset('lung')}
                >
                  {t('الرئة (Lung W/L)', 'Lung W/L')}
                </button>
              </div>

              <div className="tool-group">
                <span className="tool-label">{t('مقطع الشريحة:', 'Slice:')} {sliceIndex} / 144</span>
                <input
                  type="range"
                  min="1"
                  max="144"
                  value={sliceIndex}
                  onChange={e => setSliceIndex(Number(e.target.value))}
                  className="slice-slider"
                  aria-label={t('شريحة الفحص', 'Slice Index')}
                />
              </div>

              <div className="tool-group">
                <button
                  type="button"
                  className={`sub-btn ai-toggle ${aiOverlay ? 'active-ai' : ''}`}
                  onClick={() => setAiOverlay(!aiOverlay)}
                >
                  <Cpu size={14} />
                  {aiOverlay ? t('الذكاء الاصطناعي: نشط', 'AI Triage: Active') : t('تفعيل مساند الذكاء الاصطناعي', 'Enable AI')}
                </button>
              </div>
            </div>

            <div className="pacs-display-grid">
              {/* Left: DICOM Canvas */}
              <div
                className={`dicom-screen preset-${wlPreset}`}
                style={{
                  filter:
                    wlPreset === 'bone'
                      ? 'contrast(1.6) brightness(0.85)'
                      : wlPreset === 'lung'
                      ? 'contrast(1.4) brightness(1.2)'
                      : 'contrast(1.1) brightness(1.0)',
                }}
              >
                <div className="dicom-metadata-overlay top-left">
                  <b>VIARA CENTRAL HOSPITAL · RADIOLOGY SUITE</b>
                  <span>PATIENT: ANONYMOUS #98421 (M/42Y)</span>
                  <span>STUDY: MR BRAIN AXIAL 3D T1+C</span>
                  <span>SERIES: 04 · SLICE: {sliceIndex}/144</span>
                </div>

                <div className="dicom-metadata-overlay top-right">
                  <span>TE: 12ms · TR: 550ms</span>
                  <span>MATRIX: 512x512 · FOV: 240mm</span>
                  <span>ACCESSION: VR-2026-9021</span>
                </div>

                {/* Visual Brain Graphic representation */}
                <div className="dicom-brain-simulation">
                  <div className="brain-silhouette" />
                  <div className="slice-indicator-line" style={{ top: `${(sliceIndex / 144) * 80 + 10}%` }} />
                  {aiOverlay && (
                    <div className="ai-bounding-box" style={{ top: '38%', left: '46%' }}>
                      <span className="ai-tag">AI: Normal Ventricles · 99.4% Confidence</span>
                    </div>
                  )}
                </div>

                <div className="dicom-metadata-overlay bottom-left">
                  <span>W: {wlPreset === 'bone' ? 2000 : wlPreset === 'lung' ? 1500 : 80} L: {wlPreset === 'bone' ? 500 : wlPreset === 'lung' ? -600 : 40}</span>
                  <span>LOSSLESS ZERO-FOOTPRINT DICOM</span>
                </div>

                <div className="dicom-metadata-overlay bottom-right">
                  <span className="badge-verified"><CheckCircle2 size={12} /> {t('جاهز للإملاء والاعتماد', 'Ready for Signing')}</span>
                </div>
              </div>

              {/* Right: Study Worklist & Rapid Dictation */}
              <div className="pacs-side-panel">
                <div className="panel-box">
                  <div className="panel-box-title">
                    <Clock size={14} />
                    <span>{t('قائمة العمل العاجلة (STAT Queue)', 'Urgent Worklist')}</span>
                  </div>
                  <div className="stat-card urgent">
                    <div className="stat-card-head">
                      <span className="tag-stat">STAT</span>
                      <b>MR Brain w/ Contrast</b>
                    </div>
                    <small>Dr. K. Mostafa · ER Room 4</small>
                    <div className="progress-bar"><span style={{ width: '85%' }} /></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-head">
                      <span className="tag-routine">ROUTINE</span>
                      <b>CT Chest Screening</b>
                    </div>
                    <small>Dr. H. Salem · Outpatient</small>
                  </div>
                </div>

                <div className="panel-box">
                  <div className="panel-box-title">
                    <Sparkles size={14} />
                    <span>{t('المساعد الصوتي والإملاء الذكي', 'Voice Auto-Dictation')}</span>
                  </div>
                  <div className="dictation-text">
                    {t(
                      '«الفحص يظهر سلامة النسيج الدماغي، لا توجد إشارات نزف حاد أو كتل ضاغطة، البطينات الدماغية ضمن الحدود الطبيعية.»',
                      '«Normal brain parenchyma, no acute intracranial hemorrhage or mass effect. Ventricular system within normal limits for age.»'
                    )}
                  </div>
                  <button type="button" className="btn-sign-report">
                    <CheckCircle2 size={15} />
                    {t('اعتماد التقرير وتصديره للملف', 'Sign & Sync to EMR')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HIS (HOSPITAL INFORMATION SYSTEM) */}
        {activeTab === 'his' && (
          <div className="sandbox-view his-sandbox">
            <div className="his-top-stats">
              <div className="stat-pill">
                <span className="pill-title">{t('السعة السريرية الكلية', 'Total Bed Capacity')}</span>
                <b className="pill-val">320 {t('سريرًا', 'Beds')}</b>
              </div>
              <div className="stat-pill highlight">
                <span className="pill-title">{t('نسبة الإشغال الإجمالية', 'Overall Occupancy')}</span>
                <b className="pill-val">91.4%</b>
              </div>
              <div className="stat-pill">
                <span className="pill-title">{t('غرف العمليات النشطة', 'Active OR Theaters')}</span>
                <b className="pill-val">8 / 10 {t('غرف', 'Rooms')}</b>
              </div>
              <div className="stat-pill">
                <span className="pill-title">{t('حالات الدخول اليوم', 'Admissions Today')}</span>
                <b className="pill-val">42 {t('مريضًا', 'Patients')}</b>
              </div>
            </div>

            <div className="his-ward-switcher">
              <span className="switcher-label">{t('اختر الجناح للمعاينة:', 'Select Ward:')}</span>
              {[
                { id: 'icu', name: t('العناية المركزة (ICU)', 'Intensive Care Unit (ICU)'), occ: '94%' },
                { id: 'surg', name: t('جناح الجراحة العامة', 'Surgical Ward A'), occ: '88%' },
                { id: 'cardio', name: t('مركز القلب والأوعية', 'Cardiology Center'), occ: '92%' },
              ].map(w => (
                <button
                  key={w.id}
                  type="button"
                  className={`ward-chip ${selectedWard === w.id ? 'active' : ''}`}
                  onClick={() => setSelectedWard(w.id as any)}
                >
                  <BedDouble size={14} />
                  <span>{w.name}</span>
                  <small>({w.occ})</small>
                </button>
              ))}
            </div>

            <div className="bed-matrix">
              {[
                { id: 'Bed 101', patient: t('محمود إبراهيم (55 سنة)', 'M. Ibrahim (55y)'), status: 'occupied', dr: 'Dr. Tariq', nurse: 'Nurse Amina', vitals: 'BP 125/80 · SpO2 98%' },
                { id: 'Bed 102', patient: t('سعاد الأحمد (68 سنة)', 'S. Al-Ahmad (68y)'), status: 'critical', dr: 'Dr. Mona', nurse: 'Nurse Zainab', vitals: 'BP 150/95 · SpO2 93% ⚠️' },
                { id: 'Bed 103', patient: t('فارغ (مجهز للتعقيم)', 'Available (Sanitizing)'), status: 'available', dr: '—', nurse: '—', vitals: 'Ready' },
                { id: 'Bed 104', patient: t('عبد الرحمن فهد (34 سنة)', 'A. Fahad (34y)'), status: 'occupied', dr: 'Dr. Tariq', nurse: 'Nurse Amina', vitals: 'BP 118/75 · SpO2 99%' },
                { id: 'Bed 105', patient: t('نورة العتيبي (47 سنة)', 'N. Al-Otaibi (47y)'), status: 'discharge', dr: 'Dr. Hisham', nurse: 'Nurse Zainab', vitals: 'Discharge Ready' },
                { id: 'Bed 106', patient: t('فارغ (محجوز من الطوارئ)', 'Reserved (ER Transfer)'), status: 'reserved', dr: 'Dr. Mona', nurse: 'Nurse Fatima', vitals: 'ETA: 10 mins' },
              ].map(bed => (
                <div key={bed.id} className={`bed-card status-${bed.status}`}>
                  <div className="bed-head">
                    <span className="bed-number">{bed.id}</span>
                    <span className={`status-badge badge-${bed.status}`}>
                      {bed.status === 'occupied' ? t('مشغول', 'Occupied') :
                       bed.status === 'critical' ? t('ملاحظة مكثفة', 'High Alert') :
                       bed.status === 'available' ? t('متاح', 'Available') :
                       bed.status === 'discharge' ? t('جاهز للخروج', 'Discharge') : t('محجوز', 'Reserved')}
                    </span>
                  </div>
                  <b className="patient-name">{bed.patient}</b>
                  <div className="bed-meta">
                    <span>{bed.dr}</span>
                    <span>{bed.nurse}</span>
                  </div>
                  <div className="bed-vitals">
                    <Activity size={12} />
                    <span>{bed.vitals}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EMR (ELECTRONIC MEDICAL RECORD) */}
        {activeTab === 'emr' && (
          <div className="sandbox-view emr-sandbox">
            <div className="emr-patient-banner">
              <div className="patient-avatar"><span>FA</span></div>
              <div className="patient-main-info">
                <h4>{t('فاطمة عبد العزيز المهيدب', 'Fatima A. Al-Mohaideb')}</h4>
                <div className="patient-sub-tags">
                  <span>ID: #MED-84920</span>
                  <span>{t('العمر: 44 سنة · أنثى', 'Age: 44y · Female')}</span>
                  <span>{t('فصيلة الدم: O+', 'Blood: O+')}</span>
                  <span className="allergy-tag">{t('حساسية: بنسلين Penicillin', 'Allergy: Penicillin')}</span>
                </div>
              </div>
              <div className="patient-vitals-strip">
                <div><small>{t('الضغط BP', 'BP')}</small><b>122/78</b></div>
                <div><small>{t('النبض HR', 'HR')}</small><b>74 bpm</b></div>
                <div><small>{t('الحرارة Temp', 'Temp')}</small><b>37.1 °C</b></div>
                <div><small>{t('الأكسجين SpO2', 'SpO2')}</small><b>99%</b></div>
              </div>
            </div>

            <div className="emr-split">
              <div className="emr-left-soap">
                <div className="soap-box">
                  <span className="soap-letter">S</span>
                  <div>
                    <b>Subjective (الشكوى وتاريخ المرض):</b>
                    <p>{t('المريضة تشكو من صداع نصفي متكرر منذ أسبوعين مصحوب بإرهاق عام، دون وجود اضطرابات بصرية.', 'Patient reports recurrent migraine headache for 2 weeks with fatigue, no visual disturbance.')}</p>
                  </div>
                </div>
                <div className="soap-box">
                  <span className="soap-letter">O</span>
                  <div>
                    <b>Objective (الفحص السريري والمخبري):</b>
                    <p>{t('الفحص العصبي سليم، حدقة العين متفاعلة، صورة الدم الكاملة CBC طبيعية.', 'Cranial nerves intact, pupils reactive, CBC within reference parameters.')}</p>
                  </div>
                </div>
                <div className="soap-box">
                  <span className="soap-letter">A</span>
                  <div>
                    <b>Assessment (التشخيص الطبي ICD-10):</b>
                    <span className="icd-code">G43.909 — Migraine, unspecified, not intractable</span>
                  </div>
                </div>
              </div>

              <div className="emr-right-cpoe">
                <div className="cpoe-title">
                  <Sparkles size={15} />
                  <span>{t('أوامر الطبيب الإلكترونية وفحص التعارض (CPOE)', 'Electronic Prescriptions & Drug Safety')}</span>
                </div>

                {rxAlert && (
                  <div className="rx-alert-box">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>{t('تنبيه سلامة دوائي ذكي (Safety Alert)', 'Automated Safety Alert')}</strong>
                      <p>{t('تم تجنب اقتراح أموكسيسيلين تلقائيًا بسبب تسجيل حساسية سابقة للبنسلين.', 'System auto-blocked Amoxicillin due to documented Penicillin allergy.')}</p>
                    </div>
                  </div>
                )}

                <div className="rx-item">
                  <div>
                    <b>Sumatriptan 50mg Tablets</b>
                    <small>{t('قرص واحد عند بداية الصداع، بحد أقصى مرتين يومياً', '1 tab at onset of headache, max 2 daily')}</small>
                  </div>
                  <span className="rx-badge">{t('معتمد وموثق', 'Verified Safe')}</span>
                </div>

                <div className="rx-item">
                  <div>
                    <b>Magnesium Glycinate 400mg</b>
                    <small>{t('قرص يوميًا مساءً لدعم الوقاية', '1 tablet daily at bedtime')}</small>
                  </div>
                  <span className="rx-badge">{t('مكمل وقائي', 'Preventive')}</span>
                </div>

                <button type="button" className="btn-save-chart">
                  <CheckCircle2 size={16} />
                  {t('حفظ الزيارة وإرسال الوصفة إلكترونيًا (Wasfati / eRx)', 'Sign Chart & Dispatch eRx')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIS (LABORATORY INFORMATION SYSTEM) */}
        {activeTab === 'lis' && (
          <div className="sandbox-view lis-sandbox">
            <div className="lis-analyzers-strip">
              <div className="analyzer-card online">
                <span className="dot-live" />
                <div>
                  <b>Roche Cobas 8000 (Chemistry)</b>
                  <small>{t('متصل ثنائي الاتجاه · تم فحص 420 عينة', 'Connected · 420 tests processed')}</small>
                </div>
              </div>
              <div className="analyzer-card online">
                <span className="dot-live" />
                <div>
                  <b>Sysmex XN-1000 (Hematology)</b>
                  <small>{t('متصل · معايرة الجودة QC معتمدة', 'Connected · QC Passed 100%')}</small>
                </div>
              </div>
              <div className="analyzer-card online">
                <span className="dot-live" />
                <div>
                  <b>Beckman Access 2 (Immunoassay)</b>
                  <small>{t('جاهز لاستقبال عينات الطوارئ STAT', 'Ready for STAT run')}</small>
                </div>
              </div>
            </div>

            <div className="lis-table-wrap">
              <table className="lis-table">
                <thead>
                  <tr>
                    <th>{t('رقم الباركود', 'Barcode ID')}</th>
                    <th>{t('المريض والقسم', 'Patient & Ward')}</th>
                    <th>{t('اسم الفحص', 'Test Description')}</th>
                    <th>{t('النتيجة المخبرية', 'Result')}</th>
                    <th>{t('المعدل الطبيعي', 'Ref Range')}</th>
                    <th>{t('الحالة', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><bdi className="barcode-tag">#984210-EDTA</bdi></td>
                    <td>{t('خالد ناصر (طوارئ)', 'Khaled N. (ER)')}</td>
                    <td>Hemoglobin (Hb)</td>
                    <td><strong className="val-critical">7.2 g/dL ⚠️</strong></td>
                    <td>13.0 - 17.5</td>
                    <td><span className="badge-critical">{t('قيمة حرجة STAT', 'CRITICAL STAT')}</span></td>
                  </tr>
                  <tr>
                    <td><bdi className="barcode-tag">#984211-SERUM</bdi></td>
                    <td>{t('منى العبد الله (باطنة)', 'Mona A. (Inpatient)')}</td>
                    <td>Fasting Blood Glucose</td>
                    <td><strong>98 mg/dL</strong></td>
                    <td>70 - 100</td>
                    <td><span className="badge-verified">{t('معتمد وموثق', 'Auto-Verified')}</span></td>
                  </tr>
                  <tr>
                    <td><bdi className="barcode-tag">#984212-SERUM</bdi></td>
                    <td>{t('يوسف سالم (عيادة 4)', 'Yousef S. (Clinic 4)')}</td>
                    <td>Serum Creatinine</td>
                    <td><strong>0.9 mg/dL</strong></td>
                    <td>0.7 - 1.3</td>
                    <td><span className="badge-verified">{t('معتمد وموثق', 'Auto-Verified')}</span></td>
                  </tr>
                  <tr>
                    <td><bdi className="barcode-tag">#984213-CITRATE</bdi></td>
                    <td>{t('سارة محمد (جراحة)', 'Sarah M. (Surg)')}</td>
                    <td>Prothrombin Time (PT/INR)</td>
                    <td><strong>1.05 INR</strong></td>
                    <td>0.8 - 1.2</td>
                    <td><span className="badge-verified">{t('معتمد وموثق', 'Auto-Verified')}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: RCM & NPHIES INSURANCE */}
        {activeTab === 'rcm' && (
          <div className="sandbox-view rcm-sandbox">
            <div className="rcm-kpi-bar">
              <div className="rcm-kpi">
                <span>{t('نسبة قبول المطالبات الأولية', 'Clean Claim Rate')}</span>
                <b className="val-green">98.6%</b>
              </div>
              <div className="rcm-kpi">
                <span>{t('متوسط زمن الموافقة الفورية', 'Avg Approval Time')}</span>
                <b>1.8 {t('ثانية', 'sec')}</b>
              </div>
              <div className="rcm-kpi">
                <span>{t('المطالبات المعتمدة هذا الشهر', 'Approved Claims MTD')}</span>
                <b>14,820 {t('مطالبة', 'claims')}</b>
              </div>
              <div className="rcm-kpi">
                <span>{t('الوفورات من منع الرفوضات', 'Denials Prevented')}</span>
                <b className="val-green">+18.4%</b>
              </div>
            </div>

            <div className="rcm-simulator">
              <div className="rcm-form-card">
                <div className="card-head">
                  <ShieldCheck size={18} />
                  <b>{t('التحقق اللحظي من أهلية التأمين (NPHIES / CCHI)', 'Instant NPHIES Insurance Eligibility')}</b>
                </div>

                <div className="rcm-inputs-row">
                  <div>
                    <label>{t('رقم الهوية / الإقامة:', 'National ID / Iqama:')}</label>
                    <input type="text" readOnly value="1092837461" />
                  </div>
                  <div>
                    <label>{t('شركة التأمين:', 'Payer Network:')}</label>
                    <input type="text" readOnly value={t('بوبا العربية (الفئة الذهبية)', 'Bupa Arabia (Gold Network)')} />
                  </div>
                  <div>
                    <label>{t('الخدمة المطلوبة:', 'Requested Procedure:')}</label>
                    <input type="text" readOnly value={t('أشعة رنين مغناطيسي MRI Spine', 'MRI Spine w/ Contrast')} />
                  </div>
                </div>

                <div className="rcm-action-line">
                  <button
                    type="button"
                    className="btn-rcm-check"
                    onClick={() => setClaimed(!claimed)}
                  >
                    {claimed ? t('إعادة التحقق من الأهلية', 'Re-check Eligibility') : t('إرسال استعلام فوري لمنصة نفيس', 'Send Real-time NPHIES Query')}
                    <ArrowRight size={15} />
                  </button>
                  <span className="compliance-tag">
                    <CheckCircle2 size={13} />
                    {t('متوافق 100% مع معايير مجلس الضمان الصحي', '100% CCHI & NPHIES Compliant')}
                  </span>
                </div>

                {claimed ? (
                  <div className="eligibility-result approved">
                    <div className="result-head">
                      <span className="badge-approved">● {t('موافقة فورية معتمدة (Approved)', 'INSTANT APPROVAL')}</span>
                      <span>AUTH CODE: #NPH-2026-89410</span>
                    </div>
                    <div className="result-grid">
                      <div><small>{t('نسبة التغطية التأمينية', 'Insurance Coverage')}</small><b>100%</b></div>
                      <div><small>{t('نسبة التحمل على المريض (Copay)', 'Patient Copay')}</small><b>0.00 {t('ريال', 'SAR')}</b></div>
                      <div><small>{t('سقف التغطية السنوي المتبقي', 'Remaining Annual Limit')}</small><b>245,000 {t('ريال', 'SAR')}</b></div>
                    </div>
                  </div>
                ) : (
                  <div className="eligibility-result pending">
                    <p>{t('اضغط على الزر أعلاه لتجربة التحقق الفوري للمطالبة عبر منصة نفيس.', 'Click the button above to simulate instantaneous automated NPHIES pre-authorization.')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="showcase-footer-bar">
        <div className="footer-left">
          <ShieldCheck size={16} />
          <span>{t('كافة الأنظمة متصلة عبر شبكة بيانات موحدة HL7 FHIR v4 ومعايير DICOM 3.0', 'All systems interoperate through unified HL7 FHIR v4 & DICOM 3.0 interfaces')}</span>
        </div>
        <a href="#contact" className="footer-cta">
          {t('ناقش ربط أنظمة منشأتك', 'Connect with our Engineering Team')}
          <ChevronRight size={16} />
        </a>
      </div>
    </div>
  );
}
