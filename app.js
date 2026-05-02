// ============================================================
//  app.js — Homepage Logic for KMovies
//  This file does three main things:
//  1. Fetches real movie data from TMDB API instead of local JSON
//  2. Renders the hero, trending row, and movies grid
//  3. Handles genre filter buttons
// ============================================================

// --- STEP 1: Wait for the page to be fully loaded before we run any code ---
document.addEventListener('DOMContentLoaded', () => {

  // --- All the genres we want to show as filter buttons ---
  const ALL_GENRES = ['Action', 'Adventure', 'Biography', 'Crime', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Mystery'];

  // --- We keep track of which genre is selected in each section ---
  let trendingActiveGenre = 'All';
  let moviesActiveGenre = 'All';

  // TMDB does NOT give genre names directly in movie results.
  // It gives numbers like 28, 12, 35, etc.
  const GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    27: "Horror",
    9648: "Mystery",
    878: "Sci-Fi",
    53: "Thriller"
  };

  // --- STEP 2: Fetch movie data from TMDB API instead of local JSON ---
  // We use fetch() to call The Movie Database (TMDB) servers over the internet.
  // The API returns real, up-to-date movie data in JSON format.

  const API_KEY = "5b935f7af37c1e4bce6d714677a2ba44"; // 🔑 Your TMDB API key (keep private)
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500"; // 🖼️ Base URL for images


  // STEP 2: FETCH REAL MOVIE DATA FROM TMDB


  // fetch() = sends request to TMDB servers
  fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)


    // Convert response into JSON format JavaScript can understand

    .then(res => res.json())


    // Handle the actual movie data

    .then(data => {


      // SAFETY CHECK
      // If API fails or structure is wrong, stop here

      if (!data || !data.results) {
        console.error("TMDB returned invalid data:", data);
        return;
      }

      // Log raw API results for debugging (optional)
      console.log("TMDB RAW DATA:", data.results);


      // CONVERT TMDB FORMAT → YOUR APP FORMAT
      // Your UI expects:
      // id, title, year, rating, description, poster, etc.

      const movies = data.results.map(movie => {

  // ============================================================
  // Convert TMDB genre IDs into readable genre names
  // Example: [28, 12] → ["Action", "Adventure"]
  // ============================================================
  const genres = Array.isArray(movie.genre_ids)
  ? movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean)
  : [];

  // ============================================================
  // Return a clean movie object used by your entire UI
  // ============================================================
  return {
    // Unique identifier used for navigation (movie.html?id=...)
    id: movie.id,

    // Movie title (fallback included for safety)
    title: movie.title || movie.name || "Untitled",

    // Extract year from release date (if available)
    year: movie.release_date
      ? movie.release_date.split("-")[0]
      : "N/A",

    // TMDB rating system (0–10 scale)
    rating: movie.vote_average || 0,

    // Movie description / plot summary
    description: movie.overview || "No description available.",

    // Image URLs (TMDB only provides partial paths)
    poster: movie.poster_path
      ? IMAGE_BASE + movie.poster_path
      : "",

    backdrop: movie.backdrop_path
      ? IMAGE_BASE + movie.backdrop_path
      : "",

    // 🔥 FIX: enables filtering + genre buttons
    genres: genres,

    // UI flags used by your homepage sections
    featured: false,
    isTrending: true,

    // Helps UI know how to label it
    type: "Movie"
  };
});

      // START THE APP

      init(movies);
    })


    // ERROR HANDLING (network issues, bad key, etc.)

    .catch(err => {
      console.error("API failed:", err);
    });

  // --- STEP 3: Main init function — called once data is ready ---
  function init(movies) {
    renderHero(movies);
    renderTrending(movies);
    renderMovies(movies);
    setupNavScroll();
    setupSearch(movies);
  }


  // ============================================================
  //  HERO SECTION
  //  Finds the movie marked "featured: true" and renders it
  //  as the big banner at the top of the page.
  // ============================================================
  function renderHero(movies) {
    // Instead of picking the first movie, we find the one with the highest rating.This makes the homepage feel more "curated" like Netflix.
const featured = movies.reduce((best, current) => {
 
// Compare vote_average (TMDB rating system)
  return (current.rating > best.rating) ? current : best;

}, movies[0]);

    // Get the HTML elements we want to update
    const heroBg = document.getElementById('heroBg');
    const heroContent = document.getElementById('heroContent');

    // Set the background image using the backdrop URL
    heroBg.style.backgroundImage = `url('${featured.backdrop}')`;

    

    // Build the genre tags string (e.g., "Action · Crime · Drama")
    const genreText = featured.genres?.length 
  ? featured.genres.join(' · ')
  : "Trending Movie"; // If genres are missing (TMDB case), show fallback text


    // Inject the HTML into the hero content area
    heroContent.innerHTML = `
      <div class="hero-meta">
        <span class="badge">${featured.type === 'Series' ? 'SERIES' : 'MOVIE'}</span>
        <span class="hero-rating">★ ${featured.rating}</span>
        <span>${featured.year}</span>
        <span>${genreText}</span>
      </div>
      <h1 class="hero-title">${featured.title}</h1>
      <p class="hero-description">${featured.description}</p>
      <div class="hero-buttons">
        <a href="movie.html?id=${featured.id}" class="btn-watch">▶ Watch</a>
        <button class="btn-add" onclick="alert('Added to your list!')">＋ Add List</button>
      </div>
    `;
  }


  // ============================================================
  //  TRENDING ROW
  //  Renders the horizontally scrollable cards in "Trends Now"
  // ============================================================
  function renderTrending(movies) {
    // Build the genre filter buttons
    buildGenreButtons(
      'trendingGenres',          // ID of the container
      ALL_GENRES,                 // list of genres
      trendingActiveGenre,        // currently selected genre
      function onTrendingSelect(genre) {

  // Store selected genre so UI remembers it
  trendingActiveGenre = genre;

  // Filter only trending movies + apply genre filter
  const filtered = filterByGenre(
    movies.filter(m => m.isTrending),
    genre
  );

  // Re-render trending section with filtered data
  buildTrendingCards(filtered);

  // Rebuild buttons so "active" class updates visually
  buildGenreButtons('trendingGenres', ALL_GENRES, trendingActiveGenre, onTrendingSelect);
}
    );


    // Render all trending movies first
    const trendingMovies = movies.filter(m => m.isTrending);
    buildTrendingCards(trendingMovies);
  }

  // Builds the actual card HTML for the trending row
  function buildTrendingCards(movies) {
    const row = document.getElementById('trendingRow');

    // If no movies match the filter, show a message
    if (movies.length === 0) {
      row.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 8px 0;">No titles found for this genre.</p>';
      return;
    }

    // map() loops over the array and turns each movie into an HTML string
    row.innerHTML = movies.map(movie => `
      <div class="trending-card" onclick="window.location.href='movie.html?id=${movie.id}'">
        <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
        <div class="trending-card-info">
          <div class="trending-card-title">${movie.title}</div>
          <div class="trending-card-meta">
            <span class="star">★</span>
            <span>${movie.rating}</span>
            <span>·</span>
            <span>${movie.year}</span>
          </div>
        </div>
      </div>
    `).join('');  // join() connects all the strings into one big string
  }


  // ============================================================
  //  MOVIES GRID
  //  Renders the full movie grid with sort controls
  // ============================================================
  function renderMovies(movies) {
    // Build genre filters for movies section
    buildGenreButtons(
      'moviesGenres',
      ALL_GENRES,
      moviesActiveGenre,
      function onMoviesSelect(genre) {

  // Save selected genre for state tracking
  moviesActiveGenre = genre;

  // Filter full movie list by selected genre
  const filtered = filterByGenre(movies, genre);

  // Re-render movie grid with filtered results
  buildMovieCards(filtered);

  // Update buttons so active highlight changes correctly
  buildGenreButtons('moviesGenres', ALL_GENRES, moviesActiveGenre, onMoviesSelect);
}
    );

    // Build the initial movie cards
    buildMovieCards(movies);

    // --- Sort Buttons ---
    document.getElementById('sortLatest').addEventListener('click', function () {
      setActiveSort(this);
      // Sort by year descending (newest first)
      const sorted = [...filterByGenre(movies, moviesActiveGenre)].sort((a, b) => b.year - a.year);
      buildMovieCards(sorted);
    });

    document.getElementById('sortYear').addEventListener('click', function () {
      setActiveSort(this);
      // Sort by year ascending (oldest first)
      const sorted = [...filterByGenre(movies, moviesActiveGenre)].sort((a, b) => a.year - b.year);
      buildMovieCards(sorted);
    });

    document.getElementById('sortAlpha').addEventListener('click', function () {
      setActiveSort(this);
      // Sort alphabetically A-Z by title
      const sorted = [...filterByGenre(movies, moviesActiveGenre)].sort((a, b) => a.title.localeCompare(b.title));
      buildMovieCards(sorted);
    });
  }

  // Helper: marks the clicked sort button as active
  function setActiveSort(btn) {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // Builds the grid of movie cards
  function buildMovieCards(movies) {
    const grid = document.getElementById('moviesGrid');

    if (movies.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 12px 0; grid-column: 1/-1;">No titles found for this genre.</p>';
      return;
    }

    grid.innerHTML = movies.map(movie => `
      <article class="movie-card" onclick="window.location.href='movie.html?id=${movie.id}'" role="button" tabindex="0" aria-label="View ${movie.title}">
        <div class="movie-card-img-wrap">
          <span class="movie-type-badge">${movie.type}</span>
          <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
          <div class="movie-card-overlay">
            <div class="play-icon">▶</div>
          </div>
        </div>
        <div class="movie-card-body">
          <div class="movie-card-title">${movie.title}</div>
          <div class="movie-card-meta">
            <span>${movie.year}</span>
            <span class="movie-card-rating">★ ${movie.rating}</span>
          </div>
        </div>
      </article>
    `).join('');
  }


  // ============================================================
  //  GENRE FILTER BUTTONS (Reusable)
  //  Builds a row of genre buttons inside a container element.
  //  "activeGenre" is the currently selected one.
  //  "onSelect" is the function to call when a button is clicked.
  // ============================================================
  function buildGenreButtons(containerId, genres, activeGenre, onSelect) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing buttons

    // Create "All" button + one button per genre
    const allGenres = ['All', ...genres];

    allGenres.forEach(genre => {
      const btn = document.createElement('button');
      btn.className = `genre-btn ${genre === activeGenre ? 'active' : ''}`;
      btn.textContent = genre;
      btn.addEventListener('click', () => {
        onSelect(genre);
      });
      container.appendChild(btn);
    });
  }

  // Filters movies by genre. "All" means no filter.
  function filterByGenre(movies, genre) {
    if (genre === 'All') return movies;
    // Array.includes() checks if the genre is in the movie's genres array
    return movies.filter(m =>
  m.genres && m.genres.includes(genre)
);
  }


  // ============================================================
  //  NAVBAR SCROLL BEHAVIOUR
  //  Adds a solid background to the navbar once you scroll down
  // ============================================================
  function setupNavScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  // ============================================================
  //  SEARCH FUNCTION
  // ============================================================
  function setupSearch(movies) {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) return; // safety check

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();

// This code searches across:
// 1. Title
// 2. Description (overview)
// 3. Genres
     const filtered = movies.filter(m => {

  // Convert everything to lowercase for case-insensitive matching
  const title = (m.title || "").toLowerCase();
  const description = (m.description || "").toLowerCase();

  // Join genres array into one string for searching
  const genres = (m.genres || []).join(" ").toLowerCase();

  // Check if query exists in ANY field
  return (
    title.includes(query) ||
    description.includes(query) ||
    genres.includes(query)
  );
});

      buildMovieCards(filtered);
    });
  }

}); // End of DOMContentLoaded
