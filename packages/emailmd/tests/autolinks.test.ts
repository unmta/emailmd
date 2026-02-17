import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('autolinks', () => {
  it('converts <https://...> to a clickable link', () => {
    const { html } = render('Visit <https://example.com> for info.');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('>https://example.com</a>');
  });

  it('converts <user@example.com> to a mailto link', () => {
    const { html } = render('Email <user@example.com> for help.');
    expect(html).toContain('href="mailto:user@example.com"');
    expect(html).toContain('>user@example.com</a>');
  });

  it('renders angle-bracket URL as plain URL in text output', () => {
    const { text } = render('Visit <https://example.com> for info.');
    expect(text).toContain('https://example.com');
    expect(text).not.toContain('(https://example.com)');
  });

  it('renders angle-bracket email as plain email in text output', () => {
    const { text } = render('Email <user@example.com> for help.');
    expect(text).toContain('user@example.com');
    expect(text).not.toContain('mailto:');
  });
});
