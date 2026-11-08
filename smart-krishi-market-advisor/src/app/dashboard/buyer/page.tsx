"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  BarChart3,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [myRequirements, setMyRequirements] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/buyer-requirements?userId=2").then((r) => r.json()),
      fetch("/api/produce-listings").then((r) => r.json()),
    ])
      .then(([reqData, listData]) => {
        if (reqData.success) setMyRequirements(reqData.requirements || []);
        if (listData.success) setAllListings(listData.listings || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const buyerSpeech = `Buyer Procurement Dashboard for AgriFresh Foods. You have ${myRequirements.length} active procurement requirements and ${allListings.length} direct farmer produce lots available for procurement.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-800/80 px-2.5 py-0.5 rounded-full border border-blue-600/40">
              Procurement & Trader Center
            </span>
            <SampleDataBadge className="bg-slate-950/80 text-amber-200 border-amber-400/40" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || "AgriFresh Agro Foods"} 🏪
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            <span>Bowenpally APMC & Regional Mandis</span>
            <span>•</span>
            <span>Monthly Procurement Target: 150 Tonnes</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ReadAloudButton text={buyerSpeech} size="md" className="bg-blue-950 text-blue-100 border-blue-700" />
          <Link
            href="/buyer/requirements"
            className="inline-flex items-center gap-1.5 bg-blue-400 hover:bg-blue-300 text-blue-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post Bulk Requirement</span>
          </Link>
          <Link
            href="/farmer/produce"
            className="inline-flex items-center gap-1.5 bg-blue-800 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-blue-600/40 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Browse All Lots</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">My Active Demands</p>
          <h3 className="text-2xl font-black text-blue-900 mt-1">{myRequirements.length} Crops</h3>
          <span className="text-[11px] text-blue-600 font-semibold">Tomato, Chilli, Onion</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Available Farmer Lots</p>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{allListings.length} Lots</h3>
          <span className="text-[11px] text-emerald-600 font-semibold">Grade A verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Available Volume</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">22.5 Tonnes</h3>
          <span className="text-[11px] text-slate-500">Across Telangana & AP</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Matching Compatibility</p>
          <h3 className="text-2xl font-black text-purple-700 mt-1">92% Match</h3>
          <span className="text-[11px] text-purple-600 font-semibold">Algorithm Scored</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Active Demands with Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>My Active Procurement Requirements</span>
              </h3>
              <Link href="/buyer/requirements" className="text-xs font-bold text-blue-700 hover:underline">
                View & Post
              </Link>
            </div>

            <div className="space-y-4">
              {myRequirements.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">{req.cropName}</span>
                      <span className="text-slate-500 ml-2">Target Mandi: {req.marketName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">
                        Needed: <strong>{req.requiredQuantityTonnes} Tonnes</strong>
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Target: ₹{req.targetPricePerQuintal}/q
                      </span>
                    </div>
                  </div>

                  {/* Matching Farmer Listings */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Matching Farmer Listings ({req.matchingListings?.length || 0})
                    </p>
                    {(!req.matchingListings || req.matchingListings.length === 0) ? (
                      <p className="text-[11px] text-slate-400 italic">No exact farmer matches right now.</p>
                    ) : (
                      <div className="space-y-2">
                        {req.matchingListings.slice(0, 2).map((match: any) => (
                          <div
                            key={match.id}
                            className="p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{match.farmerName}</span>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                                  {match.matchScore}% Match
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Avail: {match.availableQuantityTonnes}t • Loc: {match.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-700">₹{match.expectedPricePerQuintal}/q</p>
                              <span className="text-[10px] text-slate-400">Harvest: {match.harvestDate}</span>
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
        </div>

        {/* Right Col: Available Farmer Produce Directory */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>Verified Farmer Lots</span>
              </h3>
              <Link href="/farmer/produce" className="text-xs font-bold text-emerald-700 hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3">
              {allListings.slice(0, 4).map((lot) => (
                <div key={lot.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{lot.cropName}</span>
                    <span className="font-black text-emerald-700">₹{lot.expectedPricePerQuintal}/q</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Farmer: {lot.farmerName} • Avail: {lot.availableQuantityTonnes} Tonnes
                  </p>
                  <p className="text-[10px] text-slate-500">Mandi: {lot.marketName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
