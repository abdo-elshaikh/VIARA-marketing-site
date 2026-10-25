'use client';
import { useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight, ScanLine, Layers3, Building2, Check, Users, Sparkles } from 'lucide-react';
import { txt, type Locale, type SiteContent } from '../lib/site-content';
import { marketingSystemIds } from '../lib/healthcare-catalog.mjs';
import { useSiteText } from '../lib/site-copy';
import { solutionPath } from '../lib/solutions';
import { systemCaptures } from '../lib/system-captures';

const icons = { RIS: ScanLine, PACS: Layers3, AI: Sparkles, CMS: Building2, PORTAL: Users };

export default function SolutionShowcase({ content, locale, onDiscuss }: {
  content: SiteContent;
  locale: Locale;
  onDiscuss: (id: string) => void;
}) {
  const en = locale === 'en', t = useSiteText(locale, content);
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  const products = marketingSystemIds.flatMap(id => content.products.filter(product => product.id === id && product.enabled));
  const [selected, setSelected] = useState('RIS');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const product = products.find(item => item.id === selected) || products[0];
  if (!product) return null;
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offset = event.key === 'ArrowDown' || event.key === (en ? 'ArrowRight' : 'ArrowLeft') ? 1 : event.key === 'ArrowUp' || event.key === (en ? 'ArrowLeft' : 'ArrowRight') ? -1 : 0;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? products.length - 1 : offset ? (index + offset + products.length) % products.length : -1;
    if (next < 0) return;
    event.preventDefault();
    setSelected(products[next].id);
    tabs.current[next]?.focus();
  }
  return <section className="vp-solutions care-wrap" id="systems" aria-labelledby="vp-systems-title">
    <div className="vp-section-heading"><div><span className="vp-kicker">{t('الأنظمة التي تدير يومك', 'YOUR EVERYDAY SYSTEMS')}</span><h2 id="vp-systems-title">{t('كل نظام له دوره.', 'A role for every system.')}<br /><span>{t('وكل دور يصنع فرقاً.', 'A purpose for your team.')}</span></h2></div><p>{t('حلول متخصصة للأشعة والمراكز الطبية. استكشف ما يقدمه كل نظام، واختر نقطة البداية المناسبة لطبيعة عملك.', 'Purpose-built solutions for radiology and medical centers. Explore each system and find the right starting point for your operation.')}</p></div>
    <div className="vp-product-tabs" role="tablist" aria-label={t('أنظمة VIARA', 'VIARA systems')}>
      {products.map((item, index) => { const Icon = icons[item.id as keyof typeof icons] || Building2; return <button key={item.id} ref={element => { tabs.current[index] = element; }} id={`vp-tab-${item.id}`} type="button" role="tab" aria-selected={product.id === item.id} aria-controls="vp-product-panel" tabIndex={product.id === item.id ? 0 : -1} onClick={() => setSelected(item.id)} onKeyDown={event => navigate(event, index)}><Icon size={23} /><span><bdi>{item.id}</bdi><strong>{txt(item.name, locale)}</strong></span><span className="vp-tab-index">0{index + 1}</span></button>; })}
    </div>
    <div className="vp-product-panel" role="tabpanel" id="vp-product-panel" aria-labelledby={`vp-tab-${product.id}`} tabIndex={0}>
      <div className="vp-product-copy" key={product.id}>
        <span className="vp-product-label"><bdi>{product.id}</bdi> / {t('الحل المناسب لفريقك', 'A SOLUTION FOR YOUR TEAM')}</span>
        <h3>{txt(product.headline, locale)}</h3>
        <p>{txt(product.description, locale)}</p>
        <ul>{product.features.map((feature, index) => <li key={index}><Check size={17} />{txt(feature, locale)}</li>)}</ul>
        <div className="vp-product-actions"><Link className="care-btn care-btn-small" href={solutionPath(product.id, locale)}>{t('اكتشف النظام', 'Explore this system')}<Arrow size={17} /></Link><button type="button" className="care-link" onClick={() => onDiscuss(product.id)}>{t('اطلب عرضاً', 'Book a demo')}<Arrow size={16} /></button></div>
      </div>
      <div className="vp-product-visual">
        {(() => {
          const captures = systemCaptures[product.id] || [];
          const capture = captures[0];
          return capture ? <Link className="vp-product-capture" href={solutionPath(product.id, locale)} aria-label={`${t('استكشف واجهات', 'Explore interfaces for')} ${txt(product.name, locale)}`}><img src={capture.image} alt={txt(capture.title, locale)} width={capture.width} height={capture.height} loading="lazy" /><span>{txt(capture.title, locale)}</span></Link> : <div className="vp-product-visual-empty"><bdi>{product.id}</bdi><span>{t('استكشف تفاصيل النظام وواجهاته', 'Explore system details and interfaces')}</span></div>;
        })()}
      </div>
    </div>
  </section>;
}
