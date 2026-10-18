# John Sebastian Solon · Portfolio

**A dark, iridescent portfolio told in chapters, that proves its claims like a resume.** Live at [johnsolon.com](https://johnsolon.com).

The name decrypts out of cipher glyphs over a drifting dust field. Each job is a chapter: curated copy on the left, a real-time 3D scene on the right that plays on its own clock, built from the actual work: a server aisle with a PXE boot wave, a phone taken apart and tested, a race car lapping with its LiDAR fan, a CubeSat drifting above the Earth limb. Every project card is a live canvas depicting the real system. An Origin chapter tells the story from the Philippines to California, in Baybayin and English. No stock art, no screenshots, no template.

> **Status:** live in production on Vercel. Four chapter scenes and all eight project cards have bespoke visuals. Every number on the site matches the September 2026 resume, or, for projects not on it (DraftMaster), the project's own repo. Centavo stays private (no repo link, synthetic numbers only).

## Table of Contents

- [What It Is](#what-it-is)
- [How a Visit Works, End to End](#how-a-visit-works-end-to-end)
- [Repository Map](#repository-map)
- [Design Principles](#design-principles)
- [Project Status](#project-status)
- [Documentation](#documentation)

## What It Is

A single-page Next.js 15 (App Router) site: **Top bar · Hero · 01 Experiences (four chapters) · 02 Projects · 03 Origin · 04 Skills · 05 Contact**, on one plain near-black page with a film grain and vignette over everything. Every section sits on the same 1200px column (1120px of content) under a numbered 58px title.

- **Top bar**: a 56px translucent bar with a hairline. The name on the left, three centered links (Experience, Project, Origin) whose lit one follows the section you are in, and Contact on the right, which lands on the footer.
- **Hero**: the role as a mono eyebrow, the name at display size, and one line for the current role. On load the name is scrambled cipher glyphs that lock in left to right into the iridescent gradient; each glyph slot is sized to its real letter, so nothing jitters. The block sits in the top quarter of the screen rather than centered.
- **Experience**: one chapter per role (Quanta, uBreakiFix, F1Tenth, NASA). Copy on the left, a framed three.js scene on the right that animates by itself: the camera glides down a rack aisle while LEDs boot in a wave; a phone opens into its layers, its screen lights up for the test, and it closes again; a 1/10-scale car laps a track with a 61-ray LiDAR fan while the camera alternates between the map and a chase view; a 3U CubeSat drifts in attitude above the limb. Nothing is tied to scroll: you can stop anywhere and scroll back without replaying anything.
- **Projects**: a uniform three-up contact sheet of eight cards, every header a live canvas: the DUAL! two-screen shooter, a G-code console plotter, a parallel Sobel row sweep, a recursive DNS walk, a neural-net forward pass, a Postgres-to-SendGrid reminder pipeline, DraftMaster's minimap replaying three real engine-simulated matches, and Centavo's reconcile-or-reject ledger.
- **Origin**: the name in Baybayin and English, and two paragraphs on growing up in the Philippines, moving to California in 2018, and the rule that came with it.
- **Skills**: a plain table, category on the left, tools in one mono line, hairlines between rows.
- **Contact**: email, GitHub and LinkedIn as a three-row table with an arrow per row, then a one-line footer with Back to top. No PDF is linked from the site.
- **Claims**: every metric shown (**4,000 particles, 240K ray casts per update**, **100 ms deterministic cadence**, **~15x on the CPU engine**, **160 to 400+ racks/mo**) comes from the resume, which is the source of truth.

## How a Visit Works, End to End

```
URL hit
  |
  v
hero renders: eyebrow, the name as cipher glyphs, no layout shift
  |  (glyph boxes are measured from the real letters first)
  v
decrypt: glyphs lock in left to right (~2.6 s), the gradient
         appears per letter, then the current-role line rises
  |
  v
scroll: each chapter's copy rises in once (IntersectionObserver);
        its three.js scene renders only while on screen and only
        while the tab is visible, on its own clock
  |
  v
project cards: each canvas wakes only while on-screen, pauses
        off-screen, and renders a static frame under reduced-motion
```

Under `prefers-reduced-motion`, the name renders finished, the leaks and grain hold still, and every scene and card draws one designed static frame.

## Repository Map

| Path | What |
| --- | --- |
| `src/app/` | `globals.css` (design tokens, `.iri`, layout tokens), `layout.tsx` (Inter, JetBrains Mono and Noto Sans Tagalog via next/font), `page.tsx`, and the JS tab icon (`icon.svg`, `favicon.ico`, `apple-icon.png`) |
| `src/components/Home.tsx` | Section orchestrator |
| `src/components/chapters/` | `Film` (grain + vignette), `TopBar`, `Hero` (dust + name decrypt), `Experience` (4 chapters), `Projects` (three-up sheet), `Origin` |
| `src/components/chapters/scenes/` | The four three.js chapter scenes: `AisleScene`, `PhoneScene`, `RaceScene`, `OrbitScene`, plus `sceneLight.ts`, which gives them the page's accent as their light color |
| `src/components/new/` | `Skills` (table), `Footer` (05 Contact table + one-line footer) |
| `src/components/new/visuals/` | The eight bespoke canvas card visuals |
| `src/components/new/visuals/draftmaster/` | DraftMaster replay: pure, unit-tested logic ported from DraftMaster's Match Viewer (`replay.ts`) and the exported match data (`matches.ts`, generated) |
| `src/components/new/visuals/centavo/` | Centavo's synthetic statement fixture and its reconcile checks, unit-tested |
| `scripts/export-draftmaster-matches.mjs` | Regenerates `matches.ts` from DraftMaster's real sim files (`node scripts/export-draftmaster-matches.mjs ../DotaAnalysis`) |
| `scripts/copy-lint.mjs` | Deterministic copy-rule check (em dashes) |
| `src/data/portfolio.ts` | Canonical content record: experiences, projects, skills, education, contact |
| `public/` | Static assets |

## Design Principles

- **One dark world.** Near-black `#05070a` and one iridescent gradient for the name, the headline phrases, the card rings and the scene frames. The single accent is teal taken from that gradient (`#5eead4`, links `#b7f6ec`), and it is also the light inside the chapter scenes. No green, no theme flips, no white flashes.
- **Nothing moves under the cursor.** Scenes play on their own clocks and never follow the pointer; cards do not lift on hover.
- **The visuals are the proof.** Each scene and card depicts the actual work (the real protocol, the real pipeline), not decoration. The chapter scenes carry no text at all; the facts sit in the copy beside them.
- **Animation earns its frame.** Every loop is gated by IntersectionObserver and `visibilitychange`, paused off-screen or on hidden tabs, and resolves to a designed static frame under `prefers-reduced-motion`. Scenes play on their own clocks; nothing hijacks scroll.
- **SSR-safe by construction.** Any render-time randomness uses a seeded RNG (mulberry32) so server and client markup match.
- **Resume is the source of truth.** If the site and the resume disagree, the site is wrong. Origin adds only what John stated himself.
- **Copy rule:** no em dashes in visible text. En dashes only for date ranges.
- **Ship via PR.** Branch, PR, merge; merging `main` deploys to johnsolon.com through Vercel. Never commit straight to main.

## Project Status

| Stage | What | Status |
| --- | --- | --- |
| Dark Neo/Matrix redesign | Full visual system: tokens, dark sections | ✅ |
| Project card visuals | DualGame, RoboticArm, ParallelEdge, DnsResolver, SalaryModel, AggiePipeline | ✅ |
| Resume sync | All site claims reconciled to the Aug 2026 resume, then re-synced to the Sept 2026 resume | ✅ |
| DraftMaster card | Dota 2 draft simulator card, replaying real engine output on a minimap | ✅ |
| Centavo card | Reconcile-or-reject ledger visual, synthetic fixture, no repo link | ✅ |
| Chapters site | Decrypting hero, four self-playing three.js chapters, three-up project sheet, Origin | ✅ |
| Teal, not green | Every green in the page and the scenes becomes teal from the gradient; gradient scene frames; quieter cards; no pointer sway | ✅ |
| JS tab icon | A JS mark in the gradient replaces the default Next.js favicon | ✅ |

## Documentation

- [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md): the developer map. Architecture flowchart, the flows that matter, a full render trace, subsystem deep dives, and the design-decision log.
- [AGENTS.md](AGENTS.md): working agreements for AI-assisted development on this repo (source of truth, standing rules, structure, commands). `CLAUDE.md` points here.
