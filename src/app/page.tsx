import pmkData from '@/../public/data/pmk-data.json';
import type { PmkDataset, Gewalttaten, SonstigeStraftaten } from '@/types/pmk';
import { normalizePmkArea, normalizeDelikts } from '@/lib/constants';
import Personenpotenzial from '@/components/dashboard/Personenpotenzial';
import DeliktVergleich from '@/components/dashboard/DeliktVergleich';
import Header from "@/components/layout/Header";

/**
 * VSGraph Dashboard – Hauptseite
 *
 * Lädt die PMK-Daten zur Build-Time (SSG), normalisiert die
 * Bereichsnamen UND die Delikt-Keys und übergibt sie an
 * die interaktiven Client Components.
 */
export default function DashboardPage() {
	// Daten laden + normalisieren:
	// 1. PMK-Bereiche: "Auslaenderextremismus" → "PMK-Ausländische Ideologie"
	// 2. Delikte: raub + erpressung → raub_erpressungen (Werte summiert)
	const data = (pmkData as unknown as PmkDataset).map((entry) => ({
		...entry,
		phaenomenbereich: normalizePmkArea(entry.phaenomenbereich),
		straftaten_katalog: {
			...entry.straftaten_katalog,
			gewalttaten: normalizeDelikts(entry.straftaten_katalog.gewalttaten) as Gewalttaten,
			sonstige_straftaten: normalizeDelikts(entry.straftaten_katalog.sonstige_straftaten) as SonstigeStraftaten,
		},
	}));

	return (
		<>
			{/* ── Header ──────────────────────────────────── */}
			<Header />

			<main>
				{/* ── Hero ──────────────────────────────────── */}
				<section className="hero" aria-labelledby="hero-heading">
					<div className="container">
						<div className="heroBadge">Daten-Dashboard</div>
						<h1 id="hero-heading" className="heroTitle">
							Verfassungsschutzbericht
							<br />
							<span className="heroTitleAccent">interaktiv</span>
						</h1>
						<p className="heroSubtitle">Politisch motivierte Kriminalität in Deutschland – verständlich aufbereitet und visuell vergleichbar.</p>
					</div>
				</section>

				{/* ── Section 1: Personenpotenzial ──────────── */}
				<Personenpotenzial data={data} />

				{/* ── Section 2: Delikt-Vergleich (Highlight) ─ */}
				<DeliktVergleich data={data} />

				{/* ── Über / Methodik ──────────────────────── */}
				<section className="about" id="about" aria-labelledby="about-heading">
					<div className="container">
						<h2 id="about-heading" className="aboutTitle">Über dieses Dashboard</h2>
						<div className="aboutGrid">
							<div className="aboutCard">
								<h3>Datenquellen</h3>
								<p>Alle Daten stammen aus den offiziellen Verfassungsschutzberichten des Bundesamtes für Verfassungsschutz (BfV) sowie den PMK-Statistiken des Bundeskriminalamts (BKA).</p>
							</div>
							<div className="aboutCard">
								<h3>Methodik</h3>
								<p>Die Daten wurden per LLM aus den Originalberichten extrahiert und manuell verifiziert. Abweichungen durch Rundungen sind möglich. Das Dashboard dient der Veranschaulichung, nicht der offiziellen Berichterstattung.</p>
							</div>
							<div className="aboutCard">
								<h3>Hinweise</h3>
								<p>Nicht jeder Delikt-Typ existiert in jedem Berichtsjahr für jeden PMK-Bereich. Fehlende Datenpunkte werden im Chart als Lücke dargestellt, nicht als Null.</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* ── Footer ──────────────────────────────────── */}
			<footer className="footer">
				<div className="container footerInner">
					<p className="footerText">VSGraph · Daten: BfV / BKA · Kein offizielles Angebot der Bundesregierung</p>
					<div className="footerLinks" style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
						<a href="/impressum" className="footerText" style={{ textDecoration: "underline" }}>Impressum</a>
						<a href="/datenschutz" className="footerText" style={{ textDecoration: "underline" }}>Datenschutz</a>
						<a href="/kontakt" className="footerText" style={{ textDecoration: "underline" }}>Kontakt</a>
					</div>
				</div>
			</footer>
		</>
	);
}
