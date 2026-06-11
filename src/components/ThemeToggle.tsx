"use client";

// ═══════════════════════════════════════════════════════
// ThemeToggle.tsx – Dark/Light Mode Switcher
//
// Verwendet data-theme="light|dark" auf <html>.
// Das Attribut wird auch vom blocking-script in
// layout.tsx gesetzt, um Flash zu verhindern.
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import "./theme-toggle.css";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialen Theme-Wert vom DOM lesen (wurde bereits vom blocking-script gesetzt)
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(current);
    // Sicherstellen, dass das Attribut gesetzt ist
    document.documentElement.setAttribute("data-theme", current);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("vsgraph-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  // SSR: Render nichts bis Client-Hydration abgeschlossen
  if (!mounted) {
    return <div className="themeToggle themeTogglePlaceholder" aria-hidden />;
  }

  return (
    <button
      className="themeToggle"
      onClick={toggleTheme}
      aria-label={`Wechseln zu ${theme === "light" ? "Dark" : "Light"} Mode`}
      title={`${theme === "light" ? "Dark" : "Light"} Mode`}
      aria-pressed={theme === "dark"}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
