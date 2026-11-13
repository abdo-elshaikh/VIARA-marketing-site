'use client';

import './settings-preview.css';

import { useId, useState, type HTMLInputTypeAttribute } from 'react';
import { ImageOff, ArrowUpLeft, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteContentSchema, txt, type Locale, type SiteContent } from '../../lib/site-content';
import { secureImageSchema, settingsSchemas } from '../../lib/publish-content';
import { isSecureUrl } from '../../lib/site-url';

type Validator = { safeParse: (value: string) => { success: boolean } };

export function SettingInput({ label, value, onChange, validator, errorText, help, type = 'text', maxLength = 600, placeholder, dir = 'ltr', showErrors = false }: {
  label: string; value: string; onChange: (value: string) => void; validator: Validator; errorText: string;
  help?: string; type?: HTMLInputTypeAttribute; maxLength?: number; placeholder?: string; dir?: 'ltr' | 'rtl'; showErrors?: boolean;
}) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const invalid = (touched || showErrors) && !validator.safeParse(value).success;
  return <label className="cms-field cms-setting-field" htmlFor={id}>{label}
    <input id={id} value={value} type={type} dir={dir} maxLength={maxLength} placeholder={placeholder} onChange={event => onChange(event.target.value)} onBlur={() => setTouched(true)} aria-invalid={invalid || undefined} aria-describedby={invalid ? id + '-error' : help ? id + '-help' : undefined} />
    {invalid ? <small className="cms-field-error" id={id + '-error'} role="status">{errorText}</small> : help && <small id={id + '-help'}>{help}</small>}
  </label>;
}

export function SettingsSummary({ content, locale, current, onNavigate }: { content: SiteContent; locale: Locale; current: string; onNavigate: (section: string) => void }) {
  const t = (ar: string, en: string) => locale === 'ar' ? ar : en;
  const items = [
    { key: 'brand', section: 'cms-section-brand', label: t('الهوية', 'Brand identity') },
    { key: 'imagery', section: 'cms-section-imagery', label: t('الصور', 'Images') },
    { key: 'contact', section: 'cms-section-contact', label: t('التواصل', 'Contact') },
    { key: 'seo', section: 'cms-section-seo', label: t('بيانات البحث', 'Search metadata') },
  ] as const;
  return <div className="cms-settings-summary" aria-label={t('فحص حقول الإعدادات', 'Settings field checks')}>{items.map(item => {
    const result = settingsSchemas[item.key].safeParse(content[item.key]);
    return <button type="button" key={item.key} aria-current={current === item.section ? 'page' : undefined} onClick={() => onNavigate(item.section)} className={result.success ? '' : 'needs-review'}>{result.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}<span><b>{item.label}</b><small>{result.success ? t('تنسيق الحقول صحيح', 'Field format valid') : t('حقول تحتاج مراجعة: ', 'Fields to review: ') + result.error.issues.length}</small></span><ArrowUpLeft size={15} /></button>;
  })}</div>;
}

export function SettingsImage({ src, alt, locale, className = '' }: { src: string; alt: string; locale: Locale; className?: string }) {
  const [failed, setFailed] = useState(false);
  const valid = secureImageSchema.safeParse(src).success;
  return <div className={'cms-settings-image ' + className}>{valid && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} loading="lazy" /> : <span role="status"><ImageOff size={24} />{locale === 'ar' ? 'تعذر عرض الصورة. راجع الرابط أو ارفع صورة أخرى.' : 'Image unavailable. Check the URL or upload another image.'}</span>}</div>;
}

