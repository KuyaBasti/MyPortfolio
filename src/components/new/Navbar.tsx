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
                background: "rgba(5,7,10,0.6)",
                backdropFilter: "saturate(160%) blur(14px)",
                WebkitBackdropFilter: "saturate(160%) blur(14px)",
                borderBottom: "1px solid var(--hairline)",
            }}
        >
            <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-[26px] text-[13px]">
                {/* Brand */}
                <a
                    href="#top"
                    className="font-semibold tracking-[-0.01em] text-[15px]"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    jss<span style={{ color: "var(--green-bright)" }}>_</span>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "var(--font-mono)" }}>
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="transition-colors duration-200"
                            style={{ color: "var(--ink-soft)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-bright)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <a
                    href="#contact"
                    className="hidden md:inline-block rounded-lg px-[14px] py-[6px] transition-all duration-200"
                    style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--green-bright)",
                        border: "1px solid var(--green-dim)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(40,200,90,0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                    ./contact
                </a>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    <span
                        className={`block w-5 h-[1.5px] bg-[#e6e8ee] transition-all duration-300 ${
                            mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
                        }`}
                    />
                    <span
                        className={`block w-5 h-[1.5px] bg-[#e6e8ee] transition-all duration-300 ${
                            mobileOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span
                        className={`block w-5 h-[1.5px] bg-[#e6e8ee] transition-all duration-300 ${
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
                            background: "rgba(5,7,10,0.94)",
                            backdropFilter: "saturate(160%) blur(16px)",
                            WebkitBackdropFilter: "saturate(160%) blur(16px)",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        {[...links, { name: "./contact", href: "#contact" }].map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => setMobileOpen(false)}
                                className="text-2xl transition-colors"
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
