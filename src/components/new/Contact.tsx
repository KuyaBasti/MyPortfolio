"use client";

import { motion } from "motion/react";

export default function Contact() {
    return (
        <section id="contact" className="relative mx-auto max-w-[1100px] px-8 py-40 text-center">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
            >
                <h2
                    className="mb-7 font-bold leading-[0.98] tracking-[-0.035em]"
                    style={{ fontSize: "clamp(56px, 9vw, 128px)" }}
                >
                    Let&apos;s build
                    <br />
                    <span className="iri">something good.</span>
                </h2>
                <p className="mb-9 text-[22px]" style={{ color: "var(--ink-soft)" }}>
                    jsvsolon@gmail.com · Yuba City, California
                </p>
                <div className="flex flex-wrap justify-center gap-[18px]">
                    <a
                        href="mailto:jsvsolon@gmail.com"
                        className="rounded-full px-[30px] py-[14px] text-[16px] font-semibold transition-transform duration-200 hover:scale-[1.04]"
                        style={{
                            background: "var(--green)",
                            color: "#05140a",
                            boxShadow: "0 0 0 1px var(--green-dim), 0 0 30px -6px rgba(40,200,90,0.6)",
                        }}
                    >
                        Say hello
                    </a>
                    <a
                        href="https://github.com/KuyaBasti"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass"
                    >
                        GitHub ›
                    </a>
                    <a
                        href="https://www.linkedin.com/in/jssolon/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass"
                    >
                        LinkedIn ›
                    </a>
                </div>
            </motion.div>

            <style>{`
                .btn-glass {
                    padding: 14px 30px; border-radius: 999px;
                    background: rgba(20,26,34,0.5);
                    border: 1px solid var(--hairline);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    color: var(--ink); font-family: var(--font-mono); font-size: 15px; font-weight: 500;
                    transition: transform .25s, background .25s, border-color .25s, color .25s;
                }
                .btn-glass:hover { transform: scale(1.04); background: rgba(40,200,90,0.1); border-color: var(--green-dim); color: var(--green-bright); }
            `}</style>
        </section>
    );
}
