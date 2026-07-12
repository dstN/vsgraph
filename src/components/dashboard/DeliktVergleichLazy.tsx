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

        <div className="filterArea filterAreaSkeleton" aria-hidden="true">
          <div className="filterGroupSkeleton">
            <span className="filterGroupSkeletonLabel" />
            <div className="chartSkeletonControls chartSkeletonControlsDense">
              <span className="chartSkeletonPill" />
              <span className="chartSkeletonPill chartSkeletonPillWide" />
              <span className="chartSkeletonPill" />
            </div>
          </div>
          <div className="filterGroupSkeleton">
            <span className="filterGroupSkeletonLabel" />
            <div className="chartSkeletonControls chartSkeletonControlsDense">
              <span className="chartSkeletonPill chartSkeletonPillWide" />
              <span className="chartSkeletonPill chartSkeletonPillWide" />
            </div>
          </div>
          <div className="filterGroupSkeleton">
            <span className="filterGroupSkeletonLabel" />
            <div className="chartSkeletonControls chartSkeletonControlsDense">
              <span className="chartSkeletonPill chartSkeletonPillWide" />
              <span className="chartSkeletonPill" />
            </div>
          </div>
        </div>

        <div className="chartContainer chartSkeleton" aria-hidden="true">
          <div className="chartSkeletonHeader">
            <span className="chartSkeletonBadge" />
            <span className="chartSkeletonLine chartSkeletonLineShort" />
          </div>
          <div className="chartSkeletonTimeframe">
            <span className="chartSkeletonTimeframeLabel" />
            <span className="chartSkeletonTimeframeRange" />
            <div className="chartSkeletonSlider">
              <span className="chartSkeletonSliderTrack" />
              <span className="chartSkeletonSliderFill" />
              <span className="chartSkeletonSliderThumb chartSkeletonSliderThumbStart" />
              <span className="chartSkeletonSliderThumb chartSkeletonSliderThumbEnd" />
            </div>
          </div>
          <div className="chartSkeletonControls">
            <span className="chartSkeletonPill" />
            <span className="chartSkeletonPill" />
            <span className="chartSkeletonPill chartSkeletonPillWide" />
            <span className="chartSkeletonPill" />
            <span className="chartSkeletonPill" />
          </div>
          <div className="chartSkeletonPlot">
            <span className="chartSkeletonGrid chartSkeletonGridOne" />
            <span className="chartSkeletonGrid chartSkeletonGridTwo" />
            <span className="chartSkeletonGrid chartSkeletonGridThree" />
            <span className="chartSkeletonCurve chartSkeletonCurveOne" />
            <span className="chartSkeletonCurve chartSkeletonCurveTwo" />
            <span className="chartSkeletonCurve chartSkeletonCurveThree" />
          </div>
          <div className="chartSkeletonLegend" aria-hidden="true">
            <span className="chartSkeletonLegendItem" />
            <span className="chartSkeletonLegendItem" />
            <span className="chartSkeletonLegendItem" />
            <span className="chartSkeletonLegendItem" />
          </div>
          <div className="chartSkeletonNotes" aria-hidden="true">
            <span className="chartSkeletonNote chartSkeletonNoteLong" />
            <span className="chartSkeletonNote" />
            <span className="chartSkeletonNote chartSkeletonNoteLong" />
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

  useEffect(() => {
    if (showSection) return;

    const warmupId = window.setTimeout(() => {
      setShowSection(true);
    }, 450);

    return () => window.clearTimeout(warmupId);
  }, [showSection]);

  useEffect(() => {
    const handlePrepareSection = (event: Event) => {
      const { targetId } = (event as CustomEvent<{ targetId?: string }>).detail ?? {};
      if (targetId === "delikt-vergleich" || targetId === "about") {
        setShowSection(true);
      }
    };

    window.addEventListener("vsgraph:prepare-section", handlePrepareSection);
    return () => window.removeEventListener("vsgraph:prepare-section", handlePrepareSection);
  }, []);

  if (showSection) {
    return <DeliktVergleich data={data} />;
  }

  return <div ref={mountRef}><DeliktVergleichPlaceholder /></div>;
}