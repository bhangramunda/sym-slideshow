# Troubleshooting

## Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Slides won't load | No internet or Supabase is down | Check connection; check https://status.supabase.com |
| Changes not saving | Network error or stale session | Check browser console; click "Save Now" button |
| Images too large/slow | Uncompressed uploads | Compress images before uploading |
| Videos won't play | Wrong format or bad YouTube URL | Use MP4 files or valid YouTube URLs |
| Preview not updating | Browser cache | Hard refresh: Ctrl+Shift+R |
| Editor conflicts | Multiple editors open | Accept or decline the "Load newer changes?" prompt |
| Logo upload fails | Storage bucket permissions | Check Supabase storage RLS policies |
| Blank screen on load | JS error or missing env vars | Check browser console (F12); verify `.env` |
| Build fails | Stale `.next` or `node_modules` | Delete `.next` folder and `node_modules`, reinstall |

## Emergency Runbook

### Site Is Down

1. Check Vercel status at https://vercel.com/dashboard
2. Check Supabase status at https://status.supabase.com
3. Hard refresh (Ctrl+Shift+R) or try incognito mode
4. Check browser console (F12) for specific errors
5. Verify environment variables are set in Vercel

### Data Is Lost

1. Check the `backups/` folder for recent JSON exports
2. Restore with: `node scripts/restore-production-data.js`
3. Or manually restore via the Supabase SQL editor

### Editor Won't Save

1. Open browser DevTools (F12) > Network tab
2. Look for failed requests to `supabase.co`
3. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
4. Check Supabase database permissions (RLS policies)
5. Try the "Save Now" button
6. As a last resort, copy your slide data from the editor and restore manually

## Event Day Checklist

### Before the Event

- [ ] Open the slideshow URL on the display device
- [ ] Verify all slides load and advance correctly
- [ ] Test that images and videos play without buffering
- [ ] Confirm the display resolution matches the aspect ratio setting
- [ ] Set the browser to fullscreen (F11)
- [ ] Disable screen saver and sleep mode on the display device
- [ ] Have a backup device ready

### During the Event

- [ ] Monitor the slideshow periodically
- [ ] If edits are needed, use `/editor` from another device
- [ ] Changes sync in real-time (no need to refresh the display)

### After the Event

- [ ] Run `node scripts/backup-production-data.js` to save current state
- [ ] Note any issues encountered for future events

## Useful Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Backup data | `node scripts/backup-production-data.js` | Export slides to JSON |
| Restore data | `node scripts/restore-production-data.js` | Import from backup |
| Verify persistence | `node scripts/verify-content-persistence.js` | Check DB content |
| Check logos | `node scripts/check-logo-state.js` | Verify logo metadata |
| Clean orphaned logos | `node scripts/cleanup-orphaned-logos.js` | Remove unused logos |

## Getting Help

- Check existing docs: `HELP.md`, `SUPABASE-SETUP.md`, `EVENT-CHECKLIST.md` in the project root
- Open the Help modal inside the editor (? button)
- Check Supabase logs at https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot/logs
