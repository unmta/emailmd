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

/**
 * Convert rendered HTML (with directive markers) into a plain text email body.
 * Used for the text/plain MIME part.
 */
export function toPlainText(html: string): string {
  let text = html;

  // Strip directive markers
  text = text.replace(new RegExp(escapeRegExp(MARKER_CALLOUT_OPEN), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_CALLOUT_CLOSE), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_CENTERED_OPEN), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_CENTERED_CLOSE), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_HIGHLIGHT_OPEN), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_HIGHLIGHT_CLOSE), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_FOOTER_OPEN), 'g'), '');
  text = text.replace(new RegExp(escapeRegExp(MARKER_FOOTER_CLOSE), 'g'), '');

  // Convert buttons: <p><a href="url" button="">Text</a></p> → Text: url
  text = text.replace(/<p>\s*<a\s+([^>]*?)>([^<]*)<\/a>\s*<\/p>/g, (_, attrs, label) => {
    if (!/\bbutton\b/.test(attrs)) return `${label}`;
    const hrefMatch = attrs.match(/href="([^"]*)"/);
    const url = hrefMatch ? hrefMatch[1] : '';
    return `${label}: ${url}\n`;
  });

  // Convert headings to UPPERCASE
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (_, content) => {
    return `\n${stripTags(content).toUpperCase()}\n`;
  });

  // Convert images to [Image: alt]
  text = text.replace(/<img\s+[^>]*alt="([^"]*)"[^>]*>/gi, '[Image: $1]');
  text = text.replace(/<img\s+[^>]*>/gi, '');

  // Convert links: <a href="url">text</a> → text (url)
  text = text.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, (_, url, label) => {
    if (label.trim() === url.trim()) return url;
    return `${label} (${url})`;
  });

  // Convert ordered lists first (numbered), then remaining <li> as unordered
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let i = 0;
    return content.replace(/<li>(.*?)<\/li>/gi, (_: string, item: string) => {
      i++;
      return `${i}. ${stripTags(item).trim()}\n`;
    });
  });

  // Convert remaining list items (unordered)
  text = text.replace(/<li>(.*?)<\/li>/gi, (_, content) => `- ${stripTags(content).trim()}\n`);

  // Convert <br> and <hr>
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<hr\s*\/?>/gi, '\n---\n');

  // Convert blockquotes
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const lines = stripTags(content).trim().split('\n');
    return lines.map((l: string) => `> ${l.trim()}`).join('\n') + '\n';
  });

  // Convert code blocks: <pre><code>...</code></pre> → indented content
  text = text.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, content) => {
    const lines = content.split('\n');
    if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    return '\n' + lines.map((l: string) => `    ${l}`).join('\n') + '\n';
  });

  // Convert inline code: <code>text</code> → `text`
  text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, (_, content) => {
    return '`' + content + '`';
  });

  // Convert paragraphs to double newlines
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Strip all remaining HTML tags
  text = stripTags(text);

  // Decode common HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');

  // Clean up whitespace: collapse multiple blank lines, trim
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
