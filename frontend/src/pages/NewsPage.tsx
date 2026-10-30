import { useEffect, useState } from "react";
import { fetchPosts } from "../api";
import type { Post } from "../types";
import "./NewsPage.css";

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="state-loading">Loading</div>;
  if (error) return <div className="state-error">Could not load news.</div>;
  if (posts.length === 0)
    return <div className="state-empty">No news yet.</div>;

  return (
    <main className="page news-page">
      <ul className="news-list" role="list">
        {posts.map((post) => (
          <li key={post.id} className="news-list__item">
            <a
              href={post.source_url ?? "#"}
              className="news-list__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="news-list__body">
                <span className="news-list__title">{post.title}</span>
                {post.author && (
                  <span className="news-list__author">{post.author}</span>
                )}
              </div>
              <div className="news-list__right">
                {post.published_at && (
                  <span className="news-list__date">
                    {new Date(post.published_at).getFullYear()}
                  </span>
                )}
                <span className="news-list__arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
