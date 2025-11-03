import { readFileSync } from 'fs';

const old = JSON.parse(readFileSync('./backups/production-backup-2025-11-02T20-33-43.json', 'utf-8'));
const current = JSON.parse(readFileSync('./backups/production-backup-latest.json', 'utf-8'));

console.log('OLD BACKUP (version', old.slideshow_data.version, '):');
console.log('- Slides:', old.slideshow_data.slides.length);
console.log('- Last updated:', old.slideshow_data.updated_at);
console.log('');
console.log('CURRENT BACKUP (version', current.slideshow_data.version, '):');
console.log('- Slides:', current.slideshow_data.slides.length);
console.log('- Last updated:', current.slideshow_data.updated_at);
console.log('');
console.log('CHANGES:');
console.log('- Version changed:', old.slideshow_data.version, '->', current.slideshow_data.version);
console.log('- Slide count changed:', old.slideshow_data.slides.length, '->', current.slideshow_data.slides.length);
console.log('');
console.log('First 5 slide titles in OLD:');
old.slideshow_data.slides.slice(0, 5).forEach((s, i) => {
  console.log(`  ${i+1}. ${s.title?.substring(0, 60) || '(no title)'}`);
});
console.log('');
console.log('First 5 slide titles in CURRENT:');
current.slideshow_data.slides.slice(0, 5).forEach((s, i) => {
  console.log(`  ${i+1}. ${s.title?.substring(0, 60) || '(no title)'}`);
});
