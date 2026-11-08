"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, AlertTriangle, TrendingUp, ShoppingCart, Info, Sparkles } from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.notifications) setAlerts(data.notifications);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markRead = async (id: number) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchAlerts();
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              System Broadcasts
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Alerts & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time notifications on supply gluts, commodity price spikes, buyer procurement interest, and meteorological advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton
            text={`Agricultural Notifications. Total active alerts: ${alerts.length}. Highlighting potential surplus in Hyderabad and buyer interest for green chilli in Guntur.`}
            size="md"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {alerts.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 text-xs ${
              !item.isRead
                ? "bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-200"
                : "bg-slate-50/80 border-slate-200 opacity-80"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  item.type === "shortage_warning"
                    ? "bg-amber-100 text-amber-800"
                    : item.type === "buyer_interest"
                    ? "bg-purple-100 text-purple-800"
                    : item.type === "price_alert"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {item.type === "shortage_warning" ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : item.type === "buyer_interest" ? (
                  <ShoppingCart className="w-5 h-5" />
                ) : item.type === "price_alert" ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{item.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Received: {new Date(item.createdAt).toLocaleDateString()} at{" "}
                  {new Date(item.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {!item.isRead && (
              <button
                onClick={() => markRead(item.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-colors shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
