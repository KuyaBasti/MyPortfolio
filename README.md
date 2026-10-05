# John Sebastian Solon · Portfolio

**A dark Neo/Matrix portfolio that boots like a machine and proves its claims like a resume.** Live at [johnsolon.com](https://johnsolon.com).

First visit: a decryption boot sequence plays (handshake, key decrypt, ACCESS GRANTED), docks itself into a macOS-style terminal, and types a real shell session. Behind everything, a calm "streams" of Matrix code rains down. Every job and project gets its own hand-built canvas animation: a satellite bound for orbit, a two-screen space shooter, a LiDAR race car, a recursive DNS walk, a Dota 2 match replayed from real engine output. No stock art, no screenshots, no template.

> **Status:** live in production on Vercel. All four experience scenes and all seven project cards have bespoke visuals. Every number on the site matches the September 2026 resume, or, for projects not on it (DraftMaster), the project's own repo. One newer project (Centavo) does not have a card yet.

## Table of Contents

- [What It Is](#what-it-is)
- [How a Visit Works, End to End](#how-a-visit-works-end-to-end)
- [Repository Map](#repository-map)
- [Design Principles](#design-principles)
- [Project Status](#project-status)
- [Documentation](#documentation)

## What It Is

A single-page Next.js 15 (App Router) site: **Navbar · Hero · Experience (01) · Projects (02) · About (03) · Skills (04) · Contact**, all rendered over a page-wide ambient rain backdrop.

- **Hero**: split layout. Big iridescent headline on the left, a working terminal on the right that types `whoami`, `cat role.txt`, and `./launch_portfolio.sh`. The boot intro plays **once per session** and is skippable; returning visitors land on the completed session instantly (replay with `?intro=play`).
- **Experience**: four full-viewport scenes (Quanta, uBreakiFix, F1Tenth, NASA), each pairing curated copy with a bespoke animated visual: a rack validation wave, a phone screen repair, a particle-filter LiDAR map, a satellite over Earth.
- **Projects**: a seven-card bento grid where every card header is a live canvas: the DUAL! two-screen shooter, a G-code console plotter, a parallel Sobel row sweep, a recursive DNS resolution walk, a neural-net forward pass, a Postgres-to-SendGrid reminder pipeline, and DraftMaster's minimap replaying three real engine-simulated matches (one draft on two seeds with opposite winners, then a new draft).
- **Claims**: every metric shown (**4,000 particles, 240K ray casts per update**, **100 ms deterministic cadence**, **~15x on the CPU engine**, **160 to 400+ racks/mo**) comes from the resume, which is the source of truth.

## How a Visit Works, End to End

```
URL hit
  |
  v
layout.tsx inline <head> script (runs BEFORE paint)
  |  checks: sessionStorage introPlayed? | ?intro=play | prefers-reduced-motion
  v
html.intro-on ----------------------------> html.intro-off
  |                                            |
  v                                            v
boot overlay: rain + static +               hero renders docked:
handshake -> decrypt key ->                 completed terminal session,
ACCESS GRANTED glitch                       zero intro animation
  |
  v
overlay docks into the hero terminal frame
  |
  v
typewriter replays the real session, hero copy fades in
  |
  v
scroll: each canvas visual wakes only while on-screen
        (IntersectionObserver), pauses off-screen,
        and renders a static frame under reduced-motion
```

## Repository Map

| Path | What |
| --- | --- |
| `src/app/` | `globals.css` (design tokens, `.iri`, backdrop), `layout.tsx` (fonts + pre-paint intro gate), `page.tsx` |
| `src/components/Backdrop.tsx` | Page-wide streams-rain canvas: throttled, tab-paused, reduced-motion safe |
| `src/components/Home.tsx` | Section orchestrator |
| `src/components/new/` | `Navbar`, `Hero` (intro + terminal), `Experience` (4 scenes), `Projects` (bento grid), `About`, `Skills`, `Contact`, `Footer` |
| `src/components/new/visuals/` | The eleven bespoke canvas/SVG visuals (4 scene + 7 card) |
| `src/components/new/visuals/draftmaster/` | DraftMaster replay: pure, unit-tested logic ported from DraftMaster's Match Viewer (`replay.ts`) and the exported match data (`matches.ts`, generated) |
| `scripts/export-draftmaster-matches.mjs` | Regenerates `matches.ts` from DraftMaster's real sim files (`node scripts/export-draftmaster-matches.mjs ../DotaAnalysis`) |
| `src/data/portfolio.ts` | Canonical content record: experiences, projects, skills, education, contact |
| `public/` | Static assets |

## Design Principles

- **One dark world.** Near-black `#05070a`, phosphor green `#28c840`/`#9dffc4`, a cooler iridescent gradient for display type. The boot logs you in and you stay in the machine: no theme flips, no white flashes.
- **The visuals are the proof.** Each scene/card animation depicts the actual work (the real protocol, the real pipeline), not decoration. HUD labels carry real numbers.
- **Animation earns its frame.** Every loop is gated by IntersectionObserver, paused off-screen or on hidden tabs, and resolves to a designed static frame under `prefers-reduced-motion`.
- **SSR-safe by construction.** Any render-time randomness uses a seeded RNG (mulberry32) so server and client markup match: no hydration mismatches, no `Math.random()` in render paths.
- **Resume is the source of truth.** If the site and the resume disagree, the site is wrong.
- **Copy rule:** no em dashes in visible text. En dashes only for date ranges.
- **Ship via PR.** Branch, PR, merge; merging `main` deploys to johnsolon.com through Vercel. Never commit straight to main.

## Project Status

| Stage | What | Status |
| --- | --- | --- |
| Dark Neo/Matrix redesign | Full visual system: tokens, backdrop, dark sections | ✅ |
| Decryption boot intro | Pre-paint gate, boot overlay, dock, typed session | ✅ |
| Experience scene visuals | QuantaRack, UbreakifixScreen, F1Lidar, NasaSatellite | ✅ |
| Project card visuals | DualGame, RoboticArm, ParallelEdge, DnsResolver, SalaryModel, AggiePipeline | ✅ |
| Resume sync | All site claims reconciled to the Aug 2026 resume, then re-synced to the Sept 2026 resume | ✅ |
| DraftMaster card | Dota 2 draft simulator card, replaying real engine output on a minimap | ✅ |
| Centavo card | Local-first finance tracker card + bespoke visual | ⬜ |

## Documentation

- [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md): the developer map. Architecture flowchart, the flows that matter, a full render trace, subsystem deep dives, and the design-decision log.
- [CLAUDE.md](CLAUDE.md): working agreements for AI-assisted development on this repo (identity, copy rules, structure, commands).
