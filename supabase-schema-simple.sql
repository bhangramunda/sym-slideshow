-- Simple schema for slideshow_data table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot/sql

-- Drop table if it exists (careful - this will delete existing data)
DROP TABLE IF EXISTS slideshow_data CASCADE;

-- Create slideshow_data table
CREATE TABLE slideshow_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL UNIQUE,
  slides JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  version INTEGER DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE slideshow_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON slideshow_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_slideshow_project ON slideshow_data(project_name);

-- Create function to update timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = COALESCE(OLD.version, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_slideshow_data_updated_at ON slideshow_data;
CREATE TRIGGER update_slideshow_data_updated_at
    BEFORE UPDATE ON slideshow_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON slideshow_data TO anon;
GRANT ALL ON slideshow_data TO authenticated;
