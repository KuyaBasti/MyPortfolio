"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { experiences } from "@/data/portfolio";
import { sora, jetbrainsMono } from "@/lib/fonts";

// Maps company name → left-side overlay animation
const cardBackgrounds: Record<string, ReactNode> = {
    "Quanta Manufacturing":                    <ServerRoom />,
    "ubreakifix by Asurion":                   <CircuitBoard />,
    "UCD CORE Lab \u2013 F1Tenth":             <RaceCar />,
    "NASA \u2013 Space and Satellite Systems": <Satellite />,
};

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
                        className="relative overflow-hidden rounded-xl border border-[#131313] bg-[#0a0a0a] pl-[220px] pr-7 py-6 transition-colors duration-300 hover:border-[#222]"
                    >
                        {/* Full-height left-side animation overlay */}
                        {cardBackgrounds[exp.company] && (
                            <div className="exp-anim-overlay">
                                {cardBackgrounds[exp.company]}
                            </div>
                        )}

                        {/* Info */}
                        <div className="relative z-10">
                            <div className="flex items-baseline justify-between gap-4 mb-0.5">
                                <h3 className="text-[16px] font-medium text-white">
                                    {exp.companyUrl ? (
                                        <a
                                            href={exp.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white no-underline hover:text-[#e0e0e0] transition-colors"
                                        >
                                            {exp.company}
                                        </a>
                                    ) : (
                                        exp.company
                                    )}
                                </h3>
                                <span className={`${jetbrainsMono.className} text-xs text-[#444] flex-shrink-0`}>
                                    {exp.date}
                                </span>
                            </div>

                            <div className="flex items-baseline justify-between gap-4 mb-3">
                                <span className="text-[13px] text-[#666]">{exp.role}</span>
                                <span className="text-[13px] text-[#555] flex-shrink-0">{exp.location}</span>
                            </div>

                            <ul className="space-y-1.5">
                                {exp.details.map((detail, j) => (
                                    <li key={j} className="flex gap-2 text-[13px] text-[#555] leading-[1.6]">
                                        <span className="text-[#333] mt-[4px] flex-shrink-0 text-[10px]">▸</span>
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                /* ─── Left-side overlay (fills card height, left column width) ─── */
                .exp-anim-overlay {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 210px;
                    pointer-events: none;
                    overflow: hidden;
                }
                /* Fade the right edge so animation blends into card */
                .exp-anim-overlay::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0; bottom: 0;
                    width: 60px;
                    background: linear-gradient(to right, transparent, #0a0a0a);
                }

                /* ═══════════════════════════════════════════════════════
                   QUANTA MANUFACTURING — Isometric Server Room
                ═══════════════════════════════════════════════════════ */
                .srv-scene {
                    position: absolute; inset: 0;
                    background: linear-gradient(160deg, #060610 0%, #08081a 100%);
                    overflow: hidden;
                }

                /* Floor grid lines */
                .srv-floor {
                    position: absolute;
                    bottom: 0; left: -10px; right: 0;
                    height: 40%;
                    background-image:
                        linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
                    background-size: 20px 20px;
                    transform: perspective(80px) rotateX(30deg);
                    transform-origin: bottom center;
                }

                /* Individual rack cabinet */
                .srv-cab {
                    position: absolute;
                    bottom: 22%;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding: 4px 3px;
                    border-radius: 2px;
                    background: rgba(99,102,241,0.05);
                    border-top: 2px solid rgba(99,102,241,0.2);
                    border-left: 1px solid rgba(99,102,241,0.12);
                    border-right: 1px solid rgba(99,102,241,0.06);
                    border-bottom: 1px solid rgba(99,102,241,0.08);
                    /* Isometric depth effect */
                    box-shadow:
                        -3px 3px 0 rgba(40,40,80,0.8),
                        -6px 6px 0 rgba(30,30,60,0.6),
                        inset 0 0 8px rgba(99,102,241,0.04);
                }
                /* Rack positions */
                .srv-cab-1 { left: 12px;  width: 26px; height: 80px; }
                .srv-cab-2 { left: 42px;  width: 26px; height: 90px; }
                .srv-cab-3 { left: 72px;  width: 26px; height: 85px; }
                /* Shift each cab down slightly for depth */
                .srv-cab-1 { transform: translateY(4px); }
                .srv-cab-3 { transform: translateY(2px); }

                /* Rack unit rows */
                .srv-row {
                    height: 6px;
                    border-radius: 1px;
                    background: rgba(99,102,241,0.08);
                    border: 1px solid rgba(99,102,241,0.1);
                    position: relative;
                    flex-shrink: 0;
                }
                /* LED dot on each row */
                .srv-row::after {
                    content: '';
                    position: absolute;
                    right: 2px; top: 50%;
                    transform: translateY(-50%);
                    width: 2px; height: 2px;
                    border-radius: 50%;
                    animation: srvLed 2s ease-in-out infinite;
                }
                /* Stagger & color LEDs per position */
                .srv-cab-1 .srv-row:nth-child(1)::after  { background: rgba(99,102,241,0.8);  animation-delay: 0.0s; }
                .srv-cab-1 .srv-row:nth-child(2)::after  { background: rgba(34,197,94,0.7);   animation-delay: 0.3s; }
                .srv-cab-1 .srv-row:nth-child(3)::after  { background: rgba(99,102,241,0.7);  animation-delay: 0.6s; }
                .srv-cab-1 .srv-row:nth-child(4)::after  { background: rgba(250,204,21,0.7);  animation-delay: 0.9s; }
                .srv-cab-1 .srv-row:nth-child(5)::after  { background: rgba(99,102,241,0.8);  animation-delay: 1.2s; }
                .srv-cab-1 .srv-row:nth-child(6)::after  { background: rgba(34,197,94,0.6);   animation-delay: 1.5s; }
                .srv-cab-1 .srv-row:nth-child(7)::after  { background: rgba(99,102,241,0.7);  animation-delay: 1.8s; }
                .srv-cab-1 .srv-row:nth-child(8)::after  { background: rgba(250,204,21,0.6);  animation-delay: 0.4s; }
                .srv-cab-1 .srv-row:nth-child(9)::after  { background: rgba(99,102,241,0.8);  animation-delay: 0.8s; }

                .srv-cab-2 .srv-row:nth-child(1)::after  { background: rgba(34,197,94,0.8);   animation-delay: 0.2s; }
                .srv-cab-2 .srv-row:nth-child(2)::after  { background: rgba(99,102,241,0.7);  animation-delay: 0.5s; }
                .srv-cab-2 .srv-row:nth-child(3)::after  { background: rgba(250,204,21,0.8);  animation-delay: 0.8s; }
                .srv-cab-2 .srv-row:nth-child(4)::after  { background: rgba(99,102,241,0.7);  animation-delay: 1.1s; }
                .srv-cab-2 .srv-row:nth-child(5)::after  { background: rgba(34,197,94,0.7);   animation-delay: 1.4s; }
                .srv-cab-2 .srv-row:nth-child(6)::after  { background: rgba(99,102,241,0.8);  animation-delay: 1.7s; }
                .srv-cab-2 .srv-row:nth-child(7)::after  { background: rgba(250,204,21,0.6);  animation-delay: 0.1s; }
                .srv-cab-2 .srv-row:nth-child(8)::after  { background: rgba(99,102,241,0.7);  animation-delay: 0.6s; }
                .srv-cab-2 .srv-row:nth-child(9)::after  { background: rgba(34,197,94,0.8);   animation-delay: 1.0s; }
                .srv-cab-2 .srv-row:nth-child(10)::after { background: rgba(99,102,241,0.8);  animation-delay: 1.3s; }

                .srv-cab-3 .srv-row:nth-child(1)::after  { background: rgba(99,102,241,0.7);  animation-delay: 0.4s; }
                .srv-cab-3 .srv-row:nth-child(2)::after  { background: rgba(250,204,21,0.7);  animation-delay: 0.7s; }
                .srv-cab-3 .srv-row:nth-child(3)::after  { background: rgba(34,197,94,0.8);   animation-delay: 1.0s; }
                .srv-cab-3 .srv-row:nth-child(4)::after  { background: rgba(99,102,241,0.8);  animation-delay: 1.3s; }
                .srv-cab-3 .srv-row:nth-child(5)::after  { background: rgba(250,204,21,0.6);  animation-delay: 1.6s; }
                .srv-cab-3 .srv-row:nth-child(6)::after  { background: rgba(99,102,241,0.7);  animation-delay: 0.2s; }
                .srv-cab-3 .srv-row:nth-child(7)::after  { background: rgba(34,197,94,0.7);   animation-delay: 0.9s; }
                .srv-cab-3 .srv-row:nth-child(8)::after  { background: rgba(99,102,241,0.8);  animation-delay: 1.5s; }
                .srv-cab-3 .srv-row:nth-child(9)::after  { background: rgba(250,204,21,0.7);  animation-delay: 0.5s; }

                @keyframes srvLed {
                    0%,100% { opacity: 0.2; }
                    50%     { opacity: 1; box-shadow: 0 0 3px currentColor; }
                }

                /* Active-door glow on center rack */
                .srv-cab-2::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 100%;
                    background: linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 100%);
                    animation: srvGlow 3s ease-in-out infinite;
                }
                @keyframes srvGlow {
                    0%,100% { opacity: 0.4; }
                    50%     { opacity: 1; }
                }

                /* Technician silhouette (SVG inline-like using CSS shapes) */
                .srv-tech {
                    position: absolute;
                    bottom: 20%;
                    left: 52px;
                }
                /* Head */
                .srv-tech-head {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: rgba(180,170,220,0.25);
                    margin: 0 auto 1px;
                }
                /* Body */
                .srv-tech-body {
                    width: 9px; height: 14px;
                    background: rgba(160,150,200,0.2);
                    border-radius: 2px 2px 1px 1px;
                    margin: 0 auto;
                    position: relative;
                }
                /* Laptop arm */
                .srv-tech-body::after {
                    content: '';
                    position: absolute;
                    right: -8px; top: 4px;
                    width: 8px; height: 5px;
                    background: rgba(99,102,241,0.35);
                    border-radius: 1px;
                    box-shadow: 0 0 4px rgba(99,102,241,0.3);
                    animation: lapGlow 2s ease-in-out infinite;
                }
                @keyframes lapGlow {
                    0%,100% { opacity: 0.4; box-shadow: 0 0 3px rgba(34,197,94,0.3); }
                    50%     { opacity: 1;   box-shadow: 0 0 8px rgba(34,197,94,0.6); background: rgba(34,197,94,0.5); }
                }

                /* Network packet stream */
                .srv-pkt {
                    position: absolute;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(99,102,241,0.5), transparent);
                    border-radius: 1px;
                    animation: srvPkt 2.5s ease-in-out infinite;
                }
                .srv-pkt-1 { width: 30px; top: 30%; left: 5%; animation-delay: 0.0s; }
                .srv-pkt-2 { width: 20px; top: 45%; left: 5%; animation-delay: 0.8s; }
                .srv-pkt-3 { width: 36px; top: 60%; left: 5%; animation-delay: 1.6s; }
                @keyframes srvPkt {
                    0%   { transform: translateX(-10px); opacity: 0; }
                    30%  { opacity: 0.8; }
                    100% { transform: translateX(160px); opacity: 0; }
                }

                /* PXE label */
                .srv-label {
                    position: absolute;
                    bottom: 6px; left: 10px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 7px; color: rgba(99,102,241,0.3);
                    letter-spacing: 1px;
                    animation: srvLed 4s ease-in-out infinite;
                }

                /* ═══════════════════════════════════════════════════════
                   REPAIR BENCH — ubreakifix
                ═══════════════════════════════════════════════════════ */
                .repair-container { position: absolute; inset: 0; background: linear-gradient(180deg, #07090d 0%, #090b10 100%); overflow: hidden; }
                /* workbench surface */
                .repair-bench {
                    position: absolute;
                    top: 64%; left: 0; right: 0; height: 2px;
                    background: rgba(110,90,60,0.22);
                }
                /* lamp: vertical arm */
                .repair-lamp-arm {
                    position: absolute;
                    right: 18%; top: 28%; width: 2px; height: 36%;
                    background: rgba(170,170,180,0.35); border-radius: 1px;
                }
                /* lamp: horizontal neck */
                .repair-lamp-neck {
                    position: absolute;
                    right: 18%; top: 28%; height: 2px; width: 26px;
                    background: rgba(170,170,180,0.35); border-radius: 1px;
                    transform-origin: right center;
                    transform: rotate(-20deg);
                }
                /* lamp head */
                .repair-lamp-head {
                    position: absolute;
                    right: calc(18% + 23px); top: calc(28% + 4px);
                    width: 18px; height: 7px;
                    background: rgba(200,200,210,0.45);
                    border-radius: 2px 2px 4px 4px;
                    transform: rotate(-20deg);
                }
                /* light cone — soft spotlight on bench */
                .repair-light {
                    position: absolute;
                    right: calc(18% + 20px); top: calc(28% + 10px);
                    width: 0; height: 0;
                    border-left:  20px solid transparent;
                    border-right: 20px solid transparent;
                    border-bottom: 52px solid rgba(255,245,180,0.04);
                    animation: lampFlicker 3s ease-in-out infinite;
                }
                @keyframes lampFlicker {
                    0%,100% { opacity: 0.7; }
                    50%      { opacity: 1.0; }
                }
                /* light pool glow on bench under lamp */
                .repair-light-pool {
                    position: absolute;
                    right: calc(18% + 3px); top: 63%;
                    width: 36px; height: 6px;
                    border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(255,245,180,0.07) 0%, transparent 80%);
                    animation: lampFlicker 3s ease-in-out infinite;
                }
                /* device (phone / PCB) on bench */
                .repair-device {
                    position: absolute;
                    left: 32%; top: 59%;
                    width: 32px; height: 18px;
                    background: rgba(20,40,28,0.85);
                    border: 1px solid rgba(34,197,94,0.18);
                    border-radius: 2px;
                    box-shadow: 0 0 8px rgba(34,197,94,0.05);
                }
                /* PCB trace lines on device */
                .repair-device::before {
                    content: '';
                    position: absolute;
                    left: 4px; top: 5px; right: 4px; height: 1px;
                    background: rgba(34,197,94,0.22);
                }
                .repair-device::after {
                    content: '';
                    position: absolute;
                    left: 4px; top: 10px; right: 10px; height: 1px;
                    background: rgba(34,197,94,0.14);
                }
                /* solder pad on device — where iron is touching */
                .repair-solder-pad {
                    position: absolute;
                    left: 54%; top: 61%;
                    width: 4px; height: 4px;
                    border-radius: 50%;
                    background: rgba(34,197,94,0.3);
                    animation: padGlow 0.9s ease-in-out infinite;
                }
                @keyframes padGlow {
                    0%,100% { background: rgba(34,197,94,0.2); box-shadow: none; }
                    50%      { background: rgba(34,197,94,0.5); box-shadow: 0 0 6px rgba(34,197,94,0.4); }
                }
                /* soldering iron / probe */
                .repair-iron {
                    position: absolute;
                    left: 56%; top: 38%;
                    width: 2px; height: 28px;
                    background: linear-gradient(to bottom, rgba(160,160,160,0.5), rgba(200,200,200,0.3));
                    border-radius: 1px;
                    transform: rotate(18deg);
                    transform-origin: top center;
                    animation: ironBob 2.2s ease-in-out infinite;
                }
                /* glowing iron tip */
                .repair-iron-tip {
                    position: absolute;
                    left: calc(56% + 6px); top: calc(38% + 24px);
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: rgba(255,140,20,0.7);
                    box-shadow: 0 0 8px rgba(255,140,20,0.6);
                    animation: tipPulse 0.9s ease-in-out infinite;
                }
                @keyframes ironBob {
                    0%,100% { transform: rotate(18deg) translateY(0);    }
                    50%      { transform: rotate(18deg) translateY(-3px); }
                }
                @keyframes tipPulse {
                    0%,100% { opacity: 0.6; box-shadow: 0 0 5px rgba(255,140,20,0.5); }
                    50%      { opacity: 1.0; box-shadow: 0 0 12px rgba(255,140,20,0.8); }
                }
                /* multimeter body */
                .repair-meter {
                    position: absolute;
                    left: 6%; top: 50%;
                    width: 22px; height: 28px;
                    background: rgba(30,22,8,0.8);
                    border: 1px solid rgba(200,160,40,0.18);
                    border-radius: 2px;
                }
                /* meter screen */
                .repair-meter-screen {
                    position: absolute;
                    top: 3px; left: 3px; right: 3px; height: 9px;
                    background: rgba(30,55,30,0.7);
                    border-radius: 1px;
                }
                /* meter readout blink */
                .repair-meter-led {
                    position: absolute;
                    top: 2px; left: 2px;
                    width: 5px; height: 5px;
                    border-radius: 1px;
                    background: rgba(34,197,94,0.7);
                    animation: meterBlink 1.3s step-end infinite;
                }
                @keyframes meterBlink {
                    0%,48%   { opacity: 0.9; }
                    49%,100% { opacity: 0.15; }
                }
                /* meter probe wires */
                .repair-wire-r {
                    position: absolute;
                    left: calc(6% + 22px); top: calc(50% + 20px);
                    width: 16px; height: 1px;
                    background: rgba(220,50,50,0.35);
                    border-radius: 1px;
                }
                .repair-wire-b {
                    position: absolute;
                    left: calc(6% + 22px); top: calc(50% + 22px);
                    width: 11px; height: 1px;
                    background: rgba(60,80,220,0.35);
                    border-radius: 1px;
                }
                /* magnifying glass */
                .repair-loupe {
                    position: absolute;
                    left: 74%; top: calc(64% - 16px);
                    width: 14px; height: 14px;
                    border-radius: 50%;
                    border: 2px solid rgba(150,150,165,0.28);
                }
                .repair-loupe::after {
                    content: '';
                    position: absolute;
                    bottom: -9px; right: -3px;
                    width: 2px; height: 10px;
                    background: rgba(150,150,165,0.28);
                    transform: rotate(35deg);
                    border-radius: 1px;
                }
                /* small scattered components on bench */
                .repair-part {
                    position: absolute;
                    top: calc(64% - 3px);
                    background: rgba(90,70,140,0.3);
                    border: 1px solid rgba(120,90,180,0.2);
                    border-radius: 1px;
                }
                .repair-part-1 { left: 28%; width: 5px;  height: 3px; }
                .repair-part-2 { left: 66%; width: 3px;  height: 5px; }
                .repair-part-3 { left: 22%; width: 7px;  height: 2px; }

                /* ═══════════════════════════════════════════════════════
                   F1 CAR — CORE Lab F1Tenth
                ═══════════════════════════════════════════════════════ */
                .race-container { position: absolute; inset: 0; background: linear-gradient(160deg, #0a0a04 0%, #12120a 100%); overflow: hidden; }
                .race-road {
                    position: absolute;
                    bottom: 36%; left: 0; right: 0; height: 1px;
                    background: rgba(250,204,21,0.05);
                }
                /* car assembly — bobbing gently */
                .f1-assembly {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    animation: f1Bob 1.6s ease-in-out infinite;
                }
                @keyframes f1Bob {
                    0%,100% { transform: translate(-50%,-50%) translateY(0); }
                    50%     { transform: translate(-50%,-50%) translateY(-3px); }
                }
                /* main body */
                .f1-body {
                    position: relative;
                    width: 74px; height: 12px;
                    background: linear-gradient(to right, rgba(250,204,21,0.2), rgba(250,204,21,0.5));
                    border-radius: 2px 8px 3px 2px;
                    box-shadow: 0 0 14px rgba(250,204,21,0.15);
                }
                .f1-body::before {
                    content: '';
                    position: absolute;
                    bottom: 2px; left: 8px; right: 12px; height: 2px;
                    background: rgba(250,204,21,0.2); border-radius: 1px;
                }
                /* rear wing */
                .f1-wing-rear {
                    position: absolute;
                    width: 14px; height: 3px;
                    background: rgba(250,204,21,0.45);
                    border-radius: 1px;
                    top: -8px; left: 1px;
                }
                .f1-wing-rear::before {
                    content: ''; position: absolute;
                    width: 2px; height: 8px;
                    background: rgba(250,204,21,0.3);
                    top: 0; left: 4px;
                }
                .f1-wing-rear::after {
                    content: ''; position: absolute;
                    width: 2px; height: 8px;
                    background: rgba(250,204,21,0.3);
                    top: 0; right: 2px;
                }
                /* cockpit bulge */
                .f1-cockpit {
                    position: absolute;
                    width: 20px; height: 7px;
                    background: rgba(190,160,0,0.3);
                    border-radius: 4px 4px 0 0;
                    top: -7px; left: 22px;
                }
                /* driver helmet */
                .f1-helmet {
                    position: absolute;
                    width: 11px; height: 11px;
                    border-radius: 50% 50% 40% 40%;
                    background: rgba(225,225,225,0.5);
                    border: 1px solid rgba(200,200,200,0.2);
                    top: -14px; left: 26px;
                }
                .f1-helmet::after {
                    content: ''; position: absolute;
                    width: 7px; height: 4px;
                    background: rgba(35,35,60,0.7);
                    border-radius: 0 0 3px 3px;
                    bottom: 1px; left: 2px;
                }
                /* nose cone */
                .f1-nose {
                    position: absolute;
                    width: 22px; height: 5px;
                    background: linear-gradient(to right, rgba(250,204,21,0.45), rgba(250,204,21,0.1));
                    border-radius: 1px 8px 4px 1px;
                    top: 4px; right: -20px;
                }
                /* front wing */
                .f1-wing-front {
                    position: absolute;
                    width: 20px; height: 2px;
                    background: rgba(250,204,21,0.3);
                    border-radius: 1px;
                    top: 10px; right: -22px;
                }
                /* number */
                .f1-number {
                    position: absolute;
                    font-size: 6px; font-weight: 700; font-family: monospace;
                    color: rgba(20,20,20,0.9);
                    top: 1px; left: 6px; line-height: 1;
                }
                /* wheels */
                .f1-wheel {
                    position: absolute;
                    width: 13px; height: 13px;
                    border-radius: 50%;
                    background: rgba(22,22,22,0.95);
                    border: 2px solid rgba(85,85,85,0.5);
                    animation: f1Spin 0.35s linear infinite;
                }
                @keyframes f1Spin {
                    0%   { box-shadow:  2px  0   0 rgba(250,204,21,0.45); }
                    25%  { box-shadow:  0    2px 0 rgba(250,204,21,0.45); }
                    50%  { box-shadow: -2px  0   0 rgba(250,204,21,0.45); }
                    75%  { box-shadow:  0   -2px 0 rgba(250,204,21,0.45); }
                    100% { box-shadow:  2px  0   0 rgba(250,204,21,0.45); }
                }
                .f1-wheel-rear  { top: 5px; left:  6px; }
                .f1-wheel-front { top: 5px; right: -17px; }
                /* speed lines trailing behind */
                .race-speed {
                    position: absolute; height: 1px; border-radius: 1px;
                    background: linear-gradient(to left, rgba(250,204,21,0.3), transparent);
                    animation: f1SpeedLine 0.75s ease-out infinite;
                }
                .race-sp1 { width: 28px; top: 43%; left:  6%; animation-delay: 0.00s; }
                .race-sp2 { width: 18px; top: 50%; left:  4%; animation-delay: 0.28s; }
                .race-sp3 { width: 36px; top: 57%; left:  8%; animation-delay: 0.55s; }
                .race-sp4 { width: 14px; top: 37%; left: 10%; animation-delay: 0.40s; }
                @keyframes f1SpeedLine {
                    0%   { transform: translateX(0);    opacity: 0.65; }
                    100% { transform: translateX(-18px); opacity: 0; }
                }
                /* LiDAR sweep (subtle — it's a ROS2 autonomous platform) */
                .race-lidar {
                    position: absolute; top: 47%; left: 52%;
                    width: 1px; height: 22px;
                    background: rgba(250,204,21,0.07);
                    transform-origin: bottom center;
                    animation: lidarSweep 1.4s ease-in-out infinite;
                }
                .race-lidar-2 { animation-delay: 0.35s; }
                .race-lidar-3 { animation-delay: 0.70s; }
                .race-lidar-4 { animation-delay: 1.05s; }
                @keyframes lidarSweep {
                    0%,100% { transform: rotate(-45deg); opacity: 0; }
                    50%     { transform: rotate( 45deg); opacity: 0.35; }
                }

                /* ═══════════════════════════════════════════════════════
                   SPACE LAUNCH — NASA
                ═══════════════════════════════════════════════════════ */
                .space-container { position: absolute; inset: 0; background: linear-gradient(180deg, #020410 0%, #040a1c 55%, #060c1a 100%); overflow: hidden; }
                /* stars */
                .space-star {
                    position: absolute; border-radius: 50%;
                    background: rgba(255,255,255,0.7);
                    animation: starTwinkle 2s ease-in-out infinite;
                }
                .ss1  { width: 1px; height: 1px; top:  8%; left: 12%; animation-delay: 0.0s; }
                .ss2  { width: 2px; height: 2px; top: 14%; left: 68%; animation-delay: 0.4s; }
                .ss3  { width: 1px; height: 1px; top: 22%; left: 35%; animation-delay: 0.8s; }
                .ss4  { width: 2px; height: 2px; top: 32%; left: 80%; animation-delay: 1.2s; }
                .ss5  { width: 1px; height: 1px; top: 44%; left: 22%; animation-delay: 0.6s; }
                .ss6  { width: 1px; height: 1px; top: 56%; left: 55%; animation-delay: 1.5s; }
                .ss7  { width: 2px; height: 2px; top: 70%; left: 74%; animation-delay: 0.3s; }
                .ss8  { width: 1px; height: 1px; top: 84%; left: 42%; animation-delay: 1.0s; }
                .ss9  { width: 1px; height: 1px; top: 18%; left: 50%; animation-delay: 0.2s; }
                .ss10 { width: 2px; height: 2px; top: 60%; left:  8%; animation-delay: 1.8s; }
                @keyframes starTwinkle {
                    0%,100% { opacity: 0.25; transform: scale(1);   }
                    50%      { opacity: 1.00; transform: scale(1.5); }
                }
                /* large purple planet — top-right, partially cropped */
                .space-planet-l {
                    position: absolute;
                    top: -20px; right: -20px;
                    width: 70px; height: 70px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 38% 32%, rgba(190,110,240,0.6), rgba(100,30,190,0.35));
                    box-shadow: inset -10px -10px 22px rgba(60,0,130,0.45);
                    animation: planetDrift 9s ease-in-out infinite;
                }
                .space-planet-l::before {
                    content: ''; position: absolute; inset: 0; border-radius: 50%;
                    background: repeating-linear-gradient(
                        168deg, transparent 0, transparent 8px,
                        rgba(210,160,255,0.1) 8px, rgba(210,160,255,0.1) 10px
                    );
                }
                /* small orange planet — bottom-left, partially cropped */
                .space-planet-s {
                    position: absolute;
                    bottom: -14px; left: -14px;
                    width: 46px; height: 46px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 40% 34%, rgba(230,140,60,0.55), rgba(160,65,18,0.32));
                    box-shadow: inset -6px -6px 16px rgba(100,28,0,0.4);
                    animation: planetDrift 11s ease-in-out infinite 1.5s;
                }
                .space-planet-s::before {
                    content: ''; position: absolute; inset: 0; border-radius: 50%;
                    background: repeating-linear-gradient(
                        162deg, transparent 0, transparent 6px,
                        rgba(255,190,90,0.1) 6px, rgba(255,190,90,0.1) 8px
                    );
                }
                @keyframes planetDrift {
                    0%,100% { transform: translateY(0);    }
                    50%      { transform: translateY(-5px); }
                }
                /* rocket assembly */
                .rocket-assembly {
                    position: absolute;
                    left: 50%; top: 48%;
                    width: 32px; height: 90px;
                    transform: translate(-50%, -50%);
                    animation: rocketFloat 3s ease-in-out infinite;
                }
                @keyframes rocketFloat {
                    0%,100% { transform: translate(-50%,-50%) translateY(0);    }
                    50%      { transform: translate(-50%,-50%) translateY(-7px); }
                }
                /* nose cone */
                .rocket-nose {
                    position: absolute;
                    left: 50%; top: 0;
                    transform: translateX(-50%);
                    width: 0; height: 0;
                    border-left:  9px solid transparent;
                    border-right: 9px solid transparent;
                    border-bottom: 16px solid rgba(150,22,22,0.8);
                }
                /* main body */
                .rocket-body {
                    position: absolute;
                    left: 50%; top: 16px;
                    transform: translateX(-50%);
                    width: 18px; height: 36px;
                    background: linear-gradient(to right, rgba(118,18,18,0.9), rgba(188,35,35,0.78), rgba(118,18,18,0.9));
                    border-radius: 2px 2px 0 0;
                }
                /* body highlight stripe */
                .rocket-body::before {
                    content: '';
                    position: absolute;
                    top: 3px; left: 3px; width: 3px; height: 14px;
                    background: rgba(255,255,255,0.12); border-radius: 2px;
                }
                /* porthole */
                .rocket-window {
                    position: absolute;
                    width: 8px; height: 8px; border-radius: 50%;
                    background: rgba(130,165,210,0.25);
                    border: 1px solid rgba(185,210,240,0.35);
                    top: 7px; left: 5px;
                }
                .rocket-window::after {
                    content: ''; position: absolute;
                    width: 2px; height: 2px; border-radius: 50%;
                    background: rgba(255,255,255,0.6);
                    top: 1px; left: 1px;
                }
                /* bottom collar */
                .rocket-collar {
                    position: absolute;
                    bottom: 0; left: -2px; right: -2px; height: 5px;
                    background: rgba(88,12,12,0.88); border-radius: 0 0 1px 1px;
                }
                /* fins */
                .rocket-fin-l {
                    position: absolute; bottom: 0; left: -7px;
                    width: 0; height: 0;
                    border-bottom: 12px solid rgba(112,15,15,0.8);
                    border-left: 0 solid transparent;
                    border-right: 7px solid transparent;
                }
                .rocket-fin-r {
                    position: absolute; bottom: 0; right: -7px;
                    width: 0; height: 0;
                    border-bottom: 12px solid rgba(112,15,15,0.8);
                    border-left: 7px solid transparent;
                    border-right: 0 solid transparent;
                }
                /* inner flame */
                .rocket-flame {
                    position: absolute;
                    left: 50%; bottom: -18px;
                    transform: translateX(-50%);
                    width: 10px; height: 18px;
                    background: linear-gradient(to bottom, rgba(255,225,55,0.95), rgba(255,105,20,0.78), rgba(255,50,10,0.3), transparent);
                    border-radius: 0 0 60% 60% / 0 0 80% 80%;
                    animation: flameDance 0.25s ease-in-out infinite alternate;
                }
                /* outer flame */
                .rocket-flame-outer {
                    position: absolute;
                    left: 50%; bottom: -14px;
                    transform: translateX(-50%);
                    width: 18px; height: 14px;
                    background: linear-gradient(to bottom, rgba(255,85,12,0.3), transparent);
                    border-radius: 0 0 60% 60% / 0 0 80% 80%;
                    animation: flameDance 0.35s ease-in-out infinite alternate-reverse;
                }
                @keyframes flameDance {
                    from { transform: translateX(-50%) scaleX(1)    scaleY(1);    opacity: 0.9; }
                    to   { transform: translateX(-50%) scaleX(0.82) scaleY(1.14); opacity: 1.0; }
                }
                /* smoke puffs */
                .rocket-smoke {
                    position: absolute; left: 50%; border-radius: 50%;
                    background: rgba(200,200,215,0.18);
                    animation: smokeRise 1.8s ease-out infinite;
                }
                .rsmk-1 { width: 6px;  height: 6px;  bottom: -28px; margin-left: -3px;   animation-delay: 0.00s; }
                .rsmk-2 { width: 8px;  height: 8px;  bottom: -37px; margin-left: -4px;   animation-delay: 0.30s; }
                .rsmk-3 { width: 10px; height: 10px; bottom: -48px; margin-left: -5px;   animation-delay: 0.60s; }
                .rsmk-4 { width: 7px;  height: 7px;  bottom: -56px; margin-left: -3.5px; animation-delay: 0.90s; }
                @keyframes smokeRise {
                    0%   { opacity: 0.5; transform: translateY(0)    scale(1);   }
                    100% { opacity: 0;   transform: translateY(-15px) scale(1.6); }
                }
                .sat-label {
                    position: absolute; bottom: 6px; left: 8px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 7px; color: rgba(96,165,250,0.3); letter-spacing: 1px;
                    white-space: nowrap; animation: satOrbitPulse 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}

// ─── Animation components ─────────────────────────────────────────────────────

function ServerRoom() {
    return (
        <div className="srv-scene">
            <div className="srv-floor" />

            {/* Rack 1 */}
            <div className="srv-cab srv-cab-1">
                {Array.from({ length: 9 }, (_, i) => <div key={i} className="srv-row" />)}
            </div>

            {/* Rack 2 — center, active */}
            <div className="srv-cab srv-cab-2">
                {Array.from({ length: 10 }, (_, i) => <div key={i} className="srv-row" />)}
            </div>

            {/* Rack 3 */}
            <div className="srv-cab srv-cab-3">
                {Array.from({ length: 9 }, (_, i) => <div key={i} className="srv-row" />)}
            </div>

            {/* Technician silhouette */}
            <div className="srv-tech">
                <div className="srv-tech-head" />
                <div className="srv-tech-body" />
            </div>

            {/* Network packet streams */}
            <div className="srv-pkt srv-pkt-1" />
            <div className="srv-pkt srv-pkt-2" />
            <div className="srv-pkt srv-pkt-3" />

            <div className="srv-label">PXE BOOT</div>
        </div>
    );
}

function CircuitBoard() {
    return (
        <div className="repair-container">
            <div className="repair-bench" />
            <div className="repair-lamp-arm" />
            <div className="repair-lamp-neck" />
            <div className="repair-lamp-head" />
            <div className="repair-light" />
            <div className="repair-light-pool" />
            <div className="repair-device" />
            <div className="repair-solder-pad" />
            <div className="repair-iron" />
            <div className="repair-iron-tip" />
            <div className="repair-meter">
                <div className="repair-meter-screen">
                    <div className="repair-meter-led" />
                </div>
            </div>
            <div className="repair-wire-r" />
            <div className="repair-wire-b" />
            <div className="repair-loupe" />
            <div className="repair-part repair-part-1" />
            <div className="repair-part repair-part-2" />
            <div className="repair-part repair-part-3" />
        </div>
    );
}

function RaceCar() {
    return (
        <div className="race-container">
            <div className="race-road" />
            <div className="race-lidar" />
            <div className="race-lidar race-lidar-2" />
            <div className="race-lidar race-lidar-3" />
            <div className="race-lidar race-lidar-4" />
            <div className="race-speed race-sp1" />
            <div className="race-speed race-sp2" />
            <div className="race-speed race-sp3" />
            <div className="race-speed race-sp4" />
            <div className="f1-assembly">
                <div className="f1-body">
                    <div className="f1-number">1</div>
                    <div className="f1-cockpit" />
                    <div className="f1-helmet" />
                    <div className="f1-wing-rear" />
                    <div className="f1-nose" />
                    <div className="f1-wing-front" />
                    <div className="f1-wheel f1-wheel-rear" />
                    <div className="f1-wheel f1-wheel-front" />
                </div>
            </div>
        </div>
    );
}

function Satellite() {
    return (
        <div className="space-container">
            {/* stars */}
            <div className="space-star ss1" /><div className="space-star ss2" />
            <div className="space-star ss3" /><div className="space-star ss4" />
            <div className="space-star ss5" /><div className="space-star ss6" />
            <div className="space-star ss7" /><div className="space-star ss8" />
            <div className="space-star ss9" /><div className="space-star ss10" />
            {/* planets */}
            <div className="space-planet-l" />
            <div className="space-planet-s" />
            {/* rocket */}
            <div className="rocket-assembly">
                <div className="rocket-nose" />
                <div className="rocket-body">
                    <div className="rocket-window" />
                    <div className="rocket-collar" />
                    <div className="rocket-fin-l" />
                    <div className="rocket-fin-r" />
                    <div className="rocket-flame" />
                    <div className="rocket-flame-outer" />
                    <div className="rocket-smoke rsmk-1" />
                    <div className="rocket-smoke rsmk-2" />
                    <div className="rocket-smoke rsmk-3" />
                    <div className="rocket-smoke rsmk-4" />
                </div>
            </div>
        </div>
    );
}
