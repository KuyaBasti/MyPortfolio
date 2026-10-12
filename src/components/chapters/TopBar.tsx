"use client";

import { useEffect, useState } from "react";

// Three links, centered, no brand and no location. The lit link follows the
// section under the top 45% of the viewport; Origin covers about and skills.
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
            const contact = document.getElementById("contact");
            if (contact && contact.getBoundingClientRect().top <= line) cur = -1;
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
            <nav aria-label="Sections">
                {LINKS.map((l, i) => (
                    <a key={l.href} href={l.href} className={i === current ? "is-cur" : undefined}>
                        {l.label}
                    </a>
                ))}
            </nav>

            <style>{`
                .topbar {
                    position: fixed; left: 0; right: 0; top: 0; height: var(--lb); z-index: 60;
                    display: flex; align-items: center; justify-content: center;
                    background: #000;
                    font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
                }
                .topbar nav { display: flex; gap: clamp(12px, 2.4vw, 30px); white-space: nowrap; }
                .topbar a { color: var(--ink-soft); opacity: .6; transition: opacity .3s, color .3s; }
                .topbar a:hover, .topbar a.is-cur { opacity: 1; color: var(--ink); }
                @media (max-width: 700px) { .topbar { font-size: 10px; letter-spacing: .1em; } }
            `}</style>
        </header>
    );
}
