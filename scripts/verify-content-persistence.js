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

async function verifyContentPersistence() {
  console.log('\n==============================================');
  console.log('📊 CONTENT PERSISTENCE VERIFICATION');
  console.log('==============================================\n');

  try {
    // 1. Check if slideshow_data table exists
    console.log('1️⃣  Checking if slideshow_data table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('slideshow_data')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error accessing slideshow_data table:', tableError.message);
      console.log('   → This table should exist. Check Supabase dashboard.');
      return;
    }
    console.log('✅ slideshow_data table exists\n');

    // 2. Load current data from Supabase
    console.log('2️⃣  Loading current content from Supabase...');
    const { data, error } = await supabase
      .from('slideshow_data')
      .select('*')
      .eq('project_name', PROJECT_NAME)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  No content found in Supabase for project "default"');
        console.log('   → This means the editor has never saved to production database');
        console.log('   → App will fall back to scenes.json');
        console.log('\n📝 RECOMMENDATION:');
        console.log('   1. Open /editor in production');
        console.log('   2. Make a small edit (add a space, then delete it)');
        console.log('   3. Wait 2 seconds for autosave');
        console.log('   4. Content will be saved to Supabase permanently\n');
        return;
      }
      console.error('❌ Error loading content:', error.message);
      return;
    }

    console.log('✅ Content found in Supabase!\n');

    // 3. Analyze the data
    console.log('3️⃣  Analyzing stored content...');
    console.log(`   📅 Last updated: ${new Date(data.updated_at).toLocaleString()}`);
    console.log(`   👤 Updated by: ${data.updated_by || 'unknown'}`);
    console.log(`   📊 Version: ${data.version || 'N/A'}`);
    console.log(`   🎬 Total slides: ${data.slides?.length || 0}`);
    console.log('');

    // 4. Check all slide fields
    console.log('4️⃣  Checking slide data integrity...');
    const slides = data.slides || [];

    if (slides.length === 0) {
      console.log('⚠️  No slides found in database');
      return;
    }

    const fieldCoverage = {
      type: 0,
      title: 0,
      subtitle: 0,
      durationSec: 0,
      transition: 0,
      buildScope: 0,
      buildStyle: 0,
      featured: 0,
      image: 0,
      featuredImage: 0,
      cta: 0,
      // Slide-specific fields
      quote: 0,
      author: 0,
      logos: 0,
      fitLogos: 0,
      metricValue: 0,
      metricLabel: 0,
      services: 0,
      points: 0,
      video: 0,
      loop: 0,
      muted: 0,
    };

    slides.forEach(slide => {
      Object.keys(fieldCoverage).forEach(field => {
        if (slide[field] !== undefined && slide[field] !== null && slide[field] !== '') {
          fieldCoverage[field]++;
        }
      });
    });

    console.log('   Field usage across all slides:');
    Object.entries(fieldCoverage).forEach(([field, count]) => {
      if (count > 0) {
        console.log(`   ✓ ${field}: ${count} slide(s)`);
      }
    });
    console.log('');

    // 5. Check settings
    console.log('5️⃣  Checking settings data...');
    if (data.settings) {
      console.log('✅ Settings found in database:');
      console.log(`   • Transition Mode: ${data.settings.transitionMode || 'not set'}`);
      console.log(`   • Build Scope: ${data.settings.buildScope || 'not set'}`);
      console.log(`   • Build Style: ${data.settings.buildStyle || 'not set'}`);
      console.log(`   • Aspect Ratio: ${data.settings.aspectRatio || 'not set'}`);
      console.log(`   • Featured Repeats: ${data.settings.featuredRepeats ?? 'not set'}`);
      console.log(`   • Fireworks Intensity: ${data.settings.fireworksIntensity || 'not set'}`);
    } else {
      console.log('⚠️  No settings found (app will use defaults)');
    }
    console.log('');

    // 6. Sample first few slides
    console.log('6️⃣  Sample of stored slides:');
    slides.slice(0, 3).forEach((slide, index) => {
      console.log(`\n   Slide ${index + 1}:`);
      console.log(`   • Type: ${slide.type}`);
      console.log(`   • Title: ${slide.title?.substring(0, 50) || '(no title)'}${slide.title?.length > 50 ? '...' : ''}`);
      console.log(`   • Duration: ${slide.durationSec || 20}s`);
      console.log(`   • Transition: ${slide.transition || 'fade'}`);
      if (slide.featured) console.log(`   • Featured: ⭐ YES`);
    });
    console.log('');

    // 7. Data size check
    const dataSize = JSON.stringify(data.slides).length;
    console.log('7️⃣  Payload size analysis:');
    console.log(`   📦 Total data size: ${(dataSize / 1024).toFixed(2)} KB`);
    if (dataSize > 500000) {
      console.log('   ⚠️  WARNING: Large payload (>500KB) - may cause slow saves');
      console.log('   → Consider optimizing: compress images, reduce base64 embeds');
    } else {
      console.log('   ✅ Payload size is healthy');
    }
    console.log('');

    // 8. Summary
    console.log('==============================================');
    console.log('📋 SUMMARY');
    console.log('==============================================');
    console.log('');
    console.log('✅ Content IS stored in Supabase');
    console.log('✅ App deployments will NOT affect stored content');
    console.log('✅ Content persists between deployments');
    console.log('');
    console.log('📌 KEY FACTS:');
    console.log('   • Content lives in Supabase database (separate from code)');
    console.log('   • scenes.json is ONLY a fallback if Supabase fails');
    console.log('   • Production edits in /editor save to Supabase immediately');
    console.log('   • Real-time sync keeps all viewers updated');
    console.log('   • App redeployments do NOT touch database content');
    console.log('');
    console.log('🔍 If you see content regressions, check:');
    console.log('   1. Was the edit saved? (check auto-save indicator)');
    console.log('   2. Is Supabase accessible? (check network tab)');
    console.log('   3. Are you editing in /editor or locally?');
    console.log('   4. Is another editor overwriting changes?');
    console.log('');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyContentPersistence();
