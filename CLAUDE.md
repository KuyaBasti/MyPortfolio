# Portfolio — John Sebastian Solon

## What this is
Personal portfolio website for John Sebastian Solon, a Software & Embedded Engineer (CSE @ UC Davis, graduated June 2025). Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

## Design direction
We are rebuilding the portfolio with a new design. The interactive mockups are in `mockups/`. The final approved design is `mockups/complete-mockup.html` — a hybrid of:
- **Cinematic hero** (full-viewport, floating gradient orbs, gradient text)
- **Animated bento grid** for projects (each project card has a unique CSS/Framer Motion animation)
- **Clean minimal sections** for experience, about, skills, contact (inspired by nize.ph)

## Architecture
- All portfolio content lives in `src/data/portfolio.ts` — the single source of truth for experiences, projects, skills, education, and contact info. Never hardcode content in components.
- New components go in `src/components/new/` during the rebuild. Old components in `src/components/` will be removed once the new ones are wired in.
- Fonts: Sora (headings/body) and JetBrains Mono (code/tech labels). NOT ClashDisplay.
- Color scheme: dark (#050505 background), with purple/blue/pink gradient accents.

## Section order
1. Hero (cinematic, full viewport)
2. Experience (comes FIRST — not projects)
3. Projects (bento grid with animations)
4. About
5. Skills
6. Contact

## Important distinctions
- **DARC (F1Tenth) and NASA are EXPERIENCES, not projects.** They go in the experience section.
- **DUAL! Game is a PROJECT** and should be the featured (large) card in the bento grid.
- The portfolio should show BOTH embedded/firmware AND software engineering — not just one.

## Experiences (from resume)
1. IT — ubreakifix by Asurion (Dec 2025 – Present)
2. Software Engineer — Rukmer Inc. (Sep–Nov 2025)
3. Software Engineer — American Lost Children Association (Jul–Sep 2025)
4. Software Engineer — UCD CORE Lab, F1Tenth (Jan–Jul 2025)
5. Firmware Engineer — NASA Space and Satellite Systems (Sep 2023 – Jan 2025)

## Projects (from GitHub: github.com/KuyaBasti)
1. DUAL-Game — multiplayer embedded game (CC3200, UART, I2C, AWS IoT) ★ featured
2. RoboticArm — G-code robotic arm controller (C++)
3. ParallelEdgeDetection — OpenMP, SIMD, CUDA edge detection (C++)
4. DNSResolver — recursive DNS resolver (Go)
5. SalaryPredictionModel — ML salary predictor (Python)
6. Aggie-Reminder- — volunteer management, HackDavis 2024 (Node.js)

## Commands
- `npm install` — install dependencies
- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint checks

## Rules
- One commit per logical change. Small, atomic commits.
- Test after every change (`npm run dev` + check browser).
- Pull content from `src/data/portfolio.ts`, never hardcode in components.
- Use Framer Motion for animations, not raw CSS keyframes (except for always-running background animations in project cards).
- No MUI, no Three.js, no ClashDisplay font in the new design.
