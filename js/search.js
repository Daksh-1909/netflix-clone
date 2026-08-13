const SearchManager = (() => {
  let searchInput = null;
  let searchBtn = null;
  let searchContainer = null;
  let clearBtn = null;
  let debounceTimer = null;
  let currentFilter = 'all';

  function init() {
    searchInput = document.getElementById('nav-search-input');
    searchBtn = document.getElementById('nav-search-btn');
    searchContainer = document.getElementById('nav-search-box');
    clearBtn = document.getElementById('nav-search-clear');

    if (!searchInput || !searchBtn) return;

    searchBtn.addEventListener('click', () => {
      searchContainer.classList.toggle('active');
      if (searchContainer.classList.contains('active')) {
        searchInput.focus();
      } else {
        clearSearch();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = query ? 'flex' : 'none';
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        handleSearch(query);
      }, 250);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearSearch();
        searchInput.focus();
      });
    }

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearSearch();
        searchContainer.classList.remove('active');
      }
    });

    initCategoryNavigation();
  }

  function clearSearch() {
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    hideSearchResults();
  }

  async function handleSearch(query) {
    if (!query || !query.trim()) {
      hideSearchResults();
      return;
    }

    const results = await MovieAPI.searchMovies(query);
    displaySearchResults(query, results);
  }

  function displaySearchResults(query, results) {
    const mainContent = document.getElementById('browse-main-rows');
    const heroBanner = document.getElementById('hero-banner');
    const resultsContainer = document.getElementById('search-results-section');
    const resultsGrid = document.getElementById('search-results-grid');
    const resultsTitle = document.getElementById('search-results-title');

    if (heroBanner) heroBanner.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';

    resultsTitle.innerHTML = `Search results for "<span>${escapeHTML(query)}</span>" (${results.length})`;

    if (results.length === 0) {
      resultsGrid.innerHTML = `
        <div class="search-no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3>Your search for "${escapeHTML(query)}" did not have any matches.</h3>
          <p>Suggestions:</p>
          <ul>
            <li>Try different keywords or check spelling</li>
            <li>Looking for a movie or TV show? Try searching by genre like "Action", "Sci-Fi", or "Comedy"</li>
            <li>Try searching for an actor's name like "DiCaprio" or "Henry Cavill"</li>
          </ul>
        </div>
      `;
      return;
    }

    resultsGrid.innerHTML = '';
    results.forEach(movie => {
      const card = BrowseRenderer.createPosterCard(movie);
      resultsGrid.appendChild(card);
    });
  }

  function hideSearchResults() {
    const mainContent = document.getElementById('browse-main-rows');
    const heroBanner = document.getElementById('hero-banner');
    const resultsContainer = document.getElementById('search-results-section');

    if (heroBanner) heroBanner.style.display = 'block';
    if (mainContent) mainContent.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
  }

  function initCategoryNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-nav-filter]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.getAttribute('data-nav-filter');

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        clearSearch();
        searchContainer.classList.remove('active');

        applyCategoryFilter(filter);
      });
    });
  }

  async function applyCategoryFilter(filter) {
    currentFilter = filter;
    const heroBanner = document.getElementById('hero-banner');

    if (filter === 'all' || filter === 'home') {
      if (heroBanner) heroBanner.style.display = 'block';
      BrowseRenderer.renderAllRows();
    } else if (filter === 'mylist') {
      if (heroBanner) heroBanner.style.display = 'none';
      BrowseRenderer.renderMyListView();
    } else if (filter === 'tv' || filter === 'movie') {
      if (heroBanner) heroBanner.style.display = 'block';
      BrowseRenderer.renderFilteredRowsByType(filter);
    } else if (filter === 'trending') {
      if (heroBanner) heroBanner.style.display = 'block';
      BrowseRenderer.renderFilteredRowsByCategory('trending');
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  return {
    init,
    clearSearch,
    applyCategoryFilter
  };
})();

window.SearchManager = SearchManager;
