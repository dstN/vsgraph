"use client";

// ═══════════════════════════════════════════════════════
// PersonenpotenzialChart.tsx – Grouped Bar Chart
//
// Zeigt das Personenpotenzial über die Jahre als
// gruppiertes Balkendiagramm mit einer Linie pro
// PMK-Bereich.
// ═══════════════════════════════════════════════════════

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getPmkColor, getPmkLabel } from "@/lib/constants";
import { formatNumber, formatPerCapita, formatPercent } from "@/lib/formatters";
import type { PmkDataset, ViewMode } from "@/types/pmk";
import { perCapita, violenceShare } from "@/lib/calculations";
import { POPULATION_BY_YEAR } from "@/lib/constants";
import "./personenpotenzial-chart.css";

const CustomTooltip = ({
  active,
  payload,
  label,
  viewMode,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number | null; fill: string }>;
  label?: string;
  viewMode: ViewMode;
}) => {
  if (!active || !payload?.length) return null;

  const formatValue = (v: number | null) => {
    if (v === null) return "–";
    switch (viewMode) {
      case "perCapita":
        return formatPerCapita(v);
      case "threatLevel":
        return formatPercent(v);
      default:
        return formatNumber(v);
    }
  };

  return (
    <div className="ppTooltip">
      <div className="ppTooltipYear">{label}</div>
      {payload
        .filter((p) => p.value !== null && p.value !== undefined)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
        .map((entry) => (
          <div key={entry.dataKey} className="ppTooltipRow">
            <span className="ppTooltipLabel">
              <span
                className="ppTooltipDot"
                style={{ backgroundColor: getPmkColor(entry.dataKey).light }}
              />
              {getPmkLabel(entry.dataKey)}
            </span>
            <span className="ppTooltipValue">{formatValue(entry.value)}</span>
          </div>
        ))}
    </div>
  );
};

interface PersonenpotenzialChartProps {
  data: PmkDataset;
  viewMode: ViewMode;
}

interface ChartPoint {
  label: string;
  [area: string]: string | number | null;
}

export default function PersonenpotenzialChart({
  data,
  viewMode,
}: PersonenpotenzialChartProps) {
  // ── Alle PMK-Bereiche im Dataset ───────────────────
  const areas = useMemo(() => {
    const set = new Set<string>();
    for (const entry of data) {
      set.add(entry.phaenomenbereich);
    }
    return [...set];
  }, [data]);

  // ── Datentransformation ────────────────────────────
  const chartData = useMemo<ChartPoint[]>(() => {
    const years = [...new Set(data.map((d) => d.jahr))].sort();

    return years.map((year) => {
      const point: ChartPoint = { label: String(year) };
      const pop = POPULATION_BY_YEAR[year];

      for (const area of areas) {
        const entry = data.find(
          (d) => d.jahr === year && d.phaenomenbereich === area
        );

        if (!entry) {
          point[area] = null;
          continue;
        }

        switch (viewMode) {
          case "absolute":
            point[area] = entry.personenpotenzial?.absolut_gesamt ?? null;
            break;
          case "perCapita":
            point[area] =
              pop && entry.personenpotenzial?.absolut_gesamt != null
                ? perCapita(entry.personenpotenzial.absolut_gesamt, pop)
                : null;
            break;
          case "threatLevel":
            point[area] =
              entry.personenpotenzial?.davon_gewaltorientiert != null &&
              entry.personenpotenzial?.absolut_gesamt != null
                ? violenceShare(
                    entry.personenpotenzial.davon_gewaltorientiert,
                    entry.personenpotenzial.absolut_gesamt
                  )
                : null;
            break;
        }
      }

      return point;
    });
  }, [data, areas, viewMode]);

  // ── Formatter für Y-Achse ──────────────

  const yAxisFormatter = (v: number) => {
    switch (viewMode) {
      case "perCapita":
        return `${v}`;
      case "threatLevel":
        return `${v}%`;
      default:
        return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);
    }
  };

  const yAxisLabels: Record<ViewMode, string> = {
    absolute: "Personen",
    perCapita: "pro 100.000 EW",
    threatLevel: "% gewaltorientiert",
  };

  return (
    <div className="ppChartContainer">
      <div className="ppChartHeader">
        <h3 className="ppChartTitle">Personenpotenzial im Zeitverlauf</h3>
        <p className="ppChartSubtitle">
          {yAxisLabels[viewMode]} · nach PMK-Bereich
        </p>
      </div>

      <div className="ppChartWrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              type="category"
              tick={{
                fill: "var(--color-text-secondary)",
                fontSize: 13,
              }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: "var(--color-text-secondary)",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={yAxisFormatter}
              width={52}
            />
            <Tooltip
              content={<CustomTooltip viewMode={viewMode} />}
              cursor={{
                stroke: "var(--color-border)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            {areas.map((area) => (
              <Line
                key={area}
                type="monotone"
                dataKey={area}
                name={getPmkLabel(area)}
                stroke={getPmkColor(area).light}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--color-bg-card)", stroke: getPmkColor(area).light }}
                activeDot={{ r: 6, strokeWidth: 0, fill: getPmkColor(area).light }}
                animationDuration={500}
                animationEasing="ease-out"
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legende */}
      <div className="ppLegend" aria-label="Legende">
        {areas.map((area) => (
          <div key={area} className="ppLegendItem">
            <span
              className="ppLegendDot"
              style={{ backgroundColor: getPmkColor(area).light }}
            />
            {getPmkLabel(area)}
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Daten für Personenpotenzial im Zeitverlauf</caption>
        <thead>
          <tr>
            <th>Jahr</th>
            {areas.map(area => <th key={area}>{getPmkLabel(area)}</th>)}
          </tr>
        </thead>
        <tbody>
          {chartData.map(row => (
            <tr key={row.label}>
              <td>{row.label}</td>
              {areas.map(area => <td key={area}>{row[area] ?? "-"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Kontextueller Hinweis zur Methodik */}
      <div className="ppNotesContainer" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="ppNote" role="note">
          <span className="ppNoteIcon" aria-hidden>ℹ</span>
          <span>
            <strong>Methodenbruch 2004/2005:</strong> Bis 2004 war das
            Personenpotenzial des Islamismus in der Ausländerkriminalität
            enthalten. Ab 2005 wird es separat ausgewiesen – daher der
            scheinbare Rückgang bei „Ausländisch&quot;.
          </span>
        </div>
        <div className="ppNote" role="note" style={{ marginTop: 0 }}>
          <span className="ppNoteIcon" aria-hidden>ℹ</span>
          <span>
            <strong>Datenlücke 2015:</strong> Für das Jahr 2015 konnte laut Verfassungsschutzbericht
            kein umfassendes Gesamt-Personenpotenzial für den Islamismus ausgewiesen werden.
          </span>
        </div>
        <div className="ppNote" role="note" style={{ marginTop: 0 }}>
          <span className="ppNoteIcon" aria-hidden>ℹ</span>
          <span>
            <strong>Neuer Phänomenbereich 2021:</strong> Ab April 2021 wurde der Bereich „Verfassungsschutzrelevante Delegitimierung des Staates“ eingeführt. Die Straftaten dieses Bereichs werden in der Statistik aber weiterhin unter „Nicht zuzuordnen“ erfasst, was den extremen Anstieg bei den Straftaten ab 2021 erklärt.
          </span>
        </div>
      </div>
    </div>
  );
}
