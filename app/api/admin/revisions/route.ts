import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdmin, sameOrigin } from '../../../../lib/admin-auth';
import { listRevisions, restoreRevision } from '../../../../lib/site-revisions';
import { invalidatePublicContent } from '../../../../lib/site-server';

export const dynamic = 'force-dynamic';

const restoreSchema = z.object({ revisionId: z.string().uuid() });

export async function GET() {
  if (!await getAdmin()) return NextResponse.json({ error: 'غير مصرح / Unauthorized' }, { status: 403 });
  try {
    return NextResponse.json({ revisions: await listRevisions() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Failed to list revisions:', error);
    return NextResponse.json({ error: 'تعذر تحميل النسخ / Could not load revisions' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin || !sameOrigin(request)) return NextResponse.json({ error: 'غير مصرح / Unauthorized' }, { status: 403 });
  try {
    const parsed = restoreSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'حدد النسخة المطلوب استعادتها / Choose a revision to restore' }, { status: 400 });
    const result = await restoreRevision(parsed.data.revisionId);
    if (!result) return NextResponse.json({ error: 'النسخة غير موجودة / Revision not found' }, { status: 404 });
    invalidatePublicContent();
    return NextResponse.json({ version: result.version }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to restore revision:', error);
    return NextResponse.json({ error: 'تعذر استعادة النسخة / Could not restore the revision' }, { status: 503 });
  }
}
