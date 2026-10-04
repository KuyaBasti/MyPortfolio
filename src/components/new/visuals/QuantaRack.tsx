"use client";

import { useEffect, useRef } from "react";

// Quanta scene visual: four racks running the L11 validation pipeline. Units
// live a lifecycle (dark, PXE boot amber, testing cyan, pass green); a
// completed rack flashes, ships out, and bumps the monthly counter. Every so
// often a unit fails red mid-test and a console chip root-causes it (the
// escalation-point story) before it re-boots and passes. The loop runs only
// while on-screen and resolves to a mid-shift static frame for
// reduced-motion. All state is canvas-only and client-side, so SSR-safe.

const G = "#34c759",
    Am = "#ffb340",
    Cy = "#5ad1ff",
    Rd = "#ff5f57",
    DK = "#232b35";

const LOGS = [
    "[bash] rsync diag · verify ok",
    "[bash] sync → peer PXE ok",
    "[ipxe] MAC redirect · 1 tray",
    "[pxe] lock-out · control run",
    "[nvsw] interconnect test ok",
];

type Unit = { st: 0 | 1 | 2 | 3 | 4; t: number; dur: number; failed?: boolean };
type Rack = { units: Unit[]; idx: number; done: number; wait: number; fade: number; glowAll: number };
type Chip = { ri: number; ui: number; t: number; txt: string };

