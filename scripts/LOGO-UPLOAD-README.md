# Client Logos Setup Guide

## Overview
This system manages client logos stored in Supabase Storage for use in "Client Logos" slide types.

## Steps to Upload Logos (Run when OFF corporate network)

### 1. Analyze Logos
```bash
node scripts/analyze-logos.js
```
This scans `./logos` folder and generates `logo-metadata.json` with:
- Auto-detected theme (light/dark/color)
- Auto-detected orientation (horizontal/vertical)
- Display names
- File paths

### 2. Upload to Supabase
```bash
node scripts/upload-logos-to-supabase.js
```

This will:
- Create `client-logos` bucket in Supabase Storage (if it doesn't exist)
- Upload all 35 SVG logos suitable for dark backgrounds
- Create `client_logos` table (or provide SQL to create it)
- Save metadata to database

**Note:** The script provides SQL to create the table if it doesn't exist. Run that SQL in Supabase SQL Editor first.

### 3. SQL to Create Table

```sql
CREATE TABLE IF NOT EXISTS client_logos (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  display_name TEXT NOT NULL,
  theme TEXT NOT NULL, -- 'light', 'dark', 'color'
  orientation TEXT NOT NULL, -- 'horizontal', 'vertical', 'square'
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON client_logos
  FOR SELECT USING (true);

-- Allow authenticated insert/update (optional, for future updates)
CREATE POLICY "Allow authenticated insert/update" ON client_logos
  FOR ALL USING (auth.role() = 'authenticated');
```

## Using Client Logos in Slides

### In Editor:
1. Create new slide with type: `client-logos`
2. In the `logos` field, select from available logos
3. Logos will auto-size based on quantity:
   - 1 logo: Very large (h-64)
   - 2-4 logos: Medium (h-48), 2x2 grid
   - 5-8 logos: Smaller (h-36), 4x2 grid
   - 9+ logos: Small (h-32), 4+ columns, auto rows

### Slide Data Structure:
```json
{
  "type": "client-logos",
  "title": "Trusted by Industry Leaders",
  "subtitle": "Optional subtitle text",
  "logos": [
    {
      "id": 1,
      "display_name": "Honda",
      "public_url": "https://...supabase.co/storage/v1/object/public/client-logos/honda.svg",
      "theme": "light",
      "orientation": "horizontal"
    }
  ],
  "footer": "Optional footer text",
  "durationSec": 15
}
```

## Logo Library Summary
- **Total SVG files**: 40
- **Suitable for dark backgrounds**: 35 (light/color themes)
- **Clients**: Honda, Deloitte, Amica, Moneris, YMCA GTA, Porsche, OSSTF, NWMO, WSP, and more

## Notes
- Logos are automatically converted to white for dark backgrounds using CSS filter
- SVG format ensures crisp display at any size
- Public bucket allows CDN-level caching
- All logo files under 5MB size limit
