import { db } from "@/db";
import { demandSupplyEstimates, crops, markets, produceListings, buyerRequirements, callbackRequests, users } from "@/db/schema";
import { count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const estimates = await db.select().from(demandSupplyEstimates);
    const allCrops = await db.select().from(crops);
    const allMarkets = await db.select().from(markets);
    const listings = await db.select().from(produceListings);
    const reqs = await db.select().from(buyerRequirements);
    const callbacks = await db.select().from(callbackRequests);
    const allUsers = await db.select().from(users);

    // Calculate surplus vs shortage distribution
    let surplusTonnes = 0;
    let shortageTonnes = 0;
    let surplusCount = 0;
    let shortageCount = 0;
    let balancedCount = 0;

    estimates.forEach((e) => {
      const demand = Number(e.estimatedDemandTonnes);
      const supply = Number(e.expectedSupplyTonnes);
      const gap = supply - demand;
      if (gap > 25) {
        surplusCount++;
        surplusTonnes += gap;
      } else if (gap < -25) {
        shortageCount++;
        shortageTonnes += Math.abs(gap);
      } else {
        balancedCount++;
      }
    });

    // Market volume breakdown
    const marketVolumeMap: Record<string, { marketName: string; totalDemand: number; totalSupply: number; avgPrice: number; count: number }> = {};
    estimates.forEach((e) => {
      const m = allMarkets.find((mk) => mk.id === e.marketId);
      const mName = m ? m.name : `Market ${e.marketId}`;
      if (!marketVolumeMap[mName]) {
        marketVolumeMap[mName] = { marketName: mName, totalDemand: 0, totalSupply: 0, avgPrice: 0, count: 0 };
      }
      marketVolumeMap[mName].totalDemand += Number(e.estimatedDemandTonnes);
      marketVolumeMap[mName].totalSupply += Number(e.expectedSupplyTonnes);
      marketVolumeMap[mName].avgPrice += e.averagePricePerQuintal;
      marketVolumeMap[mName].count += 1;
    });

    const marketAnalytics = Object.values(marketVolumeMap).map((m) => ({
      marketName: m.marketName,
      totalDemandTonnes: m.totalDemand,
      totalSupplyTonnes: m.totalSupply,
      averagePrice: Math.round(m.avgPrice / m.count),
      netGap: m.totalSupply - m.totalDemand,
    }));

    // High demand crops
    const cropDemandList = allCrops.map((c) => {
      const cropEstimates = estimates.filter((e) => e.cropId === c.id);
      const totalDemand = cropEstimates.reduce((sum, e) => sum + Number(e.estimatedDemandTonnes), 0);
      const totalSupply = cropEstimates.reduce((sum, e) => sum + Number(e.expectedSupplyTonnes), 0);
      const avgPrice = cropEstimates.length > 0 ? Math.round(cropEstimates.reduce((sum, e) => sum + e.averagePricePerQuintal, 0) / cropEstimates.length) : c.mspPerQuintal;

      return {
        cropId: c.id,
        cropName: c.name,
        category: c.category,
        totalDemandTonnes: totalDemand,
        totalSupplyTonnes: totalSupply,
        netGap: totalSupply - totalDemand,
        status: totalSupply - totalDemand > 25 ? "Surplus" : totalSupply - totalDemand < -25 ? "Shortage" : "Balanced",
        averagePrice: avgPrice,
      };
    }).sort((a, b) => b.totalDemandTonnes - a.totalDemandTonnes);

    return Response.json({
      success: true,
      stats: {
        totalMonitoredCrops: allCrops.length,
        totalMarkets: allMarkets.length,
        totalUsers: allUsers.length,
        farmerCount: allUsers.filter((u) => u.role === "farmer").length,
        buyerCount: allUsers.filter((u) => u.role === "buyer").length,
        adminCount: allUsers.filter((u) => u.role === "admin").length,
        activeProduceListings: listings.filter((l) => l.status === "active").length,
        openBuyerRequirements: reqs.filter((r) => r.status === "open").length,
        callbackRequestsCount: callbacks.length,
        pendingCallbacks: callbacks.filter((c) => c.status === "Pending").length,
        surplusStats: {
          cropCount: surplusCount,
          totalTonnes: Math.round(surplusTonnes),
        },
        shortageStats: {
          cropCount: shortageCount,
          totalTonnes: Math.round(shortageTonnes),
        },
        balancedCount,
      },
      marketAnalytics,
      cropDemandList,
    });
  } catch (error) {
    console.error("Reports API error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
