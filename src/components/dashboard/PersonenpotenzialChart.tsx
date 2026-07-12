"use client";

// ═══════════════════════════════════════════════════════
// PersonenpotenzialChart.tsx – Grouped Bar Chart
//
// Zeigt das Personenpotenzial über die Jahre als
// gruppiertes Balkendiagramm mit einer Linie pro
// PMK-Bereich.
// ═══════════════════════════════════════════════════════

import { useMemo, useState } from "react";
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
import { formatNumber } from "@/lib/formatters";
import type { PmkDataset, ViewMode } from "@/types/pmk";
import "./personenpotenzial-chart.css";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number | null; fill: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  const formatValue = (v: number | null) => {
    if (v === null) return "–";
    return formatNumber(v);
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

const YEAR_MIN = 1999;
const YEAR_MAX = 2025;

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

  const [startYear, setStartYear] = useState<number>(YEAR_MIN);
  const [endYear, setEndYear] = useState<number>(YEAR_MAX);
  const [hiddenAreas, setHiddenAreas] = useState<Set<string>>(() => new Set());
  const [isRangeMoving, setIsRangeMoving] = useState<boolean>(false);

  const toggleAreaVisibility = (area: string) => {
    setHiddenAreas((prev) => {
      const next = new Set(prev);
      if (next.has(area)) {
        next.delete(area);
      } else {
        next.add(area);
      }
      return next;
    });
  };

  // ── Datentransformation ────────────────────────────
  const chartData = useMemo<ChartPoint[]>(() => {
    const years = Array.from(
      { length: YEAR_MAX - YEAR_MIN + 1 },
      (_, index) => YEAR_MIN + index
    );

    return years.map((year) => {
      const point: ChartPoint = { label: String(year) };

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
          case "violencePotential":
            point[area] = entry.personenpotenzial?.davon_gewaltorientiert ?? null;
            break;
        }
      }

      return point;
    });
  }, [data, areas, viewMode]);

  const filteredChartData = useMemo(
    () =>
      chartData.filter((point) => {
        const year = Number(point.label);
        return year >= startYear && year <= endYear;
      }),
    [chartData, startYear, endYear]
  );

  const visibleAreasList = useMemo(
    () => areas.filter((area) => !hiddenAreas.has(area)),
    [areas, hiddenAreas]
  );

  // ── Formatter für Y-Achse ──────────────

  const yAxisFormatter = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

  const yAxisLabels: Record<ViewMode, string> = {
    absolute: "Personenpotenzial",
    violencePotential: "Gewaltpotenzial",
  };

  const startPercent =
    ((startYear - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
  const endPercent = ((endYear - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;

  return (
    <div className="ppChartContainer" data-section-id="personenpotenzial-chart" data-section-ready="true">
      <div className="ppChartHeader">
        <h3 className="ppChartTitle">Personenpotenzial im Zeitverlauf</h3>
        <p className="ppChartSubtitle">
          {yAxisLabels[viewMode]} · nach PMK-Bereich
        </p>
        <div className="ppTimeframeControls" aria-label="Zeitraum auswählen">
          <div className="ppTimeframeLabels">
            <span>Zeitraum</span>
            <strong>
              {startYear} - {endYear}
            </strong>
          </div>
          <div className="ppDualRange" aria-label="Jahresbereich">
            <div className="ppDualRangeTrack" aria-hidden="true" />
            <div
              className="ppDualRangeFill"
              aria-hidden="true"
              style={{
                left: `${startPercent}%`,
                width: `${Math.max(endPercent - startPercent, 0)}%`,
              }}
            />
            <span
              className="ppDualRangeYear ppDualRangeYearStart"
              data-visible={isRangeMoving}
              style={{ left: `${startPercent}%` }}
            >
              {startYear}
            </span>
            <span
              className="ppDualRangeYear ppDualRangeYearEnd"
              data-visible={isRangeMoving}
              style={{ left: `${endPercent}%` }}
            >
              {endYear}
            </span>
            <input
              className="ppDualRangeInput ppDualRangeInputStart"
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              value={startYear}
              aria-label="Startjahr"
              onPointerDown={() => setIsRangeMoving(true)}
              onPointerUp={() => setIsRangeMoving(false)}
              onBlur={() => setIsRangeMoving(false)}
              onChange={(event) => {
                const next = Number(event.target.value);
                setStartYear(Math.min(next, endYear));
              }}
            />
            <input
              className="ppDualRangeInput ppDualRangeInputEnd"
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              value={endYear}
              aria-label="Endjahr"
              onPointerDown={() => setIsRangeMoving(true)}
              onPointerUp={() => setIsRangeMoving(false)}
              onBlur={() => setIsRangeMoving(false)}
              onChange={(event) => {
                const next = Number(event.target.value);
                setEndYear(Math.max(next, startYear));
              }}
            />
          </div>
        </div>
      </div>

      <div className="ppChartWrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredChartData}
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
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--color-border)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            {visibleAreasList.map((area) => (
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
          <button
            key={area}
            type="button"
            className="ppLegendItem"
            data-active={!hiddenAreas.has(area)}
            onClick={() => toggleAreaVisibility(area)}
            aria-pressed={!hiddenAreas.has(area)}
            title={`${getPmkLabel(area)} ein-/ausblenden`}
          >
            <span
              className="ppLegendDot"
              style={{ backgroundColor: getPmkColor(area).light }}
            />
            {getPmkLabel(area)}
          </button>
        ))}
      </div>

      {/* Screen Reader Only Table for Accessibility */}
      <div className="sr-only">
        <table>
          <caption>Daten für das Personenpotenzial-Diagramm</caption>
          <thead>
            <tr>
              <th scope="col">Jahr</th>
              {visibleAreasList.map((area) => (
                <th key={area} scope="col">
                  {getPmkLabel(area)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {visibleAreasList.map((area) => (
                  <td key={area}>{row[area] ?? "–"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
