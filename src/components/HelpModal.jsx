import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const helpContent = [
  {
    category: "🚀 Quick Start Guide",
    icon: "🚀",
    sections: [
      {
        title: "Welcome to the Slideshow Editor!",
        content: "This editor helps you create beautiful, professional slideshows for conferences, booths, and presentations. Everything auto-saves to the cloud in real-time.",
        type: "intro"
      },
      {
        title: "Step 1: Understanding the Interface",
        content: `The editor is divided into three main panels:

**Left Panel (Slide List)**
- Shows all your slides in order
- Click any slide to edit it
- Drag slides up/down to reorder
- Add new slides with the "+ Add Slide" button

**Center Panel (Live Preview)**
- See your changes instantly
- Exactly how it will look in the slideshow
- Auto-updates as you edit

**Right Panel (Slide Editor)**
- Edit all properties of the selected slide
- Fields change based on slide type
- All changes auto-save every 2 seconds`,
        type: "text"
      },
      {
        title: "Step 2: Create Your First Slide",
        content: `1. Click "+ Add Slide" at the bottom of the left panel
2. Choose a slide type (Hero is great for titles)
3. Fill in the Title field in the right panel
4. Add a Subtitle if desired
5. Watch it appear in the preview!`,
        type: "steps"
      },
      {
        title: "Step 3: Customize Your Slide",
        content: `Try these common customizations:
- **Duration**: How long the slide shows (in seconds)
- **Transition**: How it fades in/out
- **Build Style**: How text animates onto the screen
- **Background Image**: Add visual interest
- **Featured**: ⭐ Check this to show the slide multiple times`,
        type: "text"
      },
      {
        title: "Step 4: Preview Your Slideshow",
        content: `To see your slideshow in action:
1. Go to the root URL (/) in a new tab
2. Press F11 for fullscreen
3. Slides auto-advance based on duration
4. Use arrow keys to navigate manually`,
        type: "steps"
      }
    ]
  },
  {
    category: "📐 Slide Types & Layouts",
    icon: "📐",
    sections: [
      {
        title: "Client Logos (Images)",
        content: `**When to use**: Display client, partner, or sponsor logos

**Key Features**:
- Upload and manage logos in the Admin panel (/admin)
- Adaptive grid (1-3 columns based on logo count)
- Glassmorphism cards with hover effects
- Option to "fit logos" (scale to fill boxes)

**Field Layout**:
- **Title**: Main heading (top center)
- **Subtitle**: Description below title (optional)
- **Logos**: Select from uploaded logos in Admin
- **Fit Logos**: Toggle to scale logos to fill containers
- **Footer**: Small text at bottom (optional)`,
        type: "slide-type"
      },
      {
        title: "Full Screen Image",
        content: `**When to use**: Showcase a hero image, product photo, or visual

**Key Features**:
- Image fills entire screen
- Subtle zoom animation on entrance
- Optional overlay text
- Supports high-resolution images

**Field Layout**:
- **Image URL**: Path or URL to image
- **Title**: Overlay text (optional, centered)
- **Subtitle**: Additional overlay text (optional)
- **Image Upload**: Use 📁 button to upload new images`,
        type: "slide-type"
      },
      {
        title: "Full Screen Video",
        content: `**When to use**: Product demos, testimonials, event footage

**Key Features**:
- Auto-plays when slide appears
- Auto-advances to next slide when video ends
- Loop option for continuous playback
- Mute option for silent playback

**Field Layout**:
- **Video URL**: Path to MP4 file
- **Loop**: Checkbox to repeat video
- **Muted**: Checkbox to disable audio
- **Video Upload**: Use 📁 button to upload (max 100MB)`,
        type: "slide-type"
      },
      {
        title: "Hero",
        content: `**When to use**: Title slides, section breaks, major announcements

**Key Features**:
- Large, bold typography (auto-scales to text length)
- Dynamic font sizing (shorter text = larger size)
- Gradient backgrounds with particle effects
- Optional featured image above title

**Field Layout**:
- **Featured Image**: SVG/image shown above title (80% width max)
- **Title**: Main message (very large, up to 14rem)
- **Subtitle**: Supporting text (large, up to 7rem)
- **CTA**: Call-to-action button text (optional)
- **Background Image**: Subtle background (20% opacity blend)`,
        type: "slide-type"
      },
      {
        title: "Impact / ROI",
        content: `**When to use**: Showcase metrics, achievements, statistics

**Key Features**:
- Large number display with optional prefix/suffix
- Fireworks celebration effects (configurable intensity)
- Supports currency, percentages, multipliers
- Perfect for impressive stats

**Field Layout**:
- **Metric Value**: The big number (e.g., "250", "1.5M")
- **Metric Label**: Description (e.g., "Clients Served")
- **Prefix**: Symbol before number (e.g., "$", "+")
- **Suffix**: Symbol after number (e.g., "%", "x", "M")
- **Subtitle**: Additional context (optional)
- **Fireworks Intensity**: Set in global settings (none/light/medium/heavy/random)`,
        type: "slide-type"
      },
      {
        title: "Logo Grid (Text)",
        content: `**When to use**: Simple logo lists without images

**Key Features**:
- Text-based logo display
- Responsive grid layout
- Quick way to list partners/clients
- No image upload required

**Field Layout**:
- **Title**: Main heading
- **Subtitle**: Description (optional)
- **Logos**: Array of text items (one per line)`,
        type: "slide-type"
      },
      {
        title: "Service Card",
        content: `**When to use**: Highlight services, features, or offerings

**Key Features**:
- Icon + title + description cards
- Glassmorphism design
- Grid layout (responsive)
- Perfect for feature lists

**Field Layout**:
- **Title**: Main heading (top)
- **Subtitle**: Introduction text (optional)
- **Services**: Array of cards with icon, title, description`,
        type: "slide-type"
      },
      {
        title: "Split Content",
        content: `**When to use**: Problem/solution, before/after, text + visual

**Key Features**:
- 50/50 split layout
- Image on left, content on right
- Great for storytelling
- "The Challenge" style slides

**Field Layout**:
- **Title**: Main heading (right side, top)
- **Subtitle**: Body text (right side, main content)
- **Image**: Visual content (left side, full height)
- **CTA**: Optional button text (right side, bottom)`,
        type: "slide-type"
      },
      {
        title: "Testimonial",
        content: `**When to use**: Customer quotes, reviews, social proof

**Key Features**:
- Large quote display with quotation marks
- Star rating system
- Author name and title
- Company logo (optional)

**Field Layout**:
- **Quote**: The testimonial text (large, centered)
- **Author**: Name of person quoted
- **Title**: Job title/role (optional)
- **Company**: Organization name (optional)
- **Rating**: Stars out of 5 (optional)
- **Image**: Author photo or company logo (optional)`,
        type: "slide-type"
      }
    ]
  },
  {
    category: "✨ Animation & Build Styles",
    icon: "✨",
    sections: [
      {
        title: "Understanding Build Animations",
        content: `Build animations control how elements appear on each slide. You can set a global default and override per-slide.

**Two Settings Control Animations**:
1. **Build Scope**: What gets animated (off/components/elements)
2. **Build Style**: How the animation looks (classic/fade/slide/etc.)`,
        type: "intro"
      },
      {
        title: "Build Scope Options",
        content: `**Off**: No animations, everything appears instantly
- Use for simple slides or when you want instant display

**Components**: Animates major sections (recommended)
- Titles, subtitles, CTAs animate separately
- Smooth, professional feel
- Default uses KineticText for classic slide-in effect

**Elements**: Animates individual words or characters
- Most granular control
- Can create typewriter effects
- Best for dramatic reveals`,
        type: "animation",
        preview: "scope"
      },
      {
        title: "Build Style: Classic",
        content: `**The "KineticText" effect** (default)

**What it does**:
- Words slide in from left with slight blur
- Staggered timing creates wave effect
- Very smooth and professional
- Best for hero slides and titles

**Settings**:
- Works with "Components" scope
- Automatically applied to titles
- Can't be customized per-word

**Example**: "Welcome to TechGuilds" - each word slides in sequentially`,
        type: "animation",
        preview: "classic"
      },
      {
        title: "Build Style: Cascading Fade",
        content: `**Gentle fade-in with stagger**

**What it does**:
- Elements fade in one after another
- Subtle y-axis movement (upward float)
- Elegant and understated
- Works great for subtitles

**Settings**:
- Best with "Elements" scope for word-by-word
- Or "Components" scope for section-by-section
- Delay between elements: 0.05s

**Example**: Text appears to float up and fade in smoothly`,
        type: "animation",
        preview: "cascadingFade"
      },
      {
        title: "Build Style: Scaling Cascade",
        content: `**Pop-in effect with scale**

**What it does**:
- Elements scale up from 80% to 100%
- Combined with fade and slight rotation
- More playful and energetic
- Great for Impact/ROI slides

**Settings**:
- Initial scale: 0.8
- Final scale: 1.0
- Slight rotation: -5° to 0°
- Stagger delay: 0.08s

**Example**: Numbers and metrics pop into view with energy`,
        type: "animation",
        preview: "scalingCascade"
      },
      {
        title: "Build Style: Slide In",
        content: `**Directional entrance**

**What it does**:
- Elements slide in from the right
- Combined with fade
- Clear directional movement
- Modern and dynamic

**Settings**:
- Initial position: 20px to the right
- Moves to final position
- Fade from 0 to 1 opacity
- Stagger delay: 0.06s

**Example**: Text slides in from the right side like a reveal`,
        type: "animation",
        preview: "slideIn"
      },
      {
        title: "Build Style: Blur Focus",
        content: `**Camera focus effect**

**What it does**:
- Elements start very blurred
- Gradually come into sharp focus
- Cinematic feel
- Great for dramatic moments

**Settings**:
- Initial blur: 10px
- Final blur: 0px
- Combined with fade
- Slower timing (0.6s duration)

**Example**: Text appears blurry and sharpens like a camera focusing`,
        type: "animation",
        preview: "blurFocus"
      },
      {
        title: "Build Style: Typewriter",
        content: `**Character-by-character reveal**

**What it does**:
- Letters appear one at a time
- Classic typewriter effect
- Each character gets own animation
- Very attention-grabbing

**Settings**:
- REQUIRES "Elements" scope + "Typewriter" style
- Per-character animation
- Fast typing speed (0.03s per character)
- Cursor blink optional

**Example**: "Hello World" - H...e...l...l...o... W...o...r...l...d

**Important**: Must set BOTH scope=elements AND style=typewriter!`,
        type: "animation",
        preview: "typewriter"
      },
      {
        title: "Animation Override Per Slide",
        content: `You can override the global animation settings for any individual slide.

**How to Override**:
1. Select a slide
2. Find "Build Animation Override" section (blue box)
3. Choose custom Build Scope
4. Choose custom Build Style
5. Leave as "Use Global Default" to use global settings

**When to Override**:
- Hero slides: Use "Classic" for dramatic entrance
- Impact slides: Use "Scaling Cascade" for energy
- Testimonials: Use "Blur Focus" for cinematic feel
- Long text: Use "Off" to avoid slow reveals`,
        type: "text"
      }
    ]
  },
  {
    category: "🎨 Transition Effects",
    icon: "🎨",
    sections: [
      {
        title: "Understanding Transitions",
        content: `Transitions control how slides change from one to the next. Each slide can have its own transition effect.

**Default**: Fade (smooth crossfade)

You can customize transitions in two places:
1. **Per-Slide**: In the slide editor, "Transition Effect" dropdown
2. **Global Mode**: In Settings panel (Sync vs Wait)`,
        type: "intro"
      },
      {
        title: "Transition: Fade",
        content: `**Classic smooth crossfade**

**What it does**:
- Current slide fades out
- Next slide fades in simultaneously
- Smooth, professional, safe choice

**Duration**: 0.6 seconds
**Best for**: General use, professional presentations`,
        type: "transition"
      },
      {
        title: "Transition: Slide",
        content: `**Horizontal slide movement**

**What it does**:
- Current slide moves left and fades
- Next slide moves in from right
- Clear directional flow

**Duration**: 0.8 seconds
**Best for**: Storytelling, sequential content`,
        type: "transition"
      },
      {
        title: "Transition: Zoom",
        content: `**Scale-based transition**

**What it does**:
- Current slide scales down and fades
- Next slide scales up from small
- Dramatic, energetic feel

**Duration**: 0.7 seconds
**Best for**: Impact slides, big reveals`,
        type: "transition"
      },
      {
        title: "Transition: Flip",
        content: `**3D card flip effect**

**What it does**:
- Slides flip like a card rotating on Y-axis
- 3D perspective transformation
- Unique and memorable

**Duration**: 0.8 seconds
**Best for**: Before/after, problem/solution`,
        type: "transition"
      },
      {
        title: "Transition: Blur Zoom",
        content: `**Camera zoom with defocus**

**What it does**:
- Current slide blurs and scales down
- Next slide unblurs and scales up
- Cinematic, high-end feel

**Duration**: 0.9 seconds
**Best for**: High-production value presentations`,
        type: "transition"
      },
      {
        title: "Transition: Rotate",
        content: `**Spinning transition**

**What it does**:
- Current slide rotates out (360°)
- Next slide rotates in
- Playful, creative energy

**Duration**: 0.8 seconds
**Best for**: Fun, creative content`,
        type: "transition"
      },
      {
        title: "Transition Mode: Sync vs Wait",
        content: `**Global Setting** (in Settings panel)

**Sync Mode (Default)**:
- Slides crossfade (overlap during transition)
- Smooth, continuous feel
- No gap between slides
- More professional

**Wait Mode**:
- Current slide fades out completely
- Brief black gap
- Next slide fades in
- Good for dramatic pauses or section breaks

**Where to change**: Settings panel → Transition Mode dropdown`,
        type: "text"
      }
    ]
  },
  {
    category: "📋 Field Reference",
    icon: "📋",
    sections: [
      {
        title: "Common Fields (All Slides)",
        content: `**Slide Type** (Dropdown)
- Changes the layout/template of the slide
- Switching types preserves title/subtitle when possible
- Some types auto-clear fields (like fullscreen-image)

**Transition Effect** (Dropdown)
- How this slide transitions IN from previous
- Options: Fade, Slide, Zoom, Flip, Blur Zoom, Rotate
- Default: Fade

**Build Animation Override** (Dropdowns)
- Build Scope: Off / Components / Elements
- Build Style: Classic / Cascading Fade / Scaling Cascade / Slide In / Blur Focus / Typewriter
- Leave as "Use Global Default" to inherit from Settings

**Duration (seconds)** (Number input)
- How long this slide shows before auto-advancing
- Default: 20 seconds
- Can be any number (even decimals like 5.5)

**Featured** (⭐ Checkbox)
- When checked, this slide appears multiple times
- Repetition count set in Settings (Featured Repeats: 0-5)
- Copies distributed evenly throughout slideshow
- Great for key messages you want to reinforce`,
        type: "field-reference"
      },
      {
        title: "Title & Subtitle",
        content: `**Title** (Text input)
- Main heading of the slide
- Position: Varies by slide type (usually centered top or center)
- Font size: Auto-scales based on text length
  - Shorter titles = larger font (up to 14rem on hero)
  - Longer titles = smaller font to fit
- Supports **markdown bold** with **text**
- Can be empty for fullscreen-image/video slides

**Subtitle** (Rich text area)
- Supporting text below title
- Position: Below title, centered or left-aligned (varies by type)
- Font size: Auto-scales (up to 7rem on hero)
- Supports rich formatting:
  - **Bold**: **text**
  - *Italic*: *text*
  - Links: [text](url)
  - Line breaks: Use Enter/Return
- Can include multiple paragraphs`,
        type: "field-reference"
      },
      {
        title: "Images & Media",
        content: `**Background Image** (Text input or upload)
- Full-screen background behind content
- Position: Fills entire slide, 20% opacity, blend mode
- Format: URL or path
- Upload: Click 📁 to upload (auto-resizes)
- Tip: Use high-res images (1920x1080 or larger)

**Image Upload Button** (📁)
- Opens file picker
- Auto-uploads to Supabase storage
- Auto-resizes for web optimization
- Generates public URL
- Shows in dropdown for reuse

**Featured Image** (Hero slides only)
- Displayed ABOVE the title
- Position: Top center, before title
- Max width: 80% of slide width
- Max height: 40vh (40% of viewport)
- Perfect for SVG logos or key visuals
- Maintains aspect ratio

**Video URL** (Fullscreen-video only)
- Path to MP4 file
- Auto-plays when slide appears
- Loop checkbox: Repeat continuously
- Muted checkbox: Silent playback
- Auto-advance: Moves to next slide when video ends (if not looping)`,
        type: "field-reference"
      },
      {
        title: "Client Logos Fields",
        content: `**Select Logos** (Multi-select)
- Choose from logos uploaded in Admin panel (/admin)
- Click to toggle selection
- Selected logos appear in order chosen
- Grid auto-adjusts to logo count:
  - 1 logo: Single large (384px tall)
  - 2 logos: 2 columns (320px tall)
  - 3 logos: 3 columns (288px tall)
  - 4-6 logos: 3 columns (256px tall)
  - 7-9 logos: 3 columns (224px tall)
  - 10+ logos: 3 columns (192px tall)

**Fit Logos to Fill Boxes** (Checkbox)
- When OFF: Logos scale to fit within box (may have whitespace)
- When ON: Logos scale up to fill entire box (no whitespace)
- Both maintain aspect ratio (no distortion)
- Use ON for uniform appearance
- Use OFF for varied logo sizes

**Footer** (Text input, optional)
- Small text at bottom of slide
- Position: Below logo grid, centered
- Use for disclaimers or additional context`,
        type: "field-reference"
      },
      {
        title: "Impact/ROI Fields",
        content: `**Metric Value** (Text input)
- The big number to display
- Examples: "250", "1.5M", "99.9"
- Can include letters for abbreviations
- Font size: Very large, centered

**Metric Label** (Text input)
- Description of the metric
- Examples: "Clients Served", "Revenue Growth", "Success Rate"
- Position: Below the metric value
- Font size: Medium, centered

**Prefix** (Text input, optional)
- Symbol/text before the number
- Examples: "$", "+", "~"
- Position: Directly before metric value
- Same font size as metric

**Suffix** (Text input, optional)
- Symbol/text after the number
- Examples: "%", "x", "M", "B", "+"
- Position: Directly after metric value
- Same font size as metric

**Fireworks Intensity** (Global setting)
- None: No celebration effects
- Light: Subtle fireworks
- Medium: Moderate celebration
- Heavy: Lots of fireworks and confetti
- Random: Varies per slide
- Set in Settings panel, applies to all Impact slides`,
        type: "field-reference"
      },
      {
        title: "CTA (Call to Action)",
        content: `**CTA Text** (Text input, optional)
- Button or action text
- Examples: "Learn More", "Contact Us", "Get Started"
- Position: Varies by slide type
  - Hero: Bottom center, pill-shaped button
  - Split Content: Right side, bottom
- Styling: Glassmorphism with glow effect
- Note: Not clickable in slideshow (display only)`,
        type: "field-reference"
      }
    ]
  },
  {
    category: "⚙️ Settings & Global Options",
    icon: "⚙️",
    sections: [
      {
        title: "Transition Mode",
        content: `**Controls global transition behavior**

**Sync (Crossfade)** - Default
- New slide fades in while old fades out
- Smooth overlap
- No gap between slides
- Professional, seamless feel

**Wait (Gap)**
- Old slide fades out completely
- Brief black screen
- New slide fades in
- Good for dramatic pauses`,
        type: "setting"
      },
      {
        title: "Build Scope (Global Default)",
        content: `**Default animation scope for all slides**

**Off**: No animations
- Everything appears instantly
- Fast, no delays

**Components**: Animate major sections (Recommended)
- Titles, subtitles, CTAs animate separately
- Smooth, professional
- KineticText effect for Classic style

**Elements**: Animate individual words/characters
- Most granular
- Enables typewriter effects
- Can be slow for long text

*Individual slides can override this setting*`,
        type: "setting"
      },
      {
        title: "Build Style (Global Default)",
        content: `**Default animation style for all slides**

Options:
- **Off**: No animation
- **Classic**: KineticText slide-in (recommended)
- **Cascading Fade**: Gentle fade with float
- **Scaling Cascade**: Pop-in with scale
- **Slide In**: Horizontal entrance
- **Blur Focus**: Camera focus effect
- **Typewriter**: Character-by-character (requires Elements scope)

*Individual slides can override this setting*`,
        type: "setting"
      },
      {
        title: "Aspect Ratio",
        content: `**Screen dimensions for the slideshow**

**16:9 (Standard HD)** - Default
- 1920x1080 pixels
- Most common displays
- Standard monitors and projectors

**21:9 (Ultrawide)**
- 2560x1080 pixels
- Ultrawide monitors
- Cinematic feel
- More horizontal space

**4:3 (Classic)**
- 1440x1080 pixels
- Older projectors
- Vintage aesthetic

*Choose based on your display hardware*`,
        type: "setting"
      },
      {
        title: "Featured Repeats",
        content: `**How many extra copies of featured slides**

Options: 0-5 (Default: 2)

**How it works**:
1. Check ⭐ Featured on important slides
2. Set repeat count here (e.g., 2)
3. Each featured slide gets 2 additional copies
4. Copies distributed evenly throughout deck

**Example**:
- 10 total slides, 2 featured
- Featured Repeats = 2
- Result: 14 slides (10 original + 4 copies)
- Copies appear at regular intervals

**Use case**: Reinforce key messages without manual duplication`,
        type: "setting"
      },
      {
        title: "Fireworks Intensity",
        content: `**Celebration effects for Impact/ROI slides**

**None**: No effects
- Clean, minimal

**Light**: Subtle celebration
- Few fireworks
- Minimal confetti

**Medium**: Moderate celebration (Default)
- Good balance
- Noticeable but not overwhelming

**Heavy**: Maximum celebration
- Lots of fireworks
- Heavy confetti
- Very energetic

**Random**: Varies per slide
- Unpredictable intensity
- Keeps it fresh

*Only affects Impact/ROI slide type*`,
        type: "setting"
      }
    ]
  },
  {
    category: "🎬 Slideshow Playback",
    icon: "🎬",
    sections: [
      {
        title: "Accessing the Slideshow",
        content: `**Two ways to view your slideshow**:

**1. From Editor**:
- Preview panel in center always shows current slide
- Not fullscreen, for editing purposes

**2. Standalone Slideshow**:
- Go to root URL: /
- Opens in new tab
- Full slideshow experience with auto-advance
- This is what your audience sees

**Pro Tip**: Press F11 in browser for true fullscreen (hide browser UI)`,
        type: "text"
      },
      {
        title: "Keyboard Navigation",
        content: `**Arrow Keys**:
- **Right Arrow / Space**: Next slide
- **Left Arrow**: Previous slide

**Jump to Slide**:
1. Type a number (e.g., "5")
2. Press Enter
3. Jumps to slide #5
4. Press Escape to cancel

**Controls**:
- Mouse/keyboard activity shows controls
- Auto-hide after 500ms of inactivity
- Shows: slide counter, current slide number

**Other**:
- **Escape**: Exit fullscreen (browser default)`,
        type: "text"
      },
      {
        title: "Auto-Advance",
        content: `**How auto-advance works**:

1. Each slide has a Duration (in seconds)
2. After that time, slides auto-advance to next
3. Loops back to first slide at end
4. Runs continuously for booth/kiosk use

**Interrupting auto-advance**:
- Use arrow keys to skip ahead/back
- Auto-advance resumes from new position
- Timer resets when you manually navigate

**Video slides**:
- If video has "Loop" OFF, slide advances when video ends
- If video has "Loop" ON, slide advances after Duration
- Useful for timed video content`,
        type: "text"
      },
      {
        title: "Slide Counter",
        content: `**Bottom right corner shows**:
- "Slide X / Y"
- X = current slide number
- Y = total slides (including featured repeats)

**Jump Input**:
- When typing numbers, shows "Jump to: X_"
- Press Enter to confirm
- Press Escape to cancel

**Auto-hide**:
- Fades out after 500ms of no mouse/keyboard
- Reappears on any activity
- Cursor also hides for clean display`,
        type: "text"
      },
      {
        title: "Mobile Warning",
        content: `**Why mobile isn't ideal**:
- This slideshow is optimized for large displays
- Text may be too small on phones/tablets
- Animations perform better on desktop
- Designed for booth monitors, projectors, TVs

**Mobile warning**:
- Automatically shows on mobile devices
- Can be dismissed
- Slideshow will still work, but experience may vary

**Best practice**: Use desktop/laptop for editing, large display for presenting`,
        type: "text"
      }
    ]
  },
  {
    category: "🖼️ Image & Video Management",
    icon: "🖼️",
    sections: [
      {
        title: "Uploading Images",
        content: `**How to upload**:
1. Click the 📁 "Upload Image" button (in any image field)
2. Select image file from your computer
3. File auto-uploads to Supabase storage
4. URL auto-fills in the field
5. Image appears in dropdown for reuse

**Supported formats**:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

**Recommendations**:
- Use high-resolution images (1920x1080 or larger)
- Compress before upload for faster loading
- Use descriptive filenames
- Avoid spaces in filenames (use hyphens)`,
        type: "text"
      },
      {
        title: "Reusing Uploaded Images",
        content: `**Once an image is uploaded**:
- It's stored permanently in Supabase
- Appears in dropdown on all slides
- Can be used multiple times
- No need to re-upload

**Image dropdown**:
- Shows all uploaded images
- Sorted by upload date (newest first)
- Filename displayed
- Click to select

**Viewing uploaded images**:
- Check Supabase storage browser
- Or use browser dev tools to inspect URLs`,
        type: "text"
      },
      {
        title: "Uploading Videos",
        content: `**How to upload**:
1. Go to fullscreen-video slide type
2. Click 📁 "Upload Video" button
3. Select MP4 file (max 100MB)
4. Wait for upload to complete
5. URL auto-fills

**Supported formats**:
- MP4 (H.264 codec recommended)
- Max file size: 100MB
- Max recommended duration: 60 seconds

**Best practices**:
- Compress videos before upload
- Use web-optimized encoding (H.264)
- Test playback in slideshow before presenting
- Consider muting if no important audio`,
        type: "text"
      },
      {
        title: "Managing Client Logos",
        content: `**Logo management is separate**:
- Go to /admin to manage client logos
- Upload SVG, PNG, or JPG logos
- Rename, reorder, delete logos
- Select logos in "Client Logos" slide type

**Admin panel features**:
- Drag-and-drop reordering
- Bulk upload support
- Preview before adding to slides
- Persistent storage in database

**Logo recommendations**:
- Use SVG for scalability
- Transparent backgrounds (PNG)
- High contrast for visibility
- Square or horizontal orientation works best`,
        type: "text"
      }
    ]
  },
  {
    category: "🔧 Tips & Best Practices",
    icon: "🔧",
    sections: [
      {
        title: "Design Tips",
        content: `**Keep it simple**:
- Less text = more impact
- One main idea per slide
- Avoid overwhelming your audience

**Use high-quality assets**:
- High-res images (1920x1080+)
- Professional photos
- Clear, legible fonts (handled by system)

**Consistency**:
- Stick to one or two animation styles
- Use similar durations for similar slides
- Maintain visual hierarchy

**Contrast**:
- Dark backgrounds are provided
- Ensure text is readable
- Test on actual display before event`,
        type: "text"
      },
      {
        title: "Performance Tips",
        content: `**Optimize images**:
- Compress images before upload
- Use WebP format when possible
- Don't upload massive files (>5MB)

**Optimize videos**:
- Keep videos under 30 seconds
- Use H.264 codec
- Compress to reasonable bitrate
- Test playback smoothness

**Limit animations**:
- Too many animations = slow slides
- Use "Off" for slides with lots of content
- Test on actual hardware before event

**Slideshow duration**:
- Total loop should be 3-5 minutes for booths
- 10-15 slides is ideal
- Adjust individual durations to balance`,
        type: "text"
      },
      {
        title: "Testing Checklist",
        content: `**Before your event**:

☐ Preview on actual display hardware
☐ Test in fullscreen mode (F11)
☐ Verify all images load correctly
☐ Test video playback and audio
☐ Check text readability from distance
☐ Verify animations aren't too slow
☐ Test auto-advance timing
☐ Check total loop duration
☐ Test keyboard navigation
☐ Verify slide counter visibility

**During event**:
☐ Load slideshow before audience arrives
☐ Let it loop at least once to warm cache
☐ Monitor for any skipped frames
☐ Have backup plan (PDF export?)`,
        type: "text"
      },
      {
        title: "Common Mistakes to Avoid",
        content: `**1. Too much text**:
- ❌ Paragraphs of small text
- ✅ Short, punchy statements

**2. Wrong aspect ratio**:
- ❌ Not matching display hardware
- ✅ Test aspect ratio before event

**3. Slow animations**:
- ❌ 5-second typewriter on long text
- ✅ Use "Off" for long content

**4. Missing featured slides**:
- ❌ Important message shown once
- ✅ Mark key slides as Featured

**5. Inconsistent duration**:
- ❌ Some 5sec, some 60sec
- ✅ Keep similar slides at similar duration

**6. Not testing**:
- ❌ First run is at the event
- ✅ Test multiple times beforehand`,
        type: "text"
      },
      {
        title: "Troubleshooting",
        content: `**Images not loading**:
- Check URL is correct and public
- Verify file uploaded successfully
- Try re-uploading
- Check browser console for errors

**Videos not playing**:
- Verify MP4 format (H.264)
- Check file size under 100MB
- Test in different browser
- Ensure autoplay is allowed

**Animations too slow**:
- Change build style to "Off"
- Use "Components" instead of "Elements"
- Reduce text length
- Test on actual hardware

**Slides skipping**:
- Check Duration isn't too short
- Verify no JavaScript errors in console
- Try refreshing the page
- Check network connection

**Auto-save not working**:
- Check network connection
- Verify Supabase credentials
- Look for error messages in top bar
- Try "💾 Save Now" button`,
        type: "text"
      }
    ]
  },
  {
    category: "🎓 Advanced Features",
    icon: "🎓",
    sections: [
      {
        title: "Rich Text Formatting",
        content: `**Markdown support in text fields**:

**Bold**: Wrap text in double asterisks
- Input: **important**
- Output: **important**

**Italic**: Wrap in single asterisks
- Input: *emphasis*
- Output: *emphasis*

**Links**: Use [text](url) syntax
- Input: [TechGuilds](https://techguilds.com)
- Output: Clickable link (in supported fields)

**Line breaks**:
- Press Enter/Return for new paragraph
- Double Enter for more space

**Where it works**:
- Subtitle fields (all slide types)
- Description fields
- Footer fields
- NOT in Title (kept simple for consistency)`,
        type: "text"
      },
      {
        title: "Featured Slide Distribution",
        content: `**How featured slides are distributed**:

The system uses a smart algorithm to space out featured slides evenly:

1. Identifies all slides marked as Featured
2. Creates X copies of each (X = Featured Repeats setting)
3. Calculates total deck size (original + copies)
4. Distributes copies at regular intervals
5. Interleaves different featured slides to avoid repetition

**Example**:
- 10 original slides
- 2 marked as Featured (A and B)
- Featured Repeats = 2
- Result: A, B, A, B copies added at positions 3, 6, 9, 12

**Pro tip**: Use this to reinforce key messages without manual duplication`,
        type: "text"
      },
      {
        title: "Real-Time Sync",
        content: `**Collaborative editing**:
- Multiple people can edit simultaneously
- Changes sync in real-time via Supabase
- All connected editors see updates instantly
- Slideshow (/) updates automatically

**How it works**:
- Editor auto-saves every 2 seconds
- Saves push to Supabase database
- Supabase broadcasts to all connected clients
- React state updates trigger re-render

**Conflict resolution**:
- Last write wins (newest change kept)
- No merge conflicts (JSON overwrite)
- Undo still works locally

**Use cases**:
- Team editing sessions
- Remote collaboration
- Live updates during presentations`,
        type: "text"
      },
      {
        title: "Admin Panel Features",
        content: `**Access**: Go to /admin

**Logo Library Manager**:
- Upload client/partner logos
- Drag to reorder
- Click to rename
- Delete button removes from storage
- Changes reflected in all slides using that logo

**Future features** (not yet implemented):
- Bulk upload
- Logo categories/tags
- Usage analytics
- Asset library for images/videos

**Pro tip**: Manage all logos in Admin before creating Client Logo slides`,
        type: "text"
      },
      {
        title: "Keyboard Shortcuts (Editor)",
        content: `**Navigation**:
- **↑/↓**: Select prev/next slide in list
- **Enter**: Focus on first field of selected slide
- **Tab**: Move between fields

**Editing**:
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + S**: Force save now
- **Esc**: Blur current field

**Not yet implemented**:
- Ctrl/Cmd + D: Duplicate slide
- Delete: Delete selected slide
- Ctrl/Cmd + N: New slide

*Some shortcuts may vary by browser*`,
        type: "text"
      },
      {
        title: "URL Parameters & Routes",
        content: `**Available routes**:

**/ (root)**:
- Fullscreen slideshow player
- Auto-advance enabled
- Keyboard navigation
- No editing UI

**/editor**:
- Full editing interface
- Three-panel layout
- Auto-save enabled
- Preview in center panel

**/admin**:
- Logo library manager
- Upload/manage client logos
- Drag-and-drop reordering
- Separate from slide editing

**Future routes** (not yet implemented):
- /preview?slide=5: Preview specific slide
- /export: Export as PDF or video
- /analytics: Usage analytics`,
        type: "text"
      }
    ]
  }
];

