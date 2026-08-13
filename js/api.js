const MovieAPI = (() => {
  let moviesCache = null;

  async function getAllMovies() {
    if (moviesCache) return moviesCache;

    try {
      const response = await fetch(CONFIG.DATA_PATH);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      moviesCache = await response.json();
      return moviesCache;
    } catch (error) {
      moviesCache = getFallbackMovies();
      return moviesCache;
    }
  }

  async function getMovieById(id) {
    const movies = await getAllMovies();
    return movies.find(m => m.id === id) || null;
  }

  async function getMoviesByCategory(category) {
    const movies = await getAllMovies();
    return movies.filter(m => Array.isArray(m.category) && m.category.includes(category));
  }

  async function getMoviesByType(type) {
    const movies = await getAllMovies();
    return movies.filter(m => m.type === type);
  }

  async function searchMovies(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const movies = await getAllMovies();

    return movies.filter(m => {
      const titleMatch = m.title.toLowerCase().includes(q);
      const descMatch = m.description.toLowerCase().includes(q);
      const genreMatch = m.genres && m.genres.some(g => g.toLowerCase().includes(q));
      const castMatch = m.cast && m.cast.some(c => c.toLowerCase().includes(q));
      return titleMatch || descMatch || genreMatch || castMatch;
    });
  }

  async function getSimilarMovies(movieId, limit = 6) {
    const movies = await getAllMovies();
    const current = movies.find(m => m.id === movieId);
    if (!current) return movies.slice(0, limit);

    return movies
      .filter(m => m.id !== movieId)
      .map(m => {
        let score = 0;
        if (current.genres && m.genres) {
          score += m.genres.filter(g => current.genres.includes(g)).length * 2;
        }
        if (current.type === m.type) score += 1;
        return { movie: m, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie)
      .slice(0, limit);
  }

  function getFallbackMovies() {
    return [
      {
        id: "m1",
        title: "Stranger Things",
        type: "tv",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        posterUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=600&q=80",
        backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        genres: ["Sci-Fi", "Horror", "Drama"],
        rating: "8.7",
        matchScore: 98,
        year: 2022,
        duration: "4 Seasons",
        maturity: "16+",
        cast: ["Winona Ryder", "David Harbour", "Millie Bobby Brown"],
        category: ["trending", "originals", "scifi", "top_rated"],
        isOriginal: true,
        quality: "4K Ultra HD"
      },
      {
        id: "m2",
        title: "Cyberpunk: Edgerunners",
        type: "tv",
        description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become an edgerunner: a mercenary outlaw.",
        posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
        backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        genres: ["Anime", "Cyberpunk", "Action"],
        rating: "8.3",
        matchScore: 96,
        year: 2022,
        duration: "1 Season",
        maturity: "18+",
        cast: ["KENN", "Aoi Yuuki", "Hiroki Touchi"],
        category: ["trending", "action", "scifi", "originals"],
        isOriginal: true,
        quality: "HDR"
      },
      {
        id: "m3",
        title: "Inception",
        type: "movie",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
        backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        genres: ["Sci-Fi", "Action", "Thriller"],
        rating: "8.8",
        matchScore: 99,
        year: 2010,
        duration: "2h 28m",
        maturity: "13+",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        category: ["top_rated", "scifi", "action"],
        isOriginal: false,
        quality: "4K Ultra HD"
      },
      {
        id: "m4",
        title: "Squid Game",
        type: "tv",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
        backdropUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        genres: ["Thriller", "Drama", "Mystery"],
        rating: "8.0",
        matchScore: 95,
        year: 2021,
        duration: "1 Season",
        maturity: "18+",
        cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon"],
        category: ["trending", "originals", "thriller"],
        isOriginal: true,
        quality: "4K Ultra HD"
      },
      {
        id: "m5",
        title: "The Dark Knight",
        type: "movie",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.",
        posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80",
        backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        genres: ["Action", "Crime", "Drama"],
        rating: "9.0",
        matchScore: 99,
        year: 2008,
        duration: "2h 32m",
        maturity: "16+",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        category: ["top_rated", "action"],
        isOriginal: false,
        quality: "4K Ultra HD"
      },
      {
        id: "m6",
        title: "Wednesday",
        type: "tv",
        description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
        posterUrl: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=600&q=80",
        backdropUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80",
        trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        genres: ["Mystery", "Comedy", "Fantasy"],
        rating: "8.1",
        matchScore: 94,
        year: 2022,
        duration: "1 Season",
        maturity: "13+",
        cast: ["Jenna Ortega", "Gwendoline Christie", "Christina Ricci"],
        category: ["trending", "originals", "comedy"],
        isOriginal: true,
        quality: "4K Ultra HD"
      }
    ];
  }

  return {
    getAllMovies,
    getMovieById,
    getMoviesByCategory,
    getMoviesByType,
    searchMovies,
    getSimilarMovies
  };
})();

window.MovieAPI = MovieAPI;
