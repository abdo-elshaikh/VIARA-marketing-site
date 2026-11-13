export function loginErrorMessage(status: number, en: boolean) {
  const messages: Record<number, [string, string]> = {
    401: ['البريد الإلكتروني أو كلمة المرور غير صحيحة. راجع البيانات وحاول مجددًا.', 'The email or password is incorrect. Check your details and try again.'],
    403: ['تعذر التحقق من مصدر الطلب. حدّث الصفحة وحاول مجددًا.', 'The request could not be verified. Refresh the page and try again.'],
    429: ['محاولات كثيرة لتسجيل الدخول. انتظر قليلًا قبل المحاولة مجددًا.', 'Too many sign-in attempts. Wait before trying again.'],
    503: ['تسجيل الدخول غير متاح حاليًا. تواصل مع مسؤول تشغيل الموقع.', 'Sign-in is currently unavailable. Contact your website operator.'],
  };
  const fallback = ['تعذر تسجيل الدخول الآن. أعد المحاولة بعد قليل.', 'Unable to sign in right now. Please try again shortly.'];
  return (messages[status] || fallback)[en ? 1 : 0];
}
