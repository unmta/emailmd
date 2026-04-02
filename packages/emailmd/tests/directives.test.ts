import { describe, expect, it } from 'vitest';
import { render } from '../src/index.js';

describe('callout directive', () => {
  it('renders callout with cardColor background', () => {
    const { html } = render('::: callout\nHello from callout\n:::');
    expect(html).toContain('Hello from callout');
    expect(html).toContain('#f4f4f5'); // default cardColor
  });

  it('renders markdown inside callout', () => {
    const { html } = render('::: callout\n**Bold** and [a link](https://example.com)\n:::');
    expect(html).toContain('<strong>Bold</strong>');
    expect(html).toContain('href="https://example.com"');
  });
});

describe('highlight directive', () => {
  it('renders highlight with brandColor background and white text', () => {
    const { html } = render('::: highlight\nLimited time offer\n:::');
    expect(html).toContain('Limited time offer');
    expect(html).toContain('#18181b'); // default brandColor
    // The highlight section should produce white text
    expect(html).toContain('#ffffff');
  });
});

describe('centered directive', () => {
  it('renders centered text with center alignment', () => {
    const { html } = render('::: centered\nCentered content\n:::');
    expect(html).toContain('Centered content');
    expect(html).toContain('text-align:center');
  });

  it('renders custom text color on centered', () => {
    const { html } = render('::: centered color=#00F7A4\nGreen text\n:::');
    expect(html).toContain('Green text');
    expect(html).toContain('#00F7A4');
  });

  it('strips parameterized centered markers in plain text', () => {
    const { text } = render('::: centered color=#00F7A4\nCentered text\n:::');
    expect(text).toContain('Centered text');
    expect(text).not.toContain('EMAILMD');
    expect(text).not.toContain('00F7A4');
  });
});

describe('hero directive', () => {
  it('renders hero with background image', () => {
    const { html } = render('::: hero https://example.com/hero.jpg\n# Welcome\nGet started today!\n:::');
    expect(html).toContain('Welcome');
    expect(html).toContain('Get started today!');
    expect(html).toContain('https://example.com/hero.jpg');
  });

  it('renders centered white text over background', () => {
    const { html } = render('::: hero https://example.com/bg.png\nOverlay text\n:::');
    expect(html).toContain('Overlay text');
    // Default buttonTextColor is #fafafa
    expect(html).toContain('#fafafa');
  });

  it('renders markdown inside hero', () => {
    const { html } = render('::: hero https://example.com/hero.jpg\n**Bold** and [a link](https://example.com)\n:::');
    expect(html).toContain('<strong>Bold</strong>');
    expect(html).toContain('href="https://example.com"');
  });

  it('strips hero markers in plain text output', () => {
    const { text } = render('::: hero https://example.com/hero.jpg\n# Welcome\nGet started today!\n:::');
    expect(text).toContain('WELCOME');
    expect(text).toContain('Get started today!');
    expect(text).not.toContain('EMAILMD');
    expect(text).not.toContain('hero.jpg');
  });

  it('renders custom text color on hero', () => {
    const { html } = render('::: hero https://example.com/hero.jpg?w=1200&h=800 color=#ffffff\n# Welcome\nSome text\n:::');
    expect(html).toContain('#ffffff');
    expect(html).toContain('https://example.com/hero.jpg?w=1200');
    expect(html).toMatch(/h1[^>]*style="color: #ffffff"/);
  });

  it('accepts color param before URL', () => {
    const { html } = render('::: hero color=#20ffff https://example.com/hero.jpg\n# Welcome\n:::');
    expect(html).toContain('https://example.com/hero.jpg');
    expect(html).toMatch(/h1[^>]*style="color: #20ffff"/);
  });
});

describe('callout directive with params', () => {
  it('renders center-aligned callout', () => {
    const { html } = render('::: callout center\nCentered callout\n:::');
    expect(html).toContain('Centered callout');
    expect(html).toContain('text-align:center');
  });

  it('renders right-aligned callout', () => {
    const { html } = render('::: callout right\nRight callout\n:::');
    expect(html).toContain('Right callout');
    expect(html).toContain('text-align:right');
  });

  it('renders compact padding on callout', () => {
    const { html } = render('::: callout compact\nCompact callout\n:::');
    expect(html).toContain('Compact callout');
    expect(html).toContain('12px 16px');
  });

  it('renders spacious padding on callout', () => {
    const { html } = render('::: callout spacious\nSpacious callout\n:::');
    expect(html).toContain('Spacious callout');
    expect(html).toContain('32px 40px');
  });

  it('renders custom bg color on callout', () => {
    const { html } = render('::: callout bg=#eff6ff\nCustom bg\n:::');
    expect(html).toContain('Custom bg');
    expect(html).toContain('#eff6ff');
  });

  it('renders custom text color on callout', () => {
    const { html } = render('::: callout color=#1e40af\nCustom color\n:::');
    expect(html).toContain('Custom color');
    expect(html).toContain('#1e40af');
  });

  it('renders combined params on callout', () => {
    const { html } = render('::: callout center compact color=#1e40af bg=#eff6ff\nAll params\n:::');
    expect(html).toContain('All params');
    expect(html).toContain('text-align:center');
    expect(html).toContain('12px 16px');
    expect(html).toContain('#1e40af');
    expect(html).toContain('#eff6ff');
  });

  it('strips parameterized callout markers in plain text', () => {
    const { text } = render('::: callout center compact bg=#eff6ff\n**Important**\n:::');
    expect(text).toContain('Important');
    expect(text).not.toContain('EMAILMD');
    expect(text).not.toContain('center');
    expect(text).not.toContain('eff6ff');
  });
});

