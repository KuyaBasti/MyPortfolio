// ─── Types ───────────────────────────────────────────────────────────────────

export interface PersonalInfo {
    name: string;
    title: string;
    tagline: string;
    location: string;
    phone: string;
    website: string;
    specialties: string[];
}

export interface ContactLink {
    label: string;
    value: string;
    href: string | null;
}

export interface Experience {
    year: string;
    company: string;
    companyUrl: string;
    role: string;
    location: string;
    date: string;
    details: string[];
}

export interface Education {
    years: string;
    school: string;
    schoolUrl: string;
    degree: string;
    location: string;
    graduated: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link: string | null;
    github: string | null;
    details: string[];
    category: string;
}

export interface SkillCategory {
    title: string;
    items: string[];
}

// ─── Personal Info ───────────────────────────────────────────────────────────

export const personalInfo: PersonalInfo = {
    name: "John Sebastian Solon",
    title: "Software Engineer",
    tagline: "CSE @ UC Davis",
    location: "Yuba City, California",
    phone: "530-936-3456",
    website: "johnsolon.com",
    specialties: [
        "Embedded Systems",
        "Firmware Development",
        "Full-Stack Development",
        "Autonomous Systems",
        "Cloud Infrastructure",
        "Real-time Systems",
        "Computer Vision",
        "Robotics",
    ],
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactLinks: ContactLink[] = [
    {
        label: "Email",
        value: "jsvsolon@gmail.com",
        href: "mailto:jsvsolon@gmail.com",
    },
    {
        label: "Website",
        value: "johnsolon.com",
        href: "https://johnsolon.com",
    },
    {
        label: "GitHub",
        value: "KuyaBasti",
        href: "https://github.com/KuyaBasti",
    },
    {
        label: "LinkedIn",
        value: "jssolon",
        href: "https://www.linkedin.com/in/jssolon/",
    },
    {
        label: "Phone",
        value: "530-936-3456",
        href: "tel:5309363456",
    },
    {
        label: "Location",
        value: "Yuba City, California",
        href: null,
    },
];

// ─── Experience ──────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
    {
        year: "2026",
        company: "Quanta Manufacturing",
        companyUrl: "",
        role: "Test Engineer",
        location: "Fremont, CA",
        date: "April 2026 \u2013 Present",
        details: [
            "Co-lead 30 technicians on night shift validating Nvidia GB200/GB300 NVL72 racks at node (L10) and rack (L11) level for a hyperscaler customer, increasing output from 160 to 400+ racks per month",
            "Own the rollout of diag and firmware releases into production: Bash rsync deploys for L10 and L11 with backup-then-verify, an exclude list that strips logs and per-serial test state so only code ships, and propagation to every peer PXE server so the whole line runs one version",
            "Isolate control runs so new firmware and diag qualify on the live production line without contaminating it: a serial-keyed lock-out flag the production flow honors, PXE-side process interception, and MAC-keyed iPXE redirection that boots one tray to a different payload while the rest of the line is untouched",
            "Primary escalation point for line outages across PXE servers, console switches, and power distribution, root-causing NVSwitch firmware-version mismatches that cause switches to fail interconnect testing",
        ],
    },
    {
        year: "2025",
        company: "uBreakiFix by Asurion",
        companyUrl: "",
        role: "Repair Technician",
        location: "Yuba City, CA",
        date: "July 2025 \u2013 April 2026",
        details: [
            "Diagnosed and repaired smartphones, tablets, laptops, and game consoles at the component level",
        ],
    },
    {
        year: "2025",
        company: "UCD CORE Lab \u2013 F1Tenth",
        companyUrl: "https://nazarilab.ucdavis.edu/",
        role: "Software Engineer Intern",
        location: "Davis, CA",
        date: "January 2025 \u2013 July 2025",
        details: [
            "Took a 1/10-scale race car from Bluetooth teleop to full autonomy with a ROS 2 Foxy stack with odometry-triggered Monte Carlo localization (4,000 particles, 240K CUDA ray casts/update) on an Nvidia Jetson Xavier NX, validated by overlaying the filter's predicted scan on the live scan in RViz",
            "Integrated and tuned speed-adaptive pure pursuit, minimum-lap-time raceline tracking (TUM optimizer, Pacejka tire model, g-g acceleration limit), and LiDAR follow-the-gap avoidance arbitrated by a C++ occupancy-grid supervisor, delivering the car's first fully autonomous laps at ~3 m/s commanded off the optimizer's velocity profile",
            "Auto-labeled track-boundary frames at a 3.4% miss rate with language-prompted SAM, and trained a PilotNet CNN on the masks to 0.105 rad steering MAE on a held-out set",
        ],
    },
    {
        year: "2023",
        company: "NASA \u2013 Space and Satellite Systems",
        companyUrl: "",
        role: "Firmware Engineer",
        location: "Davis, CA",
        date: "September 2023 \u2013 January 2025",
        details: [
            "Developed the bare-metal IMU driver in C for a 3U CubeSat set to launch in September 2026, implementing both the software-I2C and hardware-SPI register paths (mode 3, 2.5 MHz, software chip-select) plus runtime selection between two IMUs; the SPI path brought the IMU up on the board revision that moved it off bit-banged I2C, and fed the only live sensor input to the attitude-control loops",
            "Designed a register-level timer/interrupt driver (STM32 TIM6) for the onboard experiment logging subsystem, interrupt-driven to fit the CubeSat's solar-power and CPU budget and decoupled from application logic via callback registration",
            "Verified timing on hardware with a logic analyzer; acquisition held a deterministic 100 ms (10 Hz) cadence independent of FreeRTOS task scheduling",
        ],
    },
];

