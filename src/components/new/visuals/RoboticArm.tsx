"use client";

import { useEffect, useRef } from "react";

// Robotic Arm scene visual: a serial console streaming a G-code program while
// a 2-link arm plots it. The left panel echoes each waypoint as an RS-232
// command with an "ok" ack; the right side shows the arm tracing the star
// toolpath via inverse kinematics, with live joint angles. The IK uses one
// fixed elbow branch so the arm can never flip solutions mid-motion. The
// canvas loop runs only while on-screen and resolves to a static completed
// frame for reduced-motion. Game state is client-only, so SSR-safe.

const V = "#bf5af2",
    Vb = "#e6b8ff",
    P = "#ff6680",
    G = "#9dffc4";

type LogLine = { t: "c" | "o"; s: string };

export default function RoboticArm() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const cv = cvRef.current;
        if (!wrap || !cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const L1 = 104,
            L2 = 92,
            TW = 170,
            feed = 1.6;
        let W = 0,
            H = 0,
            bx = 0,
            by = 0;
        let path: number[][] = [];
        let seg = 0,
            px = 0,
            py = 0,
            done = 0,
            fr = 0,
            rx = 0;
        let traced: number[][] = [];
        let log: LogLine[] = [];

        function star(cx: number, cy: number, ro: number, ri: number) {
            const p: number[][] = [];
            for (let i = 0; i < 10; i++) {
                const a = -Math.PI / 2 + (i * Math.PI) / 5,
                    r = i % 2 ? ri : ro;
                p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
            }
            p.push([p[0][0], p[0][1]]);
            return p;
        }
        const mm = (x: number, y: number) => "X" + ((x - bx) * 0.6).toFixed(1) + " Y" + ((by - y) * 0.6).toFixed(1);
        const trim = () => {
            if (log.length > 26) log = log.slice(-26);
        };
        function pushSeg() {
            const p = path[seg + 1];
            log.push({ t: "c", s: "N" + (seg + 2) * 10 + " G1 " + mm(p[0], p[1]) });
            trim();
        }
        function progStart() {
            traced = [];
            seg = 0;
            px = path[0][0];
            py = path[0][1];
            log.push({ t: "c", s: "N10 G0 " + mm(px, py) });
            log.push({ t: "o", s: "ok" });
            pushSeg();
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
            by = H - 8;
            const cx = TW + (W - TW) * 0.5;
            bx = cx;
            path = star(cx, 98, 40, 16);
        }

        // fixed elbow branch: continuous by construction, can never flip sides
        function ik(x: number, y: number) {
            const dx = x - bx,
                dy = y - by;
            let d = Math.hypot(dx, dy);
            const mn = Math.abs(L1 - L2) + 2,
                mx = L1 + L2 - 2;
            d = Math.max(mn, Math.min(mx, d));
            const base = Math.atan2(dy, dx);
            let c2 = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2);
            c2 = Math.max(-1, Math.min(1, c2));
            const e = -Math.acos(c2);
            const k = Math.atan2(L2 * Math.sin(e), L1 + L2 * Math.cos(e)),
                a1 = base - k;
            return [a1, e, bx + L1 * Math.cos(a1), by + L1 * Math.sin(a1)];
        }

        function step() {
            if (done > 0) {
                done--;
                if (done === 0) progStart();
                return;
            }
            const tx = path[seg + 1][0],
                ty = path[seg + 1][1],
                dx = tx - px,
                dy = ty - py,
                d = Math.hypot(dx, dy);
            if (d <= feed) {
                px = tx;
                py = ty;
                log.push({ t: "o", s: "ok" });
                rx = 6;
                seg++;
                if (seg >= path.length - 1) {
                    log.push({ t: "c", s: "M30" });
                    log.push({ t: "o", s: "ok" });
                    trim();
                    done = 60;
                } else pushSeg();
            } else {
                px += (dx / d) * feed;
                py += (dy / d) * feed;
            }
            traced.push([px, py]);
        }

        function seg3(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
            ctx!.beginPath();
            ctx!.moveTo(x1, y1);
            ctx!.lineTo(x2, y2);
            ctx!.lineTo(x3, y3);
            ctx!.stroke();
        }

        function draw() {
            const c = ctx!;
            c.clearRect(0, 0, W, H);
            fr++;
            // work surface dots
            c.fillStyle = "rgba(191,90,242,0.055)";
            for (let gx = TW + 14; gx < W - 8; gx += 20) for (let gy = 14; gy < H - 14; gy += 20) c.fillRect(gx, gy, 1.4, 1.4);
            // toolpath preview
            c.setLineDash([3, 5]);
            c.strokeStyle = "rgba(191,90,242,0.3)";
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(path[0][0], path[0][1]);
            for (let i = 1; i < path.length; i++) c.lineTo(path[i][0], path[i][1]);
            c.stroke();
            c.setLineDash([]);
            // traced path
            if (traced.length > 1) {
                c.strokeStyle = P;
                c.shadowColor = P;
                c.shadowBlur = 8;
                c.lineWidth = 1.8;
                c.beginPath();
                c.moveTo(traced[0][0], traced[0][1]);
                for (let i = 1; i < traced.length; i++) c.lineTo(traced[i][0], traced[i][1]);
                c.stroke();
                c.shadowBlur = 0;
            }
            // active waypoint marker
            if (done === 0) {
                const wp = path[seg + 1];
                c.strokeStyle = "rgba(255,102,128,0.7)";
                c.lineWidth = 1.2;
                c.beginPath();
                c.moveTo(wp[0] - 6, wp[1]);
                c.lineTo(wp[0] + 6, wp[1]);
                c.moveTo(wp[0], wp[1] - 6);
                c.lineTo(wp[0], wp[1] + 6);
                c.stroke();
            }
            // arm
            const s = ik(px, py),
                elx = s[2],
                ely = s[3];
            const wx = elx + L2 * Math.cos(s[0] + s[1]),
                wy = ely + L2 * Math.sin(s[0] + s[1]);
            c.fillStyle = "#1a1520";
            c.strokeStyle = "rgba(191,90,242,0.5)";
            c.lineWidth = 1.2;
            c.beginPath();
            c.roundRect(bx - 24, by - 7, 48, 12, 4);
            c.fill();
            c.stroke();
            c.lineCap = "round";
            c.strokeStyle = "rgba(0,0,0,0.55)";
            c.lineWidth = 10;
            seg3(bx, by, elx, ely, wx, wy);
            c.strokeStyle = "#4a4f5c";
            c.lineWidth = 7;
            seg3(bx, by, elx, ely, wx, wy);
            c.strokeStyle = "#aab3c2";
            c.lineWidth = 2.4;
            seg3(bx, by, elx, ely, wx, wy);
            for (const j of [
                [bx, by],
                [elx, ely],
            ]) {
                c.fillStyle = "#14121a";
                c.strokeStyle = V;
                c.lineWidth = 1.5;
                c.beginPath();
                c.arc(j[0], j[1], 5.5, 0, 6.28);
                c.fill();
                c.stroke();
                c.fillStyle = Vb;
                c.beginPath();
                c.arc(j[0], j[1], 1.6, 0, 6.28);
                c.fill();
            }
            c.strokeStyle = P;
            c.shadowColor = P;
            c.shadowBlur = done > 0 ? 4 : 12;
            c.lineWidth = 1.7;
            c.beginPath();
            c.arc(wx, wy, 4.6, 0, 6.28);
            c.stroke();
            c.fillStyle = "#fff";
            c.beginPath();
            c.arc(wx, wy, 1.6, 0, 6.28);
            c.fill();
            c.shadowBlur = 0;
            // θ readout
            c.font = "9px 'JetBrains Mono', monospace";
            c.textAlign = "right";
            c.fillStyle = "rgba(230,184,255,0.7)";
            c.fillText("θ1 " + (s[0] * 57.3).toFixed(1) + "°  θ2 " + (s[1] * 57.3).toFixed(1) + "°", W - 12, 18);
            if (done > 0) {
                c.fillStyle = P;
                c.fillText("M30 · program end", W - 12, H - 12);
            }
            // serial terminal
            c.fillStyle = "rgba(5,7,11,0.92)";
            c.fillRect(0, 0, TW, H);
            c.strokeStyle = "rgba(191,90,242,0.25)";
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(TW + 0.5, 0);
            c.lineTo(TW + 0.5, H);
            c.stroke();
            c.fillStyle = "rgba(191,90,242,0.10)";
            c.fillRect(0, 0, TW, 24);
            c.textAlign = "left";
            c.fillStyle = Vb;
            c.fillText("/dev/ttyS0 · 115200", 10, 15);
            const txOn = done === 0 && (fr >> 2) % 2,
                rxOn = rx > 0;
            if (rx > 0) rx--;
            c.fillStyle = txOn ? P : "rgba(255,102,128,0.18)";
            c.beginPath();
            c.arc(TW - 30, 12, 3, 0, 6.28);
            c.fill();
            c.fillStyle = rxOn ? G : "rgba(157,255,196,0.15)";
            c.beginPath();
            c.arc(TW - 12, 12, 3, 0, 6.28);
            c.fill();
            const lines = log.slice(-14),
                y0 = H - 14 - (lines.length - 1) * 14;
            for (let i = 0; i < lines.length; i++) {
                const ln = lines[i],
                    yy = y0 + i * 14;
                if (yy < 38) continue;
                if (ln.t === "c") {
                    c.fillStyle = i >= lines.length - 2 ? Vb : "rgba(230,184,255,0.55)";
                    c.fillText("> " + ln.s, 10, yy);
                } else {
                    c.fillStyle = "rgba(157,255,196,0.7)";
                    c.fillText("ok", 24, yy);
                }
            }
            if ((fr >> 4) % 2) {
                c.fillStyle = Vb;
                c.fillText("▮", 10, Math.min(H - 12, y0 + lines.length * 14));
            }
        }

        layout();
        if (!W) return;
        progStart();

        if (reduce) {
            // Static frame: completed star, arm parked at the start vertex.
            traced = path.map((p) => [p[0], p[1]]);
            px = path[0][0];
            py = path[0][1];
            for (let i = 1; i < path.length; i++) {
                log.push({ t: "o", s: "ok" });
                if (i < path.length - 1) log.push({ t: "c", s: "N" + (i + 1) * 10 + " G1 " + mm(path[i][0], path[i][1]) });
            }
            log.push({ t: "c", s: "M30" });
            log.push({ t: "o", s: "ok" });
            trim();
            done = 60;
            fr = 15; // cursor visible, TX led off
            draw();
            return;
        }

        const render = () => {
            step();
            draw();
        };
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
        const onResize = () => {
            layout();
            if (W) progStart();
        };
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
        <div className="rarm" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .rarm { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 65% 40%, #140e1c, #0b0710); }
                .rarm canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
