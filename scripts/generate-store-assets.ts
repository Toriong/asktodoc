import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_PATH = resolve(__dirname, '../dist');
const STORE_ASSETS_PATH = resolve(__dirname, '../store-assets');
const FIXTURES_PATH = resolve(__dirname, '../demo/fixtures');

async function generateStoreAssets() {
  console.log('Generating Chrome Web Store assets...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  // Screenshot 1: Send button on AI answer
  console.log('\n1. Generating screenshot-1-send-button.png...');
  const page1 = await context.newPage();
  await page1.goto(`file://${resolve(FIXTURES_PATH, 'ai-answer-page.html')}`);
  await page1.waitForTimeout(1000);
  
  // Add a mock button
  await page1.evaluate(() => {
    const container = document.querySelector('.ai-answer-container');
    if (container) {
      const button = document.createElement('button');
      button.className = 'asktodoc-send-button';
      button.innerHTML = '📄 Send to Docs';
      button.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(to right, rgb(209,127,247), rgb(157,214,252)); color: white; border: none; border-radius: 24px; font-size: 16px; font-weight: 600; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
      container.insertBefore(button, container.firstChild);
    }
  });
  
  await page1.screenshot({ path: `${STORE_ASSETS_PATH}/screenshot-1-send-button.png`, fullPage: false });
  await page1.close();
  
  // Screenshot 2: Formatted content in Docs
  console.log('2. Generating screenshot-2-formatted-content.png...');
  const page2 = await context.newPage();
  await page2.goto(`file://${resolve(FIXTURES_PATH, 'docs-page.html')}`);
  await page2.evaluate(() => {
    const content = document.querySelector('.doc-content');
    if (content) {
      content.innerHTML = `
        <h2>How Photosynthesis Works</h2>
        <p>Photosynthesis is the process by which plants convert light energy into chemical energy. This remarkable biological process sustains most life on Earth by producing oxygen and organic compounds.</p>
        <p>The process occurs in two main stages:</p>
        <ul>
          <li><strong>Light-dependent reactions:</strong> Chlorophyll absorbs light energy, which is used to split water molecules and produce ATP and NADPH.</li>
          <li><strong>Calvin cycle:</strong> ATP and NADPH are used to convert carbon dioxide into glucose.</li>
        </ul>
      `;
    }
  });
  await page2.waitForTimeout(500);
  await page2.screenshot({ path: `${STORE_ASSETS_PATH}/screenshot-2-formatted-content.png`, fullPage: false });
  await page2.close();
  
  // Screenshot 3: Source links
  console.log('3. Generating screenshot-3-source-links.png...');
  const page3 = await context.newPage();
  await page3.goto(`file://${resolve(FIXTURES_PATH, 'docs-page.html')}`);
  await page3.evaluate(() => {
    const content = document.querySelector('.doc-content');
    if (content) {
      content.innerHTML = `
        <h2>AI Answer Content</h2>
        <p>Detailed information about the topic...</p>
        <h3>Sources</h3>
        <ul>
          <li><a href="#" style="color: #1a73e8;">Understanding Photosynthesis - Science Education</a></li>
          <li><a href="#" style="color: #1a73e8;">Plant Biology and Energy Conversion</a></li>
          <li><a href="#" style="color: #1a73e8;">The Role of Chloroplasts in Energy Production</a></li>
        </ul>
      `;
    }
  });
  await page3.waitForTimeout(500);
  await page3.screenshot({ path: `${STORE_ASSETS_PATH}/screenshot-3-source-links.png`, fullPage: false });
  await page3.close();
  
  // Screenshot 4: Clipboard mode
  console.log('4. Generating screenshot-4-clipboard-mode.png...');
  const page4 = await context.newPage();
  await page4.goto(`file://${resolve(__dirname, '../index.html')}`);
  await page4.waitForTimeout(1000);
  await page4.screenshot({ path: `${STORE_ASSETS_PATH}/screenshot-4-clipboard-mode.png`, fullPage: false });
  await page4.close();
  
  // Screenshot 5: Direct upload mode
  console.log('5. Generating screenshot-5-direct-upload.png...');
  const page5 = await context.newPage();
  await page5.goto(`file://${resolve(__dirname, '../index.html')}`);
  await page5.waitForTimeout(500);
  // Toggle the switch
  await page5.evaluate(() => {
    const toggle = document.querySelector('.toggle-button');
    if (toggle) {
      toggle.classList.add('toggle-on');
    }
  });
  await page5.waitForTimeout(500);
  await page5.screenshot({ path: `${STORE_ASSETS_PATH}/screenshot-5-direct-upload.png`, fullPage: false });
  await page5.close();
  
  // Screenshot 6: Settings page
  console.log('6. Generating screenshot-6-settings.png...');
  const page6 = await context.newPage();
  await page6.goto(`file://${resolve(__dirname, '../options.html')}`);
  await page6.waitForTimeout(1000);
  await page6.screenshot({ path: `${STORE_ASSETS_PATH}/screenshot-6-settings.png`, fullPage: false });
  await page6.close();
  
  await browser.close();
  
  // Generate promotional images
  console.log('\nGenerating promotional images...');
  
  // Small promo tile 440x280
  console.log('7. Generating promo-small-440x280.png...');
  await generatePromoSmall();
  
  // Marquee 1400x560
  console.log('8. Generating promo-marquee-1400x560.png...');
  await generateMarquee();
  
  // Store icon 128x128
  console.log('9. Generating store icon-128.png...');
  const iconPath = resolve(__dirname, '../public/icons/icon-128.png');
  await sharp(iconPath)
    .resize(128, 128)
    .toFile(`${STORE_ASSETS_PATH}/icon-128.png`);
  
  console.log('\n✓ All store assets generated successfully!');
}

async function generatePromoSmall() {
  const svg = `
    <svg width="440" height="280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(209,127,247);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(157,214,252);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="440" height="280" fill="url(#grad)"/>
      <text x="220" y="120" text-anchor="middle" font-size="48" fill="white" font-family="Arial, sans-serif" font-weight="bold">AskToDoc</text>
      <text x="220" y="160" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">Send AI Answers to Google Docs</text>
      <text x="220" y="200" text-anchor="middle" font-size="64" fill="white">📄</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`${STORE_ASSETS_PATH}/promo-small-440x280.png`);
}

async function generateMarquee() {
  const svg = `
    <svg width="1400" height="560" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(209,127,247);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(157,214,252);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1400" height="560" fill="url(#grad)"/>
      <text x="700" y="220" text-anchor="middle" font-size="72" fill="white" font-family="Arial, sans-serif" font-weight="bold">AskToDoc</text>
      <text x="700" y="280" text-anchor="middle" font-size="28" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">Restore the "Send to Docs" button on Google Search AI Mode</text>
      <text x="700" y="380" text-anchor="middle" font-size="120" fill="white">📄</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`${STORE_ASSETS_PATH}/promo-marquee-1400x560.png`);
}

generateStoreAssets().catch(console.error);
