"use client";

import { motion } from "motion/react";
import { sora } from "@/app/layout";

export default function Hero() {
    return (
        <section
            className={`${sora.className} relative min-h-screen flex items-center justify-center overflow-hidden`}
            style={{ background: "#050505" }}
        >
            {/* Floating gradient orbs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
                <div className="hero-orb hero-orb-3" />
                <div className="hero-orb hero-orb-4" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-[820px] px-6">
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xs tracking-[5px] uppercase text-[#777] mb-7 font-medium"
                >
                    Software &amp; Embedded Engineer
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-[42px] sm:text-[56px] md:text-[68px] font-bold tracking-[-3px] leading-[1.08] mb-7"
                >
                    Building at the
                    <br />
                    <span className="hero-gradient-text">
                        intersection of
                        <br />
                        hardware &amp; software
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-[#777] text-[17px] leading-[1.8] max-w-[560px] mx-auto mb-9"
                >
                    From production web apps to bare-metal firmware — I build
                    full-stack systems, autonomous robots, and everything in
                    between. CSE @ UC Davis.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex items-center justify-center gap-3.5 flex-wrap"
                >
                    <a href="#experience" className="hero-btn-glow">
                        View My Work
                    </a>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-btn-outline"
                    >
                        Resume &darr;
                    </a>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="hero-scroll-line" />
                <span className="text-[10px] tracking-[3px] text-[#333] uppercase">
                    Scroll
                </span>
            </motion.div>

            <style>{`
                /* Orbs */
                .hero-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                }
                .hero-orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%);
                    top: 5%;
                    left: 15%;
                    animation: heroF1 22s ease-in-out infinite;
                }
                .hero-orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);
                    bottom: 10%;
                    right: 10%;
                    animation: heroF2 28s ease-in-out infinite;
                }
                .hero-orb-3 {
                    width: 350px;
                    height: 350px;
                    background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%);
                    top: 35%;
                    right: 25%;
                    animation: heroF3 20s ease-in-out infinite;
                }
                .hero-orb-4 {
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%);
                    bottom: 30%;
                    left: 30%;
                    animation: heroF1 25s ease-in-out infinite reverse;
                }

                @keyframes heroF1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(40px, -30px) scale(1.05); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                }
                @keyframes heroF2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-50px, 25px) scale(1.08); }
                    66% { transform: translate(30px, -40px) scale(0.92); }
                }
                @keyframes heroF3 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(35px, 45px); }
                }

                /* Gradient text */
                .hero-gradient-text {
                    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 40%, #c084fc 70%, #f472b6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Buttons */
                .hero-btn-glow {
                    display: inline-block;
                    padding: 13px 30px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    color: #fff;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    border: none;
                    box-shadow: 0 0 30px rgba(124,58,237,0.25);
                    text-decoration: none;
                    transition: all 0.3s;
                    font-family: 'Sora', sans-serif;
                    cursor: pointer;
                }
                .hero-btn-glow:hover {
                    box-shadow: 0 0 50px rgba(124,58,237,0.45);
                    transform: translateY(-2px);
                }
                .hero-btn-outline {
                    display: inline-block;
                    padding: 13px 30px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    color: #999;
                    background: transparent;
                    border: 1px solid #2a2a2a;
                    text-decoration: none;
                    transition: all 0.3s;
                    font-family: 'Sora', sans-serif;
                    cursor: pointer;
                }
                .hero-btn-outline:hover {
                    border-color: #555;
                    color: #fff;
                }

                /* Scroll hint */
                .hero-scroll-line {
                    width: 1px;
                    height: 36px;
                    background: linear-gradient(to bottom, #333, transparent);
                    animation: heroScrollPulse 2s ease-in-out infinite;
                }
                @keyframes heroScrollPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
            `}</style>
        </section>
    );
}
