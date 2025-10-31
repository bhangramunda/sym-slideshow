import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupOrphanedLogos() {
  console.log('\n=== Cleaning up orphaned logo entries ===\n');

  // Get all logos from database
  const { data: dbLogos, error: dbError } = await supabase
    .from('client_logos')
    .select('*');

  if (dbError) {
    console.error('Error fetching from database:', dbError);
    return;
  }

  console.log(`Found ${dbLogos.length} logos in database`);

  // Check each one to see if file exists in storage
  const orphaned = [];
  const valid = [];

  for (const logo of dbLogos) {
    try {
      // Try to check if file exists
      const { data, error } = await supabase.storage
        .from('client-logos')
        .download(logo.storage_path);

      if (error) {
        console.log(`✗ Missing file: ${logo.storage_path} (${logo.display_name})`);
        orphaned.push(logo);
      } else {
        console.log(`✓ Valid: ${logo.storage_path}`);
        valid.push(logo);
      }
    } catch (err) {
      console.log(`✗ Error checking ${logo.storage_path}:`, err.message);
      orphaned.push(logo);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Valid logos: ${valid.length}`);
  console.log(`Orphaned entries: ${orphaned.length}`);

  if (orphaned.length > 0) {
    console.log(`\nOrphaned logos to delete:`);
    orphaned.forEach(logo => console.log(`  - ${logo.display_name} (ID: ${logo.id})`));

    // Delete orphaned entries
    console.log(`\nDeleting ${orphaned.length} orphaned entries...`);

    for (const logo of orphaned) {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', logo.id);

      if (error) {
        console.error(`✗ Failed to delete ${logo.display_name}:`, error);
      } else {
        console.log(`✓ Deleted ${logo.display_name}`);
      }
    }

    console.log(`\n✓ Cleanup complete!`);
  } else {
    console.log(`\n✓ No orphaned entries found!`);
  }
}

cleanupOrphanedLogos().catch(console.error);
