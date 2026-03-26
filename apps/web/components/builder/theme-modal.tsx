"use client";

import { Fragment } from "react";
import { lightTheme, darkTheme, type Theme } from "emailmd";
import { HexColorPicker } from "react-colorful";
import { Paintbrush, X, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  parseFrontmatter,
  setFrontmatterKey,
  removeFrontmatterKey,
  removeAllThemeKeys,
} from "./frontmatter-utils";

interface ThemeModalProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

const COLOR_FIELDS: {
  key: string;
  label: string;
  camelKey: keyof Theme;
}[] = [
  { key: "brand_color", label: "Brand", camelKey: "brandColor" },
  { key: "heading_color", label: "Headings", camelKey: "headingColor" },
  { key: "body_color", label: "Body Text", camelKey: "bodyColor" },
  {
    key: "background_color",
    label: "Background",
    camelKey: "backgroundColor",
  },
  { key: "content_color", label: "Content Area", camelKey: "contentColor" },
  { key: "card_color", label: "Cards", camelKey: "cardColor" },
  { key: "button_color", label: "Buttons", camelKey: "buttonColor" },
  {
    key: "button_text_color",
    label: "Button Text",
    camelKey: "buttonTextColor",
  },
];

// Paired so bg/text sit side-by-side in a 2-col grid
const VARIANT_COLOR_PAIRS: {
  bg: { key: string; label: string; camelKey: keyof Theme };
  text?: { key: string; label: string; camelKey: keyof Theme };
}[] = [
  {
    bg: { key: "secondary_color", label: "Secondary", camelKey: "secondaryColor" },
    text: { key: "secondary_text_color", label: "Secondary Text", camelKey: "secondaryTextColor" },
  },
  {
    bg: { key: "success_color", label: "Success", camelKey: "successColor" },
    text: { key: "success_text_color", label: "Success Text", camelKey: "successTextColor" },
  },
  {
    bg: { key: "danger_color", label: "Danger", camelKey: "dangerColor" },
    text: { key: "danger_text_color", label: "Danger Text", camelKey: "dangerTextColor" },
  },
  {
    bg: { key: "warning_color", label: "Warning", camelKey: "warningColor" },
    text: { key: "warning_text_color", label: "Warning Text", camelKey: "warningTextColor" },
  },
];

const TEXT_FIELDS: {
  key: string;
  label: string;
  camelKey: keyof Theme;
}[] = [
  { key: "font_size", label: "Font Size", camelKey: "fontSize" },
  { key: "line_height", label: "Line Height", camelKey: "lineHeight" },
  { key: "content_width", label: "Content Width", camelKey: "contentWidth" },
];

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica Neue", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, Times, 'Times New Roman', serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Palatino", value: "Palatino, 'Palatino Linotype', 'Book Antiqua', serif" },
  { label: "Lucida Sans", value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
];

