import { db } from "@/db";
import { demandSupplyEstimates, crops, markets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export interface RecommendationResult {
  cropName: string;
  marketName: string;
  verdict: "STRONG_OPPORTUNITY" | "PROCEED_WITH_CAUTION" | "SUPPLY_GLUT_WARNING" | "ALTERNATE_MARKET_RECOMMENDED" | "BALANCED_FAVORABLE";
  title: string;
  recommendation: string;
  reason: string;
  actionableSteps: string[];
  metrics: {
    demand: number;
    supply: number;
    supplyGap: number;
    averagePrice: number;
    msp: number;
    priceVsMspDiff: number;
    alternateMarketSuggestion?: {
      marketName: string;
      price: number;
      priceGain: number;
    };
  };
  disclaimer: string;
}

export async function POST(req: Request) {
  try {
    const { cropId, marketId, plannedQuantityTonnes, targetPricePerQuintal } = await req.json();

    if (!cropId) {
      return Response.json({ success: false, message: "Crop is required" }, { status: 400 });
    }

    const [selectedCrop] = await db.select().from(crops).where(eq(crops.id, Number(cropId)));
    if (!selectedCrop) {
      return Response.json({ success: false, message: "Crop not found" }, { status: 404 });
    }

    // Get all estimates for this crop across all markets
    const allEstimates = await db
      .select({
        id: demandSupplyEstimates.id,
        cropId: crops.id,
        cropName: crops.name,
        marketId: markets.id,
        marketName: markets.name,
        demand: demandSupplyEstimates.estimatedDemandTonnes,
        supply: demandSupplyEstimates.expectedSupplyTonnes,
        price: demandSupplyEstimates.averagePricePerQuintal,
      })
      .from(demandSupplyEstimates)
      .innerJoin(crops, eq(demandSupplyEstimates.cropId, crops.id))
      .innerJoin(markets, eq(demandSupplyEstimates.marketId, markets.id))
      .where(eq(crops.id, Number(cropId)));

    if (allEstimates.length === 0) {
      return Response.json({
        success: true,
        recommendation: {
          cropName: selectedCrop.name,
          marketName: "Regional Mandi",
          verdict: "BALANCED_FAVORABLE",
          title: "Sufficient Historical Balance",
          recommendation: `Monitor local APMC arrivals for ${selectedCrop.name}. Ensure produce meets Grade-A standards.`,
          reason: "Baseline historical market arrivals show steady consumption patterns.",
          actionableSteps: ["Verify current daily arrivals at nearest APMC", "Target packaging in 25-50 kg standardized crates"],
          metrics: {
            demand: 500,
            supply: 500,
            supplyGap: 0,
            averagePrice: selectedCrop.mspPerQuintal,
            msp: selectedCrop.mspPerQuintal,
            priceVsMspDiff: 0,
          },
          disclaimer: "Academic rule-based demonstration. Market conditions are subject to weather, arrivals, and local transport factors.",
        },
      });
    }

    // Pick target estimate (or first if market not specified)
    let currentEstimate = allEstimates.find((e) => !marketId || e.marketId === Number(marketId)) || allEstimates[0];

    const demand = Number(currentEstimate.demand);
    const supply = Number(currentEstimate.supply);
    const gap = supply - demand;
    const price = currentEstimate.price;
    const msp = selectedCrop.mspPerQuintal;
    const priceVsMsp = price - msp;

    // Look for higher priced alternate market for this crop
    let alternateSuggestion: { marketName: string; price: number; priceGain: number } | undefined;
    const betterMarket = allEstimates
      .filter((e) => e.marketId !== currentEstimate.marketId && e.price > price)
      .sort((a, b) => b.price - a.price)[0];

    if (betterMarket && betterMarket.price - price >= 200) {
      alternateSuggestion = {
        marketName: betterMarket.marketName,
        price: betterMarket.price,
        priceGain: betterMarket.price - price,
      };
    }

    // RULE-BASED ENGINE
    let verdict: RecommendationResult["verdict"] = "BALANCED_FAVORABLE";
    let title = "";
    let recommendation = "";
    let reason = "";
    let actionableSteps: string[] = [];

    // Rule 1: High Surplus Glut (Supply > Demand by over 20%)
    if (gap > demand * 0.2) {
      if (alternateSuggestion) {
        verdict = "ALTERNATE_MARKET_RECOMMENDED";
        title = `Alternate Market Advised: Shift to ${alternateSuggestion.marketName}`;
        recommendation = `High estimated supply in ${currentEstimate.marketName} (+${Math.round(gap)}t surplus) may soften prices. Transporting to ${alternateSuggestion.marketName} yields ₹${alternateSuggestion.priceGain}/quintal higher price.`;
        reason = `Local supply (${supply} tonnes) exceeds estimated demand (${demand} tonnes). However, ${alternateSuggestion.marketName} has stronger price realization (₹${alternateSuggestion.price}/quintal).`;
        actionableSteps = [
          `Calculate freight cost per quintal to ${alternateSuggestion.marketName} (must be less than ₹${Math.round(alternateSuggestion.priceGain * 0.6)})`,
          "Consider farm-gate pre-grading to negotiate premium Grade-A pricing",
          "Stagger harvesting across 7-10 days rather than dumping all produce at once",
        ];
      } else {
        verdict = "SUPPLY_GLUT_WARNING";
        title = "Supply Glut Warning: Potential Price Softening";
        recommendation = `Expected supply exceeds demand by ${Math.round(gap)} tonnes (+${Math.round((gap / demand) * 100)}%). Sell early or explore secondary processing/cold storage.`;
        reason = `Significant local over-supply will likely give wholesale buyers leverage to negotiate lower bids below the current ₹${price}/quintal average.`;
        actionableSteps = [
          "Avoid late arrival at mandi; early morning lots generally achieve better prices",
          "Explore collective transport with neighboring farmers to reduce logistics cost",
          "Review cold storage options if holding cost is under ₹80/quintal per month",
        ];
      }
    }
    // Rule 2: High Shortage / Deficit (Demand > Supply by over 15%)
    else if (gap < -demand * 0.15) {
      verdict = "STRONG_OPPORTUNITY";
      title = "Prime Market Opportunity: High Demand Shortage";
      recommendation = `Strong seller advantage. Demand exceeds expected supply by ${Math.abs(Math.round(gap))} tonnes. Buyers are actively seeking reliable supply.`;
      reason = `Shortage of ${Math.abs(Math.round(gap))} tonnes at ${currentEstimate.marketName} supports firm prices (currently ₹${price}/quintal, which is ₹${priceVsMsp >= 0 ? "+" + priceVsMsp : priceVsMsp} vs MSP).`;
      actionableSteps = [
        "Post produce on Smart Krishi Produce Listing to attract direct wholesale buyers",
        "Maintain proper drying / sorting to demand top-tier mandi auction bids",
        "Secure written or confirmed commitments before dispatching long distance",
      ];
    }
    // Rule 3: Balanced or Moderate Gap with below MSP pricing
    else if (price < msp) {
      verdict = "PROCEED_WITH_CAUTION";
      title = "Price Below Minimum Support Price (MSP)";
      recommendation = `Current market price (₹${price}/q) is ₹${Math.abs(priceVsMsp)} below government MSP (₹${msp}/q). Verify if government procurement centers are operational.`;
      reason = `Even though supply-demand is relatively balanced (${supply}t vs ${demand}t), market price realization is lagging support benchmarks.`;
      actionableSteps = [
        "Check registration dates for APMC / FCI / NAFED procurement centers",
        "Review moisture content specifications required for MSP procurement",
        "Post your required price on the buyer portal to discover out-of-mandi millers",
      ];
    }
    // Rule 4: Normal Balanced Market
    else {
      verdict = "BALANCED_FAVORABLE";
      title = "Balanced Market: Stable Price Discovery Expected";
      recommendation = `Supply and demand are closely aligned (Gap: ${gap >= 0 ? "+" : ""}${Math.round(gap)} tonnes). Favorable conditions for standard harvest scheduling.`;
      reason = `Arrivals match buyer consumption capacity at ${currentEstimate.marketName}. Prevailing price of ₹${price}/quintal offers healthy margins over MSP (₹${msp}/quintal).`;
      actionableSteps = [
        "Stick to planned harvesting schedule without distress or speculative delay",
        "Target standard 40-50 kg jute bag packaging for easy mandi bidding",
        "Monitor weather forecasts 48 hours prior to transit",
      ];
    }

    const result: RecommendationResult = {
      cropName: selectedCrop.name,
      marketName: currentEstimate.marketName,
      verdict,
      title,
      recommendation,
      reason,
      actionableSteps,
      metrics: {
        demand,
        supply,
        supplyGap: Math.round(gap),
        averagePrice: price,
        msp,
        priceVsMspDiff: priceVsMsp,
        alternateMarketSuggestion: alternateSuggestion,
      },
      disclaimer:
        "ACADEMIC RULE-BASED SYSTEM. This recommendation is calculated using rule heuristics on sample agricultural data for educational presentation. It does not provide guaranteed financial returns or future price promises.",
    };

    return Response.json({ success: true, recommendation: result });
  } catch (error) {
    console.error("Recommendation error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
