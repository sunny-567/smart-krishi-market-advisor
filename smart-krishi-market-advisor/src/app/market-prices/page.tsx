"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowUpDown, Filter, BarChart3, Coins, MapPin, Calendar } from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { PriceComparisonBarChart } from "@/components/DemandSupplyCharts";

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [cropFilter, setCropFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crops")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCropsList(data.crops || []);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const param = cropFilter !== "all" ? `?cropId=${cropFilter}` : "";
    fetch(`/api/market-prices${param}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPrices(data.prices || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cropFilter]);

  const sortedPrices = [...prices].sort((a, b) =>
    sortOrder === "desc" ? b.pricePerQuintal - a.pricePerQuintal : a.pricePerQuintal - b.pricePerQuintal
  );

  const priceSpeech = `Cross Market Price Comparison. Comparing APMC mandi rates across Hyderabad, Guntur, Warangal, Kurnool, Vijayawada, Nizamabad, and Khammam. Demonstrating price differences across regional hubs.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Price Discovery Module
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Cross-Mandi Market Price Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Compare prevailing rates per quintal across 7 major APMC yards against Central Minimum Support Price (MSP) benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton text={priceSpeech} size="md" />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Select Crop:</span>
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
          >
            <option value="all">All Crops ({cropsList.length})</option>
            {cropsList.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name} ({c.teluguName.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort Price: {sortOrder === "desc" ? "Highest First" : "Lowest First"}</span>
          </button>
        </div>
      </div>

      {/* Visual Chart Comparison */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Mandi Price vs Government MSP Benchmark (₹/Quintal)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive Chart.js comparison demonstrating price variation between regional hubs
            </p>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            Chart.js
          </span>
        </div>

        <PriceComparisonBarChart
          items={sortedPrices.map((p) => ({
            cropName: p.cropName,
            marketName: p.marketName,
            price: p.pricePerQuintal,
            msp: p.msp,
          }))}
        />
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Mandi Price Comparison Table ({sortedPrices.length} Records)
            </h3>
            <p className="text-xs text-slate-500">
              Data source: APMC Sample Market Division. Indicative prices for academic evaluation.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">2026-03-28</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Crop Name</th>
                <th className="py-3.5 px-4">Market / Mandi Hub</th>
                <th className="py-3.5 px-4 text-right">Price per Quintal</th>
                <th className="py-3.5 px-4 text-right">Govt MSP</th>
                <th className="py-3.5 px-4 text-right">Price vs MSP Diff</th>
                <th className="py-3.5 px-4 text-right">Expected Supply</th>
                <th className="py-3.5 px-4 text-center">Data Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedPrices.map((p) => {
                const diff = p.pricePerQuintal - p.msp;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-sm">{p.cropName}</span>
                      <span className="block text-[11px] text-slate-400">{p.category}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{p.marketName}</span>
                      <span className="block text-[10px] text-slate-400">
                        {p.district}, {p.state}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                      ₹{p.pricePerQuintal.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                      ₹{p.msp.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={diff >= 0 ? "text-emerald-700" : "text-rose-700"}>
                        {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      {p.expectedSupplyTonnes} Tonnes
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        SAMPLE DATA
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
