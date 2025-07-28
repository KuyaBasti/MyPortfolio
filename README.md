# John Sebastian Solon - Portfolio

My personal portfolio website showcasing my work in embedded systems, robotics, and software engineering. Built with Next.js, TypeScript, and Tailwind CSS.

## About

I'm John Sebastian Solon, a Computer Science and Engineering student at UC Davis with a passion for embedded systems, autonomous technologies, and real-time programming. This portfolio showcases my journey from embedded systems development to cutting-edge robotics research.

The site features smooth animations, responsive design, and modern web development practices. Built from scratch to demonstrate both technical skills and attention to detail.

## File Structure

```
MyPortfolio/
├── public/                     # Static assets
│   ├── corelab.png            # CORE Lab logo
│   ├── sss.png                # Project images
│   ├── ucdavis.png            # UC Davis logo
│   ├── yubacollege.png        # Yuba College logo
│   └── *.svg                  # Icon assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── About.tsx          # About section
│   │   ├── AboutHero.tsx      # Hero section for about
│   │   ├── Contact.tsx        # Contact form
│   │   ├── Education.tsx      # Education timeline
│   │   ├── Home.tsx           # Landing section
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── Projects.tsx       # Projects showcase
│   │   ├── SkillSection.tsx   # Skills & technologies
│   │   ├── Work.tsx           # Work experience
│   │   └── ui/                # Reusable UI components
│   │       ├── AnimatedCard.tsx      # Animated card component
│   │       ├── Button.tsx            # Custom button
│   │       ├── FlipText.tsx          # Text flip animation
│   │       ├── FloatingNavbar.tsx    # Floating navigation
│   │       ├── Gradient.tsx          # Gradient backgrounds
│   │       ├── IconCloud.tsx         # 3D icon cloud
│   │       ├── TacetMark.tsx         # Decorative marks
│   │       ├── TextDecoder.tsx       # Text decoder effect
│   │       ├── TextGenerate.tsx      # Text generation effect
│   │       ├── TextHover.tsx         # Text hover effects
│   │       ├── TextSlider.tsx        # Text sliding animation
│   │       └── Timeline.tsx          # Timeline component
│   ├── fonts/                 # Custom fonts
│   │   ├── ClashDisplay-*     # Clash Display font family
│   │   └── FiraCode-Regular.ttf # Code font
│   ├── hooks/                 # Custom React hooks
│   │   ├── useActive.ts       # Active section detection
│   │   └── useMouse.ts        # Mouse position tracking
│   └── lib/
│       └── utils.ts           # Utility functions
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## Experience & Projects Featured

- **Davis Autonomous Race Car (DARC)**: Real-time navigation systems using ROS2 on Nvidia Jetson Xavier NX with LiDAR and computer vision
- **NASA CubeSatellite Project**: Flight software development with custom RTOS and embedded protocols (SPI, I2C, UART)
- **Robotics Engineering**: Kinematic robotic arm controller with G-Code parsing and embedded assembly programming
- **Academic Excellence**: Student tutor for advanced mathematics, physics, and computer science courses

## Tech Stack

### Portfolio Website
- Next.js 15 with App Router
- React 19 and TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design patterns

### Core Expertise
- **Embedded Systems**: C++, STM32, Real-time Programming
- **Robotics**: ROS2, Sensor Fusion, LiDAR Integration
- **Protocols**: SPI, I2C, UART, Custom RTOS
- **AI/ML**: Computer Vision, Autonomous Navigation
- **Tools**: Nvidia Jetson, Intel RealSense, G-Code Processing

## Education & Background

- **University of California, Davis** - Bachelor of Science in Computer Science and Engineering (Expected 2025)
- **GPA**: 3.5 in Computer Science and Engineering Department
- **Focus Areas**: Embedded Systems, Real-time Systems, Robotics, Autonomous Systems
- **Research**: Prof. Shima Nazari's CORE Lab - Autonomous Vehicle Systems

## Current Focus

- Developing autonomous navigation systems for F1Tenth racing competition
- Advancing computer vision pipelines for dynamic obstacle detection
- Integrating multi-sensor fusion with LiDAR and depth camera technologies
- Contributing to open-source robotics and embedded systems projects

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio in your browser.

---

*"Building tomorrow's technology, one line of code at a time."*