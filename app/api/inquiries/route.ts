import { NextResponse } from "next/server";
import { and, eq, gte, count } from "drizzle-orm";
import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";
import { inquirySchema, formatInquiryMessage, branchBand } from "../../../lib/inquiry";
import { GUEST_COOKIE_NAME, GUEST_COOKIE_OPTIONS, readGuestId, guestCookieValue } from "../../../lib/guest-identity";
import { sameOrigin } from "../../../lib/admin-auth";

import { readLimitedJson, RequestBodyError } from "../../../lib/request-body";
const messages = {
  ar: {
    origin: "تعذر التحقق من مصدر الطلب.",
    size: "حجم الطلب أكبر من المسموح.",
    parse: "يرجى مراجعة البيانات والمحاولة مجددًا.",
    validation: "يرجى إدخال الاسم وبيانات المركز وبريد ورقم هاتف صحيحين، والموافقة على استخدام بيانات التواصل.",
    limit: "وصلت إلى الحد المسموح للطلبات. يرجى المحاولة لاحقًا.",
    failure: "تعذر حفظ الطلب الآن. بياناتك ما زالت في النموذج؛ يرجى المحاولة مجددًا."
  },
  en: {
    origin: "We could not verify the request origin.",
    size: "The request is larger than allowed.",
    parse: "Please review your details and try again.",
    validation: "Enter a valid name, facility, email and phone number, and accept the contact consent.",
    limit: "You have reached the request limit. Please try later.",
    failure: "We could not save your request. Your details are still in the form; please try again."
  }
} as const;

export async function POST(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "ar";
  const m = messages[lang];

  if (!sameOrigin(request)) {
    return NextResponse.json({ error: m.origin }, { status: 403 });
  }

  let data: unknown;
  try {
    data = await readLimitedJson(request, 16000);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: status === 413 ? m.size : m.parse }, { status });
  }
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({
      error: m.validation,
      fields: [...new Set(parsed.error.issues.map(issue => String(issue.path[0] || '')).filter(Boolean))]
    }, { status: 400 });
  }

  const { id, name, email, phone, organization, facility, branches, interest, plan, message, locale, offer, scope, systems } = parsed.data;

  // Retrieve or generate guest client ID for tracking user requests without login
  let clientId = await readGuestId();
  let shouldSetCookie = false;
  if (!clientId) {
    clientId = `guest_${crypto.randomUUID()}`;
    shouldSetCookie = true;
  }

  try {
    const db = getDb();
    const previous = await db.select({ userId: inquiries.userId }).from(inquiries).where(eq(inquiries.id, id)).get();
    if (previous) {
      if (previous.userId !== clientId) {
        return NextResponse.json({ error: m.parse }, { status: 409 });
      }
      const res = NextResponse.json({ id, reference: `VR-${id.slice(0, 8).toUpperCase()}` });
      if (shouldSetCookie) {
        res.cookies.set(GUEST_COOKIE_NAME, await guestCookieValue(clientId), GUEST_COOKIE_OPTIONS);
      }
      return res;
    }

    const recent = await db.select({ total: count() }).from(inquiries).where(
      and(eq(inquiries.email, email), gte(inquiries.createdAt, Date.now() - 3600000))
    ).get();

    if ((recent?.total || 0) >= 10) {
      return NextResponse.json({ error: m.limit }, { status: 429 });
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

    // Optional instant sales alert webhook dispatch (non-blocking)
    const salesWebhook = process.env.SALES_WEBHOOK_URL;
    if (salesWebhook) {
      fetch(salesWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_inquiry',
          reference: `VR-${id.slice(0, 8).toUpperCase()}`,
          name,
          organization,
          facility,
          email,
          phone,
          interest,
          plan,
          locale,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Sales webhook notification failed:', err));
    }

    const res = NextResponse.json({ id, reference: `VR-${id.slice(0, 8).toUpperCase()}` }, { status: 201 });
    if (shouldSetCookie) {
      res.cookies.set(GUEST_COOKIE_NAME, await guestCookieValue(clientId), GUEST_COOKIE_OPTIONS);
    }
    return res;
  } catch (error) {
    console.error('Failed to save inquiry:', error);
    return NextResponse.json({ error: m.failure }, { status: 503 });
  }
}
