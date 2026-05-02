// ============================================================
//  movie.js — Movie Detail Page Logic
//
//  When the user clicks a movie card, they go to:
//    movie.html?id=3
//
//  This file reads that "?id=3" from the URL,
//  finds the matching movie in TMDB,
//  and fills in all the page content.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- STEP 1: Read the movie ID from the URL ---
  // window.location.search gives us the "?id=3" part of the URL.
  // URLSearchParams helps us read individual values from it.
  const params = new URLSearchParams(window.location.search);
  const movieId = parseInt(params.get('id'), 10); // convert "3" (string) to 3 (number)

  // If there's no ID in the URL, redirect home
  if (!movieId) {
    window.location.href = 'index.html';
    return;
  }

  // --- STEP 2: Load movies from TMDB--
  
  const API_KEY = "5b935f7af37c1e4bce6d714677a2ba44"; // 🔑 Your TMDB API key (keep private)
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(movie => {

    if (!movie || movie.success === false) {
      console.error("Movie not found:", movie);
      window.location.href = "index.html";
      return;
    }

    renderMovieDetail(movie);
  })
  .catch(err => {
    console.error("Failed to load movie:", err);
  });
      // If no movie found with that ID, go back home
      if (!movie) {
        window.location.href = 'index.html';
        return;
      }

      // Show the movie details on the page
      renderMovieDetail(movie);
    })
    .catch(error => {
      console.error('Could not load movie data:', error);
    });


  // ============================================================
  //  RENDER FUNCTION
  //  Fills all the page elements with the movie's data
  // ============================================================
  function renderMovieDetail(movie) {

  // Title
  document.title = `${movie.title} — KMovies`;

  // Backdrop
  const backdrop = document.getElementById('detailBackdrop');
  backdrop.style.backgroundImage =
    movie.backdrop_path
      ? `url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')`
      : "none";

  // Poster
  const poster = document.getElementById('detailPoster');
  poster.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  poster.alt = movie.title;

  // Title text
  document.getElementById('detailTitle').textContent = movie.title;

  // Year (safe fallback)
  document.getElementById('detailYear').textContent =
    movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  // Rating
  document.getElementById('detailRating').textContent =
    movie.vote_average ?? "N/A";

  // Description
  document.getElementById('detailDescription').textContent =
    movie.overview || "No description available.";

  // Genres (TMDB sometimes gives objects like {id, name})
  const genresEl = document.getElementById('detailGenres');

  if (movie.genres && Array.isArray(movie.genres)) {
    genresEl.innerHTML = movie.genres
      .map(g => `<span class="genre-tag">${g.name}</span>`)
      .join('');
  } else {
    genresEl.innerHTML = "";
  }

  // SEO meta
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const desc = (movie.overview || "").slice(0, 120);
    metaDesc.setAttribute(
      "content",
      `Watch ${movie.title} on KMovies. ${desc}...`
    );
  }
}