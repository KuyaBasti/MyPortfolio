"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { experiences } from "@/data/portfolio";
import { sora } from "@/app/layout";
import { jetbrainsMono } from "@/app/layout";

// Maps company name → background animation component
const cardBackgrounds: Record<string, ReactNode> = {
    "ubreakifix by Asurion": <CircuitBoard />,
    "Rukmer Inc.": <DroneFirmware />,
    "American Lost Children Association": <MapRoute />,
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
                        className="group relative overflow-hidden grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-7 rounded-xl border border-[#131313] bg-[#0a0a0a] px-6 sm:px-7 py-6 transition-colors duration-300 hover:border-[#222]"
                    >
                        {/* Per-card background animation */}
                        {cardBackgrounds[exp.company] && (
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {cardBackgrounds[exp.company]}
                            </div>
                        )}

                        {/* Date */}
                        <div
                            className={`${jetbrainsMono.className} relative text-xs text-[#444] pt-0.5`}
                        >
                            {exp.date}
                        </div>

                        {/* Info */}
                        <div className="relative">
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

            <style>{`
                /* ── Map route (American Lost Children Association) ── */
                .map-container { position: absolute; inset: 0; }
                /* Road grid lines */
                .map-road {
                    position: absolute;
                    background: rgba(251,146,60,0.06);
                }
                .map-road-h1 { height: 1px; width: 120px; top: 30%; right: 5%; }
                .map-road-h2 { height: 1px; width: 90px;  top: 55%; right: 8%; }
                .map-road-h3 { height: 1px; width: 70px;  top: 75%; right: 12%; }
                .map-road-v1 { width: 1px; height: 80px; top: 15%; right: 22%; }
                .map-road-v2 { width: 1px; height: 60px; top: 30%; right: 10%; }
                /* Location pins */
                .map-pin {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(251,146,60,0.35);
                }
                .map-pin::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 3px solid transparent;
                    border-right: 3px solid transparent;
                    border-top: 5px solid rgba(251,146,60,0.35);
                }
                .map-pin-a { top: 22%; right: 22%; animation: mapPinPop 3s ease-in-out infinite 0s; }
                .map-pin-b { top: 42%; right: 10%; animation: mapPinPop 3s ease-in-out infinite 0.6s; }
                .map-pin-c { top: 62%; right: 18%; animation: mapPinPop 3s ease-in-out infinite 1.2s; }
                .map-pin-d { top: 75%; right: 7%;  animation: mapPinPop 3s ease-in-out infinite 1.8s; }
                @keyframes mapPinPop {
                    0%, 100% { transform: scale(1);   opacity: 0.3; }
                    50%       { transform: scale(1.4); opacity: 0.7; }
                }
                /* Animated route line drawn with svg-like dash trick */
                .map-route-line {
                    position: absolute;
                    top: 24%;
                    right: 8%;
                    width: 2px;
                    height: 60px;
                    background: repeating-linear-gradient(
                        to bottom,
                        rgba(251,146,60,0.3) 0px,
                        rgba(251,146,60,0.3) 5px,
                        transparent 5px,
                        transparent 9px
                    );
                    animation: mapRouteDraw 2.5s ease-in-out infinite;
                }
                @keyframes mapRouteDraw {
                    0%        { background-position: 0 0;    opacity: 0.2; }
                    50%       { background-position: 0 -18px; opacity: 0.5; }
                    100%      { background-position: 0 0;    opacity: 0.2; }
                }
                /* Moving dot along route */
                .map-traveler {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #fb923c;
                    right: calc(8% + -1px);
                    top: 24%;
                    animation: mapTravel 2.5s ease-in-out infinite;
                    box-shadow: 0 0 6px rgba(251,146,60,0.5);
                }
                @keyframes mapTravel {
                    0%   { transform: translateY(0);   opacity: 0.8; }
                    100% { transform: translateY(60px); opacity: 0; }
                }

                /* ── Circuit board traces (ubreakifix) ── */
                .circuit-container {
                    position: absolute;
                    inset: 0;
                }
                .circuit-trace {
                    position: absolute;
                    background: #22c55e;
                    border-radius: 1px;
                }
                /* Horizontal traces */
                .ct-h1 { height: 1px; width: 80px; top: 20%; left: 60%; opacity: 0.08; animation: ctPulse 4s ease-in-out infinite; }
                .ct-h2 { height: 1px; width: 60px; top: 45%; left: 70%; opacity: 0.06; animation: ctPulse 4s ease-in-out infinite 1s; }
                .ct-h3 { height: 1px; width: 100px; top: 70%; left: 55%; opacity: 0.07; animation: ctPulse 4s ease-in-out infinite 2s; }
                /* Vertical traces */
                .ct-v1 { width: 1px; height: 50px; top: 15%; left: 72%; opacity: 0.06; animation: ctPulse 4s ease-in-out infinite 0.5s; }
                .ct-v2 { width: 1px; height: 40px; top: 40%; left: 85%; opacity: 0.08; animation: ctPulse 4s ease-in-out infinite 1.5s; }
                .ct-v3 { width: 1px; height: 60px; top: 25%; left: 62%; opacity: 0.05; animation: ctPulse 4s ease-in-out infinite 2.5s; }
                /* Solder pads */
                .ct-pad {
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #22c55e;
                }
                .ct-p1 { top: 20%; left: 72%; opacity: 0.12; animation: ctGlow 3s ease-in-out infinite; }
                .ct-p2 { top: 45%; left: 85%; opacity: 0.1; animation: ctGlow 3s ease-in-out infinite 1s; }
                .ct-p3 { top: 70%; left: 62%; opacity: 0.1; animation: ctGlow 3s ease-in-out infinite 2s; }
                .ct-p4 { top: 45%; left: 70%; opacity: 0.08; animation: ctGlow 3s ease-in-out infinite 0.5s; }
                /* IC chip outline */
                .ct-chip {
                    position: absolute;
                    width: 24px;
                    height: 16px;
                    border: 1px solid rgba(34,197,94,0.1);
                    border-radius: 2px;
                    top: 30%;
                    left: 78%;
                    animation: ctGlow 5s ease-in-out infinite 0.8s;
                }
                .ct-chip-pin {
                    position: absolute;
                    width: 4px;
                    height: 1px;
                    background: rgba(34,197,94,0.12);
                }
                .ct-chip-pin-l { left: -5px; }
                .ct-chip-pin-r { right: -5px; }
                .ct-chip-pin:nth-child(1) { top: 3px; }
                .ct-chip-pin:nth-child(2) { top: 8px; }
                .ct-chip-pin:nth-child(3) { top: 3px; }
                .ct-chip-pin:nth-child(4) { top: 8px; }

                @keyframes ctPulse {
                    0%, 100% { opacity: 0.04; }
                    50% { opacity: 0.15; }
                }
                @keyframes ctGlow {
                    0%, 100% { opacity: 0.06; box-shadow: 0 0 4px rgba(34,197,94,0); }
                    50% { opacity: 0.2; box-shadow: 0 0 8px rgba(34,197,94,0.15); }
                }

                /* ── Drone firmware delivery (Rukmer) ── */
                .drone-container { position: absolute; inset: 0; }
                .drone-body {
                    position: absolute;
                    top: 35%;
                    right: 18%;
                    width: 28px;
                    height: 10px;
                    background: rgba(129,140,248,0.15);
                    border-radius: 4px;
                    animation: droneHover 3s ease-in-out infinite;
                }
                .drone-rotor {
                    position: absolute;
                    height: 2px;
                    width: 16px;
                    background: rgba(129,140,248,0.2);
                    border-radius: 1px;
                    top: -4px;
                    animation: droneRotorSpin 0.15s linear infinite;
                }
                .drone-rotor-l { left: -6px; }
                .drone-rotor-r { right: -6px; }
                @keyframes droneRotorSpin {
                    0% { opacity: 0.25; }
                    50% { opacity: 0.1; }
                    100% { opacity: 0.25; }
                }
                @keyframes droneHover {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                /* Firmware packet dropping from drone */
                .drone-packet {
                    position: absolute;
                    width: 8px;
                    height: 6px;
                    border: 1px solid rgba(129,140,248,0.2);
                    border-radius: 2px;
                    right: 21%;
                    animation: dronePacketDrop 3s ease-in infinite;
                }
                .drone-pkt-1 { top: 48%; animation-delay: 0s; }
                .drone-pkt-2 { top: 48%; animation-delay: 1.5s; }
                @keyframes dronePacketDrop {
                    0% { transform: translateY(0); opacity: 0.25; }
                    60% { transform: translateY(30px); opacity: 0.15; }
                    80% { transform: translateY(30px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 0; }
                }
                /* Cloud / S3 icon */
                .drone-cloud {
                    position: absolute;
                    top: 18%;
                    right: 10%;
                    width: 30px;
                    height: 14px;
                    border: 1px solid rgba(129,140,248,0.08);
                    border-radius: 10px 10px 3px 3px;
                    animation: droneCloudPulse 4s ease-in-out infinite;
                }
                @keyframes droneCloudPulse {
                    0%, 100% { opacity: 0.06; }
                    50% { opacity: 0.15; }
                }
                /* Upload arrow from cloud */
                .drone-upload-arrow {
                    position: absolute;
                    top: 24%;
                    right: 16%;
                    width: 1px;
                    height: 12px;
                    background: rgba(129,140,248,0.12);
                    animation: droneUpload 2.5s ease-in-out infinite;
                }
                .drone-upload-arrow::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -3px;
                    border-left: 3.5px solid transparent;
                    border-right: 3.5px solid transparent;
                    border-bottom: 5px solid rgba(129,140,248,0.12);
                }
                @keyframes droneUpload {
                    0%, 100% { opacity: 0.08; }
                    50% { opacity: 0.2; }
                }
            `}</style>
        </section>
    );
}

