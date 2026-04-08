# Editor Guide

## Accessing the Editor

Navigate to `/editor` (e.g., `https://sym-slideshow.vercel.app/editor`).

The editor has three panels:
- **Left**: Slide list with drag-and-drop reordering
- **Center**: Live preview of the selected slide
- **Right**: Detail editing for the selected slide

## Slide Types

| Type | Description |
|------|-------------|
| `hero` | Large title + subtitle + optional CTA button |
| `testimonial` | Quote with author, role, company, and star rating |
| `service-card` | Grid of feature/service cards |
| `split-content` | Half image, half text with bullet points |
| `logo-grid` | Grid of partner/client logos |
| `impact` | Big stat number with optional fireworks animation |
| `fullscreen-image` | Full-bleed background image |
| `fullscreen-video` | MP4 upload or YouTube embed |

## Common Slide Fields

- **Title / Subtitle**: Support markdown formatting (bold, italic, links)
- **Duration (sec)**: How long the slide displays before auto-advancing (default: 20)
- **Featured**: Mark slides to repeat more often throughout the deck
- **Background Image**: Upload or paste a URL

## Animation Settings

### Build Scope (what to animate)
- **Off**: No entrance animation
- **Components**: Animate title, subtitle, CTA as separate blocks
- **Elements**: Animate individual words or list items
- **Sections**: Animate large visual sections

### Build Style (how to animate)
- **Classic**: Words rise and fade in with spring physics
- **Cascading Fade**: Staggered opacity reveal
- **Scaling Cascade**: Scale up + fade in sequence
- **Slide In**: Elements slide from a direction
- **Blur Focus**: Blur to sharp transition
- **Typewriter**: Character-by-character reveal

### Gradient Themes

8 preset color schemes for slide backgrounds:
- TechGuilds (default: violet/magenta/cyan)
- Ocean Blue, Sunset, Forest Green, Monochrome, Fire, Royal Purple, Arctic

## Media Upload

- **Images**: Click the image field and upload. Stored in `slideshow-images` Supabase bucket.
- **Videos**: Upload MP4 files (max 500MB) or paste a YouTube URL. Stored in `slideshow-videos` bucket.
- **Logos**: Managed via the Admin dashboard (`/admin`). Stored in `client-logos` bucket.

## Auto-Save

Changes auto-save to Supabase after 2 seconds of inactivity. The save indicator in the editor shows current status. You can also force a save with the "Save Now" button.

## Keyboard Shortcuts (Slideshow Viewer)

| Key | Action |
|-----|--------|
| Arrow Right / Down | Next slide |
| Arrow Left / Up | Previous slide |
| Space | Pause / Resume auto-advance |
| Number + Enter | Jump to slide number |

## Undo / Redo

The editor maintains a 50-level undo/redo history for the current session.

## Real-Time Collaboration

Multiple editors can work simultaneously. If another editor saves changes, you'll see a prompt asking whether to load the newer version or keep your local edits.

## Admin Dashboard

Navigate to `/admin` to:
- Manage the **logo library** (upload, delete, organize client logos)
- View current settings and quick links to Supabase
