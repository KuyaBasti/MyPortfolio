"use client";

import { useEffect, useRef } from "react";

// Parallel Edge Detection scene visual: row-chunk decomposition, the way the
// actual pipeline worked. A procedural grayscale scene is split into 8
// horizontal chunks, one per thread, and all fronts sweep left to right
// simultaneously (with natural scheduling jitter), converting the source into
// a REAL Sobel edge map computed at setup, not a faked glow. HUD shows the
// OpenMP pragma and chunk stats; a finished pass holds on the full edge map
// with the speedup before re-running. The loop runs only while on-screen and
// resolves to the completed frame for reduced-motion. Client-only state, so
// SSR-safe.

const G = "#3dff8a",
    Gb = "#b8ffd6";
const N = 8,
    BAND = 24; // top/bottom bands reserved for the HUD

export default function ParallelEdge() {
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
            BH = 0, // band height (image area)
            SH = 0; // strip height
        let src: HTMLCanvasElement | null = null;
        let edge: HTMLCanvasElement | null = null;
        let fronts: number[] = [];
        let hold = 0;

        function makeSrc(w: number, h: number) {
            const oc = document.createElement("canvas");
            oc.width = w;
            oc.height = h;
            const c = oc.getContext("2d")!;
            c.fillStyle = "#3a3f46";
            c.fillRect(0, 0, w, h);
            c.fillStyle = "#c8ccd2";
            c.beginPath();
            c.arc(w * 0.72, h * 0.28, h * 0.15, 0, 6.28);
            c.fill();
            c.fillStyle = "#23272d";
            c.beginPath();
            c.moveTo(-10, h * 0.74);
            c.lineTo(w * 0.22, h * 0.36);
            c.lineTo(w * 0.46, h * 0.74);
            c.closePath();
            c.fill();
            c.beginPath();
            c.moveTo(w * 0.3, h * 0.74);
            c.lineTo(w * 0.54, h * 0.26);
            c.lineTo(w * 0.82, h * 0.74);
            c.closePath();
            c.fill();
            c.fillStyle = "#565c66";
            c.fillRect(w * 0.05, h * 0.46, w * 0.08, h * 0.28);
            c.fillRect(w * 0.86, h * 0.4, w * 0.09, h * 0.34);
            c.fillStyle = "#9aa2ad";
            for (let wy = 0; wy < 3; wy++)
                for (let wx = 0; wx < 2; wx++) {
                    c.fillRect(w * 0.06 + wx * w * 0.033, h * 0.49 + wy * h * 0.08, w * 0.018, h * 0.045);
                    c.fillRect(w * 0.872 + wx * w * 0.038, h * 0.43 + wy * h * 0.09, w * 0.02, h * 0.05);
                }
            c.fillStyle = "#15181d";
            c.fillRect(0, h * 0.74, w, h * 0.26);
            c.strokeStyle = "#464c55";
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(0, h * 0.74);
            c.lineTo(w, h * 0.74);
            c.stroke();
            return oc;
        }

        function sobel(oc: HTMLCanvasElement) {
            const w = oc.width,
                h = oc.height;
            const d = oc.getContext("2d")!.getImageData(0, 0, w, h).data;
            const lum = new Float32Array(w * h);
            for (let i = 0; i < w * h; i++) lum[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
            const out = document.createElement("canvas");
            out.width = w;
            out.height = h;
            const octx = out.getContext("2d")!;
            const od = octx.createImageData(w, h);
            for (let y = 1; y < h - 1; y++)
                for (let x = 1; x < w - 1; x++) {
                    const i0 = y * w + x;
                    const gx =
                        -lum[i0 - w - 1] - 2 * lum[i0 - 1] - lum[i0 + w - 1] + lum[i0 - w + 1] + 2 * lum[i0 + 1] + lum[i0 + w + 1];
                    const gy =
                        -lum[i0 - w - 1] - 2 * lum[i0 - w] - lum[i0 - w + 1] + lum[i0 + w - 1] + 2 * lum[i0 + w] + lum[i0 + w + 1];
                    const m = Math.min(255, Math.hypot(gx, gy));
                    if (m > 36) {
                        const p = i0 * 4;
                        od.data[p] = 40 + 40 * (m / 255);
                        od.data[p + 1] = 120 + 135 * (m / 255);
                        od.data[p + 2] = 90 + 48 * (m / 255);
                        od.data[p + 3] = Math.min(255, m * 1.6);
                    }
                }
            octx.putImageData(od, 0, 0);
            return out;
        }

        const reset = () => {
            fronts = Array(N).fill(0);
        };

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
            BH = H - BAND * 2;
            SH = BH / N;
            src = makeSrc(W, BH);
            edge = sobel(src);
            reset();
        }

        function render() {
            const c = ctx!;
            if (!W) layout();
            if (!W || !src || !edge) return;
            c.clearRect(0, 0, W, H);
            c.fillStyle = "#060a08";
            c.fillRect(0, 0, W, H);
            // dim source
            c.globalAlpha = 0.35;
            c.drawImage(src, 0, BAND);
            c.globalAlpha = 1;
            let allDone = true;
            for (let i = 0; i < N; i++) {
                const y0 = BAND + Math.round(i * SH),
                    hh = Math.round(SH);
                if (hold === 0 && fronts[i] < W) {
                    fronts[i] += 3.0 * (0.82 + Math.random() * 0.36);
                    if (fronts[i] < W) allDone = false;
                } else if (fronts[i] < W) allDone = false;
                const fx = Math.min(W, fronts[i]) | 0;
                if (fx > 0) {
                    c.fillStyle = "rgba(4,8,6,0.78)";
                    c.fillRect(0, y0, fx, hh);
                    c.drawImage(edge, 0, y0 - BAND, fx, hh, 0, y0, fx, hh);
                }
                if (fronts[i] < W && hold === 0) {
                    c.strokeStyle = G;
                    c.shadowColor = G;
                    c.shadowBlur = 7;
                    c.lineWidth = 1.3;
                    c.beginPath();
                    c.moveTo(fx + 0.5, y0 + 1);
                    c.lineTo(fx + 0.5, y0 + hh - 1);
                    c.stroke();
                    c.shadowBlur = 0;
                    c.fillStyle = "rgba(4,10,7,0.85)";
                    c.fillRect(fx + 3, y0 + hh / 2 - 6, 22, 12);
                    c.fillStyle = Gb;
                    c.font = "8px 'JetBrains Mono', monospace";
                    c.textAlign = "left";
                    c.fillText("t" + i, fx + 7, y0 + hh / 2 + 3);
                }
            }
            // chunk boundaries
            c.strokeStyle = "rgba(61,255,138,0.14)";
            c.lineWidth = 1;
            c.setLineDash([3, 6]);
            c.beginPath();
            for (let i = 1; i < N; i++) {
                const yb = BAND + Math.round(i * SH) + 0.5;
                c.moveTo(0, yb);
                c.lineTo(W, yb);
            }
            c.stroke();
            c.setLineDash([]);
            if (allDone && hold === 0) hold = 60;
            if (hold > 0) {
                hold--;
                if (hold === 0) reset();
            }
            // HUD (in the reserved bands, clear of the strips)
            c.font = "10px 'JetBrains Mono', monospace";
            c.textAlign = "left";
            c.fillStyle = Gb;
            c.fillText("#pragma omp parallel for · " + N + " threads", 12, 16);
            c.textAlign = "right";
            c.fillStyle = "rgba(184,255,214,0.8)";
            c.fillText(
                hold > 0 || (reduce && allDone)
                    ? "4.2 ms · 15.2× vs serial"
                    : "rows " + Math.round(BH) + " · chunk " + Math.round(SH) + " · AVX2 inner loop",
                W - 12,
                H - 9
            );
        }

        layout();
        if (!W) return;

        if (reduce) {
            // Static frame: completed pass, full edge map + final stats.
            fronts = Array(N).fill(W);
            hold = 1;
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
        <div className="pedge" ref={wrapRef}>
            <canvas ref={cvRef} />
            <style>{`
                .pedge { position: absolute; inset: 0; overflow: hidden; background: #060a08; }
                .pedge canvas { position: absolute; inset: 0; display: block; }
            `}</style>
        </div>
    );
}
