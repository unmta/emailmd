import Link from "next/link";
import { Mail, FileText, Palette, Type } from "lucide-react";

export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="container mx-auto max-w-screen-lg px-4 py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Responsive Emails, Written in Markdown
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Email.md turns simple markdown into responsive, email-safe HTML that
            renders perfectly across every client. Build transactional and
            marketing emails in a fraction of the code.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/unmta/emailmd"
              target="_blank"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section className="container mx-auto max-w-screen-lg px-4 pb-20">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/20" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
            <div className="h-3 w-3 rounded-full bg-green-500/20" />
            <span className="ml-2 text-xs text-muted-foreground">
              example.ts
            </span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
            <code className="text-foreground">{`import { render } from 'emailmd';

const { html, text } = render(\`
# Welcome!

Thanks for signing up.

[Get Started](https://example.com){button}
\`);

// html → email-safe HTML (Gmail, Outlook, Apple Mail, everything)
// text → plain text version for text/plain MIME part`}</code>
          </pre>
        </div>
      </section>

      {/* Install */}
      <section className="container mx-auto max-w-screen-lg px-4 pb-20 text-center">
        <div className="mx-auto max-w-md space-y-3">
          <p className="text-sm text-muted-foreground">Install with npm</p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 font-mono text-sm">
            <span className="text-muted-foreground">$</span>
            <span>npm install emailmd</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-screen-lg px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          <FeatureCard
            icon={<Mail className="h-5 w-5" />}
            title="Email-Safe HTML"
            description="Powered by MJML under the hood for bulletproof rendering across Gmail, Outlook, Apple Mail, Yahoo, and every email client."
          />
          <FeatureCard
            icon={<FileText className="h-5 w-5" />}
            title="Rich Markdown"
            description="Tables, task lists, buttons, callouts, heroes, headers, footers, and more. Everything you need for beautiful emails."
          />
          <FeatureCard
            icon={<Palette className="h-5 w-5" />}
            title="Theming"
            description="Light and dark themes, brand colors, custom fonts. Override per-email via frontmatter or globally in code."
          />
          <FeatureCard
            icon={<Type className="h-5 w-5" />}
            title="Plain Text"
            description="Automatic plain text generation for the text/plain MIME part. Every email gets both HTML and plain text output."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto max-w-screen-lg px-4">
          Built by{" "}
          <a
            href="https://www.unmta.com/"
            target="_blank"
            className="underline underline-offset-4 hover:text-foreground"
          >
            unMTA
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/unmta/emailmd"
            target="_blank"
            className="underline underline-offset-4 hover:text-foreground"
          >
            GitHub
          </a>
          .
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
