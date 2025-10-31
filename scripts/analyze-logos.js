import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, '../logos');

// Auto-detect theme from filename
function detectTheme(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('white') || lower.includes('light')) return 'light';
  if (lower.includes('dark') || lower.includes('black')) return 'dark';
  if (lower.includes('color')) return 'color';
  // Default to light for dark backgrounds
  return 'light';
}

// Auto-detect orientation from filename patterns
function detectOrientation(filename) {
  const lower = filename.toLowerCase();
  // Logos with -h or 'horizontal' in name
  if (lower.includes('-h.svg') || lower.includes('horizontal')) return 'horizontal';
  // Most corporate logos are horizontal by default
  return 'horizontal';
}

// Generate display name from filename
function generateDisplayName(filename) {
  return filename
    .replace(/\.svg$/, '')
    .replace(/-white|-dark|-light|-color|-gray/gi, '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Scan logos directory
function scanLogos(dir, subdirPath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const logos = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      logos.push(...scanLogos(fullPath, path.join(subdirPath, entry.name)));
    } else if (entry.name.endsWith('.svg')) {
      const relativePath = subdirPath ? path.join(subdirPath, entry.name) : entry.name;

      logos.push({
        filename: entry.name,
        path: relativePath.replace(/\\/g, '/'), // Normalize path separators
        display_name: generateDisplayName(entry.name),
        theme: detectTheme(entry.name),
        orientation: detectOrientation(entry.name),
        file_path: fullPath
      });
    }
  }

  return logos;
}

const logos = scanLogos(logosDir);

// Filter to prefer light/white versions for dark backgrounds
const preferredLogos = logos.filter(logo =>
  logo.theme === 'light' || logo.theme === 'color'
);

console.log('\n=== Logo Library Analysis ===\n');
console.log(`Total SVG files found: ${logos.length}`);
console.log(`Preferred for dark backgrounds: ${preferredLogos.length}\n`);

console.log('Logos by theme:');
const byTheme = logos.reduce((acc, logo) => {
  acc[logo.theme] = (acc[logo.theme] || 0) + 1;
  return acc;
}, {});
console.log(byTheme);

console.log('\n=== Preferred Logos for Dark Backgrounds ===\n');
preferredLogos.forEach(logo => {
  console.log(`${logo.display_name} (${logo.filename})`);
  console.log(`  Theme: ${logo.theme}, Orientation: ${logo.orientation}`);
  console.log(`  Path: ${logo.path}\n`);
});

// Write to JSON for use in upload script
fs.writeFileSync(
  path.join(__dirname, 'logo-metadata.json'),
  JSON.stringify(preferredLogos, null, 2)
);

console.log(`\nMetadata written to logo-metadata.json`);