export default function QuantaRack() {
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
            H = 0,
            fr = 0,
            counter = 286,
            logi = 0;
        let chip: Chip | null = null;
        const racks: Rack[] = [];

        function newRack(stagger: number): Rack {
            const units: Unit[] = [];
            for (let i = 0; i < 9; i++) units.push({ st: 0, t: 0, dur: 0 });
            return { units, idx: 0, done: 0, wait: stagger, fade: 1, glowAll: 0 };
        }

        function seedShift() {
            for (let r = 0; r < 4; r++) {
                const rk = newRack(r * 70);
                for (let k = 0; k < r * 2; k++) rk.units[k].st = 3;
                rk.idx = r * 2;
                racks.push(rk);
            }
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
        }

        function stepRack(rk: Rack, ri: number) {
            if (rk.done > 0) {
                rk.done--;
                if (rk.done === 40) rk.glowAll = 1;
                if (rk.done < 20) rk.fade = rk.done / 20;
                if (rk.done === 0) {
                    racks[ri] = newRack(30);
                    counter++;
                }
                return;
            }
            if (rk.wait > 0) {
                rk.wait--;
                return;
            }
            const u = rk.units[rk.idx];
            if (!u) {
                rk.done = 70;
                rk.glowAll = 0;
                return;
            }
            u.t++;
            if (u.st === 0) {
                u.st = 1;
                u.dur = 18 + Math.random() * 14;
                u.t = 0;
            } else if (u.st === 1 && u.t > u.dur) {
                u.st = 2;
                u.dur = 45 + Math.random() * 40;
                u.t = 0;
            } else if (u.st === 2 && u.t > u.dur) {
                if (!u.failed && Math.random() < 0.09 && !chip) {
                    u.st = 4;
                    u.failed = true;
                    u.t = 0;
                    u.dur = 55;
                    chip = {
                        ri,
                        ui: rk.idx,
                        t: 75,
                        txt: "u0" + (rk.idx + 1) + ": " + (Math.random() < 0.5 ? "no PXE offer · power-cycle" : "nvsw fw mismatch · flagged"),
                    };
                } else {
                    u.st = 3;
                    rk.idx++;
                    rk.wait = 6 + Math.random() * 10;
                }
            } else if (u.st === 4 && u.t > u.dur) {
                u.st = 1;
                u.dur = 16;
                u.t = 0;
            }
        }

        function ledCol(u: Unit): [string, number] {
            if (u.st === 0) return [DK, 0];
            if (u.st === 1) return [(fr >> 2) % 2 ? Am : "#7a5a24", 0.6];
            if (u.st === 2) return [Cy, 0.5 + 0.4 * Math.abs(Math.sin(fr * 0.15 + u.dur))];
            if (u.st === 3) return [G, 0.9];
            return [(fr >> 2) % 2 ? Rd : "#7a2a26", 1];
        }

        function render(advance: boolean) {
            const c = ctx!;
            if (!W) layout();
            if (!W) return;
            fr++;
            c.clearRect(0, 0, W, H);
            const g = c.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, "#05070a");
            g.addColorStop(1, "#070b10");
            c.fillStyle = g;
            c.fillRect(0, 0, W, H);
            c.fillStyle = "rgba(46,255,160,0.5)";
            c.fillRect(W * 0.28, 4, 70, 4);
            c.fillRect(W * 0.58, 4, 70, 4);

            const rw = (W - 44 - 3 * 12) / 4;
            for (let ri = 0; ri < 4; ri++) {
                const rk = racks[ri];
                if (advance) stepRack(rk, ri);
                const x = 22 + ri * (rw + 12),
                    y = 30,
                    h = H - 70;
                c.globalAlpha = rk.fade;
                c.fillStyle = "#0d1218";
                c.strokeStyle = rk.glowAll ? G : "rgba(255,255,255,0.08)";
                c.lineWidth = rk.glowAll ? 1.6 : 1;
                if (rk.glowAll) {
                    c.shadowColor = G;
                    c.shadowBlur = 14;
                }
                c.beginPath();
                c.roundRect(x, y, rw, h, 6);
                c.fill();
                c.stroke();
                c.shadowBlur = 0;

                const uh = (h - 10) / 9;
                for (let ui = 0; ui < 9; ui++) {
                    const u = rk.units[ui],
                        uy = y + 5 + ui * uh;
                    c.fillStyle =
                        u.st === 2 ? "rgba(90,209,255,0.07)" : u.st === 3 ? "rgba(52,199,89,0.06)" : "rgba(255,255,255,0.02)";
                    c.beginPath();
                    c.roundRect(x + 4, uy, rw - 8, uh - 3, 2);
                    c.fill();
                    c.fillStyle = "rgba(255,255,255,0.05)";
                    for (let v = 0; v < Math.floor((rw - 30) / 4); v++)
                        c.fillRect(x + 8 + v * 4, uy + uh * 0.32, 1.5, uh * 0.36);
                    const lc = ledCol(u);
                    for (let li = 0; li < 3; li++) {
                        const col =
                            li === 0 ? lc[0] : u.st === 3 ? G : u.st === 0 ? DK : li === 1 && u.st === 2 ? Cy : DK;
                        c.fillStyle = col;
                        if (lc[1] > 0 && li === 0) {
                            c.shadowColor = lc[0];
                            c.shadowBlur = 6 * lc[1];
                        }
                        c.beginPath();
                        c.arc(x + rw - 9 - li * 7, uy + uh / 2 - 1.5, 2, 0, 6.28);
                        c.fill();
                        c.shadowBlur = 0;
                    }
                    if (u.st === 1) {
                        c.font = "7px 'JetBrains Mono', monospace";
                        c.fillStyle = Am;
                        c.textAlign = "left";
                        c.fillText("PXE", x + 8, uy + uh * 0.28);
                    }
                }
                c.globalAlpha = 1;
            }

            if (chip) {
                chip.t--;
                const x = 22 + chip.ri * (rw + 12),
                    y = 30 + 5 + chip.ui * ((H - 70 - 10) / 9);
                const cw = 178;
                let cx2 = Math.min(W - cw - 8, x + rw + 6);
                if (chip.ri >= 2) cx2 = x - cw - 6;
                const cy2 = Math.max(8, y - 6);
                c.globalAlpha = Math.min(1, chip.t / 12);
                c.fillStyle = "rgba(10,14,20,0.95)";
                c.strokeStyle = "rgba(255,95,87,0.6)";
                c.lineWidth = 1;
                c.beginPath();
                c.roundRect(cx2, cy2, cw, 20, 6);
                c.fill();
                c.stroke();
                c.font = "9px 'JetBrains Mono', monospace";
                c.fillStyle = "#ffb3ae";
                c.textAlign = "left";
                c.fillText(chip.txt, cx2 + 9, cy2 + 13);
                c.globalAlpha = 1;
                if (chip.t <= 0) chip = null;
            }

            c.font = "10px 'JetBrains Mono', monospace";
            c.textAlign = "left";
            c.fillStyle = "rgba(157,255,196,0.8)";
            c.fillText("L11 · rack validation", 14, 19);
            c.textAlign = "right";
            c.fillStyle = "rgba(230,232,238,0.75)";
            c.fillText("racks " + counter + "/400 · mo", W - 14, 19);
            if (fr % 160 === 0) logi = (logi + 1) % LOGS.length;
            c.textAlign = "left";
            c.fillStyle = "rgba(150,170,160,0.6)";
            c.fillText(LOGS[logi], 14, H - 12);
            c.textAlign = "right";
            c.fillStyle = "rgba(150,170,160,0.45)";
            c.fillText("GB200/GB300", W - 14, H - 12);
        }

        layout();
        seedShift();
        if (!W) return;

        if (reduce) {
            // Static mid-shift frame: passes banked, one unit booting, one testing.
            racks[0].units[3].st = 1;
            racks[0].units[3].dur = 20;
            racks[1].units[4].st = 2;
            racks[1].units[4].dur = 60;
            fr = 3; // steady lit branches for flicker-based colors
            render(false);
            return;
        }

        let timer: number | null = null;
        const start = () => {
            if (timer == null) timer = window.setInterval(() => render(true), 30);
        };
        const stop = () => {
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
        };
        const onResize = () => layout();
        window.addEventListener("resize", onResize);
        render(true);
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 });
        io.observe(wrap);
        return () => {
            stop();
            io.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div className="qrk" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .qrk { position: absolute; inset: 0; overflow: hidden;
                       background: radial-gradient(ellipse at 50% 120%, rgba(40,90,70,0.18), transparent 60%), linear-gradient(180deg, #05070a, #070b10); }
                .qrk canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
