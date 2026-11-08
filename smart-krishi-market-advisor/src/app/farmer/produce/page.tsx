"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Trash2, MapPin, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function ProduceListingPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [marketsList, setMarketsList] = useState<any[]>([]);

  // Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formCropId, setFormCropId] = useState("");
  const [formMarketId, setFormMarketId] = useState("");
  const [formQty, setFormQty] = useState("8.0");
  const [formPrice, setFormPrice] = useState("1650");
  const [formDate, setFormDate] = useState("2026-04-10");
  const [formLocation, setFormLocation] = useState("Geesugonda, Warangal Rural");
  const [formGrade, setFormGrade] = useState("Grade A");
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    fetch("/api/produce-listings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setListings(data.listings || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
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
      const res = await fetch("/api/produce-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 1,
          cropId: formCropId,
          marketId: formMarketId,
          availableQuantityTonnes: formQty,
          expectedPricePerQuintal: formPrice,
          harvestDate: formDate,
          location: formLocation,
          qualityGrade: formGrade,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchListings();
      }
    } catch {
      console.error("Failed to add listing");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this produce listing?")) return;
    try {
      const res = await fetch(`/api/produce-listings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchListings();
    } catch {
      console.error("Failed to delete listing");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Farmer Marketplace
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farmer Produce Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            List harvested or upcoming crop lots for wholesale buyers and processing aggregators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ReadAloudButton
            text={`Farmer Produce Listings. Total active listings: ${listings.length}. Click Add New Listing to broadcast your harvest to direct wholesale buyers.`}
            size="md"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Produce Listing</span>
          </button>
        </div>
      </div>

      {/* Modal / Inline Form for Adding Listing */}
      {showAddModal && (
        <div className="bg-emerald-50/80 border border-emerald-200 p-6 rounded-3xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-700" />
              <span>Create New Produce Listing</span>
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Crop</label>
              <select
                value={formCropId}
                onChange={(e) => setFormCropId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {cropsList.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} ({c.teluguName.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Mandi Hub</label>
              <select
                value={formMarketId}
                onChange={(e) => setFormMarketId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {marketsList.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Available Quantity (Tonnes)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expected Price (₹ / Quintal)</label>
              <input
                type="number"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harvest / Readiness Date</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quality Grade</label>
              <select
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Grade A">Grade A (Export / Premium)</option>
                <option value="Grade B">Grade B (Standard Wholesale)</option>
                <option value="Grade C">Grade C (Processing Quality)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Farm Village / Location</label>
              <input
                type="text"
                required
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl shadow-xs transition-colors"
              >
                Publish Produce Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Produce Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((lot) => (
          <div
            key={lot.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {lot.qualityGrade}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{lot.cropName}</h3>
                </div>
                <button
                  onClick={() => handleDelete(lot.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Volume:</span>
                  <span className="font-bold text-slate-800">{lot.availableQuantityTonnes} Tonnes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Price:</span>
                  <span className="font-black text-emerald-700">₹{lot.expectedPricePerQuintal}/q</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Mandi:</span>
                  <span className="font-semibold text-slate-700">{lot.marketName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Harvest Date:</span>
                  <span className="font-medium text-slate-700">{lot.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{lot.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Farmer: {lot.farmerName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                Live on Portal
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
