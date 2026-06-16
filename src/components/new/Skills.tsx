"use client";

import { motion } from "motion/react";
import { skillCategories } from "@/data/portfolio";

export default function Skills() {
    return (
        <section id="skills" className="mx-auto max-w-[1100px] px-[22px] py-28">
            <div
                className="mono mb-4 text-[13px] font-medium uppercase tracking-[0.06em]"
                style={{ color: "var(--accent)" }}
            >
                04 — Skills
            </div>
            <h2
                className="mb-12 font-semibold leading-[1.1] tracking-[-0.025em]"
                style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
            >
                What I <span className="iri">work with.</span>
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skillCategories.map((cat, i) => (
                    <motion.div
                        key={cat.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        className="rounded-[24px] p-7"
                        style={{
                            background: "rgba(12,16,22,0.55)",
                            border: "1px solid var(--hairline)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            boxShadow: "0 0 50px -30px rgba(40,200,90,0.5), 0 20px 50px -30px #000",
                        }}
                    >
                        <h3 className="mb-5 text-[18px] font-semibold tracking-[-0.01em]">
                            {cat.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {cat.items.map((item) => (
                                <span
                                    key={item}
                                    className="mono rounded-full px-3 py-1.5 text-[12px]"
                                    style={{
                                        background: "rgba(40,200,90,0.08)",
                                        color: "var(--ink-soft)",
                                        border: "1px solid rgba(40,200,90,0.2)",
                                    }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
