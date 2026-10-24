// Script to generate Chrome Web Store screenshots
// Run after building the extension

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../store-assets/screenshot-templates');
const OUTPUT_DIR = path.resolve(__dirname, '../store-assets');

async function generateScreenshots() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  
  // Screenshot 1: Send button
  await page.goto(`file://${path.join(TEMPLATES_DIR, 'screenshot-1.html')}`);
  await page.screenshot({ 
    path: path.join(OUTPUT_DIR, 'screenshot-1-send-button.png'),
    type: 'png'
  });
  
  console.log('Generated screenshot-1-send-button.png');
  
  // TODO: Generate remaining screenshots from templates
  
  await browser.close();
  console.log('Screenshot generation complete!');
}

generateScreenshots().catch(console.error);
