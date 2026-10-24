/**
 * Background service worker for AskToDoc
 */

import { addReferrer } from '../constants';

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open onboarding page
    chrome.tabs.create({
      url: chrome.runtime.getURL('onboarding.html')
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getAuthToken') {
    handleGetAuthToken(sendResponse);
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'signIn') {
    handleSignIn(sendResponse);
    return true;
  }
  
  if (request.action === 'signOut') {
    handleSignOut(sendResponse);
    return true;
  }
  
  return false;
});

/**
 * Get auth token for Google Drive API
 */
async function handleGetAuthToken(sendResponse: (response: any) => void) {
  try {
    const { useDirectUpload } = await chrome.storage.sync.get({ useDirectUpload: false });
    
    if (!useDirectUpload) {
      sendResponse({ token: null });
      return;
    }
    
    const result = await chrome.identity.getAuthToken({ interactive: false });
    const token = typeof result === 'string' ? result : result?.token || null;
    sendResponse({ token: token });
  } catch (error) {
    console.error('Auth error:', error);
    sendResponse({ token: null, error: String(error) });
  }
}

/**
 * Sign in with interactive OAuth
 */
async function handleSignIn(sendResponse: (response: any) => void) {
  try {
    const result = await chrome.identity.getAuthToken({ interactive: true });
    const token = typeof result === 'string' ? result : result?.token || null;
    await chrome.storage.sync.set({ useDirectUpload: true });
    sendResponse({ success: true, token });
  } catch (error) {
    console.error('Sign in error:', error);
    sendResponse({ success: false, error: String(error) });
  }
}

/**
 * Sign out and remove cached token
 */
async function handleSignOut(sendResponse: (response: any) => void) {
  try {
    const result = await chrome.identity.getAuthToken({ interactive: false });
    const token = typeof result === 'string' ? result : result?.token || null;
    if (token) {
      await chrome.identity.removeCachedAuthToken({ token });
      
      // Revoke token
      await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    }
    
    await chrome.storage.sync.set({ useDirectUpload: false });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    sendResponse({ success: false, error: String(error) });
  }
}

// Add context menu (optional enhancement)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-driveio',
    title: 'Open Drive I/O',
    contexts: ['action']
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'open-driveio') {
    chrome.tabs.create({
      url: addReferrer('https://www.driveio.io')
    });
  }
});
