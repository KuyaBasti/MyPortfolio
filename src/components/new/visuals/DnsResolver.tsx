"use client";

import { useEffect, useRef } from "react";

// DNS Resolver scene visual: an animated recursive walk. A query packet
// leaves the client, the resolver checks its shard cache (miss), walks the
// hierarchy (root -> TLD -> authoritative) with each server pausing to
// "think" and its reply pinned on the leg, then the answer is written to the
// cache (+ A record) on the way home. The same domain is asked again and
// short-circuits: green HIT, 0.2 ms. Question legs are blue, answers cyan,
// cache hits green. The loop runs only while on-screen and resolves to a
// mid-walk static frame for reduced-motion. Client-only state, so SSR-safe.

const B = "#5e9eff",
    Bb = "#cfe6ff",
    Cy = "#53d8ff",
    Gh = "#3dff8a",
    Am = "#ffb84d";

type Pt = { x: number; y: number };
type Step = {
    m?: [Pt, Pt];
    c?: string;
    fast?: boolean;
    p?: Pt;
    f?: number;
    cache?: "miss" | "write" | "hit";
    lb?: [string, [number, number]];
    done?: "miss" | "hit";
};
type Domain = [string, string, string];

const DOMAINS: Domain[] = [
    ["api.github.com", ".com", "140.82.113.5"],
    ["go.dev", ".dev", "216.239.32.21"],
    ["npmjs.org", ".org", "104.16.92.83"],
    ["kernel.org", ".org", "139.178.84.217"],
];

