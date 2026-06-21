# Portfolio — John Sebastian Solon

Personal portfolio for **John Sebastian Solon**, a Software, Firmware & Systems Engineer
(CSE @ UC Davis, '25). Showcases both software and embedded/firmware work.

- **Live:** johnsolon.com · **Repo:** github.com/KuyaBasti/MyPortfolio
- **Contact:** jsvsolon@gmail.com · linkedin.com/in/jssolon

## Stack
Next.js 15 (App Router) · TypeScript · React 19 · Tailwind v4 · Framer Motion (`motion` pkg)
· Inter + JetBrains Mono · deployed on Vercel.

## Design — dark "Neo / Matrix"
- Near-black bg `#05070a`, phosphor-green accent `#28c840` / bright `#9dffc4`, light ink `#e6e8ee`.
- Cooler/cyber iridescent gradient (`--iri`) for big headlines; `.iri` helper.
- Page-wide ambient **streams rain** backdrop (refined Matrix code, calmer than the intro).
- Mono terminal accents: command eyebrows (`~ % whoami`), blinking cursors, `.mono` labels.
- A first-visit **decryption boot intro** (handshake → decrypt key → ACCESS GRANTED) that docks
  into a terminal, then types the real shell session. Plays once/session, skippable.
- Tokens are CSS vars in `src/app/globals.css`. Bespoke per-section animation CSS lives in
  scoped `<style>` blocks inside each component. Gate every animation behind
  `@media (prefers-reduced-motion: reduce)`.

## Copy rules
- **No em dashes (—)** in any visible text — they read as AI-generated. Use commas, colons,
  parentheses, or `·` separators instead. En dashes are fine only for date ranges.

## Structure
```
src/
  app/            globals.css (tokens, .iri, backdrop), layout.tsx (fonts + pre-paint intro script), page.tsx
  components/
    Backdrop.tsx  streams-rain canvas (tab-paused, reduced-motion safe)
    Home.tsx      orchestrator
    new/          Navbar, Hero (intro+terminal), Highlights, Experience (4 sticky scenes),
                  Projects (glass bento), About, Skills, Contact, Footer
    new/visuals/  bespoke per-scene visuals (e.g. QuantaRack)
  data/portfolio.ts   content source (experiences, projects, skills, education, contact)
```
Experience (4 cinematic sticky-scroll scenes) and Projects (6 cards) keep their curated copy +
visuals inline; `portfolio.ts` is the canonical record — keep them in sync.

Section order: Navbar · Hero · Highlights · Experience (01) · Projects (02) · About (03) · Skills (04) · Contact.

## Commands
`npm run dev` · `npm run build` · `npm run lint`
