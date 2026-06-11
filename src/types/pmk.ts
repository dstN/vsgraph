// ═══════════════════════════════════════════════════════
// types/pmk.ts – Daten-Schema für das VSGraph Dashboard
// ═══════════════════════════════════════════════════════

// ── Phänomenbereiche ──────────────────────────────────
// NICHT als feste Union definiert, da die Bezeichnungen
// sich über die Jahrzehnte ändern. Beispiele:
//   - "PMK-Rechts" (modern)
//   - "Auslaenderextremismus" (Berichte vor ~2001)
//   - "PMK-Religiöse Ideologie" (modern)
// Der Code arbeitet rein dynamisch mit den Werten aus dem JSON.

export type PhenomenonArea = string;

// ── Straftaten-Katalog (dynamische Keys) ──────────────
// Die einzelnen Delikt-Keys sind NICHT fix.
// Je nach Jahrgang können neue Keys auftauchen oder
// alte wegfallen. Nur die Summen-Keys (gesamt_*) sind
// garantiert vorhanden.
// ──────────────────────────────────────────────────────

export interface Gewalttaten {
  /** Immer vorhanden: Summe aller Gewalttaten */
  gesamt_gewalttaten: number;
  /** Dynamische Einzel-Delikte (snake_case Keys) */
  [delikt: string]: number | null;
}

export interface SonstigeStraftaten {
  /** Immer vorhanden: Summe aller sonstigen Straftaten */
  gesamt_sonstige_straftaten: number;
  /** Dynamische Einzel-Delikte (snake_case Keys) */
  [delikt: string]: number | null;
}

export interface StraftatenKatalog {
  gewalttaten: Gewalttaten;
  sonstige_straftaten: SonstigeStraftaten;
  straftaten_insgesamt: number;
}

// ── Personenpotenzial ─────────────────────────────────

export interface Personenpotenzial {
  absolut_gesamt: number;
  davon_gewaltorientiert: number | null;
  bedrohungslage_notiz: string | null;
}

// ── Haupt-Datensatz ───────────────────────────────────
// Ein Eintrag pro Jahr + Phänomenbereich

export interface PmkDataEntry {
  jahr: number;
  phaenomenbereich: PhenomenonArea;
  personenpotenzial: Personenpotenzial | null;
  straftaten_katalog: StraftatenKatalog;
}

/** Das gesamte Dataset ist ein Array dieser Einträge */
export type PmkDataset = PmkDataEntry[];

// ── UI-State Typen ────────────────────────────────────

export type ViewMode = "absolute" | "perCapita" | "threatLevel";

/**
 * Da die Delikt-Keys dynamisch sind, ist DeliktKey ein string.
 * Zur Laufzeit werden alle vorhandenen Keys aus dem Dataset extrahiert.
 */
export type DeliktKey = string;

/** Kategorisierung für die UI-Gruppierung der Filter-Pills */
export type DeliktCategory = "gewalttaten" | "sonstige_straftaten" | "gesamt";

/** Ein extrahierter Delikt-Eintrag für das Dropdown/die Filter-Pills */
export interface DeliktOption {
  key: DeliktKey;
  label: string;
  category: DeliktCategory;
  isSummary: boolean;
}

/** Transformierter Chart-Datenpunkt (ein Punkt pro Jahr) */
export interface ChartDataPoint {
  label: string;
  [phaenomenbereich: string]: string | number | null;
}
