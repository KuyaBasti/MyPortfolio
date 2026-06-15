export default function Footer() {
    return (
        <footer
            className="px-[22px] py-[30px] text-center text-[12px]"
            style={{
                color: "var(--ink-faint)",
                borderTop: "1px solid var(--hairline)",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            © {new Date().getFullYear()} John Sebastian Solon. Designed and built with care.
        </footer>
    );
}
