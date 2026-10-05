import { describe, expect, it } from "vitest";
import { MATCHES } from "../matches";
import {
    ANCIENT,
    FIGHT,
    OBJECTIVE,
    STATIC_CLOCK,
    aegisAt,
    casualtiesAt,
    describe as describeBeat,
    fallenAt,
    feedAt,
    heroNetWorthAt,
    heroTags,
    leadSeries,
    markersAt,
    mmss,
    positionsAt,
    sameDraft,
    spreadDots,
    structurePoint,
    teamNetWorthAt,
    winProb,
} from "../replay";

const seed42 = MATCHES[0];

describe("exported match data", () => {
    it.each(MATCHES.map((m) => [m.id, m] as const))("%s is a complete, well-formed replay", (_, m) => {
        expect(m.heroes).toHaveLength(10);
        expect(new Set(m.heroes).size).toBe(10);
        expect(m.nw).toHaveLength(m.ticks * 10);
        expect(m.pos).toHaveLength(m.ticks * 20);
        expect(m.dur).toBe(m.ticks * 30);
        for (const v of m.pos) expect(v >= 0 && v <= 200).toBe(true);
        for (let i = 1; i < m.beats.length; i++) expect(m.beats[i][1]).toBeGreaterThanOrEqual(m.beats[i - 1][1]);
        const last = m.beats[m.beats.length - 1];
        expect(last).toEqual([OBJECTIVE, m.dur, m.winner, 5, -1]);
        const winnerTakes = m.beats.filter((b) => b[0] === OBJECTIVE && b[2] === m.winner);
        expect(winnerTakes.map((b) => b[3])).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    });

    it("seed 42 matches the engine's shipped demo game", () => {
        expect(seed42.id).toBe("7.41e-seed42");
        expect(seed42.dur).toBe(2040);
        expect(seed42.events).toBe(260);
        expect(seed42.winner).toBe(1);
        const [r, d] = teamNetWorthAt(seed42, seed42.dur);
        expect(r).toBeCloseTo(69099.3, 5);
        expect(d).toBeCloseTo(112088.4, 5);
    });

    // The engine rounds per-hero and team net worths separately, so hero sums
    // sit within 0.2 gold of its team totals; the sign must always survive.
    it.each([
        [0, 1.5],
        [1, 2.5],
        [2, -9.4],
    ])("match %i keeps the engine's opening lead (%d), sign included", (i, engineLead) => {
        const lead = leadSeries(MATCHES[i])[1];
        expect(Math.abs(lead - engineLead)).toBeLessThanOrEqual(0.2 + 1e-9);
        expect(Math.sign(lead)).toBe(Math.sign(engineLead));
    });

    it("the loop shows one draft replayed on two seeds, then a new draft", () => {
        expect(sameDraft(MATCHES[0], MATCHES[1])).toBe(true);
        expect(MATCHES[0].winner).not.toBe(MATCHES[1].winner);
        expect(sameDraft(MATCHES[1], MATCHES[2])).toBe(false);
    });
});

describe("hero tags", () => {
    it("follows the real viewer's greedy two-letter rule", () => {
        const tags = heroTags(seed42.heroes);
        expect(tags[seed42.heroes.indexOf("Crystal Maiden")]).toBe("CM");
        expect(tags[seed42.heroes.indexOf("Lion")]).toBe("LI");
        expect(tags[seed42.heroes.indexOf("Lich")]).toBe("LC");
        expect(tags[seed42.heroes.indexOf("Witch Doctor")]).toBe("WD");
    });

    it("resolves Lich / Lion to LI / LO in roster order", () => {
        expect(heroTags(["Lich", "Lion"])).toEqual(["LI", "LO"]);
    });

    it.each(MATCHES.map((m) => [m.id, m] as const))("%s gets ten unique tags", (_, m) => {
        expect(new Set(heroTags(m.heroes)).size).toBe(10);
    });
});

describe("economy and odds", () => {
    it("uses the engine's pinned fight-logistic constants", () => {
        expect(winProb(30000, 20000)).toBeCloseTo(0.8951, 4);
        expect(winProb(130000, 120000)).toBeCloseTo(0.6397, 4);
        expect(winProb(5000, 5000)).toBe(0.5);
    });

    it("starts every hero at 600 gold and interpolates between ticks", () => {
        expect(heroNetWorthAt(seed42, 0, 3)).toBe(600);
        const a = heroNetWorthAt(seed42, 60, 3);
        const b = heroNetWorthAt(seed42, 90, 3);
        expect(heroNetWorthAt(seed42, 75, 3)).toBeCloseTo((a + b) / 2, 6);
    });

    it("lead series starts even and has one point per tick", () => {
        const s = leadSeries(seed42);
        expect(s).toHaveLength(seed42.ticks + 1);
        expect(s[0]).toBe(0);
        const [r, d] = teamNetWorthAt(seed42, seed42.dur);
        expect(s[s.length - 1]).toBeCloseTo(r - d, 6);
    });
});

