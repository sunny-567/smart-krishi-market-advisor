"use client";

import React, { useState, useEffect } from "react";
import { Sprout, Droplets, Clock, Coins, ShieldCheck, Search, Filter } from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function CropsPage() {
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crops")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.crops) {
          setCropsList(data.crops);
          if (data.crops.length > 0) setSelectedCrop(data.crops[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredCrops = cropsList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teluguName.toLowerCase().includes(search.toLowerCase()) ||
      c.hindiName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ["all", "Vegetable", "Spice", "Cash Crop", "Cereal", "Pulse", "Oilseed"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Agronomic Directory
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Intelligence & Technical Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Detailed agronomic parameters, Government MSP benchmarks, maturity duration, and regional nomenclature across 12 major crops.
          </p>
        </div>

        {selectedCrop && (
          <ReadAloudButton
            text={`${selectedCrop.name}. ${selectedCrop.teluguName}. Category: ${selectedCrop.category}. Government MSP: ₹${selectedCrop.mspPerQuintal} per quintal. Ideal duration: ${selectedCrop.durationDays} days. Water requirement: ${selectedCrop.waterRequirement}. ${selectedCrop.description}`}
            size="md"
          />
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by English, Telugu, or Hindi crop name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600">Category:</span>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  categoryFilter === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Directory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Crop List Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                selectedCrop?.id === crop.id
                  ? "bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-300"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{crop.name}</h3>
                  <p className="text-xs text-emerald-800 font-semibold">{crop.teluguName}</p>
                  <p className="text-[11px] text-slate-500">{crop.hindiName}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                  {crop.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>MSP: ₹{crop.mspPerQuintal}/q</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duration: {crop.durationDays}d</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Water: {crop.waterRequirement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Crop Deep Dive Card */}
        {selectedCrop && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 sticky top-24 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {selectedCrop.category} Profile
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedCrop.name}</h2>
              </div>
              <ReadAloudButton
                text={`${selectedCrop.name}. ${selectedCrop.description}. Minimum Support Price is ₹${selectedCrop.mspPerQuintal} per quintal.`}
                size="sm"
              />
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Telugu Name:</span>
                <span className="font-bold text-emerald-800">{selectedCrop.teluguName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Hindi Name:</span>
                <span className="font-bold text-slate-800">{selectedCrop.hindiName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Season:</span>
                <span className="font-bold text-slate-800">{selectedCrop.season}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Govt MSP:</span>
                <span className="font-black text-emerald-700">₹{selectedCrop.mspPerQuintal} / Quintal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Maturity Duration:</span>
                <span className="font-bold text-slate-800">{selectedCrop.durationDays} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Water Requirement:</span>
                <span className="font-bold text-cyan-700">{selectedCrop.waterRequirement}</span>
              </div>
              <div className="py-2">
                <span className="text-slate-500 block mb-1 font-semibold">Ideal Soil Conditions:</span>
                <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedCrop.idealSoil}
                </p>
              </div>
              <div className="py-2">
                <span className="text-slate-500 block mb-1 font-semibold">Agronomic Overview:</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedCrop.description}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`/demand-supply?cropId=${selectedCrop.id}`}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
              >
                View Demand & Supply Analysis →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
