import { NextResponse } from "next/server";
import { and, eq, gte, count } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";
import { inquirySchema, formatInquiryMessage, branchBand } from "../../../lib/inquiry";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "تعذر التحقق من مصدر الطلب." }, { status: 403 });
  }

  if (Number(request.headers.get("content-length") || 0) > 16000) {
    return NextResponse.json({ error: "حجم الطلب أكبر من المسموح." }, { status: 413 });
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "يرجى مراجعة البيانات والمحاولة مجددًا." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({
      error: "يرجى إدخال الاسم وبيانات المركز وبريد ورقم هاتف صحيحين، والموافقة على استخدام بيانات التواصل."
    }, { status: 400 });
  }

  const { id, name, email, phone, organization, facility, branches, interest, plan, message, locale, offer, scope, systems } = parsed.data;

  // Retrieve or generate guest client ID for tracking user requests without login
  const cookieStore = await cookies();
  let clientId = cookieStore.get("viara_uid")?.value;
  let shouldSetCookie = false;
  if (!clientId) {
    clientId = `guest_${crypto.randomUUID()}`;
    shouldSetCookie = true;
  }

  try {
    const db = getDb();
    const previous = await db.select({ userId: inquiries.userId }).from(inquiries).where(eq(inquiries.id, id)).get();
    if (previous) {
      const res = NextResponse.json({ id, reference: `VR-${id.slice(0, 8).toUpperCase()}` });
      if (shouldSetCookie) {
        res.cookies.set("viara_uid", clientId, { path: "/", httpOnly: true, sameSite: "lax", maxAge: 31536000 });
      }
      return res;
    }

    const recent = await db.select({ total: count() }).from(inquiries).where(
      and(eq(inquiries.email, email), gte(inquiries.createdAt, Date.now() - 3600000))
    ).get();

    if ((recent?.total || 0) >= 10) {
      return NextResponse.json({ error: "وصلت إلى الحد المسموح للطلبات. يرجى المحاولة لاحقًا." }, { status: 429 });
    }

    await db.insert(inquiries).values({
      id,
      userId: clientId,
      name,
      email,
      phone,
      organization,
      facility,
      branches: scope ? branchBand(scope.branches) : branches,
      interest,
      plan,
      message: formatInquiryMessage(message, scope, locale, systems),
      locale,
      offer,
      createdAt: Date.now()
    });

    const res = NextResponse.json({ id, reference: `VR-${id.slice(0, 8).toUpperCase()}` }, { status: 201 });
    if (shouldSetCookie) {
      res.cookies.set("viara_uid", clientId, { path: "/", httpOnly: true, sameSite: "lax", maxAge: 31536000 });
    }
    return res;
  } catch {
    return NextResponse.json({ error: "تعذر حفظ الطلب الآن. بياناتك ما زالت في النموذج؛ يرجى المحاولة مجددًا." }, { status: 503 });
  }
}
