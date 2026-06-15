"use client";

import { motion } from "motion/react";

const ease = [0.28, 0.16, 0.22, 1.0] as const;

export default function Hero() {
    return (
        <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-[22px] pb-16 pt-[120px] text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease }}
                className="mb-[18px] text-[17px] font-normal"
                style={{ color: "var(--accent)" }}
            >
                New · Portfolio 2026
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease }}
                className="mb-5 max-w-[1000px] font-semibold leading-[1.05] tracking-[-0.025em]"
                style={{ fontSize: "clamp(56px, 9vw, 112px)" }}
            >
                The space between
                <br />
                <span className="iri">hardware and software.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease }}
                className="mb-9 max-w-[720px] leading-[1.4]"
                style={{ fontSize: "clamp(20px, 2.2vw, 28px)", color: "var(--ink-soft)" }}
            >
                I&apos;m John Sebastian Solon — a Software &amp; Embedded Engineer who builds
                the rare things that work end-to-end: from the firmware on the metal to the
                cloud that talks to it.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.65, ease }}
                className="flex flex-wrap items-center justify-center gap-[22px]"
            >
                <a
                    href="#projects"
                    className="rounded-full px-[26px] py-[13px] text-[17px] text-white transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: "var(--accent)" }}
                >
                    See my work
                </a>
                <a
                    href="#contact"
                    className="group text-[17px] transition-colors duration-200"
                    style={{ color: "var(--accent)" }}
                >
                    Get in touch
                    <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                        ›
                    </span>
                </a>
            </motion.div>

            <motion.div
                aria-hidden
                animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "var(--ink-faint)" }}
            >
                Scroll
            </motion.div>
        </section>
    );
}
