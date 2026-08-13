# Netflix Clone — Project Plan

A static, front-end-only Netflix clone built with plain HTML, CSS, and JavaScript (no frameworks, no build tools).

## 1. Goal

Recreate the look and core browsing experience of Netflix's web UI:
- Landing/login screen
- Browse screen with hero banner + horizontally scrolling movie rows
- Modal with movie details on click
- Basic search and category filtering
- Responsive layout (desktop, tablet, mobile)

Data can come from a free API (e.g. TMDb) or a local JSON file of mock movies — no backend/auth required.

## 2. Tech Stack

- **HTML5** — semantic structure
- **CSS3** — Flexbox/Grid, custom properties, transitions/animations, media queries
- **Vanilla JavaScript (ES6+)** — DOM manipulation, fetch API, event handling
- **Optional**: TMDb API for real movie data + posters (requires free API key)
- **No frameworks/libraries** — no React, no jQuery, no build tools

## 3. File Structure

```
netflix-clone/
├── index.html          # Landing/login page
├── browse.html         # Main browse page
├── css/
│   ├── style.css        # Shared styles (nav, fonts, variables)
│   ├── landing.css       # Landing page specific
│   └── browse.css       # Browse page specific
├── js/
│   ├── config.js         # API key / constants
│   ├── api.js             # Fetch calls to movie data source
│   ├── landing.js         # Landing page interactions
│   ├── browse.js          # Row rendering, hero banner, modal logic
│   └── search.js          # Search/filter logic
├── data/
│   └── movies.json        # Fallback mock data if not using an API
├── assets/
│   ├── logo.svg
│   └── icons/
└── README.md
```

## 4. Pages & Components

### 4.1 Landing Page (`index.html`)
- Netflix-style hero background image/video
- Logo, "Sign In" button, email input CTA
- Simple footer (FAQ, language selector — static, non-functional)

### 4.2 Browse Page (`browse.html`)
- **Navbar**: logo, nav links (Home, TV Shows, Movies, My List), search icon, profile icon
- **Hero banner**: large featured title with backdrop image, title, description, Play/More Info buttons
- **Content rows**: horizontally scrollable rows per category (Trending, Top Rated, Action, Comedy, etc.), each row is a set of poster cards
- **Card hover effect**: scale-up + show title/rating/buttons (like Netflix)
- **Modal**: click a card → popup with larger image, description, cast/genre, "Play"/"Add to List" buttons
- **Search**: filter cards live as user types
- **My List**: ability to add/remove titles, stored in `localStorage`

## 5. Build Phases

| Phase | Task | Output |
|-------|------|--------|
| 1 | Project scaffolding, folder structure, base CSS reset & variables | Empty but structured project |
| 2 | Landing page markup + styling | Working `index.html` |
| 3 | Navbar + hero banner (browse page) | Static browse layout |
| 4 | Movie data layer (JSON or TMDb fetch) | `api.js` returns movie arrays |
| 5 | Render content rows dynamically from data | Rows populated with real cards |
| 6 | Card hover interactions + scroll behavior | Netflix-like row scrolling |
| 7 | Modal for movie details | Click-to-expand works |
| 8 | Search + category filter | Live filtering |
| 9 | My List (localStorage persistence) | Add/remove titles, persists on reload |
| 10 | Responsive design pass (mobile/tablet breakpoints) | Fully responsive |
| 11 | Polish: loading states, transitions, error handling | Production-ready feel |
| 12 | Deploy (GitHub Pages / Netlify / Vercel static hosting) | Live URL |

## 6. Data Model (example)

```json
{
  "id": 1,
  "title": "Sample Movie",
  "description": "A short synopsis of the movie.",
  "posterUrl": "assets/posters/sample.jpg",
  "backdropUrl": "assets/backdrops/sample.jpg",
  "genre": ["Action", "Thriller"],
  "rating": "8.2",
  "year": 2023,
  "category": "trending"
}
```

## 7. Stretch Goals (optional, after MVP)

- Auto-playing muted trailer preview on hover (using `<video>` or YouTube embed)
- Multiple user profiles (client-side only, stored in `localStorage`)
- Dark/light theme toggle
- Keyboard navigation for rows (arrow keys)
- Skeleton loading placeholders while data fetches

## 8. Out of Scope

- Real authentication / user accounts
- Payment/subscription flow
- Actual video streaming/DRM
- Backend/database — everything is static or client-side only
