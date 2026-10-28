import { useEffect, useState } from "react";
import { fetchArtworks } from "../api";
import type { Artwork, PaginatedResponse } from "../types";
import "./EtchingsPage.css";

export default function EtchingsPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchArtworks({ seriesSlug: "etchings", limit: 100 })
      .then((data: PaginatedResponse<Artwork>) => setArtworks(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-loading">Loading</div>;
  if (error) return <div className="state-error">Could not load works.</div>;
  if (artworks.length === 0)
    return <div className="state-empty">No works yet.</div>;

  return (
    <div className="etchings-page">
      {artworks.map((artwork, index) => (
        <section
          key={artwork.id}
          className="etchings-section"
          aria-label={artwork.title}
        >
          <div className="etchings-section__image-wrap">
            <img
              src={
                artwork.image_url ??
                `https://picsum.photos/seed/${artwork.id}/800/1000`
              }
              alt={artwork.title}
              className="etchings-section__img"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>

          <figcaption className="etchings-section__caption">
            <span className="etchings-section__title">{artwork.title}</span>
            <span className="etchings-section__meta">
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
