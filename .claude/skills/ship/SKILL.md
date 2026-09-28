---
name: ship
description: Ship verified work, feature branch, commit, push, open a GitHub PR to main, then stop. Use when John says ship, deploy, or put it into production, or when work is approved and ready for review. Never merges.
---

# Ship

Merging `main` deploys johnsolon.com via Vercel. This skill therefore ends at the PR.

1. Confirm the `verify` skill passed on the current state.
2. Branch from `main` with a short kebab-case name (`quanta-validation-wave`,
   `docs-refresh`). Never commit directly to `main`.
3. Commit. Message style: `Scope: what changed` (see `git log` for tone).
   **No AI co-author trailers.**
4. Push and open the PR with `gh pr create`: summary of what changed and how it
   was verified.
5. Hand John the PR link and **stop**.

## Hard rule

**Never merge.** Not when CI is green, not when the change is trivial, not when an
earlier PR "was the same". John reviews every PR and merges it himself, or says
explicitly "merge it", per PR. "Ship it" before a PR exists means open the PR,
not merge it.
