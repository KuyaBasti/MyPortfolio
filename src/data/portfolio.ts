export interface Experience {
  title: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
  tech: string[];
  animationId: string;
}

export interface Project {
  name: string;
  github: string;
  liveDemo?: string;
  tech: string[];
  tags: { label: string; color: string }[];
  description: string;
  featured: boolean;
  animationId: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export const education = {
  school: "University of California, Davis",
  location: "Davis, CA",
  degree: "Bachelor of Science in Computer Science and Engineering",
  graduated: "June 2025",
};

export const experiences: Experience[] = [
  {
    title: "IT",
    company: "ubreakifix by Asurion",
    dates: "December 2025 – Present",
    location: "Yuba City, CA",
    bullets: [
      "Diagnosed and repaired consumer electronics including smartphones, tablets, laptops, and game consoles.",
      "Performed board-level repairs including HDMI port replacement, fine-pitch soldering, and power and I/O troubleshooting using schematics and rework tools.",
    ],
    tech: ["Soldering", "Schematics", "Board-Level Repair", "I/O Troubleshooting"],
    animationId: "circuit-repair",
  },
  {
    title: "Software Engineer",
    company: "Rukmer Inc.",
    dates: "September 2025 – November 2025",
    location: "Boston, MA",
    bullets: [
      "Built a backend pipeline enabling drones to download compatible firmware after hardware replacements, eliminating the need to replace entire units when components changed.",
      "Implemented secure, versioned firmware delivery using Phoenix LiveView, presigned S3 uploads, checksum validation, and role-gated installs for staged rollouts.",
      "Designed immutable, content-addressed firmware artifacts served via CloudFront, ensuring reproducible deployments and preventing release drift across heterogeneous hardware.",
    ],
    tech: ["Phoenix LiveView", "AWS S3", "CloudFront", "Elixir"],
    animationId: "drone-firmware",
  },
  {
    title: "Software Engineer",
    company: "American Lost Children Association",
    dates: "July 2025 – September 2025",
    location: "Yuba City, CA",
    bullets: [
      "Built a web and mobile dispatch system that computes a single efficient delivery route across multiple locations based on a dispatcher's starting point.",
      "Implemented traffic-aware routing with Postgres/PostGIS and Google Directions API, plus offline-first Android support with cached routes and automatic re-sync.",
    ],
    tech: ["PostgreSQL", "PostGIS", "Google Maps API", "Android", "Kotlin"],
    animationId: "map-routing",
  },
  {
    title: "Software Engineer",
    company: "UCD CORE Lab – F1Tenth",
    dates: "January 2025 – July 2025",
    location: "Davis, CA",
    bullets: [
      "Developed a ROS2-based autonomous racing platform achieving 20+ mph with Monte Carlo localization (1000+ particles at 40 Hz) and real-time obstacle avoidance.",
      "Built perception and planning pipelines using synchronized LiDAR-camera data, CNN-based segmentation, and SLAM map processing, improving lap consistency by 30%.",
    ],
    tech: ["C++", "ROS2", "Python", "LiDAR", "OpenCV", "Jetson NX"],
    animationId: "racecar-lidar",
  },
  {
    title: "Firmware Engineer",
    company: "NASA Space and Satellite Systems",
    dates: "September 2023 – January 2025",
    location: "Davis, CA",
    bullets: [
      "Developed bare-metal ASM330LHH IMU drivers in C supporting I2C and SPI across multiple flight board revisions, including register-level configuration and sensor scaling.",
      "Implemented dual-IMU redundancy with runtime sensor selection, health checks, and per-unit calibration, improving attitude sensing reliability by 40%.",
      "Designed high-rate sensor acquisition and interrupt-driven logging using FreeRTOS and hardware timers, achieving 6.6 kHz telemetry with 99.9% timing accuracy.",
    ],
    tech: ["C", "STM32", "FreeRTOS", "SPI", "I2C", "IMU Drivers"],
    animationId: "satellite-orbit",
  },
];

export const projects: Project[] = [
  {
    name: "DUAL! — Multiplayer Microcontroller Game",
    github: "https://github.com/KuyaBasti/DUAL-Game",
    tech: ["C", "CC3200", "SPI", "I2C", "UART", "Flask", "AWS IoT"],
    tags: [
      { label: "embedded", color: "pink" },
      { label: "full-stack", color: "indigo" },
      { label: "IoT", color: "orange" },
    ],
    description:
      "Two CC3200 microcontrollers with OLED displays battle in real-time. Accelerometer controls via I2C, cross-device sync via UART, IR remote input, and Flask + AWS IoT for cloud scoring.",
    featured: true,
    animationId: "dual-screens",
  },
  {
    name: "Robotic Arm Controller",
    github: "https://github.com/KuyaBasti/RoboticArm",
    tech: ["C++", "G-Code", "Serial RS-232", "Inverse Kinematics"],
    tags: [
      { label: "embedded", color: "pink" },
      { label: "robotics", color: "green" },
    ],
    description:
      "2-link planar arm with G-Code parsing (G00–G03), inverse kinematics, linear/circular arc interpolation, and servo control via RS-232.",
    featured: false,
    animationId: "robotic-arm",
  },
  {
    name: "Parallel Edge Detection",
    github: "https://github.com/KuyaBasti/ParallelEdgeDetection",
    tech: ["C++", "OpenMP", "Intel SIMD", "CUDA", "CMake"],
    tags: [
      { label: "systems", color: "green" },
      { label: "parallel", color: "cyan" },
    ],
    description:
      "Image processing pipeline with Sobel edge detection using sequential, OpenMP+SIMD, and CUDA GPU parallelization strategies.",
    featured: false,
    animationId: "edge-detection",
  },
  {
    name: "DNS Resolver",
    github: "https://github.com/KuyaBasti/DNSResolver",
    tech: ["Go", "DNS Protocol", "Concurrency", "Caching"],
    tags: [
      { label: "software", color: "indigo" },
      { label: "networking", color: "green" },
    ],
    description:
      "Thread-safe recursive DNS resolver with hash-partitioned cache, CNAME chain following, and recursion loop prevention in Go.",
    featured: false,
    animationId: "dns-lookup",
  },
  {
    name: "Salary Prediction Model",
    github: "https://github.com/KuyaBasti/SalaryPredictionModel",
    tech: ["Python", "scikit-learn", "Flask", "Pandas"],
    tags: [{ label: "machine learning", color: "yellow" }],
    description:
      "ML pipeline predicting salaries from demographics with multiple algorithms and a web UI. Trained on 6,684 records.",
    featured: false,
    animationId: "ml-scatter",
  },
  {
    name: "Aggie Reminder",
    github: "https://github.com/KuyaBasti/Aggie-Reminder-",
    tech: ["Node.js", "Express", "PostgreSQL", "SendGrid"],
    tags: [
      { label: "full-stack", color: "indigo" },
      { label: "hackathon", color: "orange" },
    ],
    description:
      "Volunteer management system with automated email reminders, hour tracking, and admin dashboard. Built at HackDavis 2024.",
    featured: false,
    animationId: "notifications",
  },
];

export const skills: SkillCategory[] = [
  {
    title: "Languages",
    items: ["C", "C++", "Java", "Python", "Go", "Assembly", "CUDA", "JavaScript", "TypeScript", "SQL", "Bash", "Kotlin", "C#"],
  },
  {
    title: "Embedded & Robotics",
    items: ["STM32", "CC3200", "ROS2", "FreeRTOS", "SPI", "I2C", "UART", "CAN", "USB", "BLE", "Sensor Fusion"],
  },
  {
    title: "Web & Software",
    items: ["React", "Next.js", "Node.js", "Flask", "Express", "Phoenix LiveView", "PostgreSQL", "PostGIS", "Docker"],
  },
  {
    title: "AI / ML / Cloud",
    items: ["TensorFlow", "PyTorch", "OpenCV", "scikit-learn", "AWS IoT", "S3", "Lambda", "CloudFront", "Terraform"],
  },
];

export const contact = {
  email: "jsvsolon@gmail.com",
  github: "https://github.com/KuyaBasti",
  linkedin: "https://linkedin.com/in/jssolon",
  website: "johnsolon.com",
  phone: "530-936-3456",
};

export const about = [
  "I'm a Computer Science & Engineering graduate from UC Davis with a passion for building across the full stack — from bare-metal firmware to production web apps.",
  "I've built autonomous racing platforms at the CORE Lab, written flight software for NASA-affiliated satellites, designed drone firmware pipelines, and shipped full-stack web applications. I believe the best engineers are the ones who can move fluidly between hardware and software.",
  "When I'm not coding, I'm mentoring fellow students, exploring new technologies, and diving into research on autonomous systems and AI.",
];
