import yaml from 'js-yaml';
import type { Theme } from './theme.js';

export interface FrontmatterResult {
  meta: Record<string, unknown>;
  content: string;
}

const frontmatterRegex = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/;

const themeKeys: Set<string> = new Set([
  'brand_color',
  'heading_color',
  'body_color',
  'background_color',
  'content_color',
  'card_color',
  'button_color',
  'button_text_color',
  'secondary_color',
  'secondary_text_color',
  'success_color',
  'success_text_color',
  'danger_color',
  'danger_text_color',
  'warning_color',
  'warning_text_color',
  'font_family',
  'font_size',
  'line_height',
  'content_width',
  'border_radius',
]);

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function extractFrontmatter(input: string): FrontmatterResult {
  const match = input.match(frontmatterRegex);
  if (!match) {
    return { meta: {}, content: input };
  }
  const data = (yaml.load(match[1]) as Record<string, unknown>) ?? {};
  return { meta: data, content: match[2] };
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
