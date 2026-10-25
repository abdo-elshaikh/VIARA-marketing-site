'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ShieldCheck, LockKeyhole, Mail, LoaderCircle, ArrowUpLeft, ArrowUpRight, AlertCircle, Eye, EyeOff, Globe2, Layers3, MessagesSquare, Palette } from 'lucide-react';

type Brand = { name: string; logo: string; primary: string };
export default function AdminLoginForm({ brand = { name: 'VIARA', logo: '/assets/viara-symbol-small.webp', primary: '#007b61' } }: { defaultEmail?: string; brand?: Brand }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false), [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false), [en, setEn] = useState(false);
  const t = (ar: string, english: string) => en ? english : ar;
  const Arrow = en ? ArrowUpRight : ArrowUpLeft;
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (loading) return; setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || t('تعذر تسجيل الدخول. تحقق من البيانات.', 'Could not sign in. Check your credentials.'));
      location.reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('حدث خطأ أثناء تسجيل الدخول.', 'An error occurred while signing in.')); }
    finally { setLoading(false); }
  }
  return <main className="br-admin-entry" dir={en ? 'ltr' : 'rtl'} lang={en ? 'en' : 'ar'} style={{ '--brand-primary': brand.primary } as React.CSSProperties}>
    <aside className="br-admin-story"><Link href={en ? '/en' : '/'} className="br-admin-logo"><img src={brand.logo === '/assets/viara-symbol.png' ? '/assets/viara-symbol-small.webp' : brand.logo} width={48} height={48} alt="" /><span>{brand.name}<small>CONTENT & EXPERIENCE</small></span></Link>
      <div><span className="br-eyebrow"><i />{t('مساحة إدارة موقعك', 'YOUR WEBSITE WORKSPACE')}</span><h1>{t('إدارة منظمة.', 'An organized workspace.')}<br /><em>{t('تجربة متسقة.', 'A consistent experience.')}</em></h1><p>{t('محتوى الموقع وطلبات العملاء والهوية البصرية، ضمن مساحة واحدة لإدارة تجربة VIARA.', 'Website content, customer inquiries and brand identity. One workspace to manage the VIARA experience.')}</p><ul>{[{ icon: Layers3, title: t('المحتوى والأنظمة', 'Content & systems'), body: t('تحديث الصفحات وتفاصيل الحلول', 'Keep pages and solution details current') }, { icon: MessagesSquare, title: t('الطلبات والمتابعة', 'Inquiries & follow-up'), body: t('تنظيم الطلبات ومراجعة حالتها', 'Organize inquiries and review their status') }, { icon: Palette, title: t('هوية واضحة', 'A clear identity'), body: t('إدارة الصور والألوان واللغتين', 'Manage imagery, colors and both languages') }].map(item => <li key={item.title}><span><item.icon size={21} /></span><div><strong>{item.title}</strong><small>{item.body}</small></div></li>)}</ul></div>
      <div className="br-admin-story-bottom"><span>{t('تقنية أقرب للرعاية.', 'Technology, closer to care.')}</span><span className="br-color-dots" aria-hidden="true"><i /><i /><i /></span></div>
    </aside>
    <section className="br-admin-access"><div className="br-admin-access-top"><Link href={en ? '/en' : '/'}>{t('العودة إلى الموقع', 'Back to website')}<Arrow size={16} /></Link><button type="button" onClick={() => setEn(!en)}><Globe2 size={16} />{en ? 'العربية' : 'EN'}</button></div>
      <div className="br-admin-login-card"><span className="br-access-icon"><ShieldCheck size={28} strokeWidth={1.4} /></span><span className="br-eyebrow">{t('دخول المسؤول', 'ADMINISTRATOR ACCESS')}</span><h2>{t('مرحباً بعودتك.', 'Welcome back.')}</h2><p>{t('سجّل دخولك لمتابعة إدارة الموقع.', 'Sign in to continue managing your website.')}</p>
        {error && <div className="br-alert" role="alert"><AlertCircle size={17} /><span>{error}</span></div>}
        <form onSubmit={handleLogin}><label htmlFor="admin-email">{t('البريد الإلكتروني للمسؤول', 'Administrator email')}</label><div className="br-access-input"><Mail size={18} /><input id="admin-email" name="email" type="email" autoComplete="username" dir="ltr" required value={email} onChange={event => setEmail(event.target.value)} disabled={loading} /></div>
          <label htmlFor="admin-password">{t('كلمة المرور', 'Password')}</label><div className="br-access-input"><LockKeyhole size={18} /><input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" dir="ltr" required value={password} onChange={event => setPassword(event.target.value)} disabled={loading} /><button type="button" aria-label={showPassword ? t('إخفاء كلمة المرور', 'Hide password') : t('إظهار كلمة المرور', 'Show password')} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          <button className="br-access-submit" type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" size={19} /> : <Arrow size={19} />}{loading ? t('جارٍ التحقق…', 'Signing in…') : t('تسجيل الدخول', 'Sign in')}</button>
        </form><div className="br-admin-access-note"><ShieldCheck size={15} /><span>{t('للمسؤولين المخوّلين بإدارة الموقع.', 'For authorized website administrators.')}</span></div>
      </div><p className="br-admin-copyright">© {new Date().getFullYear()} {brand.name} · {t('إدارة الموقع', 'Website management')}</p>
    </section>
  </main>;
}