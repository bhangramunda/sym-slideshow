-- Create slideshow_data table
CREATE TABLE IF NOT EXISTS slideshow_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL DEFAULT 'default',
  slides JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  version INTEGER DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE slideshow_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a single-user app)
CREATE POLICY "Allow all operations" ON slideshow_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_slideshow_project ON slideshow_data(project_name);
CREATE INDEX IF NOT EXISTS idx_slideshow_updated ON slideshow_data(updated_at DESC);

-- Insert default data from scenes.json (will be populated by the app)
INSERT INTO slideshow_data (project_name, slides)
VALUES ('default', '[]'::jsonb)
ON CONFLICT DO NOTHING;

-- Create function to update timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update timestamp
CREATE TRIGGER update_slideshow_data_updated_at
    BEFORE UPDATE ON slideshow_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON slideshow_data TO anon;
GRANT ALL ON slideshow_data TO authenticated;
