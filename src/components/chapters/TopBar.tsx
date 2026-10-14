"use client";

import { useEffect, useState } from "react";

// Brand on the left, three section links centered, a Contact button on the
// right, on a translucent bar with a hairline under it. The lit link follows
// the section under the top 45% of the viewport; Origin covers origin and skills.
const LINKS = [
    { label: "Experience", href: "#experience", ids: ["experience"] },
    { label: "Project", href: "#projects", ids: ["projects"] },
    { label: "Origin", href: "#origin", ids: ["origin", "skills"] },
];


export default function TopBar() {
    const [current, setCurrent] = useState(-1);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            raf = 0;
            const line = window.innerHeight * 0.45;
            let cur = -1;
            LINKS.forEach((l, i) => {
                for (const id of l.ids) {
                    const el = document.getElementById(id);
                    if (el && el.getBoundingClientRect().top <= line) cur = i;
                }
            });
            setCurrent(cur);
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        update();
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <header className="topbar">
            <div className="bar-in">
                <a className="brand" href="#top">John Sebastian Solon</a>
                <nav aria-label="Sections">
                    {LINKS.map((l, i) => (
                        <a key={l.href} href={l.href} className={i === current ? "is-cur" : undefined}>
                            {l.label}
                        </a>
                    ))}
                </nav>
                <a className="cta" href="#contact">Contact</a>
            </div>

            <style>{`
                .topbar {
                    position: fixed; left: 0; right: 0; top: 0; height: var(--lb); z-index: 60;
                    background: var(--bar);
                    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
                    border-bottom: 1px solid var(--hairline);
                }
                .bar-in {
                    max-width: var(--maxw); height: 100%; margin: 0 auto; padding: 0 var(--pad);
                    display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
                }
                .brand {
                    grid-column: 1; justify-self: start; font-size: 14px; font-weight: 600; letter-spacing: -.01em; color: var(--ink);
                    white-space: nowrap; transition: color .3s;
                }
                .brand:hover { color: var(--accent-bright); }
                .topbar nav {
                    grid-column: 2; display: flex; gap: clamp(12px, 2.4vw, 30px); white-space: nowrap;
                    font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
                }
                .topbar nav a { color: var(--ink-faint); transition: color .3s; }
                .topbar nav a:hover, .topbar nav a.is-cur { color: var(--ink); }
                .cta {
                    grid-column: 3; justify-self: end; font-size: 14px; font-weight: 600; letter-spacing: -.01em; color: var(--ink);
                    white-space: nowrap; transition: color .3s;
                }
                .cta:hover { color: var(--accent-bright); }
                @media (max-width: 700px) {
                    .topbar nav { font-size: 10px; letter-spacing: .1em; }
                    .brand { font-size: 13px; }
                    .cta { font-size: 13px; }
                }
                @media (max-width: 560px) {
                    .brand { display: none; }
                }
            `}</style>
        </header>
    );
}
