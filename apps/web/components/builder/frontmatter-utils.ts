const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

const THEME_KEYS = new Set([
  "brand_color",
  "heading_color",
  "body_color",
  "background_color",
  "content_color",
  "card_color",
  "button_color",
  "button_text_color",
  "secondary_color",
  "secondary_text_color",
  "success_color",
  "success_text_color",
  "danger_color",
  "danger_text_color",
  "warning_color",
  "warning_text_color",
  "font_family",
  "font_size",
  "line_height",
  "content_width",
  "border_radius",
  "theme",
]);

/**
 * Parse flat YAML frontmatter from a markdown string into key-value pairs.
 */
export function parseFrontmatter(
  markdown: string
): Record<string, string> {
  const match = markdown.match(FRONTMATTER_RE);
  if (!match) return {};

  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) result[key] = value;
  }
  return result;
}

/**
 * Set a key in the YAML frontmatter. Creates the frontmatter block if absent.
 */
export function setFrontmatterKey(
  markdown: string,
  key: string,
  value: string
): string {
  const formatted = formatYamlValue(key, value);
  const match = markdown.match(FRONTMATTER_RE);

  if (!match) {
    // No frontmatter block — create one
    return `---\n${key}: ${formatted}\n---\n${markdown}`;
  }

  const lines = match[1].split("\n");
  let replaced = false;

  for (let i = 0; i < lines.length; i++) {
    const idx = lines[i].indexOf(":");
    if (idx === -1) continue;
    if (lines[i].slice(0, idx).trim() === key) {
      lines[i] = `${key}: ${formatted}`;
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    lines.push(`${key}: ${formatted}`);
  }

  const newBlock = `---\n${lines.join("\n")}\n---`;
  return markdown.replace(FRONTMATTER_RE, newBlock);
}

/**
 * Remove a key from the YAML frontmatter.
 * Removes the entire frontmatter block if no keys remain.
 */
export function removeFrontmatterKey(
  markdown: string,
  key: string
): string {
  const match = markdown.match(FRONTMATTER_RE);
  if (!match) return markdown;

  const lines = match[1]
    .split("\n")
    .filter((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return true;
      return line.slice(0, idx).trim() !== key;
    });

  const remaining = lines.filter((l) => l.trim() !== "");

  if (remaining.length === 0) {
    // Remove entire frontmatter block and any leading newline
    return markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  }

  const newBlock = `---\n${remaining.join("\n")}\n---`;
  return markdown.replace(FRONTMATTER_RE, newBlock);
}

/**
 * Remove all theme-related keys from frontmatter, preserving non-theme keys.
 */
export function removeAllThemeKeys(markdown: string): string {
  const match = markdown.match(FRONTMATTER_RE);
  if (!match) return markdown;

  const lines = match[1]
    .split("\n")
    .filter((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return true;
      const key = line.slice(0, idx).trim();
      return !THEME_KEYS.has(key);
    });

  const remaining = lines.filter((l) => l.trim() !== "");

  if (remaining.length === 0) {
    return markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  }

  const newBlock = `---\n${remaining.join("\n")}\n---`;
  return markdown.replace(FRONTMATTER_RE, newBlock);
}

function formatYamlValue(key: string, value: string): string {
  // Colors and simple values don't need quoting
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return `"${value}"`;
  if (/^[\d.]+(%|px|em|rem)?$/.test(value)) return value;
  if (/^[a-zA-Z0-9_-]+$/.test(value)) return value;
  // Quote anything with special YAML characters
  return `"${value.replace(/"/g, '\\"')}"`;
}
