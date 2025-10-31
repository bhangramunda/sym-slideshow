import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'client-logos';

async function setupStorage() {
  console.log('\n=== Setting up Supabase Storage ===\n');

  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`Creating bucket: ${BUCKET_NAME}...`);
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/svg+xml']
    });

    if (error) {
      // If RLS policy error, bucket might already exist - continue anyway
      if (error.statusCode === '403') {
        console.log('⚠️  Permission error creating bucket (may already exist), continuing...');
        return true;
      }
      console.error('Error creating bucket:', error);
      return false;
    }
    console.log('✓ Bucket created successfully');
  } else {
    console.log(`✓ Bucket "${BUCKET_NAME}" already exists`);
  }

  return true;
}

async function uploadLogos() {
  console.log('\n=== Uploading Logos ===\n');

  // Read logo metadata
  const metadataPath = path.join(__dirname, 'logo-metadata.json');
  const logos = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  console.log(`Found ${logos.length} logos to upload\n`);

  const uploadedLogos = [];

  for (const logo of logos) {
    try {
      // Read the SVG file
      const fileBuffer = fs.readFileSync(logo.file_path);

      // Create a clean filename (replace spaces, special chars)
      const cleanFilename = logo.path.replace(/ /g, '-').toLowerCase();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(cleanFilename, fileBuffer, {
          contentType: 'image/svg+xml',
          upsert: true
        });

      if (error) {
        console.error(`✗ Error uploading ${logo.filename}:`, error.message);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(cleanFilename);

      uploadedLogos.push({
        id: logos.indexOf(logo) + 1,
        filename: logo.filename,
        display_name: logo.display_name,
        theme: logo.theme,
        orientation: logo.orientation,
        storage_path: cleanFilename,
        public_url: urlData.publicUrl
      });

      console.log(`✓ Uploaded: ${logo.display_name}`);
    } catch (err) {
      console.error(`✗ Error processing ${logo.filename}:`, err.message);
    }
  }

  return uploadedLogos;
}

async function saveToDatabase(logos) {
  console.log('\n=== Saving Logo Metadata to Database ===\n');

  // Check if table exists, if not, provide SQL to create it
  const createTableSQL = `
-- Run this SQL in your Supabase SQL Editor if the table doesn't exist:

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

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert/update" ON client_logos
  FOR ALL USING (auth.role() = 'authenticated');
`;

  // Try to insert logos
  const { data, error } = await supabase
    .from('client_logos')
    .upsert(logos, { onConflict: 'storage_path' });

  if (error) {
    if (error.code === '42P01') {
      console.log('Table does not exist. Please run this SQL in Supabase:\n');
      console.log(createTableSQL);
    } else {
      console.error('Error saving to database:', error);
    }
    return false;
  }

  console.log(`✓ Successfully saved ${logos.length} logos to database`);
  return true;
}

async function main() {
  console.log('Starting logo upload process...');

  const storageReady = await setupStorage();
  if (!storageReady) {
    console.error('Failed to setup storage');
    process.exit(1);
  }

  const uploadedLogos = await uploadLogos();

  if (uploadedLogos.length === 0) {
    console.error('No logos were uploaded');
    process.exit(1);
  }

  const dbSuccess = await saveToDatabase(uploadedLogos);

  console.log('\n=== Upload Complete ===');
  console.log(`✓ Uploaded ${uploadedLogos.length} logos`);

  if (!dbSuccess) {
    console.log('\n⚠️  Database save failed. You can manually import the data:');
    fs.writeFileSync(
      path.join(__dirname, 'uploaded-logos.json'),
      JSON.stringify(uploadedLogos, null, 2)
    );
    console.log('Saved to: uploaded-logos.json');
  }
}

main().catch(console.error);
