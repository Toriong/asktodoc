import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIDEOS_PATH = resolve(__dirname, '../demo/videos');
const FIXTURES_PATH = resolve(__dirname, '../demo/fixtures');

async function regenerateVideo2() {
  console.log('Regenerating Video 2 (Send to Docs) - target 20+ seconds...');
  
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
  await page.waitForTimeout(3000);
  
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
  
  await page.waitForTimeout(2500);
  
  // Scroll to show answer content
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  
  // Hover and click button
  const btn = page.locator('#send-btn');
  await btn.hover();
  await page.waitForTimeout(2000);
  await btn.click();
  await page.waitForTimeout(2000);
  
  // Show toast
  await page.evaluate(() => {
    const toast = document.createElement('div');
    toast.textContent = '✓ Copied to clipboard! Opening Google Docs...';
    toast.style.cssText = 'position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); padding: 20px 40px; background: rgb(157,214,252); color: #1e293b; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 10000;';
    document.body.appendChild(toast);
  });
  await page.waitForTimeout(3500);
  
  // Open docs page
  const docsPage = await context.newPage();
  await docsPage.goto(`file://${resolve(FIXTURES_PATH, 'docs-page.html')}`);
  await docsPage.waitForTimeout(2500);
  
  // Simulate content appearing
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
          <li><a href="#" style="color: #1a73e8;">The Role of Chloroplasts in Energy Production</a></li>
        </ul>
      `;
    }
  });
  
  await docsPage.waitForTimeout(4000);
  
  // Scroll through the content
  await docsPage.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
  await docsPage.waitForTimeout(2500);
  await docsPage.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
  await docsPage.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  
  console.log('✓ Video 2 regenerated');
}

regenerateVideo2().catch(console.error);
