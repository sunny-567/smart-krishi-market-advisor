import { db } from "@/db";
import { demandSupplyEstimates, crops, markets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cropFilter = url.searchParams.get("cropId");
    const marketFilter = url.searchParams.get("marketId");
    const statusFilter = url.searchParams.get("status"); // 'surplus' | 'shortage' | 'balanced'

    const rows = await db
      .select({
        id: demandSupplyEstimates.id,
        cropId: crops.id,
        cropName: crops.name,
        teluguName: crops.teluguName,
        hindiName: crops.hindiName,
        category: crops.category,
        marketId: markets.id,
        marketName: markets.name,
        state: markets.state,
        district: markets.district,
        estimatedDemand: demandSupplyEstimates.estimatedDemandTonnes,
        expectedSupply: demandSupplyEstimates.expectedSupplyTonnes,
        averagePrice: demandSupplyEstimates.averagePricePerQuintal,
        reportingDate: demandSupplyEstimates.reportingDate,
        dataSource: demandSupplyEstimates.dataSource,
        sampleLabel: demandSupplyEstimates.sampleLabel,
      })
      .from(demandSupplyEstimates)
      .innerJoin(crops, eq(demandSupplyEstimates.cropId, crops.id))
      .innerJoin(markets, eq(demandSupplyEstimates.marketId, markets.id))
      .orderBy(desc(demandSupplyEstimates.id));

    // Calculate Supply Gap = Expected Supply - Estimated Demand
    const enriched = rows.map((r) => {
      const demand = Number(r.estimatedDemand);
      const supply = Number(r.expectedSupply);
      const gap = Math.round((supply - demand) * 10) / 10;

      let status: "surplus" | "shortage" | "balanced";
      let statusLabel = "";
      let severity: "high" | "moderate" | "low" = "moderate";

      const threshold = Math.max(25, demand * 0.05);

      if (gap > threshold) {
        status = "surplus";
        statusLabel = "Potential Surplus";
        severity = gap > demand * 0.3 ? "high" : "moderate";
      } else if (gap < -threshold) {
        status = "shortage";
        statusLabel = "Potential Shortage";
        severity = Math.abs(gap) > demand * 0.25 ? "high" : "moderate";
      } else {
        status = "balanced";
        statusLabel = "Balanced Supply";
        severity = "low";
      }

      return {
        ...r,
        demand,
        supply,
        gap,
        status,
        statusLabel,
        severity,
      };
    });

    // Apply filters
    let filtered = enriched;
    if (cropFilter && cropFilter !== "all") {
      filtered = filtered.filter((item) => String(item.cropId) === cropFilter);
    }
    if (marketFilter && marketFilter !== "all") {
      filtered = filtered.filter((item) => String(item.marketId) === marketFilter);
    }
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Overall summary metrics calculated from actual application data
    const totalRecords = enriched.length;
    const uniqueCrops = new Set(enriched.map((e) => e.cropId)).size;
    const surplusCount = enriched.filter((e) => e.status === "surplus").length;
    const shortageCount = enriched.filter((e) => e.status === "shortage").length;
    const balancedCount = enriched.filter((e) => e.status === "balanced").length;
    const totalPrices = enriched.reduce((acc, curr) => acc + curr.averagePrice, 0);
    const avgPrice = totalRecords > 0 ? Math.round(totalPrices / totalRecords) : 0;

    return Response.json({
      success: true,
      summary: {
        totalCropsMonitored: uniqueCrops,
        totalEstimates: totalRecords,
        surplusCount,
        shortageCount,
        balancedCount,
        averageMarketPrice: avgPrice,
      },
      records: filtered,
    });
  } catch (error) {
    console.error("Demand supply API error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
