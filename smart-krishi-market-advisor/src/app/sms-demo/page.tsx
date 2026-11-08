"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Smartphone, ShieldCheck, History, ArrowRight } from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function SmsDemoPage() {
  const [phoneNumber, setPhoneNumber] = useState("+91 98480 22334");
  const [messageInput, setMessageInput] = useState("Tomato demand Hyderabad");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestExchange, setLatestExchange] = useState<{ query: string; reply: string } | null>({
    query: "Tomato demand Hyderabad",
    reply:
      "Demo result: Tomato estimated demand is 600 tonnes and expected supply is 1,000 tonnes. Potential surplus: 400 tonnes. Average price: Rs 1,450/quintal. (SIMULATED SMS)",
  });

  const fetchLogs = () => {
    fetch("/api/sms-demo")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.logs) setLogs(d.logs);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/sms-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, message: messageInput }),
      });
      const data = await res.json();
      if (data.success && data.log) {
        setLatestExchange({
          query: data.log.userMessage,
          reply: data.log.systemResponse,
        });
        fetchLogs();
      }
    } catch {
      console.error("SMS demo failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Mobile SMS Gateway Simulation
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Two-Way SMS Demonstration Module
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Simulates rural feature-phone text messaging. Demonstrates automated query parsing and SMS response generation stored in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton
            text="Simulated Two-Way SMS Interface. Test sending a crop query such as Tomato demand Hyderabad and view the simulated instant reply."
            size="md"
          />
        </div>
      </div>

      {/* Prominent Simulated Notice Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="font-semibold">
            SIMULATED SMS DEMO ONLY — No real telecom SMS gateway is connected or billed. Messages are generated and stored in application database.
          </span>
        </div>
        <span className="font-mono font-bold text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
          DEMO
        </span>
      </div>

      {/* Main Interactive Screen: Form (Left) & Mobile Phone Mockup (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Input Console */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Compose Simulated Mobile Message</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your mobile number and crop question format.
            </p>
          </div>

          <form onSubmit={handleSendSms} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farmer Phone Number *</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98480 22334"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Text Query *</label>
              <textarea
                required
                rows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="e.g. Tomato demand Hyderabad or Onion price Kurnool"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? "Processing SMS..." : "Send Simulated SMS"}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick presets */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <span className="font-semibold text-slate-600 block">Click Example SMS:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setMessageInput("Tomato demand Hyderabad")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 text-[11px] font-semibold"
              >
                Tomato demand Hyderabad
              </button>
              <button
                type="button"
                onClick={() => setMessageInput("Onion price Kurnool")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 text-[11px] font-semibold"
              >
                Onion price Kurnool
              </button>
              <button
                type="button"
                onClick={() => setMessageInput("Green chilli demand Guntur")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 text-[11px] font-semibold"
              >
                Green chilli demand Guntur
              </button>
            </div>
          </div>
        </div>

        {/* Right: Mobile Phone Chat Mockup */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-[40px] shadow-2xl border-4 border-slate-700 text-white max-w-sm mx-auto w-full space-y-4">
          {/* Phone Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                SK
              </div>
              <div>
                <p className="font-bold text-white text-xs leading-none">Smart Krishi Mandi</p>
                <span className="text-[10px] text-emerald-400">Shortcode: 51551</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">SIMULATED SMS</span>
          </div>

          {/* Chat Messages Frame */}
          <div className="space-y-3 py-2 min-h-[220px] flex flex-col justify-end text-xs">
            {latestExchange && (
              <>
                {/* Farmer Outgoing Bubble */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-xs max-w-[85%] shadow-sm space-y-1">
                    <p className="font-medium text-xs">{latestExchange.query}</p>
                    <span className="text-[9px] text-blue-200 block text-right font-mono">Sent from {phoneNumber}</span>
                  </div>
                </div>

                {/* System Incoming Response Bubble */}
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] shadow-sm border border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                      Smart Krishi Advisory
                    </span>
                    <p className="font-semibold text-xs leading-relaxed">{latestExchange.reply}</p>
                    <span className="text-[9px] text-slate-400 block text-right font-mono">Delivered via DB</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
            Kisan SMS Gateway Prototype
          </div>
        </div>
      </div>

      {/* Database Stored SMS History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span>Simulated SMS Database Transaction Logs ({logs.length})</span>
        </h3>

        <div className="space-y-2.5">
          {logs.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="font-bold text-slate-800">Phone: {item.phoneNumber}</span>
                <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-blue-800 font-medium">Inquiry: &quot;{item.userMessage}&quot;</p>
              <p className="text-slate-700 text-[11px]">Reply: {item.systemResponse}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
