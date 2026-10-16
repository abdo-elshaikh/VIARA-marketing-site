'use client';
import { useState } from 'react';
import { Search, ArrowUpLeft, ArrowRight, Building2, Stethoscope, ScanLine, Network } from 'lucide-react';
import { healthcareSystems, healthcareCategories, facilityProfiles, normalizeCatalogSearch } from '../lib/healthcare-catalog.mjs';
import { txt, type Locale, type SiteContent } from '../lib/site-content';

export default function CareHub({ locale, products, onRequest }: { locale: Locale; products: SiteContent['products']; onRequest: (ids: string[], facility: string) => void }) {
 const en=locale==='en',t=(ar:string,english:string)=>en?english:ar;
 const [profile,setProfile]=useState('hospital'),[query,setQuery]=useState('');
 const directory=en?'/en/systems':'/systems';
 const allowed=healthcareSystems.filter(system=>!products.some(p=>p.id===system.id&&!p.enabled));
 const chosen=facilityProfiles.find(p=>p.id===profile)!;
 const recommendations=allowed.filter(system=>chosen.systems.includes(system.id)).slice(0,6);
 const results=query.trim()?allowed.filter(system=>normalizeCatalogSearch(`${system.id} ${system.name.ar} ${system.name.en}`).includes(normalizeCatalogSearch(query))).slice(0,4):[];
 const icons=[Stethoscope,ScanLine,Building2,Network];
 return <section className="calm-section care-hub" id="systems" aria-labelledby="care-hub-title"><div className="calm-container">
  <div className="calm-section-head"><div><span className="calm-kicker">{t('استكشف المنظومة','EXPLORE THE ECOSYSTEM')}</span><h2 id="care-hub-title">{t('كل مجال في مكانه.','Every area. In its place.')}<br/><span>{t('ابدأ بما يهم منشأتك.','Start with your facility.')}</span></h2></div><a className="calm-text-link" href={directory}>{t('دليل الأنظمة الكامل','Full systems directory')}<ArrowUpLeft size={18}/></a></div>
  <div className="care-profile-tabs" aria-label={t('نوع المنشأة','Facility type')}>{facilityProfiles.map(p=><button key={p.id} type="button" aria-pressed={profile===p.id} onClick={()=>setProfile(p.id)}>{txt(p.name,locale)}</button>)}</div>
  <div className="care-profile-result" role="region" aria-label={t('نقطة البداية المقترحة','Suggested starting scope')}><div><span className="calm-kicker">{t('نقطة بداية للنقاش','A STARTING POINT')}</span><h3>{txt(chosen.name,locale)}</h3><p>{t('مجالات نراجع ملاءمتها وتكاملها حسب سير العمل والبيئة الحالية.','Areas to assess against your workflows and existing environment.')}</p><div className="care-recommendations" aria-live="polite">{recommendations.map(system=><span key={system.id}><bdi>{system.id}</bdi>{txt(system.name,locale)}</span>)}</div></div><button type="button" className="calm-button" onClick={()=>onRequest(recommendations.map(s=>s.id),profile)}>{t('ناقش هذا النطاق','Discuss this scope')}<ArrowUpLeft size={18}/></button></div>
  <div className="care-category-grid">{healthcareCategories.map((category,index)=>{const Icon=icons[index];return <a key={category.id} href={`${directory}?area=${category.id}`}><Icon size={23}/><h3>{txt(category.name,locale)}</h3><span>{allowed.filter(s=>s.category===category.id).length} {t('مجالات','areas')}</span><ArrowUpLeft className="care-card-arrow" size={18}/></a>;})}</div>
  <div className="care-quick-search"><label><Search size={19}/><span className="calm-sr-only">{t('ابحث عن نظام','Find a system')}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')setQuery('');}} placeholder={t('هل تبحث عن نظام محدد؟ ابحث بالاسم أو الاختصار…','Looking for a specific system? Search its name or code…')}/></label>{query.trim()&&<div className="care-search-results" role="status">{results.length?results.map(system=><a key={system.id} href={`${directory}?q=${encodeURIComponent(system.id)}`}><bdi>{system.id}</bdi>{txt(system.name,locale)}<ArrowRight size={16}/></a>):<p>{t('لا توجد نتائج. جرّب اسمًا آخر أو افتح الدليل الكامل.','No matches. Try another name or open the full directory.')}</p>}</div>}</div>
  <p className="calm-fineprint">{t('تشمل المنظومة الحلول الحالية ومجالات التوسع التي تُراجع إتاحتها في العرض الفني.','The directory includes current solutions and expansion areas whose availability is confirmed in the technical proposal.')}</p>
 </div></section>;
}
