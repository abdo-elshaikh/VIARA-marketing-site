'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, ArrowLeft, ArrowRight, Menu, X, Globe2, ChevronDown, ScanLine, Layers3, Building2, ClipboardList, Users, Sparkles } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { useSiteText } from '../lib/site-copy';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import { solutionPath } from '../lib/solutions';
import { getNavLinks } from '../lib/nav';
import './site-header.css';

export type SitePage = 'home' | 'systems' | 'planning' | 'about' | 'journeys' | 'requests' | 'privacy' | 'not-found';
export default function SiteHeader({ content, locale, current, alternateHref }: { content: SiteContent; locale: Locale; current: SitePage; alternateHref: string }) {
  const en = locale === 'en', home = en ? '/en' : '/', prefix = en ? '/en' : '';
  const t = useSiteText(locale, content), Arrow = en ? ArrowUpRight : ArrowUpLeft, Forward = en ? ArrowRight : ArrowLeft;
  const [open, setOpen] = useState(false), [systemsOpen, setSystemsOpen] = useState(false), [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null), menuButton = useRef<HTMLButtonElement>(null), systemsButton = useRef<HTMLButtonElement>(null);
  const products = marketingSystemIds.flatMap(id => content.products.filter(product => product.id === id && product.enabled));
  const icons: Record<string, typeof ScanLine> = { RIS: ScanLine, PACS: Layers3, AI: Sparkles, CMS: Building2, PORTAL: Users };
  const links = getNavLinks(locale, { includeCapabilities: true });
  const close = () => { setOpen(false); setSystemsOpen(false); };
  useEffect(() => {
    let frame = 0;
    const scroll = () => { if (!frame) frame = requestAnimationFrame(() => { setScrolled(window.scrollY > 12); frame = 0; }); };
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    if (!open && !systemsOpen) return;
    const key = (event: KeyboardEvent) => { if (event.key !== 'Escape') return; event.preventDefault(); if (systemsOpen) { setSystemsOpen(false); systemsButton.current?.focus(); } else { setOpen(false); menuButton.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !header.current?.contains(event.target)) close(); };
    const media = matchMedia('(min-width: 1151px)'), resize = () => close();
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside); media.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); media.removeEventListener('change', resize); };
  }, [open, systemsOpen]);
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);
  return <header className={`vh-header vh-signature ${scrolled ? 'is-scrolled' : ''}`} ref={header} onBlur={event => { if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <div className="care-wrap vh-header-row">
      <Link href={home} className="vh-brand" aria-label={`${content.brand.name} — ${t('الرئيسية', 'Home')}`} onClick={close}><span className="vh-brand-mark"><img src={content.brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : content.brand.logo} width={38} height={38} alt="" /></span><span className="vh-brand-name">{content.brand.name}<small>{t('أنظمة الأشعة والمراكز الطبية', 'RADIOLOGY & MEDICAL CENTERS')}</small></span></Link>
      <nav id="care-navigation" className={`vh-navigation ${open ? 'is-open' : ''}`} aria-label={t('التنقل الرئيسي', 'Main navigation')}>
        <span className="vh-navigation-label">{t('استكشف VIARA', 'EXPLORE VIARA')}</span>
        <div className="vh-navigation-links">{links.map(link => link.id === 'systems' ? <div className={`vh-systems ${systemsOpen ? 'is-expanded' : ''}`} key={link.id}><div className={`vh-nav-system-label ${current === 'systems' ? 'is-current' : ''}`}><Link href={link.href} aria-current={current === 'systems' ? 'page' : undefined} onClick={close}>{link.label}</Link><button ref={systemsButton} type="button" aria-label={t('عرض قائمة الأنظمة', 'Show systems list')} aria-expanded={systemsOpen} aria-controls="vh-system-links" onClick={() => setSystemsOpen(!systemsOpen)}><ChevronDown size={13} /></button></div>
          <div id="vh-system-links" className="vh-products" hidden={!systemsOpen}><div className="vh-products-heading"><span>{t('حلول متخصصة لمركزك', 'PURPOSE-BUILT FOR YOUR CENTER')}</span><bdi>{products.map(product => product.id).join(' · ')}</bdi></div>{products.map(product => { const Icon = icons[product.id] || Building2; return <Link className="vh-product" data-system={product.id} href={solutionPath(product.id, locale)} key={product.id} onClick={close}><span className="vh-product-icon"><Icon size={21} strokeWidth={1.6} /></span><span><strong>{txt(product.name, locale)}</strong><small>{txt(product.features[0] || product.description, locale)}</small></span><bdi>{product.id}</bdi><Forward size={15} /></Link>; })}<Link className="vh-products-all" href={`${prefix}/systems`} onClick={close}>{t('استكشف جميع الأنظمة', 'Explore all systems')}<Arrow size={16} /></Link></div>
        </div> : <Link className="vh-nav-link" href={link.href} key={link.id} aria-current={current === link.id ? 'page' : undefined} onClick={close}>{link.label}</Link>)}</div>
        <div className="vh-mobile-actions"><Link className="vh-mobile-requests" href={`${prefix}/requests`} onClick={close}><ClipboardList size={18} />{t('متابعة طلباتي', 'My requests')}</Link><Link className="vh-demo" href={`${home}#contact`} onClick={close}>{t('اطلب عرضاً', 'Book a demo')}<Arrow size={17} /></Link></div>
      </nav>
      <div className="vh-header-actions"><Link className="vh-requests" href={`${prefix}/requests`} aria-current={current === 'requests' ? 'page' : undefined} aria-label={t('متابعة طلباتي', 'My requests')} title={t('متابعة طلباتي', 'My requests')}><ClipboardList size={19} strokeWidth={1.6} /></Link><a className="vh-language" href={alternateHref} hrefLang={en ? 'ar' : 'en'} aria-label={t('التبديل إلى الإنجليزية', 'Switch to Arabic')}><Globe2 size={16} /><span>{en ? 'العربية' : 'EN'}</span></a><span className="vh-actions-divider" aria-hidden="true" /><Link className="vh-demo vh-desktop-demo" href={`${home}#contact`}>{t('اطلب عرضاً', 'Book a demo')}<Arrow size={17} /></Link><button className="vh-menu-button" type="button" ref={menuButton} aria-expanded={open} aria-controls="care-navigation" aria-label={open ? t('إغلاق القائمة', 'Close menu') : t('فتح القائمة', 'Open menu')} onClick={() => { setOpen(!open); setSystemsOpen(false); }}>{open ? <X size={21} /> : <Menu size={21} />}</button></div>
    </div>
  </header>;
}