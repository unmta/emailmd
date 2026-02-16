import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('render', () => {
  it('produces a complete HTML document', () => {
    const { html } = render('# Hello');
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<html');
    expect(html).toContain('<body');
  });

  it('renders a heading in an h1 tag', () => {
    const { html } = render('# Hello');
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('renders bold text', () => {
    const { html } = render('**bold**');
    expect(html).toMatch(/<strong>bold<\/strong>|<b>bold<\/b>/);
  });

  it('applies theme defaults when no theme is passed', () => {
    const { html } = render('Hello');
    expect(html).toContain('#a1a1aa'); // default bodyColor
  });

  it('renders with frontmatter overrides', () => {
    const md = `---
button_color: "#FF0000"
---

# Test`;
    const { html } = render(md);
    expect(html).toContain('<h1>Test</h1>');
    expect(html).not.toContain('button_color');
  });

  it('renders with frontmatter preheader', () => {
    const md = `---
preheader: Don't miss our biggest announcement
---

# Hello`;
    const { html } = render(md);
    expect(html).toContain("Don't miss our biggest announcement");
  });

  it('contains no MJML tags in output', () => {
    const { html } = render('# Hello\n\nA paragraph.');
    expect(html).not.toMatch(/<mj-/);
  });

  it('strips frontmatter from output', () => {
    const md = `---
preheader: Preview text
---

Hello`;
    const { html } = render(md);
    expect(html).not.toContain('preheader:');
    expect(html).toContain('Hello');
  });

  it('returns html, text, and meta', () => {
    const result = render('# Hello\n\nWorld.');
    expect(result).toHaveProperty('html');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('meta');
    expect(typeof result.html).toBe('string');
    expect(typeof result.text).toBe('string');
    expect(typeof result.meta).toBe('object');
  });

  it('renders a horizontal rule as a divider', () => {
    const { html } = render('Above\n\n---\n\nBelow');
    expect(html).toContain('Above');
    expect(html).toContain('Below');
    expect(html).toContain('border');
  });

  it('renders inline code with monospace font styling', () => {
    const { html } = render('Use the `render()` function.');
    expect(html).toContain('<code>');
    expect(html).toContain('render()');
    expect(html).toContain('monospace');
  });

  it('renders fenced code blocks', () => {
    const { html } = render('```\nconst x = 1;\n```');
    expect(html).toContain('<pre');
    expect(html).toContain('const x = 1;');
  });

  it('renders fenced code blocks with language class', () => {
    const { html } = render('```typescript\nconst x: number = 1;\n```');
    expect(html).toContain('<pre');
    expect(html).toContain('const x: number = 1;');
  });

  it('renders a blockquote with left border styling', () => {
    const { html } = render('> This is a quote');
    expect(html).toContain('border-left');
    expect(html).toContain('This is a quote');
  });

  it('renders blockquote text using theme body color, not hardcoded gray', () => {
    const { html } = render('> Quote text');
    expect(html).not.toContain('#6b7280');
  });

  it('renders nested blockquotes', () => {
    const { html } = render('> Outer\n>\n> > Inner');
    expect(html).toContain('Outer');
    expect(html).toContain('Inner');
    expect(html).toMatch(/blockquote.*blockquote/s);
  });

  it('renders unordered list with controlled spacing', () => {
    const { html } = render('- Item one\n- Item two');
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('padding-left');
  });

  it('renders ordered list with controlled spacing', () => {
    const { html } = render('1. First\n2. Second');
    expect(html).toContain('<ol');
    expect(html).toContain('<li');
    expect(html).toContain('padding-left');
  });

  it('renders nested unordered lists', () => {
    const { html } = render('- Item one\n- Item two\n  - Nested one\n  - Nested two\n- Item three');
    expect(html).toContain('Item one');
    expect(html).toContain('Nested one');
    expect(html).toMatch(/<ul[^>]*>[\s\S]*<ul[^>]*>/);
  });

  it('renders nested ordered lists', () => {
    const { html } = render('1. First\n2. Second\n   1. Sub one\n   2. Sub two\n3. Third');
    expect(html).toContain('First');
    expect(html).toContain('Sub one');
    expect(html).toMatch(/<ol[^>]*>[\s\S]*<ol[^>]*>/);
  });

  it('renders mixed nested lists (ul inside ol)', () => {
    const { html } = render('1. First\n2. Second\n   - Sub A\n   - Sub B\n3. Third');
    expect(html).toContain('First');
    expect(html).toContain('Sub A');
    expect(html).toMatch(/<ol[^>]*>[\s\S]*<ul[^>]*>/);
  });

  it('renders deeply nested lists without MJML errors', () => {
    const { html } = render('- Level 1\n  - Level 2\n    - Level 3');
    expect(html).toContain('Level 1');
    expect(html).toContain('Level 2');
    expect(html).toContain('Level 3');
    expect(html).not.toMatch(/<mj-/);
  });

  it('renders a block image without raw img tag', () => {
    const { html } = render('![Banner](https://example.com/banner.png)');
    expect(html).toContain('https://example.com/banner.png');
    expect(html).not.toMatch(/<mj-/);
    expect(html).not.toContain('EMAILMD:');
  });

  it('returns extracted frontmatter in meta', () => {
    const md = `---
preheader: Preview
logo: https://example.com/logo.png
---

# Hello`;
    const { meta } = render(md);
    expect(meta.preheader).toBe('Preview');
    expect(meta.logo).toBe('https://example.com/logo.png');
  });
});
