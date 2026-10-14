"use client";

import { useEffect, useRef } from "react";
import { readSceneLight } from "./sceneLight";

// Chapter 01 aisle: a hall of instanced racks whose LEDs run a PXE boot wave
// (dark, amber, cyan, green) while the camera dollies down the aisle and back
// on a 28 s loop. three.js is imported lazily inside the effect so it stays
// off the initial bundle. The loop runs only while the frame is on screen and
// the tab is visible; reduced-motion renders one static frame mid-hall. LED
// seeds come from a fixed LCG so every load is identical.

export default function AisleScene() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const stage = canvas.parentElement as HTMLElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let disposed = false;
        let cleanup: (() => void) | null = null;

        const boot = async () => {
            const THREE = await import("three");
            const SL = readSceneLight();
            if (disposed) return;

            const tile = document.createElement("canvas");
            tile.width = 256;
            tile.height = 256;
            const cone = document.createElement("canvas");
            cone.width = 64;
            cone.height = 128;
            const g = tile.getContext("2d");
            const cg = cone.getContext("2d");
            if (!g || !cg) return;

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.05;

            const FOG = 0.075;
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x05070a);
            scene.fog = new THREE.FogExp2(0x05070a, FOG);
            const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 80);

            const N = 44,
                PITCH = 0.64,
                Z0 = 2.5,
                AX = 1.55,
                RH = 2.2,
                RD = 1.1,
                RW = 0.6,
                ROWS = 20,
                COLS = 5,
                LEN = 70,
                ZC = -26;
            const dummy = new THREE.Object3D();
            let seed = 1337;
            const rnd = () => {
                seed = (seed * 1664525 + 1013904223) >>> 0;
                return seed / 4294967296;
            };

            const steel = new THREE.MeshStandardMaterial({ color: 0x121820, metalness: 0.55, roughness: 0.6 });
            const steel2 = new THREE.MeshStandardMaterial({ color: 0x2a3340, metalness: 0.85, roughness: 0.35 });
            const bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(RD, RH, RW - 0.02), steel, N * 2);
            const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.024, 0.028, RW - 0.1), steel2, N * 2 * ROWS);
            const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, RH, 0.03), steel2, N * 4);
            const ledPos = new Float32Array(N * 2 * ROWS * COLS * 3);
            const ledSeed = new Float32Array(N * 2 * ROWS * COLS);
            let bi = 0,
                si = 0,
                pi = 0,
                li = 0;
            for (let side = -1; side <= 1; side += 2) {
                for (let i = 0; i < N; i++) {
                    const z = Z0 - i * PITCH;
                    dummy.position.set(side * (AX + RD / 2), RH / 2, z);
                    dummy.updateMatrix();
                    bodies.setMatrixAt(bi++, dummy.matrix);
                    for (const dz of [-RW / 2 + 0.03, RW / 2 - 0.03]) {
                        dummy.position.set(side * (AX - 0.01), RH / 2, z + dz);
                        dummy.updateMatrix();
                        posts.setMatrixAt(pi++, dummy.matrix);
                    }
                    for (let r = 0; r < ROWS; r++) {
                        const y = 0.12 + (r / (ROWS - 1)) * (RH - 0.3);
                        dummy.position.set(side * (AX - 0.012), y, z);
                        dummy.updateMatrix();
                        slats.setMatrixAt(si++, dummy.matrix);
                        for (let c = 0; c < COLS; c++) {
                            ledPos[li * 3] = side * (AX - 0.04);
                            ledPos[li * 3 + 1] = y + 0.04;
                            ledPos[li * 3 + 2] = z - (RW - 0.16) / 2 + c * ((RW - 0.16) / (COLS - 1));
                            ledSeed[li] = rnd();
                            li++;
                        }
                    }
                }
            }
            scene.add(bodies, slats, posts);

            g.fillStyle = "#0d1218";
            g.fillRect(0, 0, 256, 256);
            g.strokeStyle = "rgba(230,232,238,0.08)";
            g.lineWidth = 2;
            g.strokeRect(1, 1, 254, 254);
            g.strokeStyle = "rgba(230,232,238,0.03)";
            g.beginPath();
            g.moveTo(128, 0);
            g.lineTo(128, 256);
            g.moveTo(0, 128);
            g.lineTo(256, 128);
            g.stroke();
            const floorTex = new THREE.CanvasTexture(tile);
            floorTex.wrapS = THREE.RepeatWrapping;
            floorTex.wrapT = THREE.RepeatWrapping;
            floorTex.repeat.set(8, 56);
            floorTex.colorSpace = THREE.SRGBColorSpace;
            const floor = new THREE.Mesh(
                new THREE.PlaneGeometry(10, LEN),
                new THREE.MeshStandardMaterial({ color: 0x0d1218, map: floorTex, metalness: 0.35, roughness: 0.62 }),
            );
            floor.rotation.x = -Math.PI / 2;
            floor.position.set(0, 0, ZC);
            scene.add(floor);
            const ceil = new THREE.Mesh(
                new THREE.PlaneGeometry(10, LEN),
                new THREE.MeshStandardMaterial({ color: 0x080b0f, roughness: 0.9 }),
            );
            ceil.rotation.x = Math.PI / 2;
            ceil.position.set(0, 2.95, ZC);
            scene.add(ceil);
            const tape = new THREE.MeshBasicMaterial({ color: SL.dim });
            for (const x of [-1.05, 1.05]) {
                const t = new THREE.Mesh(new THREE.PlaneGeometry(0.03, LEN), tape);
                t.rotation.x = -Math.PI / 2;
                t.position.set(x, 0.003, ZC);
                scene.add(t);
            }
            const tray = new THREE.MeshStandardMaterial({ color: 0x1a212a, metalness: 0.7, roughness: 0.5 });
            for (const x of [-0.9, 0, 0.9]) {
                const tr = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.07, LEN), tray);
                tr.position.set(x, 2.62, ZC);
                scene.add(tr);
            }

            const grad = cg.createLinearGradient(0, 0, 0, 128);
            grad.addColorStop(0, "rgba(200,230,255,0.9)");
            grad.addColorStop(1, "rgba(200,230,255,0)");
            cg.fillStyle = grad;
            cg.fillRect(0, 0, 64, 128);
            const edge = cg.createLinearGradient(0, 0, 64, 0);
            edge.addColorStop(0, "rgba(5,7,10,1)");
            edge.addColorStop(0.4, "rgba(5,7,10,0)");
            edge.addColorStop(0.6, "rgba(5,7,10,0)");
            edge.addColorStop(1, "rgba(5,7,10,1)");
            cg.globalCompositeOperation = "destination-out";
            cg.fillStyle = edge;
            cg.fillRect(0, 0, 64, 128);
            const coneTex = new THREE.CanvasTexture(cone);
            coneTex.colorSpace = THREE.SRGBColorSpace;
            const NF = 28;
            const fix = new THREE.InstancedMesh(
                new THREE.BoxGeometry(1.7, 0.03, 0.12),
                new THREE.MeshBasicMaterial({ color: 0xd9ecff }),
                NF,
            );
            const cones = new THREE.InstancedMesh(
                new THREE.PlaneGeometry(1.9, 1.4),
                new THREE.MeshBasicMaterial({
                    map: coneTex,
                    transparent: true,
                    opacity: 0.11,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                }),
                NF,
            );
            for (let j = 0; j < NF; j++) {
                const z = 3 - j * 2.2;
                dummy.position.set(0, 2.9, z);
                dummy.updateMatrix();
                fix.setMatrixAt(j, dummy.matrix);
                dummy.position.set(0, 2.2, z);
                dummy.updateMatrix();
                cones.setMatrixAt(j, dummy.matrix);
            }
            scene.add(fix, cones);

            scene.add(new THREE.HemisphereLight(0xa9c6e3, 0x05070a, 0.55));
            const key = new THREE.DirectionalLight(0xcfe6ff, 1.1);
            key.position.set(0.5, 8, -2);
            scene.add(key);
            const lamp = new THREE.PointLight(0x9dd0ff, 14, 10, 2);
            scene.add(lamp);

            const ledGeo = new THREE.BufferGeometry();
            ledGeo.setAttribute("position", new THREE.BufferAttribute(ledPos, 3));
            ledGeo.setAttribute("aSeed", new THREE.BufferAttribute(ledSeed, 1));
            const uni = {
                uTime: { value: 0 },
                uPR: { value: renderer.getPixelRatio() },
                uProj: { value: 1 },
                uFog: { value: FOG },
                GREEN: { value: new THREE.Vector3(...SL.deepRGB) },
                BRIGHT: { value: new THREE.Vector3(...SL.brightRGB) },
            };
            const leds = new THREE.Points(
                ledGeo,
                new THREE.ShaderMaterial({
                    uniforms: uni,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    vertexShader: `
                        uniform float uTime, uPR, uProj, uFog;
                        attribute float aSeed;
                        varying vec3 vColor; varying float vI;
                        const vec3 AMBER = vec3(1.0, 0.70, 0.25);
                        const vec3 CYAN = vec3(0.35, 0.82, 1.0);
                        uniform vec3 GREEN; uniform vec3 BRIGHT; // the scene light (see sceneLight.ts)
                        const vec3 DARK = vec3(0.12, 0.14, 0.17);
                        void main(){
                            vec4 mv = modelViewMatrix * vec4(position, 1.0);
                            float cyc = 14.0, speed = 2.6;
                            float k = floor(uTime / cyc);
                            float ct = mod(uTime, cyc);
                            float front = 3.0 - ct * speed;
                            float t = (position.z - front) / speed + aSeed * 0.45;
                            vec3 c; float i;
                            if (t < -0.5) { if (k < 0.5) { c = DARK; i = 0.22; } else { c = GREEN; i = 0.8; } }
                            else if (t < 0.0) { c = DARK; i = 0.18; }
                            else if (t < 1.1) { c = AMBER; i = 0.5 + 0.5 * step(0.5, fract(t * 4.0 + aSeed)); }
                            else if (t < 2.5) { c = CYAN; i = 0.45 + 0.55 * step(0.5, fract(uTime * 9.0 + aSeed * 13.0)); }
                            else { c = GREEN; i = 0.78 + 0.22 * step(0.7, fract(uTime * 1.5 + aSeed * 11.0));
                                   if (aSeed > 0.94) { c = BRIGHT; i = 0.3 + 0.7 * step(0.5, fract(uTime * 6.0 + aSeed * 31.0)); } }
                            float d = -mv.z;
                            float f = 1.0 - exp(-uFog * uFog * d * d);
                            vColor = c; vI = i * (1.0 - f);
                            gl_PointSize = clamp(uPR * uProj * 0.045 / max(d, 0.2), 1.5, 26.0 * uPR);
                            gl_Position = projectionMatrix * mv;
                        }`,
                    fragmentShader: `
                        varying vec3 vColor; varying float vI;
                        void main(){
                            vec2 p = gl_PointCoord - 0.5;
                            float d = length(p);
                            if (d > 0.5) discard;
                            float halo = smoothstep(0.5, 0.0, d);
                            float core = smoothstep(0.18, 0.0, d);
                            float a = (halo * halo * 0.55 + core) * vI;
                            gl_FragColor = vec4(vColor * a, a);
                        }`,
                }),
            );
            leds.frustumCulled = false;
            scene.add(leds);

            const resize = () => {
                const w = stage.clientWidth || 1,
                    h = stage.clientHeight || 1;
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                uni.uProj.value = h / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
                uni.uPR.value = renderer.getPixelRatio();
            };
            const render = (prog: number, t: number, mx: number, my: number) => {
                const z = 1.5 - prog * 17.5;
                camera.position.set(mx * 0.28, 1.42 + Math.sin(t * 0.0009) * 0.015, z);
                camera.lookAt(mx * 0.6, 1.3 + my * 0.18, z - 8);
                lamp.position.set(0, 2.4, z - 3);
                uni.uTime.value = t * 0.001;
                renderer.render(scene, camera);
            };
            const still = () => render(0.3, 5000, 0, 0);

            resize();
            if (reduce) still();
            else render(0, 0, 0, 0);
            const ro = new ResizeObserver(() => {
                resize();
                if (reduce) still();
            });
            ro.observe(stage);

            // The aisle glides down the hall and back on a 28 s loop; the LED boot
            // wave runs on its own 14 s cycle inside the shader.
            let raf = 0,
                onScreen = false;
            const frame = (now: number) => {
                raf = 0;
                // The camera holds its framing: no pointer sway, the scene never reacts to the cursor.
                render(0.5 - 0.5 * Math.cos((now * 0.001 * Math.PI * 2) / 28), now, 0, 0);
                raf = requestAnimationFrame(frame);
            };
            const sync = () => {
                const live = onScreen && document.visibilityState === "visible";
                if (live && !raf) raf = requestAnimationFrame(frame);
                else if (!live && raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            };
            let io: IntersectionObserver | null = null;
            if (!reduce) {
                io = new IntersectionObserver(
                    ([e]) => {
                        onScreen = e.isIntersecting;
                        sync();
                    },
                    { threshold: 0.05 },
                );
                io.observe(stage);
                document.addEventListener("visibilitychange", sync);
            }

            cleanup = () => {
                if (raf) cancelAnimationFrame(raf);
                io?.disconnect();
                ro.disconnect();
                document.removeEventListener("visibilitychange", sync);
                scene.traverse((obj) => {
                    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
                        obj.geometry.dispose();
                        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                        for (const m of mats) m.dispose();
                    }
                    if (obj instanceof THREE.InstancedMesh) obj.dispose();
                });
                floorTex.dispose();
                coneTex.dispose();
                renderer.dispose();
            };
        };

        // Without WebGL the canvas stays blank and the frame keeps its CSS backdrop.
        boot().catch(() => undefined);

        return () => {
            disposed = true;
            cleanup?.();
        };
    }, []);

    return <canvas ref={ref} className="scene-gl" aria-hidden="true" />;
}
