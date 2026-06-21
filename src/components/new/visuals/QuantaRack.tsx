"use client";

import { useEffect, useRef } from "react";

// Quanta scene visual: a cluster of server racks packed with blinking status
// indicators, ceiling light strips, and a scan sweep. Layout is generated once
// with a seeded RNG so SSR and client markup match; the LED blink is pure CSS,
// and a light JS "activity" flicker runs only while on-screen (skipped for
// reduced-motion).

type Led = { c: string; blink: boolean; delay: string };
type Unit = { type: "a" | "b" | "c"; groups: Led[][] };
type Rack = { units: Unit[] };

const POOL = ["lg", "lg", "lg", "lg", "lc", "lc", "la", "la", "lo", "lr"];

function mulberry32(a: number) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const RACKS: Rack[] = (() => {
    const rng = mulberry32(20260601);
    const ledGroup = (): Led[] => {
        const k = 5 + Math.floor(rng() * 4);
        const g: Led[] = [];
        for (let i = 0; i < k; i++) {
            const c = POOL[Math.floor(rng() * POOL.length)];
            g.push({ c, blink: c !== "lo" && rng() < 0.55, delay: `-${(rng() * 1.6).toFixed(2)}s` });
        }
        return g;
    };
    const racks: Rack[] = [];
    for (let r = 0; r < 4; r++) {
        const units: Unit[] = [];
        const n = 9 + (r % 2);
        for (let u = 0; u < n; u++) {
            const t = rng();
            const type = t < 0.5 ? "a" : t < 0.8 ? "b" : "c";
            const groups =
                type === "b"
                    ? [ledGroup(), ledGroup()]
                    : type === "c"
                      ? [[{ c: "lg", blink: true, delay: "0s" }, { c: "la", blink: false, delay: "0s" }]]
                      : [ledGroup()];
            units.push({ type, groups });
        }
        racks.push({ units });
    }
    return racks;
})();

function Leds({ group }: { group: Led[] }) {
    return (
        <span className="qr-leds">
            {group.map((l, i) => (
                <span
                    key={i}
                    className={`qr-led ${l.c}${l.blink ? " blink" : ""}`}
                    style={{ animationDelay: l.delay }}
                />
            ))}
        </span>
    );
}

