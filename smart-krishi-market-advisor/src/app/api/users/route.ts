import { db } from "@/db";
import { users, farmers, buyers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.id));

    // Get farmer profiles
    const farmerProfiles = await db.select().from(farmers);
    const buyerProfiles = await db.select().from(buyers);

    const enriched = allUsers.map((u) => {
      const farmerInfo = farmerProfiles.find((f) => f.userId === u.id);
      const buyerInfo = buyerProfiles.find((b) => b.userId === u.id);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        location: u.location,
        preferredLanguage: u.preferredLanguage,
        createdAt: u.createdAt,
        farmerDetails: farmerInfo || null,
        buyerDetails: buyerInfo || null,
      };
    });

    return Response.json({ success: true, users: enriched });
  } catch (error) {
    console.error("Users GET error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, role, location, phone } = await req.json();
    if (!id) {
      return Response.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const updates: Partial<typeof users.$inferInsert> = {};
    if (role) updates.role = role;
    if (location) updates.location = location;
    if (phone) updates.phone = phone;

    const [updated] = await db.update(users).set(updates).where(eq(users.id, Number(id))).returning();

    return Response.json({ success: true, user: updated });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
