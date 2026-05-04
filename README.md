# 🎬 KMovies

A modern, Netflix-inspired movie browsing web app powered by the TMDB API.  
Built using vanilla JavaScript, this project focuses on performance, clean UI, and real-world frontend architecture.

---

## 🚀 Features

- 🔥 **Trending Movies (Live Data)**
  - Fetches real-time movie data from TMDB API

- 🎯 **Smart Search**
  - Search across:
    - Title
    - Description
    - Genres
  - Debounced input for smooth performance

- 🎨 **Genre Filtering**
  - Filter movies dynamically by category

- 📊 **Sorting System**
  - Sort by:
    - Latest
    - Year
    - Alphabetical order

- 🎬 **Movie Detail Page**
  - Dynamic routing using URL parameters (`movie.html?id=...`)
  - Displays full movie info

- ⚡ **Skeleton Loading UI**
  - Placeholder cards while data loads (better UX)

- 🖼️ **Lazy Loading Images**
  - Improves performance and reduces bandwidth usage

- 📌 **Watchlist System**
  - Add movies to a personal watchlist using “+ Add to List”
  - Stored locally using browser localStorage
  - Prevents duplicate entries
  - Dedicated My List page (watchlist.html)
  - Instantly add/remove movies without page reload
  - Works across homepage, movie detail page, and trending sections
---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **TMDB API** (The Movie Database)

---

## 📁 Project Structure

```
project-folder/
│
├── index.html # Homepage
├── movie.html # Movie detail page
├── app.js # Main app logic (homepage)
├── movie.js # Movie detail logic
├── watchlist.js # Watchlist logic + storage
├── watchlist.html # Watchlist page
├── styles.css # Styling
├── config.js # API key (ignored)
└── README.md

```
---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/percysmartanecdote168-droid/Movie-App
cd Movie-App
```
### 2. Create your API key file

Create a file named:

config.js

Add this inside:
```js
window.API_KEY = "your_tmdb_api_key_here";
```
⚠️ This file is ignored using .gitignore and will not be pushed to GitHub.

### 3. Run the project

Open index.html using:

- Live Server (recommended), or
- Any local development server

### 🔒 Security Note

This project uses a frontend API key. While the key is hidden from version control using .gitignore, it is still visible in the browser.

For production-level security, a backend proxy would be required.
===
May 2026