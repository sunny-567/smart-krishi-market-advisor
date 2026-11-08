"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Trash2, CheckCircle2, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function BuyerRequirementsPage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [marketsList, setMarketsList] = useState<any[]>([]);

  // Add form state
  const [showAdd, setShowAdd] = useState(false);
  const [formCropId, setFormCropId] = useState("");
  const [formMarketId, setFormMarketId] = useState("");
  const [formQty, setFormQty] = useState("20.0");
  const [formPrice, setFormPrice] = useState("1600");
  const [formDate, setFormDate] = useState("2026-04-12");
  const [formLoc, setFormLoc] = useState("Bowenpally APMC Warehouse Hub, Hyderabad");
  const [loading, setLoading] = useState(true);

  const fetchRequirements = () => {
    fetch("/api/buyer-requirements")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setRequirements(data.requirements || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequirements();
    Promise.all([
      fetch("/api/crops").then((r) => r.json()),
      fetch("/api/markets").then((r) => r.json()),
    ]).then(([cData, mData]) => {
      if (cData.success && cData.crops.length > 0) {
        setCropsList(cData.crops);
        setFormCropId(String(cData.crops[0].id));
      }
      if (mData.success && mData.markets.length > 0) {
        setMarketsList(mData.markets);
        setFormMarketId(String(mData.markets[0].id));
      }
    });
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/buyer-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 2,
          cropId: formCropId,
          marketId: formMarketId,
          requiredQuantityTonnes: formQty,
          targetPricePerQuintal: formPrice,
          requiredByDate: formDate,
          deliveryLocation: formLoc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAdd(false);
        fetchRequirements();
      }
    } catch {
      console.error("Failed to post requirement");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this procurement requirement?")) return;
    try {
      const res = await fetch(`/api/buyer-requirements?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchRequirements();
    } catch {
      console.error("Failed to delete requirement");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Buyer Procurement
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Buyer Crop Demands & Smart Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Post bulk crop requirements and discover matching farmer produce lots scored by crop, price target, proximity, and quantity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ReadAloudButton
            text={`Buyer Crop Requirements. Active buyer postings: ${requirements.length}. System automatically calculates compatibility with live farmer produce listings.`}
            size="md"
          />
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post Bulk Requirement</span>
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="bg-blue-50/80 border border-blue-200 p-6 rounded-3xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
            <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-700" />
              <span>Post New Procurement Demand</span>
            </h3>
            <button onClick={() => setShowAdd(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800">
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required Crop</label>
              <select
                value={formCropId}
                onChange={(e) => setFormCropId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {cropsList.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} ({c.teluguName.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Mandi Hub</label>
              <select
                value={formMarketId}
                onChange={(e) => setFormMarketId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {marketsList.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required Quantity (Tonnes)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Price (₹ / Quintal)</label>
              <input
                type="number"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required By Date</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Depot / Location</label>
              <input
                type="text"
                required
                value={formLoc}
                onChange={(e) => setFormLoc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Publish Buyer Requirement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requirements List with Matching Produce */}
      <div className="space-y-6">
        {requirements.map((req) => (
          <div key={req.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{req.cropName} Requirement</h3>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Open Demand
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Posted by: <strong>{req.buyerName}</strong> • Depot: {req.deliveryLocation}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 text-[11px]">Quantity Target</span>
                  <p className="font-extrabold text-slate-900">{req.requiredQuantityTonnes} Tonnes</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px]">Max Target Price</span>
                  <p className="font-black text-blue-700 text-base">₹{req.targetPricePerQuintal}/q</p>
                </div>
                <button
                  onClick={() => handleDelete(req.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smart Matching Engine Results */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Algorithm-Matched Farmer Produce Listings ({req.matchCount})</span>
                </span>
                <span className="text-[11px] text-slate-400">Scored on Crop, Mandi Proximity & Price</span>
              </div>

              {(!req.matchingListings || req.matchingListings.length === 0) ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                  No compatible farmer produce listings currently match this crop.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {req.matchingListings.map((match: any) => (
                    <div
                      key={match.id}
                      className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 text-xs flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{match.farmerName}</span>
                            <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                              {match.matchScore}% Match
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Grade: <strong>{match.qualityGrade}</strong> • Location: {match.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-800 text-sm">₹{match.expectedPricePerQuintal}/q</p>
                          <span
                            className={`text-[10px] font-bold ${
                              match.priceDifference <= 0 ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            {match.priceDifference <= 0
                              ? `₹${Math.abs(match.priceDifference)} below target`
                              : `₹${match.priceDifference} over target`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Available: <strong>{match.availableQuantityTonnes} Tonnes</strong></span>
                        <span>Harvest: {match.harvestDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
