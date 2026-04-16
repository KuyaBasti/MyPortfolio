"use client";

import { motion } from "motion/react";
import { projects } from "@/data/portfolio";
import { sora, jetbrainsMono } from "@/app/layout";
import type { ReactNode } from "react";

// ─── Category tag styles ──────────────────────────────────────────────────────

function categoryToTag(category: string): { label: string; cls: string } {
    switch (category) {
        case "Embedded Systems":  return { label: "embedded",        cls: "tag-emb" };
        case "Full-Stack Development": return { label: "full-stack", cls: "tag-fs"  };
        case "Machine Learning":  return { label: "machine learning", cls: "tag-ml" };
        case "Systems Programming": return { label: "systems",       cls: "tag-sys" };
        case "Parallel Programming": return { label: "parallel",     cls: "tag-par" };
        default:                   return { label: category.toLowerCase(), cls: "tag-fs" };
    }
}

// ─── Per-project visual area map ─────────────────────────────────────────────

const visualMap: Record<string, ReactNode> = {
    "DUAL! Inspired Game":                     <DualGame />,
    "Robotic Arm Drawing System":              <RoboticArm />,
    "Parallel Edge Detection":                 <EdgeDetection />,
    "High-Performance DNS Resolver":           <DnsResolver />,
    "Salary Prediction Machine Learning Model": <SalaryML />,
    "Aggie Reminder":                          <AggieReminder />,
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function Projects() {
    return (
        <section
            id="projects"
            className={`${sora.className} max-w-[1100px] mx-auto px-6 sm:px-10 py-24`}
        >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-12">
                <span className={`${jetbrainsMono.className} text-[13px] text-[#818cf8]`}>
                    02
                </span>
                <span className="text-[28px] font-semibold tracking-[-1px] text-white">
                    Projects
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-[#1a1a1a] to-transparent" />
            </div>

            {/* Bento grid */}
            <div className="bento-grid">
                {projects.map((project, i) => {
                    const isFeatured = project.title === "DUAL! Inspired Game";
                    const visual = visualMap[project.title];
                    const tag = categoryToTag(project.category);

                    return (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
                            className={`bento-card${isFeatured ? " bento-feat" : ""}`}
                            style={{ borderRadius: 18 }}
                        >
                            {/* Visual area */}
                            <div className={`bento-visual${isFeatured ? " bento-visual-feat" : ""}`}>
                                {visual ?? <DefaultVisual />}
                            </div>

                            {/* Content area */}
                            <div className="bento-content">
                                <div className="bento-tags">
                                    <span className={`bento-tag ${tag.cls}`}>{tag.label}</span>
                                    {isFeatured && (
                                        <span className="bento-tag tag-iot">IoT</span>
                                    )}
                                </div>
                                <h3 className="bento-title">{project.title}</h3>
                                <p className="bento-desc">{project.description}</p>
                                <div className="bento-tech">
                                    <span className={jetbrainsMono.className}>
                                        {project.technologies.slice(0, 6).join(" · ")}
                                        {project.technologies.length > 6 ? ` · +${project.technologies.length - 6}` : ""}
                                    </span>
                                </div>
                                {(project.github || project.link) && (
                                    <div className="bento-links">
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="bento-link">
                                                GitHub ↗
                                            </a>
                                        )}
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="bento-link">
                                                Live ↗
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <style>{`
                /* ─── Grid ─── */
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }
                @media (max-width: 768px) {
                    .bento-grid { grid-template-columns: 1fr; }
                    .bento-feat { grid-column: span 1 !important; }
                }
                .bento-card {
                    background: #0a0a0a;
                    border: 1px solid #151515;
                    overflow: hidden;
                    transition: border-color 0.4s cubic-bezier(.4,0,.2,1);
                    position: relative;
                }
                .bento-card:hover { border-color: #2a2a2a; }
                .bento-feat { grid-column: span 2; }

                /* ─── Visual area ─── */
                .bento-visual {
                    height: 220px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bento-visual-feat { height: 260px; }

                /* ─── Content ─── */
                .bento-content { padding: 22px 24px 24px; }
                .bento-tags { display: flex; gap: 6px; margin-bottom: 10px; }
                .bento-tag {
                    font-size: 10px;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-weight: 500;
                    letter-spacing: .3px;
                }
                .tag-emb { background: rgba(244,114,182,.1); color: #f472b6; border: 1px solid rgba(244,114,182,.15); }
                .tag-fs  { background: rgba(129,140,248,.1); color: #818cf8; border: 1px solid rgba(129,140,248,.15); }
                .tag-sys { background: rgba(34,197,94,.1);   color: #4ade80; border: 1px solid rgba(34,197,94,.15); }
                .tag-ml  { background: rgba(251,191,36,.1);  color: #fbbf24; border: 1px solid rgba(251,191,36,.15); }
                .tag-par { background: rgba(6,182,212,.1);   color: #22d3ee; border: 1px solid rgba(6,182,212,.15); }
                .tag-iot { background: rgba(251,146,60,.1);  color: #fb923c; border: 1px solid rgba(251,146,60,.15); }

                .bento-title { font-size: 18px; font-weight: 600; letter-spacing: -.3px; margin-bottom: 6px; color: #f0f0f0; }
                .bento-desc  { color: #666; font-size: 13px; line-height: 1.55; }
                .bento-tech  { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; font-size: 10px; color: #444; }
                .bento-links { display: flex; gap: 12px; margin-top: 12px; }
                .bento-link  { font-size: 12px; color: #555; text-decoration: none; transition: color .2s; }
                .bento-link:hover { color: #818cf8; }

                /* ─── Default visual (no animation) ─── */
                .default-visual {
                    width: 100%; height: 100%;
                    background: linear-gradient(135deg, #0c0c0c 0%, #111118 50%, #0a0a0a 100%);
                }

                /* ═══════════════════════════════════════════════════════
                   DUAL! GAME
                ═══════════════════════════════════════════════════════ */
                .dual-scene {
                    background: linear-gradient(135deg, #0a0a18 0%, #10102a 50%, #080818 100%);
                    width: 100%; height: 100%;
                    position: relative; overflow: hidden;
                }
                .dual-label {
                    position: absolute; top: 14px; left: 18px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px; color: rgba(129,140,248,.35); letter-spacing: 2px;
                }
                .score-display {
                    position: absolute; bottom: 14px; right: 18px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 8px; color: rgba(129,140,248,.3);
                    text-align: right; line-height: 1.5;
                }
                .dual-screen {
                    position: absolute;
                    width: 90px; height: 120px;
                    border: 2px solid #333; border-radius: 6px;
                    background: #080810; overflow: hidden;
                }
                .dual-screen-l { left: calc(50% - 110px); top: 50%; transform: translateY(-50%); }
                .dual-screen-r { right: calc(50% - 110px); top: 50%; transform: translateY(-50%); }
                .screen-header {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 6px; color: #444;
                    text-align: center; padding: 3px;
                    border-bottom: 1px solid #1a1a1a;
                }
                .ship { position: absolute; width: 0; height: 0; }
                .ship-l {
                    bottom: 15px; left: 50%; transform: translateX(-50%);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-bottom: 12px solid #60a5fa;
                    animation: shipBob 2s ease-in-out infinite;
                }
                .ship-r {
                    top: 15px; left: 50%; transform: translateX(-50%);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 12px solid #f87171;
                    animation: shipBob 2s ease-in-out infinite .5s;
                }
                @keyframes shipBob {
                    0%,100% { transform: translateX(-50%) translateX(0); }
                    50%     { transform: translateX(-50%) translateX(4px); }
                }
                .projectile {
                    position: absolute;
                    width: 3px; height: 3px;
                    border-radius: 50%;
                }
                .proj-1 { background: #60a5fa; left: 50%;  bottom: 30px; animation: shootUp   1.2s linear infinite; }
                .proj-2 { background: #f87171; left: 45%;  top: 30px;    animation: shootDown 1.2s linear infinite .4s; }
                .proj-3 { background: #60a5fa; left: 55%;  bottom: 35px; animation: shootUp   1.2s linear infinite .8s; }
                @keyframes shootUp   { 0% { transform: translateY(0);    opacity: 1; } 100% { transform: translateY(-90px); opacity: 0; } }
                @keyframes shootDown { 0% { transform: translateY(0);    opacity: 1; } 100% { transform: translateY(90px);  opacity: 0; } }
                .uart-line {
                    position: absolute; top: 50%;
                    left: calc(50% - 15px); width: 30px; height: 1px;
                    background: repeating-linear-gradient(90deg, #818cf8 0px, #818cf8 4px, transparent 4px, transparent 8px);
                    animation: uartPulse 1s linear infinite;
                }
                @keyframes uartPulse { from { transform: translateX(-8px); } to { transform: translateX(0); } }
                .uart-label {
                    position: absolute; top: calc(50% + 8px); left: 50%;
                    transform: translateX(-50%);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 7px; color: rgba(129,140,248,.4); letter-spacing: 1px;
                }

                /* ═══════════════════════════════════════════════════════
                   ROBOTIC ARM
                ═══════════════════════════════════════════════════════ */
                .arm-scene {
                    background: linear-gradient(135deg, #1a0a1a 0%, #2a1030 50%, #150a20 100%);
                    width: 100%; height: 100%;
                    position: relative; overflow: hidden;
                }
                .arm-grid {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(rgba(192,132,252,.04) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                .arm-base { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); }
                .base-plate { width: 60px; height: 10px; background: linear-gradient(to top, #555, #777); border-radius: 3px; }
                .arm-s1 {
                    position: absolute; bottom: 10px; left: 50%;
                    transform-origin: bottom center;
                    transform: translateX(-50%) rotate(-20deg);
                    animation: a1 4s ease-in-out infinite;
                    width: 8px; height: 70px;
                    background: linear-gradient(to top, #888, #aaa);
                    border-radius: 4px;
                }
                .arm-s2 {
                    position: absolute; top: -2px; left: 50%;
                    transform-origin: top center;
                    transform: translateX(-50%) rotate(40deg);
                    animation: a2 4s ease-in-out infinite;
                    width: 6px; height: 55px;
                    background: linear-gradient(to top, #999, #bbb);
                    border-radius: 3px;
                }
                .arm-joint {
                    position: absolute; top: -4px; left: 50%;
                    transform: translateX(-50%);
                    width: 12px; height: 12px;
                    background: #c084fc; border-radius: 50%;
                    box-shadow: 0 0 10px rgba(192,132,252,.4);
                }
                .arm-gripper {
                    position: absolute; bottom: -6px; left: 50%;
                    transform: translateX(-50%);
                    display: flex; gap: 3px;
                    animation: grip 4s ease-in-out infinite;
                }
                .gr-l, .gr-r { width: 3px; height: 14px; background: #ccc; border-radius: 1px; }
                @keyframes a1   { 0%,100% { transform: translateX(-50%) rotate(-20deg); } 50% { transform: translateX(-50%) rotate(15deg); } }
                @keyframes a2   { 0%,100% { transform: translateX(-50%) rotate(40deg);  } 50% { transform: translateX(-50%) rotate(-10deg); } }
                @keyframes grip { 0%,40% { gap: 6px; } 50%,90% { gap: 2px; } 100% { gap: 6px; } }
                .gc-lines {
                    position: absolute; top: 16px; left: 20px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px; color: rgba(192,132,252,.3); line-height: 1.7;
                }
                .gc-l { animation: gcFade 4s ease-in-out infinite; }
                .gc-l:nth-child(2) { animation-delay: .3s; }
                .gc-l:nth-child(3) { animation-delay: .6s; }
                @keyframes gcFade { 0%,100% { opacity: .2; } 50% { opacity: .6; } }
                .arm-label {
                    position: absolute; top: 12px; right: 16px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px; color: rgba(192,132,252,.35); letter-spacing: 1px;
                }

                /* ═══════════════════════════════════════════════════════
                   PARALLEL EDGE DETECTION
                ═══════════════════════════════════════════════════════ */
                .edge-scene {
                    background: linear-gradient(135deg, #0a1a0a 0%, #0f2b15 50%, #081510 100%);
                    width: 100%; height: 100%;
                    position: relative; overflow: hidden;
                }
                .edge-label {
                    position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 8px; color: rgba(34,197,94,.4); letter-spacing: 1px;
                    white-space: nowrap;
                }
                .edge-grid-l {
                    position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
                    width: 80px; height: 80px;
                    border: 1px solid rgba(34,197,94,.2); border-radius: 4px;
                    overflow: hidden;
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    grid-template-rows: repeat(8, 1fr);
                }
                .edge-cell {
                    background: rgba(34,197,94,.05);
                    border: .5px solid rgba(34,197,94,.08);
                }
                .edge-cell.active { animation: edgeFlash 3s ease-in-out infinite; }
                .edge-cell:nth-child(3n+1).active { animation-delay: .1s; }
                .edge-cell:nth-child(5n+2).active { animation-delay: .4s; }
                .edge-cell:nth-child(7n).active   { animation-delay: .7s; }
                @keyframes edgeFlash {
                    0%,100% { background: rgba(34,197,94,.05); }
                    50%     { background: rgba(34,197,94,.4);  }
                }
                .edge-arrow {
                    position: absolute; top: 50%; left: 105px;
                    width: 30px; height: 1px;
                    background: linear-gradient(to right, rgba(34,197,94,.3), rgba(34,197,94,.1));
                }
                .edge-grid-r {
                    position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
                    width: 80px; height: 80px;
                    border: 1px solid rgba(34,197,94,.3); border-radius: 4px;
                    overflow: hidden;
                }
                .edge-outline {
                    position: absolute; inset: 8px;
                    border: 2px solid rgba(34,197,94,.6); border-radius: 12px;
                    animation: edgePulse 3s ease-in-out infinite;
                }
                @keyframes edgePulse {
                    0%,100% { opacity: .3; border-radius: 12px; }
                    50%     { opacity: .8; border-radius: 4px;  }
                }
                .thread-bars {
                    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
                    display: flex; gap: 3px;
                }
                .tbar {
                    width: 4px; border-radius: 2px;
                    background: linear-gradient(to top, rgba(34,197,94,.6), rgba(34,197,94,.1));
                    animation: tbarGrow 1.5s ease-in-out infinite;
                }
                .tbar:nth-child(1) { height: 12px; animation-delay: 0s;   }
                .tbar:nth-child(2) { height: 18px; animation-delay: .15s; }
                .tbar:nth-child(3) { height: 10px; animation-delay: .3s;  }
                .tbar:nth-child(4) { height: 22px; animation-delay: .45s; }
                .tbar:nth-child(5) { height: 14px; animation-delay: .6s;  }
                .tbar:nth-child(6) { height: 20px; animation-delay: .75s; }
                @keyframes tbarGrow { 0%,100% { opacity: .4; } 50% { opacity: 1; } }

                /* ═══════════════════════════════════════════════════════
                   DNS RESOLVER
                ═══════════════════════════════════════════════════════ */
                .dns-scene {
                    background: linear-gradient(135deg, #0a1520 0%, #0d2030 50%, #081018 100%);
                    width: 100%; height: 100%;
                    position: relative; overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                }
                .dns-nodes { position: relative; width: 100%; height: 100%; }
                .dns-node {
                    position: absolute;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 7px; padding: 4px 8px;
                    border-radius: 4px; border: 1px solid;
                }
                .dns-root   { top: 15%; left: 50%; transform: translateX(-50%); color: #60a5fa; border-color: rgba(96,165,250,.3);  background: rgba(96,165,250,.08);  }
                .dns-tld    { top: 40%; left: 25%;                               color: #818cf8; border-color: rgba(129,140,248,.3); background: rgba(129,140,248,.08); }
                .dns-auth   { top: 40%; right: 25%;                              color: #c084fc; border-color: rgba(192,132,252,.3); background: rgba(192,132,252,.08); }
                .dns-result { top: 70%; left: 50%; transform: translateX(-50%); color: #4ade80; border-color: rgba(34,197,94,.3);   background: rgba(34,197,94,.08);   }
                .dns-line {
                    position: absolute;
                    background: rgba(129,140,248,.1);
                    height: 1px;
                    animation: dnsTrace 3s ease-in-out infinite;
                }
                .dns-line1 { top: 28%; left: 38%;  width: 40px; transform: rotate(30deg);  animation-delay: 0s;  }
                .dns-line2 { top: 28%; right: 38%; width: 40px; transform: rotate(-30deg); animation-delay: .5s; }
                .dns-line3 { top: 55%; left: 40%;  width: 50px; transform: rotate(30deg);  animation-delay: 1s;  }
                @keyframes dnsTrace {
                    0%,100% { opacity: .1; }
                    50%     { opacity: .8; background: rgba(129,140,248,.4); }
                }
                .dns-query {
                    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 7px; color: rgba(96,165,250,.3);
                    animation: gcFade 3s ease-in-out infinite;
                    white-space: nowrap;
                }

                /* ═══════════════════════════════════════════════════════
                   SALARY ML
                ═══════════════════════════════════════════════════════ */
                .ml-scene {
                    background: linear-gradient(135deg, #1a1a0a 0%, #2a2510 50%, #151208 100%);
                    width: 100%; height: 100%;
                    position: relative; overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                }
                .ml-label {
                    position: absolute; top: 12px; left: 16px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px; color: rgba(251,191,36,.35); letter-spacing: 1px;
                }
                .ml-chart {
                    position: relative; width: 120px; height: 80px;
                    border-left: 1px solid rgba(251,191,36,.2);
                    border-bottom: 1px solid rgba(251,191,36,.2);
                }
                .ml-dot {
                    position: absolute;
                    width: 4px; height: 4px;
                    background: #fbbf24; border-radius: 50%;
                    opacity: .5;
                    animation: mlFade 3s ease-in-out infinite;
                }
                .ml-dot:nth-child(1) { bottom: 15%; left: 10%;  animation-delay: 0s;   }
                .ml-dot:nth-child(2) { bottom: 25%; left: 25%;  animation-delay: .2s;  }
                .ml-dot:nth-child(3) { bottom: 35%; left: 35%;  animation-delay: .4s;  }
                .ml-dot:nth-child(4) { bottom: 30%; left: 50%;  animation-delay: .6s;  }
                .ml-dot:nth-child(5) { bottom: 50%; left: 60%;  animation-delay: .8s;  }
                .ml-dot:nth-child(6) { bottom: 55%; left: 75%;  animation-delay: 1s;   }
                .ml-dot:nth-child(7) { bottom: 70%; left: 85%;  animation-delay: 1.2s; }
                .ml-line {
                    position: absolute; bottom: 10%; left: 5%;
                    width: 100px; height: 1px;
                    background: linear-gradient(to right, rgba(251,191,36,.1), rgba(251,191,36,.6));
                    transform: rotate(-30deg); transform-origin: left;
                    animation: mlLine 3s ease-in-out infinite;
                }
                @keyframes mlFade { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.3); } }
                @keyframes mlLine { 0%,100% { opacity: .3; } 50% { opacity: .8; } }

                /* ═══════════════════════════════════════════════════════
                   AGGIE REMINDER
                ═══════════════════════════════════════════════════════ */
                .hack-scene {
                    background: linear-gradient(135deg, #0a0a1e 0%, #10102a 50%, #08081a 100%);
                    width: 100%; height: 100%;
                    position: relative; overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                }
                .hack-label {
                    position: absolute; top: 12px; left: 16px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px; color: rgba(129,140,248,.35); letter-spacing: 1px;
                }
                .hack-notif { position: relative; width: 140px; }
                .notif-card {
                    background: rgba(129,140,248,.08);
                    border: 1px solid rgba(129,140,248,.15);
                    border-radius: 8px;
                    padding: 8px 10px;
                    margin-bottom: 6px;
                    animation: notifSlide 4s ease-in-out infinite;
                }
                .notif-card:nth-child(2) { animation-delay: .5s; opacity: .7; }
                .notif-card:nth-child(3) { animation-delay: 1s;  opacity: .4; }
                .notif-icon {
                    display: inline-block;
                    width: 6px; height: 6px;
                    background: #818cf8; border-radius: 50%;
                    margin-right: 6px;
                }
                .notif-text {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 7px; color: rgba(129,140,248,.6);
                    display: inline;
                }
                .notif-time {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 6px; color: rgba(129,140,248,.3);
                    margin-top: 3px;
                }
                @keyframes notifSlide {
                    0%          { transform: translateY(8px); opacity: 0; }
                    15%, 85%    { transform: translateY(0);   opacity: 1; }
                    100%        { transform: translateY(-4px); opacity: 0; }
                }
            `}</style>
        </section>
    );
}

// ─── Animation components ─────────────────────────────────────────────────────

function DualGame() {
    return (
        <div className="dual-scene">
            <div className="dual-label">CC3200 × 2</div>
            <div className="score-display">P1: 3<br />P2: 2</div>
            <div className="dual-screen dual-screen-l">
                <div className="screen-header">PLAYER 1</div>
                <div className="ship ship-l" />
                <div className="projectile proj-1" />
                <div className="projectile proj-3" />
            </div>
            <div className="dual-screen dual-screen-r">
                <div className="screen-header">PLAYER 2</div>
                <div className="ship ship-r" />
                <div className="projectile proj-2" />
            </div>
            <div className="uart-line" />
            <div className="uart-label">UART</div>
        </div>
    );
}

function RoboticArm() {
    return (
        <div className="arm-scene">
            <div className="arm-grid" />
            <div className="gc-lines">
                <div className="gc-l">G01 X42.5 Y18.0</div>
                <div className="gc-l">G28 Z0.0 F200</div>
                <div className="gc-l">M03 S1000</div>
            </div>
            <div className="arm-label">KINEMATICS</div>
            <div className="arm-base">
                <div className="base-plate" />
                <div className="arm-s1">
                    <div className="arm-joint" />
                    <div className="arm-s2">
                        <div className="arm-gripper">
                            <div className="gr-l" />
                            <div className="gr-r" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Active edge cells based on mockup pattern
const ACTIVE_CELLS = new Set([1,3,5,8,10,13,15,17,20,24,28,32,36,40,42,45,49,53,57,58,60,63]);

function EdgeDetection() {
    return (
        <div className="edge-scene">
            <div className="edge-label">OpenMP · CUDA · SIMD</div>
            <div className="edge-grid-l">
                {Array.from({ length: 64 }, (_, i) => (
                    <div key={i} className={`edge-cell${ACTIVE_CELLS.has(i) ? " active" : ""}`} />
                ))}
            </div>
            <div className="edge-arrow" />
            <div className="edge-grid-r">
                <div className="edge-outline" />
            </div>
            <div className="thread-bars">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="tbar" />
                ))}
            </div>
        </div>
    );
}

function DnsResolver() {
    return (
        <div className="dns-scene">
            <div className="dns-nodes">
                <div className="dns-node dns-root">. (root)</div>
                <div className="dns-node dns-tld">.com TLD</div>
                <div className="dns-node dns-auth">auth NS</div>
                <div className="dns-node dns-result">93.184.216.34</div>
                <div className="dns-line dns-line1" />
                <div className="dns-line dns-line2" />
                <div className="dns-line dns-line3" />
            </div>
            <div className="dns-query">$ dig example.com A</div>
        </div>
    );
}

function SalaryML() {
    return (
        <div className="ml-scene">
            <div className="ml-label">PREDICTION</div>
            <div className="ml-chart">
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="ml-dot" />
                ))}
                <div className="ml-line" />
            </div>
        </div>
    );
}

function AggieReminder() {
    return (
        <div className="hack-scene">
            <div className="hack-label">HACKDAVIS &apos;24</div>
            <div className="hack-notif">
                <div className="notif-card">
                    <span className="notif-icon" />
                    <span className="notif-text">Shift reminder: Tomorrow 9am</span>
                    <div className="notif-time">Just now</div>
                </div>
                <div className="notif-card">
                    <span className="notif-icon" />
                    <span className="notif-text">Hours logged: 4.5h this week</span>
                    <div className="notif-time">2m ago</div>
                </div>
                <div className="notif-card">
                    <span className="notif-icon" />
                    <span className="notif-text">New volunteer assigned</span>
                    <div className="notif-time">5m ago</div>
                </div>
            </div>
        </div>
    );
}

function DefaultVisual() {
    return (
        <div className="default-visual" />
    );
}
