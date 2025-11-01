import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PROJECT_NAME = 'default';

async function backupProductionData() {
  console.log('\n==============================================');
  console.log('💾 BACKING UP PRODUCTION DATABASE');
  console.log('==============================================\n');

  try {
    // 1. Backup slideshow_data
    console.log('1️⃣  Fetching slideshow data from Supabase...');
    const { data: slideshowData, error: slideshowError } = await supabase
      .from('slideshow_data')
      .select('*')
      .eq('project_name', PROJECT_NAME)
      .single();

    if (slideshowError) {
      console.error('❌ Error fetching slideshow data:', slideshowError.message);
      return;
    }

    console.log(`✅ Fetched ${slideshowData.slides?.length || 0} slides`);
    console.log(`   Version: ${slideshowData.version}`);
    console.log(`   Last updated: ${new Date(slideshowData.updated_at).toLocaleString()}`);
    console.log('');

    // 2. Backup client_logos
    console.log('2️⃣  Fetching client logos from Supabase...');
    const { data: logosData, error: logosError } = await supabase
      .from('client_logos')
      .select('*')
      .order('id', { ascending: true });

    if (logosError) {
      console.error('⚠️  Error fetching client logos:', logosError.message);
      console.log('   (This is OK if you haven\'t created any logos yet)');
    }

    console.log(`✅ Fetched ${logosData?.length || 0} client logos`);
    console.log('');

    // 3. Create backup object
    const backup = {
      metadata: {
        backupDate: new Date().toISOString(),
        backupVersion: slideshowData.version,
        supabaseProjectUrl: supabaseUrl,
        totalSlides: slideshowData.slides?.length || 0,
        totalLogos: logosData?.length || 0,
      },
      slideshow_data: {
        project_name: slideshowData.project_name,
        slides: slideshowData.slides,
        settings: slideshowData.settings,
        version: slideshowData.version,
        updated_at: slideshowData.updated_at,
        updated_by: slideshowData.updated_by,
      },
      client_logos: logosData || [],
    };

    // 4. Write backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFilename = `production-backup-${timestamp}.json`;
    const backupPath = join(__dirname, '..', 'backups', backupFilename);

    // Also create a "latest" backup
    const latestBackupPath = join(__dirname, '..', 'backups', 'production-backup-latest.json');

    console.log('3️⃣  Writing backup files...');

    // Create backups directory if it doesn't exist
    try {
      writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      console.log(`✅ Timestamped backup: backups/${backupFilename}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Directory doesn't exist, create it
        const { mkdirSync } = await import('fs');
        mkdirSync(join(__dirname, '..', 'backups'), { recursive: true });
        writeFileSync(backupPath, JSON.stringify(backup, null, 2));
        console.log(`✅ Timestamped backup: backups/${backupFilename}`);
      } else {
        throw err;
      }
    }

    writeFileSync(latestBackupPath, JSON.stringify(backup, null, 2));
    console.log(`✅ Latest backup: backups/production-backup-latest.json`);
    console.log('');

    // 5. Summary
    console.log('==============================================');
    console.log('📊 BACKUP SUMMARY');
    console.log('==============================================');
    console.log('');
    console.log(`📅 Backup Date: ${new Date().toLocaleString()}`);
    console.log(`📦 Database Version: ${slideshowData.version}`);
    console.log(`🎬 Slides Backed Up: ${slideshowData.slides?.length || 0}`);
    console.log(`🖼️  Logos Backed Up: ${logosData?.length || 0}`);
    console.log(`⚙️  Settings Backed Up: ${Object.keys(slideshowData.settings || {}).length} keys`);
    console.log('');
    console.log('✅ Settings included:');
    Object.entries(slideshowData.settings || {}).forEach(([key, value]) => {
      console.log(`   • ${key}: ${value}`);
    });
    console.log('');

    console.log('📝 Usage:');
    console.log('   • Timestamped backup: For version history');
    console.log('   • Latest backup: For quick restore/reference');
    console.log('   • Commit to Git: For team sharing & version control');
    console.log('');
    console.log('🔄 To restore this backup:');
    console.log('   node scripts/restore-production-data.js backups/production-backup-latest.json');
    console.log('');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

backupProductionData();
