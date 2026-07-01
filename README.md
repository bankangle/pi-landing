# PI Retail — landing page

Modern, laconic landing page for PI Retail. **SvelteKit (SSR) + Tailwind v4**, with a
RU/EN toggle and a contact form that notifies you on **Telegram** (and, later, **Max**)
— all with the smallest possible dependency footprint.

## Stack & philosophy

- **SvelteKit** with `adapter-node` — server-side rendering, runs as one Node process on your VPS.
- **Tailwind CSS v4** via the official Vite plugin (no PostCSS config, no UI kit).
- **No extra runtime libraries.** i18n, the reveal-on-scroll animation, icons, form
  handling and the Telegram call are all hand-coded. Only `svelte`, `@sveltejs/kit`,
  the node adapter and Tailwind are installed.

## How notifications work without a separate backend

Because the site is SSR, SvelteKit gives us a **server action** ([src/routes/+page.server.js](src/routes/+page.server.js)).
The form POSTs to it, and the action calls the Telegram Bot API with a plain `fetch`
([src/lib/server/notify.js](src/lib/server/notify.js)). The bot token lives in a
**server-only env var** and is never sent to the browser. No standalone API server to maintain.

- **Max** (VK) uses the same pattern — a second `fetch` in `notify.js`, already stubbed.
  Fill in `MAX_BOT_TOKEN` / `MAX_CHAT_ID` when ready; blank = silently skipped.
- Spam is blocked with a hidden **honeypot** field, and SvelteKit's built-in **CSRF**
  origin check is active.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Telegram token + chat id
npm run dev            # http://localhost:5173
```

### Telegram config

1. Create a bot with [@BotFather](https://t.me/BotFather), copy the token.
2. Get your chat id (message [@userinfobot](https://t.me/userinfobot), or use your group id).
3. Put both in `.env`:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC...
   TELEGRAM_CHAT_ID=123456789
   ```

If the token/chat id are missing, the form still validates but reports a send failure —
so don't forget to set them in production.

## Production (Node VPS)

```bash
npm run build
ORIGIN=https://www.pi-retail.com \
TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... \
node build
```

- **`ORIGIN` is required in production** — adapter-node uses it for the CSRF check on form
  POSTs. Set it to your public URL (behind a reverse proxy, pass `PROTOCOL_HEADER`/`HOST_HEADER`
  per the [adapter-node docs](https://svelte.dev/docs/kit/adapter-node) instead).
- Default port is `3000`; override with `PORT`.
- Run it under systemd / pm2 / Docker and put Nginx or Caddy in front for TLS.

## Editing content

All copy lives in one file: [src/lib/i18n.js](src/lib/i18n.js) (`ru` and `en` objects).
Change text there and both languages stay in sync structurally.

## Project layout

```
src/
  app.html                 %lang% is injected by hooks.server.js
  app.css                  Tailwind import + design tokens + reveal/anim CSS
  hooks.server.js          reads the `lang` cookie -> sets <html lang> + locals
  lib/
    i18n.js                RU/EN dictionary (edit copy here)
    i18n-context.js        reactive, SSR-safe language context (setContext)
    reveal.js              IntersectionObserver scroll-reveal action
    server/notify.js       Telegram + Max delivery (fetch, server-only)
    components/            Nav, Hero, About, Services, Projects, Contact, Footer, Section, Icon
  routes/
    +layout.server.js      passes lang from cookie to the app
    +layout.svelte         provides i18n context, writes the lang cookie on toggle
    +page.svelte           assembles the sections + <head> meta
    +page.server.js        form action: validate -> notify -> success/fail
```
