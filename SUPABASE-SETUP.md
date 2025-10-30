# Supabase Autosave Setup Instructions

## ✅ Completed Steps

1. Database schema created in Supabase
2. Supabase client configured
3. Autosave hook implemented
4. Real-time sync enabled
5. Save status indicator added to UI

## 🔑 Get Your Anon Key (Required)

**IMPORTANT**: Do NOT use the service role key in the client! Get the anon key instead:

1. Go to: https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot/settings/api
2. Find the section "Project API keys"
3. Copy the **anon public** key (starts with `eyJ...`)
4. This key is safe to use in client-side code

## 📝 Local Development Setup

Update `.env.local` with your anon key:

```env
VITE_SUPABASE_URL=https://fyiwpqnbiutuzuxjdeot.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key-here>
```

Then restart your dev server:
```bash
# Kill the current server (Ctrl+C)
npm run dev
```

## 🚀 Vercel Deployment Setup

Add environment variables to Vercel:

1. Go to: https://vercel.com/your-username/sym-slideshow/settings/environment-variables
2. Add these variables:
   - `VITE_SUPABASE_URL` = `https://fyiwpqnbiutuzuxjdeot.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your-anon-key>`
3. Click "Save"
4. Redeploy the project

## ✨ Features

### Autosave
- Saves automatically 2 seconds after you stop editing
- No need to click "Save & Download" anymore
- Visual status indicator shows save state:
  - 🟡 "Unsaved changes" - waiting to save
  - 🔵 "Saving..." - currently saving
  - 🟢 "Saved" - successfully saved
  - 🔴 "Save failed" - error occurred

### Real-Time Sync
- Multiple editors can work simultaneously
- When someone else saves, you'll get a prompt to load their changes
- Prevents overwriting each other's work

### Conflict Resolution
- If remote version is newer, you'll be asked: "Load newer changes?"
- Choose "OK" to load remote changes
- Choose "Cancel" to keep working on your version

## 📊 How It Works

1. **On Load**: Editor checks Supabase for latest slides
2. **On Edit**: Changes are queued for autosave (2-second delay)
3. **On Save**: Slides are saved to Supabase as JSONB
4. **Real-Time**: Other editors are notified of changes via WebSocket
5. **Conflict**: If versions conflict, user is prompted to resolve

## 🗄️ Database Schema

The `slideshow_data` table has:
- `id`: UUID primary key
- `project_name`: Text (defaults to "default")
- `slides`: JSONB array of slide objects
- `updated_at`: Timestamp (auto-updated)
- `updated_by`: Text (tracks who made changes)
- `version`: Integer (increments on each save)

## 🔄 Migration from localStorage

Your existing localStorage data will be automatically migrated to Supabase on first load. The editor checks:
1. Is there data in Supabase?
2. If yes, load it
3. If no, create initial entry from scenes.json

## 🐛 Troubleshooting

### "Save failed" error
- Check that your anon key is correct in `.env.local`
- Verify the database schema was created successfully
- Check browser console for specific error messages

### Changes not syncing between editors
- Ensure both editors have the same Supabase URL and key
- Check that real-time is enabled in Supabase (it is by default)
- Try refreshing both browsers

### Old data showing up
- The editor loads from Supabase on startup
- Clear Supabase data: Run `DELETE FROM slideshow_data WHERE project_name = 'default';` in SQL Editor
- Then refresh the editor to re-initialize

## 📦 Backup & Export

The "💾 Save & Download" button still works and provides:
- Local backup as JSON file
- Timestamped for version control
- Can be loaded back via "📤 Load JSON"

This gives you both automatic cloud saves AND manual local backups!
