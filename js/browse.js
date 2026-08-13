const BrowseRenderer = (() => {
  let featuredHeroMovie = null;

  async function init() {
    initNavbarScroll();
    initNotifications();
    initMobileNav();
    MovieModal.init();
    SearchManager.init();

    MyListManager.subscribe(() => {
      syncMyListRow();
    });

    await setupHeroBanner();
    await renderAllRows();
  }

  function initNavbarScroll() {
    const navbar = document.getElementById('browse-navbar');
    if (!navbar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            navbar.classList.add('nav-scrolled');
          } else {
            navbar.classList.remove('nav-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initNotifications() {
    const bellBtn = document.getElementById('nav-bell-btn');
    const dropdown = document.getElementById('nav-notifications-dropdown');
    if (!bellBtn || !dropdown) return;

    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== bellBtn) {
        dropdown.classList.remove('active');
      }
    });
  }

  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-primary-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  async function setupHeroBanner() {
    const movies = await MovieAPI.getAllMovies();
    const heroPool = movies.filter(m => ['m1', 'm2', 'm3', 'm17', 'm7'].includes(m.id));
    featuredHeroMovie = heroPool[Math.floor(Math.random() * heroPool.length)] || movies[0];

    const heroImg = document.getElementById('hero-backdrop-img');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-description');
    const heroPlayBtn = document.getElementById('hero-play-btn');
    const heroInfoBtn = document.getElementById('hero-info-btn');
    const heroMaturity = document.getElementById('hero-maturity');
    const heroSoundBtn = document.getElementById('hero-sound-btn');

    if (!featuredHeroMovie) return;

    heroImg.src = featuredHeroMovie.backdropUrl || featuredHeroMovie.posterUrl;
    heroImg.alt = "";
    heroTitle.textContent = featuredHeroMovie.title;
    heroDesc.textContent = featuredHeroMovie.description;
    if (heroMaturity) heroMaturity.textContent = featuredHeroMovie.maturity || '16+';

    heroPlayBtn.onclick = () => {
      MovieModal.open(featuredHeroMovie.id);
    };

    heroInfoBtn.onclick = () => {
      MovieModal.open(featuredHeroMovie.id);
    };

    if (heroSoundBtn) {
      heroSoundBtn.onclick = () => {
        const isMuted = heroSoundBtn.classList.toggle('muted');
        MyListManager.showToast(isMuted ? 'Audio muted' : 'Audio unmuted');
      };
    }
  }

  async function renderAllRows() {
    const rowsContainer = document.getElementById('browse-main-rows');
    if (!rowsContainer) return;
    rowsContainer.innerHTML = '';

    const myListRow = await createMyListRowElement();
    if (myListRow) {
      rowsContainer.appendChild(myListRow);
    }

    for (const category of CONFIG.CATEGORIES) {
      const movies = await MovieAPI.getMoviesByCategory(category.id);
      if (movies.length > 0) {
        const row = createCategoryRowElement(category.title, movies, category.id);
        rowsContainer.appendChild(row);
      }
    }
  }

  function createCategoryRowElement(title, movies, categoryId = '') {
    const rowSection = document.createElement('section');
    rowSection.className = 'content-row-section';
    rowSection.setAttribute('data-category-id', categoryId);

    rowSection.innerHTML = `
      <div class="row-header">
        <h2 class="row-title">
          <span>${title}</span>
          <span class="row-explore-label">Explore All &gt;</span>
        </h2>
      </div>

      <div class="row-slider-wrapper">
        <button class="slider-arrow slider-arrow-left" aria-label="Scroll left" style="display: none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="row-cards-container"></div>

        <button class="slider-arrow slider-arrow-right" aria-label="Scroll right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;

    const cardsContainer = rowSection.querySelector('.row-cards-container');
    movies.forEach(movie => {
      const card = createPosterCard(movie);
      cardsContainer.appendChild(card);
    });

    setupRowSlider(rowSection);
    return rowSection;
  }

  function createPosterCard(movie) {
    const card = document.createElement('div');
    card.className = 'poster-card';
    card.setAttribute('data-movie-id', movie.id);
    const inList = MyListManager.isInList(movie.id);

    card.innerHTML = `
      <div class="card-media-wrap">
        <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy" class="card-poster-img">
        ${movie.isOriginal ? '<span class="badge badge-original card-original-badge">N SERIES</span>' : ''}
      </div>

      <div class="card-hover-panel">
        <div class="hover-panel-media">
          <img src="${movie.backdropUrl || movie.posterUrl}" alt="" class="hover-backdrop-img">
          <div class="hover-title-overlay">${movie.title}</div>
        </div>

        <div class="hover-panel-body">
          <div class="hover-actions-row">
            <div class="hover-actions-left">
              <button class="btn-icon btn-icon-sm btn-icon-white btn-play-card" title="Play">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </button>
              
              <button class="btn-icon btn-icon-sm ${inList ? 'active' : ''}" data-mylist-btn="${movie.id}" title="${inList ? 'Remove from My List' : 'Add to My List'}">
                ${inList ? `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ` : `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                `}
              </button>

              <button class="btn-icon btn-icon-sm btn-like-card" title="I like this">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              </button>
            </div>

            <button class="btn-icon btn-icon-sm btn-info-card" title="Episode & info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>

          <div class="hover-meta-row">
            <span class="badge-match">${movie.matchScore || 95}% Match</span>
            <span class="badge badge-age">${movie.maturity || '16+'}</span>
            <span class="hover-duration">${movie.duration}</span>
            <span class="badge badge-quality">${movie.quality || 'HD'}</span>
          </div>

          <div class="hover-genres-row">
            ${(movie.genres || []).slice(0, 3).map(g => `<span class="hover-genre-tag">${g}</span>`).join('<span class="genre-dot">•</span>')}
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-icon')) return;
      MovieModal.open(movie.id);
    });

    const playBtn = card.querySelector('.btn-play-card');
    const infoBtn = card.querySelector('.btn-info-card');
    const myListBtn = card.querySelector(`[data-mylist-btn="${movie.id}"]`);
    const likeBtn = card.querySelector('.btn-like-card');

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        MovieModal.open(movie.id);
      });
    }

    if (infoBtn) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        MovieModal.open(movie.id);
      });
    }

    if (myListBtn) {
      myListBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        MyListManager.toggle(movie.id);
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        likeBtn.classList.toggle('active');
        MyListManager.showToast(`Rated "${movie.title}" 👍`);
      });
    }

    return card;
  }

  function setupRowSlider(rowSection) {
    const container = rowSection.querySelector('.row-cards-container');
    const leftArrow = rowSection.querySelector('.slider-arrow-left');
    const rightArrow = rowSection.querySelector('.slider-arrow-right');

    const updateArrows = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth - 10;
      
      leftArrow.style.display = scrollLeft > 15 ? 'flex' : 'none';
      rightArrow.style.display = scrollLeft < maxScroll ? 'flex' : 'none';
    };

    leftArrow.addEventListener('click', () => {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    container.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    setTimeout(updateArrows, 250);
  }

  async function createMyListRowElement() {
    const listIds = MyListManager.getList();
    if (listIds.length === 0) return null;

    const allMovies = await MovieAPI.getAllMovies();
    const myMovies = listIds.map(id => allMovies.find(m => m.id === id)).filter(Boolean);

    if (myMovies.length === 0) return null;

    const row = createCategoryRowElement('My List', myMovies, 'mylist');
    row.id = 'row-my-list';
    return row;
  }

  async function syncMyListRow() {
    const rowsContainer = document.getElementById('browse-main-rows');
    let existingRow = document.getElementById('row-my-list');
    const newRow = await createMyListRowElement();

    if (existingRow) {
      if (newRow) {
        existingRow.replaceWith(newRow);
      } else {
        existingRow.remove();
      }
    } else if (newRow && rowsContainer) {
      rowsContainer.insertBefore(newRow, rowsContainer.firstChild);
    }
  }

  async function renderMyListView() {
    const rowsContainer = document.getElementById('browse-main-rows');
    if (!rowsContainer) return;

    const listIds = MyListManager.getList();
    const allMovies = await MovieAPI.getAllMovies();
    const myMovies = listIds.map(id => allMovies.find(m => m.id === id)).filter(Boolean);

    rowsContainer.innerHTML = `
      <div class="dedicated-view-header">
        <h1 class="dedicated-view-title">My List (${myMovies.length})</h1>
      </div>
      <div class="search-results-grid" id="mylist-grid"></div>
    `;

    const grid = document.getElementById('mylist-grid');
    if (myMovies.length === 0) {
      grid.innerHTML = `
        <div class="search-no-results" style="grid-column: 1 / -1;">
          <h3>You haven't added any titles to your list yet.</h3>
          <p>Explore titles on Netflix and click the <strong>+</strong> icon to add them to your watchlist.</p>
        </div>
      `;
      return;
    }

    myMovies.forEach(movie => {
      grid.appendChild(createPosterCard(movie));
    });
  }

  async function renderFilteredRowsByType(type) {
    const rowsContainer = document.getElementById('browse-main-rows');
    if (!rowsContainer) return;
    rowsContainer.innerHTML = '';

    const movies = await MovieAPI.getMoviesByType(type);
    const title = type === 'tv' ? 'TV Shows' : 'Movies';

    const trending = movies.filter(m => m.category.includes('trending'));
    const topRated = movies.filter(m => m.category.includes('top_rated'));
    const action = movies.filter(m => m.category.includes('action') || m.genres.includes('Action') || m.genres.includes('Sci-Fi'));
    const comedy = movies.filter(m => m.category.includes('comedy') || m.genres.includes('Comedy'));

    if (trending.length) rowsContainer.appendChild(createCategoryRowElement(`Popular ${title}`, trending));
    if (topRated.length) rowsContainer.appendChild(createCategoryRowElement(`Award-Winning ${title}`, topRated));
    if (action.length) rowsContainer.appendChild(createCategoryRowElement(`Action & Sci-Fi ${title}`, action));
    if (comedy.length) rowsContainer.appendChild(createCategoryRowElement(`Comedy ${title}`, comedy));
  }

  async function renderFilteredRowsByCategory(category) {
    const rowsContainer = document.getElementById('browse-main-rows');
    if (!rowsContainer) return;
    rowsContainer.innerHTML = '';

    const movies = await MovieAPI.getMoviesByCategory(category);
    rowsContainer.appendChild(createCategoryRowElement(`New & Trending Now`, movies));
  }

  return {
    init,
    renderAllRows,
    renderMyListView,
    renderFilteredRowsByType,
    renderFilteredRowsByCategory,
    createPosterCard
  };
})();

window.BrowseRenderer = BrowseRenderer;

document.addEventListener('DOMContentLoaded', () => {
  BrowseRenderer.init();
});
