import { cookies } from 'next/headers';
import { matchesAdmin } from './access';

export type AdminUser = {
  userId: string;
  email: string;
  displayName: string;
};

export const ADMIN_COOKIE_NAME = 'viara_admin_session';

export function getAdminSecret(): string {
  return process.env.VIARA_ADMIN_PASSWORD || process.env.VIARA_ADMIN_KEY || 'viara2026admin';
}

export function getConfiguredAdminEmail(): string {
  return process.env.VIARA_ADMIN_EMAIL || 'admin@viara.health';
}

function toBase64Url(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createAdminSession(email: string): Promise<string> {
  const ts = Date.now().toString();
  const secret = getAdminSecret();
  const sig = await sha256Hex(`${email.trim().toLowerCase()}:${ts}:${secret}`);
  return `${toBase64Url(email.trim().toLowerCase())}.${ts}.${sig}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [b64Email, ts, sig] = parts;
  try {
    const email = fromBase64Url(b64Email);
    const timestamp = Number(ts);
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null; // Expired after 7 days
    }
    const secret = getAdminSecret();
    const expectedSig = await sha256Hex(`${email}:${ts}:${secret}`);
    if (sig !== expectedSig) return null;
    return email;
  } catch {
    return null;
  }
}

export async function getAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const email = await verifyAdminSession(sessionToken);
    if (!email) return null;
    const configured = getConfiguredAdminEmail();
    if (!matchesAdmin(email, configured)) return null;
    return {
      userId: 'admin',
      email,
      displayName: 'مدير النظام / Administrator'
    };
  } catch {
    return null;
  }
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
