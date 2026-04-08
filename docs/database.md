# Database & Schema

## Supabase Project

- **URL**: `https://fyiwpqnbiutuzuxjdeot.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot

## Main Table: `slideshow_data`

```sql
CREATE TABLE slideshow_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL DEFAULT 'default',
  slides JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  version INTEGER DEFAULT 1
);

CREATE INDEX idx_slideshow_project ON slideshow_data(project_name);
CREATE INDEX idx_slideshow_updated ON slideshow_data(updated_at DESC);
```

The app uses a single row per project (currently hardcoded to `project_name = 'default'`). All slides are stored as a JSONB array in the `slides` column.

## Slide Object Structure

```json
{
  "type": "hero|testimonial|service-card|split-content|logo-grid|impact|fullscreen-image|fullscreen-video",
  "title": "string",
  "subtitle": "string",
  "image": "URL or data-URL",
  "durationSec": 20,
  "featured": false,
  "buildScope": "off|components|elements|sections",
  "buildStyle": "off|classic|cascadingFade|scalingCascade|slideIn|blurFocus|typewriter",
  "cta": "string or null",
  "quote": "string (testimonial)",
  "author": "string",
  "role": "string",
  "company": "string",
  "rating": "1-5",
  "services": [],
  "points": [],
  "video": "URL or YouTube link",
  "logos": [],
  "loop": false,
  "muted": true
}
```

Fields vary by slide type. Only `type` is required.

## Settings Object

```json
{
  "transitionMode": "sync|wait",
  "buildScope": "off|components|elements|sections",
  "buildStyle": "off|classic|cascadingFade|scalingCascade|slideIn|blurFocus|typewriter",
  "aspectRatio": "16:9|21:9|4:3",
  "featuredRepeats": 0,
  "fireworksIntensity": "none|light|medium|heavy|random",
  "gradientTheme": "techguilds|ocean|sunset|forest|monochrome|fire|royal|arctic"
}
```

## Storage Buckets

| Bucket | Purpose | Max Size |
|--------|---------|----------|
| `slideshow-images` | Background and slide images | Default |
| `slideshow-videos` | MP4 video files | 500MB |
| `client-logos` | Brand logo assets | Default |

All buckets use public access (no auth required to read). Write access uses the anon key.

## RLS Policies

Current RLS policies allow all operations with the anon key (suitable for internal use). For public deployments, restrict to authenticated users:

```sql
-- Example: restrict writes to authenticated users
CREATE POLICY "Authenticated users can update"
  ON slideshow_data FOR UPDATE
  USING (auth.role() = 'authenticated');
```

See `scripts/fix-rls-policies.sql` for the current policy definitions.

## Backup & Restore

**Backup:**
```bash
node scripts/backup-production-data.js
```
Saves current database content to `backups/` as timestamped JSON.

**Restore:**
```bash
node scripts/restore-production-data.js
```
Restores from the latest backup in `backups/`.

## Migrations

SQL migration files are in `supabase-migrations/`. Apply them via the Supabase SQL editor or CLI.