describe('highlight directive with params', () => {
  it('renders center-aligned highlight', () => {
    const { html } = render('::: highlight center\nCentered highlight\n:::');
    expect(html).toContain('Centered highlight');
    expect(html).toContain('text-align:center');
  });

  it('renders custom bg color on highlight', () => {
    const { html } = render('::: highlight bg=#dc2626\nCustom bg\n:::');
    expect(html).toContain('#dc2626');
  });

  it('renders compact padding on highlight', () => {
    const { html } = render('::: highlight compact\nCompact highlight\n:::');
    expect(html).toContain('12px 16px');
  });
});

describe('header directive with params', () => {
  it('defaults to center when no alignment specified', () => {
    const { html } = render('::: header\nHeader content\n:::');
    expect(html).toContain('text-align:center');
  });

  it('renders left-aligned header', () => {
    const { html } = render('::: header left\nLeft header\n:::');
    expect(html).toContain('Left header');
    expect(html).toContain('text-align:left');
  });

  it('renders custom text color on header', () => {
    const { html } = render('::: header color=#1e40af\nColored header\n:::');
    expect(html).toContain('#1e40af');
  });
});

describe('footer directive with params', () => {
  it('defaults to center when no alignment specified', () => {
    const { html } = render('::: footer\nFooter content\n:::');
    expect(html).toContain('text-align:center');
  });

  it('renders left-aligned footer', () => {
    const { html } = render('::: footer left\nLeft footer\n:::');
    expect(html).toContain('Left footer');
    expect(html).toContain('text-align:left');
  });

  it('strips parameterized footer markers in plain text', () => {
    const { text } = render('::: footer left color=#666666\nFooter text\n:::');
    expect(text).toContain('Footer text');
    expect(text).not.toContain('EMAILMD');
  });
});

describe('multiple directives', () => {
  it('renders multiple directives in sequence', () => {
    const md = `::: callout
First block
:::

::: highlight
Second block
:::

::: centered
Third block
:::`;
    const { html } = render(md);
    expect(html).toContain('First block');
    expect(html).toContain('Second block');
    expect(html).toContain('Third block');
  });

  it('renders regular text between directives', () => {
    const md = `# Heading

Some paragraph text.

::: callout
A callout
:::

More text after.`;
    const { html } = render(md);
    expect(html).toContain('<h1>Heading</h1>');
    expect(html).toContain('Some paragraph text.');
    expect(html).toContain('A callout');
    expect(html).toContain('More text after.');
  });
});

describe('buttons inside directives', () => {
  it('renders button inside hero with text', () => {
    const { html } = render('::: hero https://example.com/hero.jpg\n# Welcome\n\n[Sign Up](https://example.com/signup){button}\n:::');
    expect(html).toContain('Welcome');
    expect(html).toContain('Sign Up');
    expect(html).toContain('https://example.com/signup');
  });

  it('renders button inside callout with text and preserves callout styling', () => {
    const { html } = render('::: callout\nCheck out our offer!\n\n[Learn More](https://example.com){button}\n:::');
    const plainButton = render('Check out our offer!\n\n[Learn More](https://example.com){button}');
    expect(html).toContain('Check out our offer!');
    expect(html).toContain('Learn More');
    expect(html).toContain('https://example.com');
    // Callout wrapper should add extra #f4f4f5 occurrences vs plain rendering
    const count = (s: string, sub: string) => s.split(sub).length - 1;
    expect(count(html, '#f4f4f5')).toBeGreaterThan(count(plainButton.html, '#f4f4f5'));
  });

  it('renders button group inside directive', () => {
    const { html } = render('::: callout\n[Accept](https://example.com/yes){button} [Decline](https://example.com/no){button.secondary}\n:::');
    expect(html).toContain('Accept');
    expect(html).toContain('Decline');
  });

  it('renders button-only callout and preserves callout styling', () => {
    const { html } = render('::: callout\n[Click Me](https://example.com){button}\n:::');
    const plainButton = render('[Click Me](https://example.com){button}');
    expect(html).toContain('Click Me');
    expect(html).toContain('https://example.com');
    // Callout wrapper should add extra #f4f4f5 occurrences vs a plain button
    const count = (s: string, sub: string) => s.split(sub).length - 1;
    expect(count(html, '#f4f4f5')).toBeGreaterThan(count(plainButton.html, '#f4f4f5'));
  });

  it('renders button-only hero and preserves hero background', () => {
    const { html } = render('::: hero https://example.com/hero.jpg\n[Get Started](https://example.com/start){button}\n:::');
    expect(html).toContain('https://example.com/hero.jpg');
    expect(html).toContain('Get Started');
    expect(html).toContain('https://example.com/start');
  });

  it('renders button-only highlight and preserves highlight styling', () => {
    const { html } = render('::: highlight\n[Buy Now](https://example.com/buy){button}\n:::');
    const plainButton = render('[Buy Now](https://example.com/buy){button}');
    expect(html).toContain('Buy Now');
    expect(html).toContain('https://example.com/buy');
    // Highlight wrapper should add extra #18181b occurrences (brandColor bg)
    const count = (s: string, sub: string) => s.split(sub).length - 1;
    expect(count(html, '#18181b')).toBeGreaterThan(count(plainButton.html, '#18181b'));
  });

  it('preserves hero styling when button has surrounding text', () => {
    const { html } = render('::: hero https://example.com/hero.jpg\nJoin us today\n\n[Get Started](https://example.com/start){button}\n:::');
    expect(html).toContain('https://example.com/hero.jpg');
    expect(html).toContain('Join us today');
    expect(html).toContain('Get Started');
    expect(html).toContain('https://example.com/start');
  });
});
