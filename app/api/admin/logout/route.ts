import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
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
    path: '/',
    maxAge: 0
  });
  return response;
}
