import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_HIGHLIGHT_OPEN, MARKER_HIGHLIGHT_CLOSE } from '../constants.js';

export function registerHighlight(md: MarkdownIt): void {
  md.use(container, 'highlight', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return MARKER_HIGHLIGHT_OPEN + '\n';
      }
      return MARKER_HIGHLIGHT_CLOSE + '\n';
    },
  });
}
