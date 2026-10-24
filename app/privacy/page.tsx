import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'سياسة الخصوصية | VIARA',
  robots: { index: false, follow: false },
};
export default function PrivacyPage() {
  return (
    <main dir="rtl" lang="ar" style={{maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'system-ui, sans-serif', lineHeight: 1.8, color: '#1e293b'}}>
      <h1 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem'}}>سياسة الخصوصية</h1>
      <p style={{color: '#64748b', marginBottom: '2rem'}}>آخر تحديث: أكتوبر 2026</p>

      <h2>ما البيانات التي نجمعها؟</h2>
      <p>عند إرسال نموذج التواصل نجمع: الاسم، اسم المنشأة، البريد الإلكتروني، رقم الهاتف، ونوع المنشأة وتفاصيل الطلب التي تقدّمها اختياريًا.</p>

      <h2>كيف نستخدم بياناتك؟</h2>
      <p>تُستخدم بيانات التواصل حصرًا لمراجعة طلبك والرد عليه. لا نشارك بياناتك مع أطراف خارجية لأغراض تسويقية.</p>

      <h2>سجل الطلبات</h2>
      <p>يُربط سجل الطلبات بمعرّف زائر مخزّن في هذا المتصفح (cookie). قد لا تظهر طلباتك عند استخدام جهاز آخر أو بعد مسح بيانات الموقع.</p>

      <h2>ملاحظة مهمة</h2>
      <p>لا تُدرج أي معلومات خاصة بالمرضى أو بيانات طبية حساسة في نماذج التواصل.</p>

      <h2>التواصل معنا</h2>
      <p>لأي استفسار بشأن بياناتك، راسلنا على البريد الإلكتروني المذكور في صفحة التواصل.</p>

      <p style={{marginTop: '2rem'}}><Link href="/" style={{color: '#007b61'}}>← العودة للرئيسية</Link></p>
    </main>
  );
}
