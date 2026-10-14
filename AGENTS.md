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
| Curated copy | `chapters/Experience.tsx` (4 chapters), `chapters/Projects.tsx` (8 cards), `chapters/Origin.tsx` | Copy is inline and hand-tuned. Keep it in sync with `portfolio.ts`; when they disagree, flag it, never silently pick one. Origin's story uses only what John stated himself plus resume facts. |
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

Next.js 15 (App Router) · TypeScript · React 19 · Tailwind v4 · three.js (lazy-imported inside
each chapter scene) · Framer Motion (`motion` pkg) · Inter + JetBrains Mono + Noto Sans Tagalog
(the Baybayin name) · Vitest · deployed on Vercel.

## Design: dark and iridescent

- Near-black bg `#05070a`, light ink `#e6e8ee`. **No green anywhere in the page or the scenes.**
- The one accent is **teal taken from the gradient**: `--accent` `#5eead4` for labels, dates, section
  numbers and the decrypt glyphs, `--accent-bright` `#b7f6ec` for links. John chose it after a long
  palette exploration; his original colors stay, the green was the only problem.
- The chapter scenes share that light: they read `--light`, `--light-bright`, `--light-dim` and
  `--light-pcb` through `scenes/sceneLight.ts` (LED waves, LiDAR, screen glow, edges). Change the
  tokens, not the scenes.
- Cooler/cyber iridescent gradient (`--iri`) for big headlines; `.iri` helper.
- One plain near-black page with a fixed film grain and vignette; the hero adds a drifting
  dust field and two light leaks. No page-wide rain, no boot overlay.
- The hero **decrypts the name**: cipher glyphs lock in left to right into the gradient. The
  hero block sits in the top quarter of the screen, not centered.
- Each experience chapter pairs copy with a framed **three.js scene that plays on its own
  clock**: never scroll-driven, no pinning, no snap, no text inside the canvas.
- Project cards keep the iridescent rings, three per row, with no number badge and no tag line
  above the title. The chapter scene frames wear the same gradient as a 1px ring.
- Nothing moves under the cursor: no pointer sway in the scenes, no hover lift on cards.
- Type scale and column come from a measured comparison with a reference site: one 1200px
  column (`--maxw`), 58px/500 section titles under a numbered mono gutter (01 Experiences to
  05 Contact), 34px chapter headlines, 15px body, 11px eyebrows.
- Each experience chapter stays **one full screen tall** (`min-height: 100svh`, content
  centered). Chapters flowing at their own height were tried and rejected; never propose it.
- Mono terminal accents: eyebrows, labels, chips.
- Tokens are CSS vars in `src/app/globals.css` (including `--lb` top bar height, `--pad`
  gutter and `--maxw` column width). Bespoke per-section CSS lives in scoped `<style>` blocks inside each component.
  Gate every animation behind `@media (prefers-reduced-motion: reduce)` and every loop behind
  IntersectionObserver and `visibilitychange`.

## Structure

```
src/
  app/            globals.css (tokens, .iri, layout tokens), layout.tsx (fonts via next/font), page.tsx
  components/
    Home.tsx      orchestrator
    chapters/     Film (grain + vignette), TopBar, Hero (dust + name decrypt),
                  Experience (4 chapters), Projects (three-up sheet), Origin
    chapters/scenes/  AisleScene, PhoneScene, RaceScene, OrbitScene (three.js, one per role),
                      sceneLight.ts (the scenes' light color, read from the accent tokens)
    new/          Skills (table), Footer (05 Contact table + one-line footer)
    new/visuals/  the eight project card visuals (+ draftmaster/ and centavo/ logic, unit-tested)
  data/portfolio.ts   content source (experiences, projects, skills, education, contact)
scripts/copy-lint.mjs deterministic copy-rule check (em dashes)
scripts/export-draftmaster-matches.mjs regenerates the DraftMaster replay data
```

Section order: TopBar · Hero · 01 Experiences (four chapters) · 02 Projects · 03 Origin · 04 Skills · 05 Contact (the footer).
The top bar is translucent: name left, three section links centered, Contact right. No PDF is linked from the site.

## Verification gate

`npm run build` · `npm test` · `npm run lint` · `npm run copy-lint` · browser pass via the
`portfolio-dev` preview (console clean, scenes and visuals animate in view, reduced-motion
shows a static frame, no horizontal overflow at 390 px). Details in the `verify` skill.
Never run `next build` while a dev server is up on the same checkout.

## Commands

`npm run dev` · `npm run build` · `npm test` · `npm run lint` · `npm run copy-lint`