export default function QuantaRack() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const el = ref.current;
        if (!el) return;
        const leds = Array.from(el.querySelectorAll<HTMLElement>(".qr-led:not(.lo)"));
        let timer: number | null = null;
        const tick = () => {
            for (let i = 0; i < 4; i++) {
                const l = leds[(Math.random() * leds.length) | 0];
                if (!l) continue;
                l.style.opacity = "0.2";
                window.setTimeout(() => {
                    l.style.opacity = "";
                }, 200);
            }
        };
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    if (timer == null) timer = window.setInterval(tick, 600);
                } else if (timer != null) {
                    clearInterval(timer);
                    timer = null;
                }
            },
            { threshold: 0.15 },
        );
        io.observe(el);
        return () => {
            if (timer != null) clearInterval(timer);
            io.disconnect();
        };
    }, []);

    return (
        <div className="qr" ref={ref}>
            <div className="qr-ceiling">
                <i />
                <i />
            </div>
            <div className="qr-racks">
                {RACKS.map((rk, ri) => (
                    <div className="qr-rack" key={ri}>
                        <div className="qr-top">
                            <i className="lg blink" />
                            <i className="lc" />
                        </div>
                        {rk.units.map((u, ui) => (
                            <div className="qr-ru" key={ui}>
                                <span className="qr-h" />
                                {u.type === "a" && (
                                    <>
                                        <span className="qr-vent" />
                                        <Leds group={u.groups[0]} />
                                    </>
                                )}
                                {u.type === "b" && (
                                    <>
                                        <Leds group={u.groups[0]} />
                                        <span className="qr-vent" />
                                        <Leds group={u.groups[1]} />
                                    </>
                                )}
                                {u.type === "c" && (
                                    <>
                                        <span className="qr-vent" style={{ opacity: 0.3 }} />
                                        <Leds group={u.groups[0]} />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
                <div className="qr-scan" />
            </div>
            <div className="qr-floor" />
            <div className="qr-tag">
                rack-row 07 · <b>qualification</b>
            </div>

            <style>{`
                .qr { position: absolute; inset: 0; overflow: hidden;
                      background: radial-gradient(ellipse at 50% 120%, rgba(40,90,70,0.18), transparent 60%), linear-gradient(180deg, #05070a, #070b10); }
                .qr-ceiling { position: absolute; top: 0; left: 0; right: 0; height: 26px; display: flex; justify-content: center; gap: 60px; }
                .qr-ceiling i { width: 70px; height: 5px; border-radius: 3px; background: #2effa0; box-shadow: 0 0 18px 3px rgba(46,255,160,0.45); opacity: 0.7; }
                .qr-floor { position: absolute; left: 0; right: 0; bottom: 0; height: 60px; background: linear-gradient(180deg, transparent, rgba(40,120,90,0.07)); }
                .qr-floor::before { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 38px, rgba(255,255,255,0.03) 38px 39px); }
                .qr-racks { position: absolute; left: 22px; right: 22px; top: 34px; bottom: 30px; display: flex; gap: 12px; align-items: stretch; }
                .qr-rack { flex: 1; display: flex; flex-direction: column; border-radius: 6px 6px 3px 3px; padding: 4px; gap: 3px;
                           background: linear-gradient(180deg, #11161d, #0a0e13); border: 1px solid rgba(255,255,255,0.07);
                           box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 14px 30px -16px #000; position: relative; }
                .qr-rack::after { content: ""; position: absolute; inset: 0; border-radius: 6px; background: linear-gradient(105deg, rgba(120,200,255,0.05), transparent 40%); pointer-events: none; }
                .qr-top { height: 13px; flex-shrink: 0; border-radius: 3px; background: #161c24; display: flex; align-items: center; justify-content: flex-end; gap: 4px; padding: 0 5px; border: 1px solid rgba(255,255,255,0.05); }
                .qr-top i { width: 4px; height: 4px; border-radius: 50%; }
                .qr-ru { flex: 1; display: flex; align-items: center; gap: 5px; padding: 0 5px; border-radius: 2px;
                         background: linear-gradient(180deg, #0e1219, #0b0f15); border: 1px solid rgba(255,255,255,0.04); min-height: 0; }
                .qr-h { width: 3px; height: 60%; border-radius: 2px; background: #2b333d; flex-shrink: 0; }
                .qr-vent { flex: 1; height: 60%; border-radius: 1px; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px); opacity: 0.5; }
                .qr-leds { display: flex; gap: 3px; flex-shrink: 0; }
                .qr-led { width: 4px; height: 4px; border-radius: 50%; }
                .qr .lg { background: #34c759; box-shadow: 0 0 5px #34c759; }
                .qr .la { background: #ffb340; box-shadow: 0 0 5px #ffb340; }
                .qr .lc { background: #5ad1ff; box-shadow: 0 0 5px #5ad1ff; }
                .qr .lr { background: #ff5f57; box-shadow: 0 0 5px #ff5f57; }
                .qr .lo { background: #2a323c; box-shadow: none; }
                .qr .blink { animation: qrBlink 1.6s steps(1) infinite; }
                @keyframes qrBlink { 50% { opacity: 0.25; } }
                .qr-scan { position: absolute; left: 22px; right: 22px; top: 34px; height: 60px; pointer-events: none;
                           background: linear-gradient(180deg, rgba(46,255,160,0.10), transparent); animation: qrScan 5s linear infinite; }
                @keyframes qrScan { 0% { transform: translateY(-40px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(330px); opacity: 0; } }
                .qr-tag { position: absolute; left: 16px; bottom: 8px; font-family: var(--font-mono); font-size: 10px; color: rgba(150,170,160,0.55); letter-spacing: 0.08em; }
                .qr-tag b { color: var(--green-bright); font-weight: 500; }

                @media (prefers-reduced-motion: reduce) {
                    .qr .blink, .qr-scan, .qr-ceiling i, .qr-top i { animation: none !important; }
                    .qr-scan { display: none; }
                }
            `}</style>
        </div>
    );
}
