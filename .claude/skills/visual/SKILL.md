---
name: visual
description: Design or rework a bespoke animated canvas visual for a project card or experience scene. Runs the full loop, deep-read the real project repo, build 3 HTML prototypes, John picks one, port to a component, verify, ship. Use when John asks for a new card visual, a scene rework, or to make a section's animation better.
argument-hint: "[project or scene name]"
---

# Visual Loop

Every bespoke visual on this site went through this loop. Do not skip steps.

## Step 0: Understand the real project (mandatory gate)

Never design from the project title. Launch `repo-scholar` on the project's actual
repository (look in `~/Documents/Programming/` first, then ask). Present to John:

- What the project actually is and how it works
- Verified metrics with evidence (file paths, numbers found in code or data)
- 2-3 candidate "stories" the visual could celebrate

**Stop and wait.** John confirms the understanding and picks the story. The DUAL!
lesson: a visual that misrepresents the project is worse than no visual.

## Step 1: Three prototypes

Build 3 standalone HTML files in `public/prototypes/` (gitignored, local only):

- Each explores a genuinely different direction, not 3 variants of one idea
- Use the shared harness (`_proto.css`, `_rain.js`) if present; otherwise inline a
  240px-tall dark stage matching the card's background palette
- Prototype code follows the same canvas contract as production (Step 3), so the
  winner ports cleanly

Launch up to 3 `proto-builder` agents in parallel, one per direction, each with a
brief containing the verified facts and the chosen story.

## Step 2: John picks

Open the prototypes in the browser preview, screenshot each, and present them side
by side with one line on what each celebrates. **Stop and wait for the pick.**
Iterate on the picked one if John wants changes.

## Step 3: Port to a component

Create `src/components/new/visuals/<Name>.tsx` following the house canvas contract:

- `"use client"`, single `<canvas>` in a wrapper div, scoped `<style>` block
- DPR-aware sizing, capped at 2x
- Animation loop: `setInterval(render, 30)`, started and stopped by an
  `IntersectionObserver` on the wrapper (never animate off-screen)
- Seeded RNG (`mulberry32`) for anything random, so SSR and client agree
- `@media (prefers-reduced-motion: reduce)`: render one static, representative frame
- Full cleanup on unmount: interval, observer, resize listener
- Global colors from CSS tokens where possible; the per-visual palette stays inside
  the component

Wire it into `Projects.tsx` (or the Experience scene), then delete the prototypes.

## Step 4: Verify and ship

Run the `verify` skill, then the `ship` skill. If the card copy changed, update
`src/data/portfolio.ts` to match (keep canon in sync). PR title pattern:
`<Project> card: <visual name> visual`.
