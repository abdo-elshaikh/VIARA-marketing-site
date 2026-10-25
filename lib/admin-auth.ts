import { cookies } from 'next/headers';
import { matchesAdmin } from './access';

export type AdminUser = {
  userId: string;
  email: string;
  displayName: string;
};

export const ADMIN_COOKIE_NAME = 'viara_admin_session';

export class AdminSecretNotConfiguredError extends Error {
  constructor() {
    super('VIARA_ADMIN_PASSWORD is not configured');
    this.name = 'AdminSecretNotConfiguredError';
  }
}

export function getAdminSecret(): string {
  const secret = process.env.VIARA_ADMIN_PASSWORD || process.env.VIARA_ADMIN_KEY;
  if (!secret || secret.trim().length < 8) throw new AdminSecretNotConfiguredError();
  return secret;
}

export function getConfiguredAdminEmail(): string | null {
  const email = process.env.VIARA_ADMIN_EMAIL?.trim();
  return email ? email : null;
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

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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
    const age = Date.now() - timestamp;
    if (!Number.isFinite(timestamp) || age < 0 || age > SESSION_MAX_AGE_MS) {
      return null; // Reject future timestamps and sessions older than 7 days
    }
    const secret = getAdminSecret();
    const expectedSig = await sha256Hex(`${email}:${ts}:${secret}`);
    if (!timingSafeEqualHex(sig, expectedSig)) return null;
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
    if (!configured || !matchesAdmin(email, configured)) return null;
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
  if (origin) return origin === new URL(request.url).origin;
  const referer = request.headers.get('referer');
  if (!referer) return false; // Fail closed: browsers send Origin/Referer on state-changing fetches
  try {
    return new URL(referer).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
