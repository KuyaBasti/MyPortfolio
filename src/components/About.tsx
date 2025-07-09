"use client";

import { motion } from "motion/react";

export default function About() {
    return (
        <section className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-neutral-800 dark:text-white mb-12">
                    About Me
                </h2>
                
                <div className="space-y-6 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        Hi, I&apos;m <span className="text-blue-400 font-semibold">John Sebastian Solon</span>, 
                        a passionate embedded systems and software engineer currently pursuing my Bachelor&apos;s degree in 
                        Computer Science and Engineering at UC Davis. I&apos;m driven by the intersection of hardware and 
                        software, where elegant code meets real-world applications.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        My journey in technology began with a curiosity about how things work under the hood. 
                        From developing <span className="text-green-400 font-medium">autonomous race car systems</span> with 
                        ROS2 to contributing to <span className="text-blue-400 font-medium">NASA-affiliated CubeSatellite projects</span>, 
                        I&apos;ve had the privilege of working on cutting-edge projects that push the boundaries of what&apos;s possible.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        When I&apos;m not coding or working with embedded systems, you&apos;ll find me exploring new technologies, 
                        mentoring fellow students, or diving deep into research on autonomous systems and AI. 
                        I believe in the power of technology to solve real-world problems and make a positive impact on society.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center italic"
                    >
                        &ldquo;Building tomorrow&apos;s technology, one line of code at a time.&rdquo;
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
} 