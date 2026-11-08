import { db } from "@/db";
import { demandSupplyEstimates, crops, markets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cropIdParam = url.searchParams.get("cropId");

    const rows = await db
      .select({
        id: demandSupplyEstimates.id,
        cropId: crops.id,
        cropName: crops.name,
        category: crops.category,
        msp: crops.mspPerQuintal,
        marketId: markets.id,
        marketName: markets.name,
        district: markets.district,
        state: markets.state,
        pricePerQuintal: demandSupplyEstimates.averagePricePerQuintal,
        reportingDate: demandSupplyEstimates.reportingDate,
        expectedSupplyTonnes: demandSupplyEstimates.expectedSupplyTonnes,
        estimatedDemandTonnes: demandSupplyEstimates.estimatedDemandTonnes,
      })
      .from(demandSupplyEstimates)
      .innerJoin(crops, eq(demandSupplyEstimates.cropId, crops.id))
      .innerJoin(markets, eq(demandSupplyEstimates.marketId, markets.id))
      .orderBy(desc(demandSupplyEstimates.averagePricePerQuintal));

    let filtered = rows;
    if (cropIdParam && cropIdParam !== "all") {
      filtered = filtered.filter((r) => String(r.cropId) === cropIdParam);
    }

    return Response.json({ success: true, prices: filtered });
  } catch (error) {
    console.error("Market prices error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
