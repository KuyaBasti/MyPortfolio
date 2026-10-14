// The light inside the chapter scenes (LEDs, LiDAR rays, the phone's screen test, the
// CubeSat's edges) reads the same CSS tokens as the page accent, so the page and the
// scenes always share one color. Read once when a scene starts.
export type SceneLight = {
    deep: number;
    bright: number;
    dim: number;
    pcb: number;
    /** raw sRGB 0..1, for shader uniforms that bypass color management */
    deepRGB: [number, number, number];
    brightRGB: [number, number, number];
};

const FALLBACK = { deep: "#5eead4", bright: "#b7f6ec", dim: "#2a695f", pcb: "#102222" };

function token(name: string, fallback: string): string {
    if (typeof window === "undefined") return fallback;
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
}
const num = (h: string) => parseInt(h.slice(1), 16);
const rgb = (h: string): [number, number, number] => [num(h) >> 16, (num(h) >> 8) & 255, num(h) & 255].map((x) => x / 255) as [number, number, number];

export function readSceneLight(): SceneLight {
    const deep = token("--light", FALLBACK.deep);
    const bright = token("--light-bright", FALLBACK.bright);
    return {
        deep: num(deep),
        bright: num(bright),
        dim: num(token("--light-dim", FALLBACK.dim)),
        pcb: num(token("--light-pcb", FALLBACK.pcb)),
        deepRGB: rgb(deep),
        brightRGB: rgb(bright),
    };
}
