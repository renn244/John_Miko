import { BadRequestException } from '@nestjs/common';
import {
  chunkKnowledgeText,
  normalizeKnowledgeText,
  sanitizeKnowledgeHtml,
} from './knowledge-content';

describe('knowledge content utilities', () => {
  it('sanitizes HTML without deriving its plain text', () => {
    expect(sanitizeKnowledgeHtml(
      '<h1>Pool Rules</h1><p>Children <strong>must</strong> be supervised.</p><script>bad()</script>',
    )).toBe(
      '<h1>Pool Rules</h1><p>Children <strong>must</strong> be supervised.</p>',
    );
  });

  it('normalizes Tiptap text and creates simple indexed chunks', () => {
    const text = normalizeKnowledgeText(
      `  Rates\r\n\r\n${'Rate details. '.repeat(400)}  `,
    );
    const chunks = chunkKnowledgeText(
      'Guest Guide',
      text,
    );

    expect(text.startsWith('Rates\n\nRate details.')).toBe(true);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.map((chunk) => chunk.chunkIndex)).toEqual(
      chunks.map((_, index) => index),
    );
    expect(chunks[0].content).toContain('Title: Guest Guide');
    expect(chunks.every((chunk) => chunk.heading === null)).toBe(true);
  });

  it('rejects empty Tiptap text', () => {
    expect(() => normalizeKnowledgeText('  \n\n  ')).toThrow(
      BadRequestException,
    );
  });
});
