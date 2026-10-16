'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpLeft, Menu, X, Globe2, ArrowUpRight, HeartPulse, ScanLine, Layers3, Network, ExternalLink } from 'lucide-react';
import type { Locale, SiteContent } from '../lib/site-content';
import { healthcareCategories } from '../lib/healthcare-catalog.mjs';
import './care-design.css';

export default function CareFrame({ content, locale, current = 'home', alternatePath, children }: { content: SiteContent; locale: Locale; current?: 'home' | 'systems' | 'planning' | 'about'; alternatePath?: string; children: ReactNode }) {
  const en = locale === 'en', home = en ? '/en' : '/', prefix = en ? '/en' : '';
  const t = (ar: string, english: string) => en ? english : ar;
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const header = useRef<HTMLElement>(null), toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false); };
    const media = matchMedia('(min-width: 1001px)'), resize = () => { if (media.matches) setOpen(false); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside); media.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); media.removeEventListener('change', resize); };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) { setScrollProgress(0); return; }
      const progress = (window.scrollY / scrollable) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryIcons = [HeartPulse, ScanLine, Layers3, Network];

  const brand = <><img src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo} width={46} height={40} alt="" /><span>{content.brand.name}<small>HEALTHCARE TECHNOLOGY</small></span></>;
  const links = [
    { id: 'home', href: home, label: t('الرئيسية', 'Home') },
    { id: 'systems', href: `${prefix}/systems`, label: t('أنظمة الرعاية', 'Care systems') },
    { id: 'planning', href: `${prefix}/planning`, label: t('الخطط والتشغيل', 'Plans & Rollout') },
    { id: 'about', href: `${prefix}/about`, label: t('عن VIARA', 'About VIARA') },
  ];
  const alternate = alternatePath || (current === 'home' ? en ? '/' : '/en' : `${en ? '' : '/en'}/${current}`);
  return <div className="care-site" dir={en ? 'ltr' : 'rtl'} lang={locale}>
    <div className="care-scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
    <a href="#main" className="care-skip">{t('انتقل إلى المحتوى', 'Skip to content')}</a>
    <header className="care-header" ref={header}><div className="care-wrap care-header-row">
      <a href={home} className="care-brand" aria-label={content.brand.name}>{brand}</a>
      <nav id="care-navigation" className={`care-navigation ${open ? 'is-open' : ''}`} aria-label={t('التنقل الرئيسي', 'Main navigation')}>
        {links.map(link => {
          if (link.id === 'systems') {
            return (
              <div key={link.id} className="care-nav-item">
                <a href={link.href} aria-current={current === link.id ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</a>
                <div className="care-nav-dropdown" role="menu">
                  {healthcareCategories.map((cat, i) => {
                    const Icon = categoryIcons[i] ?? HeartPulse;
                    return (
                      <a key={cat.id} href={`${prefix}/systems#${cat.id}`} className="care-nav-dropdown-card" role="menuitem" onClick={() => setOpen(false)}>
                        <div className="care-nav-dropdown-icon"><Icon size={20} /></div>
                        <h4>{en ? cat.name.en : cat.name.ar}</h4>
                        <p>{en ? `Explore ${cat.name.en.toLowerCase()} systems` : `استكشف أنظمة ${cat.name.ar}`}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          }
          return <a key={link.id} href={link.href} aria-current={current === link.id ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</a>;
        })}
      </nav>
      <div className="care-header-actions"><a className="care-language" href={alternate} hrefLang={en ? 'ar' : 'en'}><Globe2 size={16} /><span>{en ? 'العربية' : 'EN'}</span></a><a className="care-btn care-btn-small" href={`${home}#contact`}>{t('لنتحدث', "Let\u2019s talk")}{en ? <ArrowUpRight size={16} /> : <ArrowUpLeft size={16} />}</a><button className="care-menu" type="button" ref={toggle} aria-expanded={open} aria-controls="care-navigation" aria-label={t('القائمة', 'Menu')} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    </div></header>
    <main id="main">{children}</main>
    <footer className="care-footer"><div className="care-wrap"><div className="care-footer-top">
      <div>
        <a className="care-brand" href={home}>{brand}</a>
        <p>{t('منظومة صحية متكاملة. رعاية أقرب من أي وقت.', 'Integrated health technology. Closer care, every time.')}</p>
      </div>
      <div>
        <b>{t('استكشف', 'Explore')}</b>
        {links.map(link => <a key={link.id} href={link.href}>{link.label}</a>)}
      </div>
      <div>
        <b>{t('ابدأ اليوم', 'Start today')}</b>
        <a href={`${home}#contact`}>{t('احجز جلسة استشارية', 'Book a consultation')}</a>
        <a href={`${prefix}/requests`}>{t('متابعة طلباتي', 'My requests')}</a>
        {content.contact.email && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}
        <form
          className="care-footer-newsletter"
          onSubmit={(e) => e.preventDefault()}
          aria-label={t('النشرة البريدية', 'Newsletter signup')}
        >
          <label htmlFor="footer-email" style={{ display: 'none' }}>{t('البريد الإلكتروني', 'Email address')}</label>
          <input
            id="footer-email"
            type="email"
            className="care-newsletter-input"
            placeholder={t('بريدك الإلكتروني', 'Your email address')}
            autoComplete="email"
          />
          <button type="submit" className="care-newsletter-btn">{t('اشترك', 'Subscribe')}</button>
        </form>
        <div className="care-footer-social" aria-label={t('روابط التواصل الاجتماعي', 'Social media links')}>
          {content.contact.facebook && (
            <a href={content.contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <ExternalLink size={16} />
            </a>
          )}
          {content.contact.instagram && (
            <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <ExternalLink size={16} />
            </a>
          )}
          {content.contact.linkedin && (
            <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <ExternalLink size={16} />
            </a>
          )}
          {content.contact.x && (
            <a href={content.contact.x} target="_blank" rel="noopener noreferrer" aria-label="X">
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div><div className="care-footer-bottom"><span>© {new Date().getFullYear()} {content.brand.name}</span><span>{t('صُمم لتجربة عربية وإنجليزية.', 'Designed for Arabic and English.')}</span></div></div></footer>
  </div>;
}
