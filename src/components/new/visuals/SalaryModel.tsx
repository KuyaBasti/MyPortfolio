"use client";

import { useEffect, useRef } from "react";

// Salary Prediction scene visual: the canonical ML picture, played straight.
// Feature inputs type in terminal-style, activation pulses with comet tails
// sweep layer to layer (each wire staying lit at its weight's brightness,
// ripple rings landing on each layer), and the pink $ output node bursts as
// the predicted salary counts up. New features, new prediction, forever. The
// loop runs only while on-screen and resolves to a fully-lit static frame for
// reduced-motion. Client-only state, so SSR-safe.

const A = "#ff9f0a",
    Ab = "#ffd9a3",
    P = "#ff6680",
    Pb = "#ffd0da";
const HOPF = 20; // frames per hop

type Node = { x: number; y: number };
type Ripple = { n: Node; r0: number; t: number; col: string };

const FEAT_POOL: [string, string[]][] = [
    ["exp", ["3 yr", "5 yr", "7 yr", "12 yr"]],
    ["edu", ["BS", "MS", "PhD", "dipl"]],
    ["role", ["SWE I", "SWE II", "Sr SWE", "Staff"]],
    ["city", ["SF", "NYC", "SEA", "AUS"]],
    ["skills", ["8", "12", "15", "20"]],
];

