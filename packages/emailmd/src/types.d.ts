declare module 'markdown-it-attrs' {
  import type MarkdownIt from 'markdown-it';
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}

declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it';
  interface TaskListsOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }
  const plugin: MarkdownIt.PluginWithOptions<TaskListsOptions>;
  export default plugin;
}

declare module 'markdown-it-emoji' {
  import type MarkdownIt from 'markdown-it';
  export const full: MarkdownIt.PluginSimple;
  export const light: MarkdownIt.PluginSimple;
  export const bare: MarkdownIt.PluginSimple;
}

declare module 'markdown-it-deflist' {
  import type MarkdownIt from 'markdown-it';
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}

declare module 'markdown-it-mark' {
  import type MarkdownIt from 'markdown-it';
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}

declare module 'markdown-it-sub' {
  import type MarkdownIt from 'markdown-it';
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}

declare module 'markdown-it-sup' {
  import type MarkdownIt from 'markdown-it';
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}

declare module 'mjml' {
  interface MjmlError {
    line: number;
    message: string;
    tagName: string;
    formattedMessage: string;
  }
  interface MjmlResult {
    html: string;
    errors: MjmlError[];
  }
  export default function mjml2html(input: string): MjmlResult;
}
