// ═══════════════════════════════════════════════════════
// lib/constants.ts – Statische Konfiguration & Mappings
// ═══════════════════════════════════════════════════════

/**
 * Bevölkerung Deutschlands pro Jahr (Destatis, Fortschreibung Zensus 2022).
 * Wird für die Per-Capita-Berechnung benötigt:
 *   perCapita = (wert / population) * 100_000
 */
export const POPULATION_BY_YEAR: Record<number, number> = {
  1999: 82_163_000,
  2000: 82_260_000,
  2001: 82_440_000,
  2002: 82_537_000,
  2003: 82_531_000,
  2004: 82_501_000,
  2005: 82_438_000,
  2006: 82_315_000,
  2007: 82_218_000,
  2008: 82_002_000,
  2009: 81_802_000,
  2010: 81_752_000,
  2011: 80_328_000,
  2012: 80_524_000,
  2013: 80_767_000,
  2014: 81_198_000,
  2015: 82_176_000,
  2016: 82_522_000,
  2017: 82_792_000,
  2018: 83_019_000,
  2019: 83_167_000,
  2020: 83_155_000,
  2021: 83_237_000,
  2022: 84_359_000,
  2023: 83_800_000,
  2024: 83_497_000,
  2025: 83_400_000,
};

/**
 * Farbpalette pro PMK-Phänomenbereich.
 * Psychologisch begründet & deuteranopie-sicher.
 *
 * Enthält sowohl moderne als auch historische Bezeichnungen,
 * da sich die Nomenklatur über die Jahrzehnte geändert hat.
 */
export const PMK_COLORS: Record<string, { light: string; dark: string }> = {
  // ── Rechtsextremismus (Indigo) ──
  "PMK-Rechts":                 { light: "#4361ee", dark: "#748ffc" },
  "PMK-rechts":                 { light: "#4361ee", dark: "#748ffc" },
  "Rechtsextremismus":          { light: "#4361ee", dark: "#748ffc" },
  // ── Linksextremismus (Karminrot) ──
  "PMK-Links":                  { light: "#e63946", dark: "#ff6b6b" },
  "PMK-links":                  { light: "#e63946", dark: "#ff6b6b" },
  "Linksextremismus":           { light: "#e63946", dark: "#ff6b6b" },
  // ── Religiöse Ideologie (Teal) ──
  "PMK-Religiöse Ideologie":    { light: "#2a9d8f", dark: "#63e6be" },
  "PMK-religiöse Ideologie":    { light: "#2a9d8f", dark: "#63e6be" },
  "Islamismus":                 { light: "#2a9d8f", dark: "#63e6be" },
  "pmk_islamismus":             { light: "#2a9d8f", dark: "#63e6be" },
  "pmk_religioese_ideologie":   { light: "#2a9d8f", dark: "#63e6be" },
  
  // ── Ausländerkriminalität (alt, bis 2016) (Violett) ──
  "PMK-Ausländerkriminalität":  { light: "#7209b7", dark: "#cc5de8" },
  "Ausländerextremismus":       { light: "#7209b7", dark: "#cc5de8" },
  "pmk_auslaender_ohne_islamismus": { light: "#7209b7", dark: "#cc5de8" },

  // ── Ausländische Ideologie (neu, ab 2017) (Pink/Magenta) ──
  "PMK-Ausländische Ideologie": { light: "#f06595", dark: "#fcc2d7" },
  "pmk_auslaendische_ideologie": { light: "#f06595", dark: "#fcc2d7" },

  // ── Reichsbürger und Selbstverwalter (Orange/Braun) ──
  "Reichsbürger und Selbstverwalter": { light: "#f59f00", dark: "#fcc419" },
  "reichsbuerger_und_selbstverwalter": { light: "#f59f00", dark: "#fcc419" },
  "pmk_reichsbuerger_und_selbstverwalter": { light: "#f59f00", dark: "#fcc419" },

  // ── Verfassungsschutzrelevante Delegitimierung des Staates (Türkis/Cyan) ──
  "Delegitimierung des Staates": { light: "#0bc5ea", dark: "#76e4f7" },
  "pmk_verfassungsschutzrelevante_delegitimierung_des_staates": { light: "#0bc5ea", dark: "#76e4f7" },

  // ── Sonstige / Nicht zuzuordnen (Grau) ──
  "PMK - nicht zuzuordnen":               { light: "#868e96", dark: "#adb5bd" },
  "PMK-Sonstige":               { light: "#868e96", dark: "#adb5bd" },
  "PMK-sonstige Zuordnung":     { light: "#868e96", dark: "#adb5bd" },
};

