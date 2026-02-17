import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_CALLOUT_OPEN, MARKER_CALLOUT_CLOSE } from '../constants.js';

export function registerCallout(md: MarkdownIt): void {
  md.use(container, 'callout', {
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return MARKER_CALLOUT_OPEN + '\n';
      }
      return MARKER_CALLOUT_CLOSE + '\n';
    },
  });
}
