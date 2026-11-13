import { siteContentSchema, type SiteContent } from './site-content.ts';

export const ADMIN_DRAFT_KEY = 'viara-admin-content-draft-v1';
export type AdminDraft = { content: SiteContent; baseVersion: number; savedAt: number; demo: boolean };

export function readAdminDraft(raw: string | null): AdminDraft | null {
  if (!raw || raw.length > 2_000_000) return null;
  try {
    const value = JSON.parse(raw);
    if (!Number.isSafeInteger(value.baseVersion) || value.baseVersion < 0 || !Number.isFinite(value.savedAt) || value.savedAt <= 0 || value.savedAt > Date.now() + 300_000 || typeof value.demo !== 'boolean') return null;
    const parsed = siteContentSchema.safeParse(value.content);
    return parsed.success ? { content: parsed.data, baseVersion: value.baseVersion, savedAt: value.savedAt, demo: value.demo } : null;
  } catch { return null; }
}
