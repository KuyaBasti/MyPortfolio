"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sora } from "@/app/layout";

const links = [
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className={`${sora.className} fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-12 h-[60px]`}
            style={{
                background: "rgba(5,5,5,0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
        >
            {/* Logo */}
            <a
                href="#"
                className="text-[15px] font-semibold tracking-[3px] uppercase text-white"
            >
                JS<span className="text-[#818cf8]">.</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="text-[13px] tracking-[0.5px] text-[#555] no-underline transition-colors duration-300 hover:text-white"
                    >
                        {link.name}
                    </a>
                ))}
            </div>

            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
            >
                <span
                    className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                        mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
                    }`}
                />
                <span
                    className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                        mobileOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                    className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
                        mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                    }`}
                />
            </button>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[60px] z-50 flex flex-col items-center justify-center gap-8"
                        style={{
                            background: "rgba(5,5,5,0.95)",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        {links.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => setMobileOpen(false)}
                                className="text-2xl font-light text-[#888] hover:text-white transition-colors"
                            >
                                {link.name}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
