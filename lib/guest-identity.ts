import { cookies } from 'next/headers';

export const GUEST_COOKIE_NAME = 'viara_uid';

const GUEST_ID_PATTERN = /^guest_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sessionSecret(): string {
  return process.env.VIARA_SESSION_SECRET || process.env.VIARA_ADMIN_PASSWORD || process.env.VIARA_ADMIN_KEY || '';
}

async function hmacBase64Url(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isGuestId(value: string): boolean {
  return GUEST_ID_PATTERN.test(value);
}

/** Signs a guest identity so clients cannot forge ownership of another visitor's records. */
export async function signGuestId(guestId: string): Promise<string> {
  if (!isGuestId(guestId)) throw new Error('Invalid guest id');
  const secret = sessionSecret();
  if (!secret) return guestId; // Unsigned fallback keeps local dev usable without secrets
  const signature = await hmacBase64Url(guestId, secret);
  return `${guestId}.${signature}`;
}

/**
 * Accepts HMAC-signed guest tokens. Legacy unsigned `guest_<uuid>` cookies are
 * only honored when no signing secret is configured (local development); any
 * deployment with secrets set requires a valid signature, so clients cannot
 * forge ownership of another visitor's records.
 */
export async function verifyGuestId(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const secret = sessionSecret();
  if (isGuestId(token)) return secret ? null : token; // Unsigned legacy cookie: dev-only fallback
  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;
  const guestId = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!isGuestId(guestId) || !signature) return null;
  if (!secret) return null;
  const expected = await hmacBase64Url(guestId, secret);
  return safeEqual(signature, expected) ? guestId : null;
}

export const GUEST_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: true,
  maxAge: 31536000
};

export async function guestCookieValue(guestId: string): Promise<string> {
  return signGuestId(guestId);
}

export async function readGuestId(): Promise<string | null> {
  const cookieStore = await cookies();
  return verifyGuestId(cookieStore.get(GUEST_COOKIE_NAME)?.value);
}
