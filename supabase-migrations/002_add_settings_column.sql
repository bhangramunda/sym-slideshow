-- Add settings column to slideshow_data table
-- This column stores slideshow configuration like transition mode

-- Add the settings column (JSONB type for flexible settings object)
ALTER TABLE slideshow_data
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"transitionMode": "sync"}'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN slideshow_data.settings IS 'Slideshow configuration including transition mode (sync/wait) and other display settings';

-- Update existing rows to have default settings
UPDATE slideshow_data
SET settings = '{"transitionMode": "sync"}'::jsonb
WHERE settings IS NULL;
