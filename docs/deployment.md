# Deployment

## Vercel

The app is deployed on Vercel as a static SPA.

- **Project**: `sym-slideshow`
- **URL**: https://sym-slideshow.vercel.app
- **Auto-deploy**: Pushes to `main` trigger automatic deployments

### Vercel Configuration

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This routes all paths to `index.html` for client-side routing.

### Environment Variables

Set these in the Vercel project settings (Settings > Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |

Do **not** set `SUPABASE_SERVICE_KEY` on Vercel — it's only needed for local maintenance scripts.

### Build Settings

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

## Manual Deploy

```bash
npm run build
# Upload dist/ to any static host
```

Or use the Vercel CLI (only when explicitly needed):

```bash
vercel --prod
```

## Pre-Deployment Checklist

- [ ] All slide types render correctly in the editor preview
- [ ] Auto-save works (check save indicator)
- [ ] Images and videos load from Supabase storage
- [ ] Real-time sync works between two browser tabs
- [ ] Keyboard controls function in slideshow view
- [ ] Gradient themes apply correctly
- [ ] Mobile warning appears on small screens
- [ ] No console errors in production build (`npm run preview`)
