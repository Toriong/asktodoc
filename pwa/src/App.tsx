import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';

function App() {
  const [sharedContent, setSharedContent] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Check if this is a share target invocation
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get('text');
    const _title = urlParams.get('title');
    
    if (text) {
      setSharedContent(text);
      handleSharedContent(text, _title || 'Shared Content');
    }
  }, []);

  async function handleSharedContent(markdown: string, _title: string) {
    try {
      // Convert Markdown to HTML (basic conversion)
      const html = markdownToHTML(markdown);
      
      // Copy to clipboard
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([markdown], { type: 'text/plain' }),
      });
      
      await navigator.clipboard.write([clipboardItem]);
      setStatus('Copied! Opening Google Docs...');
      
      // Open docs.new
      setTimeout(() => {
        window.open('https://docs.new', '_blank');
      }, 500);
      
    } catch (error) {
      console.error('Failed to process shared content:', error);
      setStatus('Failed to copy. Please try again.');
    }
  }

  function markdownToHTML(markdown: string): string {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/gim, '</p><p>')
      // Lists (basic)
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    
    return `<p>${html}</p>`;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📄 AskToDoc PWA</h1>
        <p>Share Markdown content to Google Docs</p>
      </header>

      {sharedContent && (
        <div className="shared-content">
          <h2>Shared Content</h2>
          <pre>{sharedContent}</pre>
          <p className="status">{status}</p>
        </div>
      )}

      {!sharedContent && (
        <div className="instructions">
          <h2>How to use</h2>
          <ol>
            <li>Install this PWA to your device</li>
            <li>Share Markdown content from any app</li>
            <li>Select "AskToDoc PWA" as the share target</li>
            <li>Content is converted to HTML and copied</li>
            <li>Paste into Google Docs</li>
          </ol>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
