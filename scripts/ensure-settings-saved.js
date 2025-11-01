import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PROJECT_NAME = 'default';

async function ensureSettingsSaved() {
  console.log('\n==============================================');
  console.log('🔧 ENSURING ALL SETTINGS ARE SAVED');
  console.log('==============================================\n');

  try {
    // Load current data
    const { data, error } = await supabase
      .from('slideshow_data')
      .select('*')
      .eq('project_name', PROJECT_NAME)
      .single();

    if (error) {
      console.error('❌ Error loading data:', error.message);
      return;
    }

    console.log('📊 Current settings in database:');
    console.log(JSON.stringify(data.settings || {}, null, 2));
    console.log('');

    // Default settings from Editor.jsx
    const defaultSettings = {
      transitionMode: 'sync',
      buildScope: 'components',
      buildStyle: 'classic',
      aspectRatio: '16:9',
      featuredRepeats: 2,
      fireworksIntensity: 'medium'
    };

    console.log('🎯 Default settings that should be saved:');
    console.log(JSON.stringify(defaultSettings, null, 2));
    console.log('');

    // Merge current settings with defaults (preserve user changes)
    const mergedSettings = {
      ...defaultSettings,
      ...( data.settings || {})
    };

    console.log('🔄 Merged settings (defaults + existing):');
    console.log(JSON.stringify(mergedSettings, null, 2));
    console.log('');

    // Update database with merged settings
    console.log('💾 Updating database with complete settings...');
    const { error: updateError } = await supabase
      .from('slideshow_data')
      .update({
        settings: mergedSettings,
        updated_by: 'settings-fixer-script'
      })
      .eq('project_name', PROJECT_NAME);

    if (updateError) {
      console.error('❌ Error updating settings:', updateError.message);
      return;
    }

    console.log('✅ Settings updated successfully!');
    console.log('');

    // Verify
    const { data: verifyData } = await supabase
      .from('slideshow_data')
      .select('settings')
      .eq('project_name', PROJECT_NAME)
      .single();

    console.log('✓ Verified settings in database:');
    console.log(JSON.stringify(verifyData.settings, null, 2));
    console.log('');

    console.log('==============================================');
    console.log('✅ ALL SETTINGS NOW SAVED IN DATABASE');
    console.log('==============================================');
    console.log('');
    console.log('Next time you deploy:');
    console.log('  • All settings will persist');
    console.log('  • App will load these settings from Supabase');
    console.log('  • No regression to defaults');
    console.log('');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

ensureSettingsSaved();
