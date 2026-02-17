import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_FOOTER_OPEN, MARKER_FOOTER_CLOSE } from '../constants.js';

export function registerFooter(md: MarkdownIt): void {
  md.use(container, 'footer', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return MARKER_FOOTER_OPEN + '\n';
      }
      return MARKER_FOOTER_CLOSE + '\n';
    },
  });
}
