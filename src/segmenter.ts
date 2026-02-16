import {
  MARKER_CALLOUT_OPEN,
  MARKER_CALLOUT_CLOSE,
  MARKER_CENTERED_OPEN,
  MARKER_CENTERED_CLOSE,
  MARKER_HIGHLIGHT_OPEN,
  MARKER_HIGHLIGHT_CLOSE,
  MARKER_FOOTER_OPEN,
  MARKER_FOOTER_CLOSE,
} from './constants.js';

export type SegmentType = 'text' | 'callout' | 'centered' | 'highlight' | 'footer' | 'button' | 'image' | 'hr';

export interface Segment {
  type: SegmentType;
  content: string;
  attrs?: Record<string, string>;
}

const DIRECTIVE_PAIRS: Array<{ open: string; close: string; type: SegmentType }> = [
  { open: MARKER_CALLOUT_OPEN, close: MARKER_CALLOUT_CLOSE, type: 'callout' },
  { open: MARKER_CENTERED_OPEN, close: MARKER_CENTERED_CLOSE, type: 'centered' },
  { open: MARKER_HIGHLIGHT_OPEN, close: MARKER_HIGHLIGHT_CLOSE, type: 'highlight' },
  { open: MARKER_FOOTER_OPEN, close: MARKER_FOOTER_CLOSE, type: 'footer' },
];

// Matches <p><a ...>text</a></p> where the <a> has a button or button.secondary attribute
// markdown-it-attrs produces: button="" for {button}, button.secondary="" for {button.secondary}
const BUTTON_LINK_RE = /<p>\s*<a\s+([^>]*)>([^<]*)<\/a>\s*<\/p>/g;

function parseButtonAttrs(attrString: string): { isButton: boolean; href: string; variant?: string; color?: string } {
  const result = { isButton: false, href: '', variant: undefined as string | undefined, color: undefined as string | undefined };

  // Check for button attribute (button="" or button.secondary="")
  if (/\bbutton\.secondary\b/.test(attrString)) {
    result.isButton = true;
    result.variant = 'secondary';
  } else if (/\bbutton\b/.test(attrString)) {
    result.isButton = true;
  }

  if (!result.isButton) return result;

  // Extract href
  const hrefMatch = attrString.match(/href="([^"]*)"/);
  if (hrefMatch) result.href = hrefMatch[1];

  // Extract color attribute (from {button color="#dc2626"})
  const colorMatch = attrString.match(/\bcolor="([^"]*)"/);
  if (colorMatch) result.color = colorMatch[1];

  return result;
}

function extractButtons(html: string): { html: string; buttons: Segment[] } {
  const buttons: Segment[] = [];
  const result = html.replace(BUTTON_LINK_RE, (match, attrString, text) => {
    const parsed = parseButtonAttrs(attrString);
    if (!parsed.isButton) return match; // Not a button, leave as-is

    const attrs: Record<string, string> = { href: parsed.href, text };
    if (parsed.variant) attrs.variant = parsed.variant;
    if (parsed.color) attrs.color = parsed.color;

    const placeholder = `<!--EMAILMD:BUTTON_${buttons.length}-->`;
    buttons.push({ type: 'button', content: text, attrs });
    return placeholder;
  });
  return { html: result, buttons };
}

// Matches block-level images: <p><img ...></p> or <p><a ...><img ...></a></p>
// Group 1: <a> attributes (optional, for linked images)
// Group 2: <img> attributes
const BLOCK_IMAGE_RE = /<p>\s*(?:<a\s+([^>]*)>\s*)?<img\s+([^>]*)\/?\s*>\s*(?:<\/a>\s*)?<\/p>/g;

function parseHtmlAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([\w-]+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function parseImageAttrs(imgAttrString: string, linkAttrString?: string): Record<string, string> | null {
  const imgAttrs = parseHtmlAttrs(imgAttrString);

  if (!imgAttrs.src) return null;

  const attrs: Record<string, string> = { src: imgAttrs.src };

  if (imgAttrs.alt) attrs.alt = imgAttrs.alt;
  if (imgAttrs.title) attrs.title = imgAttrs.title;
  if (imgAttrs.width) attrs.width = imgAttrs.width;
  if (imgAttrs.align) attrs.align = imgAttrs.align;
  if (imgAttrs['border-radius']) attrs['border-radius'] = imgAttrs['border-radius'];

  // For linked images, extract href from the <a> tag
  if (linkAttrString) {
    const linkAttrs = parseHtmlAttrs(linkAttrString);
    if (linkAttrs.href) attrs.href = linkAttrs.href;
    // Pull image-relevant attrs from <a> if not already on <img>
    if (linkAttrs.width && !imgAttrs.width) attrs.width = linkAttrs.width;
    if (linkAttrs.align && !imgAttrs.align) attrs.align = linkAttrs.align;
    if (linkAttrs['border-radius'] && !imgAttrs['border-radius']) attrs['border-radius'] = linkAttrs['border-radius'];
  }

  return attrs;
}

function splitOnImages(segments: Segment[]): Segment[] {
  const result: Segment[] = [];

  for (const seg of segments) {
    if (seg.type !== 'text') {
      result.push(seg);
      continue;
    }

    let text = seg.content;
    const re = new RegExp(BLOCK_IMAGE_RE.source, 'g');
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = re.exec(text)) !== null) {
      const attrs = parseImageAttrs(match[2], match[1]);
      if (!attrs) continue;

      const before = text.slice(lastIndex, match.index);
      if (before.trim()) {
        result.push({ type: 'text', content: before });
      }
      result.push({ type: 'image', content: attrs.alt || '', attrs });
      lastIndex = match.index + match[0].length;
    }

    const remaining = text.slice(lastIndex);
    if (remaining.trim()) {
      result.push({ type: 'text', content: remaining });
    }
  }

  return result;
}

function splitOnDirectives(html: string): Segment[] {
  const segments: Segment[] = [];
  let remaining = html;

  while (remaining.length > 0) {
    let earliest: { pos: number; type: SegmentType; open: string; close: string } | null = null;
    for (const pair of DIRECTIVE_PAIRS) {
      const pos = remaining.indexOf(pair.open);
      if (pos !== -1 && (earliest === null || pos < earliest.pos)) {
        earliest = { pos, ...pair };
      }
    }

    if (!earliest) {
      if (remaining.trim()) {
        segments.push({ type: 'text', content: remaining });
      }
      break;
    }

    const before = remaining.slice(0, earliest.pos);
    if (before.trim()) {
      segments.push({ type: 'text', content: before });
    }

    const afterOpen = remaining.slice(earliest.pos + earliest.open.length);
    const closePos = afterOpen.indexOf(earliest.close);
    if (closePos === -1) {
      segments.push({ type: 'text', content: remaining.slice(earliest.pos) });
      break;
    }

    const innerContent = afterOpen.slice(0, closePos);
    segments.push({ type: earliest.type, content: innerContent });

    remaining = afterOpen.slice(closePos + earliest.close.length);
  }

  return segments;
}

function splitOnButtonPlaceholders(segments: Segment[], buttons: Segment[]): Segment[] {
  const result: Segment[] = [];
  const placeholderRe = /<!--EMAILMD:BUTTON_(\d+)-->/;

  for (const seg of segments) {
    if (seg.type !== 'text') {
      result.push(seg);
      continue;
    }

    let text = seg.content;
    let match: RegExpExecArray | null;
    while ((match = placeholderRe.exec(text)) !== null) {
      const before = text.slice(0, match.index);
      if (before.trim()) {
        result.push({ type: 'text', content: before });
      }
      const btn = buttons[parseInt(match[1], 10)];
      if (btn) result.push(btn);
      text = text.slice(match.index + match[0].length);
    }
    if (text.trim()) {
      result.push({ type: 'text', content: text });
    }
  }

  return result;
}

const HR_RE = /<hr\s*\/?>/i;

function splitOnHr(segments: Segment[]): Segment[] {
  const result: Segment[] = [];
  for (const seg of segments) {
    if (seg.type !== 'text') {
      result.push(seg);
      continue;
    }
    let text = seg.content;
    let match: RegExpExecArray | null;
    while ((match = HR_RE.exec(text)) !== null) {
      const before = text.slice(0, match.index);
      if (before.trim()) {
        result.push({ type: 'text', content: before });
      }
      result.push({ type: 'hr', content: '' });
      text = text.slice(match.index + match[0].length);
    }
    if (text.trim()) {
      result.push({ type: 'text', content: text });
    }
  }
  return result;
}

export function segment(html: string): Segment[] {
  const { html: htmlWithPlaceholders, buttons } = extractButtons(html);
  const segments = splitOnDirectives(htmlWithPlaceholders);
  const withButtons = splitOnButtonPlaceholders(segments, buttons);
  const withImages = splitOnImages(withButtons);
  return splitOnHr(withImages);
}
