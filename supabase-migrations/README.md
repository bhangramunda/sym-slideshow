# Supabase Database Migrations

This directory contains SQL migration scripts for the slideshow database schema.

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file
4. Run the SQL script

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

## Migration Files

### 001_initial_schema.sql
Creates the initial `slideshow_data` table with:
- `id`: Primary key
- `project_name`: Unique project identifier
- `slides`: JSONB array of slide data
- `version`: Auto-incrementing version for conflict detection
- `updated_by`: Last editor identifier
- `updated_at`: Timestamp (auto-updated)

### 002_add_settings_column.sql
Adds the `settings` column for slideshow configuration:
- Type: JSONB
- Default: `{"transitionMode": "sync"}`
- Stores configuration like transition mode (crossfade vs blank gap)

## Notes

- The app will work without running migration 002 (backwards compatible)
- If settings column doesn't exist, app falls back to slides-only mode
- After adding settings column, you can configure transition mode in the Editor
