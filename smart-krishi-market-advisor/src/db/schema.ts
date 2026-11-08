import { pgTable, text, serial, timestamp, integer, boolean, numeric, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("farmer"), // 'farmer' | 'buyer' | 'admin'
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }).default("Hyderabad, Telangana"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"), // 'en' | 'te' | 'hi'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  farmSizeAcres: numeric("farm_size_acres").default("3.5"),
  primaryCrops: text("primary_crops").default("Tomato, Paddy, Chilli"),
  soilType: varchar("soil_type", { length: 100 }).default("Black Cotton Soil"),
  irrigationType: varchar("irrigation_type", { length: 100 }).default("Drip / Borewell"),
  experienceYears: integer("experience_years").default(8),
});

export const buyers = pgTable("buyers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  companyName: varchar("company_name", { length: 255 }).default("AgriFresh Foods Ltd"),
  businessType: varchar("business_type", { length: 100 }).default("Wholesale Trader"),
  gstNumber: varchar("gst_number", { length: 50 }),
  procurementCapacityTonnes: numeric("procurement_capacity_tonnes").default("50"),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  teluguName: varchar("telugu_name", { length: 100 }).notNull(),
  hindiName: varchar("hindi_name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'Vegetable', 'Cereal', 'Pulse', 'Cash Crop', 'Spice'
  season: varchar("season", { length: 50 }).notNull(), // 'Kharif', 'Rabi', 'Zaid', 'Perennial'
  idealSoil: varchar("ideal_soil", { length: 150 }).notNull(),
  waterRequirement: varchar("water_requirement", { length: 50 }).notNull(), // 'High', 'Moderate', 'Low'
  durationDays: integer("duration_days").notNull(),
  mspPerQuintal: integer("msp_per_quintal").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull().unique(),
  state: varchar("state", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  marketType: varchar("market_type", { length: 50 }).default("APMC Mandi"),
  operationalDays: varchar("operational_days", { length: 100 }).default("Mon-Sat (6 AM - 2 PM)"),
  contactPhone: varchar("contact_phone", { length: 20 }),
});

export const demandSupplyEstimates = pgTable("demand_supply_estimates", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id").references(() => crops.id, { onDelete: "cascade" }).notNull(),
  marketId: integer("market_id").references(() => markets.id, { onDelete: "cascade" }).notNull(),
  estimatedDemandTonnes: numeric("estimated_demand_tonnes").notNull(),
  expectedSupplyTonnes: numeric("expected_supply_tonnes").notNull(),
  averagePricePerQuintal: integer("average_price_per_quintal").notNull(),
  reportingDate: varchar("reporting_date", { length: 20 }).notNull(),
  dataSource: varchar("data_source", { length: 100 }).default("Agri Market Intelligence Cell"),
  sampleLabel: varchar("sample_label", { length: 100 }).default("SAMPLE DATA - ACADEMIC DEMO"),
});

