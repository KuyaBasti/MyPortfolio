"use client";

import { useEffect, useRef } from "react";
import { readSceneLight } from "./sceneLight";

// Chapter 02 scene: the phone teardown. A 22 s self-playing loop lifts the
// phone into its layers on leader lines (glass first, board last), pushes in
// on the lifted OLED while it lights up (the screen test), then closes it back
// up with the screen still lit, holds, and fades out and in through exposure.
// three.js is imported lazily inside the effect so it never lands in the main
// bundle. The loop runs only while the stage is on screen and the tab is
// visible; reduced-motion renders one static frame at the lit, open stage.

type Group = import("three").Group;
type Shape = import("three").Shape;
type BufferGeometry = import("three").BufferGeometry;
type Material = import("three").Material;
type Line = import("three").Line<import("three").BufferGeometry, import("three").LineBasicMaterial>;

type Layer = {
    g: Group;
    seatY: number;
    start: number;
    h: number;
    anchors: [number, number][];
    lines: Line[];
    lift: number;
    k: number;
};

export default function PhoneScene() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const stage = canvas.parentElement as HTMLElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let disposed = false;
        let teardown: (() => void) | undefined;

        const boot = async () => {
            const THREE = await import("three");
            const SL = readSceneLight();
            if (disposed) return;

            const mulberry32 = (a: number) => () => {
                a |= 0;
                a = (a + 0x6d2b79f5) | 0;
                let t = Math.imul(a ^ (a >>> 15), 1 | a);
                t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
            const rnd = mulberry32(2025);
            const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
            const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
            const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
            const smooth = (x: number) => x * x * (3 - 2 * x);
            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
            renderer.setClearColor(0x05070a, 1);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.1;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            const scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x05070a, 3.4, 11);
            const cam = new THREE.PerspectiveCamera(38, 1, 0.05, 24);

            scene.add(new THREE.HemisphereLight(0x2b3447, 0x05070a, 0.7));
            const key = new THREE.DirectionalLight(0xd6e6ff, 2.6);
            key.position.set(-2.4, 4.4, -1.6);
            key.castShadow = true;
            key.shadow.mapSize.set(1024, 1024);
            const sc = key.shadow.camera;
            sc.left = -2.6;
            sc.right = 2.6;
            sc.top = 2.6;
            sc.bottom = -2.6;
            sc.near = 0.5;
            sc.far = 12;
            key.shadow.bias = -0.0004;
            key.shadow.normalBias = 0.02;
            scene.add(key);
            const rim = new THREE.DirectionalLight(SL.deep, 0.9);
            rim.position.set(-1.5, 0.9, -3.4);
            scene.add(rim);
            const fill = new THREE.DirectionalLight(0x6f7f9f, 0.6);
            fill.position.set(2.5, 2.2, 3.0);
            scene.add(fill);

            const M = {
                alu: new THREE.MeshStandardMaterial({ color: 0x8d939c, metalness: 0.92, roughness: 0.34 }),
                glass: new THREE.MeshPhysicalMaterial({ color: 0x0b0e13, metalness: 0, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.86 }),
                backglass: new THREE.MeshPhysicalMaterial({ color: 0x14181f, metalness: 0.1, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08 }),
                oled: new THREE.MeshStandardMaterial({ color: 0x07090d, metalness: 0.25, roughness: 0.28, emissive: SL.deep, emissiveIntensity: 0 }),
                mid: new THREE.MeshStandardMaterial({ color: 0x3b4049, metalness: 0.8, roughness: 0.5 }),
                batt: new THREE.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.35, roughness: 0.6 }),
                label: new THREE.MeshStandardMaterial({ color: 0x33363c, metalness: 0.1, roughness: 0.85 }),
                tab: new THREE.MeshStandardMaterial({ color: 0xc9ccd3, metalness: 0.95, roughness: 0.3 }),
                pcb: new THREE.MeshStandardMaterial({ color: SL.pcb, metalness: 0.1, roughness: 0.55 }),
                can: new THREE.MeshStandardMaterial({ color: 0x9ea4ac, metalness: 0.9, roughness: 0.32 }),
                dark: new THREE.MeshStandardMaterial({ color: 0x1a1d23, metalness: 0.4, roughness: 0.5 }),
                chip: new THREE.MeshStandardMaterial({ color: 0x3a3e46, metalness: 0.6, roughness: 0.45 }),
                lens: new THREE.MeshPhysicalMaterial({ color: 0x05070a, metalness: 0, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02 }),
                led: new THREE.MeshStandardMaterial({ color: SL.bright, emissive: SL.bright, emissiveIntensity: 2.5, roughness: 0.3 }),
                tile: new THREE.MeshBasicMaterial({ color: SL.bright, transparent: true, opacity: 0, depthWrite: false }),
                bench: new THREE.MeshStandardMaterial({ color: 0x0a0d12, metalness: 0.15, roughness: 0.92 }),
                mat: new THREE.MeshStandardMaterial({ color: 0x0e1218, metalness: 0.05, roughness: 1 }),
            };

            function rrect(w: number, l: number, r: number, cx = 0, cz = 0) {
                const s = new THREE.Shape(),
                    hw = w / 2,
                    hl = l / 2;
                s.moveTo(cx - hw + r, cz - hl);
                s.lineTo(cx + hw - r, cz - hl);
                s.absarc(cx + hw - r, cz - hl + r, r, -Math.PI / 2, 0, false);
                s.lineTo(cx + hw, cz + hl - r);
                s.absarc(cx + hw - r, cz + hl - r, r, 0, Math.PI / 2, false);
                s.lineTo(cx - hw + r, cz + hl);
                s.absarc(cx - hw + r, cz + hl - r, r, Math.PI / 2, Math.PI, false);
                s.lineTo(cx - hw, cz - hl + r);
                s.absarc(cx - hw + r, cz - hl + r, r, Math.PI, Math.PI * 1.5, false);
                return s;
            }
            function slab(shape: Shape, depth: number, bevel: number) {
                const g = new THREE.ExtrudeGeometry(shape, {
                    depth,
                    bevelEnabled: bevel > 0,
                    bevelThickness: bevel,
                    bevelSize: bevel,
                    bevelSegments: 2,
                    curveSegments: 10,
                });
                g.rotateX(Math.PI / 2);
                g.translate(0, depth / 2, 0);
                return g;
            }
            function part(geo: BufferGeometry, mat: Material, shadow = true) {
                const m = new THREE.Mesh(geo, mat);
                m.castShadow = shadow;
                m.receiveShadow = true;
                return m;
            }
            function mkLine(color: number): Line {
                const g = new THREE.BufferGeometry();
                g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
                const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false });
                const ln = new THREE.Line(g, m);
                ln.renderOrder = 10;
                ln.frustumCulled = false;
                ln.visible = false;
                scene.add(ln);
                return ln;
            }
            function setLine(line: Line, ax: number, ay: number, az: number, bx: number, by: number, bz: number, op: number) {
                const pos = line.geometry.getAttribute("position");
                pos.setXYZ(0, ax, ay, az);
                pos.setXYZ(1, bx, by, bz);
                pos.needsUpdate = true;
                line.material.opacity = op;
                line.visible = op > 0.003;
            }

            const bench = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), M.bench);
            bench.rotation.x = -Math.PI / 2;
            bench.receiveShadow = true;
            scene.add(bench);
            const mat = new THREE.Mesh(slab(rrect(1.5, 2.3, 0.08), 0.004, 0), M.mat);
            mat.position.y = 0.002;
            mat.receiveShadow = true;
            scene.add(mat);

            // The phone lies screen-up: Y is its normal, Z runs along its length.
            // Back glass and frame are the seat and never move.
            const W = 0.74,
                L = 1.52;
            const phone = new THREE.Group();
            phone.position.y = 0.004;
            scene.add(phone);
            const layers: Layer[] = [];
            function layer(group: Group, x: number, z: number, seatY: number, start: number, h: number, anchors: [number, number][]): Layer {
                group.position.set(x, seatY, z);
                phone.add(group);
                const o: Layer = { g: group, seatY, start, h, anchors, lines: anchors.map(() => mkLine(SL.deep)), lift: 0, k: 0 };
                layers.push(o);
                return o;
            }
            const back = part(slab(rrect(W - 0.012, L - 0.012, 0.095), 0.012, 0.003), M.backglass);
            back.position.y = 0.009;
            phone.add(back);
            const fs = rrect(W, L, 0.1);
            fs.holes.push(rrect(W - 0.06, L - 0.06, 0.08));
            const frame = part(slab(fs, 0.1, 0.006), M.alu);
            frame.position.y = 0.074;
            phone.add(frame);

            const bg = new THREE.Group();
            bg.add(part(slab(rrect(0.54, 0.76, 0.03), 0.042, 0.003), M.batt));
            const lbl = part(new THREE.BoxGeometry(0.42, 0.002, 0.56), M.label, false);
            lbl.position.set(0, 0.0245, 0.02);
            bg.add(lbl);
            const tab = part(new THREE.BoxGeometry(0.1, 0.004, 0.06), M.tab);
            tab.position.set(0.13, 0.022, -0.395);
            bg.add(tab);
            layer(bg, 0, 0.18, 0.042, 0.33, 0.4, [[0.285, 0.395]]);

            const bgp = new THREE.Group();
            const bshape = new THREE.Shape(
                [[-0.3, 0.21], [0.3, 0.21], [0.3, -0.21], [-0.08, -0.21], [-0.08, -0.01], [-0.3, -0.01]].map((q) => new THREE.Vector2(q[0], q[1]))
            );
            bgp.add(part(slab(bshape, 0.012, 0), M.pcb));
            const BT = 0.006;
            const CANS = [
                [0.14, -0.12, 0.22, 0.12, 0.022],
                [0.17, 0.06, 0.16, 0.14, 0.02],
                [-0.05, 0.1, 0.2, 0.1, 0.018],
                [-0.22, 0.12, 0.08, 0.1, 0.016],
                [-0.02, -0.1, 0.1, 0.1, 0.02],
                [0.26, -0.03, 0.05, 0.06, 0.012],
            ];
            CANS.forEach((c) => {
                const can = part(new THREE.BoxGeometry(c[2], c[4], c[3]), M.can);
                can.position.set(c[0], BT + c[4] / 2, c[1]);
                bgp.add(can);
            });
            const placed: number[][] = [[0.13, 0.19, 0.1, 0.03]];
            const conn = part(new THREE.BoxGeometry(0.1, 0.008, 0.03), M.tab, false);
            conn.position.set(0.13, BT + 0.004, 0.19);
            bgp.add(conn);
            function free(x: number, z: number, w: number, l: number) {
                const hx = w / 2 + 0.01,
                    hz = l / 2 + 0.01;
                if (x - hx < -0.3 || x + hx > 0.3 || z - hz < -0.21 || z + hz > 0.21) return false;
                if (x - hx < -0.08 && z - hz < -0.01) return false;
                for (const c of CANS) {
                    if (Math.abs(x - c[0]) < c[2] / 2 + hx && Math.abs(z - c[1]) < c[3] / 2 + hz) return false;
                }
                if (Math.abs(x + 0.12) < hx + 0.015 && Math.abs(z - 0.18) < hz + 0.015) return false;
                for (const q of placed) {
                    if (Math.abs(x - q[0]) < q[2] / 2 + hx && Math.abs(z - q[1]) < q[3] / 2 + hz) return false;
                }
                return true;
            }
            let tries = 0;
            while (placed.length < 38 && tries < 700) {
                tries++;
                const w = 0.012 + rnd() * 0.03,
                    l = 0.012 + rnd() * 0.03,
                    x = -0.29 + rnd() * 0.58,
                    z = -0.2 + rnd() * 0.4;
                if (!free(x, z, w, l)) continue;
                placed.push([x, z, w, l]);
                const h = 0.005 + rnd() * 0.007;
                const mm = placed.length % 7 === 0 ? M.tab : rnd() < 0.5 ? M.dark : M.chip;
                const m = part(new THREE.BoxGeometry(w, h, l), mm, false);
                m.position.set(x, BT + h / 2, z);
                bgp.add(m);
            }
            const led = part(new THREE.BoxGeometry(0.02, 0.006, 0.016), M.led, false);
            led.position.set(-0.12, BT + 0.003, 0.18);
            bgp.add(led);
            const ledLight = new THREE.PointLight(SL.deep, 0.5, 0.4, 2);
            ledLight.position.set(-0.12, BT + 0.03, 0.18);
            bgp.add(ledLight);
            layer(bgp, 0, -0.46, 0.024, 0.38, 0.56, [[0.315, 0.22]]);

            const cg = new THREE.Group();
            cg.add(part(new THREE.BoxGeometry(0.18, 0.05, 0.16), M.dark));
            const ring = part(new THREE.CylinderGeometry(0.056, 0.056, 0.006, 28), M.alu);
            ring.position.y = 0.028;
            cg.add(ring);
            const lens = part(new THREE.CylinderGeometry(0.044, 0.044, 0.01, 28), M.lens, false);
            lens.position.y = 0.034;
            cg.add(lens);
            layer(cg, -0.19, -0.57, 0.043, 0.29, 0.48, [[-0.1, -0.09]]);

            const sg = new THREE.Group();
            sg.add(part(new THREE.BoxGeometry(0.34, 0.04, 0.07), M.dark));
            const sp = part(new THREE.BoxGeometry(0.3, 0.002, 0.05), M.chip, false);
            sp.position.y = 0.0205;
            sg.add(sp);
            layer(sg, -0.08, 0.64, 0.038, 0.31, 0.46, [[0.18, 0.045]]);

            const ms = rrect(0.655, 1.435, 0.076);
            ms.holes.push(rrect(0.5, 0.68, 0.03, 0, 0.18));
            ms.holes.push(rrect(0.2, 0.18, 0.02, -0.19, -0.57));
            const mg = new THREE.Group();
            mg.add(part(slab(ms, 0.008, 0.001), M.mid));
            layer(mg, 0, 0, 0.092, 0.24, 0.8, [[-0.34, -0.73]]);

            // The display lights up when tested, with five soft tiles as a
            // generic UI (no text) and its own point light.
            const og = new THREE.Group();
            og.add(part(slab(rrect(0.66, 1.44, 0.075), 0.01, 0), M.oled, false));
            [[-0.17, -0.42, 0.24, 0.24], [0.17, -0.42, 0.24, 0.24], [-0.17, -0.1, 0.24, 0.24], [0.17, -0.1, 0.24, 0.24], [0, 0.42, 0.54, 0.14]].forEach((r) => {
                const m = new THREE.Mesh(slab(rrect(r[2], r[3], 0.03, r[0], r[1]), 0.002, 0), M.tile);
                m.position.y = 0.006;
                og.add(m);
            });
            const screenLight = new THREE.PointLight(SL.deep, 0, 1.4, 2);
            screenLight.position.set(0, 0.12, 0);
            og.add(screenLight);
            const oled = layer(og, 0, 0, 0.105, 0.19, 1.05, [[0.34, 0.73]]);

            const gg = new THREE.Group();
            gg.add(part(slab(rrect(0.72, 1.5, 0.095), 0.014, 0.004), M.glass, false));
            layer(gg, 0, 0, 0.141, 0.15, 1.3, [[0.37, -0.76], [-0.37, 0.76]]);

            const v = new THREE.Vector3(),
                u = new THREE.Vector3(),
                bt = new THREE.Vector3(),
                tg = new THREE.Vector3();
            phone.updateMatrixWorld(true);
            const seatArr: number[] = [];
            for (const o of layers) {
                for (const a of o.anchors) {
                    u.set(o.g.position.x + a[0], o.seatY, o.g.position.z + a[1]);
                    phone.localToWorld(u);
                    seatArr.push(u.x, u.y, u.z);
                }
            }
            const seats = new THREE.Points(
                new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(seatArr), 3)),
                new THREE.PointsMaterial({ color: SL.bright, size: 3, sizeAttenuation: false, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false })
            );
            seats.renderOrder = 11;
            seats.frustumCulled = false;
            scene.add(seats);

            const N = 150,
                dpos = new Float32Array(N * 3);
            for (let i = 0; i < N; i++) {
                dpos[i * 3] = (rnd() * 2 - 1) * 1.7;
                dpos[i * 3 + 1] = 0.05 + rnd() * 2.6;
                dpos[i * 3 + 2] = (rnd() * 2 - 1) * 1.9;
            }
            const dust = new THREE.Points(
                new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(dpos, 3)),
                new THREE.PointsMaterial({ color: SL.bright, size: 0.014, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false })
            );
            scene.add(dust);

            let lastAspect = 0;
            function render(p: number, t: number, mx: number, my: number, aspect: number) {
                p = clamp01(p);
                const ts = t * 0.001;
                if (aspect !== lastAspect) {
                    cam.aspect = aspect;
                    cam.updateProjectionMatrix();
                    lastAspect = aspect;
                }

                const a = ease(seg(p, 0.15, 0.6)); // the stack opens, glass first, board last
                const b = ease(seg(p, 0.52, 0.7)); // camera pushes in on the lifted screen
                const lit = smooth(seg(p, 0.56, 0.7)); // the screen test: it lights up
                const c = ease(seg(p, 0.74, 0.97)); // camera eases back out as the phone closes
                const lineFade = 1 - smooth(seg(p, 0.7, 0.8));

                for (const o of layers) {
                    const k = ease(seg(p, o.start, o.start + 0.22));
                    const cs = 0.7 + (0.38 - o.start) * 0.4; // closing order: board first, glass last
                    const cl = ease(seg(p, cs, cs + 0.2));
                    o.k = k * (1 - cl);
                    o.lift = o.h * o.k;
                    o.g.position.y = o.seatY + o.lift;
                }
                phone.updateMatrixWorld(true);

                for (const o of layers) {
                    o.anchors.forEach((an, i) => {
                        v.set(an[0], 0, an[1]);
                        o.g.localToWorld(v);
                        u.set(o.g.position.x + an[0], o.seatY, o.g.position.z + an[1]);
                        phone.localToWorld(u);
                        setLine(o.lines[i], u.x, u.y, u.z, v.x, v.y, v.z, 0.42 * smooth(seg(o.k, 0.04, 0.45)) * lineFade);
                    });
                }
                seats.material.opacity = 0.75 * smooth(seg(a, 0.05, 0.5)) * lineFade;
                seats.visible = seats.material.opacity > 0.003;

                M.oled.emissiveIntensity = 1.05 * lit;
                M.glass.opacity = 0.86 - 0.5 * lit;
                M.tile.opacity = 0.42 * lit;
                screenLight.intensity = 0.9 * lit;

                const pulse = Math.sin(ts * 2.4);
                M.led.emissiveIntensity = 1.8 + 1.2 * pulse;
                ledLight.intensity = 0.35 + 0.25 * pulse;
                dust.rotation.y = ts * 0.012;
                dust.position.y = 0.03 * Math.sin(ts * 0.4);

                let az = -0.35,
                    el = 0.3,
                    d = 2.5;
                tg.set(0, 0.12, -0.05);
                const drift = 1 - a;
                az += drift * 0.05 * Math.sin(ts * 0.35);
                el += drift * 0.02 * Math.sin(ts * 0.27 + 1);
                az = lerp(az, 0.35, a);
                el = lerp(el, 0.62, a);
                d = lerp(d, 3.9, a);
                tg.lerp(v.set(0, 0.78, 0), a);
                oled.g.getWorldPosition(bt);
                az = lerp(az, 0.12, b);
                el = lerp(el, 0.52, b);
                d = lerp(d, 1.75, b);
                tg.lerp(bt, b);
                az = lerp(az, -0.5, c);
                el = lerp(el, 0.4, c);
                d = lerp(d, 2.3, c);
                tg.lerp(v.set(0, 0.16, 0), c);
                az += mx * 0.07;
                el = Math.min(1.3, Math.max(0.12, el - my * 0.045));
                if (aspect < 1.2) d *= 1 + (1.2 - aspect) * 0.75;
                cam.position.set(tg.x + d * Math.sin(az) * Math.cos(el), tg.y + d * Math.sin(el), tg.z + d * Math.cos(az) * Math.cos(el));
                cam.lookAt(tg);
                renderer.render(scene, cam);
            }

            const aspect = () => stage.clientWidth / Math.max(1, stage.clientHeight) || 1;
            function resize() {
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                renderer.setSize(Math.max(1, stage.clientWidth), Math.max(1, stage.clientHeight), false);
            }

            // A 22 s loop: 16 s open, test and close; 3 s hold on the repaired
            // phone; a 1 s fade out, 1 s fade in, 1 s rest at the start.
            function play(now: number, mx: number, my: number) {
                const c = (now * 0.001) % 22;
                let p = 0,
                    fade = 1;
                if (c < 16) p = c / 16;
                else if (c < 19) p = 1;
                else if (c < 20) {
                    p = 1;
                    fade = 20 - c;
                } else if (c < 21) {
                    p = 0;
                    fade = c - 20;
                }
                renderer.toneMappingExposure = 1.1 * smooth(fade);
                render(p, now, mx, my, aspect());
            }

            resize();
            render(reduce ? 0.62 : 0, 0, 0, 0, aspect());

            const ro = new ResizeObserver(() => {
                resize();
                if (reduce) render(0.62, 0, 0, 0, aspect());
            });
            ro.observe(stage);

            if (reduce) {
                teardown = () => {
                    ro.disconnect();
                    dispose();
                };
                return;
            }

            // Play time accumulates only while the loop runs, so leaving and
            // returning resumes the phone where it was instead of jumping.
            let raf = 0,
                clock = 0,
                last = -1,
                onScreen = false;
            const tick = (now: number) => {
                raf = 0;
                if (disposed) return;
                if (last >= 0) clock += now - last;
                last = now;
                // No pointer sway: the phone never reacts to the cursor.
                play(clock, 0, 0);
                raf = requestAnimationFrame(tick);
            };
            const start = () => {
                if (raf || !onScreen || document.visibilityState !== "visible") return;
                last = -1;
                raf = requestAnimationFrame(tick);
            };
            const stop = () => {
                if (raf) cancelAnimationFrame(raf);
                raf = 0;
            };
            const onVis = () => (document.visibilityState === "visible" ? start() : stop());
            document.addEventListener("visibilitychange", onVis);
            const io = new IntersectionObserver(
                ([e]) => {
                    onScreen = e.isIntersecting;
                    if (onScreen) start();
                    else stop();
                },
                { threshold: 0.05 }
            );
            io.observe(stage);

            teardown = () => {
                stop();
                io.disconnect();
                ro.disconnect();
                document.removeEventListener("visibilitychange", onVis);
                dispose();
            };

            function dispose() {
                scene.traverse((o) => {
                    if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points) {
                        o.geometry.dispose();
                        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
                        else o.material.dispose();
                    }
                });
                key.dispose();
                renderer.dispose();
            }
        };

        // Mirrors the prototype: with no WebGL the stage is flagged for a CSS fallback.
        boot().catch(() => stage.classList.add("no-gl"));

        return () => {
            disposed = true;
            teardown?.();
        };
    }, []);

    return <canvas ref={ref} className="scene-gl" aria-hidden="true" />;
}
