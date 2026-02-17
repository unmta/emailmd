import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_CALLOUT_OPEN, MARKER_CALLOUT_CLOSE } from '../constants.js';
import { parseDirectiveParams, serializeMarkerAttrs } from '../params.js';

export function registerCallout(md: MarkdownIt): void {
  md.use(container, 'callout', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const params = parseDirectiveParams(tokens[idx].info.trim(), 'callout');
        const attrs = serializeMarkerAttrs(params);
        return MARKER_CALLOUT_OPEN.slice(0, -3) + attrs + '-->\n';
      }
      return MARKER_CALLOUT_CLOSE + '\n';
    },
  });
}
