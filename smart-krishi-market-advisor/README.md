# SMART KRISHI MARKET ADVISOR
## Agricultural Demand and Supply Management System
**Academic B.Tech Final Year Capstone Demonstration Prototype**

---

### 1. Project Introduction
**Smart Krishi Market Advisor** is a web-based agricultural decision-support system designed to empower farmers with transparent market visibility. The system addresses seasonal price volatility and post-harvest distress sales by:
1. Forecasting regional crop demand and expected harvest arrivals across APMC mandis.
2. Mathematically calculating the **Supply Gap**:
   $$\text{Supply Gap} = \text{Expected Supply} - \text{Estimated Demand}$$
   - **Positive Gap (+)**: Potential Surplus (Risk of price drop; stagger harvest or shift mandi).
   - **Negative Gap (-)**: Potential Shortage (Strong seller advantage; firm pricing).
   - **Near-Zero Gap**: Balanced Market.
3. Providing a rule-based crop recommendation engine that identifies alternate mandis with higher net price realization over local markets.
4. Connecting farmers with verified wholesale food aggregators and bulk buyers via an algorithmic match-scoring engine.
5. Offering multi-modal accessibility:
   - Multilingual interface: **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.
   - Text-to-Speech (Read Aloud) on key cards.
   - Web Speech API voice interaction (Microphone input + text fallback).
   - Simulated Two-Way SMS inquiry module.
   - Simulated AI Telephone Helpline call interface.
   - Database-backed Farmer Callback Request management system with Admin oversight.

---

### 2. Ready-to-Use Demo Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Farmer** | Ramesh Reddy | `farmer@smartkrishi.in` | `Farmer@123` |
| **Buyer / Trader** | AgriFresh Foods Ltd | `buyer@smartkrishi.in` | `Buyer@123` |
| **Agronomist / Admin** | Dr. K. Srinivas | `admin@smartkrishi.in` | `Admin@123` |

*Note: One-click instant login buttons are also prominently provided on the Home and Login pages.*

---

### 3. Website Pages (20 Functional Pages)

1. `/` — Landing / Home Page with formula showcase, quick metrics, and demo switcher.
2. `/about` — System Architecture, layered tiers, mathematical models, and Java Spring Boot code inspector.
3. `/login` — User authentication with one-click demo account switcher.
4. `/register/farmer` — Farmer registration with farm acreage, soil type, irrigation, and primary crops.
5. `/register/buyer` — Trader registration with business type, monthly procurement target, and GST.
6. `/dashboard/farmer` — Farmer command center: active produce lots, market alerts, quick crop plan tracker.
7. `/dashboard/buyer` — Buyer procurement dashboard: active requirements, compatibility matches, farmer lots.
8. `/crops` — Agronomic crop intelligence directory (12 crops: Tomato, Onion, Chilli, Cotton, Paddy, Turmeric, etc.).
9. `/demand-supply` — Core module: formula calculations, Chart.js comparative volume bar chart, doughnut distribution, and filters.
10. `/recommendations` — Rule-based advisory engine evaluating demand-supply, MSP benchmarks, and alternate mandis.
11. `/market-prices` — Cross-mandi price comparison across 7 APMC yards with bar chart and sorting.
12. `/farmer/produce` — Farmer produce listing portal (Add, view, and delete produce lots).
13. `/buyer/requirements` — Buyer demand postings with smart algorithm-matching farmer produce.
14. `/voice-assistant` — Web Speech API voice assistant (Microphone STT + Text-to-Speech audio).
15. `/sms-demo` — Simulated two-way SMS interface with mobile frame and database transaction logs.
16. `/callback-request` — Farmer callback request submission portal and live queue tracker.
17. `/notifications` — Agricultural broadcasts, price spikes, surplus warnings, and buyer interest alerts.
18. `/admin/dashboard` — Administrative command center with callback request status manager and notes editor.
19. `/admin/users` — User management and role verification directory.
20. `/reports` — Comprehensive commodity balance sheet, APMC throughput matrix, and printable report view.
*Plus*: `/helpline-demo` — AI Telephone Helpline Calling Demonstration.

---

### 4. Technology Stack & Architecture

- **Fullstack Runtime**: Next.js 16 (App Router) + React 19 + TypeScript
- **Database & ORM**: PostgreSQL via Drizzle ORM
- **Styling & UI**: Tailwind CSS v4 + Lucide Icons + Responsive Grid
- **Data Visualizations**: Chart.js & React-Chartjs-2
- **Audio & Speech**: Browser Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **Backend Architecture Artifacts**: Complete Java 21 / Spring Boot 3 `pom.xml`, entity models, services, controllers, and MySQL schema script located in `java-backend-artifacts/`.

---

### 5. Academic Disclaimer & Limitations

- This project is an academic demonstration prototype designed for educational presentation.
- All agricultural market prices, arrivals, and demand figures are **illustrative sample demonstration data** clearly labeled as `SAMPLE DATA`.
- The voice assistant and text-to-speech rely on standard browser-supported Web Speech APIs without requiring paid AI services.
- SMS and telephone helpline modules are browser-based simulations designed to demonstrate rural workflows honestly without third-party telecommunication gateways.
