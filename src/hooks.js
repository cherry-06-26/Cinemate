import { useCallback, useEffect, useState } from "react";

export function useDebounce(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fn(ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError")
          setState({ data: null, loading: false, error });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

const slim = (m) => ({
  id: m.id,
  title: m.title,
  overview: m.overview,
  poster_path: m.poster_path,
  backdrop_path: m.backdrop_path,
  vote_average: m.vote_average,
  release_date: m.release_date,
  genre_ids: m.genre_ids || (m.genres || []).map((g) => g.id),
});

export function useFavorites() {
  const [favs, setFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cinemate:favs")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cinemate:favs", JSON.stringify(favs));
    } catch {
      /* storage unavailable */
    }
  }, [favs]);

  const toggle = useCallback((m) => {
    setFavs((prev) =>
      prev.some((f) => f.id === m.id)
        ? prev.filter((f) => f.id !== m.id)
        : [slim(m), ...prev]
    );
  }, []);

  const has = useCallback((id) => favs.some((f) => f.id === id), [favs]);

  return { favs, toggle, has };
}