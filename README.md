# VSGraph — Interactive Dashboard for German Intelligence Reports

**VSGraph** is a data-driven dashboard built with **Next.js, Liftkit, and Tremor** to analyze Germany’s annual domestic intelligence reports (Verfassungsschutzberichte, since 2000).  
It focuses on long-term trends in extremist crime (e.g., left- vs. right-wing motivated crimes) and aims for clarity, transparency, and reproducibility.

> Design philosophy: modern, accessible, **glassmorphism-inspired** UI (soft blur, subtle borders, gentle shadows) without heavy “material” vibes.

---

## ✨ Features

- **Data extraction pipeline** (PDF → structured data; WIP)
- **Clean JSON data model** optimized for time-series comparisons
- **Interactive charts** with **Tremor** (Line, Bar, Area, Donut, KPI cards)
- **Accessible UI** with **Liftkit** (filters, dialogs, tabs, select, etc.)
- Ready to extend with **Nivo** (only if we need exotic charts later)

---

## 🧱 Tech Stack

- **Framework:** Next.js
- **UI:** **@chainlift/liftkit**
- **Charts:** **Tremor** (fast to a polished dashboard)
- **Data:** JSON (upgradeable to a DB later), PDF parsing via Python (planned)
- **TypeScript**, ESLint, Prettier
