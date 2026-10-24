import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_PATH = resolve(__dirname, '../dist');
const VIDEOS_PATH = resolve(__dirname, '../demo/videos');
const FIXTURES_PATH = resolve(__dirname, '../demo/fixtures');

async function generateDemoVideos() {
  console.log('Starting demo video generation with real interaction...');
  console.log('Extension path:', EXTENSION_PATH);
  
  // Video 1: Onboarding - 20 seconds
  console.log('\n=== Video 1: Installation & Onboarding (20s target) ===');
  await generateOnboardingVideo();
  
  // Video 2: Send to Docs - 25 seconds
  console.log('\n=== Video 2: Send to Docs (25s target) ===');
  await generateSendToDocsVideo();
  
  // Video 3: Popup & Settings - 20 seconds
  console.log('\n=== Video 3: Popup & Settings (20s target) ===');
  await generatePopupSettingsVideo();
  
  console.log('\n✓ All demo videos generated!');
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
  
  // Navigate to onboarding page
  await page.goto(`file://${resolve(EXTENSION_PATH, 'onboarding.html')}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Scroll through sections slowly
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
  
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
  
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
  
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(5000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Onboarding video generated (~20s)');
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
  
  // Load AI answer fixture
  await page.goto(`file://${resolve(FIXTURES_PATH, 'ai-answer-page.html')}`);
  await page.waitForTimeout(2000);
  
  // Add the Send to Docs button
  await page.evaluate(() => {
    const container = document.querySelector('.ai-answer-container');
    if (container) {
      const button = document.createElement('button');
      button.className = 'asktodoc-send-button';
      button.innerHTML = '📄 Send to Docs';
      button.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(to right, rgb(209,127,247), rgb(157,214,252)); color: white; border: none; border-radius: 24px; font-size: 16px; font-weight: 600; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;';
      container.insertBefore(button, container.firstChild);
      
      // Add hover effect
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Hover over button
  const button = page.locator('button.asktodoc-send-button');
  await button.hover();
  await page.waitForTimeout(1500);
  
  // Click button
  await button.click();
  await page.waitForTimeout(2000);
  
  // Show a toast notification
  await page.evaluate(() => {
    const toast = document.createElement('div');
    toast.textContent = '✓ Copied to clipboard! Opening Docs...';
    toast.style.cssText = 'position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); padding: 16px 32px; background: rgb(157,214,252); color: #1e293b; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 10000;';
    document.body.appendChild(toast);
  });
  await page.waitForTimeout(3000);
  
  // Open docs page
  const docsPage = await context.newPage();
  await docsPage.goto(`file://${resolve(FIXTURES_PATH, 'docs-page.html')}`);
  await docsPage.waitForTimeout(2000);
  
  // Animate content appearing (simulating paste)
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
        <p>The overall chemical equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</p>
        <h3>Sources</h3>
        <ul>
          <li><a href="#" style="color: #1a73e8;">Understanding Photosynthesis - Science Education</a></li>
          <li><a href="#" style="color: #1a73e8;">Plant Biology and Energy Conversion</a></li>
          <li><a href="#" style="color: #1a73e8;">The Role of Chloroplasts in Energy Production</a></li>
        </ul>
      `;
    }
  });
  
  await docsPage.waitForTimeout(4000);
  
  // Scroll in docs
  await docsPage.evaluate(() => window.scrollBy({ top: 200, behavior: 'smooth' }));
  await docsPage.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Send to Docs video generated (~25s)');
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
  
  // Load popup HTML directly with inline content to avoid chrome-extension:// issues
  await page.goto(`file://${resolve(EXTENSION_PATH, 'index.html')}`);
  await page.waitForTimeout(3000);
  
  // Try to interact with toggle if visible
  try {
    const toggle = page.locator('.toggle-button');
    if (await toggle.count() > 0) {
      await toggle.click();
      await page.waitForTimeout(2000);
      await toggle.click();
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.log('Toggle interaction skipped:', e.message);
  }
  
  await page.waitForTimeout(3000);
  
  // Navigate to options page
  await page.goto(`file://${resolve(EXTENSION_PATH, 'options.html')}`);
  await page.waitForTimeout(3000);
  
  // Scroll through options
  await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  
  // Try to interact with radio buttons
  try {
    const radios = page.locator('input[type="radio"]');
    const count = await radios.count();
    if (count > 0) {
      await radios.first().click();
      await page.waitForTimeout(2000);
      if (count > 1) {
        await radios.nth(1).click();
        await page.waitForTimeout(2000);
      }
    }
  } catch (e) {
    console.log('Radio interaction skipped:', e.message);
  }
  
  await page.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Popup & Settings video generated (~20s)');
}

generateDemoVideos().catch(console.error);
