# Animation Reference Guide

Detailed animation specs for every project and experience card. Each animation runs continuously inside a visual area (220px height for projects, subtle overlay for experiences).

Reference implementation: `mockups/complete-mockup.html`

---

## Project Card Animations

### 1. `dual-screens` — DUAL! Multiplayer Game (FEATURED)

**Scene:** Dark space background (#0a0a18). Two mini OLED screens side by side with a UART data line connecting them.

```
Elements:
├── Background: dark blue gradient
├── Left screen (90x120px, border #333, rounded)
│   ├── Header: "PLAYER 1" (6px monospace)
│   ├── Blue triangle ship (bottom, bobbing animation)
│   └── Blue projectiles (3px circles, shooting upward)
├── Right screen (same size)
│   ├── Header: "PLAYER 2"
│   ├── Red triangle ship (top, bobbing animation)
│   └── Red projectiles (shooting downward)
├── UART line between screens (dashed, animated scroll)
├── "UART" label below the line
├── "CC3200 × 2" label (top-left, monospace, low opacity)
└── Score display "P1: 3 / P2: 2" (bottom-right)

Animations:
- shipBob: translateX oscillation, 2s, ease-in-out, infinite
- shootUp: translateY 0 → -90px, 1.2s, linear, infinite (with opacity fade)
- shootDown: translateY 0 → +90px, 1.2s, linear, infinite
- uartPulse: translateX -8px → 0, 1s, linear, infinite (dashed line scroll)
```

### 2. `robotic-arm` — Robotic Arm Controller

**Scene:** Purple-tinted dark background with dot grid overlay.

```
Elements:
├── Background: purple gradient (#1a0a1a → #2a1030)
├── Dot grid overlay (24px spacing, very low opacity)
├── Arm assembly (centered, bottom-anchored):
│   ├── Base plate (60x10px, gray gradient)
│   ├── Segment 1 (8x70px, swinging -20° to +15°)
│   │   ├── Joint (12px circle, purple glow #c084fc)
│   │   └── Segment 2 (6x55px, swinging 40° to -10°)
│   │       └── Gripper (two 3x14px bars, opening/closing)
├── G-Code text (top-left, scrolling/fading):
│   ├── "G01 X42.5 Y18.0"
│   ├── "G28 Z0.0 F200"
│   └── "M03 S1000"
└── "KINEMATICS" label (top-right)

Animations:
- armMove1: rotate -20deg → 15deg, 4s, ease-in-out, infinite
- armMove2: rotate 40deg → -10deg, 4s, ease-in-out, infinite
- gripperGrab: gap 6px → 2px → 6px, 4s
- gcodeType: opacity 0.2 → 0.6 → 0.2, 4s, staggered by 0.3s
```

### 3. `edge-detection` — Parallel Edge Detection

**Scene:** Green-tinted dark background. Input pixel grid on left, output edge outline on right.

```
Elements:
├── Background: green gradient (#0a1a0a → #0f2b15)
├── Label: "OpenMP · CUDA · SIMD" (top center)
├── Left grid (80x80px, 8x8 cells):
│   └── Some cells marked "active" (flash green animation)
├── Arrow (30px wide, pointing right, green gradient)
├── Right grid (80x80px):
│   └── Edge outline shape (border only, morphing animation)
└── Thread activity bars (bottom center, 6 bars):
    └── Each bar grows/shrinks at different timing

Animations:
- edgeFlash: background rgba(34,197,94) 0.05 → 0.4, 3s, staggered
- edgePulse: opacity 0.3 → 0.8, border-radius morphing, 3s
- tbarGrow: opacity 0.4 → 1.0, 1.5s, staggered by 0.15s
```

### 4. `dns-lookup` — DNS Resolver

**Scene:** Blue-tinted dark background. DNS resolution tree.

```
Elements:
├── Background: blue gradient (#0a1520 → #0d2030)
├── Four nodes (positioned in tree layout):
│   ├── Root ". (root)" — top center, blue
│   ├── TLD ".com TLD" — middle left, indigo
│   ├── Auth "auth NS" — middle right, purple
│   └── Result "93.184.216.34" — bottom center, green
├── Connection lines between nodes (animate brightness)
└── Query text "$ dig example.com A" (bottom, typing effect)

Animations:
- dnsTrace: opacity 0.1 → 0.8 with color brightening, 3s, staggered
- Node labels: very subtle pulse
```

### 5. `ml-scatter` — Salary Prediction Model

**Scene:** Yellow/amber-tinted dark background. Scatter plot visualization.

```
Elements:
├── Background: amber gradient (#1a1a0a → #2a2510)
├── "PREDICTION" label (top-left)
├── Chart axes (bottom-left corner, amber lines, low opacity)
├── 7 scatter dots at various positions:
│   └── Each dot pulses (scale 0.8 → 1.3, opacity 0.3 → 1.0)
└── Regression line (diagonal, fading in and out)

Animations:
- mlFade: scale + opacity pulse, 3s, staggered by 0.2s per dot
- mlLine: opacity 0.3 → 0.8, 3s
```

### 6. `notifications` — Aggie Reminder

**Scene:** Dark indigo background. Stack of notification cards.

```
Elements:
├── Background: indigo gradient (#0a0a1e → #10102a)
├── "HACKDAVIS '24" label (top-left)
└── 3 notification cards (stacked, sliding in):
    ├── Card 1: "● Shift reminder: Tomorrow 9am" — "Just now"
    ├── Card 2: "● Hours logged: 4.5h this week" — "2m ago"
    └── Card 3: "● New volunteer assigned" — "5m ago"

Animations:
- notifSlide: translateY 8px → 0 → -4px with opacity, 4s, staggered by 0.5s
- Cards have decreasing opacity (1.0, 0.7, 0.4) for depth effect
```

---

## Experience Card Animations

These are MORE SUBTLE than project animations. They appear as a very low-opacity background effect behind the text content of each experience card.

### 1. `circuit-repair` — ubreakifix by Asurion

**Concept:** Circuit board traces lighting up with a soldering spark.

```
Elements (all very low opacity, 0.05-0.15):
├── Horizontal and vertical thin lines (circuit traces)
├── Small circles at intersections (solder points)
├── One point has a brief bright flash (soldering spark)
└── Traces light up sequentially in a pulse pattern

Colors: warm amber/orange (#fb923c at 0.1 opacity)
```

### 2. `drone-firmware` — Rukmer Inc.

**Concept:** Small drone silhouette with a firmware download progress indicator.

```
Elements (very low opacity):
├── Small drone shape (4 rotors, simple geometric)
├── Download arrow or progress bar below it
├── Data stream particles flowing down to drone
└── Subtle propeller spin

Colors: blue (#60a5fa at 0.1 opacity)
```

### 3. `map-routing` — American Lost Children Association

**Concept:** Map grid with a route being drawn between location pins.

```
Elements (very low opacity):
├── Faint grid (representing map tiles)
├── 3-4 location pin dots
├── Curved line drawing between pins (animated stroke-dashoffset)
└── Subtle pulse at each pin when route reaches it

Colors: green (#4ade80 at 0.1 opacity)
```

### 4. `racecar-lidar` — UCD CORE Lab

**Concept:** Race car silhouette with LiDAR sweep beam.

```
Elements (very low opacity):
├── Track line (bottom)
├── Small car shape (rectangle + windshield)
├── LiDAR beam sweeping ahead (-30° to +30°)
├── Speed trail lines behind car
└── Track dashes scrolling (indicating movement)

Colors: green (#22c55e at 0.08 opacity) for LiDAR, red (#ef4444 at 0.08) for car
```

### 5. `satellite-orbit` — NASA

**Concept:** Satellite orbiting with signal pulses.

```
Elements (very low opacity):
├── Small Earth arc (bottom edge of card)
├── Orbital path (dashed ellipse)
├── Satellite (tiny rectangle with two solar panel rectangles)
├── Signal rings expanding from satellite
└── Star dots twinkling

Colors: indigo (#818cf8 at 0.1 opacity)
```

---

## Hero Orbs

4 floating gradient orbs behind the hero text. They use `filter: blur(120px)` and slow, drifting CSS animations.

```
Orb 1: 600px, indigo (#4f46e5 at 35%), top-left area, 22s float cycle
Orb 2: 500px, purple (#7c3aed at 30%), bottom-right area, 28s float cycle
Orb 3: 350px, cyan (#06b6d4 at 20%), center-right, 20s float cycle
Orb 4: 250px, pink (#f472b6 at 15%), center-left, 25s float cycle (reverse)

Each orb uses radial-gradient from color to transparent at 70%.
Float animations: translate ±30-50px + scale 0.92-1.08, different timing per orb.
```
