import { db } from "@/db";
import { users, farmers, buyers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role, // 'farmer' | 'buyer'
      phone,
      location,
      preferredLanguage,
      // Farmer specific
      farmSizeAcres,
      primaryCrops,
      soilType,
      irrigationType,
      experienceYears,
      // Buyer specific
      companyName,
      businessType,
      gstNumber,
      procurementCapacityTonnes,
    } = body;

    if (!name || !email || !password || !role) {
      return Response.json(
        { success: false, message: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check duplicate
    const [existing] = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
    if (existing) {
      return Response.json({ success: false, message: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email.trim().toLowerCase(),
        passwordHash: hashedPassword,
        role: role === "buyer" ? "buyer" : "farmer",
        phone: phone || "",
        location: location || "Hyderabad, Telangana",
        preferredLanguage: preferredLanguage || "en",
      })
      .returning();

    if (role === "farmer") {
      await db.insert(farmers).values({
        userId: newUser.id,
        farmSizeAcres: farmSizeAcres ? String(farmSizeAcres) : "3.0",
        primaryCrops: primaryCrops || "Tomato, Paddy",
        soilType: soilType || "Red Sandy Loam",
        irrigationType: irrigationType || "Drip & Borewell",
        experienceYears: experienceYears ? Number(experienceYears) : 5,
      });
    } else if (role === "buyer") {
      await db.insert(buyers).values({
        userId: newUser.id,
        companyName: companyName || name,
        businessType: businessType || "Wholesale Trader",
        gstNumber: gstNumber || "",
        procurementCapacityTonnes: procurementCapacityTonnes ? String(procurementCapacityTonnes) : "25",
      });
    }

    return Response.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        location: newUser.location,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return Response.json({ success: false, message: "Registration failed" }, { status: 500 });
  }
}
