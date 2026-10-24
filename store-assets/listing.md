# AskToDoc - Chrome Web Store Listing

## Store Title
AskToDoc - Send AI Answers to Google Docs

## Short Description (132 characters max)
Restore the "Send to Docs" button on Google Search AI Mode answers. Save AI-generated content with formatting preserved.

## Full Description

Google removed the "Export to Docs" feature from AI Mode in October 2026. AskToDoc brings it back—and makes it even better.

### ✨ What It Does

AskToDoc restores the one-click "Send to Docs" button on Google Search AI Mode answers. Keep your AI-generated insights organized and formatted perfectly in Google Docs.

### 🚀 Key Features

• **One-Click Export**: A "Send to Docs" button appears on every AI Mode answer
• **Perfect Formatting**: Preserves headings, bold text, lists, tables, and links
• **Source Citations**: Automatically includes source links at the end
• **Two Modes**: Choose clipboard mode (no sign-in) or direct upload mode (requires Google sign-in)
• **Privacy-Focused**: Uses minimal permissions (drive.file scope only)

### 📋 How It Works

**Default Mode (No Sign-In)**
1. Click "Send to Docs" on any AI Mode answer
2. Content is copied to your clipboard with rich formatting
3. docs.new opens automatically
4. Paste (Ctrl+V) your formatted content

**Direct Upload Mode (Optional)**
1. Sign in with Google (one time)
2. Click "Send to Docs"
3. Document is created automatically and opens

### 🔒 Privacy & Permissions

AskToDoc uses the most restrictive Google Drive permission available:
- **drive.file scope**: Can only create new files, cannot read or modify existing files
- No CASA review required
- Your data stays private

### 🎯 Perfect For

• Researchers saving AI-generated summaries
• Students organizing study materials
• Content creators collecting research
• Anyone who wants to keep AI answers organized

### 🤝 Made by Drive I/O

From the team behind Drive I/O, the trusted Google Drive productivity tools. Learn more at driveio.io

---

**Note**: This extension works with Google Search AI Mode answers. Google Account required for direct upload mode (optional).

## Category
Productivity

## Language
English

## Privacy Policy URL
https://www.driveio.io/privacy?referrer=AskToDoc

## Permission Justifications

### identity
**Purpose**: Required to authenticate with Google Drive for direct upload mode (optional feature)
**Justification**: When users enable direct upload mode, we need to obtain an OAuth token to create Google Docs on their behalf. This permission is only used when the user explicitly enables this feature in settings.

### storage
**Purpose**: Store user preferences (clipboard vs. direct upload mode)
**Justification**: We need to remember the user's chosen mode (clipboard or direct upload) across browser sessions. No personal data is stored, only feature preferences.

### clipboardWrite
**Purpose**: Copy formatted content to clipboard in default mode
**Justification**: In clipboard mode (the default), we copy the AI answer as formatted HTML to the user's clipboard so they can paste it into Google Docs. This is the core functionality of the extension.

### host_permissions: https://www.googleapis.com/*
**Purpose**: Upload files to Google Drive when using direct upload mode
**Justification**: When direct upload mode is enabled, we make API calls to Google Drive to create new documents. We only use the drive.file scope, which is the most restrictive scope available and only allows creating new files.

## Screenshots

All screenshots are 1280x800 PNG with gradient frames and headline captions:

1. `screenshot-1-send-button.png` - "One-Click Send to Docs Button on AI Answers"
2. `screenshot-2-formatted-content.png` - "Perfect Formatting with Headings, Lists, and Links"
3. `screenshot-3-source-links.png` - "Source Citations Included Automatically"
4. `screenshot-4-clipboard-mode.png` - "Clipboard Mode - No Sign-In Required"
5. `screenshot-5-direct-upload.png` - "Direct Upload Mode - Instant Doc Creation"
6. `screenshot-6-settings.png` - "Simple Settings - Choose Your Preferred Mode"

## Promotional Images

- `promo-small-440x280.png` - Small promotional tile
- `promo-marquee-1400x560.png` - Marquee promotional image
- `icon-store-128.png` - Store listing icon (128x128)
