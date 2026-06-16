"use client";

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
        desc: "At Quanta Manufacturing, I deploy test infrastructure for large-scale server qualification — PXE, networking, and Python-driven diagnostics — to chase down defects and lift yield.",
        meta: ["Linux", "Python", "PXE", "R&D collaboration"],
        tint: "tint-quanta",
        visual: "quanta",
        side: "right",
    },
    {
        num: "02",
        date: "Jul 2025 → Apr 2026",
        titleLead: "Repair,",
        titleIri: "down to the trace.",
        desc: "As an electronics technician, I performed board-level repairs across phones, tablets, laptops, and consoles — schematic-driven, fine-pitch soldering, and I/O troubleshooting.",
        meta: ["Soldering", "Schematics", "Rework", "I/O Diagnostics"],
        tint: "tint-ubif",
        visual: "ubif",
        side: "left",
    },
    {
        num: "03",
        date: "Jan 2025 → Jul 2025",
        titleLead: "20 mph autonomy,",
        titleIri: "corner after corner.",
        desc: "At UCD CORE Lab, I built a ROS2 autonomous racing platform using Monte Carlo localization (1000+ particles at 40Hz), LiDAR–camera fusion, and CNN segmentation — improving lap consistency by 30%.",
        meta: ["ROS2", "LiDAR", "SLAM", "Perception"],
        tint: "tint-f1",
        visual: "f1",
        side: "right",
    },
    {
        num: "04",
        date: "Sep 2023 → Jan 2025",
        titleLead: "Bare metal,",
        titleIri: "10,000 km up.",
        desc: "For NASA's Space & Satellite Systems, I authored ASM330LHH IMU drivers in C, built dual-IMU redundancy with health checks, and ran FreeRTOS sensor acquisition at 6.6 kHz with 99.9% timing accuracy.",
        meta: ["Bare-metal C", "FreeRTOS", "I2C / SPI", "6.6 kHz"],
        tint: "tint-nasa",
        visual: "nasa",
        side: "left",
    },
];

