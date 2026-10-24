import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { APP_NAME } from './constants';
import './options.css';

function Options() {
  const [useDirectUpload, setUseDirectUpload] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await chrome.storage.sync.get({ useDirectUpload: false });
    setUseDirectUpload(settings.useDirectUpload);
  }

  async function handleSave() {
    setSaving(true);
    await chrome.storage.sync.set({ useDirectUpload });
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="options-container">
      <div className="options-header">
        <img 
          src={chrome.runtime.getURL('icons/icon-48.png')} 
          alt={APP_NAME}
          className="w-12 h-12"
        />
        <div>
          <h1 className="options-title">{APP_NAME} Settings</h1>
          <p className="options-subtitle">Configure how you send answers to Google Docs</p>
        </div>
      </div>

      <div className="options-content">
        <div className="settings-section">
          <h2 className="section-title">Upload Mode</h2>
          
          <label className="option-card">
            <input
              type="radio"
              name="mode"
              checked={!useDirectUpload}
              onChange={() => setUseDirectUpload(false)}
            />
            <div>
              <div className="option-title">Clipboard Mode (Default)</div>
              <div className="option-description">
                Copies formatted content to your clipboard and opens docs.new. 
                You paste the content yourself. No sign-in required.
              </div>
            </div>
          </label>

          <label className="option-card">
            <input
              type="radio"
              name="mode"
              checked={useDirectUpload}
              onChange={() => setUseDirectUpload(true)}
            />
            <div>
              <div className="option-title">Direct Upload Mode</div>
              <div className="option-description">
                Creates the Google Doc automatically and opens it. 
                Requires signing in with Google (drive.file scope only).
              </div>
            </div>
          </label>
        </div>

        <div className="settings-section">
          <h2 className="section-title">About Permissions</h2>
          <div className="info-box">
            <p>
              <strong>drive.file scope:</strong> This limited scope only allows {APP_NAME} 
              to create new files. It cannot read, modify, or delete your existing files.
            </p>
            <p>
              This is the most restrictive Drive permission available and does not 
              require Google CASA review.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="save-button"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
