"use client";

import { useEffect, useRef } from "react";

// Aggie Reminder scene visual: the reminder pipeline end to end. A postgres
// shifts table on the left, a cron node in the middle that ticks (SELECT ...
// WHERE due < 24h), and a SendGrid panel on the right. Due rows highlight,
// envelopes arc through the cron node (pausing while "processed"), each mail
// lands as queued then flips to a green 202 with the volunteer's address, and
// the row's reminded column turns true. When everyone is covered, a fresh
// roster is INSERTed row by row and the loop repeats. The scene is drawn in
// logical 680x240 coordinates and scaled to fit the card, runs only while
// on-screen, and resolves to a mid-batch static frame for reduced-motion.

const R = "#ff5f80",
    Rb = "#ffd0da",
    G = "#3dff8a",
    Am = "#ffb84d";
const LW = 680,
    LH = 240; // logical scene size
const TBR = 270,
    SGX = 414,
    CRX = 336,
    CRY = 118;

type Row = { name: string; time: string; st: 0 | 1 | 2; born: number };
type Mail = { row: number; p: number; trail: number[][] };
type Log = { to: string; t: number };

const BATCHES: [string, string][][] = [
    [
        ["maria", "Sat 09:00"],
        ["james", "Sat 12:00"],
        ["aisha", "Sun 10:00"],
        ["kevin", "Sun 14:00"],
        ["sofia", "Mon 08:30"],
        ["derek", "Mon 17:00"],
    ],
    [
        ["lena", "Tue 09:00"],
        ["omar", "Tue 13:00"],
        ["priya", "Wed 10:00"],
        ["alex", "Wed 15:30"],
        ["jade", "Thu 08:00"],
        ["theo", "Thu 18:00"],
    ],
];

