# Chrome Web Store Assets

This directory contains all assets required for the Chrome Web Store listing.

## Required Assets

### Screenshots (1280x800 PNG)
- `screenshot-1-send-button.png` - Send button on AI answer
- `screenshot-2-formatted-content.png` - Formatted content example
- `screenshot-3-source-links.png` - Source citations
- `screenshot-4-clipboard-mode.png` - Clipboard mode workflow
- `screenshot-5-direct-upload.png` - Direct upload mode
- `screenshot-6-settings.png` - Settings page

### Promotional Images
- `promo-small-440x280.png` - Small promotional tile
- `promo-marquee-1400x560.png` - Marquee for store listing
- `icon-store-128.png` - Store icon (128x128)

## Generating Screenshots

Screenshots are generated from HTML templates using a headless browser:

```bash
# Install dependencies
npm install

# Generate screenshots (requires the extension to be built)
npm run build
node scripts/generate-screenshots.js
```

Alternatively, use the screenshot templates in `screenshot-templates/` and capture them manually in a browser at 1280x800 resolution.

## Design Guidelines

All assets follow these design principles:

1. **Color Palette**
   - Primary gradient: `rgb(209,127,247)` to `rgb(157,214,252)`
   - Background: White or light gradient
   - Text: Dark gray `#202124` for primary, `#5f6368` for secondary

2. **Typography**
   - Headlines: Bold, large (48px+)
   - Body text: Regular, readable (16-18px)
   - Font family: System font stack

3. **Layout**
   - Gradient frame or border
   - Prominent headline caption
   - Clear, focused content
   - Professional shadows and spacing

## Asset Checklist

- [ ] All 6 screenshots at exactly 1280x800 PNG
- [ ] Small promo tile at exactly 440x280 PNG
- [ ] Marquee at exactly 1400x560 PNG
- [ ] Store icon at exactly 128x128 PNG
- [ ] All assets use the correct color palette
- [ ] All assets have clear, readable text
- [ ] listing.md is complete with all descriptions and permissions
