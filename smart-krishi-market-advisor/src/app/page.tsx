"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sprout,
  BarChart3,
  TrendingUp,
  Lightbulb,
  PhoneCall,
  MessageSquare,
  Mic,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Users,
  Building2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function HomePage() {
  const { t } = useLanguage();
  const { demoLogin } = useAuth();
  const [summaryStats, setSummaryStats] = useState({
    totalCrops: 12,
    surplusCount: 5,
    shortageCount: 7,
    balancedCount: 6,
    avgPrice: 5350,
  });

  useEffect(() => {
    fetch("/api/demand-supply")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.summary) {
          setSummaryStats({
            totalCrops: data.summary.totalCropsMonitored,
            surplusCount: data.summary.surplusCount,
            shortageCount: data.summary.shortageCount,
            balancedCount: data.summary.balancedCount,
            avgPrice: data.summary.averageMarketPrice,
          });
        }
      })
      .catch(() => {});
  }, []);

  const heroSpeech = `Welcome to Smart Krishi Market Advisor. Agricultural demand and supply intelligence system. We monitor crop demand, expected supply, potential surplus, shortage, and rule-based crop planning recommendations to assist farmers and traders.`;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Hero Content */}
            <div className="max-w-2xl space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Agricultural Decision-Support System Prototype</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Empowering Farmers with <br />
                <span className="text-emerald-300">Demand & Supply</span> Market Advisory
              </h1>

              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
                Understand estimated market demand, forecast expected harvest supply, detect potential surplus or shortage before harvest, and connect with direct buyers through one unified platform.
              </p>

              {/* Action Buttons & Read Aloud */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/demand-supply"
                  className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-950/40 transition-transform hover:-translate-y-0.5"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Explore Demand & Supply</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/recommendations"
                  className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600/60 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                  <span>Get Crop Recommendations</span>
                </Link>

                <ReadAloudButton text={heroSpeech} size="md" className="bg-emerald-950/80 text-emerald-200 border-emerald-700" />
              </div>

              {/* Sample Data Disclaimer in Hero */}
              <div className="pt-2">
                <SampleDataBadge className="bg-emerald-950/80 text-amber-200 border-amber-500/40 text-[11px]" />
              </div>
            </div>

            {/* Right Hero Card: Core Formula Demonstration */}
            <div className="w-full lg:w-96 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-2xl shadow-2xl border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Core Advisory Formula</h3>
                    <p className="text-[11px] text-slate-500">Mathematical Gap Model</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-xs text-center text-emerald-900 font-bold">
                Supply Gap = Expected Supply - Estimated Demand
              </div>

              {/* Real Classification Rules */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/60">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900">Positive Gap (+):</span>
                    <p className="text-emerald-800 text-[11px]">
                      Potential Surplus → Risk of price drop. Advice: Stagger harvest or target deficit mandis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/80 border border-rose-200/60">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-900">Negative Gap (-):</span>
                    <p className="text-rose-800 text-[11px]">
                      Potential Shortage → Strong seller opportunity with premium prices over MSP.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50/80 border border-blue-200/60">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-blue-900">Near-Zero Gap:</span>
                    <p className="text-blue-800 text-[11px]">
                      Balanced Supply → Steady price discovery. Standard dispatch schedule.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Live Sample Crops:</span>
                <span className="font-bold text-emerald-700">12 Crops Monitored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Crops Monitored</p>
              <h4 className="text-2xl font-black text-slate-900">{summaryStats.totalCrops}</h4>
              <span className="text-[11px] text-emerald-600 font-semibold">Tomato, Onion, Chilli...</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Potential Surplus</p>
              <h4 className="text-2xl font-black text-amber-600">{summaryStats.surplusCount} Crops</h4>
              <span className="text-[11px] text-slate-500">Supply &gt; Demand</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Potential Shortage</p>
              <h4 className="text-2xl font-black text-rose-600">{summaryStats.shortageCount} Crops</h4>
              <span className="text-[11px] text-slate-500">Demand &gt; Supply</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Avg Mandi Price</p>
              <h4 className="text-2xl font-black text-slate-900">₹{summaryStats.avgPrice.toLocaleString("en-IN")}</h4>
              <span className="text-[11px] text-slate-500">Per Quintal (APMC)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Logins Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Instant College Evaluation Logins</span>
              </div>
              <h2 className="text-2xl font-bold">One-Click Demonstration Logins</h2>
              <p className="text-xs text-slate-300">
                Click any role button below to instantly authenticate and evaluate that user experience.
              </p>
            </div>
            <Link
              href="/login"
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              Or view traditional login form →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Farmer Demo Card */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    👨‍🌾 Role: Farmer
                  </span>
                  <span className="text-[11px] text-slate-400">Warangal, TS</span>
                </div>
                <h4 className="font-bold text-white text-base">Ramesh Reddy</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Email: <code className="text-emerald-300 font-mono">farmer@smartkrishi.in</code>
                  <br />
                  Pass: <code className="text-emerald-300 font-mono">Farmer@123</code>
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Permissions: Produce listing, crop plans, callback request, demand view, crop advisory.
                </p>
              </div>
              <button
                onClick={() => {
                  demoLogin("farmer");
                  window.location.href = "/dashboard/farmer";
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Log In as Farmer →
              </button>
            </div>

            {/* Buyer Demo Card */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                    🏪 Role: Buyer
                  </span>
                  <span className="text-[11px] text-slate-400">Hyderabad, TS</span>
                </div>
                <h4 className="font-bold text-white text-base">AgriFresh Foods Ltd</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Email: <code className="text-blue-300 font-mono">buyer@smartkrishi.in</code>
                  <br />
                  Pass: <code className="text-blue-300 font-mono">Buyer@123</code>
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Permissions: Post crop requirements, view matching produce listings, procurement alerts.
                </p>
              </div>
              <button
                onClick={() => {
                  demoLogin("buyer");
                  window.location.href = "/dashboard/buyer";
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Log In as Buyer →
              </button>
            </div>

            {/* Admin Demo Card */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                    🛡️ Role: Admin
                  </span>
                  <span className="text-[11px] text-slate-400">Agri Directorate</span>
                </div>
                <h4 className="font-bold text-white text-base">Dr. K. Srinivas (Agronomist)</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Email: <code className="text-purple-300 font-mono">admin@smartkrishi.in</code>
                  <br />
                  Pass: <code className="text-purple-300 font-mono">Admin@123</code>
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Permissions: User management, callback manager, market intelligence oversight, system analytics.
                </p>
              </div>
              <button
                onClick={() => {
                  demoLogin("admin");
                  window.location.href = "/admin/dashboard";
                }}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Log In as Admin →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Assistive Demonstration Modules Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Multimodal Rural Access Technologies
          </h2>
          <p className="text-sm text-slate-600">
            Designed for varied literacy levels, supporting Web Speech voice recognition, simulated SMS queries, and AI helpline call assistance without paid external gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Voice Assistant */}
          <Link
            href="/voice-assistant"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                Voice Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Speak directly into your browser microphone in English, Telugu, or Hindi. The system recognizes crop and market names and reads answers aloud.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span>Try Speech Interaction</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* AI Helpline Call */}
          <Link
            href="/helpline-demo"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-700 transition-colors">
                AI Helpline Call Demo
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulated interactive toll-free calling experience. Dial in, listen to the automated advisory assistant, ask queries, and hear real-time synthesized speech responses.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
              <span>Start Helpline Call</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* SMS Simulator */}
          <Link
            href="/sms-demo"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                Two-Way SMS Simulator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrates mobile SMS inquiry e.g. &quot;Tomato demand Hyderabad&quot; with simulated incoming text and automated database response stored in PostgreSQL.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
              <span>Open SMS Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Callback Request */}
          <Link
            href="/callback-request"
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                Callback Requests
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit a call request with preferred time and language. Admin officers view, assign, and update statuses (Pending, Assigned, Calling, Completed).
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <span>Submit Request</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Core Workflow Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">How Smart Krishi Advisor Operates</h3>
              <p className="text-xs text-slate-500">End-to-End Decision Support Lifecycle</p>
            </div>
            <Link
              href="/about"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View System Architecture & Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Data Ingestion</h4>
              <p className="text-slate-600 leading-relaxed">
                Collects APMC mandi arrivals, estimated consumer demand, and expected seasonal crop acreage.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Supply Gap Calculation</h4>
              <p className="text-slate-600 leading-relaxed">
                Applies the Supply Gap formula: Supply - Demand, categorizing each crop into Surplus, Shortage, or Balanced.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Rule-Based Advisory</h4>
              <p className="text-slate-600 leading-relaxed">
                Evaluates prices vs MSP benchmarks and suggests alternate mandis with higher price realization.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Direct Matchmaking</h4>
              <p className="text-slate-600 leading-relaxed">
                Connects farmers with wholesale buyers looking for specific quantities, eliminating middlemen gouging.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
