import matter from 'gray-matter';
import type { Theme } from './theme.js';

export interface FrontmatterResult {
  meta: Record<string, unknown>;
  content: string;
}

const themeKeys: Set<string> = new Set([
  'brand_color',
  'heading_color',
  'body_color',
  'background_color',
  'content_color',
  'card_color',
  'button_color',
  'button_text_color',
  'font_family',
  'font_size',
  'line_height',
  'content_width',
]);

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function extractFrontmatter(input: string): FrontmatterResult {
  const { data, content } = matter(input);
  return { meta: data, content };
}

export function frontmatterToThemeOverrides(meta: Record<string, unknown>): Partial<Theme> {
  const overrides: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (themeKeys.has(key)) {
      overrides[snakeToCamel(key)] = value;
    }
  }
  return overrides as Partial<Theme>;
}
