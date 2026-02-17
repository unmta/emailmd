import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_FOOTER_OPEN, MARKER_FOOTER_CLOSE } from '../constants.js';
import { parseDirectiveParams, serializeMarkerAttrs } from '../params.js';

export function registerFooter(md: MarkdownIt): void {
  md.use(container, 'footer', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const params = parseDirectiveParams(tokens[idx].info.trim(), 'footer');
        const attrs = serializeMarkerAttrs(params);
        return MARKER_FOOTER_OPEN.slice(0, -3) + attrs + '-->\n';
      }
      return MARKER_FOOTER_CLOSE + '\n';
    },
  });
}
