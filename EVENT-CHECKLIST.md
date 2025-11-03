# 🎪 Conference Event - Quick Reference

## ✅ DEPLOYMENT STATUS
**Changes pushed to production** ✓
Vercel will auto-deploy in ~2-3 minutes

---

## 🚨 CRITICAL - Before Event Starts

### Update Supabase Video Limit (REQUIRED for 500MB videos)
1. Go to: https://supabase.com/dashboard
2. Storage → `slideshow-videos` bucket → Policies
3. Update max file size to **500MB**
4. **Without this, large video uploads will fail**

---

## 🔗 Important URLs

- **Slideshow**: https://sym-slideshow.vercel.app/
- **Editor**: https://sym-slideshow.vercel.app/editor
- **Admin** (logos): https://sym-slideshow.vercel.app/admin

---

## ⌨️ Keyboard Controls (During Slideshow)

| Key | Action |
|-----|--------|
| **Space** | Pause/Play |
| **→ / ←** | Next/Previous (auto-resumes after 5s) |
| **F11** | Browser fullscreen |
| **123 + Enter** | Jump to slide #123 |
| **Esc** | Cancel jump |

---

## 🎨 Quick Onsite Changes

### Change Colors (New Feature!)
1. Open `/editor` on phone/laptop
2. Settings panel → **Gradient Theme** dropdown
3. Choose from 8 themes:
   - 🎨 TechGuilds (default - violet/magenta/cyan)
   - 🌊 Ocean Blue
   - 🌅 Sunset
   - 🌲 Forest Green
   - ⬛ Monochrome
   - 🔥 Fire
   - 👑 Royal Purple
   - ❄️ Arctic
4. Changes apply instantly

### Edit Content
- Open `/editor`
- Changes auto-save every 2 seconds
- Slideshow updates in real-time

### Reorder Slides
- Drag and drop in slide list (editor)

---

## 🔧 Troubleshooting

### Colors Look Wrong
→ Change **Gradient Theme** in editor settings

### Animations Too Slow/Distracting
→ Editor → Settings → Build Style → **"Off"**

### Content Not Updating
→ Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
→ Or open **incognito window**

### Video Upload Fails
→ Check file size (<500MB)
→ Check Supabase bucket policy updated
→ Check internet connection

### Can't Go Fullscreen
→ Press **F11** key
→ Or use browser menu

---

## ⚡ Performance Tips

- Keep laptop **plugged in** (slideshow is intensive)
- **Disable sleep mode**
- Close other applications
- Ensure **reliable WiFi** (requires internet for Supabase)

---

## 📱 Remote Control

Use any device with browser to:
- Open `/editor` to make changes
- Changes sync instantly to display

---

## 🎬 Video Notes

- Max upload: **500MB** (updated!)
- Large files may take **several minutes** to upload
- Compress before upload for faster speeds (HandBrake recommended)
- Videos stored in Supabase cloud

---

## 📋 Pre-Show Setup

1. ✅ Open slideshow URL in **fullscreen** (F11)
2. ✅ Disable **screensaver/sleep**
3. ✅ Test **WiFi connection**
4. ✅ Have `/editor` URL bookmarked for quick edits
5. ✅ Do test run of full slideshow
6. ✅ Verify gradient theme looks good on venue display

---

## 🆘 Emergency

**If everything breaks:**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Try incognito window
- Check WiFi connection
- Restart browser

---

## 🎯 Good to Know

- Everything saves to Supabase cloud
- No offline mode (needs internet)
- Changes from editor appear on slideshow in <2 seconds
- Featured slides repeat automatically (configurable)
- All keyboard controls work during presentation

---

**Have a great event! 🚀**
