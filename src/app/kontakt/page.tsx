"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function KontaktPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", privacy: false });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      setErrorMessage("Bitte stimmen Sie der Datenschutzerklärung zu.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("https://vsgraph.de/phpmailer/phpmailer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "", privacy: false });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Fehler beim Senden der Nachricht.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
      setStatus("error");
    }
  };

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
        <div className="container" style={{ maxWidth: "600px" }}>
          <h1 className="sectionTitle">Kontakt</h1>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)", marginBottom: "var(--space-6)" }}>
            Haben Sie Fragen, Feedback oder Anmerkungen zum Dashboard? Schreiben Sie uns gerne eine Nachricht.
          </p>

          {status === "success" ? (
            <div style={{ padding: "var(--space-4)", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981" }}>
              <strong>Vielen Dank!</strong> Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns so schnell wie möglich.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {status === "error" && (
                <div id="form-error" role="alert" style={{ padding: "var(--space-3)", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "8px", color: "#ef4444" }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <label htmlFor="name" style={{ color: "var(--color-text)", fontWeight: 500 }}>Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <label htmlFor="email" style={{ color: "var(--color-text)", fontWeight: 500 }}>E-Mail-Adresse</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <label htmlFor="message" style={{ color: "var(--color-text)", fontWeight: 500 }}>Nachricht</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-card)", color: "var(--color-text)", resize: "vertical" }}
                  aria-invalid={status === "error" ? "true" : "false"}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                <input
                  id="privacy"
                  type="checkbox"
                  required
                  checked={formData.privacy}
                  onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                  style={{ marginTop: "4px" }}
                />
                <label htmlFor="privacy" style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.4 }}>
                  Ich habe die <Link href="/datenschutz" style={{ color: "var(--color-text)", textDecoration: "underline" }}>Datenschutzerklärung</Link> zur Kenntnis genommen und stimme zu, dass meine Angaben zur Kontaktaufnahme gespeichert werden.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  marginTop: "var(--space-2)",
                  padding: "12px 24px",
                  backgroundColor: "var(--color-text-accent)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                  transition: "opacity 0.2s"
                }}
              >
                {status === "loading" ? "Wird gesendet..." : "Nachricht senden"}
              </button>
            </form>
          )}
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