/** Kurzlabels für die Legende und Tooltips */
export const PMK_SHORT_LABELS: Record<string, string> = {
  "PMK-Rechts":                 "Rechts",
  "PMK-rechts":                 "Rechts",
  "Rechtsextremismus":          "Rechts",
  "PMK-Links":                  "Links",
  "PMK-links":                  "Links",
  "Linksextremismus":           "Links",
  "PMK-Religiöse Ideologie":    "Religiös",
  "PMK-religiöse Ideologie":    "Religiös",
  "Islamismus":                 "Religiös",
  "PMK-Ausländerkriminalität":  "Ausländerkrim.",
  "PMK-Ausländische Ideologie": "Ausl. Ideologie",
  "Auslaenderextremismus":      "Ausländerkrim.",
  "Ausländerextremismus":       "Ausländerkrim.",
  "Politisch motivierte Ausländerkriminalität": "Ausl.-Krim.",
  "Politisch motivierte Ausländerkriminalität (ohne Islamismus)": "Ausl.-Krim. (o.I.)",
  "Reichsbürger und Selbstverwalter": "Reichsbürger",
  "pmk_reichsbuerger_und_selbstverwalter": "Reichsbürger",
  "Delegitimierung des Staates": "Delegitimierung",
  "pmk_verfassungsschutzrelevante_delegitimierung_des_staates": "Delegitimierung",
  "PMK - nicht zuzuordnen":     "Nicht zuzuordnen",
  "PMK-Sonstige":               "Nicht zuzuordnen",
  "PMK-sonstige Zuordnung":     "Nicht zuzuordnen",
};

/**
 * Bevorzugte Reihenfolge der PMK-Bereiche in Charts & Legende.
 * Enthält nur die kanonischen (normalisierten) Namen.
 */
export const PMK_AREAS_ORDERED: readonly string[] = [
  "PMK-Rechts",
  "PMK-Links",
  "PMK-Religiöse Ideologie",
  "PMK-Ausländerkriminalität",
  "PMK-Ausländische Ideologie",
  "Reichsbürger und Selbstverwalter",
  "Delegitimierung des Staates",
  "PMK - nicht zuzuordnen",
];

/**
 * Normalisierungs-Map: Historische Bezeichnungen → kanonischer Name.
 *
 * Die Verfassungsschutzberichte haben die PMK-Bereiche über die
 * Jahrzehnte unterschiedlich benannt. Damit im Chart eine
 * durchgehende Linie entsteht, werden alle Varianten auf
 * einen einzigen kanonischen Namen normalisiert.
 */
const AREA_CANONICAL_MAP: Record<string, string> = {
  // Rechts
  "PMK-rechts":                 "PMK-Rechts",
  "Rechtsextremismus":          "PMK-Rechts",
  "pmk_rechts":                 "PMK-Rechts",
  
  // Links
  "PMK-links":                  "PMK-Links",
  "Linksextremismus":           "PMK-Links",
  "pmk_links":                  "PMK-Links",
  
  // Religiöse Ideologie
  "PMK-religiöse Ideologie":    "PMK-Religiöse Ideologie",
  "Religiöse Ideologie (Islamismus)": "PMK-Religiöse Ideologie",
  "Politisch motivierte Kriminalität - religiöse Ideologie (Islamismus)": "PMK-Religiöse Ideologie",
  "Islamismus":                 "PMK-Religiöse Ideologie",
  "pmk_islamismus":             "PMK-Religiöse Ideologie",
  "pmk_religioese_ideologie":   "PMK-Religiöse Ideologie",
  
  // Ausländer (Alt)
  "Auslaenderextremismus":                                      "PMK-Ausländerkriminalität",
  "Auslaenderextremismus (ohne Islamismus)":                     "PMK-Ausländerkriminalität",
  "Ausländerextremismus":                                       "PMK-Ausländerkriminalität",
  "Politisch motivierte Ausländerkriminalität":                  "PMK-Ausländerkriminalität",
  "Politisch motivierte Ausländerkriminalität (ohne Islamismus)": "PMK-Ausländerkriminalität",
  "pmk_auslaenderkriminalitaet_ohne_islamismus":                 "PMK-Ausländerkriminalität",
  "pmk_auslaender":                                              "PMK-Ausländerkriminalität",
  "pmk_auslaender_ohne_islamismus":                              "PMK-Ausländerkriminalität",
  
  // Ausländische Ideologie (Neu)
  "PMK-Ausländische Ideologie":                                  "PMK-Ausländische Ideologie",
  "Politisch motivierte Kriminalität - ausländische Ideologie":   "PMK-Ausländische Ideologie",
  "pmk_auslaendische_ideologie":                                 "PMK-Ausländische Ideologie",
  
  // Reichsbürger
  "reichsbuerger_und_selbstverwalter": "Reichsbürger und Selbstverwalter",
  "pmk_reichsbuerger_und_selbstverwalter": "Reichsbürger und Selbstverwalter",
  
  // Delegitimierung
  "pmk_verfassungsschutzrelevante_delegitimierung_des_staates": "Delegitimierung des Staates",
  "verfassungsschutzrelevante_delegitimierung_des_staates": "Delegitimierung des Staates",
  
  // Sonstige / Nicht zuzuordnen
  "PMK-sonstige Zuordnung":     "PMK - nicht zuzuordnen",
  "pmk_ohne_zuordnung":         "PMK - nicht zuzuordnen",
  "PMK-Sonstige":               "PMK - nicht zuzuordnen",
};

