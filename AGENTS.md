# MyPortfolio: Agent Operations

Personal portfolio for **John Sebastian Solon**, a Software, Firmware & Systems Engineer
(CSE @ UC Davis, '25). Showcases both software and embedded/firmware work.

- **Live:** johnsolon.com · **Repo:** github.com/KuyaBasti/MyPortfolio
- **Contact:** jsvsolon@gmail.com · linkedin.com/in/jssolon

This file is the contract every AI agent working in this repo follows. `CLAUDE.md`
points here. Workflow playbooks live in `.claude/skills/`, subagent definitions in
`.claude/agents/`.

## Source of Truth (CRITICAL)

| Layer | Where | Rule |
|---|---|---|
| Facts | John's resume, provided in chat | The only source for claims: titles, employers, dates, numbers, metrics. Reformulate, never fabricate. A claim not backed by the resume or the project's real repo stays off the site. |
| Content | `src/data/portfolio.ts` | Canonical in-repo record of experiences, projects, skills, education, contact. |
| Curated copy | `Experience.tsx` (4 scenes), `Projects.tsx` (6 cards) | Copy and visuals are inline and hand-tuned. Keep them in sync with `portfolio.ts`; when they disagree, flag it, never silently pick one. |
| Project truth | Each project's own repository | Before designing a card or visual, deep-read the actual repo (`repo-scholar` agent). Never design from a title alone. |

## Standing Rules (non-negotiable)

1. **Ship via PR, always as a pair.** Branch, commit, `gh pr create` to `main`, hand
   over the link, stop. Every code PR gets a companion docs PR (`docs-*` branch)
   updating README.md / SYSTEM-DESIGN.md to reflect it, the way PR #24 (code) was
   followed by PR #25 (docs). Merging `main` deploys to johnsolon.com via Vercel.
   **Never merge a PR without John's explicit approval, given per PR.**
2. **No AI co-author trailers** in commit messages.
3. **One change at a time, John picks.** Design and copy changes are proposed as
   options (usually 3 prototypes); never a bundled sweep or wholesale redesign.
4. **The iridescent card rings stay.** The gradient borders on project cards are
   core identity, never propose removing them.
5. **No visitor typing.** The site never asks visitors to type; the terminal is
   theatrical, not interactive.
6. **No em dashes (U+2014) in visible text.** They read as AI-generated. Use commas,
   colons, parentheses, or `·`. En dashes only for date ranges. Enforced by
   `npm run copy-lint`.
7. **Experimental work lives in `../MyPortfolio-experimental`** (private sandbox,
   `origin` = experimental repo, `upstream` = this repo). It graduates here only on
   explicit approval. See the `mayhem` skill.
8. **Never delete `.next/` while a dev server is running.** It corrupts the build
   and kills the preview.

## Workflows (skills in `.claude/skills/`)

| Skill | Use when |
|---|---|
| `visual` | Designing or reworking a project-card or experience-scene visual. The full loop: repo deep-read, 3 prototypes, John picks, port, verify, ship. |
| `verify` | Any change that renders. Build, lint, copy-lint, browser pass. |
| `ship` | Work is verified and ready for review. Branch to PR, never merge. |
| `resume-sync` | John provides a new resume, or site claims need auditing. |
| `mayhem` | Over-architecture experiments. Routes work to the sandbox repo. |

## Subagents (`.claude/agents/`)

| Agent | Job |
|---|---|
| `repo-scholar` | Read-only deep read of one project repo; returns verified facts, metrics with evidence, and the best true stories to celebrate. |
| `proto-builder` | Builds one standalone HTML prototype in `public/prototypes/` from a design brief. |
| `design-critic` | Read-only review against the design system and discipline lenses; returns ranked findings. |
| `claim-auditor` | Verifies one specific claim against the resume and the project's repo. |

Launch several in parallel when the tasks are independent (for example three
`proto-builder`s, one per design direction).

## Stack

Next.js 15 (App Router) · TypeScript · React 19 · Tailwind v4 · Framer Motion (`motion` pkg)
· Inter + JetBrains Mono · deployed on Vercel.

## Design: dark "Neo / Matrix"

- Near-black bg `#05070a`, phosphor-green accent `#28c840` / bright `#9dffc4`, light ink `#e6e8ee`.
- Cooler/cyber iridescent gradient (`--iri`) for big headlines; `.iri` helper.
- Page-wide ambient **streams rain** backdrop (refined Matrix code, calmer than the intro).
- Mono terminal accents: command eyebrows, blinking cursors, `.mono` labels.
- A first-visit **decryption boot intro** (handshake, decrypt key, ACCESS GRANTED) that docks
  into a terminal, then types the real shell session. Plays once/session, skippable.
- Tokens are CSS vars in `src/app/globals.css`. Bespoke per-section animation CSS lives in
  scoped `<style>` blocks inside each component. Gate every animation behind
  `@media (prefers-reduced-motion: reduce)`.

## Structure

```
src/
  app/            globals.css (tokens, .iri, backdrop), layout.tsx (fonts + pre-paint intro script), page.tsx
  components/
    Backdrop.tsx  streams-rain canvas (tab-paused, reduced-motion safe)
    Home.tsx      orchestrator
    new/          Navbar, Hero (intro+terminal), Experience (4 sticky scenes),
                  Projects (glass bento), About, Skills, Contact, Footer
    new/visuals/  bespoke per-scene visuals (e.g. QuantaRack)
  data/portfolio.ts   content source (experiences, projects, skills, education, contact)
scripts/copy-lint.mjs deterministic copy-rule check (em dashes)
```

Section order: Navbar · Hero · Experience (01) · Projects (02) · About (03) · Skills (04) · Contact.

## Verification gate

`npm run build` · `npm run lint` · `npm run copy-lint` · browser pass via the
`portfolio-dev` preview (console clean, visuals animate in view, reduced-motion
shows a static frame). Details in the `verify` skill.

## Commands

`npm run dev` · `npm run build` · `npm run lint` · `npm run copy-lint`
