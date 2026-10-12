"use client";

// Facts here come from John directly (grew up in the Philippines in poverty,
// moved to California in 2018) and from the resume (UC Davis CSE, June 2025;
// Quanta Manufacturing). Nothing else is claimed.
export default function Origin() {
    return (
        <section className="origin" id="origin">
            <div className="origin-head">
                <span className="num mono">06</span>
                <h2>Origin</h2>
                <span className="route mono">Philippines to California</span>
            </div>

            <div className="origin-body">
                <div className="who">
                    <div className="baybayin" lang="tl-Tglg" aria-label="John Sebastian Solon in Baybayin">ᜇ᜔ᜌᜓᜈ᜔ ᜐᜒᜊᜐ᜔ᜆᜒᜌᜈ᜔ ᜐᜓᜎᜓᜈ᜔</div>
                    <div className="english">John Sebastian Solon</div>
                    <div className="where mono">Philippines · California since 2018</div>
                </div>
                <div className="story">
                    <p>
                        I grew up in the Philippines, in poverty. When there is not much, you learn to make what you have
                        work: fix it instead of replacing it, and understand it well enough to trust it. In 2018 I moved to
                        California, and that habit came with me. It left me with a simple rule I bring to every project:{" "}
                        <strong>make it work with what you have, and make it hold.</strong> It is also why I keep ending up at
                        the seam where hardware meets software, where the problem is physical and the fix has to be real.
                    </p>
                    <p>
                        I finished my B.S. in Computer Science and Engineering at UC Davis in June 2025, and I now qualify
                        NVIDIA racks for a hyperscaler customer at Quanta Manufacturing. What I want is work with real
                        ownership: the firmware on the metal, the systems around it, and the responsibility for making the
                        whole thing hold together.
                    </p>
                </div>
            </div>

            <style>{`
                .origin { position: relative; padding: calc(var(--lb) + 48px) var(--pad) 120px; max-width: 1480px; margin: 0 auto; }
                .origin-head {
                    display: grid; grid-template-columns: 56px 1fr auto; align-items: end; gap: 24px;
                    padding-bottom: 28px; border-bottom: 1px solid var(--hairline);
                }
                .origin-head .num { font-size: 13px; color: var(--green); letter-spacing: .08em; padding-bottom: 10px; }
                .origin-head h2 { font-size: clamp(44px, 6vw, 84px); font-weight: 600; letter-spacing: -.03em; line-height: 1; }
                .origin-head .route { font-size: 12px; letter-spacing: .08em; color: var(--ink-faint); padding-bottom: 10px; }

                .origin-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: clamp(32px, 6vw, 120px); padding-top: 56px; }
                .who { display: flex; flex-direction: column; gap: 14px; }
                .baybayin { font-family: var(--font-baybayin), "Noto Sans Tagalog", "Segoe UI Historic", sans-serif; font-size: clamp(34px, 3.6vw, 52px); line-height: 1.3; color: var(--ink); }
                .english { font-size: clamp(22px, 2vw, 30px); font-weight: 500; letter-spacing: -.01em; color: var(--green-bright); }
                .where { font-size: 12px; letter-spacing: .06em; color: var(--ink-faint); margin-top: 6px; }
                .story { display: flex; flex-direction: column; gap: 26px; max-width: 62ch; }
                .story p { font-size: clamp(17px, 1.5vw, 23px); line-height: 1.6; color: var(--ink-soft); }
                .story strong { font-weight: 600; color: var(--ink); }

                @media (max-width: 860px) {
                    .origin-head { grid-template-columns: 40px 1fr; }
                    .origin-head .route { grid-column: 2; padding-bottom: 0; }
                    .origin-body { grid-template-columns: minmax(0, 1fr); gap: 36px; padding-top: 40px; }
                }
            `}</style>
        </section>
    );
}
