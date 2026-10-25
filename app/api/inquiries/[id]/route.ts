import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getAdmin, sameOrigin } from "../../../../lib/admin-auth";
import { readGuestId } from "../../../../lib/guest-identity";
import { getDb } from "../../../../db";
import { inquiries } from "../../../../db/schema";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "مصدر الطلب غير صحيح." }, { status: 403 });
  }

  const { id } = await params;
  const clientId = await readGuestId();
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
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json({ error: "تعذر حذف الطلب." }, { status: 503 });
  }
}
