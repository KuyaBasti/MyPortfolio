"use client";

import { useEffect, useRef } from "react";
import { BEGIN, PRINTED, TXNS, checks, dollars, rejectionDetail, sheetRows, signed } from "./centavo/fixture";

// Centavo card: reconcile or reject, to the cent. A synthetic statement slides
// into the inbox, a scan line extracts every printed amount as integer cents,
// the three real checks tick (deposits, withdrawals, balance), and the rows
// land in the passbook ledger under an accountant's double rule. Then a copy
// whose printed deposits total is one cent high arrives: the deposits check
// fails with the real diff, persist and archive are skipped, a REJECTED stamp
// hits the sheet, and the ledger visibly does not change. Every frame is a
// pure function of the loop clock; the reduced-motion frame is the reconciled
// ledger at 10.45 s. Numbers are the repo's invented test fixture only.

const C = {
    bg: "#131311", surface: "#1b1a17", line: "#36332b", lineSoft: "#2b2822",
    ink: "#ece9e1", ink2: "#a8a394", ink3: "#98937e", brand: "#4fae7d", tint: "#1d2b20",
    copper: "#c47a45", pos: "#45b371", neg: "#e0655f", negBg: "#2d1a16",
};
// Centavo's own type, not the site's: mono for money, serif for the voice.
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const SERIF = 'Charter, Georgia, "Times New Roman", serif';
const fm = (px: number) => `${px}px ${MONO}`;
const fs = (px: number) => `${px}px ${SERIF}`;

const STAGES = ["fingerprint", "parse", "reconcile", "persist", "archive"];
const SHEET_OK = sheetRows(false);
const SHEET_SKEW = sheetRows(true);
const OK = checks();
const BAD = checks(PRINTED.deposits + 1);

