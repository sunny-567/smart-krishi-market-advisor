import { db } from "@/db";
import { notifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");

    const rows = await db.select().from(notifications).orderBy(desc(notifications.id));

    let filtered = rows;
    if (userIdParam) {
      filtered = filtered.filter((n) => n.userId === null || String(n.userId) === userIdParam);
    }

    return Response.json({ success: true, notifications: filtered });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return Response.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, Number(id)))
      .returning();

    return Response.json({ success: true, notification: updated });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
