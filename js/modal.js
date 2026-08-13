const MovieModal = (() => {
  let modalOverlay = null;
  let currentMovieId = null;

  function init() {
    if (document.getElementById('movie-modal-overlay')) return;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'movie-modal-overlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-hidden', 'true');

    modalOverlay.innerHTML = `
      <div class="modal-dialog">
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-hero">
          <div class="modal-media-container" id="modal-media-container">
            <img id="modal-backdrop-img" src="" alt="" class="modal-backdrop-img">
            <video id="modal-video-player" class="modal-video-player" playsinline loop muted preload="none"></video>
          </div>
          <div class="modal-hero-gradient"></div>
          
          <div class="modal-hero-content">
            <h2 class="modal-title" id="modal-title"></h2>
            
            <div class="modal-actions">
              <button class="btn btn-white" id="modal-play-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Play</span>
              </button>
              
              <button class="btn-icon" id="modal-mylist-btn" title="Add to My List">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              
              <button class="btn-icon" id="modal-like-btn" title="I like this">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>

              <button class="btn-icon" id="modal-sound-btn" title="Mute/Unmute" style="margin-left: auto;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="modal-sound-icon">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="modal-details-grid">
            <div class="modal-main-info">
              <div class="modal-meta-row">
                <span class="badge-match" id="modal-match-score">98% Match</span>
                <span class="modal-year" id="modal-year">2023</span>
                <span class="badge badge-age" id="modal-maturity">16+</span>
                <span class="modal-duration" id="modal-duration">4 Seasons</span>
                <span class="badge badge-quality" id="modal-quality">4K Ultra HD</span>
              </div>

              <p class="modal-description" id="modal-description"></p>
            </div>

            <div class="modal-side-info">
              <div class="modal-meta-field">
                <span class="field-label">Cast: </span>
                <span class="field-value" id="modal-cast"></span>
              </div>
              <div class="modal-meta-field">
                <span class="field-label">Genres: </span>
                <span class="field-value" id="modal-genres"></span>
              </div>
              <div class="modal-meta-field">
                <span class="field-label">This show is: </span>
                <span class="field-value" id="modal-tags">Exciting, Mind-Bending, Suspenseful</span>
              </div>
            </div>
          </div>

          <div class="modal-recommendations-section">
            <h3 class="recommendations-title">More Like This</h3>
            <div class="recommendations-grid" id="modal-recommendations-grid"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    attachEvents();
  }

  function attachEvents() {
    const closeBtn = document.getElementById('modal-close-btn');
    const playBtn = document.getElementById('modal-play-btn');
    const soundBtn = document.getElementById('modal-sound-btn');
    const video = document.getElementById('modal-video-player');

    closeBtn.addEventListener('click', close);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        close();
      }
    });

    playBtn.addEventListener('click', () => {
      if (video) {
        video.muted = false;
        video.play();
        updateSoundIcon(false);
        MyListManager.showToast(`Playing title now in 4K...`, true);
      }
    });

    soundBtn.addEventListener('click', () => {
      if (video) {
        video.muted = !video.muted;
        updateSoundIcon(video.muted);
      }
    });
  }

  function updateSoundIcon(isMuted) {
    const icon = document.getElementById('modal-sound-icon');
    if (!icon) return;
    if (isMuted) {
      icon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    } else {
      icon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    }
  }

  async function open(movieId) {
    init();
    const movie = await MovieAPI.getMovieById(movieId);
    if (!movie) return;

    currentMovieId = movieId;

    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-description').textContent = movie.description;
    document.getElementById('modal-match-score').textContent = `${movie.matchScore || 95}% Match`;
    document.getElementById('modal-year').textContent = movie.year;
    document.getElementById('modal-maturity').textContent = movie.maturity || '16+';
    document.getElementById('modal-duration').textContent = movie.duration;
    document.getElementById('modal-quality').textContent = movie.quality || '4K Ultra HD';
    
    document.getElementById('modal-cast').textContent = (movie.cast || []).join(', ');
    document.getElementById('modal-genres').textContent = (movie.genres || []).join(', ');

    const backdropImg = document.getElementById('modal-backdrop-img');
    backdropImg.src = movie.backdropUrl || movie.posterUrl;
    backdropImg.alt = "";
    backdropImg.style.display = 'block';

    const video = document.getElementById('modal-video-player');
    if (movie.trailerUrl) {
      video.src = movie.trailerUrl;
      video.muted = true;
      updateSoundIcon(true);
      video.play().then(() => {
        backdropImg.style.display = 'none';
      }).catch(() => {
        backdropImg.style.display = 'block';
      });
    }

    const myListBtn = document.getElementById('modal-mylist-btn');
    myListBtn.setAttribute('data-mylist-btn', movie.id);
    const inList = MyListManager.isInList(movie.id);
    MyListManager.updateUIElements(movie.id, inList);

    myListBtn.onclick = () => {
      MyListManager.toggle(movie.id);
    };

    loadRecommendations(movie.id);

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  async function loadRecommendations(movieId) {
    const recGrid = document.getElementById('modal-recommendations-grid');
    recGrid.innerHTML = '<div class="skeleton" style="height: 200px; grid-column: span 3;"></div>';

    const similar = await MovieAPI.getSimilarMovies(movieId, 6);
    recGrid.innerHTML = '';

    similar.forEach(m => {
      const card = document.createElement('div');
      card.className = 'rec-card';
      const inList = MyListManager.isInList(m.id);

      card.innerHTML = `
        <div class="rec-card-image-wrap">
          <img src="${m.backdropUrl || m.posterUrl}" alt="" loading="lazy">
          <span class="rec-duration">${m.duration}</span>
        </div>
        <div class="rec-card-body">
          <div class="rec-card-header">
            <div>
              <span class="badge-match">${m.matchScore || 90}% Match</span>
              <span class="badge badge-age">${m.maturity || '13+'}</span>
            </div>
            <button class="btn-icon btn-icon-sm ${inList ? 'active' : ''}" data-mylist-btn="${m.id}" title="Add to My List">
              ${inList ? `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ` : `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              `}
            </button>
          </div>
          <h4 class="rec-card-title">${m.title}</h4>
          <p class="rec-card-desc">${m.description}</p>
        </div>
      `;

      card.querySelector('.rec-card-image-wrap').addEventListener('click', () => {
        open(m.id);
      });
      card.querySelector('.rec-card-title').addEventListener('click', () => {
        open(m.id);
      });

      const btn = card.querySelector(`[data-mylist-btn="${m.id}"]`);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        MyListManager.toggle(m.id);
      });

      recGrid.appendChild(card);
    });
  }

  function close() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    const video = document.getElementById('modal-video-player');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }

  return {
    init,
    open,
    close
  };
})();

window.MovieModal = MovieModal;
