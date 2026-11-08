import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await seedDatabase();
    return Response.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
