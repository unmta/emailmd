export interface Template {
  id: string;
  title: string;
  category: string;
  author: string;
  image?: string;
  markdown: string;
}

export const templates: Template[] = [
  {
    id: "welcome",
    title: "Welcome Email",
    category: "Onboarding",
    author: "Email.md",
    image: "https://imgs.emailmd.dev/ss/welcome.png",
    markdown: `---
preheader: "Your next adventure starts now"
theme: dark
brand_color: "#00F7A4"
button_color: "#00F7A4"
button_text_color: "#09090b"
---

::: header
![StageDive](https://imgs.emailmd.dev/logoipsum-363.png){width="100"}
:::

::: hero https://imgs.emailmd.dev/stagedive_hero.jpg
# You're in. Let's go.
:::

[Browse Experiences](https://example.com/explore){button}

::: centered
We built this for people who'd rather *be there* than scroll past it.
Every show, every game, every moment — we make it effortless to get in the door.
:::

## Here's why people stick around

::: callout
:ticket: **Best price, every time** — We scour every source so you never overpay. That's a promise.
:::

::: callout
:eyes: **See before you sit** — Preview your exact view from any seat in the venue before you commit.
:::

::: callout
:iphone: **Your phone is your ticket** — No printing. No will-call lines. Just walk in.
:::

::: callout
:heart: **Never miss a drop** — Follow your favorite artists and teams. We'll ping you before anyone else.
:::

[Find Something Tonight](https://example.com/tonight){button}

::: highlight center bg=#00F7A4 color=#09090b
**Real tickets. Real prices. Zero surprises.**
:::

::: centered
:wave: Questions? Just reply to this email — a real human will answer.
:::

::: footer
[iOS](https://example.com/ios) | [Android](https://example.com/android) | [Web](https://example.com/web)

StageDive HQ · 123 Market St · San Francisco, CA 94105

[Unsubscribe](https://example.com/unsub) · [Preferences](https://example.com/prefs)
:::
`,
  },
  {
    id: "password-reset",
    title: "Password Reset",
    category: "Security",
    author: "Email.md",
    image: "https://imgs.emailmd.dev/ss/reset_password.png",
    markdown: `---
preheader: "Reset your password"
button_color: "#EA347D"
---

::: header
![Logo](https://imgs.emailmd.dev/logoipsum-222.png){width="200"}
:::

# Reset Your Password

We received a request to reset the password for your account. Click the button below to choose a new password.

[Reset Password](https://example.com/reset?token=abc123){button}

::: centered
This link will expire in **1 hour**.
:::

::: callout
**Didn't request this?** If you didn't request a password reset, you can safely ignore this email.
:::

::: footer
Acme Inc. | 123 Main St, San Francisco, CA 94102 | [Unsubscribe](https://example.com/unsub)
:::
`,
  },
  {
    id: "order-confirmation",
    title: "Order Confirmation",
    category: "E-Commerce",
    author: "Email.md",
    markdown: `---
preheader: "Your order has been confirmed"
---

::: header
![Logo](https://imgs.emailmd.dev/logoipsum-336.png){width="200"}
:::

# Order Confirmed

Thanks for your purchase! Your order **#12345** has been confirmed and is being processed.

## Order Summary

| Item | Qty | Price |
|------|-----|-------|
| Widget Pro | 2 | $49.98 |
| Gadget Lite | 1 | $29.99 |
| **Total** | | **$79.97** |

We'll send you a shipping confirmation with tracking details once your order ships.

[View Order](https://example.com/orders/12345){button}

::: callout
**Estimated delivery:** 3–5 business days
:::

::: footer
Acme Store | 456 Commerce Blvd | [Unsubscribe](https://example.com/unsub)
:::
`,
  },
  {
    id: "newsletter",
    title: "Monthly Newsletter",
    category: "Marketing",
    author: "Email.md",
    image: "https://imgs.emailmd.dev/ss/newsletter.png",
    markdown: `---
preheader: "We made new stuff. Come look."
font_family: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
background_color: "#FFE500"
content_color: "#FFE500"
heading_color: "#09090b"
body_color: "#09090b"
brand_color: "#09090b"
button_color: "#09090b"
button_text_color: "#FFE500"
card_color: "#ffffff"
---

::: header
![Moonbean](https://imgs.emailmd.dev/moonbean_logo.png)
:::

# NEW DROPS. ZERO DECAF.

[@MOONBEAN](https://example.com/social){button}

::: callout
## By now, you know Moonbean exists.

You know we roast every batch by hand. You know we source from farms that actually care. You've tasted the difference.

You get it.

But did you know we just dropped three new single-origins? And a cold brew concentrate that might rearrange your entire morning?

**We have a newsletter. You're reading it. Let's keep this going.**
:::

![Coffee](https://imgs.emailmd.dev/moonbean_coffee.jpg){width="600"}

**Here's what's in the bag this month:**

- **Ethiopian Yirgacheffe.** Bright. Fruity. The kind of cup that makes you close your eyes.

- **Colombian Huila.** Smooth. Chocolatey. Your 3pm meeting just got better.

- **Sumatra Mandheling.** Bold. Earthy. Doesn't apologize.

- **Cold Brew Concentrate.** Mix it. Dilute it. Pour it over ice cream. We don't judge.

- **Free stickers.** Every order. Because we like you.

::: centered
FOLLOW US
:::

[Instagram](https://example.com/instagram){button.secondary} [TikTok](https://example.com/tiktok){button.secondary} [X](https://example.com/x){button.secondary}

[SHOP MOONBEAN](https://example.com/shop){button}

::: footer
**MOONBEAN COFFEE CO.**
SMALL BATCH. BIG ENERGY.

(c) 2026 Moonbean Coffee Co.
42 Roaster Lane · Portland, OR 97201

[Unsubscribe](https://example.com/unsub)
:::
`,
  },
  {
    id: "invoice",
    title: "Invoice",
    category: "Billing",
    author: "Email.md",
    markdown: `---
preheader: "Your invoice is ready"
---

::: header
![Logo](https://imgs.emailmd.dev/logoipsum-336.png){width="200"}
:::

# Invoice #INV-2025-0042

Hi Alex, your invoice for January 2025 is ready.

| Description | Amount |
|-------------|--------|
| Pro Plan (Monthly) | $29.00 |
| Additional Seats (3) | $27.00 |
| API Add-on | $9.00 |
| **Total Due** | **$65.00** |

**Due Date:** February 1, 2025

[Pay Now](https://example.com/invoices/42/pay){button}

::: callout
**Payment methods:** We accept all major credit cards and bank transfers. Need to update your payment method? [Go to billing settings](https://example.com/billing).
:::

::: footer
Acme Inc. | 123 Main St, San Francisco, CA 94102 | [Unsubscribe](https://example.com/unsub)
:::
`,
  },
  {
    id: "event-invitation",
    title: "Event Invitation",
    category: "Events",
    author: "Email.md",
    markdown: `---
preheader: "You're invited!"
---

::: header
![Logo](https://imgs.emailmd.dev/logoipsum-336.png){width="200"}
:::

# You're Invited!

Join us for **Acme Conf 2025** — a full day of talks, workshops, and networking with the best in the industry.

- **Date:** March 15, 2025
- **Time:** 9:00 AM – 5:00 PM PST
- **Location:** Moscone Center, San Francisco

## What to Expect

Keynotes from industry leaders, hands-on workshops, and a chance to connect with the Acme community in person.

[RSVP Now](https://example.com/events/acme-conf-2025){button}

::: callout
**Early bird pricing** ends February 28. Don't miss out!
:::

::: footer
Acme Inc. | 123 Main St, San Francisco, CA 94102 | [Unsubscribe](https://example.com/unsub)
:::
`,
  },
  {
    id: "confirm-email",
    title: "Confirm Email",
    category: "Onboarding",
    author: "Email.md",
    image: "https://imgs.emailmd.dev/ss/confirm_email.png",
    markdown: `---
preheader: "Confirm your email address"
theme: dark
---

::: header
![Logo](https://imgs.emailmd.dev/logoipsum-388.png){width="200"}
:::

# Confirm your email address

Your confirmation code is below - enter it in your open browser window and we'll help you get signed in.

::: callout center compact
# DFY-X7U
:::

If you didn't request this email, there's nothing to worry about, you can safely ignore it.

::: footer
![Logo](https://imgs.emailmd.dev/logoipsum-389.png){width="48"}

Acme Inc. | 123 Main St | [Unsubscribe](https://example.com/unsub)

![LinkedIn](https://imgs.emailmd.dev/linkedin_negative.png){width=24} ![Github](https://imgs.emailmd.dev/github_negative.png){width=24} ![Discord](https://imgs.emailmd.dev/discord_negative.png){width=24}
:::
`,
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
