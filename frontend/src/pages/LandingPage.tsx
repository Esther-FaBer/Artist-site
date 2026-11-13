import { useState, useEffect } from "react";
import { fetchPosts } from "../api";
import type { Post } from "../types/index";
import "./LandingPage.css";

function LandingPage() {
  const [latestPost, setLatestPost] = useState<Post | null>(null);

  useEffect(function loadLatestPost() {
    fetchPosts()
      .then((data) => setLatestPost(data[0] ?? null))
      .catch(() => {});
  }, []);

  return (
    <main className="page landing-page">
      {/* TODO: Add artist name */}
      <section className="landing-hero">
        <h1 className="hero-name">Maite Cascón</h1>
        <p className="hero-tagline">Painter</p>
      </section>

      {latestPost && (
        <section className="landing-news">
          <p className="landing-news__label">Latest</p>
          <p className="landing-news__title">{latestPost.title}</p>
          {latestPost.author && (
            <p className="landing-news__author">{latestPost.author}</p>
          )}
        </section>
      )}
    </main>
  );
}

export default LandingPage;
