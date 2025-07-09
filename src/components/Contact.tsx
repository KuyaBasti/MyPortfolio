"use client";

import { motion } from "motion/react";
import { Mail, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";

export default function Contact() {
    const contactInfo = [
        {
            icon: <Mail className="w-5 h-5" />,
            label: "Email",
            value: "jsvsolon@gmail.com",
            href: "mailto:jsvsolon@gmail.com"
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            label: "Location",
            value: "Yuba City, California",
            href: null
        },
        {
            icon: <Github className="w-5 h-5" />,
            label: "GitHub",
            value: "KuyaBasti",
            href: "https://github.com/KuyaBasti"
        },
        {
            icon: <Linkedin className="w-5 h-5" />,
            label: "LinkedIn",
            value: "jssolon",
            href: "https://www.linkedin.com/in/jssolon/"
        }
    ];

    return (
        <section id="contact" className="py-24 relative">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        I'm always interested in new opportunities and collaborations. 
                        Feel free to reach out if you'd like to discuss embedded systems, 
                        robotics, or any exciting projects!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="text-blue-600 dark:text-blue-400">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                                            >
                                                {item.value}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <p className="text-neutral-800 dark:text-white">
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
                            Quick Links
                        </h3>
                        <div className="space-y-4">
                            <motion.a
                                href="#projects"
                                className="block p-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold">View My Projects</h4>
                                        <p className="text-sm text-blue-100">
                                            Explore my embedded systems and software projects
                                        </p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.a>

                            <motion.a
                                href="#work"
                                className="block p-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 transition-all duration-300 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold">Work Experience</h4>
                                        <p className="text-sm text-green-100">
                                            See my journey in robotics and embedded systems
                                        </p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.a>

                            <motion.a
                                href="#skills"
                                className="block p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold">Technical Skills</h4>
                                        <p className="text-sm text-purple-100">
                                            Discover my technical expertise and tools
                                        </p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
                            Let's Build Something Amazing Together
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Whether it's autonomous systems, embedded firmware, or innovative robotics projects, 
                            I'm excited to collaborate and create cutting-edge solutions.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <a
                                href="mailto:jsvsolon@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Send Email
                            </a>
                            <a
                                href="https://www.linkedin.com/in/jssolon/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 