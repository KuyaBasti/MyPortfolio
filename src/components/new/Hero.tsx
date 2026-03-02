"use client";

import { motion } from "motion/react";
import { personalInfo } from "@/data/portfolio";
import { sora } from "@/app/layout";

export default function Hero() {
    return (
        <section
            className={`${sora.className} relative min-h-screen flex items-center justify-center overflow-hidden`}
            style={{ background: "#060606" }}
        >
            {/* Floating gradient orbs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
                <div className="hero-orb hero-orb-3" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-6 font-medium"
                >
                    {personalInfo.title}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8"
                >
                    {personalInfo.name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="hero-gradient-text text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-12"
                >
                    Building at the intersection of hardware &amp; software
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="flex items-center justify-center gap-4 flex-wrap"
                >
                    <a
                        href="#projects"
                        className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                    >
                        View My Work
                    </a>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 border border-neutral-700 text-neutral-300 text-sm font-semibold rounded-full hover:border-neutral-500 hover:bg-white/5 transition-all"
                    >
                        Resume
                    </a>
                </motion.div>
            </div>

            {/* Orb + gradient-text styles with keyframes */}
            <style>{`
                .hero-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.35;
                    will-change: transform;
                }
                .hero-orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, #6366f1, transparent 70%);
                    top: -15%;
                    right: -10%;
                    animation: heroFloat1 22s ease-in-out infinite;
                }
                .hero-orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, #8b5cf6, transparent 70%);
                    bottom: -15%;
                    left: -10%;
                    animation: heroFloat2 28s ease-in-out infinite;
                }
                .hero-orb-3 {
                    width: 350px;
                    height: 350px;
                    background: radial-gradient(circle, #ec4899, transparent 70%);
                    top: 45%;
                    left: 55%;
                    animation: heroFloat3 18s ease-in-out infinite;
                }

                @keyframes heroFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 50px) scale(1.08); }
                    66% { transform: translate(30px, -40px) scale(0.95); }
                }
                @keyframes heroFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(50px, -30px) scale(1.1); }
                    66% { transform: translate(-30px, 40px) scale(0.92); }
                }
                @keyframes heroFloat3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-50px, -50px) scale(1.15); }
                }

                .hero-gradient-text {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>
        </section>
    );
}
