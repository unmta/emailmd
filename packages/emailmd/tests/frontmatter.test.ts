import { describe, it, expect } from 'vitest';
import { extractFrontmatter, frontmatterToThemeOverrides, render, darkTheme } from '../src/index.js';

describe('extractFrontmatter', () => {
  it('extracts frontmatter and content', () => {
    const input = `---
preheader: Hello
---

# Title`;
    const { meta, content } = extractFrontmatter(input);
    expect(meta.preheader).toBe('Hello');
    expect(content.trim()).toBe('# Title');
  });

  it('returns empty meta for markdown without frontmatter', () => {
    const { meta, content } = extractFrontmatter('# Just markdown');
    expect(meta).toEqual({});
    expect(content.trim()).toBe('# Just markdown');
  });
});

describe('frontmatterToThemeOverrides', () => {
  it('converts snake_case keys to camelCase theme overrides', () => {
    const meta = { button_color: '#FF0000', preheader: 'test' };
    const overrides = frontmatterToThemeOverrides(meta);
    expect(overrides).toEqual({ buttonColor: '#FF0000' });
  });

  it('converts multiple theme keys', () => {
    const meta = {
      background_color: '#000',
      button_text_color: '#FFF',
      font_family: 'Georgia',
    };
    const overrides = frontmatterToThemeOverrides(meta);
    expect(overrides).toEqual({
      backgroundColor: '#000',
      buttonTextColor: '#FFF',
      fontFamily: 'Georgia',
    });
  });

  it('maps button_color to buttonColor theme override', () => {
    const meta = { button_color: '#dc2626' };
    const overrides = frontmatterToThemeOverrides(meta);
    expect(overrides.buttonColor).toBe('#dc2626');
  });

  it('converts button variant color keys', () => {
    const meta = {
      secondary_color: '#6366f1',
      secondary_text_color: '#312e81',
      success_color: '#059669',
      success_text_color: '#000000',
      danger_color: '#b91c1c',
      danger_text_color: '#000000',
      warning_color: '#b45309',
      warning_text_color: '#000000',
    };
    const overrides = frontmatterToThemeOverrides(meta);
    expect(overrides).toEqual({
      secondaryColor: '#6366f1',
      secondaryTextColor: '#312e81',
      successColor: '#059669',
      successTextColor: '#000000',
      dangerColor: '#b91c1c',
      dangerTextColor: '#000000',
      warningColor: '#b45309',
      warningTextColor: '#000000',
    });
  });

  it('converts border_radius to borderRadius', () => {
    const meta = { border_radius: '12px' };
    const overrides = frontmatterToThemeOverrides(meta);
    expect(overrides).toEqual({ borderRadius: '12px' });
  });

  it('ignores unknown keys', () => {
    const meta = { preheader: 'text', unknown_key: 'value' };
    const overrides = frontmatterToThemeOverrides(meta);
    expect(overrides).toEqual({});
  });
});

describe('theme frontmatter shortcut', () => {
  it('applies dark theme via theme: dark in frontmatter', () => {
    const { html } = render(`---\ntheme: dark\n---\n\n# Hello`);
    expect(html).toContain(darkTheme.backgroundColor);
    expect(html).toContain(darkTheme.contentColor);
  });

  it('allows individual overrides on top of theme: dark', () => {
    const { html } = render(`---\ntheme: dark\nbrand_color: "#e11d48"\n---\n\n# Hello`);
    expect(html).toContain(darkTheme.backgroundColor);
    expect(html).toContain('#e11d48');
  });
});
