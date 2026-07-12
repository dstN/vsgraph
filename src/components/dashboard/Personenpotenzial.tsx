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

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect, useRef } from "react";
import type { PmkDataset, ViewMode } from "@/types/pmk";
import ViewSwitcher from "./ViewSwitcher";
import KpiCard from "./KpiCard";
import "./personenpotenzial.css";

function PersonenpotenzialChartPlaceholder() {
  return (
    <div className="ppChartContainer ppChartSkeleton" aria-busy="true">
      <div className="ppChartHeader">
        <h3 className="ppChartTitle">Personenpotenzial im Zeitverlauf</h3>
        <p className="ppChartSubtitle">Diagramm wird vorbereitet.</p>
        <div className="ppChartSkeletonTimeframe" aria-hidden="true">
          <span className="ppChartSkeletonTimeframeLabel" />
          <span className="ppChartSkeletonTimeframeRange" />
          <div className="ppChartSkeletonSlider">
            <span className="ppChartSkeletonSliderTrack" />
            <span className="ppChartSkeletonSliderFill" />
            <span className="ppChartSkeletonSliderThumb ppChartSkeletonSliderThumbStart" />
            <span className="ppChartSkeletonSliderThumb ppChartSkeletonSliderThumbEnd" />
          </div>
        </div>
      </div>
      <div className="ppChartSkeletonLegend" aria-hidden="true">
        <span className="ppChartSkeletonChip" />
        <span className="ppChartSkeletonChip" />
        <span className="ppChartSkeletonChip ppChartSkeletonChipWide" />
        <span className="ppChartSkeletonChip" />
        <span className="ppChartSkeletonChip" />
      </div>
      <div className="ppChartWrapper ppChartSkeletonPlot" aria-hidden="true">
        <span className="ppChartSkeletonAxis ppChartSkeletonAxisY" />
        <span className="ppChartSkeletonAxis ppChartSkeletonAxisX" />
        <span className="ppChartSkeletonLine ppChartSkeletonLineOne" />
        <span className="ppChartSkeletonLine ppChartSkeletonLineTwo" />
        <span className="ppChartSkeletonLine ppChartSkeletonLineThree" />
      </div>
      <div className="ppChartSkeletonNotes" aria-hidden="true">
        <span className="ppChartSkeletonNote ppChartSkeletonNoteLong" />
        <span className="ppChartSkeletonNote" />
        <span className="ppChartSkeletonNote ppChartSkeletonNoteLong" />
      </div>
    </div>
  );
}

const PersonenpotenzialChart = dynamic(() => import("./PersonenpotenzialChart"), {
  ssr: false,
  loading: () => <PersonenpotenzialChartPlaceholder />,
});

interface PersonenpotenzialProps {
  data: PmkDataset;
}

export default function Personenpotenzial({ data }: PersonenpotenzialProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("absolute");
  const [showChart, setShowChart] = useState(false);
  const chartMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showChart) return;
    const node = chartMountRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowChart(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showChart]);

  useEffect(() => {
    if (showChart) return;

    const warmupId = window.setTimeout(() => {
      setShowChart(true);
    }, 250);

    return () => window.clearTimeout(warmupId);
  }, [showChart]);

  useEffect(() => {
    const handlePrepareSection = (event: Event) => {
      const { targetId } = (event as CustomEvent<{ targetId?: string }>).detail ?? {};
      if (targetId === "delikt-vergleich" || targetId === "about") {
        setShowChart(true);
      }
    };

    window.addEventListener("vsgraph:prepare-section", handlePrepareSection);
    return () => window.removeEventListener("vsgraph:prepare-section", handlePrepareSection);
  }, []);

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

      let value: number | null = null;
      let prevValue: number | null = null;

      switch (viewMode) {
        case "absolute":
          value = current?.personenpotenzial?.absolut_gesamt ?? null;
          prevValue = previous?.personenpotenzial?.absolut_gesamt ?? null;
          break;

        case "violencePotential":
          value = current?.personenpotenzial?.davon_gewaltorientiert ?? null;
          prevValue = previous?.personenpotenzial?.davon_gewaltorientiert ?? null;
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
        <div key={viewMode} className="ppKpiGrid">
          {kpiData.map((kpi) => (
            <KpiCard
              key={`${kpi.area}-${viewMode}`}
              area={kpi.area}
              value={kpi.value}
              previousValue={kpi.prevValue}
            />
          ))}
        </div>

        {/* Bar Chart */}
        <div className="ppChartSection" ref={chartMountRef}>
          {showChart ? (
            <PersonenpotenzialChart data={data} viewMode={viewMode} />
          ) : (
            <PersonenpotenzialChartPlaceholder />
          )}
        </div>
      </div>
    </section>
  );
}
