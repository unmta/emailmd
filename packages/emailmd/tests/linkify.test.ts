import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('linkify / bare URL autolinks', () => {
  it('auto-links a bare https URL', () => {
    const { html } = render('Visit https://example.com for info.');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('>https://example.com</a>');
  });

  it('auto-links a bare http URL', () => {
    const { html } = render('See http://example.com for details.');
    expect(html).toContain('href="http://example.com"');
  });

  it('does not double-link an explicit markdown link', () => {
    const { html } = render('[Example](https://example.com)');
    const matches = html.match(/href="https:\/\/example\.com"/g);
    expect(matches?.length).toBe(1);
  });

  it('auto-links alongside regular markdown content', () => {
    const { html } = render('# Title\n\nGo to https://example.com now.');
    expect(html).toContain('href="https://example.com"');
  });

  it('contains no MJML tags in output', () => {
    const { html } = render('Visit https://example.com');
    expect(html).not.toMatch(/<mj-/);
  });
});

describe('linkify plain text output', () => {
  it('preserves the bare URL in plain text', () => {
    const { text } = render('Visit https://example.com for info.');
    expect(text).toContain('https://example.com');
  });
});
