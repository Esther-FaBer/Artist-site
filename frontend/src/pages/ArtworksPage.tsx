import { useEffect, useState } from "react";
import { fetchArtworks, fetchSeries } from "../api";
import type { Artwork, Series, PaginatedResponse } from "../types";
import "./ArtworksPage.css";

const PAGE_SIZE = 24;

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [activeSeries, setActiveSeries] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch series once on mount for filter bar
  useEffect(() => {
    fetchSeries()
      .catch(() => null)
      .then((data) => {
        if (data) setSeries(data);
      });
  }, []);

  // Fetch artworks whenever filter or page changes
  useEffect(() => {
    setLoading(true);
    setError(false);

    const params: Record<string, string | number> = {
      limit: PAGE_SIZE,
      page,
    };
    if (activeSeries !== "all") params.seriesSlug = activeSeries;

    fetchArtworks(params)
      .then((data: PaginatedResponse<Artwork>) => {
        setArtworks(data.data);
        setTotalCount(data.pagination.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [activeSeries, page]);

  function handleSeriesChange(slug: string) {
    setActiveSeries(slug);
    setPage(1);
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }

  function lightboxPrev() {
    setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null));
  }

  function lightboxNext() {
    setLightboxIndex((i) =>
      i !== null ? Math.min(artworks.length - 1, i + 1) : null,
    );
  }

  // Close lightbox on Escape, navigate with arrow keys
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentArtwork =
    lightboxIndex !== null ? artworks[lightboxIndex] : null;

  return (
    <main className="page artworks-page">
      <div className="content-column">
        {/* Series filter */}
        {series.length > 0 && (
          <nav className="artworks-filter" aria-label="Filter by series">
            <button
              className={`artworks-filter__btn${activeSeries === "all" ? " artworks-filter__btn--active" : ""}`}
              onClick={() => handleSeriesChange("all")}
            >
              All
            </button>
            {series.map((s) => (
              <button
                key={s.id}
                className={`artworks-filter__btn${activeSeries === s.slug ? " artworks-filter__btn--active" : ""}`}
                onClick={() => handleSeriesChange(s.slug)}
              >
                {s.name}
              </button>
            ))}
          </nav>
        )}

        {/* States */}
        {loading && <div className="state-loading">Loading</div>}
        {error && <div className="state-error">Could not load artworks.</div>}
        {!loading && !error && artworks.length === 0 && (
          <div className="state-empty">No works in this series yet.</div>
        )}

        {/* Grid */}
        {!loading && !error && artworks.length > 0 && (
          <>
            <ul className="artworks-grid" role="list">
              {artworks.map((artwork, index) => (
                <li key={artwork.id} className="artworks-grid__item">
                  <button
                    className="artworks-grid__btn"
                    onClick={() => openLightbox(index)}
                    aria-label={`View ${artwork.title}`}
                  >
                    <img
                      src={
                        artwork.image_url ??
                        "https://picsum.photos/seed/" + artwork.id + "/600/800"
                      }
                      alt={artwork.title}
                      className="artworks-grid__img"
                      loading="lazy"
                    />
                  </button>
                  <p className="artworks-grid__title">{artwork.title}</p>
                  <p className="artworks-grid__meta">
                    {[artwork.year, artwork.medium?.name]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="artworks-pagination" aria-label="Pagination">
                <button
                  className="artworks-pagination__btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  ←
                </button>
                <span className="artworks-pagination__info">
                  {page} / {totalPages}
                </span>
                <button
                  className="artworks-pagination__btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  →
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && currentArtwork && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={currentArtwork.title}
          onClick={closeLightbox}
        >
          <button
            className="lightbox__close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>

          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              lightboxPrev();
            }}
            disabled={lightboxIndex === 0}
            aria-label="Previous artwork"
          >
            ←
          </button>

          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                currentArtwork.image_url ??
                "https://picsum.photos/seed/" + currentArtwork.id + "/600/800"
              }
              alt={currentArtwork.title}
              className="lightbox__img"
            />
            <div className="lightbox__caption">
              <p className="lightbox__title">{currentArtwork.title}</p>
              <p className="lightbox__meta">
                {[
                  currentArtwork.year,
                  currentArtwork.medium?.name,
                  currentArtwork.dimensions,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>

          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              lightboxNext();
            }}
            disabled={lightboxIndex === artworks.length - 1}
            aria-label="Next artwork"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}
