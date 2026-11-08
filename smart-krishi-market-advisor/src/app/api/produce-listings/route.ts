import { db } from "@/db";
import { produceListings, crops, markets, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const cropIdParam = url.searchParams.get("cropId");

    const rows = await db
      .select({
        id: produceListings.id,
        userId: produceListings.userId,
        farmerName: users.name,
        farmerPhone: users.phone,
        cropId: crops.id,
        cropName: crops.name,
        category: crops.category,
        marketId: markets.id,
        marketName: markets.name,
        availableQuantityTonnes: produceListings.availableQuantityTonnes,
        expectedPricePerQuintal: produceListings.expectedPricePerQuintal,
        harvestDate: produceListings.harvestDate,
        location: produceListings.location,
        qualityGrade: produceListings.qualityGrade,
        status: produceListings.status,
        createdAt: produceListings.createdAt,
      })
      .from(produceListings)
      .innerJoin(crops, eq(produceListings.cropId, crops.id))
      .innerJoin(markets, eq(produceListings.marketId, markets.id))
      .innerJoin(users, eq(produceListings.userId, users.id))
      .orderBy(desc(produceListings.id));

    let filtered = rows;
    if (userIdParam) {
      filtered = filtered.filter((r) => String(r.userId) === userIdParam);
    }
    if (cropIdParam && cropIdParam !== "all") {
      filtered = filtered.filter((r) => String(r.cropId) === cropIdParam);
    }

    return Response.json({ success: true, listings: filtered });
  } catch (error) {
    console.error("Produce listings GET error:", error);
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
      availableQuantityTonnes,
      expectedPricePerQuintal,
      harvestDate,
      location,
      qualityGrade,
    } = body;

    if (!userId || !cropId || !marketId || !availableQuantityTonnes || !expectedPricePerQuintal) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const [newListing] = await db
      .insert(produceListings)
      .values({
        userId: Number(userId),
        cropId: Number(cropId),
        marketId: Number(marketId),
        availableQuantityTonnes: String(availableQuantityTonnes),
        expectedPricePerQuintal: Number(expectedPricePerQuintal),
        harvestDate: harvestDate || new Date().toISOString().split("T")[0],
        location: location || "Local Mandal, Telangana",
        qualityGrade: qualityGrade || "Grade A",
        status: "active",
      })
      .returning();

    return Response.json({ success: true, listing: newListing });
  } catch (error) {
    console.error("Produce listings POST error:", error);
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

    await db.delete(produceListings).where(eq(produceListings.id, Number(id)));
    return Response.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    console.error("Produce listings DELETE error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
