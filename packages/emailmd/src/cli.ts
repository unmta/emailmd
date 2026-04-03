import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { render } from './index.js';

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
);

const HELP = `
emailmd v${version} — Render markdown into email-safe HTML

Usage:
  emailmd [file] [options]

Arguments:
  file              Markdown file to render (reads stdin if omitted)

Options:
  -o, --output <f>  Write output to file instead of stdout
  -t, --text        Output plain text instead of HTML
  -h, --help        Show this help message
  -v, --version     Show version number

Examples:
  emailmd input.md
  emailmd input.md -o output.html
  emailmd input.md --text
  echo "# Hello" | emailmd
`.trimStart();

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on('data', (chunk) => chunks.push(chunk));
    process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    process.stdin.on('error', reject);
  });
}

async function main(): Promise<void> {
  let args: ReturnType<typeof parseArgs>;
  try {
    args = parseArgs({
      allowPositionals: true,
      options: {
        output: { type: 'string', short: 'o' },
        text: { type: 'boolean', short: 't', default: false },
        help: { type: 'boolean', short: 'h', default: false },
        version: { type: 'boolean', short: 'v', default: false },
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`emailmd: ${msg}\nRun 'emailmd --help' for usage.\n`);
    process.exitCode = 1;
    return;
  }

  const { values, positionals } = args;

  if (values.help) {
    process.stdout.write(HELP);
    return;
  }

  if (values.version) {
    process.stdout.write(`${version}\n`);
    return;
  }

  if (positionals.length > 1) {
    process.stderr.write(`emailmd: expected at most one positional argument, got ${positionals.length}\nRun 'emailmd --help' for usage.\n`);
    process.exitCode = 1;
    return;
  }

  let markdown: string;

  if (positionals.length === 1) {
    const file = positionals[0];
    try {
      markdown = readFileSync(file, 'utf-8');
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      process.stderr.write(`emailmd: cannot read file '${file}': ${detail}\n`);
      process.exitCode = 1;
      return;
    }
  } else if (!process.stdin.isTTY) {
    markdown = await readStdin();
  } else {
    process.stderr.write(`emailmd: no input provided\nRun 'emailmd --help' for usage.\n`);
    process.exitCode = 1;
    return;
  }

  const result = render(markdown);
  const output = values.text ? result.text : result.html;

  if (values.output) {
    try {
      writeFileSync(values.output, output);
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      process.stderr.write(`emailmd: cannot write to '${values.output}': ${detail}\n`);
      process.exitCode = 1;
      return;
    }
  } else {
    process.stdout.write(output);
    if (output.length > 0 && !output.endsWith('\n')) {
      process.stdout.write('\n');
    }
  }
}

main();
