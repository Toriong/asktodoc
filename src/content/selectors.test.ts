import { describe, it, expect } from 'vitest';
import { findAnswerBlocks } from './selectors';

describe('Answer Block Selectors', () => {
  it('should find answer blocks with data-attrid', () => {
    document.body.innerHTML = `
      <div data-attrid="ai-answer">
        <p>This is a long AI-generated answer that contains multiple sentences and provides detailed information about a topic. It has enough content to be considered a valid answer block.</p>
        <ul>
          <li>Point one</li>
          <li>Point two</li>
        </ul>
      </div>
    `;

    const blocks = findAnswerBlocks();
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('should find answer blocks with substantial content', () => {
    document.body.innerHTML = `
      <div>
        <p>This is a comprehensive answer with multiple paragraphs. It provides detailed information and explanations. The content is long enough to be considered an AI answer. It includes various formatting elements.</p>
        <p>Second paragraph with more information and details about the topic.</p>
        <ul>
          <li>First item with details</li>
          <li>Second item with more information</li>
          <li>Third item</li>
        </ul>
      </div>
    `;

    const blocks = findAnswerBlocks();
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('should not find blocks with insufficient content', () => {
    document.body.innerHTML = `
      <div>
        <p>Short text</p>
      </div>
    `;

    const blocks = findAnswerBlocks();
    expect(blocks.length).toBe(0);
  });

  it('should not find hidden blocks', () => {
    document.body.innerHTML = `
      <div style="display: none;">
        <p>This is a long AI-generated answer that contains multiple sentences and provides detailed information about a topic. It has enough content to be considered a valid answer block.</p>
        <ul>
          <li>Point one</li>
          <li>Point two</li>
        </ul>
      </div>
    `;

    const blocks = findAnswerBlocks();
    expect(blocks.length).toBe(0);
  });

  it('should handle empty document', () => {
    document.body.innerHTML = '';
    const blocks = findAnswerBlocks();
    expect(blocks.length).toBe(0);
  });
});
