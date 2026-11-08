"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, ShoppingCart } from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (email.includes("admin")) {
          router.push("/admin/dashboard");
        } else if (email.includes("buyer")) {
          router.push("/dashboard/buyer");
        } else {
          router.push("/dashboard/farmer");
        }
      } else {
        setErrorMsg(res.message || "Invalid credentials");
      }
    } catch {
      setErrorMsg("Failed to connect to authentication service");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (role: "farmer" | "buyer" | "admin") => {
    demoLogin(role);
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "buyer") router.push("/dashboard/buyer");
    else router.push("/dashboard/farmer");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-200">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to Smart Krishi Advisor
          </h2>
          <p className="text-xs text-slate-500">
            Select an instant demo account or sign in with your registered credentials.
          </p>
        </div>

        {/* Demo Accounts Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              ⚡ Instant Academic Demo Accounts
            </span>
            <span className="text-[10px] text-slate-400">One-click</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoSelect("farmer")}
              type="button"
              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500 text-center transition-all group"
            >
              <div className="text-sm">👨‍🌾</div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">Farmer</div>
              <div className="text-[10px] text-slate-400 truncate">Ramesh</div>
            </button>

            <button
              onClick={() => handleDemoSelect("buyer")}
              type="button"
              className="p-2 rounded-xl bg-slate-800 hover:bg-blue-900/60 border border-slate-700 hover:border-blue-500 text-center transition-all group"
            >
              <div className="text-sm">🏪</div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300">Buyer</div>
              <div className="text-[10px] text-slate-400 truncate">AgriFresh</div>
            </button>

            <button
              onClick={() => handleDemoSelect("admin")}
              type="button"
              className="p-2 rounded-xl bg-slate-800 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-500 text-center transition-all group"
            >
              <div className="text-sm">🛡️</div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300">Admin</div>
              <div className="text-[10px] text-slate-400 truncate">Dr. Srinivas</div>
            </button>
          </div>
        </div>

        {/* Traditional Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="farmer@smartkrishi.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="Enter password (e.g. Farmer@123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
            <p className="text-slate-500">Need a demonstration account?</p>
            <div className="flex items-center justify-center gap-3 font-semibold text-emerald-700">
              <Link href="/register/farmer" className="hover:underline">
                Farmer Registration
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/register/buyer" className="hover:underline">
                Buyer Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
