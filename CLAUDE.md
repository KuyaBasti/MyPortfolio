# Portfolio — John Sebastian Solon

## Overview
Personal portfolio website for **John Sebastian Solon**, a Software & Embedded Engineer. CSE @ UC Davis, graduated June 2025. The site showcases both software engineering and embedded/firmware work to avoid being pigeonholed as only one or the other.

**Live at:** johnsolon.com
**GitHub:** github.com/KuyaBasti
**LinkedIn:** linkedin.com/in/jssolon
**Email:** jsvsolon@gmail.com
**Phone:** 530-936-3456

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion (installed as `motion` package)
- **Fonts:** Inter (Google Fonts) + JetBrains Mono (Google Fonts, for mono labels)
- **Deployment:** Vercel

### Removed from old design (do NOT use)
- ~~Dark theme (#050505 / Sora)~~ (replaced by the light "space between" direction below)
- ~~ClashDisplay / Fira Code fonts~~ (template fingerprint; local font files deleted)
- ~~MUI / Material UI~~ (unnecessary weight)
- ~~Three.js~~ (only used for icon cloud, not worth the bundle size)
- ~~Emotion CSS-in-JS~~ (came with MUI)
- ~~Floating pill-style navbar~~ (template fingerprint)
- ~~Vertical timeline component~~ (template fingerprint)
- ~~Wave gradient background~~ (template fingerprint)

## Design Direction
**Light, Apple-inspired "the space between hardware and software."** A hybrid combining:
1. **Apple-style cinematic hero** — centered, light, large iridescent gradient headline over a page-wide ambient pastel-blob backdrop
2. **Cinematic sticky-scroll experience scenes** — each role pins full-viewport with bespoke looping CSS visuals (server racks, PCB + soldering iron, F1 car + LiDAR, orbiting satellite), alternating text/visual sides
3. **Light glass bento for projects** — "Selected work" strip, 12-col grid with iridescent edge rings and animated headers
4. **Clean minimal sections** — About + Skills over the ambient backdrop, generous whitespace

The approved reference is "Mockup 6 — Hybrid" (the single-file HTML the redesign was built from). Older mockups in `mockups/` are superseded.

### Design Tokens
```
Background (--bg):        #fafaff
Text primary (--ink):     #1d1d1f
Text soft (--ink-soft):   #515154
Text muted (--ink-muted): #6e6e73
Text faint (--ink-faint): #86868b
Hairline (--hairline):    rgba(0,0,0,0.06)
Accent / CTA (--accent):  #0071e3  (hover #0077ed)
Iridescent gradient (--iri):
  linear-gradient(120deg, #5e7dff 0%, #bf5af2 40%, #ff6680 70%, #ff9f0a 100%)
  (animated via @keyframes iriShift; use the .iri text helper)
Backdrop blobs:           #b5cfff #f4c8ff #ffd6c8 #c8ffe2 #ffe9b8 (blurred 120px)
Scene/dot accents:        green #34c759 · pink #ff6680 · orange #ff9f0a · indigo #5e7dff
```

Design tokens live as CSS variables in `src/app/globals.css`. Per-section bespoke
animation CSS lives in scoped `<style>` blocks inside each component (Experience,
Projects, Contact). All looping animations are gated behind
`@media (prefers-reduced-motion: reduce)`.

### Typography Scale
```
Hero heading:     clamp(56px, 9vw, 112px), weight 600, tracking -0.025em (Inter)
Scene title:      clamp(48px, 6vw, 88px), weight 600, tracking -0.03em (Inter)
Section heading:  clamp(32-40px ...), weight 600, tracking -0.025em (Inter)
Card title:       24px, weight 600 (Inter)
Body / scene-desc:19-20px, color --ink-soft, line-height 1.5-1.6 (Inter)
Card body:        15px, color --ink-soft (Inter)
Tech labels:      11-12px, monospace (JetBrains Mono via .mono)
Section number:   13px, uppercase, monospace, color --accent (JetBrains Mono)
Nav links:        13px (Inter)
```

### Spacing
```
Section padding:  ~112px (py-28) vertical, 22-32px horizontal
Max content width:1100px (1280px for the projects bento)
Scene height:     200vh wrapper, 100vh sticky inner (stacks on <=880px)
Bento grid gap:   16px
Card padding:     28-30px (bento), 22-24px
Card border-radius:32px (card-frame), 28px (bento), 24px (skills), 999px (pills)
```

## System Architecture

### File Structure (target)
```
src/
├── app/
│   ├── globals.css          # Light design tokens (CSS vars), .iri helper, ambient blob backdrop, iriShift/float keyframes
│   ├── layout.tsx           # Root layout with Inter + JetBrains Mono fonts
│   └── page.tsx             # Renders <Home />
├── components/
│   ├── Backdrop.tsx         # Page-wide drifting pastel blobs (fixed, z-index -1)
│   ├── Home.tsx             # Orchestrator: renders all sections in order
│   └── new/                 # All section components live here
│       ├── Navbar.tsx       # Fixed light glass bar + mobile menu
│       ├── Hero.tsx         # Apple-style hero, iridescent headline, scroll hint
│       ├── Highlights.tsx   # 3-stat strip (iridescent numbers)
│       ├── Experience.tsx   # 4 cinematic sticky-scroll scenes (scoped <style>)
│       ├── Projects.tsx     # Light glass bento, 6 featured cards (scoped <style>)
│       ├── About.tsx        # Bio + education/location/focus facts
│       ├── Skills.tsx       # 2x2 glass category grid (from portfolio.ts)
│       ├── Contact.tsx      # Large CTA + Say hello / GitHub / LinkedIn
│       └── Footer.tsx       # Minimal glass footer
└── data/
    └── portfolio.ts         # Content source: experiences, projects, skills, education, contact
```

### Data Flow
```
portfolio.ts (content source)
       │
       ▼
   Home.tsx (orchestrator) → Backdrop, Navbar, Hero, Highlights,
                             Experience, Projects, About, Skills, Contact, Footer

NOTE: Skills/About read from portfolio.ts. Experience and Projects currently
hold their curated, editorialized copy + bespoke visuals INLINE (the 4 featured
scenes / 6 featured cards), because each has hand-tuned animation markup that
doesn't map cleanly onto the generic data shape. portfolio.ts remains the
canonical record of every role/project; keep the two in sync when content changes.
```

### Component Pattern
Section components are `"use client"`, use `motion` for whileInView reveals, the
`.iri` helper for iridescent text, and `--*` CSS variables for color. Sections that
need bespoke looping visuals (Experience, Projects, Contact) keep their CSS in a
scoped `<style>` block at the end of the component, and gate every animation behind
`@media (prefers-reduced-motion: reduce)`. Section headers use a monospace number
eyebrow (`.mono`, color `--accent`, e.g. `03 — About`) followed by a clamp-sized
heading with an `.iri` phrase.

## Page Section Order
1. **Navbar** — fixed, always visible
2. **Hero** — full viewport, cinematic
3. **Experience** — section 01 (COMES FIRST, not projects)
4. **Projects** — section 02, bento grid
5. **About** — section 03
6. **Skills** — section 04
7. **Contact** — final CTA

## Content Inventory

### Education
- University of California, Davis — Davis, CA
- Bachelor of Science in Computer Science and Engineering
- Graduated June 2025

### Experiences (4 featured as cinematic scenes, newest first)

> The live site features these 4 roles as sticky-scroll scenes (source of truth:
> `portfolio.ts`). Rukmer Inc. and American Lost Children Association were dropped
> from the curated set — re-add them to `portfolio.ts` + an Experience scene if
> they should reappear.

#### 1. Test Technician — Quanta Manufacturing  ← CURRENT
- **Dates:** April 2026 – Present
- **Location:** Fremont, CA
- **Bullets:**
  - Support qualification and high-volume production of servers/rack systems — deploying test equipment, managing cable infrastructure, validating networking including PXE boot.
  - Analyze hardware failures and test data with Linux + Python to troubleshoot defects, improve yields, and produce diagnostic logs.
  - Collaborate with corporate R&D to install/verify new test scripts, write process instructions (TPI), and enhance quality methods.
- **Scene:** `tint-quanta` — server racks with blinking LEDs + packet streams

#### 2. Electronics Technician — ubreakifix by Asurion
- **Dates:** July 2025 – April 2026
- **Location:** Yuba City, CA
- **Bullets:**
  - Diagnosed and repaired consumer electronics including smartphones, tablets, laptops, and game consoles.
  - Board-level repairs including HDMI port replacement, fine-pitch soldering, and power/I/O troubleshooting using schematics and rework tools.
- **Scene:** `tint-ubif` — PCB with traces + hovering soldering iron + spark

#### 3. Software Engineer Intern — UCD CORE Lab – F1Tenth
- **Dates:** January 2025 – July 2025
- **Location:** Davis, CA
- **Bullets:**
  - Developed a ROS2-based autonomous racing platform achieving 20+ mph with Monte Carlo localization (1000+ particles at 40 Hz) and real-time obstacle avoidance.
  - Built perception and planning pipelines using synchronized LiDAR-camera data, CNN-based segmentation, and SLAM map processing, improving lap consistency by 30%.
- **Scene:** `tint-f1` — race car on track with LiDAR sweep + speed lines

#### 4. Firmware Engineer — NASA Space and Satellite Systems
- **Dates:** September 2023 – January 2025
- **Location:** Davis, CA
- **Bullets:**
  - Developed bare-metal ASM330LHH IMU drivers in C supporting I2C and SPI across multiple flight board revisions, including register-level configuration and sensor scaling.
  - Implemented dual-IMU redundancy with runtime sensor selection, health checks, and per-unit calibration, improving attitude sensing reliability by 40%.
  - Designed high-rate sensor acquisition and interrupt-driven logging using FreeRTOS and hardware timers, achieving 6.6 kHz telemetry with 99.9% timing accuracy.
- **Scene:** `tint-nasa` — orbiting satellite with signal pulses and twinkling stars

### Projects (6 total)

#### 1. DUAL! Inspired Game ★ FEATURED (spans 2 columns)
- **GitHub:** github.com/KuyaBasti/DUAL-Game
- **Tech:** C, ARM Cortex-M4, CC3200, SPI, I2C, UART, Flask, AWS IoT, Lambda
- **Description:** A two-player real-time embedded game on CC3200 MCUs with SPI OLED rendering and a custom UART protocol for synchronized gameplay. Tilt-based controls using an I2C accelerometer, IR remote input for username entry, and state-driven game logic with ammo cooldowns. AWS IoT + Lambda for cloud score persistence via Flask backend.
- **Animation concept:** Two mini OLED screens side by side with triangle ships shooting projectiles across them, connected by a UART data line

#### 2. Robotic Arm Controller
- **GitHub:** github.com/KuyaBasti/RoboticArm
- **Tech:** C++, G-Code, Serial RS-232, Inverse Kinematics
- **Description:** A 2-link planar robotic arm that interprets G-code commands (G00, G01, G02, G03) for precision drawing. Real-time inverse kinematics, linear and circular arc interpolation, and servo motor control via RS-232.
- **Animation concept:** Animated arm swinging back and forth with G-Code text scrolling

#### 3. Parallel Edge Detection
- **GitHub:** github.com/KuyaBasti/ParallelEdgeDetection
- **Tech:** C++, OpenMP, Intel SIMD, CUDA, CMake, Google Test
- **Description:** Image processing pipeline implementing Sobel edge detection with multiple parallelization strategies. Gaussian blur → gradient calculation → edge extraction, with sequential, OpenMP+SIMD, and CUDA GPU implementations.
- **Animation concept:** Pixel grid on left transforming to edge outline on right, with thread activity bars

#### 4. DNS Resolver
- **GitHub:** github.com/KuyaBasti/DNSResolver
- **Tech:** Go, DNS protocol, Concurrency (RWMutex), Caching
- **Description:** Thread-safe recursive DNS resolver with hash-partitioned cache. Supports A, AAAA, NS, CNAME, SOA, PTR records. CNAME chain following, root server bootstrap, recursion loop prevention, smart nameserver selection.
- **Animation concept:** DNS lookup nodes (root → TLD → auth → result) lighting up in sequence

#### 5. Salary Prediction Model
- **GitHub:** github.com/KuyaBasti/SalaryPredictionModel
- **Tech:** Python, scikit-learn, Flask, Pandas, Jupyter
- **Description:** ML pipeline predicting salaries from demographics (age, gender, education, experience, country, race). Multiple algorithms compared. Web interface for predictions. 6,684 records, salary range $350–$250K.
- **Animation concept:** Scatter plot dots appearing with regression line drawing through them

#### 6. Aggie Reminder
- **GitHub:** github.com/KuyaBasti/Aggie-Reminder-
- **Tech:** Node.js, Express, PostgreSQL, SendGrid, Google Apps Script
- **Description:** Volunteer management system built at HackDavis 2024. Tracks volunteer hours, sends automated email reminders 2 days before events, admin dashboard, Excel import.
- **Animation concept:** Notification cards sliding in with timestamps

### Technical Skills

**Languages:** C, C++, Java, Python, Go, Assembly, CUDA, JavaScript, TypeScript, SQL, Bash, CSS, Kotlin, C#

**Frameworks:** ROS2, Phoenix LiveView, Node.js, React, Flask, Unity, TensorFlow, PyTorch, OpenCV, Docker, PostgreSQL/PostGIS

**Cloud/Infra:** AWS IoT, S3, CloudFront, Cognito, Lambda, Route 53, Terraform

**Protocols/APIs:** REST, gRPC, WebSockets, SPI, I2C, UART, CAN, USB, BLE, Google Maps API

## Commands
```bash
npm install     # install dependencies
npm run dev     # dev server at localhost:3000
npm run build   # production build
npm run lint    # ESLint
```