/**
 * Normalisiert einen PMK-Bereichsnamen auf den kanonischen Wert.
 * Wenn der Name bereits kanonisch oder unbekannt ist, wird er
 * unverändert zurückgegeben.
 *
 * @example
 * normalizePmkArea("Auslaenderextremismus")
 *   → "PMK-Ausländische Ideologie"
 * normalizePmkArea("Politisch motivierte Ausländerkriminalität (ohne Islamismus)")
 *   → "PMK-Ausländische Ideologie"
 * normalizePmkArea("PMK-Rechts")
 *   → "PMK-Rechts"  (bereits kanonisch)
 */
export function normalizePmkArea(area: string): string {
  return AREA_CANONICAL_MAP[area] ?? area;
}

/**
 * Fallback-Farben für unbekannte PMK-Bereiche.
 * Werden deterministisch aus dem String-Hash vergeben.
 */
const FALLBACK_COLORS = [
  { light: "#e07a5f", dark: "#f2a88a" },  // Terracotta
  { light: "#3d5a80", dark: "#7ea8c9" },  // Stahlblau
  { light: "#81b29a", dark: "#a8d8b9" },  // Salbeigrün
  { light: "#f2cc8f", dark: "#f5deb3" },  // Sandgelb
  { light: "#9c6644", dark: "#c49a6c" },  // Mokka
];

