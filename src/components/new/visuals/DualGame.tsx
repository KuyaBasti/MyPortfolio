"use client";

import { useEffect, useRef } from "react";

// DUAL! scene visual: two phones side by side as one battlefield. Each player
// flies an independent ship on its own black OLED screen and fires bullets that
// cross the seam into the opponent's screen, either hitting (explode + score)
// or flying off the far edge and vanishing (they never bounce back). The canvas
// loop runs only while on-screen and resolves to a static frame for
// reduced-motion. Game state is client-only, so plain Math.random is SSR-safe.

const P1 = "#28c840",
    P1b = "#9dffc4",
    P2 = "#5ad1ff",
    P2b = "#bfeeff";

type Ship = { x: number; y: number; tx: number; ty: number; re: number; fire: number; ang: number; hit: number; score: number };
type Bullet = { x: number; y: number; vx: number; vy: number; o: number; trail: number[][] };
type Part = { x: number; y: number; vx: number; vy: number; life: number; col: string };

export default function DualGame() {
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
            sw = 0,
            sh = 0,
            Lx = 0,
            Rx = 0,
            sy = 0,
            placed = false;

        const s1: Ship = { x: 0, y: 0, tx: 0, ty: 0, re: 0, fire: 30, ang: 0, hit: 0, score: 0 };
        const s2: Ship = { x: 0, y: 0, tx: 0, ty: 0, re: 0, fire: 70, ang: Math.PI, hit: 0, score: 0 };
        let bullets: Bullet[] = [];
        let parts: Part[] = [];

        const rnd = (a: number, b: number) => a + Math.random() * (b - a);

        function rr(x: number, y: number, w: number, h: number, r: number) {
            ctx!.beginPath();
            ctx!.moveTo(x + r, y);
            ctx!.arcTo(x + w, y, x + w, y + h, r);
            ctx!.arcTo(x + w, y + h, x, y + h, r);
            ctx!.arcTo(x, y + h, x, y, r);
            ctx!.arcTo(x, y, x + w, y, r);
            ctx!.closePath();
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
            sy = 24;
            sh = H - 46;
            sw = Math.min(168, Math.floor((W - 48) / 2) - 40);
            const total = sw * 2 + 48;
            Lx = Math.round((W - total) / 2);
            Rx = Lx + sw + 48;
            if (!placed) {
                s1.x = s1.tx = Lx + sw * 0.4;
                s1.y = s1.ty = sy + sh * 0.4;
                s2.x = s2.tx = Rx + sw * 0.6;
                s2.y = s2.ty = sy + sh * 0.6;
                placed = true;
            }
        }

        function drawScreen(x: number) {
            const c = ctx!;
            c.save();
            rr(x, sy, sw, sh, 12);
            c.fillStyle = "#03070a";
            c.fill();
            c.lineWidth = 1.5;
            c.strokeStyle = "rgba(255,255,255,0.10)";
            c.stroke();
            c.clip();
            c.fillStyle = "rgba(120,200,160,0.045)";
            for (let gx = x + 6; gx < x + sw; gx += 7) for (let gy = sy + 6; gy < sy + sh; gy += 7) c.fillRect(gx, gy, 1, 1);
            c.restore();
        }

        function drawShip(s: Ship, col: string, glow: string) {
            const c = ctx!;
            c.save();
            c.translate(s.x, s.y);
            c.rotate(s.ang);
            if (s.hit > 0) c.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.hit * 0.6));
            c.fillStyle = col;
            c.shadowColor = glow;
            c.shadowBlur = 10;
            c.beginPath();
            c.moveTo(12, 0);
            c.lineTo(-9, -9);
            c.lineTo(-4, 0);
            c.lineTo(-9, 9);
            c.closePath();
            c.fill();
            c.restore();
            c.shadowBlur = 0;
            c.globalAlpha = 1;
        }

        const bounds = (left: boolean) => (left ? { x0: Lx + 22, x1: Lx + sw - 22 } : { x0: Rx + 22, x1: Rx + sw - 22 });

        function moveShip(s: Ship, left: boolean, ease: number) {
            const bn = bounds(left);
            s.re--;
            if (s.re <= 0) {
                s.tx = rnd(bn.x0, bn.x1);
                s.ty = rnd(sy + 24, sy + sh - 24);
                s.re = rnd(34, 70);
            }
            for (let i = 0; i < bullets.length; i++) {
                const bu = bullets[i];
                if (bu.o === (left ? 1 : 0)) {
                    const onMine = left ? bu.x < Lx + sw : bu.x > Rx;
                    if (onMine && Math.abs(bu.y - s.y) < 24) {
                        const ahead = left ? bu.vx < 0 && bu.x > s.x : bu.vx > 0 && bu.x < s.x;
                        if (ahead && Math.abs(bu.x - s.x) < 58 && Math.random() < 0.55) {
                            s.ty = s.y + (bu.y > s.y ? -1 : 1) * rnd(22, 38);
                            s.ty = Math.max(sy + 24, Math.min(sy + sh - 24, s.ty));
                        }
                    }
                }
            }
            s.x += (s.tx - s.x) * ease;
            s.y += (s.ty - s.y) * (ease * 1.15);
            if (s.hit > 0) s.hit--;
        }

        function fire(s: Ship, left: boolean, enemy: Ship) {
            const sp = 4.6,
                dx = enemy.x - s.x,
                dy = enemy.y - s.y,
                d = Math.hypot(dx, dy) || 1;
            const vx = (sp * dx) / d,
                vy = (sp * dy) / d + rnd(-0.9, 0.9);
            s.ang = Math.atan2(dy, dx);
            bullets.push({ x: s.x + (left ? 12 : -12), y: s.y, vx, vy, o: left ? 0 : 1, trail: [] });
        }

        function hitFx(x: number, y: number, col: string) {
            for (let i = 0; i < 11; i++) {
                const a = rnd(0, 6.28),
                    v = rnd(0.6, 3.2);
                parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, col });
            }
        }

        function render() {
            const c = ctx!;
            if (!W) layout();
            if (!W) return;
            c.clearRect(0, 0, W, H);
            drawScreen(Lx);
            drawScreen(Rx);
            moveShip(s1, true, 0.045);
            moveShip(s2, false, 0.055);
            s1.ang = Math.atan2(s2.y - s1.y, s2.x - s1.x);
            s2.ang = Math.atan2(s1.y - s2.y, s1.x - s2.x);
            s1.fire--;
            if (s1.fire <= 0) {
                fire(s1, true, s2);
                s1.fire = rnd(36, 60);
            }
            s2.fire--;
            if (s2.fire <= 0) {
                fire(s2, false, s1);
                s2.fire = rnd(48, 78);
            }
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.x += b.vx;
                b.y += b.vy;
                b.trail.push([b.x, b.y]);
                if (b.trail.length > 7) b.trail.shift();
                const tgt = b.o === 0 ? s2 : s1;
                const col = b.o === 0 ? P1 : P2,
                    colb = b.o === 0 ? P1b : P2b;
                const inEnemy = b.o === 0 ? b.x > Rx : b.x < Lx + sw;
                if (inEnemy && Math.hypot(b.x - tgt.x, b.y - tgt.y) < 13.5) {
                    hitFx(b.x, b.y, colb);
                    tgt.hit = 10;
                    if (b.o === 0) s1.score++;
                    else s2.score++;
                    bullets.splice(i, 1);
                    continue;
                }
                if (b.x < Lx - 14 || b.x > Rx + sw + 14 || b.y < sy - 14 || b.y > sy + sh + 14) {
                    bullets.splice(i, 1);
                    continue;
                }
                for (let t = 0; t < b.trail.length; t++) {
                    const al = t / b.trail.length;
                    c.globalAlpha = al * 0.5;
                    c.fillStyle = col;
                    c.beginPath();
                    c.arc(b.trail[t][0], b.trail[t][1], 1.6 * al + 0.4, 0, 6.28);
                    c.fill();
                }
                c.globalAlpha = 1;
                c.shadowColor = colb;
                c.shadowBlur = 10;
                c.fillStyle = "#fff";
                c.beginPath();
                c.arc(b.x, b.y, 2.7, 0, 6.28);
                c.fill();
                c.shadowBlur = 0;
            }
            for (let i = parts.length - 1; i >= 0; i--) {
                const p = parts[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.92;
                p.vy *= 0.92;
                p.life -= 0.045;
                if (p.life <= 0) {
                    parts.splice(i, 1);
                    continue;
                }
                c.globalAlpha = p.life;
                c.fillStyle = p.col;
                c.beginPath();
                c.arc(p.x, p.y, p.life * 2.4, 0, 6.28);
                c.fill();
            }
            c.globalAlpha = 1;
            drawShip(s1, P1, P1b);
            drawShip(s2, P2, P2b);
            c.font = "700 13px 'JetBrains Mono', monospace";
            c.textAlign = "center";
            c.fillStyle = P1;
            c.fillText("P1 " + ("0" + s1.score).slice(-2), Lx + sw / 2, sy - 8);
            c.fillStyle = P2;
            c.fillText(("0" + s2.score).slice(-2) + " P2", Rx + sw / 2, sy - 8);
        }

        layout();

        if (reduce) {
            // Static frame: ships facing each other, one bullet mid-crossing.
            s1.x = Lx + 40;
            s1.y = sy + sh - 40;
            s2.x = Rx + sw - 40;
            s2.y = sy + 40;
            s1.ang = Math.atan2(s2.y - s1.y, s2.x - s1.x);
            s2.ang = Math.atan2(s1.y - s2.y, s1.x - s2.x);
            bullets = [{ x: (Lx + sw + Rx) / 2, y: sy + sh * 0.5, vx: 4.6, vy: 0, o: 0, trail: [] }];
            parts = [];
            // draw once without the score/dynamics churn
            ctx.clearRect(0, 0, W, H);
            drawScreen(Lx);
            drawScreen(Rx);
            const b = bullets[0];
            ctx.shadowColor = P1b;
            ctx.shadowBlur = 10;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(b.x, b.y, 2.7, 0, 6.28);
            ctx.fill();
            ctx.shadowBlur = 0;
            drawShip(s1, P1, P1b);
            drawShip(s2, P2, P2b);
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
        <div className="dgame" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .dgame { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 50% 50%, #0c1018, #080b12); }
                .dgame canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
