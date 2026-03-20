"use client";

import { useRef, useEffect } from "react";
import { EditorToolbar } from "./editor-toolbar";

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  lastSaved?: number | null;
}

export function EditorPane({ value, onChange, onReset, lastSaved }: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(
    null
  );

  useEffect(() => {
    if (pendingSelectionRef.current && textareaRef.current) {
      const { start, end } = pendingSelectionRef.current;
      textareaRef.current.setSelectionRange(start, end);
      textareaRef.current.focus();
      pendingSelectionRef.current = null;
    }
  }, [value]);

  return (
    <div className="flex flex-1 flex-col border-r border-border">
      <div className="px-2 py-1.5 border-b border-border bg-muted/30">
        <EditorToolbar
          textareaRef={textareaRef}
          value={value}
          onChange={onChange}
          pendingSelectionRef={pendingSelectionRef}
          onReset={onReset}
          lastSaved={lastSaved}
        />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}
