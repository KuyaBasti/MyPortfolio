"use client";

import { useEffect, useRef } from "react";
import { readSceneLight } from "./sceneLight";

// Chapter 03 scene: the F1Tenth raceline. A low-poly car laps a closed CatmullRom
// circuit on its own clock while a 61-ray LiDAR fan is cast against the track
// boundaries and a particle cloud is drawn toward it; the camera blends between the
// top-down map and a chase view on a 30 s cycle. three.js is loaded lazily, the loop
// runs only while the frame is on screen and the tab is visible, and reduced-motion
// gets a single warmed top-down frame. Seeded randomness keeps every load identical.
export default function RaceScene() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const stage = canvas.parentElement as HTMLElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let disposed = false;
        let teardown: (() => void) | null = null;

        const setup = async () => {
            const THREE = await import("three");
            const SL = readSceneLight();
            if (disposed) return;

            const mulberry32 = (seed: number) => {
                let a = seed | 0;
                return () => {
                    a = (a + 0x6d2b79f5) | 0;
                    let t = Math.imul(a ^ (a >>> 15), 1 | a);
                    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
                    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
                };
            };
            const rand = mulberry32(7);
            const smooth = (a: number, b: number, x: number) => {
                const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
                return k * k * (3 - 2 * k);
            };

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x05070a);
            const fog = new THREE.Fog(0x05070a, 14, 70);
            scene.fog = fog;
            const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
            const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0x0a0906 }));
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.03;
            scene.add(ground);
            const grid = new THREE.GridHelper(200, 80, 0x1c1810, 0x120f0a);
            grid.position.y = -0.02;
            scene.add(grid);
            scene.add(new THREE.HemisphereLight(0xffd9a0, 0x05070a, 2.2));

            // track: a closed circuit with three glowing ribbons, two boundary loops and a start line
            const raw = [[-15, -7], [-7, -12], [4, -12], [12, -7], [15, 1], [10, 7], [3, 4], [-3, 9], [-11, 11], [-16, 4]];
            const curve = new THREE.CatmullRomCurve3(raw.map((p) => new THREE.Vector3(p[0], 0, p[1])), true, "centripetal");
            const N = 360,
                W = 1.7;
            const cpts = curve.getSpacedPoints(N);
            const norms = Array.from({ length: N + 1 }, (_, i) => {
                const t = curve.getTangentAt(i / N);
                return new THREE.Vector3(-t.z, 0, t.x).normalize();
            });
            const ribbon = (w: number, color: number, opacity: number) => {
                const pos = new Float32Array((N + 1) * 6);
                const idx: number[] = [];
                for (let i = 0; i <= N; i++) {
                    const p = cpts[i],
                        n = norms[i];
                    pos.set([p.x + n.x * w, 0.01, p.z + n.z * w, p.x - n.x * w, 0.01, p.z - n.z * w], i * 6);
                    if (i < N) {
                        const a = i * 2;
                        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
                    }
                }
                const g = new THREE.BufferGeometry();
                g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
                g.setIndex(idx);
                return new THREE.Mesh(
                    g,
                    new THREE.MeshBasicMaterial({
                        color,
                        transparent: true,
                        opacity,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                        side: THREE.DoubleSide,
                    }),
                );
            };
            scene.add(ribbon(1.3, 0xffb340, 0.05), ribbon(0.4, 0xffb340, 0.22), ribbon(0.12, 0xffd080, 0.95));
            // each boundary is also flattened to 2D segments (every other point) for the ray casts
            const edge = (sign: number) => {
                const pos = new Float32Array(N * 3);
                for (let i = 0; i < N; i++) {
                    const p = cpts[i],
                        n = norms[i];
                    pos.set([p.x + n.x * W * sign, 0.012, p.z + n.z * W * sign], i * 3);
                }
                const g = new THREE.BufferGeometry();
                g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
                scene.add(new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: 0xffb340, transparent: true, opacity: 0.32 })));
                const out: number[][] = [];
                for (let i = 0; i < N; i += 2) {
                    const a = i * 3,
                        b = ((i + 2) % N) * 3;
                    out.push([pos[a], pos[a + 2], pos[b], pos[b + 2]]);
                }
                return out;
            };
            const segs = [...edge(1), ...edge(-1)];
            const t0 = curve.getTangentAt(0);
            const start = new THREE.Mesh(
                new THREE.BoxGeometry(W * 2, 0.02, 0.14),
                new THREE.MeshBasicMaterial({ color: 0xe6e8ee, transparent: true, opacity: 0.55 }),
            );
            start.position.copy(cpts[0]);
            start.rotation.y = Math.atan2(t0.x, t0.z);
            scene.add(start);

            // car
            const car = new THREE.Group();
            const bodyMat = new THREE.MeshStandardMaterial({
                color: 0x3a2a10,
                emissive: 0xffb340,
                emissiveIntensity: 0.4,
                roughness: 0.55,
                metalness: 0.1,
            });
            const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 1.0), bodyMat);
            body.position.y = 0.22;
            car.add(body);
            const nose = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.3), bodyMat);
            nose.position.set(0, 0.17, 0.62);
            car.add(nose);
            const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12), new THREE.MeshBasicMaterial({ color: SL.bright }));
            puck.position.set(0, 0.38, 0.15);
            car.add(puck);
            const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
            for (const [x, z] of [[-0.3, 0.33], [0.3, 0.33], [-0.3, -0.33], [0.3, -0.33]]) {
                const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.22), wheelMat);
                m.position.set(x, 0.11, z);
                car.add(m);
            }
            const lamp = new THREE.PointLight(0xffb340, 6, 8);
            lamp.position.set(0, 1, 0);
            car.add(lamp);
            scene.add(car);

            // LiDAR fan and hit points
            const RAYS = 61,
                FOV = Math.PI * 1.5,
                RANGE = 9;
            const rayPos = new Float32Array(RAYS * 6);
            const hitPos = new Float32Array(RAYS * 3);
            const rayAttr = new THREE.BufferAttribute(rayPos, 3);
            const rg = new THREE.BufferGeometry();
            rg.setAttribute("position", rayAttr);
            scene.add(
                new THREE.LineSegments(
                    rg,
                    new THREE.LineBasicMaterial({
                        color: SL.deep,
                        transparent: true,
                        opacity: 0.32,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                    }),
                ),
            );
            const hitAttr = new THREE.BufferAttribute(hitPos, 3);
            const hg = new THREE.BufferGeometry();
            hg.setAttribute("position", hitAttr);
            scene.add(new THREE.Points(hg, new THREE.PointsMaterial({ color: SL.bright, size: 0.16, transparent: true, opacity: 0.95, depthWrite: false })));
            const castRay = (ox: number, oz: number, dx: number, dz: number) => {
                let best = RANGE;
                for (let s = 0; s < segs.length; s++) {
                    const g = segs[s],
                        ex = g[2] - g[0],
                        ez = g[3] - g[1],
                        den = dx * ez - dz * ex;
                    if (Math.abs(den) < 1e-9) continue;
                    const wx = g[0] - ox,
                        wz = g[1] - oz,
                        t = (wx * ez - wz * ex) / den,
                        u = (wx * dz - wz * dx) / den;
                    if (t > 0 && t < best && u >= 0 && u <= 1) best = t;
                }
                return best;
            };

            // particle cloud drawn toward the car; a particle that reaches it respawns on the outer ring
            const PN = 720;
            const ppos = new Float32Array(PN * 3);
            const pcol = new Float32Array(PN * 3);
            const respawn = (i: number) => {
                const r = 9 + rand() * 26,
                    a = rand() * Math.PI * 2;
                ppos.set([Math.cos(a) * r, 0.2 + rand() * 7, Math.sin(a) * r], i * 3);
            };
            for (let i = 0; i < PN; i++) {
                respawn(i);
                pcol.set(rand() < 0.4 ? SL.deepRGB : [1, 0.7, 0.25], i * 3);
            }
            const pAttr = new THREE.BufferAttribute(ppos, 3);
            const pg = new THREE.BufferGeometry();
            pg.setAttribute("position", pAttr);
            pg.setAttribute("color", new THREE.BufferAttribute(pcol, 3));
            scene.add(
                new THREE.Points(
                    pg,
                    new THREE.PointsMaterial({
                        size: 0.13,
                        vertexColors: true,
                        transparent: true,
                        opacity: 0.8,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                    }),
                ),
            );
            const stepParticles = (dt: number, c: { x: number; y: number; z: number }) => {
                for (let i = 0; i < PN; i++) {
                    const o = i * 3,
                        dx = c.x - ppos[o],
                        dy = c.y + 0.3 - ppos[o + 1],
                        dz = c.z - ppos[o + 2];
                    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-3;
                    if (d < 0.5) {
                        respawn(i);
                        continue;
                    }
                    const s = ((2.2 + 10 / d) * dt) / d;
                    ppos[o] += dx * s + dz * s * 0.45;
                    ppos[o + 1] += dy * s;
                    ppos[o + 2] += dz * s - dx * s * 0.45;
                }
                pAttr.needsUpdate = true;
            };

            // camera: a blend between the fixed top-down pose and a chase pose behind the car
            const topPos = new THREE.Vector3(),
                topLook = new THREE.Vector3(0, 0, -1),
                camPos = new THREE.Vector3(),
                camLook = new THREE.Vector3();
            const chasePos = new THREE.Vector3(),
                chaseLook = new THREE.Vector3(),
                goalPos = new THREE.Vector3(),
                goalLook = new THREE.Vector3(),
                tmp = new THREE.Vector3();
            let topY = 44,
                lapT = 0.12,
                first = true,
                lastT = 0;
            const resize = () => {
                const w = stage.clientWidth || 1,
                    h = stage.clientHeight || 1;
                renderer.setSize(w, h, false);
                cam.aspect = w / h;
                cam.updateProjectionMatrix();
                topY = 44 * Math.min(2.3, Math.max(1, 1.35 / cam.aspect));
                topPos.set(0, topY, topY * 0.22);
                fog.far = Math.max(70, topY * 1.7);
            };
            const update = (dt: number, view: number, draw: boolean) => {
                lapT = (lapT + dt * 0.042) % 1;
                const p = curve.getPointAt(lapT),
                    tg = curve.getTangentAt(lapT);
                car.position.copy(p);
                car.lookAt(tmp.copy(p).add(tg));
                const heading = Math.atan2(tg.x, tg.z);
                for (let i = 0; i < RAYS; i++) {
                    const a = heading - FOV / 2 + (FOV * i) / (RAYS - 1),
                        dx = Math.sin(a),
                        dz = Math.cos(a),
                        r = castRay(p.x, p.z, dx, dz),
                        o = i * 6;
                    rayPos[o] = p.x;
                    rayPos[o + 1] = 0.36;
                    rayPos[o + 2] = p.z;
                    rayPos[o + 3] = p.x + dx * r;
                    rayPos[o + 4] = 0.36;
                    rayPos[o + 5] = p.z + dz * r;
                    hitPos[i * 3] = p.x + dx * r;
                    hitPos[i * 3 + 1] = r < RANGE ? 0.36 : -5;
                    hitPos[i * 3 + 2] = p.z + dz * r;
                }
                rayAttr.needsUpdate = true;
                hitAttr.needsUpdate = true;
                stepParticles(dt, p);
                if (!draw) return;
                const e = smooth(0, 1, view);
                chasePos.copy(p).addScaledVector(tg, -4.6);
                chasePos.y += 1.9;
                chaseLook.copy(p).addScaledVector(tg, 5);
                chaseLook.y += 0.25;
                goalPos.lerpVectors(topPos, chasePos, e);
                goalLook.lerpVectors(topLook, chaseLook, e);
                const k = first ? 1 : 1 - Math.pow(0.0005, dt);
                first = false;
                camPos.lerp(goalPos, k);
                camLook.lerp(goalLook, k);
                cam.position.copy(camPos);
                cam.lookAt(camLook);
                renderer.render(scene, cam);
            };
            // the view alternates on a 30 s cycle: the top-down map, down into the chase view behind the car, and back
            const play = (now: number) => {
                const t = now * 0.001,
                    dt = Math.min(0.05, Math.max(0.001, t - lastT));
                lastT = t;
                update(dt, 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / 30), true);
            };

            let raf = 0;
            let inView = false;
            const frame = (now: number) => {
                raf = 0;
                play(now);
                raf = requestAnimationFrame(frame);
            };
            const sync = () => {
                const want = inView && document.visibilityState === "visible";
                if (want && !raf) {
                    raf = requestAnimationFrame(frame);
                } else if (!want && raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            };

            resize();
            const ro = new ResizeObserver(() => {
                resize();
                if (reduce) update(1 / 60, 0, true);
            });
            ro.observe(stage);
            let io: IntersectionObserver | null = null;
            if (reduce) {
                for (let i = 0; i < 220; i++) update(1 / 60, 0, false);
                update(1 / 60, 0, true);
            } else {
                io = new IntersectionObserver(
                    ([e]) => {
                        inView = e.isIntersecting;
                        sync();
                    },
                    { threshold: 0.05 },
                );
                io.observe(stage);
                document.addEventListener("visibilitychange", sync);
            }

            teardown = () => {
                if (raf) cancelAnimationFrame(raf);
                raf = 0;
                ro.disconnect();
                io?.disconnect();
                document.removeEventListener("visibilitychange", sync);
                scene.traverse((o) => {
                    if (o instanceof THREE.Mesh || o instanceof THREE.Line || o instanceof THREE.Points) {
                        o.geometry.dispose();
                        const m = o.material;
                        if (Array.isArray(m)) m.forEach((x) => x.dispose());
                        else m.dispose();
                    }
                });
                renderer.dispose();
            };
        };

        // a context failure (no WebGL) marks the frame so its CSS can show the still instead
        setup().catch(() => {
            if (!disposed) stage.classList.add("no-gl");
        });

        return () => {
            disposed = true;
            teardown?.();
        };
    }, []);

    return <canvas ref={ref} className="scene-gl" aria-hidden="true" />;
}
