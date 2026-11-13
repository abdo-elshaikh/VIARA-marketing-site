'use client';
import { useId, useRef, useState } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { txt, type Locale } from '../lib/site-content';
import { getSystemCaptures } from '../lib/system-captures';
import './system-capture-gallery.css';

export default function SystemLiveGallery({ currentSystemId = 'RIS', locale }: { currentSystemId?: string; locale: Locale }) {
  const en = locale === 'en', uid = useId();
  const captures = getSystemCaptures(currentSystemId, locale);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const item = captures[index] || captures[0];
  if (!item) return null;
  const move = (step: number) => { setZoomed(false); setIndex(previous => (previous + step + captures.length) % captures.length); };
  const Previous = en ? ChevronLeft : ChevronRight, Next = en ? ChevronRight : ChevronLeft;
  const title = txt(item.title, locale), description = txt(item.description, locale);
  return <section className="vcg-section" id="live-system-preview" aria-labelledby={`${uid}-heading`}>
    <div className="vcg-heading"><div><span className="vcg-eyebrow"><Camera size={15} />{en ? 'FROM THE APPLICATION' : 'من داخل النظام'}</span><h2 id={`${uid}-heading`}>{en ? 'A closer look at your workspace.' : 'تعرّف على مساحة عمل فريقك.'}</h2></div><p>{en ? 'Actual interface captures from the local application. Open any image to inspect it at full size.' : 'لقطات فعلية لواجهات النسخة المحلية. افتح الصورة لرؤية تفاصيلها بحجم أكبر.'}</p></div>
    <div className="vcg-stage-layout"><div className="vcg-showcase">
      <div className="vcg-screen-top"><span className="vcg-screen-brand"><i aria-hidden="true" />VIARA <bdi>{currentSystemId}</bdi></span><span>{en ? 'INTERFACE CAPTURE' : 'لقطة من واجهة النظام'}</span><button type="button" className="vcg-expand" onClick={() => { setZoomed(false); dialog.current?.showModal(); }} aria-label={en ? `Enlarge: ${title}` : `تكبير: ${title}`}><Maximize2 size={16} /><span>{en ? 'Enlarge' : 'تكبير'}</span></button></div>
      <button type="button" className="vcg-main-image" onClick={() => { setZoomed(false); dialog.current?.showModal(); }} aria-label={en ? `Open screenshot: ${title}` : `افتح الصورة: ${title}`}><img key={item.id} src={item.image} srcSet={item.thumbnail ? `${item.thumbnail} 840w, ${item.image} ${item.width}w` : undefined} sizes="(max-width: 760px) calc(100vw - 40px), 1240px" width={item.width} height={item.height} alt={title} loading="lazy" decoding="async" /><span className="vcg-image-hint"><Maximize2 size={15} />{en ? 'Click to inspect the interface' : 'اضغط لاستعراض التفاصيل'}</span></button>
      <div className="vcg-caption"><div><span className="vcg-current-index"><bdi>{String(index + 1).padStart(2, '0')}</bdi> / <bdi>{String(captures.length).padStart(2, '0')}</bdi></span><h3>{title}</h3><p>{description}</p>{item.state && <small className="vcg-state">{txt(item.state, locale)}</small>}</div>{captures.length > 1 && <div className="vcg-controls"><button type="button" onClick={() => move(-1)} aria-label={en ? 'Previous screenshot' : 'الصورة السابقة'}><Previous size={18} /></button><button type="button" onClick={() => move(1)} aria-label={en ? 'Next screenshot' : 'الصورة التالية'}><Next size={18} /></button></div>}</div>
    </div>
    {captures.length > 1 && <div className="vcg-thumbnails" role="group" aria-label={en ? 'Choose an interface screenshot' : 'اختر شاشة النظام'}>{captures.map((capture, i) => <button type="button" key={capture.id} aria-pressed={index === i} onClick={() => setIndex(i)}><img src={capture.thumbnail || capture.image} width={144} height={90} alt="" loading="lazy" /><span><bdi>0{i + 1}</bdi><strong>{txt(capture.title, locale)}</strong></span></button>)}</div>}
    </div><p className="vcg-footnote">{en ? 'These are screenshots, not an interactive connection to the application. Visible content reflects the state captured; available screens depend on role and agreed scope.' : 'هذه صور للواجهات وليست اتصالاً تفاعلياً بالنظام. المحتوى يعكس حالة الشاشة وقت الالتقاط، وتختلف الشاشات المتاحة حسب الصلاحيات والنطاق المتفق عليه.'}</p>
    <dialog ref={dialog} className="vcg-lightbox" aria-labelledby={`${uid}-lightbox-title`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (captures.length < 2) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move((event.key === 'ArrowRight') === en ? 1 : -1); } }}>
      <div className="vcg-lightbox-head"><div><bdi>{currentSystemId}</bdi><h3 id={`${uid}-lightbox-title`}>{title}</h3></div><div className="vcg-lightbox-tools">{captures.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label={en ? 'Previous screenshot' : 'الصورة السابقة'}><Previous size={18} /></button><span className="vcg-lightbox-count"><bdi>{index + 1} / {captures.length}</bdi></span><button type="button" onClick={() => move(1)} aria-label={en ? 'Next screenshot' : 'الصورة التالية'}><Next size={18} /></button></>}<button type="button" className="vcg-zoom" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)} aria-label={zoomed ? (en ? 'Fit image to screen' : 'ملاءمة الصورة للشاشة') : (en ? 'Zoom into screenshot' : 'تكبير تفاصيل الصورة')}><Maximize2 size={17} /></button><button type="button" onClick={() => dialog.current?.close()} aria-label={en ? 'Close screenshot' : 'إغلاق الصورة'}><X size={21} /></button></div></div>
      <div className={`vcg-lightbox-image ${zoomed ? 'is-zoomed' : ''}`}><img src={item.image} width={item.width} height={item.height} alt={title} /></div>
      <div className="vcg-lightbox-footer"><p>{description}</p><a href={item.original || item.image} target="_blank" rel="noopener noreferrer">{en ? 'Open full image' : 'افتح الصورة كاملة'}<ExternalLink size={15} /></a></div>
    </dialog>
  </section>;
}