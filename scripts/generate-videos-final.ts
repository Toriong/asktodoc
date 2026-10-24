import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_PATH = resolve(__dirname, '../dist');
const VIDEOS_PATH = resolve(__dirname, '../demo/videos');
const FIXTURES_PATH = resolve(__dirname, '../demo/fixtures');

async function generateDemoVideos() {
  console.log('Generating demo videos with real visible content...');
  
  // Video 1: Onboarding - target 20+ seconds
  console.log('\n=== Video 1: Installation & Onboarding ===');
  await generateOnboardingVideo();
  
  // Video 2: Send to Docs - target 25+ seconds
  console.log('\n=== Video 2: Send to Docs ===');
  await generateSendToDocsVideo();
  
  // Video 3: Popup & Settings - target 20+ seconds
  console.log('\n=== Video 3: Popup & Settings ===');
  await generatePopupSettingsVideo();
  
  console.log('\n✓ All videos generated!');
}

async function generateOnboardingVideo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEOS_PATH,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();
  
  // Load onboarding from dist
  await page.goto(`file://${resolve(EXTENSION_PATH, 'onboarding.html')}`);
  await page.waitForTimeout(3000);
  
  // Slow scroll through sections
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await page.waitForTimeout(3500);
  }
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(4000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Onboarding video complete');
}

async function generateSendToDocsVideo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEOS_PATH,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();
  
  // Load AI answer page
  await page.goto(`file://${resolve(FIXTURES_PATH, 'ai-answer-page.html')}`);
  await page.waitForTimeout(2500);
  
  // Add Send to Docs button
  await page.evaluate(() => {
    const container = document.querySelector('.ai-answer-container');
    if (container) {
      const button = document.createElement('button');
      button.id = 'send-btn';
      button.innerHTML = '📄 Send to Docs';
      button.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(to right, rgb(209,127,247), rgb(157,214,252)); color: white; border: none; border-radius: 24px; font-size: 18px; font-weight: 600; margin: 16px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.2s;';
      container.insertBefore(button, container.firstChild);
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Hover and click
  const btn = page.locator('#send-btn');
  await btn.hover();
  await page.waitForTimeout(1500);
  await btn.click();
  await page.waitForTimeout(1500);
  
  // Show toast
  await page.evaluate(() => {
    const toast = document.createElement('div');
    toast.textContent = '✓ Copied! Opening Google Docs...';
    toast.style.cssText = 'position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); padding: 20px 40px; background: rgb(157,214,252); color: #1e293b; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 10000; animation: slideUp 0.3s ease;';
    document.body.appendChild(toast);
  });
  await page.waitForTimeout(3000);
  
  // Open docs page
  const docsPage = await context.newPage();
  await docsPage.goto(`file://${resolve(FIXTURES_PATH, 'docs-page.html')}`);
  await docsPage.waitForTimeout(2500);
  
  // Add content with animation
  await docsPage.evaluate(() => {
    const content = document.querySelector('.doc-content');
    if (content) {
      content.innerHTML = `
        <h2>How Photosynthesis Works</h2>
        <p>Photosynthesis is the process by which plants convert light energy into chemical energy. This remarkable biological process sustains most life on Earth by producing oxygen and organic compounds.</p>
        <p>The process occurs in two main stages:</p>
        <ul>
          <li><strong>Light-dependent reactions:</strong> Chlorophyll absorbs light energy, which is used to split water molecules and produce ATP and NADPH.</li>
          <li><strong>Calvin cycle (light-independent reactions):</strong> ATP and NADPH are used to convert carbon dioxide into glucose.</li>
          <li><strong>Key outputs:</strong> Oxygen is released as a byproduct, while glucose serves as food for the plant.</li>
        </ul>
        <h3>Sources</h3>
        <ul>
          <li><a href="#" style="color: #1a73e8;">Understanding Photosynthesis - Science Education</a></li>
          <li><a href="#" style="color: #1a73e8;">Plant Biology and Energy Conversion</a></li>
          <li><a href="#" style="color: #1a73e8;">The Role of Chloroplasts</a></li>
        </ul>
      `;
    }
  });
  
  await docsPage.waitForTimeout(3500);
  
  // Scroll in docs
  await docsPage.evaluate(() => window.scrollBy({ top: 250, behavior: 'smooth' }));
  await docsPage.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Send to Docs video complete');
}

async function generatePopupSettingsVideo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEOS_PATH,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();
  
  // Load popup demo
  await page.goto(`file://${resolve(FIXTURES_PATH, 'popup-demo.html')}`);
  await page.waitForTimeout(3500);
  
  // Click toggle twice
  const toggle = page.locator('#toggle');
  await toggle.click();
  await page.waitForTimeout(2500);
  await toggle.click();
  await page.waitForTimeout(2500);
  await toggle.click();
  await page.waitForTimeout(2500);
  
  // Navigate to settings
  await page.goto(`file://${resolve(FIXTURES_PATH, 'settings-demo.html')}`);
  await page.waitForTimeout(3500);
  
  // Click between options
  const cards = page.locator('.option-card');
  await cards.nth(1).click();
  await page.waitForTimeout(2500);
  await cards.nth(0).click();
  await page.waitForTimeout(2500);
  await cards.nth(1).click();
  await page.waitForTimeout(2500);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Popup & Settings video complete');
}

generateDemoVideos().catch(console.error);
