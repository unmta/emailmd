import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { MARKER_HERO_OPEN, MARKER_HERO_OPEN_END, MARKER_HERO_CLOSE } from '../constants.js';

export function registerHero(md: MarkdownIt): void {
  md.use(container, 'hero', {
    validate(params: string) {
      return params.trim().startsWith('hero');
    },
    render(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const info = tokens[idx].info.trim();
        const url = info.slice('hero'.length).trim();
        return MARKER_HERO_OPEN + url + MARKER_HERO_OPEN_END + '\n';
      }
      return MARKER_HERO_CLOSE + '\n';
    },
  });
}
