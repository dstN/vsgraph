"use client";

import dynamic from "next/dynamic";
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
  return <DeliktVergleich data={data} />;
}