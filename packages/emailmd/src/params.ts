const ALIGNMENT_KEYWORDS = new Set(['center', 'left', 'right']);
const PADDING_KEYWORDS = new Set(['compact', 'spacious']);

export interface DirectiveParams {
  align?: string;
  padding?: string;
  color?: string;
  bg?: string;
  [key: string]: string | undefined;
}

/**
 * Parse space-separated parameters from a directive info string.
 *
 * Bare keywords are mapped to known parameter types:
 * - center, left, right → align
 * - compact, spacious → padding
 *
 * Key=value pairs are stored directly:
 * - color=#1e40af → { color: "#1e40af" }
 * - bg=#eff6ff → { bg: "#eff6ff" }
 */
export function parseDirectiveParams(info: string, name: string): DirectiveParams {
  const params: DirectiveParams = {};
  const rest = info.trim().slice(name.length).trim();
  if (!rest) return params;

  for (const token of rest.split(/\s+/)) {
    const eq = token.indexOf('=');
    if (eq !== -1) {
      params[token.slice(0, eq)] = token.slice(eq + 1);
    } else if (ALIGNMENT_KEYWORDS.has(token)) {
      params.align = token;
    } else if (PADDING_KEYWORDS.has(token)) {
      params.padding = token;
    }
  }

  return params;
}

/**
 * Serialize a DirectiveParams object into a marker attribute string.
 * Returns empty string when there are no params.
 *
 * { align: "center", bg: "#eff6ff" } → ' align="center" bg="#eff6ff"'
 */
export function serializeMarkerAttrs(params: DirectiveParams): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return ' ' + entries.map(([k, v]) => `${k}="${v}"`).join(' ');
}
