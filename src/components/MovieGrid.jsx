import MovieCard from "./MovieCard";

export default function MovieGrid({
  title,
  subtitle,
  movies,
  loading,
  empty,
  onOpen,
  isFav,
  onToggle,
}) {
  return (
    <section className="grid-sec">
      <header className="row__head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </header>

      {loading ? (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card">
              <div className="card__poster skeleton" />
            </div>
          ))}
        </div>
      ) : movies && movies.length ? (
        <div className="grid">
          {movies.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              onOpen={onOpen}
              isFav={isFav(m.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <div className="empty">{empty}</div>
      )}
    </section>
  );
}