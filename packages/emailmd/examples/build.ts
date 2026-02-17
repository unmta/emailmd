import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { render } from '../src/index.js';

const dir = import.meta.dirname;
const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

for (const file of files) {
  const md = readFileSync(resolve(dir, file), 'utf-8');
  const wrapper = file === 'minimal.md' ? 'plain' as const : undefined;
  const { html } = render(md, wrapper ? { wrapper } : undefined);
  const outName = basename(file, '.md') + '.html';
  writeFileSync(resolve(dir, outName), html);
  console.log(`  ${file} → ${outName}`);
}

console.log(`\nDone. ${files.length} emails rendered.`);
