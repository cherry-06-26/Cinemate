const KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export const HAS_KEY = Boolean(KEY && KEY !== "your_tmdb_v3_api_key_here");

export const img = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const year = (d) => (d ? d.slice(0, 4) : "");
export const rating = (v) => (v ? v.toFixed(1) : "–");
export const runtime = (min) =>
  min ? `${Math.floor(min / 60)}h ${min % 60}m` : "";

const cache = new Map();

async function get(path, params = {}, signal) {
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });
  const id = url.toString();
  if (cache.has(id)) return cache.get(id);

  const res = await fetch(id, { signal });
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  const data = await res.json();
  cache.set(id, data);
  return data;
}

const results = (p) => p.then((d) => d.results || []);

export const api = {
  trending: (s) => results(get("/trending/movie/week", {}, s)),
  popular: (s) => results(get("/movie/popular", {}, s)),
  topRated: (s) => results(get("/movie/top_rated", {}, s)),
  search: (q, s) =>
    results(get("/search/movie", { query: q, include_adult: false }, s)),
  details: (id, s) =>
    get(`/movie/${id}`, { append_to_response: "videos,recommendations" }, s),
  recommendations: (id, s) => results(get(`/movie/${id}/recommendations`, {}, s)),
  discover: (genres, page = 1, s) =>
    results(
      get(
        "/discover/movie",
        {
          with_genres: genres,
          sort_by: "popularity.desc",
          "vote_count.gte": 300,
          include_adult: false,
          page,
        },
        s
      )
    ),
};
