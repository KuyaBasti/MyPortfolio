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
                        I&apos;m always interested in new opportunities and collaborations. 
                        Feel free to reach out if you&apos;d like to discuss embedded systems, 
                        robotics, or any exciting projects!
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white text-center">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-col items-center text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="text-blue-600 dark:text-blue-400 mb-2">
                                        {item.icon}
                                    </div>
                                    <div className="w-full">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 text-xs break-all"
                                            >
                                                {item.value}
                                                <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                            </a>
                                        ) : (
                                            <p className="text-neutral-800 dark:text-white text-xs break-all">
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
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
                            Let&apos;s Build Something Amazing Together
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Whether it&apos;s autonomous systems, embedded firmware, or innovative robotics projects, 
                            I&apos;m excited to collaborate and create cutting-edge solutions.
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