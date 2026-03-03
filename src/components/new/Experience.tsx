"use client";

import { motion } from "motion/react";
import { experiences } from "@/data/portfolio";
import { sora } from "@/app/layout";
import { jetbrainsMono } from "@/app/layout";

export default function Experience() {
    return (
        <section
            id="experience"
            className={`${sora.className} max-w-[1100px] mx-auto px-6 sm:px-10 py-24`}
        >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-12">
                <span className={`${jetbrainsMono.className} text-[13px] text-[#818cf8]`}>
                    01
                </span>
                <span className="text-[28px] font-semibold tracking-[-1px] text-white">
                    Experience
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-[#1a1a1a] to-transparent" />
            </div>

            {/* Experience stack */}
            <div className="flex flex-col gap-0.5">
                {experiences.map((exp, i) => (
                    <motion.div
                        key={`${exp.company}-${exp.date}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="group grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-7 rounded-xl border border-[#131313] bg-[#0a0a0a] px-6 sm:px-7 py-6 transition-colors duration-300 hover:border-[#222]"
                    >
                        {/* Date */}
                        <div
                            className={`${jetbrainsMono.className} text-xs text-[#444] pt-0.5`}
                        >
                            {exp.date}
                        </div>

                        {/* Info */}
                        <div>
                            <h3 className="text-[16px] font-medium text-white mb-0.5">
                                {exp.companyUrl ? (
                                    <a
                                        href={exp.companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#818cf8] no-underline hover:text-[#a5b4fc] transition-colors"
                                    >
                                        {exp.company}
                                    </a>
                                ) : (
                                    exp.company
                                )}
                            </h3>

                            <p className="text-[13px] text-[#666] mb-2">
                                {exp.role} &middot; {exp.location}
                            </p>

                            <div className="text-[13px] text-[#555] leading-[1.6] space-y-1.5">
                                {exp.details.map((detail, j) => (
                                    <p key={j}>{detail}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
