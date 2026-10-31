import { useEffect, useState } from "react";
import { fetchArtworks } from "../api";
import type { Artwork, PaginatedResponse } from "../types";
import "./StudiesPage.css";

export default function StudiesPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchArtworks({ seriesSlug: "studies", limit: 100 })
      .then((data: PaginatedResponse<Artwork>) => setArtworks(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-loading">Loading</div>;
  if (error) return <div className="state-error">Could not load works.</div>;
  if (artworks.length === 0)
    return <div className="state-empty">No works yet.</div>;

  return (
    <div className="studies-page">
      {artworks.map((artwork, index) => (
        <section
          key={artwork.id}
          className="studies-section"
          aria-label={artwork.title}
        >
          <div className="studies-section__image-wrap">
            <img
              src={
                artwork.image_url ??
                `https://picsum.photos/seed/${artwork.id}/800/1000`
              }
              alt={artwork.title}
              className="studies-section__img"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>

          <figcaption className="studies-section__caption">
            <span className="studies-section__title">{artwork.title}</span>
            <span className="studies-section__meta">
              {[artwork.year, artwork.medium?.name, artwork.dimensions]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </figcaption>
        </section>
      ))}
    </div>
  );
}
