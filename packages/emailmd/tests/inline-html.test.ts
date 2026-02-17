import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('inline HTML', () => {
  describe('inline tags within paragraphs', () => {
    it('renders <span> with style attribute', () => {
      const { html } = render('This is <span style="color:red">red text</span> here.');
      expect(html).toContain('<span style="color:red">red text</span>');
    });

    it('renders <u> underline tag', () => {
      const { html } = render('This is <u>underlined</u> text.');
      expect(html).toContain('<u>underlined</u>');
    });

    it('renders <mark> highlight tag', () => {
      const { html } = render('This is <mark>highlighted</mark> text.');
      expect(html).toContain('<mark>highlighted</mark>');
    });

    it('renders <sup> and <sub> tags', () => {
      const { html } = render('H<sub>2</sub>O and E=mc<sup>2</sup>');
      expect(html).toContain('<sub>2</sub>');
      expect(html).toContain('<sup>2</sup>');
    });

    it('renders <s> strikethrough tag', () => {
      const { html } = render('This is <s>deleted</s> text.');
      expect(html).toContain('<s>deleted</s>');
    });

    it('does not escape HTML tags into entities', () => {
      const { html } = render('<span>hello</span>');
      expect(html).not.toContain('&lt;span&gt;');
      expect(html).toContain('<span>hello</span>');
    });
  });

  describe('HTML blocks', () => {
    it('renders a standalone <div> block', () => {
      const { html } = render('Before\n\n<div style="text-align:center">Centered content</div>\n\nAfter');
      expect(html).toContain('Centered content');
      expect(html).toContain('Before');
      expect(html).toContain('After');
    });
  });

  describe('HTML comments', () => {
    it('does not confuse user comments with internal markers', () => {
      const { html } = render('<!-- TODO: fix this -->\n\nSome text.');
      expect(html).toContain('Some text.');
    });
  });

  describe('HTML mixed with markdown syntax', () => {
    it('renders bold markdown around inline HTML', () => {
      const { html } = render('**<span style="color:blue">bold blue</span>**');
      expect(html).toContain('<strong>');
      expect(html).toContain('<span style="color:blue">bold blue</span>');
    });

    it('renders inline HTML inside a list item', () => {
      const { html } = render('- Item with <u>underline</u>\n- Normal item');
      expect(html).toContain('<u>underline</u>');
      expect(html).toContain('Normal item');
    });

    it('renders inline HTML inside a blockquote', () => {
      const { html } = render('> Quote with <mark>highlight</mark>');
      expect(html).toContain('<mark>highlight</mark>');
    });
  });

  describe('output cleanliness', () => {
    it('contains no MJML tags in output', () => {
      const { html } = render('<span style="color:red">red</span>');
      expect(html).not.toMatch(/<mj-/);
    });
  });
});

describe('inline HTML plain text output', () => {
  it('strips inline HTML tags, preserving text content', () => {
    const { text } = render('This is <span style="color:red">important</span> text.');
    expect(text).toContain('important');
    expect(text).toContain('This is');
    expect(text).not.toContain('<span');
  });

  it('strips <u> tags, preserving text', () => {
    const { text } = render('Read the <u>underlined part</u> carefully.');
    expect(text).toContain('underlined part');
    expect(text).not.toContain('<u>');
  });

  it('strips <sup> and <sub> tags, preserving text', () => {
    const { text } = render('H<sub>2</sub>O');
    expect(text).toContain('H2O');
  });

  it('strips block-level HTML tags', () => {
    const { text } = render('<div style="text-align:center">Content here</div>');
    expect(text).toContain('Content here');
    expect(text).not.toContain('<div');
  });
});
