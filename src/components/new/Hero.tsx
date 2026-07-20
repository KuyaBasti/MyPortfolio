"use client";

import { useEffect, useRef } from "react";

type LineKind = "cmd" | "out" | "sys" | "welcome";
interface Line {
    kind: LineKind;
    text: string;
}

// The real shell session — typed in the docked terminal AFTER the decryption
// "login" finishes. Also the static content returning visitors see.
const SESSION: Line[] = [
    { kind: "cmd", text: "whoami" },
    { kind: "out", text: "John Sebastian Solon" },
    { kind: "cmd", text: "cat role.txt" },
    { kind: "out", text: "Software & Firmware Engineer · UC Davis CSE '25" },
    { kind: "cmd", text: "./launch_portfolio.sh" },
    { kind: "sys", text: "[ ok ] bridging hardware ↔ software" },
    { kind: "sys", text: "[ ok ] loading 4 roles · 10+ projects" },
    { kind: "welcome", text: "welcome, let's build something good." },
];

const PROMPT =
    '<span class="p-host">john@portfolio</span> <span class="p-path">~</span> <span class="p-pct">%</span> ';
const colorSys = (t: string) => t.replace("[ ok ]", '<span class="ok">[ ok ]</span>');

// The completed session, rendered statically as the default terminal content
// (what returning / reduced-motion visitors see; the typewriter rebuilds it).
const FULL_HTML =
    SESSION.map((item, i) => {
        const inner = item.kind === "sys" ? colorSys(item.text) : item.text;
        const prompt = item.kind === "cmd" ? PROMPT : "";
        const cursor = i === SESSION.length - 1 ? '<span class="cursor"></span>' : "";
        return `<div class="tl tl-${item.kind}">${prompt}<span class="txt">${inner}</span>${cursor}</div>`;
    }).join("");

