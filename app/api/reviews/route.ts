import { NextResponse } from 'next/server';
import { and, eq, gte, count } from 'drizzle-orm';
import { sameOrigin } from '../../../lib/admin-auth';
import { readLimitedJson, RequestBodyError } from '../../../lib/request-body';
import { reviewSchema } from '../../../lib/review';
import { GUEST_COOKIE_NAME, GUEST_COOKIE_OPTIONS, readGuestId, guestCookieValue } from '../../../lib/guest-identity';
import { getDb } from '../../../db';
import { reviews } from '../../../db/schema';

export async function POST(request: Request) {
  const en = new URL(request.url).searchParams.get('lang') === 'en';
  const message = (ar: string, english: string) => en ? english : ar;
  if (!sameOrigin(request)) return NextResponse.json({ error: message('تعذر التحقق من مصدر الطلب.', 'Invalid origin') }, { status: 403 });

  try {
    const data = reviewSchema.safeParse(await readLimitedJson(request, 12000));
    if (!data.success) return NextResponse.json({ error: message('يرجى مراجعة بيانات التقييم والموافقة على نشره.', 'Check review and consent') }, { status: 400 });

    let clientId = await readGuestId();
    let shouldSetCookie = false;
    if (!clientId) {
      clientId = `guest_${crypto.randomUUID()}`;
      shouldSetCookie = true;
    }

    const db = getDb();
    const recent = await db.select({ n: count() }).from(reviews).where(
      and(eq(reviews.userId, clientId), gte(reviews.createdAt, Date.now() - 86400000))
    ).get();

    if ((recent?.n || 0) >= 3) return NextResponse.json({ error: message('وصلت إلى الحد اليومي. يرجى المحاولة غداً.', 'Please try again tomorrow') }, { status: 429 });

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
      response.cookies.set(GUEST_COOKIE_NAME, await guestCookieValue(clientId), GUEST_COOKIE_OPTIONS);
    }
    return response;
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.status === 413
        ? message('حجم الطلب أكبر من المسموح.', 'The request is larger than allowed.')
        : message('يرجى مراجعة البيانات والمحاولة مجدداً.', 'Invalid JSON body')
      }, { status: error.status });
    }
    console.error('Failed to save review:', error);
    return NextResponse.json({ error: message('تعذر حفظ التقييم الآن. حاول مجدداً.', 'Could not save review') }, { status: 503 });
  }
}
