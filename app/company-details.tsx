import { txt, type Locale, type SiteContent } from '../lib/site-content';
import './company-details.css';

export default function CompanyDetails({ company, locale }: { company: SiteContent['company']; locale: Locale }) {
  const t = (ar: string, en: string) => locale === 'en' ? en : ar;
  const groups = [
    { title: t('فريق العمل', 'Our team'), items: company.team.filter(item => item.enabled).map(item => ({ id: item.id, title: txt(item.name, locale), subtitle: txt(item.role, locale), body: txt(item.bio, locale), image: item.image, url: '' })) },
    { title: t('محطات التطوير', 'Milestones'), items: company.milestones.filter(item => item.enabled).map(item => ({ id: item.id, title: txt(item.title, locale), subtitle: item.period, body: txt(item.body, locale), image: '', url: '' })) },
    { title: t('الوثائق والاعتمادات', 'Documents & credentials'), items: company.credentials.filter(item => item.enabled).map(item => ({ id: item.id, title: txt(item.title, locale), subtitle: '', body: txt(item.body, locale), image: '', url: item.url })) },
  ];
  const support = company.support.filter(item => item.enabled);
  return <div className="care-wrap company-managed">
    {groups.filter(group => group.items.length > 0).map(group => <section key={group.title} aria-label={group.title}><h2>{group.title}</h2><div className="company-managed-grid">{group.items.map(item => <article key={item.id}>{item.image && <img src={item.image} alt="" width={80} height={80} loading="lazy" />}{item.subtitle && <small>{item.subtitle}</small>}<h3>{item.title}</h3>{item.body && <p>{item.body}</p>}{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">{t('عرض المصدر', 'View source')} ↗</a>}</article>)}</div></section>)}
    {support.length > 0 && <section aria-label={t('قنوات الدعم', 'Support channels')}><h2>{t('قنوات الدعم', 'Support channels')}</h2><div className="company-managed-grid">{support.map(item => <article key={item.id}><h3>{txt(item.label, locale)}</h3><p>{txt(item.description, locale)}</p><small>{txt(item.hours, locale)}</small><div className="company-managed-links">{item.email && <a href={'mailto:' + item.email}><bdi>{item.email}</bdi></a>}{item.phone && <a href={'tel:' + item.phone.replace(/\s/g, '')}><bdi>{item.phone}</bdi></a>}{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">{t('رابط الدعم', 'Support link')} ↗</a>}</div></article>)}</div></section>}
  </div>;
}
