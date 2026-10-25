import { headers } from 'next/headers';

export default async function Loading() {
  const locale = (await headers()).get('x-viara-locale') === 'en' ? 'en' : 'ar';
  return (
    <div className="care-site viara-professional" dir={locale === 'en' ? 'ltr' : 'rtl'} lang={locale} style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 48 }}>
      <p style={{ color: 'var(--care-muted, #526a60)', fontSize: 15 }}>{locale === 'en' ? 'Loading…' : 'جارٍ التحميل…'}</p>
    </div>
  );
}
