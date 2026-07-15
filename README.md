# Senura Hansaja Wanasekara — Personal Website

Static personal website in an editorial "autobiography" theme: paper and ink
palette, terracotta accents, serif chapter headlines, a live Sydney clock,
horizontal-scrolling chapters, and generative canvas art.

## Files

- `index.html` — page structure: cover, foreword, chapters I–IV, The Proof
  (publications and credentials), The Night (stats and experience record),
  Write (contact)
- `styles.css` — editorial visual design, light "paper" and dark "night"
  sections, responsive fallbacks
- `script.js` — clock, custom cursor, scroll progress, horizontal chapter
  scroll, foreword word reveal, particle and generative-ink canvases
- `assets/hero-research.png` — figure artwork (Fig. 01 / Fig. 02)

## Preview

Open `index.html` directly in a browser, or run a static server from this
folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

- Fonts (Playfair Display, Poppins, IBM Plex Mono) load from Google Fonts.
- Horizontal chapter scrolling is desktop-only; touch devices and narrow
  screens get a vertical stack. `prefers-reduced-motion` disables animations.
- Content is sourced from `CV.md`.
