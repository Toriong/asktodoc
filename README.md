# AskToDoc

**Restore the "Send to Docs" button on Google Search AI Mode answers.**

AskToDoc is a free Chrome extension that brings back the "Export to Docs" feature Google removed from AI Mode in October 2026. With AskToDoc, you can save AI-generated answers to Google Docs with perfect formatting—headings, lists, tables, and source links intact.

## Features

- ✨ **One-Click Export**: Adds a "Send to Docs" button to every AI Mode answer
- 📋 **Perfect Formatting**: Preserves headings, bold text, lists, tables, and links
- 🔗 **Source Citations**: Automatically includes source links
- 🔒 **Privacy-Focused**: Minimal permissions, no data collection
- 🎯 **Two Modes**: Clipboard mode (default, no sign-in) or direct upload mode (optional OAuth)

## Installation

### From Source

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load `dist/` as an unpacked extension in Chrome

### From Chrome Web Store

*Coming soon*

## Usage

### Default Mode (Clipboard - No Sign-In Required)

1. Search on Google with AI Mode enabled
2. Click the **📄 Send to Docs** button on any AI answer
3. Content is copied to your clipboard
4. docs.new opens automatically
5. Paste (Ctrl+V / Cmd+V) your formatted content

### Direct Upload Mode (Optional)

1. Open the extension popup and toggle "Direct Upload Mode"
2. Sign in with your Google account (one time)
3. Click **📄 Send to Docs** on any AI answer
4. Document is created automatically and opens in a new tab

## Setup for Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run Tests

```bash
# Unit tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Generate Demo Videos

```bash
npm run playwright
```

Videos are saved to `demo/videos/`.

## OAuth Configuration

To enable direct upload mode, you need a Google OAuth client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials:
   - Application type: Chrome extension
   - Add your extension ID to authorized origins
5. Copy the client ID
6. Update `src/manifest.json`:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
     "scopes": ["https://www.googleapis.com/auth/drive.file"]
   }
   ```

### Why `drive.file` Scope?

We use the most restrictive Google Drive scope available:

- **`drive.file`**: Can only create new files and access files created by the app
- Cannot read, modify, or delete your existing files
- No CASA review required
- Maximum privacy and security

Other scopes we specifically do NOT use:
- ❌ `drive`: Full Drive access (too broad)
- ❌ `drive.readonly`: Read all files (unnecessary)
- ❌ `drive.metadata`: Access all metadata (unnecessary)

## Project Structure

```
/workspace
├── src/
│   ├── background/        # Service worker
│   ├── content/           # Content scripts
│   │   ├── selectors.ts   # Answer block detection
│   │   ├── selectors.test.ts
│   │   └── formatter.ts   # HTML conversion
│   ├── popup.tsx          # Extension popup
│   ├── options.tsx        # Settings page
│   ├── onboarding.tsx     # Onboarding page
│   ├── constants.ts       # Shared constants
│   └── manifest.json      # Extension manifest
├── pwa/                   # PWA version (Web Share Target)
├── public/icons/          # Extension icons
├── demo/
│   ├── fixtures/          # Test HTML pages
│   └── videos/            # Demo videos
├── store-assets/          # Chrome Web Store assets
│   ├── listing.md         # Store listing content
│   └── *.png              # Screenshots and promo images
└── tests/                 # Playwright tests
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite + @crxjs/vite-plugin
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Manifest**: V3

## Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+
- Other Chromium-based browsers

## Permissions Explained

| Permission | Purpose |
|------------|---------|
| `identity` | OAuth sign-in for direct upload mode (optional) |
| `storage` | Save user preferences (clipboard vs. direct upload) |
| `clipboardWrite` | Copy formatted content to clipboard |
| `host_permissions` | Call Google Drive API for direct uploads |

See `store-assets/listing.md` for detailed justifications.

## Privacy

AskToDoc:
- Does not collect or transmit user data
- Does not track usage or analytics
- Only accesses Google Drive when direct upload mode is enabled
- Uses minimal permissions
- Is fully open source

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Marketing

AskToDoc is a free marketing tool for Drive I/O. Every Drive I/O link includes `?referrer=AskToDoc`:

- [Drive I/O Home](https://www.driveio.io/?referrer=AskToDoc)
- [Copy Folder Extension](https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=AskToDoc)

## License

MIT License - see LICENSE file for details

## Credits

Made by the [Drive I/O](https://www.driveio.io/?referrer=AskToDoc) team.

## Support

- Report issues: GitHub Issues
- Contact: [Drive I/O Support](https://www.driveio.io/contact?type=support&referrer=AskToDoc)

---

**Note**: This extension is not affiliated with Google. Google, Google Search, Google Docs, and Google Drive are trademarks of Google LLC.
