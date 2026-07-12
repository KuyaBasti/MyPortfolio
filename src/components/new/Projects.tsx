"use client";

import DualGame from "./visuals/DualGame";
import RoboticArm from "./visuals/RoboticArm";
import ParallelEdge from "./visuals/ParallelEdge";
import DnsResolver from "./visuals/DnsResolver";

type Visual = "dual" | "arm" | "edge" | "dns" | "ml" | "aggie";

interface Card {
    eyebrow: string;
    title: string;
    desc: string;
    tech: string;
    span: string; // grid column span class
    visual: Visual;
    href: string;
}

const cards: Card[] = [
    {
        eyebrow: "Featured · Embedded",
        title: "DUAL! Inspired Game",
        desc: "Two-player real-time embedded game on CC3200 MCUs with SPI OLED rendering, a custom UART protocol, tilt-based I2C controls, and AWS IoT score persistence through a Flask backend.",
        tech: "C · ARM Cortex-M4 · SPI · UART · I2C · AWS IoT · Lambda · Flask",
        span: "pj-span-7",
        visual: "dual",
        href: "https://github.com/KuyaBasti/DUAL-Game",
    },
    {
        eyebrow: "Embedded",
        title: "Robotic Arm",
        desc: "G-code interpreter with real-time inverse kinematics on a 2-link planar arm via RS-232 servo control.",
        tech: "C++ · IK · G-code · RS-232",
        span: "pj-span-5",
        visual: "arm",
        href: "https://github.com/KuyaBasti/RoboticArm",
    },
    {
        eyebrow: "Parallel · GPU",
        title: "Parallel Edge Detection",
        desc: "Sobel pipeline across OpenMP, Intel SIMD, and CUDA. Tile-based shared-memory convolution; 15× speedup over baseline.",
        tech: "C++20 · CUDA · OpenMP · AVX2",
        span: "pj-span-6",
        visual: "edge",
        href: "https://github.com/KuyaBasti/ParallelEdgeDetection",
    },
    {
        eyebrow: "Systems · Go",
        title: "High-Performance DNS Resolver",
        desc: "Thread-safe recursive resolver in Go with hash-partitioned cache, RWMutex isolation, and full A/AAAA/NS/CNAME/SOA/PTR support.",
        tech: "Go · DNS · RWMutex · Caching",
        span: "pj-span-6",
        visual: "dns",
        href: "https://github.com/KuyaBasti/DNSResolver",
    },
    {
        eyebrow: "Machine Learning",
        title: "Salary Prediction Model",
        desc: "Random Forest with R²=0.848 over 6,684 records, served through an interactive Flask UI.",
        tech: "Python · scikit-learn · Flask",
        span: "pj-span-5",
        visual: "ml",
        href: "https://github.com/KuyaBasti/SalaryPredictionModel",
    },
    {
        eyebrow: "Full-stack · HackDavis '24",
        title: "Aggie Reminder",
        desc: "Volunteer scheduling and reminder system built with Node, Postgres, and SendGrid-powered automated reminders.",
        tech: "Node · Express · Postgres · SendGrid",
        span: "pj-span-7",
        visual: "aggie",
        href: "https://github.com/KuyaBasti/Aggie-Reminder-",
    },
];

function VisualHeader({ kind }: { kind: Visual }) {
    switch (kind) {
        case "dual":
            return (
                <div className="pj-img pj-dual">
                    <DualGame />
                </div>
            );
        case "arm":
            return (
                <div className="pj-img pj-arm">
                    <RoboticArm />
                </div>
            );
        case "edge":
            return (
                <div className="pj-img pj-edge">
                    <ParallelEdge />
                </div>
            );
        case "dns":
            return (
                <div className="pj-img pj-dns">
                    <DnsResolver />
                </div>
            );
        case "ml":
            return (
                <div className="pj-img pj-ml">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div className="bar" key={i} />
                    ))}
                </div>
            );
        case "aggie":
            return (
                <div className="pj-img pj-aggie">
                    <div className="nt">
                        <div className="ic" />
                        <div>
                            <div className="t1">Shift reminder</div>
                            <div className="t2">Tomorrow at 9:00 AM</div>
                        </div>
                    </div>
                </div>
            );
    }
}

