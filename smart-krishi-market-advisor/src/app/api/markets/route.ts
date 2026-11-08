import { db } from "@/db";
import { markets } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allMarkets = await db.select().from(markets).orderBy(asc(markets.name));
    return Response.json({ success: true, markets: allMarkets });
  } catch (error) {
    console.error("Fetch markets error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
