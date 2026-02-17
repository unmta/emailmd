import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

describe('button syntax', () => {
  it('renders {button} link as a styled button', () => {
    const { html } = render('[Get Started](https://example.com){button}');
    // Should not be a plain <a> tag — MJML compiles buttons to table-based markup
    expect(html).toContain('https://example.com');
    expect(html).toContain('Get Started');
    // Should have buttonColor as background
    expect(html).toContain('#18181b'); // default buttonColor
  });

  it('renders {button.secondary} with border styling', () => {
    const { html } = render('[Learn More](https://example.com){button.secondary}');
    expect(html).toContain('Learn More');
    expect(html).toContain('https://example.com');
    // Secondary button has transparent background and a border
    expect(html).toContain('transparent');
    expect(html).toContain('2px solid');
  });

  it('renders {button color="#dc2626"} with custom color', () => {
    const { html } = render('[Shop Sale](https://example.com){button color="#dc2626"}');
    expect(html).toContain('Shop Sale');
    expect(html).toContain('#dc2626');
  });

  it('leaves plain links as regular <a> tags', () => {
    const { html } = render('[Normal link](https://example.com)');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('Normal link');
    // Should be a standard inline link, not button table markup
    expect(html).not.toContain('inner-padding');
  });

  it('preserves button text correctly', () => {
    const { html } = render('[Click Here Now](https://example.com/action){button}');
    expect(html).toContain('Click Here Now');
  });

  it('renders two buttons on the same line side-by-side', () => {
    const { html } = render('[Get Started](https://example.com){button} [Learn More](https://example.com/more){button.secondary}');
    expect(html).toContain('Get Started');
    expect(html).toContain('Learn More');
    expect(html).toContain('https://example.com/more');
    // Secondary should have border styling
    expect(html).toContain('transparent');
    expect(html).toContain('2px solid');
  });

  it('renders three buttons on the same line side-by-side', () => {
    const { html } = render('[A](https://a.com){button} [B](https://b.com){button.secondary} [C](https://c.com){button color="#dc2626"}');
    expect(html).toContain('https://a.com');
    expect(html).toContain('https://b.com');
    expect(html).toContain('https://c.com');
    expect(html).toContain('#dc2626');
  });

  it('keeps buttons stacked when separated by blank lines', () => {
    const md = '[Get Started](https://example.com){button}\n\n[Learn More](https://example.com/more){button.secondary}';
    const { html } = render(md);
    expect(html).toContain('Get Started');
    expect(html).toContain('Learn More');
  });

  it('produces plain text for side-by-side buttons', () => {
    const { text } = render('[Get Started](https://example.com){button} [Learn More](https://example.com/more){button.secondary}');
    expect(text).toContain('Get Started: https://example.com');
    expect(text).toContain('Learn More: https://example.com/more');
  });
});
