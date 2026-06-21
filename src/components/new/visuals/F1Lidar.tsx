"use client";

import { useEffect, useRef } from "react";

// F1Tenth scene visual: top-down autonomous race car driving the racing line
// while its LiDAR scans the track walls (point cloud) and a Monte Carlo
// particle swarm converges on its pose. Canvas-rendered; animates only while
// on-screen, and draws a single static frame for reduced-motion.
export default function F1Lidar() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const cv = cvRef.current;
        const wrap = wrapRef.current;
        if (!cv || !wrap) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let W = 0,
            H = 0,
            idx = 10,
            ph = 0,
            timer: number | null = null;
        let cl: number[][] = [],
            wl: number[][] = [],
            wr: number[][] = [];
        const parts = Array.from({ length: 30 }, () => ({ a: Math.random() * 6.283, r: Math.random() }));

        const build = () => {
            cv.width = cv.clientWidth;
            cv.height = cv.clientHeight;
            W = cv.width;
            H = cv.height;
            cl = [];
            wl = [];
            wr = [];
            const N = 90,
                hw = W * 0.12;
            for (let i = 0; i <= N; i++) {
                const t = i / N;
                cl.push([W * 0.5 + Math.sin(t * Math.PI * 2.1) * W * 0.24, H * 0.92 - t * H * 0.84]);
            }
            for (let i = 0; i < cl.length; i++) {
                const p = cl[i],
                    a = cl[Math.max(0, i - 1)],
                    b = cl[Math.min(cl.length - 1, i + 1)];
                const dx = b[0] - a[0],
                    dy = b[1] - a[1],
                    L = Math.hypot(dx, dy) || 1,
                    nx = -dy / L,
                    ny = dx / L;
                wl.push([p[0] + nx * hw, p[1] + ny * hw]);
                wr.push([p[0] - nx * hw, p[1] - ny * hw]);
            }
        };
        const poly = (pts: number[][], close?: boolean) => {
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
            if (close) ctx.closePath();
        };
        const rrect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
        };
        const render = () => {
            if (!W) build();
            ctx.clearRect(0, 0, W, H);
            poly(wl.concat(wr.slice().reverse()), true);
            ctx.fillStyle = "rgba(18,30,28,0.5)";
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "rgba(60,180,130,0.5)";
            poly(wl);
            ctx.stroke();
            poly(wr);
            ctx.stroke();
            ctx.save();
            ctx.setLineDash([5, 6]);
            ctx.lineWidth = 1.6;
            ctx.strokeStyle = "rgba(157,255,196,0.55)";
            ctx.shadowColor = "rgba(46,255,160,0.6)";
            ctx.shadowBlur = 5;
            poly(cl);
            ctx.stroke();
            ctx.restore();
            const car = cl[idx],
                a0 = cl[Math.max(0, idx - 1)],
                a1 = cl[Math.min(cl.length - 1, idx + 1)],
                head = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
            ph = (ph + 0.22) % (Math.PI * 2);
            const R = W * 0.5;
            for (let s = 0; s < 2; s++) {
                const wall = s ? wr : wl;
                for (let i = 0; i < wall.length; i++) {
                    const wp = wall[i],
                        dx = wp[0] - car[0],
                        dy = wp[1] - car[1],
                        d = Math.hypot(dx, dy);
                    if (d > R) continue;
                    const ang = Math.atan2(dy, dx);
                    const diff = Math.abs((((ang - head - ph) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
                    const near = diff < 0.25;
                    ctx.fillStyle = near ? "#9dffc4" : "rgba(46,200,140,0.5)";
                    ctx.beginPath();
                    ctx.arc(wp[0], wp[1], near ? 2.2 : 1.3, 0, 6.283);
                    ctx.fill();
                    if (near) {
                        ctx.strokeStyle = "rgba(120,255,180,0.25)";
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(car[0], car[1]);
                        ctx.lineTo(wp[0], wp[1]);
                        ctx.stroke();
                    }
                }
            }
            const spread = 5 + 9 * (0.5 + 0.5 * Math.sin(Date.now() / 700));
            for (let i = 0; i < parts.length; i++) {
                const p = parts[i],
                    aa = p.a + (Math.random() - 0.5) * 0.3,
                    prad = p.r * spread;
                ctx.fillStyle = "rgba(94,235,212,0.5)";
                ctx.beginPath();
                ctx.arc(car[0] + Math.cos(aa) * prad, car[1] + Math.sin(aa) * prad, 1.4, 0, 6.283);
                ctx.fill();
            }
            // top-down RC race car with LiDAR puck
            ctx.save();
            ctx.translate(car[0], car[1]);
            ctx.rotate(head);
            const L = W * 0.072,
                Wd = W * 0.042,
                hl = L / 2,
                hw2 = Wd / 2,
                wlen = L * 0.3,
                wwid = Wd * 0.4;
            ctx.fillStyle = "#06090c";
            [[hl * 0.56, -hw2], [hl * 0.56, hw2], [-hl * 0.56, -hw2], [-hl * 0.56, hw2]].forEach((w) => {
                rrect(w[0] - wlen / 2, w[1] - wwid / 2, wlen, wwid, wwid * 0.4);
                ctx.fill();
            });
            ctx.shadowColor = "rgba(46,255,160,0.55)";
            ctx.shadowBlur = 10;
            ctx.fillStyle = "#cfd7df";
            ctx.strokeStyle = "rgba(46,255,160,0.65)";
            ctx.lineWidth = 1;
            rrect(-hl, -hw2 * 0.82, L, Wd * 0.82, Wd * 0.34);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgba(40,200,120,0.55)";
            rrect(-hl * 0.35, -0.9, hl * 1.1, 1.8, 1);
            ctx.fill();
            ctx.fillStyle = "#0c1116";
            rrect(-hl * 0.08, -hw2 * 0.42, L * 0.26, Wd * 0.6, 2);
            ctx.fill();
            ctx.fillStyle = "#9dffc4";
            ctx.shadowColor = "#2effa0";
            ctx.shadowBlur = 11;
            ctx.beginPath();
            ctx.arc(hl * 0.22, 0, W * 0.009, 0, 6.283);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
            idx++;
            if (idx >= cl.length - 2) idx = 2;
        };

        const start = () => {
            if (timer == null) timer = window.setInterval(render, 45);
        };
        const stop = () => {
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
        };
        const onResize = () => {
            W = 0;
        };
        window.addEventListener("resize", onResize);

        build();
        render();
        let io: IntersectionObserver | null = null;
        if (!reduce) {
            io = new IntersectionObserver(
                ([e]) => (e.isIntersecting ? start() : stop()),
                { threshold: 0.1 },
            );
            io.observe(wrap);
        }
        return () => {
            stop();
            window.removeEventListener("resize", onResize);
            io?.disconnect();
        };
    }, []);

    return (
        <div className="f1l" ref={wrapRef}>
            <canvas className="f1l-cv" ref={cvRef} />
            <div className="f1l-hud f1l-tl">
                MCL · <b>1000</b> particles @ <b>40Hz</b>
            </div>
            <div className="f1l-hud f1l-tr">
                <span className="v">20</span> mph
            </div>
            <div className="f1l-hud f1l-bl">
                <i />
                pose locked · 0.4° err
            </div>

            <style>{`
                .f1l { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 50% 50%, rgba(20,60,45,0.16), transparent 60%), #060a0c; }
                .f1l-cv { position: absolute; inset: 0; width: 100%; height: 100%; }
                .f1l-hud { position: absolute; font-family: var(--font-mono); font-size: 10px; color: #8aa0b4; letter-spacing: 0.04em; }
                .f1l-tl { top: 12px; left: 14px; } .f1l-tl b { color: var(--green-bright); font-weight: 500; }
                .f1l-tr { top: 12px; right: 14px; text-align: right; } .f1l-tr .v { color: var(--green-bright); font-size: 18px; font-weight: 500; }
                .f1l-bl { bottom: 10px; left: 14px; color: var(--green); }
                .f1l-bl i { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); margin-right: 5px; animation: f1lBlink 1.4s steps(1) infinite; }
                @keyframes f1lBlink { 50% { opacity: 0.35; } }
                @media (prefers-reduced-motion: reduce) { .f1l-bl i { animation: none; } }
            `}</style>
        </div>
    );
}
