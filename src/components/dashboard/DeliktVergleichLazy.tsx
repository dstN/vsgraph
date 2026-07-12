"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { PmkDataset } from "@/types/pmk";
import "./delikt-vergleich.css";

function DeliktVergleichPlaceholder() {
  return (
    <section className="section" id="delikt-vergleich" aria-busy="true">
      <div className="container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Delikt-Vergleich</h2>
          <p className="sectionSubtitle">
            Die Vergleichsansicht wird vorbereitet und direkt nach dem Scroll-Ziel geladen.
          </p>
        </div>

        <div className="chartContainer chartSkeleton" aria-hidden="true">
          <div className="chartSkeletonHeader">
            <span className="chartSkeletonBadge" />
            <span className="chartSkeletonLine chartSkeletonLineShort" />
          </div>
          <div className="chartSkeletonControls">
            <span className="chartSkeletonPill" />
            <span className="chartSkeletonPill" />
            <span className="chartSkeletonPill chartSkeletonPillWide" />
          </div>
          <div className="chartSkeletonPlot">
            <span className="chartSkeletonGrid chartSkeletonGridOne" />
            <span className="chartSkeletonGrid chartSkeletonGridTwo" />
            <span className="chartSkeletonGrid chartSkeletonGridThree" />
            <span className="chartSkeletonCurve chartSkeletonCurveOne" />
            <span className="chartSkeletonCurve chartSkeletonCurveTwo" />
            <span className="chartSkeletonCurve chartSkeletonCurveThree" />
          </div>
        </div>
      </div>
    </section>
  );
}

const DeliktVergleich = dynamic(() => import("./DeliktVergleich"), {
  ssr: false,
  loading: () => <DeliktVergleichPlaceholder />,
});

interface DeliktVergleichLazyProps {
  data: PmkDataset;
}

export default function DeliktVergleichLazy({ data }: DeliktVergleichLazyProps) {
  const [showSection, setShowSection] = useState(false);
  const mountRef = useRef<HTMLElement | null>(null);

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

  if (showSection) {
    return <DeliktVergleich data={data} />;
  }

  return <div ref={mountRef}><DeliktVergleichPlaceholder /></div>;
}