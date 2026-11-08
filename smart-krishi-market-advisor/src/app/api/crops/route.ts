import { db } from "@/db";
import { crops } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allCrops = await db.select().from(crops).orderBy(asc(crops.name));
    return Response.json({ success: true, crops: allCrops });
  } catch (error) {
    console.error("Fetch crops error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
