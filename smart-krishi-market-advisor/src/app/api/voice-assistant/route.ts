import { db } from "@/db";
import { voiceInteractionLogs, crops, markets, demandSupplyEstimates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await db.select().from(voiceInteractionLogs).orderBy(desc(voiceInteractionLogs.id)).limit(15);
    return Response.json({ success: true, logs });
  } catch (error) {
    console.error("Voice logs error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { queryText, language = "en", queryType = "voice_assistant" } = await req.json();

    if (!queryText) {
      return Response.json({ success: false, message: "Query text is required" }, { status: 400 });
    }

    const clean = queryText.toLowerCase().trim();

    // 1. Match crop
    const allCrops = await db.select().from(crops);
    const allMarkets = await db.select().from(markets);

    let matchedCrop = allCrops.find(
      (c) =>
        clean.includes(c.name.toLowerCase()) ||
        clean.includes(c.teluguName.toLowerCase()) ||
        clean.includes(c.hindiName.toLowerCase())
    );

    if (!matchedCrop) {
      if (clean.includes("tomato") || clean.includes("tamata")) matchedCrop = allCrops.find((c) => c.name === "Tomato");
      else if (clean.includes("onion") || clean.includes("pyaaz") || clean.includes("ulli")) matchedCrop = allCrops.find((c) => c.name === "Onion");
      else if (clean.includes("chilli") || clean.includes("mirchi")) matchedCrop = allCrops.find((c) => c.name === "Green Chilli");
      else if (clean.includes("cotton") || clean.includes("kapas") || clean.includes("patthi")) matchedCrop = allCrops.find((c) => c.name === "Cotton");
      else if (clean.includes("paddy") || clean.includes("rice") || clean.includes("vari") || clean.includes("dhan")) matchedCrop = allCrops.find((c) => c.name.includes("Paddy"));
      else if (clean.includes("turmeric") || clean.includes("pasupu") || clean.includes("haldi")) matchedCrop = allCrops.find((c) => c.name === "Turmeric");
      else if (clean.includes("red gram") || clean.includes("tur dal") || clean.includes("kandulu")) matchedCrop = allCrops.find((c) => c.name.includes("Red Gram"));
      else if (clean.includes("maize") || clean.includes("makka") || clean.includes("jonna")) matchedCrop = allCrops.find((c) => c.name === "Maize");
    }

    // 2. Match market
    let matchedMarket = allMarkets.find((m) => clean.includes(m.name.toLowerCase().split(" ")[0].replace("(", "")));
    if (!matchedMarket) {
      if (clean.includes("hyderabad") || clean.includes("hyd") || clean.includes("bowenpally")) matchedMarket = allMarkets.find((m) => m.name.includes("Hyderabad"));
      else if (clean.includes("guntur")) matchedMarket = allMarkets.find((m) => m.name.includes("Guntur"));
      else if (clean.includes("warangal")) matchedMarket = allMarkets.find((m) => m.name.includes("Warangal"));
      else if (clean.includes("kurnool")) matchedMarket = allMarkets.find((m) => m.name.includes("Kurnool"));
      else if (clean.includes("vijayawada")) matchedMarket = allMarkets.find((m) => m.name.includes("Vijayawada"));
      else if (clean.includes("nizamabad")) matchedMarket = allMarkets.find((m) => m.name.includes("Nizamabad"));
      else if (clean.includes("khammam")) matchedMarket = allMarkets.find((m) => m.name.includes("Khammam"));
    }

    let responseText = "";

    if (matchedCrop) {
      // Fetch relevant estimates
      const estimates = await db
        .select({
          cropName: crops.name,
          teluguName: crops.teluguName,
          hindiName: crops.hindiName,
          marketName: markets.name,
          demand: demandSupplyEstimates.estimatedDemandTonnes,
          supply: demandSupplyEstimates.expectedSupplyTonnes,
          price: demandSupplyEstimates.averagePricePerQuintal,
        })
        .from(demandSupplyEstimates)
        .innerJoin(crops, eq(demandSupplyEstimates.cropId, crops.id))
        .innerJoin(markets, eq(demandSupplyEstimates.marketId, markets.id))
        .where(eq(crops.id, matchedCrop.id));

      const estimate = matchedMarket
        ? estimates.find((e) => e.marketName.toLowerCase().includes(matchedMarket.name.toLowerCase().split(" ")[0])) || estimates[0]
        : estimates[0];

      if (estimate) {
        const demand = Number(estimate.demand);
        const supply = Number(estimate.supply);
        const gap = supply - demand;

        if (language === "te") {
          const gapTe = gap > 0 ? `సుమారు ${Math.round(gap)} టన్నుల మిగులు సప్లై ఉంది.` : gap < 0 ? `సుమారు ${Math.abs(Math.round(gap))} టన్నుల సప్లై కొరత ఉంది.` : "మార్కెట్ సమతుల్యంగా ఉంది.";
          responseText = `${estimate.marketName} లో, ${estimate.teluguName} అంచనా డిమాండ్ ${demand} టన్నులు, సప్లై ${supply} టన్నులు. ${gapTe} సగటు ధర క్వింటాలుకు ₹${estimate.price} రూపాయలు.`;
        } else if (language === "hi") {
          const gapHi = gap > 0 ? `लगभग ${Math.round(gap)} टन का अधिशेष (सरप्लस) है.` : gap < 0 ? `लगभग ${Math.abs(Math.round(gap))} टन की कमी (शॉर्टेज) है.` : "बाजार संतुलित है.";
          responseText = `${estimate.marketName} में, ${estimate.hindiName} की अनुमानित मांग ${demand} टन और आपूर्ति ${supply} टन है. ${gapHi} वर्तमान औसत मंडी भाव ₹${estimate.price} प्रति क्विंटल है.`;
        } else {
          const gapEn = gap > 25 ? `This indicates a potential surplus of ${Math.round(gap)} tonnes.` : gap < -25 ? `This indicates a potential shortage of ${Math.abs(Math.round(gap))} tonnes.` : "The market is currently in supply-demand balance.";
          responseText = `In ${estimate.marketName}, ${estimate.cropName} estimated demand is ${demand} tonnes, while expected supply is ${supply} tonnes. ${gapEn} The average market price is ₹${estimate.price.toLocaleString("en-IN")} per quintal.`;
        }
      } else {
        responseText = `For ${matchedCrop.name}, standard government Minimum Support Price (MSP) is ₹${matchedCrop.mspPerQuintal} per quintal. Expected crop maturity duration is ${matchedCrop.durationDays} days.`;
      }
    } else {
      if (language === "te") {
        responseText = "నమస్కారం! పంట పేరు స్పష్టంగా చెప్పండి. ఉదాహరణకు: 'హైదరాబాద్ లో టమాటా డిమాండ్ ఎంత?' లేదా 'గుంటూరు మిర్చి ధర ఎంత?'";
      } else if (language === "hi") {
        responseText = "नमस्ते! कृपया फसल का नाम स्पष्ट बोलें. उदाहरण: 'हैदराबाद में टमाटर की मांग क्या है?' या 'कुरनूल में प्याज का भाव क्या है?'";
      } else {
        responseText = "Hello! Smart Krishi Assistant here. Please mention a crop name and market. For example: 'What is the tomato demand in Hyderabad?' or 'What is the onion price in Kurnool?'";
      }
    }

    const [savedLog] = await db
      .insert(voiceInteractionLogs)
      .values({
        queryText,
        responseText,
        language,
        audioSupported: true,
        queryType,
      })
      .returning();

    return Response.json({
      success: true,
      queryText,
      responseText,
      matchedCrop: matchedCrop ? matchedCrop.name : null,
      matchedMarket: matchedMarket ? matchedMarket.name : null,
      logId: savedLog.id,
    });
  } catch (error) {
    console.error("Voice assistant error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
