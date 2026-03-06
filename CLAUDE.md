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
- **Fonts:** Sora (Google Fonts) + JetBrains Mono (Google Fonts)
- **Deployment:** Vercel

### Removed from old design (do NOT use)
- ~~ClashDisplay / Fira Code fonts~~ (template fingerprint shared with friend)
- ~~MUI / Material UI~~ (unnecessary weight)
- ~~Three.js~~ (only used for icon cloud, not worth the bundle size)
- ~~Emotion CSS-in-JS~~ (came with MUI)
- ~~Floating pill-style navbar~~ (template fingerprint)
- ~~Vertical timeline component~~ (template fingerprint)
- ~~Wave gradient background~~ (template fingerprint)

## Design Direction
The approved design is a hybrid combining:
1. **Cinematic hero** (Option D) — full-viewport, dark, floating gradient orbs, large gradient text
2. **Animated bento grid** (Option A) — for projects, each card has a unique looping animation
3. **Clean minimal sections** (nize.ph inspired) — generous whitespace, simple typography

Interactive mockups are in `mockups/`. The final approved complete mockup is `mockups/complete-mockup.html`.

### Design Tokens
```
Background:       #050505
Card background:  #0a0a0a
Card border:      #151515
Card hover border:#2a2a2a
Text primary:     #f0f0f0
Text secondary:   #888888
Text muted:       #555555
Accent gradient:  linear-gradient(135deg, #60a5fa, #818cf8, #c084fc, #f472b6)
Section numbers:  #818cf8 (indigo)
Green accent:     #4ade80
Pink accent:      #f472b6
Cyan accent:      #22d3ee
Yellow accent:    #fbbf24
Orange accent:    #fb923c
```

### Typography Scale
```
Hero heading:     68px, font-weight 700, letter-spacing -3px (Sora)
Section title:    28px, font-weight 600, letter-spacing -1px (Sora)
Card title:       18px, font-weight 600 (Sora)
Body text:        16px, font-weight 400, line-height 1.9 (Sora)
Card body:        13px, color #666 (Sora)
Tech labels:      10-11px, monospace (JetBrains Mono)
Section number:   13px, monospace (JetBrains Mono)
Nav links:        13px, letter-spacing 0.5px (Sora)
```

### Spacing
```
Section padding:  100px vertical, 40px horizontal
Max content width:1100px, centered
Bento grid gap:   16px
Card padding:     22-24px
Card border-radius:18px (bento cards), 12px (experience cards)
```

## System Architecture

### File Structure (target)
```
src/
├── app/
│   ├── globals.css          # Design tokens, @keyframes for card animations, base styles
│   ├── layout.tsx           # Root layout with Sora + JetBrains Mono fonts
│   └── page.tsx             # Renders <Home />
├── components/
│   ├── Hero.tsx             # Full-viewport cinematic hero with floating orbs
│   ├── Navbar.tsx           # Fixed minimal navbar with backdrop blur
│   ├── Experience.tsx       # All 5 experiences with per-card animations
│   ├── Projects.tsx         # Bento grid with 6 animated project cards
│   ├── About.tsx            # Simple text section
│   ├── Skills.tsx           # 2x2 category grid
│   ├── Contact.tsx          # CTA with gradient text + link buttons
│   └── Home.tsx             # Orchestrator: renders all sections in order
├── data/
│   └── portfolio.ts         # ALL content: experiences, projects, skills, education, contact
└── lib/
    └── utils.ts             # cn() helper (clsx + tailwind-merge)
```

### Data Flow
```
portfolio.ts (single source of truth)
       │
       ▼
   Home.tsx (orchestrator)
       │
       ├── Navbar.tsx (section links)
       ├── Hero.tsx (static content, animations)
       ├── Experience.tsx ← experiences[] from portfolio.ts
       ├── Projects.tsx ← projects[] from portfolio.ts
       ├── About.tsx ← about content from portfolio.ts
       ├── Skills.tsx ← skills[] from portfolio.ts
       └── Contact.tsx ← contact info from portfolio.ts
```

### Component Pattern
Every section component follows this pattern:
```tsx
"use client";
import { motion } from "motion/react";
import { experiences } from "@/data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="max-w-[1100px] mx-auto px-10 py-24">
      {/* Section header with number + title + line */}
      <div className="flex items-center gap-4 mb-12">
        <span className="font-mono text-sm text-indigo-400">01</span>
        <span className="text-3xl font-semibold tracking-tight">Experience</span>
        <span className="flex-1 h-px bg-gradient-to-r from-[#1a1a1a] to-transparent" />
      </div>
      {/* Content */}
      {experiences.map((exp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1 }}
        >
          {/* ... */}
        </motion.div>
      ))}
    </section>
  );
}
```

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

### Experiences (5 total, newest first)

#### 1. IT — ubreakifix by Asurion
- **Dates:** December 2025 – Present
- **Location:** Yuba City, CA
- **Bullets:**
  - Diagnosed and repaired consumer electronics including smartphones, tablets, laptops, and game consoles.
  - Performed board-level repairs including HDMI port replacement, fine-pitch soldering, and power and I/O troubleshooting using schematics and rework tools.
- **Animation concept:** Circuit board traces lighting up, soldering iron spark

#### 2. Software Engineer — Rukmer Inc.
- **Dates:** September 2025 – November 2025
- **Location:** Boston, MA
- **Bullets:**
  - Built a backend pipeline enabling drones to download compatible firmware after hardware replacements, eliminating the need to replace entire units when components changed.
  - Implemented secure, versioned firmware delivery using Phoenix LiveView, presigned S3 uploads, checksum validation, and role-gated installs for staged rollouts.
  - Designed immutable, content-addressed firmware artifacts served via CloudFront, ensuring reproducible deployments and preventing release drift across heterogeneous hardware.
- **Animation concept:** Small drone silhouette with firmware download progress bar / data stream

#### 3. Software Engineer — American Lost Children Association
- **Dates:** July 2025 – September 2025
- **Location:** Yuba City, CA
- **Bullets:**
  - Built a web and mobile dispatch system that computes a single efficient delivery route across multiple locations based on a dispatcher's starting point.
  - Implemented traffic-aware routing with Postgres/PostGIS and Google Directions API, plus offline-first Android support with cached routes and automatic re-sync.
- **Animation concept:** Map with a route being drawn between location pins

#### 4. Software Engineer — UCD CORE Lab – F1Tenth
- **Dates:** January 2025 – July 2025
- **Location:** Davis, CA
- **Bullets:**
  - Developed a ROS2-based autonomous racing platform achieving 20+ mph with Monte Carlo localization (1000+ particles at 40 Hz) and real-time obstacle avoidance.
  - Built perception and planning pipelines using synchronized LiDAR-camera data, CNN-based segmentation, and SLAM map processing, improving lap consistency by 30%.
- **Animation concept:** Race car on track with LiDAR sweep beam and speed lines

#### 5. Firmware Engineer — NASA Space and Satellite Systems
- **Dates:** September 2023 – January 2025
- **Location:** Davis, CA
- **Bullets:**
  - Developed bare-metal ASM330LHH IMU drivers in C supporting I2C and SPI across multiple flight board revisions, including register-level configuration and sensor scaling.
  - Implemented dual-IMU redundancy with runtime sensor selection, health checks, and per-unit calibration, improving attitude sensing reliability by 40%.
  - Designed high-rate sensor acquisition and interrupt-driven logging using FreeRTOS and hardware timers, achieving 6.6 kHz telemetry with 99.9% timing accuracy.
- **Animation concept:** Satellite orbiting Earth with signal pulses and twinkling stars

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