describe("positions", () => {
    it("heroes leave their own ancient before the first snapshot", () => {
        const dots = positionsAt(seed42, 0);
        expect([dots[0].x, dots[0].y]).toEqual(ANCIENT[0]);
        expect([dots[9].x, dots[9].y]).toEqual(ANCIENT[1]);
    });

    it("lands exactly on engine snapshots and glides between them", () => {
        const at = (t: number) => positionsAt(seed42, t)[4];
        const mid = at(45);
        expect(mid.x).toBeCloseTo((at(30).x + at(60).x) / 2, 6);
        expect(at(30).x).toBe(seed42.pos[4 * 2] / 2);
    });

    it("spreads a fight cluster without moving any dot more than 4 map units", () => {
        const placed = spreadDots(positionsAt(seed42, 30));
        for (const p of placed) {
            expect(Math.hypot(p.px - p.x, p.py - p.y)).toBeLessThanOrEqual(4 + 1e-9);
            expect(p.px).toBeGreaterThanOrEqual(3);
            expect(p.px).toBeLessThanOrEqual(97);
        }
        expect(placed.some((p) => p.nudged)).toBe(true);
    });
});

describe("beats", () => {
    it("the structure goes dark on the side that lost it", () => {
        const first = fallenAt(seed42, 600);
        expect(first).toEqual([{ side: 1, structure: 1, lane: 1, t: 570 }]);
        expect(structurePoint(1, 1, 1)).toEqual([58, 42]);
    });

    it("first blood lands at 00:30 and is emphasised", () => {
        const [m] = markersAt(seed42, 31);
        expect(m.kind).toBe(FIGHT);
        expect(m.emphasis).toBe(true);
        expect(m.deaths).toBe(1);
    });

    it("fight markers expire after 90 game seconds when paused", () => {
        expect(markersAt(seed42, 30 + 90).some((m) => m.t === 30)).toBe(true);
        expect(markersAt(seed42, 30 + 91).some((m) => m.t === 30)).toBe(false);
    });

    it("marker lives stretch with playback speed like the real viewer (2x at 120x)", () => {
        expect(markersAt(seed42, 30 + 180, 2).some((m) => m.t === 30)).toBe(true);
        expect(markersAt(seed42, 30 + 181, 2).some((m) => m.t === 30)).toBe(false);
        const ancient = markersAt(seed42, seed42.dur, 2).find((m) => m.kind === OBJECTIVE && m.emphasis);
        expect(ancient?.life).toBe(480);
    });

    it("casualties hollow out for 40 game seconds", () => {
        const wd = seed42.heroes.indexOf("Witch Doctor");
        expect(casualtiesAt(seed42, 70).has(wd)).toBe(true);
        expect(casualtiesAt(seed42, 71).has(wd)).toBe(false);
    });

    it("the aegis lasts 300 game seconds", () => {
        expect(aegisAt(seed42, 690)).toBe(1);
        expect(aegisAt(seed42, 989)).toBe(1);
        expect(aegisAt(seed42, 990)).toBe(null);
    });
});

describe("feed", () => {
    const tags = heroTags(seed42.heroes);

    it("narrates newest first and ends on the winner", () => {
        const lines = feedAt(seed42, seed42.dur, tags, 3);
        expect(lines[0].text).toBe("Dire win the game");
        expect(lines[1].text).toBe("Dire destroy the Ancient");
    });

    it("names first blood and the fallen by tag", () => {
        const [line] = feedAt(seed42, 30, tags, 1);
        expect(line.text).toBe("First blood · Radiant win · WD falls");
        expect(mmss(line.t)).toBe("00:30");
    });

    it("never uses an em dash", () => {
        for (const m of MATCHES) {
            const t = heroTags(m.heroes);
            for (const b of m.beats) expect(describeBeat(b, t)).not.toContain(String.fromCharCode(0x2014));
        }
    });
});

describe("reduced-motion frame", () => {
    it("lands on a moment that tells the whole story", () => {
        expect(fallenAt(seed42, STATIC_CLOCK).length).toBeGreaterThanOrEqual(4);
        expect(markersAt(seed42, STATIC_CLOCK).some((m) => m.kind === FIGHT && m.age < 30)).toBe(true);
        expect(aegisAt(seed42, STATIC_CLOCK)).not.toBe(null);
        expect(casualtiesAt(seed42, STATIC_CLOCK).size).toBeGreaterThan(0);
    });
});
