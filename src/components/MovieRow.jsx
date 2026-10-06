import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({
  title,
  subtitle,
  movies,
  loading,
  onOpen,
  isFav,
  onToggle,
  action,
}) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({
      left: dir * ref.current.clientWidth * 0.85,
      behavior: "smooth",
    });

  if (!loading && (!movies || movies.length === 0)) return null;

  return (
    <section className="row">
      <header className="row__head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </header>

      <div className="row__wrap">
        <button
          className="row__arrow row__arrow--l"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="row__scroller" ref={ref}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="card__poster skeleton" />
                </div>
              ))
            : movies.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onOpen={onOpen}
                  isFav={isFav(m.id)}
                  onToggle={onToggle}
                />
              ))}
        </div>

        <button
          className="row__arrow row__arrow--r"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}