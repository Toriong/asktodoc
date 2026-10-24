import { chromium } from 'playwright';
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_PATH = resolve(__dirname, '../dist');
const STORE_ASSETS_PATH = resolve(__dirname, '../store-assets');
const FIXTURES_PATH = resolve(__dirname, '../demo/fixtures');

interface ScreenshotSpec {
  name: string;
  url: string;
  caption: string;
  wait?: number;
  interaction?: (page: any) => Promise<void>;
}

const screenshots: ScreenshotSpec[] = [
  {
    name: 'screenshot-1-send-button.png',
    url: `file://${resolve(FIXTURES_PATH, 'ai-answer-page.html')}`,
    caption: 'One-Click Send to Docs Button on AI Answers',
    wait: 1500,
    interaction: async (page) => {
      // Add Send to Docs button
      await page.evaluate(() => {
        const container = document.querySelector('.ai-answer-container');
        if (container) {
          const button = document.createElement('button');
          button.innerHTML = '📄 Send to Docs';
          button.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(to right, rgb(209,127,247), rgb(157,214,252)); color: white; border: none; border-radius: 24px; font-size: 18px; font-weight: 600; margin: 16px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer;';
          container.insertBefore(button, container.firstChild);
        }
      });
    }
  },
  {
    name: 'screenshot-2-formatted-content.png',
    url: `file://${resolve(FIXTURES_PATH, 'docs-page.html')}`,
    caption: 'Perfect Formatting with Headings, Lists, and Links',
    wait: 1000,
    interaction: async (page) => {
      await page.evaluate(() => {
        const content = document.querySelector('.doc-content');
        if (content) {
          content.innerHTML = `
            <h2>How Photosynthesis Works</h2>
            <p>Photosynthesis is the process by which plants convert light energy into chemical energy.</p>
            <ul>
              <li><strong>Light-dependent reactions:</strong> Chlorophyll absorbs light energy</li>
              <li><strong>Calvin cycle:</strong> ATP and NADPH convert CO₂ into glucose</li>
              <li><strong>Key outputs:</strong> Oxygen is released as a byproduct</li>
            </ul>
          `;
        }
      });
    }
  },
  {
    name: 'screenshot-3-source-links.png',
    url: `file://${resolve(FIXTURES_PATH, 'docs-page.html')}`,
    caption: 'Source Citations Included Automatically',
    wait: 1000,
    interaction: async (page) => {
      await page.evaluate(() => {
        const content = document.querySelector('.doc-content');
        if (content) {
          content.innerHTML = `
            <h2>Research Summary</h2>
            <p>Key findings from multiple authoritative sources...</p>
            <h3>Sources</h3>
            <ul>
              <li><a href="#" style="color: #1a73e8;">Understanding Photosynthesis - Science Education</a></li>
              <li><a href="#" style="color: #1a73e8;">Plant Biology and Energy Conversion</a></li>
              <li><a href="#" style="color: #1a73e8;">The Role of Chloroplasts in Energy Production</a></li>
            </ul>
          `;
        }
      });
    }
  },
  {
    name: 'screenshot-4-clipboard-mode.png',
    url: `file://${resolve(FIXTURES_PATH, 'popup-demo.html')}`,
    caption: 'Clipboard Mode - No Sign-In Required',
    wait: 1500
  },
  {
    name: 'screenshot-5-direct-upload.png',
    url: `file://${resolve(FIXTURES_PATH, 'popup-demo.html')}`,
    caption: 'Direct Upload Mode - Instant Doc Creation',
    wait: 1000,
    interaction: async (page) => {
      await page.click('#toggle');
      await page.waitForTimeout(500);
    }
  },
  {
    name: 'screenshot-6-settings.png',
    url: `file://${resolve(FIXTURES_PATH, 'settings-demo.html')}`,
    caption: 'Simple Settings - Choose Your Preferred Mode',
    wait: 1500
  }
];

async function generateScreenshots() {
  console.log('Generating Chrome Web Store screenshots with gradient frames...');
  
  const browser = await chromium.launch({ headless: true });
  
  for (const spec of screenshots) {
    console.log(`\nGenerating ${spec.name}...`);
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    
    const page = await context.newPage();
    await page.goto(spec.url);
    await page.waitForTimeout(spec.wait || 1000);
    
    if (spec.interaction) {
      await spec.interaction(page);
      await page.waitForTimeout(500);
    }
    
    // Take screenshot
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    await context.close();
    
    // Add gradient frame with caption
    const framedBuffer = await addGradientFrame(screenshotBuffer, spec.caption);
    
    // Save
    const outputPath = resolve(STORE_ASSETS_PATH, spec.name);
    await sharp(framedBuffer).toFile(outputPath);
    
    console.log(`✓ Generated ${spec.name}`);
  }
  
  await browser.close();
  console.log('\n✓ All screenshots generated!');
}

async function addGradientFrame(imageBuffer: Buffer, caption: string): Promise<Buffer> {
  const frameWidth = 1280;
  const frameHeight = 800;
  const padding = 40;
  const captionHeight = 80;
  
  // Create gradient background
  const gradientSvg = `
    <svg width="${frameWidth}" height="${frameHeight}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(209,127,247,1);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(157,214,252,1);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${frameWidth}" height="${frameHeight}" fill="url(#grad)"/>
    </svg>
  `;
  
  const gradientBuffer = Buffer.from(gradientSvg);
  
  // Resize content to fit with padding
  const contentWidth = frameWidth - (padding * 2);
  const contentHeight = frameHeight - captionHeight - (padding * 2);
  
  const resizedContent = await sharp(imageBuffer)
    .resize(contentWidth, contentHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();
  
  // Create caption
  const captionSvg = `
    <svg width="${frameWidth}" height="${captionHeight}">
      <text x="${frameWidth / 2}" y="50" text-anchor="middle" font-size="32" font-weight="bold" fill="white" font-family="Arial, sans-serif">${caption}</text>
    </svg>
  `;
  
  const captionBuffer = Buffer.from(captionSvg);
  
  // Composite: gradient background + caption at top + content below
  const result = await sharp(gradientBuffer)
    .composite([
      {
        input: captionBuffer,
        top: 10,
        left: 0
      },
      {
        input: resizedContent,
        top: captionHeight + padding,
        left: padding
      }
    ])
    .png()
    .toBuffer();
  
  return result;
}

generateScreenshots().catch(console.error);
