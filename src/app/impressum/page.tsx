"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function ImpressumPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const email = mounted ? "abuse" + "@" + "vsgraph.de" : "";

  return (
    <>
      <Header />
      <main className="section" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h1 className="sectionTitle">Impressum</h1>
          <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.6, marginTop: "var(--space-6)" }}>
            <p style={{ fontSize: "1.1rem" }}><strong>Informationen gemäß § 5 DDG</strong></p>
            <p style={{ marginTop: "var(--space-4)" }}>
              <strong>Verantwortlich:</strong><br />
              Dustin Tramm<br />
              c/o Impressumservice Dein-Impressum<br />
              Stettiner Str. 41<br />
              35410 Hungen<br />
              Deutschland
            </p>
            <p style={{ marginTop: "var(--space-6)" }}>
              <strong>E-Mail:</strong>{" "}
              {email ? (
                <a href={`mailto:${email}`} style={{ color: "var(--color-text-accent)", textDecoration: "none", fontWeight: 500 }}>{email}</a>
              ) : (
                <span style={{ color: "var(--color-text-accent)", fontWeight: 500 }}>bitte JavaScript aktivieren</span>
              )}
            </p>
            <p style={{ marginTop: "var(--space-6)" }}>
              <Link href="/kontakt" style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "var(--color-text-accent)", color: "#ffffff", textDecoration: "none", borderRadius: "8px", fontWeight: 600 }}>
                Zum Kontaktformular
              </Link>
            </p>
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
