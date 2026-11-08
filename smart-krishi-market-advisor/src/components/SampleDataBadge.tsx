"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function SampleDataBadge({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs ${className}`}
      title="Academic demonstration record"
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span>{t.sampleDataNotice}</span>
    </div>
  );
}
