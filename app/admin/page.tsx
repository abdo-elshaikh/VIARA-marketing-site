import { getAdmin } from '../../lib/admin-auth';
import { readContent, readPublicContent } from '../../lib/site-server';
import AdminClient from './admin-client';
import AdminLoginForm from './admin-login-form';
import './admin.css';
import './admin-redesign.css';
import './admin-workspace.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'إدارة الموقع | VIARA', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) {
    const { content } = await readPublicContent();
    return <AdminLoginForm brand={content.brand} />;
  }

  let initial: Awaited<ReturnType<typeof readContent>>;
  try {
    initial = await readContent();
  } catch {
    return (
      <main className="br-fallback" dir="rtl">
        <h1>تعذر تحميل لوحة الإدارة</h1>
        <p>لم نتمكن من جلب بيانات المحتوى. يرجى تحديث الصفحة والمحاولة مجددًا.</p>
        <a href="/admin" className="button">إعادة المحاولة / Retry</a>
      </main>
    );
  }
  return <AdminClient initial={initial} name={admin.displayName} />;
}
