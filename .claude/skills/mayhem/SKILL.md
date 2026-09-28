---
name: mayhem
description: Route over-architecture experiments (real shell, live DNS, playable games, ML inference, telemetry) to the private sandbox repo. Use when John says mayhem or asks for ambitious experimental features.
---

# MAYHEM

Ambitious experiments never touch this repo directly. They live in the private
sandbox where mistakes are cheap.

- Sandbox: `../MyPortfolio-experimental` (private). `origin` = the experimental
  repo, `upstream` = this repo. Shared git history so work can graduate cleanly.
- The spec is `MAYHEM.md` in the sandbox (workstreams with stages and exit
  criteria). Work each workstream on its own branch there.
- Dev preview: the `experimental-dev` launch config.
- Discarded workstreams get their branches deleted (local and remote), not left
  to rot.

## Graduation

Work moves to the real repo ONLY when John explicitly approves it after seeing it
run. Then port the final state onto a fresh branch here and follow the `ship`
skill. Never merge sandbox history wholesale.
