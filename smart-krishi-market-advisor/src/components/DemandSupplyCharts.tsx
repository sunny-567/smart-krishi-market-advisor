"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DemandSupplyRecord {
  cropName: string;
  marketName: string;
  demand: number;
  supply: number;
  gap: number;
  averagePrice: number;
  status: "surplus" | "shortage" | "balanced";
}

export function DemandSupplyBarChart({ records }: { records: DemandSupplyRecord[] }) {
  // Take top 8 records for readability
  const displayRecords = records.slice(0, 8);

  const data = {
    labels: displayRecords.map((r) => `${r.cropName} (${r.marketName.split(" ")[0]})`),
    datasets: [
      {
        label: "Estimated Demand (Tonnes)",
        data: displayRecords.map((r) => r.demand),
        backgroundColor: "rgba(59, 130, 246, 0.75)", // Blue
        borderColor: "rgb(37, 99, 235)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: "Expected Supply (Tonnes)",
        data: displayRecords.map((r) => r.supply),
        backgroundColor: "rgba(16, 185, 129, 0.75)", // Emerald
        borderColor: "rgb(5, 150, 105)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { family: "sans-serif", size: 12, weight: "bold" as const },
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context: any) {
            const index = context.dataIndex;
            const r = displayRecords[index];
            if (context.datasetIndex === 1) {
              const sign = r.gap > 0 ? "+" : "";
              return `Supply Gap: ${sign}${r.gap}t (${r.status.toUpperCase()})`;
            }
            return "";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Volume in Tonnes",
          font: { size: 11, weight: "bold" as const },
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={data} options={options} />
    </div>
  );
}

export function MarketStatusDoughnutChart({
  surplusCount,
  shortageCount,
  balancedCount,
}: {
  surplusCount: number;
  shortageCount: number;
  balancedCount: number;
}) {
  const data = {
    labels: ["Potential Surplus", "Potential Shortage", "Balanced Supply"],
    datasets: [
      {
        data: [surplusCount, shortageCount, balancedCount],
        backgroundColor: [
          "rgba(16, 185, 129, 0.85)", // Green for Surplus
          "rgba(244, 63, 94, 0.85)", // Red/Rose for Shortage
          "rgba(59, 130, 246, 0.85)", // Blue for Balanced
        ],
        borderColor: ["#059669", "#e11d48", "#2563eb"],
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 14,
          padding: 12,
          font: { size: 11 },
        },
      },
    },
    cutout: "68%",
  };

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function PriceComparisonBarChart({
  items,
}: {
  items: { cropName: string; marketName: string; price: number; msp: number }[];
}) {
  const displayItems = items.slice(0, 7);

  const data = {
    labels: displayItems.map((i) => `${i.cropName} - ${i.marketName.split(" ")[0]}`),
    datasets: [
      {
        label: "Market Price (₹/Quintal)",
        data: displayItems.map((i) => i.price),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 6,
      },
      {
        label: "Govt MSP Benchmark (₹/Quintal)",
        data: displayItems.map((i) => i.msp),
        backgroundColor: "rgba(245, 158, 11, 0.65)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Price in ₹ per Quintal",
        },
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={data} options={options} />
    </div>
  );
}
