import { useEffect, useState } from "react";

export default function Navbar({ query, onQuery, onHome, onList, count, view }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <button className="nav__logo" onClick={onHome} aria-label="Home">
        <span className="nav__logo-mark">▶</span> Cinemate
      </button>

      <label className="nav__search">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4"
          />
        </svg>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search movies…"
          aria-label="Search movies"
        />
        {query && (
          <button
            type="button"
            className="nav__clear"
            onClick={() => onQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </label>

      <button
        className={`nav__list ${view === "list" ? "is-active" : ""}`}
        onClick={onList}
      >
        ♥ <span className="nav__list-text">My List</span>
        {count > 0 && <b>{count}</b>}
      </button>
    </header>
  );
}