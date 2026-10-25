import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createAdminSession,
  getConfiguredAdminEmail,
  getAdminSecret,
  AdminSecretNotConfiguredError,
  timingSafeEqualHex,
  ADMIN_COOKIE_NAME,
  sameOrigin
} from '../../../../lib/admin-auth';
import { matchesAdmin } from '../../../../lib/access';

export const dynamic = 'force-dynamic';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_IDENTIFIER = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const attempts = new Map<string, { count: number; resetAt: number }>();
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const loginBodySchema = z.object({
  email: z.string().trim().max(200),
  password: z.string().max(200)
});

/** Cloudflare sets CF-Connecting-IP itself; only fall back to the LAST x-forwarded-for hop (also appended by CF). */
function clientIp(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const hops = forwarded.split(',').map(h => h.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return 'unknown';
}

function windowedCount(map: Map<string, { count: number; resetAt: number }>, key: string): number {
  const entry = map.get(key);
  if (!entry) return 0;
  if (entry.resetAt < Date.now()) {
    map.delete(key);
    return 0;
  }
  return entry.count;
}

function registerFailure(map: Map<string, { count: number; resetAt: number }>, key: string) {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || entry.resetAt < now) map.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
  // Bound map growth in long-lived isolates.
  if (map.size > 5000) {
    for (const [k, value] of map) {
      if (value.resetAt < now) map.delete(k);
      if (map.size <= 4000) break;
    }
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'مصدر الطلب غير صحيح.' }, { status: 403 });
  }

  const ip = clientIp(request);
  try {
    const body = await request.json();
    const parsedBody = loginBodySchema.safeParse(body);
    if (!parsedBody.success) {
      registerFailure(ipAttempts, ip);
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }
    const { email, password } = parsedBody.data;

    const identifierKey = `${ip}:${email.toLowerCase()}`;
    if (windowedCount(ipAttempts, ip) >= MAX_ATTEMPTS_PER_IP || windowedCount(attempts, identifierKey) >= MAX_ATTEMPTS_PER_IDENTIFIER) {
      return NextResponse.json({ error: 'محاولات كثيرة. حاول مرة أخرى لاحقًا. / Too many attempts. Try again later.' }, { status: 429 });
    }

    let configuredEmail: string | null;
    let expectedPassword: string;
    try {
      configuredEmail = getConfiguredAdminEmail();
      expectedPassword = getAdminSecret();
    } catch (error) {
      if (error instanceof AdminSecretNotConfiguredError) {
        console.error('Admin login unavailable: VIARA_ADMIN_PASSWORD is not configured.');
        return NextResponse.json({ error: 'تسجيل الدخول غير مهيأ على هذا النشر. / Sign-in is not configured on this deployment.' }, { status: 503 });
      }
      throw error;
    }

    if (!configuredEmail) {
      console.error('Admin login unavailable: VIARA_ADMIN_EMAIL is not configured.');
      return NextResponse.json({ error: 'تسجيل الدخول غير مهيأ على هذا النشر. / Sign-in is not configured on this deployment.' }, { status: 503 });
    }

    const emailMatches = matchesAdmin(email, configuredEmail);
    const passwordMatches = password.length > 0 && timingSafeEqualHex(password, expectedPassword);
    if (!emailMatches || !passwordMatches) {
      registerFailure(attempts, identifierKey);
      registerFailure(ipAttempts, ip);
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }

    attempts.delete(identifierKey);
    const token = await createAdminSession(email);
    const response = NextResponse.json({ ok: true, name: 'VIARA Administrator' });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login failed unexpectedly:', error);
    registerFailure(ipAttempts, ip);
    return NextResponse.json({ error: 'تعذر التحقق من البيانات.' }, { status: 500 });
  }
}
