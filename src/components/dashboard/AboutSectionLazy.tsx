"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function AboutSectionPlaceholder() {
  return (
    <section className="about aboutSkeleton" id="about" aria-labelledby="about-heading" aria-busy="true">
      <div className="container">
        <h2 id="about-heading" className="aboutTitle">Über dieses Dashboard</h2>
        <div className="aboutGrid aboutGridSkeleton" aria-hidden="true">
          <div className="aboutCard aboutCardSkeleton">
            <span className="aboutSkeletonHeading" />
            <span className="aboutSkeletonLine aboutSkeletonLineWide" />
            <span className="aboutSkeletonLine" />
            <span className="aboutSkeletonLine aboutSkeletonLineShort" />
          </div>
          <div className="aboutCard aboutCardSkeleton">
            <span className="aboutSkeletonHeading" />
            <span className="aboutSkeletonLine aboutSkeletonLineWide" />
            <span className="aboutSkeletonLine" />
            <span className="aboutSkeletonLine aboutSkeletonLineShort" />
          </div>
          <div className="aboutCard aboutCardSkeleton">
            <span className="aboutSkeletonHeading" />
            <span className="aboutSkeletonLine aboutSkeletonLineWide" />
            <span className="aboutSkeletonLine" />
            <span className="aboutSkeletonLine aboutSkeletonLineShort" />
          </div>
        </div>
      </div>
    </section>
  );
}

const AboutSection = dynamic(() => import("./AboutSection"), {
  ssr: false,
  loading: () => <AboutSectionPlaceholder />,
});

export default function AboutSectionLazy() {
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
    return <AboutSection />;
  }

  return <div ref={mountRef}><AboutSectionPlaceholder /></div>;
}