import { describe, expect, it } from "vitest";
import { BEGIN, PRINTED, TXNS, checks, dollars, reconciled, rejectionDetail, sheetRows, signed } from "../fixture";

describe("the synthetic statement", () => {
    it("reconciles to the cent on all three checks", () => {
        const cs = checks();
        expect(cs.map((c) => c.name)).toEqual(["deposits", "withdrawals", "balance"]);
        expect(cs.map((c) => [c.extracted, c.printed])).toEqual([
            [81040, 81040],
            [34527, 34527],
            [66118, 66118],
        ]);
        expect(reconciled(cs)).toBe(true);
        expect(rejectionDetail(cs)).toBe("");
    });

    it("keeps the arithmetic the card prints: 19605 + 81040 - 34527 = 66118", () => {
        expect(BEGIN + PRINTED.deposits - PRINTED.withdrawals).toBe(PRINTED.ending);
        expect(TXNS.reduce((s, t) => s + t.c, 0)).toBe(PRINTED.deposits - PRINTED.withdrawals);
    });

    it("rejects a printed total that is one cent off, naming the diff", () => {
        const cs = checks(PRINTED.deposits + 1);
        expect(cs[0].ok).toBe(false);
        expect(cs[1].ok).toBe(true);
        expect(cs[2].ok).toBe(true);
        expect(reconciled(cs)).toBe(false);
        expect(rejectionDetail(cs)).toBe("document does not reconcile: deposits: extracted 81040 vs printed 81041 (diff -1)");
    });

    it("never reconciles an empty check list", () => {
        expect(reconciled([])).toBe(false);
    });
});

describe("money formatting", () => {
    it("formats integer cents without floats", () => {
        expect(dollars(66118)).toBe("661.18");
        expect(dollars(-599)).toBe("-5.99");
        expect(dollars(5)).toBe("0.05");
        expect(signed(37200)).toBe("+372.00");
        expect(signed(-29488)).toBe("-294.88");
    });
});

describe("the printed sheet", () => {
    it("has nine rows and prints 810.41 only when skewed", () => {
        expect(sheetRows(false)).toHaveLength(9);
        expect(sheetRows(false)[6]).toMatchObject({ label: "Deposits", amt: "810.40", cents: "81040" });
        expect(sheetRows(true)[6]).toMatchObject({ label: "Deposits", amt: "810.41", cents: "81041" });
        expect(sheetRows(true)[8]).toMatchObject({ label: "Ending balance", amt: "661.18" });
    });
});
