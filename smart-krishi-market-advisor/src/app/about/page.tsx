"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  ShieldCheck,
  Layers,
  Database,
  Cpu,
  Code2,
  FileCode,
  CheckCircle2,
  BookOpen,
  Award,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "algorithms" | "java_code">("overview");

  const aboutText = `Smart Krishi Market Advisor is an Agricultural Demand and Supply Management Decision Support System designed as an academic demonstration prototype. It provides farmers and traders with crop intelligence, supply gap calculation, price discovery, and rule-based planning recommendations.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Academic Project Documentation
            </span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            About Smart Krishi Market Advisor
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Agricultural Demand & Supply Intelligence and Decision-Support System developed for B.Tech academic evaluation and demonstration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton text={aboutText} size="md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-sm font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Project Overview & Objectives
        </button>
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "architecture"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          System Architecture & Layers
        </button>
        <button
          onClick={() => setActiveTab("algorithms")}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "algorithms"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Mathematical Models & Rules
        </button>
        <button
          onClick={() => setActiveTab("java_code")}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "java_code"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Java 21 & Spring Boot Artifacts
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Project Background & Problem Statement</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In Indian agriculture, uncoordinated planting patterns frequently cause cyclical supply gluts and shortages. Farmers often harvest identical perishable crops simultaneously without visibility into regional market demand. This results in drastic post-harvest price collapse (distress sales) in one mandi while an adjacent district experiences severe shortages and high consumer prices.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Smart Krishi Market Advisor</strong> solves this information asymmetry by aggregating expected supply and estimated demand across regional APMC mandis (Hyderabad, Guntur, Warangal, Kurnool, Vijayawada, Nizamabad, Khammam), computing supply gaps, and generating rule-based recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1">Farmer Empowerment</h4>
                <p className="text-emerald-800">
                  Pre-harvest alerts on potential market surplus, alternate mandi suggestions with higher prices, and direct produce listings to wholesale buyers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">Buyer Procurement</h4>
                <p className="text-blue-800">
                  Aggregators and food processors post bulk crop requirements and discover matching farmer listings sorted by quality grade and location.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-1">Administrative Oversight</h4>
                <p className="text-purple-800">
                  Agricultural marketing officers track regional shortage risks, oversee APMC price disparities, and manage farmer callback requests.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Key Academic Demonstration Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>20 Connected Pages:</strong> Landing, Dashboards, Analysis, Prices, Directory, Listings, etc.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Three Distinct User Roles:</strong> Farmer, Buyer, and Admin with role-based UI.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Interactive Chart.js Visualizations:</strong> Demand vs Supply bar charts, surplus/shortage doughnuts.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Multilingual Switcher:</strong> Instant switching between English, Telugu, and Hindi.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Web Speech API:</strong> Speech-to-text input and text-to-speech audio feedback.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Simulated SMS & Helpline Calling:</strong> Honest in-browser and database simulations without paid APIs.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Architecture */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Layered Enterprise Architecture</span>
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                The system follows strict separation of concerns across presentation, business logic, data access, and persistence tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">Layer 1</span>
                <h4 className="font-bold text-slate-800 text-sm">Controller Tier</h4>
                <p className="text-slate-600 text-[11px]">
                  Handles HTTP routing, parameter extraction, role validation, and JSON / view rendering.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">Layer 2</span>
                <h4 className="font-bold text-slate-800 text-sm">Service Tier</h4>
                <p className="text-slate-600 text-[11px]">
                  Executes business rules, supply gap classification, recommendation heuristics, and NLP entity parsing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">Layer 3</span>
                <h4 className="font-bold text-slate-800 text-sm">Repository Tier</h4>
                <p className="text-slate-600 text-[11px]">
                  Manages database transactions, filtered queries, joins, and aggregates via ORM query builders.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">Layer 4</span>
                <h4 className="font-bold text-slate-800 text-sm">Entity / DTO Tier</h4>
                <p className="text-slate-600 text-[11px]">
                  Defines typed models (Users, Crops, Markets, Estimates, Listings, Callbacks) with integrity constraints.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-700">Layer 5</span>
                <h4 className="font-bold text-slate-800 text-sm">Database Tier</h4>
                <p className="text-slate-600 text-[11px]">
                  Relational PostgreSQL / MySQL engine with foreign keys, cascading deletes, and indexed search columns.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Mathematical Models */}
      {activeTab === "algorithms" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <span>Core Algorithms & Decision Logic</span>
            </h3>

            {/* Algorithm 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Model 1: Supply Gap Classification
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Formula: Supply Gap = Expected Supply (Tonnes) - Estimated Demand (Tonnes)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Let <code>E_s</code> be the expected harvest arrivals and <code>D_e</code> be the consumer and processing demand.
                <br />
                • If <code>(E_s - D_e) &gt; max(25, 0.05 * D_e)</code> → <strong>Potential Surplus</strong> (High risk of price drop).
                <br />
                • If <code>(E_s - D_e) &lt; -max(25, 0.05 * D_e)</code> → <strong>Potential Shortage</strong> (Firm price discovery).
                <br />
                • Else → <strong>Balanced Market</strong>.
              </p>
            </div>

            {/* Algorithm 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Model 2: Rule-Based Recommendation Heuristics
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Cross-Market Price Arbitrage & Alternate Mandi Search
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a surplus is detected in Mandi A, the engine scans all monitored mandis for the same crop. If Mandi B has a price higher by at least ₹200/quintal after accounting for freight costs (heuristically modeled at ≤ 60% of price difference), it triggers the verdict: <code>ALTERNATE_MARKET_RECOMMENDED</code> with explicit transportation gain calculations.
              </p>
            </div>

            {/* Algorithm 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                Model 3: Buyer-Farmer Match Scoring
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Multi-Factor Proximity and Price Compatibility Index
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Score = 50 (Same Crop) + 25 (Same Market Hub) + 20 (Listing Price ≤ Buyer Target Price) + 5 (Sufficient Quantity Ratio).
                Matches are sorted in descending order of score, giving procurement teams instantaneous visibility of optimal farm lots.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Java Code & Spring Boot */}
      {activeTab === "java_code" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  <span>Java 21 / Spring Boot 3 & MySQL Project Artifacts</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  For college examiners reviewing the Java backend structure, below is the complete Spring Boot architecture specification and Maven setup.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200">
                Spring Boot 3.3 / Java 21
              </span>
            </div>

            {/* Code Snippet 1: pom.xml */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Maven pom.xml Dependencies Specification:</span>
                <span className="font-mono text-slate-400">pom.xml</span>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
    </parent>
    <groupId>in.smartkrishi</groupId>
    <artifactId>market-advisor</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>Smart Krishi Market Advisor</name>
    <description>Agricultural Demand and Supply Management System</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
    </dependencies>
</project>`}
              </pre>
            </div>

            {/* Code Snippet 2: RecommendationService.java */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Core Business Logic Service (Java 21):</span>
                <span className="font-mono text-slate-400">DemandSupplyService.java</span>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`package in.smartkrishi.marketadvisor.service;

import in.smartkrishi.marketadvisor.dto.DemandSupplySummaryDTO;
import in.smartkrishi.marketadvisor.entity.DemandSupplyEstimate;
import in.smartkrishi.marketadvisor.repository.DemandSupplyRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class DemandSupplyService {

    private final DemandSupplyRepository estimateRepository;

    public DemandSupplyService(DemandSupplyRepository estimateRepository) {
        this.estimateRepository = estimateRepository;
    }

    public DemandSupplySummaryDTO calculateMarketGap(Long cropId, Long marketId) {
        DemandSupplyEstimate record = estimateRepository.findByCropIdAndMarketId(cropId, marketId)
                .orElseThrow(() -> new IllegalArgumentException("No data found for selected crop and market"));

        BigDecimal demand = record.getEstimatedDemandTonnes();
        BigDecimal supply = record.getExpectedSupplyTonnes();
        BigDecimal gap = supply.subtract(demand);

        String status = "BALANCED";
        BigDecimal threshold = demand.multiply(BigDecimal.valueOf(0.05)).max(BigDecimal.valueOf(25));

        if (gap.compareTo(threshold) > 0) {
            status = "POTENTIAL_SURPLUS";
        } else if (gap.compareTo(threshold.negate()) < 0) {
            status = "POTENTIAL_SHORTAGE";
        }

        return new DemandSupplySummaryDTO(record.getCrop().getName(), record.getMarket().getName(),
                demand, supply, gap, status, record.getAveragePricePerQuintal());
    }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
