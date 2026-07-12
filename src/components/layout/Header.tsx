"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import LogoMark from "@/components/layout/LogoMark";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const sectionDependencies: Record<string, string[]> = {
    personenpotenzial: [],
    "delikt-vergleich": ["personenpotenzial-chart"],
    about: ["personenpotenzial-chart"],
  };

  const scrollToSection = (targetId: string, behavior: ScrollBehavior) => {
    const target = document.getElementById(targetId);
    if (!target) return false;

    const header = document.querySelector(".header") as HTMLElement | null;
    const headerOffset = header?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior,
    });

    return true;
  };

  const waitForSections = (sectionIds: string[], timeoutMs = 1500) => {
    if (sectionIds.length === 0) {
      return Promise.resolve();
    }

    const isReady = () =>
      sectionIds.every((sectionId) =>
        document.querySelector(`[data-section-id="${sectionId}"][data-section-ready="true"]`)
      );

    if (isReady()) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const startedAt = Date.now();
      const intervalId = window.setInterval(() => {
        if (isReady() || Date.now() - startedAt >= timeoutMs) {
          window.clearInterval(intervalId);
          resolve();
        }
      }, 50);
    });
  };


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

  const handleSectionNavigation = async (targetId: string) => {
    closeMenu();
    const hash = `#${targetId}`;

    if (pathname !== "/") {
      window.location.assign(`/${hash}`);
      return;
    }

    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    window.dispatchEvent(
      new CustomEvent("vsgraph:prepare-section", { detail: { targetId } })
    );

    await waitForSections(sectionDependencies[targetId] ?? []);

    if (!scrollToSection(targetId, "smooth")) {
      window.location.assign(`/${hash}`);
    }
  };

  const renderSectionLink = (
    targetId: string,
    label: string,
    className: string
  ) => {
    if (isHomePage) {
      return (
        <Link
          href={`/#${targetId}`}
          scroll={false}
          className={className}
          onClick={(event) => {
            event.preventDefault();
            void handleSectionNavigation(targetId);
          }}
        >
          {label}
        </Link>
      );
    }

    return (
      <Link href={`/#${targetId}`} className={className} onClick={closeMenu}>
        {label}
      </Link>
    );
  };

  return (
    <header className="header">
      <div className="container headerInner">
        {/* Logo */}
        <Link href="/" className="headerLogo" style={{ textDecoration: "none", color: "inherit" }} onClick={closeMenu}>
          <LogoMark className="headerLogoIcon" />
          <span className="headerLogoText">VSGraph</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="headerNav desktopOnly" aria-label="Hauptnavigation">
          {renderSectionLink("personenpotenzial", "Personenpotenzial", "headerNavLink")}
          {renderSectionLink("delikt-vergleich", "Delikt-Vergleich", "headerNavLink")}
          {renderSectionLink("about", "Über", "headerNavLink")}
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
      {isMobileMenuOpen && (
        <div
          className="offcanvasMenu open"
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
              {renderSectionLink("personenpotenzial", "Personenpotenzial", "offcanvasLink")}
              {renderSectionLink("delikt-vergleich", "Delikt-Vergleich", "offcanvasLink")}
              {renderSectionLink("about", "Über VSGraph", "offcanvasLink")}
            </div>

            <div className="offcanvasSection">
              <span className="offcanvasSectionTitle">Rechtliches & Kontakt</span>
              <Link href="/impressum" className="offcanvasLink" onClick={closeMenu}>Impressum</Link>
              <Link href="/datenschutz" className="offcanvasLink" onClick={closeMenu}>Datenschutz</Link>
              <Link href="/kontakt" className="offcanvasLink" onClick={closeMenu}>Kontakt</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
