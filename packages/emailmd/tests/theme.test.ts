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

  it('lightTheme has default borderRadius', () => {
    expect(lightTheme.borderRadius).toBe('8px');
  });

  it('darkTheme has default borderRadius', () => {
    expect(darkTheme.borderRadius).toBe('8px');
  });

  it('lightTheme has correct button variant colors', () => {
    expect(lightTheme.secondaryColor).toBe('#18181b');
    expect(lightTheme.secondaryTextColor).toBe('#18181b');
    expect(lightTheme.successColor).toBe('#16a34a');
    expect(lightTheme.successTextColor).toBe('#ffffff');
    expect(lightTheme.dangerColor).toBe('#dc2626');
    expect(lightTheme.dangerTextColor).toBe('#ffffff');
    expect(lightTheme.warningColor).toBe('#d97706');
    expect(lightTheme.warningTextColor).toBe('#ffffff');
  });

  it('darkTheme has dark background colors', () => {
    expect(darkTheme.backgroundColor).toBe('#09090b');
    expect(darkTheme.contentColor).toBe('#18181b');
  });

  it('darkTheme has correct button variant colors', () => {
    expect(darkTheme.secondaryColor).toBe('#fafafa');
    expect(darkTheme.secondaryTextColor).toBe('#fafafa');
    expect(darkTheme.successColor).toBe('#16a34a');
    expect(darkTheme.successTextColor).toBe('#ffffff');
    expect(darkTheme.dangerColor).toBe('#dc2626');
    expect(darkTheme.dangerTextColor).toBe('#ffffff');
    expect(darkTheme.warningColor).toBe('#d97706');
    expect(darkTheme.warningTextColor).toBe('#ffffff');
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

  it('merges button variant color overrides', () => {
    const theme = mergeTheme({ successColor: '#059669', dangerColor: '#b91c1c' });
    expect(theme.successColor).toBe('#059669');
    expect(theme.dangerColor).toBe('#b91c1c');
    expect(theme.warningColor).toBe(defaultTheme.warningColor);
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
