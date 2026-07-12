"use client";

export default function AboutSection() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading" data-section-id="about" data-section-ready="true">
      <div className="container">
        <h2 id="about-heading" className="aboutTitle">Über dieses Dashboard</h2>
        <div className="aboutGrid">
          <div className="aboutCard">
            <h3>Datenquellen</h3>
            <p>Alle Daten stammen aus den offiziellen Verfassungsschutzberichten des Bundesamtes für Verfassungsschutz (BfV) sowie den PMK-Statistiken des Bundeskriminalamts (BKA).</p>
          </div>
          <div className="aboutCard">
            <h3>Methodik</h3>
            <p>Die Daten wurden per LLM aus den Originalberichten extrahiert und manuell verifiziert. Abweichungen durch Rundungen sind möglich. Das Dashboard dient der Veranschaulichung, nicht der offiziellen Berichterstattung.</p>
          </div>
          <div className="aboutCard">
            <h3>Hinweise</h3>
            <p>Nicht jeder Delikt-Typ existiert in jedem Berichtsjahr für jeden PMK-Bereich. Fehlende Datenpunkte werden im Chart als Lücke dargestellt, nicht als Null.</p>
          </div>
        </div>
      </div>
    </section>
  );
}