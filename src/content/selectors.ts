/**
 * Answer block selector with multiple strategies for resilience
 */

export interface AnswerBlock {
  element: HTMLElement;
  content: HTMLElement;
}

/**
 * Strategies to find AI Mode answer blocks on Google Search
 */
const SELECTOR_STRATEGIES = [
  // Strategy 1: Look for common AI answer containers
  () => document.querySelectorAll('[data-attrid*="ai"], [data-attrid*="AI"]'),
  
  // Strategy 2: Look for SGE (Search Generative Experience) containers
  () => document.querySelectorAll('[jsname], [data-hveid]'),
  
  // Strategy 3: Look for large text blocks with specific styling
  () => {
    const candidates: Element[] = [];
    document.querySelectorAll('div').forEach(el => {
      const text = el.textContent?.trim() || '';
      // AI answers are typically long-form
      if (text.length > 200 && el.querySelector('p, ul, ol')) {
        candidates.push(el);
      }
    });
    return candidates;
  },
  
  // Strategy 4: Look for content with citations/sources
  () => document.querySelectorAll('[role="region"]'),
];

/**
 * Find AI Mode answer blocks on the page
 */
export function findAnswerBlocks(): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  const seen = new Set<Element>();

  for (const strategy of SELECTOR_STRATEGIES) {
    try {
      const elements = strategy();
      elements.forEach(el => {
        if (el instanceof HTMLElement && !seen.has(el)) {
          // Verify it looks like an answer block
          if (isLikelyAnswerBlock(el)) {
            seen.add(el);
            blocks.push({
              element: el,
              content: el,
            });
          }
        }
      });

      // If we found blocks, we're done
      if (blocks.length > 0) {
        break;
      }
    } catch (error) {
      console.warn('Selector strategy failed:', error);
    }
  }

  return blocks;
}

/**
 * Check if an element looks like an AI answer block
 */
function isLikelyAnswerBlock(el: HTMLElement): boolean {
  const text = el.textContent?.trim() || '';
  
  // Must have substantial text
  if (text.length < 100) return false;
  
  // Must contain block-level elements (paragraphs, lists, etc.)
  const hasBlockElements = 
    el.querySelector('p, ul, ol, table, h1, h2, h3, h4, h5, h6') !== null;
  
  if (!hasBlockElements) return false;
  
  // Should not be hidden
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }
  
  return true;
}

/**
 * Set up a MutationObserver to detect dynamically added answer blocks
 */
export function observeForAnswerBlocks(
  callback: (blocks: AnswerBlock[]) => void
): () => void {
  const observer = new MutationObserver(() => {
    const blocks = findAnswerBlocks();
    if (blocks.length > 0) {
      callback(blocks);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  const initialBlocks = findAnswerBlocks();
  if (initialBlocks.length > 0) {
    callback(initialBlocks);
  }

  // Return cleanup function
  return () => observer.disconnect();
}
