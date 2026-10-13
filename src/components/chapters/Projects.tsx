"use client";

import DualGame from "@/components/new/visuals/DualGame";
import RoboticArm from "@/components/new/visuals/RoboticArm";
import ParallelEdge from "@/components/new/visuals/ParallelEdge";
import SalaryModel from "@/components/new/visuals/SalaryModel";
import AggiePipeline from "@/components/new/visuals/AggiePipeline";
import DnsResolver from "@/components/new/visuals/DnsResolver";
import DraftMaster from "@/components/new/visuals/DraftMaster";
import Centavo from "@/components/new/visuals/Centavo";

type Visual = "dual" | "arm" | "edge" | "dns" | "ml" | "aggie" | "draft" | "centavo";

interface Card {
    eyebrow: string;
    title: string;
    desc: string;
    tech: string;
    visual: Visual;
    href?: string; // omitted for private projects: the card is not a link
}

// Same cards and copy as the live site; the layout is a uniform three-up sheet.
const cards: Card[] = [
    {
        eyebrow: "Featured · Embedded",
        title: "DUAL! Inspired Game",
        desc: "A two-player game running on two bare-metal CC3200 boards with no shared game state: tilt steering from an accelerometer, an OLED driven over SPI, and projectiles handed board to board over UART so each screen mirrors the other's shot. Live scores go to AWS IoT and show up on a Flask scoreboard.",
        tech: "C · ARM Cortex-M4 · SPI · UART · I2C · AWS IoT · Flask",
        visual: "dual",
        href: "https://github.com/KuyaBasti/DUAL-Game",
    },
    {
        eyebrow: "Embedded",
        title: "Robotic Arm",
        desc: "A G-code interpreter that drives a 2-link planar arm over RS-232, solving the inverse kinematics in real time so the arm draws what the file describes.",
        tech: "C++ · IK · G-code · RS-232",
        visual: "arm",
        href: "https://github.com/KuyaBasti/RoboticArm",
    },
    {
        eyebrow: "Parallel · GPU",
        title: "Parallel Edge Detection",
        desc: "Edge detection (Gaussian blur, Sobel, hysteresis threshold) written three ways: a sequential reference, an OpenMP+AVX engine, and a CUDA engine. The CPU engine runs about 15x faster than the reference with byte-identical output.",
        tech: "C++20 · CUDA · OpenMP · AVX",
        visual: "edge",
        href: "https://github.com/KuyaBasti/ParallelEdgeDetection",
    },
    {
        eyebrow: "Systems · Go",
        title: "DNS Resolver",
        desc: "A recursive DNS resolver in Go that walks delegations from the root servers down and caches answers in a hash-partitioned, TTL-aware cache. Tested under 4,000+ concurrent goroutines.",
        tech: "Go · DNS · RWMutex · Caching",
        visual: "dns",
        href: "https://github.com/KuyaBasti/DNSResolver",
    },
    {
        eyebrow: "Machine Learning",
        title: "Salary Prediction Model",
        desc: "A salary prediction model trained on 6,684 records. The Random Forest came out on top at R² = 0.848, and a small Flask app serves the predictions.",
        tech: "Python · scikit-learn · Flask",
        visual: "ml",
        href: "https://github.com/KuyaBasti/SalaryPredictionModel",
    },
    {
        eyebrow: "Full-stack · HackDavis '24",
        title: "Aggie Reminder",
        desc: "A volunteer scheduling and reminder tool built at HackDavis 2024: Node and Postgres on the back end, with SendGrid sending the automated reminders.",
        tech: "Node · Express · Postgres · SendGrid",
        visual: "aggie",
        href: "https://github.com/KuyaBasti/Aggie-Reminder-",
    },
    {
        eyebrow: "Simulation · ML",
        title: "DraftMaster",
        desc: "Dota 2 draft simulator: pick two teams and a deterministic 30s-tick engine plays out a full, watchable match. Seeded Monte Carlo runs 200 sims in about a second, and the win model is trained on 59K+ ranked matches.",
        tech: "Python · scikit-learn · DuckDB · TypeScript · Fastify · React",
        visual: "draft",
        href: "https://github.com/KuyaBasti/DotaAnalysis",
    },
    {
        eyebrow: "Local-first · Finance",
        title: "Centavo",
        desc: "A local-first finance tracker that parses statements and paystubs into a SQLite ledger kept in integer cents. Every document has to reconcile to its own printed totals to the cent, or it is rejected and nothing is written. Private by design, so no repo link.",
        tech: "Python · pdfplumber · SQLite · scikit-learn · FastAPI · React",
        visual: "centavo",
    },
];

function VisualHeader({ kind }: { kind: Visual }) {
    switch (kind) {
        case "dual":
            return <div className="pj-img pj-dual"><DualGame /></div>;
        case "arm":
            return <div className="pj-img pj-arm"><RoboticArm /></div>;
        case "edge":
            return <div className="pj-img pj-edge"><ParallelEdge /></div>;
        case "dns":
            return <div className="pj-img pj-dns"><DnsResolver /></div>;
        case "ml":
            return <div className="pj-img pj-ml"><SalaryModel /></div>;
        case "aggie":
            return <div className="pj-img pj-aggie"><AggiePipeline /></div>;
        case "draft":
            return <div className="pj-img pj-draft"><DraftMaster /></div>;
        case "centavo":
            return <div className="pj-img pj-centavo"><Centavo /></div>;
    }
}

