import { test, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const EXTENSION_PATH = path.resolve(__dirname, '../dist');
const VIDEOS_PATH = path.resolve(__dirname, '../demo/videos');
const FIXTURES_PATH = path.resolve(__dirname, '../demo/fixtures');

test.describe('AskToDoc Demo Videos', () => {
  test.beforeAll(() => {
    // Ensure videos directory exists
    if (!fs.existsSync(VIDEOS_PATH)) {
      fs.mkdirSync(VIDEOS_PATH, { recursive: true });
    }
  });

  test('Demo 1: Installation and Onboarding', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: VIDEOS_PATH,
        size: { width: 1280, height: 800 }
      }
    });

    const page = await context.newPage();

    // Wait for onboarding page to open
    await page.waitForTimeout(2000);

    // Navigate to onboarding page if not already there
    await page.goto(`file://${path.join(__dirname, '../onboarding.html')}`);

    // Scroll through onboarding
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1500);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    await context.close();

    // Rename video
    const videos = fs.readdirSync(VIDEOS_PATH).filter(f => f.endsWith('.webm'));
    if (videos.length > 0) {
      const latestVideo = path.join(VIDEOS_PATH, videos[videos.length - 1]);
      fs.renameSync(latestVideo, path.join(VIDEOS_PATH, '1-installation-onboarding.webm'));
    }
  });

  test('Demo 2: Using Send to Docs', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: VIDEOS_PATH,
        size: { width: 1280, height: 800 }
      }
    });

    const page = await context.newPage();

    // Load fixture page
    await page.goto(`file://${path.join(FIXTURES_PATH, 'ai-answer-page.html')}`);
    await page.waitForTimeout(1500);

    // Hover over AI answer
    const aiAnswer = page.locator('.ai-answer-container');
    await aiAnswer.hover();
    await page.waitForTimeout(500);

    // Look for the Send to Docs button (will be injected by extension)
    // For demo purposes, simulate the click
    await page.evaluate(() => {
      const button = document.querySelector('.asktodoc-send-button') as HTMLElement;
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);

    // Open docs page
    const docsPage = await context.newPage();
    await docsPage.goto(`file://${path.join(FIXTURES_PATH, 'docs-page.html')}`);
    await docsPage.waitForTimeout(2000);

    // Simulate paste action (visual only)
    await docsPage.evaluate(() => {
      const content = document.querySelector('.doc-content');
      if (content) {
        content.innerHTML = `
          <h2>How Photosynthesis Works</h2>
          <p>Photosynthesis is the process by which plants convert light energy into chemical energy...</p>
          <ul>
            <li><strong>Light-dependent reactions</strong></li>
            <li><strong>Calvin cycle</strong></li>
          </ul>
        `;
      }
    });
    await docsPage.waitForTimeout(2000);

    await context.close();

    // Rename video
    const videos = fs.readdirSync(VIDEOS_PATH).filter(f => f.endsWith('.webm'));
    if (videos.length > 0) {
      const latestVideo = path.join(VIDEOS_PATH, videos[videos.length - 1]);
      fs.renameSync(latestVideo, path.join(VIDEOS_PATH, '2-send-to-docs.webm'));
    }
  });

  test('Demo 3: Popup and Settings', async () => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: VIDEOS_PATH,
        size: { width: 1280, height: 800 }
      }
    });

    const page = await context.newPage();
    await page.goto('chrome://extensions');
    await page.waitForTimeout(1500);

    // Show popup (simulated)
    const popupPage = await context.newPage();
    await popupPage.goto(`file://${path.join(__dirname, '../index.html')}`);
    await popupPage.waitForTimeout(2000);

    // Toggle setting
    await popupPage.waitForTimeout(1000);

    // Open settings page
    const optionsPage = await context.newPage();
    await optionsPage.goto(`file://${path.join(__dirname, '../options.html')}`);
    await optionsPage.waitForTimeout(2000);

    // Scroll through settings
    await optionsPage.evaluate(() => window.scrollBy(0, 200));
    await optionsPage.waitForTimeout(1500);

    await context.close();

    // Rename video
    const videos = fs.readdirSync(VIDEOS_PATH).filter(f => f.endsWith('.webm'));
    if (videos.length > 0) {
      const latestVideo = path.join(VIDEOS_PATH, videos[videos.length - 1]);
      fs.renameSync(latestVideo, path.join(VIDEOS_PATH, '3-popup-settings.webm'));
    }
  });
});
