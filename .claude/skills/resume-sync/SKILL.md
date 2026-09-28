---
name: resume-sync
description: Audit every claim on the site against John's resume, the single source of truth for facts. Use when John provides a new resume or asks whether the site matches it.
---

# Resume Sync

The resume is the only source of truth for factual claims. The site may say less
than the resume, never more, and never different numbers.

1. Ask for (or locate in chat) the latest resume. Never use an old copy from disk
   without confirming it is current.
2. Extract every factual claim: titles, employers, dates, metrics, tech, project stats.
3. Cross-check all the places claims live:
   - `src/data/portfolio.ts` (canon)
   - `Experience.tsx` scene copy
   - `Projects.tsx` card copy
   - `About.tsx`, `Skills.tsx`, and the `Hero.tsx` terminal lines
4. Report a table of mismatches: site says / resume says / where. Spawn
   `claim-auditor` agents in parallel for claims that need repo evidence.
5. Fix one item at a time with John's pick on wording. Never bundle rewrites.

Rule: reformulate, never fabricate. If a nice-sounding claim has no resume or repo
backing, it does not go on the site.
