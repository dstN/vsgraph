"use client";

// ═══════════════════════════════════════════════════════
// Personenpotenzial.tsx – Section 1 Container
//
// Orchestriert:
// - ViewSwitcher (Absolut / Pro Kopf / Bedrohungslage)
// - KPI-Cards Grid (eine Karte pro PMK-Bereich)
// - PersonenpotenzialChart (Grouped Bar Chart)
//
// Zeigt die Daten für das neueste Jahr im Dataset
// als KPIs, mit Trend-Vergleich zum Vorjahr.
// ═══════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PmkDataset, ViewMode } from "@/types/pmk";
import { POPULATION_BY_YEAR } from "@/lib/constants";
import { perCapita, violenceShare } from "@/lib/calculations";
import ViewSwitcher from "./ViewSwitcher";
import KpiCard from "./KpiCard";
import PersonenpotenzialChart from "./PersonenpotenzialChart";
import "./personenpotenzial.css";

interface PersonenpotenzialProps {
  data: PmkDataset;
}

export default function Personenpotenzial({ data }: PersonenpotenzialProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("absolute");

  // ── Neuestes und Vorjahr ermitteln ──────────────────
  const { latestYear, previousYear } = useMemo(() => {
    const years = [...new Set(data.map((d) => d.jahr))].sort((a, b) => b - a);
    return {
      latestYear: years[0] ?? 0,
      previousYear: years[1] ?? null,
    };
  }, [data]);

  // ── Alle PMK-Bereiche (für das neueste Jahr) ───────
  const areas = useMemo(() => {
    const set = new Set<string>();
    for (const entry of data) {
      if (entry.jahr === latestYear) {
        set.add(entry.phaenomenbereich);
      }
    }
    return [...set];
  }, [data, latestYear]);

  // ── KPI-Daten pro Bereich + ViewMode ───────────────
  const kpiData = useMemo(() => {
    return areas.map((area) => {
      const current = data.find(
        (d) => d.jahr === latestYear && d.phaenomenbereich === area
      );
      const previous = previousYear
        ? data.find(
            (d) => d.jahr === previousYear && d.phaenomenbereich === area
          )
        : null;

      const popCurrent = POPULATION_BY_YEAR[latestYear];
      const popPrevious = previousYear
        ? POPULATION_BY_YEAR[previousYear]
        : null;

      let value: number | null = null;
      let prevValue: number | null = null;

      switch (viewMode) {
        case "absolute":
          value = current?.personenpotenzial?.absolut_gesamt ?? null;
          prevValue = previous?.personenpotenzial?.absolut_gesamt ?? null;
          break;

        case "perCapita":
          value = current?.personenpotenzial?.absolut_gesamt != null && popCurrent != null
            ? perCapita(
                current.personenpotenzial.absolut_gesamt,
                popCurrent
              )
            : null;
          prevValue = previous?.personenpotenzial?.absolut_gesamt != null && popPrevious != null
            ? perCapita(
                previous.personenpotenzial.absolut_gesamt,
                popPrevious
              )
            : null;
          break;

        case "threatLevel":
          value =
            current?.personenpotenzial?.davon_gewaltorientiert != null
              ? violenceShare(
                  current.personenpotenzial.davon_gewaltorientiert,
                  current.personenpotenzial.absolut_gesamt ?? 1
                )
              : null;
          prevValue =
            previous?.personenpotenzial?.davon_gewaltorientiert != null
              ? violenceShare(
                  previous.personenpotenzial.davon_gewaltorientiert,
                  previous.personenpotenzial.absolut_gesamt ?? 1
                )
              : null;
          break;
      }

      return { area, value, prevValue };
    });
  }, [areas, data, latestYear, previousYear, viewMode]);

  return (
    <section className="ppSection" id="personenpotenzial">
      <div className="container">
        {/* Section Header */}
        <div className="ppSectionHeader">
          <h2 className="ppSectionTitle">Personenpotenzial {latestYear}</h2>
          <p className="ppSectionSubtitle">
            Wie viele Personen ordnen die Sicherheitsbehörden den
            einzelnen Extremismus-Bereichen zu?
          </p>
        </div>

        {/* View-Switcher */}
        <ViewSwitcher value={viewMode} onChange={setViewMode} />

        {/* KPI-Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            className="ppKpiGrid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {kpiData.map((kpi, index) => (
              <KpiCard
                key={`${kpi.area}-${viewMode}`}
                area={kpi.area}
                value={kpi.value}
                previousValue={kpi.prevValue}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bar Chart */}
        <div className="ppChartSection">
          <PersonenpotenzialChart data={data} viewMode={viewMode} />
        </div>
      </div>
    </section>
  );
}
