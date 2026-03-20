"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { render } from "emailmd";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadDraft, clearDraft } from "@/lib/storage";
import { useAutoSave } from "./use-auto-save";
import { EditorPane } from "./editor-pane";
import { OutputPane } from "./output-pane";

const DEFAULT_MARKDOWN = `---
preheader: "Thanks for signing up."
---

::: header
![Logo](https://imgs.emailmd.dev/logoipsum-336.png){width="200"}
:::

# Welcome!

Thanks for signing up. We're excited to have you on board.

[Get Started](https://example.com){button}

::: callout
**Quick tip:** Email.md turns this markdown into responsive, email-safe HTML that works in every client.
:::

Need help? Reply to this email or visit our [docs](https://example.com/docs).

::: footer
Acme Inc. | 123 Main St | [Unsubscribe](https://example.com/unsub)
:::
`;

export function BuilderShell({
  initialMarkdown,
}: {
  initialMarkdown?: string;
}) {
  const hasTemplate = initialMarkdown != null;
  const [hasEdited, setHasEdited] = useState(false);
  const [markdown, setMarkdown] = useState(
    () => initialMarkdown ?? loadDraft() ?? DEFAULT_MARKDOWN
  );
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [editorOpen, setEditorOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSave = useCallback(() => {
    setLastSaved(Date.now());
  }, []);

  useAutoSave(markdown, {
    enabled: !hasTemplate || hasEdited,
    onSave: handleSave,
  });

  const handleChange = useCallback((value: string) => {
    setHasEdited(true);
    setMarkdown(value);
  }, []);

  const handleReset = useCallback(() => {
    clearDraft();
    setMarkdown(DEFAULT_MARKDOWN);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const result = render(markdown);
        setHtml(result.html);
        setText(result.text);
      } catch {
        // keep previous output on error
      }
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [markdown]);

  return (
    <div className="relative flex flex-1 min-h-0">
      {/* Mobile backdrop */}
      <div
        className={cn(
          "absolute inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          editorOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setEditorOpen(false)}
      />

      {/* Editor panel — slide-over on mobile, static on desktop */}
      <div
        className={cn(
          "flex flex-col bg-background",
          "absolute inset-y-0 left-0 z-50 w-[85%] max-w-md shadow-xl transition-transform duration-300 ease-in-out",
          editorOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:inset-auto md:z-auto md:w-[40%] md:max-w-none md:translate-x-0 md:shadow-none md:transition-none"
        )}
      >
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2 md:hidden">
          <span className="text-sm font-medium">Editor</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditorOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <EditorPane
          value={markdown}
          onChange={handleChange}
          onReset={handleReset}
          lastSaved={lastSaved}
        />
      </div>

      {/* Output panel — always visible, full-width on mobile */}
      <OutputPane html={html} text={text} />

      {/* Mobile floating edit button */}
      {!editorOpen && (
        <Button
          className="absolute bottom-4 right-4 z-30 size-12 rounded-full shadow-lg md:hidden"
          onClick={() => setEditorOpen(true)}
        >
          <Pencil className="size-5" />
        </Button>
      )}
    </div>
  );
}
