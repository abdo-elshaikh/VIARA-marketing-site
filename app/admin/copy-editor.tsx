'use client';
import { useState } from 'react';
import type { Locale, SiteContent } from '../../lib/site-content';
import { copyCatalog } from '../../lib/copy-catalog';
import { BilingualField } from './company-editor';
import { ChevronDown, Check } from 'lucide-react';

export default function CopyEditor({ value, onChange, locale }: { value: SiteContent['copy']; onChange: (value: SiteContent['copy']) => void; locale: Locale }) {
  const en = locale === 'en';
  const [search, setSearch] = useState(''), [page, setPage] = useState('all'), [limit, setLimit] = useState(25);
  const [customOnly, setCustomOnly] = useState(false);
  const pages = [...new Set(copyCatalog.flatMap(entry => entry.pages))];
  const results = copyCatalog.filter(entry => (page === 'all' || entry.pages.includes(page)) && (!customOnly || value[entry.en]) && `${entry.ar} ${entry.en} ${value[entry.en]?.ar || ''} ${value[entry.en]?.en || ''} ${entry.pages.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <>
    <div className="cms-copy-tools"><label>{en ? 'Search original or customized text' : 'ابحث في النص الأصلي أو المخصص'}<input type="search" placeholder={en ? 'Type a word or phrase…' : 'اكتب كلمة أو عبارة…'} value={search} onChange={event => { setSearch(event.target.value); setLimit(25); }} /></label><label>{en ? 'Page' : 'الصفحة'}<select value={page} onChange={event => { setPage(event.target.value); setLimit(25); }}><option value="all">{en ? 'All pages' : 'جميع الصفحات'}</option>{pages.map(item => <option key={item}>{item}</option>)}</select></label></div>
    <label className="cms-copy-custom"><input type="checkbox" checked={customOnly} onChange={event => { setCustomOnly(event.target.checked); setLimit(25); }} />{en ? 'Customized entries only' : 'النصوص المخصصة فقط'}</label>
    <p role="status" className="cms-copy-result-count">{results.length} {en ? 'editable text entries' : 'نصًا قابلًا للتعديل'}</p>
    {results.slice(0, limit).map(entry => <details className="cms-copy-entry" key={entry.en}><summary><span><small>{entry.pages.join(' · ')}</small>{(value[entry.en]?.[locale] || entry[locale]).slice(0, 115)}{(value[entry.en]?.[locale] || entry[locale]).length > 115 ? '…' : ''}</span>{value[entry.en] && <Check size={16} aria-label={en ? 'Customized' : 'مخصص'} />}<ChevronDown size={16} /></summary><div><BilingualField label={entry.en} value={value[entry.en] || { ar: entry.ar, en: entry.en }} onChange={next => onChange({ ...value, [entry.en]: next })} />{value[entry.en] && <button className="cms-secondary" type="button" onClick={() => { const next = { ...value }; delete next[entry.en]; onChange(next); }}>{en ? 'Restore original text' : 'استعادة النص الأصلي'}</button>}</div></details>)}
    {results.length === 0 && <p className="cms-copy-result-count">{en ? 'No matches. Try another word or page.' : 'لا توجد نتائج. جرّب كلمة أو صفحة أخرى.'}</p>}
    {results.length > limit && <button className="cms-secondary" type="button" onClick={() => setLimit(value => value + 25)}>{en ? 'Show more' : 'عرض المزيد'}</button>}
  </>;
}