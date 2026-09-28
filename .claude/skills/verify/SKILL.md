---
name: verify
description: Verification gate for any change that renders. Build, lint, copy-lint, and a browser pass over the dev preview. Use before shipping and after any visual or copy change.
---

# Verify

Run all four checks. Report results honestly; a failed check is a finding to fix,
never something to soften or skip past.

## 1. Static checks

- `npm run build` (must compile; also catches SSR/client mismatches in visuals)
- `npm run lint`
- `npm run copy-lint` (no em dashes in visible text)

## 2. Browser pass

Start (or reuse) the `portfolio-dev` preview:

- Console: zero errors after a full scroll from top to bottom
- The changed area: screenshot it and confirm the animation actually runs
  (IntersectionObserver-gated loops start only when scrolled into view)
- Reduced motion: emulate `prefers-reduced-motion: reduce` and confirm a static
  frame renders, not a blank canvas
- Mobile width (375px): the changed section does not overflow or collapse

## Gotchas

- **Never `rm -rf .next` while the dev server is running.** It corrupts the build
  ("site can't be loaded"). Stop the server first, or leave `.next` alone.
- Canvas visuals render nothing until observed: scroll them into view before
  judging a screenshot.
