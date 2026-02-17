import type MarkdownIt from 'markdown-it';
import { registerCallout } from './callout.js';
import { registerCentered } from './centered.js';
import { registerHighlight } from './highlight.js';
import { registerHeader } from './header.js';
import { registerFooter } from './footer.js';
import { registerHero } from './hero.js';

export function registerDirectives(md: MarkdownIt): void {
  registerCallout(md);
  registerCentered(md);
  registerHighlight(md);
  registerHeader(md);
  registerFooter(md);
  registerHero(md);
}
