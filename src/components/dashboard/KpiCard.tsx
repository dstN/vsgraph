"use client";

// ═══════════════════════════════════════════════════════
// KpiCard.tsx – KPI-Karte pro PMK-Bereich
//
// Zeigt einen zentralen KPI-Wert mit:
// - Farbkodierung (PMK-Bereich)
// - Trend-Indikator (Pfeil hoch/runter + Prozent)
// - Subtitle/Beschreibung
// - Motion Animationen
// ═══════════════════════════════════════════════════════

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getPmkColor, getPmkLabel } from "@/lib/constants";
import { formatNumber, formatPercent, formatPerCapita } from "@/lib/formatters";
import type { ViewMode } from "@/types/pmk";
import "./kpi-card.css";

interface KpiCardProps {
  area: string;
  value: number | null;
  previousValue?: number | null;
  viewMode: ViewMode;
  index: number;
}

export default function KpiCard({
  area,
  value,
  previousValue,
  viewMode,
  index,
}: KpiCardProps) {
  // Trend berechnen
  const trend =
    value != null && previousValue != null && previousValue > 0
      ? Math.round(((value - previousValue) / previousValue) * 1000) / 10
      : null;

  const trendDirection =
    trend === null ? "stable" : trend > 0 ? "up" : trend < 0 ? "down" : "stable";

  // Formatierung abhängig vom ViewMode
  const formattedValue =
    value == null
      ? "–"
      : viewMode === "perCapita"
        ? formatPerCapita(value)
        : viewMode === "threatLevel"
          ? formatPercent(value)
          : formatNumber(value);

  // Einheit
  const unit =
    viewMode === "perCapita"
      ? "pro 100k"
      : viewMode === "threatLevel"
        ? ""
        : "Personen";

  const color = getPmkColor(area);

  return (
    <motion.article
      className="kpiCard"
      style={{ "--kpi-accent": color.light } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
    >
      {/* Farbbalken oben */}
      <div className="kpiCardAccent" />

      {/* Header mit Label */}
      <div className="kpiCardHeader">
        <span className="kpiCardDot" style={{ backgroundColor: color.light }} />
        <span className="kpiCardLabel">{getPmkLabel(area)}</span>
      </div>

      {/* KPI-Wert */}
      <div className="kpiCardValue">
        <motion.span
          key={`${area}-${value}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {formattedValue}
        </motion.span>
      </div>

      {/* Einheit */}
      {unit && <div className="kpiCardUnit">{unit}</div>}

      {/* Trend */}
      {trend !== null && (
        <div className={`kpiCardTrend kpiCardTrend--${trendDirection}`}>
          {trendDirection === "up" && <TrendingUp size={14} />}
          {trendDirection === "down" && <TrendingDown size={14} />}
          {trendDirection === "stable" && <Minus size={14} />}
          <span>{trend > 0 ? "+" : ""}{formatPercent(Math.abs(trend))}</span>
          <span className="kpiCardTrendLabel">ggü. Vorjahr</span>
        </div>
      )}

    </motion.article>
  );
}
