import mjml2html from 'mjml';
import type { Theme } from './theme.js';
import type { Segment } from './segmenter.js';

export interface WrapperMeta {
  preheader?: string;
  logo?: string;
}

export type WrapperFn = (segments: Segment[], theme: Theme, meta?: WrapperMeta) => string;

export function buildHead(theme: Theme, preheader?: string): string {
  return `<mj-head>
    <mj-attributes>
      <mj-all font-family="${theme.fontFamily}" />
      <mj-text font-size="${theme.fontSize}" line-height="${theme.lineHeight}" color="${theme.bodyColor}" />
    </mj-attributes>
    <mj-style>
      h1 { font-size: 32px; font-weight: 700; color: ${theme.headingColor}; margin: 0 0 12px 0; }
      h2 { font-size: 24px; font-weight: 700; color: ${theme.headingColor}; margin: 0 0 10px 0; }
      h3 { font-size: 20px; font-weight: 600; color: ${theme.headingColor}; margin: 0 0 8px 0; }
      a { color: ${theme.brandColor}; }
      blockquote { border-left: 3px solid ${theme.brandColor}; padding-left: 16px; margin: 0; }
      blockquote blockquote { border-left-color: ${theme.cardColor}; }
      code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; background-color: ${theme.cardColor}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      pre { background-color: ${theme.cardColor}; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 0; }
      pre code { background-color: transparent; padding: 0; border-radius: 0; font-size: inherit; }
      ul, ol { margin: 0 0 8px 0; padding-left: 24px; }
      li { margin-bottom: 4px; }
      ul ul, ol ol, ul ol, ol ul { margin-top: 4px; margin-bottom: 0; }
    </mj-style>
    ${preheader ? `<mj-preview>${preheader}</mj-preview>` : ''}
  </mj-head>`;
}

function renderTextSegment(content: string, theme: Theme): string {
  return `<mj-section background-color="${theme.contentColor}" padding="0 32px">
      <mj-column>
        <mj-text>${content}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderCalloutSegment(content: string, theme: Theme): string {
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column background-color="${theme.cardColor}" border-radius="8px" padding="20px 24px">
        <mj-text font-size="${theme.fontSize}" color="${theme.bodyColor}" line-height="${theme.lineHeight}">${content}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderCenteredSegment(content: string, theme: Theme): string {
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column>
        <mj-text align="center" font-size="${theme.fontSize}" color="${theme.bodyColor}">${content}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderHighlightSegment(content: string, theme: Theme): string {
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column background-color="${theme.brandColor}" border-radius="8px" padding="20px 24px">
        <mj-text font-size="${theme.fontSize}" color="#ffffff" font-weight="600">${content}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderFooterSegment(content: string): string {
  return `<mj-section padding="24px 32px 32px 32px">
      <mj-column>
        <mj-text align="center" font-size="13px" color="#9ca3af" line-height="1.5">${content}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderHrSegment(theme: Theme): string {
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column>
        <mj-divider border-color="${theme.cardColor}" border-width="1px" />
      </mj-column>
    </mj-section>`;
}

function renderButtonSegment(segment: Segment, theme: Theme): string {
  const attrs = segment.attrs!;
  const isSecondary = attrs.variant === 'secondary';
  const customColor = attrs.color;

  let bgColor: string;
  let textColor: string;
  let border = '';

  if (customColor) {
    bgColor = customColor;
    textColor = '#ffffff';
  } else if (isSecondary) {
    bgColor = 'transparent';
    textColor = theme.buttonColor;
    border = `border="2px solid ${theme.buttonColor}"`;
  } else {
    bgColor = theme.buttonColor;
    textColor = theme.buttonTextColor;
  }

  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column>
        <mj-button background-color="${bgColor}" color="${textColor}" font-size="16px" font-weight="600" border-radius="8px" inner-padding="14px 32px" ${border} href="${attrs.href}">${attrs.text}</mj-button>
      </mj-column>
    </mj-section>`;
}

function renderImageSegment(segment: Segment, theme: Theme): string {
  const attrs = segment.attrs!;

  const mjAttrs: string[] = [
    `src="${attrs.src}"`,
    `fluid-on-mobile="true"`,
    `align="${attrs.align || 'center'}"`,
  ];

  if (attrs.alt) mjAttrs.push(`alt="${attrs.alt}"`);
  if (attrs.title) mjAttrs.push(`title="${attrs.title}"`);
  if (attrs.width) {
    const width = /^\d+$/.test(attrs.width) ? `${attrs.width}px` : attrs.width;
    mjAttrs.push(`width="${width}"`);
  }
  if (attrs.href) mjAttrs.push(`href="${attrs.href}"`);
  if (attrs['border-radius']) mjAttrs.push(`border-radius="${attrs['border-radius']}"`);

  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column>
        <mj-image ${mjAttrs.join(' ')} />
      </mj-column>
    </mj-section>`;
}

function segmentToMjml(segment: Segment, theme: Theme): string {
  switch (segment.type) {
    case 'text':
      return renderTextSegment(segment.content, theme);
    case 'callout':
      return renderCalloutSegment(segment.content, theme);
    case 'centered':
      return renderCenteredSegment(segment.content, theme);
    case 'highlight':
      return renderHighlightSegment(segment.content, theme);
    case 'footer':
      return renderFooterSegment(segment.content);
    case 'hr':
      return renderHrSegment(theme);
    case 'button':
      return renderButtonSegment(segment, theme);
    case 'image':
      return renderImageSegment(segment, theme);
  }
}

export function segmentsToMjml(segments: Segment[], theme: Theme): string {
  return segments.map((s) => segmentToMjml(s, theme)).join('\n    ');
}

export function renderMjml(segments: Segment[], theme: Theme, meta: WrapperMeta, wrapper: WrapperFn): string {
  const mjmlDoc = wrapper(segments, theme, meta);
  const { html, errors } = mjml2html(mjmlDoc);
  if (errors.length > 0) {
    console.warn('MJML compilation warnings:', errors);
  }
  return html;
}
