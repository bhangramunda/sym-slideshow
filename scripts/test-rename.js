import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Use the ANON key like the frontend does
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRename() {
  console.log('\n=== Testing Rename Functionality ===\n');

  // Find the ABA Logo (ID 1)
  const testLogoId = 1;
  const newName = 'American Bankers Association';

  console.log(`Attempting to rename logo ID ${testLogoId} to "${newName}"...\n`);

  // Get current state
  const { data: before, error: beforeError } = await supabase
    .from('client_logos')
    .select('*')
    .eq('id', testLogoId)
    .single();

  if (beforeError) {
    console.error('Error fetching logo before rename:', beforeError);
    return;
  }

  console.log('BEFORE rename:');
  console.log(`  ID: ${before.id}`);
  console.log(`  Display Name: "${before.display_name}"`);
  console.log(`  Filename: ${before.filename}`);
  console.log('');

  // Attempt rename
  console.log('Executing UPDATE query...');
  const { data: updateData, error: updateError } = await supabase
    .from('client_logos')
    .update({ display_name: newName })
    .eq('id', testLogoId)
    .select();

  if (updateError) {
    console.error('❌ UPDATE FAILED:', updateError);
    console.error('Error details:', JSON.stringify(updateError, null, 2));
    return;
  }

  console.log('✅ UPDATE succeeded!');
  console.log('Update response:', updateData);
  console.log('');

  // Verify the change
  const { data: after, error: afterError } = await supabase
    .from('client_logos')
    .select('*')
    .eq('id', testLogoId)
    .single();

  if (afterError) {
    console.error('Error fetching logo after rename:', afterError);
    return;
  }

  console.log('AFTER rename:');
  console.log(`  ID: ${after.id}`);
  console.log(`  Display Name: "${after.display_name}"`);
  console.log(`  Filename: ${after.filename}`);
  console.log(`  Updated At: ${after.updated_at}`);
  console.log('');

  if (after.display_name === newName) {
    console.log('✅ SUCCESS! Rename persisted to database!');
  } else {
    console.log('❌ FAILED! Name did not change in database.');
    console.log(`   Expected: "${newName}"`);
    console.log(`   Got: "${after.display_name}"`);
  }
}

testRename().catch(console.error);
