"use client";

import { useState } from "react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { IconCloud } from "@/components/ui/IconCloud";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const skillsData = [
    {
        title: "Programming Languages",
        description: "Core languages for embedded & software development",
        skills: ["C/C++", "Python", "Java", "Assembly", "GoLang", "CUDA"],
        icons: [
            "c", "cplusplus", "python", "java", "go", "nvidia",
            "javascript", "typescript", "rust", "dart"
        ]
    },
    {
        title: "Embedded Systems", 
        description: "Hardware interfaces & real-time systems",
        skills: ["STM32", "SPI/I2C/UART", "Real-time Systems", "Sensor Fusion", "Firmware Development"],
        icons: [
            "stmicroelectronics", "arduino", "raspberrypi", "nvidia", "arm", 
            "freertos", "linux", "ubuntu", "espressif", "microchip"
        ]
    },
    {
        title: "Robotics & AI",
        description: "Autonomous systems & machine learning", 
        skills: ["ROS2", "Computer Vision", "LiDAR", "Machine Learning", "Autonomous Navigation"],
        icons: [
            "ros", "opencv", "pytorch", "tensorflow", "scikitlearn", 
            "jupyter", "anaconda", "numpy", "pandas", "matplotlib"
        ]
    },
    {
        title: "Tools & Frameworks",
        description: "Development tools & deployment platforms",
        skills: ["Node.js", "Flask", "AWS IoT", "Git/GitHub", "SendGrid", "Google Apps Script"],
        icons: [
            "nodedotjs", "flask", "amazonaws", "googlecloud", "git", "github", 
            "docker", "vercel", "firebase", "postman", "vscode", "vim"
        ]
    }
];

export default function SkillsSection() {
    const [selectedCategory, setSelectedCategory] = useState<typeof skillsData[0] | null>(null);

    const openModal = (category: typeof skillsData[0]) => {
        setSelectedCategory(category);
    };

    const closeModal = () => {
        setSelectedCategory(null);
    };

    return (
        <section id="skills" className="py-24 relative">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    Skills & Technologies
                </h2>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto px-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsData.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => openModal(category)}
                            className="cursor-pointer"
                        >
                            <AnimatedCard
                                title={category.title}
                                description={category.description}
                                className="p-6 h-40 flex flex-col justify-center hover:scale-105 transition-transform duration-300"
                            >
                                <div className="space-y-2">
                                    {category.skills.map((skill, skillIndex) => (
                                        <motion.div
                                            key={skill}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ 
                                                duration: 0.4, 
                                                delay: (index * 0.1) + (skillIndex * 0.05) + 0.2 
                                            }}
                                            className="flex items-center space-x-2 text-sm text-neutral-700 dark:text-neutral-300"
                                        >
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            <span>{skill}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCategory && (
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
                            className="bg-white dark:bg-neutral-900 rounded-2xl p-4 max-w-2xl w-full max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                                        {selectedCategory.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        {selectedCategory.description}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="mb-3">
                                    <IconCloud 
                                        images={selectedCategory.icons.map(
                                            (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
                                        )} 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    {selectedCategory.skills.map((skill) => (
                                        <div 
                                            key={skill}
                                            className="flex items-center space-x-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                                        >
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}