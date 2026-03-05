# Implementation Plan

Step-by-step guide for rebuilding the portfolio. **One commit per step. Test after every commit.**

## Phase 1: Foundation

### Commit 1 — Add new fonts
**Files:** `src/app/layout.tsx`

Import `Sora` (weights 300–700) and `JetBrains_Mono` (weights 400, 500) using `next/font/google`. Apply Sora as the default body font via CSS variable `--font-sora`. Export JetBrains Mono as `--font-mono`. Add both variables to the `<body>` className.

Do NOT remove old fonts yet — just add the new ones alongside.

### Commit 2 — Create portfolio data layer
**Files:** `src/data/portfolio.ts`

✅ Already done. Verify the file exists with all experiences, projects, skills, education, contact, and about data.

## Phase 2: Build new components

### Commit 3 — Create globals.css for new design
**Files:** `src/app/globals.css`

Add new CSS custom properties for the dark color scheme. Add ALL `@keyframes` animations for project cards (dual-screens, robotic-arm, edge-detection, dns-lookup, ml-scatter, notifications) and experience cards (circuit-repair, drone-firmware, map-routing, racecar-lidar, satellite-orbit). Keep old styles temporarily so the old design doesn't break yet.

Reference `mockups/complete-mockup.html` for the exact CSS animation code.

### Commit 4 — Build Navbar
**Files:** `src/components/Navbar.tsx` (new)

Fixed position navbar with:
- "JS." logo (dot in indigo-400) on the left
- Links: Experience, Projects, About, Skills, Contact on the right
- `backdrop-blur-xl`, `bg-[#050505]/70`, border-bottom `rgba(255,255,255,0.04)`
- Smooth scroll to section IDs on click
- Mobile: hamburger menu (simple, not the old template style)

### Commit 5 — Build Hero
**Files:** `src/components/Hero.tsx` (new)

Full-viewport hero with:
- 4 floating gradient orbs (CSS animated, `filter: blur(120px)`)
- Overline: "SOFTWARE & EMBEDDED ENGINEER"
- H1: "Building at the" + gradient span "intersection of hardware & software"
- Subtitle paragraph
- Two CTA buttons: "View My Work" (glow) + "Resume ↓" (outline)
- Scroll indicator at bottom with pulsing line
- All text uses Framer Motion staggered fadeUp entrance

### Commit 6 — Build Experience section
**Files:** `src/components/Experience.tsx` (new)

Section 01. Maps over `experiences[]` from `portfolio.ts`. Each card:
- Grid layout: date column (160px fixed) + content column
- Company name as a link (indigo color)
- Title and location below
- Bullet points
- Tech pills at bottom
- Subtle background animation matching `animationId`
- Framer Motion scroll-triggered entrance with stagger

### Commit 7 — Build Projects section
**Files:** `src/components/Projects.tsx` (new)

Section 02. Bento grid (3 columns desktop, 2 tablet, 1 mobile). Maps over `projects[]` from `portfolio.ts`. Each card:
- Visual area (220px height) with unique CSS animation matching `animationId`
- Featured card (DUAL!) spans 2 columns with side-by-side layout (visual left, body right)
- Tags with color mapping
- Title, description, tech stack
- Hover: lift up 6px + border brightens (Framer Motion)
- Scroll-triggered entrance

Build each animation scene as a sub-component or inline JSX within the visual area. Reference the CSS from `mockups/complete-mockup.html`.

### Commit 8 — Build About section
**Files:** `src/components/About.tsx` (new)

Section 03. Simple text section. Maps over `about[]` paragraphs. Max-width 640px. Key phrases highlighted in white (`font-weight: 500`). Framer Motion entrance.

### Commit 9 — Build Skills section
**Files:** `src/components/Skills.tsx` (new)

Section 04. 2×2 grid of skill categories. Each category: uppercase monospace title + flex-wrap list of skill pills. Framer Motion entrance with stagger.

### Commit 10 — Build Contact section
**Files:** `src/components/Contact.tsx` (new)

Centered layout:
- "Let's build something together." with "together" in gradient
- Subtitle text
- Row of pill-style link buttons: Email, GitHub, LinkedIn, Resume
- Framer Motion entrance

## Phase 3: Wire up the new design

### Commit 11 — Create new Home orchestrator
**Files:** `src/components/Home.tsx`

Replace the entire Home component:
- Remove all old component imports
- Import new: Navbar, Hero, Experience, Projects, About, Skills, Contact
- Remove old theme toggle logic (dark only for now)
- Remove WaveGradient
- Render sections in order: Navbar → Hero → Experience → Projects → About → Skills → Contact

### Commit 12 — Update globals.css (remove old styles)
**Files:** `src/app/globals.css`

Remove:
- Old CSS custom properties (`:root, .dark`, `.light`)
- Wave gradient classes and keyframes
- Hamburger CSS
- `gradient-dance` and `animate-gradient-dance`
- Old font-face declarations (ClashDisplay, Fira Code)

Keep:
- New dark color scheme
- All @keyframes for card animations
- Tailwind import

### Commit 13 — Update layout.tsx
**Files:** `src/app/layout.tsx`

- Remove old font imports if any
- Update metadata title/description
- Ensure Sora and JetBrains Mono are properly applied
- Remove Analytics if not needed during dev (can re-add later)

## Phase 4: Cleanup

### Commit 14 — Delete old components
**Files:** Delete these:
- `src/components/AboutHero.tsx`
- `src/components/About.tsx` (old one, replaced)
- `src/components/Work.tsx`
- `src/components/Education.tsx`
- `src/components/SkillSection.tsx`
- `src/components/Projects.tsx` (old one, replaced)
- `src/components/Contact.tsx` (old one, replaced)
- `src/components/Navbar.tsx` (old one, replaced)
- `src/components/ui/AnimatedCard.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/FlipText.tsx`
- `src/components/ui/FloatingNavbar.tsx`
- `src/components/ui/Gradient.tsx`
- `src/components/ui/IconCloud.tsx`
- `src/components/ui/TacetMark.tsx`
- `src/components/ui/TextDecoder.tsx`
- `src/components/ui/TextGenerate.tsx`
- `src/components/ui/TextHover.tsx`
- `src/components/ui/TextSlider.tsx`
- `src/components/ui/Timeline.tsx`

### Commit 15 — Delete old hooks and fonts
**Files:** Delete these:
- `src/hooks/useActive.ts`
- `src/hooks/useMouse.ts`
- `src/fonts/` (entire directory — ClashDisplay and FiraCode files)

### Commit 16 — Remove unused dependencies
**Files:** `package.json`

Run:
```bash
npm uninstall three @types/three @mui/material @mui/icons-material @emotion/react @emotion/styled lucide-react
```

Then `npm install` and verify `npm run build` still works.

### Commit 17 — Final lint and type check
Run:
```bash
npm run lint
npm run build
```

Fix any remaining issues. This should be a clean build with zero warnings.

## Phase 5: Polish (optional, after core is done)

### Commit 18 — Add responsive design
Test and fix all breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px). Bento grid collapses, experience cards stack, hero text shrinks, navbar gets hamburger.

### Commit 19 — Add dark/light theme toggle
Add a theme toggle to the navbar. Define light mode colors in globals.css. Persist preference in localStorage.

### Commit 20 — Performance optimization
- Add `loading="lazy"` to any images
- Verify Lighthouse score
- Check bundle size (should be much smaller without MUI/Three.js)
- Add `<meta>` tags for SEO

### Commit 21 — Deploy
Push to main branch. Vercel auto-deploys. Verify at johnsolon.com.
