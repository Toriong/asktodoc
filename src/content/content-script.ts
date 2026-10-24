import { observeForAnswerBlocks, AnswerBlock } from './selectors';
import { convertToSemanticHTML, extractSourceLinks, generateDocHTML, htmlToPlainText } from './formatter';

let buttonInstalled = false;

// Track which blocks we've already added buttons to
const processedBlocks = new WeakSet<HTMLElement>();

/**
 * Add Send to Docs button to answer blocks
 */
function addSendToDocsButton(blocks: AnswerBlock[]) {
  blocks.forEach(({ element, content }) => {
    if (processedBlocks.has(element)) {
      return;
    }
    processedBlocks.add(element);

    const button = createSendToDocsButton(content);
    
    // Try to insert at the top of the answer block
    const firstChild = element.firstChild;
    if (firstChild) {
      element.insertBefore(button, firstChild);
    } else {
      element.appendChild(button);
    }
  });
}

/**
 * Create the Send to Docs button
 */
function createSendToDocsButton(contentElement: HTMLElement): HTMLElement {
  const button = document.createElement('button');
  button.className = 'asktodoc-send-button';
  button.textContent = '📄 Send to Docs';
  button.title = 'Copy this answer to Google Docs';
  
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await handleSendToDocs(contentElement, button);
    } catch (error) {
      console.error('Failed to send to docs:', error);
      showToast(button, 'Failed to copy. Please try again.', 'error');
    }
  });
  
  return button;
}

/**
 * Handle the Send to Docs action
 */
async function handleSendToDocs(contentElement: HTMLElement, button: HTMLElement) {
  // Get settings
  const { useDirectUpload } = await chrome.storage.sync.get({ useDirectUpload: false });
  
  // Convert content
  const semanticHTML = convertToSemanticHTML(contentElement);
  const sources = extractSourceLinks(contentElement);
  const fullHTML = generateDocHTML(semanticHTML, sources);
  const plainText = htmlToPlainText(fullHTML);
  
  if (useDirectUpload) {
    // Direct upload mode - requires OAuth
    showToast(button, 'Creating document...', 'info');
    await uploadToGoogleDocs(fullHTML, button);
  } else {
    // Clipboard mode (default)
    await copyToClipboard(fullHTML, plainText);
    showToast(button, 'Copied! Opening Docs...', 'success');
    
    // Open docs.new
    window.open('https://docs.new', '_blank', 'noopener,noreferrer');
  }
}

/**
 * Copy content to clipboard
 */
async function copyToClipboard(html: string, text: string) {
  const clipboardItem = new ClipboardItem({
    'text/html': new Blob([html], { type: 'text/html' }),
    'text/plain': new Blob([text], { type: 'text/plain' }),
  });
  
  await navigator.clipboard.write([clipboardItem]);
}

/**
 * Upload content directly to Google Docs
 */
async function uploadToGoogleDocs(html: string, button: HTMLElement) {
  try {
    // Get auth token from background script
    const response = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
    
    if (!response.token) {
      throw new Error('Not signed in. Please enable sign-in mode in settings.');
    }
    
    const token = response.token;
    
    // Create multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelim = "\r\n--" + boundary + "--";
    
    const metadata = {
      name: `AI Answer - ${new Date().toLocaleDateString()}`,
      mimeType: 'application/vnd.google-apps.document'
    };
    
    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/html\r\n\r\n' +
      html +
      closeDelim;
    
    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }
    
    const file = await uploadResponse.json();
    showToast(button, 'Document created!', 'success');
    
    // Open the document
    window.open(`https://docs.google.com/document/d/${file.id}/edit`, '_blank', 'noopener,noreferrer');
    
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Show toast notification
 */
function showToast(anchor: HTMLElement, message: string, type: 'success' | 'error' | 'info') {
  const toast = document.createElement('div');
  toast.className = `asktodoc-toast asktodoc-toast-${type}`;
  toast.textContent = message;
  
  // Position relative to button
  const rect = anchor.getBoundingClientRect();
  toast.style.position = 'fixed';
  toast.style.top = `${rect.bottom + 10}px`;
  toast.style.left = `${rect.left}px`;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('asktodoc-toast-visible');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('asktodoc-toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize
if (!buttonInstalled) {
  buttonInstalled = true;
  
  // Set up observer
  observeForAnswerBlocks((blocks) => {
    addSendToDocsButton(blocks);
  });
}
