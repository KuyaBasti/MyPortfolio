"use client";

import { skillCategories } from "@/data/portfolio";

// A plain table: category down the left, the tools in one mono line to the
// right, a hairline between rows. No cards, no chips.
export default function Skills() {
    return (
        <section id="skills" className="skills">
            <div className="skills-head">
                <span className="num mono">04</span>
                <h2>Skills</h2>
            </div>

            <dl className="skills-table">
                {skillCategories.map((cat) => (
                    <div className="row" key={cat.title}>
                        <dt className="mono">{cat.title}</dt>
                        <dd className="mono">
                            {cat.items.map((item, i) => (
                                <span key={item}>
                                    {i > 0 && <i> / </i>}
                                    {item}
                                </span>
                            ))}
                        </dd>
                    </div>
                ))}
            </dl>

            <style>{`
                .skills { max-width: var(--maxw); margin: 0 auto; padding: calc(var(--lb) + 48px) var(--pad) 120px; }
                .skills-head {
                    display: grid; grid-template-columns: 56px 1fr; align-items: end; gap: 24px;
                    padding-bottom: 28px; margin-bottom: 56px; border-bottom: 1px solid var(--hairline);
                }
                .skills-head .num { font-size: 11px; color: var(--accent); letter-spacing: .12em; padding-bottom: 10px; }
                .skills-head h2 { font-size: clamp(36px, 4.2vw, 58px); font-weight: 500; letter-spacing: -.026em; line-height: 1.02; }

                .skills-table { margin: 0; border-top: 1px solid var(--hairline); }
                .row {
                    display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 24px; align-items: baseline;
                    padding: 16px 0; border-bottom: 1px solid var(--hairline);
                }
                .row dt { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); }
                .row dd { margin: 0; font-size: 14px; line-height: 1.7; color: var(--ink-soft); }
                .row dd i { font-style: normal; color: var(--ink-faint); margin: 0 6px; }
                @media (max-width: 720px) {
                    .row { grid-template-columns: minmax(0, 1fr); gap: 8px; padding: 20px 0; }
                    .row dd { font-size: 13.5px; }
                    .row dd i { margin: 0 3px; }
                }
            `}</style>
        </section>
    );
}
