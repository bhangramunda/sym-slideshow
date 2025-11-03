import { readFileSync } from 'fs';

const current = JSON.parse(readFileSync('./backups/production-backup-latest.json', 'utf-8'));

console.log('CURRENT GLOBAL SETTINGS:');
console.log('- Build Scope:', current.slideshow_data.settings.buildScope);
console.log('- Build Style:', current.slideshow_data.settings.buildStyle);
console.log('- Transition Mode:', current.slideshow_data.settings.transitionMode);
console.log('');

console.log('SLIDE-SPECIFIC OVERRIDES:');
let hasOverrides = false;
current.slideshow_data.slides.forEach((s, i) => {
  if (s.buildScope || s.buildStyle) {
    hasOverrides = true;
    console.log(`Slide ${i+1} (${s.title?.substring(0, 40) || 'no title'}):`);
    if (s.buildScope) console.log(`  - buildScope: ${s.buildScope}`);
    if (s.buildStyle) console.log(`  - buildStyle: ${s.buildStyle}`);
  }
});

if (!hasOverrides) {
  console.log('  (No slide-specific overrides)');
}

console.log('');
console.log('SLIDE TYPES:');
current.slideshow_data.slides.forEach((s, i) => {
  console.log(`${i+1}. ${s.type?.padEnd(20)} - ${s.title?.substring(0, 40) || '(no title)'}`);
});
