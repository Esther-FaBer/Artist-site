import { useEffect, useState } from "react";
import { fetchBio } from "../api";
import type { BioSection } from "../types";
import "./AboutPage.css";

export default function AboutPage() {
  const [sections, setSections] = useState<BioSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBio()
      .then(setSections)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-loading">Loading</div>;
  if (error) return <div className="state-error">Could not load bio.</div>;

  // Split sections into bio sections and CV sections by type
  const bioSections = sections.filter((s) => s.section_type === "BIO");
  const cvSections = sections.filter((s) => s.section_type === "CV");

  return (
    <main className="page about-page">
      <div className="content-column">
        {/* Bio */}
        {bioSections.length > 0 && (
          <section className="about-bio">
            {bioSections.map((section) => (
              <div key={section.id} className="about-bio__section">
                {section.heading && (
                  <h2 className="about-bio__heading">{section.heading}</h2>
                )}
                <p className="about-bio__body">{section.body}</p>
              </div>
            ))}
          </section>
        )}

        {/* CV */}
        {cvSections.length > 0 && (
          <section className="about-cv">
            <h2 className="about-cv__title">CV</h2>
            {cvSections.map((section) => (
              <div key={section.id} className="about-cv__group">
                {section.heading && (
                  <h3 className="about-cv__heading">{section.heading}</h3>
                )}
                <p className="about-cv__body">{section.body}</p>
              </div>
            ))}
          </section>
        )}

        {/* Fallback — no content yet */}
        {sections.length === 0 && (
          <p className="state-empty">No bio content yet.</p>
        )}
      </div>
    </main>
  );
}
