import { NextResponse } from 'next/server';
import {
  createAdminSession,
  getConfiguredAdminEmail,
  getAdminSecret,
  ADMIN_COOKIE_NAME,
  sameOrigin
} from '../../../../lib/admin-auth';
import { matchesAdmin } from '../../../../lib/access';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'مصدر الطلب غير صحيح.' }, { status: 403 });
  }

  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim() || '';
    const password = body.password || '';

    const configuredEmail = getConfiguredAdminEmail();
    const expectedPassword = getAdminSecret();

    if (!matchesAdmin(email, configuredEmail) || password !== expectedPassword) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }

    const token = await createAdminSession(email);
    const response = NextResponse.json({ ok: true, name: 'VIARA Administrator' });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'تعذر التحقق من البيانات.' }, { status: 500 });
  }
}
