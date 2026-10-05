"use client";

import DualGame from "./visuals/DualGame";
import RoboticArm from "./visuals/RoboticArm";
import ParallelEdge from "./visuals/ParallelEdge";
import SalaryModel from "./visuals/SalaryModel";
import AggiePipeline from "./visuals/AggiePipeline";
import DnsResolver from "./visuals/DnsResolver";
import DraftMaster from "./visuals/DraftMaster";

type Visual = "dual" | "arm" | "edge" | "dns" | "ml" | "aggie" | "draft";

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
        desc: "A two-player game running on two bare-metal CC3200 boards with no shared game state: tilt steering from an accelerometer, an OLED driven over SPI, and projectiles handed board to board over UART so each screen mirrors the other's shot. Live scores go to AWS IoT and show up on a Flask scoreboard.",
        tech: "C · ARM Cortex-M4 · SPI · UART · I2C · AWS IoT · Flask",
        span: "pj-span-7",
        visual: "dual",
        href: "https://github.com/KuyaBasti/DUAL-Game",
    },
    {
        eyebrow: "Embedded",
        title: "Robotic Arm",
        desc: "A G-code interpreter that drives a 2-link planar arm over RS-232, solving the inverse kinematics in real time so the arm draws what the file describes.",
        tech: "C++ · IK · G-code · RS-232",
        span: "pj-span-5",
        visual: "arm",
        href: "https://github.com/KuyaBasti/RoboticArm",
    },
    {
        eyebrow: "Parallel · GPU",
        title: "Parallel Edge Detection",
        desc: "Edge detection (Gaussian blur, Sobel, hysteresis threshold) written three ways: a sequential reference, an OpenMP+AVX engine, and a CUDA engine. The CPU engine runs about 15x faster than the reference with byte-identical output.",
        tech: "C++20 · CUDA · OpenMP · AVX",
        span: "pj-span-6",
        visual: "edge",
        href: "https://github.com/KuyaBasti/ParallelEdgeDetection",
    },
    {
        eyebrow: "Systems · Go",
        title: "DNS Resolver",
        desc: "A recursive DNS resolver in Go that walks delegations from the root servers down and caches answers in a hash-partitioned, TTL-aware cache. Tested under 4,000+ concurrent goroutines.",
        tech: "Go · DNS · RWMutex · Caching",
        span: "pj-span-6",
        visual: "dns",
        href: "https://github.com/KuyaBasti/DNSResolver",
    },
    {
        eyebrow: "Machine Learning",
        title: "Salary Prediction Model",
        desc: "A salary prediction model trained on 6,684 records. The Random Forest came out on top at R² = 0.848, and a small Flask app serves the predictions.",
        tech: "Python · scikit-learn · Flask",
        span: "pj-span-5",
        visual: "ml",
        href: "https://github.com/KuyaBasti/SalaryPredictionModel",
    },
    {
        eyebrow: "Full-stack · HackDavis '24",
        title: "Aggie Reminder",
        desc: "A volunteer scheduling and reminder tool built at HackDavis 2024: Node and Postgres on the back end, with SendGrid sending the automated reminders.",
        tech: "Node · Express · Postgres · SendGrid",
        span: "pj-span-7",
        visual: "aggie",
        href: "https://github.com/KuyaBasti/Aggie-Reminder-",
    },
    {
        eyebrow: "Simulation · ML",
        title: "DraftMaster",
        desc: "Dota 2 draft simulator: pick two teams and a deterministic 30s-tick engine plays out a full, watchable match. Seeded Monte Carlo runs 200 sims in about a second, and the win model is trained on 59K+ ranked matches.",
        tech: "Python · scikit-learn · DuckDB · TypeScript · Fastify · React",
        span: "pj-span-12",
        visual: "draft",
        href: "https://github.com/KuyaBasti/DotaAnalysis",
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
                    <SalaryModel />
                </div>
            );
        case "aggie":
            return (
                <div className="pj-img pj-aggie">
                    <AggiePipeline />
                </div>
            );
        case "draft":
            return (
                <div className="pj-img pj-draft">
                    <DraftMaster />
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
                .pj-span-12 { grid-column: span 12; }
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
                .pj-ml { background: radial-gradient(ellipse at 55% 35%, #171009, #0e0a07); position: relative; }

                /* AGGIE */
                .pj-aggie { background: radial-gradient(ellipse at 45% 30%, #170d12, #0d080b); position: relative; }

                /* DRAFTMASTER */
                .pj-draft { background: radial-gradient(ellipse at 20% 50%, #0d1310, #07090b); position: relative; }
            `}</style>
        </section>
    );
}
