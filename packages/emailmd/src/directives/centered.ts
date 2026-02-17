import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_CENTERED_OPEN, MARKER_CENTERED_CLOSE } from '../constants.js';

export function registerCentered(md: MarkdownIt): void {
  md.use(container, 'centered', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return MARKER_CENTERED_OPEN + '\n';
      }
      return MARKER_CENTERED_CLOSE + '\n';
    },
  });
}
