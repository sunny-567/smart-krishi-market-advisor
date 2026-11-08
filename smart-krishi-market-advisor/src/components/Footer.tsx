"use client";

import React from "react";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Heart, Award, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Advisory Banner */}
      <div className="bg-emerald-800 text-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700 rounded-lg">
              <Award className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Smart Krishi Market Advisor — B.Tech Final Year Academic Project
              </h4>
              <p className="text-xs text-emerald-100">
                Decision Support System for Farmers, Traders, and Agricultural Market Committees
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 bg-white text-emerald-900 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <span>View System Architecture</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">Smart Krishi Advisor</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering agricultural producers with transparent demand-supply forecasting, price gap calculation, and rule-based crop planning recommendations to reduce post-harvest losses.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Directorate of Agricultural Marketing, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Simulated Kisan Toll-Free: 1800-180-1551 (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>academic.project@smartkrishi.in</span>
              </div>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Core Modules
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/demand-supply" className="hover:text-emerald-400 transition-colors">
                  {t.demandSupply} (Surplus & Shortage)
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-emerald-400 transition-colors">
                  {t.recommendations} (Rule Engine)
                </Link>
              </li>
              <li>
                <Link href="/market-prices" className="hover:text-emerald-400 transition-colors">
                  {t.marketPrices} (Cross-Mandi Comparison)
                </Link>
              </li>
              <li>
                <Link href="/crops" className="hover:text-emerald-400 transition-colors">
                  {t.crops} (12 Major Crops Directory)
                </Link>
              </li>
              <li>
                <Link href="/farmer/produce" className="hover:text-emerald-400 transition-colors">
                  {t.produceListings}
                </Link>
              </li>
              <li>
                <Link href="/buyer/requirements" className="hover:text-emerald-400 transition-colors">
                  {t.buyerRequirements} (Smart Matching)
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistive & AI Tools */}
          <div>
            <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Assistive Demonstrations
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/voice-assistant" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🎙️ {t.voiceAssistant} (Web Speech API)</span>
                </Link>
              </li>
              <li>
                <Link href="/helpline-demo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>📞 {t.helplineDemo} (Simulated Call)</span>
                </Link>
              </li>
              <li>
                <Link href="/sms-demo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>💬 {t.smsDemo} (Two-Way Simulation)</span>
                </Link>
              </li>
              <li>
                <Link href="/callback-request" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>📲 {t.callbackRequest}</span>
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>📑 {t.reports} & Printables</span>
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🔔 Agricultural Alerts</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Disclaimers */}
          <div>
            <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Academic Submission
            </h5>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>College Prototype Notice</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                All data, phone calls, and SMS interactions are fully simulated in-browser and database for student project demonstration. No paid telephony or SMS gateways are used.
              </p>
              <div className="pt-2 border-t border-slate-700 flex flex-wrap gap-1 text-[10px]">
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-mono">Next.js 16</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-mono">PostgreSQL</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-mono">Drizzle ORM</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-mono">Tailwind CSS</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-mono">Chart.js</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Smart Krishi Market Advisor. Academic Project for Educational Evaluation.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Built with passion for Indian Agriculture</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
