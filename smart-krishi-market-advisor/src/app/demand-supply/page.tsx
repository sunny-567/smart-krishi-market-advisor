"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Scale,
  Filter,
  Download,
  Calendar,
  Layers,
  Info,
} from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { DemandSupplyBarChart, MarketStatusDoughnutChart } from "@/components/DemandSupplyCharts";

export default function DemandSupplyPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalCropsMonitored: 0,
    totalEstimates: 0,
    surplusCount: 0,
    shortageCount: 0,
    balancedCount: 0,
    averageMarketPrice: 0,
  });

  const [cropsList, setCropsList] = useState<any[]>([]);
  const [marketsList, setMarketsList] = useState<any[]>([]);

  // Filter states
  const [cropFilter, setCropFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchRecords = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cropFilter !== "all") params.append("cropId", cropFilter);
    if (marketFilter !== "all") params.append("marketId", marketFilter);
    if (statusFilter !== "all") params.append("status", statusFilter);

    fetch(`/api/demand-supply?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setRecords(data.records || []);
          if (data.summary) setSummary(data.summary);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/crops").then((r) => r.json()),
      fetch("/api/markets").then((r) => r.json()),
    ]).then(([cropsData, marketsData]) => {
      if (cropsData.success) setCropsList(cropsData.crops || []);
      if (marketsData.success) setMarketsList(marketsData.markets || []);
    });
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [cropFilter, marketFilter, statusFilter]);

  const summarySpeech = `Agricultural Demand and Supply Analysis Module. Total monitored crops: ${summary.totalCropsMonitored}. Crops with potential surplus: ${summary.surplusCount}. Crops with potential shortage: ${summary.shortageCount}. Average market price across monitored mandis is ₹${summary.averageMarketPrice} per quintal. Supply gap is calculated as expected supply minus estimated demand.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Core Intelligence Module
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Demand & Supply Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time supply gap modeling: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-emerald-900">Supply Gap = Expected Supply - Estimated Demand</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton text={summarySpeech} size="md" />
        </div>
      </div>

      {/* 5 Summary Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Crops Monitored</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{summary.totalCropsMonitored}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">{summary.totalEstimates} Regional Mandis</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs">
          <p className="text-[11px] text-amber-800 font-semibold">Potential Surplus</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{summary.surplusCount} Records</h3>
          <span className="text-[10px] text-amber-700">Supply &gt; Demand (+Gap)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-xs">
          <p className="text-[11px] text-rose-800 font-semibold">Potential Shortage</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{summary.shortageCount} Records</h3>
          <span className="text-[10px] text-rose-700">Demand &gt; Supply (-Gap)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-xs">
          <p className="text-[11px] text-blue-800 font-semibold">Balanced Supply</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">{summary.balancedCount} Records</h3>
          <span className="text-[10px] text-blue-700">Equilibrium state</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <p className="text-[11px] text-slate-500 font-medium">Average Mandi Price</p>
          <h3 className="text-2xl font-black text-emerald-800 mt-1">
            ₹{summary.averageMarketPrice.toLocaleString("en-IN")}
          </h3>
          <span className="text-[10px] text-slate-500">Per Quintal (APMC)</span>
        </div>
      </div>

      {/* Interactive Charts Section (Chart.js) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Demand vs Supply Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Demand vs Supply Comparative Volume (Chart.js)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Visual comparison of estimated demand vs expected arrivals in Tonnes
              </p>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Dynamic
            </span>
          </div>

          <DemandSupplyBarChart records={records} />
        </div>

        {/* Right Col: Surplus/Shortage Distribution Doughnut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <span>Market State Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-500">Proportion of Surplus, Shortage & Balance</p>
          </div>

          <MarketStatusDoughnutChart
            surplusCount={summary.surplusCount}
            shortageCount={summary.shortageCount}
            balancedCount={summary.balancedCount}
          />

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 text-center">
            {summary.surplusCount} mandis with surplus • {summary.shortageCount} mandis with shortage
          </div>
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filter Agricultural Records</span>
          </div>
          {(cropFilter !== "all" || marketFilter !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setCropFilter("all");
                setMarketFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Filter by Crop</label>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All Monitored Crops ({cropsList.length})</option>
              {cropsList.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name} ({c.teluguName.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Filter by Market Mandi</label>
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All APMC Markets ({marketsList.length})</option>
              {marketsList.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All Market Statuses</option>
              <option value="surplus">Potential Surplus Only (Supply &gt; Demand)</option>
              <option value="shortage">Potential Shortage Only (Demand &gt; Supply)</option>
              <option value="balanced">Balanced Supply Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Calculated Agricultural Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Monitored Agricultural Records ({records.length})
            </h3>
            <p className="text-xs text-slate-500">
              Each record calculates actual gap, status classification, and average price realization.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Reporting Date: 2026-03-28
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Crop Name</th>
                <th className="py-3.5 px-4">Market / Mandi</th>
                <th className="py-3.5 px-4 text-right">Estimated Demand</th>
                <th className="py-3.5 px-4 text-right">Expected Supply</th>
                <th className="py-3.5 px-4 text-center">Supply Gap Formula</th>
                <th className="py-3.5 px-4 text-center">Status Classification</th>
                <th className="py-3.5 px-4 text-right">Avg Mandi Price</th>
                <th className="py-3.5 px-4 text-center">Data Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 text-sm">{r.cropName}</span>
                    <span className="block text-[11px] text-slate-500">{r.teluguName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{r.marketName}</span>
                    <span className="block text-[10px] text-slate-400">{r.state}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {r.demand.toLocaleString()} Tonnes
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {r.supply.toLocaleString()} Tonnes
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold text-xs ${
                        r.gap > 0 ? "text-amber-700" : r.gap < 0 ? "text-rose-700" : "text-blue-700"
                      }`}
                    >
                      {r.gap > 0 ? `+${r.gap}` : r.gap} Tonnes
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        r.status === "surplus"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : r.status === "shortage"
                          ? "bg-rose-100 text-rose-900 border border-rose-300"
                          : "bg-blue-100 text-blue-900 border border-blue-300"
                      }`}
                    >
                      {r.statusLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    ₹{r.averagePrice.toLocaleString("en-IN")}/q
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      SAMPLE DATA
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
