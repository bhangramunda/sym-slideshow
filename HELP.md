# Slideshow Editor Help Guide

Welcome to the TechGuilds × Kajoo AI Slideshow Editor! This guide will help you create stunning conference booth presentations.

## Quick Start

1. **Open the Editor**: Navigate to `/editor` in your browser
2. **Select a Slide**: Click on any slide in the left panel to edit it
3. **Edit Content**: Update the fields in the right panel
4. **Preview**: Watch your changes in real-time in the center preview
5. **Auto-Save**: All changes are automatically saved to the cloud

## Slide Types

### 🎯 Hero
Perfect for title slides and main messages.
- **Title**: Large, attention-grabbing text
- **Subtitle**: Supporting information
- **CTA**: Optional call-to-action button
- **Background Image**: Optional imagery

### 💥 Impact / ROI
Showcase impressive numbers and statistics.
- **Impact Number**: Big number (e.g., "$500K", "7x", "99%")
- **Description**: What the number represents
- **Subtitle**: Additional context
- **Badge**: Optional label (e.g., "ROI Proven")
- Includes fireworks animations and sparkle effects

### 💬 Testimonial
Display customer quotes and testimonials.
- **Quote**: The testimonial text
- **Author**: Person's name
- **Role**: Their job title
- **Company**: Company name
- **Rating**: Star rating (1-5)

### 🏢 Logo Grid
Show client or partner logos.
- **Title**: Section heading
- **Subtitle**: Optional description
- **Logos**: Add multiple company names
- Grid automatically adapts to logo count

### 📦 Service Card
Display services or features in cards.
- **Title**: Section heading
- **Services**: Multiple cards with:
  - Icon (emoji)
  - Name
  - Description
  - Features list
  - Optional badge

### 🔀 Split Content
Half image, half text layout (like "The Challenge").
- **Title**: Main heading
- **Subtitle**: Description
- **Points**: Bullet list
- **Image**: Background photo
- **Layout**: Choose image-left or image-right
- **CTA**: Optional button

### 🖼️ Full Screen Image
Display an image that fills the screen.
- **Image**: The image to display
- **Title**: Optional overlay title
- **Subtitle**: Optional overlay text

### 🎬 Full Screen Video
Auto-playing video that advances when complete.
- **Video**: Upload MP4 file (max 100MB)
- **Title**: Optional overlay title
- **Loop**: Keep playing (won't auto-advance)
- **Muted**: Audio control

## Working with Images

### Uploading Images
1. Click the **📁 Upload** button in the Background Image section
2. Select an image file (JPG, PNG, etc.)
3. Image is automatically:
   - Resized if too large
   - Uploaded to cloud storage
   - Added to your image library

### Reusing Images
Once uploaded, images appear in the dropdown under **📁 Uploaded Images**. Select any previously uploaded image to reuse it across slides - no need to upload again!

## Working with Videos

### Uploading Videos
1. Select **Full Screen Video** slide type
2. Click **📁 Upload** in the Video section
3. Choose an MP4 file (max 100MB)
4. Video uploads to cloud storage

### Video Options
- **Auto-Advance**: By default, slides advance when video ends
- **Loop**: Enable to keep playing indefinitely
- **Muted**: Videos are muted by default for autoplay

## Slideshow Settings

### Transition Style
- **Crossfade**: Smooth overlap between slides
- **Blank Gap**: Fade out, then fade in

### Build Animation
Controls how slide elements appear:
- **Scope**: Off, Components, Elements, or Sections
- **Style**: Classic, Cascading Fade, Scaling Cascade, Slide In, Blur Focus, Typewriter

### Aspect Ratio
Choose the display format:
- **16:9**: Standard HD (default)
- **21:9**: Ultrawide displays
- **4:3**: Classic format

## Slide Management

### Reordering Slides
Drag and drop slides in the left panel to reorder them.

### Duplicating Slides
Click the **📋 Duplicate** button to create a copy of the current slide.

### Deleting Slides
Click the **🗑️ Delete** button to remove the current slide.

### Adding New Slides
Click the **➕ Add Slide** button at the bottom of the left panel.

### Featured Slides
Check the **⭐ Featured** box to make a slide appear multiple times throughout the slideshow automatically.

## Formatting Text

### Markdown Support
Use markdown syntax in text fields:
- `**bold text**` for **bold**
- `*italic text*` for *italic*

### Best Practices
- Keep titles short and impactful
- Use bullet points for clarity
- Choose high-quality images
- Test on your actual display before presenting

## Keyboard Shortcuts (Playback)

When viewing the slideshow (`/` root path):

- **Arrow Right / Space**: Next slide
- **Arrow Left**: Previous slide
- **Type number + Enter**: Jump to specific slide
- **Escape**: Cancel jump-to input
- Controls auto-hide after 500ms of inactivity

## Playback Features

### Auto-Advance
Slides automatically advance based on their duration setting (default 20 seconds).

### Jump to Slide
Type a slide number and press Enter to jump directly to that slide during playback.

### Featured Slide Duplication
Slides marked as "Featured" will automatically appear multiple times throughout the slideshow for emphasis.

## Troubleshooting

### Images Not Loading
- Check that the image was uploaded successfully
- Try selecting it from the uploaded images dropdown
- Ensure your internet connection is stable

### Videos Not Playing
- Verify the file is MP4 format
- Check file size is under 100MB
- Ensure Content Security Policy allows Supabase storage

### Changes Not Saving
- Check the save status indicator at the top
- Verify you're connected to the internet
- Look for any error messages in the browser console

### Preview Not Updating
- Try clicking on a different slide, then back
- Refresh the browser page
- Check if there are any JavaScript errors

## Tips & Tricks

1. **Test Your Slideshow**: Always preview on the actual display you'll be using
2. **Use High-Res Images**: Upload the best quality images you have
3. **Keep It Simple**: Don't overcrowd slides with too much information
4. **Consistent Branding**: Use the same color scheme and style across slides
5. **Practice Timing**: Adjust slide durations based on how long people typically view each
6. **Featured Slides**: Use for your most important messages
7. **Impact Slides**: Great for grabbing attention with big numbers
8. **Videos**: Keep them short (under 30 seconds) for better engagement

## Need Help?

If you encounter issues or have questions:
1. Check this help guide first
2. Review the browser console for errors
3. Contact your development team
4. Check the GitHub repository for updates

---

Built with ❤️ using React, Framer Motion, and Supabase
