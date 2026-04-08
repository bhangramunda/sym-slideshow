# Architecture

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI | React 18 | Component rendering |
| Animations | Framer Motion 11 | Spring physics, stagger effects |
| Styling | Tailwind CSS 3.4 | Utility-first CSS with custom theme |
| Build | Vite 5 | Dev server (HMR) and production bundler |
| Database | Supabase (PostgreSQL) | Slides data, settings, real-time sync |
| Storage | Supabase Storage | Images, videos, logos |
| Hosting | Vercel | SPA deployment with rewrites |

## Project Structure

```
src/
  main.jsx                    # React entry point
  App.jsx                     # Router + slideshow viewer
  index.css                   # Tailwind base + custom animations
  scenes.json                 # Fallback slide data (if DB empty)
  components/
    Scene.jsx                 # Slide type dispatcher
    Editor.jsx                # Full slide editor UI (~99KB)
    FullScreenVideoSlide.jsx  # MP4 + YouTube video player
    TestimonialSlide.jsx      # Quote/testimonial layout
    ServiceCardSlide.jsx      # Feature/service cards grid
    SplitContentSlide.jsx     # Half-image, half-text layout
    LogoGridSlide.jsx         # Logo grid display
    ImpactSlide.jsx           # Big stats + optional fireworks
    ClientLogosSlide.jsx      # Dynamic client logo grid
    FullScreenImageSlide.jsx  # Fullscreen background image
    BuildAnimation.jsx        # Element-level animation system
    HelpModal.jsx             # In-editor help overlay
    LogoLibraryManager.jsx    # Admin: manage client logos
    RichTextArea.jsx          # Markdown text editor
    SlideTransition.jsx       # Transition effect definitions
    KineticText.jsx           # Word-by-word text animation
    MobileWarning.jsx         # Mobile device warning overlay
  hooks/
    useSupabaseSync.js        # Auto-save + real-time sync
  lib/
    supabase.js               # Supabase client initialization
  utils/
    formatText.js             # Markdown to HTML parser
    gradientThemes.js         # 8 color theme presets
  pages/
    Admin.jsx                 # Admin dashboard (/admin)
scripts/                      # Maintenance & backup utilities
supabase-migrations/          # SQL migration files
backups/                      # JSON data backups
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Slideshow (in App.jsx) | Fullscreen auto-advancing viewer |
| `/editor` | Editor.jsx | Slide editing interface |
| `/admin` | Admin.jsx | Logo library + settings dashboard |

All routes are client-side. `vercel.json` rewrites everything to `index.html`.

## Data Flow

### Slideshow Load

1. App mounts, queries Supabase: `SELECT slides, settings FROM slideshow_data WHERE project_name='default'`
2. Falls back to `scenes.json` if database is empty
3. Subscribes to Supabase real-time channel for live updates
4. Any database change triggers re-render automatically

### Editor Auto-Save

1. User edits a field -> local state updates immediately
2. `useSupabaseSync` hook starts a 2-second debounce timer
3. After 2s of inactivity: `UPSERT` to Supabase with incremented version
4. Supabase real-time broadcasts the change
5. Any open slideshow viewer re-renders with new data

### Version Conflict Detection

When multiple editors are open simultaneously:
- Each editor tracks the remote `version` number
- On receiving a real-time update with a newer version, the editor prompts: "Load newer changes?"
- Accepting loads remote data; declining keeps local edits

## Key Design Decisions

- **Supabase over local files**: Enables real-time sync across devices and persistent storage independent of deployments
- **Framer Motion**: Provides spring physics and GPU-accelerated animations at 60fps
- **No authentication**: The app relies on URL privacy (suitable for internal/event use). For public deployments, add Supabase Auth
- **Single `slideshow_data` row**: All slides stored as a JSONB array in one row per project. Simpler than per-slide rows, sufficient for deck sizes under 100+ slides
- **Featured slide distribution**: Featured slides are duplicated and evenly spread throughout the deck rather than grouped at the end