function Visual({ kind }: { kind: Scene["visual"] }) {
    switch (kind) {
        case "quanta":
            return (
                <>
                    <div className="server-rack">
                        {[0, 1, 2].map((c) => (
                            <div className="rack-col" key={c}>
                                {[0, 1, 2, 3, 4].map((r) => (
                                    <div className="rack-row" key={r} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="pkt" />
                    <div className="pkt pkt-2" />
                    <div className="pkt pkt-3" />
                </>
            );
        case "ubif":
            return (
                <div className="pcb-wrap">
                    <div className="pcb">
                        <div className="pcb-trace" />
                        <div className="pcb-trace" />
                        <div className="pcb-trace" />
                        <div className="pcb-comp" />
                        <div className="pcb-comp" />
                        <div className="pcb-comp" />
                        <div className="solder-spark" />
                        <div className="iron" />
                    </div>
                </div>
            );
        case "f1":
            return (
                <>
                    <div className="track" />
                    <div className="lidar-sweep" />
                    <div className="car">
                        <div className="car-body">
                            <div className="car-windshield" />
                            <div className="car-wheel left" />
                            <div className="car-wheel right" />
                        </div>
                    </div>
                    <div className="speed-line" />
                    <div className="speed-line" />
                    <div className="speed-line" />
                </>
            );
        case "nasa":
            return (
                <>
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                    <div className="orbit-ring" />
                    <div className="orbit-ring orbit-ring-2" />
                    <div className="signal-pulse" />
                    <div className="signal-pulse signal-pulse-2" />
                    <div className="signal-pulse signal-pulse-3" />
                    <div className="satellite-body" />
                </>
            );
    }
}

export default function Experience() {
    return (
        <section id="experience">
            {scenes.map((s) => {
                const text = (
                    <div>
                        <div className="scene-eyebrow mono">
                            {s.num} — {s.date}
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
                        <div className="scene-sticky">
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
                .scene { min-height: 200vh; position: relative; }
                .scene-sticky {
                    position: sticky; top: 0; height: 100vh;
                    display: grid; grid-template-columns: 1fr 1fr;
                    align-items: center; padding: 0 5vw; gap: 60px; overflow: hidden;
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
                    .scene { min-height: auto; }
                    .scene-sticky { position: relative; height: auto; grid-template-columns: 1fr; padding: 90px 24px; gap: 30px; }
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

                /* ── Scene 1 — Quanta (server racks) ── */
                .tint-quanta {
                    background:
                        radial-gradient(circle at 25% 30%, rgba(94,125,255,0.22), transparent 60%),
                        radial-gradient(circle at 75% 70%, rgba(40,200,90,0.16), transparent 60%),
                        linear-gradient(160deg, rgba(10,16,26,0.7) 0%, rgba(8,12,20,0.7) 100%);
                }
                .server-rack { position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; }
                .rack-col { width: 50px; height: 180px; background: rgba(18,24,32,0.92); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px 6px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 8px 24px -8px rgba(40,200,90,0.25); }
                .rack-row { flex: 1; background: rgba(255,255,255,0.05); border-radius: 2px; position: relative; }
                .rack-row::after { content: ""; position: absolute; right: 3px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; border-radius: 50%; background: #34c759; animation: led 2s ease-in-out infinite; }
                .rack-col:nth-child(1) .rack-row:nth-child(1)::after { animation-delay: 0.1s; }
                .rack-col:nth-child(1) .rack-row:nth-child(2)::after { animation-delay: 0.4s; background: #5e7dff; }
                .rack-col:nth-child(1) .rack-row:nth-child(3)::after { animation-delay: 0.7s; }
                .rack-col:nth-child(1) .rack-row:nth-child(4)::after { animation-delay: 1.0s; background: #ff9f0a; }
                .rack-col:nth-child(1) .rack-row:nth-child(5)::after { animation-delay: 1.3s; }
                .rack-col:nth-child(2) .rack-row:nth-child(1)::after { animation-delay: 0.3s; background: #bf5af2; }
                .rack-col:nth-child(2) .rack-row:nth-child(2)::after { animation-delay: 0.6s; }
                .rack-col:nth-child(2) .rack-row:nth-child(3)::after { animation-delay: 0.9s; background: #5e7dff; }
                .rack-col:nth-child(2) .rack-row:nth-child(4)::after { animation-delay: 1.2s; }
                .rack-col:nth-child(2) .rack-row:nth-child(5)::after { animation-delay: 1.5s; background: #34c759; }
                .rack-col:nth-child(3) .rack-row:nth-child(1)::after { animation-delay: 0.2s; background: #ff9f0a; }
                .rack-col:nth-child(3) .rack-row:nth-child(2)::after { animation-delay: 0.5s; }
                .rack-col:nth-child(3) .rack-row:nth-child(3)::after { animation-delay: 0.8s; background: #5e7dff; }
                .rack-col:nth-child(3) .rack-row:nth-child(4)::after { animation-delay: 1.1s; }
                .rack-col:nth-child(3) .rack-row:nth-child(5)::after { animation-delay: 1.4s; }
                @keyframes led { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; box-shadow: 0 0 8px currentColor; } }
                .pkt { position: absolute; top: 25%; left: -20%; width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #5e7dff, transparent); animation: pktFly 3s ease-out infinite; }
                .pkt-2 { top: 35%; animation-delay: 1s; }
                .pkt-3 { top: 18%; animation-delay: 2s; }
                @keyframes pktFly { from { transform: translateX(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateX(800px); opacity: 0; } }

                /* ── Scene 2 — ubreakifix (PCB + soldering iron) ── */
                .tint-ubif {
                    background:
                        radial-gradient(circle at 30% 30%, rgba(255,179,64,0.22), transparent 60%),
                        radial-gradient(circle at 70% 60%, rgba(255,102,128,0.16), transparent 60%),
                        linear-gradient(160deg, rgba(20,14,8,0.7) 0%, rgba(14,10,8,0.7) 100%);
                }
                .pcb-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
                .pcb { width: 60%; aspect-ratio: 16/10; background: linear-gradient(135deg, #1d4936, #2d6b51); border-radius: 12px; position: relative; box-shadow: 0 20px 60px -15px rgba(45,107,81,0.4); }
                .pcb-trace { position: absolute; height: 1.5px; background: rgba(255,200,80,0.6); border-radius: 1px; }
                .pcb-trace:nth-child(1) { top: 30%; left: 10%; right: 50%; }
                .pcb-trace:nth-child(2) { top: 50%; left: 30%; right: 20%; }
                .pcb-trace:nth-child(3) { top: 70%; left: 15%; right: 35%; }
                .pcb-comp { position: absolute; background: #111; border: 1px solid rgba(255,200,80,0.45); border-radius: 2px; }
                .pcb-comp:nth-child(4) { top: 20%; left: 15%; width: 10%; height: 8%; }
                .pcb-comp:nth-child(5) { top: 55%; right: 20%; width: 12%; height: 10%; }
                .pcb-comp:nth-child(6) { bottom: 15%; left: 40%; width: 8%; height: 6%; }
                .solder-spark { position: absolute; top: 40%; right: 30%; width: 6px; height: 6px; border-radius: 50%; background: #ffb340; box-shadow: 0 0 18px 4px rgba(255,179,64,0.9); animation: spark 0.9s ease-in-out infinite; }
                @keyframes spark { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.4); } }
                .iron { position: absolute; top: -8%; right: 24%; width: 4px; height: 100px; background: linear-gradient(to bottom, #999, #ccc); border-radius: 2px; transform-origin: top center; transform: rotate(20deg); animation: ironHover 2.4s ease-in-out infinite; }
                @keyframes ironHover { 0%, 100% { transform: rotate(20deg) translateY(0); } 50% { transform: rotate(20deg) translateY(-6px); } }

                /* ── Scene 3 — F1Tenth ── */
                .tint-f1 {
                    background:
                        radial-gradient(circle at 30% 30%, rgba(255,159,10,0.22), transparent 60%),
                        radial-gradient(circle at 70% 70%, rgba(255,102,128,0.15), transparent 60%),
                        linear-gradient(160deg, rgba(20,16,8,0.7) 0%, rgba(14,10,6,0.7) 100%);
                }
                .track { position: absolute; bottom: 25%; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.12); }
                .car { position: absolute; bottom: 25%; left: 50%; transform: translateX(-50%); animation: carBob 1.2s ease-in-out infinite; }
                @keyframes carBob { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -4px); } }
                .car-body { width: 120px; height: 36px; border-radius: 10px 24px 8px 8px; background: linear-gradient(135deg, #ff9f0a 0%, #ff6d00 100%); box-shadow: 0 20px 40px -10px rgba(255,109,0,0.45); position: relative; }
                .car-wheel { position: absolute; bottom: -10px; width: 22px; height: 22px; border-radius: 50%; background: #1d1d1f; border: 4px solid #515154; animation: spin 0.5s linear infinite; }
                .car-wheel.left { left: 8px; }
                .car-wheel.right { right: 14px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .car-windshield { position: absolute; top: 4px; left: 30%; right: 14%; height: 18px; background: rgba(0,0,0,0.4); border-radius: 5px 14px 4px 4px; }
                .lidar-sweep { position: absolute; bottom: 18%; left: 50%; width: 200px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,159,10,0.7), transparent); transform-origin: left center; animation: lidar 3s linear infinite; }
                @keyframes lidar { from { transform: rotate(-15deg); opacity: 0; } 50% { opacity: 1; } to { transform: rotate(15deg); opacity: 0; } }
                .speed-line { position: absolute; height: 1px; background: rgba(255,255,255,0.2); border-radius: 1px; animation: speed 0.7s linear infinite; }
                .speed-line:nth-child(7) { top: 35%; right: 100%; width: 40px; animation-delay: 0s; }
                .speed-line:nth-child(8) { top: 45%; right: 100%; width: 60px; animation-delay: 0.2s; }
                .speed-line:nth-child(9) { top: 55%; right: 100%; width: 30px; animation-delay: 0.4s; }
                @keyframes speed { from { transform: translateX(0); opacity: 0.6; } to { transform: translateX(600px); opacity: 0; } }

                /* ── Scene 4 — NASA ── */
                .tint-nasa {
                    background:
                        radial-gradient(circle at 30% 30%, rgba(94,125,255,0.24), transparent 60%),
                        radial-gradient(circle at 70% 70%, rgba(191,90,242,0.18), transparent 60%),
                        linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(8,10,20,0.7) 100%);
                }
                .satellite-body { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: linear-gradient(135deg, #fff 0%, #d2d2d7 100%); border-radius: 12px; box-shadow: 0 20px 50px -10px rgba(94,125,255,0.4); animation: satFloat 4s ease-in-out infinite; }
                @keyframes satFloat { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, calc(-50% - 10px)); } }
                .satellite-body::before, .satellite-body::after { content: ""; position: absolute; top: 10%; height: 80%; width: 60px; background: linear-gradient(180deg, #5e7dff, #335bff); border-radius: 4px; }
                .satellite-body::before { left: -70px; }
                .satellite-body::after { right: -70px; }
                .orbit-ring { position: absolute; top: 50%; left: 50%; width: 360px; height: 360px; border: 1px dashed rgba(94,125,255,0.3); border-radius: 50%; transform: translate(-50%, -50%); animation: rotate 30s linear infinite; }
                .orbit-ring-2 { width: 460px; height: 460px; border-color: rgba(94,125,255,0.18); animation-duration: 50s; animation-direction: reverse; }
                @keyframes rotate { to { transform: translate(-50%, -50%) rotate(360deg); } }
                .signal-pulse { position: absolute; top: 50%; left: 50%; width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(94,125,255,0.4); transform: translate(-50%, -50%); animation: signal 2.4s ease-out infinite; }
                .signal-pulse-2 { animation-delay: 0.8s; }
                .signal-pulse-3 { animation-delay: 1.6s; }
                @keyframes signal { 0% { width: 80px; height: 80px; opacity: 1; } 100% { width: 360px; height: 360px; opacity: 0; } }
                .star { position: absolute; border-radius: 50%; background: #5e7dff; box-shadow: 0 0 6px rgba(94,125,255,0.6); animation: twinkle 2s ease-in-out infinite; }
                .star:nth-child(1) { top: 10%; left: 20%; width: 3px; height: 3px; animation-delay: 0s; }
                .star:nth-child(2) { top: 15%; right: 25%; width: 2px; height: 2px; animation-delay: 0.4s; }
                .star:nth-child(3) { top: 35%; left: 10%; width: 2px; height: 2px; animation-delay: 0.8s; }
                .star:nth-child(4) { bottom: 20%; right: 15%; width: 3px; height: 3px; animation-delay: 1.2s; }
                .star:nth-child(5) { bottom: 30%; left: 25%; width: 2px; height: 2px; animation-delay: 1.6s; }
                @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

                @media (prefers-reduced-motion: reduce) {
                    .scene-sticky .rack-row::after,
                    .scene-sticky .pkt,
                    .scene-sticky .solder-spark,
                    .scene-sticky .iron,
                    .scene-sticky .car,
                    .scene-sticky .car-wheel,
                    .scene-sticky .lidar-sweep,
                    .scene-sticky .speed-line,
                    .scene-sticky .satellite-body,
                    .scene-sticky .orbit-ring,
                    .scene-sticky .signal-pulse,
                    .scene-sticky .star { animation: none !important; }
                }
            `}</style>
        </section>
    );
}
