"use client";

// ═══════════════════════════════════════════════════════════
// DeliktVergleich.tsx – Kernkomponente (Highlight-Feature)
//
// Zeigt die zeitliche Entwicklung eines einzelnen Delikts
// über alle PMK-Bereiche hinweg als interaktiven Line-Chart.
//
// Features:
// - Dynamische Delikt-Key-Extraktion aus dem Dataset
// - snake_case → lesbares Deutsch via snakeCaseToLabel()
// - Gruppierte Filter-Pills (Gewalttaten / Sonstige)
// - Recharts LineChart mit Custom Tooltip
// - Null-Safety: fehlende Keys → unterbrochene Linie
// - Motion AnimatePresence für Übergänge
// ═══════════════════════════════════════════════════════════

import { useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

import type {
  PmkDataset,
  DeliktOption,
  DeliktCategory,
  ChartDataPoint,
} from "@/types/pmk";
import { getPmkColor, getPmkLabel, PMK_AREAS_ORDERED, DELIKT_NOTES } from "@/lib/constants";
import { extractDeliktValue } from "@/lib/calculations";
import { snakeCaseToLabel, formatNumber } from "@/lib/formatters";

import "./delikt-vergleich.css";

// ── Summen-Keys, die immer existieren ──────────────────
const SUMMARY_KEYS = new Set([
  "gesamt_gewalttaten",
  "gesamt_sonstige_straftaten",
  "straftaten_insgesamt",
]);

// ── Props ──────────────────────────────────────────────
interface DeliktVergleichProps {
  data: PmkDataset;
}

const YEAR_MIN = 1999;
const YEAR_MAX = 2025;

function normalizeSearchTerm(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .trim();
}

function getFuzzyScore(query: string, candidate: string): number {
  if (!query) return -1;

  const normalizedQuery = normalizeSearchTerm(query);
  const normalizedCandidate = normalizeSearchTerm(candidate);

  if (!normalizedQuery) return -1;

  if (normalizedCandidate.includes(normalizedQuery)) {
    return 1000 - (normalizedCandidate.length - normalizedQuery.length);
  }

  let queryIndex = 0;
  let score = 0;
  let lastMatchIndex = -2;

  for (let i = 0; i < normalizedCandidate.length; i++) {
    if (normalizedCandidate[i] === normalizedQuery[queryIndex]) {
      score += i === lastMatchIndex + 1 ? 4 : 1;
      lastMatchIndex = i;
      queryIndex += 1;
      if (queryIndex === normalizedQuery.length) {
        break;
      }
    }
  }

  if (queryIndex !== normalizedQuery.length) {
    return -1;
  }

  return score;
}

function findBestDeliktMatch(
  query: string,
  options: DeliktOption[]
): DeliktOption | null {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return null;

  let best: DeliktOption | null = null;
  let bestScore = -1;

  for (const option of options) {
    const score = Math.max(
      getFuzzyScore(trimmedQuery, option.label),
      getFuzzyScore(trimmedQuery, option.key)
    );

    if (score > bestScore) {
      bestScore = score;
      best = option;
    }
  }

  return bestScore >= 0 ? best : null;
}

// ═══════════════════════════════════════════════════════
// Tooltip-Komponente
// ═══════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number | null; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="tooltip">
      <div className="tooltipYear">{label}</div>
      {payload
        .filter((p) => p.value !== null && p.value !== undefined)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
        .map((entry) => (
          <div key={entry.dataKey} className="tooltipRow">
            <span className="tooltipLabel">
              <span
                className="tooltipDot"
                style={{ backgroundColor: entry.color }}
              />
              {getPmkLabel(entry.dataKey)}
            </span>
            <span className="tooltipValue">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// Haupt-Komponente
// ═══════════════════════════════════════════════════════

export default function DeliktVergleich({ data }: DeliktVergleichProps) {
  // ── 1. Dynamische Delikt-Key-Extraktion ──────────────
  // Scannt ALLE Einträge im Dataset, sammelt unique Keys
  // aus gewalttaten und sonstige_straftaten, formatiert
  // sie für die UI und gruppiert nach Kategorie.
  const deliktOptions = useMemo<DeliktOption[]>(() => {
    const gewaltKeys = new Set<string>();
    const sonstigeKeys = new Set<string>();

    for (const entry of data) {
      const { gewalttaten, sonstige_straftaten } = entry.straftaten_katalog;

      for (const key of Object.keys(gewalttaten)) {
        gewaltKeys.add(key);
      }
      for (const key of Object.keys(sonstige_straftaten)) {
        sonstigeKeys.add(key);
      }
    }

    const ORDER_GEWALT = [
      "toetungen",
      "versuchte_toetungen",
      "koerperverletzungen",
      "brandstiftungen",
      "herbeifuehren_einer_sprengstoffexplosion",
      "landfriedensbruch",
      "gefaehrliche_eingriffe_in_bahn_luft_schiffs_und_strassenverkehr",
      "gefaehrliche_eingriffe_verkehr",
      "freiheitsberaubung",
      "raub",
      "erpressung",
      "raub_erpressungen",
      "widerstandsdelikte",
      "sexualdelikte",
      "andere_gewalttaten",
    ];

    const ORDER_SONSTIGE = [
      "sachbeschaedigungen",
      "noetigung_bedrohung",
      "propagandadelikte",
      "stoerung_der_totenruhe",
      "andere_straftaten",
      "vorbereitung_einer_staatsgefaehrdenden_gewalttat",
      "mitgliedschaft_bzw_unterstuetzung_einer_auslaendischen_terroristischen_vereinigung",
      "verstoesse_gegen_das_versammlungsgesetz",
      "verstoesse_gegen_das_vereinsgesetz",
    ];

    const buildOptions = (
      keys: Set<string>,
      category: DeliktCategory,
      orderArray: string[]
    ): DeliktOption[] => {
      const singles: DeliktOption[] = [];
      const summaries: DeliktOption[] = [];

      for (const key of keys) {
        const isSummary = SUMMARY_KEYS.has(key);
        const option: DeliktOption = {
          key,
          label: snakeCaseToLabel(key),
          category,
          isSummary,
        };
        if (isSummary) {
          summaries.push(option);
        } else {
          singles.push(option);
        }
      }

      // PDFs Reihenfolge zuerst, Rest alphabetisch
      singles.sort((a, b) => {
        const idxA = orderArray.indexOf(a.key);
        const idxB = orderArray.indexOf(b.key);
        
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.label.localeCompare(b.label, "de");
      });

      return [...summaries, ...singles];
    };

    return [
      {
        key: "straftaten_insgesamt",
        label: snakeCaseToLabel("straftaten_insgesamt"),
        category: "gesamt" as DeliktCategory,
        isSummary: true,
      },
      ...buildOptions(gewaltKeys, "gewalttaten", ORDER_GEWALT),
      ...buildOptions(sonstigeKeys, "sonstige_straftaten", ORDER_SONSTIGE),
    ];
  }, [data]);

  // ── 2. State: Ausgewähltes Delikt ────────────────────
  // Default: "straftaten_insgesamt" (Gesamt ganz oben)
  const [selectedDelikt, setSelectedDelikt] = useState<string>(() => {
    return deliktOptions[0]?.key ?? "straftaten_insgesamt";
  });
  const [gewaltSearch, setGewaltSearch] = useState<string>("");
  const [sonstigeSearch, setSonstigeSearch] = useState<string>("");
  const [startYear, setStartYear] = useState<number>(YEAR_MIN);
  const [endYear, setEndYear] = useState<number>(YEAR_MAX);
  const [isRangeMoving, setIsRangeMoving] = useState<boolean>(false);

  // Aktuelles Label für Anzeige
  const selectedLabel = useMemo(
    () =>
      deliktOptions.find((o) => o.key === selectedDelikt)?.label ??
      selectedDelikt,
    [deliktOptions, selectedDelikt]
  );

  // ── 3. Datentransformation für Recharts ──────────────
  // Gruppiert Einträge nach Jahr, extrahiert den Wert
  // des gewählten Delikts pro PMK-Bereich.
  const chartData = useMemo<ChartDataPoint[]>(() => {
    // Alle Jahre von 1999 bis 2025 abdecken, auch wenn Daten fehlen
    const years = Array.from(
      { length: YEAR_MAX - YEAR_MIN + 1 },
      (_, index) => YEAR_MIN + index
    );

    // Alle PMK-Bereiche, die im Dataset tatsächlich vorkommen
    const areas = [
      ...new Set(data.map((d) => d.phaenomenbereich)),
    ].sort((a, b) => {
      const idxA = PMK_AREAS_ORDERED.indexOf(a as (typeof PMK_AREAS_ORDERED)[number]);
      const idxB = PMK_AREAS_ORDERED.indexOf(b as (typeof PMK_AREAS_ORDERED)[number]);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    return years.map((year) => {
      const point: ChartDataPoint = { label: String(year) };

      for (const area of areas) {
        const entry = data.find(
          (d) => d.jahr === year && d.phaenomenbereich === area
        );

        if (entry) {
          point[area] = extractDeliktValue(
            entry.straftaten_katalog,
            selectedDelikt
          );
        } else {
          point[area] = null;
        }
      }

      return point;
    });
  }, [data, selectedDelikt]);

  // ── 4. PMK-Bereiche für die Linien ───────────────────
  const activeAreas = useMemo(() => {
    const areas = new Set<string>();
    for (const entry of data) {
      areas.add(entry.phaenomenbereich);
    }
    // "Delegitimierung des Staates" ausblenden, da Straftaten weiterhin
    // in "Nicht zuzuordnen" geführt werden
    return PMK_AREAS_ORDERED.filter(
      (a) => areas.has(a) && a !== "Delegitimierung des Staates"
    );
  }, [data]);

  const [hiddenAreas, setHiddenAreas] = useState<Set<string>>(() => new Set());

  const visibleAreasList = useMemo(
    () => activeAreas.filter((area) => !hiddenAreas.has(area)),
    [activeAreas, hiddenAreas]
  );

  const filteredChartData = useMemo(
    () =>
      chartData.filter((point) => {
        const year = Number(point.label);
        return year >= startYear && year <= endYear;
      }),
    [chartData, startYear, endYear]
  );

  // ── 5. Pill-Klick-Handler ────────────────────────────
  const handlePillClick = useCallback((key: string) => {
    setSelectedDelikt(key);
  }, []);

  const handleLegendClick = useCallback((area: string) => {
    setHiddenAreas((prev) => {
      const next = new Set(prev);
      if (next.has(area)) {
        next.delete(area);
      } else {
        next.add(area);
      }
      return next;
    });
  }, []);

  // ── 6. Gruppierte Options für die Pills ──────────────
  const groupedOptions = useMemo(() => {
    const groups: Record<DeliktCategory, DeliktOption[]> = {
      gesamt: [],
      gewalttaten: [],
      sonstige_straftaten: [],
    };

    for (const option of deliktOptions) {
      groups[option.category].push(option);
    }

    return groups;
  }, [deliktOptions]);

  const gesamtOptions = groupedOptions.gesamt;
  const gewaltSummary = groupedOptions.gewalttaten.find((o) => o.isSummary);
  const gewaltDetails = groupedOptions.gewalttaten.filter((o) => !o.isSummary);
  const sonstigeSummary = groupedOptions.sonstige_straftaten.find((o) => o.isSummary);
  const sonstigeDetails = groupedOptions.sonstige_straftaten.filter(
    (o) => !o.isSummary
  );

  const selectedGewaltDetail =
    gewaltDetails.find((o) => o.key === selectedDelikt) ?? null;
  const selectedSonstigeDetail =
    sonstigeDetails.find((o) => o.key === selectedDelikt) ?? null;

  // (Tooltip wurde nach außerhalb der Komponente verschoben)

  // ── Render ───────────────────────────────────────────
  const startPercent =
    ((startYear - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
  const endPercent = ((endYear - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;

  return (
    <section className="section" id="delikt-vergleich">
      <div className="container">
        {/* Header */}
        <div className="sectionHeader">
          <h2 className="sectionTitle">Delikt-Vergleich</h2>
          <p className="sectionSubtitle">
            Wählen Sie eine Deliktart aus, um zu sehen, wie sich diese über
            die Jahre in den verschiedenen PMK-Bereichen entwickelt hat.
          </p>
        </div>

        {/* Filter-Pills: gruppiert nach Kategorie */}
        <div className="filterArea" aria-label="Deliktart auswählen">
          <div>
            <div className="filterGroupLabel">Gesamtwerte</div>
            <div className="pillGroup pillGroupCompact">
              {gesamtOptions.map((option) => (
                <button
                  key={option.key}
                  className="pill pillSummary"
                  data-active={selectedDelikt === option.key}
                  onClick={() => handlePillClick(option.key)}
                  title={option.label}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="filterGroupLabel">Gewalttaten</div>
            <div className="pillGroup pillGroupCompact">
              {gewaltSummary && (
                <button
                  className="pill pillSummary"
                  data-active={selectedDelikt === gewaltSummary.key}
                  onClick={() => {
                    handlePillClick(gewaltSummary.key);
                    setGewaltSearch("");
                  }}
                  title={gewaltSummary.label}
                >
                  {gewaltSummary.label}
                </button>
              )}
              <input
                className={`pill pillSearchInput ${selectedGewaltDetail ? "pillSearchInputActive" : ""}`}
                type="search"
                list="gewalttaten-detail-options"
                placeholder="Delikt suchen..."
                value={gewaltSearch}
                onChange={(event) => {
                  const next = event.target.value;
                  setGewaltSearch(next);
                  const match = findBestDeliktMatch(next, gewaltDetails);
                  if (match) {
                    setSelectedDelikt(match.key);
                  }
                }}
                aria-label="Gewaltdelikt suchen"
              />
              <datalist id="gewalttaten-detail-options">
                {gewaltDetails.map((option) => (
                  <option key={option.key} value={option.label} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <div className="filterGroupLabel">Sonstige Straftaten</div>
            <div className="pillGroup pillGroupCompact">
              {sonstigeSummary && (
                <button
                  className="pill pillSummary"
                  data-active={selectedDelikt === sonstigeSummary.key}
                  onClick={() => {
                    handlePillClick(sonstigeSummary.key);
                    setSonstigeSearch("");
                  }}
                  title={sonstigeSummary.label}
                >
                  {sonstigeSummary.label}
                </button>
              )}
              <input
                className={`pill pillSearchInput ${selectedSonstigeDetail ? "pillSearchInputActive" : ""}`}
                type="search"
                list="sonstige-detail-options"
                placeholder="Delikt suchen..."
                value={sonstigeSearch}
                onChange={(event) => {
                  const next = event.target.value;
                  setSonstigeSearch(next);
                  const match = findBestDeliktMatch(next, sonstigeDetails);
                  if (match) {
                    setSelectedDelikt(match.key);
                  }
                }}
                aria-label="Sonstige Straftat suchen"
              />
              <datalist id="sonstige-detail-options">
                {sonstigeDetails.map((option) => (
                  <option key={option.key} value={option.label} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div key={selectedDelikt} className="chartContainer">
            <h3 className="chartTitle">{selectedLabel}</h3>
            <p className="chartSubtitle">
              Zeitliche Entwicklung nach PMK-Bereich, absolute Fallzahlen
            </p>
            <div className="timeframeControls" aria-label="Zeitraum auswählen">
              <div className="timeframeLabels">
                <span>Zeitraum</span>
                <strong>
                  {startYear} - {endYear}
                </strong>
              </div>
              <div className="timeframeDualRange" aria-label="Jahresbereich">
                <div className="timeframeDualRangeTrack" aria-hidden="true" />
                <div
                  className="timeframeDualRangeFill"
                  aria-hidden="true"
                  style={{
                    left: `${startPercent}%`,
                    width: `${Math.max(endPercent - startPercent, 0)}%`,
                  }}
                />
                <span
                  className="timeframeDualRangeYear timeframeDualRangeYearStart"
                  data-visible={isRangeMoving}
                  style={{ left: `${startPercent}%` }}
                >
                  {startYear}
                </span>
                <span
                  className="timeframeDualRangeYear timeframeDualRangeYearEnd"
                  data-visible={isRangeMoving}
                  style={{ left: `${endPercent}%` }}
                >
                  {endYear}
                </span>
                <input
                  className="timeframeDualRangeInput timeframeDualRangeInputStart"
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
                  className="timeframeDualRangeInput timeframeDualRangeInputEnd"
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

            {filteredChartData.length > 0 ? (
              <>
                <div className="chartWrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredChartData}
                      margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                        opacity={0.5}
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
                        tickFormatter={(v: number) =>
                          v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                        }
                        width={52}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          stroke: "var(--color-border-hover)",
                          strokeWidth: 1,
                        }}
                      />
                      {visibleAreasList.map((area) => (
                        <Line
                          key={area}
                          type="monotone"
                          dataKey={area}
                          name={getPmkLabel(area)}
                          stroke={getPmkColor(area).light}
                          strokeWidth={2.5}
                          dot={{
                            r: 4,
                            fill: getPmkColor(area).light,
                            strokeWidth: 0,
                          }}
                          activeDot={{
                            r: 6,
                            fill: getPmkColor(area).light,
                            strokeWidth: 2,
                            stroke: "var(--color-bg-card)",
                          }}
                          connectNulls={false}
                          animationDuration={500}
                          animationEasing="ease-out"
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Legende */}
                <div className="legend" aria-label="Legende">
                  {activeAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      className="legendItem"
                      data-active={!hiddenAreas.has(area)}
                      onClick={() => handleLegendClick(area)}
                      aria-pressed={!hiddenAreas.has(area)}
                      title={`${getPmkLabel(area)} ein-/ausblenden`}
                    >
                      <span
                        className="legendDot"
                        style={{
                          backgroundColor: getPmkColor(area).light,
                        }}
                      />
                      {getPmkLabel(area)}
                    </button>
                  ))}
                </div>

                {/* Kontextueller Hinweis (z.B. "Seit 2001 getrennt erfasst") */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "var(--space-4)" }}>
                  {DELIKT_NOTES[selectedDelikt] && (
                    <div className="chartNote" role="note" style={{ marginTop: 0 }}>
                      <span className="chartNoteIcon" aria-hidden>ℹ</span>
                      {DELIKT_NOTES[selectedDelikt]}
                    </div>
                  )}
                  
                  <div className="chartNote" role="note" style={{ marginTop: 0 }}>
                    <span className="chartNoteIcon" aria-hidden>ℹ</span>
                    <span>
                      <strong>Methodenbruch 2017:</strong> Der Bereich „Politisch motivierte 
                      Ausländerkriminalität“ wurde in „religiöse Ideologie“ und 
                      „ausländische Ideologie“ ausdifferenziert. Die direkte Vergleichbarkeit 
                      der Fallzahlen 2017 mit den Vorjahren ist daher nicht mehr gegeben.
                    </span>
                  </div>

                  <div className="chartNote" role="note" style={{ marginTop: 0 }}>
                    <span className="chartNoteIcon" aria-hidden>ℹ</span>
                    <span>
                      <strong>Hinweis ab 2021:</strong> Straftaten aus dem neuen Bereich „Delegitimierung des Staates“ werden in der offiziellen PMK-Statistik unter „Nicht zuzuordnen“ erfasst.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="emptyState">
                <BarChart3 className="emptyStateIcon" size={48} />
                <span>Keine Daten für dieses Delikt vorhanden.</span>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
