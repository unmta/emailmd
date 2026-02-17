import { describe, it, expect } from 'vitest';
import { render } from '../src/index.js';

const SIMPLE_TABLE = `| Name | Age |
| ---- | --- |
| Alice | 30 |
| Bob | 25 |`;

const ALIGNED_TABLE = `| Left | Center | Right |
| :--- | :----: | ----: |
| a | b | c |`;

describe('table support', () => {
  describe('basic rendering', () => {
    it('renders a simple table with all data visible', () => {
      const { html } = render(SIMPLE_TABLE);
      expect(html).toContain('Name');
      expect(html).toContain('Age');
      expect(html).toContain('Alice');
      expect(html).toContain('30');
      expect(html).toContain('Bob');
      expect(html).toContain('25');
    });

    it('contains no MJML tags in output', () => {
      const { html } = render(SIMPLE_TABLE);
      expect(html).not.toMatch(/<mj-/);
    });

    it('contains no EMAILMD markers in output', () => {
      const { html } = render(SIMPLE_TABLE);
      expect(html).not.toContain('EMAILMD:');
    });
  });

  describe('column alignment', () => {
    it('preserves left alignment', () => {
      const md = '| Name |\n| :--- |\n| Alice |';
      const { html } = render(md);
      expect(html).toContain('text-align:left');
    });

    it('preserves center alignment', () => {
      const md = '| Name |\n| :---: |\n| Alice |';
      const { html } = render(md);
      expect(html).toContain('text-align:center');
    });

    it('preserves right alignment', () => {
      const md = '| Name |\n| ---: |\n| Alice |';
      const { html } = render(md);
      expect(html).toContain('text-align:right');
    });

    it('handles mixed alignments', () => {
      const { html } = render(ALIGNED_TABLE);
      expect(html).toContain('text-align:left');
      expect(html).toContain('text-align:center');
      expect(html).toContain('text-align:right');
    });
  });

  describe('styling', () => {
    it('applies header border styling', () => {
      const { html } = render(SIMPLE_TABLE);
      expect(html).toContain('border-bottom');
    });

    it('uses theme colors', () => {
      const { html } = render(SIMPLE_TABLE);
      expect(html).toContain('#71717a'); // default bodyColor
    });
  });

  describe('with surrounding content', () => {
    it('renders text before and after a table', () => {
      const md = `# Welcome

${SIMPLE_TABLE}

More content below.`;
      const { html } = render(md);
      expect(html).toContain('Welcome');
      expect(html).toContain('Alice');
      expect(html).toContain('More content below.');
    });

    it('handles multiple tables', () => {
      const md = `| A |\n| - |\n| 1 |\n\n| B |\n| - |\n| 2 |`;
      const { html } = render(md);
      expect(html).toContain('A');
      expect(html).toContain('1');
      expect(html).toContain('B');
      expect(html).toContain('2');
    });
  });
});

describe('table plain text output', () => {
  it('converts a table to aligned text', () => {
    const { text } = render(SIMPLE_TABLE);
    expect(text).toContain('Name');
    expect(text).toContain('Alice');
    expect(text).toContain('30');
    expect(text).toContain('Bob');
    expect(text).toContain('25');
  });

  it('includes a separator after the header', () => {
    const { text } = render(SIMPLE_TABLE);
    expect(text).toContain('---');
  });

  it('contains no HTML tags', () => {
    const { text } = render(SIMPLE_TABLE);
    expect(text).not.toMatch(/<[^>]+>/);
  });

  it('aligns columns with padding', () => {
    const { text } = render(SIMPLE_TABLE);
    const lines = text.split('\n').filter((l) => l.trim());
    const aliceLine = lines.find((l) => l.includes('Alice'));
    const bobLine = lines.find((l) => l.includes('Bob'));
    expect(aliceLine).toBeDefined();
    expect(bobLine).toBeDefined();
    // Both data rows should have the same column offset for the second column
    const aliceAgeIndex = aliceLine!.indexOf('30');
    const bobAgeIndex = bobLine!.indexOf('25');
    expect(aliceAgeIndex).toBe(bobAgeIndex);
  });
});
