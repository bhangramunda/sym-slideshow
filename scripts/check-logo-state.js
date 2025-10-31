import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLogoState() {
  console.log('\n=== Checking Logo Database State ===\n');

  // Get all logos from database
  const { data: dbLogos, error: dbError } = await supabase
    .from('client_logos')
    .select('*')
    .order('display_name', { ascending: true });

  if (dbError) {
    console.error('Error fetching from database:', dbError);
    return;
  }

  console.log(`Found ${dbLogos.length} logos in database:\n`);

  dbLogos.forEach((logo, idx) => {
    console.log(`${idx + 1}. ID: ${logo.id}`);
    console.log(`   Display Name: "${logo.display_name}"`);
    console.log(`   Filename: ${logo.filename}`);
    console.log(`   Storage Path: ${logo.storage_path}`);
    console.log(`   Theme: ${logo.theme} | Orientation: ${logo.orientation}`);
    console.log(`   Created: ${logo.created_at}`);
    console.log(`   Updated: ${logo.updated_at}`);
    console.log('');
  });

  // Search for specific logos that user mentioned
  console.log('\n=== Searching for Specific Logos ===\n');

  const searchTerms = ['ABA', 'American Bankers', 'American Bankers Association'];

  for (const term of searchTerms) {
    const matches = dbLogos.filter(logo =>
      logo.display_name.toLowerCase().includes(term.toLowerCase()) ||
      logo.filename.toLowerCase().includes(term.toLowerCase())
    );

    if (matches.length > 0) {
      console.log(`✓ Found ${matches.length} match(es) for "${term}":`);
      matches.forEach(logo => {
        console.log(`  - ID ${logo.id}: "${logo.display_name}" (${logo.filename})`);
      });
    } else {
      console.log(`✗ No matches for "${term}"`);
    }
  }

  console.log('\n=== Checking for Duplicate IDs ===\n');
  const ids = dbLogos.map(l => l.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.log('⚠️  Found duplicate IDs:', duplicates);
  } else {
    console.log('✓ No duplicate IDs found');
  }

  console.log('\n=== Checking for Empty Display Names ===\n');
  const emptyNames = dbLogos.filter(l => !l.display_name || l.display_name.trim() === '');
  if (emptyNames.length > 0) {
    console.log('⚠️  Found logos with empty display names:', emptyNames);
  } else {
    console.log('✓ All logos have display names');
  }
}

checkLogoState().catch(console.error);
