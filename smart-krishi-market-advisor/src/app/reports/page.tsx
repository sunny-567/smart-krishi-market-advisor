"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  Download,
  BarChart3,
  TrendingUp,
  Scale,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setReportData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const reportSpeech = `Reports and Agricultural Analytics Summary. Total monitored crops: 12. Monitored mandis: 7. Potential surplus volume: ${reportData?.stats?.surplusStats?.totalTonnes || 1160} tonnes. Potential shortage volume: ${reportData?.stats?.shortageStats?.totalTonnes || 1130} tonnes.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
              Executive Analytics
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Market Intelligence Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Consolidated surplus-shortage matrix, regional market throughput, and commodity price disparity index.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ReadAloudButton text={reportSpeech} size="md" />
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Printable Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              State Agricultural Marketing Intelligence Unit
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">
              Comprehensive Commodity Balance Sheet
            </h2>
            <p className="text-xs text-slate-500">Evaluation Period: Rabi / Kharif Cycle (March 2026 Sample Bulletin)</p>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold text-slate-700">Project Reference:</span>
            <p className="font-mono text-slate-500">B.Tech Final Year Academic Demo</p>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold">Total Monitored Crops</span>
            <p className="text-2xl font-black text-slate-900">{reportData?.stats?.totalMonitoredCrops || 12}</p>
            <span className="text-[11px] text-slate-400">Vegetables, Spices, Cereals, Pulses</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
            <span className="text-amber-800 font-semibold">Cumulative Surplus Volume</span>
            <p className="text-2xl font-black text-amber-700">
              +{reportData?.stats?.surplusStats?.totalTonnes?.toLocaleString() || 1160} Tonnes
            </p>
            <span className="text-[11px] text-amber-600 font-medium">Risk of local distress selling</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
            <span className="text-rose-800 font-semibold">Cumulative Deficit Volume</span>
            <p className="text-2xl font-black text-rose-700">
              -{reportData?.stats?.shortageStats?.totalTonnes?.toLocaleString() || 1130} Tonnes
            </p>
            <span className="text-[11px] text-rose-600 font-medium">Consumer price spike pressure</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1">
            <span className="text-blue-800 font-semibold">Active Trade Connections</span>
            <p className="text-2xl font-black text-blue-700">
              {(reportData?.stats?.activeProduceListings || 3) + (reportData?.stats?.openBuyerRequirements || 3)} Demands
            </p>
            <span className="text-[11px] text-blue-600 font-medium">Matched via algorithm</span>
          </div>
        </div>

        {/* Section 1: Regional Mandi Volume & Price Analysis */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>1. APMC Mandi Throughput & Price Disparity Index</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">APMC Mandi Hub</th>
                  <th className="py-2.5 px-3 text-right">Total Demand</th>
                  <th className="py-2.5 px-3 text-right">Expected Supply</th>
                  <th className="py-2.5 px-3 text-center">Net Regional Balance</th>
                  <th className="py-2.5 px-3 text-right">Average Commodity Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData?.marketAnalytics?.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.marketName}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{m.totalDemandTonnes.toLocaleString()} Tonnes</td>
                    <td className="py-2.5 px-3 text-right font-medium">{m.totalSupplyTonnes.toLocaleString()} Tonnes</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`font-mono font-bold ${
                          m.netGap > 0 ? "text-amber-700" : m.netGap < 0 ? "text-rose-700" : "text-blue-700"
                        }`}
                      >
                        {m.netGap > 0 ? `+${m.netGap}` : m.netGap} Tonnes
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      ₹{m.averagePrice.toLocaleString("en-IN")}/q
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Crop Demand Ranking Matrix */}
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>2. Crop Demand Ranking & Balance Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Rank / Crop</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3 text-right">Demand Aggregate</th>
                  <th className="py-2.5 px-3 text-right">Supply Aggregate</th>
                  <th className="py-2.5 px-3 text-center">Supply Gap Status</th>
                  <th className="py-2.5 px-3 text-right">Mandi Price Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData?.cropDemandList?.map((c: any, idx: number) => (
                  <tr key={c.cropId} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 text-sm">
                        #{idx + 1} {c.cropName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-600">{c.category}</td>
                    <td className="py-2.5 px-3 text-right font-medium">
                      {c.totalDemandTonnes.toLocaleString()} Tonnes
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium">
                      {c.totalSupplyTonnes.toLocaleString()} Tonnes
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          c.status === "Surplus"
                            ? "bg-amber-100 text-amber-900"
                            : c.status === "Shortage"
                            ? "bg-rose-100 text-rose-900"
                            : "bg-blue-100 text-blue-900"
                        }`}
                      >
                        {c.status} ({c.netGap > 0 ? `+${c.netGap}t` : `${c.netGap}t`})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      ₹{c.averagePrice.toLocaleString("en-IN")}/q
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Signature Block */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <p className="font-bold text-slate-800">Generated by Smart Krishi Market Advisor Decision-Support System</p>
            <p className="text-[11px] text-slate-400">Academic Project Prototype for B.Tech Degree Demonstration</p>
          </div>
          <div className="border-t border-slate-300 sm:border-0 pt-2 sm:pt-0 text-left sm:text-right">
            <span className="font-semibold text-slate-700">Verified by: Dr. K. Srinivas</span>
            <p className="text-[11px] text-slate-400">Directorate of Agricultural Marketing, Hyderabad</p>
          </div>
        </div>
      </div>
    </div>
  );
}
