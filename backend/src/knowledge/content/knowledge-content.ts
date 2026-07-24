import { BadRequestException } from '@nestjs/common';
import sanitizeHtml = require('sanitize-html');

export type KnowledgeChunkInput = {
  chunkIndex: number;
  heading: null;
  content: string;
};

const MAX_TEXT_LENGTH = 100_000;
const TARGET_CHARS = 2_400;
const ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'strong',
  'b',
  'em',
  'i',
  'a',
  'blockquote',
  'br',
  'ol',
  'ul',
  'li',
];

export const sanitizeKnowledgeHtml = (input: string): string =>
  sanitizeHtml(input ?? '', {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ['href'] },
    allowedSchemes: ['http', 'https'],
    allowProtocolRelative: false,
  }).trim();

export const normalizeKnowledgeText = (input: string): string => {
  const text = (input ?? '').replace(/\r\n?/g, '\n').trim();

  if (!text) {
    throw new BadRequestException('Knowledge document content cannot be empty');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new BadRequestException(
      `Knowledge document text cannot exceed ${MAX_TEXT_LENGTH} characters`,
    );
  }

  return text;
};

export const chunkKnowledgeText = (
  titleInput: string,
  textInput: string,
): KnowledgeChunkInput[] => {
  const title = titleInput.trim();
  if (!title) {
    throw new BadRequestException('Knowledge title is required');
  }

  const text = normalizeKnowledgeText(textInput);
  const prefix = `Title: ${title}`;
  const maxBodyLength = TARGET_CHARS - prefix.length - 2;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const bodies: string[] = [];
  let current = '';

  const flush = () => {
    if (current) bodies.push(current);
    current = '';
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxBodyLength) {
      const combined = current ? `${current}\n\n${paragraph}` : paragraph;
      if (combined.length <= maxBodyLength) {
        current = combined;
      } else {
        flush();
        current = paragraph;
      }
      continue;
    }

    flush();
    for (const word of paragraph.split(/\s+/)) {
      const combined = current ? `${current} ${word}` : word;
      if (current && combined.length > maxBodyLength) {
        flush();
        current = word;
      } else {
        current = combined;
      }
    }
  }
  flush();

  return bodies.map((body, chunkIndex) => ({
    chunkIndex,
    heading: null,
    content: `${prefix}\n\n${body}`,
  }));
};
