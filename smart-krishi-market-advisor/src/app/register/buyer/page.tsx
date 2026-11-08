"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BuyerRegisterPage() {
  const router = useRouter();
  const { demoLogin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    phone: "",
    location: "Bowenpally, Hyderabad, Telangana",
    businessType: "Wholesale Mandi Trader",
    gstNumber: "36AAACA1234F1Z8",
    procurementCapacityTonnes: "50",
    preferredLanguage: "en",
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
        body: JSON.stringify({ ...formData, role: "buyer" }),
      });
      const data = await res.json();
      if (data.success) {
        demoLogin("buyer");
        router.push("/dashboard/buyer");
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
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center font-bold">
            🏪
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Buyer / Aggregator Registration
            </h1>
            <p className="text-xs text-slate-500">
              Register your trading company or food processing unit to discover verified farmer crop listings and post bulk demand.
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
              <label className="block font-semibold text-slate-700 mb-1">Company / Trading Firm Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. AgriFresh Foods Pvt Ltd"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Representative Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. K. Venkat Rao"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                placeholder="procurement@agrifresh.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91 94401 55667"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating APMC Mandi / Hub</label>
              <input
                type="text"
                required
                placeholder="Bowenpally APMC, Hyderabad"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Wholesale Mandi Trader">Wholesale Mandi Trader</option>
                <option value="Food Processing Industry">Food Processing Industry</option>
                <option value="Agri Retail / Supermarket">Agri Retail / Supermarket</option>
                <option value="Spice / Pulse Exporter">Spice / Pulse Exporter</option>
                <option value="Commission Agent">Commission Agent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Procurement Target (Tonnes)</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.procurementCapacityTonnes}
                onChange={(e) => setFormData({ ...formData, procurementCapacityTonnes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">GSTIN (Optional / Demo)</label>
            <input
              type="text"
              placeholder="e.g. 36AAACA1234F1Z8"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm mt-4"
          >
            <span>{loading ? "Registering Buyer..." : "Complete Buyer Registration"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Already registered?</span>
          <Link href="/login" className="font-semibold text-blue-700 hover:underline">
            Sign In here →
          </Link>
        </div>
      </div>
    </div>
  );
}
