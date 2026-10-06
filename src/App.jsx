import { useCallback, useMemo, useState } from "react";
import { api, HAS_KEY } from "./api";
import { useAsync, useDebounce, useFavorites } from "./hooks";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MoodPicker, { MOODS } from "./components/MoodPicker";
import MovieRow from "./components/MovieRow";
import MovieGrid from "./components/MovieGrid";
import MovieModal from "./components/MovieModal";

const none = () => Promise.resolve(null);

function topGenres(favs, n = 2) {
  const count = {};
  favs.forEach((f) =>
    (f.genre_ids || []).forEach((g) => (count[g] = (count[g] || 0) + 1))
  );
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([g]) => g);
}

function Setup() {
  return (
    <div className="setup">
      <h1>🎬 Cinemate</h1>
      <p>Add your free TMDB API key to get started.</p>
      <pre>
        {`1. Copy .env.example to .env\n2. Set VITE_TMDB_API_KEY=your_key\n3. Restart: npm run dev`}
      </pre>
    </div>
  );
}

function Main() {
  const { favs, toggle, has } = useFavorites();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("home");
  const [openId, setOpenId] = useState(null);
  const [mood, setMood] = useState(null); // { key, page }

  const dq = useDebounce(query.trim(), 450);
  const searching = dq.length > 1;

  const closeModal = useCallback(() => setOpenId(null), []);

  const trending = useAsync((s) => api.trending(s), []);
  const popular = useAsync((s) => api.popular(s), []);
  const top = useAsync((s) => api.topRated(s), []);

  const search = useAsync(
    (s) => (searching ? api.search(dq, s) : none()),
    [dq, searching]
  );

  const moodObj = MOODS.find((m) => m.key === mood?.key);
  const moodRes = useAsync(
    (s) => (moodObj ? api.discover(moodObj.genres, mood.page, s) : none()),
    [mood?.key, mood?.page]
  );

  const last = favs[0];
  const because = useAsync(
    (s) => (last ? api.recommendations(last.id, s) : none()),
    [last?.id]
  );

  const tg = useMemo(() => topGenres(favs).join(","), [favs]);
  const taste = useAsync(
    (s) => (tg ? api.discover(tg, 1, s) : none()),
    [tg]
  );

  const notFav = (arr) => (arr || []).filter((m) => !has(m.id));

  const pickMood = (key) =>
    setMood((cur) =>
      cur?.key === key ? null : { key, page: 1 }
    );
  const shuffle = () =>
    setMood((cur) => cur && { ...cur, page: 1 + Math.floor(Math.random() * 6) });

  const goHome = () => {
    setQuery("");
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goList = () => {
    setQuery("");
    setView("list");
    window.scrollTo({ top: 0 });
  };

  const common = { onOpen: setOpenId, isFav: has, onToggle: toggle };

  let content;
  if (searching) {
    content = (
      <MovieGrid
        title={`Results for “${dq}”`}
        movies={search.data}
        loading={search.loading}
        empty="No movies found. Try another title."
        {...common}
      />
    );
  } else if (view === "list") {
    content = (
      <MovieGrid
        title="My List"
        subtitle="Saved on this device"
        movies={favs}
        empty="Nothing here yet — tap ♥ on any movie to save it."
        {...common}
      />
    );
  } else {
    content = (
      <>
        <MoodPicker active={mood?.key} onPick={pickMood} />

        {moodObj && (
          <MovieRow
            title={`${moodObj.emoji} ${moodObj.label} picks`}
            subtitle="Popular, well-voted movies for your mood"
            movies={moodRes.data}
            loading={moodRes.loading}
            action={
              <button className="btn btn--ghost btn--sm" onClick={shuffle}>
                ⟳ Shuffle
              </button>
            }
            {...common}
          />
        )}

        {favs.length > 0 && (
          <>
            <MovieRow
              title={`Because you liked ${last.title}`}
              movies={notFav(because.data)}
              loading={because.loading}
              {...common}
            />
            <MovieRow
              title="Picked for your taste"
              subtitle="Based on genres in your list"
              movies={notFav(taste.data)}
              loading={taste.loading}
              {...common}
            />
          </>
        )}

        <MovieRow
          title="Trending now"
          movies={trending.data}
          loading={trending.loading}
          {...common}
        />
        <MovieRow
          title="Popular"
          movies={popular.data}
          loading={popular.loading}
          {...common}
        />
        <MovieRow
          title="Top rated"
          movies={top.data}
          loading={top.loading}
          {...common}
        />
      </>
    );
  }

  const showHero = !searching && view === "home";

  return (
    <>
      <Navbar
        query={query}
        onQuery={setQuery}
        onHome={goHome}
        onList={goList}
        count={favs.length}
        view={searching ? "search" : view}
      />

      {showHero && <Hero movies={trending.data} {...common} />}

      <main className={`content ${showHero ? "content--hero" : ""}`}>
        {trending.error && (
          <div className="alert">
            Couldn't reach TMDB. Check your API key and internet connection.
          </div>
        )}
        {content}
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>

      {openId && (
        <MovieModal
          id={openId}
          onClose={closeModal}
          onOpen={setOpenId}
          isFav={has}
          onToggle={toggle}
        />
      )}
    </>
  );
}

export default function App() {
  return HAS_KEY ? <Main /> : <Setup />;
}