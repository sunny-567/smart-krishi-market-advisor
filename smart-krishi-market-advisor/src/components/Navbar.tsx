"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Package,
  ShoppingCart,
  Mic,
  MessageSquare,
  PhoneCall,
  PhoneForwarded,
  Bell,
  Menu,
  X,
  ChevronDown,
  Globe,
  UserCheck,
  ShieldCheck,
  FileText,
  Info,
  LogOut,
  LogIn,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Language } from "@/lib/translations";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isFarmer, isBuyer, isAdmin, demoLogin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [dashDropdownOpen, setDashDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top utility alert bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-200">ACADEMIC PROTOTYPE:</span>
            <span className="hidden sm:inline">Agricultural Demand & Supply Decision Support System</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-300 hidden md:inline">Quick Demo:</span>
              <button
                onClick={() => demoLogin("farmer")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  isFarmer ? "bg-emerald-500 text-white font-bold" : "bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200"
                }`}
              >
                👨‍🌾 Farmer
              </button>
              <button
                onClick={() => demoLogin("buyer")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  isBuyer ? "bg-emerald-500 text-white font-bold" : "bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200"
                }`}
              >
                🏪 Buyer
              </button>
              <button
                onClick={() => demoLogin("admin")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  isAdmin ? "bg-emerald-500 text-white font-bold" : "bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200"
                }`}
              >
                🛡️ Admin
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700">
              <Globe className="w-3 h-3 text-emerald-300" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-1 py-0.2 rounded font-semibold ${
                  language === "en" ? "text-emerald-300 underline" : "text-emerald-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <span className="text-emerald-600">|</span>
              <button
                onClick={() => setLanguage("te")}
                className={`px-1 py-0.2 rounded font-semibold ${
                  language === "te" ? "text-emerald-300 underline" : "text-emerald-400 hover:text-white"
                }`}
              >
                తెలుగు
              </button>
              <span className="text-emerald-600">|</span>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-1 py-0.2 rounded font-semibold ${
                  language === "hi" ? "text-emerald-300 underline" : "text-emerald-400 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-emerald-950 tracking-tight leading-none">
                  Smart Krishi
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Advisor
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium truncate max-w-[210px] sm:max-w-none">
                Demand & Supply Management
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/") ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-slate-50 hover:text-emerald-600"
              }`}
            >
              {t.home}
            </Link>

            <Link
              href="/demand-supply"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive("/demand-supply") ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-slate-50 hover:text-emerald-600"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>{t.demandSupply}</span>
            </Link>

            <Link
              href="/recommendations"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive("/recommendations") ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-slate-50 hover:text-emerald-600"
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{t.recommendations}</span>
            </Link>

            <Link
              href="/market-prices"
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                isActive("/market-prices") ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-slate-50 hover:text-emerald-600"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>{t.marketPrices}</span>
            </Link>

            <Link
              href="/crops"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/crops") ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-slate-50 hover:text-emerald-600"
              }`}
            >
              {t.crops}
            </Link>

            {/* Smart Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                className="px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span>AI & Assistive</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/voice-assistant"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <Mic className="w-4 h-4 text-emerald-600" />
                    <span>{t.voiceAssistant}</span>
                  </Link>
                  <Link
                    href="/helpline-demo"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <PhoneCall className="w-4 h-4 text-indigo-600" />
                    <span>{t.helplineDemo}</span>
                  </Link>
                  <Link
                    href="/sms-demo"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>{t.smsDemo}</span>
                  </Link>
                  <Link
                    href="/callback-request"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <PhoneForwarded className="w-4 h-4 text-amber-600" />
                    <span>{t.callbackRequest}</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <Link
                    href="/farmer/produce"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <Package className="w-4 h-4 text-green-600" />
                    <span>{t.produceListings}</span>
                  </Link>
                  <Link
                    href="/buyer/requirements"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                    <span>{t.buyerRequirements}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Dashboards Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDashDropdownOpen(!dashDropdownOpen)}
                onBlur={() => setTimeout(() => setDashDropdownOpen(false), 200)}
                className="px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
              >
                <span>Dashboards</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dashDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/dashboard/farmer"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.farmerDashboard}</span>
                  </Link>
                  <Link
                    href="/dashboard/buyer"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                    <span>{t.buyerDashboard}</span>
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>{t.adminDashboard}</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <Link
                    href="/reports"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>{t.reports}</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <Info className="w-4 h-4 text-slate-500" />
                    <span>{t.about}</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & User */}
          <div className="flex items-center gap-3">
            <Link
              href="/notifications"
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full relative transition-colors"
              title={t.notifications}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            </Link>

            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link
                  href={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "buyer"
                      ? "/dashboard/buyer"
                      : "/dashboard/farmer"
                  }
                  className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                      user.role === "admin"
                        ? "bg-purple-600"
                        : user.role === "buyer"
                        ? "bg-blue-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-1.5 shadow-lg max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
          >
            {t.home}
          </Link>
          <Link
            href="/demand-supply"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
          >
            📊 {t.demandSupply}
          </Link>
          <Link
            href="/recommendations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
          >
            💡 {t.recommendations}
          </Link>
          <Link
            href="/market-prices"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
          >
            📈 {t.marketPrices}
          </Link>
          <Link
            href="/crops"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
          >
            🌱 {t.crops}
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Dashboards & Trade
            </p>
            <Link
              href="/dashboard/farmer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              👨‍🌾 {t.farmerDashboard}
            </Link>
            <Link
              href="/dashboard/buyer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              🏪 {t.buyerDashboard}
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              🛡️ {t.adminDashboard}
            </Link>
            <Link
              href="/farmer/produce"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              📦 {t.produceListings}
            </Link>
            <Link
              href="/buyer/requirements"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              🛒 {t.buyerRequirements}
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Assistive Tools
            </p>
            <Link
              href="/voice-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              🎙️ {t.voiceAssistant}
            </Link>
            <Link
              href="/helpline-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              📞 {t.helplineDemo}
            </Link>
            <Link
              href="/sms-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              💬 {t.smsDemo}
            </Link>
            <Link
              href="/callback-request"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              📲 {t.callbackRequest}
            </Link>
            <Link
              href="/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              📑 {t.reports}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-800 font-medium hover:bg-emerald-50"
            >
              ℹ️ {t.about}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