export default function Projects() {
    return (
        <section className="sheet" id="projects">
            <div className="sheet-head">
                <span className="num mono">02</span>
                <h2>Projects</h2>
            </div>

            <div className="sheet-grid">
                {cards.map((c, i) => {
                    const body = (
                        <>
                            <div className="pj-stage">
                                <VisualHeader kind={c.visual} />
                                <span className="fnum mono">F{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <div className="pj-body">
                                <div className="pj-eyebrow mono">{c.eyebrow}</div>
                                <div className="pj-title">{c.title}</div>
                                <div className="pj-desc">{c.desc}</div>
                                <div className="pj-tech mono">{c.tech}</div>
                                {c.href ? <span className="pj-open mono">Open ↗</span> : <span className="pj-priv mono">Private</span>}
                            </div>
                        </>
                    );
                    return c.href ? (
                        <a className="pj" key={c.title} href={c.href} target="_blank" rel="noopener noreferrer">
                            {body}
                        </a>
                    ) : (
                        <div className="pj pj-static" key={c.title}>
                            {body}
                        </div>
                    );
                })}
            </div>

            <style>{`
                .sheet { position: relative; max-width: var(--maxw); margin: 0 auto; padding: calc(var(--lb) + 28px) var(--pad) 96px; }
                .sheet-head {
                    display: grid; grid-template-columns: 56px 1fr; align-items: end; gap: 24px;
                    padding-bottom: 28px; margin-bottom: 36px; border-bottom: 1px solid var(--hairline);
                }
                .sheet-head .num { font-size: 11px; color: var(--green); letter-spacing: .12em; padding-bottom: 10px; }
                .sheet-head h2 { font-size: clamp(36px, 4.2vw, 58px); font-weight: 500; letter-spacing: -.026em; line-height: 1.02; }

                .sheet-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(14px, 2vw, 28px); }
                .pj {
                    display: flex; flex-direction: column; color: inherit; text-decoration: none;
                    background: rgba(12,16,22,0.55); border: 1px solid var(--hairline);
                    border-radius: 28px; overflow: hidden; position: relative;
                    transition: transform .5s cubic-bezier(0.28,0.16,0.22,1), box-shadow .5s, border-color .3s;
                }
                .pj::before {
                    content: ""; position: absolute; inset: 0; padding: 1px; border-radius: 28px;
                    background: linear-gradient(120deg, rgba(94,235,212,0.3), rgba(94,125,255,0.3), rgba(191,90,242,0.25), rgba(40,200,90,0.35));
                    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.45; pointer-events: none; z-index: 3;
                }
                .pj:hover { transform: translateY(-6px); border-color: var(--green-dim); box-shadow: 0 0 40px -16px rgba(40,200,90,0.4), 0 30px 60px -24px #000; }
                .pj-static { cursor: default; }
                .pj-stage { position: relative; height: 240px; border-bottom: 1px solid var(--hairline); }
                .pj-img { position: absolute; inset: 0; overflow: hidden; }
                .fnum {
                    position: absolute; top: 10px; left: 12px; z-index: 2; font-size: 10px; letter-spacing: .2em; color: var(--green);
                    background: rgba(0,0,0,.5); padding: 2px 6px; border-radius: 2px;
                }
                .pj-body { padding: 20px 22px 24px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
                .pj-eyebrow { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); font-weight: 500; }
                .pj-title { font-size: 19px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.25; }
                .pj-desc { font-size: 14.5px; color: var(--ink-soft); line-height: 1.62; flex: 1; }
                .pj-tech { margin-top: 6px; font-size: 11px; color: var(--ink-faint); line-height: 1.6; }
                .pj-open { margin-top: 10px; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--green-bright); width: max-content; }
                .pj-priv {
                    margin-top: 10px; font-size: 10.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-faint);
                    border: 1px dashed var(--hairline); padding: 4px 8px; width: max-content; border-radius: 3px;
                }
                @media (max-width: 1000px) { .sheet-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
                @media (max-width: 640px) { .sheet-grid { grid-template-columns: minmax(0, 1fr); } .pj-stage { height: 220px; } }

                .pj-dual { background: radial-gradient(ellipse at 50% 50%, #0c1018, #080b12); }
                .pj-arm { background: radial-gradient(ellipse at 65% 40%, #140e1c, #0b0710); }
                .pj-edge { background: #060a08; }
                .pj-dns { background: radial-gradient(ellipse at 60% 30%, #0a1220, #070b12); }
                .pj-ml { background: radial-gradient(ellipse at 55% 35%, #171009, #0e0a07); }
                .pj-aggie { background: radial-gradient(ellipse at 45% 30%, #170d12, #0d080b); }
                .pj-draft { background: radial-gradient(ellipse at 20% 50%, #0d1310, #07090b); }
                .pj-centavo { background: #131311; }
            `}</style>
        </section>
    );
}
