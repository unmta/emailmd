import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_HIGHLIGHT_OPEN, MARKER_HIGHLIGHT_CLOSE } from '../constants.js';
import { parseDirectiveParams, serializeMarkerAttrs } from '../params.js';

export function registerHighlight(md: MarkdownIt): void {
  md.use(container, 'highlight', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const params = parseDirectiveParams(tokens[idx].info.trim(), 'highlight');
        const attrs = serializeMarkerAttrs(params);
        return MARKER_HIGHLIGHT_OPEN.slice(0, -3) + attrs + '-->\n';
      }
      return MARKER_HIGHLIGHT_CLOSE + '\n';
    },
  });
}
