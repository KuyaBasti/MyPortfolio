"use client";

import { useEffect, useRef } from "react";
import AisleScene from "./scenes/AisleScene";
import PhoneScene from "./scenes/PhoneScene";
import RaceScene from "./scenes/RaceScene";
import OrbitScene from "./scenes/OrbitScene";

interface Chapter {
    num: string;
    date: string;
    titleLead: string;
    titleIri: string;
    desc: string;
    meta: string[];
    role: string;
    company: string;
    link?: { label: string; href: string };
    scene: "aisle" | "phone" | "race" | "orbit";
    alt: string;
}

// Copy mirrors src/data/portfolio.ts; keep the two in sync.
const chapters: Chapter[] = [
    {
        num: "01",
        date: "Apr 2026 → Present",
        titleLead: "Server qualification,",
        titleIri: "at high volume.",
        desc: "Validating NVIDIA GB200/GB300 racks at node (L10) and rack (L11) level for a hyperscaler customer. Night-shift co-lead: I roll out diag and firmware releases across our PXE servers, qualify changes with isolated control runs, and handle line outages.",
        meta: ["160 → 400+ racks/mo", "NVL72 · L10/L11", "Bash · rsync", "PXE · iPXE"],
        role: "Test Engineer | Hyperscaler NPI",
        company: "Quanta Manufacturing",
        scene: "aisle",
        alt: "A server aisle, the camera gliding down it",
    },
    {
        num: "02",
        date: "Jul 2025 → Apr 2026",
        titleLead: "Repair,",
        titleIri: "good as new.",
        desc: "Diagnosed and repaired smartphones, tablets, laptops and game consoles at the component level, including board-level rework and fine-pitch soldering.",
        meta: ["Screens", "Batteries", "Soldering", "Diagnostics"],
        role: "Repair Technician",
        company: "uBreakiFix by Asurion",
        scene: "phone",
        alt: "A phone opened into its layers, its screen tested, then closed again",
    },
    {
        num: "03",
        date: "Jan 2025 → Jul 2025",
        titleLead: "Full autonomy,",
        titleIri: "corner after corner.",
        desc: "Part of a team that took a 1/10-scale race car from Bluetooth teleop to its first fully autonomous laps, using ROS 2 on an NVIDIA Jetson Xavier NX.",
        meta: ["4,000 particles", "240K ray casts/update", "~3 m/s", "ROS2 · LiDAR"],
        role: "Software Engineer Intern",
        company: "UCD CORE Lab · F1Tenth",
        link: { label: "Watch the demo", href: "https://www.youtube.com/watch?v=dcUj0-wVvGQ" },
        scene: "race",
        alt: "A 1/10-scale race car lapping a track, its LiDAR fan sweeping the boundaries",
    },
    {
        num: "04",
        date: "Sep 2023 → Jan 2025",
        titleLead: "Bare metal,",
        titleIri: "bound for orbit.",
        desc: "Developed the bare-metal IMU driver (I2C and SPI) and the experiment-logging timer in C on an STM32 for a 3U CubeSat, now handed off to NASA for launch.",
        meta: ["launches Sept 2026", "10 Hz deterministic", "SPI mode 3 · 2.5 MHz", "Bare-metal C · FreeRTOS"],
        role: "Firmware Engineer",
        company: "Space and Satellite Systems · UC Davis",
        scene: "orbit",
        alt: "A 3U CubeSat drifting in low orbit above the Earth limb",
    },
];

function Scene({ kind }: { kind: Chapter["scene"] }) {
    switch (kind) {
        case "aisle":
            return <AisleScene />;
        case "phone":
            return <PhoneScene />;
        case "race":
            return <RaceScene />;
        case "orbit":
            return <OrbitScene />;
    }
}