export default function SalaryModel() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const cv = cvRef.current;
        if (!wrap || !cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let W = 0,
            H = 0;
        let L: Node[][] = [[], [], [], []];
        let phase = 0,
            pt = 0,
            fr = 0,
            salTgt = 118400,
            shown = 0;
        const act: number[][] = [[], [], [], []];
        let wts: number[][][] = [];
        let ripples: Ripple[] = [];
        let feats: [string, string][] = [];

        function build() {
            L = [[], [], [], []];
            const xs = [W * 0.18, W * 0.41, W * 0.63, W * 0.835];
            for (let i = 0; i < 5; i++) L[0].push({ x: xs[0], y: 52 + i * 36 });
            for (let i = 0; i < 6; i++) L[1].push({ x: xs[1], y: 42 + i * 32 });
            for (let i = 0; i < 6; i++) L[2].push({ x: xs[2], y: 42 + i * 32 });
            L[3].push({ x: xs[3], y: 122 });
        }
        function newCycle() {
            feats = FEAT_POOL.map((f) => [f[0], f[1][(Math.random() * f[1].length) | 0]]);
            for (let l = 0; l < 4; l++) act[l] = L[l].map(() => 0.35 + Math.random() * 0.65);
            wts = [];
            for (let l = 0; l < 3; l++) {
                const m: number[][] = [];
                for (let i = 0; i < L[l].length; i++) {
                    const r: number[] = [];
                    for (let j = 0; j < L[l + 1].length; j++) r.push(Math.pow(Math.random(), 1.6));
                    m.push(r);
                }
                wts.push(m);
            }
            salTgt = 95000 + Math.round(Math.random() * 500) * 100;
            phase = 0;
            pt = 0;
            ripples = [];
        }

        function layout() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = wrap!.clientWidth;
            H = wrap!.clientHeight;
            if (!W || !H) return;
            cv!.width = Math.round(W * dpr);
            cv!.height = Math.round(H * dpr);
            cv!.style.width = W + "px";
            cv!.style.height = H + "px";
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
            build();
        }

        const sigDelay = (i: number, j: number) => (i * 7 + j * 3) % 6;

        function drawNode(n: Node, r: number, a: number, col: string, colb: string, idle: number) {
            const c = ctx!;
            c.fillStyle = "rgba(20,14,8,0.95)";
            c.strokeStyle = a > 0 ? col : "rgba(255,159,10,0.4)";
            c.lineWidth = 1.1;
            if (a > 0) {
                c.shadowColor = col;
                c.shadowBlur = 14 * a;
            }
            c.beginPath();
            c.arc(n.x, n.y, r, 0, 6.28);
            c.fill();
            c.stroke();
            c.shadowBlur = 0;
            const core = Math.max(a, idle);
            if (core > 0) {
                c.globalAlpha = core * 0.8;
                c.fillStyle = colb;
                c.beginPath();
                c.arc(n.x, n.y, r * 0.45, 0, 6.28);
                c.fill();
                c.globalAlpha = 1;
            }
        }

        function render() {
            const c = ctx!;
            if (!W) layout();
            if (!W) return;
            c.clearRect(0, 0, W, H);
            fr++;
            const hop = phase >= 1 && phase <= 3 ? phase - 1 : -1;
            // edges
            for (let l = 0; l < 3; l++)
                for (let i = 0; i < L[l].length; i++)
                    for (let j = 0; j < L[l + 1].length; j++) {
                        const a = L[l][i],
                            b = L[l + 1][j],
                            w = wts[l][i][j];
                        const passed = phase >= 4 || l < hop;
                        c.strokeStyle = "rgba(255,159,10," + (passed ? 0.07 + 0.22 * w : 0.055 + 0.05 * w) + ")";
                        c.lineWidth = passed ? 0.6 + 1.7 * w : 0.6;
                        c.beginPath();
                        c.moveTo(a.x, a.y);
                        c.lineTo(b.x, b.y);
                        c.stroke();
                    }
            // signals with comet tails
            if (hop >= 0) {
                for (let i = 0; i < L[hop].length; i++)
                    for (let j = 0; j < L[hop + 1].length; j++) {
                        const p = (pt - sigDelay(i, j)) / (HOPF - 6);
                        if (p <= 0 || p >= 1) continue;
                        const a = L[hop][i],
                            b = L[hop + 1][j],
                            w = wts[hop][i][j];
                        const col = hop === 2 ? P : A,
                            colb = hop === 2 ? Pb : "#fff";
                        const t0 = Math.max(0, p - 0.22);
                        const g = c.createLinearGradient(
                            a.x + (b.x - a.x) * t0,
                            a.y + (b.y - a.y) * t0,
                            a.x + (b.x - a.x) * p,
                            a.y + (b.y - a.y) * p
                        );
                        g.addColorStop(0, "rgba(255,159,10,0)");
                        g.addColorStop(1, hop === 2 ? "rgba(255,102,128,0.7)" : "rgba(255,217,163,0.7)");
                        c.strokeStyle = g;
                        c.lineWidth = 1 + 1.4 * w;
                        c.beginPath();
                        c.moveTo(a.x + (b.x - a.x) * t0, a.y + (b.y - a.y) * t0);
                        c.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p);
                        c.stroke();
                        c.shadowColor = col;
                        c.shadowBlur = 9;
                        c.fillStyle = colb;
                        c.beginPath();
                        c.arc(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 1.6 + 1.2 * w, 0, 6.28);
                        c.fill();
                        c.shadowBlur = 0;
                    }
                if (pt === HOPF - 4)
                    for (let j = 0; j < L[hop + 1].length; j++)
                        ripples.push({ n: L[hop + 1][j], r0: hop + 1 === 3 ? 13 : 8, t: -(j % 3) * 3, col: hop === 2 ? P : A });
            }
            // ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const rp = ripples[i];
                rp.t++;
                if (rp.t < 0) continue;
                const pr = rp.t / 16;
                if (pr >= 1) {
                    ripples.splice(i, 1);
                    continue;
                }
                c.strokeStyle = rp.col;
                c.globalAlpha = (1 - pr) * 0.6;
                c.lineWidth = 1.2;
                c.beginPath();
                c.arc(rp.n.x, rp.n.y, rp.r0 + pr * 11, 0, 6.28);
                c.stroke();
                c.globalAlpha = 1;
            }
            // nodes
            const idle = phase === 5 ? 0.06 + 0.06 * Math.abs(Math.sin(fr * 0.05)) : 0;
            for (let l = 0; l < 4; l++)
                for (let i = 0; i < L[l].length; i++) {
                    const lit =
                        (l === 0 && phase >= 0) || (l === 1 && phase >= 2) || (l === 2 && phase >= 3) || (l === 3 && phase >= 4);
                    const aa = lit ? act[l][i] : 0;
                    if (l === 3) {
                        drawNode(L[l][i], 13, phase >= 4 ? 1 : 0, P, Pb, idle);
                        c.fillStyle = phase >= 4 ? "#fff" : "rgba(255,208,218,0.55)";
                        c.font = "600 11px 'JetBrains Mono', monospace";
                        c.textAlign = "center";
                        c.fillText("$", L[l][i].x, L[l][i].y + 4);
                    } else drawNode(L[l][i], l === 0 ? 7 : 8, aa, A, Ab, idle);
                }
            // input labels (typed)
            for (let i = 0; i < feats.length; i++) {
                const n = L[0][i];
                c.font = "8px 'JetBrains Mono', monospace";
                c.textAlign = "right";
                c.fillStyle = "rgba(154,160,168,0.85)";
                c.fillText(feats[i][0], n.x - 26, n.y + 1);
                let v = feats[i][1];
                if (phase === 0 && !reduce) {
                    const chars = Math.max(0, Math.floor((pt - i * 2) / 2.4));
                    v = v.slice(0, chars);
                    if (chars <= feats[i][1].length && (fr >> 2) % 2) v += "▎";
                }
                c.fillStyle = Ab;
                c.fillText(v, n.x - 26, n.y + 11);
            }
            // layer captions
            c.font = "7px 'JetBrains Mono', monospace";
            c.textAlign = "center";
            c.fillStyle = "rgba(154,160,168,0.55)";
            c.fillText("features", L[0][0].x, 232);
            c.fillText("dense · relu", L[1][0].x, 232);
            c.fillText("dense · relu", L[2][0].x, 232);
            c.fillText("ŷ", L[3][0].x, 232);
            // output
            if (phase >= 4 || shown > 0) {
                const o = L[3][0];
                c.font = "600 13px 'JetBrains Mono', monospace";
                c.textAlign = "left";
                c.fillStyle = Pb;
                c.fillText("$" + Math.round(shown).toLocaleString("en-US"), o.x - 32, o.y + 34);
                c.font = "8px 'JetBrains Mono', monospace";
                c.fillStyle = "rgba(154,160,168,0.8)";
                c.fillText("/ yr · ± $4.2k", o.x - 32, o.y + 46);
            }
            // phase machine
            pt++;
            if (phase === 0 && pt > 20) {
                phase = 1;
                pt = 0;
            } else if (phase >= 1 && phase <= 3 && pt > HOPF) {
                phase++;
                pt = 0;
            } else if (phase === 4) {
                shown += (salTgt - shown) * 0.12;
                if (pt > 30) {
                    phase = 5;
                    pt = 0;
                    shown = salTgt;
                }
            } else if (phase === 5 && pt > 46) {
                newCycle();
            }
            // HUD
            c.font = "10px 'JetBrains Mono', monospace";
            c.textAlign = "left";
            c.fillStyle = Ab;
            c.fillText("salary_model · predict()", 12, 18);
            c.textAlign = "right";
            c.fillStyle = "rgba(255,217,163,0.8)";
            c.fillText("R² 0.848 · 6,684 records", W - 12, 18);
        }

        layout();
        if (!W) return;
        newCycle();

        if (reduce) {
            // Static frame: completed pass, network fully lit, prediction shown.
            phase = 5;
            shown = salTgt;
            render();
            return;
        }

        let timer: number | null = null;
        const start = () => {
            if (timer == null) timer = window.setInterval(render, 30);
        };
        const stop = () => {
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
        };
        const onResize = () => layout();
        window.addEventListener("resize", onResize);
        render();
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.1 });
        io.observe(wrap);
        return () => {
            stop();
            io.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div className="smod" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .smod { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 55% 35%, #171009, #0e0a07); }
                .smod canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
