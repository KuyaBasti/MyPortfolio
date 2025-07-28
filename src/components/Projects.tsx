"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github } from "lucide-react";

const projectsData = [
    {
        title: "DUAL! - Embedded Systems Multiplayer Game",
        description: "Multiplayer arcade game on CC3200 microcontrollers with real-time UART communication and motion controls",
        technologies: ["C/C++", "CC3200 ARM Cortex-M4", "UART Protocol", "I2C Communication", "SPI Interface", "AWS IoT", "Flask Server", "Adafruit GFX", "Real-time Systems", "Code Composer Studio"],
        link: "https://dihan922.github.io/dual-webpage/",
        github: "https://github.com/KuyaBasti/DUAL-Game",
        details: [
            "Developed sophisticated two-player multiplayer arcade game on CC3200 microcontrollers with OLED displays, inspired by the mobile game DUAL",
            "Implemented accelerometer-based ship control via I2C interface for intuitive tilt-based gameplay mechanics",
            "Engineered real-time UART communication protocol for seamless cross-device game state synchronization between players",
            "Designed comprehensive user input system with IR sensor circuits featuring multi-tap functionality for username entry",
            "Integrated AWS IoT connectivity with Flask backend for real-time score transmission and cloud-based leaderboard management",
            "Optimized custom Adafruit GFX graphics implementation for high-performance embedded display rendering",
            "Achieved low-latency input processing and responsive controls essential for competitive multiplayer gaming",
            "Developed complete game architecture including setup, gameplay, scoring, and rematch functionality",
            "Implemented robust hardware abstraction layer managing SPI displays, I2C accelerometers, UART communication, and IR sensors",
            "Created professional embedded systems project with full documentation, hardware setup guides, and deployment instructions"
        ],
        category: "Embedded Systems"
    },
    {
        title: "Salary Prediction Machine Learning Model",
        description: "Comprehensive ML project predicting salaries using demographic and professional factors with interactive web interface",
        technologies: ["Python", "scikit-learn", "Flask", "Neural Networks", "Random Forest", "PCA", "Pandas", "NumPy", "HTML/CSS", "Jupyter Notebook"],
        link: null,
        github: "https://github.com/KuyaBasti/SalaryPredictionModel",
        details: [
            "Built comprehensive salary prediction system using 6,684 records across demographics, job categories, and geographic regions",
            "Implemented multiple ML algorithms: Linear Regression, Polynomial Regression, Multi-Layer Perceptron Neural Networks, and Random Forest",
            "Developed complete data preprocessing pipeline with one-hot encoding, PCA dimensionality reduction, and feature scaling",
            "Created interactive Flask web application with responsive design for real-time salary predictions",
            "Achieved optimal performance with Random Forest model (R² = 0.848, MSE ≈ 4.22e+08) across 8 predictive features",
            "Engineered robust model persistence system using pickle files for quick deployment and scalability",
            "Analyzed salary trends across countries and demographic factors",
            "Implemented comprehensive model evaluation framework comparing MSE and R² scores across all algorithms",
            "Designed professional web interface with form validation and clean UI for user-friendly predictions",
            "Created complete academic documentation including research paper for ECS 171 Machine Learning course"
        ],
        category: "Machine Learning"
    },
    {
        title: "Aggie Reminder - Volunteer Management System",
        description: "Comprehensive volunteer management system with automated reminders, admin dashboard, and Google Apps Script integration",
        technologies: ["Node.js", "Express.js", "PostgreSQL", "SendGrid API", "Google Apps Script", "HTML/CSS", "JavaScript", "Knex.js", "Excel Integration"],
        link: null,
        github: null,
        details: [
            "Built comprehensive volunteer management system for HackDavis 2024 to help administrators efficiently manage schedules and track work hours",
            "Developed full-stack web application with Node.js/Express backend and responsive frontend using HTML5, CSS3, and JavaScript",
            "Integrated PostgreSQL database with Knex.js query builder for robust data persistence and volunteer information management", 
            "Implemented SendGrid Email API for automated reminder notifications and seamless volunteer communication",
            "Created Google Apps Script automation system with time-driven triggers for smart scheduling and reminder delivery",
            "Designed admin dashboard with intuitive interface for managing volunteers, tracking hours, and monitoring attendance",
            "Built Excel file integration system using XLSX library for importing and processing volunteer data spreadsheets",
            "Engineered automated reminder logic that sends notifications 2 days before scheduled events using Google Sheets API",
            "Implemented user authentication system with login/registration functionality and session management",
            "Developed responsive web interface with CORS support and cross-platform compatibility for volunteer management"
        ],
        category: "Full-Stack Development"
    }
];

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
    const [filter, setFilter] = useState<string>("All");

    const categories = ["All", "Embedded Systems", "Machine Learning", "Full-Stack Development"];
    const filteredProjects = filter === "All" 
        ? projectsData 
        : projectsData.filter(project => project.category === filter);

    const openModal = (project: typeof projectsData[0]) => {
        setSelectedProject(project);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <section id="projects" className="py-24 relative">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    Projects & Applications
                </h2>
                
                {/* Filter buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                filter === category
                                    ? 'bg-blue-500 text-white shadow-lg' 
                                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                key={filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto px-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => openModal(project)}
                            className="cursor-pointer"
                        >
                            <AnimatedCard
                                title={project.title}
                                description={project.description}
                                className="p-6 h-64 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs">
                                                +{project.technologies.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                                        {project.category}
                                    </p>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Live Demo
                                        </a>
                                    )}
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Github className="w-4 h-4" />
                                            Code
                                        </a>
                                    )}
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">
                                        {selectedProject.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        {selectedProject.category}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                </button>
                            </div>

                            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                                {selectedProject.description}
                            </p>

                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
                                    Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3">
                                    Key Features & Achievements
                                </h4>
                                <div className="space-y-2">
                                    {selectedProject.details.map((detail, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                {detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                {selectedProject.link && (
                                    <a
                                        href={selectedProject.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Live Demo
                                    </a>
                                )}
                                {selectedProject.github && (
                                    <a
                                        href={selectedProject.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        View Code
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
} 