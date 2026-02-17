import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('image support', () => {
  describe('block images (standalone paragraph)', () => {
    it('renders a basic image responsively', () => {
      const { html } = render('![Hero banner](https://example.com/hero.png)');
      expect(html).toContain('https://example.com/hero.png');
      expect(html).toContain('Hero banner');
      // Should not contain a raw inline <img> — MJML compiles mj-image to table-based markup
      expect(html).not.toContain('<img src="https://example.com/hero.png"');
    });

    it('preserves alt text', () => {
      const { html } = render('![Product photo](https://example.com/product.jpg)');
      expect(html).toContain('alt="Product photo"');
    });

    it('preserves title attribute', () => {
      const { html } = render('![Alt](https://example.com/img.png "My Title")');
      expect(html).toContain('My Title');
    });

    it('applies custom width via attrs', () => {
      const { html } = render('![Alt](https://example.com/img.png){width="400"}');
      expect(html).toContain('https://example.com/img.png');
      expect(html).toContain('400');
    });

    it('applies left alignment via attrs', () => {
      const { html } = render('![Alt](https://example.com/img.png){align="left"}');
      expect(html).toContain('https://example.com/img.png');
    });

    it('applies border-radius via attrs', () => {
      const { html } = render('![Alt](https://example.com/img.png){border-radius="8px"}');
      expect(html).toContain('https://example.com/img.png');
      expect(html).toContain('border-radius');
      expect(html).toContain('8px');
    });
  });

  describe('linked images', () => {
    it('renders a linked image with href', () => {
      const { html } = render('[![Product](https://example.com/product.jpg)](https://example.com/shop)');
      expect(html).toContain('https://example.com/product.jpg');
      expect(html).toContain('https://example.com/shop');
    });

    it('renders a linked image with custom width on inner img', () => {
      const { html } = render('[![Alt](https://example.com/img.png){width="300"}](https://example.com/link)');
      expect(html).toContain('https://example.com/img.png');
      expect(html).toContain('https://example.com/link');
      expect(html).toContain('300');
    });
  });

  describe('inline images (mixed with text)', () => {
    it('leaves inline images as raw <img> within text', () => {
      const { html } = render('Check out this image ![icon](https://example.com/icon.png) in the text.');
      expect(html).toContain('Check out this image');
      expect(html).toContain('in the text.');
      expect(html).toContain('<img src="https://example.com/icon.png"');
    });

    it('applies vertical-align: middle by default via global style', () => {
      const { html } = render('Check ![icon](https://example.com/icon.png) here.');
      expect(html).toContain('img { vertical-align: middle; }');
    });

    it('converts valign attribute to inline style', () => {
      const { html } = render('Check ![icon](https://example.com/icon.png){valign="top"} here.');
      expect(html).toContain('style="vertical-align: top"');
      expect(html).not.toContain('valign="top"');
    });

    it('converts valign="baseline" to inline style', () => {
      const { html } = render('Text ![icon](https://example.com/icon.png){valign="baseline"} more.');
      expect(html).toContain('style="vertical-align: baseline"');
    });

    it('preserves width alongside valign', () => {
      const { html } = render('Text ![icon](https://example.com/icon.png){width="24" valign="top"} here.');
      expect(html).toContain('width="24"');
      expect(html).toContain('style="vertical-align: top"');
    });

    it('works with inline images inside callout directives', () => {
      const { html } = render('::: callout\nCheck ![icon](https://example.com/icon.png){valign="top"} here.\n:::');
      expect(html).toContain('style="vertical-align: top"');
    });

    it('converts float="left" to inline styles with margin', () => {
      const { html } = render('Text ![photo](https://example.com/photo.jpg){float="left"} description.');
      expect(html).toContain('float: left');
      expect(html).toContain('margin: 0 12px 8px 0');
      expect(html).not.toContain('float="left"');
    });

    it('converts float="right" to inline styles with margin', () => {
      const { html } = render('Text ![photo](https://example.com/photo.jpg){float="right"} description.');
      expect(html).toContain('float: right');
      expect(html).toContain('margin: 0 0 8px 12px');
    });

    it('combines float and valign into a single style', () => {
      const { html } = render('Text ![photo](https://example.com/photo.jpg){valign="top" float="left"} description.');
      expect(html).toContain('vertical-align: top');
      expect(html).toContain('float: left');
      expect(html).not.toContain('valign="top"');
      expect(html).not.toContain('float="left"');
    });

    it('float works with width attribute', () => {
      const { html } = render('::: callout\n![Plant](https://example.com/plant.jpg){width="80" float="left"} **Monstera** Easy care.\n:::');
      expect(html).toContain('width="80"');
      expect(html).toContain('float: left');
    });
  });

  describe('images with surrounding content', () => {
    it('splits text segments around a block image', () => {
      const { html } = render('# Welcome\n\n![Banner](https://example.com/banner.png)\n\nMore content below.');
      expect(html).toContain('Welcome');
      expect(html).toContain('https://example.com/banner.png');
      expect(html).toContain('More content below.');
    });

    it('handles multiple block images', () => {
      const md = '![First](https://example.com/1.png)\n\n![Second](https://example.com/2.png)';
      const { html } = render(md);
      expect(html).toContain('https://example.com/1.png');
      expect(html).toContain('https://example.com/2.png');
    });
  });

  describe('images inside directives stay inline', () => {
    it('does not extract images from callout directives', () => {
      const { html } = render('::: callout\n![Icon](https://example.com/icon.png)\n:::');
      expect(html).toContain('<img');
      expect(html).toContain('https://example.com/icon.png');
    });
  });

  describe('output cleanliness', () => {
    it('contains no mj- tags in final output', () => {
      const { html } = render('![Banner](https://example.com/banner.png)');
      expect(html).not.toMatch(/<mj-/);
    });

    it('contains no EMAILMD markers in output', () => {
      const { html } = render('# Title\n\n![Img](https://example.com/img.png)\n\nText');
      expect(html).not.toContain('EMAILMD:');
    });
  });
});

describe('image plain text output', () => {
  it('converts block images to [Image: alt] format', () => {
    const { text } = render('![Logo](https://example.com/logo.png)');
    expect(text).toContain('[Image: Logo]');
  });

  it('converts inline images to [Image: alt] format', () => {
    const { text } = render('See this ![icon](https://example.com/icon.png) here.');
    expect(text).toContain('[Image: icon]');
  });
});
