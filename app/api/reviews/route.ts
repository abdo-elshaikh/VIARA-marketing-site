import { NextResponse } from 'next/server';
import { and, eq, gte, count } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { sameOrigin } from '../../../lib/admin-auth';
import { reviewSchema } from '../../../lib/review';
import { getDb } from '../../../db';
import { reviews } from '../../../db/schema';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });

  try {
    const raw = await request.text();
    if (raw.length > 12000) return NextResponse.json({ error: 'Too large' }, { status: 413 });
    const data = reviewSchema.safeParse(JSON.parse(raw));
    if (!data.success) return NextResponse.json({ error: 'Check review and consent' }, { status: 400 });

    const cookieStore = await cookies();
    let clientId = cookieStore.get('viara_uid')?.value;
    let shouldSetCookie = false;
    if (!clientId) {
      clientId = `guest_${crypto.randomUUID()}`;
      shouldSetCookie = true;
    }

    const db = getDb();
    const recent = await db.select({ n: count() }).from(reviews).where(
      and(eq(reviews.userId, clientId), gte(reviews.createdAt, Date.now() - 86400000))
    ).get();

    if ((recent?.n || 0) >= 3) return NextResponse.json({ error: 'Please try again tomorrow' }, { status: 429 });

    const { consent: _c, website: _w, ...row } = data.data;
    await db.insert(reviews).values({
      ...row,
      consent: 1,
      userId: clientId,
      status: 'pending',
      createdAt: Date.now()
    }).onConflictDoNothing();

    const response = NextResponse.json({ ok: true }, { status: 201 });
    if (shouldSetCookie) {
      response.cookies.set('viara_uid', clientId, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 31536000 });
    }
    return response;
  } catch {
    return NextResponse.json({ error: 'Could not save review' }, { status: 503 });
  }
}
