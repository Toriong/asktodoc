import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { APP_NAME, addReferrer } from './constants';
import './popup.css';

function Popup() {
  const [useDirectUpload, setUseDirectUpload] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await chrome.storage.sync.get({ useDirectUpload: false });
    setUseDirectUpload(settings.useDirectUpload);
    
    if (settings.useDirectUpload) {
      // Check if we have a valid token
      const response = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
      setIsSignedIn(!!response.token);
    }
    
    setLoading(false);
  }

  async function handleToggleMode() {
    if (!useDirectUpload) {
      // Turning on - need to sign in
      setLoading(true);
      const response = await chrome.runtime.sendMessage({ action: 'signIn' });
      
      if (response.success) {
        setUseDirectUpload(true);
        setIsSignedIn(true);
      } else {
        alert('Failed to sign in. Please try again.');
      }
      setLoading(false);
    } else {
      // Turning off - sign out
      setLoading(true);
      await chrome.runtime.sendMessage({ action: 'signOut' });
      setUseDirectUpload(false);
      setIsSignedIn(false);
      setLoading(false);
    }
  }

  function openOnboarding() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('onboarding.html')
    });
  }

  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  function openDriveIO() {
    chrome.tabs.create({
      url: addReferrer('https://www.driveio.io')
    });
  }

  if (loading) {
    return (
      <div className="popup-container">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <img 
          src={chrome.runtime.getURL('icons/icon-48.png')} 
          alt={APP_NAME}
          className="w-8 h-8"
        />
        <h1 className="popup-title">{APP_NAME}</h1>
      </div>

      <div className="popup-content">
        <div className="setting-item">
          <div>
            <div className="setting-label">Direct Upload Mode</div>
            <div className="setting-description">
              {useDirectUpload 
                ? 'Create Docs directly (requires sign-in)'
                : 'Copy to clipboard (no sign-in needed)'}
            </div>
          </div>
          <button
            onClick={handleToggleMode}
            className={`toggle-button ${useDirectUpload ? 'toggle-on' : ''}`}
          >
            <div className="toggle-slider" />
          </button>
        </div>

        {useDirectUpload && (
          <div className="status-badge">
            {isSignedIn ? '✓ Signed in' : '⚠ Not signed in'}
          </div>
        )}

        <div className="divider" />

        <button onClick={openOnboarding} className="menu-button">
          📖 How to use {APP_NAME}
        </button>

        <button onClick={openOptions} className="menu-button">
          ⚙️ Settings
        </button>

        <div className="divider" />

        <button onClick={openDriveIO} className="cta-button">
          🚀 Get Drive I/O
        </button>

        <p className="popup-footer">
          Made by the Drive I/O team
        </p>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
