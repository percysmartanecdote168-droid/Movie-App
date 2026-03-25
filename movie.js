// ============================================================
//  movie.js — Movie Detail Page Logic
//
//  When the user clicks a movie card, they go to:
//    movie.html?id=3
//
//  This file reads that "?id=3" from the URL,
//  finds the matching movie in movies.json,
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

  // --- STEP 2: Load the same movies.json file ---
  fetch('movies.json')
    .then(response => response.json())
    .then(movies => {
      // Find the one movie whose id matches
      const movie = movies.find(m => m.id === movieId);

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

    // --- Update the browser tab title ---
    document.title = `${movie.title} (${movie.year}) — KMovies`;

    // --- Backdrop (the blurred background image behind the content) ---
    const backdrop = document.getElementById('detailBackdrop');
    backdrop.style.backgroundImage = `url('${movie.backdrop}')`;

    // --- Poster image ---
    const poster = document.getElementById('detailPoster');
    poster.src = movie.poster;
    poster.alt = `${movie.title} Poster`;

    // --- Title ---
    document.getElementById('detailTitle').textContent = movie.title;

    // --- Year ---
    document.getElementById('detailYear').textContent = movie.year;

    // --- Rating ---
    document.getElementById('detailRating').textContent = movie.rating;

    // --- Type (Movie / Series) ---
    document.getElementById('detailType').textContent = movie.type;

    // --- Description ---
    document.getElementById('detailDescription').textContent = movie.description;

    // --- Episodes (only shown for Series) ---
    const episodesEl = document.getElementById('detailEpisodes');
    if (movie.type === 'Series' && movie.episodes) {
      episodesEl.innerHTML = `<strong>${movie.episodes} Episodes</strong>`;
    } else {
      episodesEl.style.display = 'none';
    }

    // --- Genre Tags ---
    // We loop through the genres array and create a <span> for each one
    const genresEl = document.getElementById('detailGenres');
    genresEl.innerHTML = movie.genres.map(genre => `
      <span class="genre-tag">${genre}</span>
    `).join('');

    // --- Update the meta description for SEO ---
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Watch ${movie.title} (${movie.year}) on KMovies. ${movie.description.slice(0, 120)}...`);
    }
  }

}); // End of DOMContentLoaded
