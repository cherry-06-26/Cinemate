# 🎬 Cinemate

A premium, responsive movie recommendation app built with React + Vite and the TMDB API.

## Features
- Trending hero carousel, popular and top-rated rows
- Mood picker (feel-good, adrenaline, spooky, …) with shuffle
- Live search with debounce
- My List (saved locally) → "Because you liked …" and "Picked for your taste"
- Movie details, trailers, and "More like this"

## Run locally
```bash
npm install
cp .env.example .env   # add your TMDB v3 API key
npm run dev
```

## Build
```bash
npm run build
```

Note: the key is bundled into the client build (normal for TMDB v3 keys).
Never commit your `.env` file.

Data provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.