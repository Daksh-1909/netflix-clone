# Netflix Clone (Vanilla HTML5 / CSS3 / ES6 JavaScript)

A high-fidelity Netflix web application clone built with modern vanilla web technologies, without external frameworks or build tooling.

## 🚀 Features

- **Landing Page (`index.html`)**:
  - Fullscreen Netflix hero backdrop with dark gradient vignette
  - Email CTA input with client-side validation leading directly to the Browse interface
  - Interactive feature spotlight sections (TV, Mobile Downloads, Multi-Device, Kids Profiles)
  - Smooth animated FAQ accordion
  - Netflix footer with multi-column layout and language switcher

- **Browse & Streaming Experience (`browse.html`)**:
  - **Fixed Translucent Navbar**: Transforms from transparent to solid black on scroll, complete with category links, notifications bell, user avatar, and live expandable search.
  - **Cinematic Hero Banner**: Featured high-impact title with wide backdrop, metadata tags, Play and More Info actions, maturity rating badge, and audio toggle.
  - **Horizontally Scrollable Content Rows**: Categorized rows ("Trending Now", "Netflix Originals", "Top Rated", "Action & Sci-Fi", "Comedies", "Suspense & Thrillers", "Documentaries", and "My List") with smooth slider chevron arrow navigation.
  - **Netflix-Style Card Hover Previews**: Delay-hover animation with card scale-up, backdrop preview, quick action buttons (Play, My List, Like, More Info), match score, maturity rating, duration, and genre tags.
  - **Interactive Movie Detail Modal**: High-resolution backdrop hero with video trailer playback simulation, full synopsis, cast & crew metadata, audio controls, and a "More Like This" recommendations grid.
  - **Live Search**: Debounced instant search filtering across titles, genres, and cast, with a dedicated results grid and helpful "No results found" suggestions.
  - **My List (Watchlist)**: LocalStorage-backed watchlist synchronization across card buttons, hero banner, modal, and dedicated My List view with real-time toast notifications.

## 📁 File Structure

```
netflix-clone/
├── index.html          # Landing / Sign-in CTA page
├── browse.html         # Main Netflix browse page
├── css/
│   ├── style.css       # Global design tokens, reset, typography & buttons
│   ├── landing.css     # Landing page styles & FAQ accordion
│   └── browse.css      # Browse page, navbar, rows, card hover previews & modal
├── js/
│   ├── config.js       # Configuration constants & categories
│   ├── api.js          # Movie data access layer with fallback support
│   ├── landing.js      # Landing page interactivity & form validation
│   ├── browse.js       # Main browse controller, hero carousel & slider logic
│   ├── modal.js        # Movie details modal & trailer preview player
│   ├── search.js       # Real-time search & category navigation
│   └── mylist.js       # Watchlist state management & toast notifications
├── data/
│   └── movies.json     # Mock database of 28+ movies & TV shows
└── README.md           # Documentation
```

## 🛠️ How to Run

You can open the project in any modern web browser or start a static web server:

### Option 1: Using Python
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

### Option 2: Using Node.js / npx
```bash
npx serve .
```

### Option 3: Direct File
Double-click `index.html` or `browse.html` to open directly in Chrome, Edge, Safari, or Firefox.
