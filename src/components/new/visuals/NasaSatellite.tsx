"use client";

import { useEffect, useRef } from "react";

// NASA scene visual: a satellite orbiting across the top of the Earth (above
// the atmosphere) under a starfield, with live IMU telemetry. Stars are
// generated with a seeded RNG so SSR/hydration match; the orbit + telemetry
// run only while on-screen, and resolve to a static frame for reduced-motion.

function mulberry32(a: number) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const STARS = (() => {
    const rng = mulberry32(20231115);
    return Array.from({ length: 70 }, () => ({
        x: +(rng() * 400).toFixed(1),
        y: +(rng() * 205).toFixed(1),
        r: rng() < 0.2 ? 1.5 : 0.8,
        c: rng() < 0.3 ? "#9dffc4" : "#cfe0ff",
        d: `-${(rng() * 3).toFixed(2)}s`,
    }));
})();

const CX = 200,
    CY = 445,
    RO = 280;

export default function NasaSatellite() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const satRef = useRef<SVGGElement>(null);
    const rRef = useRef<HTMLElement>(null);
    const pRef = useRef<HTMLElement>(null);
    const yRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const sat = satRef.current;
        const wrap = wrapRef.current;
        if (!sat || !wrap) return;

        let th = 270;
        let timer: number | null = null;
        const jits: number[] = [];
        const orbit = () => {
            th += 0.32;
            if (th > 304) th = 236;
            const rad = (th * Math.PI) / 180;
            const x = CX + Math.cos(rad) * RO;
            const y = CY + Math.sin(rad) * RO;
            const rot = 6 * Math.sin(th * 0.06);
            const op = th < 246 ? (th - 236) / 10 : th > 294 ? (304 - th) / 10 : 1;
            sat.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(0.8) rotate(${rot.toFixed(1)})`);
            sat.setAttribute("opacity", Math.max(0, op).toFixed(2));
        };
        const jit = (el: HTMLElement | null, base: number, rng: number) => {
            if (!el) return;
            jits.push(window.setInterval(() => {
                const v = base + (Math.random() - 0.5) * rng;
                el.textContent = `${v >= 0 ? "+" : ""}${v.toFixed(1)}°`;
            }, 1200));
        };
        const start = () => {
            if (timer != null) return;
            timer = window.setInterval(orbit, 40);
            jit(rRef.current, 1.2, 0.6);
            jit(pRef.current, -0.4, 0.5);
            jit(yRef.current, 88.6, 0.4);
        };
        const stop = () => {
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
            jits.forEach(clearInterval);
            jits.length = 0;
        };
        orbit();
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.1 });
        io.observe(wrap);
        return () => {
            stop();
            io.disconnect();
        };
    }, []);

    return (
        <div className="nsa" ref={wrapRef}>
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <g>
                    {STARS.map((s, i) => (
                        <circle
                            key={i}
                            className="nsa-star"
                            cx={s.x}
                            cy={s.y}
                            r={s.r}
                            fill={s.c}
                            style={{ animationDelay: s.d }}
                        />
                    ))}
                </g>
                <circle cx="200" cy="445" r="225" fill="#08141c" />
                <ellipse cx="200" cy="232" rx="225" ry="34" fill="rgba(46,160,255,0.10)" />
                <circle cx="200" cy="445" r="225" fill="none" stroke="rgba(46,255,160,0.55)" strokeWidth="2.5" opacity="0.75" />
                <g stroke="rgba(90,180,140,0.16)" strokeWidth="0.6" fill="none">
                    <path d="M20 262 q180 -36 360 0" />
                    <path d="M50 292 q150 -30 300 0" />
                </g>
                <g ref={satRef} transform="translate(200,165) scale(0.8)">
                    <rect x="-50" y="-9" width="34" height="18" rx="1.5" fill="#13202a" stroke="rgba(120,200,255,0.4)" />
                    <rect x="16" y="-9" width="34" height="18" rx="1.5" fill="#13202a" stroke="rgba(120,200,255,0.4)" />
                    <g stroke="rgba(120,200,255,0.3)" strokeWidth="0.5">
                        <line x1="-44" y1="-9" x2="-44" y2="9" />
                        <line x1="-33" y1="-9" x2="-33" y2="9" />
                        <line x1="-22" y1="-9" x2="-22" y2="9" />
                        <line x1="22" y1="-9" x2="22" y2="9" />
                        <line x1="33" y1="-9" x2="33" y2="9" />
                        <line x1="44" y1="-9" x2="44" y2="9" />
                    </g>
                    <rect x="-14" y="-12" width="28" height="24" rx="3" fill="#cfd7df" stroke="rgba(46,255,160,0.6)" />
                    <rect x="-9" y="-7" width="18" height="14" rx="1.5" fill="#0c1116" />
                    <circle className="nsa-blink" cx="0" cy="0" r="3" fill="#9dffc4" />
                    <line x1="0" y1="-12" x2="0" y2="-22" stroke="#aab" strokeWidth="1.2" />
                    <circle cx="0" cy="-23" r="2.5" fill="none" stroke="rgba(46,255,160,0.7)" strokeWidth="1.2" />
                </g>
            </svg>
            <div className="nsa-hud nsa-tl">
                SAT-04 · <b>ASM330LHH</b>
            </div>
            <div className="nsa-hud nsa-tr">
                alt <b style={{ color: "#9dffc4" }}>10,000 km</b>
            </div>
            <div className="nsa-hud nsa-bl">
                att r <b ref={rRef}>+1.2°</b> p <b ref={pRef}>-0.4°</b> y <b ref={yRef}>88.6°</b>
            </div>
            <div className="nsa-hud nsa-br">
                <b>6.6 kHz</b> · 99.9%
            </div>

            <style>{`
                .nsa { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 50% 20%, #0a1620, #060a0e 70%); }
                .nsa svg { position: absolute; inset: 0; width: 100%; height: 100%; }
                .nsa-star { animation: nsaTwk 3s ease-in-out infinite; }
                @keyframes nsaTwk { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
                .nsa-blink { animation: nsaBlink 1.5s steps(1) infinite; }
                @keyframes nsaBlink { 50% { opacity: 0.4; } }
                .nsa-hud { position: absolute; font-family: var(--font-mono); font-size: 10px; color: #8aa0b4; letter-spacing: 0.04em; }
                .nsa-tl { top: 12px; left: 14px; } .nsa-tl b { color: var(--green-bright); }
                .nsa-tr { top: 12px; right: 14px; text-align: right; }
                .nsa-bl { bottom: 10px; left: 14px; } .nsa-bl b { color: var(--green-bright); }
                .nsa-br { bottom: 10px; right: 14px; text-align: right; color: var(--green); } .nsa-br b { color: var(--green-bright); }
                @media (prefers-reduced-motion: reduce) { .nsa-star, .nsa-blink { animation: none; } }
            `}</style>
        </div>
    );
}
