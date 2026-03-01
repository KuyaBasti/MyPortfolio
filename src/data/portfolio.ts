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
        year: "2025",
        company: "ubreakifix by Asurion",
        companyUrl: "https://www.asurion.com/",
        role: "IT",
        location: "Yuba City, CA",
        date: "December 2025 \u2013 Present",
        details: [
            "Diagnosed and repaired consumer electronics including smartphones, tablets, laptops, and game consoles",
            "Performed board-level repairs including HDMI port replacement, fine-pitch soldering, and power and I/O troubleshooting using schematics and rework tools",
        ],
    },
    {
        year: "2025",
        company: "Rukmer Inc.",
        companyUrl: "https://rukmer.com/",
        role: "Software Engineer",
        location: "Boston, MA",
        date: "September 2025 \u2013 November 2025",
        details: [
            "Built a backend pipeline enabling drones to download compatible firmware after hardware replacements, eliminating the need to replace entire units when components changed",
            "Implemented secure, versioned firmware delivery using Phoenix LiveView, presigned S3 uploads, checksum validation, and role-gated installs for staged rollouts",
            "Designed immutable, content-addressed firmware artifacts served via CloudFront, ensuring reproducible deployments and preventing release drift across heterogeneous hardware",
        ],
    },
    {
        year: "2025",
        company: "American Lost Children Association",
        companyUrl: "",
        role: "Software Engineer",
        location: "Yuba City, CA",
        date: "July 2025 \u2013 September 2025",
        details: [
            "Built a web and mobile dispatch system that computes a single efficient delivery route across multiple locations based on a dispatcher\u2019s starting point",
            "Implemented traffic-aware routing with Postgres/PostGIS and Google Directions API, plus offline-first Android support with cached routes and automatic re-sync",
        ],
    },
    {
        year: "2025",
        company: "UCD CORE Lab \u2013 F1Tenth",
        companyUrl: "https://nazarilab.ucdavis.edu/",
        role: "Software Engineer",
        location: "Davis, CA",
        date: "January 2025 \u2013 July 2025",
        details: [
            "Developed a ROS2-based autonomous racing platform achieving 20+ mph with Monte Carlo localization (1000+ particles at 40 Hz) and real-time obstacle avoidance",
            "Built perception and planning pipelines using synchronized LiDAR-camera data, CNN-based segmentation, and SLAM map processing, improving lap consistency by 30%",
        ],
    },
    {
        year: "2023",
        company: "NASA Space and Satellite Systems",
        companyUrl: "https://www.nasa.gov/",
        role: "Firmware Engineer",
        location: "Davis, CA",
        date: "September 2023 \u2013 January 2025",
        details: [
            "Developed bare-metal ASM330LHH IMU drivers in C supporting I2C and SPI across multiple flight board revisions, including register-level configuration and sensor scaling",
            "Implemented dual-IMU redundancy with runtime sensor selection, health checks, and per-unit calibration, improving attitude sensing reliability by 40%",
            "Designed high-rate sensor acquisition and interrupt-driven logging using FreeRTOS and hardware timers, achieving 6.6 kHz telemetry with 99.9% timing accuracy",
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
            "Two-player real-time embedded game on CC3200 MCUs with SPI OLED rendering and custom UART protocol for synchronized gameplay",
        technologies: ["C", "ARM Cortex-M4", "AWS IoT", "SPI", "UART", "I2C", "Flask", "Lambda"],
        link: "https://dihan922.github.io/dual-webpage/",
        github: "https://github.com/KuyaBasti/DUAL-Game",
        details: [
            "Designed a two-player real-time embedded game on CC3200 MCUs with SPI OLED rendering and a custom UART protocol for synchronized gameplay",
            "Implemented tilt-based controls using an I2C accelerometer, IR remote input for username entry, and state-driven game logic with ammo cooldowns",
            "Integrated AWS IoT and Lambda to persist and display scores via a Flask backend, bridging embedded firmware with cloud services",
        ],
        category: "Embedded Systems",
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
        title: "High-Performance DNS Resolver",
        description:
            "Thread-safe DNS resolver in Go with recursive resolution from root servers, intelligent caching, and comprehensive protocol support",
        technologies: ["Go", "Concurrent Programming", "DNS Protocol", "Hash-Partitioned Cache", "RWMutex", "Network Programming"],
        link: null,
        github: "https://github.com/KuyaBasti/DNSResolver",
        details: [
            "Built DNS resolver from scratch in Go with recursive resolution starting from root servers",
            "Implemented thread-safe design using RWMutex and hash-partitioned cache to reduce lock contention",
            "Engineered intelligent caching with TTL-based expiration, attack prevention, and O(1) average lookup time",
            "Supported A, AAAA, NS, CNAME, SOA, and PTR records with automatic CNAME chain resolution",
        ],
        category: "Systems Programming",
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
            "Image processing pipeline with OpenMP, Intel SIMD intrinsics, and CUDA GPU acceleration achieving 15x speedup",
        technologies: ["C++20", "CUDA", "OpenMP", "Intel SIMD (AVX)", "CMake", "Google Test", "GPU Programming"],
        link: null,
        github: "https://github.com/KuyaBasti/ParallelEdgeDetection",
        details: [
            "Built edge detection pipeline achieving 15x speedup with CUDA GPU acceleration over sequential baseline",
            "Implemented Gaussian blur, Sobel gradient calculation, and hysteresis threshold edge linking",
            "Engineered CUDA implementation with optimized memory coalescing and shared memory tile-based convolution",
            "Created OpenMP implementation with Intel SIMD intrinsics (AVX/AVX2) for 8x vectorized float processing",
        ],
        category: "Parallel Programming",
    },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
    {
        title: "Languages",
        items: ["C", "C++", "Java", "Python", "Go", "Assembly", "CUDA", "JavaScript", "TypeScript", "SQL", "Bash", "CSS", "Kotlin", "C#"],
    },
    {
        title: "Frameworks",
        items: ["ROS2", "Phoenix LiveView", "Node.js", "React", "Flask", "Unity", "TensorFlow", "PyTorch", "OpenCV", "Docker", "PostgreSQL/PostGIS"],
    },
    {
        title: "Cloud/Infra",
        items: ["AWS IoT", "S3", "CloudFront", "Cognito", "Lambda", "Route 53", "Terraform"],
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
