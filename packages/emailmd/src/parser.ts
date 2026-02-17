import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';
import taskLists from 'markdown-it-task-lists';
import { full as emoji } from 'markdown-it-emoji';
import deflist from 'markdown-it-deflist';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import { registerDirectives } from './directives/index.js';

const md = new MarkdownIt({ html: true, linkify: true });
md.use(attrs);
md.use(taskLists);
md.use(emoji);
md.use(deflist);
md.use(mark);
md.use(sub);
md.use(sup);
registerDirectives(md);

export function parseMarkdown(markdown: string): string {
  let html = md.render(markdown);

  // Replace <input> checkboxes with Unicode characters for email safety
  // (email clients strip <input> elements)
  html = html.replace(
    /<input class="task-list-item-checkbox" checked="" disabled="" type="checkbox">/g,
    '\u2611 ',
  );
  html = html.replace(
    /<input class="task-list-item-checkbox" disabled="" type="checkbox">/g,
    '\u2610 ',
  );

  return html;
}
