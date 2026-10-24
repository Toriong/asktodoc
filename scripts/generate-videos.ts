import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_PATH = resolve(__dirname, '../dist');
const VIDEOS_PATH = resolve(__dirname, '../demo/videos');
const FIXTURES_PATH = resolve(__dirname, '../demo/fixtures');

async function generateDemoVideos() {
  console.log('Starting demo video generation...');
  console.log('Extension path:', EXTENSION_PATH);
  console.log('Videos path:', VIDEOS_PATH);
  
  // Video 1: Onboarding
  console.log('\n=== Video 1: Installation & Onboarding ===');
  await generateOnboardingVideo();
  
  // Video 2: Send to Docs
  console.log('\n=== Video 2: Send to Docs ===');
  await generateSendToDocsVideo();
  
  // Video 3: Popup & Settings
  console.log('\n=== Video 3: Popup & Settings ===');
  await generatePopupSettingsVideo();
  
  console.log('\n✓ All demo videos generated!');
}

async function generateOnboardingVideo() {
  const browser = await chromium.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEOS_PATH,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();
  
  // Navigate to onboarding page
  await page.goto(`file://${resolve(__dirname, '../onboarding.html')}`);
  await page.waitForTimeout(2000);
  
  // Scroll through the page
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(2000);
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Onboarding video generated');
}

async function generateSendToDocsVideo() {
  const browser = await chromium.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEOS_PATH,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();
  
  // Load AI answer fixture
  await page.goto(`file://${resolve(FIXTURES_PATH, 'ai-answer-page.html')}`);
  await page.waitForTimeout(2000);
  
  // Scroll to answer
  await page.evaluate(() => {
    const answer = document.querySelector('.ai-answer-container');
    if (answer) answer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await page.waitForTimeout(1500);
  
  // Highlight the answer area
  await page.evaluate(() => {
    const answer = document.querySelector('.ai-answer-container');
    if (answer) {
      (answer as HTMLElement).style.border = '3px solid rgba(157,214,252,1)';
    }
  });
  await page.waitForTimeout(2000);
  
  // Open docs page in new tab
  const docsPage = await context.newPage();
  await docsPage.goto(`file://${resolve(FIXTURES_PATH, 'docs-page.html')}`);
  await docsPage.waitForTimeout(2000);
  
  // Simulate content appearing
  await docsPage.evaluate(() => {
    const content = document.querySelector('.doc-content');
    if (content) {
      content.innerHTML = `
        <h2>How Photosynthesis Works</h2>
        <p>Photosynthesis is the process by which plants convert light energy into chemical energy. This remarkable biological process sustains most life on Earth.</p>
        <p>The process occurs in two main stages:</p>
        <ul>
          <li><strong>Light-dependent reactions:</strong> Chlorophyll absorbs light energy</li>
          <li><strong>Calvin cycle:</strong> ATP and NADPH convert CO₂ into glucose</li>
          <li><strong>Key outputs:</strong> Oxygen is released as a byproduct</li>
        </ul>
        <h3>Sources</h3>
        <ul>
          <li><a href="#">Understanding Photosynthesis</a></li>
          <li><a href="#">Plant Biology</a></li>
        </ul>
      `;
    }
  });
  await docsPage.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
}

async function generatePopupSettingsVideo() {
  const browser = await chromium.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEOS_PATH,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();
  
  // Show popup
  await page.goto(`file://${resolve(__dirname, '../index.html')}`);
  await page.waitForTimeout(3000);
  
  // Interact with toggle
  const toggle = page.locator('.toggle-button');
  if (await toggle.count() > 0) {
    await toggle.click();
    await page.waitForTimeout(1500);
    await toggle.click();
    await page.waitForTimeout(1500);
  }
  
  // Open options page
  await page.goto(`file://${resolve(__dirname, '../options.html')}`);
  await page.waitForTimeout(2000);
  
  // Scroll through options
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(2000);
  
  // Select different option
  const radio = page.locator('input[type="radio"]').first();
  if (await radio.count() > 0) {
    await radio.click();
    await page.waitForTimeout(1500);
  }
  
  await page.waitForTimeout(2000);
  
  await context.close();
  await browser.close();
}

generateDemoVideos().catch(console.error);