export default function HelpModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter sections based on search
  const getFilteredContent = () => {
    if (!searchQuery.trim()) return helpContent;

    const query = searchQuery.toLowerCase();
    return helpContent.map(category => ({
      ...category,
      sections: category.sections.filter(section =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query)
      )
    })).filter(category => category.sections.length > 0);
  };

  const filteredContent = getFilteredContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-tgteal/20 to-tgmagenta/20 border-b border-gray-700 px-8 py-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">📚 Complete Editor Guide</h1>
                  <p className="text-gray-400">Everything you need to create stunning slideshows</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-lg"
                  title="Close Help (Esc)"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Bar */}
              <div className="max-w-7xl mx-auto mt-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search help topics... (e.g., 'animations', 'logo', 'transition')"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-tgteal"
                  />
                  <svg className="absolute right-4 top-3.5 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100vh-180px)]">
              {/* Sidebar Navigation */}
              <div className="w-80 bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                    Categories ({filteredContent.length})
                  </h3>
                  {filteredContent.map((section, index) => {
                    const originalIndex = helpContent.findIndex(cat => cat.category === section.category);
                    return (
                      <button
                        key={section.category}
                        onClick={() => setActiveCategory(originalIndex)}
                        className={`w-full text-left px-4 py-3 mb-2 rounded-lg transition-all ${
                          activeCategory === originalIndex
                            ? 'bg-tgteal/20 text-tgteal border-l-4 border-tgteal'
                            : 'text-gray-300 hover:bg-gray-700/50 border-l-4 border-transparent hover:border-gray-600'
                        }`}
                      >
                        <div className="font-medium text-lg mb-1">
                          {section.icon} {section.category.replace(/^[^\s]+\s/, '')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {section.sections.length} topic{section.sections.length !== 1 ? 's' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-8">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Category Header */}
                    <div className="mb-8">
                      <h2 className="text-5xl font-bold text-white mb-3">
                        {helpContent[activeCategory].icon} {helpContent[activeCategory].category.replace(/^[^\s]+\s/, '')}
                      </h2>
                      <p className="text-gray-400 text-lg">
                        {helpContent[activeCategory].sections.length} topics in this section
                      </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                      {helpContent[activeCategory].sections.map((section, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-tgteal/50 transition-all"
                        >
                          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            {section.type === 'intro' && '👋'}
                            {section.type === 'steps' && '📝'}
                            {section.type === 'slide-type' && '🎨'}
                            {section.type === 'animation' && '✨'}
                            {section.type === 'transition' && '🎬'}
                            {section.type === 'field-reference' && '📋'}
                            {section.type === 'setting' && '⚙️'}
                            {section.title}
                          </h3>
                          <div
                            className="text-gray-300 leading-relaxed space-y-3 prose prose-invert max-w-none"
                            style={{ whiteSpace: 'pre-wrap' }}
                          >
                            {section.content.split('\n').map((paragraph, pIndex) => {
                              if (!paragraph.trim()) return null;

                              // Parse markdown-style formatting
                              let formattedText = paragraph;

                              // Bold
                              formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

                              // Code blocks
                              formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-900 px-2 py-1 rounded text-tgteal">$1</code>');

                              // Checkboxes
                              if (formattedText.startsWith('☐')) {
                                return (
                                  <div key={pIndex} className="flex items-start gap-2">
                                    <span className="text-gray-500 mt-1">☐</span>
                                    <span dangerouslySetInnerHTML={{ __html: formattedText.substring(1) }} />
                                  </div>
                                );
                              }

                              return (
                                <p key={pIndex} dangerouslySetInnerHTML={{ __html: formattedText }} />
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="bg-gray-800/80 border-t border-gray-700 px-8 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Press <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> to close
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveCategory((prev) => Math.max(0, prev - 1))}
                    disabled={activeCategory === 0}
                    className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium"
                  >
                    ← Previous Section
                  </button>
                  <button
                    onClick={() => setActiveCategory((prev) => Math.min(helpContent.length - 1, prev + 1))}
                    disabled={activeCategory === helpContent.length - 1}
                    className="px-6 py-2 bg-tgteal text-black rounded-lg hover:bg-tgteal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Next Section →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
