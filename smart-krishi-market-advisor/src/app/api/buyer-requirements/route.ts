import { db } from "@/db";
import { buyerRequirements, produceListings, crops, markets, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");

    // Fetch buyer requirements
    const reqRows = await db
      .select({
        id: buyerRequirements.id,
        userId: buyerRequirements.userId,
        buyerName: users.name,
        buyerPhone: users.phone,
        cropId: crops.id,
        cropName: crops.name,
        marketId: markets.id,
        marketName: markets.name,
        requiredQuantityTonnes: buyerRequirements.requiredQuantityTonnes,
        targetPricePerQuintal: buyerRequirements.targetPricePerQuintal,
        requiredByDate: buyerRequirements.requiredByDate,
        deliveryLocation: buyerRequirements.deliveryLocation,
        status: buyerRequirements.status,
        createdAt: buyerRequirements.createdAt,
      })
      .from(buyerRequirements)
      .innerJoin(crops, eq(buyerRequirements.cropId, crops.id))
      .innerJoin(markets, eq(buyerRequirements.marketId, markets.id))
      .innerJoin(users, eq(buyerRequirements.userId, users.id))
      .orderBy(desc(buyerRequirements.id));

    // Fetch active produce listings to calculate matching
    const listings = await db
      .select({
        id: produceListings.id,
        userId: produceListings.userId,
        farmerName: users.name,
        farmerPhone: users.phone,
        cropId: produceListings.cropId,
        cropName: crops.name,
        marketId: produceListings.marketId,
        marketName: markets.name,
        availableQuantityTonnes: produceListings.availableQuantityTonnes,
        expectedPricePerQuintal: produceListings.expectedPricePerQuintal,
        harvestDate: produceListings.harvestDate,
        location: produceListings.location,
        qualityGrade: produceListings.qualityGrade,
      })
      .from(produceListings)
      .innerJoin(crops, eq(produceListings.cropId, crops.id))
      .innerJoin(markets, eq(produceListings.marketId, markets.id))
      .innerJoin(users, eq(produceListings.userId, users.id))
      .where(eq(produceListings.status, "active"));

    // Attach matching produce listings to each requirement
    const enrichedRequirements = reqRows.map((req) => {
      const matches = listings
        .filter((l) => l.cropId === req.cropId)
        .map((l) => {
          // Calculate match score
          let score = 50; // Base match for same crop
          if (l.marketId === req.marketId) score += 25; // Same market hub
          if (l.expectedPricePerQuintal <= req.targetPricePerQuintal) score += 20; // Price within or below buyer target
          else if (l.expectedPricePerQuintal <= req.targetPricePerQuintal * 1.1) score += 10; // Within 10%
          if (Number(l.availableQuantityTonnes) >= Number(req.requiredQuantityTonnes) * 0.5) score += 5;

          return {
            ...l,
            matchScore: Math.min(100, score),
            priceDifference: l.expectedPricePerQuintal - req.targetPricePerQuintal,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

      return {
        ...req,
        matchingListings: matches,
        matchCount: matches.length,
      };
    });

    let filtered = enrichedRequirements;
    if (userIdParam) {
      filtered = filtered.filter((r) => String(r.userId) === userIdParam);
    }

    return Response.json({ success: true, requirements: filtered });
  } catch (error) {
    console.error("Buyer requirements GET error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      cropId,
      marketId,
      requiredQuantityTonnes,
      targetPricePerQuintal,
      requiredByDate,
      deliveryLocation,
    } = body;

    if (!userId || !cropId || !marketId || !requiredQuantityTonnes || !targetPricePerQuintal) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const [newReq] = await db
      .insert(buyerRequirements)
      .values({
        userId: Number(userId),
        cropId: Number(cropId),
        marketId: Number(marketId),
        requiredQuantityTonnes: String(requiredQuantityTonnes),
        targetPricePerQuintal: Number(targetPricePerQuintal),
        requiredByDate: requiredByDate || new Date().toISOString().split("T")[0],
        deliveryLocation: deliveryLocation || "Central APMC Warehouse",
        status: "open",
      })
      .returning();

    return Response.json({ success: true, requirement: newReq });
  } catch (error) {
    console.error("Buyer requirements POST error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return Response.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await db.delete(buyerRequirements).where(eq(buyerRequirements.id, Number(id)));
    return Response.json({ success: true, message: "Requirement deleted" });
  } catch (error) {
    console.error("Buyer requirements DELETE error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
