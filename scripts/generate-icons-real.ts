import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SVG_PATH = resolve(__dirname, '../public/icons/icon.svg');
const ICONS_DIR = resolve(__dirname, '../public/icons');
const STORE_ASSETS_DIR = resolve(__dirname, '../store-assets');

async function generateIcons() {
  console.log('Generating icons from SVG...');
  
  const svgBuffer = readFileSync(SVG_PATH);
  
  // Generate icons at different sizes
  const sizes = [16, 32, 48, 128, 512];
  
  for (const size of sizes) {
    const outputPath = size === 512 
      ? resolve(STORE_ASSETS_DIR, `icon-${size}.png`)
      : resolve(ICONS_DIR, `icon-${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated ${size}x${size} icon: ${outputPath}`);
  }
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