export default function Projects() {
    return (
        <section className="strip" id="projects">
            <div className="strip-head">
                <div className="eyebrow mono">02 · Projects</div>
                <h2>
                    Selected <span className="iri">work.</span>
                </h2>
                <p>A few things I shipped along the way.</p>
            </div>

            <div className="strip-grid">
                {cards.map((c) => (
                    <a
                        className={`pj ${c.span}`}
                        key={c.title}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <VisualHeader kind={c.visual} />
                        <div className="pj-body">
                            <div className="pj-eyebrow mono">{c.eyebrow}</div>
                            <div className="pj-title">{c.title}</div>
                            <div className="pj-desc">{c.desc}</div>
                            <div className="pj-tech mono">{c.tech}</div>
                        </div>
                    </a>
                ))}
            </div>

            <style>{`
                .strip {
                    background: rgba(8,11,16,0.4);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-top: 1px solid var(--hairline);
                    border-radius: 36px 36px 0 0;
                    margin-top: 80px; padding: 140px 0 100px; position: relative;
                }
                .strip-head { text-align: center; padding: 0 32px; margin-bottom: 60px; }
                .strip-head .eyebrow {
                    display: inline-block; font-size: 13px; color: var(--accent);
                    letter-spacing: 0.06em; text-transform: uppercase; font-weight: 500; margin-bottom: 14px;
                }
                .strip-head h2 { font-size: clamp(40px, 6vw, 80px); font-weight: 600; letter-spacing: -0.025em; line-height: 1.05; margin-bottom: 14px; }
                .strip-head p { font-size: 20px; color: var(--ink-soft); max-width: 600px; margin: 0 auto; }

                .strip-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; padding: 0 32px; max-width: 1280px; margin: 0 auto; }
                .pj {
                    display: block; color: inherit; text-decoration: none;
                    background: rgba(12,16,22,0.55); border: 1px solid var(--hairline);
                    border-radius: 28px; overflow: hidden; position: relative;
                    transition: transform .5s cubic-bezier(0.28,0.16,0.22,1), box-shadow .5s, border-color .3s;
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                }
                .pj::before {
                    content: ""; position: absolute; inset: 0; padding: 1px; border-radius: 28px;
                    background: linear-gradient(120deg, rgba(94,235,212,0.3), rgba(94,125,255,0.3), rgba(191,90,242,0.25), rgba(40,200,90,0.35));
                    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.45; pointer-events: none; z-index: 3;
                }
                .pj:hover { transform: translateY(-6px); border-color: var(--green-dim); box-shadow: 0 0 40px -16px rgba(40,200,90,0.4), 0 30px 60px -24px #000; }
                .pj-img { height: 240px; position: relative; overflow: hidden; border-radius: 28px 28px 0 0; }
                .pj-body { padding: 28px 30px 32px; }
                .pj-eyebrow { font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--accent); font-weight: 500; margin-bottom: 8px; }
                .pj-title { font-size: 24px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 8px; }
                .pj-desc { font-size: 15px; color: var(--ink-soft); line-height: 1.55; }
                .pj-tech { margin-top: 14px; font-size: 11px; color: var(--ink-faint); }

                .pj-span-7 { grid-column: span 7; }
                .pj-span-5 { grid-column: span 5; }
                .pj-span-6 { grid-column: span 6; }
                @media (max-width: 880px) {
                    .pj-span-7, .pj-span-5, .pj-span-6 { grid-column: span 12; }
                }

                /* DUAL */
                .pj-dual { background: radial-gradient(ellipse at 50% 50%, #0c1018, #080b12); position: relative; }

                /* ARM */
                .pj-arm { background: radial-gradient(ellipse at 65% 40%, #140e1c, #0b0710); position: relative; }

                /* EDGE */
                .pj-edge { background: #060a08; position: relative; }

                /* DNS */
                .pj-dns { background: radial-gradient(ellipse at 60% 30%, #0a1220, #070b12); position: relative; }

                /* ML */
                .pj-ml { background: linear-gradient(135deg, rgba(22,16,8,0.9), rgba(16,12,8,0.9)); display:flex; align-items:flex-end; justify-content:center; padding-bottom: 50px; gap: 6px; position: relative; }
                .pj-ml::after { content:""; position:absolute; inset:0; background: radial-gradient(circle at 40% 30%, rgba(255,159,10,0.22), transparent 55%), radial-gradient(circle at 70% 70%, rgba(255,102,128,0.18), transparent 55%); pointer-events:none; }
                .pj-ml > * { position: relative; z-index: 1; }
                .pj-ml .bar { width: 12px; border-radius: 6px; background: linear-gradient(180deg, #ff9f0a, #ff6680); animation: mlGrow 2s ease-in-out infinite; box-shadow: 0 4px 16px -2px rgba(255,159,10,0.3); }
                .pj-ml .bar:nth-child(1){ height: 40px; }
                .pj-ml .bar:nth-child(2){ height: 60px; animation-delay: 0.2s; }
                .pj-ml .bar:nth-child(3){ height: 50px; animation-delay: 0.4s; }
                .pj-ml .bar:nth-child(4){ height: 90px; animation-delay: 0.6s; }
                .pj-ml .bar:nth-child(5){ height: 70px; animation-delay: 0.8s; }
                .pj-ml .bar:nth-child(6){ height: 110px; animation-delay: 1.0s; }
                .pj-ml .bar:nth-child(7){ height: 95px; animation-delay: 1.2s; }
                @keyframes mlGrow { 0%,100% { transform: scaleY(.9); opacity:0.85; } 50% { transform: scaleY(1); opacity:1; } }

                /* AGGIE */
                .pj-aggie { background: linear-gradient(135deg, rgba(22,12,18,0.9), rgba(16,10,14,0.9)); display:flex; align-items:center; justify-content:center; position: relative; }
                .pj-aggie::after { content:""; position:absolute; inset:0; background: radial-gradient(circle at 30% 30%, rgba(255,102,128,0.22), transparent 55%), radial-gradient(circle at 70% 70%, rgba(94,125,255,0.18), transparent 55%); pointer-events:none; }
                .pj-aggie > * { position: relative; z-index: 1; }
                .pj-aggie .nt { background: rgba(24,28,34,0.95); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 14px; padding: 12px 16px; min-width: 220px; display:flex; gap:12px; align-items:center; box-shadow: 0 10px 30px -8px rgba(255,102,128,0.3); animation: notifIn 3s ease-in-out infinite; }
                .pj-aggie .ic { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #ff375f, #bf5af2); flex-shrink: 0; box-shadow: 0 4px 12px -2px rgba(255,55,95,0.5); }
                .pj-aggie .t1 { font-size: 13px; font-weight: 600; }
                .pj-aggie .t2 { font-size: 11px; color: var(--ink-muted); margin-top: 2px; }
                @keyframes notifIn { 0%,100% { transform: translateX(-10px); opacity:0; } 20%,80% { transform: translateX(0); opacity:1; } }

                @media (prefers-reduced-motion: reduce) {
                    .strip [class*="pj-"] :is(.bar, .nt) { animation: none !important; }
                }
            `}</style>
        </section>
    );
}
