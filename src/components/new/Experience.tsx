"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { experiences } from "@/data/portfolio";
import { sora, jetbrainsMono } from "@/lib/fonts";

// Maps company name → background animation component
const cardBackgrounds: Record<string, ReactNode> = {
    "Quanta Manufacturing":              <ServerRack />,
    "ubreakifix by Asurion":             <CircuitBoard />,
    "UCD CORE Lab \u2013 F1Tenth":       <RaceCar />,
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
                        className="group relative overflow-hidden grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 sm:gap-7 rounded-xl border border-[#131313] bg-[#0a0a0a] px-6 sm:px-7 py-6 transition-colors duration-300 hover:border-[#222]"
                    >
                        {/* Per-card background animation — revealed on hover */}
                        {cardBackgrounds[exp.company] && (
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {cardBackgrounds[exp.company]}
                            </div>
                        )}

                        {/* Date */}
                        <div className={`${jetbrainsMono.className} relative text-xs text-[#444] pt-0.5`}>
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
                /* ─── Server rack / data center (Quanta Manufacturing) ─── */
                .srv-container { position: absolute; inset: 0; }
                .srv-rack {
                    position: absolute;
                    top: 50%;
                    right: 12%;
                    transform: translateY(-50%);
                    width: 36px;
                    border: 1px solid rgba(99,102,241,0.12);
                    border-radius: 3px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding: 3px;
                }
                .srv-unit {
                    height: 7px;
                    border-radius: 1px;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.08);
                    position: relative;
                    overflow: hidden;
                }
                .srv-unit::after {
                    content: '';
                    position: absolute;
                    top: 1px; right: 3px;
                    width: 3px; height: 3px;
                    border-radius: 50%;
                    background: rgba(99,102,241,0.4);
                    animation: srvLed 2s ease-in-out infinite;
                }
                .srv-unit:nth-child(1)::after { animation-delay: 0s;   background: rgba(99,102,241,0.5); }
                .srv-unit:nth-child(2)::after { animation-delay: 0.3s; background: rgba(34,197,94,0.4); }
                .srv-unit:nth-child(3)::after { animation-delay: 0.6s; background: rgba(99,102,241,0.4); }
                .srv-unit:nth-child(4)::after { animation-delay: 0.9s; background: rgba(250,204,21,0.4); }
                .srv-unit:nth-child(5)::after { animation-delay: 1.2s; background: rgba(99,102,241,0.5); }
                @keyframes srvLed {
                    0%, 100% { opacity: 0.3; }
                    50%       { opacity: 1; }
                }
                /* Network packets flowing left → into rack */
                .srv-pkt {
                    position: absolute;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(99,102,241,0.3));
                    border-radius: 1px;
                    animation: srvPkt 2s ease-in infinite;
                }
                .srv-pkt-1 { width: 28px; top: 38%; right: 48%; animation-delay: 0s; }
                .srv-pkt-2 { width: 20px; top: 50%; right: 52%; animation-delay: 0.7s; }
                .srv-pkt-3 { width: 34px; top: 62%; right: 46%; animation-delay: 1.3s; }
                @keyframes srvPkt {
                    0%   { transform: translateX(0);   opacity: 0; }
                    20%  { opacity: 0.6; }
                    100% { transform: translateX(30px); opacity: 0; }
                }
                /* PXE boot label */
                .srv-label {
                    position: absolute;
                    top: 12px; right: 10px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 8px;
                    color: rgba(99,102,241,0.3);
                    letter-spacing: 1px;
                    animation: srvLed 4s ease-in-out infinite;
                }

                /* ─── Circuit board traces (ubreakifix) ─── */
                .circuit-container { position: absolute; inset: 0; }
                .circuit-trace {
                    position: absolute;
                    background: #22c55e;
                    border-radius: 1px;
                }
                .ct-h1 { height: 1px; width: 80px;  top: 20%; left: 60%; opacity: 0.08; animation: ctPulse 4s ease-in-out infinite; }
                .ct-h2 { height: 1px; width: 60px;  top: 45%; left: 70%; opacity: 0.06; animation: ctPulse 4s ease-in-out infinite 1s; }
                .ct-h3 { height: 1px; width: 100px; top: 70%; left: 55%; opacity: 0.07; animation: ctPulse 4s ease-in-out infinite 2s; }
                .ct-v1 { width: 1px; height: 50px;  top: 15%; left: 72%; opacity: 0.06; animation: ctPulse 4s ease-in-out infinite 0.5s; }
                .ct-v2 { width: 1px; height: 40px;  top: 40%; left: 85%; opacity: 0.08; animation: ctPulse 4s ease-in-out infinite 1.5s; }
                .ct-v3 { width: 1px; height: 60px;  top: 25%; left: 62%; opacity: 0.05; animation: ctPulse 4s ease-in-out infinite 2.5s; }
                .ct-pad {
                    position: absolute;
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: #22c55e;
                }
                .ct-p1 { top: 20%; left: 72%; opacity: 0.12; animation: ctGlow 3s ease-in-out infinite; }
                .ct-p2 { top: 45%; left: 85%; opacity: 0.10; animation: ctGlow 3s ease-in-out infinite 1s; }
                .ct-p3 { top: 70%; left: 62%; opacity: 0.10; animation: ctGlow 3s ease-in-out infinite 2s; }
                .ct-p4 { top: 45%; left: 70%; opacity: 0.08; animation: ctGlow 3s ease-in-out infinite 0.5s; }
                .ct-chip {
                    position: absolute;
                    width: 24px; height: 16px;
                    border: 1px solid rgba(34,197,94,0.1);
                    border-radius: 2px;
                    top: 30%; left: 78%;
                    animation: ctGlow 5s ease-in-out infinite 0.8s;
                }
                .ct-chip-pin {
                    position: absolute;
                    width: 4px; height: 1px;
                    background: rgba(34,197,94,0.12);
                }
                .ct-chip-pin-l { left: -5px; }
                .ct-chip-pin-r { right: -5px; }
                @keyframes ctPulse {
                    0%, 100% { opacity: 0.04; }
                    50%       { opacity: 0.15; }
                }
                @keyframes ctGlow {
                    0%, 100% { opacity: 0.06; box-shadow: 0 0 4px rgba(34,197,94,0); }
                    50%       { opacity: 0.20; box-shadow: 0 0 8px rgba(34,197,94,0.15); }
                }

                /* ─── Race car / F1Tenth (CORE Lab) ─── */
                .race-container { position: absolute; inset: 0; }
                .race-track {
                    position: absolute;
                    top: 15%; right: 6%;
                    width: 110px; height: 60px;
                    border: 1px solid rgba(250,204,21,0.08);
                    border-radius: 50%;
                }
                .race-track-inner {
                    position: absolute;
                    top: 22%; right: 10%;
                    width: 86px; height: 44px;
                    border: 1px solid rgba(250,204,21,0.05);
                    border-radius: 50%;
                }
                .race-car {
                    position: absolute;
                    width: 14px; height: 7px;
                    background: rgba(250,204,21,0.3);
                    border-radius: 3px 5px 2px 2px;
                    animation: raceOrbit 2.8s linear infinite;
                    transform-origin: 55px 30px;
                    top: 40%; right: 55%;
                    box-shadow: 0 0 6px rgba(250,204,21,0.2);
                }
                .race-car::before, .race-car::after {
                    content: '';
                    position: absolute;
                    width: 3px; height: 3px;
                    background: rgba(250,204,21,0.5);
                    border-radius: 50%;
                    bottom: -2px;
                }
                .race-car::before { left: 2px; }
                .race-car::after  { right: 2px; }
                @keyframes raceOrbit {
                    0%   { transform: rotate(0deg)   translateX(46px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(46px) rotate(-360deg); }
                }
                .race-lidar {
                    position: absolute;
                    top: 28%; right: 17%;
                    width: 1px; height: 28px;
                    background: rgba(250,204,21,0.08);
                    transform-origin: bottom center;
                    animation: lidarSweep 1.4s ease-in-out infinite;
                }
                .race-lidar-2 { animation-delay: 0.35s; }
                .race-lidar-3 { animation-delay: 0.70s; }
                .race-lidar-4 { animation-delay: 1.05s; }
                @keyframes lidarSweep {
                    0%, 100% { transform: rotate(-40deg); opacity: 0; }
                    50%       { transform: rotate( 40deg); opacity: 0.35; }
                }
                .race-speed {
                    position: absolute;
                    height: 1px;
                    background: rgba(250,204,21,0.1);
                    border-radius: 1px;
                    animation: raceSpeed 0.6s ease-out infinite;
                }
                .race-sp1 { width: 18px; top: 38%; right: 30%; animation-delay: 0.0s; }
                .race-sp2 { width: 12px; top: 44%; right: 32%; animation-delay: 0.2s; }
                .race-sp3 { width: 22px; top: 50%; right: 28%; animation-delay: 0.1s; }
                @keyframes raceSpeed {
                    0%   { transform: scaleX(1);   opacity: 0.15; }
                    100% { transform: scaleX(0.2); opacity: 0; }
                }

                /* ─── Satellite orbit (NASA) ─── */
                .sat-container { position: absolute; inset: 0; }
                /* Orbit ring */
                .sat-orbit {
                    position: absolute;
                    top: 10%; right: 4%;
                    width: 100px; height: 70px;
                    border: 1px solid rgba(96,165,250,0.07);
                    border-radius: 50%;
                    transform: rotateX(60deg);
                    animation: satOrbitPulse 6s ease-in-out infinite;
                }
                @keyframes satOrbitPulse {
                    0%, 100% { border-color: rgba(96,165,250,0.07); }
                    50%       { border-color: rgba(96,165,250,0.15); }
                }
                /* Satellite body travelling the orbit */
                .sat-body {
                    position: absolute;
                    width: 8px; height: 5px;
                    background: rgba(96,165,250,0.35);
                    border-radius: 1px;
                    top: 38%; right: 52%;
                    transform-origin: 50px 18px;
                    animation: satTravel 5s linear infinite;
                    box-shadow: 0 0 5px rgba(96,165,250,0.2);
                }
                /* Solar panels */
                .sat-body::before, .sat-body::after {
                    content: '';
                    position: absolute;
                    width: 10px; height: 3px;
                    background: rgba(96,165,250,0.25);
                    border-radius: 1px;
                    top: 1px;
                }
                .sat-body::before { left: -11px; }
                .sat-body::after  { right: -11px; }
                @keyframes satTravel {
                    0%   { transform: rotate(0deg)   translateX(50px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
                }
                /* Planet / Earth */
                .sat-planet {
                    position: absolute;
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 40% 35%, rgba(96,165,250,0.25), rgba(29,78,216,0.1));
                    border: 1px solid rgba(96,165,250,0.1);
                    top: calc(10% + 24px);
                    right: calc(4% + 39px);
                    animation: satOrbitPulse 6s ease-in-out infinite 1s;
                }
                /* Telemetry signal lines */
                .sat-signal {
                    position: absolute;
                    width: 1px;
                    background: rgba(96,165,250,0.08);
                    transform-origin: top center;
                    animation: satSignal 3s ease-in-out infinite;
                }
                .sat-sig-1 { height: 30px; top: 55%; right: 18%; animation-delay: 0s; }
                .sat-sig-2 { height: 20px; top: 55%; right: 22%; animation-delay: 0.8s; }
                .sat-sig-3 { height: 36px; top: 55%; right: 14%; animation-delay: 1.6s; }
                @keyframes satSignal {
                    0%, 100% { opacity: 0.05; transform: scaleY(0.6); }
                    50%       { opacity: 0.25; transform: scaleY(1); }
                }
                /* IMU label */
                .sat-label {
                    position: absolute;
                    bottom: 12px; right: 10px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 8px;
                    color: rgba(96,165,250,0.25);
                    letter-spacing: 1px;
                    animation: satOrbitPulse 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}

// ─── Card background animation components ────────────────────────────────────

function ServerRack() {
    return (
        <div className="srv-container">
            <div className="srv-label">PXE BOOT</div>
            <div className="srv-rack">
                <div className="srv-unit" />
                <div className="srv-unit" />
                <div className="srv-unit" />
                <div className="srv-unit" />
                <div className="srv-unit" />
            </div>
            <div className="srv-pkt srv-pkt-1" />
            <div className="srv-pkt srv-pkt-2" />
            <div className="srv-pkt srv-pkt-3" />
        </div>
    );
}

function CircuitBoard() {
    return (
        <div className="circuit-container">
            <div className="circuit-trace ct-h1" />
            <div className="circuit-trace ct-h2" />
            <div className="circuit-trace ct-h3" />
            <div className="circuit-trace ct-v1" />
            <div className="circuit-trace ct-v2" />
            <div className="circuit-trace ct-v3" />
            <div className="ct-pad ct-p1" />
            <div className="ct-pad ct-p2" />
            <div className="ct-pad ct-p3" />
            <div className="ct-pad ct-p4" />
            <div className="ct-chip">
                <div className="ct-chip-pin ct-chip-pin-l" style={{ top: 3 }} />
                <div className="ct-chip-pin ct-chip-pin-l" style={{ top: 8 }} />
                <div className="ct-chip-pin ct-chip-pin-r" style={{ top: 3 }} />
                <div className="ct-chip-pin ct-chip-pin-r" style={{ top: 8 }} />
            </div>
        </div>
    );
}

function RaceCar() {
    return (
        <div className="race-container">
            <div className="race-track" />
            <div className="race-track-inner" />
            <div className="race-lidar" />
            <div className="race-lidar race-lidar-2" />
            <div className="race-lidar race-lidar-3" />
            <div className="race-lidar race-lidar-4" />
            <div className="race-car" />
            <div className="race-speed race-sp1" />
            <div className="race-speed race-sp2" />
            <div className="race-speed race-sp3" />
        </div>
    );
}

function Satellite() {
    return (
        <div className="sat-container">
            <div className="sat-orbit" />
            <div className="sat-planet" />
            <div className="sat-body" />
            <div className="sat-signal sat-sig-1" />
            <div className="sat-signal sat-sig-2" />
            <div className="sat-signal sat-sig-3" />
            <div className="sat-label">IMU · 6.6 kHz</div>
        </div>
    );
}
