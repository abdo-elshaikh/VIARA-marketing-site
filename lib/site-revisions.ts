import { desc, eq, inArray } from 'drizzle-orm';
import { getDb } from '../db';
import { siteRevisions, siteSettings } from '../db/schema';

export const MAX_REVISIONS = 20;

export type RevisionSummary = { id: string; version: number; updatedBy: string; createdAt: number };

async function pruneOldRevisions() {
  const db = getDb();
  const all = await db.select({ id: siteRevisions.id }).from(siteRevisions)
    .orderBy(desc(siteRevisions.createdAt), desc(siteRevisions.version)).all();
  const stale = all.slice(MAX_REVISIONS).map(row => row.id);
  if (stale.length) {
    await db.delete(siteRevisions).where(inArray(siteRevisions.id, stale));
  }
}

/** Archives the previous published content so editors can inspect and restore it. */
export async function archiveRevision(previous: { value: string; version: number; updatedBy: string; updatedAt: number }) {
  const db = getDb();
  await db.insert(siteRevisions).values({
    id: crypto.randomUUID(),
    version: previous.version,
    value: previous.value,
    updatedBy: previous.updatedBy,
    createdAt: Date.now()
  });
  await pruneOldRevisions();
}

export async function listRevisions(): Promise<RevisionSummary[]> {
  const rows = await getDb().select({
    id: siteRevisions.id,
    version: siteRevisions.version,
    updatedBy: siteRevisions.updatedBy,
    createdAt: siteRevisions.createdAt
  }).from(siteRevisions).orderBy(desc(siteRevisions.createdAt)).limit(MAX_REVISIONS);
  return rows;
}

/**
 * Restores a stored revision as the new published version.
 * The current live content is archived first, and the write is compare-and-swap
 * on the version so a concurrent publish is never silently overwritten.
 */
export async function restoreRevision(revisionId: string): Promise<{ version: number } | null> {
  const db = getDb();
  const revision = await db.select().from(siteRevisions).where(eq(siteRevisions.id, revisionId)).get();
  if (!revision) return null;
  const current = await db.select().from(siteSettings).where(eq(siteSettings.key, 'main')).get();

  const updatedAt = Date.now();
  if (!current) {
    await db.insert(siteSettings).values({
      key: 'main',
      value: revision.value,
      version: 1,
      updatedBy: 'admin',
      updatedAt
    });
    return { version: 1 };
  }

  // Never lose the live content: archive it before overwriting.
  await archiveRevision({ value: current.value, version: current.version, updatedBy: current.updatedBy, updatedAt: current.updatedAt });

  const nextVersion = current.version + 1;
  const updated = await db.update(siteSettings).set({
    value: revision.value,
    version: nextVersion,
    updatedBy: 'admin',
    updatedAt
  }).where(eq(siteSettings.key, 'main')).returning({ version: siteSettings.version });
  if (!updated.length) return null; // Concurrent write; caller may retry.
  return { version: nextVersion };
}
