"use client";

import { useEffect, useRef } from "react";
import { MATCHES } from "./draftmaster/matches";
import {
    ANCIENT,
    BARRACKS,
    FIGHT,
    OBJECTIVE,
    ROSHAN_PIT,
    STATIC_CLOCK,
    TOWERS,
    aegisAt,
    casualtiesAt,
    clamp,
    fallenAt,
    feedAt,
    heroNetWorthAt,
    heroTags,
    leadSeries,
    markersAt,
    mmss,
    positionsAt,
    sameDraft,
    spreadDots,
    teamName,
    teamNetWorthAt,
    winProb,
    type Match,
    type Side,
} from "./draftmaster/replay";

// DraftMaster card: replays real engine output (three exported sim files) the
// way DraftMaster's own Match Viewer does. Draft chips pop in, then the
// minimap plays the match at the viewer's 120x speed: heroes glide between
// 30 s engine snapshots, fights ring where they happened, structures go dark
// on the side that lost them, and the net-worth lead graph draws with the
// clock. Seed 42 and seed 7 share one draft and end with different winners,
// then a new draft plays. Every frame is a pure function of (match, clock), so
// the reduced-motion frame is simply the render at STATIC_CLOCK.

const RAD = "#4caf6d",
    DIRE = "#e0575f",
    GOLD = "#d9a441",
    INK = "#e6e8ee",
    DEAD = "#5b626c",
    BG = "#05070a";
const TEAM = [RAD, DIRE];

const SPEED = 120; // game seconds per real second (a real viewer speed step)
const DRAFT_F = 62;
const END_F = 88;
const FADE_F = 13;
const PICK_ORDER = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9];

const LANES: [number, number][][] = [
    [[18, 82], [14, 66], [12, 46], [12, 26], [13, 13], [26, 12], [46, 12], [66, 14], [82, 18]],
    [[18, 82], [27, 73], [34, 66], [42, 58], [58, 42], [66, 34], [73, 27], [82, 18]],
    [[18, 82], [34, 86], [54, 88], [74, 88], [87, 87], [88, 74], [88, 54], [86, 34], [82, 18]],
];

type Phase = "draft" | "play" | "end" | "fade";

interface Prepared {
    m: Match;
    tags: string[];
    lead: number[];
    leadMax: number;
    order: number[];
}

function prepare(m: Match): Prepared {
    const lead = leadSeries(m);
    // Stable paint order, never by position: dire under radiant, then by name.
    const order = [...Array(10).keys()].sort((a, b) =>
        a < 5 === b < 5 ? m.heroes[a].localeCompare(m.heroes[b]) : a < 5 ? 1 : -1,
    );
    return { m, tags: heroTags(m.heroes), lead, leadMax: Math.max(3000, ...lead.map(Math.abs)) * 1.1, order };
}

