import { describe, it, expect } from 'vitest';
import { defaultTheme, lightTheme, darkTheme, mergeTheme, resolveBaseTheme } from '../src/index.js';

describe('theme', () => {
  it('defaultTheme equals lightTheme', () => {
    expect(defaultTheme).toEqual(lightTheme);
  });

  it('lightTheme has light background colors', () => {
    expect(lightTheme.backgroundColor).toBe('#fafafa');
    expect(lightTheme.contentColor).toBe('#ffffff');
  });

  it('darkTheme has dark background colors', () => {
    expect(darkTheme.backgroundColor).toBe('#09090b');
    expect(darkTheme.contentColor).toBe('#18181b');
  });

  it('returns defaults when no overrides are provided', () => {
    const theme = mergeTheme();
    expect(theme).toEqual(defaultTheme);
  });

  it('returns a new object, not a reference to defaultTheme', () => {
    const theme = mergeTheme();
    expect(theme).not.toBe(defaultTheme);
  });

  it('merges partial overrides over defaults', () => {
    const theme = mergeTheme({ brandColor: '#FF0000' });
    expect(theme.brandColor).toBe('#FF0000');
    expect(theme.bodyColor).toBe(defaultTheme.bodyColor);
  });

  it('merges multiple overrides', () => {
    const theme = mergeTheme({
      brandColor: '#FF0000',
      buttonColor: '#00FF00',
      fontFamily: 'Georgia, serif',
    });
    expect(theme.brandColor).toBe('#FF0000');
    expect(theme.buttonColor).toBe('#00FF00');
    expect(theme.fontFamily).toBe('Georgia, serif');
    expect(theme.backgroundColor).toBe(defaultTheme.backgroundColor);
  });

  it('merges overrides with a custom base theme', () => {
    const theme = mergeTheme({ brandColor: '#FF0000' }, darkTheme);
    expect(theme.brandColor).toBe('#FF0000');
    expect(theme.backgroundColor).toBe(darkTheme.backgroundColor);
  });

  it('returns dark theme copy when base is dark and no overrides', () => {
    const theme = mergeTheme(undefined, darkTheme);
    expect(theme).toEqual(darkTheme);
    expect(theme).not.toBe(darkTheme);
  });
});

describe('resolveBaseTheme', () => {
  it('returns darkTheme for "dark"', () => {
    expect(resolveBaseTheme('dark')).toBe(darkTheme);
  });

  it('returns lightTheme for "light"', () => {
    expect(resolveBaseTheme('light')).toBe(lightTheme);
  });

  it('returns defaultTheme for undefined', () => {
    expect(resolveBaseTheme()).toBe(defaultTheme);
  });

  it('returns defaultTheme for unknown name', () => {
    expect(resolveBaseTheme('neon')).toBe(defaultTheme);
  });
});
