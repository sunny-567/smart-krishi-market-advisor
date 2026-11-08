"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ShieldCheck,
  Send,
  User,
  Bot,
  Radio,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function HelplineDemoPage() {
  const { language, setLanguage } = useLanguage();

  const [callState, setCallState] = useState<"idle" | "connecting" | "connected" | "ended">("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<
    { sender: "assistant" | "farmer"; text: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          setUserInput(transcript);
          setIsListening(false);
          sendQuestion(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Call timer
  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startCall = () => {
    setCallState("connecting");
    setCallDuration(0);
    setConversation([]);

    setTimeout(() => {
      setCallState("connected");
      let greeting = "Welcome to Smart Krishi Kisan Helpline. I am your automated agricultural market advisor. Please ask about crop demand, supply, or market prices in Hyderabad, Guntur, or Warangal.";
      if (language === "te") {
        greeting = "స్మార్ట్ కృషి కిసాన్ హెల్ప్‌లైన్‌కు స్వాగతం. నేను మీ ఆటోమేటెడ్ వ్యవసాయ మార్కెట్ సలహాదారుని. మీకు కావలసిన పంట డిమాండ్ లేదా మార్కెట్ ధర గురించి అడగండి.";
      } else if (language === "hi") {
        greeting = "स्मार्ट कृषि किसान हेल्पलाइन में आपका स्वागत है. मैं आपका कृषि मार्केट सलाहकार हूं. कृपया अपनी फसल की मांग या मंडी भाव के बारे में पूछें.";
      }

      setConversation([
        {
          sender: "assistant",
          text: greeting,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speakText(greeting);
    }, 1500);
  };

  const endCall = () => {
    setCallState("ended");
    setIsListening(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current || callState !== "connected") return;
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

  const sendQuestion = async (queryToSend?: string) => {
    const q = queryToSend || userInput;
    if (!q.trim() || callState !== "connected") return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setConversation((prev) => [...prev, { sender: "farmer", text: q, time: userTime }]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: q, language, queryType: "helpline_call" }),
      });
      const data = await res.json();
      if (data.success && data.responseText) {
        const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setConversation((prev) => [
          ...prev,
          { sender: "assistant", text: data.responseText, time: replyTime },
        ]);
        speakText(data.responseText);
      }
    } catch {
      console.error("Helpline call query failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              Automated Telephony Demo
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Telephone Helpline Demonstration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Simulates a dedicated farmer toll-free helpline. Connects in-browser with automated voice prompts, speech recognition, and instant agricultural database advisory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton
            text="Simulated Telephone Helpline. Click Start Demo Call to initiate an interactive voice consultation."
            size="md"
          />
        </div>
      </div>

      {/* Prominent Telephony Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="font-semibold">
            ACADEMIC BROWSER-BASED SIMULATED TELEPHONE HELPLINE — No physical telephone lines or paid telephony gateway connected.
          </span>
        </div>
        <span className="font-mono text-[10px] bg-amber-200 px-2 py-0.5 rounded font-bold">
          1800-DEMO-KRISHI
        </span>
      </div>

      {/* Main Calling Device Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        {/* Call Status Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                callState === "connected"
                  ? "bg-emerald-500 animate-ping"
                  : callState === "connecting"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-slate-600"
              }`}
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Toll-Free Helpline Status
              </p>
              <h3 className="text-sm font-extrabold text-white">
                {callState === "connected"
                  ? `Call in Progress (${formatTimer(callDuration)})`
                  : callState === "connecting"
                  ? "Connecting to Mandi IVR..."
                  : callState === "ended"
                  ? "Call Completed"
                  : "Helpline Ready"}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {callState !== "connected" ? (
              <button
                onClick={startCall}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/50 transition-transform hover:scale-105"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Demo Call</span>
              </button>
            ) : (
              <button
                onClick={endCall}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-rose-900/50 transition-transform hover:scale-105"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Conversation Transcript Display */}
        <div className="bg-slate-950/80 rounded-2xl p-4 sm:p-6 min-h-[220px] max-h-[340px] overflow-y-auto space-y-3 text-xs border border-slate-800">
          {conversation.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
              <Radio className="w-8 h-8 text-slate-600" />
              <p className="text-xs">Click &quot;Start Demo Call&quot; to begin the simulated helpline conversation.</p>
            </div>
          ) : (
            conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 items-start ${
                  msg.sender === "farmer" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-white text-[11px] font-bold">
                    IVR
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] space-y-1 ${
                    msg.sender === "farmer"
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700"
                  }`}
                >
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right font-mono">{msg.time}</span>
                </div>
                {msg.sender === "farmer" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white text-[11px] font-bold">
                    👨‍🌾
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Call In-Progress Input Console */}
        {callState === "connected" && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-2xl transition-all ${
                  isListening
                    ? "bg-rose-600 text-white ring-4 ring-rose-400 animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak into microphone"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                placeholder="Speak or type crop query (e.g. 'What is the tomato demand in Hyderabad?')..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                className="flex-1 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium text-white placeholder-slate-500"
              />

              <button
                onClick={() => sendQuestion()}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>{loading ? "..." : "Send"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Question Buttons */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-slate-400 py-0.5">Quick Ask:</span>
              <button
                onClick={() => sendQuestion("Tomato demand in Hyderabad")}
                className="px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Tomato demand in Hyderabad
              </button>
              <button
                onClick={() => sendQuestion("Onion price in Kurnool")}
                className="px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Onion price in Kurnool
              </button>
              <button
                onClick={() => sendQuestion("Green chilli in Guntur")}
                className="px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Green chilli in Guntur
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
