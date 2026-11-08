"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ReadAloudButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md";
  langOverride?: string;
}

export function ReadAloudButton({
  text,
  className = "",
  size = "sm",
  langOverride,
}: ReadAloudButtonProps) {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setIsSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!isSupported || typeof window === "undefined") return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text (remove markdown symbols or excessive spacing)
    const cleanedText = text
      .replace(/[#*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanedText) return;

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Map language
    const currentLang = langOverride || (language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-IN");
    utterance.lang = currentLang;
    utterance.rate = 0.95; // Slightly slower for clarity in rural and regional context
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={handleToggleSpeak}
      type="button"
      className={`inline-flex items-center gap-1.5 transition-all rounded-md font-medium ${
        isSpeaking
          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 animate-pulse"
          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
      } ${size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"} ${className}`}
      title={isSpeaking ? t.stopReading : t.readAloud}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 shrink-0" />
          <span>{t.stopReading}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          <span>{t.readAloud}</span>
        </>
      )}
    </button>
  );
}
