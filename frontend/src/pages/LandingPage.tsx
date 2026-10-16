import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchArtworks, fetchCurrentExhibition, fetchPosts } from "../api";
import type { Artwork, Exhibition, Post } from "../types/index";
import "./LandingPage.css";

// Carousel

function Carousel({ artworks }: { artworks: Artwork[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(
    function startAutoAdvance() {
      if (artworks.length <= 1) return;

      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % artworks.length);
      }, 4000);

      return function clearOnUnmount() {
        clearInterval(interval);
      };
    },
    [current, artworks.length],
  );

  if (artworks.length === 0) return null;

  const artwork = artworks[current];

  return (
    <div className="carousel">
      <div className="carousel-image-wrapper">
        <img
          src={artwork.image_url}
          alt={`${artwork.title}, ${artwork.year}`}
          className="carousel-image"
        />
      </div>

      <div className="carousel-caption">
        <span className="carousel-title">{artwork.title}</span>
        <span className="carousel-meta">{artwork.year}</span>
        {artwork.medium && (
          <span className="carousel-meta">{artwork.medium.name}</span>
        )}
      </div>

      {/* Dot navigation */}
      <div className="carousel-dots">
        {artworks.map((_, index) => (
          <button
            key={index}
            className={index === current ? "dot dot--active" : "dot"}
            onClick={() => setCurrent(index)}
            aria-label={`Go to artwork ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Current show

function CurrentShow({ exhibition }: { exhibition: Exhibition }) {
  const startYear = new Date(exhibition.start_date).getFullYear();
  const endYear = new Date(exhibition.end_date).getFullYear();
  const dateRange =
    startYear === endYear ? `${startYear}` : `${startYear}–${endYear}`;

  return (
    <section className="landing-section">
      <p className="section-label">
        {exhibition.is_upcoming ? "Upcoming" : "Current"}
      </p>

      <div className="show-body">
        {exhibition.image_url && (
          <img
            src={exhibition.image_url}
            alt={exhibition.title}
            className="show-image"
          />
        )}

        <div className="show-text">
          <h2 className="show-title">{exhibition.title}</h2>
          <p className="show-venue">
            {exhibition.venue_name}, {exhibition.venue_city}
          </p>
          <p className="show-dates">{dateRange}</p>
          {exhibition.description && (
            <p className="show-description">{exhibition.description}</p>
          )}
          <Link to="/exhibitions" className="text-link">
            All exhibitions →
          </Link>
        </div>
      </div>
    </section>
  );
}

// Latest news

function LatestNews({ post }: { post: Post }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <section className="landing-section">
      <p className="section-label">Latest</p>

      <div className="news-body">
        <p className="news-date">{date}</p>
        <h2 className="news-title">
          <Link to={`/texts/${post.slug}`} className="news-title-link">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="news-excerpt">{post.excerpt}</p>}
        <Link to="/texts" className="text-link">
          All texts →
        </Link>
      </div>
    </section>
  );
}

// Page

function LandingPage() {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [currentShow, setCurrentShow] = useState<Exhibition | null>(null);
  const [latestPost, setLatestPost] = useState<Post | null>(null);

  useEffect(function loadFeaturedArtworks() {
    fetchArtworks({ isFeatured: true, pageSize: 8 })
      .then((data) => setFeaturedArtworks(data.results))
      .catch(() => {});
  }, []);

  useEffect(function loadCurrentShow() {
    fetchCurrentExhibition()
      .then((data) => setCurrentShow(data))
      .catch(() => {});
  }, []);

  useEffect(function loadLatestPost() {
    fetchPosts()
      .then((data) => setLatestPost(data[0] ?? null))
      .catch(() => {});
  }, []);

  return (
    <main className="page landing-page">
      {/* Hero */}
      <section className="landing-hero">
        <h1 className="hero-name">Artist Name</h1>
        <p className="hero-tagline">Painter</p>
      </section>

      {/* Carousel */}
      {featuredArtworks.length > 0 && (
        <section className="landing-section">
          <Carousel artworks={featuredArtworks} />
          <div className="carousel-footer">
            <Link to="/paintings" className="text-link">
              View all paintings →
            </Link>
          </div>
        </section>
      )}

      {/* Current show */}
      {currentShow && <CurrentShow exhibition={currentShow} />}

      {/* Latest news */}
      {latestPost && <LatestNews post={latestPost} />}
    </main>
  );
}

export default LandingPage;
