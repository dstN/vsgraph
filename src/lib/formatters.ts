// ═══════════════════════════════════════════════════════
// lib/formatters.ts – String- & Zahlen-Formatierung
// ═══════════════════════════════════════════════════════

import { DELIKT_LABEL_OVERRIDES } from "./constants";

/**
 * Konvertiert einen snake_case Delikt-Key in ein menschenlesbares
 * deutsches Label für die UI.
 *
 * Strategie:
 * 1. Prüfe Override-Map für Sonderfälle (Umlaute, Abkürzungen)
 * 2. Automatische Konvertierung:
 *    - Unterstriche → Leerzeichen
 *    - Jedes Wort kapitalisieren
 *    - Umlaut-Mapping: ae→ä, oe→ö, ue→ü
 *
 * @example
 * snakeCaseToLabel("koerperverletzungen")    → "Körperverletzungen"  (via Override)
 * snakeCaseToLabel("brandstiftungen")        → "Brandstiftungen"     (automatisch)
 * snakeCaseToLabel("versuchte_toetungsdelikte") → "Versuchte Tötungsdelikte" (auto + Umlaut)
 */
export function snakeCaseToLabel(key: string): string {
  // 1. Override-Map prüfen
  if (DELIKT_LABEL_OVERRIDES[key]) {
    return DELIKT_LABEL_OVERRIDES[key];
  }

  // 2. Automatische Konvertierung
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/oe/g, "ö")
    .replace(/ue/g, "ü")
    .replace(/ae/g, "ä");
}

/**
 * Formatiert eine Zahl im deutschen Locale (Punkt als Tausender-Separator).
 * @example formatNumber(41000)  → "41.000"
 * @example formatNumber(1281)   → "1.281"
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "–";
  return value.toLocaleString("de-DE");
}

/**
 * Formatiert einen Per-Capita-Wert (pro 100.000 Einwohner).
 * @example formatPerCapita(60.18) → "60,18"
 */
export function formatPerCapita(value: number | null | undefined): string {
  if (value == null) return "–";
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

/**
 * Formatiert einen Prozentwert.
 * @example formatPercent(30.45) → "30,5 %"
 */
export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "–";
  return `${value.toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}
