'use client';
import { useState } from 'react';
import {
  ScanLine, Eye, Sparkles, Activity, Layers3, Cpu, Stethoscope, Hospital,
  TestTube2, Microscope, ShieldCheck, DollarSign, Building2, Users,
  Smartphone, Video, Network, Route, Share2, Workflow, Clock, CheckCircle2,
  AlertTriangle, Radio, Play, ChevronRight, Zap, Shield, FileText, ArrowRight
} from 'lucide-react';
import type { Locale } from '../lib/site-content';

interface SystemVisualProps {
  id: string;
  category: string;
  locale: Locale;
  interactive?: boolean;
}

export default function SystemVisual({ id, category, locale, interactive = false }: SystemVisualProps) {
  const en = locale === 'en';
  const canonical = id === 'EMR' ? 'EHR' : id;

  switch (canonical) {
    case 'PACS':
      return <PacsVisual en={en} interactive={interactive} />;
    case 'RIS':
      return <RisVisual en={en} interactive={interactive} />;
    case 'AI':
      return <AiRadiologyVisual en={en} interactive={interactive} />;
    case 'DENTAL':
      return <DentalVisual en={en} interactive={interactive} />;
    case 'TELE':
      return <TeleRadiologyVisual en={en} interactive={interactive} />;
    case 'HIS':
      return <HisVisual en={en} interactive={interactive} />;
    case 'EHR':
      return <EhrVisual en={en} interactive={interactive} />;
    case 'LIS':
      return <LisVisual en={en} interactive={interactive} />;
    case 'RCM':
      return <RcmVisual en={en} interactive={interactive} />;
    case 'CMS':
      return <CmsVisual en={en} interactive={interactive} />;
    case 'OR':
      return <OrVisual en={en} interactive={interactive} />;
    case 'PHARM':
      return <PharmVisual en={en} interactive={interactive} />;
    case 'BI':
      return <BiVisual en={en} interactive={interactive} />;
    case 'INTEROP':
      return <InteropVisual en={en} interactive={interactive} />;
    case 'PATH':
      return <PathVisual en={en} interactive={interactive} />;
    case 'BLOOD':
      return <BloodVisual en={en} interactive={interactive} />;
    default:
      return <GenericMedicalVisual id={canonical} category={category} en={en} />;
  }
}

/* =========================================================================
   1. PACS: Diagnostic DICOM Workstation Visual
   ========================================================================= */
function PacsVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  const [preset, setPreset] = useState<'lung' | 'bone' | 'brain'>('lung');

  return (
    <div className="sv-frame sv-pacs">
      {/* Top DICOM Metadata Bar */}
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-cyan">DICOM 3.0</span>
          <span className="sv-meta-text">CT CHEST + C · SLICE: 142/320</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-pulse-indicator" />
          <span className="sv-meta-code">W:1500 L:-600 · -710 HU</span>
        </div>
      </div>

      {/* Main Diagnostic Canvas */}
      <div className="sv-canvas-container">
        <svg viewBox="0 0 400 220" className="sv-dicom-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="lungField" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#081b29" />
              <stop offset="100%" stopColor="#03080e" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Body Cross-section Contour */}
          <path
            d="M 60 110 C 60 50, 140 30, 200 30 C 260 30, 340 50, 340 110 C 340 170, 270 195, 200 195 C 130 195, 60 170, 60 110 Z"
            fill="url(#lungField)"
            stroke="#16384c"
            strokeWidth="1.5"
          />

          {/* Spine & Ribs Shadow */}
          <circle cx="200" cy="165" r="14" fill="#1b415a" stroke="#256285" strokeWidth="1" />
          <ellipse cx="200" cy="164" rx="7" ry="5" fill="#0d2433" />
          <path d="M 120 70 Q 75 110 110 160" fill="none" stroke="#163b4f" strokeWidth="2.5" strokeDasharray="6,4" />
          <path d="M 280 70 Q 325 110 290 160" fill="none" stroke="#163b4f" strokeWidth="2.5" strokeDasharray="6,4" />

          {/* Right & Left Lung Parenchyma Contours */}
          <path
            d="M 110 75 C 135 60, 175 75, 175 125 C 175 160, 140 170, 115 155 C 95 140, 90 95, 110 75 Z"
            fill="#06121b"
            stroke="#1d506d"
            strokeWidth="1.5"
          />
          <path
            d="M 290 75 C 265 60, 225 75, 225 125 C 225 160, 260 170, 285 155 C 305 140, 310 95, 290 75 Z"
            fill="#06121b"
            stroke="#1d506d"
            strokeWidth="1.5"
          />

          {/* Cardiac Silhouette */}
          <path d="M 175 110 C 180 85, 215 85, 225 110 C 230 135, 190 160, 175 145 Z" fill="#132f42" stroke="#255877" strokeWidth="1" />

          {/* Vascular Tree Markings */}
          <path d="M 140 110 Q 125 125 118 140 M 140 110 Q 130 95 122 88" stroke="#185675" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 260 110 Q 275 125 282 140 M 260 110 Q 270 95 278 88" stroke="#185675" strokeWidth="1.2" strokeLinecap="round" />

          {/* Caliper Measurement Overlay */}
          <line x1="250" y1="95" x2="285" y2="120" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="2,2" filter="url(#glow)" />
          <circle cx="250" cy="95" r="2.5" fill="#00e5ff" />
          <circle cx="285" cy="120" r="2.5" fill="#00e5ff" />
          <rect x="255" y="76" width="52" height="15" rx="3" fill="#02141f" stroke="#00e5ff" strokeWidth="0.8" />
          <text x="281" y="87" fill="#00e5ff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">14.8 mm</text>

          {/* Crosshair & HU Probe */}
          <circle cx="145" cy="125" r="6" stroke="#10b981" strokeWidth="1" fill="none" strokeDasharray="2,1" />
          <line x1="145" y1="115" x2="145" y2="135" stroke="#10b981" strokeWidth="0.8" />
          <line x1="135" y1="125" x2="155" y2="125" stroke="#10b981" strokeWidth="0.8" />
          <text x="145" y="148" fill="#10b981" fontSize="7.5" fontFamily="monospace" textAnchor="middle">-712 HU</text>

          {/* MPR Mini Viewport Corner */}
          <rect x="12" y="145" width="46" height="38" rx="4" fill="#050d14" stroke="#1a425a" strokeWidth="1" />
          <text x="16" y="155" fill="#64748b" fontSize="6" fontFamily="monospace">SAG</text>
          <path d="M 22 175 Q 35 155 48 172" stroke="#2a6589" strokeWidth="1" fill="none" />
          
          <rect x="12" y="188" width="46" height="24" rx="4" fill="#050d14" stroke="#1a425a" strokeWidth="1" />
          <text x="16" y="198" fill="#64748b" fontSize="6" fontFamily="monospace">COR</text>
          <circle cx="35" cy="200" r="6" stroke="#2a6589" strokeWidth="1" fill="none" />
        </svg>

        {/* Viewport Floating Controls */}
        <div className="sv-floating-toolbar">
          <span className="sv-tool-tag active">{en ? 'Lung' : 'رئة'}</span>
          <span className="sv-tool-tag">{en ? 'Bone' : 'عظام'}</span>
          <span className="sv-tool-tag">{en ? 'Brain' : 'مخ'}</span>
          <span className="sv-tool-tag sv-tool-accent">MPR 3D</span>
        </div>
      </div>

      {/* Bottom Capabilities Strip */}
      <div className="sv-bottom-strip">
        <span className="sv-chip"><Layers3 size={11} /> OHIF v3 Web</span>
        <span className="sv-chip"><Zap size={11} /> 0.3s Streaming</span>
        <span className="sv-chip"><Shield size={11} /> WADO-RS / TLS</span>
      </div>
    </div>
  );
}

/* =========================================================================
   2. RIS: Radiology Information System & Modality Matrix Visual
   ========================================================================= */
function RisVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-ris">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-emerald">HL7 MWL</span>
          <span className="sv-meta-text">{en ? 'MODALITY WORKLIST' : 'قائمة عمل الأجهزة'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-live-badge">{en ? 'LIVE QUEUE' : 'مباشر'}</span>
        </div>
      </div>

      <div className="sv-ris-grid">
        {/* Modality Status Columns */}
        <div className="sv-ris-modality is-active">
          <div className="sv-mod-head">
            <span className="sv-mod-title">MRI 3.0T</span>
            <span className="sv-status-pill in-progress">{en ? 'Scanning' : 'فحص جاري'}</span>
          </div>
          <div className="sv-mod-patient">#MR-4912 · {en ? 'Brain with Gadolinium' : 'رنين مخ بالصبغة'}</div>
          <div className="sv-progress-track">
            <div className="sv-progress-bar" style={{ width: '74%' }} />
          </div>
          <div className="sv-mod-footer">
            <span>Seq 4/6 · T2 FLAIR</span>
            <span className="sv-mod-time">04:18 rem</span>
          </div>
        </div>

        <div className="sv-ris-modality">
          <div className="sv-mod-head">
            <span className="sv-mod-title">CT 128-Slice</span>
            <span className="sv-status-pill next">{en ? 'Ready' : 'جاهز للمريض'}</span>
          </div>
          <div className="sv-mod-patient">#CT-8109 · {en ? 'Abdomen & Pelvis Tri-Phase' : 'أشعة مقطعية بطن وحوض'}</div>
          <div className="sv-progress-track">
            <div className="sv-progress-bar" style={{ width: '0%' }} />
          </div>
          <div className="sv-mod-footer">
            <span className="sv-badge-urgent">{en ? 'STAT EMERGENCY' : 'حالة حرجة عاجلة'}</span>
          </div>
        </div>

        <div className="sv-ris-modality">
          <div className="sv-mod-head">
            <span className="sv-mod-title">{en ? 'Voice Dictation' : 'الإملاء الصوتي'}</span>
            <span className="sv-status-pill verified">{en ? 'Ready' : 'جاهز'}</span>
          </div>
          {/* Animated Waveform */}
          <div className="sv-waveform-preview">
            <span className="wave-bar h1" />
            <span className="wave-bar h3" />
            <span className="wave-bar h5" />
            <span className="wave-bar h2" />
            <span className="wave-bar h4" />
            <span className="wave-bar h1" />
            <span className="wave-bar h3" />
            <span className="wave-bar h5" />
            <span className="wave-bar h2" />
          </div>
          <div className="sv-mod-footer">
            <span>BI-RADS Cat 2 / Lung-RADS 1</span>
          </div>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Clock size={11} /> {en ? 'Avg TAT: 21m' : 'متوسط الإنجاز: 21 دقيقة'}</span>
        <span className="sv-chip"><FileText size={11} /> {en ? 'Structured Reports' : 'تقارير مهيكلة'}</span>
        <span className="sv-chip"><CheckCircle2 size={11} /> {en ? 'PAC Integration' : 'ربط PACS لحظي'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   3. AI Radiology: Neural Auto-Triage & Acute Detection Visual
   ========================================================================= */
function AiRadiologyVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-ai">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-violet">NEURAL TRIAGE</span>
          <span className="sv-meta-text">{en ? 'AI INFERENCE · RESNET-3D' : 'تحليل ذكاء اصطناعي فوري'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-ai-beacon" />
          <span className="sv-meta-code">380ms Latency</span>
        </div>
      </div>

      <div className="sv-ai-canvas">
        {/* Heatmap Scan Simulation */}
        <div className="sv-ai-scan-box">
          <svg viewBox="0 0 200 130" className="sv-scan-svg">
            <defs>
              <radialGradient id="aiHeat" cx="65%" cy="45%" r="35%">
                <stop offset="0%" stopColor="#ff3366" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#ff9900" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#00e5ff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#05101a" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Brain/Chest silhouette */}
            <path
              d="M 40 65 C 40 25, 70 15, 100 15 C 130 15, 160 25, 160 65 C 160 105, 130 115, 100 115 C 70 115, 40 105, 40 65 Z"
              fill="#06121d"
              stroke="#1b4563"
              strokeWidth="1.5"
            />
            {/* Ventricles */}
            <path d="M 90 50 C 95 40, 95 70, 88 80 M 110 50 C 105 40, 105 70, 112 80" stroke="#163852" strokeWidth="3" fill="none" />
            {/* Glowing Neural Heatmap */}
            <circle cx="125" cy="55" r="28" fill="url(#aiHeat)" />
            {/* Target Bounding Box */}
            <rect x="108" y="38" width="34" height="34" fill="none" stroke="#ff3366" strokeWidth="1.2" strokeDasharray="3,2" />
            <circle cx="108" cy="38" r="2" fill="#ff3366" />
            <circle cx="142" cy="72" r="2" fill="#ff3366" />
            <text x="125" y="82" fill="#ff3366" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">99.4% ICH</text>
          </svg>
        </div>

        {/* AI Findings Triage Card */}
        <div className="sv-ai-findings">
          <div className="sv-finding-item alert">
            <div className="sv-finding-head">
              <span className="sv-finding-tag stat">{en ? 'CRITICAL FINDING' : 'نتيجة حرجة عاجلة'}</span>
              <span className="sv-score">99.4%</span>
            </div>
            <div className="sv-finding-title">{en ? 'Intracranial Hemorrhage (ICH)' : 'اشتباه نزيف دماغي حاد'}</div>
            <div className="sv-finding-action">⚡ {en ? 'Bumped to #1 in Reading Queue' : 'تم الرفع إلى رأس قائمة القراءة'}</div>
          </div>

          <div className="sv-finding-item pass">
            <div className="sv-finding-head">
              <span className="sv-finding-tag normal">{en ? 'RULED OUT' : 'فحص سليم'}</span>
              <span className="sv-score">99.8%</span>
            </div>
            <div className="sv-finding-title">{en ? 'Midline Shift: None (<1mm)' : 'انزياح الخط الناصف: سلبي'}</div>
          </div>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Sparkles size={11} /> {en ? 'Auto-Triage' : 'فرز ذاتي فوري'}</span>
        <span className="sv-chip"><ShieldCheck size={11} /> {en ? 'CE/FDA Benchmarks' : 'معايير جودة دقيقة'}</span>
        <span className="sv-chip"><Cpu size={11} /> {en ? 'GPU Edge Cluster' : 'معالجة محلية فائقة'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   4. DENTAL: Dental Practice & 3D Panoramic (OPG) Visual
   ========================================================================= */
function DentalVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-dental">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-teal">3D OPG & CBCT</span>
          <span className="sv-meta-text">{en ? 'DIGITAL ODONTOGRAM' : 'مخطط الأسنان الرقمي'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-code">FDI Notation (11-48)</span>
        </div>
      </div>

      <div className="sv-dental-viewport">
        {/* Panoramic Arch Simulation */}
        <svg viewBox="0 0 380 130" className="sv-opg-svg">
          <defs>
            <linearGradient id="opgCurve" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d3142" />
              <stop offset="50%" stopColor="#185675" />
              <stop offset="100%" stopColor="#0d3142" />
            </linearGradient>
          </defs>

          {/* Mandibular & Maxillary Arch Curves */}
          <path d="M 40 40 Q 190 15 340 40" stroke="url(#opgCurve)" strokeWidth="8" fill="none" opacity="0.6" />
          <path d="M 50 95 Q 190 120 330 95" stroke="url(#opgCurve)" strokeWidth="8" fill="none" opacity="0.6" />

          {/* Maxillary Teeth Array (Upper) */}
          {[
            { x: 70, y: 38, num: 16, status: 'healthy' },
            { x: 105, y: 32, num: 14, status: 'restored' },
            { x: 140, y: 26, num: 12, status: 'healthy' },
            { x: 175, y: 22, num: 11, status: 'implant' },
            { x: 205, y: 22, num: 21, status: 'healthy' },
            { x: 240, y: 26, num: 22, status: 'canal' },
            { x: 275, y: 32, num: 24, status: 'healthy' },
            { x: 310, y: 38, num: 26, status: 'restored' },
          ].map(tooth => (
            <g key={tooth.num}>
              <rect
                x={tooth.x - 11}
                y={tooth.y - 12}
                width="22"
                height="24"
                rx="4"
                fill={
                  tooth.status === 'implant' ? '#00e5ff' :
                  tooth.status === 'canal' ? '#ff9900' :
                  tooth.status === 'restored' ? '#10b981' : '#14384d'
                }
                fillOpacity={tooth.status === 'healthy' ? 0.4 : 0.85}
                stroke="#2a6585"
                strokeWidth="1"
              />
              <text x={tooth.x} y={tooth.y + 4} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {tooth.num}
              </text>
            </g>
          ))}

          {/* Mandibular Teeth Array (Lower) */}
          {[
            { x: 80, y: 92, num: 46, status: 'canal' },
            { x: 115, y: 98, num: 44, status: 'healthy' },
            { x: 150, y: 104, num: 42, status: 'healthy' },
            { x: 180, y: 106, num: 41, status: 'healthy' },
            { x: 200, y: 106, num: 31, status: 'healthy' },
            { x: 230, y: 104, num: 32, status: 'healthy' },
            { x: 265, y: 98, num: 34, status: 'implant' },
            { x: 300, y: 92, num: 36, status: 'restored' },
          ].map(tooth => (
            <g key={tooth.num}>
              <rect
                x={tooth.x - 11}
                y={tooth.y - 12}
                width="22"
                height="24"
                rx="4"
                fill={
                  tooth.status === 'implant' ? '#00e5ff' :
                  tooth.status === 'canal' ? '#ff9900' :
                  tooth.status === 'restored' ? '#10b981' : '#14384d'
                }
                fillOpacity={tooth.status === 'healthy' ? 0.4 : 0.85}
                stroke="#2a6585"
                strokeWidth="1"
              />
              <text x={tooth.x} y={tooth.y + 4} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {tooth.num}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="sv-dental-legend">
          <span className="leg-item"><i className="leg-dot c-cyan" /> {en ? 'Implant Planned' : 'زراعة مخططة'}</span>
          <span className="leg-item"><i className="leg-dot c-amber" /> {en ? 'Endo Canal' : 'علاج جذور'}</span>
          <span className="leg-item"><i className="leg-dot c-green" /> {en ? 'Restored' : 'حشوة تجميلية'}</span>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Activity size={11} /> {en ? 'Perio Probing' : 'عمق الجيوب اللثوية'}</span>
        <span className="sv-chip"><CheckCircle2 size={11} /> {en ? 'Staged Treatment' : 'خطة علاج مرحلية'}</span>
        <span className="sv-chip"><Eye size={11} /> {en ? 'Sensor TWAIN' : 'ربط الحساسات المباشر'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   5. TELE: Tele-Radiology & Cloud Diagnostics Visual
   ========================================================================= */
function TeleRadiologyVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-tele">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-indigo">CLOUD TELE-RAD</span>
          <span className="sv-meta-text">{en ? 'ZERO-FOOTPRINT GATEWAY' : 'بوابة القراءة والتشخيص السحابي'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-pulse-indicator" />
          <span className="sv-meta-code">TLS 1.3 / E2EE</span>
        </div>
      </div>

      <div className="sv-tele-network">
        {/* Hub Diagram */}
        <div className="sv-tele-node hub">
          <Hospital size={16} />
          <span>{en ? 'Regional Hospital' : 'المستشفى المركزي'}</span>
          <small>DICOM Origin</small>
        </div>

        <div className="sv-tele-pipe">
          <div className="sv-pipe-signal" />
          <span className="sv-pipe-speed">1.4 Gbps</span>
        </div>

        <div className="sv-tele-node cloud">
          <Network size={18} />
          <span>VIARA CLOUD HUB</span>
          <small>{en ? 'Sub-200ms Latency' : 'نقل فوري فائق'}</small>
        </div>

        <div className="sv-tele-pipe">
          <div className="sv-pipe-signal reverse" />
          <span className="sv-pipe-speed">Zero-Loss</span>
        </div>

        <div className="sv-tele-node doctor">
          <Stethoscope size={16} />
          <span>{en ? 'Remote Radiologist' : 'استشاري الأشعة'}</span>
          <small>Diagnostic Workstation</small>
        </div>
      </div>

      <div className="sv-tele-metrics">
        <div className="sv-tmetric">
          <strong>99.99%</strong>
          <span>{en ? 'Uptime SLA' : 'جاهزية السحابة'}</span>
        </div>
        <div className="sv-tmetric">
          <strong>&lt; 15 min</strong>
          <span>{en ? 'STAT Turnaround' : 'زمن الحالات الحرجة'}</span>
        </div>
        <div className="sv-tmetric">
          <strong>AES-256</strong>
          <span>{en ? 'Encrypted Stream' : 'تشفير متقدم'}</span>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Video size={11} /> {en ? 'Peer Review' : 'استشارة ثانوية فورية'}</span>
        <span className="sv-chip"><ShieldCheck size={11} /> {en ? 'HIPAA / ISO 27001' : 'مطابقة المعايير'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   6. HIS: Hospital Information System & Inpatient Bed Census Visual
   ========================================================================= */
function HisVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-his">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-blue">ENTERPRISE HIS</span>
          <span className="sv-meta-text">{en ? 'WARD & BED MANAGEMENT' : 'إدارة الأجنحة والأسرّة'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-code">{en ? 'CENSUS: 89.2%' : 'الإشغال: 89.2%'}</span>
        </div>
      </div>

      <div className="sv-his-bed-matrix">
        {[
          { bed: 'ICU-01', pt: '#8412', status: 'critical', vitals: 'HR 92 · BP 118/74' },
          { bed: 'ICU-02', pt: '#8415', status: 'critical', vitals: 'HR 88 · SpO2 99%' },
          { bed: 'SURG-04', pt: '#8399', status: 'occupied', vitals: 'Post-Op Day 1' },
          { bed: 'SURG-05', pt: '#8401', status: 'occupied', vitals: 'Discharge Prep' },
          { bed: 'CARD-08', pt: '#8420', status: 'occupied', vitals: 'Telemetry Active' },
          { bed: 'CARD-09', pt: 'OPEN', status: 'available', vitals: 'Sanitized · Ready' },
        ].map(item => (
          <div key={item.bed} className={`sv-bed-card ${item.status}`}>
            <div className="sv-bed-head">
              <strong>{item.bed}</strong>
              <span className={`sv-dot ${item.status}`} />
            </div>
            <div className="sv-bed-pt">{item.pt}</div>
            <div className="sv-bed-vitals">{item.vitals}</div>
          </div>
        ))}
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Hospital size={11} /> {en ? '240 Beds Tracked' : '240 سريراً مفعلاً'}</span>
        <span className="sv-chip"><Workflow size={11} /> {en ? 'Live ADT Feeds' : 'حركة الدخول والخروج'}</span>
        <span className="sv-chip"><ShieldCheck size={11} /> {en ? 'Joint Commission' : 'معايير الاعتماد'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   7. EHR: Electronic Health Records & CPOE Safety Visual
   ========================================================================= */
function EhrVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-ehr">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-cyan">CPOE / CDSS</span>
          <span className="sv-meta-text">{en ? 'LONGITUDINAL PATIENT CHART' : 'السجل الطبي الموحد'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-badge-urgent">{en ? 'SAFETY GUARD' : 'أمان دوائي'}</span>
        </div>
      </div>

      <div className="sv-ehr-body">
        <div className="sv-ehr-vitals-strip">
          <div className="v-stat">
            <small>BP</small>
            <b>120/80</b>
          </div>
          <div className="v-stat">
            <small>HR</small>
            <b>74 <small>bpm</small></b>
          </div>
          <div className="v-stat">
            <small>SpO2</small>
            <b>99%</b>
          </div>
          <div className="v-stat">
            <small>GLU</small>
            <b>102 <small>mg/dL</small></b>
          </div>
        </div>

        {/* CPOE Drug Alert Warning */}
        <div className="sv-ehr-alert">
          <AlertTriangle size={15} className="alert-icon" />
          <div className="alert-copy">
            <strong>{en ? 'Interaction Detected: Warfarin + Ibuprofen' : 'تنبيه تفاعل دوائي: وارفارين + بروفين'}</strong>
            <span>{en ? 'High bleeding risk. Alternative analgesia suggested.' : 'خطر نزيف مرتفع. يقترح النظام بديلاً آمناً فوراً.'}</span>
          </div>
        </div>

        {/* Encounter Timeline Item */}
        <div className="sv-ehr-timeline-row">
          <span className="tl-badge">{en ? 'TODAY' : 'اليوم'}</span>
          <span className="tl-text">{en ? 'Cardiology Encounter · Echocardiogram Review' : 'عيادة القلب · مراجعة فحص الإيكو والجرعات'}</span>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Stethoscope size={11} /> {en ? 'ICD-10 / SNOMED' : 'ترميز طبي آلي'}</span>
        <span className="sv-chip"><ShieldCheck size={11} /> {en ? 'Allergy Radar' : 'فحص الحساسية'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   8. LIS: Laboratory Information System & Analyzer Pipeline Visual
   ========================================================================= */
function LisVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-lis">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-teal">ASTM / HL7</span>
          <span className="sv-meta-text">{en ? 'ANALYZER AUTOMATION' : 'ربط أجهزة التحليل الآلية'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-pulse-indicator" />
          <span className="sv-meta-code">ROCHE COBAS · BI-DIR</span>
        </div>
      </div>

      <div className="sv-lis-pipeline">
        <div className="sv-lis-step complete">
          <span className="step-num">01</span>
          <strong>{en ? 'Barcode Scan' : 'باركود العينة'}</strong>
          <small>#LAB-90412</small>
        </div>
        <span className="pipe-arrow">→</span>
        <div className="sv-lis-step active">
          <span className="step-num">02</span>
          <strong>{en ? 'Analyzer Run' : 'جهاز التحليل'}</strong>
          <small>Chemistry 8/8</small>
        </div>
        <span className="pipe-arrow">→</span>
        <div className="sv-lis-step verified">
          <span className="step-num">03</span>
          <strong>{en ? 'Delta Check' : 'مطابقة النتائج'}</strong>
          <small>Normal Range</small>
        </div>
        <span className="pipe-arrow">→</span>
        <div className="sv-lis-step release">
          <span className="step-num">04</span>
          <strong>{en ? 'Auto Release' : 'اعتماد ونشر'}</strong>
          <small>SMS + Portal</small>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><TestTube2 size={11} /> {en ? 'Bidirectional Interfacing' : 'ربط ثنائي الاتجاه'}</span>
        <span className="sv-chip"><AlertTriangle size={11} /> {en ? 'Critical Panic Alerts' : 'تنبيه القيم الحرجة'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   9. RCM: Revenue Cycle Management & NPHIES Visual
   ========================================================================= */
function RcmVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-rcm">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-emerald">NPHIES READY</span>
          <span className="sv-meta-text">{en ? 'REAL-TIME CLAIM SCRUBBING' : 'فحص وتدقيق المطالبات الآلي'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-code">99.2% Clean Claims</span>
        </div>
      </div>

      <div className="sv-rcm-metrics">
        <div className="rcm-stat-box">
          <div className="rcm-num">99.2%</div>
          <div className="rcm-lbl">{en ? 'First-Pass Rate' : 'قبول المطالبة من أول إرسال'}</div>
          <div className="rcm-bar"><div className="rcm-bar-fill" style={{ width: '99.2%' }} /></div>
        </div>

        <div className="rcm-stat-box">
          <div className="rcm-num">8.2 sec</div>
          <div className="rcm-lbl">{en ? 'Prior-Auth Speed' : 'زمن الموافقة الطبية'}</div>
          <div className="rcm-bar"><div className="rcm-bar-fill" style={{ width: '94%' }} /></div>
        </div>

        <div className="rcm-stat-box highlight">
          <div className="rcm-num">0%</div>
          <div className="rcm-lbl">{en ? 'Coding Errors' : 'أخطاء ترميز مستبعدة'}</div>
          <div className="rcm-bar"><div className="rcm-bar-fill" style={{ width: '100%' }} /></div>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><DollarSign size={11} /> {en ? 'E-Invoicing Compliant' : 'فوترة إلكترونية متوافقة'}</span>
        <span className="sv-chip"><ShieldCheck size={11} /> {en ? 'Rejection Prevention' : 'منع الاستقطاعات'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   10. CMS: Clinic Management System & Queue Visual
   ========================================================================= */
function CmsVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-cms">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-blue">CLINIC SUITE</span>
          <span className="sv-meta-text">{en ? 'OUTPATIENT & QUEUE ENGINE' : 'شاشة العيادات والانتظار الذكي'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-code">4 Clinics Active</span>
        </div>
      </div>

      <div className="sv-cms-queue">
        <div className="q-card active">
          <div className="q-ticket">#A-104</div>
          <div className="q-info">
            <strong>{en ? 'Cardiology Clinic' : 'عيادة القلب'}</strong>
            <small>Dr. Sarah · Room 201</small>
          </div>
          <span className="q-status">{en ? 'In Consult' : 'داخل العيادة'}</span>
        </div>

        <div className="q-card next">
          <div className="q-ticket">#B-208</div>
          <div className="q-info">
            <strong>{en ? 'Orthopedics' : 'عيادة العظام'}</strong>
            <small>Dr. Khalid · Room 105</small>
          </div>
          <span className="q-status">{en ? 'Called' : 'يُرجى الدخول'}</span>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Building2 size={11} /> {en ? 'Multi-Branch' : 'دعم الفروع المتعددة'}</span>
        <span className="sv-chip"><Smartphone size={11} /> {en ? 'WhatsApp Reminders' : 'تذكير واتساب آلي'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   11. OR: Operating Rooms & ICU Theater Visual
   ========================================================================= */
function OrVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-or">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-cyan">SURGICAL SUITE</span>
          <span className="sv-meta-text">{en ? 'OR SCHEDULING & SAFETY' : 'قائمة العمليات الجراحية'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-status-pill in-progress">{en ? 'OR-1 ACTIVE' : 'غرفة 1 تعمل'}</span>
        </div>
      </div>

      <div className="sv-or-body">
        <div className="or-case-card">
          <div className="or-head">
            <strong>OR Suite 1 · Laparoscopic Cholecystectomy</strong>
            <span>Elapsed: 42m</span>
          </div>
          <div className="or-steps">
            <span className="step-tag done">✓ Sign-In</span>
            <span className="step-tag done">✓ Time-Out</span>
            <span className="step-tag current">● Procedure</span>
            <span className="step-tag pending">○ Sign-Out</span>
          </div>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><ShieldCheck size={11} /> WHO Surgical Checklist</span>
        <span className="sv-chip"><Activity size={11} /> Anesthesia Telemetry</span>
      </div>
    </div>
  );
}

/* =========================================================================
   12. PHARM: Pharmacy & Smart Dispensing Visual
   ========================================================================= */
function PharmVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-pharm">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-teal">SMART PHARMACY</span>
          <span className="sv-meta-text">{en ? 'E-PRESCRIPTION DISPENSING' : 'الصرف الدوائي الإلكتروني'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-code">Wasfaty Compatible</span>
        </div>
      </div>

      <div className="sv-pharm-body">
        <div className="rx-item">
          <div className="rx-code">RX-49102</div>
          <div className="rx-details">
            <strong>Augmentin 1g · 14 Tab</strong>
            <span>Sig: 1 tab BID · Verified by Pharmacist</span>
          </div>
          <span className="rx-badge ready">{en ? 'Dispensed' : 'تم الصرف'}</span>
        </div>
        <div className="rx-item">
          <div className="rx-code">RX-49103</div>
          <div className="rx-details">
            <strong>Atorvastatin 20mg · 30 Tab</strong>
            <span>Batch #BT-9021 · Expiry: 2028-11</span>
          </div>
          <span className="rx-badge in-prep">{en ? 'In Queue' : 'قيد التجهيز'}</span>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><ShieldCheck size={11} /> Cold-Chain Log</span>
        <span className="sv-chip"><Workflow size={11} /> Barcode Double-Check</span>
      </div>
    </div>
  );
}

/* =========================================================================
   13. BI: Executive Hospital Analytics Visual
   ========================================================================= */
function BiVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-bi">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-indigo">EXECUTIVE BI</span>
          <span className="sv-meta-text">{en ? 'OPERATIONAL COCKPIT' : 'لوحة المؤشرات والقيادة'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-code">Real-Time Refresh</span>
        </div>
      </div>

      <div className="sv-bi-charts">
        <div className="bi-metric">
          <small>{en ? 'Bed Turn Rate' : 'معدل دوران الأسرّة'}</small>
          <strong>4.2x</strong>
          <span className="bi-gain">↑ 18%</span>
        </div>
        <div className="bi-metric">
          <small>{en ? 'Avg Length of Stay' : 'متوسط مدة الإقامة'}</small>
          <strong>2.8d</strong>
          <span className="bi-gain">↓ 14%</span>
        </div>
        <div className="bi-metric">
          <small>{en ? 'Scanner Utilization' : 'كفاءة تشغيل الأجهزة'}</small>
          <strong>91.4%</strong>
          <span className="bi-gain">Optimal</span>
        </div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Activity size={11} /> Automated Financial KPI</span>
        <span className="sv-chip"><Building2 size={11} /> Branch Benchmarking</span>
      </div>
    </div>
  );
}

/* =========================================================================
   14. INTEROP: FHIR & HL7 Gateway Visual
   ========================================================================= */
function InteropVisual({ en, interactive }: { en: boolean; interactive: boolean }) {
  return (
    <div className="sv-frame sv-interop">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-cyan">HL7 FHIR R4</span>
          <span className="sv-meta-text">{en ? 'INTEGRATION ENGINE' : 'محرك الربط والتكامل الصحي'}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-pulse-indicator" />
          <span className="sv-meta-code">IHE PIX/PDQ</span>
        </div>
      </div>

      <div className="sv-interop-pipes">
        <div className="in-box">HIS (ADT)</div>
        <div className="in-pipe active">FHIR R4</div>
        <div className="in-box center">VIARA HUB</div>
        <div className="in-pipe active">DICOMweb</div>
        <div className="in-box">PACS / AI</div>
      </div>

      <div className="sv-bottom-strip">
        <span className="sv-chip"><Network size={11} /> RESTful FHIR API</span>
        <span className="sv-chip"><ShieldCheck size={11} /> TLS 1.3 / mTLS</span>
      </div>
    </div>
  );
}

/* =========================================================================
   15. PATH: Pathology Visual
   ========================================================================= */
function PathVisual({ en }: { en: boolean; interactive?: boolean }) {
  return (
    <div className="sv-frame sv-path">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-violet">DIGITAL PATHOLOGY</span>
          <span className="sv-meta-text">{en ? 'WHOLE SLIDE IMAGING' : 'شرائح الأنسجة الرقمية'}</span>
        </div>
        <div className="sv-meta-right"><span className="sv-meta-code">40x Scanner</span></div>
      </div>
      <div className="sv-path-slide">
        <div className="slide-box">
          <Microscope size={28} className="slide-icon" />
          <span>{en ? 'Biopsy Slide #PT-192 · H&E Stain' : 'شريحة عينة نسيجية · صبغة H&E'}</span>
        </div>
      </div>
      <div className="sv-bottom-strip">
        <span className="sv-chip"><Microscope size={11} /> WSI Viewer</span>
        <span className="sv-chip"><FileText size={11} /> Synoptic Reporting</span>
      </div>
    </div>
  );
}

/* =========================================================================
   16. BLOOD: Blood Bank Visual
   ========================================================================= */
function BloodVisual({ en }: { en: boolean; interactive?: boolean }) {
  return (
    <div className="sv-frame sv-blood">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-urgent">BLOOD BANK</span>
          <span className="sv-meta-text">{en ? 'VEIN-TO-VEIN TRACEABILITY' : 'تتبع فصائل الدم والمخزون'}</span>
        </div>
        <div className="sv-meta-right"><span className="sv-meta-code">ISBT 128</span></div>
      </div>
      <div className="sv-blood-units">
        <div className="unit-card"><span className="blood-type">O+</span><small>Packed RBCs (18u)</small></div>
        <div className="unit-card"><span className="blood-type">A+</span><small>Fresh Plasma (12u)</small></div>
        <div className="unit-card alert"><span className="blood-type">AB-</span><small>Critical (2u left)</small></div>
      </div>
      <div className="sv-bottom-strip">
        <span className="sv-chip"><ShieldCheck size={11} /> Crossmatch Verification</span>
        <span className="sv-chip"><Clock size={11} /> Expiry Tracker</span>
      </div>
    </div>
  );
}

/* =========================================================================
   Generic Fallback for Other Systems
   ========================================================================= */
function GenericMedicalVisual({ id, category, en }: { id: string; category: string; en: boolean }) {
  return (
    <div className="sv-frame sv-generic">
      <div className="sv-meta-bar">
        <div className="sv-meta-left">
          <span className="sv-badge sv-badge-cyan">{id}</span>
          <span className="sv-meta-text">{category.toUpperCase()}</span>
        </div>
        <div className="sv-meta-right">
          <span className="sv-pulse-indicator" />
          <span className="sv-meta-code">ENTERPRISE READY</span>
        </div>
      </div>
      <div className="sv-generic-center">
        <div className="sv-generic-icon-ring">
          <Activity size={32} />
        </div>
        <strong>{id} · VIARA MEDICAL SUITE</strong>
        <span>{en ? 'Integrated Workflow Architecture' : 'بنية برمجية طبية متصلة ومعتمدة'}</span>
      </div>
      <div className="sv-bottom-strip">
        <span className="sv-chip"><ShieldCheck size={11} /> HIPAA Compliant</span>
        <span className="sv-chip"><Zap size={11} /> Cloud & On-Premise</span>
      </div>
    </div>
  );
}
