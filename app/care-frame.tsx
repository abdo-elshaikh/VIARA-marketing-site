'use client';
import Link from 'next/link';
import { type ComponentType, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { Facebook, Instagram, Linkedin, Youtube, XIcon, WhatsApp, Telegram, Snapchat, Github } from './social-icons';
import { SiteCopyProvider, useSiteText } from '../lib/site-copy';
import { getNavLinks } from '../lib/nav';
import SiteHeader, { type SitePage } from './site-header';
import BackToTop from './back-to-top';
import './care-design.css';
import './regional-design.css';
import './professional-design.css';

const socialIconMap: Record<string, ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  x: XIcon,
  whatsapp: WhatsApp,
  telegram: Telegram,
  snapchat: Snapchat,
  github: Github,
};

export default function CareFrame({ content, locale, current = 'home', alternatePath, children }: { content: SiteContent; locale: Locale; current?: SitePage; alternatePath?: string; children: ReactNode }) {
  const en = locale === 'en', home = en ? '/en' : '/', prefix = en ? '/en' : '';
  const t = useSiteText(locale, content);
  const brand = <><img src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo} width={46} height={40} alt="" /><span>{content.brand.name}<small>{t('أنظمة الأشعة والمراكز الطبية', 'RADIOLOGY & MEDICAL CENTER SYSTEMS')}</small></span></>;
  const links = getNavLinks(locale);
  const alternate = alternatePath || (current === 'home' ? en ? '/' : '/en' : `${en ? '' : '/en'}/${current}`);
  return <SiteCopyProvider content={content}><div className="care-site viara-professional" dir={en ? 'ltr' : 'rtl'} lang={locale} style={{ '--care-green': content.brand.primary } as React.CSSProperties}>
    <a href="#main" className="care-skip">{t('انتقل إلى المحتوى', 'Skip to content')}</a>
    <SiteHeader content={content} locale={locale} current={current} alternateHref={alternate} />
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="care-footer">
      {/* ── Decorative Authentic Arabic Girih & DICOM Radiology Layer ── */}
      <div className="care-footer-decor" aria-hidden="true">
        {/* Top Islamic Girih Ribbon Frieze */}
        <svg className="care-footer-frieze" viewBox="0 0 1200 18" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="cff-frieze" x="0" y="0" width="40" height="18" patternUnits="userSpaceOnUse">
              <g fill="none">
                <polygon points="20,2 24,7 30,7 26,11 28,16 20,13 12,16 14,11 10,7 16,7" stroke="#00a886" strokeWidth="0.8" opacity="0.45" />
                <line x1="0" y1="9" x2="40" y2="9" stroke="#f6c747" strokeWidth="0.6" opacity="0.35" strokeDasharray="2 3" />
                <circle cx="20" cy="9" r="1.3" fill="#f6c747" opacity="0.85" />
              </g>
            </pattern>
          </defs>
          <rect width="1200" height="18" fill="url(#cff-frieze)" />
        </svg>

        {/* Corner Arabesque 8-Pointed Star Rosette */}
        <svg className="care-footer-arabesque" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#00a886" transform="translate(170, 170)">
            <circle cx="0" cy="0" r="150" strokeWidth="0.75" opacity="0.25" strokeDasharray="3 4" />
            <circle cx="0" cy="0" r="125" strokeWidth="1" opacity="0.35" />
            <circle cx="0" cy="0" r="95" strokeWidth="0.8" stroke="#f6c747" opacity="0.4" strokeDasharray="5 3" />
            <circle cx="0" cy="0" r="65" strokeWidth="0.75" opacity="0.3" />

            {/* Primary 8-pointed star rosette */}
            <polygon
              points="0,-90 24,-36 80,-36 40,-6 56,48 0,16 -56,48 -40,-6 -80,-36 -24,-36"
              strokeWidth="1.2"
              opacity="0.6"
            />
            {/* Secondary interlace */}
            <polygon
              points="0,-65 17,-26 58,-26 29,-4 40,35 0,12 -40,35 -29,-4 -58,-26 -17,-26"
              stroke="#f6c747"
              strokeWidth="0.9"
              opacity="0.5"
            />
            <circle cx="0" cy="0" r="5" fill="#f6c747" opacity="0.85" />
          </g>
        </svg>

        {/* Opposite Corner DICOM Radiology Gantry Reticle */}
        <svg className="care-footer-radiology" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#f6c747" transform="translate(160, 160)">
            <circle cx="0" cy="0" r="140" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r="115" strokeWidth="1" stroke="#00a886" opacity="0.3" />
            <circle cx="0" cy="0" r="85" strokeWidth="0.75" opacity="0.25" />
            <circle cx="0" cy="0" r="50" strokeWidth="0.7" stroke="#00a886" opacity="0.3" strokeDasharray="2 2" />
            {/* Crosshairs */}
            <line x1="0" y1="-135" x2="0" y2="-20" strokeWidth="0.9" opacity="0.35" strokeDasharray="3 2" />
            <line x1="0" y1="20" x2="0" y2="135" strokeWidth="0.9" opacity="0.35" strokeDasharray="3 2" />
            <line x1="-135" y1="0" x2="-20" y2="0" strokeWidth="0.9" opacity="0.35" strokeDasharray="3 2" />
            <line x1="20" y1="0" x2="135" y2="0" strokeWidth="0.9" opacity="0.35" strokeDasharray="3 2" />
            <circle cx="0" cy="0" r="3.5" fill="#f6c747" opacity="0.75" />
          </g>
        </svg>
      </div>

      <div className="care-wrap"><div className="care-footer-top">
        <div><Link className="care-brand" href={home}>{brand}</Link><p>{txt(content.brand.tagline, locale)}</p>{content.company.offices.some(o => o.enabled) && <div className="care-footer-hubs">{content.company.offices.filter(o => o.enabled).map(o => <span key={o.id}>{txt(o.name, locale)}</span>)}</div>}</div>
        <div><b>{t('استكشف', 'Explore')}</b>{links.map(link => <Link key={link.id} href={link.href}>{link.label}</Link>)}<Link href={`${prefix}/privacy`}>{t('سياسة الخصوصية', 'Privacy Policy')}</Link></div>
        <div><b>{t('تواصل معنا', 'Contact us')}</b><Link href={`${home}#contact`}>{t('ناقش احتياجات منشأتك', 'Discuss your facility needs')}</Link><Link href={`${prefix}/requests`}>{t('متابعة طلباتي', 'My requests')}</Link>{content.contact.phone && <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`}><bdi>{content.contact.phone}</bdi></a>}{content.contact.email && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}{txt(content.contact.address, locale) && <p>{txt(content.contact.address, locale)}</p>}
        <div className="care-footer-social">{(['facebook','instagram','linkedin','youtube','x','telegram','snapchat','github'] as const).filter(key => content.contact[key]).map(key => { const Icon = socialIconMap[key] || ExternalLink; const socialNames: Record<string, [string, string]> = { facebook: ['فيسبوك', 'Facebook'], instagram: ['إنستغرام', 'Instagram'], linkedin: ['لينكدإن', 'LinkedIn'], youtube: ['يوتيوب', 'YouTube'], x: ['منصة X', 'X'], telegram: ['تيليغرام', 'Telegram'], snapchat: ['سناب شات', 'Snapchat'], github: ['جيت هاب', 'GitHub'] }; const [arName, enName] = socialNames[key] || [key, key]; return <a key={key} href={content.contact[key]} aria-label={en ? enName : arName} title={en ? enName : arName} target="_blank" rel="noopener noreferrer"><Icon size={17} /></a>; })}{content.contact.whatsapp && <a href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`} aria-label={t('واتساب', 'WhatsApp')} title={t('واتساب', 'WhatsApp')} target="_blank" rel="noopener noreferrer"><WhatsApp size={17} /></a>}</div></div>
      </div><div className="care-footer-bottom"><div className="care-footer-bottom-brand"><span>© {new Date().getFullYear()} {content.brand.name}</span><span className="care-footer-bottom-sep" aria-hidden="true">·</span><Link href={`${prefix}/privacy`} className="care-footer-privacy-link">{t('سياسة الخصوصية', 'Privacy Policy')}</Link></div><span className="care-footer-radiology-tag">{t('حلول متخصصة للأشعة وتشغيل المراكز الطبية', 'Purpose-built systems for radiology and medical centers')}</span><span>{t('صُمم لتجربة عربية وإنجليزية.', 'Designed for Arabic and English.')}</span></div></div></footer>
    <BackToTop locale={locale} />
  </div></SiteCopyProvider>;
}
