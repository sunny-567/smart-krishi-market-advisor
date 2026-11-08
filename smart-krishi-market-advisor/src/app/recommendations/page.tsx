"use client";

import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { RecommendationResult } from "@/app/api/recommendations/route";

export default function RecommendationsPage() {
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [marketsList, setMarketsList] = useState<any[]>([]);

  const [selectedCropId, setSelectedCropId] = useState<string>("1");
  const [selectedMarketId, setSelectedMarketId] = useState<string>("");
  const [plannedQty, setPlannedQty] = useState<string>("10");
  const [targetPrice, setTargetPrice] = useState<string>("1500");

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/crops").then((r) => r.json()),
      fetch("/api/markets").then((r) => r.json()),
    ]).then(([cData, mData]) => {
      if (cData.success && cData.crops.length > 0) {
        setCropsList(cData.crops);
        setSelectedCropId(String(cData.crops[0].id));
      }
      if (mData.success && mData.markets.length > 0) {
        setMarketsList(mData.markets);
        setSelectedMarketId(String(mData.markets[0].id));
      }
    });
  }, []);

  const handleGenerateRecommendation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId: selectedCropId,
          marketId: selectedMarketId || undefined,
          plannedQuantityTonnes: plannedQty,
          targetPricePerQuintal: targetPrice,
        }),
      });
      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch {
      console.error("Failed to generate recommendation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCropId && selectedMarketId) {
      handleGenerateRecommendation();
    }
  }, [selectedCropId, selectedMarketId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Decision Support Engine
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Planning & Advisory Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Rule-based intelligence evaluating estimated demand, expected supply, MSP benchmarks, and alternate market price differentials.
          </p>
        </div>

        {recommendation && (
          <ReadAloudButton
            text={`Recommendation for ${recommendation.cropName} in ${recommendation.marketName}: ${recommendation.title}. ${recommendation.recommendation}. Reason: ${recommendation.reason}`}
            size="md"
          />
        )}
      </div>

      {/* Main Layout: Parameter Input Form (Left) & Generated Recommendation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 h-fit">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Input Planning Parameters</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select your crop, intended target mandi, and volume to evaluate.
            </p>
          </div>

          <form onSubmit={handleGenerateRecommendation} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Crop *</label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {cropsList.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} ({c.teluguName.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Market Mandi *</label>
              <select
                value={selectedMarketId}
                onChange={(e) => setSelectedMarketId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {marketsList.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={plannedQty}
                    onChange={(e) => setPlannedQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-bold">Tonnes</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Selling Price</label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 font-bold">₹/q</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Evaluating Rules..." : "Run Advisory Engine"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Rule Factors Evaluated:</span>
            <p>1. Local Demand vs Supply Gap (Surplus/Shortage)</p>
            <p>2. Prevailing Price vs Government MSP Benchmark</p>
            <p>3. Alternate Mandis with higher net price realization</p>
          </div>
        </div>

        {/* Right 2 Columns: Advisory Card */}
        <div className="lg:col-span-2 space-y-6">
          {recommendation ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Verdict Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  recommendation.verdict === "STRONG_OPPORTUNITY"
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                    : recommendation.verdict === "ALTERNATE_MARKET_RECOMMENDED"
                    ? "bg-blue-50/80 border-blue-300 text-blue-900"
                    : recommendation.verdict === "SUPPLY_GLUT_WARNING"
                    ? "bg-amber-50/80 border-amber-300 text-amber-900"
                    : "bg-purple-50/80 border-purple-300 text-purple-900"
                }`}
              >
                <div className="p-2 bg-white rounded-xl shadow-xs shrink-0 mt-0.5">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded shadow-xs">
                    Verdict: {recommendation.verdict.replace(/_/g, " ")}
                  </span>
                  <h2 className="text-xl font-extrabold mt-1">{recommendation.title}</h2>
                  <p className="text-xs mt-1.5 leading-relaxed font-medium">{recommendation.recommendation}</p>
                </div>
              </div>

              {/* Reason Behind Every Recommendation (Mandatory Requirement) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                  System Reasoning & Supporting Evidence
                </span>
                <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px]">Estimated Demand</span>
                  <p className="font-extrabold text-slate-900 text-base mt-0.5">
                    {recommendation.metrics.demand} Tonnes
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px]">Expected Supply</span>
                  <p className="font-extrabold text-slate-900 text-base mt-0.5">
                    {recommendation.metrics.supply} Tonnes
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px]">Supply Gap</span>
                  <p
                    className={`font-black text-base mt-0.5 ${
                      recommendation.metrics.supplyGap > 0
                        ? "text-amber-700"
                        : recommendation.metrics.supplyGap < 0
                        ? "text-rose-700"
                        : "text-blue-700"
                    }`}
                  >
                    {recommendation.metrics.supplyGap > 0 ? "+" : ""}
                    {recommendation.metrics.supplyGap} Tonnes
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-[11px]">Average Mandi Price</span>
                  <p className="font-black text-emerald-800 text-base mt-0.5">
                    ₹{recommendation.metrics.averagePrice.toLocaleString("en-IN")}/q
                  </p>
                </div>
              </div>

              {/* Alternate Market Suggestion Callout if present */}
              {recommendation.metrics.alternateMarketSuggestion && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <TrendingUp className="w-4 h-4 text-blue-700" />
                    <span>Price Arbitrage Opportunity Detected:</span>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    Transporting produce to{" "}
                    <strong>{recommendation.metrics.alternateMarketSuggestion.marketName}</strong> provides an
                    average price of{" "}
                    <strong>₹{recommendation.metrics.alternateMarketSuggestion.price}/quintal</strong> (a net gain of{" "}
                    <strong>+₹{recommendation.metrics.alternateMarketSuggestion.priceGain}/quintal</strong> over{" "}
                    {recommendation.marketName}).
                  </p>
                </div>
              )}

              {/* Actionable Steps for Farmer */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Recommended Actionable Next Steps:</h4>
                <div className="space-y-2">
                  {recommendation.actionableSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Disclaimer (Mandatory Requirement) */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{recommendation.disclaimer}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              Select parameters and click &quot;Run Advisory Engine&quot; to generate recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
