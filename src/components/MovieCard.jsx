import { img, year, rating } from "../api";

export default function MovieCard({ movie, onOpen, isFav, onToggle }) {
  const src = img(movie.poster_path, "w342");

  return (
    <article
      className="card"
      tabIndex={0}
      onClick={() => onOpen(movie.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(movie.id)}
    >
      <div className="card__poster">
        {src ? (
          <img src={src} alt={movie.title} loading="lazy" draggable="false" />
        ) : (
          <div className="card__noimg">{movie.title}</div>
        )}
        <span className="badge">★ {rating(movie.vote_average)}</span>
        <button
          className={`heart ${isFav ? "is-on" : ""}`}
          aria-label={isFav ? "Remove from My List" : "Add to My List"}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(movie);
          }}
        >
          ♥
        </button>
      </div>
      <h3 className="card__title">{movie.title}</h3>
      <p className="card__meta">{year(movie.release_date)}</p>
    </article>
  );
}