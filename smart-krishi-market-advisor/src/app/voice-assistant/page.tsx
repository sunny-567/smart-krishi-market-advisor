"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  History,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function VoiceAssistantPage() {
  const { language, setLanguage, t } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [queryInput, setQueryInput] = useState("");
  const [responseResult, setResponseResult] = useState<any | null>(null);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API SpeechRecognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-IN";

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setQueryInput(text);
          setIsListening(false);
          handleProcessQuery(text);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    fetch("/api/voice-assistant")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.logs) setHistoryLogs(data.logs);
      })
      .catch(() => {});
  }, [language]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang =
        language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-IN";
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleProcessQuery = async (textToProcess?: string) => {
    const text = textToProcess || queryInput;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: text, language }),
      });
      const data = await res.json();
      if (data.success) {
        setResponseResult(data);
        // Automatically speak answer via SpeechSynthesis
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(data.responseText);
          utterance.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-IN";
          window.speechSynthesis.speak(utterance);
        }
        // Refresh history
        fetch("/api/voice-assistant")
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.logs) setHistoryLogs(d.logs);
          });
      }
    } catch {
      console.error("Voice query failed");
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    { label: "Tomato demand in Hyderabad", text: "What is the tomato demand in Hyderabad?" },
    { label: "Onion shortage in Kurnool", text: "Is there an onion shortage in Kurnool?" },
    { label: "Green chilli price in Guntur", text: "What is the green chilli price in Guntur?" },
    { label: "Turmeric price in Nizamabad", text: "What is the turmeric price in Nizamabad?" },
    { label: "హైదరాబాద్ టమాటా డిమాండ్ (Telugu)", text: "హైదరాబాద్ లో టమాటా డిమాండ్ ఎంత?" },
    { label: "हैदराबाद प्याज भाव (Hindi)", text: "हैदराबाद में प्याज का भाव क्या है?" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Voice Assistant (Web Speech API)
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Voice Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Ask crop demand, expected supply, or mandi price queries by speaking into your microphone or typing. Answers are retrieved from the database and read aloud.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton
            text="Smart Krishi Voice Assistant. Speak your query or select an example to hear crop demand and market prices."
            size="md"
          />
        </div>
      </div>

      {/* Main Microphone & Input Console */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Microphone Call-to-action */}
        <div className="text-center space-y-3 py-4">
          <button
            onClick={toggleListen}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg ${
              isListening
                ? "bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse scale-105"
                : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 shadow-emerald-200"
            }`}
            title={isListening ? "Listening... Click to stop" : "Click to speak"}
          >
            {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
          </button>

          <div>
            <p className="font-extrabold text-slate-900 text-base">
              {isListening ? "Listening... Speak your crop query now" : "Click Microphone to Speak"}
            </p>
            <p className="text-xs text-slate-500">
              {speechSupported
                ? "Browser Web Speech API active. Speak in English, Telugu, or Hindi."
                : "Speech recognition unavailable in this browser environment. Use the text input below."}
            </p>
          </div>
        </div>

        {/* Text Input Fallback Bar */}
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="e.g. 'What is the tomato demand in Hyderabad?' or type crop name..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleProcessQuery()}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium"
          />
          <button
            onClick={() => handleProcessQuery()}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>{loading ? "Searching..." : "Ask"}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Sample One-Click Example Questions */}
        <div className="space-y-2 pt-2 border-t border-slate-100 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Try Sample Voice / Text Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQueryInput(sq.text);
                  handleProcessQuery(sq.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200 transition-colors"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Assistant Response Output */}
        {responseResult && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Assistant Response
              </span>
              <ReadAloudButton text={responseResult.responseText} size="sm" />
            </div>

            <p className="text-slate-800 text-sm sm:text-base font-bold leading-relaxed">
              &quot;{responseResult.responseText}&quot;
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
              {responseResult.matchedCrop && (
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-semibold">
                  Crop: {responseResult.matchedCrop}
                </span>
              )}
              {responseResult.matchedMarket && (
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-semibold">
                  Market: {responseResult.matchedMarket}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voice Interaction History Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span>Recent Voice Interaction Logs (Database Stored)</span>
        </h3>

        <div className="space-y-3">
          {historyLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="font-bold text-slate-700">Q: &quot;{log.queryText}&quot;</span>
                <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-800 font-medium">A: {log.responseText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
