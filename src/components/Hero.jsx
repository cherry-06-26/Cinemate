import { useEffect, useMemo, useState } from "react";
import { img, year, rating } from "../api";

export default function Hero({ movies, onOpen, isFav, onToggle }) {
  const list = useMemo(
    () => (movies || []).filter((m) => m.backdrop_path).slice(0, 6),
    [movies]
  );
  const [i, setI] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % list.length), 8000);
    return () => clearInterval(t);
  }, [list]);

  const m = list[i];
  if (!m) return <div className="hero skeleton" />;

  return (
    <section className="hero">
      <div className="hero__slide" key={m.id}>
        <img
          className="hero__img"
          src={img(m.backdrop_path, "w1280")}
          alt=""
          fetchpriority="high"
        />
        <div className="hero__shade" />
        <div className="hero__body">
          <span className="hero__tag">Trending this week</span>
          <h1>{m.title}</h1>
          <p className="hero__meta">
            <span>★ {rating(m.vote_average)}</span>
            <span>{year(m.release_date)}</span>
          </p>
          <p className="hero__overview">{m.overview}</p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => onOpen(m.id)}>
              ▶ Details
            </button>
            <button className="btn btn--ghost" onClick={() => onToggle(m)}>
              {isFav(m.id) ? "✓ In My List" : "+ My List"}
            </button>
          </div>
        </div>
      </div>

      <div className="hero__dots">
        {list.map((x, idx) => (
          <button
            key={x.id}
            className={idx === i ? "is-on" : ""}
            onClick={() => setI(idx)}
            aria-label={`Show ${x.title}`}
          />
        ))}
      </div>
    </section>
  );
}