import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getAdmin } from "../../../../lib/admin-auth";
import { getDb } from "../../../../db";
import { inquiries } from "../../../../db/schema";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "مصدر الطلب غير صحيح." }, { status: 403 });
  }

  const { id } = await params;
  const cookieStore = await cookies();
  const clientId = cookieStore.get("viara_uid")?.value;
  const admin = await getAdmin();

  if (!clientId && !admin) {
    return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
  }

  try {
    const db = getDb();
    const whereClause = admin
      ? eq(inquiries.id, id)
      : and(eq(inquiries.id, id), eq(inquiries.userId, clientId!));

    const removed = await db.delete(inquiries).where(whereClause).returning({ id: inquiries.id });
    if (!removed.length) {
      return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "تعذر حذف الطلب." }, { status: 503 });
  }
}