export const farmerCropPlans = pgTable("farmer_crop_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  cropId: integer("crop_id").references(() => crops.id, { onDelete: "cascade" }).notNull(),
  marketId: integer("market_id").references(() => markets.id, { onDelete: "cascade" }).notNull(),
  plannedAcreage: numeric("planned_acreage").notNull(),
  expectedHarvestDate: varchar("expected_harvest_date", { length: 30 }).notNull(),
  expectedYieldTonnes: numeric("expected_yield_tonnes").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const produceListings = pgTable("produce_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  cropId: integer("crop_id").references(() => crops.id, { onDelete: "cascade" }).notNull(),
  marketId: integer("market_id").references(() => markets.id, { onDelete: "cascade" }).notNull(),
  availableQuantityTonnes: numeric("available_quantity_tonnes").notNull(),
  expectedPricePerQuintal: integer("expected_price_per_quintal").notNull(),
  harvestDate: varchar("harvest_date", { length: 30 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  qualityGrade: varchar("quality_grade", { length: 100 }).default("Grade A"),
  status: varchar("status", { length: 30 }).default("active"), // 'active' | 'sold' | 'expired'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const buyerRequirements = pgTable("buyer_requirements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  cropId: integer("crop_id").references(() => crops.id, { onDelete: "cascade" }).notNull(),
  marketId: integer("market_id").references(() => markets.id, { onDelete: "cascade" }).notNull(),
  requiredQuantityTonnes: numeric("required_quantity_tonnes").notNull(),
  targetPricePerQuintal: integer("target_price_per_quintal").notNull(),
  requiredByDate: varchar("required_by_date", { length: 30 }).notNull(),
  deliveryLocation: varchar("delivery_location", { length: 255 }).notNull(),
  status: varchar("status", { length: 30 }).default("open"), // 'open' | 'fulfilled' | 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const callbackRequests = pgTable("callback_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  farmerName: varchar("farmer_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 30 }).notNull(),
  preferredLanguage: varchar("preferred_language", { length: 20 }).default("Telugu"),
  reason: text("reason").notNull(),
  preferredTime: varchar("preferred_time", { length: 100 }).notNull(),
  status: varchar("status", { length: 30 }).default("Pending"), // 'Pending' | 'Assigned' | 'Calling' | 'Completed'
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const smsDemoLogs = pgTable("sms_demo_logs", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number", { length: 30 }).notNull(),
  userMessage: text("user_message").notNull(),
  systemResponse: text("system_response").notNull(),
  queryType: varchar("query_type", { length: 50 }).default("demand_supply"),
  cropDetected: varchar("crop_detected", { length: 100 }),
  marketDetected: varchar("market_detected", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceInteractionLogs = pgTable("voice_interaction_logs", {
  id: serial("id").primaryKey(),
  queryText: text("query_text").notNull(),
  responseText: text("response_text").notNull(),
  language: varchar("language", { length: 10 }).default("en"),
  audioSupported: boolean("audio_supported").default(true),
  queryType: varchar("query_type", { length: 50 }).default("voice_assistant"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("system"), // 'price_alert' | 'shortage_warning' | 'buyer_interest' | 'system'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  farmerProfile: one(farmers, { fields: [users.id], references: [farmers.userId] }),
  buyerProfile: one(buyers, { fields: [users.id], references: [buyers.userId] }),
  cropPlans: many(farmerCropPlans),
  produceListings: many(produceListings),
  buyerRequirements: many(buyerRequirements),
  callbackRequests: many(callbackRequests),
  notifications: many(notifications),
}));

export const cropsRelations = relations(crops, ({ many }) => ({
  estimates: many(demandSupplyEstimates),
  produceListings: many(produceListings),
  buyerRequirements: many(buyerRequirements),
  cropPlans: many(farmerCropPlans),
}));

export const marketsRelations = relations(markets, ({ many }) => ({
  estimates: many(demandSupplyEstimates),
  produceListings: many(produceListings),
  buyerRequirements: many(buyerRequirements),
  cropPlans: many(farmerCropPlans),
}));

export const demandSupplyEstimatesRelations = relations(demandSupplyEstimates, ({ one }) => ({
  crop: one(crops, { fields: [demandSupplyEstimates.cropId], references: [crops.id] }),
  market: one(markets, { fields: [demandSupplyEstimates.marketId], references: [markets.id] }),
}));

export const produceListingsRelations = relations(produceListings, ({ one }) => ({
  user: one(users, { fields: [produceListings.userId], references: [users.id] }),
  crop: one(crops, { fields: [produceListings.cropId], references: [crops.id] }),
  market: one(markets, { fields: [produceListings.marketId], references: [markets.id] }),
}));

export const buyerRequirementsRelations = relations(buyerRequirements, ({ one }) => ({
  user: one(users, { fields: [buyerRequirements.userId], references: [users.id] }),
  crop: one(crops, { fields: [buyerRequirements.cropId], references: [crops.id] }),
  market: one(markets, { fields: [buyerRequirements.marketId], references: [markets.id] }),
}));
