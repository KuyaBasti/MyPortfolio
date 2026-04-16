"use client";

import { motion } from "motion/react";

export default function Hero() {
    return (
        <section
            className="font-sora relative min-h-screen flex items-center justify-center overflow-hidden"
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
            <div className="relative z-10 text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-name-text hero-gradient-text mb-5"
                >
                    JOHN SEBASTIAN SOLON
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hero-subtitle mb-6"
                >
                    Software &amp; Embedded Engineer
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="hero-tagline"
                >
                    Bridging the gap between hardware and software
                </motion.p>
            </div>

            <style>{`
                /* Orbs */
                .hero-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                }
                .hero-orb-1 {
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%);
                    top: 5%; left: 15%;
                    animation: heroF1 22s ease-in-out infinite;
                }
                .hero-orb-2 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);
                    bottom: 10%; right: 10%;
                    animation: heroF2 28s ease-in-out infinite;
                }
                .hero-orb-3 {
                    width: 350px; height: 350px;
                    background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%);
                    top: 35%; right: 25%;
                    animation: heroF3 20s ease-in-out infinite;
                }
                .hero-orb-4 {
                    width: 250px; height: 250px;
                    background: radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%);
                    bottom: 30%; left: 30%;
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

                /* Full name */
                .hero-name-text {
                    font-size: clamp(36px, 7vw, 88px);
                    font-weight: 700;
                    letter-spacing: -2px;
                    line-height: 1.0;
                    white-space: nowrap;
                }

                /* Gradient — name only */
                .hero-gradient-text {
                    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 40%, #c084fc 70%, #f472b6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Subtitle — white */
                .hero-subtitle {
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                    color: #f0f0f0;
                }

                /* Tagline */
                .hero-tagline {
                    font-size: 15px;
                    color: #555;
                    letter-spacing: 0.3px;
                }
            `}</style>
        </section>
    );
}
