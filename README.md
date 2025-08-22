# VSGraph — Interactive Dashboard for German Intelligence Reports

**VSGraph** is a data-driven dashboard built with **Next.js**, **Liftkit**, and **Tremor** to analyze Germany’s annual domestic intelligence reports (_Verfassungsschutzberichte_, since 2000).  
It focuses on long-term trends in extremist crime (e.g., left- vs. right-wing motivated crimes) and aims for clarity, transparency, and reproducibility.

> Design philosophy: modern, accessible, **glassmorphism-inspired** UI (soft blur, subtle borders, gentle shadows) without heavy “material” vibes.

---

## ✨ Features

- **Data extraction pipeline** (PDF → structured data; WIP)
- **Clean JSON data model** optimized for time-series comparisons
- **Interactive charts** with **Tremor** (Line, Bar, Area, Donut, KPI cards)
- **Accessible UI** with **Liftkit** (buttons, selects, cards, dialogs, etc.)
- Ready to extend with **Nivo** later if we need exotic chart types

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** Liftkit (`@chainlift/liftkit` template/components)
- **Charts:** Tremor (primary), Recharts (fallback if needed)
- **Data:** JSON (upgradeable to a DB later), PDF parsing via Python (planned)
- **Language/Tooling:** TypeScript, ESLint, Prettier

---

## 🚀 Quickstart

```bash
# 1) Install deps
npm i

# 2) Run the app (Turbopack)
npm run dev

# 3) Build & start (production)
npm run build && npm start
```
