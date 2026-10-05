// Pure replay logic for the DraftMaster card: every function is a pure
// function of (match, clock), ported from DraftMaster's own Match Viewer
// (web/src/pages/MatchViewer/playback.ts + mapGeometry.ts) so the card shows
// the same map, the same odds, and the same beats the real product does.

export type Side = 0 | 1; // 0 radiant, 1 dire

export interface Match {
    id: string;
    seed: number;
    dur: number; // game seconds; the winner takes the ancient at t = dur
    winner: Side;
    events: number; // timeline length in the source file
    ticks: number; // 30 s snapshots, at t = 30, 60, ... 30 * ticks
    heroes: string[]; // radiant 0-4, dire 5-9
    nw: number[]; // per tick, 10 per-hero net worths * 10 (exact to the engine's decimal)
    pos: number[]; // per tick, 10 heroes x (x, y) * 2
    beats: number[][]; // see scripts/export-draftmaster-matches.mjs
}

export const TICK = 30;
export const STARTING_GOLD = 600; // sim_loop.py _STARTING_GOLD
// Reduced-motion frame: 24:12 of seed 42, right after Dire win a fight and
// raze the mid barracks while holding the Aegis.
export const STATIC_CLOCK = 1452;
export const FIGHT = 0;
export const OBJECTIVE = 1;
export const ROSHAN = 2;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function mmss(t: number): string {
    const s = Math.max(0, Math.floor(t));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export const sideOf = (hero: number): Side => (hero < 5 ? 0 : 1);
export const teamName = (s: Side) => (s === 0 ? "Radiant" : "Dire");

// ---------------------------------------------------------------------------
// Map geometry (0..100, y down): Radiant bottom-left, Dire top-right.
// ---------------------------------------------------------------------------

type Pt = [number, number];

// [side][lane: top, mid, bot][tier 1..3]
export const TOWERS: Pt[][][] = [
    [
        [[12, 26], [12, 46], [14, 66]],
        [[42, 58], [34, 66], [27, 73]],
        [[74, 88], [54, 88], [34, 86]],
    ],
    [
        [[26, 12], [46, 12], [66, 14]],
        [[58, 42], [66, 34], [73, 27]],
        [[88, 74], [88, 54], [86, 34]],
    ],
];
export const BARRACKS: Pt[][] = [
    [[13, 73], [23, 78], [28, 87]],
    [[73, 13], [78, 23], [87, 28]],
];
export const ANCIENT: Pt[] = [
    [18, 82],
    [82, 18],
];
export const ROSHAN_PIT: Pt = [22, 14];

// structure: 1-3 towers, 4 barracks, 5 ancient; lane: 0 top, 1 mid, 2 bot, -1 none
export function structurePoint(side: Side, structure: number, lane: number): Pt {
    if (structure === 5) return ANCIENT[side];
    const l = lane < 0 ? 1 : lane;
    if (structure === 4) return BARRACKS[side][l];
    return TOWERS[side][l][structure - 1];
}

// ---------------------------------------------------------------------------
// Hero identity: two-letter tags, unique within the match, greedy in roster
// order (so Lich / Lion resolve to LI / LO exactly as in the real viewer).
// ---------------------------------------------------------------------------

function tagCandidates(name: string): string[] {
    const words = name.trim().split(/\s+/).filter(Boolean);
    const out: string[] = [];
    if (words.length >= 2 && words[0][0] && words[1][0]) out.push((words[0][0] + words[1][0]).toUpperCase());
    const letters = name.replace(/[^A-Za-z]/g, "");
    const first = (letters[0] ?? "?").toUpperCase();
    for (let i = 1; i < letters.length; i++) out.push((first + letters[i]).toUpperCase());
    return out;
}

export function heroTags(names: string[]): string[] {
    const taken = new Set<string>();
    return names.map((hero) => {
        const pick = tagCandidates(hero).find((c) => !taken.has(c)) ?? `${(hero[0] ?? "?").toUpperCase()}${taken.size}`;
        taken.add(pick);
        return pick;
    });
}

// ---------------------------------------------------------------------------
// Economy and odds
// ---------------------------------------------------------------------------

function heroNwAtTick(m: Match, tick: number, hero: number): number {
    return tick < 0 ? STARTING_GOLD : m.nw[tick * 10 + hero] / 10;
}

// Snapshot k (k >= 0) sits at t = 30 (k + 1); "tick -1" is the t = 0 start.
function bracket(m: Match, clock: number): [number, number, number] {
    const c = clamp(clock, 0, m.ticks * TICK);
    const hi = Math.min(m.ticks - 1, Math.ceil(c / TICK) - 1);
    const lo = hi - 1;
    const tLo = (lo + 1) * TICK;
    const frac = hi === lo ? 0 : clamp((c - tLo) / TICK, 0, 1);
    return [lo, hi, frac];
}

export function heroNetWorthAt(m: Match, clock: number, hero: number): number {
    if (clock <= 0) return STARTING_GOLD;
    const [lo, hi, f] = bracket(m, clock);
    const a = heroNwAtTick(m, lo, hero);
    return a + (heroNwAtTick(m, hi, hero) - a) * f;
}

export function teamNetWorthAt(m: Match, clock: number): [number, number] {
    let r = 0;
    let d = 0;
    for (let h = 0; h < 10; h++) {
        const v = heroNetWorthAt(m, clock, h);
        if (h < 5) r += v;
        else d += v;
    }
    return [r, d];
}

// The engine's fight logistic (fight_v0.py): the scale is affine in total map
// net worth, so a lead matters more early than late. Same constants as the
// real viewer's win-probability strip.
const PROB_SCALE_BASE = 1475;
const PROB_SCALE_PER_TOTAL = 0.0638;

export function winProb(radiant: number, dire: number): number {
    const scale = PROB_SCALE_BASE + PROB_SCALE_PER_TOTAL * (radiant + dire);
    return 1 / (1 + Math.exp(-(radiant - dire) / scale));
}

// Radiant-minus-Dire net worth at t = 0 and every tick, for the lead graph.
export function leadSeries(m: Match): number[] {
    const out = [0];
    for (let k = 0; k < m.ticks; k++) {
        let lead = 0;
        for (let h = 0; h < 10; h++) lead += (h < 5 ? 1 : -1) * m.nw[k * 10 + h];
        lead /= 10;
        out.push(lead);
    }
    return out;
}

// ---------------------------------------------------------------------------
// Positions
// ---------------------------------------------------------------------------

export interface Dot {
    hero: number;
    x: number;
    y: number;
}

// The engine's first snapshot is at t = 30; before it, heroes are shown
// leaving their own ancient.
function snapshot(m: Match, tick: number, hero: number): Pt {
    if (tick < 0) return ANCIENT[sideOf(hero)];
    const i = (tick * 10 + hero) * 2;
    return [m.pos[i] / 2, m.pos[i + 1] / 2];
}

export function positionsAt(m: Match, clock: number): Dot[] {
    const [lo, hi, f] = clock <= 0 ? [-1, -1, 0] : bracket(m, clock);
    const dots: Dot[] = [];
    for (let h = 0; h < 10; h++) {
        const a = snapshot(m, lo, h);
        const b = snapshot(m, hi, h);
        dots.push({ hero: h, x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f });
    }
    return dots;
}

export interface PlacedDot extends Dot {
    px: number;
    py: number;
    nudged: boolean;
}

// Crowded dots ease apart so labelled tokens stay readable, never lying by
// more than MAX_SHIFT; the bearing is fixed per slot, so it is deterministic.
const MERGE_RADIUS = 6.0;
const MERGE_FLOOR = 1.0;
const MAX_SHIFT = 4.0;
const NUDGE_VISIBLE = 1.5;

export function spreadDots(dots: Dot[]): PlacedDot[] {
    return dots.map((d, i) => {
        let nearest = Infinity;
        for (let j = 0; j < dots.length; j++) {
            if (j === i) continue;
            const dist = Math.hypot(d.x - dots[j].x, d.y - dots[j].y);
            if (dist < nearest) nearest = dist;
        }
        const shift = clamp((MERGE_RADIUS - nearest) / (MERGE_RADIUS - MERGE_FLOOR), 0, 1) * MAX_SHIFT;
        const angle = (i * 2 * Math.PI) / Math.max(dots.length, 1);
        return {
            ...d,
            px: clamp(d.x + Math.cos(angle) * shift, 3, 97),
            py: clamp(d.y + Math.sin(angle) * shift, 3, 97),
            nudged: shift > NUDGE_VISIBLE,
        };
    });
}

// ---------------------------------------------------------------------------
// Beats on the map
// ---------------------------------------------------------------------------

export interface Fallen {
    side: Side; // the side that LOST the structure
    structure: number;
    lane: number;
    t: number;
}

// Objective beats name the destroying team; the victim is the other side.
export function fallenAt(m: Match, clock: number): Fallen[] {
    const out: Fallen[] = [];
    for (const b of m.beats) {
        if (b[1] > clock) break;
        if (b[0] === OBJECTIVE) out.push({ side: (1 - b[2]) as Side, structure: b[3], lane: b[4], t: b[1] });
    }
    return out;
}

export interface Casualty {
    hero: number;
    t: number;
    x: number;
    y: number;
}

// Heroes named in a fight within the last `windowSec` game seconds.
export function casualtiesAt(m: Match, clock: number, windowSec = 40): Map<number, Casualty> {
    const out = new Map<number, Casualty>();
    for (const b of m.beats) {
        if (b[1] > clock) break;
        if (b[0] !== FIGHT || b[1] < clock - windowSec) continue;
        for (let h = 0; h < 10; h++) if (b[5] & (1 << h)) out.set(h, { hero: h, t: b[1], x: b[2] / 2, y: b[3] / 2 });
    }
    return out;
}

export interface Marker {
    kind: number;
    t: number;
    age: number;
    life: number;
    side: Side;
    x: number;
    y: number;
    deaths: number;
    emphasis: boolean;
}

const FIGHT_LIFE = 90;
const OBJECTIVE_LIFE = 150;
const ANCIENT_LIFE = 240;
const ROSHAN_LIFE = 150;

function popcount(n: number): number {
    let c = 0;
    for (let v = n; v; v &= v - 1) c++;
    return c;
}

// While playing, the real viewer stretches marker lives by the playback speed
// (min(3, max(1, speed / 60))) so beats don't flash past; paused, it uses 1.
export function markersAt(m: Match, clock: number, lifeScale = 1): Marker[] {
    const out: Marker[] = [];
    for (const b of m.beats) {
        const t = b[1];
        if (t > clock) break;
        const age = clock - t;
        if (b[0] === FIGHT) {
            const life = FIGHT_LIFE * lifeScale;
            if (age > life) continue;
            out.push({
                kind: FIGHT, t, age, life, side: b[4] as Side,
                x: b[2] / 2, y: b[3] / 2, deaths: popcount(b[5]), emphasis: b[6] !== 0,
            });
        } else if (b[0] === OBJECTIVE) {
            const life = (b[3] === 5 ? ANCIENT_LIFE : OBJECTIVE_LIFE) * lifeScale;
            if (age > life) continue;
            const [x, y] = structurePoint((1 - b[2]) as Side, b[3], b[4]);
            out.push({ kind: OBJECTIVE, t, age, life, side: b[2] as Side, x, y, deaths: 0, emphasis: b[3] === 5 });
        } else if (b[0] === ROSHAN) {
            const life = ROSHAN_LIFE * lifeScale;
            if (age > life) continue;
            out.push({
                kind: ROSHAN, t, age, life, side: b[2] as Side,
                x: ROSHAN_PIT[0], y: ROSHAN_PIT[1], deaths: 0, emphasis: true,
            });
        }
    }
    return out;
}

const AEGIS_SECONDS = 300;

export function aegisAt(m: Match, clock: number): Side | null {
    let held: Side | null = null;
    let expires = -1;
    for (const b of m.beats) {
        if (b[1] > clock) break;
        if (b[0] === ROSHAN) {
            held = b[2] as Side;
            expires = b[1] + AEGIS_SECONDS;
        }
    }
    return held !== null && expires > clock ? held : null;
}

// ---------------------------------------------------------------------------
// Feed: the narrated beats, newest first.
// ---------------------------------------------------------------------------

export interface FeedLine {
    t: number;
    side: Side;
    text: string;
}

const LANES = ["top", "mid", "bot"];

export function describe(b: number[], tags: string[]): string {
    const team = teamName(b[b[0] === FIGHT ? 4 : 2] as Side);
    if (b[0] === FIGHT) {
        const fallen: string[] = [];
        for (let h = 0; h < 10; h++) if (b[5] & (1 << h)) fallen.push(tags[h]);
        const head = b[6] & 1 ? `First blood · ${team} win` : `${team} win a fight`;
        const tail = fallen.length ? ` · ${fallen.join(" ")} ${fallen.length > 1 ? "fall" : "falls"}` : "";
        return head + tail + (b[6] & 2 ? " · comeback" : "");
    }
    if (b[0] === OBJECTIVE) {
        if (b[3] === 5) return `${team} destroy the Ancient`;
        const lane = b[4] >= 0 ? `${LANES[b[4]]} ` : "";
        return `${team} take ${lane}${b[3] === 4 ? "barracks" : `T${b[3]}`}`;
    }
    return `${team} slay Roshan · Aegis`;
}

export function feedAt(m: Match, clock: number, tags: string[], max: number): FeedLine[] {
    const out: FeedLine[] = [];
    if (clock >= m.dur) out.push({ t: m.dur, side: m.winner, text: `${teamName(m.winner)} win the game` });
    for (let i = m.beats.length - 1; i >= 0 && out.length < max; i--) {
        const b = m.beats[i];
        if (b[1] > clock) continue;
        out.push({ t: b[1], side: b[b[0] === FIGHT ? 4 : 2] as Side, text: describe(b, tags) });
    }
    return out.slice(0, max);
}

export function sameDraft(a: Match, b: Match): boolean {
    return a.heroes.every((h, i) => h === b.heroes[i]);
}
