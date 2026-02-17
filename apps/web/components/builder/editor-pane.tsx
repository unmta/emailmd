"use client";

import { CopyButton } from "./copy-button";
import { ThemeModal } from "./theme-modal";
import { SnippetsModal } from "./snippets-modal";
import { IconsModal } from "./icons-modal";

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  return (
    <div className="flex flex-1 flex-col border-r border-border">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Markdown
        </span>
        <div className="flex items-center gap-1">
          <SnippetsModal />
          <IconsModal />
          <ThemeModal markdown={value} onChange={onChange} />
          <CopyButton text={value} label="Markdown" />
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}
