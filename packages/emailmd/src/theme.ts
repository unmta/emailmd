export interface Theme {
  brandColor: string;
  headingColor: string;
  bodyColor: string;
  backgroundColor: string;
  contentColor: string;
  cardColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  contentWidth: string;
}

const sharedTypography = {
  fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  contentWidth: '600px',
};

export const lightTheme: Theme = {
  brandColor: '#18181b',
  headingColor: '#09090b',
  bodyColor: '#71717a',
  backgroundColor: '#fafafa',
  contentColor: '#ffffff',
  cardColor: '#f4f4f5',
  buttonColor: '#18181b',
  buttonTextColor: '#fafafa',
  ...sharedTypography,
};

export const darkTheme: Theme = {
  brandColor: '#fafafa',
  headingColor: '#fafafa',
  bodyColor: '#a1a1aa',
  backgroundColor: '#09090b',
  contentColor: '#18181b',
  cardColor: '#27272a',
  buttonColor: '#fafafa',
  buttonTextColor: '#18181b',
  ...sharedTypography,
};

export const defaultTheme: Theme = { ...lightTheme };

export function resolveBaseTheme(name?: string): Theme {
  if (name === 'dark') return darkTheme;
  if (name === 'light') return lightTheme;
  return defaultTheme;
}

export function mergeTheme(overrides?: Partial<Theme>, base?: Theme): Theme {
  const b = base ?? defaultTheme;
  if (!overrides) return { ...b };
  return { ...b, ...overrides };
}
