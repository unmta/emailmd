import mjml2html from 'mjml';
import type { Theme } from './theme.js';
import type { Segment } from './segmenter.js';

export interface WrapperMeta {
  preheader?: string;
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
      .task-list-item { list-style-type: none; margin-left: -24px; }
      ul ul, ol ol, ul ol, ol ul { margin-top: 4px; margin-bottom: 0; }
      mark { background-color: ${theme.brandColor}33; padding: 2px 4px; border-radius: 2px; }
      dl { margin: 0 0 8px 0; }
      dt { font-weight: 700; margin-top: 8px; }
      dd { margin: 2px 0 0 24px; }
      img { vertical-align: middle; }
    </mj-style>
    ${preheader ? `<mj-preview>${preheader}</mj-preview>` : ''}
  </mj-head>`;
}

function processInlineImages(html: string): string {
  return html.replace(/<img\s[^>]*?\b(?:valign|float)="[^"]*"[^>]*?\/?>/g, (tag) => {
    const styles: string[] = [];

    // Extract and remove valign
    const valignMatch = tag.match(/\bvalign="([^"]*)"/);
    if (valignMatch) {
      styles.push(`vertical-align: ${valignMatch[1]}`);
      tag = tag.replace(/\s*\bvalign="[^"]*"/, '');
    }

    // Extract and remove float
    const floatMatch = tag.match(/\bfloat="([^"]*)"/);
    if (floatMatch) {
      const dir = floatMatch[1];
      styles.push(`float: ${dir}`);
      styles.push(dir === 'right' ? 'margin: 0 0 8px 12px' : 'margin: 0 12px 8px 0');
      tag = tag.replace(/\s*\bfloat="[^"]*"/, '');
    }

    if (styles.length === 0) return tag;

    // Merge into existing style or add new one
    if (/\bstyle="/.test(tag)) {
      return tag.replace(/style="([^"]*)"/, (_: string, existing: string) =>
        `style="${existing}; ${styles.join('; ')}"`,
      );
    }
    return tag.replace(/<img\s/, `<img style="${styles.join('; ')}" `);
  });
}

function renderTextSegment(content: string, theme: Theme): string {
  return `<mj-section background-color="${theme.contentColor}" padding="0 32px">
      <mj-column>
        <mj-text>${processInlineImages(content)}</mj-text>
      </mj-column>
    </mj-section>`;
}

function resolvePadding(value: string | undefined): string {
  if (value === 'compact') return '12px 16px';
  if (value === 'spacious') return '32px 40px';
  return '20px 24px';
}

function renderCalloutSegment(segment: Segment, theme: Theme): string {
  const align = segment.attrs?.align || 'left';
  const bgColor = segment.attrs?.bg || theme.cardColor;
  const textColor = segment.attrs?.color || theme.bodyColor;
  const padding = resolvePadding(segment.attrs?.padding);
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column background-color="${bgColor}" border-radius="8px" padding="${padding}">
        <mj-text align="${align}" font-size="${theme.fontSize}" color="${textColor}" line-height="${theme.lineHeight}">${processInlineImages(segment.content)}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderCenteredSegment(segment: Segment, theme: Theme): string {
  const textColor = segment.attrs?.color || theme.bodyColor;
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column>
        <mj-text align="center" font-size="${theme.fontSize}" color="${textColor}">${processInlineImages(segment.content)}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderHighlightSegment(segment: Segment, theme: Theme): string {
  const align = segment.attrs?.align || 'left';
  const bgColor = segment.attrs?.bg || theme.brandColor;
  const textColor = segment.attrs?.color || theme.buttonTextColor;
  const padding = resolvePadding(segment.attrs?.padding);
  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column background-color="${bgColor}" border-radius="8px" padding="${padding}">
        <mj-text align="${align}" font-size="${theme.fontSize}" color="${textColor}" font-weight="600">${processInlineImages(segment.content)}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderHeaderSegment(segment: Segment, theme: Theme): string {
  const align = segment.attrs?.align || 'center';
  const textColor = segment.attrs?.color || theme.bodyColor;
  return `<mj-section padding="32px 32px 24px 32px">
      <mj-column>
        <mj-text align="${align}" font-size="13px" color="${textColor}" line-height="1.5">${processInlineImages(segment.content)}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderFooterSegment(segment: Segment, theme: Theme): string {
  const align = segment.attrs?.align || 'center';
  const textColor = segment.attrs?.color || theme.bodyColor;
  return `<mj-section padding="24px 32px 32px 32px">
      <mj-column>
        <mj-text align="${align}" font-size="13px" color="${textColor}" line-height="1.5">${processInlineImages(segment.content)}</mj-text>
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

function renderButtonGroupSegment(segment: Segment, theme: Theme): string {
  const columns = segment.buttons!.map(attrs => {
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

    return `<mj-column>
        <mj-button background-color="${bgColor}" color="${textColor}" font-size="16px" font-weight="600" border-radius="8px" inner-padding="14px 32px" padding="10px 0" ${border} href="${attrs.href}">${attrs.text}</mj-button>
      </mj-column>`;
  }).join('\n      ');

  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      ${columns}
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

function renderHeroSegment(segment: Segment, theme: Theme): string {
  const url = segment.attrs?.url || '';
  return `<mj-section background-url="${url}" background-size="cover" background-repeat="no-repeat" padding="40px 32px">
      <mj-column>
        <mj-text align="center" color="${theme.buttonTextColor}">${processInlineImages(segment.content)}</mj-text>
      </mj-column>
    </mj-section>`;
}

function renderTableSegment(segment: Segment, theme: Theme): string {
  let tableHtml = segment.content;

  // Strip wrapper tags — mj-table only accepts <tr> rows directly
  tableHtml = tableHtml
    .replace(/<\/?table>/g, '')
    .replace(/<\/?thead>/g, '')
    .replace(/<\/?tbody>/g, '')
    .trim();

  // Add inline styles to <th> elements, preserving existing text-align
  tableHtml = tableHtml.replace(
    /<th(\s+style="([^"]*)")?>/g,
    (_, _styleAttr, existingStyle) => {
      const base = existingStyle ? `${existingStyle};` : '';
      return `<th style="${base}font-weight:700;border-bottom:2px solid ${theme.cardColor};padding:8px 12px">`;
    },
  );

  // Add inline styles to <td> elements, preserving existing text-align
  tableHtml = tableHtml.replace(
    /<td(\s+style="([^"]*)")?>/g,
    (_, _styleAttr, existingStyle) => {
      const base = existingStyle ? `${existingStyle};` : '';
      return `<td style="${base}border-bottom:1px solid ${theme.cardColor};padding:8px 12px">`;
    },
  );

  return `<mj-section background-color="${theme.contentColor}" padding="8px 32px">
      <mj-column>
        <mj-table color="${theme.bodyColor}" font-family="${theme.fontFamily}" font-size="${theme.fontSize}" line-height="${theme.lineHeight}" cellpadding="0" cellspacing="0" width="100%">${tableHtml}</mj-table>
      </mj-column>
    </mj-section>`;
}

function segmentToMjml(segment: Segment, theme: Theme): string {
  switch (segment.type) {
    case 'text':
      return renderTextSegment(segment.content, theme);
    case 'callout':
      return renderCalloutSegment(segment, theme);
    case 'centered':
      return renderCenteredSegment(segment, theme);
    case 'highlight':
      return renderHighlightSegment(segment, theme);
    case 'header':
      return renderHeaderSegment(segment, theme);
    case 'footer':
      return renderFooterSegment(segment, theme);
    case 'hr':
      return renderHrSegment(theme);
    case 'button':
      return renderButtonSegment(segment, theme);
    case 'button-group':
      return renderButtonGroupSegment(segment, theme);
    case 'image':
      return renderImageSegment(segment, theme);
    case 'table':
      return renderTableSegment(segment, theme);
    case 'hero':
      return renderHeroSegment(segment, theme);
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
