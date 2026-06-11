"use client";

// ═══════════════════════════════════════════════════════
// ViewSwitcher.tsx – Apple-Style Segmented Control
//
// Horizontal pill-shaped toggle buttons mit sliding
// indicator für den aktiven Modus.
// ═══════════════════════════════════════════════════════

import { useRef, useState, useEffect, useCallback } from "react";
import type { ViewMode } from "@/types/pmk";
import "./view-switcher.css";

interface ViewOption {
  value: ViewMode;
  label: string;
  description: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    value: "absolute",
    label: "Absolut",
    description: "Absolute Personenzahlen",
  },
  {
    value: "perCapita",
    label: "Pro 100k",
    description: "Pro 100.000 Einwohner",
  },
  {
    value: "threatLevel",
    label: "Bedrohungslage",
    description: "Anteil Gewaltorientierter",
  },
];

interface ViewSwitcherProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Sliding indicator berechnen
  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector(
      `[data-value="${value}"]`
    ) as HTMLElement;
    if (!activeButton) return;

    setIndicatorStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [value]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <div className="viewSwitcherWrapper">
      <div
        className="viewSwitcher"
        ref={containerRef}
        role="tablist"
        aria-label="Ansichtsmodus wählen"
      >
        {/* Sliding indicator */}
        <div
          className="viewSwitcherIndicator"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />

        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            className="viewSwitcherButton"
            data-value={option.value}
            data-active={value === option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            aria-selected={value === option.value}
            aria-label={option.description}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
