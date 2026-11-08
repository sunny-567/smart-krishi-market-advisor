import { db } from "@/db";
import { callbackRequests, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status");

    const rows = await db
      .select({
        id: callbackRequests.id,
        userId: callbackRequests.userId,
        farmerName: callbackRequests.farmerName,
        phoneNumber: callbackRequests.phoneNumber,
        preferredLanguage: callbackRequests.preferredLanguage,
        reason: callbackRequests.reason,
        preferredTime: callbackRequests.preferredTime,
        status: callbackRequests.status,
        adminNotes: callbackRequests.adminNotes,
        createdAt: callbackRequests.createdAt,
        updatedAt: callbackRequests.updatedAt,
      })
      .from(callbackRequests)
      .orderBy(desc(callbackRequests.id));

    let filtered = rows;
    if (statusParam && statusParam !== "all") {
      filtered = filtered.filter((r) => (r.status || "").toLowerCase() === statusParam.toLowerCase());
    }

    return Response.json({ success: true, callbacks: filtered });
  } catch (error) {
    console.error("Callback GET error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, farmerName, phoneNumber, preferredLanguage, reason, preferredTime } = body;

    if (!farmerName || !phoneNumber || !reason) {
      return Response.json({ success: false, message: "Name, phone, and reason are required" }, { status: 400 });
    }

    const [newCallback] = await db
      .insert(callbackRequests)
      .values({
        userId: userId ? Number(userId) : null,
        farmerName,
        phoneNumber,
        preferredLanguage: preferredLanguage || "Telugu",
        reason,
        preferredTime: preferredTime || "Morning (10:00 AM - 1:00 PM)",
        status: "Pending",
        adminNotes: "New incoming callback request from farmer portal.",
      })
      .returning();

    return Response.json({ success: true, callback: newCallback });
  } catch (error) {
    console.error("Callback POST error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return Response.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const updates: Partial<typeof callbackRequests.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const [updated] = await db
      .update(callbackRequests)
      .set(updates)
      .where(eq(callbackRequests.id, Number(id)))
      .returning();

    return Response.json({ success: true, callback: updated });
  } catch (error) {
    console.error("Callback PATCH error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
