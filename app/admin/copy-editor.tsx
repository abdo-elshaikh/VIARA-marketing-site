'use client';
import { useState } from 'react';
import type { Locale, SiteContent } from '../../lib/site-content';
import { copyCatalog } from '../../lib/copy-catalog';
import { BilingualField } from './company-editor';

export default function CopyEditor({ value, onChange, locale }: { value: SiteContent['copy']; onChange: (value: SiteContent['copy']) => void; locale: Locale }) {
  const en = locale === 'en';
  const [search, setSearch] = useState(''), [page, setPage] = useState('all'), [limit, setLimit] = useState(25);
  const pages = [...new Set(copyCatalog.flatMap(entry => entry.pages))];
  const results = copyCatalog.filter(entry => (page === 'all' || entry.pages.includes(page)) && `${entry.ar} ${entry.en} ${entry.pages.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <><div className="cms-copy-tools"><label>{en ? 'Search text' : 'البحث في النصوص'}<input type="search" value={search} onChange={e => { setSearch(e.target.value); setLimit(25); }} /></label><label>{en ? 'Page' : 'الصفحة'}<select value={page} onChange={e => { setPage(e.target.value); setLimit(25); }}><option value="all">{en ? 'All pages' : 'جميع الصفحات'}</option>{pages.map(p => <option key={p}>{p}</option>)}</select></label></div><p role="status">{results.length} {en ? 'editable text entries' : 'نصاً قابلاً للتعديل'}</p>{results.slice(0, limit).map(entry => <div className="cms-copy-entry" key={entry.en}><small>{entry.pages.join(' · ')}</small><BilingualField label={entry.en} value={value[entry.en] || { ar: entry.ar, en: entry.en }} onChange={v => onChange({ ...value, [entry.en]: v })} />{value[entry.en] && <button className="cms-secondary" type="button" onClick={() => { const next = { ...value }; delete next[entry.en]; onChange(next); }}>{en ? 'Restore original text' : 'استعادة النص الأصلي'}</button>}</div>)}{results.length > limit && <button className="cms-secondary" type="button" onClick={() => setLimit(v => v + 25)}>{en ? 'Show more' : 'عرض المزيد'}</button>}</>;
}
