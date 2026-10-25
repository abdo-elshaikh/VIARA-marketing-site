import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, sameOrigin } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'مصدر الطلب غير صحيح.' }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 0
  });
  return response;
}

export async function GET(request: Request) {
  const url = new URL('/admin', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 0
  });
  return response;
}
