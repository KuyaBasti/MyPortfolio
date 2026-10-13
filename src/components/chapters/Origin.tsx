"use client";

// Facts here come from John directly (grew up in the Philippines in poverty,
// moved to California in 2018) and from the resume (UC Davis CSE, June 2025;
// Quanta Manufacturing). Nothing else is claimed.
export default function Origin() {
    return (
        <section className="origin" id="origin">
            <div className="origin-head">
                <span className="num mono">03</span>
                <h2>Origin</h2>
                <span className="route mono">Philippines to California</span>
            </div>

            <div className="origin-body">
                <div className="who">
                    <div className="baybayin" lang="tl-Tglg" aria-label="John Sebastian Solon in Baybayin">ᜇ᜔ᜌᜓᜈ᜔ ᜐᜒᜊᜐ᜔ᜆᜒᜌᜈ᜔ ᜐᜓᜎᜓᜈ᜔</div>
                    <div className="english">John Sebastian Solon</div>
                </div>
                <div className="story">
                    <p>
                        I grew up in the Philippines, in poverty, and moved to California in 2018. When you have little,
                        you fix things instead of replacing them. That became my rule:{" "}
                        <strong>make it work with what you have, and make it hold.</strong>
                    </p>
                    <p>
                        B.S. in Computer Science and Engineering, UC Davis, June 2025. Now a Test Engineer at Quanta
                        Manufacturing, qualifying NVIDIA racks for a hyperscaler customer.
                    </p>
                </div>
            </div>

            <style>{`
                .origin { position: relative; padding: calc(var(--lb) + 48px) var(--pad) 120px; max-width: var(--maxw); margin: 0 auto; }
                .origin-head {
                    display: grid; grid-template-columns: 56px 1fr auto; align-items: end; gap: 24px;
                    padding-bottom: 28px; border-bottom: 1px solid var(--hairline);
                }
                .origin-head .num { font-size: 11px; color: var(--green); letter-spacing: .12em; padding-bottom: 10px; }
                .origin-head h2 { font-size: clamp(36px, 4.2vw, 58px); font-weight: 500; letter-spacing: -.026em; line-height: 1.02; }
                .origin-head .route { font-size: 11px; letter-spacing: .12em; color: var(--ink-faint); padding-bottom: 10px; }

                .origin-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: clamp(32px, 4vw, 64px); padding-top: 56px; }
                .who { display: flex; flex-direction: column; gap: 14px; }
                .baybayin { font-family: var(--font-baybayin), "Noto Sans Tagalog", "Segoe UI Historic", sans-serif; font-size: clamp(28px, 2.6vw, 36px); line-height: 1.3; color: var(--ink); }
                .english { font-size: clamp(18px, 1.5vw, 22px); font-weight: 500; letter-spacing: -.01em; color: var(--green-bright); }
                .story { display: flex; flex-direction: column; gap: 22px; max-width: 52ch; }
                .story p { font-size: clamp(17px, 1.4vw, 21px); line-height: 1.52; color: var(--ink-soft); }
                .story strong { font-weight: 600; color: var(--ink); }

                @media (max-width: 860px) {
                    .origin-head { grid-template-columns: 56px 1fr; }
                    .origin-head .route { grid-column: 2; padding-bottom: 0; }
                    .origin-body { grid-template-columns: minmax(0, 1fr); gap: 36px; padding-top: 40px; }
                }
            `}</style>
        </section>
    );
}
