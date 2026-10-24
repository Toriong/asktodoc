/**
 * Convert answer block content to semantic HTML
 */
export function convertToSemanticHTML(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove script tags and other unwanted elements
  clone.querySelectorAll('script, style, iframe').forEach(el => el.remove());
  
  // Clean up classes and IDs that are Google-specific
  clone.querySelectorAll('*').forEach(el => {
    if (el instanceof HTMLElement) {
      el.removeAttribute('class');
      el.removeAttribute('id');
      el.removeAttribute('style');
      el.removeAttribute('data-ved');
      el.removeAttribute('data-hveid');
      el.removeAttribute('jsname');
    }
  });
  
  return clone.innerHTML;
}

/**
 * Extract source links from answer block
 */
export function extractSourceLinks(element: HTMLElement): Array<{ text: string; url: string }> {
  const links: Array<{ text: string; url: string }> = [];
  const seen = new Set<string>();
  
  element.querySelectorAll('a[href]').forEach(anchor => {
    const url = (anchor as HTMLAnchorElement).href;
    const text = anchor.textContent?.trim() || url;
    
    if (url && !seen.has(url) && url.startsWith('http')) {
      seen.add(url);
      links.push({ text, url });
    }
  });
  
  return links;
}

/**
 * Generate HTML document with answer and sources
 */
export function generateDocHTML(content: string, sources: Array<{ text: string; url: string }>): string {
  const sourcesHTML = sources.length > 0
    ? `
      <h2>Sources</h2>
      <ul>
        ${sources.map(s => `<li><a href="${s.url}">${s.text}</a></li>`).join('\n')}
      </ul>
    `
    : '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    ul, ol { margin-left: 1.5em; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
    a { color: #1a73e8; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  ${content}
  ${sourcesHTML}
</body>
</html>
  `.trim();
}

/**
 * Convert HTML to plain text with basic formatting
 */
export function htmlToPlainText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Convert headings
  temp.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    const text = h.textContent || '';
    h.textContent = `\n\n${text}\n${'='.repeat(text.length)}\n`;
  });
  
  // Convert lists
  temp.querySelectorAll('li').forEach(li => {
    li.textContent = `• ${li.textContent}`;
  });
  
  // Convert paragraphs
  temp.querySelectorAll('p').forEach(p => {
    p.textContent = `\n\n${p.textContent}\n`;
  });
  
  return temp.textContent || '';
}
