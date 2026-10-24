# Demo Videos

This directory contains demonstration videos for the AskToDoc Chrome extension.

## Videos

1. **1-installation-onboarding.webm** (15-40s)
   - Shows the extension installation process
   - Displays the onboarding page that opens automatically
   - Scrolls through the "How to use" section

2. **2-send-to-docs.webm** (15-40s)
   - Shows a Google Search AI Mode answer (fixture)
   - Demonstrates clicking the "Send to Docs" button
   - Shows the formatted result being pasted into a Google Docs page

3. **3-popup-settings.webm** (15-40s)
   - Shows the extension popup
   - Demonstrates toggling between clipboard and direct upload modes
   - Shows the settings/options page

## Generating Videos

Run the Playwright tests to generate these videos:

```bash
npm run playwright
```

Videos are recorded at 1280x800 resolution in WebM format.

## Converting to MP4

To convert WebM videos to MP4 (for broader compatibility):

```bash
ffmpeg -i input.webm -c:v libx264 -preset slow -crf 22 -c:a aac output.mp4
```

Or use the batch script:

```bash
for f in *.webm; do ffmpeg -i "$f" -c:v libx264 -preset slow -crf 22 "${f%.webm}.mp4"; done
```

## Fixture Pages

The `fixtures/` directory contains HTML pages that simulate:
- Google Search AI Mode answer pages
- Google Docs interface

These fixtures are used because live google.com cannot be reliably automated.
