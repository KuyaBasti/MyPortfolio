"use client";

import { useEffect, useRef } from "react";

// ubreakifix scene visual: a phone with a shattered screen that a repair sweep
// heals to a fresh display (cracked → replaced ✓), on a loop. Pure-CSS
// animation; paused while off-screen, and resolves to the repaired state for
// reduced-motion.
export default function UbreakifixScreen() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => el.classList.toggle("paused", !e.isIntersecting),
            { threshold: 0.1 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div className="ubr" ref={ref}>
            <div className="ubr-tag">
                iPhone 14 · <b>OLED swap</b>
            </div>
            <div className="ubr-phone">
                <div className="ubr-cam" />
                <div className="ubr-screen">
                    <div className="ubr-clean">
                        <div className="ubr-grid">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <i key={i} />
                            ))}
                        </div>
                    </div>
                    <svg className="ubr-cracks" viewBox="0 0 130 290" preserveAspectRatio="none">
                        <g stroke="rgba(220,235,255,0.7)" strokeWidth="0.8" fill="none">
                            <path d="M52 86 L8 20 M52 86 L70 8 M52 86 L122 40 M52 86 L126 120 M52 86 L96 200 M52 86 L40 282 M52 86 L4 210 M52 86 L2 120" />
                            <path d="M30 52 L78 44 L92 96 L66 150 L20 132 L18 84 Z" opacity="0.6" />
                            <path d="M40 70 L66 66 L72 100 L56 122 L34 110 Z" opacity="0.5" />
                        </g>
                        <circle cx="52" cy="86" r="3" fill="rgba(220,235,255,0.5)" />
                    </svg>
                    <div className="ubr-heal" />
                    <div className="ubr-check">✓</div>
                </div>
            </div>
            <div className="ubr-badge ubr-crack">screen · cracked</div>
            <div className="ubr-badge ubr-done">screen · replaced</div>

            <style>{`
                .ubr { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden;
                       background: radial-gradient(ellipse at 50% 40%, rgba(30,70,55,0.16), transparent 60%), #060a0c; }
                .ubr.paused :where(.ubr-cracks,.ubr-clean,.ubr-heal,.ubr-check,.ubr-crack,.ubr-done) { animation-play-state: paused; }
                .ubr-phone { position: relative; width: 150px; height: 312px; border-radius: 26px; background: #0c1116; border: 2px solid #232a31;
                             box-shadow: 0 24px 50px -18px #000, inset 0 0 0 1px rgba(255,255,255,0.04); padding: 9px; }
                .ubr-cam { position: absolute; top: 13px; left: 50%; transform: translateX(-50%); width: 36px; height: 5px; border-radius: 3px; background: #05080b; z-index: 2; }
                .ubr-screen { position: relative; width: 100%; height: 100%; border-radius: 18px; overflow: hidden; background: #070d10; }
                .ubr-clean { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 30%, rgba(46,255,160,0.14), transparent 60%), linear-gradient(160deg, #0b1a16, #081016); opacity: 0; animation: ubrCln 5.5s ease-in-out infinite; }
                .ubr-grid { position: absolute; inset: 18px 16px; display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 18px; gap: 12px; }
                .ubr-grid i { border-radius: 5px; background: rgba(46,255,160,0.16); box-shadow: 0 0 8px rgba(46,255,160,0.15); }
                .ubr-cracks { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 1; animation: ubrCrk 5.5s ease-in-out infinite; }
                .ubr-heal { position: absolute; left: -10%; right: -10%; height: 16px; top: 0; background: linear-gradient(180deg, rgba(46,255,160,0.9), rgba(46,255,160,0)); box-shadow: 0 0 22px 6px rgba(46,255,160,0.5); opacity: 0; animation: ubrHeal 5.5s ease-in-out infinite; }
                .ubr-check { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0.5); width: 52px; height: 52px; border-radius: 50%; border: 2.5px solid #34c759; color: #9dffc4; display: flex; align-items: center; justify-content: center; font-size: 26px; opacity: 0; box-shadow: 0 0 24px rgba(46,255,160,0.5); animation: ubrChk 5.5s ease-in-out infinite; }
                @keyframes ubrCrk { 0%,34% { opacity: 1; } 50%,92% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes ubrCln { 0%,36% { opacity: 0; } 52%,90% { opacity: 1; } 100% { opacity: 0; } }
                @keyframes ubrHeal { 0%,36% { transform: translateY(-20px); opacity: 0; } 38% { opacity: 1; } 50% { transform: translateY(300px); opacity: 1; } 53%,100% { opacity: 0; transform: translateY(300px); } }
                @keyframes ubrChk { 0%,48% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); } 58% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 86% { opacity: 1; } 92%,100% { opacity: 0; } }
                .ubr-badge { position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%); font-family: var(--font-mono); font-size: 12px; padding: 4px 12px; border-radius: 999px; border: 1px solid; }
                .ubr-crack { color: #ff9d6b; border-color: rgba(255,120,60,0.4); background: rgba(255,120,60,0.08); animation: ubrCrk 5.5s ease-in-out infinite; }
                .ubr-done { color: var(--green-bright); border-color: var(--green-dim); background: rgba(40,200,90,0.1); opacity: 0; animation: ubrCln 5.5s ease-in-out infinite; }
                .ubr-tag { position: absolute; left: 16px; top: 12px; font-family: var(--font-mono); font-size: 10px; color: rgba(150,170,160,0.6); letter-spacing: 0.06em; }
                .ubr-tag b { color: var(--green-bright); font-weight: 500; }

                @media (prefers-reduced-motion: reduce) {
                    .ubr-cracks, .ubr-heal, .ubr-crack { display: none; }
                    .ubr-clean, .ubr-done { opacity: 1; animation: none; }
                    .ubr-check { opacity: 1; transform: translate(-50%,-50%) scale(1); animation: none; }
                }
            `}</style>
        </div>
    );
}
