"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { PmkDataset } from "@/types/pmk";

const DeliktVergleich = dynamic(() => import("./DeliktVergleich"), {
  ssr: false,
  loading: () => (
    <section className="section" id="delikt-vergleich" aria-busy="true">
      <div className="container">
        <div className="chartContainer">
          <h2 className="sectionTitle">Delikt-Vergleich</h2>
          <p className="chartSubtitle">Diagramm wird geladen.</p>
        </div>
      </div>
    </section>
  ),
});

interface DeliktVergleichLazyProps {
  data: PmkDataset;
}

export default function DeliktVergleichLazy({ data }: DeliktVergleichLazyProps) {
  const [showSection, setShowSection] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showSection) return;
    const node = mountRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowSection(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showSection]);

  return <div ref={mountRef}>{showSection ? <DeliktVergleich data={data} /> : null}</div>;
}