# email.md

Markdown to email-safe HTML. Write in markdown, send emails that work everywhere.

```
markdown → emailmd → Gmail, Outlook, Apple Mail, Yahoo, everything
```

## Install

```bash
npm install emailmd
```

## Quick Start

```typescript
import { render } from 'emailmd';

const { html, text } = render(`
# Welcome!

Thanks for signing up.

[Get Started](https://example.com){button}
`);

// html → complete email-safe HTML (works in Gmail, Outlook, Apple Mail, everything)
// text → plain text version for text/plain MIME part
```

## Theme

Customize colors and fonts to match your brand:

```typescript
const { html } = render(markdown, {
  theme: {
    brandColor: '#e11d48',
    buttonColor: '#e11d48',
    fontFamily: 'Georgia, serif',
  }
});
```

All theme options:

| Key | Default | Description |
|-----|---------|-------------|
| `brandColor` | `#5B4FE9` | Links, highlights |
| `headingColor` | `#111827` | Heading text |
| `bodyColor` | `#374151` | Body text |
| `backgroundColor` | `#f4f4f5` | Outer background |
| `contentColor` | `#ffffff` | Content area background |
| `cardColor` | `#f3f4f6` | Callout background |
| `buttonColor` | `#5B4FE9` | Primary button |
| `buttonTextColor` | `#ffffff` | Button text |
| `fontFamily` | Helvetica Neue, ... | Font stack |
| `fontSize` | `16px` | Base font size |
| `lineHeight` | `1.6` | Base line height |
| `contentWidth` | `600px` | Email width |

## Frontmatter

Override theme values and set metadata per-email using YAML frontmatter:

```markdown
---
preheader: "Don't miss our biggest sale"
logo: https://example.com/logo.png
brand_color: "#e11d48"
button_color: "#059669"
---

# Sale Starts Now

Everything is 50% off this weekend.

::: footer
**Acme Corp** · [Unsubscribe](https://example.com/unsub)
:::
```

## Directives

### Callout

```markdown
::: callout
**Pro tip:** You can customize your dashboard in Settings.
:::
```

### Highlight

```markdown
::: highlight
Limited time: first 100 signups get 50% off.
:::
```

### Centered

```markdown
::: centered
Thanks for reading.
The Acme Team
:::
```

### Footer

```markdown
::: footer
**Acme Corp** · [Unsubscribe](https://example.com/unsub) · [Preferences](https://example.com/prefs)
:::
```

## Buttons

```markdown
[Get Started](https://example.com){button}

[Learn More](https://example.com){button.secondary}

[Shop Sale](https://example.com){button color="#dc2626"}
```

## Images

Block images (standalone paragraph) are automatically rendered as responsive, centered email images:

```markdown
![Hero banner](https://example.com/hero.jpg)
```

### Width

Control image width with the attrs syntax:

```markdown
![Product](https://example.com/product.jpg){width="400"}
```

### Alignment

Images are centered by default. Override with:

```markdown
![Photo](https://example.com/photo.jpg){align="left"}
```

### Rounded corners

```markdown
![Avatar](https://example.com/avatar.jpg){width="80" border-radius="50%"}
```

### Linked images

Wrap an image in a link to make it clickable:

```markdown
[![Shop banner](https://example.com/banner.jpg)](https://example.com/shop)
```

### Inline images

Images mixed with text in a paragraph are rendered inline:

```markdown
Feature one with icon ![check](https://example.com/check.png) included.
```

## Wrappers

Control the email's outer structure:

```typescript
// Default — gray background, supports logo
render(md);

// Plain — white background, no logo
render(md, { wrapper: 'plain' });

// Naked — minimal, no background
render(md, { wrapper: 'naked' });
```

Custom wrappers:

```typescript
import { render, buildHead, segmentsToMjml } from 'emailmd';
import type { WrapperFn } from 'emailmd';

const myWrapper: WrapperFn = (segments, theme, meta) => {
  const head = buildHead(theme, meta?.preheader);
  const body = segmentsToMjml(segments, theme);
  return `<mjml>${head}<mj-body>${body}</mj-body></mjml>`;
};

render(md, { wrapper: myWrapper });
```

## API Reference

### `render(markdown, options?)`

Renders markdown to email-safe HTML.

**Returns** `{ html, text, meta }`

- `html` — complete HTML email document
- `text` — plain text version for the `text/plain` MIME part
- `meta` — extracted frontmatter metadata

### `RenderOptions`

```typescript
{
  theme?: Partial<Theme>;
  wrapper?: 'default' | 'plain' | 'naked' | WrapperFn;
}
```

### `RenderResult`

```typescript
{
  html: string;
  text: string;
  meta: { preheader?: string; logo?: string; [key: string]: unknown };
}
```

## Playground

Spin up a local playground to write markdown and preview the rendered email in real time:

```bash
npm run playground
```

Opens a browser UI at `http://localhost:3000` with a split-pane editor — markdown on the left, live preview on the right. You can switch wrappers and load any of the bundled examples from the dropdowns.

## Built on MJML

email.md uses [MJML](https://mjml.io) under the hood for bulletproof email HTML.
Tested across Gmail, Outlook, Apple Mail, Yahoo Mail, and more.

## License

MIT
