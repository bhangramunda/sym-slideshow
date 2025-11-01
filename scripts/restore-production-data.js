import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

async function restoreProductionData(backupFilePath) {
  console.log('\n==============================================');
  console.log('♻️  RESTORING PRODUCTION DATABASE FROM BACKUP');
  console.log('==============================================\n');

  if (!backupFilePath) {
    console.error('❌ Please provide backup file path');
    console.log('Usage: node scripts/restore-production-data.js <backup-file>');
    console.log('Example: node scripts/restore-production-data.js backups/production-backup-latest.json');
    process.exit(1);
  }

  try {
    // 1. Read backup file
    console.log('1️⃣  Reading backup file...');
    let fullPath = backupFilePath;
    if (!backupFilePath.startsWith('/') && !backupFilePath.match(/^[A-Z]:\\/)) {
      fullPath = join(process.cwd(), backupFilePath);
    }

    const backupContent = readFileSync(fullPath, 'utf-8');
    const backup = JSON.parse(backupContent);

    console.log(`✅ Loaded backup from: ${backupFilePath}`);
    console.log(`   Backup date: ${new Date(backup.metadata.backupDate).toLocaleString()}`);
    console.log(`   Version: ${backup.metadata.backupVersion}`);
    console.log(`   Slides: ${backup.metadata.totalSlides}`);
    console.log(`   Logos: ${backup.metadata.totalLogos}`);
    console.log('');

    // 2. Confirm restoration
    console.log('⚠️  WARNING: This will OVERWRITE current production data!');
    console.log('');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('');
    console.log('🔄 Proceeding with restoration...');
    console.log('');

    // 3. Restore slideshow_data
    console.log('2️⃣  Restoring slideshow data...');
    const { error: slideshowError } = await supabase
      .from('slideshow_data')
      .upsert(
        {
          project_name: PROJECT_NAME,
          slides: backup.slideshow_data.slides,
          settings: backup.slideshow_data.settings,
          updated_by: 'restore-script',
        },
        {
          onConflict: 'project_name',
        }
      );

    if (slideshowError) {
      console.error('❌ Error restoring slideshow data:', slideshowError.message);
      return;
    }

    console.log(`✅ Restored ${backup.slideshow_data.slides?.length || 0} slides`);
    console.log('');

    // 4. Restore client_logos
    if (backup.client_logos && backup.client_logos.length > 0) {
      console.log('3️⃣  Restoring client logos...');

      // Delete existing logos
      const { error: deleteError } = await supabase
        .from('client_logos')
        .delete()
        .neq('id', 0); // Delete all

      if (deleteError) {
        console.warn('⚠️  Warning deleting existing logos:', deleteError.message);
      }

      // Insert backed-up logos
      const { error: logosError } = await supabase
        .from('client_logos')
        .insert(backup.client_logos);

      if (logosError) {
        console.error('❌ Error restoring client logos:', logosError.message);
      } else {
        console.log(`✅ Restored ${backup.client_logos.length} client logos`);
      }
    } else {
      console.log('3️⃣  No client logos to restore (backup had none)');
    }
    console.log('');

    // 5. Verify restoration
    console.log('4️⃣  Verifying restoration...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('slideshow_data')
      .select('*')
      .eq('project_name', PROJECT_NAME)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying restoration:', verifyError.message);
      return;
    }

    console.log(`✅ Verified ${verifyData.slides?.length || 0} slides in database`);
    console.log(`   Version: ${verifyData.version}`);
    console.log(`   Updated: ${new Date(verifyData.updated_at).toLocaleString()}`);
    console.log('');

    // 6. Summary
    console.log('==============================================');
    console.log('✅ RESTORATION COMPLETE');
    console.log('==============================================');
    console.log('');
    console.log(`📦 Restored from backup: ${backup.metadata.backupDate}`);
    console.log(`🎬 Slides restored: ${backup.slideshow_data.slides?.length || 0}`);
    console.log(`🖼️  Logos restored: ${backup.client_logos?.length || 0}`);
    console.log(`⚙️  Settings restored: ${Object.keys(backup.slideshow_data.settings || {}).length} keys`);
    console.log('');
    console.log('🔄 Next steps:');
    console.log('   1. Visit production slideshow (/) to verify content');
    console.log('   2. Visit editor (/editor) to verify all fields');
    console.log('   3. Hard refresh browser (Ctrl+Shift+R) to clear cache');
    console.log('');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Backup file not found:', backupFilePath);
      console.log('');
      console.log('Available backups:');
      try {
        const { readdirSync } = await import('fs');
        const backupDir = join(__dirname, '..', 'backups');
        const files = readdirSync(backupDir).filter(f => f.endsWith('.json'));
        files.forEach(f => console.log(`   • backups/${f}`));
      } catch {
        console.log('   (backups directory not found)');
      }
    } else {
      console.error('❌ Unexpected error:', error);
    }
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2];
restoreProductionData(backupFile);
