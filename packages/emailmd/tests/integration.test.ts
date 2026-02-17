import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '../src/index.js';

const fixture = readFileSync(resolve(__dirname, 'fixtures/directives.md'), 'utf-8');

describe('integration: full email with directives and buttons', () => {
  const { html } = render(fixture);

  it('produces a complete HTML document', () => {
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<html');
    expect(html).toContain('<body');
  });

  it('renders the heading', () => {
    expect(html).toContain('<h1>Our Big Announcement</h1>');
  });

  it('renders regular paragraph text', () => {
    expect(html).toContain('been working on something special');
  });

  it('renders the callout content', () => {
    expect(html).toContain('Early access is now available for existing customers.');
  });

  it('renders the highlight content', () => {
    expect(html).toContain('first 100 signups get 50% off');
  });

  it('renders the centered content', () => {
    expect(html).toContain('Thanks for being part of the journey.');
  });

  it('renders the primary button', () => {
    expect(html).toContain('https://example.com');
    expect(html).toContain('Get Early Access');
  });

  it('renders the secondary button', () => {
    expect(html).toContain('https://example.com/pricing');
    expect(html).toContain('View Pricing');
  });

  it('renders the preheader', () => {
    expect(html).toContain('Big news from our team');
  });

  it('contains no MJML tags in output', () => {
    expect(html).not.toMatch(/<mj-/);
  });

  it('contains no sentinel markers in output', () => {
    expect(html).not.toContain('EMAILMD:');
  });
});

const newsletterFixture = readFileSync(resolve(__dirname, 'fixtures/newsletter.md'), 'utf-8');

describe('integration: default wrapper with footer directive', () => {
  const { html } = render(newsletterFixture);

  it('produces a complete HTML document', () => {
    expect(html).toContain('<!doctype html>');
  });

  it('renders the footer directive with markdown bold', () => {
    expect(html).toContain('<strong>Acme Corp</strong>');
  });

  it('renders the footer directive with link', () => {
    expect(html).toContain('https://example.com/unsub');
    expect(html).toContain('Unsubscribe');
  });

  it('renders the preheader', () => {
    expect(html).toContain('Weekly update from Acme');
  });

  it('renders the content', () => {
    expect(html).toContain('This Week at Acme');
    expect(html).toContain('shipping new features');
  });

  it('contains no MJML tags in output', () => {
    expect(html).not.toMatch(/<mj-/);
  });
});

const transactionalFixture = readFileSync(resolve(__dirname, 'fixtures/transactional.md'), 'utf-8');

describe('integration: transactional email', () => {
  const { html } = render(transactionalFixture);

  it('produces a complete HTML document', () => {
    expect(html).toContain('<!doctype html>');
  });

  it('renders content', () => {
    expect(html).toContain('Order Confirmed');
    expect(html).toContain('#12345');
  });

  it('renders the preheader', () => {
    expect(html).toContain('Your order has been confirmed');
  });

  it('renders the button', () => {
    expect(html).toContain('View Order');
    expect(html).toContain('https://example.com/orders/12345');
  });

  it('contains no MJML tags in output', () => {
    expect(html).not.toMatch(/<mj-/);
  });
});
