"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function FarmerRegisterPage() {
  const router = useRouter();
  const { demoLogin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "Warangal, Telangana",
    farmSizeAcres: "3.5",
    primaryCrops: "Tomato, Green Chilli, Cotton",
    soilType: "Red Sandy Loam",
    irrigationType: "Drip + Borewell",
    experienceYears: "10",
    preferredLanguage: "te",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "farmer" }),
      });
      const data = await res.json();
      if (data.success) {
        demoLogin("farmer");
        router.push("/dashboard/farmer");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch {
      setMessage("Failed to register. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-bold">
            👨‍🌾
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Farmer Registration Portal
            </h1>
            <p className="text-xs text-slate-500">
              Create a producer profile to access localized demand alerts, crop recommendations, and buyer requirements.
            </p>
          </div>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Reddy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98480 22334"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="Create secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Village / District / Mandal *</label>
              <input
                type="text"
                required
                placeholder="Warangal Rural, Telangana"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farm Land Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 4.5"
                value={formData.farmSizeAcres}
                onChange={(e) => setFormData({ ...formData, farmSizeAcres: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Crops Grown</label>
              <input
                type="text"
                placeholder="e.g. Tomato, Green Chilli, Cotton"
                value={formData.primaryCrops}
                onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Language</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="te">తెలుగు (Telugu)</option>
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
              <input
                type="text"
                placeholder="e.g. Red Loam / Black Cotton"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Irrigation Source</label>
              <input
                type="text"
                placeholder="e.g. Drip & Borewell / Canal"
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm mt-4"
          >
            <span>{loading ? "Registering Account..." : "Complete Farmer Registration"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Already registered?</span>
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  );
}
