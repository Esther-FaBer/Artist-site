import { useEffect, useState } from "react";
import { fetchExhibitions } from "../api";
import type { Exhibition } from "../types";
import "./ExhibitionsPage.css";

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchExhibitions()
      .then(setExhibitions)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-loading">Loading</div>;
  if (error)
    return <div className="state-error">Could not load exhibitions.</div>;

  // Group by year for CV-style layout
  const byYear = exhibitions.reduce<Record<string, Exhibition[]>>((acc, ex) => {
    const year = ex.start_date
      ? new Date(ex.start_date).getFullYear().toString()
      : "Undated";
    if (!acc[year]) acc[year] = [];
    acc[year].push(ex);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="page exhibitions-page">
      <div className="content-column">
        <h1 className="exhibitions-page__title">Exhibitions</h1>

        {exhibitions.length === 0 && (
          <p className="state-empty">No exhibitions listed yet.</p>
        )}

        {years.map((year) => (
          <section key={year} className="exhibitions-year">
            <h2 className="exhibitions-year__heading">{year}</h2>
            <ul className="exhibitions-list" role="list">
              {byYear[year].map((ex) => (
                <li key={ex.id} className="exhibitions-list__item">
                  <div className="exhibitions-list__meta">
                    <span className="exhibitions-list__type">
                      {ex.exhibition_type === "SOLO" ? "Solo" : "Group"}
                    </span>
                    {ex.start_date && (
                      <span className="exhibitions-list__date">
                        {formatDateRange(ex.start_date, ex.end_date)}
                      </span>
                    )}
                  </div>
                  <div className="exhibitions-list__body">
                    <p className="exhibitions-list__name">{ex.title}</p>
                    {ex.venue && (
                      <p className="exhibitions-list__venue">
                        {[ex.venue, ex.city, ex.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

function formatDateRange(start: string, end: string | null): string {
  const startDate = new Date(start);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (!end) return startDate.toLocaleDateString("en-GB", options);

  const endDate = new Date(end);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    // e.g. "3–24 Nov"
    return `${startDate.getDate()}–${endDate.toLocaleDateString("en-GB", options)}`;
  }
  if (sameYear) {
    // e.g. "3 Nov – 12 Jan"
    return `${startDate.toLocaleDateString("en-GB", options)} – ${endDate.toLocaleDateString("en-GB", options)}`;
  }
  // e.g. "3 Nov 2024 – 12 Jan 2025"
  return `${startDate.toLocaleDateString("en-GB", { ...options, year: "numeric" })} – ${endDate.toLocaleDateString("en-GB", { ...options, year: "numeric" })}`;
}
