"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when escape key is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="container headerInner">
        {/* Logo */}
        <Link href="/" className="headerLogo" style={{ textDecoration: "none", color: "inherit" }} onClick={closeMenu}>
          <span className="headerLogoIcon" aria-hidden="true">◈</span>
          <span className="headerLogoText">VSGraph</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="headerNav desktopOnly" aria-label="Hauptnavigation">
          <Link href="/#personenpotenzial" className="headerNavLink">Personenpotenzial</Link>
          <Link href="/#delikt-vergleich" className="headerNavLink">Delikt-Vergleich</Link>
          <Link href="/#about" className="headerNavLink">Über</Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="mobileControls mobileOnly">
          <ThemeToggle />
          <button
            className="hamburgerButton"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menü öffnen"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Offcanvas Overlay */}
      {isMobileMenuOpen && (
        <div className="offcanvasOverlay" onClick={closeMenu} aria-hidden="true" />
      )}

      {/* Mobile Offcanvas Menu */}
      <div
        className={`offcanvasMenu ${isMobileMenuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="offcanvasHeader">
          <span className="headerLogoText" style={{ fontSize: "var(--font-size-xl)" }}>Menü</span>
          <button
            className="hamburgerButton"
            onClick={closeMenu}
            aria-label="Menü schließen"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="offcanvasNav">
          <div className="offcanvasSection">
            <span className="offcanvasSectionTitle">Dashboard</span>
            <Link href="/#personenpotenzial" className="offcanvasLink" onClick={closeMenu}>Personenpotenzial</Link>
            <Link href="/#delikt-vergleich" className="offcanvasLink" onClick={closeMenu}>Delikt-Vergleich</Link>
            <Link href="/#about" className="offcanvasLink" onClick={closeMenu}>Über VSGraph</Link>
          </div>

          <div className="offcanvasSection">
            <span className="offcanvasSectionTitle">Rechtliches & Kontakt</span>
            <Link href="/impressum" className="offcanvasLink" onClick={closeMenu}>Impressum</Link>
            <Link href="/datenschutz" className="offcanvasLink" onClick={closeMenu}>Datenschutz</Link>
            <Link href="/kontakt" className="offcanvasLink" onClick={closeMenu}>Kontakt</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
