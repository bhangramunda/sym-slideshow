# Editor Workflow Guide

## Understanding Image Persistence

### How It Works

The slideshow editor uses **two different storage systems**:

1. **Browser Storage (localStorage)** - Temporary, for the editing session
2. **Repository Storage (scenes.json)** - Permanent, for production deployment

### The Issue

When you upload images in the editor:
- ✅ Images ARE stored correctly as data URLs in the downloaded JSON
- ✅ Images ARE visible in the editor preview
- ❌ Images DON'T appear in production until you update the repository

### Why This Happens

The production slideshow at `https://sym-slideshow.vercel.app/` reads from `src/scenes.json` in the repository. When you edit slides in the browser, those changes are only in your browser's localStorage and the downloaded JSON file - NOT in the repository.

## Complete Workflow for Making Changes Stick

### Option 1: Browser-Based Editing (Quick, Temporary)

1. Go to https://sym-slideshow.vercel.app/editor
2. Make your edits (add images, change text, etc.)
3. Click "📤 Load JSON" to load a previous version if needed
4. Click "💾 Save & Download" to save your work
5. **Limitation**: Changes only persist in your browser until page reload

### Option 2: Permanent Deployment (Recommended)

1. **Edit in the editor**:
   - Go to https://sym-slideshow.vercel.app/editor
   - Upload images, edit slides, adjust timing, etc.
   - Click "💾 Save & Download" (saves as `scenes-YYYY-MM-DDTHH-MM-SS.json`)

2. **Update the repository**:
   ```bash
   # Copy the downloaded JSON file to your project
   cp ~/Downloads/scenes-2025-10-29T18-30-00.json "C:/Users/cmbra/techguilds/SYM Slideshow/src/scenes.json"

   # Commit the changes
   git add src/scenes.json
   git commit -m "Update slides with new content and images"
   git push
   ```

3. **Vercel auto-deploys**: Your changes go live in ~2 minutes

### Option 3: Load Previous Work

If you previously downloaded a JSON file and want to continue editing:

1. Go to https://sym-slideshow.vercel.app/editor
2. Click "📤 Load JSON"
3. Select your previously downloaded `scenes-*.json` file
4. Your slides (including images) are restored!

## Image Storage Format

Custom uploaded images are stored as **data URLs** in the JSON:

```json
{
  "type": "hero",
  "title": "My Slide",
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

- ✅ **Pro**: Fully portable, no external dependencies
- ⚠️ **Con**: Large files increase JSON size (shown in preview)
- 💡 **Tip**: Optimize images before upload (compress, resize to 1920x1080)

## Conflict Detection

The editor detects when multiple people are editing:

1. Person A downloads `scenes-2025-10-29T15-00-00.json`
2. Person B downloads `scenes-2025-10-29T15-30-00.json`
3. Person A opens editor → sees warning banner
4. Person A can choose: Load saved version OR Keep current changes

## Quick Tips

- **Use "Load JSON"** to resume work from a previous session
- **Timestamps in filenames** help track versions
- **Preview panel** shows exactly how slides will look
- **Undo/Redo (Ctrl+Z/Y)** works for all changes
- **Resize panels** to customize your workspace
- **Download frequently** to avoid losing work

## Current Limitations

1. **No auto-sync**: Changes must be manually deployed to production
2. **File size**: Large images increase JSON size significantly
3. **Browser-based**: No server-side storage or database

## Need Help?

If images aren't showing in production:
1. Verify the downloaded JSON contains data URLs (should be very large)
2. Replace `src/scenes.json` with your downloaded file
3. Commit and push to trigger Vercel deployment
4. Wait 2-3 minutes for deployment to complete
