'use client';

import { useState, type FormEvent } from 'react';
import { ShieldCheck, Lock, Mail, LoaderCircle, ArrowUpLeft, AlertCircle } from 'lucide-react';

export default function AdminLoginForm({ defaultEmail = 'admin@viara.health' }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول. تحقق من البيانات.');
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-denied" dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #dbe5d8',
          boxShadow: '0 20px 45px -15px rgba(20, 55, 46, 0.12)',
          padding: '40px 32px',
          textAlign: 'start'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#073e32',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#82e4b4',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={30} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#14372e', margin: '0 0 6px' }}>
            لوحة إدارة VIARA
          </h1>
          <p style={{ fontSize: '13px', color: '#688474', margin: 0 }}>
            منظومة إدارة المحتوى والطلبات والأنظمة
          </p>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: '#fff4f2',
              border: '1px solid #fbd0cb',
              borderRadius: '8px',
              color: '#c24128',
              fontSize: '12px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2b5042', marginBottom: '6px' }}
            >
              البريد الإلكتروني للمسؤول
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@viara.health"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid #d4dfd2',
                  background: '#fcfdfa',
                  fontSize: '13px',
                  color: '#14372e',
                  boxSizing: 'border-box'
                }}
              />
              <Mail
                size={16}
                color="#789684"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2b5042', marginBottom: '6px' }}
            >
              كلمة مرور الإدارة
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '8px',
                  border: '1px solid #d4dfd2',
                  background: '#fcfdfa',
                  fontSize: '13px',
                  color: '#14372e',
                  boxSizing: 'border-box'
                }}
              />
              <Lock
                size={16}
                color="#789684"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: '#073e32',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
          >
            {loading ? <LoaderCircle size={18} className="spin" /> : null}
            <span>{loading ? 'جارٍ التحقق…' : 'تسجيل الدخول'}</span>
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #edf2eb', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#466c5a',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span>العودة للموقع الرئيسي</span>
            <ArrowUpLeft size={16} />
          </a>
        </div>
      </div>
    </main>
  );
}
