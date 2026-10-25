'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Locale } from '../lib/site-content';
import './brand-page-hero.css';

type Kind = 'home' | 'systems' | 'planning' | 'journeys' | 'about' | 'product' | 'requests' | 'privacy' | 'not-found';
type Props = {
  locale: Locale;
  kind: Kind;
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  description: string;
  children?: ReactNode;
  pageLabel?: string;
  breadcrumbs?: { label: string; href?: string }[];
  note?: string;
};

export default function BrandPageHero({
  locale,
  kind,
  eyebrow,
  title,
  accent,
  description,
  children,
  pageLabel,
  breadcrumbs,
  note,
}: Props) {
  const en = locale === 'en', home = en ? '/en' : '/';
  const labels: Record<Kind, string> = {
    home: en ? 'Home' : 'الرئيسية',
    systems: en ? 'Systems' : 'الأنظمة',
    planning: en ? 'Scope & rollout' : 'النطاق والتنفيذ',
    journeys: en ? 'Workflows' : 'سير العمل',
    about: en ? 'About VIARA' : 'عن VIARA',
    product: en ? 'System details' : 'تفاصيل النظام',
    requests: en ? 'My requests' : 'طلباتي',
    privacy: en ? 'Privacy policy' : 'سياسة الخصوصية',
    'not-found': '404',
  };


  const Arrow = en ? ArrowRight : ArrowLeft;
  const trail = breadcrumbs || [{ label: pageLabel || labels[kind] }];

  return (
    <section
      className={`br-page-hero br-unified-hero br-page-hero-${kind}`}
      aria-labelledby="br-page-title"
    >
      {/* ── Decorative background: Authentic Arabic Girih geometry + DICOM Radiology fusion ── */}
      <div className="br-hero-decor" aria-hidden="true">

        {/* 1. Islamic Geometric Girih Pattern (8-pointed star rosette with 45° strapwork & gold nodes) */}
        <svg
          className="br-decor-arabesque"
          viewBox="0 0 1200 400"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Seamless 80×80 Islamic Girih Octagram Tile */}
            <pattern id="bph-girih-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <g fill="none">
                {/* Secondary fine diamond grid */}
                <path
                  d="M0,40 L40,0 L80,40 L40,80 Z"
                  stroke="#007b61"
                  strokeWidth="0.5"
                  opacity="0.14"
                />
                <path
                  d="M0,0 L80,80 M80,0 L0,80"
                  stroke="#007b61"
                  strokeWidth="0.4"
                  opacity="0.10"
                />

                {/* Primary 8-pointed Islamic Star (خاتم ثماني الأضلاع) */}
                <polygon
                  points="64,40 51.8,44.9 57,57 44.9,51.8 40,64 35.1,51.8 23,57 28.2,44.9 16,40 28.2,35.1 23,23 35.1,28.2 40,16 44.9,28.2 57,23 51.8,35.1"
                  stroke="#007b61"
                  strokeWidth="0.85"
                  opacity="0.32"
                />

                {/* Classical Girih Strapwork connecting to borders & adjacent tiles */}
                <line x1="40" y1="16" x2="40" y2="0" stroke="#007b61" strokeWidth="0.7" opacity="0.22" />
                <line x1="64" y1="40" x2="80" y2="40" stroke="#007b61" strokeWidth="0.7" opacity="0.22" />
                <line x1="40" y1="64" x2="40" y2="80" stroke="#007b61" strokeWidth="0.7" opacity="0.22" />
                <line x1="16" y1="40" x2="0" y2="40" stroke="#007b61" strokeWidth="0.7" opacity="0.22" />

                {/* Corner strapwork ribbons */}
                <line x1="57" y1="23" x2="80" y2="0" stroke="#007b61" strokeWidth="0.6" opacity="0.18" />
                <line x1="57" y1="57" x2="80" y2="80" stroke="#007b61" strokeWidth="0.6" opacity="0.18" />
                <line x1="23" y1="57" x2="0" y2="80" stroke="#007b61" strokeWidth="0.6" opacity="0.18" />
                <line x1="23" y1="23" x2="0" y2="0" stroke="#007b61" strokeWidth="0.6" opacity="0.18" />

                {/* Inner central octagram core */}
                <polygon
                  points="45,40 43.5,43.5 40,45 36.5,43.5 35,40 36.5,36.5 40,35 43.5,36.5"
                  stroke="#007b61"
                  strokeWidth="0.5"
                  opacity="0.26"
                />

                {/* Warm Gold geometric accent nodes (نوى هندسية مذهبة) */}
                <circle cx="40" cy="40" r="1.5" fill="#f6c747" opacity="0.55" />
                <circle cx="64" cy="40" r="1.1" fill="#f6c747" opacity="0.45" />
                <circle cx="16" cy="40" r="1.1" fill="#f6c747" opacity="0.45" />
                <circle cx="40" cy="16" r="1.1" fill="#f6c747" opacity="0.45" />
                <circle cx="40" cy="64" r="1.1" fill="#f6c747" opacity="0.45" />

                {/* Corner stars complementary vertices */}
                <circle cx="0" cy="0" r="1.3" fill="#007b61" opacity="0.25" />
                <circle cx="80" cy="0" r="1.3" fill="#007b61" opacity="0.25" />
                <circle cx="80" cy="80" r="1.3" fill="#007b61" opacity="0.25" />
                <circle cx="0" cy="80" r="1.3" fill="#007b61" opacity="0.25" />
              </g>
            </pattern>

            {/* Elliptical + Horizontal Mask: framing the hero perimeter while keeping central typography ultra clean */}
            <radialGradient id="bph-center-vignette" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.04" />
              <stop offset="42%" stopColor="#000" stopOpacity="0.18" />
              <stop offset="78%" stopColor="#fff" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </radialGradient>
            <mask id="bph-ornament-mask">
              <rect width="1200" height="400" fill="url(#bph-center-vignette)" />
            </mask>
          </defs>

          <rect
            width="1200"
            height="400"
            fill="url(#bph-girih-pattern)"
            mask="url(#bph-ornament-mask)"
            className="br-decor-girih-rect"
          />
        </svg>

        {/* 2. Precision DICOM Radiology Gantry Reticle with nested Arabesque Star Aperture */}
        <div className="br-decor-gantry" aria-hidden="true">
          <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
            <g className="br-gantry-rotating-group" transform-origin="160 160">
              {/* Outer scanning degree track */}
              <circle cx="160" cy="160" r="150" fill="none" stroke="#007b61" strokeWidth="0.8" opacity="0.22" strokeDasharray="3 4" />
              <circle cx="160" cy="160" r="134" fill="none" stroke="#007b61" strokeWidth="1.1" opacity="0.28" />
              <circle cx="160" cy="160" r="114" fill="none" stroke="#f6c747" strokeWidth="0.9" opacity="0.38" strokeDasharray="6 3" />
              <circle cx="160" cy="160" r="88" fill="none" stroke="#007b61" strokeWidth="0.85" opacity="0.30" />
              <circle cx="160" cy="160" r="62" fill="none" stroke="#007b61" strokeWidth="0.7" opacity="0.25" strokeDasharray="3 3" />

              {/* Goniometer degree tick marks every 30° & 45° */}
              {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const isMajor = deg % 90 === 0;
                const isSemi = !isMajor && deg % 45 === 0;
                const r1 = isMajor ? 122 : isSemi ? 125 : 128;
                const r2 = 134;
                const x1 = 160 + r1 * Math.cos(rad);
                const y1 = 160 + r1 * Math.sin(rad);
                const x2 = 160 + r2 * Math.cos(rad);
                const y2 = 160 + r2 * Math.sin(rad);
                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#f6c747' : '#007b61'}
                    strokeWidth={isMajor ? '1.5' : isSemi ? '1.1' : '0.8'}
                    opacity={isMajor ? '0.85' : isSemi ? '0.6' : '0.35'}
                  />
                );
              })}

              {/* Laser Collimator Crosshairs with center clearance */}
              <line x1="160" y1="26" x2="160" y2="120" stroke="#007b61" strokeWidth="0.95" opacity="0.4" strokeDasharray="4 2" />
              <line x1="160" y1="200" x2="160" y2="294" stroke="#007b61" strokeWidth="0.95" opacity="0.4" strokeDasharray="4 2" />
              <line x1="26" y1="160" x2="120" y2="160" stroke="#007b61" strokeWidth="0.95" opacity="0.4" strokeDasharray="4 2" />
              <line x1="200" y1="160" x2="294" y2="160" stroke="#007b61" strokeWidth="0.95" opacity="0.4" strokeDasharray="4 2" />

              {/* 45° Diagnostic Oblique Guidance lines */}
              <line x1="68" y1="68" x2="130" y2="130" stroke="#007b61" strokeWidth="0.7" opacity="0.25" />
              <line x1="190" y1="190" x2="252" y2="252" stroke="#007b61" strokeWidth="0.7" opacity="0.25" />
              <line x1="252" y1="68" x2="190" y2="130" stroke="#007b61" strokeWidth="0.7" opacity="0.25" />
              <line x1="130" y1="190" x2="68" y2="252" stroke="#007b61" strokeWidth="0.7" opacity="0.25" />

              {/* Degree Readouts along circumference */}
              <text x="160" y="146" fill="#007b61" fontSize="6.5" fontWeight="700" textAnchor="middle" opacity="0.55">0°</text>
              <text x="174" y="163" fill="#007b61" fontSize="6.5" fontWeight="700" textAnchor="start" opacity="0.55">90°</text>
              <text x="160" y="179" fill="#007b61" fontSize="6.5" fontWeight="700" textAnchor="middle" opacity="0.55">180°</text>
              <text x="146" y="163" fill="#007b61" fontSize="6.5" fontWeight="700" textAnchor="end" opacity="0.55">270°</text>
            </g>

            {/* Fixed Cardinal DICOM Anatomical Orientation Markers [A], [P], [R], [L] */}
            <g className="br-gantry-fiducials" fill="#007b61" fontSize="9" fontWeight="700" letterSpacing="0.5" textAnchor="middle" opacity="0.75">
              <rect x="150" y="5" width="20" height="15" rx="3" fill="#ffffff" stroke="#007b61" strokeWidth="0.75" opacity="0.9" />
              <text x="160" y="16">A</text>

              <rect x="150" y="300" width="20" height="15" rx="3" fill="#ffffff" stroke="#007b61" strokeWidth="0.75" opacity="0.9" />
              <text x="160" y="311">P</text>

              <rect x="5" y="152" width="20" height="15" rx="3" fill="#ffffff" stroke="#007b61" strokeWidth="0.75" opacity="0.9" />
              <text x="15" y="163">R</text>

              <rect x="295" y="152" width="20" height="15" rx="3" fill="#ffffff" stroke="#007b61" strokeWidth="0.75" opacity="0.9" />
              <text x="305" y="163">L</text>
            </g>

            {/* Seamless Synthesis: Authentic 8-pointed Islamic Girih rosette in the center of the gantry */}
            <g className="br-gantry-center-arabesque" transform="translate(160, 160)">
              <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#007b61" strokeWidth="1.2" opacity="0.92" />
              {/* Central 8-pointed star rosette */}
              <polygon
                points="0,-24 6,-10 20,-10 10,-2 14,12 0,4 -14,12 -10,-2 -20,-10 -6,-10"
                fill="none"
                stroke="#007b61"
                strokeWidth="1.3"
                opacity="0.75"
              />
              <polygon
                points="0,-16 4,-6 14,-6 7,-1 10,8 0,3 -10,8 -7,-1 -14,-6 -4,-6"
                fill="#007b61"
                opacity="0.14"
              />
              <circle cx="0" cy="0" r="3.5" fill="#f6c747" stroke="#007b61" strokeWidth="0.9" opacity="0.95" />
              <circle cx="0" cy="0" r="1.3" fill="#007b61" />
            </g>
          </svg>
        </div>

        {/* 3. Opposite Side Medical Field-Of-View / Laser Collimator Marks with Arabesque Rosette */}
        <div className="br-decor-collimator" aria-hidden="true">
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#007b61" fill="none">
              <path d="M10,35 L10,10 L35,10" strokeWidth="1.4" opacity="0.45" />
              <path d="M125,10 L150,10 L150,35" strokeWidth="1.4" opacity="0.45" />
              <path d="M10,125 L10,150 L35,150" strokeWidth="1.4" opacity="0.45" />
              <path d="M125,150 L150,150 L150,125" strokeWidth="1.4" opacity="0.45" />
              <line x1="80" y1="55" x2="80" y2="105" strokeWidth="0.9" opacity="0.32" strokeDasharray="3 2" />
              <line x1="55" y1="80" x2="105" y2="80" strokeWidth="0.9" opacity="0.32" strokeDasharray="3 2" />
              <circle cx="80" cy="80" r="22" strokeWidth="0.8" opacity="0.25" />
              <circle cx="80" cy="80" r="12" strokeWidth="0.7" opacity="0.28" strokeDasharray="2 2" stroke="#f6c747" />

              {/* Nested Arabesque mini-star */}
              <polygon
                points="80,72 82,77 88,77 84,80 85,86 80,83 75,86 76,80 72,77 78,77"
                stroke="#007b61"
                strokeWidth="0.8"
                opacity="0.45"
              />
              <circle cx="80" cy="80" r="1.5" fill="#f6c747" stroke="none" opacity="0.8" />
            </g>
            <text x="14" y="28" fill="#007b61" fontSize="7.5" fontWeight="700" letterSpacing="0.7" opacity="0.55">
              FOV 350mm
            </text>
            <text x="14" y="142" fill="#4a6358" fontSize="7" letterSpacing="0.4" opacity="0.5">
              VIARA / SYSTEMS
            </text>
          </svg>
        </div>

        {/* 4. Bottom Calibrated PACS Millimeter Metric Scale (مسطرة القياس الإشعاعي الدقيقة) */}
        <div className="br-decor-ruler" aria-hidden="true">
          <svg viewBox="0 0 1000 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Base line */}
            <line x1="0" y1="23" x2="1000" y2="23" stroke="#007b61" strokeWidth="1.1" opacity="0.28" />

            {/* Millimeter graduations across 1000 units */}
            {Array.from({ length: 101 }).map((_, i) => {
              const x = i * 10;
              const isMajor = i % 10 === 0;
              const isMedium = !isMajor && i % 5 === 0;
              const yTop = isMajor ? 7 : isMedium ? 12 : 17;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2="23"
                  stroke={isMajor ? '#007b61' : isMedium ? '#007b61' : '#007b61'}
                  strokeWidth={isMajor ? '1.2' : isMedium ? '0.8' : '0.5'}
                  opacity={isMajor ? '0.6' : isMedium ? '0.35' : '0.18'}
                />
              );
            })}

            {/* Metric numeric labels */}
            {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((val) => (
              <text
                key={val}
                x={val === 1000 ? 985 : val === 0 ? 12 : val}
                y="6"
                fill="#007b61"
                fontSize="6"
                fontWeight="700"
                textAnchor="middle"
                opacity="0.55"
                letterSpacing="0.3"
              >
                {val}mm
              </text>
            ))}
          </svg>
          <span className="br-ruler-tag" aria-hidden="true">
            SCALE 1:1 · DICOM CALIBRATED VIEWPORT
          </span>
        </div>

      </div>

      <div className="care-wrap br-hero-wrap">
        {kind !== 'home' && (
          <div className="br-breadcrumb-nav-wrap">
            <nav className="br-breadcrumb" aria-label={en ? 'Breadcrumb' : 'مسار الصفحة'}>
              <Link href={home} className="br-breadcrumb-link">{labels.home}</Link>
              {trail.map((item, index) => (
                <span className="br-breadcrumb-item" key={index}>
                  <Arrow size={12} className="br-breadcrumb-arrow" />
                  {item.href
                    ? <Link href={item.href} className="br-breadcrumb-link">{item.label}</Link>
                    : <span className="br-breadcrumb-current" aria-current={index === trail.length - 1 ? 'page' : undefined}>{item.label}</span>
                  }
                </span>
              ))}
            </nav>
          </div>
        )}

        <div className="br-unified-hero-body">
          <div className="br-eyebrow-row">
            <span className="br-eyebrow">
              <span className="br-radar-beacon" aria-hidden="true">
                <i className="br-radar-core" />
                <span className="br-radar-ring" />
              </span>
              {eyebrow}
            </span>

          </div>

          <h1 id="br-page-title">
            {title}
            {accent && <><br /><em>{accent}</em></>}
          </h1>

          <p>{description}</p>
          {note && <small className="br-hero-note">{note}</small>}
          {children && <div className="br-hero-actions">{children}</div>}
        </div>
      </div>
    </section>
  );
}
