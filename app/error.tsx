'use client';
import Link from 'next/link';
import { useState } from 'react';
import { RefreshCw, ArrowUpRight, ArrowUpLeft } from 'lucide-react';

function currentLocale(): 'ar' | 'en' {
  if (typeof document === 'undefined') return 'ar';
  return document.documentElement.lang === 'en' ? 'en' : 'ar';
}

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [locale] = useState<'ar' | 'en'>(currentLocale);
  const en = locale === 'en';
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  return <main className="br-fallback" dir={en ? 'ltr' : 'rtl'} lang={locale} suppressHydrationWarning>
    <img src="/assets/viara-symbol-small.webp" width={58} height={58} alt="VIARA" />
    <span>{en ? 'VIARA / SOMETHING WENT WRONG' : 'VIARA / حدث خطأ'}</span>
    <h1>{en ? 'This page could not be displayed.' : 'تعذر عرض الصفحة الآن.'}</h1>
    <p>{en ? 'Please try again or return to the home page.' : 'حاول تحميلها مجدداً أو عد إلى الصفحة الرئيسية.'}</p>
    <div>
      <button type="button" onClick={reset}><RefreshCw size={18} />{en ? 'Try again' : 'إعادة المحاولة'}</button>
      <Link href={en ? '/en' : '/'}>{en ? 'Back to home' : 'العودة إلى الرئيسية'}<Arrow size={17} /></Link>
    </div>
  </main>;
}
