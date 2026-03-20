"use client";

import { useState, useEffect } from "react";
import type { RefObject, MutableRefObject, ReactNode } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  SquareCode,
  Table,
  Link,
  Image,
  MousePointerClick,
  LayoutPanelTop,
  ChevronDown,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconsModal } from "./icons-modal";
import { ThemeModal } from "./theme-modal";
import { CopyButton } from "./copy-button";
import {
  wrapSelection,
  insertBlock,
  prefixLines,
  insertAtCursor,
} from "./toolbar-utils";

type PendingSelection = MutableRefObject<{
  start: number;
  end: number;
} | null>;

interface EditorToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  pendingSelectionRef: PendingSelection;
  onReset?: () => void;
  lastSaved?: number | null;
}

function ToolbarButton({
  tooltip,
  icon,
  onClick,
}: {
  tooltip: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-xs" onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarDropdown({
  tooltip,
  icon,
  children,
}: {
  tooltip: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="xs" className="gap-0 px-1">
              {icon}
              <ChevronDown className="size-2.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="min-w-40">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EditorToolbar({
  textareaRef,
  value,
  onChange,
  pendingSelectionRef,
  onReset,
  lastSaved,
}: EditorToolbarProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (lastSaved == null) return;
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [lastSaved]);

  const wrap = (prefix: string, suffix: string, placeholder: string) => {
    if (!textareaRef.current) return;
    wrapSelection(
      textareaRef.current,
      value,
      onChange,
      pendingSelectionRef,
      prefix,
      suffix,
      placeholder
    );
  };

  const block = (text: string, selectText?: string) => {
    if (!textareaRef.current) return;
    insertBlock(
      textareaRef.current,
      value,
      onChange,
      pendingSelectionRef,
      text,
      selectText
    );
  };

  const prefix = (pfx: string, placeholder: string) => {
    if (!textareaRef.current) return;
    prefixLines(
      textareaRef.current,
      value,
      onChange,
      pendingSelectionRef,
      pfx,
      placeholder
    );
  };

  const handleInsertAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    insertAtCursor(textareaRef.current, value, onChange, pendingSelectionRef, text);
  };

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div className="flex flex-col gap-0.5">
        {/* Row 1: Inline Formatting + Structure */}
        <div className="flex items-center gap-0.5 flex-wrap">
          <ToolbarButton
            tooltip="Bold"
            icon={<Bold />}
            onClick={() => wrap("**", "**", "bold text")}
          />
          <ToolbarButton
            tooltip="Italic"
            icon={<Italic />}
            onClick={() => wrap("*", "*", "italic text")}
          />
          <ToolbarButton
            tooltip="Underline"
            icon={<Underline />}
            onClick={() => wrap("<u>", "</u>", "text")}
          />
          <ToolbarButton
            tooltip="Strikethrough"
            icon={<Strikethrough />}
            onClick={() => wrap("<s>", "</s>", "text")}
          />
          <ToolbarButton
            tooltip="Highlight"
            icon={<Highlighter />}
            onClick={() => wrap("==", "==", "highlighted text")}
          />

          <Separator orientation="vertical" className="mx-0.5 h-4!" />

          <ToolbarDropdown tooltip="Heading" icon={<Heading />}>
            <DropdownMenuItem onClick={() => block("# Heading", "Heading")}>
              <Heading1 />
              <span className="text-base font-bold">Heading 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => block("## Heading", "Heading")}>
              <Heading2 />
              <span className="text-sm font-bold">Heading 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => block("### Heading", "Heading")}>
              <Heading3 />
              <span className="text-sm font-semibold">Heading 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => block("#### Heading", "Heading")}>
              <Heading4 />
              <span className="text-xs font-semibold">Heading 4</span>
            </DropdownMenuItem>
          </ToolbarDropdown>

          <ToolbarDropdown tooltip="List" icon={<List />}>
            <DropdownMenuItem
              onClick={() => block("- Item 1\n- Item 2\n- Item 3", "Item 1")}
            >
              <List />
              Unordered List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block("1. Item 1\n2. Item 2\n3. Item 3", "Item 1")
              }
            >
              <ListOrdered />
              Ordered List
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "- [ ] Task 1\n- [ ] Task 2\n- [x] Task 3",
                  "Task 1"
                )
              }
            >
              <ListChecks />
              Task List
            </DropdownMenuItem>
          </ToolbarDropdown>

          <ToolbarButton
            tooltip="Blockquote"
            icon={<Quote />}
            onClick={() => prefix("> ", "blockquote")}
          />
          <ToolbarButton
            tooltip="Horizontal Rule"
            icon={<Minus />}
            onClick={() => block("---")}
          />
          <ToolbarButton
            tooltip="Code Block"
            icon={<SquareCode />}
            onClick={() => wrap("```\n", "\n```", "code")}
          />
          <ToolbarButton
            tooltip="Table"
            icon={<Table />}
            onClick={() =>
              block(
                "| Column 1 | Column 2 | Column 3 |\n| :------- | :------: | -------: |\n| Cell     | Cell     | Cell     |",
                "Column 1"
              )
            }
          />
        </div>

        {/* Row 2: Links, Media, Directives + Utilities */}
        <div className="flex items-center gap-0.5 flex-wrap">
          <ToolbarButton
            tooltip="Link"
            icon={<Link />}
            onClick={() => {
              if (!textareaRef.current) return;
              const ta = textareaRef.current;
              const start = ta.selectionStart;
              const end = ta.selectionEnd;
              const sel = value.slice(start, end);
              if (sel) {
                const replacement = `[${sel}](url)`;
                const newValue = value.slice(0, start) + replacement + value.slice(end);
                const urlStart = start + 1 + sel.length + 2;
                pendingSelectionRef.current = { start: urlStart, end: urlStart + 3 };
                onChange(newValue);
              } else {
                wrap("[", "](url)", "link text");
              }
            }}
          />
          <ToolbarButton
            tooltip="Image"
            icon={<Image />}
            onClick={() => {
              if (!textareaRef.current) return;
              const ta = textareaRef.current;
              const start = ta.selectionStart;
              const end = ta.selectionEnd;
              const sel = value.slice(start, end);
              if (sel) {
                const replacement = `![${sel}](url)`;
                const newValue = value.slice(0, start) + replacement + value.slice(end);
                const urlStart = start + 2 + sel.length + 2;
                pendingSelectionRef.current = { start: urlStart, end: urlStart + 3 };
                onChange(newValue);
              } else {
                wrap("![", "](url)", "alt text");
              }
            }}
          />

          <ToolbarDropdown tooltip="Button" icon={<MousePointerClick />}>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "[Button Text](https://example.com){button}",
                  "Button Text"
                )
              }
            >
              Primary Button
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "[Button Text](https://example.com){button.secondary}",
                  "Button Text"
                )
              }
            >
              Secondary Button
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "[Primary](https://example.com){button} [Secondary](https://example.com){button.secondary}",
                  "Primary"
                )
              }
            >
              Side-by-Side Buttons
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "[Button Text](https://example.com){button.success}",
                  "Button Text"
                )
              }
            >
              Success Button
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "[Button Text](https://example.com){button.danger}",
                  "Button Text"
                )
              }
            >
              Danger Button
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "[Button Text](https://example.com){button.warning}",
                  "Button Text"
                )
              }
            >
              Warning Button
            </DropdownMenuItem>
          </ToolbarDropdown>

          <Separator orientation="vertical" className="mx-0.5 h-4!" />

          <ToolbarDropdown tooltip="Sections" icon={<LayoutPanelTop />}>
            <DropdownMenuLabel>Sections</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                block(
                  `::: header\n![Logo](https://example.com/logo.png){width="150"}\n:::`,
                  "Logo"
                )
              }
            >
              Header
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  `::: footer\n**Company** · [Unsubscribe](https://example.com/unsub)\n:::`,
                  "Company"
                )
              }
            >
              Footer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  `::: hero https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200\n# Hero Title\nSubtitle text.\n:::`,
                  "Hero Title"
                )
              }
            >
              Hero
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Content Blocks</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "::: callout\nYour callout text here.\n:::",
                  "Your callout text here."
                )
              }
            >
              Callout
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "::: highlight center\nYour highlight text here.\n:::",
                  "Your highlight text here."
                )
              }
            >
              Highlight
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                block(
                  "::: centered\nCentered text here.\n:::",
                  "Centered text here."
                )
              }
            >
              Centered
            </DropdownMenuItem>
          </ToolbarDropdown>

          <Separator orientation="vertical" className="mx-0.5 h-4!" />

          {/* Utilities */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <IconsModal onInsert={handleInsertAtCursor} />
              </span>
            </TooltipTrigger>
            <TooltipContent>Emoji</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <ThemeModal markdown={value} onChange={onChange} />
              </span>
            </TooltipTrigger>
            <TooltipContent>Theme</TooltipContent>
          </Tooltip>
          <div className="ml-auto flex items-center gap-0.5">
            {showSaved && (
              <span className="mr-1 flex items-center gap-0.5 text-xs text-muted-foreground animate-in fade-in">
                <Check className="size-3" />
                Saved
              </span>
            )}

            {onReset && (
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <RotateCcw />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset to default?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will replace the editor contents with the default
                      template and clear your saved draft.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      size="sm"
                      variant="destructive"
                      onClick={onReset}
                    >
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <CopyButton text={value} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Copy Markdown</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
