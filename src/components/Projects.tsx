"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github } from "lucide-react";

const projectsData = [
    {
        title: "DUAL! Inspired Game",
        description: "Two-player multiplayer game using CC3200 microcontrollers",
        technologies: ["C/C++", "CC3200", "UART", "I2C", "AWS IoT", "Lambda"],
        link: "https://dihan922.github.io/dual-webpage/",
        github: null,
        details: [
            "Designed two-player multiplayer game using CC3200 microcontrollers and OLED displays",
            "Implemented tilt-based ship movement using I2C-connected accelerometers",
            "Integrated AWS IoT and Lambda functions for live cloud-connected scoring",
            "Developed complete game states: setup, gameplay, scoring, and rematches",
            "Troubleshot complex hardware/software issues including UART/I2C conflicts"
        ],
        category: "Embedded Systems"
    },
    {
        title: "Machine Learning Algorithm",
        description: "Salary prediction model using demographic and professional data",
        technologies: ["Python", "Machine Learning", "PCA", "Random Forest", "Neural Networks"],
        link: null,
        github: null,
        details: [
            "Built salary prediction model using 6,684 records with demographic attributes",
            "Applied one-hot encoding and Principal Component Analysis (PCA) for dimensionality reduction",
            "Implemented feature selection and Z-score normalization for data preprocessing",
            "Compared Linear Regression, Polynomial Regression, Neural Networks, and Random Forest",
            "Achieved best performance with Random Forest (R² = 0.848, MSE ≈ 4.22e+08)"
        ],
        category: "Machine Learning"
    },
    {
        title: "Aggie Reminder",
        description: "Volunteer Management Web App for administrators",
        technologies: ["Node.js", "HTML/CSS", "JavaScript", "SendGrid", "Google Apps Script"],
        link: null,
        github: null,
        details: [
            "Developed web application for Aggie House administrators to manage volunteer hours",
            "Built Node.js server with frontend using HTML, CSS, and JavaScript",
            "Integrated SendGrid API for automated email notifications",
            "Implemented Google Apps Script automation for event reminders",
            "Created automated reminder logic triggered two days before scheduled events"
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