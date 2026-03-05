# System Architecture

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        next.config.ts                           │
│                    (Next.js 15, App Router)                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     src/app/layout.tsx                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  • Loads Sora + JetBrains Mono via next/font/google     │   │
│  │  • Imports globals.css                                   │   │
│  │  • Sets <html lang="en"> + antialiased body             │   │
│  │  • Wraps children in font class variables               │   │
│  │  • Includes Vercel Analytics                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      src/app/page.tsx                           │
│                    renders <Home />                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   src/components/Home.tsx                       │
│                      "use client"                               │
│                                                                 │
│  ┌──────────┐                                                   │
│  │ Navbar   │ ← fixed, always visible, backdrop-blur            │
│  ├──────────┤                                                   │
│  │ Hero     │ ← 100vh, floating orbs, gradient text             │
│  ├──────────┤                                                   │
│  │Experience│ ← section 01, scroll-triggered entrance           │
│  ├──────────┤                                                   │
│  │ Projects │ ← section 02, bento grid, per-card animations     │
│  ├──────────┤                                                   │
│  │ About    │ ← section 03, simple text                         │
│  ├──────────┤                                                   │
│  │ Skills   │ ← section 04, 2x2 grid                           │
│  ├──────────┤                                                   │
│  │ Contact  │ ← CTA with gradient text                          │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────┐
│           src/data/portfolio.ts               │
│                                              │
│  ┌─────────────┐  ┌──────────────┐           │
│  │ experiences[]│  │  projects[]  │           │
│  │  (5 items)  │  │  (6 items)   │           │
│  └──────┬──────┘  └──────┬───────┘           │
│         │                │                   │
│  ┌──────┴──────┐  ┌──────┴───────┐           │
│  │  skills[]   │  │   about[]    │           │
│  │(4 categories│  │ (3 paragraphs│           │
│  └──────┬──────┘  └──────┬───────┘           │
│         │                │                   │
│  ┌──────┴──────┐  ┌──────┴───────┐           │
│  │  education  │  │   contact    │           │
│  │  (object)   │  │  (object)    │           │
│  └─────────────┘  └──────────────┘           │
└──────────┬───────────────┬───────────────────┘
           │               │
     ┌─────┴─────┐   ┌────┴─────┐
     ▼           ▼   ▼          ▼
┌─────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐
│Experience│ │Projects │ │ Skills │ │ Contact │
│  .tsx   │ │  .tsx   │ │  .tsx  │ │  .tsx   │
└─────────┘ └─────────┘ └────────┘ └─────────┘

Hero.tsx and Navbar.tsx use static content (no data imports needed)
About.tsx imports about[] from portfolio.ts
```

## Animation Architecture

There are TWO types of animations in the portfolio. They use different technologies for different reasons.

### Type 1: Entrance Animations (Framer Motion)
Triggered once when the element scrolls into view. Used for cards, sections, text.

```
User scrolls
     │
     ▼
viewport intersection detected (whileInView)
     │
     ▼
Framer Motion animates:
  • opacity: 0 → 1
  • translateY: 20px → 0
  • stagger: delay = index * 0.1s
     │
     ▼
Element visible (animation complete, does not repeat)
```

Components using entrance animations:
- Experience.tsx → each experience card fades up on scroll
- Projects.tsx → each bento card fades up on scroll
- About.tsx → paragraphs fade up
- Skills.tsx → category groups fade up
- Hero.tsx → text elements stagger in on page load

### Type 2: Background Loop Animations (CSS @keyframes)
Run continuously inside project/experience card visual areas. Pure CSS for performance.

```
globals.css defines @keyframes:
     │
     ├── @keyframes orbit        → satellite circling earth
     ├── @keyframes racecar      → car bouncing on track
     ├── @keyframes armSwing     → robotic arm moving
     ├── @keyframes dualShoot    → projectiles flying between screens
     ├── @keyframes edgeFlash    → pixel grid cells lighting up
     ├── @keyframes dnsTrace     → nodes lighting in sequence
     ├── @keyframes mlDots       → scatter plot dots pulsing
     ├── @keyframes notifSlide   → notification cards appearing
     ├── @keyframes circuitTrace → circuit paths lighting (ubreakifix)
     ├── @keyframes droneFly     → drone with download bar (Rukmer)
     ├── @keyframes routeDraw    → route path drawing on map (ALCA)
     ├── @keyframes lidarSweep   → LiDAR beam scanning (F1Tenth)
     └── @keyframes signalPulse  → signal rings expanding (NASA)
           │
           ▼
     Card visual areas (<div> with 220px height)
     contain positioned elements using these animations
     Animations run ALWAYS, not just on hover
```

### Why two systems?

| | Framer Motion | CSS @keyframes |
|---|---|---|
| **Purpose** | One-time entrance effects | Continuous background loops |
| **Trigger** | Scroll into view / page load | Always running |
| **Performance** | Re-renders React component | GPU-composited, zero re-renders |
| **Where** | Card containers, sections, text | Inside card visual areas only |

## Card Anatomy

### Experience Card
```
┌──────────────────────────────────────────────────────┐
│ ┌─────────────┐  ┌────────────────────────────────┐  │
│ │             │  │  Company Name (linked)          │  │
│ │  Date       │  │  Title · Location               │  │
│ │  (monospace)│  │                                  │  │
│ │             │  │  • Bullet point 1                │  │
│ │             │  │  • Bullet point 2                │  │
│ │             │  │  • Bullet point 3                │  │
│ │             │  │                                  │  │
│ │             │  │  [pill] [pill] [pill] [pill]     │  │
│ └─────────────┘  └────────────────────────────────┘  │
│                                                      │
│  ░░░░░ subtle background animation (very low opacity)│
└──────────────────────────────────────────────────────┘
```

### Project Bento Card
```
┌────────────────────────────────┐
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │    VISUAL AREA (220px)     │ │
│ │    Contains unique CSS     │ │
│ │    animation for this      │ │
│ │    project (always plays)  │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│  [tag] [tag]                   │
│  Project Name                  │
│  Description text here...      │
│                                │
│  tech · tech · tech · tech     │
└────────────────────────────────┘

Featured card (DUAL! game):
┌───────────────────────────────────────────────────────────┐
│ ┌──────────────────────────┐                              │
│ │                          │  [tag] [tag] [tag]           │
│ │   VISUAL AREA            │  DUAL! — Multiplayer Game    │
│ │   (Two screens with      │  Description text...         │
│ │    ships shooting across) │                              │
│ │                          │  tech · tech · tech          │
│ └──────────────────────────┘                              │
└───────────────────────────────────────────────────────────┘
  ^^^^^^^^^^^^^^^^^ spans 2 columns ^^^^^^^^^^^^^^^^^^^^^^^^^
```

## Responsive Layout

### Desktop (>1024px)
```
┌──────────────────────────────────────────────────┐
│  JS.            Experience  Projects  About  ... │
├──────────────────────────────────────────────────┤
│                                                  │
│            Building at the                       │
│          intersection of                         │
│        hardware & software                       │
│                                                  │
├──────────────────────────────────────────────────┤
│ 01 Experience ──────────────────────             │
│ ┌──────┬─────────────────────────────┐           │
│ │ date │ Company + details           │           │
│ └──────┴─────────────────────────────┘           │
│ ┌──────┬─────────────────────────────┐           │
│ │ date │ Company + details           │           │
│ └──────┴─────────────────────────────┘           │
├──────────────────────────────────────────────────┤
│ 02 Projects ────────────────────────             │
│ ┌────────────────────┬──────────┐                │
│ │  DUAL! (featured)  │ Robotic  │                │
│ │  spans 2 cols      │ Arm      │                │
│ ├──────────┬─────────┼──────────┤                │
│ │ Parallel │ DNS     │ Salary   │                │
│ │ Edge     │ Resolv  │ Predict  │                │
│ ├──────────┴─────────┴──────────┤                │
│ │ Aggie Reminder                │                │
│ └───────────────────────────────┘                │
├──────────────────────────────────────────────────┤
│ 03 About ───────────────────────                 │
│ paragraph text (max-width 640px)                 │
├──────────────────────────────────────────────────┤
│ 04 Skills ──────────────────────                 │
│ ┌──────────────┬──────────────┐                  │
│ │ Languages    │ Embedded     │                  │
│ ├──────────────┼──────────────┤                  │
│ │ Web/Software │ AI/ML/Cloud  │                  │
│ └──────────────┴──────────────┘                  │
├──────────────────────────────────────────────────┤
│     Let's build something together.              │
│     [Email] [GitHub] [LinkedIn] [Resume]         │
└──────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│ JS.              ☰   │
├──────────────────────┤
│   Building at the    │
│   intersection of    │
│ hardware & software  │
│   (smaller text)     │
├──────────────────────┤
│ 01 Experience        │
│ ┌──────────────────┐ │
│ │ date             │ │
│ │ Company          │ │
│ │ details stacked  │ │
│ └──────────────────┘ │
├──────────────────────┤
│ 02 Projects          │
│ ┌──────────────────┐ │
│ │ DUAL! (1 col)    │ │
│ ├──────────────────┤ │
│ │ Robotic Arm      │ │
│ ├──────────────────┤ │
│ │ Parallel Edge    │ │
│ └──────────────────┘ │
│   ... single column  │
├──────────────────────┤
│ 03 About             │
│ 04 Skills (stacked)  │
│ Contact              │
└──────────────────────┘
```

## Build & Deploy Pipeline

```
Local Development:
  npm run dev → Next.js dev server → localhost:3000
  Hot reload on file save

Testing:
  npm run lint → ESLint checks
  npm run build → Full production build (catches type errors)

Deployment:
  git push → Vercel auto-deploys from main branch
  Preview deployments on PR branches
```

## Dependencies (target, after cleanup)

### Keep
- `next` 15.3.5 — framework
- `react` / `react-dom` ^19 — UI
- `motion` ^12 — Framer Motion animations
- `clsx` ^2 — class name utility
- `tailwind-merge` ^3 — Tailwind class dedup
- `@vercel/analytics` ^1 — analytics
- `tailwindcss` ^4 — styling
- `typescript` ^5 — types
- `eslint` / `eslint-config-next` — linting

### Remove (after old components are deleted)
- `three` / `@types/three` — was only for IconCloud
- `@mui/material` / `@mui/icons-material` — not in new design
- `@emotion/react` / `@emotion/styled` — came with MUI
- `lucide-react` — evaluate if still needed, otherwise remove
