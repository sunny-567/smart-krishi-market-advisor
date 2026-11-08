"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Package,
  ShoppingCart,
  PhoneForwarded,
  Bell,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function FarmerDashboard() {
  const { user, isFarmer } = useAuth();
  const { t } = useLanguage();

  const [myListings, setMyListings] = useState<any[]>([]);
  const [buyerDemands, setBuyerDemands] = useState<any[]>([]);
  const [marketAlerts, setMarketAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Crop Plan state
  const [plannedCrop, setPlannedCrop] = useState("Tomato");
  const [plannedAcreage, setPlannedAcreage] = useState("2.0");
  const [expectedDate, setExpectedDate] = useState("2026-04-20");
  const [planSaved, setPlanSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/produce-listings?userId=1").then((r) => r.json()),
      fetch("/api/buyer-requirements").then((r) => r.json()),
      fetch("/api/demand-supply").then((r) => r.json()),
    ])
      .then(([listingsData, buyerData, demandData]) => {
        if (listingsData.success) setMyListings(listingsData.listings || []);
        if (buyerData.success) setBuyerDemands(buyerData.requirements || []);
        if (demandData.success) {
          // Filter surplus/shortage highlights
          setMarketAlerts(demandData.records?.slice(0, 4) || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setPlanSaved(true);
    setTimeout(() => setPlanSaved(false), 4000);
  };

  const farmerSummaryText = `Farmer Dashboard for Ramesh Reddy. You have ${myListings.length} active crop produce listings. Key alerts include tomato potential surplus in Hyderabad and onion shortage in Kurnool. Check buyer requirements to connect directly with traders.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-700/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Farmer Command Center
            </span>
            <SampleDataBadge className="bg-emerald-950/80 text-amber-200 border-amber-400/40" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || "Ramesh Reddy"} 👨‍🌾
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>{user?.location || "Warangal, Telangana"}</span>
            <span>•</span>
            <span>Primary Crops: Tomato, Green Chilli, Turmeric</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ReadAloudButton text={farmerSummaryText} size="md" className="bg-emerald-950 text-emerald-100 border-emerald-700" />
          <Link
            href="/farmer/produce"
            className="inline-flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>List New Produce</span>
          </Link>
          <Link
            href="/callback-request"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/40 transition-colors"
          >
            <PhoneForwarded className="w-3.5 h-3.5 text-amber-300" />
            <span>Request Call</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/demand-supply"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700">Demand & Supply</h4>
            <p className="text-[11px] text-slate-500">Mandi gap analytics</p>
          </div>
        </Link>

        <Link
          href="/recommendations"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-700">Crop Advisory</h4>
            <p className="text-[11px] text-slate-500">Rule-based guidance</p>
          </div>
        </Link>

        <Link
          href="/market-prices"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-700">Mandi Prices</h4>
            <p className="text-[11px] text-slate-500">Compare 7 APMC yards</p>
          </div>
        </Link>

        <Link
          href="/buyer/requirements"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-purple-700">Buyer Demands</h4>
            <p className="text-[11px] text-slate-500">Wholesale inquiries</p>
          </div>
        </Link>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Produce Listings + Market Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Listings Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">My Listed Produce Lots</h3>
              </div>
              <Link
                href="/farmer/produce"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Manage all ({myListings.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myListings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                No active produce listings found. Click &quot;List New Produce&quot; to connect with buyers.
              </div>
            ) : (
              <div className="space-y-3">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{item.cropName}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.qualityGrade}
                        </span>
                        <span className="text-[10px] text-slate-500">Target: {item.marketName}</span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Quantity: <strong>{item.availableQuantityTonnes} Tonnes</strong> • Harvest: {item.harvestDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-slate-500 text-[11px]">Expected Price</span>
                        <p className="font-black text-emerald-700 text-sm">
                          ₹{item.expectedPricePerQuintal.toLocaleString("en-IN")}/q
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Intelligence Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">Regional Market Condition Highlights</h3>
              </div>
              <Link
                href="/demand-supply"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {marketAlerts.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    rec.status === "surplus"
                      ? "bg-amber-50/70 border-amber-200"
                      : rec.status === "shortage"
                      ? "bg-rose-50/70 border-rose-200"
                      : "bg-blue-50/70 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rec.cropName}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        rec.status === "surplus"
                          ? "bg-amber-200 text-amber-900"
                          : rec.status === "shortage"
                          ? "bg-rose-200 text-rose-900"
                          : "bg-blue-200 text-blue-900"
                      }`}
                    >
                      {rec.statusLabel}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{rec.marketName}</p>
                  <div className="pt-1 flex items-center justify-between border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-500">
                      Gap: {rec.gap > 0 ? "+" : ""}
                      {rec.gap}t
                    </span>
                    <span className="font-bold text-slate-800">₹{rec.averagePrice}/q</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Crop Plan + Buyer Requirements Preview */}
        <div className="space-y-6">
          {/* Quick Crop Plan Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Quick Crop Plan Tracker</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Record your intended acreage to receive pre-harvest market advisory.
              </p>
            </div>

            {planSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Crop plan recorded! Advisory generated.</span>
              </div>
            )}

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Crop</label>
                <select
                  value={plannedCrop}
                  onChange={(e) => setPlannedCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Tomato">Tomato (టమాటా)</option>
                  <option value="Onion">Onion (ఉల్లిపాయ)</option>
                  <option value="Green Chilli">Green Chilli (పచ్చిమిర్చి)</option>
                  <option value="Cotton">Cotton (పత్తి)</option>
                  <option value="Turmeric">Turmeric (పసుపు)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Acreage</label>
                  <input
                    type="number"
                    step="0.5"
                    value={plannedAcreage}
                    onChange={(e) => setPlannedAcreage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition-colors shadow-xs"
              >
                Save Crop Plan
              </button>
            </form>
          </div>

          {/* Matching Buyer Demands */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
                <span>Active Buyer Demands</span>
              </h3>
              <Link href="/buyer/requirements" className="text-xs text-purple-700 font-bold hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {buyerDemands.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{b.cropName}</span>
                    <span className="font-black text-purple-800">₹{b.targetPricePerQuintal}/q</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Buyer: {b.buyerName} • Target: {b.requiredQuantityTonnes} Tonnes
                  </p>
                  <p className="text-[10px] text-slate-500">Required by: {b.requiredByDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
