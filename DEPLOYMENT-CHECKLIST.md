# AskToDoc Deployment Checklist

## Before Chrome Web Store Submission

### 1. OAuth Configuration
- [ ] Create Google Cloud Project
- [ ] Enable Google Drive API
- [ ] Create OAuth 2.0 credentials (Chrome extension type)
- [ ] Update `src/manifest.json` with actual client ID
- [ ] Rebuild extension: `npm run build`

### 2. Generate Store Assets
All assets must be at exact dimensions with professional quality:

#### Required Screenshots (1280x800 PNG)
- [ ] screenshot-1-send-button.png
- [ ] screenshot-2-formatted-content.png
- [ ] screenshot-3-source-links.png
- [ ] screenshot-4-clipboard-mode.png
- [ ] screenshot-5-direct-upload.png
- [ ] screenshot-6-settings.png

#### Required Promotional Images
- [ ] promo-small-440x280.png (Small tile)
- [ ] promo-marquee-1400x560.png (Marquee)
- [ ] icon-store-128.png (Store icon)

Use templates in `store-assets/screenshot-templates/` or run:
```bash
node scripts/generate-screenshots.ts
```

### 3. Generate Demo Videos
Run Playwright tests to generate demo videos:
```bash
npm run playwright
```

Expected output in `demo/videos/`:
- 1-installation-onboarding.webm (+ .mp4)
- 2-send-to-docs.webm (+ .mp4)
- 3-popup-settings.webm (+ .mp4)

### 4. Final Testing
- [ ] Load unpacked extension in Chrome
- [ ] Test on actual Google Search AI Mode answers
- [ ] Test clipboard mode (default)
- [ ] Test direct upload mode (with OAuth)
- [ ] Verify onboarding page opens on install
- [ ] Test popup and options pages
- [ ] Verify all Drive I/O links include `?referrer=AskToDoc`

### 5. Chrome Web Store Listing
Use content from `store-assets/listing.md`:
- [ ] Title: "AskToDoc - Send AI Answers to Google Docs"
- [ ] Short description (132 chars max)
- [ ] Full description
- [ ] Upload all screenshots
- [ ] Upload promotional images
- [ ] Set category: Productivity
- [ ] Add privacy policy URL: https://www.driveio.io/privacy?referrer=AskToDoc
- [ ] Justify each permission (content in listing.md)

### 6. Legal & Compliance
- [ ] Verify MIT license
- [ ] Confirm no restricted scopes (only drive.file)
- [ ] Verify no CASA review required
- [ ] Privacy policy published and accessible

### 7. Post-Launch
- [ ] Monitor Chrome Web Store reviews
- [ ] Track usage analytics (if implemented)
- [ ] Update Drive I/O landing page
- [ ] Create support documentation

## Technical Verification

Build passes:
```bash
npm run build          # ✓ Should complete without errors
npm run type-check     # ✓ Should pass
npm test              # ✓ Unit tests should pass
npm run lint          # Should have minimal warnings
```

Extension loads in Chrome:
1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `dist/` directory
5. Extension should load without errors

## Support Resources

- Repository: https://github.com/Toriong/asktodoc
- Drive I/O: https://www.driveio.io/?referrer=AskToDoc
- Documentation: See README.md

## Version History

- v1.0.0 - Initial release
  - Clipboard mode (default)
  - Direct upload mode (OAuth)
  - Onboarding page
  - PWA scaffold
