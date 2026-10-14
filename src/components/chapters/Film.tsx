"use client";

// The page-wide film chrome: a soft vignette and a stepping grain over
// everything. Purely decorative; both are still under reduced motion.
export default function Film() {
    return (
        <>
            <div className="film-vig" aria-hidden="true" />
            <div className="film-grain" aria-hidden="true" />
            <style>{`
                .film-vig {
                    position: fixed; inset: 0; z-index: 39; pointer-events: none;
                    background: radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,var(--vignette, .6)) 100%);
                }
                .film-grain {
                    position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; z-index: 40; pointer-events: none;
                    opacity: .06; mix-blend-mode: screen;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    animation: filmGrain .9s steps(5) infinite;
                }
                @keyframes filmGrain {
                    0% { transform: translate(0,0); } 20% { transform: translate(-3%,2%); } 40% { transform: translate(2%,-4%); }
                    60% { transform: translate(-4%,-1%); } 80% { transform: translate(3%,3%); } 100% { transform: translate(0,0); }
                }
                @media (prefers-reduced-motion: reduce) { .film-grain { animation: none; } }
            `}</style>
        </>
    );
}
