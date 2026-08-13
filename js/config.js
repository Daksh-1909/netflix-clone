const CONFIG = {
  DATA_PATH: 'data/movies.json',
  STORAGE_KEYS: {
    MY_LIST: 'netflix_clone_my_list',
    USER_EMAIL: 'netflix_user_email',
    ACTIVE_PROFILE: 'netflix_active_profile',
    SOUND_MUTED: 'netflix_sound_muted'
  },
  CATEGORIES: [
    { id: 'trending', title: 'Trending Now', icon: '🔥' },
    { id: 'originals', title: 'Netflix Originals', icon: '✨' },
    { id: 'top_rated', title: 'Critically Acclaimed & Top Rated', icon: '⭐' },
    { id: 'action', title: 'Action & Sci-Fi Blockbusters', icon: '💥' },
    { id: 'comedy', title: 'Laugh-Out-Loud Comedies', icon: '😂' },
    { id: 'thriller', title: 'Suspense & Thrillers', icon: '⚡' },
    { id: 'documentary', title: 'Documentaries & Real Life', icon: '🌍' }
  ],
  NAV_LINKS: [
    { id: 'home', label: 'Home', filter: 'all' },
    { id: 'tv', label: 'TV Shows', filter: 'tv' },
    { id: 'movies', label: 'Movies', filter: 'movie' },
    { id: 'new', label: 'New & Popular', filter: 'trending' },
    { id: 'mylist', label: 'My List', filter: 'mylist' }
  ],
  HERO_ROTATION_INTERVAL: 15000
};

window.CONFIG = CONFIG;
