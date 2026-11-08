"use client";

import React, { useState, useEffect } from "react";
import { PhoneForwarded, CheckCircle2, Clock, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function CallbackRequestPage() {
  const { user } = useAuth();

  const [farmerName, setFarmerName] = useState(user?.name || "Ramesh Reddy");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "+91 98480 22334");
  const [preferredLanguage, setPreferredLanguage] = useState("Telugu");
  const [reason, setReason] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (10:00 AM - 1:00 PM)");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentCallbacks, setRecentCallbacks] = useState<any[]>([]);

  const fetchCallbacks = () => {
    fetch("/api/callback-requests")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.callbacks) setRecentCallbacks(data.callbacks);
      });
  };

  useEffect(() => {
    fetchCallbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/callback-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          farmerName,
          phoneNumber,
          preferredLanguage,
          reason,
          preferredTime,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setReason("");
        fetchCallbacks();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch {
      console.error("Callback submission failed");
    } finally {
      setLoading(false);
    }
  };

  const callbackSpeech = `Farmer Callback Request Portal. Submit your contact details, preferred time slot, and query topic to request guidance from our agricultural marketing officers.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Kisan Callback Module
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Request Agronomist / Officer Callback
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Farmers can schedule a direct phone consultation with regional APMC market intelligence officers for harvest timing and price advisory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton text={callbackSpeech} size="md" />
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Callback request successfully registered in database! Status: <strong>Pending</strong>. An officer will be assigned shortly.
          </span>
        </div>
      )}

      {/* Main Grid: Request Form (Left) & Active Status Overview (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Request Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PhoneForwarded className="w-5 h-5 text-amber-600" />
              <span>Submit Callback Details</span>
            </h3>
            <p className="text-xs text-slate-500">
              Provide your phone and query description. Saved directly into PostgreSQL.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="e.g. Ramesh Reddy"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number for Callback *</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98480 22334"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2 PM - 5 PM)</option>
                  <option value="Evening (5:00 PM - 7:00 PM)">Evening (5 PM - 7 PM)</option>
                  <option value="Anytime">Anytime during office hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Callback / Crop Query *</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Need advice on whether to sell Tomato in Hyderabad vs Warangal mandi due to price difference..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors"
            >
              {loading ? "Submitting Request..." : "Submit Callback Request"}
            </button>
          </form>
        </div>

        {/* Right Column: Status Tracker & Real Time Queue */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Recent Callback Queue in System</span>
              </h3>
              <p className="text-xs text-slate-500">
                Live statuses updated by Agricultural Officers from the Admin Dashboard.
              </p>
            </div>

            <div className="space-y-3">
              {recentCallbacks.map((cb) => (
                <div key={cb.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cb.farmerName}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        cb.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : cb.status === "Calling"
                          ? "bg-blue-100 text-blue-800 animate-pulse"
                          : cb.status === "Assigned"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {cb.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">&quot;{cb.reason}&quot;</p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/60">
                    <span>Lang: {cb.preferredLanguage} • Slot: {cb.preferredTime}</span>
                    {cb.adminNotes && <span className="text-emerald-700 font-semibold truncate max-w-[130px]">Notes: {cb.adminNotes}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
