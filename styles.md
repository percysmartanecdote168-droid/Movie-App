# 🎨 Styles Guide — Understanding `styles.css`

Welcome! This guide walks you through every CSS concept used in this project, explained as if you're learning to code for the first time. By the end, you'll understand **why** each style was written, not just **what** it does.

---

## 1. 🎨 CSS Custom Properties (Variables)

```css
:root {
  --red: #e50914;
  --dark: #141414;
  --font: 'Inter', sans-serif;
}
```

### What is this?
Think of CSS variables like **sticky notes with nicknames for values**. Instead of typing `#e50914` (Netflix red) 20 times across your stylesheet, you write it once as `--red` and then use `var(--red)` everywhere.

### Why use them?
- If you want to change the brand color, you change **one line** instead of hunting through the whole file.
- The `:root` selector means "apply these to the entire page."

### How to use a variable:
```css
.btn-watch {
  background: var(--red); /* uses the value stored in --red */
}
```

---

## 2. 🔁 The Reset (`*, *::before, *::after`)

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### What is this?
Every browser (Chrome, Firefox, Safari) adds its own default spacing and styles to HTML elements. This **reset** removes all of that so we start with a clean, consistent slate.

- `margin: 0; padding: 0` — removes default spacing from every element.
- `box-sizing: border-box` — makes width calculations predictable. When you set a box to `width: 200px`, the border and padding are **included** in that 200px, not added on top.

---

## 3. 🖼️ The Hero Section & Gradients

```css
.hero {
  height: 100vh; /* 100% of the viewport height */
}

.hero-overlay {
  background: linear-gradient(
    to top,
    rgba(20, 20, 20, 1) 0%,   /* solid dark at bottom */
    rgba(20, 20, 20, 0.6) 50%, /* semi-transparent in middle */
    rgba(20, 20, 20, 0.1) 100% /* nearly transparent at top */
  );
}
```

### What is a gradient?
A gradient is a smooth transition from one color to another. Here we use it as an overlay on top of the movie backdrop image so the text is readable.

