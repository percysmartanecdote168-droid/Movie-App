// ================================
// Watchlist Core (single source)
// ================================

function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

window.addToWatchlist = function(movie)  {
  const list = getWatchlist();

  if (!list.some(m => m.id === movie.id)) {
    list.push(movie);
    saveWatchlist(list);
  }
}

function removeFromWatchlist(id) {
  const updated = getWatchlist().filter(m => m.id !== id);
  saveWatchlist(updated);
}

// ================================
// UI (Watchlist Page Only)
// ================================

document.addEventListener('DOMContentLoaded', () => {
  function renderWatchlist() {
    const grid = document.getElementById('watchlistGrid');
    const movies = getWatchlist();

    if (!movies.length) {
      grid.innerHTML = "<p>Your watchlist is empty</p>";
      return;
    }

    grid.innerHTML = movies.map(movie => `
      <article class="movie-card" data-id="${movie.id}">
        <img src="${movie.poster}" />
        <button class="remove-btn" data-id="${movie.id}">✕</button>
        <h3>${movie.title}</h3>
      </article>
    `).join('');

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromWatchlist(Number(btn.dataset.id));
        renderWatchlist(); // 🔥 refresh instantly
      });
    });
  }

  renderWatchlist();
});

// ================================
// GLOBAL ACCESS (IMPORTANT)
// ================================

window.addToWatchlist = addToWatchlist;
window.removeFromWatchlist = removeFromWatchlist;
window.getWatchlist = getWatchlist;