// ─── Education ───────────────────────────────────────────────────────────────

export const education: Education[] = [
    {
        years: "2023\u20132025",
        school: "University of California, Davis",
        schoolUrl: "https://cs.ucdavis.edu/",
        degree: "Bachelor of Science in Computer Science and Engineering",
        location: "Davis, CA",
        graduated: "June 2025",
    },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
    {
        title: "DUAL! Inspired Game",
        description:
            "Two-player embedded game across two bare-metal CC3200 MCUs with no shared game state, handing projectiles off over UART",
        technologies: ["C", "ARM Cortex-M4", "AWS IoT", "SPI", "UART", "I2C", "Flask"],
        link: "https://dihan922.github.io/dual-webpage/",
        github: "https://github.com/KuyaBasti/DUAL-Game",
        details: [
            "Developed a two-player embedded game across 2 bare-metal CC3200 MCUs with no shared game state: tilt control from a BMA222 accelerometer over I2C, a 128×128 SSD1351 OLED driven framebuffer-free over SPI, and projectile handoff as an 11-byte packet over a 115200-baud UART link, reconstructed mirrored on the peer's screen",
            "Decoded an IR remote via SysTick pulse-width timing for in-game text entry, and pushed live scores over TLS to an AWS IoT device shadow backing a Flask scoreboard",
        ],
        category: "Embedded Systems",
    },
    {
        title: "Drone Modularization",
        description:
            "Firmware delivery pipeline with S3 and CloudFront to automate secure, versioned deployments for modular hardware variants",
        technologies: ["Phoenix LiveView", "Elixir", "AWS S3", "CloudFront", "Presigned URLs"],
        link: null,
        github: null,
        details: [
            "Built a firmware delivery pipeline with S3 and CloudFront to automate secure, versioned deployments for modular hardware variants",
            "Implemented presigned S3 uploads with checksum validation and role-gated installs for staged rollouts",
            "Designed immutable, content-addressed firmware artifacts served via CloudFront, preventing release drift across heterogeneous hardware",
        ],
        category: "Full-Stack Development",
    },
    {
        title: "Dispatcher System",
        description:
            "Traffic-aware routing system with PostGIS and Google Maps API, featuring offline-first Android support and automated re-sync",
        technologies: ["Android", "Kotlin", "PostgreSQL/PostGIS", "Google Directions API"],
        link: null,
        github: null,
        details: [
            "Built a traffic-aware routing system with PostGIS and Google Maps API that computes a single efficient delivery route across multiple locations",
            "Implemented offline-first Android support with cached routes and automatic re-sync when connectivity is restored",
        ],
        category: "Full-Stack Development",
    },
    {
        title: "Salary Prediction Machine Learning Model",
        description:
            "ML project predicting salaries using demographic and professional factors with interactive Flask web interface",
        technologies: ["Python", "scikit-learn", "Flask", "Neural Networks", "Random Forest", "PCA", "Pandas", "NumPy"],
        link: null,
        github: "https://github.com/KuyaBasti/SalaryPredictionModel",
        details: [
            "Built salary prediction system using 6,684 records across demographics, job categories, and geographic regions",
            "Implemented multiple ML algorithms: Linear Regression, Polynomial Regression, MLP Neural Networks, and Random Forest",
            "Achieved optimal performance with Random Forest model (R\u00B2 = 0.848, MSE \u2248 4.22e+08) across 8 predictive features",
            "Created interactive Flask web application with responsive design for real-time salary predictions",
        ],
        category: "Machine Learning",
    },
    {
        title: "Aggie Reminder",
        description:
            "Volunteer management system with automated reminders, admin dashboard, and Google Apps Script integration for HackDavis 2024",
        technologies: ["Node.js", "Express.js", "PostgreSQL", "SendGrid API", "Google Apps Script", "Knex.js"],
        link: null,
        github: "https://github.com/KuyaBasti/Aggie-Reminder-",
        details: [
            "Built volunteer management system for HackDavis 2024 to manage schedules and track work hours",
            "Integrated PostgreSQL with Knex.js for data persistence and SendGrid for automated reminder notifications",
            "Created Google Apps Script automation with time-driven triggers for smart scheduling and reminder delivery",
        ],
        category: "Full-Stack Development",
    },
    {
        title: "Robotic Arm Drawing System",
        description:
            "C++ 2-link planar robotic arm with G-code interpretation and inverse kinematics for precision drawing",
        technologies: ["C++", "Inverse Kinematics", "G-code Parser", "RS-232 Serial", "Servo Control", "CNC Programming"],
        link: null,
        github: "https://github.com/KuyaBasti/RoboticArm",
        details: [
            "Developed C++ robotic arm control system interpreting standard CNC G-code commands for precision drawing operations",
            "Implemented real-time inverse kinematics algorithms to convert Cartesian coordinates into joint angles",
            "Built G-code parser supporting G00, G01, G02, G03 commands with linear and circular arc interpolation",
            "Engineered RS-232 serial communication for direct servo motor control with 0.12\u00B0 angular resolution",
        ],
        category: "Embedded Systems",
    },
    {
        title: "DNS Resolver",
        description:
            "Concurrent recursive DNS resolver in Go with an iterative root-down delegation walk over a hash-partitioned, TTL-aware cache",
        technologies: ["Go", "Concurrent Programming", "DNS Protocol", "Hash-Partitioned Cache", "RWMutex", "Network Programming"],
        link: null,
        github: "https://github.com/KuyaBasti/DNSResolver",
        details: [
            "Built a concurrent recursive DNS resolver in Go performing an iterative root-down delegation walk over a hash-partitioned, TTL-aware cache (FNV-1a sharding, per-shard RWMutex), validated under 4,000+ concurrent goroutines at shard counts from 1 to 1024",
        ],
        category: "Systems Programming",
    },
    {
        title: "DraftMaster",
        description:
            "Dota 2 draft simulator: draft two teams and a deterministic engine plays out a full, watchable match grounded in real ranked data",
        technologies: ["Python", "scikit-learn", "DuckDB", "TypeScript", "Fastify", "React"],
        link: null,
        github: "https://github.com/KuyaBasti/DotaAnalysis",
        details: [
            "Built a Dota 2 draft simulator with a deterministic 30s-tick engine and seeded Monte Carlo (200 sims in about a second)",
            "Trained the win model on 59K+ ranked matches",
            "Match Viewer replays each simulated game on a minimap with an event feed, net-worth graph, and win probability",
        ],
        category: "Simulation & Machine Learning",
    },
    {
        title: "IR Signal AWS Messaging",
        description:
            "IR remote-based text messaging system for CC3200 with T9 input, OLED display, and AWS cloud integration",
        technologies: ["C", "CC3200", "IR Protocol (NEC)", "AWS IoT", "SSL/TLS", "SPI", "GPIO Interrupts"],
        link: null,
        github: "https://github.com/KuyaBasti/IRSignalAWS",
        details: [
            "Developed IR remote text messaging system transforming TV remotes into IoT text input devices with cloud connectivity",
            "Implemented GPIO interrupt-driven NEC IR protocol decoder with multi-tap T9-style character input",
            "Engineered real-time OLED graphics using SSD1351 driver with 128x128 color display",
            "Integrated secure AWS cloud communication via HTTPS with SSL/TLS and JSON message formatting",
        ],
        category: "Embedded Systems",
    },
    {
        title: "IR Device-to-Device Messaging",
        description:
            "Peer-to-peer text messaging between CC3200 microcontrollers using IR remotes and UART inter-device communication",
        technologies: ["C", "CC3200", "UART Protocol", "IR Signal Processing", "Message Protocol Design", "SPI Display"],
        link: null,
        github: "https://github.com/KuyaBasti/IRSignalDecoder",
        details: [
            "Engineered peer-to-peer text messaging enabling direct communication between CC3200 units via UART",
            "Developed NEC IR protocol decoder with T9-style text input supporting standard TV remote controls",
            "Designed custom message protocol with packet structure, sender identification, and checksum validation",
            "Built state machine managing menu navigation, input modes, and inter-device communication",
        ],
        category: "Embedded Systems",
    },
    {
        title: "Parallel Edge Detection",
        description:
            "Edge detection as OpenMP+AVX and CUDA engines against a sequential reference, hitting ~15x on the CPU engine with byte-identical output",
        technologies: ["C++20", "CUDA", "OpenMP", "Intel SIMD (AVX)", "CMake", "Google Test", "GPU Programming"],
        link: null,
        github: "https://github.com/KuyaBasti/ParallelEdgeDetection",
        details: [
            "Implemented Gaussian-blur → Sobel-gradient → hysteresis-threshold edge detection as OpenMP+AVX and CUDA engines against a provided sequential reference, hitting ~15x on the CPU engine with byte-identical output via row-major loop restructuring, 8-wide intrinsics, and 32×32 coalesced CUDA blocks over constant-memory kernels",
        ],
        category: "Parallel Programming",
    },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
    {
        title: "Languages",
        items: ["C", "C++", "Java", "Python", "Go", "Assembly", "CUDA", "JavaScript", "TypeScript", "SQL", "Bash", "Kotlin"],
    },
    {
        title: "Frameworks",
        items: ["ROS2", "FreeRTOS", "Phoenix LiveView", "Node.js", "React", "Flask", "TensorFlow", "PyTorch", "OpenCV"],
    },
    {
        title: "Cloud/Infra",
        items: ["AWS IoT", "S3", "CloudFront", "Cognito", "Lambda", "Route 53", "Terraform", "Docker", "PostgreSQL/PostGIS"],
    },
    {
        title: "Protocols/APIs",
        items: ["REST", "gRPC", "WebSockets", "SPI", "I2C", "UART", "CAN", "USB", "BLE", "Google Maps API"],
    },
];

// ─── Derived helpers ─────────────────────────────────────────────────────────

export const projectCategories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
];
