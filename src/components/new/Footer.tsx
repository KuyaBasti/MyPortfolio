import { contactLinks } from "@/data/portfolio";

// The contact block at the very bottom, numbered like the other sections: a
// plain table of email, GitHub and LinkedIn with an arrow on each row, then a one-line footer. The top bar's
// Contact button lands here.
const SHOW = ["Email", "GitHub", "LinkedIn"];
const display = (label: string, value: string) =>
    label === "GitHub" ? `github.com/${value}` : label === "LinkedIn" ? `linkedin.com/in/${value}` : value;

export default function Footer() {
    const rows = contactLinks.filter((c): c is typeof c & { href: string } => SHOW.includes(c.label) && !!c.href);
    return (
        <footer className="foot" id="contact">
            <div className="foot-head">
                <span className="num mono">05</span>
                <h2>Contact</h2>
            </div>

            <div className="contact-table">
                {rows.map((c) => (
                    <a className="crow" key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                        <span className="k mono">{c.label}</span>
                        <span className="v">{display(c.label, c.value)}</span>
                        <span className="arrow" aria-hidden="true">↗</span>
                    </a>
                ))}
            </div>

            <div className="foot-line mono">
                <span>© {new Date().getFullYear()} John Sebastian Solon</span>
                <a href="#top">Back to top</a>
            </div>

            <style>{`
                .foot { max-width: var(--maxw); margin: 0 auto; padding: calc(var(--lb) + 48px) var(--pad) 40px; }
                .foot-head {
                    display: grid; grid-template-columns: 56px 1fr; align-items: end; gap: 24px;
                    padding-bottom: 28px; margin-bottom: 56px; border-bottom: 1px solid var(--hairline);
                }
                .foot-head .num { font-size: 11px; color: var(--green); letter-spacing: .12em; padding-bottom: 10px; }
                .foot-head h2 { font-size: clamp(36px, 4.2vw, 58px); font-weight: 500; letter-spacing: -.026em; line-height: 1.02; }
                .contact-table { margin: 0; border-top: 1px solid var(--hairline); }
                .crow {
                    display: grid; grid-template-columns: 160px minmax(0, 1fr) auto; gap: 24px; align-items: center;
                    padding: 24px 0; border-bottom: 1px solid var(--hairline); color: inherit; text-decoration: none;
                    transition: color .3s;
                }
                .crow .k { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--green); }
                .crow .v { font-size: 17px; color: var(--ink); letter-spacing: -.005em; transition: color .3s; }
                .crow .arrow { font-size: 14px; color: var(--ink-faint); transition: color .3s, transform .3s; }
                .crow:hover .v, .crow:hover .arrow { color: var(--green-bright); }
                .crow:hover .arrow { transform: translate(2px, -2px); }

                .foot-line {
                    display: flex; justify-content: space-between; align-items: center; gap: 16px;
                    margin-top: 72px; padding-top: 24px; border-top: 1px solid var(--hairline);
                    font-size: 11px; letter-spacing: .06em; color: var(--ink-faint);
                }
                .foot-line a { color: var(--ink-faint); transition: color .3s; }
                .foot-line a:hover { color: var(--ink); }

                @media (max-width: 720px) {
                    .crow { grid-template-columns: minmax(0, 1fr) auto; gap: 6px 16px; padding: 18px 0; }
                    .crow .k { grid-column: 1 / -1; }
                    .crow .v { font-size: 15px; word-break: break-all; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .crow, .crow .v, .crow .arrow, .foot-line a { transition: none; }
                    .crow:hover .arrow { transform: none; }
                }
            `}</style>
        </footer>
    );
}
