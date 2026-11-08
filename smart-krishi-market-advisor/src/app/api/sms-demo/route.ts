import { db } from "@/db";
import { smsDemoLogs, crops, markets, demandSupplyEstimates } from "@/db/schema";
import { desc, eq, ilike } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await db.select().from(smsDemoLogs).orderBy(desc(smsDemoLogs.id)).limit(25);
    return Response.json({ success: true, logs });
  } catch (error) {
    console.error("SMS logs error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, message } = body;

    if (!phoneNumber || !message) {
      return Response.json({ success: false, message: "Phone number and message are required" }, { status: 400 });
    }

    const cleanMsg = message.toLowerCase().trim();

    // 1. Fetch all crops and markets to match
    const allCrops = await db.select().from(crops);
    const allMarkets = await db.select().from(markets);

    let detectedCrop = allCrops.find(
      (c) =>
        cleanMsg.includes(c.name.toLowerCase()) ||
        cleanMsg.includes(c.teluguName.toLowerCase()) ||
        cleanMsg.includes(c.hindiName.toLowerCase())
    );

    // Fallback common crop aliases
    if (!detectedCrop) {
      if (cleanMsg.includes("tomato") || cleanMsg.includes("tamata")) detectedCrop = allCrops.find((c) => c.name === "Tomato");
      else if (cleanMsg.includes("onion") || cleanMsg.includes("pyaaz") || cleanMsg.includes("ulli")) detectedCrop = allCrops.find((c) => c.name === "Onion");
      else if (cleanMsg.includes("chilli") || cleanMsg.includes("mirchi")) detectedCrop = allCrops.find((c) => c.name === "Green Chilli");
      else if (cleanMsg.includes("cotton") || cleanMsg.includes("kapas") || cleanMsg.includes("patthi")) detectedCrop = allCrops.find((c) => c.name === "Cotton");
      else if (cleanMsg.includes("paddy") || cleanMsg.includes("rice") || cleanMsg.includes("vari") || cleanMsg.includes("dhan")) detectedCrop = allCrops.find((c) => c.name.includes("Paddy"));
      else if (cleanMsg.includes("turmeric") || cleanMsg.includes("pasupu") || cleanMsg.includes("haldi")) detectedCrop = allCrops.find((c) => c.name === "Turmeric");
    }

    let detectedMarket = allMarkets.find((m) => cleanMsg.includes(m.name.toLowerCase().split(" ")[0].replace("(", "")));
    if (!detectedMarket) {
      if (cleanMsg.includes("hyderabad") || cleanMsg.includes("hyd") || cleanMsg.includes("bowenpally")) detectedMarket = allMarkets.find((m) => m.name.includes("Hyderabad"));
      else if (cleanMsg.includes("guntur")) detectedMarket = allMarkets.find((m) => m.name.includes("Guntur"));
      else if (cleanMsg.includes("warangal")) detectedMarket = allMarkets.find((m) => m.name.includes("Warangal"));
      else if (cleanMsg.includes("kurnool")) detectedMarket = allMarkets.find((m) => m.name.includes("Kurnool"));
      else if (cleanMsg.includes("vijayawada")) detectedMarket = allMarkets.find((m) => m.name.includes("Vijayawada"));
      else if (cleanMsg.includes("nizamabad")) detectedMarket = allMarkets.find((m) => m.name.includes("Nizamabad"));
      else if (cleanMsg.includes("khammam")) detectedMarket = allMarkets.find((m) => m.name.includes("Khammam"));
    }

    let systemResponse = "";
    let queryType = "general";

    if (detectedCrop) {
      // Find estimate
      const estimates = await db
        .select({
          cropName: crops.name,
          marketName: markets.name,
          demand: demandSupplyEstimates.estimatedDemandTonnes,
          supply: demandSupplyEstimates.expectedSupplyTonnes,
          price: demandSupplyEstimates.averagePricePerQuintal,
        })
        .from(demandSupplyEstimates)
        .innerJoin(crops, eq(demandSupplyEstimates.cropId, crops.id))
        .innerJoin(markets, eq(demandSupplyEstimates.marketId, markets.id))
        .where(eq(crops.id, detectedCrop.id));

      const matchedEstimate = detectedMarket
        ? estimates.find((e) => e.marketName.toLowerCase().includes(detectedMarket.name.toLowerCase().split(" ")[0])) || estimates[0]
        : estimates[0];

      if (matchedEstimate) {
        const demand = Number(matchedEstimate.demand);
        const supply = Number(matchedEstimate.supply);
        const gap = supply - demand;
        const gapLabel = gap > 25 ? `Potential surplus: ${Math.round(gap)} tonnes.` : gap < -25 ? `Potential shortage: ${Math.abs(Math.round(gap))} tonnes.` : "Market is in supply balance.";

        systemResponse = `Demo result: ${matchedEstimate.cropName} in ${matchedEstimate.marketName}: Estimated demand is ${demand} tonnes and expected supply is ${supply} tonnes. ${gapLabel} Average mandi price: ₹${matchedEstimate.price}/quintal. (SIMULATED SMS)`;
        queryType = "demand_supply";
      } else {
        systemResponse = `Demo result: ${detectedCrop.name} base MSP is ₹${detectedCrop.mspPerQuintal}/quintal. Estimated seasonal arrivals are steady. Inquire about specific market (e.g. Hyderabad, Guntur, Warangal). (SIMULATED SMS)`;
        queryType = "crop_info";
      }
    } else {
      systemResponse = `Demo result: Smart Krishi Advisor: Could not identify crop name. Please send message in format: "[Crop Name] demand [Market Name]". Example: "Tomato demand Hyderabad" or "Onion price Kurnool". (SIMULATED SMS)`;
    }

    const [savedLog] = await db
      .insert(smsDemoLogs)
      .values({
        phoneNumber,
        userMessage: message,
        systemResponse,
        queryType,
        cropDetected: detectedCrop ? detectedCrop.name : "None",
        marketDetected: detectedMarket ? detectedMarket.name : "None",
      })
      .returning();

    return Response.json({ success: true, log: savedLog });
  } catch (error) {
    console.error("SMS POST error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
