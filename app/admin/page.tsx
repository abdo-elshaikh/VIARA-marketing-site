import { getAdmin, getConfiguredAdminEmail } from '../../lib/admin-auth';
import { readContent } from '../../lib/site-server';
import AdminClient from './admin-client';
import AdminLoginForm from './admin-login-form';
import '../admin.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'إدارة الموقع | VIARA', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) {
    const defaultEmail = getConfiguredAdminEmail();
    return <AdminLoginForm defaultEmail={defaultEmail} />;
  }

  try {
    const initial = await readContent();
    return <AdminClient initial={initial} name={admin.displayName} />;
  } catch {
    return (
      <main className="admin-denied" dir="rtl">
        <h1>تعذر تحميل لوحة الإدارة</h1>
        <p>لم نتمكن من جلب بيانات المحتوى. يرجى تحديث الصفحة والمحاولة مجددًا.</p>
        <a href="/admin" className="button">إعادة المحاولة / Retry</a>
      </main>
    );
  }
}
