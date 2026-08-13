# Netflix Clone — Build Prompts

Copy/paste these prompts one at a time (into Claude, another AI tool, or use as a personal checklist) to build the project step by step. They follow the phases in `plan.md`.

---

## Master Prompt (all-in-one, if you want it in a single pass)

```
Build a Netflix clone using only HTML, CSS, and vanilla JavaScript — no
frameworks, no build tools, no backend. It should include:

1. A landing page (index.html) with a Netflix-style hero image, logo,
   and "Sign In" button.
2. A browse page (browse.html) with:
   - A fixed navbar (logo, nav links, search icon, profile icon) that
     becomes solid on scroll
   - A large hero banner showing a featured title with a backdrop image,
     title, description, and Play / More Info buttons
   - Several horizontally scrollable rows of movie posters, grouped by
     category (e.g. Trending Now, Top Rated, Action, Comedy)
   - Hover effect on posters: scale up and reveal title, rating, and
     quick-action buttons (Play, Add to List, More Info)
   - A modal that opens when a poster is clicked, showing a larger
     image, description, genre tags, and action buttons
   - A working search bar that filters posters live as the user types
   - A "My List" feature that adds/removes titles and persists using
     localStorage
3. Use a local JSON file (data/movies.json) with ~20-30 mock movies as
   the data source (title, description, posterUrl, backdropUrl, genre,
   rating, year, category). Use placeholder image URLs (e.g. via
   picsum.photos or placehold.co) for posters/backdrops.
4. Fully responsive design: works on desktop, tablet, and mobile.
5. Match Netflix's dark theme aesthetic: black background, red accent
   (#E50914), white text, clean sans-serif font (e.g. system font stack
   or "Helvetica Neue").

Organize the code into a clear folder structure (index.html, browse.html,
css/, js/, data/, assets/). Keep JS modular — separate files for API/data
loading, row rendering, modal logic, and search. Add comments explaining
key sections.
```

---

## Step-by-Step Prompts (recommended — build incrementally)

### 1. Scaffolding
```
Set up the folder structure for a vanilla HTML/CSS/JS Netflix clone:
index.html, browse.html, css/style.css, css/landing.css, css/browse.css,
js/api.js, js/landing.js, js/browse.js, js/search.js, data/movies.json,
assets/. Include a CSS reset and root-level CSS variables for the
Netflix color palette (black background #141414, red accent #E50914,
white text, gray secondary text).
```

### 2. Landing Page
```
Build index.html and css/landing.css: a Netflix-style landing page with
a full-screen hero background image, a translucent dark overlay, the
Netflix-style logo (text-based is fine) top-left, a "Sign In" button
top-right, a centered headline, subtext, an email input field, and a
"Get Started" button. Add a subtle fade-in animation on load.
```

### 3. Navbar + Hero Banner (Browse Page)
```
Build the top of browse.html: a fixed navbar with logo, nav links
(Home, TV Shows, Movies, My List), a search icon that expands into an
input on click, and a profile icon. Make the navbar transparent at the
top of the page and turn solid black on scroll (use JS scroll listener).
Below it, add a hero banner section with a large backdrop image,
gradient overlay, movie title, short description, and Play / More Info
buttons.
```

### 4. Mock Data + Data Layer
```
Create data/movies.json with 25 mock movies across categories:
trending, top-rated, action, comedy, horror, documentary. Each movie
needs: id, title, description, posterUrl, backdropUrl, genre array,
rating, year, category. Use placehold.co or picsum.photos URLs for
images. Then write js/api.js with a function getMovies() that fetches
and returns this JSON, and getMoviesByCategory(category) that filters it.
```

### 5. Render Content Rows
```
Write js/browse.js to dynamically render horizontally scrollable rows
of movie posters on browse.html, one row per category from movies.json.
Each row should have a category title and a horizontally scrollable
container of poster cards (use overflow-x with hidden scrollbar, or add
left/right arrow buttons that scroll the row on click).
```

### 6. Poster Hover Interactions
```
Add CSS/JS so that hovering a poster card scales it up slightly, adds a
shadow, and after a short delay reveals an expanded info panel with the
title, rating, year, and small Play/Add/More-Info icon buttons —
similar to Netflix's card hover behavior. Ensure it doesn't break the
row layout for neighboring cards.
```

### 7. Movie Detail Modal
```
Add a modal that opens when a poster or its "More Info" button is
clicked. It should show a larger backdrop image, the title, description,
genre tags, rating, year, and Play / Add-to-List buttons. Close on
clicking outside the modal, an X button, or the Escape key. Animate the
modal open/close with a scale+fade transition.
```

### 8. Search
```
Implement live search in js/search.js: as the user types in the navbar
search input, filter and display matching movies (by title) in a
dedicated results view, replacing the normal rows. Show "No results
found" if nothing matches. Clear search and return to normal browse view
when the input is emptied or the search icon is closed.
```

### 9. My List (localStorage)
```
Add "Add to My List" functionality: clicking the button on a card or in
the modal adds that movie's id to an array in localStorage (and updates
the button to "Remove from My List"). Add a "My List" row/page on
browse.html that reads from localStorage and displays only those movies.
```

### 10. Responsive Pass
```
Audit browse.html and index.html for responsiveness. Add media queries
so that: the navbar collapses sensibly on mobile (hide nav links behind
a hamburger menu or keep them minimal), poster rows scroll well via
touch, the hero banner text/buttons resize, and the modal fits mobile
screens without overflow.
```

### 11. Polish
```
Add finishing touches: a loading spinner/skeleton while movies.json
loads, smooth scroll-snap behavior on the poster rows, subtle
page-load fade-ins, and basic error handling if the JSON fails to load
(show a friendly message). Double-check color contrast and hover states
match Netflix's dark UI conventions.
```

---

## Tips When Using These Prompts

- Run them **in order** — each builds on files created by the previous one.
- After each step, open the files in a browser (or a local dev server
  like `npx serve` or the VS Code "Live Server" extension) to check
  progress before moving on.
- If you want real movie posters/data instead of mock JSON, swap Step 4
  for: *"Rewrite js/api.js to fetch from the TMDb API (https://api.themoviedb.org)
  using a free API key, instead of the local JSON file."*
