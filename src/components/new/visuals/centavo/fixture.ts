// The Centavo card animates the repo's own synthetic test fixture, never real
// finances: a checking statement for March 7 to April 7, 2026 on account
// ending 1111. Money is integer cents, like the real ledger, and the checks
// below are the ones the real deposit-statement parser performs.

export interface Txn {
    d: string; // MM/DD as printed on the statement
    desc: string; // the printed description
    led: string; // the short ledger label
    c: number; // cents, spend negative
}

export const TXNS: Txn[] = [
    { d: "03/09", desc: "Online transfer from SAV 2222", led: "Transfer from SAV 2222", c: 37200 },
    { d: "03/10", desc: "PURCHASE 0310 THE CORNER CAFE", led: "THE CORNER CAFE", c: -4440 },
    { d: "03/13", desc: "ACME PAYROLL DES:PAYROLL", led: "ACME PAYROLL", c: 43840 },
    { d: "03/31", desc: "Monthly maintenance fee", led: "Maintenance fee", c: -599 },
    { d: "04/02", desc: "Mobile Banking payment to CRD 9999", led: "Payment to CRD 9999", c: -29488 },
];

export const BEGIN = 19605;
export const PRINTED = { deposits: 81040, withdrawals: 34527, ending: 66118 };

export function dollars(c: number): string {
    const s = Math.abs(c);
    return `${c < 0 ? "-" : ""}${Math.floor(s / 100)}.${String(s % 100).padStart(2, "0")}`;
}

export const signed = (c: number) => `${c < 0 ? "-" : "+"}${dollars(Math.abs(c))}`;

export interface Check {
    name: string;
    extracted: number;
    printed: number;
    ok: boolean;
}

// Exact integer equality, as in the real parser: one cent fails the check.
export function checks(printedDeposits = PRINTED.deposits): Check[] {
    const deposits = TXNS.filter((t) => t.c > 0).reduce((s, t) => s + t.c, 0);
    const withdrawals = -TXNS.filter((t) => t.c < 0).reduce((s, t) => s + t.c, 0);
    const mk = (name: string, extracted: number, printed: number): Check => ({ name, extracted, printed, ok: extracted === printed });
    return [
        mk("deposits", deposits, printedDeposits),
        mk("withdrawals", withdrawals, PRINTED.withdrawals),
        mk("balance", BEGIN + deposits - withdrawals, PRINTED.ending),
    ];
}

export const reconciled = (cs: Check[]) => cs.length > 0 && cs.every((c) => c.ok);

// The real rejection text names each failed check with its diff.
export function rejectionDetail(cs: Check[]): string {
    const failed = cs.filter((c) => !c.ok);
    if (!failed.length) return "";
    const parts = failed.map((c) => `${c.name}: extracted ${c.extracted} vs printed ${c.printed} (diff ${c.extracted - c.printed >= 0 ? "+" : ""}${c.extracted - c.printed})`);
    return `document does not reconcile: ${parts.join("; ")}`;
}

export interface SheetRow {
    label: string;
    amt: string;
    cents: string;
    kind: "bal" | "txn" | "tot" | "end";
}

// The statement as printed. skew prints the deposits total one cent high.
export function sheetRows(skew: boolean): SheetRow[] {
    const dep = skew ? PRINTED.deposits + 1 : PRINTED.deposits;
    return [
        { label: "Beginning balance", amt: dollars(BEGIN), cents: String(BEGIN), kind: "bal" },
        ...TXNS.map((t): SheetRow => ({ label: `${t.d}  ${t.desc}`, amt: dollars(t.c), cents: String(t.c), kind: "txn" })),
        { label: "Deposits", amt: dollars(dep), cents: String(dep), kind: "tot" },
        { label: "Withdrawals", amt: dollars(PRINTED.withdrawals), cents: String(PRINTED.withdrawals), kind: "tot" },
        { label: "Ending balance", amt: dollars(PRINTED.ending), cents: String(PRINTED.ending), kind: "end" },
    ];
}
