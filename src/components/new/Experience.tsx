"use client";

import QuantaRack from "@/components/new/visuals/QuantaRack";
import UbreakifixScreen from "@/components/new/visuals/UbreakifixScreen";
import F1Lidar from "@/components/new/visuals/F1Lidar";
import NasaSatellite from "@/components/new/visuals/NasaSatellite";

type Side = "left" | "right";

interface Scene {
    num: string;
    date: string;
    titleLead: string;
    titleIri: string;
    desc: string;
    meta: string[];
    tint: string;
    visual: "quanta" | "ubif" | "f1" | "nasa";
    side: Side; // which side the visual sits on (desktop)
}

const scenes: Scene[] = [
    {
        num: "01",
        date: "Apr 2026 → Present",
        titleLead: "Server qualification,",
        titleIri: "at high volume.",
        desc: "Night shift on the server floor, co-leading 30 technicians validating GB200/GB300 NVL72 racks for a hyperscaler customer, from 160 to 400+ racks a month. I own the diag and firmware rollout, and qualify new releases on the live line without contaminating it.",
        meta: ["160 → 400+ racks/mo", "NVL72 · L10/L11", "Bash · rsync", "PXE · iPXE"],
        tint: "tint-quanta",
        visual: "quanta",
        side: "right",
    },
    {
        num: "02",
        date: "Jul 2025 → Apr 2026",
        titleLead: "Repair,",
        titleIri: "good as new.",
        desc: "As a repair technician at uBreakiFix, I fixed phones, tablets, laptops, and game consoles: cracked screens, batteries, charge ports, and board-level faults.",
        meta: ["Screens", "Batteries", "Soldering", "Diagnostics"],
        tint: "tint-ubif",
        visual: "ubif",
        side: "left",
    },
    {
        num: "03",
        date: "Jan 2025 → Jul 2025",
        titleLead: "Full autonomy,",
        titleIri: "corner after corner.",
        desc: "From Bluetooth teleop to the car's first fully autonomous laps at ~3 m/s. Monte Carlo localization runs 4,000 particles and 240K CUDA ray casts per update on a Jetson Xavier NX, tracking a minimum-lap-time raceline.",
        meta: ["4,000 particles", "240K ray casts/update", "~3 m/s", "ROS2 · LiDAR"],
        tint: "tint-f1",
        visual: "f1",
        side: "right",
    },
    {
        num: "04",
        date: "Sep 2023 → Jan 2025",
        titleLead: "Bare metal,",
        titleIri: "bound for orbit.",
        desc: "Bare-metal IMU driver in C for a 3U CubeSat set to launch September 2026, with software-I2C and hardware-SPI register paths and runtime selection between two IMUs. The SPI path fed the only live sensor input to the attitude-control loops.",
        meta: ["launches Sept 2026", "10 Hz deterministic", "SPI mode 3 · 2.5 MHz", "Bare-metal C · FreeRTOS"],
        tint: "tint-nasa",
        visual: "nasa",
        side: "left",
    },
];

function Visual({ kind }: { kind: Scene["visual"] }) {
    switch (kind) {
        case "quanta":
            return <QuantaRack />;
        case "ubif":
            return <UbreakifixScreen />;
        case "f1":
            return <F1Lidar />;
        case "nasa":
            return <NasaSatellite />;
    }
}

export default function Experience() {
    return (
        <section id="experience">
            {scenes.map((s) => {
                const text = (
                    <div>
                        <div className="scene-eyebrow mono">
                            {s.num} · {s.date}
                        </div>
                        <h2 className="scene-title">
                            {s.titleLead} <span className="iri">{s.titleIri}</span>
                        </h2>
                        <p className="scene-desc">{s.desc}</p>
                        <div className="scene-meta">
                            {s.meta.map((m) => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                );
                const visual = (
                    <div className="scene-visual">
                        <div className={`card-frame ${s.tint}`}>
                            <Visual kind={s.visual} />
                        </div>
                    </div>
                );
                return (
                    <div className="scene" key={s.num}>
                        <div className="scene-inner">
                            {s.side === "left" ? (
                                <>
                                    {visual}
                                    {text}
                                </>
                            ) : (
                                <>
                                    {text}
                                    {visual}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}

            <style>{`
                .scene { position: relative; }
                .scene-inner {
                    min-height: 100vh;
                    display: grid; grid-template-columns: 1fr 1fr;
                    align-items: center; padding: 80px 5vw; gap: 60px; overflow: hidden;
                }
                .scene-eyebrow {
                    font-size: 13px; color: var(--accent);
                    letter-spacing: 0.08em; text-transform: uppercase;
                    margin-bottom: 16px; font-weight: 500;
                }
                .scene-title {
                    font-size: clamp(48px, 6vw, 88px); font-weight: 600;
                    line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 22px;
                }
                .scene-desc {
                    font-size: 20px; color: var(--ink-soft); line-height: 1.5;
                    max-width: 520px; margin-bottom: 24px;
                }
                .scene-meta { display: flex; gap: 24px; flex-wrap: wrap; font-size: 13px; color: var(--ink-soft); }
                .scene-meta span { display: flex; align-items: center; gap: 6px; }
                .scene-meta span::before {
                    content: ""; width: 6px; height: 6px; border-radius: 50%;
                    background: linear-gradient(120deg, #5e7dff, #bf5af2);
                }
                .scene-visual { height: 70vh; display: flex; align-items: center; justify-content: center; position: relative; }

                @media (max-width: 880px) {
                    .scene-inner { min-height: auto; grid-template-columns: 1fr; padding: 90px 24px; gap: 30px; }
                    .scene-visual { height: 50vh; }
                }

                .card-frame {
                    width: 100%; max-width: 540px; aspect-ratio: 4/3;
                    border-radius: 32px; overflow: hidden; position: relative;
                    background: rgba(10,14,20,0.55);
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(20px) saturate(160%);
                    -webkit-backdrop-filter: blur(20px) saturate(160%);
                    box-shadow: 0 0 0 1px rgba(40,200,90,0.10), 0 30px 80px -25px rgba(0,0,0,0.6), 0 0 70px -22px rgba(40,200,90,0.28);
                }
                .card-frame::before {
                    content: ""; position: absolute; inset: 0; padding: 1px; border-radius: 32px;
                    background: linear-gradient(120deg, rgba(94,235,212,0.4), rgba(94,125,255,0.4), rgba(191,90,242,0.35), rgba(40,200,90,0.45));
                    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    -webkit-mask-composite: xor; mask-composite: exclude;
                    opacity: 0.5; pointer-events: none; z-index: 2;
                }

                /* ── Scene 1 — Quanta visual lives in visuals/QuantaRack.tsx ── */

                /* ── Scene 2 — ubreakifix visual lives in visuals/UbreakifixScreen.tsx ── */

                /* ── Scene 3 — F1Tenth visual lives in visuals/F1Lidar.tsx ── */

                /* ── Scene 4 — NASA visual lives in visuals/NasaSatellite.tsx ── */
            `}</style>
        </section>
    );
}