// ─── Card background animations ──────────────────────────────────────────────

function MapRoute() {
    return (
        <div className="map-container">
            {/* Road grid */}
            <div className="map-road map-road-h1" />
            <div className="map-road map-road-h2" />
            <div className="map-road map-road-h3" />
            <div className="map-road map-road-v1" />
            <div className="map-road map-road-v2" />
            {/* Location pins */}
            <div className="map-pin map-pin-a" />
            <div className="map-pin map-pin-b" />
            <div className="map-pin map-pin-c" />
            <div className="map-pin map-pin-d" />
            {/* Animated route */}
            <div className="map-route-line" />
            <div className="map-traveler" />
        </div>
    );
}

function DroneFirmware() {
    return (
        <div className="drone-container">
            <div className="drone-cloud" />
            <div className="drone-upload-arrow" />
            <div className="drone-body">
                <div className="drone-rotor drone-rotor-l" />
                <div className="drone-rotor drone-rotor-r" />
            </div>
            <div className="drone-packet drone-pkt-1" />
            <div className="drone-packet drone-pkt-2" />
        </div>
    );
}

function CircuitBoard() {
    return (
        <div className="circuit-container">
            {/* Traces */}
            <div className="circuit-trace ct-h1" />
            <div className="circuit-trace ct-h2" />
            <div className="circuit-trace ct-h3" />
            <div className="circuit-trace ct-v1" />
            <div className="circuit-trace ct-v2" />
            <div className="circuit-trace ct-v3" />
            {/* Solder pads */}
            <div className="ct-pad ct-p1" />
            <div className="ct-pad ct-p2" />
            <div className="ct-pad ct-p3" />
            <div className="ct-pad ct-p4" />
            {/* IC chip */}
            <div className="ct-chip">
                <div className="ct-chip-pin ct-chip-pin-l" style={{ top: 3 }} />
                <div className="ct-chip-pin ct-chip-pin-l" style={{ top: 8 }} />
                <div className="ct-chip-pin ct-chip-pin-r" style={{ top: 3 }} />
                <div className="ct-chip-pin ct-chip-pin-r" style={{ top: 8 }} />
            </div>
        </div>
    );
}
