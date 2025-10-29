# TechGuilds × Kajoo AI — Booth Motion Loop (HTML5/React)

Panoply-style cinematic booth animation rendered in the browser with React + Framer Motion + Tailwind.
- Resolution: **1920×1080 (Full HD)**
- Autoplay, **auto-looping**, no controls, cursor hidden
- **Easy editing:** update `src/scenes.json` text, durations, and image paths

## ▶️ Quick Start
```bash
# Requires Node 18+
npm install
npm run dev  # then open the URL shown (e.g., http://localhost:5173) and press F11 for fullscreen
```

## 🚀 Deploy
```bash
npm run build
npm run preview  # local
# or deploy the `dist/` folder to Vercel/Netlify/S3 etc.
```

## ✍️ Edit Content
- **Copy & timing:** `src/scenes.json`
  - `title`: large headline (supports all-caps)
  - `subtitle`: multiline body (use `\n` for line breaks, bullet examples provided)
  - `cta`: optional CTA pill; set to `null` to hide
  - `image`: background overlay (replace with `/assets/your-file.jpg` or `.png`/`.svg`)
  - `durationSec`: seconds on screen (20–25 recommended for booth readability)

- **Assets:** put images in `public/assets/` and reference them in `scenes.json`.

- **Style:** Tailwind + custom CSS
  - Gradient animation: `.gradient-bg` (see `src/index.css` + `tailwind.config.js`)
  - Particles & glow: already wired; safe to leave as-is

## 🔁 Looping
The slideshow loops automatically. When the last scene finishes, it transitions back to the first seamlessly.

## 🧠 Notes
- This is designed for **booth playback**: runs in Chrome/Edge fullscreen with smooth motion at 60fps.
- To add more scenes, append to `src/scenes.json` — everything else is automatic.
- To adjust animation intensity (speed, parallax, particle count), edit `Scene.jsx`.

---

Built for TechGuilds × Kajoo AI. “Next is Now.”