export function BrandPreview({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = (ar: string, en: string) => locale === 'ar' ? ar : en;
  const color = siteContentSchema.shape.brand.shape.primary.safeParse(content.brand.primary).success ? content.brand.primary : '#007b61';
  return <aside className="cms-brand-preview" aria-label={t('معاينة الهوية', 'Brand preview')}>
    <div className="cms-preview-caption"><span>{t('معاينة الهوية', 'BRAND PREVIEW')}</span><small>{t('تتحدث مع تعديلاتك', 'Updates as you edit')}</small></div>
    <div className="cms-brand-preview-body"><SettingsImage key={content.brand.logo} src={content.brand.logo} alt={content.brand.name} locale={locale} /><div><strong>{content.brand.name || t('اسم الموقع', 'Website name')}</strong><p>{txt(content.brand.tagline, locale) || t('الجملة التعريفية', 'Brand tagline')}</p></div><span className="cms-brand-swatch" style={{ background: color }}><i aria-hidden="true" /><code>{color}</code></span></div>
    <p className="cms-preview-footnote">{t('معاينة مبسطة للاسم والشعار والجملة واللون؛ توزيعها الفعلي يختلف حسب موضعها في الموقع.', 'A simplified preview of the name, logo, tagline and color; their layout varies across the website.')}</p>
  </aside>;
}

export function SearchPreview({ content, locale, siteUrl }: { content: SiteContent; locale: Locale; siteUrl: string }) {
  const [previewLocale, setPreviewLocale] = useState<Locale>(locale);
  const [mode, setMode] = useState<'search' | 'social'>('search');
  const t = (ar: string, en: string) => locale === 'ar' ? ar : en;
  const title = content.seo.title[previewLocale];
  const description = content.seo.description[previewLocale];
  return <aside className="cms-search-preview" aria-label={t('معاينة بيانات الصفحة', 'Page metadata preview')}>
    <div className="cms-preview-controls"><div aria-label={t('نوع المعاينة', 'Preview type')} role="group"><button type="button" aria-pressed={mode === 'search'} onClick={() => setMode('search')}>{t('نتيجة البحث', 'Search result')}</button><button type="button" aria-pressed={mode === 'social'} onClick={() => setMode('social')}>{t('بطاقة المشاركة', 'Social card')}</button></div><div aria-label={t('لغة المعاينة', 'Preview language')} role="group">{(['ar', 'en'] as const).map(lang => <button type="button" key={lang} aria-pressed={previewLocale === lang} onClick={() => setPreviewLocale(lang)}>{lang === 'ar' ? 'العربية' : 'English'}</button>)}</div></div>
    <div className={'cms-search-card ' + (mode === 'social' ? 'is-social' : '')} dir={previewLocale === 'ar' ? 'rtl' : 'ltr'} lang={previewLocale}>
      {mode === 'social' && <SettingsImage key={content.imagery.hero} src={content.imagery.hero} alt="" locale={locale} />}
      <div><small><bdi>{siteUrl}{previewLocale === 'en' ? '/en' : '/'}</bdi></small><h3>{title || t('أدخل عنوان الصفحة', 'Enter a page title')}</h3><p>{description || t('أدخل وصف الصفحة', 'Enter a page description')}</p></div>
    </div>
    <div className="cms-preview-counts"><span>{t('العنوان', 'Title')}: {title.length} {t('حرف', 'characters')}</span><span>{t('الوصف', 'Description')}: {description.length} {t('حرف', 'characters')}</span></div>
    <p className="cms-preview-footnote">{t('المعاينة تقريبية؛ قد تختار محركات البحث والشبكات نصًا أو اقتصاصًا مختلفًا. القيم المعروضة تخص المسودة الحالية.', 'This preview is approximate; search engines and networks may choose different text or cropping. Values shown reflect your current draft.')}</p>
  </aside>;
}

export function ContactPreview({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = (ar: string, en: string) => locale === 'ar' ? ar : en;
  const fields = siteContentSchema.shape.contact.shape;
  const channels = [
    { key: 'email', label: t('البريد الإلكتروني', 'Email'), href: 'mailto:' + content.contact.email },
    { key: 'phone', label: t('الهاتف', 'Phone'), href: 'tel:' + content.contact.phone.replace(/\s/g, '') },
    { key: 'whatsapp', label: t('واتساب', 'WhatsApp'), href: 'https://wa.me/' + content.contact.whatsapp.replace(/\D/g, '') },
    ...(['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'telegram', 'snapchat', 'github'] as const).map(key => ({ key, label: key.toUpperCase(), href: content.contact[key] })),
  ] as const;
  const active = channels.filter(item => content.contact[item.key as keyof typeof fields] && fields[item.key as keyof typeof fields].safeParse(content.contact[item.key as keyof typeof fields]).success && (['email', 'phone', 'whatsapp'].includes(item.key) || isSecureUrl(item.href)));
  return <aside className="cms-contact-preview"><div className="cms-preview-caption"><span>{t('معاينة القنوات المتاحة', 'AVAILABLE CHANNELS')}</span><small>{active.length} {t('قناة صحيحة', 'valid channels')}</small></div><p>{t('تظهر القنوات المعبأة والصحيحة فقط. افتح أي رابط للتحقق من وجهته قبل النشر.', 'Only configured, valid channels appear here. Open a link to verify its destination before publishing.')}</p><div>{active.map(item => <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer"><span>{item.label}</span><ExternalLink size={14} /></a>)}{active.length === 0 && <small>{t('لم تُضف قنوات تواصل صحيحة بعد.', 'No valid contact channels configured yet.')}</small>}</div><span className="cms-preview-footnote"><ArrowUpLeft size={14} />{t('هذه روابط المسودة؛ لا تظهر للزوار قبل النشر.', 'These are draft links; visitors see them after publication.')}</span></aside>;
}
