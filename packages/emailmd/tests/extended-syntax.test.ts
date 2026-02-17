import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('emoji shortcodes', () => {
  it('converts emoji shortcodes to unicode', () => {
    const { html } = render('Gone camping! :tent: Be back soon.');
    expect(html).toContain('⛺');
    expect(html).not.toContain(':tent:');
  });

  it('renders multiple emoji in one line', () => {
    const { html } = render(':smile: and :wave:');
    expect(html).toContain('😄');
    expect(html).toContain('👋');
  });

  it('preserves emoji in plain text output', () => {
    const { text } = render('Hello :wave:');
    expect(text).toContain('👋');
  });
});

describe('definition lists', () => {
  it('renders definition list HTML', () => {
    const md = `Term One\n: Definition of term one.\n\nTerm Two\n: Definition of term two.`;
    const { html } = render(md);
    expect(html).toContain('<dl>');
    expect(html).toContain('<dt>Term One</dt>');
    expect(html).toContain('<dd>Definition of term one.</dd>');
    expect(html).toContain('<dt>Term Two</dt>');
    expect(html).toContain('<dd>Definition of term two.</dd>');
  });

  it('converts definition lists to plain text', () => {
    const md = `Term\n: The definition.`;
    const { text } = render(md);
    expect(text).toContain('Term');
    expect(text).toContain('  The definition.');
    expect(text).not.toContain('<dl>');
    expect(text).not.toContain('<dt>');
  });
});

describe('inline highlight (==text==)', () => {
  it('renders ==text== as <mark> tags', () => {
    const { html } = render('This is ==very important== text.');
    expect(html).toContain('<mark>very important</mark>');
  });

  it('strips <mark> tags in plain text output', () => {
    const { text } = render('This is ==highlighted== text.');
    expect(text).toContain('highlighted');
    expect(text).not.toContain('<mark>');
  });
});

describe('subscript (~text~)', () => {
  it('renders ~text~ as <sub> tags', () => {
    const { html } = render('H~2~O');
    expect(html).toContain('<sub>2</sub>');
  });

  it('strips <sub> tags in plain text output', () => {
    const { text } = render('H~2~O');
    expect(text).toContain('H2O');
  });
});

describe('superscript (^text^)', () => {
  it('renders ^text^ as <sup> tags', () => {
    const { html } = render('X^2^');
    expect(html).toContain('<sup>2</sup>');
  });

  it('strips <sup> tags in plain text output', () => {
    const { text } = render('X^2^');
    expect(text).toContain('X2');
  });
});
