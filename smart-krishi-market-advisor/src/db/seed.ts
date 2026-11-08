import { db } from "./index";
import {
  users,
  farmers,
  buyers,
  crops,
  markets,
  demandSupplyEstimates,
  produceListings,
  buyerRequirements,
  callbackRequests,
  notifications,
  smsDemoLogs,
  voiceInteractionLogs,
  farmerCropPlans,
} from "./schema";
import bcrypt from "bcryptjs";
import { count } from "drizzle-orm";

export async function seedDatabase() {
  try {
    const userCountResult = await db.select({ value: count() }).from(users);
    const userCount = Number(userCountResult[0]?.value ?? 0);

    if (userCount > 0) {
      console.log("Database already seeded. Skipping full reseed.");
      return;
    }

    console.log("Seeding database with Smart Krishi Market Advisor demonstration data...");

    const hashedFarmerPassword = await bcrypt.hash("Farmer@123", 10);
    const hashedBuyerPassword = await bcrypt.hash("Buyer@123", 10);
    const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);

    // 1. Users
    const [farmerUser] = await db
      .insert(users)
      .values({
        name: "Ramesh Reddy",
        email: "farmer@smartkrishi.in",
        passwordHash: hashedFarmerPassword,
        role: "farmer",
        phone: "+91 98480 22334",
        location: "Warangal, Telangana",
        preferredLanguage: "te",
      })
      .returning();

    const [buyerUser] = await db
      .insert(users)
      .values({
        name: "AgriFresh Agro Foods Ltd",
        email: "buyer@smartkrishi.in",
        passwordHash: hashedBuyerPassword,
        role: "buyer",
        phone: "+91 94401 55667",
        location: "Bowenpally, Hyderabad, Telangana",
        preferredLanguage: "en",
      })
      .returning();

    const [adminUser] = await db
      .insert(users)
      .values({
        name: "Dr. K. Srinivas (Agronomist)",
        email: "admin@smartkrishi.in",
        passwordHash: hashedAdminPassword,
        role: "admin",
        phone: "+91 98499 88771",
        location: "Agri Marketing Directorate, Hyderabad",
        preferredLanguage: "en",
      })
      .returning();

    // Secondary demo accounts
    await db.insert(users).values([
      {
        name: "Lakshmi Bai",
        email: "lakshmi.farmer@smartkrishi.in",
        passwordHash: hashedFarmerPassword,
        role: "farmer",
        phone: "+91 99882 11223",
        location: "Guntur, Andhra Pradesh",
        preferredLanguage: "te",
      },
      {
        name: "Suresh Retail & Exports",
        email: "suresh.buyer@smartkrishi.in",
        passwordHash: hashedBuyerPassword,
        role: "buyer",
        phone: "+91 91234 56789",
        location: "Kurnool, Andhra Pradesh",
        preferredLanguage: "hi",
      },
    ]);

    // Profiles
    await db.insert(farmers).values({
      userId: farmerUser.id,
      farmSizeAcres: "4.5",
      primaryCrops: "Tomato, Green Chilli, Turmeric",
      soilType: "Red Sandy Loam",
      irrigationType: "Drip Irrigation + Borewell",
      experienceYears: 12,
    });

    await db.insert(buyers).values({
      userId: buyerUser.id,
      companyName: "AgriFresh Agro Foods Pvt Ltd",
      businessType: "Wholesale & Processing Aggregator",
      gstNumber: "36AAACA1234F1Z8",
      procurementCapacityTonnes: "150",
    });

    // 2. Markets
    const marketEntries = await db
      .insert(markets)
      .values([
        {
          name: "Hyderabad (Bowenpally APMC)",
          state: "Telangana",
          district: "Hyderabad / Medchal",
          marketType: "Major Urban APMC",
          operationalDays: "Daily (5:00 AM - 2:00 PM)",
          contactPhone: "+91 040 27751234",
        },
        {
          name: "Guntur (Mirchi Yard APMC)",
          state: "Andhra Pradesh",
          district: "Guntur",
          marketType: "National Spices Mandi",
          operationalDays: "Mon - Sat (6:00 AM - 1:00 PM)",
          contactPhone: "+91 0863 2234567",
        },
        {
          name: "Warangal (Enumamula Agri Mandi)",
          state: "Telangana",
          district: "Warangal",
          marketType: "Large Regional Grain & Veg Mandi",
          operationalDays: "Mon - Sat (5:30 AM - 2:30 PM)",
          contactPhone: "+91 0870 2451234",
        },
        {
          name: "Kurnool (Kurnool Onion & Veg Yard)",
          state: "Andhra Pradesh",
          district: "Kurnool",
          marketType: "Major Onion & Pulse Mandi",
          operationalDays: "Daily (6:00 AM - 12:30 PM)",
          contactPhone: "+91 08518 234123",
        },
        {
          name: "Vijayawada (Gollapudi Wholesale Market)",
          state: "Andhra Pradesh",
          district: "Krishna / NTR",
          marketType: "Coastal Andhra Hub",
          operationalDays: "Daily (4:30 AM - 1:30 PM)",
          contactPhone: "+91 0866 2415678",
        },
        {
          name: "Nizamabad (Turmeric & Grain Yard)",
          state: "Telangana",
          district: "Nizamabad",
          marketType: "Turmeric Major Trading Hub",
          operationalDays: "Mon - Fri (8:00 AM - 3:00 PM)",
          contactPhone: "+91 08462 225678",
        },
        {
          name: "Khammam (Khammam Cotton & Chilli Market)",
          state: "Telangana",
          district: "Khammam",
          marketType: "Cotton & Chilli APMC",
          operationalDays: "Mon - Sat (6:00 AM - 2:00 PM)",
          contactPhone: "+91 08742 238910",
        },
      ])
      .returning();

    // Map market names to IDs
    const mHyd = marketEntries.find((m) => m.name.includes("Hyderabad"))!.id;
    const mGun = marketEntries.find((m) => m.name.includes("Guntur"))!.id;
    const mWar = marketEntries.find((m) => m.name.includes("Warangal"))!.id;
    const mKur = marketEntries.find((m) => m.name.includes("Kurnool"))!.id;
    const mVij = marketEntries.find((m) => m.name.includes("Vijayawada"))!.id;
    const mNiz = marketEntries.find((m) => m.name.includes("Nizamabad"))!.id;
    const mKha = marketEntries.find((m) => m.name.includes("Khammam"))!.id;

    // 3. Crops
    const cropEntries = await db
      .insert(crops)
      .values([
        {
          name: "Tomato",
          teluguName: "టమాటా (Tamata)",
          hindiName: "टमाटर (Tamatar)",
          category: "Vegetable",
          season: "Rabi / Kharif",
          idealSoil: "Well-drained sandy loam, pH 6.0-7.0",
          waterRequirement: "Moderate (Drip recommended)",
          durationDays: 85,
          mspPerQuintal: 1400,
          description: "High demand perishable commercial crop; sensitive to supply gluts during peak harvest.",
          imageUrl: "/images/crops/tomato.jpg",
        },
        {
          name: "Onion",
          teluguName: "ఉల్లిపాయ (Ullipaya)",
          hindiName: "प्याज (Pyaaz)",
          category: "Vegetable",
          season: "Rabi / Late Kharif",
          idealSoil: "Deep friable organic rich loam, pH 6.5",
          waterRequirement: "Moderate",
          durationDays: 120,
          mspPerQuintal: 2400,
          description: "Crucial staple vegetable; prone to seasonal supply shortages causing price spikes.",
          imageUrl: "/images/crops/onion.jpg",
        },
        {
          name: "Green Chilli",
          teluguName: "పచ్చిమిర్చి (Pachimirchi)",
          hindiName: "हरी मिर्च (Hari Mirch)",
          category: "Spice",
          season: "Kharif / Rabi",
          idealSoil: "Light black loam or well-drained alluvial",
          waterRequirement: "Moderate",
          durationDays: 140,
          mspPerQuintal: 6500,
          description: "High-value spice and commercial crop with stable domestic consumption and export potential.",
          imageUrl: "/images/crops/chilli.jpg",
        },
        {
          name: "Cotton",
          teluguName: "పత్తి (Patthi)",
          hindiName: "कपास (Kapas)",
          category: "Cash Crop",
          season: "Kharif",
          idealSoil: "Deep Black Cotton soil (Regur), moisture retentive",
          waterRequirement: "Moderate to High",
          durationDays: 165,
          mspPerQuintal: 7122,
          description: "Prime cash crop of Telangana and Rayalaseema; vital for textile mills and spinning units.",
          imageUrl: "/images/crops/cotton.jpg",
        },
        {
          name: "Paddy (Rice)",
          teluguName: "వరి (Vari / Biyyam)",
          hindiName: "धान (Dhan)",
          category: "Cereal",
          season: "Kharif / Rabi",
          idealSoil: "Clayey loam with high water holding capacity",
          waterRequirement: "High",
          durationDays: 130,
          mspPerQuintal: 2300,
          description: "Primary food grain; steady government procurement and universal household demand.",
          imageUrl: "/images/crops/paddy.jpg",
        },
        {
          name: "Turmeric",
          teluguName: "పసుపు (Pasupu)",
          hindiName: "हल्दी (Haldi)",
          category: "Spice",
          season: "Kharif",
          idealSoil: "Well drained loamy or alluvial fertile soil",
          waterRequirement: "Moderate",
          durationDays: 240,
          mspPerQuintal: 9500,
          description: "Famous GI-tagged Nizamabad crop; high curcumin varieties command premium prices.",
          imageUrl: "/images/crops/turmeric.jpg",
        },
        {
          name: "Red Gram (Tur Dal)",
          teluguName: "కందులు (Kandulu)",
          hindiName: "अरहर दाल (Tur Dal)",
          category: "Pulse",
          season: "Kharif",
          idealSoil: "Loamy to deep well-drained soils, drought tolerant",
          waterRequirement: "Low to Moderate",
          durationDays: 160,
          mspPerQuintal: 7550,
          description: "Major protein source; strong consumer demand often leading to supply shortages.",
          imageUrl: "/images/crops/redgram.jpg",
        },
        {
          name: "Maize",
          teluguName: "మొక్కజొన్న (Mokkajonna)",
          hindiName: "मक्का (Makka)",
          category: "Cereal",
          season: "Kharif / Rabi",
          idealSoil: "Well-drained sandy loam to silty loam",
          waterRequirement: "Moderate",
          durationDays: 105,
          mspPerQuintal: 2225,
          description: "Dual purpose crop for human food and rapidly expanding poultry feed industry.",
          imageUrl: "/images/crops/maize.jpg",
        },
        {
          name: "Groundnut",
          teluguName: "వేరుశనగ (Verusanaga)",
          hindiName: "मूंगफली (Moongphali)",
          category: "Oilseed",
          season: "Kharif / Rabi",
          idealSoil: "Well-drained light sandy loam with calcium content",
          waterRequirement: "Low to Moderate",
          durationDays: 110,
          mspPerQuintal: 6783,
          description: "Oilseed and culinary staple in southern markets; high trade liquidity.",
          imageUrl: "/images/crops/groundnut.jpg",
        },
        {
          name: "Potato",
          teluguName: "బంగాళాదుంప (Bangaladumpa)",
          hindiName: "आलू (Aloo)",
          category: "Vegetable",
          season: "Rabi",
          idealSoil: "Loose, friable sandy loam rich in humus",
          waterRequirement: "Moderate",
          durationDays: 95,
          mspPerQuintal: 1200,
          description: "Heavy consumption tuber; cold-storage arrivals heavily dictate market pricing.",
          imageUrl: "/images/crops/potato.jpg",
        },
        {
          name: "Bengal Gram (Chana)",
          teluguName: "శనగలు (Sanagalu)",
          hindiName: "चना (Chana)",
          category: "Pulse",
          season: "Rabi",
          idealSoil: "Medium to heavy black soil",
          waterRequirement: "Low",
          durationDays: 100,
          mspPerQuintal: 5440,
          description: "Winter pulse with low irrigation need; essential for flour (Besan) processing units.",
          imageUrl: "/images/crops/chana.jpg",
        },
        {
          name: "Soybean",
          teluguName: "సోయాబీన్ (Soyabean)",
          hindiName: "सोयाबीन (Soyabean)",
          category: "Oilseed",
          season: "Kharif",
          idealSoil: "Well-drained fertile loam with good organic matter",
          waterRequirement: "Moderate",
          durationDays: 95,
          mspPerQuintal: 4892,
          description: "Key oilseed and protein feed crop; active processing industry presence in northern Telangana.",
          imageUrl: "/images/crops/soybean.jpg",
        },
      ])
      .returning();

    // Map crop names
    const getCropId = (name: string) => cropEntries.find((c) => c.name === name)!.id;

    // 4. Demand and Supply Estimates (At least 18 illustrative records across markets)
    await db.insert(demandSupplyEstimates).values([
      {
        cropId: getCropId("Tomato"),
        marketId: mHyd,
        estimatedDemandTonnes: "600",
        expectedSupplyTonnes: "1000",
        averagePricePerQuintal: 1450,
        reportingDate: "2026-03-28",
        dataSource: "Agricultural Market Intelligence Cell",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Tomato"),
        marketId: mGun,
        estimatedDemandTonnes: "380",
        expectedSupplyTonnes: "290",
        averagePricePerQuintal: 1850,
        reportingDate: "2026-03-28",
        dataSource: "APMC Arrival & Intelligence Record",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Tomato"),
        marketId: mWar,
        estimatedDemandTonnes: "250",
        expectedSupplyTonnes: "420",
        averagePricePerQuintal: 1350,
        reportingDate: "2026-03-28",
        dataSource: "Market Committee Sample Registry",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Onion"),
        marketId: mHyd,
        estimatedDemandTonnes: "1000",
        expectedSupplyTonnes: "650",
        averagePricePerQuintal: 3200,
        reportingDate: "2026-03-28",
        dataSource: "Horticulture Price Monitoring Division",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Onion"),
        marketId: mKur,
        estimatedDemandTonnes: "500",
        expectedSupplyTonnes: "380",
        averagePricePerQuintal: 2850,
        reportingDate: "2026-03-28",
        dataSource: "Kurnool APMC Sample Division",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Green Chilli"),
        marketId: mGun,
        estimatedDemandTonnes: "500",
        expectedSupplyTonnes: "480",
        averagePricePerQuintal: 8800,
        reportingDate: "2026-03-28",
        dataSource: "Spices Board Field Bureau",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Green Chilli"),
        marketId: mHyd,
        estimatedDemandTonnes: "300",
        expectedSupplyTonnes: "240",
        averagePricePerQuintal: 9200,
        reportingDate: "2026-03-28",
        dataSource: "Bowenpally Market Intelligence",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Cotton"),
        marketId: mWar,
        estimatedDemandTonnes: "1200",
        expectedSupplyTonnes: "1350",
        averagePricePerQuintal: 7250,
        reportingDate: "2026-03-28",
        dataSource: "Cotton Corporation Field Study",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Cotton"),
        marketId: mKha,
        estimatedDemandTonnes: "950",
        expectedSupplyTonnes: "1100",
        averagePricePerQuintal: 7180,
        reportingDate: "2026-03-28",
        dataSource: "Khammam Mandi Sample Estimate",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Paddy (Rice)"),
        marketId: mKur,
        estimatedDemandTonnes: "2500",
        expectedSupplyTonnes: "2200",
        averagePricePerQuintal: 2380,
        reportingDate: "2026-03-28",
        dataSource: "Civil Supplies Field Monitor",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Paddy (Rice)"),
        marketId: mVij,
        estimatedDemandTonnes: "3000",
        expectedSupplyTonnes: "2850",
        averagePricePerQuintal: 2420,
        reportingDate: "2026-03-28",
        dataSource: "Gollapudi Rice Millers Survey",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Turmeric"),
        marketId: mNiz,
        estimatedDemandTonnes: "800",
        expectedSupplyTonnes: "620",
        averagePricePerQuintal: 13500,
        reportingDate: "2026-03-28",
        dataSource: "Turmeric Traders Federation",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Red Gram (Tur Dal)"),
        marketId: mHyd,
        estimatedDemandTonnes: "700",
        expectedSupplyTonnes: "550",
        averagePricePerQuintal: 7800,
        reportingDate: "2026-03-28",
        dataSource: "Pulse Procurement Intelligence",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Maize"),
        marketId: mWar,
        estimatedDemandTonnes: "900",
        expectedSupplyTonnes: "1150",
        averagePricePerQuintal: 2100,
        reportingDate: "2026-03-28",
        dataSource: "Poultry Feed Industry Aggregate",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Groundnut"),
        marketId: mKur,
        estimatedDemandTonnes: "650",
        expectedSupplyTonnes: "660",
        averagePricePerQuintal: 6450,
        reportingDate: "2026-03-28",
        dataSource: "Oilseeds Board Sample Report",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Potato"),
        marketId: mVij,
        estimatedDemandTonnes: "850",
        expectedSupplyTonnes: "1200",
        averagePricePerQuintal: 1850,
        reportingDate: "2026-03-28",
        dataSource: "Cold Storage Sample Inventory",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Bengal Gram (Chana)"),
        marketId: mKha,
        estimatedDemandTonnes: "400",
        expectedSupplyTonnes: "390",
        averagePricePerQuintal: 5450,
        reportingDate: "2026-03-28",
        dataSource: "Grain Mandi Sample Bulletin",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
      {
        cropId: getCropId("Soybean"),
        marketId: mNiz,
        estimatedDemandTonnes: "550",
        expectedSupplyTonnes: "480",
        averagePricePerQuintal: 4650,
        reportingDate: "2026-03-28",
        dataSource: "Solvent Extractors Survey",
        sampleLabel: "SAMPLE DATA - ACADEMIC DEMO",
      },
    ]);

    // 5. Produce Listings
    await db.insert(produceListings).values([
      {
        userId: farmerUser.id,
        cropId: getCropId("Tomato"),
        marketId: mWar,
        availableQuantityTonnes: "12.5",
        expectedPricePerQuintal: 1500,
        harvestDate: "2026-04-05",
        location: "Geesugonda Village, Warangal",
        qualityGrade: "Grade A",
        status: "active",
      },
      {
        userId: farmerUser.id,
        cropId: getCropId("Green Chilli"),
        marketId: mGun,
        availableQuantityTonnes: "4.0",
        expectedPricePerQuintal: 8700,
        harvestDate: "2026-04-12",
        location: "Warangal Rural",
        qualityGrade: "Grade A Export Quality",
        status: "active",
      },
      {
        userId: farmerUser.id,
        cropId: getCropId("Turmeric"),
        marketId: mNiz,
        availableQuantityTonnes: "6.0",
        expectedPricePerQuintal: 13200,
        harvestDate: "2026-04-20",
        location: "Armoor area, Nizamabad",
        qualityGrade: "Grade A High Curcumin",
        status: "active",
      },
    ]);

    // 6. Buyer Requirements
    await db.insert(buyerRequirements).values([
      {
        userId: buyerUser.id,
        cropId: getCropId("Tomato"),
        marketId: mHyd,
        requiredQuantityTonnes: "25.0",
        targetPricePerQuintal: 1550,
        requiredByDate: "2026-04-10",
        deliveryLocation: "Bowenpally Warehouse No. 4, Hyderabad",
        status: "open",
      },
      {
        userId: buyerUser.id,
        cropId: getCropId("Green Chilli"),
        marketId: mGun,
        requiredQuantityTonnes: "8.0",
        targetPricePerQuintal: 8800,
        requiredByDate: "2026-04-15",
        deliveryLocation: "Guntur Cold Hub Facility",
        status: "open",
      },
      {
        userId: buyerUser.id,
        cropId: getCropId("Onion"),
        marketId: mHyd,
        requiredQuantityTonnes: "30.0",
        targetPricePerQuintal: 3100,
        requiredByDate: "2026-04-08",
        deliveryLocation: "Gaddiannaram Hub, Hyderabad",
        status: "open",
      },
    ]);

    // 7. Farmer Crop Plans
    await db.insert(farmerCropPlans).values([
      {
        userId: farmerUser.id,
        cropId: getCropId("Tomato"),
        marketId: mWar,
        plannedAcreage: "2.0",
        expectedHarvestDate: "2026-04-15",
        expectedYieldTonnes: "16.0",
        notes: "Using drip irrigation and hybrid seeds; planning staggered harvest to avoid local market supply glut.",
      },
      {
        userId: farmerUser.id,
        cropId: getCropId("Green Chilli"),
        marketId: mGun,
        plannedAcreage: "1.5",
        expectedHarvestDate: "2026-05-01",
        expectedYieldTonnes: "6.5",
        notes: "Targeting Guntur spice market for better price realization than local Warangal yard.",
      },
    ]);

    // 8. Callback Requests
    await db.insert(callbackRequests).values([
      {
        userId: farmerUser.id,
        farmerName: "Ramesh Reddy",
        phoneNumber: "+91 98480 22334",
        preferredLanguage: "Telugu",
        reason: "Need advice on whether to sell Tomato in Hyderabad vs Warangal mandi due to price difference.",
        preferredTime: "Morning 10:00 AM - 12:00 PM",
        status: "Assigned",
        adminNotes: "Assigned to Agri Officer Srikanth. Discuss transportation subsidy vs Hyderabad mandi price advantage.",
      },
      {
        userId: null,
        farmerName: "Venkatesh Rao",
        phoneNumber: "+91 94412 88990",
        preferredLanguage: "Telugu",
        reason: "Advice on harvesting Turmeric early due to rain forecast in Nizamabad.",
        preferredTime: "Afternoon 2:00 PM - 4:00 PM",
        status: "Pending",
        adminNotes: "Waiting for meteorological advisory before returning call.",
      },
      {
        userId: null,
        farmerName: "Baldev Singh",
        phoneNumber: "+91 98765 43210",
        preferredLanguage: "Hindi",
        reason: "Inquiry about minimum support price (MSP) for Cotton and procurement center dates in Warangal.",
        preferredTime: "Evening 5:00 PM - 7:00 PM",
        status: "Completed",
        adminNotes: "Called on 28-Mar. Guided farmer to Enumamula Mandi CCI counter. Farmer satisfied.",
      },
      {
        userId: null,
        farmerName: "Anil Kumar",
        phoneNumber: "+91 91234 87654",
        preferredLanguage: "English",
        reason: "Bulk onion storage guidance and cold storage subsidy details in Kurnool.",
        preferredTime: "Anytime",
        status: "Calling",
        adminNotes: "Field officer currently on call with farmer.",
      },
    ]);

    // 9. Notifications
    await db.insert(notifications).values([
      {
        userId: farmerUser.id,
        title: "Potential Surplus Alert: Tomato in Hyderabad",
        message: "Hyderabad market shows expected supply of 1,000 tonnes against 600 tonnes demand (+400t surplus). Consider Guntur market where prices are ₹1,850/quintal.",
        type: "shortage_warning",
        isRead: false,
      },
      {
        userId: farmerUser.id,
        title: "Buyer Interest in Green Chilli",
        message: "AgriFresh Agro Foods has posted requirement for 8 Tonnes of Green Chilli at ₹8,800/quintal matching your listed quality.",
        type: "buyer_interest",
        isRead: false,
      },
      {
        userId: buyerUser.id,
        title: "New Produce Listing Available",
        message: "Farmer Ramesh Reddy listed 12.5 Tonnes of Grade A Tomato available for harvest by 05-Apr-2026.",
        type: "system",
        isRead: false,
      },
      {
        userId: null,
        title: "Market Advisory: Onion Shortage",
        message: "Onion supply across regional mandis is running 35% below estimated demand. Farmers holding cured stock can expect firm prices.",
        type: "price_alert",
        isRead: true,
      },
    ]);

    // 10. SMS Demo Logs
    await db.insert(smsDemoLogs).values([
      {
        phoneNumber: "+91 98480 22334",
        userMessage: "Tomato demand Hyderabad",
        systemResponse: "Demo result: Tomato estimated demand is 600 tonnes and expected supply is 1,000 tonnes. Potential surplus: 400 tonnes. Average price: Rs 1,450/quintal. Recommendation: Consider Guntur market (Rs 1,850/q).",
        queryType: "demand_supply",
        cropDetected: "Tomato",
        marketDetected: "Hyderabad",
      },
      {
        phoneNumber: "+91 94412 88990",
        userMessage: "Onion price Kurnool",
        systemResponse: "Demo result: Onion in Kurnool market: Estimated demand 500 tonnes, Expected supply 380 tonnes. Potential shortage: 120 tonnes. Current average price: Rs 2,850/quintal.",
        queryType: "price_query",
        cropDetected: "Onion",
        marketDetected: "Kurnool",
      },
    ]);

    // 11. Voice Interaction Logs
    await db.insert(voiceInteractionLogs).values([
      {
        queryText: "What is the tomato demand in Hyderabad?",
        responseText: "In Hyderabad APMC, tomato estimated demand is 600 tonnes, while expected supply is 1000 tonnes. This creates a potential surplus of 400 tonnes. Current average market price is ₹1,450 per quintal.",
        language: "en",
        audioSupported: true,
        queryType: "voice_assistant",
      },
      {
        queryText: "హైదరాబాద్ లో ఉల్లిపాయ ధర ఎంత?",
        responseText: "హైదరాబాద్ మార్కెట్లో ఉల్లిపాయ సగటు ధర క్వింటాలుకు ₹3,200 ఉంది. డిమాండ్ 1,000 టన్నులు కాగా సప్లై 650 టన్నులు మాత్రమే ఉన్నందున కొరత ఉంది.",
        language: "te",
        audioSupported: true,
        queryType: "voice_assistant",
      },
    ]);

    console.log("Database seeded successfully with all sample agricultural records!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
