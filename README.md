# Email.md

### Write markdown. Ship emails. No HTML HELL.

Email.md converts markdown into responsive, email-safe HTML that works across Gmail, Outlook, Apple Mail, Yahoo, and every other client.

![Email.md](https://imgs.emailmd.dev/ss/github_splash.png?1)

## Install

```bash
npm install emailmd
``` 

## Quick Start

```typescript
import { render } from "emailmd";

const { html, text } = render(`
# Welcome!

Thanks for signing up.

[Get Started](https://example.com){button}
`);

// html → complete email-safe HTML
// text → plain text version for text/plain MIME part
```

## Learn More

- [Docs](https://www.emailmd.dev/docs) — full syntax reference, theming, frontmatter, directives, and API
- [Templates](https://www.emailmd.dev/templates) — ready-made email templates you can copy and customize
- [Builder](https://www.emailmd.dev/builder) — live editor to write and preview emails in your browser

## AI

Email.md is just markdown, so AI is great at writing templates. Feed the full docs to your AI tool:

```
https://www.emailmd.dev/llms-full.txt
```

## Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/unmta/emailmd/issues) or submit a [pull request](https://github.com/unmta/emailmd/pulls).

> Email.md is under active development. The API may change between minor versions until we hit 1.0.

## Acknowledgements

- Built with [MJML](https://mjml.io) under the hood
- Sponsored by [unMTA](https://www.unmta.com)

## License

MIT
