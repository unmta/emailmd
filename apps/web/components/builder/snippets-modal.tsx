"use client";

import { useState } from "react";
import { Code, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SNIPPETS: { label: string; description: string; content: string }[] = [
  {
    label: "Callout",
    description: "Highlighted box — supports center, compact, spacious, color=, bg=",
    content: `::: callout center
**ABC-123**
Your confirmation code.
:::`,
  },
  {
    label: "Highlight",
    description: "Branded banner — supports center, compact, spacious, color=, bg=",
    content: `::: highlight center
**50% OFF** — This weekend only!
:::`,
  },
  {
    label: "Hero",
    description: "Full-width background image with overlay text",
    content: `::: hero https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200
# Welcome aboard
Get started with your new account today.
:::`,
  },
  {
    label: "Header",
    description: "Top section for logo or brand image",
    content: `::: header
![Logo](https://example.com/logo.png){width="150"}
:::`,
  },
  {
    label: "Footer",
    description: "Bottom section for links and legal text",
    content: `::: footer
**Acme Corp** · [Unsubscribe](https://example.com/unsub) · [Preferences](https://example.com/prefs)
:::`,
  },
  {
    label: "Centered",
    description: "Center-aligned text block",
    content: `::: centered
Thanks for reading.
— The Acme Team
:::`,
  },
  {
    label: "Button",
    description: "Primary call-to-action button",
    content: `[Get Started](https://example.com){button}`,
  },
  {
    label: "Secondary Button",
    description: "Outlined secondary button",
    content: `[Learn More](https://example.com){button.secondary}`,
  },
  {
    label: "Side-by-Side Buttons",
    description: "Two buttons in a row",
    content: `[Get Started](https://example.com){button} [Learn More](https://example.com){button.secondary}`,
  },
  {
    label: "Image",
    description: "Responsive image with optional width",
    content: `![Banner](https://example.com/image.jpg){width="400"}`,
  },
  {
    label: "Task List",
    description: "Checklist with checkboxes",
    content: `- [x] Design mockups
- [x] Write API endpoints
- [ ] Deploy to production`,
  },
  {
    label: "Table",
    description: "Data table with column alignment",
    content: `| Plan    | Price  | Features     |
| :------ | :----: | -----------: |
| Free    | $0/mo  | 5 projects   |
| Pro     | $20/mo | Unlimited    |`,
  },
];

export function SnippetsModal() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(SNIPPETS[selected].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Code className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Snippets</DialogTitle>
          <DialogDescription>
            Click a snippet to preview, then copy and paste into your email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 px-4 pb-2 min-h-0">
          <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[50vh] min-w-40 shrink-0">
            {SNIPPETS.map((snippet, i) => (
              <button
                key={snippet.label}
                onClick={() => {
                  setSelected(i);
                  setCopied(false);
                }}
                className={cn(
                  "text-left rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  selected === i
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {snippet.label}
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-2 min-w-0">
            <p className="text-xs text-muted-foreground">
              {SNIPPETS[selected].description}
            </p>
            <div className="relative flex-1">
              <pre className="bg-muted/50 border border-border rounded-lg p-3 text-xs font-mono whitespace-pre-wrap break-words overflow-y-auto max-h-[44vh]">
                {SNIPPETS[selected].content}
              </pre>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopy}
                className="absolute top-2 right-2"
              >
                {copied ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