export default function Experience() {
    const ref = useRef<HTMLElement>(null);

    // The copy of each chapter rises in once, the first time it scrolls into view.
    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        const chapterEls = Array.from(root.querySelectorAll<HTMLElement>(".chapter"));
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
            chapterEls.forEach((el) => el.classList.add("on"));
            return;
        }
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
            { threshold: 0.2 },
        );
        chapterEls.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <section id="experience" ref={ref}>
            {chapters.map((c) => (
                <article className="chapter" key={c.num} id={`ch-${c.num}`}>
                    <div className="pin">
                        <div className="dcopy">
                            <div className="tcard mono"><span>{c.num} · {c.date}</span></div>
                            <div className="drole mono">{c.role} <span>· {c.company}</span></div>
                            <h2 className="ht">{c.titleLead} <span className="iri">{c.titleIri}</span></h2>
                            <p>{c.desc}</p>
                            <ul className="dots">
                                {c.meta.map((m) => <li key={m}>{m}</li>)}
                            </ul>
                            {c.link && (
                                <a className="lnk mono" href={c.link.href} target="_blank" rel="noopener noreferrer">{c.link.label}</a>
                            )}
                        </div>
                        <div className="frame" role="img" aria-label={c.alt}>
                            <Scene kind={c.scene} />
                        </div>
                    </div>
                </article>
            ))}

            <style>{`
                .chapter { position: relative; }
                .chapter .pin {
                    position: relative; min-height: 100vh; min-height: 100svh;
                    display: grid; grid-template-columns: minmax(0, 11fr) minmax(0, 10fr); gap: clamp(24px, 4vw, 72px); align-items: center;
                    padding: calc(var(--lb) + 24px) var(--pad) 24px; overflow: hidden;
                }
                .dcopy { display: flex; flex-direction: column; gap: 18px; max-width: 640px; }
                .dcopy > * { opacity: 0; transform: translateY(22px); transition: opacity 1s ease, transform 1.1s cubic-bezier(.2,.7,.2,1); }
                .chapter.on .dcopy > * { opacity: 1; transform: none; }
                .chapter.on .dcopy > :nth-child(1) { transition-delay: .1s; }
                .chapter.on .dcopy > :nth-child(2) { transition-delay: .3s; }
                .chapter.on .dcopy > :nth-child(3) { transition-delay: .55s; }
                .chapter.on .dcopy > :nth-child(4) { transition-delay: .8s; }
                .chapter.on .dcopy > :nth-child(5) { transition-delay: 1s; }
                .chapter.on .dcopy > :nth-child(6) { transition-delay: 1.15s; }
                .tcard {
                    font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--green);
                    display: flex; gap: 14px; flex-wrap: wrap; align-items: baseline;
                }
                .tcard::before { content: ""; width: 22px; height: 1px; background: var(--green); align-self: center; flex: none; }
                .drole { font-size: 13px; letter-spacing: .02em; color: var(--ink); }
                .drole span { color: var(--ink-soft); }
                .ht { font-size: clamp(28px, 4.6vw, 64px); line-height: 1.04; letter-spacing: -.012em; font-weight: 600; max-width: 15ch; }
                .dcopy p { color: var(--ink-soft); font-size: clamp(15px, 1.15vw, 18px); line-height: 1.55; max-width: 58ch; }
                .dots { display: flex; flex-wrap: wrap; gap: 10px 22px; list-style: none; padding: 0; margin: 0; font-size: 14px; color: var(--ink-soft); }
                .dots li { display: flex; align-items: center; gap: 8px; }
                .dots li::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #8b7bff; box-shadow: 0 0 8px rgba(139,123,255,.6); flex: none; }
                .lnk { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--green-bright); display: inline-flex; gap: 8px; align-items: center; width: max-content; transition: color .3s; }
                .lnk::after { content: "\\2197"; font-size: 13px; }
                .lnk:hover { color: #fff; }
                .frame {
                    position: relative; z-index: 3; width: 100%; aspect-ratio: 16 / 11; max-height: calc(100svh - var(--lb) - 56px);
                    border-radius: 16px; overflow: hidden; background: var(--bg); border: 1px solid rgba(157,255,196,.16);
                    box-shadow: 0 0 0 1px rgba(40,200,64,.05), 0 30px 80px rgba(0,0,0,.6), 0 0 70px rgba(40,200,64,.07);
                }
                .frame .scene-gl { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
                @media (max-width: 860px) {
                    .chapter .pin { display: flex; flex-direction: column; justify-content: center; gap: 24px; padding-bottom: 32px; }
                    .frame { order: -1; aspect-ratio: 16 / 10; max-height: 40svh; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .dcopy > * { opacity: 1; transform: none; transition: none; }
                }
            `}</style>
        </section>
    );
}
