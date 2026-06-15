"use client";

import { useEffect, useRef } from "react";

// Page-wide ambient backdrop: refined Matrix "streams" rain (bright glowing head
// + fading code-glyph trail), with scanlines + vignette. Calmer/sparser than the
// intro's boot rain so it's the same world without repeating it.
// Throttled, paused when the tab is hidden, and skipped for reduced-motion.
export default function Backdrop() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const glyphs = "01<>/{}[]();=+*:-.#%&|ABCDEF".split("");
        const sp = 16; // column spacing
        const speed = 0.5;
        const fade = 0.1;
        const density = 0.85;
        const head = "#b9ffce";
        const stepMs = 33;

        let cols = 0;
        let heads: { y: number; on: boolean; v: number }[] = [];
        let raf = 0;
        let last = 0;
        let running = true;

        const size = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cols = Math.ceil(canvas.width / sp);
            heads = [];
            for (let i = 0; i < cols; i++) {
                heads[i] = {
                    y: -Math.random() * 40,
                    on: Math.random() < density,
                    v: speed * (0.8 + Math.random() * 0.6),
                };
            }
            ctx.fillStyle = "#05070a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        const frame = () => {
            ctx.fillStyle = `rgba(5,7,10,${fade})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${sp}px 'JetBrains Mono', monospace`;
            for (let i = 0; i < cols; i++) {
                const h = heads[i];
                const x = i * sp;
                const y = h.y * sp;
                if (h.on) {
                    ctx.fillStyle = head;
                    ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y);
                }
                h.y += h.v;
                if (y > canvas.height + Math.random() * 260) {
                    h.y = -Math.random() * 24;
                    h.on = Math.random() < density;
                    h.v = speed * (0.8 + Math.random() * 0.6);
                }
            }
        };
        const loop = (t: number) => {
            if (!running) return;
            if (t - last > stepMs) {
                frame();
                last = t;
            }
            raf = requestAnimationFrame(loop);
        };
        const onVisibility = () => {
            running = !document.hidden;
            if (running) raf = requestAnimationFrame(loop);
            else cancelAnimationFrame(raf);
        };

        size();
        raf = requestAnimationFrame(loop);
        window.addEventListener("resize", size);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", size);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <div className="backdrop" aria-hidden>
            <canvas className="backdrop-rain" ref={canvasRef} />
            <div className="backdrop-scan" />
            <div className="backdrop-vig" />
        </div>
    );
}