type Seg = ["m" | "s", string];
const CHECKS_OK: Seg[][] = [
    [["m", "deposits "], ["m", String(OK[0].extracted)], ["s", " = "], ["m", String(OK[0].printed)]],
    [["m", "withdrawals "], ["m", String(OK[1].extracted)], ["s", " = "], ["m", String(OK[1].printed)]],
    [["m", "balance "], ["m", String(BEGIN)], ["s", " + "], ["m", String(OK[0].extracted)], ["s", " - "], ["m", String(OK[1].extracted)], ["s", " = "], ["m", String(OK[2].printed)]],
];
const CHECK_PENDING: Seg[] = [["m", "deposits "], ["m", String(BAD[0].extracted)], ["s", " = "], ["m", String(BAD[0].printed)]];
const CHECKS_FAIL: Seg[][] = [
    [["m", "deposits "], ["m", String(BAD[0].extracted)], ["s", " ≠ "], ["m", String(BAD[0].printed)]],
    [["m", rejectionDetail(BAD).replace("document does not reconcile: deposits: ", "").replace(/ \(diff.*$/, "")]],
    [["m", `(diff ${BAD[0].extracted - BAD[0].printed}) · does not reconcile`]],
];

// Timeline in seconds; one loop is 18.4 s.
const LOOP = 18.4;
const T = {
    in1: [0, 0.8], fp1: [0.8, 1.3], scan1: [1.3, 4.6], chk1: 4.8, chkGap: 0.9,
    persist1: 7.4, result1: 7.5, fly0: 7.8, flyGap: 0.35, flyDur: 0.55, close1: 9.9, archive1: 10.5, out1: [10.7, 11.4],
    clear1: [11.0, 11.5],
    in2: [11.6, 12.4], fp2: [12.4, 12.8], scan2: [12.8, 14.3], chk2: 14.5, fail: 15.1, err1: 15.3, err2: 15.6,
    result2: 15.9, stamp: 16.2, unchanged: [16.0, 17.8], out2: [17.0, 17.8], fade: [17.9, 18.4],
};
const STATIC_T = 10.45;

function mulberry32(a: number) {
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const eo = (x: number) => 1 - Math.pow(1 - x, 3);
const ei = (x: number) => x * x * x;
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const richLen = (segs: Seg[]) => segs.reduce((n, s) => n + s[1].length, 0);

type Layout = {
    P: number; narrow: boolean; leftW: number; rx: number; rw: number; sx: number; sy: number; sw: number;
    rowH: number; chkY: number[]; resY: number; hudY: number; ledHead: number; ledRow0: number; ledPitch: number;
    ledClose: number; ledRule: number; ledSub: number; ledTag: number; cw: number;
};

export default function Centavo() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const cv = cvRef.current;
        if (!wrap || !cv) return;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const rng = mulberry32(66118);
        const GRAIN: [number, number, number][] = [];
        for (let g = 0; g < 140; g++) GRAIN.push([rng(), rng(), 0.02 + rng() * 0.04]);

        let W = 0,
            H = 0,
            L: Layout | null = null,
            frame = 0,
            loopIdx = -1,
            stampRot = -0.14,
            stampDx = 0,
            stampDy = 0;

        // The stamp lands at a slightly different angle each loop.
        function seedLoop(i: number) {
            if (i === loopIdx) return;
            loopIdx = i;
            const r = mulberry32(1111 + i * 7919);
            stampRot = -0.18 + r() * 0.1;
            stampDx = (r() - 0.5) * 10;
            stampDy = (r() - 0.5) * 6;
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
            const P = 10, usable = W - 2 * P, narrow = W < 420;
            const leftW = Math.round(usable * (narrow ? 0.66 : 0.56));
            ctx!.font = fm(9);
            L = {
                P, narrow, leftW, rx: P + leftW + 10, rw: usable - leftW - 10,
                sx: P, sy: 28, sw: leftW, rowH: 11,
                chkY: [170, 182, 194], resY: 212, hudY: 230,
                ledHead: 38, ledRow0: 56, ledPitch: 15, ledClose: 158, ledRule: 163, ledSub: 180, ledTag: 196,
                cw: ctx!.measureText("0").width,
            };
        }

        function fit(str: string, maxW: number) {
            const c = ctx!;
            if (c.measureText(str).width <= maxW) return str;
            let s = str;
            while (s.length > 1 && c.measureText(s + "…").width > maxW) s = s.slice(0, -1);
            return s + "…";
        }
        function drawRich(segs: Seg[], x: number, y: number, px: number, color: string, chars?: number) {
            const c = ctx!;
            let left = chars == null ? 1e9 : chars;
            for (const [kind, s] of segs) {
                if (left <= 0) break;
                const shown = s.length <= left ? s : s.slice(0, left);
                left -= shown.length;
                c.font = kind === "s" ? fs(px + 2) : fm(px);
                c.fillStyle = color;
                c.textAlign = "left";
                c.fillText(shown, x, y);
                x += c.measureText(shown).width;
            }
        }
        function doubleRule(x1: number, x2: number, y: number, color: string) {
            ctx!.fillStyle = color;
            ctx!.fillRect(x1, y, x2 - x1, 1);
            ctx!.fillRect(x1, y + 3, x2 - x1, 1);
        }
        function check(x: number, y: number, color: string, a = 1) {
            const c = ctx!;
            c.save(); c.globalAlpha = a; c.strokeStyle = color; c.lineWidth = 1.5; c.lineCap = "round"; c.lineJoin = "round";
            c.beginPath(); c.moveTo(x - 3.5, y); c.lineTo(x - 0.8, y + 2.8); c.lineTo(x + 4, y - 3); c.stroke(); c.restore();
        }
        function cross(x: number, y: number, color: string, a = 1) {
            const c = ctx!;
            c.save(); c.globalAlpha = a; c.strokeStyle = color; c.lineWidth = 1.5; c.lineCap = "round";
            c.beginPath(); c.moveTo(x - 3.2, y - 3.2); c.lineTo(x + 3.2, y + 3.2); c.moveTo(x + 3.2, y - 3.2); c.lineTo(x - 3.2, y + 3.2); c.stroke(); c.restore();
        }

        function stageStates(t: number) {
            const st = ["pend", "pend", "pend", "pend", "pend"];
            if (t < T.in2[0]) {
                if (t >= T.clear1[1]) return st;
                if (t >= T.fp1[0]) st[0] = t < T.fp1[1] ? "act" : "done";
                if (t >= T.scan1[0]) st[1] = t < T.scan1[1] ? "act" : "done";
                if (t >= T.scan1[1]) st[2] = t < T.persist1 ? "act" : "done";
                if (t >= T.persist1) st[3] = t < T.archive1 ? "act" : "done";
                if (t >= T.archive1) st[4] = t < T.out1[1] ? "act" : "done";
            } else {
                if (t >= T.fp2[0]) st[0] = t < T.fp2[1] ? "act" : "done";
                if (t >= T.scan2[0]) st[1] = t < T.scan2[1] ? "act" : "done";
                if (t >= T.scan2[1]) st[2] = t < T.fail ? "act" : "fail";
                if (t >= T.fail) { st[3] = "skip"; st[4] = "skip"; }
            }
            return st;
        }

        function drawTop(t: number) {
            const c = ctx!, l = L!, P = l.P, y = 13;
            c.fillStyle = C.copper; c.beginPath(); c.arc(P + 7, y, 7, 0, Math.PI * 2); c.fill();
            c.strokeStyle = "rgba(19,19,17,0.55)"; c.lineWidth = 1; c.beginPath(); c.arc(P + 7, y, 5, 0, Math.PI * 2); c.stroke();
            c.fillStyle = C.bg; c.font = "bold " + fs(9); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("C", P + 7, y + 0.5);
            c.textBaseline = "alphabetic";
            const st = stageStates(t);
            let x = P + 22;
            c.font = fm(9); c.textAlign = "left";
            for (let i = 0; i < STAGES.length; i++) {
                const s = st[i], w = c.measureText(STAGES[i]).width;
                let col = C.ink3, a = 0.55;
                if (s === "act") { col = C.brand; a = 1; } else if (s === "done") { col = C.ink2; a = 1; }
                else if (s === "fail") { col = C.neg; a = 1; } else if (s === "skip") { a = 0.35; }
                c.globalAlpha = a; c.fillStyle = col; c.fillText(STAGES[i], x, y + 3);
                if (s === "act" || s === "fail") c.fillRect(x, y + 6, w, 1);
                if (s === "skip") c.fillRect(x, y, w, 1);
                c.globalAlpha = 1;
                x += w;
                if (i < STAGES.length - 1) { c.fillStyle = C.line; c.fillRect(x + 3, y, 5, 1); x += 11; }
            }
            if (!l.narrow) { c.fillStyle = C.ink3; c.textAlign = "right"; c.fillText("LOCAL-FIRST", W - P, y + 3); }
        }

        const sheetRowTop = (i: number) => L!.sy + 20 + i * L!.rowH;

        function drawSheet(rows: typeof SHEET_OK, xoff: number, yoff: number, alpha: number, scanP: number, failed: boolean, stampP: number) {
            const c = ctx!, l = L!;
            const sx = l.sx + xoff, sy = l.sy + yoff, sw = l.sw, sh = 128;
            c.save(); c.globalAlpha = alpha;
            c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(sx + 2, sy + 3, sw, sh);
            c.fillStyle = C.surface; c.fillRect(sx, sy, sw, sh);
            c.strokeStyle = C.line; c.lineWidth = 1; c.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
            c.save(); c.beginPath(); c.rect(sx, sy, sw, sh); c.clip();
            for (const [gx, gy, ga] of GRAIN) { c.fillStyle = `rgba(236,233,225,${ga})`; c.fillRect(sx + gx * sw, sy + gy * sh, 1, 1); }
            c.restore();
            const pad = 7, rX = sx + sw - pad;
            c.fillStyle = C.ink; c.font = fs(11); c.textAlign = "left"; c.fillText("Checking ···1111", sx + pad, sy + 13);
            const hw = c.measureText("Checking ···1111").width;
            c.font = fm(9); c.fillStyle = C.ink3; c.textAlign = "right";
            let per = "03/07 -> 04/07/2026";
            if (c.measureText(per).width > sw - 2 * pad - hw - 8) per = "03/07 -> 04/07";
            c.fillText(per, rX, sy + 13);
            c.fillStyle = C.line; c.fillRect(sx + pad, sy + 18, sw - 2 * pad, 1);
            const cw = l.cw, centsW = 6 * cw, dolW = 7 * cw, dolR = rX - centsW - 8, labMax = dolR - dolW - 6 - (sx + pad);
            for (let i = 0; i < rows.length; i++) {
                const r = rows[i], top = sheetRowTop(i) + yoff, by = top + 8.5;
                if (i === 6) { c.fillStyle = C.line; c.fillRect(sx + pad, top - 0.5, sw - 2 * pad, 1); }
                else if (i > 0) { c.fillStyle = C.lineSoft; c.fillRect(sx + pad, top - 0.5, sw - 2 * pad, 1); }
                const isBad = failed && i === 6;
                if (isBad) { c.fillStyle = C.negBg; c.fillRect(sx + pad, top, sw - 2 * pad, l.rowH - 1); }
                c.font = fm(9); c.textAlign = "left";
                c.fillStyle = r.kind === "txn" ? C.ink : C.ink2;
                c.fillText(fit(r.label, labMax), sx + pad, by);
                c.textAlign = "right"; c.fillStyle = isBad ? C.neg : r.kind === "txn" ? C.ink : C.ink2;
                c.fillText(r.amt, dolR, by);
                // extracted cents type in as the scan line passes, on a highlighter stroke
                const rp = scanP < 0 ? 0 : clamp01((scanP * rows.length - i) / 0.7);
                if (rp > 0) {
                    const n = Math.ceil(rp * r.cents.length);
                    c.fillStyle = isBad ? C.negBg : C.tint; c.fillRect(rX - centsW - 2, top + 1, centsW + 4, l.rowH - 3);
                    c.fillStyle = isBad ? C.neg : rp < 1 ? C.brand : C.ink; c.fillText(r.cents.slice(0, n), rX, by);
                }
            }
            doubleRule(sx + pad, sx + sw - pad, sheetRowTop(rows.length) + yoff + 1, C.ink2);
            if (scanP >= 0 && scanP < 1) {
                const ly = sheetRowTop(0) + yoff + scanP * rows.length * l.rowH;
                c.save(); c.shadowColor = C.brand; c.shadowBlur = 8; c.fillStyle = C.brand; c.fillRect(sx + 2, ly, sw - 4, 1); c.restore();
                c.fillStyle = "rgba(79,174,125,0.08)"; c.fillRect(sx + 2, ly - 10, sw - 4, 10);
            }
            if (stampP > 0) {
                const sc = lerp(1.35, 1, eo(stampP)), txt = "REJECTED · NOTHING WRITTEN";
                c.save(); c.globalAlpha = alpha * Math.min(1, stampP * 3) * 0.95;
                c.translate(sx + sw / 2 + stampDx, sy + sh / 2 + 6 + stampDy); c.rotate(stampRot); c.scale(sc, sc);
                c.font = fm(9); c.letterSpacing = "1px";
                const tw = c.measureText(txt).width, bw = tw + 14, bh = 18;
                c.strokeStyle = C.neg; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-bw / 2, -bh / 2, bw, bh, 2); c.stroke();
                c.fillStyle = C.neg; c.textAlign = "center"; c.fillText(txt, 0, 3.5);
                c.letterSpacing = "0px";
                c.restore();
            }
            c.restore();
        }

        function drawChecks(t: number) {
            const c = ctx!, l = L!, x = l.sx + 14, gx = l.sx + 5;
            if (t < T.in2[0]) {
                const a = 1 - seg(t, T.clear1[0], T.clear1[1]);
                if (a <= 0) return;
                c.globalAlpha = a;
                for (let i = 0; i < 3; i++) {
                    const start = T.chk1 + i * T.chkGap;
                    if (t < start) break;
                    drawRich(CHECKS_OK[i], x, l.chkY[i], 9, C.ink, Math.floor(seg(t, start, start + 0.45) * richLen(CHECKS_OK[i])));
                    if (t >= start + 0.6) check(gx, l.chkY[i] - 3, C.pos, Math.min(1, (t - start - 0.6) / 0.15));
                }
                c.globalAlpha = 1;
            } else {
                const a = 1 - seg(t, T.fade[0], T.fade[1]);
                if (a <= 0 || t < T.chk2) return;
                c.globalAlpha = a;
                const failed = t >= T.fail;
                const segs = failed ? CHECKS_FAIL[0] : CHECK_PENDING;
                drawRich(segs, x, l.chkY[0], 9, failed ? C.neg : C.ink, Math.floor(seg(t, T.chk2, T.chk2 + 0.45) * richLen(segs)));
                if (failed) cross(gx, l.chkY[0] - 3, C.neg, Math.min(1, (t - T.fail) / 0.15));
                if (t >= T.err1) drawRich(CHECKS_FAIL[1], x, l.chkY[1], 9, C.neg, Math.floor(seg(t, T.err1, T.err1 + 0.3) * richLen(CHECKS_FAIL[1])));
                if (t >= T.err2) drawRich(CHECKS_FAIL[2], x, l.chkY[2], 9, C.ink2, Math.floor(seg(t, T.err2, T.err2 + 0.3) * richLen(CHECKS_FAIL[2])));
                c.globalAlpha = 1;
            }
        }

        function drawResult(t: number) {
            const c = ctx!, l = L!, x = l.sx + 14, gx = l.sx + 5, y = l.resY;
            c.font = fm(9); c.textAlign = "left";
            if (t < T.in2[0]) {
                if (t < T.result1) return;
                const a = 1 - seg(t, T.clear1[0], T.clear1[1]);
                if (a <= 0) return;
                const p = seg(t, T.result1, T.result1 + 0.5), txt = `[OK ] checking.pdf · ${TXNS.length} txns`;
                c.globalAlpha = a; check(gx, y - 3, C.pos); c.fillStyle = C.pos; c.fillText(txt.slice(0, Math.ceil(p * txt.length)), x, y); c.globalAlpha = 1;
            } else {
                if (t < T.result2) return;
                const a = 1 - seg(t, T.fade[0], T.fade[1]);
                if (a <= 0) return;
                const p = seg(t, T.result2, T.result2 + 0.5);
                const txt = l.narrow ? "[REJ] checking-skewed.pdf" : "[REJ] checking-skewed.pdf · not imported";
                c.globalAlpha = a; cross(gx, y - 3, C.neg); c.fillStyle = C.neg; c.fillText(txt.slice(0, Math.ceil(p * txt.length)), x, y); c.globalAlpha = 1;
            }
        }

        function drawHud() {
            const c = ctx!, l = L!;
            c.font = fm(9); c.textAlign = "left"; c.fillStyle = C.ink3; c.globalAlpha = 0.9;
            c.fillText("reconcile or reject · to the cent", l.sx, l.hudY); c.globalAlpha = 1;
        }

        function ledRow(x: number, y: number, right: number, date: string, label: string, cents: number, col: string, alpha: number) {
            const c = ctx!;
            c.save(); c.globalAlpha = alpha; c.font = fm(9); c.textAlign = "left";
            c.fillStyle = C.ink3; c.fillText(date, x, y);
            const amt = signed(cents);
            c.textAlign = "right"; c.fillStyle = col; c.fillText(amt, right, y);
            const avail = right - c.measureText(amt).width - 8 - (x + 34);
            if (avail > 28) { c.textAlign = "left"; c.fillStyle = C.ink; c.fillText(fit(label, avail), x + 34, y); }
            c.restore();
        }

        function drawLedger(t: number) {
            const c = ctx!, l = L!, rx = l.rx, rw = l.rw, right = rx + rw;
            c.font = fm(9); c.textAlign = "left"; c.fillStyle = C.ink3;
            c.fillText(l.narrow ? "LEDGER" : "LEDGER · checking ···1111", rx, l.ledHead);
            c.fillStyle = C.line; c.fillRect(rx, l.ledHead + 5, rw, 1);
            // the brought-forward balance is always there: the balance chain
            const y0 = l.ledRow0;
            c.fillStyle = C.ink3; c.fillText("03/07", rx, y0);
            c.textAlign = "right"; c.fillStyle = C.ink2; c.fillText(dollars(BEGIN), right, y0);
            const bw = c.measureText(dollars(BEGIN)).width;
            if (rw - 34 - bw - 8 > 28) { c.textAlign = "left"; c.fillStyle = C.ink2; c.fillText(fit("Brought forward", rw - 34 - bw - 8), rx + 34, y0); }
            c.fillStyle = C.lineSoft; c.fillRect(rx, y0 + 5, rw, 1);
            const fadeA = 1 - seg(t, T.fade[0], T.fade[1]);
            for (let i = 0; i < TXNS.length; i++) {
                const start = T.fly0 + i * T.flyGap, p = seg(t, start, start + T.flyDur);
                if (p <= 0) continue;
                const ty = l.ledRow0 + (i + 1) * l.ledPitch, e = eio(p);
                const fx = lerp(l.sx + 7, rx, e), fy = lerp(sheetRowTop(i + 1) + 8.5, ty, e), fr = lerp(l.sx + l.sw - 7, right, e);
                ledRow(fx, fy, fr, TXNS[i].d, TXNS[i].led, TXNS[i].c, TXNS[i].c < 0 ? C.neg : C.pos, (0.5 + 0.5 * p) * fadeA);
                if (p >= 1) { c.globalAlpha = fadeA; c.fillStyle = C.lineSoft; c.fillRect(rx, ty + 5, rw, 1); c.globalAlpha = 1; }
            }
            if (t >= T.close1) {
                const cp = seg(t, T.close1, T.close1 + 0.5);
                c.globalAlpha = fadeA;
                c.font = fm(13); c.textAlign = "right"; c.fillStyle = C.ink;
                const fig = dollars(PRINTED.ending);
                c.fillText(fig.slice(0, Math.ceil(cp * fig.length)), right, l.ledClose);
                doubleRule(rx, rx + rw * eo(cp), l.ledRule, C.ink2);
                if (cp > 0.6) {
                    const sub: Seg[] = l.narrow
                        ? [["m", `+${dollars(PRINTED.deposits)} `], ["s", "−"], ["m", dollars(PRINTED.withdrawals)]]
                        : [["m", dollars(BEGIN)], ["s", " + "], ["m", dollars(PRINTED.deposits)], ["s", " - "], ["m", dollars(PRINTED.withdrawals)]];
                    let sw2 = 0;
                    for (const [k, s] of sub) { c.font = k === "s" ? fs(11) : fm(9); sw2 += c.measureText(s).width; }
                    drawRich(sub, right - sw2, l.ledSub, 9, C.ink3);
                }
                c.globalAlpha = 1;
            }
            if (t >= T.unchanged[0] && t <= T.unchanged[1]) {
                const ua = Math.min(seg(t, T.unchanged[0], T.unchanged[0] + 0.3), 1 - seg(t, T.unchanged[1] - 0.4, T.unchanged[1]));
                c.globalAlpha = ua; c.font = fm(9); c.textAlign = "right"; c.fillStyle = C.ink3;
                c.fillText("ledger unchanged", right, l.ledTag); c.globalAlpha = 1;
            }
        }

        function render(t: number) {
            if (!W || !L) layout();
            if (!W || !L) return;
            const c = ctx!;
            c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
            drawTop(t);
            const off = -(L.sw + 24);
            if (t < T.out1[1]) {
                const o1 = seg(t, T.out1[0], T.out1[1]);
                drawSheet(SHEET_OK, lerp(off, 0, eo(seg(t, T.in1[0], T.in1[1]))), -12 * ei(o1), 1 - o1, t < T.scan1[0] ? -1 : seg(t, T.scan1[0], T.scan1[1]), false, 0);
            } else if (t >= T.in2[0]) {
                const xin = lerp(off, 0, eo(seg(t, T.in2[0], T.in2[1]))), xout = off * ei(seg(t, T.out2[0], T.out2[1]));
                drawSheet(SHEET_SKEW, xin + xout, 0, 1, t < T.scan2[0] ? -1 : seg(t, T.scan2[0], T.scan2[1]), t >= T.fail, seg(t, T.stamp, T.stamp + 0.25));
            }
            drawChecks(t); drawResult(t); drawLedger(t); drawHud();
        }

        const tick = () => {
            frame++;
            const tt = frame * 0.03;
            seedLoop(Math.floor(tt / LOOP));
            render(tt % LOOP);
        };

        layout();
        seedLoop(0);

        if (reduce) {
            // Static frame: the statement reconciled, persisted, and closed on its double rule.
            render(STATIC_T);
            const ro = new ResizeObserver(() => { layout(); render(STATIC_T); });
            ro.observe(wrap);
            return () => ro.disconnect();
        }

        let timer: number | null = null;
        const start = () => { if (timer == null) timer = window.setInterval(tick, 30); };
        const stop = () => { if (timer != null) { clearInterval(timer); timer = null; } };
        const ro = new ResizeObserver(() => { layout(); render((frame * 0.03) % LOOP); });
        ro.observe(wrap);
        render(0);
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 });
        io.observe(wrap);
        return () => { stop(); io.disconnect(); ro.disconnect(); };
    }, []);

    return (
        <div className="cvo" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .cvo { position: absolute; inset: 0; overflow: hidden; background: #131311; }
                .cvo canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
