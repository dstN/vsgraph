import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function DatenschutzPage() {
  return (
    <>
      <header className="header">
        <div className="container headerInner">
          <Link href="/" className="headerLogo" style={{ textDecoration: "none" }}>
            <span className="headerLogoIcon" aria-hidden="true">◈</span>
            <span className="headerLogoText">VSGraph</span>
          </Link>
          <nav className="headerNav" aria-label="Hauptnavigation">
            <Link href="/" className="headerNavLink">Zurück zum Dashboard</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="section" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h1 className="sectionTitle">Datenschutzerklärung</h1>
          <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6, marginTop: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            
            <section>
              <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>1. Verantwortlicher</h2>
              <p>
                Dustin Tramm<br />
                c/o Impressumservice Dein-Impressum<br />
                Stettiner Str. 41<br />
                35410 Hungen<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>2. Hosting und Server-Logfiles</h2>
              <p>
                Diese Website wird über Netcup gehostet. Der Hosting-Provider erhebt automatisch Informationen in sogenannten Server-Logfiles (z.B. IP-Adresse, Browsertyp, Uhrzeit der Anfrage). Dies ist technisch erforderlich, um die Website sicher und zuverlässig bereitzustellen.
              </p>
              <p style={{ marginTop: "var(--space-2)" }}>
                Wir haben eine tägliche Log-Rotation konfiguriert. IP-Adressen werden spätestens nach 24 Stunden automatisch gelöscht.
              </p>
            </section>

            <section>
              <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>3. Datenerfassung (LocalStorage)</h2>
              <p>
                Diese Website verwendet den lokalen Speicher Ihres Browsers (LocalStorage), um Ihre Darstellungspräferenz (Light Mode / Dark Mode) zu speichern. Diese Daten bleiben lokal auf Ihrem Endgerät und werden nicht an Server übertragen.
              </p>
            </section>

            <section>
              <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", marginBottom: "var(--space-2)" }}>4. Kontaktformular</h2>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail-Adresse, Nachricht) zwecks Bearbeitung der Anfrage bei uns verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </section>

          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="container footerInner">
          <p className="footerText">VSGraph · Daten: BfV / BKA · Kein offizielles Angebot der Bundesregierung</p>
          <div className="footerLinks" style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
            <Link href="/impressum" className="footerText" style={{ textDecoration: "underline" }}>Impressum</Link>
            <Link href="/datenschutz" className="footerText" style={{ textDecoration: "underline" }}>Datenschutz</Link>
            <Link href="/kontakt" className="footerText" style={{ textDecoration: "underline" }}>Kontakt</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
