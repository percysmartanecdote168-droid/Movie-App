// ============================================================
// movie.js — Movie Detail Page (CLEAN FINAL VERSION)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const API_KEY = window.API_KEY;
  const IMAGE_BASE = "https://image.tmdb.org/t/p/";

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');

  if (!movieId) {
    window.location.href = "index.html";
    return;
  }

  // ------------------------------------------------------------
  // LOAD MOVIE FROM TMDB
  // ------------------------------------------------------------
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {

      if (!movie || movie.success === false) {
        console.error("Movie not found");
        window.location.href = "index.html";
        return;
      }

      renderMovieDetail(movie);
      setupAddButton(movie);

    })
    .catch(err => {
      console.error("Failed to load movie:", err);
    });


  // ------------------------------------------------------------
  // RENDER MOVIE DETAILS
  // ------------------------------------------------------------
  function renderMovieDetail(movie) {

    document.title = `${movie.title} — KMovies`;

    // Backdrop
    const backdrop = document.getElementById('detailBackdrop');
    if (backdrop) {
      backdrop.style.backgroundImage = movie.backdrop_path
        ? `url('${IMAGE_BASE}w1280${movie.backdrop_path}')`
        : "none";
    }

    // Poster
    const poster = document.getElementById('detailPoster');
    if (poster) {
      poster.src = movie.poster_path
        ? `${IMAGE_BASE}w500${movie.poster_path}`
        : "";
      poster.alt = movie.title;
    }

    // Title
    const titleEl = document.getElementById('detailTitle');
    if (titleEl) titleEl.textContent = movie.title || "Untitled";

    // Year
    const yearEl = document.getElementById('detailYear');
    if (yearEl) {
      yearEl.textContent = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";
    }

    // Rating
    const ratingEl = document.getElementById('detailRating');
    if (ratingEl) ratingEl.textContent = movie.vote_average ?? "N/A";

    // Description
    const descEl = document.getElementById('detailDescription');
    if (descEl) {
      descEl.textContent = movie.overview || "No description available.";
    }

    // Genres
    const genresEl = document.getElementById('detailGenres');
    if (genresEl) {
      if (movie.genres && Array.isArray(movie.genres)) {
        genresEl.innerHTML = movie.genres
          .map(g => `<span class="genre-tag">${g.name}</span>`)
          .join('');
      } else {
        genresEl.innerHTML = "";
      }
    }

    // Meta description (SEO)
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      const shortDesc = (movie.overview || "").slice(0, 120);
      meta.setAttribute(
        "content",
        `Watch ${movie.title} on KMovies. ${shortDesc}...`
      );
    }
  }


  // ------------------------------------------------------------
  // ADD TO WATCHLIST BUTTON
  // ------------------------------------------------------------
  function setupAddButton(movie) {

    const addBtn = document.getElementById('addToListBtn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {

      const result = addToWatchlist(movie);

      if (result === false) {
        addBtn.textContent = "Already in list";
        return;
      }

      addBtn.textContent = "✓ Added";
      addBtn.disabled = true;

      setTimeout(() => {
        addBtn.textContent = "+ Add to List";
        addBtn.disabled = false;
      }, 1500);

    });
  }

});