import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_HEADER_OPEN, MARKER_HEADER_CLOSE } from '../constants.js';
import { parseDirectiveParams, serializeMarkerAttrs } from '../params.js';

export function registerHeader(md: MarkdownIt): void {
  md.use(container, 'header', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const params = parseDirectiveParams(tokens[idx].info.trim(), 'header');
        const attrs = serializeMarkerAttrs(params);
        return MARKER_HEADER_OPEN.slice(0, -3) + attrs + '-->\n';
      }
      return MARKER_HEADER_CLOSE + '\n';
    },
  });
}