/** Deterministische Farbe für einen PMK-Bereich (mit Fallback) */
export function getPmkColor(area: string): { light: string; dark: string } {
  if (PMK_COLORS[area]) return PMK_COLORS[area];
  // Hash-basierter Fallback
  let hash = 0;
  for (let i = 0; i < area.length; i++) {
    hash = ((hash << 5) - hash + area.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

/** Kurzlabel für einen PMK-Bereich (mit snakeCaseToLabel Fallback) */
export function getPmkLabel(area: string): string {
  if (PMK_SHORT_LABELS[area]) return PMK_SHORT_LABELS[area];
  // Fallback: snake_case oder Vollname bereinigen
  return area
    .replace(/^PMK-/, "")
    .replace(/_/g, " ")
    .replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü")
    .trim();
}

/**
 * Optionale Überschreibungen für snake_case Keys,
 * die der automatische Formatter nicht korrekt übersetzen kann.
 * NUR für Sonderfälle – der Großteil wird dynamisch formatiert.
 */
export const DELIKT_LABEL_OVERRIDES: Record<string, string> = {
  gesamt_gewalttaten: "∑ Gewalttaten (Gesamt)",
  gesamt_sonstige_straftaten: "∑ Sonstige Straftaten (Gesamt)",
  straftaten_insgesamt: "∑ Straftaten Insgesamt",
  andere_insb_volksverhetzung_beleidigung: "Volksverhetzung / Beleidigung",
  herbeifuehren_einer_sprengstoffexplosion: "Herbeiführen einer Sprengstoffexplosion",
  gefaehrliche_eingriffe_verkehr: "Gefährliche Eingriffe i.d. Verkehr",
  gefaehrliche_eingriffe_in_bahn_luft_schiffs_und_strassenverkehr: "Gefährliche Eingriffe i.d. Verkehr",
  noetigung_bedrohung: "Nötigung / Bedrohung",
  stoerung_der_totenruhe: "Störung der Totenruhe",
  koerperverletzungen: "Körperverletzungen",
  raub_erpressungen: "Raub / Erpressungen",
  raub: "Raub",
  erpressung: "Erpressung",
  andere_straftaten: "Andere Straftaten (insb. Volksverhetzung und Beleidigung)",
  andere_straftaten_insbesondere_volksverhetzung: "Andere Straftaten (insb. Volksverhetzung und Beleidigung)",
};

/**
 * Kontextuelle Hinweise für Delikte mit historischen Änderungen.
 * Werden unter dem Chart angezeigt wenn das entsprechende Delikt
 * ausgewählt ist.
 */
export const DELIKT_NOTES: Record<string, string> = {
  raub_erpressungen:
    "Bis 2000 wurden Raub und Erpressung gemeinsam erfasst. Ab 2001 werden sie getrennt ausgewiesen.",
  raub:
    "Seit 2001 getrennt erfasst. Bis 2000 siehe \u201eRaub / Erpressungen\u201c.",
  erpressung:
    "Seit 2001 getrennt erfasst. Bis 2000 siehe \u201eRaub / Erpressungen\u201c.",
};

// ═══════════════════════════════════════════════════════
// Delikt-Normalisierung
// ═══════════════════════════════════════════════════════
// Über die Jahrzehnte haben sich die Delikt-Kategorien
// in den Berichten geändert:
//   - Zusammenlegungen → Aufspaltungen (raub_erpressungen → raub + erpressung)
//   - Umbenennungen (gefaehrliche_eingriffe_in_den_... → gefaehrliche_eingriffe_in_...)
//
// Um durchgehende Linien im Chart zu erzeugen, werden
// die Keys beim Laden normalisiert.
// ═══════════════════════════════════════════════════════

/**
 * Merge-Map: Separate Keys → ein kanonischer Key (Werte werden summiert).
 * Format: { kanonischer_key: [keys_die_zusammengeführt_werden] }
 *
 * Wenn BEIDE Quell-Keys in einem Eintrag existieren, werden sie
 * summiert und durch den kanonischen Key ersetzt.
 * Wenn nur der kanonische Key existiert (ältere Daten), bleibt er.
 */
export const DELIKT_MERGE_MAP: Record<string, string[]> = {
  // Aktuell leer: Raub/Erpressung werden getrennt angezeigt
  // mit kontextuellem Hinweis unter dem Chart (DELIKT_NOTES)
};

/**
 * Rename-Map: Alter Key → kanonischer Key (1:1 Umbenennung).
 * Der Wert wird unverändert übernommen.
 */
export const DELIKT_RENAME_MAP: Record<string, string> = {
  sachbeschaedigung: "sachbeschaedigungen",
  volksverhetzung: "andere_straftaten",
  gefaehrliche_eingriffe_in_den_bahn_luft_schiffs_und_strassenverkehr:
    "gefaehrliche_eingriffe_in_bahn_luft_schiffs_und_strassenverkehr",
  andere_straftaten_insbesondere_volksverhetzung:
    "andere_straftaten",
  andere_straftaten_insbesondere_volksverhetzung_und_beleidigung:
    "andere_straftaten",
  stoerung_der_totenruhe_und_andere_formen_der_schaendung_juedischer_friedhoefe_und_gedenkstaetten:
    "stoerung_der_totenruhe",
};

/**
 * Normalisiert die Delikt-Keys in einem Straftaten-Objekt.
 *
 * 1. Rename-Map anwenden (einfache Umbenennungen)
 * 2. Merge-Map anwenden (separate Keys summieren)
 *
 * @example
 * // Input (ab 2001):
 * { raub: 6, erpressung: 2, koerperverletzungen: 100 }
 * // Output:
 * { raub_erpressungen: 8, koerperverletzungen: 100 }
 */
export function normalizeDelikts(
  record: Record<string, number | null>
): Record<string, number | null> {
  const result: Record<string, number | null> = {};

  // 1. Alle Keys durchgehen, Renames anwenden
  for (const [key, value] of Object.entries(record)) {
    const canonicalKey = DELIKT_RENAME_MAP[key] ?? key;
    // Bei Rename-Kollision: Werte summieren, aber Null-Werte sollen Zahlen nicht überschreiben
    if (canonicalKey in result) {
      if (result[canonicalKey] != null && value != null) {
        result[canonicalKey] = (result[canonicalKey] as number) + value;
      } else if (result[canonicalKey] == null && value != null) {
        result[canonicalKey] = value;
      }
      // Wenn value == null ist, behalten wir den bestehenden Wert bei
    } else {
      result[canonicalKey] = value;
    }
  }

  // 2. Merge-Map anwenden
  for (const [targetKey, sourceKeys] of Object.entries(DELIKT_MERGE_MAP)) {
    // Prüfen ob die Quell-Keys (einzeln) vorhanden sind
    const presentSources = sourceKeys.filter((k) => k in result);

    if (presentSources.length > 0 && !(targetKey in result)) {
      // Quell-Keys summieren → kanonischer Key
      let sum: number | null = null;
      for (const sourceKey of presentSources) {
        const val = result[sourceKey];
        if (val != null) {
          sum = (sum ?? 0) + val;
        }
        delete result[sourceKey];
      }
      result[targetKey] = sum;
    }
    // Wenn targetKey bereits existiert (alte Daten), nichts tun
  }

  return result;
}