export default function AggiePipeline() {
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
        let bi = -1,
            rows: Row[] = [],
            inserting = 0,
            mails: Mail[] = [],
            logs: Log[] = [],
            tickIn = 70,
            hand = 0,
            pulse = 0,
            sqlT = 0,
            hold = 0,
            fr = 0;

        function reset() {
            bi = (bi + 1) % BATCHES.length;
            rows = [];
            inserting = 0;
            logs = [];
            mails = [];
            tickIn = 85;
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
            const s = Math.min(W / LW, H / LH);
            ctx!.setTransform(dpr * s, 0, 0, dpr * s, (dpr * (W - LW * s)) / 2, (dpr * (H - LH * s)) / 2);
        }

        const rowY = (i: number) => 66 + i * 27;
        const qbez = (p0: number[], p1: number[], p2: number[], t: number): number[] => {
            const u = 1 - t;
            return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
        };

        function envelope(px: number, py: number, s = 1) {
            const c = ctx!;
            c.fillStyle = "rgba(23,13,17,0.95)";
            c.strokeStyle = R;
            c.lineWidth = 1;
            c.shadowColor = R;
            c.shadowBlur = 8;
            c.beginPath();
            c.roundRect(px - 9 * s, py - 6 * s, 18 * s, 12 * s, 2.5);
            c.fill();
            c.stroke();
            c.shadowBlur = 0;
            c.strokeStyle = "rgba(255,208,218,0.8)";
            c.beginPath();
            c.moveTo(px - 9 * s, py - 6 * s);
            c.lineTo(px, py + 1 * s);
            c.lineTo(px + 9 * s, py - 6 * s);
            c.stroke();
        }

        function arrow(x0: number, y0: number, x1: number, y1: number) {
            const c = ctx!;
            c.setLineDash([3, 5]);
            c.strokeStyle = "rgba(255,95,128,0.18)";
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(x0, y0);
            c.lineTo(x1, y1);
            c.stroke();
            c.setLineDash([]);
            const a = Math.atan2(y1 - y0, x1 - x0);
            c.fillStyle = "rgba(255,95,128,0.3)";
            c.beginPath();
            c.moveTo(x1, y1);
            c.lineTo(x1 - 6 * Math.cos(a - 0.4), y1 - 6 * Math.sin(a - 0.4));
            c.lineTo(x1 - 6 * Math.cos(a + 0.4), y1 - 6 * Math.sin(a + 0.4));
            c.closePath();
            c.fill();
        }

        function render() {
            const c = ctx!;
            if (!W) layout();
            if (!W) return;
            c.clearRect(-40, -40, LW + 80, LH + 80);
            fr++;
            const batch = BATCHES[bi];
            if (rows.length < batch.length && --inserting <= 0) {
                inserting = 7;
                rows.push({ name: batch[rows.length][0], time: batch[rows.length][1], st: 0, born: fr });
            }
            arrow(TBR + 8, CRY, CRX - 32, CRY);
            arrow(CRX + 32, CRY, SGX - 8, CRY);
            // shifts table
            c.font = "10px 'JetBrains Mono', monospace";
            c.textAlign = "left";
            c.fillStyle = "rgba(255,95,128,0.85)";
            c.fillText("postgres · shifts", 14, 20);
            c.strokeStyle = "rgba(255,255,255,0.10)";
            c.lineWidth = 1;
            c.beginPath();
            c.roundRect(12.5, 32.5, 258, 190, 10);
            c.stroke();
            c.fillStyle = "rgba(154,160,168,0.6)";
            c.font = "8px 'JetBrains Mono', monospace";
            c.fillText("volunteer", 24, 50);
            c.fillText("starts_at", 118, 50);
            c.fillText("reminded", 204, 50);
            c.strokeStyle = "rgba(255,255,255,0.07)";
            c.beginPath();
            c.moveTo(20, 56.5);
            c.lineTo(264, 56.5);
            c.stroke();
            for (let i = 0; i < rows.length; i++) {
                const r = rows[i],
                    y = rowY(i),
                    age = fr - r.born;
                if (age < 14) {
                    c.fillStyle = "rgba(255,95,128," + 0.28 * (1 - age / 14) + ")";
                    c.beginPath();
                    c.roundRect(18, y - 13, 246, 22, 5);
                    c.fill();
                }
                if (r.st === 1) {
                    c.fillStyle = "rgba(255,95,128,0.12)";
                    c.beginPath();
                    c.roundRect(18, y - 13, 246, 22, 5);
                    c.fill();
                }
                c.font = "9px 'JetBrains Mono', monospace";
                c.fillStyle = r.st === 1 ? Rb : "rgba(230,232,238,0.85)";
                c.fillText(r.name, 24, y + 2);
                c.fillStyle = "rgba(154,160,168,0.85)";
                c.fillText(r.time, 118, y + 2);
                if (r.st === 2) {
                    c.fillStyle = G;
                    c.fillText("✓ true", 204, y + 2);
                } else {
                    c.fillStyle = "rgba(107,114,128,0.8)";
                    c.fillText("false", 204, y + 2);
                }
            }
            // cron node
            c.strokeStyle = "rgba(255,95,128,0.6)";
            c.lineWidth = 1.4;
            if (pulse > 0) {
                c.globalAlpha = pulse / 14;
                c.beginPath();
                c.arc(CRX, CRY, 24 + (14 - pulse) * 1.6, 0, 6.28);
                c.stroke();
                c.globalAlpha = 1;
                pulse--;
            }
            const holding = mails.some((m) => m.p >= 0.45 && m.p < 0.6);
            c.fillStyle = "rgba(20,10,14,0.95)";
            c.strokeStyle = pulse > 0 || holding ? R : "rgba(255,95,128,0.5)";
            c.shadowColor = R;
            c.shadowBlur = pulse > 0 || holding ? 14 : 5;
            c.beginPath();
            c.arc(CRX, CRY, 22, 0, 6.28);
            c.fill();
            c.stroke();
            c.shadowBlur = 0;
            hand += 0.045;
            c.strokeStyle = Rb;
            c.lineWidth = 1.6;
            c.beginPath();
            c.moveTo(CRX, CRY);
            c.lineTo(CRX + Math.cos(hand) * 13, CRY + Math.sin(hand) * 13);
            c.stroke();
            c.beginPath();
            c.moveTo(CRX, CRY);
            c.lineTo(CRX + Math.cos(hand * 0.08) * 8, CRY + Math.sin(hand * 0.08) * 8);
            c.stroke();
            c.font = "8px 'JetBrains Mono', monospace";
            c.textAlign = "center";
            c.fillStyle = "rgba(154,160,168,0.85)";
            c.fillText("cron · */15m", CRX, CRY + 38);
            if (hold === 0 && rows.length === 6) {
                c.fillStyle = "rgba(255,184,77,0.75)";
                c.fillText("next tick · " + Math.max(0, Math.ceil(tickIn / 33)) + "s", CRX, CRY + 50);
            }
            if (sqlT > 0) {
                sqlT--;
                c.globalAlpha = Math.min(1, sqlT / 10);
                c.fillStyle = "rgba(20,10,14,0.95)";
                c.strokeStyle = "rgba(255,184,77,0.6)";
                c.lineWidth = 1;
                c.beginPath();
                c.roundRect(CRX - 74, CRY - 62, 148, 18, 9);
                c.fill();
                c.stroke();
                c.fillStyle = Am;
                c.fillText("SELECT … WHERE due < 24h", CRX, CRY - 50);
                c.globalAlpha = 1;
            }
            // tick
            if (hold > 0) {
                hold--;
                if (hold === 0) reset();
            } else if (rows.length === 6 && --tickIn <= 0) {
                tickIn = 110;
                pulse = 14;
                sqlT = 44;
                rows
                    .filter((r) => r.st === 0)
                    .slice(0, 2)
                    .forEach((r, k) => {
                        r.st = 1;
                        mails.push({ row: rows.indexOf(r), p: -k * 0.16, trail: [] });
                    });
            }
            // envelopes
            for (let i = mails.length - 1; i >= 0; i--) {
                const m = mails[i];
                m.p += 0.016;
                if (m.p < 0) continue;
                const y0 = rowY(m.row);
                let pos: number[],
                    sc = 1;
                if (m.p < 0.45) pos = qbez([TBR, y0], [(TBR + CRX) / 2, Math.min(y0, CRY) - 26], [CRX - 24, CRY], m.p / 0.45);
                else if (m.p < 0.6) {
                    pos = [CRX - 24 + ((m.p - 0.45) / 0.15) * 24, CRY];
                    sc = 0.72;
                } else {
                    const ly = 74 + logs.length * 26;
                    pos = qbez([CRX + 22, CRY], [(CRX + SGX + 30) / 2, Math.min(CRY, ly) - 24], [SGX + 14, ly], (m.p - 0.6) / 0.4);
                }
                m.trail.push(pos);
                if (m.trail.length > 6) m.trail.shift();
                for (let t = 0; t < m.trail.length; t++) {
                    c.globalAlpha = (t / m.trail.length) * 0.3;
                    c.fillStyle = R;
                    c.beginPath();
                    c.arc(m.trail[t][0], m.trail[t][1], 1.6, 0, 6.28);
                    c.fill();
                }
                c.globalAlpha = 1;
                envelope(pos[0], pos[1], sc);
                if (m.p >= 1) {
                    rows[m.row].st = 2;
                    logs.push({ to: rows[m.row].name + "@ucdavis.edu", t: 0 });
                    if (logs.length > 6) logs.shift();
                    mails.splice(i, 1);
                    if (rows.length === 6 && rows.every((r) => r.st === 2)) hold = 76;
                }
            }
            // SendGrid panel
            c.textAlign = "left";
            c.font = "10px 'JetBrains Mono', monospace";
            c.fillStyle = "rgba(255,95,128,0.85)";
            c.fillText("sendgrid", 420, 20);
            c.strokeStyle = "rgba(255,255,255,0.10)";
            c.beginPath();
            c.roundRect(414.5, 32.5, LW - 14 - 414, 190, 10);
            c.stroke();
            c.font = "8px 'JetBrains Mono', monospace";
            for (let i = 0; i < logs.length; i++) {
                const lg = logs[i],
                    y = 58 + i * 26;
                lg.t++;
                c.fillStyle = "rgba(154,160,168,0.75)";
                c.fillText("POST /v3/mail/send", 424, y);
                if (lg.t <= 10) {
                    c.fillStyle = Am;
                    c.fillText("→ queued", 424, y + 11);
                } else {
                    c.fillStyle = G;
                    if (lg.t < 18) {
                        c.shadowColor = G;
                        c.shadowBlur = 6;
                    }
                    c.fillText("202 ✓ " + lg.to, 424, y + 11);
                    c.shadowBlur = 0;
                }
            }
            // HUD
            c.font = "10px 'JetBrains Mono', monospace";
            c.textAlign = "right";
            const sent = rows.filter((r) => r.st === 2).length;
            c.fillStyle = hold > 0 ? G : "rgba(255,208,218,0.8)";
            c.fillText(hold > 0 ? "all volunteers reminded ✓" : "reminded " + sent + "/6", LW - 14, LH - 10);
        }

        layout();
        if (!W) return;
        reset();

        if (reduce) {
            // Static mid-batch frame: two delivered, two highlighted, one at cron.
            const batch = BATCHES[bi];
            rows = batch.map((b, i) => ({ name: b[0], time: b[1], st: (i < 2 ? 2 : i < 4 ? 1 : 0) as 0 | 1 | 2, born: -99 }));
            logs = [
                { to: rows[0].name + "@ucdavis.edu", t: 30 },
                { to: rows[1].name + "@ucdavis.edu", t: 30 },
            ];
            mails = [{ row: 2, p: 0.5, trail: [] }];
            sqlT = 30;
            tickIn = 90;
            render();
            mails = [];
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
        <div className="agp" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .agp { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 45% 30%, #170d12, #0d080b); }
                .agp canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