- `rgba(20, 20, 20, 1)` — the dark background color, fully opaque (you can't see through it).
- `rgba(20, 20, 20, 0.1)` — the same color but at 10% opacity (nearly transparent).
- `to top` — the gradient goes from the bottom (dark) to the top (transparent).

### `100vh` — What's that?
`vh` stands for **viewport height**. `100vh` means "as tall as the entire browser window." The viewport is simply the visible area of the page.

---

## 4. 📦 Flexbox — The Layout Superpower

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### What is Flexbox?
Flexbox is a layout system that makes it easy to **arrange items in a row or column**. When you write `display: flex`, the container becomes a "flex container" and its children become "flex items."

### The key properties:
| Property | What it does |
|---|---|
| `display: flex` | Turns on flexbox for this element |
| `flex-direction: row` | Items sit side by side (default) |
| `flex-direction: column` | Items stack vertically |
| `align-items: center` | Centers items on the **cross axis** (vertically for rows) |
| `justify-content: space-between` | Pushes items to opposite ends of the container |
| `gap: 12px` | Adds spacing between each item |

### Real example — the Navbar:
The logo is on the left, nav links in the middle, and the menu button on the right. `justify-content: space-between` does exactly that with one line of CSS!

---

## 5. 🔲 CSS Grid — For 2D Layouts

```css
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
```

### What is CSS Grid?
While Flexbox handles one direction (row **or** column), Grid handles **both dimensions at once** — rows **and** columns. It's perfect for card layouts.

### Breaking down `repeat(auto-fill, minmax(180px, 1fr))`:
- `repeat(auto-fill, ...)` — create **as many columns as will fit** in the container.
- `minmax(180px, 1fr)` — each column is **at least** 180px wide, but can grow to fill available space (`1fr` = one fraction of the available space).

The result: the grid automatically creates the right number of columns based on the screen width. On a big screen you get 5 columns, on mobile you get 2. **No media queries needed!**

---

## 6. 🃏 Card Hover Effects

```css
.movie-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-6px);
  border-color: rgba(229, 9, 20, 0.5);
}
```

### What is `transition`?
Transitions make CSS changes happen **smoothly over time** instead of instantly.
- `0.25s` — the animation takes 0.25 seconds.
- `ease` — the animation starts fast, slows down at the end (feels natural).

### What is `transform: translateY(-6px)`?
`transform` lets you move, rotate, or scale elements without affecting page layout. `translateY(-6px)` moves the card **6 pixels upward** on hover — creating that "lift" effect.

### `:hover` — What is a pseudo-class?
A pseudo-class (`:hover`, `:focus`, `:active`) selects an element based on its **state**. `.movie-card:hover` means "apply these styles only when the user's mouse is over the card."

---

## 7. 📍 Position: Fixed, Absolute, Relative

```css
.navbar {
  position: fixed;    /* stays in place when you scroll */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;      /* sits on top of everything else */
}

.hero-overlay {
  position: absolute; /* sits on top of the image behind it */
  inset: 0;           /* shorthand for top/right/bottom/left: 0 */
}
```

### The positioning types explained:
| Value | Behaviour |
|---|---|
| `static` | Default. Flows normally in the page. |
| `relative` | Stays in flow, but you can shift it slightly with `top`, `left` etc. |
| `absolute` | Removed from flow. Positioned relative to the nearest **positioned** ancestor. |
| `fixed` | Like `absolute`, but anchored to the **viewport** — it stays visible when you scroll. |
| `sticky` | Scrolls with the page until it hits an edge, then sticks. |

### `z-index`
Think of the page as a stack of layers. A higher `z-index` means the element sits on top. The navbar uses `z-index: 1000` so nothing ever covers it.

---

## 8. 📱 Responsive Design with Media Queries

```css
@media (max-width: 768px) {
  .nav-links {
    display: none; /* Hide desktop navigation on mobile */
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
```

### What is a media query?
A media query is a condition. The styles inside it **only apply** when the condition is true. `max-width: 768px` means "when the screen is 768px wide or narrower" — typically phones and small tablets.

### This project's approach:
- On **desktop**: nav links are visible, cards are larger (180px min).
- On **mobile**: nav links are hidden (to avoid crowding), cards are slightly smaller (140px min).

---

## 9. 🌀 CSS Animations with `@keyframes`

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-content {
  animation: fadeUp 0.8s ease-out;
}
```

### What are keyframes?
You define **what the element looks like at different points** in the animation. `from` is the start state, `to` is the end state. The browser fills in everything in between.

This animation makes the hero text:
1. Start invisible (`opacity: 0`) and 30px below its final position.
2. Fade in and slide up to its normal position over 0.8 seconds.

---

## 10. 🦴 Skeleton Loading (Shimmer Effect)

```css
.skeleton {
  background: linear-gradient(90deg, #222 25%, #1a1a1a 50%, #222 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### What is a skeleton screen?
Instead of showing a spinner while content loads, we show **gray placeholder shapes** that match the layout of the real content. This feels much more polished and gives users a sense of where content will appear.

The shimmer effect is created by animating the `background-position` of a gradient — making it look like a light is sweeping across the placeholder.

---

## 11. 🖱️ Custom Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
```

### What is `::webkit-scrollbar`?
This is a **pseudo-element** — a special selector for parts of an element that aren't directly in the HTML. The `::before` and `::after` you may have seen work similarly.

`::-webkit-scrollbar` targets the scrollbar itself. We make it thin and dark to match the Netflix aesthetic. Note: this only works in Chrome/Edge/Safari (webkit-based browsers).

---

## 📁 File Summary

| File | Role |
|---|---|
| `index.html` | The homepage structure (the skeleton of the page) |
| `movie.html` | The movie detail page template |
| `styles.css` | All visual styling (colors, layout, animations) |
| `app.js` | JavaScript that loads data and builds the homepage |
| `movie.js` | JavaScript that loads data and builds the detail page |
| `movies.json` | The raw movie data (titles, ratings, posters, etc.) |

---

## 🔑 Key Takeaways

1. **HTML** = the structure (what's on the page)
2. **CSS** = the appearance (how it looks)
3. **JavaScript** = the behaviour (what it does)
4. **JSON** = the data (the information we display)

These four work together. HTML provides the containers, CSS makes them look good, JS fills them with real data from the JSON file.
