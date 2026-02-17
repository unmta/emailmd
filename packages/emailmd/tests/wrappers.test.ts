import { describe, it, expect, vi } from 'vitest';
import { render, segmentsToMjml, buildHead, defaultTheme } from '../src/index.js';
import type { WrapperFn, WrapperMeta, Segment } from '../src/index.js';

describe('default wrapper', () => {
  it('produces outer gray background and white content area', () => {
    const { html } = render('# Hello\n\nWorld.');
    expect(html).toContain(defaultTheme.backgroundColor);
    expect(html).toContain(defaultTheme.contentColor);
  });

  it('includes preheader when provided', () => {
    const md = '---\npreheader: Preview text here\n---\n\n# Hello';
    const { html } = render(md);
    expect(html).toContain('Preview text here');
  });

  it('omits preheader when not provided', () => {
    const { html } = render('# Hello');
    expect(html).not.toContain('Preview text here');
  });

  it('renders footer with markdown bold', () => {
    const md = '# Hello\n\n::: footer\n**Acme Corp**\n:::';
    const { html } = render(md);
    expect(html).toContain('<strong>Acme Corp</strong>');
  });

  it('renders footer with markdown links', () => {
    const md = '# Hello\n\n::: footer\n[Unsubscribe](https://example.com/unsub)\n:::';
    const { html } = render(md);
    expect(html).toContain('https://example.com/unsub');
    expect(html).toContain('Unsubscribe');
  });

  it('omits footer section when not provided', () => {
    const { html } = render('# Hello');
    expect(html).not.toContain('font-size="13px"');
  });
});

describe('custom wrapper', () => {
  it('calls custom wrapper function with correct arguments', () => {
    const customWrapper: WrapperFn = vi.fn((segments, theme, meta) => {
      const head = buildHead(theme, meta?.preheader);
      const body = segmentsToMjml(segments, theme);
      return `<mjml>${head}<mj-body>${body}</mj-body></mjml>`;
    });

    const md = '---\npreheader: Custom preview\n---\n\n# Hello';
    const { html } = render(md, { wrapper: customWrapper });

    expect(customWrapper).toHaveBeenCalledOnce();
    const [segments, theme, meta] = (customWrapper as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(segments).toBeInstanceOf(Array);
    expect(segments.length).toBeGreaterThan(0);
    expect(theme).toHaveProperty('brandColor');
    expect(meta).toHaveProperty('preheader', 'Custom preview');
    expect(html).toContain('Hello');
  });

  it('segmentsToMjml produces valid MJML content for custom wrappers', () => {
    const customWrapper: WrapperFn = (segments, theme) => {
      const head = buildHead(theme);
      const body = segmentsToMjml(segments, theme);
      return `<mjml>${head}<mj-body><mj-section><mj-column><mj-text>HEADER</mj-text></mj-column></mj-section>${body}</mj-body></mjml>`;
    };

    const { html } = render('# Content', { wrapper: customWrapper });
    expect(html).toContain('HEADER');
    expect(html).toContain('Content');
    expect(html).not.toMatch(/<mj-/);
  });
});

describe('segmentsToMjml', () => {
  it('renders text segments', () => {
    const segments: Segment[] = [{ type: 'text', content: '<p>Hello</p>' }];
    const mjml = segmentsToMjml(segments, defaultTheme);
    expect(mjml).toContain('mj-section');
    expect(mjml).toContain('mj-text');
    expect(mjml).toContain('Hello');
  });

  it('renders multiple segment types', () => {
    const segments: Segment[] = [
      { type: 'text', content: '<p>Text</p>' },
      { type: 'callout', content: '<p>Callout</p>' },
      { type: 'highlight', content: '<p>Highlight</p>' },
    ];
    const mjml = segmentsToMjml(segments, defaultTheme);
    expect(mjml).toContain('Text');
    expect(mjml).toContain('Callout');
    expect(mjml).toContain('Highlight');
  });
});
