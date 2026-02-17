import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_HEADER_OPEN, MARKER_HEADER_CLOSE } from '../constants.js';

export function registerHeader(md: MarkdownIt): void {
  md.use(container, 'header', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return MARKER_HEADER_OPEN + '\n';
      }
      return MARKER_HEADER_CLOSE + '\n';
    },
  });
}
