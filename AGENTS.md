# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 15 portfolio website** — a single-page, purely client-side application with no backend, database, or external services.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (serves on `http://localhost:3000`) |
| Lint | `npm run lint` |
| Build | `npm run build` |

- No `.env` files, secrets, or external services are required.
- No automated test suite exists in this project; validation is done via lint and build.
- The dev server supports hot reloading — file edits are reflected immediately in the browser.
