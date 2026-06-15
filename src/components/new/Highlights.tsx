"use client";

import { motion } from "motion/react";

const stats = [
    { value: "4", label: "Engineering roles" },
    { value: "14", label: "Languages spoken (by code)" },
    { value: "6.6kHz", label: "Telemetry rate, 99.9% accurate" },
];

export default function Highlights() {
    return (
        <div
            className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-10 px-[22px] py-16 text-center sm:grid-cols-3"
            style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                    <div className="iri mb-2 text-[56px] font-semibold tracking-[-0.02em]">
                        {s.value}
                    </div>
                    <div className="text-[14px] tracking-[0.02em]" style={{ color: "var(--ink-muted)" }}>
                        {s.label}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
