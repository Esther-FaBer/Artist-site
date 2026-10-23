import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPost } from "../api";
import type { Post } from "../types";
import "./PostPage.css";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    fetchPost(slug)
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="state-loading">Loading</div>;
  if (error || !post) return <div className="state-error">Post not found.</div>;

  const dateFormatted = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="page post-page">
      <div className="content-column">
        <Link to="/texts" className="post-page__back text-link">
          ← Texts
        </Link>

        <header className="post-page__header">
          {post.type && (
            <p className="post-page__type">{post.type.toLowerCase()}</p>
          )}
          <h1 className="post-page__title">{post.title}</h1>
          {(post.author || dateFormatted) && (
            <p className="post-page__byline">
              {[post.author, dateFormatted].filter(Boolean).join(" · ")}
            </p>
          )}
        </header>

        {post.body && (
          <div className="post-page__body">
            {post.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {post.source_url && (
          <a
            href={post.source_url}
            className="post-page__source text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read original ↗
          </a>
        )}
      </div>
    </main>
  );
}