export default function DnsResolver() {
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
        const CL: Pt = { x: 36, y: 114 },
            RS: Pt = { x: 150, y: 114 },
            CA: Pt = { x: 150, y: 160 },
            ROOT: Pt = { x: 436, y: 48 },
            TLD: Pt = { x: 436, y: 114 },
            AUTH: Pt = { x: 436, y: 182 };

        let di = 0,
            mode: "miss" | "hit" = "miss",
            steps: Step[] = [],
            si = 0,
            t = 0,
            lat = 0,
            hold = 0;
        let log: string[] = [];
        let labels: [string, [number, number]][] = [];
        let cacheFx: { k: "miss" | "write" | "hit" } | null = null;
        let flashN: Pt | null = null;

        const mid = (a: Pt, b: Pt, dy = 0): [number, number] => [(a.x + b.x) / 2, (a.y + b.y) / 2 + dy];

        function buildMiss(d: Domain): Step[] {
            return [
                { m: [CL, RS], c: B },
                { p: RS, f: 6, cache: "miss" },
                { m: [RS, ROOT], c: B },
                { p: ROOT, f: 8 },
                { m: [ROOT, RS], c: Cy, lb: ["NS → " + d[1], mid(RS, ROOT, -8)] },
                { m: [RS, TLD], c: B },
                { p: TLD, f: 8 },
                { m: [TLD, RS], c: Cy, lb: ["NS → ns1" + d[1], [(RS.x + TLD.x) / 2, TLD.y - 10]] },
                { m: [RS, AUTH], c: B },
                { p: AUTH, f: 8 },
                { m: [AUTH, RS], c: Cy, lb: ["A " + d[2] + " · ttl 300", mid(RS, AUTH, 16)] },
                { p: RS, f: 11, cache: "write" },
                { m: [RS, CL], c: Cy, done: "miss" },
            ];
        }
        function buildHit(): Step[] {
            return [
                { m: [CL, RS], c: B },
                { p: RS, f: 8, cache: "hit" },
                { m: [RS, CL], c: Gh, fast: true, done: "hit" },
            ];
        }
        function startRun() {
            const d = DOMAINS[di];
            steps = mode === "miss" ? buildMiss(d) : buildHit();
            si = 0;
            t = 0;
            lat = 0;
            log.push("? " + d[0] + " A");
            if (log.length > 2) log = log.slice(-2);
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
            // hierarchy column hugs the right edge; resolver stays left of center
            const nx = Math.max(RS.x + 150, W - 124);
            ROOT.x = TLD.x = AUTH.x = nx;
        }

        function node(n: Pt, l1: string, l2: string, col: string, glow: boolean) {
            const c = ctx!;
            if (glow) {
                c.shadowColor = col;
                c.shadowBlur = 14;
            }
            c.fillStyle = "rgba(10,16,26,0.94)";
            c.strokeStyle = col;
            c.lineWidth = glow ? 1.6 : 1.1;
            c.beginPath();
            c.roundRect(n.x - 46, n.y - 15, 92, 30, 8);
            c.fill();
            c.stroke();
            c.shadowBlur = 0;
            c.font = "500 10px 'JetBrains Mono', monospace";
            c.textAlign = "center";
            c.fillStyle = Bb;
            c.fillText(l1, n.x, n.y - 1);
            c.fillStyle = "rgba(154,160,168,0.8)";
            c.font = "8px 'JetBrains Mono', monospace";
            c.fillText(l2, n.x, n.y + 10);
        }
        function line(a: Pt, b: Pt) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
        }

        function render() {
            const c = ctx!;
            if (!W) layout();
            if (!W) return;
            c.clearRect(0, 0, W, H);
            const d = DOMAINS[di];
            // base links
            c.strokeStyle = "rgba(94,158,255,0.13)";
            c.lineWidth = 1;
            line(CL, RS);
            line(RS, ROOT);
            line(RS, TLD);
            line(RS, AUTH);
            line(RS, CA);
            // hierarchy nodes (flash while "thinking")
            node(ROOT, ". root", "13 servers", flashN === ROOT ? Cy : "rgba(94,158,255,0.5)", flashN === ROOT);
            node(TLD, d[1] + " TLD", "gTLD registry", flashN === TLD ? Cy : "rgba(94,158,255,0.5)", flashN === TLD);
            node(AUTH, "authoritative", "ns1" + d[1], flashN === AUTH ? Cy : "rgba(94,158,255,0.5)", flashN === AUTH);
            node(RS, "resolver", "recursive · Go", mode === "hit" ? "rgba(61,255,138,0.65)" : "rgba(94,158,255,0.75)", flashN === RS);
            // cache chip
            let cCol = "rgba(94,158,255,0.4)",
                cFill = "rgba(10,16,26,0.94)",
                cInk = "rgba(154,160,168,0.9)",
                cTxt = "shard cache";
            if (cacheFx) {
                if (cacheFx.k === "miss") {
                    cCol = "rgba(154,160,168,0.8)";
                    cTxt = "lookup… miss";
                } else if (cacheFx.k === "write") {
                    cCol = Am;
                    cInk = "#ffe2b3";
                    cTxt = "+ A record";
                } else {
                    cCol = Gh;
                    cFill = "rgba(61,255,138,0.18)";
                    cInk = "#d9ffe9";
                    cTxt = "HIT";
                }
            }
            c.fillStyle = cFill;
            c.strokeStyle = cCol;
            c.lineWidth = cacheFx ? 1.5 : 1.1;
            if (cacheFx) {
                c.shadowColor = cCol;
                c.shadowBlur = 10;
            }
            c.beginPath();
            c.roundRect(CA.x - 38, CA.y - 11, 76, 22, 6);
            c.fill();
            c.stroke();
            c.shadowBlur = 0;
            c.font = "8px 'JetBrains Mono', monospace";
            c.textAlign = "center";
            c.fillStyle = cInk;
            c.fillText(cTxt, CA.x, CA.y + 3);
            // client (tiny terminal)
            c.fillStyle = "rgba(10,16,26,0.94)";
            c.strokeStyle = "rgba(154,160,168,0.55)";
            c.lineWidth = 1.1;
            c.beginPath();
            c.roundRect(CL.x - 13, CL.y - 10, 26, 20, 4);
            c.fill();
            c.stroke();
            c.fillStyle = Bb;
            c.font = "9px 'JetBrains Mono', monospace";
            c.fillText("❯", CL.x, CL.y + 3);
            c.fillStyle = "rgba(154,160,168,0.9)";
            c.font = "8px 'JetBrains Mono', monospace";
            c.fillText("client", CL.x, CL.y - 16);
            // state machine
            if (hold > 0) {
                hold--;
                if (hold === 0) {
                    labels = [];
                    cacheFx = null;
                    if (mode === "miss") mode = "hit";
                    else {
                        mode = "miss";
                        di = (di + 1) % DOMAINS.length;
                    }
                    startRun();
                }
            } else if (si < steps.length) {
                const st = steps[si];
                lat += mode === "miss" ? 0.14 : 0.008;
                if (st.p) {
                    flashN = st.p;
                    if (st.cache) cacheFx = { k: st.cache };
                    st.f!--;
                    if (st.f! <= 0) {
                        if (st.cache === "miss") cacheFx = null;
                        flashN = null;
                        si++;
                        t = 0;
                    }
                } else {
                    t += st.fast ? 0.16 : 0.06;
                    const a = st.m![0],
                        b = st.m![1];
                    if (t >= 1) {
                        if (st.lb) labels.push(st.lb);
                        if (st.done) {
                            const ms = st.done === "miss" ? lat.toFixed(1) : "0.2";
                            log.push("A " + d[2] + " · " + ms + "ms " + (st.done === "miss" ? "MISS" : "HIT"));
                            if (log.length > 2) log = log.slice(-2);
                            if (st.done === "hit") lat = 0.2;
                            hold = st.done === "miss" ? 30 : 46;
                        }
                        si++;
                        t = 0;
                    } else {
                        const px = a.x + (b.x - a.x) * t,
                            py = a.y + (b.y - a.y) * t;
                        c.shadowColor = st.c!;
                        c.shadowBlur = 10;
                        c.fillStyle = "#fff";
                        c.beginPath();
                        c.arc(px, py, 3.4, 0, 6.28);
                        c.fill();
                        c.shadowBlur = 0;
                        c.globalAlpha = 0.45;
                        c.fillStyle = st.c!;
                        c.beginPath();
                        c.arc(px - (b.x - a.x) * 0.035, py - (b.y - a.y) * 0.035, 2.4, 0, 6.28);
                        c.fill();
                        c.globalAlpha = 1;
                    }
                }
            }
            // reply labels
            c.font = "8px 'JetBrains Mono', monospace";
            c.textAlign = "center";
            c.fillStyle = "rgba(207,230,255,0.9)";
            for (const lb of labels) c.fillText(lb[0], lb[1][0], lb[1][1]);
            // headline + latency + log
            c.font = "10px 'JetBrains Mono', monospace";
            c.textAlign = "left";
            c.fillStyle = Bb;
            c.fillText("resolving · " + d[0], 12, 18);
            c.textAlign = "right";
            c.fillStyle = mode === "hit" ? Gh : "rgba(207,230,255,0.8)";
            c.fillText(lat.toFixed(1) + " ms", W - 12, 18);
            c.textAlign = "left";
            for (let i = 0; i < log.length; i++) {
                const ln = log[i];
                c.fillStyle = ln.indexOf("HIT") > 0 ? Gh : ln.indexOf("MISS") > 0 ? Am : Bb;
                c.fillText(ln, 12, H - 26 + i * 14);
            }
        }

        layout();
        if (!W) return;
        startRun();

        if (reduce) {
            // Static frame: end of a walk, all replies pinned + record cached.
            const d = DOMAINS[di];
            labels = [
                ["NS → " + d[1], mid(RS, ROOT, -8)],
                ["NS → ns1" + d[1], [(RS.x + TLD.x) / 2, TLD.y - 10]],
                ["A " + d[2] + " · ttl 300", mid(RS, AUTH, 16)],
            ];
            cacheFx = { k: "write" };
            lat = 24.6;
            log = ["? " + d[0] + " A", "A " + d[2] + " · 24.6ms MISS"];
            si = steps.length; // no packet
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
        <div className="dnsr" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .dnsr { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(ellipse at 60% 30%, #0a1220, #070b12); }
                .dnsr canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
