"use client";

import { motion } from "motion/react";
import { education, personalInfo } from "@/data/portfolio";

const facts = [
    { label: "Education", value: `${education[0].degree.replace("Bachelor of Science in ", "B.S. ")}, UC Davis` },
    { label: "Based in", value: personalInfo.location },
    { label: "Focus", value: "Firmware · Systems · Full-stack" },
];

export default function About() {
    return (
        <section id="about" className="mx-auto max-w-[900px] px-[22px] py-28">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
            >
                <div
                    className="mono mb-4 text-[13px] font-medium uppercase tracking-[0.06em]"
                    style={{ color: "var(--accent)" }}
                >
                    03 — About
                </div>
                <h2
                    className="mb-7 font-semibold leading-[1.1] tracking-[-0.025em]"
                    style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                    Comfortable at <span className="iri">both ends of the stack.</span>
                </h2>
                <p
                    className="max-w-[680px] text-[19px] leading-[1.6]"
                    style={{ color: "var(--ink-soft)" }}
                >
                    I&apos;m a Computer Science &amp; Engineering graduate from UC Davis who&apos;s
                    just as at home writing bare-metal C for a satellite IMU as I am shipping a
                    Phoenix/LiveView backend or a ROS2 perception stack. What I enjoy most is the
                    messy seam where hardware meets software — the place where a misread register
                    and a dropped packet turn out to be the same bug.
                </p>

                <div
                    className="mt-12 grid grid-cols-1 gap-8 border-t pt-10 sm:grid-cols-3"
                    style={{ borderColor: "rgba(0,0,0,0.08)" }}
                >
                    {facts.map((f) => (
                        <div key={f.label}>
                            <div
                                className="mono mb-2 text-[11px] uppercase tracking-[0.08em]"
                                style={{ color: "var(--ink-faint)" }}
                            >
                                {f.label}
                            </div>
                            <div className="text-[16px] font-medium" style={{ color: "var(--ink)" }}>
                                {f.value}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
