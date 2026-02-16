import { createServer, type IncomingMessage } from 'node:http';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { render } from '../src/index.js';

const PORT = Number(process.env.PORT) || 3000;
const EXAMPLES_DIR = resolve(import.meta.dirname, '../examples');

const defaultContent = readFileSync(resolve(EXAMPLES_DIR, 'welcome.md'), 'utf-8');

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function escapeForTemplate(str: string): string {
  return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getHtml());
      return;
    }

    if (req.method === 'POST' && req.url === '/render') {
      const body = await readBody(req);
      const { markdown, wrapper } = JSON.parse(body);
      try {
        const result = render(markdown, wrapper ? { wrapper } : undefined);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }

    if (req.method === 'GET' && req.url === '/examples') {
      const files = readdirSync(EXAMPLES_DIR)
        .filter((f) => f.endsWith('.md'))
        .map((f) => basename(f, '.md'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(files));
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/examples/')) {
      const name = req.url.slice('/examples/'.length);
      if (name.includes('..') || name.includes('/')) {
        res.writeHead(400);
        res.end('Invalid name');
        return;
      }
      const filePath = resolve(EXAMPLES_DIR, `${name}.md`);
      try {
        const content = readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  } catch (err) {
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  EMAIL.md playground running at ${url}\n`);
});

function getHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EMAIL.md playground</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #0f1117;
    color: #e1e4e8;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 10px 16px;
    background: #161b22;
    border-bottom: 1px solid #30363d;
    flex-shrink: 0;
  }

  header h1 {
    font-size: 14px;
    font-weight: 600;
    color: #c9d1d9;
    letter-spacing: 0.5px;
  }

  header .controls {
    display: flex;
    gap: 12px;
    margin-left: auto;
    align-items: center;
  }

  header label {
    font-size: 12px;
    color: #8b949e;
  }

  header select {
    background: #21262d;
    color: #c9d1d9;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
  }

  .main {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .editor-pane {
    width: 40%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #30363d;
  }

  .editor-pane .pane-header {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #8b949e;
    background: #161b22;
    border-bottom: 1px solid #30363d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  #input {
    flex: 1;
    width: 100%;
    background: #0d1117;
    color: #e1e4e8;
    border: none;
    padding: 16px;
    font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 1.6;
    resize: none;
    outline: none;
    tab-size: 2;
  }

  .output-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .tabs {
    display: flex;
    background: #161b22;
    border-bottom: 1px solid #30363d;
    flex-shrink: 0;
  }

  .tab {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    color: #8b949e;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .tab:hover { color: #c9d1d9; }

  .tab.active {
    color: #e1e4e8;
    border-bottom-color: #5B4FE9;
  }

  .tab-content {
    flex: 1;
    overflow: auto;
    display: none;
    min-height: 0;
  }

  .tab-content.active { display: block; }

  #html-output, #text-output {
    margin: 0;
    padding: 16px;
    font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace;
    font-size: 12px;
    line-height: 1.6;
    color: #c9d1d9;
    white-space: pre-wrap;
    word-break: break-all;
  }

  #preview {
    width: 100%;
    height: 100%;
    border: none;
    background: #fff;
  }

  .error {
    padding: 16px;
    color: #f85149;
    font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace;
    font-size: 13px;
    white-space: pre-wrap;
  }
</style>
</head>
<body>

<header>
  <h1>EMAIL.md playground</h1>
  <div class="controls">
    <label>Wrapper
      <select id="wrapper-select">
        <option value="">default</option>
        <option value="plain">plain</option>
        <option value="naked">naked</option>
      </select>
    </label>
    <label>Examples
      <select id="example-select">
        <option value="">Load example...</option>
      </select>
    </label>
  </div>
</header>

<div class="main">
  <div class="editor-pane">
    <div class="pane-header">Markdown</div>
    <textarea id="input" spellcheck="false"></textarea>
  </div>

  <div class="output-pane">
    <div class="tabs">
      <button class="tab active" data-tab="preview">Preview</button>
      <button class="tab" data-tab="html">HTML Source</button>
      <button class="tab" data-tab="text">Plain Text</button>
    </div>
    <div id="tab-preview" class="tab-content active">
      <iframe id="preview"></iframe>
    </div>
    <div id="tab-html" class="tab-content">
      <pre id="html-output"></pre>
    </div>
    <div id="tab-text" class="tab-content">
      <pre id="text-output"></pre>
    </div>
  </div>
</div>

<script>
  const input = document.getElementById('input');
  const preview = document.getElementById('preview');
  const htmlOutput = document.getElementById('html-output');
  const textOutput = document.getElementById('text-output');
  const wrapperSelect = document.getElementById('wrapper-select');
  const exampleSelect = document.getElementById('example-select');

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Debounced render
  let debounceTimer;
  function scheduleRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderPreview, 150);
  }

  input.addEventListener('input', scheduleRender);
  wrapperSelect.addEventListener('change', renderPreview);

  async function renderPreview() {
    const markdown = input.value;
    if (!markdown.trim()) {
      htmlOutput.textContent = '';
      textOutput.textContent = '';
      preview.srcdoc = '';
      return;
    }

    try {
      const res = await fetch('/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          wrapper: wrapperSelect.value || undefined,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        const msg = 'Error: ' + error;
        htmlOutput.textContent = msg;
        textOutput.textContent = msg;
        preview.srcdoc = '<pre style="color:#f85149;padding:20px;font-family:monospace">' +
          error.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</pre>';
        return;
      }

      const { html, text } = await res.json();
      htmlOutput.textContent = html;
      textOutput.textContent = text;
      preview.srcdoc = html;
    } catch (err) {
      const msg = 'Fetch error: ' + err.message;
      htmlOutput.textContent = msg;
      textOutput.textContent = msg;
    }
  }

  // Load examples list
  fetch('/examples')
    .then(r => r.json())
    .then(names => {
      names.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        exampleSelect.appendChild(opt);
      });
    });

  exampleSelect.addEventListener('change', async () => {
    if (!exampleSelect.value) return;
    const res = await fetch('/examples/' + exampleSelect.value);
    if (res.ok) {
      input.value = await res.text();
      renderPreview();
    }
    exampleSelect.value = '';
  });

  // Default content
  input.value = ${JSON.stringify(defaultContent)};
  renderPreview();
</script>
</body>
</html>`;
}
