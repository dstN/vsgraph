// ═══════════════════════════════════════════════════════
// lib/calculations.ts – Berechnungs-Utilities
// ═══════════════════════════════════════════════════════

import type { PmkDataEntry, StraftatenKatalog } from "@/types/pmk";

/**
 * Berechnet den Per-Capita-Wert pro 100.000 Einwohner.
 *
 * @example
 * perCapita(50250, 83_497_000) → 60.18
 */
export function perCapita(value: number, population: number): number {
  if (population === 0) return 0;
  return Math.round(((value / population) * 100_000) * 100) / 100;
}

/**
 * Berechnet den prozentualen Anteil gewaltbereiter Personen.
 *
 * @example
 * violenceShare(15300, 50250) → 30.4
 */
export function violenceShare(
  violenceOriented: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round(((violenceOriented / total) * 100) * 10) / 10;
}

/**
 * Berechnet die Year-over-Year Veränderung in Prozent.
 *
 * @example
 * yoyChange(50250, 40600) → 23.8
 */
export function yoyChange(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

/**
 * Extrahiert den Wert eines bestimmten Delikts aus dem
 * verschachtelten StraftatenKatalog.
 *
 * Da Delikte dynamisch in gewalttaten ODER sonstige_straftaten
 * liegen können, wird in beiden Bereichen gesucht.
 * Sonderfall: "straftaten_insgesamt" liegt auf der Katalog-Ebene.
 *
 * @returns Den numerischen Wert oder null, wenn der Key nicht existiert.
 */
export function extractDeliktValue(
  katalog: StraftatenKatalog,
  deliktKey: string
): number | null {
  // Sonderfall: Gesamtsumme auf Katalog-Ebene
  if (deliktKey === "straftaten_insgesamt") {
    return katalog.straftaten_insgesamt ?? null;
  }

  // In gewalttaten suchen
  if (deliktKey in katalog.gewalttaten) {
    const val = katalog.gewalttaten[deliktKey];
    return val ?? null;
  }

  // In sonstige_straftaten suchen
  if (deliktKey in katalog.sonstige_straftaten) {
    const val = katalog.sonstige_straftaten[deliktKey];
    return val ?? null;
  }

  // Key existiert nicht in diesem Datensatz
  return null;
}

/**
 * Bestimmt, in welcher Kategorie ein Delikt-Key liegt.
 * Scannt den ersten Eintrag im Dataset, der den Key enthält.
 */
export function findDeliktCategory(
  data: PmkDataEntry[],
  deliktKey: string
): "gewalttaten" | "sonstige_straftaten" | "gesamt" {
  if (deliktKey === "straftaten_insgesamt") return "gesamt";

  for (const entry of data) {
    if (deliktKey in entry.straftaten_katalog.gewalttaten) {
      return "gewalttaten";
    }
    if (deliktKey in entry.straftaten_katalog.sonstige_straftaten) {
      return "sonstige_straftaten";
    }
  }

  return "gesamt";
}
