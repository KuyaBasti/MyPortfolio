"use client";

import { useEffect, useRef } from "react";

const NAME = "John Sebastian Solon";
const ROLE = "Software, Firmware & Systems Engineer";
const CURRENT = { company: "Quanta Manufacturing", href: "#experience" };

// Glyphs the name scrambles through; a slot only ever shows glyphs narrower
// than its own letter, so nothing spills over its neighbour.
const CIPHER = "ABCDEF0123456789#$%&@*+<>/=?!|:I";

function mulberry32(a: number) {
    return () => {
        a |= 0; a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default function Hero() {
    const stageRef = useRef<HTMLDivElement>(null);
    const dustRef = useRef<HTMLCanvasElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);

    // The title decrypt: cipher glyphs lock into the name left to right.
    useEffect(() => {
        const nameEl = nameRef.current;
        if (!nameEl) return;
        const glyphs = Array.from(nameEl.querySelectorAll<HTMLSpanElement>(".c"));
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let pools: string[][] = [];

        // Each glyph box is sized to its final letter and carries its slice of
        // one gradient per line, so wrapped lines each sweep the whole gradient.
        const layout = () => {
            const shown = glyphs.map((g) => g.textContent);
            glyphs.forEach((g) => { g.textContent = g.dataset.ch ?? ""; g.style.width = ""; });
            const widths = glyphs.map((g) => g.getBoundingClientRect().width);
            glyphs.forEach((g, i) => { g.style.width = `${widths[i]}px`; g.textContent = shown[i]; });
            const rects = glyphs.map((g) => g.getBoundingClientRect());
            const lines: { top: number; left: number; right: number; idx: number[] }[] = [];
            rects.forEach((r, i) => {
                const L = lines.find((l) => Math.abs(l.top - r.top) < 2);
                if (L) { L.idx.push(i); L.left = Math.min(L.left, r.left); L.right = Math.max(L.right, r.right); }
                else lines.push({ top: r.top, left: r.left, right: r.right, idx: [i] });
            });
            lines.forEach((L) => {
                const W = Math.max(1, L.right - L.left);
                L.idx.forEach((i) => {
                    glyphs[i].style.setProperty("--gw", `${W}px`);
                    glyphs[i].style.setProperty("--gx", `${L.left - rects[i].left}px`);
                });
            });
            const probe = glyphs[0].cloneNode(false) as HTMLSpanElement;
            probe.style.width = ""; probe.classList.remove("scr", "front");
            glyphs[0].parentElement?.appendChild(probe);
            const adv: Record<string, number> = {};
            for (const ch of CIPHER) { probe.textContent = ch; adv[ch] = probe.getBoundingClientRect().width; }
            probe.remove();
            const narrowest = [...CIPHER].sort((a, b) => adv[a] - adv[b])[0];
            pools = widths.map((w) => { const fit = [...CIPHER].filter((ch) => adv[ch] <= w + 0.5); return fit.length ? fit : [narrowest]; });
        };
        layout();
        let fontsDone = false;
        document.fonts?.ready.then(() => { fontsDone = true; layout(); });
        let rz = 0;
        const onResize = () => { clearTimeout(rz); rz = window.setTimeout(layout, 120); };
        window.addEventListener("resize", onResize, { passive: true });

        let raf = 0;
        if (!reduce && glyphs.length) {
            const rnd = mulberry32(20250612);
            const T0 = performance.now(), START = 500, HOLD = 400, STEP = 95, RATE = 45;
            const pick = (i: number) => { const pool = pools[i] ?? [CIPHER[0]]; return pool[Math.floor(rnd() * pool.length)]; };
            let lastSwap = -1;
            glyphs.forEach((g, i) => { g.classList.add("scr"); g.textContent = pick(i); });
            const frame = (now: number) => {
                const t = now - T0 - START;
                const swap = now - lastSwap >= RATE;
                if (swap) lastSwap = now;
                let pending = false;
                glyphs.forEach((g, i) => {
                    const lockAt = HOLD + i * STEP;
                    if (t >= lockAt) {
                        if (g.classList.contains("scr")) { g.classList.remove("scr", "front"); g.textContent = g.dataset.ch ?? ""; }
                    } else {
                        pending = true;
                        g.classList.toggle("front", t >= lockAt - STEP * 1.5);
                        if (swap) g.textContent = pick(i);
                    }
                });
                if (pending) raf = requestAnimationFrame(frame);
                else if (!fontsDone) layout();
            };
            raf = requestAnimationFrame(frame);
        }
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(rz);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    // Dust: slow drifting WebGL particles behind the title, degrading to the
    // CSS light leaks alone. The copy lifts and fades as the hero scrolls away.
    useEffect(() => {
        const canvas = dustRef.current, stage = stageRef.current, body = bodyRef.current;
        if (!canvas || !stage || !body) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let disposed = false, raf = 0;
        let tick: ((t: number, s: number) => void) | null = null;
        let resize: (() => void) | null = null;
        let dispose: (() => void) | null = null;

        (async () => {
            try {
                const THREE = await import("three");
                if (disposed) return;
                const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                renderer.setClearColor(0x000000, 0);
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 60);
                camera.position.z = 9;
                const rnd = mulberry32(90210);
                const N = 900, pos = new Float32Array(N * 3), seed = new Float32Array(N);
                for (let i = 0; i < N; i++) { pos[i * 3] = (rnd() - 0.5) * 24; pos[i * 3 + 1] = (rnd() - 0.5) * 12; pos[i * 3 + 2] = (rnd() - 0.5) * 8; seed[i] = rnd(); }
                const geo = new THREE.BufferGeometry();
                geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
                geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
                // The dust color comes from the --dust token (raw sRGB, no color management).
                const hex3 = (v: string, d: string) => { const h = (/^#[0-9a-f]{6}$/i.test(v) ? v : d).slice(1); return new THREE.Vector3(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255); };
                const dustColor = hex3(getComputedStyle(document.documentElement).getPropertyValue("--dust").trim(), "#efece7");
                const mat = new THREE.ShaderMaterial({
                    uniforms: { uTime: { value: 0 }, uDpr: { value: renderer.getPixelRatio() }, uColor: { value: dustColor } },
                    vertexShader: `
                        attribute float aSeed; uniform float uTime; uniform float uDpr; varying float vA; varying float vS;
                        void main(){
                            vec3 p = position;
                            float sp = 0.15 + aSeed * 0.35;
                            p.y = mod(p.y + uTime * sp * 0.35 + 6.0, 12.0) - 6.0;
                            p.x += sin(uTime * 0.11 + aSeed * 6.2831) * 0.8;
                            p.z += cos(uTime * 0.07 + aSeed * 3.1) * 0.5;
                            vec4 mv = modelViewMatrix * vec4(p, 1.0);
                            float big = step(0.955, aSeed);
                            float sz = mix(1.2 + aSeed * 2.2, 9.0 + aSeed * 10.0, big);
                            gl_PointSize = sz * uDpr * (9.0 / -mv.z);
                            float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.2) + aSeed * 40.0);
                            vA = mix(0.55, 0.12, big) * tw; vS = aSeed;
                            gl_Position = projectionMatrix * mv;
                        }`,
                    fragmentShader: `
                        precision mediump float; varying float vA; varying float vS; uniform vec3 uColor;
                        void main(){
                            float d = length(gl_PointCoord - 0.5);
                            float a = smoothstep(0.5, 0.08, d) * vA;
                            vec3 col = uColor;
                            gl_FragColor = vec4(col, a);
                        }`,
                    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
                });
                scene.add(new THREE.Points(geo, mat));
                resize = () => {
                    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
                    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
                };
                tick = (t, s) => {
                    mat.uniforms.uTime.value = t;
                    camera.position.x = Math.sin(t * 0.07) * 0.35;
                    camera.position.y = Math.cos(t * 0.05) * 0.2 - s * 1.4;
                    camera.lookAt(0, -s * 1.4, 0);
                    renderer.render(scene, camera);
                };
                dispose = () => { geo.dispose(); mat.dispose(); renderer.dispose(); };
                resize();
                if (reduce) tick(12, 0);
            } catch {
                canvas.remove();
            }
        })();

        const t0 = performance.now();
        const onFrame = (now: number) => {
            const vh = window.innerHeight, y = window.scrollY;
            if (y < vh * 1.1) {
                const k = Math.min(1, Math.max(0, y / vh));
                body.style.transform = `translate3d(0,${(k * vh * 0.3).toFixed(1)}px,0)`;
                body.style.opacity = Math.min(1, Math.max(0, 1 - k * 1.3)).toFixed(3);
                if (tick && document.visibilityState === "visible") tick((now - t0) / 1000, k);
            }
            raf = requestAnimationFrame(onFrame);
        };
        if (!reduce) raf = requestAnimationFrame(onFrame);
        const ro = new ResizeObserver(() => { resize?.(); if (reduce) tick?.(12, 0); });
        ro.observe(stage);
        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            dispose?.();
        };
    }, []);

    const words = NAME.split(" ");

    return (
        <section className="hero" id="top">
            <div className="stage" ref={stageRef} aria-hidden="true">
                <canvas className="dust" ref={dustRef} />
            </div>
            <div className="hero-body" ref={bodyRef}>
                <p className="pre">{ROLE}</p>
                <h1 className="name" ref={nameRef} aria-label={NAME}>
                    {words.map((w, wi) => (
                        <span key={wi}>
                            {wi > 0 ? " " : null}
                            <span className="w">
                                {[...w].map((ch, ci) => (
                                    <span key={ci} className="c" data-ch={ch} aria-hidden="true">{ch}</span>
                                ))}
                            </span>
                        </span>
                    ))}
                </h1>
                <p className="l2">Currently at <a href={CURRENT.href}>{CURRENT.company}</a></p>
            </div>

            <style>{`
                .hero {
                    position: relative; min-height: 100vh; min-height: 100svh; overflow: hidden; isolation: isolate;
                    display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;
                    /* Content sits in the top quarter of the screen, not centered: the name lands about 25vh down. */
                    padding: calc(var(--lb) + 15vh) var(--pad) 28px;
                    padding-top: calc(var(--lb) + 15svh);
                }
                .hero .stage {
                    position: absolute; inset: 0; z-index: 0; overflow: hidden;
                    background: var(--bg);
                }
                .hero .dust { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
                .hero-body {
                    position: relative; z-index: 2; width: 100%; max-width: calc(var(--maxw) - 2 * var(--pad)); margin: 0 auto;
                    display: flex; flex-direction: column; align-items: flex-start; gap: clamp(14px, 2vh, 22px);
                    will-change: transform, opacity;
                }
                .pre { font-family: var(--font-mono); font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); }
                .name {
                    font-size: clamp(44px, 8.6vw, 112px); line-height: 1.02; font-weight: 600; letter-spacing: -.035em;
                    max-width: 100%; margin: 2px 0 6px;
                }
                .name .w { display: inline-block; white-space: nowrap; }
                .name .c {
                    display: inline-block; text-align: center;
                    background: var(--iri); background-size: var(--gw, 100%) 100%; background-position: var(--gx, 0) 0;
                    -webkit-background-clip: text; background-clip: text; color: transparent;
                    transition: color .45s ease, opacity .45s ease, text-shadow .45s ease;
                }
                .name .c.scr { color: var(--accent); opacity: .78; transition: none; }
                .name .c.front { color: var(--accent-bright); opacity: 1; text-shadow: 0 0 22px var(--accent-glow); }
                .l2 { font-size: clamp(16px, 1.5vw, 21px); line-height: 1.3; color: var(--ink-soft); }
                .l2 a { color: var(--accent-bright); border-bottom: 1px solid var(--accent-line); transition: color .3s, border-color .3s; }
                .l2 a:hover { color: #fff; border-color: var(--accent); }
                .hero-body > * { opacity: 0; animation: rise 1.2s cubic-bezier(.2,.7,.2,1) forwards; }
                .hero-body > .pre { animation-delay: .2s; }
                .hero-body > .name { animation-delay: .4s; }
                .hero-body > .l2 { animation-delay: 2.95s; }
                @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
                @media (prefers-reduced-motion: reduce) {
                    .hero-body > * { animation: none; opacity: 1; transform: none; }
                    .name .c { transition: none; }
                }
            `}</style>
        </section>
    );
}