export default function Hero() {
    const rootRef = useRef<HTMLElement>(null);
    const termRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const rainRef = useRef<HTMLCanvasElement>(null);
    const staticRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const html = document.documentElement;
        const shouldPlay = html.classList.contains("intro-on");
        if (!shouldPlay) return; // returning visitor / reduced-motion: render docked instantly

        const term = termRef.current!;
        const body = bodyRef.current!;
        const copy = copyRef.current!;
        const overlay = overlayRef.current!;
        const flash = flashRef.current!;
        const rain = rainRef.current!;
        const stat = staticRef.current!;
        const rctx = rain.getContext("2d")!;
        const sctx = stat.getContext("2d")!;

        let cancelled = false;
        let skipped = false;
        let docked = false;
        let raf = 0;
        let frame = 0;
        let running = false;
        const timers: number[] = [];
        const wait = (fn: () => void, ms: number) => {
            const id = window.setTimeout(fn, ms);
            timers.push(id);
        };

        // ── canvas FX ───────────────────────────────────────────────
        const chars = "01｢｣ｦｱｳﾘﾝ<>/=+*ABCDEF0123456789".split("");
        const fs = 15;
        let cols = 0;
        let drops: number[] = [];
        let sw = 0;
        let sh = 0;
        const sizeCanvases = () => {
            rain.width = innerWidth;
            rain.height = innerHeight;
            cols = Math.ceil(rain.width / fs);
            drops = Array.from({ length: cols }, () => (Math.random() * rain.height) / fs);
            sw = Math.ceil(innerWidth / 3);
            sh = Math.ceil(innerHeight / 3);
            stat.width = sw;
            stat.height = sh;
        };
        const drawRain = () => {
            rctx.fillStyle = "rgba(5,7,10,0.14)";
            rctx.fillRect(0, 0, rain.width, rain.height);
            rctx.font = `${fs}px 'JetBrains Mono', monospace`;
            for (let i = 0; i < cols; i++) {
                const c = chars[(Math.random() * chars.length) | 0];
                const x = i * fs;
                const y = drops[i] * fs;
                rctx.fillStyle = Math.random() < 0.03 ? "#9dffc4" : "rgba(40,200,95,0.55)";
                rctx.fillText(c, x, y);
                if (y > rain.height && Math.random() > 0.975) drops[i] = 0;
                drops[i] += 1;
            }
        };
        const drawStatic = () => {
            const img = sctx.createImageData(sw, sh);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
                const v = (Math.random() * 255) | 0;
                d[i] = d[i + 1] = d[i + 2] = v;
                d[i + 3] = (Math.random() * 30) | 0;
            }
            sctx.putImageData(img, 0, 0);
        };
        const loop = () => {
            if (!running) return;
            frame++;
            if (frame % 2 === 0) drawRain();
            drawStatic();
            raf = requestAnimationFrame(loop);
        };
        const startFX = () => {
            sizeCanvases();
            running = true;
            raf = requestAnimationFrame(loop);
        };
        const stopFX = () => {
            running = false;
            cancelAnimationFrame(raf);
        };
        const onResize = () => {
            if (running) sizeCanvases();
        };

        // ── helpers ─────────────────────────────────────────────────
        const addLine = (cls: string) => {
            const d = document.createElement("div");
            d.className = cls;
            body.appendChild(d);
            body.scrollTop = body.scrollHeight;
            return d;
        };

        // ── decryption "login" sequence (the intro) ─────────────────
        const HEXKEY = "9F3A-7C21-E1C7-04AB-D5E2";
        const HEX = "0123456789ABCDEF";

        const typeBootLine = (text: string, ok: boolean, next: () => void) => {
            const el = addLine("bl bl-sys");
            el.innerHTML = '<span class="ar">›</span> <span class="t"></span><span class="cursor"></span>';
            const t = el.querySelector(".t") as HTMLElement;
            const cur = el.querySelector(".cursor") as HTMLElement;
            let i = 0;
            const tick = () => {
                if (cancelled) return;
                if (i < text.length) {
                    t.textContent += text[i++];
                    body.scrollTop = body.scrollHeight;
                    wait(tick, 26 + Math.random() * 26);
                } else {
                    cur.remove();
                    if (ok) el.insertAdjacentHTML("beforeend", ' <span class="ok2">ok</span>');
                    wait(next, 240);
                }
            };
            wait(tick, 30);
        };

        const decryptLine = (next: () => void) => {
            const el = addLine("bl bl-dec");
            el.innerHTML = '<span class="ar">›</span> decrypting session key  <span class="key"></span>';
            const keyEl = el.querySelector(".key") as HTMLElement;
            let locked = 0;
            let f = 0;
            const scr = () => {
                if (cancelled) return;
                let out = "";
                for (let j = 0; j < HEXKEY.length; j++) {
                    if (j < locked || HEXKEY[j] === "-") out += HEXKEY[j];
                    else out += HEX[(Math.random() * HEX.length) | 0];
                }
                keyEl.textContent = out;
                f++;
                if (f % 2 === 0 && locked < HEXKEY.length) locked++;
                if (locked < HEXKEY.length) wait(scr, 45);
                else {
                    keyEl.textContent = HEXKEY;
                    el.insertAdjacentHTML("beforeend", ' <span class="ok2">decrypted</span>');
                    wait(next, 300);
                }
            };
            scr();
        };

        const progressLine = (next: () => void) => {
            const el = addLine("bl bl-prog");
            const cells = 22;
            const start = Date.now();
            const dur = 950;
            const tick = () => {
                if (cancelled) return;
                const frac = Math.min(1, (Date.now() - start) / dur);
                const filled = Math.round(frac * cells);
                el.innerHTML =
                    '<span class="ar">›</span> authenticating 0xJSS  <span class="bar">[' +
                    "█".repeat(filled) +
                    "░".repeat(cells - filled) +
                    "]</span> <span class=\"pct\">" +
                    Math.round(frac * 100) +
                    "%</span>";
                if (frac < 1) wait(tick, 45);
                else wait(next, 260);
            };
            tick();
        };

        const grantedLine = (next: () => void) => {
            const el = addLine("bl bl-granted");
            el.innerHTML = '<span class="dot2">●</span> ACCESS GRANTED';
            wait(next, 620);
        };

        const runBoot = (done: () => void) => {
            body.innerHTML = "";
            const steps: ((n: () => void) => void)[] = [
                (n) => typeBootLine("establishing secure shell", true, n),
                (n) => typeBootLine("handshake · 0xJSS@portfolio", true, n),
                (n) => decryptLine(n),
                (n) => progressLine(n),
                (n) => grantedLine(n),
            ];
            let i = 0;
            const run = () => {
                if (cancelled) return;
                if (i >= steps.length) {
                    wait(done, 360);
                    return;
                }
                steps[i++](run);
            };
            run();
        };

        // ── real session typewriter (after dock) ────────────────────
        const renderSession = () => {
            body.innerHTML = "";
            SESSION.forEach((item) => {
                const line = document.createElement("div");
                line.className = "tl tl-" + item.kind;
                if (item.kind === "cmd") line.innerHTML = PROMPT;
                const span = document.createElement("span");
                span.className = "txt";
                span.innerHTML = item.kind === "sys" ? colorSys(item.text) : item.text;
                line.appendChild(span);
                body.appendChild(line);
            });
            const last = body.lastElementChild;
            if (last) {
                const c = document.createElement("span");
                c.className = "cursor";
                last.appendChild(c);
            }
        };

        let li = 0;
        const nextLine = () => {
            if (cancelled) return;
            if (li >= SESSION.length) return; // session done; cursor blinks on welcome
            const item = SESSION[li];
            const line = document.createElement("div");
            line.className = "tl tl-" + item.kind;
            if (item.kind === "cmd") line.innerHTML = PROMPT;
            const span = document.createElement("span");
            span.className = "txt";
            line.appendChild(span);
            const cur = document.createElement("span");
            cur.className = "cursor";
            line.appendChild(cur);
            body.appendChild(line);

            const speed = item.kind === "cmd" ? 46 : 9;
            const text = item.text;
            let ci = 0;
            const typeChar = () => {
                if (cancelled) return;
                if (ci < text.length) {
                    ci++;
                    if (item.kind === "sys") span.innerHTML = colorSys(text.slice(0, ci));
                    else span.textContent = text.slice(0, ci);
                    body.scrollTop = body.scrollHeight;
                    const jitter = item.kind === "cmd" ? Math.random() * 38 : 0;
                    wait(typeChar, speed + jitter);
                } else {
                    li++;
                    if (item.kind === "welcome") return; // keep cursor blinking
                    cur.remove();
                    wait(nextLine, item.kind === "cmd" ? 200 : 90);
                }
            };
            wait(typeChar, item.kind === "out" || item.kind === "sys" ? 130 : 30);
        };
        const typeSession = () => {
            if (skipped) {
                renderSession();
                return;
            }
            body.innerHTML = "";
            li = 0;
            nextLine();
        };

        // ── dock (login complete → reveal + type the real session) ──
        const dock = () => {
            if (docked) return;
            docked = true;
            cleanupBail();
            flash.classList.remove("go");
            void flash.offsetWidth;
            flash.classList.add("go");
            overlay.classList.add("out");
            term.classList.remove("boot");
            term.style.transition = "transform .9s cubic-bezier(0.7,0,0.2,1), opacity .4s ease";
            term.style.transform = "none";
            copy.classList.add("in");
            wait(typeSession, skipped ? 0 : 480);
            wait(() => {
                stopFX();
                html.classList.remove("intro-on");
            }, 1000);
            try {
                sessionStorage.setItem("introPlayed", "1");
            } catch {}
        };

        // ── bail (skip / key / scroll) ──────────────────────────────
        const bail = () => {
            skipped = true;
            dock();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") bail();
        };
        const skipBtn = overlay.querySelector(".boot-skip") as HTMLButtonElement | null;
        const cleanupBail = () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", bail);
            window.removeEventListener("touchmove", bail);
            skipBtn?.removeEventListener("click", bail);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", bail, { passive: true, once: true });
        window.addEventListener("touchmove", bail, { passive: true, once: true });
        skipBtn?.addEventListener("click", bail);
        window.addEventListener("resize", onResize);

        // ── kick off: boot terminal centered, run decryption ────────
        const rect = term.getBoundingClientRect();
        const scale = Math.min(600, innerWidth * 0.9) / rect.width;
        const tx = innerWidth / 2 - (rect.left + rect.width / 2);
        const ty = innerHeight / 2 - (rect.top + rect.height / 2);
        term.classList.add("boot");
        term.style.transition = "none";
        term.style.transform = `translate(${tx}px, ${ty}px) scale(${scale.toFixed(3)})`;
        void term.offsetWidth;
        term.style.transition = "opacity .45s ease";
        term.style.opacity = "1";
        body.innerHTML = "";
        startFX();
        wait(() => runBoot(dock), 80);

        return () => {
            cancelled = true;
            cleanupBail();
            window.removeEventListener("resize", onResize);
            stopFX();
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <section className="hero" ref={rootRef} id="top">
            {/* Dark hacker boot overlay (shown only when html.intro-on) */}
            <div className="boot-overlay" ref={overlayRef} aria-hidden>
                <canvas className="boot-rain" ref={rainRef} />
                <canvas className="boot-static" ref={staticRef} />
                <div className="boot-scan" />
                <div className="boot-vig" />
                <div className="boot-flick" />
                <div className="boot-hud">
                    secure shell // 0xJSS · <span className="blip">breaching session…</span>
                </div>
                <button className="boot-skip" type="button">
                    skip intro ›
                </button>
            </div>
            <div className="boot-flash" ref={flashRef} aria-hidden />

            <div className="hero-grid">
                <div className="hero-copy" ref={copyRef}>
                    <h1 className="hero-h1">
                        The space between
                        <br />
                        <span className="iri">hardware and software.</span>
                    </h1>
                    <p className="hero-sub">
                        I&apos;m John Sebastian Solon, a Software, Firmware &amp; Systems Engineer who
                        builds the rare things that work end-to-end: from the firmware on the metal to
                        the cloud that talks to it.
                    </p>
                    <div className="hero-cta">
                        <a className="hero-btn" href="#projects">
                            See my work
                        </a>
                    </div>
                </div>

                <div className="hero-term" ref={termRef}>
                    <div className="hero-term-bar">
                        <span className="hero-dot r" />
                        <span className="hero-dot y" />
                        <span className="hero-dot g" />
                        <span className="hero-term-title">john@portfolio · zsh</span>
                    </div>
                    <div
                        className="hero-term-body"
                        ref={bodyRef}
                        dangerouslySetInnerHTML={{ __html: FULL_HTML }}
                    />
                </div>
            </div>

            <style>{`
                .hero { position: relative; }
                .hero-grid {
                    min-height: 100vh; display: grid;
                    grid-template-columns: 1.05fr 0.95fr;
                    align-items: center; gap: 56px;
                    max-width: 1180px; margin: 0 auto; padding: 96px 40px 60px;
                }
                .hero-h1 { font-size: clamp(38px, 4.8vw, 76px); font-weight: 600; line-height: 1.05; letter-spacing: -0.025em; margin-bottom: 20px; }
                .hero-sub { font-size: clamp(17px, 1.5vw, 21px); color: var(--ink-soft); line-height: 1.45; max-width: 540px; margin-bottom: 30px; }
                .hero-cta { display: flex; gap: 22px; align-items: center; flex-wrap: wrap; }
                .hero-btn { background: var(--green); color: #05140a; font-weight: 600; padding: 13px 26px; border-radius: 12px; font-size: 16px; transition: transform .2s, box-shadow .2s; box-shadow: 0 0 0 1px var(--green-dim), 0 0 28px -6px rgba(40,200,90,0.5); }
                .hero-btn:hover { transform: translateY(-1px); box-shadow: 0 0 0 1px var(--green), 0 0 40px -6px rgba(40,200,90,0.75); }

                /* Terminal */
                .hero-term {
                    position: relative; width: 100%; max-width: 560px; justify-self: end;
                    background: #0c0f14; border: 1px solid rgba(255,255,255,0.09); border-radius: 14px;
                    overflow: hidden; box-shadow: 0 0 0 1px rgba(40,200,90,0.10), 0 0 60px -16px rgba(40,200,90,0.28), 0 30px 80px -30px #000;
                }
                html.intro-on .hero-term { z-index: 210; opacity: 0; }
                .hero-term.boot { box-shadow: 0 0 0 1px rgba(70,255,150,0.18), 0 0 70px rgba(40,200,90,0.25), 0 30px 90px -20px rgba(0,0,0,0.7); }
                .hero-term-bar { position: relative; height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 14px; background: #131820; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .hero-dot { width: 12px; height: 12px; border-radius: 50%; }
                .hero-dot.r { background: #ff5f57; } .hero-dot.y { background: #febc2e; } .hero-dot.g { background: #28c840; }
                .hero-term-title { position: absolute; left: 0; right: 0; text-align: center; font-family: var(--font-mono); font-size: 12.5px; color: #8b8b93; pointer-events: none; }
                .hero-term-body { font-family: var(--font-mono); font-size: 14.5px; line-height: 1.75; color: #c9d1d9; padding: 22px 24px 26px; min-height: 232px; }
                .tl { white-space: pre-wrap; word-break: break-word; }
                .p-host { color: #56d364; } .p-path { color: #79c0ff; } .p-pct { color: #8b949e; }
                .tl-cmd .txt { color: #f0f6fc; }
                .tl-out .txt { color: #c9d1d9; }
                .tl-sys .txt { color: #9aa0a8; }
                .tl-sys .ok { color: #56d364; }
                .tl-welcome .txt { background: var(--iri); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: iriShift 8s linear infinite; font-size: 15.5px; }
                .cursor { display: inline-block; width: 8px; height: 16px; margin-left: 2px; vertical-align: -3px; background: #f0f6fc; animation: termBlink 1s steps(1) infinite; }
                @keyframes termBlink { 50% { opacity: 0; } }

                /* Decryption boot lines */
                .bl { white-space: pre-wrap; word-break: break-word; color: #6fe08a; }
                .bl .ar { color: rgba(86,255,150,0.55); margin-right: 8px; }
                .bl .t { color: #8fe6a6; }
                .bl-sys .ok2, .bl-dec .ok2 { color: #9dffc4; }
                .bl-dec .key { color: #b9ffce; letter-spacing: 0.08em; }
                .bl-prog .bar { color: #9dffc4; letter-spacing: 0; }
                .bl-prog .pct { color: #56d364; }
                .bl-granted { color: #9dffc4; font-weight: 600; letter-spacing: 0.14em; margin-top: 8px; animation: bootGlitch .32s steps(2) 2; }
                .bl-granted .dot2 { color: #28c840; margin-right: 8px; }
                @keyframes bootGlitch {
                    0%,100% { text-shadow: none; transform: translateX(0); }
                    25% { text-shadow: 2px 0 #ff3b6b, -2px 0 #21d4fd; transform: translateX(1px); }
                    50% { text-shadow: -2px 0 #ff3b6b, 2px 0 #21d4fd; transform: translateX(-1px); }
                }

                /* Copy reveal */
                .hero-copy { transition: opacity .7s ease .2s, transform .7s ease .2s; }
                html.intro-on .hero-copy { opacity: 0; transform: translateX(-24px); }
                .hero-copy.in { opacity: 1; transform: none; }

                /* Dark hacker boot overlay */
                .boot-overlay { display: none; position: fixed; inset: 0; z-index: 200; background: #05070a; overflow: hidden; transition: opacity .85s ease; }
                html.intro-on .boot-overlay { display: block; }
                .boot-overlay.out { opacity: 0; pointer-events: none; }
                .boot-overlay canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
                .boot-rain { opacity: 0.5; }
                .boot-static { opacity: 0.07; image-rendering: pixelated; mix-blend-mode: screen; }
                .boot-scan { position: absolute; inset: 0; pointer-events: none; opacity: 0.55; background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.28) 2px 3px); animation: bootScan 7s linear infinite; }
                .boot-vig { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.72) 100%); }
                .boot-flick { position: absolute; inset: 0; pointer-events: none; background: #1aff7a; opacity: 0; mix-blend-mode: overlay; animation: bootFlick 4s steps(1) infinite; }
                .boot-hud { position: absolute; left: 26px; bottom: 22px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; color: rgba(86,255,150,0.5); }
                .boot-hud .blip { color: rgba(86,255,150,0.9); }
                .boot-skip { position: absolute; top: 22px; right: 26px; font-family: var(--font-mono); font-size: 13px; color: rgba(255,255,255,0.55); background: none; border: none; cursor: pointer; transition: color .2s; }
                .boot-skip:hover { color: #fff; }
                @keyframes bootScan { to { background-position: 0 7px; } }
                @keyframes bootFlick { 0%,96%,100% { opacity: 0; } 97% { opacity: 0.05; } 98.5% { opacity: 0.09; } }

                /* Reveal pulse — subtle green "system online", settles into the dark rain (no white flash) */
                .boot-flash { position: fixed; inset: 0; z-index: 205; background: radial-gradient(ellipse at 50% 40%, rgba(40,255,140,0.18), rgba(40,255,140,0) 60%); opacity: 0; pointer-events: none; }
                .boot-flash.go { animation: bootFlash .9s ease forwards; }
                @keyframes bootFlash { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }

                @media (max-width: 900px) {
                    .hero-grid { grid-template-columns: 1fr; gap: 36px; padding: 110px 24px 60px; }
                    .hero-term { justify-self: center; }
                    .hero-sub { margin-left: 0; margin-right: 0; }
                }
            `}</style>
        </section>
    );
}
