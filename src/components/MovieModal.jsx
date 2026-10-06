import { useEffect, useRef, useState } from "react";
import { api, img, year, rating, runtime } from "../api";
import { useAsync } from "../hooks";
import MovieRow from "./MovieRow";

export default function MovieModal({ id, onClose, onOpen, isFav, onToggle }) {
  const { data: m, loading, error } = useAsync((s) => api.details(id, s), [id]);
  const [playing, setPlaying] = useState(false);
  const panel = useRef(null);

  useEffect(() => {
    setPlaying(false);
    panel.current?.scrollTo({ top: 0 });
  }, [id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const videos = m?.videos?.results || [];
  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube");
  const recs = (m?.recommendations?.results || []).filter((r) => r.poster_path);

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__panel"
        ref={panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {loading && <div className="modal__loading skeleton" />}
        {error && <div className="empty">Couldn't load this movie.</div>}

        {m && (
          <>
            <div className="modal__media">
              {playing && trailer ? (
                <iframe
                  title="Trailer"
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              ) : (
                <>
                  {m.backdrop_path && (
                    <img src={img(m.backdrop_path, "w1280")} alt="" />
                  )}
                  <div className="modal__shade" />
                  {trailer && (
                    <button
                      className="modal__play"
                      onClick={() => setPlaying(true)}
                      aria-label="Play trailer"
                    >
                      ▶
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="modal__body">
              <h2>{m.title}</h2>
              {m.tagline && <p className="modal__tag">{m.tagline}</p>}

              <p className="modal__meta">
                <span className="pill pill--star">★ {rating(m.vote_average)}</span>
                {year(m.release_date) && <span>{year(m.release_date)}</span>}
                {runtime(m.runtime) && <span>{runtime(m.runtime)}</span>}
              </p>

              <div className="modal__genres">
                {(m.genres || []).map((g) => (
                  <span className="pill" key={g.id}>
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="modal__overview">
                {m.overview || "No overview available."}
              </p>

              <div className="hero__actions">
                {trailer && !playing && (
                  <button
                    className="btn btn--primary"
                    onClick={() => setPlaying(true)}
                  >
                    ▶ Watch trailer
                  </button>
                )}
                <button className="btn btn--ghost" onClick={() => onToggle(m)}>
                  {isFav(m.id) ? "✓ In My List" : "+ My List"}
                </button>
              </div>
            </div>

            <MovieRow
              title="More like this"
              movies={recs}
              onOpen={onOpen}
              isFav={isFav}
              onToggle={onToggle}
            />
          </>
        )}
      </div>
    </div>
  );
}