const fmtK = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`);
const easeOutBack = (s: number) => 1 + 2.70158 * (s - 1) ** 3 + 1.70158 * (s - 1) ** 2;

export default function DraftMaster() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const cv = cvRef.current;
        if (!wrap || !cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const MONO = getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() || "'JetBrains Mono', monospace";
        const font = (px: number, weight = 400) => `${weight} ${px}px ${MONO}`;

        const preps = MATCHES.map(prepare);
        let W = 0,
            H = 0,
            S = 0,
            mx = 0,
            my = 0,
            k = 1;
        let terrain: HTMLCanvasElement | null = null;
        let mi = 0,
            phase: Phase = "draft",
            pf = 0,
            clock = 0,
            looped = false;

        function paintTerrain(dpr: number) {
            const t = document.createElement("canvas");
            t.width = Math.round(S * dpr);
            t.height = Math.round(S * dpr);
            const c = t.getContext("2d")!;
            c.setTransform((S * dpr) / 100, 0, 0, (S * dpr) / 100, 0, 0);
            const poly = (pts: number[], fill: string, alpha: number) => {
                c.globalAlpha = alpha;
                c.fillStyle = fill;
                c.beginPath();
                for (let i = 0; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
                c.closePath();
                c.fill();
            };
            poly([0, 0, 100, 0, 100, 100, 0, 100], "#8a9a5b", 0.07);
            poly([0, 8, 92, 100, 0, 100], RAD, 0.11);
            poly([8, 0, 100, 0, 100, 92], DIRE, 0.11);
            poly([0, 6, 6, 0, 100, 94, 94, 100], "#4a90d9", 0.22);
            c.globalAlpha = 0.09;
            c.strokeStyle = INK;
            c.lineWidth = 100 / S;
            c.lineJoin = "round";
            for (const lane of LANES) {
                c.beginPath();
                for (const [x, y] of lane) c.lineTo(x, y);
                c.stroke();
            }
            terrain = t;
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
            // Compact mode centers the map between corner HUD gutters.
            const gut = W < 470 ? 47 : 12;
            S = Math.min(216, W - 2 * gut, H - 24);
            mx = W < 470 ? (W - S) / 2 : 12;
            my = (H - S) / 2;
            k = S / 100;
            paintTerrain(dpr);
        }

        const speedTag = () => (phase === "draft" ? "DRAFT" : phase !== "play" ? "FINAL" : reduce ? "PAUSED" : `${SPEED}x`);
        const X = (u: number) => mx + u * k;
        const Y = (v: number) => my + v * k;

        function step() {
            const m = MATCHES[mi];
            pf++;
            if (phase === "draft" && pf >= DRAFT_F) {
                phase = "play";
                pf = 0;
            } else if (phase === "play") {
                clock = Math.min(m.dur, clock + SPEED * 0.03);
                if (clock >= m.dur) {
                    phase = "end";
                    pf = 0;
                }
            } else if (phase === "end" && pf >= END_F) {
                phase = "fade";
                pf = 0;
            } else if (phase === "fade" && pf >= FADE_F) {
                mi = (mi + 1) % MATCHES.length;
                looped = true;
                phase = "draft";
                pf = 0;
                clock = 0;
            }
        }

        function fit(text: string, maxW: number): string {
            const c = ctx!;
            if (c.measureText(text).width <= maxW) return text;
            let s = text;
            while (s.length > 1 && c.measureText(s + "…").width > maxW) s = s.slice(0, -1);
            return s + "…";
        }

        function chip(x: number, y: number, label: string, color: string) {
            const c = ctx!;
            c.font = font(7.5, 600);
            const w = c.measureText(label).width + 10;
            c.globalAlpha = 0.9;
            c.strokeStyle = color;
            c.lineWidth = 1;
            c.beginPath();
            c.roundRect(x, y, w, 12, 6);
            c.stroke();
            c.fillStyle = color;
            c.textAlign = "left";
            c.fillText(label, x + 5, y + 8.6);
            c.globalAlpha = 1;
            return w;
        }

        function drawMap(p: Prepared, heroAlpha: number) {
            const c = ctx!;
            const { m } = p;
            c.save();
            c.beginPath();
            c.roundRect(mx, my, S, S, 10);
            c.fillStyle = "#080c10";
            c.fill();
            c.clip();
            if (terrain) c.drawImage(terrain, mx, my, S, S);

            const fell = new Map<string, number>();
            for (const f of fallenAt(m, clock)) fell.set(f.structure === 5 ? `${f.side}:5` : `${f.side}:${f.structure}:${f.lane < 0 ? 1 : f.lane}`, f.t);
            const deadness = (key: string) => {
                const t = fell.get(key);
                return t === undefined ? 0 : reduce ? 1 : clamp((clock - t) / 36, 0, 1);
            };
            const structure = (side: Side, key: string, draw: () => void) => {
                const d = deadness(key);
                if (d < 1) {
                    c.globalAlpha = 0.9 * (1 - d);
                    c.fillStyle = TEAM[side];
                    draw();
                }
                if (d > 0) {
                    c.globalAlpha = 0.55 * d;
                    c.fillStyle = DEAD;
                    draw();
                }
            };
            for (const side of [0, 1] as Side[]) {
                for (let lane = 0; lane < 3; lane++) {
                    for (let tier = 0; tier < 3; tier++) {
                        const [x, y] = TOWERS[side][lane][tier];
                        structure(side, `${side}:${tier + 1}:${lane}`, () => {
                            c.beginPath();
                            c.arc(X(x), Y(y), 1.9 * k, 0, Math.PI * 2);
                            c.fill();
                        });
                    }
                    const [bx, by] = BARRACKS[side][lane];
                    structure(side, `${side}:4:${lane}`, () => c.fillRect(X(bx) - 1.6 * k, Y(by) - 1.6 * k, 3.2 * k, 3.2 * k));
                }
                const [ax, ay] = ANCIENT[side];
                structure(side, `${side}:5`, () => {
                    c.beginPath();
                    c.arc(X(ax), Y(ay), 3.6 * k, 0, Math.PI * 2);
                    c.fill();
                });
                c.globalAlpha = 0.6 * (1 - deadness(`${side}:5`)) + 0.15;
                c.strokeStyle = INK;
                c.lineWidth = 1;
                c.beginPath();
                c.arc(X(ax), Y(ay), 3.6 * k, 0, Math.PI * 2);
                c.stroke();
            }

            c.globalAlpha = 0.3;
            c.strokeStyle = GOLD;
            c.lineWidth = 1;
            c.beginPath();
            c.arc(X(ROSHAN_PIT[0]), Y(ROSHAN_PIT[1]), 2.3 * k, 0, Math.PI * 2);
            c.stroke();

            const lifeScale = phase === "play" && !reduce ? Math.min(3, Math.max(1, SPEED / 60)) : 1;
            for (const mk of markersAt(m, clock, lifeScale)) {
                const a = (0.25 + 0.65 * (1 - mk.age / mk.life)) * clamp((mk.life - mk.age) / 15, 0, 1);
                const color = mk.kind === 2 ? GOLD : TEAM[mk.side];
                const cx = X(mk.x),
                    cy = Y(mk.y);
                if (!reduce && mk.age < 24) {
                    const s = mk.age / 24;
                    c.globalAlpha = (1 - s) * 0.85;
                    c.strokeStyle = color;
                    c.lineWidth = 1.5;
                    c.beginPath();
                    c.arc(cx, cy, (3 + 8 * s) * k, 0, Math.PI * 2);
                    c.stroke();
                }
                c.globalAlpha = a;
                c.strokeStyle = color;
                c.lineWidth = 1.5;
                if (mk.kind === FIGHT) {
                    c.beginPath();
                    c.arc(cx, cy, 4.2 * k, 0, Math.PI * 2);
                    c.stroke();
                    if (mk.emphasis) {
                        c.strokeStyle = GOLD;
                        c.lineWidth = 1.1;
                        c.beginPath();
                        c.arc(cx, cy, 5.8 * k, 0, Math.PI * 2);
                        c.stroke();
                    }
                    c.font = font(7.5, 700);
                    c.textAlign = "center";
                    c.fillStyle = color;
                    c.fillText(`−${mk.deaths}`, cx, cy - 5.6 * k);
                } else if (mk.kind === OBJECTIVE) {
                    c.strokeRect(cx - 2.6 * k, cy - 2.6 * k, 5.2 * k, 5.2 * k);
                } else {
                    c.fillStyle = GOLD;
                    c.globalAlpha = a * 0.3;
                    c.beginPath();
                    c.arc(cx, cy, 3.2 * k, 0, Math.PI * 2);
                    c.fill();
                    c.globalAlpha = a;
                    c.stroke();
                }
            }

            const dead = casualtiesAt(m, clock);
            c.lineWidth = 1.4;
            c.lineCap = "round";
            for (const cas of dead.values()) {
                const cx = X(cas.x),
                    cy = Y(cas.y),
                    r = 1.5 * k;
                c.globalAlpha = 0.75 * heroAlpha;
                c.strokeStyle = TEAM[cas.hero < 5 ? 0 : 1];
                c.beginPath();
                c.moveTo(cx - r, cy - r);
                c.lineTo(cx + r, cy + r);
                c.moveTo(cx + r, cy - r);
                c.lineTo(cx - r, cy + r);
                c.stroke();
            }

            if (heroAlpha > 0) {
                const placed = spreadDots(positionsAt(m, clock));
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.font = font(Math.max(7, 3.3 * k), 700);
                for (const h of p.order) {
                    const d = placed[h];
                    const color = TEAM[h < 5 ? 0 : 1];
                    const isDead = dead.has(h);
                    const px = X(d.px),
                        py = Y(d.py);
                    if (d.nudged) {
                        c.globalAlpha = 0.35 * heroAlpha;
                        c.strokeStyle = INK;
                        c.lineWidth = 0.6;
                        c.beginPath();
                        c.moveTo(X(d.x), Y(d.y));
                        c.lineTo(px, py);
                        c.stroke();
                    }
                    c.globalAlpha = heroAlpha;
                    c.beginPath();
                    c.arc(px, py, 3 * k, 0, Math.PI * 2);
                    if (isDead) {
                        c.fillStyle = BG;
                        c.fill();
                        c.strokeStyle = color;
                        c.lineWidth = 1.4;
                    } else {
                        c.fillStyle = color;
                        c.fill();
                        c.strokeStyle = "rgba(230,232,238,0.75)";
                        c.lineWidth = 0.8;
                    }
                    c.stroke();
                    c.globalAlpha = heroAlpha * (isDead ? 0.8 : 1);
                    c.fillStyle = isDead ? color : BG;
                    c.fillText(p.tags[h], px, py + 0.4);
                }
                c.textBaseline = "alphabetic";
            }

            const aegis = aegisAt(m, clock);
            if (aegis !== null && phase !== "end" && phase !== "fade") {
                c.globalAlpha = 0.95;
                c.font = font(7.5, 600);
                const label = `${teamName(aegis)} hold the Aegis`;
                const w = c.measureText(label).width + 14;
                const ax = mx + (S - w) / 2,
                    ay = my + S - 20;
                c.fillStyle = "rgba(5,7,10,0.82)";
                c.beginPath();
                c.roundRect(ax, ay, w, 13, 6.5);
                c.fill();
                c.setLineDash([2.5, 2]);
                c.strokeStyle = GOLD;
                c.lineWidth = 1;
                c.stroke();
                c.setLineDash([]);
                c.fillStyle = GOLD;
                c.textAlign = "center";
                c.fillText(label, ax + w / 2, ay + 9.2);
            }

            if (phase === "end" || phase === "fade") {
                const e = phase === "fade" ? 1 : clamp(pf / 8, 0, 1);
                c.globalAlpha = 1;
                c.fillStyle = `rgba(5,7,10,${0.6 * e})`;
                c.fillRect(mx, my, S, S);
                if (phase === "end" && pf < 12) {
                    c.globalAlpha = (1 - pf / 12) * 0.22;
                    c.fillStyle = TEAM[m.winner];
                    c.fillRect(mx, my, S, S);
                }
                const cx = mx + S / 2,
                    cy = my + S / 2;
                c.textAlign = "center";
                c.globalAlpha = e;
                c.shadowColor = TEAM[m.winner];
                c.shadowBlur = 14;
                c.fillStyle = TEAM[m.winner];
                c.font = font(15, 700);
                c.fillText(`${teamName(m.winner).toUpperCase()} VICTORY`, cx, cy - 6);
                c.shadowBlur = 0;
                c.font = font(8.5, 500);
                c.fillStyle = "rgba(230,232,238,0.78)";
                c.fillText(`${mmss(m.dur)} · ${m.ticks} ticks · ${m.events} events`, cx, cy + 12);
                const nxt = MATCHES[(mi + 1) % MATCHES.length];
                const n = phase === "fade" ? 1 : clamp((pf - 28) / 10, 0, 1);
                if (n > 0) {
                    c.globalAlpha = n * 0.85;
                    c.fillStyle = GOLD;
                    c.font = font(8, 500);
                    c.fillText(`next: ${sameDraft(m, nxt) ? "same draft" : "new draft"}, seed ${nxt.seed}`, cx, cy + 28);
                }
            }
            c.restore();

            c.globalAlpha = 1;
            c.strokeStyle = "rgba(230,232,238,0.09)";
            c.lineWidth = 1;
            c.beginPath();
            c.roundRect(mx + 0.5, my + 0.5, S - 1, S - 1, 10);
            c.stroke();
        }

        function drawRoster(p: Prepared, x0: number, y0: number, width: number) {
            const c = ctx!;
            const { m, tags } = p;
            const dead = casualtiesAt(m, clock);
            let maxNw = 1;
            for (let h = 0; h < 10; h++) maxNw = Math.max(maxNw, heroNetWorthAt(m, clock, h));
            const cw = Math.min(34, (width - 16) / 5);
            c.font = font(8, 700);
            c.textAlign = "center";
            for (let j = 0; j < 10; j++) {
                const h = PICK_ORDER[j];
                const s = phase === "draft" ? clamp((pf - 6 - j * 5) / 6, 0, 1) : 1;
                if (s <= 0) continue;
                const side = h < 5 ? 0 : 1;
                const col = TEAM[side];
                const x = x0 + (h % 5) * (cw + 4),
                    y = y0 + side * 21;
                const sc = easeOutBack(s);
                c.save();
                c.translate(x + cw / 2, y + 6.5);
                c.scale(sc, sc);
                c.globalAlpha = s;
                c.beginPath();
                c.roundRect(-cw / 2, -6.5, cw, 13, 3);
                if (dead.has(h)) {
                    c.strokeStyle = col;
                    c.lineWidth = 1;
                    c.stroke();
                    c.fillStyle = col;
                } else {
                    c.fillStyle = col;
                    c.globalAlpha = s * 0.92;
                    c.fill();
                    c.fillStyle = BG;
                }
                c.globalAlpha = s;
                c.fillText(tags[h], 0, 3);
                c.restore();
                c.globalAlpha = 0.09 * s;
                c.fillStyle = INK;
                c.fillRect(x, y + 15, cw, 2);
                c.globalAlpha = 0.75 * s;
                c.fillStyle = col;
                c.fillRect(x, y + 15, (cw * heroNetWorthAt(m, clock, h)) / maxNw, 2);
            }
            c.globalAlpha = 1;
        }

        function drawFeed(p: Prepared, x0: number, y0: number, width: number, lines: number) {
            const c = ctx!;
            const { m, tags } = p;
            const rows: { t: number | null; text: string; color: string; age: number }[] = [];
            if (phase === "draft") rows.push({ t: null, text: "Drafting 5v5", color: GOLD, age: 99 });
            else {
                for (const f of feedAt(m, clock, tags, lines))
                    rows.push({ t: f.t, text: f.text, color: TEAM[f.side], age: clock - f.t });
                if (rows.length < lines) rows.push({ t: 0, text: "The match begins", color: INK, age: clock });
            }
            c.textAlign = "left";
            rows.forEach((r, i) => {
                const y = y0 + i * 15;
                const a = [1, 0.72, 0.52, 0.4, 0.32, 0.26, 0.22, 0.19][i] ?? 0.16;
                const fresh = phase === "play" ? clamp(r.age / 10 + 0.35, 0, 1) : 1;
                c.globalAlpha = a * fresh * 0.55;
                c.fillStyle = INK;
                c.font = font(8.5);
                if (r.t !== null) c.fillText(mmss(r.t), x0, y);
                c.globalAlpha = a * fresh;
                c.fillStyle = r.color;
                c.font = font(9, i === 0 ? 600 : 400);
                c.fillText(fit(r.text, width - 38), x0 + 38, y);
            });
            c.globalAlpha = 1;
        }

        function drawLead(p: Prepared, gx: number, gy: number, gw: number, gh: number) {
            const c = ctx!;
            const { m, lead, leadMax } = p;
            const mid = gy + gh / 2;
            const GX = (t: number) => gx + (gw * t) / m.dur;
            const GY = (v: number) => mid - (v / leadMax) * (gh / 2);
            c.font = font(7.5);
            c.textAlign = "left";
            c.fillStyle = "rgba(230,232,238,0.38)";
            c.fillText("net worth lead", gx, gy - 5);
            c.strokeStyle = "rgba(230,232,238,0.14)";
            c.setLineDash([3, 3]);
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(gx, mid);
            c.lineTo(gx + gw, mid);
            c.stroke();
            c.setLineDash([]);
            if (phase === "draft" || clock <= 0) return;

            const [r, d] = teamNetWorthAt(m, clock);
            const now = r - d;
            const pts: [number, number][] = [];
            for (let i = 0; i < lead.length && i * 30 < clock; i++) pts.push([GX(i * 30), GY(lead[i])]);
            pts.push([GX(clock), GY(now)]);
            const path = new Path2D();
            path.moveTo(gx, mid);
            for (const [x, y] of pts) path.lineTo(x, y);
            path.lineTo(GX(clock), mid);
            path.closePath();
            const line = new Path2D();
            pts.forEach(([x, y], i) => (i ? line.lineTo(x, y) : line.moveTo(x, y)));
            for (const [side, top, h] of [
                [0, gy - 2, gh / 2 + 2],
                [1, mid, gh / 2 + 2],
            ] as const) {
                c.save();
                c.beginPath();
                c.rect(gx - 2, top, gw + 4, h);
                c.clip();
                c.globalAlpha = 0.26;
                c.fillStyle = TEAM[side];
                c.fill(path);
                c.globalAlpha = 0.9;
                c.strokeStyle = TEAM[side];
                c.lineWidth = 1.2;
                c.stroke(line);
                c.restore();
            }
            const hx = GX(clock),
                hy = GY(now);
            c.globalAlpha = 0.3;
            c.strokeStyle = GOLD;
            c.beginPath();
            c.moveTo(hx, gy);
            c.lineTo(hx, gy + gh);
            c.stroke();
            c.globalAlpha = 1;
            c.fillStyle = GOLD;
            c.beginPath();
            c.arc(hx, hy, 2.5, 0, Math.PI * 2);
            c.fill();
            c.font = font(8.5, 600);
            c.fillStyle = now >= 0 ? RAD : DIRE;
            const label = `${now >= 0 ? "+" : "−"}${fmtK(Math.abs(now))}`;
            const lw = c.measureText(label).width;
            c.textAlign = "left";
            c.fillText(label, hx + 6 + lw > gx + gw ? hx - 6 - lw : hx + 6, clamp(hy + 3, gy + 8, gy + gh));
        }

        function drawHeader(p: Prepared, x0: number, x1: number) {
            const c = ctx!;
            const { m } = p;
            const [r, d] = teamNetWorthAt(m, clock);
            c.textAlign = "left";
            c.font = font(15, 600);
            c.fillStyle = INK;
            const clockText = mmss(clock);
            c.fillText(clockText, x0, 27);
            chip(x0 + c.measureText(clockText).width + 8, 17, speedTag(), GOLD);

            const pr = winProb(r, d);
            const fav: Side = pr >= 0.5 ? 0 : 1;
            c.textAlign = "right";
            c.font = font(10, 600);
            if (phase === "draft" || clock <= 0 || Math.abs(pr - 0.5) < 0.005) {
                c.fillStyle = "rgba(230,232,238,0.6)";
                c.fillText("EVEN", x1, 26);
            } else {
                c.fillStyle = TEAM[fav];
                c.fillText(`${teamName(fav).toUpperCase()} ${Math.round(Math.max(pr, 1 - pr) * 100)}%`, x1, 26);
            }

            c.font = font(8.5, 500);
            const rs = fmtK(r),
                ds = fmtK(d);
            const wR = c.measureText(rs).width,
                wSep = c.measureText(" : ").width,
                wD = c.measureText(ds).width;
            let x = x1;
            c.fillStyle = DIRE;
            c.fillText(ds, x, 42);
            x -= wD;
            c.fillStyle = "rgba(230,232,238,0.4)";
            c.fillText(" : ", x, 42);
            x -= wSep;
            c.fillStyle = RAD;
            c.fillText(rs, x, 42);
            x -= wR;
            c.textAlign = "left";
            c.fillStyle = "rgba(217,164,65,0.8)";
            c.fillText(fit(`replay · ${m.id}`, x - x0 - 12), x0, 42);
        }

        function drawCompactHud(p: Prepared) {
            const c = ctx!;
            const { m } = p;
            const [r, d] = teamNetWorthAt(m, clock);
            c.textAlign = "left";
            c.font = font(12, 600);
            c.fillStyle = INK;
            c.fillText(mmss(clock), 10, 24);
            c.font = font(7.5, 600);
            c.fillStyle = GOLD;
            c.fillText(speedTag(), 10, 37);
            const pr = winProb(r, d);
            const fav: Side = pr >= 0.5 ? 0 : 1;
            c.textAlign = "right";
            if (phase === "draft" || clock <= 0 || Math.abs(pr - 0.5) < 0.005) {
                c.font = font(9, 600);
                c.fillStyle = "rgba(230,232,238,0.6)";
                c.fillText("EVEN", W - 10, 24);
            } else {
                c.fillStyle = TEAM[fav];
                c.font = font(8, 600);
                c.fillText(teamName(fav).toUpperCase(), W - 10, 22);
                c.font = font(11, 600);
                c.fillText(`${Math.round(Math.max(pr, 1 - pr) * 100)}%`, W - 10, 36);
                const lead = r - d;
                c.textAlign = "left";
                c.font = font(8.5, 600);
                c.fillStyle = TEAM[lead >= 0 ? 0 : 1];
                c.fillText(`${lead >= 0 ? "+" : "−"}${fmtK(Math.abs(lead))}`, 10, H - 12);
            }
        }

        function render() {
            const c = ctx!;
            if (!W) layout();
            if (!W) return;
            const p = preps[mi];
            c.clearRect(0, 0, W, H);
            c.globalAlpha = 1;
            // The very first frame paints at full strength so the card is never
            // blank; only a match handover fades out and back in.
            const fade = phase === "fade" ? 1 - pf / FADE_F : phase === "draft" && looped ? clamp(pf / 8, 0, 1) : 1;
            c.save();
            const heroAlpha = phase === "draft" ? 0 : clamp(clock / 30, 0, 1);
            drawMap(p, heroAlpha);
            if (W < 470) drawCompactHud(p);
            else {
                const x0 = mx + S + 16,
                    x1 = W - 14,
                    cw = x1 - x0;
                drawHeader(p, x0, x1);
                if (cw >= 520) {
                    const colA = Math.min(320, Math.floor(cw * 0.42));
                    drawRoster(p, x0, 56, colA);
                    drawFeed(p, x0, 118, colA, 7);
                    drawLead(p, x0 + colA + 28, 66, cw - colA - 28, H - 66 - 16);
                } else {
                    drawRoster(p, x0, 56, cw);
                    drawFeed(p, x0, 115, cw, 4);
                    drawLead(p, x0, 186, cw, H - 186 - 12);
                }
            }
            c.restore();
            // Every draw sets an absolute alpha, so the match cross-fade is
            // applied to the finished frame instead.
            if (fade < 1) {
                c.save();
                c.setTransform(1, 0, 0, 1, 0, 0);
                c.globalCompositeOperation = "destination-in";
                c.fillStyle = `rgba(0,0,0,${fade})`;
                c.fillRect(0, 0, cv!.width, cv!.height);
                c.restore();
            }
        }

        layout();

        const renderStatic = () => {
            mi = 0;
            phase = "play";
            clock = STATIC_CLOCK;
            render();
        };

        // The card can change size without a window resize (grid reflow, a
        // hidden-then-shown pane), so watch the wrapper itself.
        if (reduce) {
            renderStatic();
            const ro = new ResizeObserver(() => {
                layout();
                renderStatic();
            });
            ro.observe(wrap);
            document.fonts?.ready.then(renderStatic);
            return () => ro.disconnect();
        }

        let timer: number | null = null;
        const tick = () => {
            step();
            render();
        };
        const start = () => {
            if (timer == null) timer = window.setInterval(tick, 30);
        };
        const stop = () => {
            if (timer != null) {
                clearInterval(timer);
                timer = null;
            }
        };
        const ro = new ResizeObserver(() => {
            layout();
            render();
        });
        ro.observe(wrap);
        render();
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 });
        io.observe(wrap);
        return () => {
            stop();
            io.disconnect();
            ro.disconnect();
        };
    }, []);

    return (
        <div className="dmv" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .dmv { position: absolute; inset: 0; overflow: hidden; }
                .dmv canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
