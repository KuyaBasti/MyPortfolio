"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const links = [
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-[100] h-[52px]"
            style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "saturate(180%) blur(20px)",
                WebkitBackdropFilter: "saturate(180%) blur(20px)",
                borderBottom: "1px solid var(--hairline)",
            }}
        >
            <div className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-[22px] text-[13px]">
                {/* Brand */}
                <a href="#" className="font-semibold tracking-[-0.01em] text-[15px]">
                    jss<span className="iri">.</span>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-9">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="opacity-85 transition-opacity duration-200 hover:opacity-100"
                            style={{ color: "var(--ink)" }}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <a
                    href="#contact"
                    className="hidden md:inline-block rounded-full px-3 py-1 text-white transition-all duration-200 hover:scale-[1.03]"
                    style={{ background: "var(--accent)" }}
                >
                    Contact
                </a>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    <span
                        className={`block w-5 h-[1.5px] bg-[#1d1d1f] transition-all duration-300 ${
                            mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
                        }`}
                    />
                    <span
                        className={`block w-5 h-[1.5px] bg-[#1d1d1f] transition-all duration-300 ${
                            mobileOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span
                        className={`block w-5 h-[1.5px] bg-[#1d1d1f] transition-all duration-300 ${
                            mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[52px] z-50 flex flex-col items-center justify-center gap-8 md:hidden"
                        style={{
                            background: "rgba(255,255,255,0.92)",
                            backdropFilter: "saturate(180%) blur(20px)",
                            WebkitBackdropFilter: "saturate(180%) blur(20px)",
                        }}
                    >
                        {[...links, { name: "Contact", href: "#contact" }].map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => setMobileOpen(false)}
                                className="text-2xl font-light transition-colors"
                                style={{ color: "var(--ink-soft)" }}
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