export function ThemeModal({ markdown, onChange }: ThemeModalProps) {
  const fm = parseFrontmatter(markdown);
  const baseThemeName = fm.theme || "light";
  const baseTheme = baseThemeName === "dark" ? darkTheme : lightTheme;

  function handleSet(key: string, value: string) {
    onChange(setFrontmatterKey(markdown, key, value));
  }

  function handleRemove(key: string) {
    onChange(removeFrontmatterKey(markdown, key));
  }

  function handleResetAll() {
    onChange(removeAllThemeKeys(markdown));
  }

  function handleBaseTheme(value: string) {
    if (value === "light") {
      onChange(removeFrontmatterKey(markdown, "theme"));
    } else {
      onChange(setFrontmatterKey(markdown, "theme", value));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Paintbrush className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Theme</DialogTitle>
          <DialogDescription>
            Customize colors, fonts, and layout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] px-4 pb-2">
          <div className="flex items-center gap-3">
            <Label className="text-sm min-w-20">Base Theme</Label>
            <Select value={baseThemeName} onValueChange={handleBaseTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-3">Colors</p>
            <div className="grid grid-cols-2 gap-3">
              {COLOR_FIELDS.map((field) => (
                <ColorField
                  key={field.key}
                  label={field.label}
                  value={fm[field.key]}
                  defaultValue={baseTheme[field.camelKey]}
                  onSet={(v) => handleSet(field.key, v)}
                  onRemove={() => handleRemove(field.key)}
                />
              ))}
            </div>
            <p className="text-sm font-medium mb-3 mt-4">Button Variants</p>
            <div className="grid grid-cols-2 gap-3">
              {VARIANT_COLOR_PAIRS.map(({ bg, text }) => (
                <Fragment key={bg.key}>
                  <ColorField
                    label={bg.label}
                    value={fm[bg.key]}
                    defaultValue={baseTheme[bg.camelKey]}
                    onSet={(v) => handleSet(bg.key, v)}
                    onRemove={() => handleRemove(bg.key)}
                  />
                  {text ? (
                    <ColorField
                      label={text.label}
                      value={fm[text.key]}
                      defaultValue={baseTheme[text.camelKey]}
                      onSet={(v) => handleSet(text.key, v)}
                      onRemove={() => handleRemove(text.key)}
                    />
                  ) : (
                    <div />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-3">Typography & Layout</p>
            <div className="space-y-3">
              <FontFamilyField
                value={fm.font_family}
                defaultValue={baseTheme.fontFamily}
                onSet={(v) => handleSet("font_family", v)}
                onRemove={() => handleRemove("font_family")}
              />
              <div className="grid grid-cols-3 gap-3">
                {TEXT_FIELDS.map((field) => (
                  <TextField
                    key={field.key}
                    label={field.label}
                    value={fm[field.key]}
                    defaultValue={baseTheme[field.camelKey]}
                    onSet={(v) => handleSet(field.key, v)}
                    onRemove={() => handleRemove(field.key)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={handleResetAll}>
            Reset All
          </Button>
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

function ColorField({
  label,
  value,
  defaultValue,
  onSet,
  onRemove,
}: {
  label: string;
  value: string | undefined;
  defaultValue: string;
  onSet: (value: string) => void;
  onRemove: () => void;
}) {
  const displayValue = value ?? defaultValue;
  const isOverridden = value !== undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="size-8 shrink-0 rounded-md border border-input cursor-pointer"
              style={{ backgroundColor: displayValue }}
            />
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="w-auto p-3">
            <HexColorPicker color={displayValue} onChange={onSet} />
          </PopoverContent>
        </Popover>
        <Input
          value={displayValue}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
              onSet(v);
            }
          }}
          onBlur={(e) => {
            const v = e.target.value;
            if (!/^#[0-9a-fA-F]{6}$/.test(v)) {
              onSet(displayValue);
            }
          }}
          className="font-mono text-xs h-8"
        />
        {isOverridden && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="shrink-0"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function FontFamilyField({
  value,
  defaultValue,
  onSet,
  onRemove,
}: {
  value: string | undefined;
  defaultValue: string;
  onSet: (value: string) => void;
  onRemove: () => void;
}) {
  const isOverridden = value !== undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">Font Family</Label>
      <div className="flex items-center gap-1.5">
        <Input
          value={value ?? ""}
          placeholder={defaultValue}
          onChange={(e) => onSet(e.target.value)}
          className="text-xs h-8"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <ChevronsUpDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48 max-h-64 overflow-y-auto">
            {FONT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => onSet(opt.value)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {isOverridden && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="shrink-0"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  defaultValue,
  onSet,
  onRemove,
}: {
  label: string;
  value: string | undefined;
  defaultValue: string;
  onSet: (value: string) => void;
  onRemove: () => void;
}) {
  const isOverridden = value !== undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1.5">
        <Input
          value={value ?? ""}
          placeholder={defaultValue}
          onChange={(e) => onSet(e.target.value)}
          className="text-xs h-8"
        />
        {isOverridden && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="shrink-0"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
