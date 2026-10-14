"use client";

import { useEffect, useRef } from "react";
import { readSceneLight } from "./sceneLight";

// Chapter 04 orbit scene: the 3U CubeSat drifting in attitude above a dark
// Earth limb while the camera breathes between a close pass and a wide view
// on a 40 s cycle. Ported from public/prototypes/templates/chapters.html.
// The star field is seeded so every load renders the same sky; the loop runs
// only while the frame is on screen and the tab is visible, and resolves to a
// single static frame for reduced-motion.

function mulberry32(a: number) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const STAR_VERT = `
    attribute float aSize;
    uniform float uPR;
    varying float vA;
    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPR;
        vA = aSize / 2.6;
    }
`;

const STAR_FRAG = `
    varying float vA;
    void main() {
        float d = length(gl_PointCoord - .5);
        if (d > .5) discard;
        gl_FragColor = vec4(vec3(.85, .9, 1.), vA * (1. - d * 2.));
    }
`;

const EARTH_VERT = `
    varying vec3 vN;
    varying vec3 vP;
    void main() {
        vN = normalize(mat3(modelMatrix) * normal);
        vP = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`;

const EARTH_FRAG = `
    uniform vec3 uSun;
    uniform float uTime;
    varying vec3 vN;
    varying vec3 vP;
    float h(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
    float n(vec3 p) {
        vec3 i = floor(p), f = fract(p);
        f = f * f * (3. - 2. * f);
        return mix(mix(mix(h(i), h(i + vec3(1, 0, 0)), f.x), mix(h(i + vec3(0, 1, 0)), h(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(h(i + vec3(0, 0, 1)), h(i + vec3(1, 0, 1)), f.x), mix(h(i + vec3(0, 1, 1)), h(i + vec3(1, 1, 1)), f.x), f.y), f.z);
    }
    void main() {
        float ndl = dot(vN, uSun);
        float day = smoothstep(-0.02, 0.10, ndl);
        float cloud = n(vP * 0.09 + uTime * 0.002) * 0.6 + n(vP * 0.25) * 0.4;
        float land = smoothstep(0.52, 0.62, n(vP * 0.045));
        vec3 ocean = vec3(0.02, 0.07, 0.16), ground = vec3(0.07, 0.12, 0.09);
        vec3 dayCol = mix(ocean, ground, land) + cloud * cloud * 0.35;
        vec3 night = vec3(0.004, 0.006, 0.012) + vec3(0.18, 0.12, 0.05) * step(0.985, h(floor(vP * 1.7))) * (1. - land * 0.4);
        vec3 col = mix(night, dayCol * (0.35 + 0.65 * ndl), day);
        gl_FragColor = vec4(col, 1.);
    }
`;

const ATMO_VERT = `
    varying vec3 vN;
    varying vec3 vV;
    void main() {
        vN = normalize(mat3(modelMatrix) * normal);
        vec4 w = modelMatrix * vec4(position, 1.);
        vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
    }
`;

const ATMO_FRAG = `
    uniform vec3 uSun;
    varying vec3 vN;
    varying vec3 vV;
    void main() {
        float fres = pow(1. - max(dot(vN, vV), 0.), 3.2);
        float lit = smoothstep(-0.25, 0.35, dot(vN, uSun));
        vec3 c = mix(vec3(0.10, 0.30, 0.70), vec3(0.45, 0.75, 1.0), lit);
        gl_FragColor = vec4(c, fres * (0.15 + 0.85 * lit));
    }
`;

export default function OrbitScene() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const stage = canvas.parentElement as HTMLElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let disposed = false;
        let teardown: (() => void) | null = null;

        (async () => {
            const THREE = await import("three");
            const SL = readSceneLight();
            if (disposed) return;
            const rnd = mulberry32(20260901);
            const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);

            const createRenderer = () => {
                try {
                    return new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
                } catch {
                    return null;
                }
            };
            const renderer = createRenderer();
            if (!renderer) {
                stage.classList.add("no-gl");
                return;
            }
            renderer.setPixelRatio(pixelRatio());
            renderer.setClearColor(0x05070a, 1);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;

            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x05070a, 0.022);
            const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);

            const sunDir = new THREE.Vector3(-0.55, 0.35, 0.75).normalize();
            const sun = new THREE.DirectionalLight(0xfff2dc, 5.5);
            sun.position.copy(sunDir).multiplyScalar(60);
            scene.add(sun);
            scene.add(new THREE.HemisphereLight(0x1a2a44, 0x05070a, 0.55));
            const rim = new THREE.DirectionalLight(0x5e7dff, 1.4);
            rim.position.set(1.5, -1, -2);
            scene.add(rim);

            const N = 1600;
            const pos = new Float32Array(N * 3);
            const sz = new Float32Array(N);
            for (let i = 0; i < N; i++) {
                const th = rnd() * Math.PI * 2;
                const ph = Math.acos(2 * rnd() - 1);
                const r = 180 + rnd() * 40;
                pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
                pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
                pos[i * 3 + 2] = r * Math.cos(ph);
                sz[i] = 0.4 + rnd() * rnd() * 2.2;
            }
            const starGeo = new THREE.BufferGeometry();
            starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
            starGeo.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
            const starUniforms = { uPR: { value: pixelRatio() } };
            scene.add(
                new THREE.Points(
                    starGeo,
                    new THREE.ShaderMaterial({
                        uniforms: starUniforms,
                        vertexShader: STAR_VERT,
                        fragmentShader: STAR_FRAG,
                        transparent: true,
                        depthWrite: false,
                        fog: false,
                    }),
                ),
            );

            const earthR = 60;
            const earthUniforms = { uSun: { value: sunDir }, uTime: { value: 0 } };
            const earth = new THREE.Mesh(
                new THREE.SphereGeometry(earthR, 96, 64),
                new THREE.ShaderMaterial({ uniforms: earthUniforms, vertexShader: EARTH_VERT, fragmentShader: EARTH_FRAG }),
            );
            earth.position.set(-18, -72, -30);
            scene.add(earth);
            const atmo = new THREE.Mesh(
                new THREE.SphereGeometry(earthR * 1.035, 96, 64),
                new THREE.ShaderMaterial({
                    uniforms: { uSun: { value: sunDir } },
                    vertexShader: ATMO_VERT,
                    fragmentShader: ATMO_FRAG,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.FrontSide,
                }),
            );
            atmo.position.copy(earth.position);
            scene.add(atmo);

            // 3U CubeSat, 10 x 10 x 30 cm body (1 unit = 10 cm)
            const sat = new THREE.Group();
            const anod = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.85, roughness: 0.35 });
            const rail = new THREE.MeshStandardMaterial({ color: 0xd8dde3, metalness: 0.9, roughness: 0.25 });
            const cell = new THREE.MeshStandardMaterial({
                color: 0x0b1a3a,
                metalness: 0.6,
                roughness: 0.2,
                emissive: 0x05102a,
                emissiveIntensity: 0.6,
            });
            const edgeMat = new THREE.LineBasicMaterial({ color: SL.bright, transparent: true, opacity: 0.35 });
            sat.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 3), anod));
            const corners: [number, number][] = [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]];
            for (const [x, y] of corners) {
                const r = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.085, 3.06), rail);
                r.position.set(x, y, 0);
                sat.add(r);
            }
            for (let u = 0; u < 3; u++) {
                const seam = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.02, 0.02), rail);
                seam.position.z = -1.5 + u;
                sat.add(seam);
                for (const sy of [1, -1]) {
                    const c = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.82), cell);
                    c.position.set(0, sy * 0.51, -1 + u);
                    sat.add(c);
                }
            }
            const wing = (side: number) => {
                const g = new THREE.Group();
                const panel = new THREE.Mesh(new THREE.BoxGeometry(1, 0.03, 3), cell);
                panel.position.set(0.5, 0, 0);
                g.add(panel);
                const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 0.04, 3)), edgeMat);
                frame.position.copy(panel.position);
                g.add(frame);
                for (let i = 1; i < 6; i++) {
                    const l = new THREE.Mesh(new THREE.BoxGeometry(1, 0.04, 0.01), rail);
                    l.position.set(0.5, 0, -1.5 + i * 0.5);
                    g.add(l);
                }
                const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.05, 10), rail);
                hinge.rotation.x = Math.PI / 2;
                g.add(hinge);
                g.position.set(side * 0.5, 0.5, 0);
                g.rotation.set(0, side < 0 ? Math.PI : 0, 0.3);
                return g;
            };
            sat.add(wing(1), wing(-1));
            const up = new THREE.Vector3(0, 1, 0);
            const dir = new THREE.Vector3();
            for (const a of [0.6, 2.2, 3.9, 5.5]) {
                const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.005, 2.2, 6), rail);
                dir.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 1).normalize();
                ant.quaternion.setFromUnitVectors(up, dir);
                ant.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 1.5).addScaledVector(dir, 1.1);
                sat.add(ant);
            }
            const imu = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: SL.bright }));
            imu.position.set(0.3, 0.52, 0.2);
            sat.add(imu);
            sat.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 3.02)), edgeMat));
            scene.add(sat);

            const target = new THREE.Vector3();
            const camPos = new THREE.Vector3();
            const tmp = new THREE.Vector3();
            const placeCamera = (p: number) => {
                const e = ease(p);
                const near = camera.aspect < 1 ? 4.8 : 3.4;
                const ang = -0.35 + e * 2.3;
                const dist = near + e * (16.7 - near);
                const h = 0.6 - e * 1.1;
                camPos.set(Math.sin(ang) * dist, h, Math.cos(ang) * dist);
                target.set(0, 0, 0).lerp(tmp.set(-4, -9, -8), e * 0.55);
                camera.position.copy(camPos);
                camera.lookAt(target);
            };
            const drift = (t: number) => {
                sat.rotation.x = Math.sin(t * 0.11) * 0.22 + 0.15;
                sat.rotation.y = t * 0.035 + Math.sin(t * 0.07) * 0.18;
                sat.rotation.z = Math.cos(t * 0.09) * 0.17;
            };
            const resize = () => {
                const pr = pixelRatio();
                const w = stage.clientWidth || 1;
                const h = stage.clientHeight || 1;
                starUniforms.uPR.value = pr;
                renderer.setPixelRatio(pr);
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            };
            const render = (p: number, t: number) => {
                placeCamera(p);
                drift(t);
                earthUniforms.uTime.value = t;
                renderer.render(scene, camera);
            };
            // The camera breathes between a close pass and a wide view with the limb on a 40 s cycle.
            const play = (t: number) => {
                render(0.22 + 0.42 * (0.5 - 0.5 * Math.cos((t * Math.PI * 2) / 40)), t);
            };
            const still = () => render(0.45, 12);

            // Scene time only advances while frames are being drawn, so a pause never jumps the drift.
            let raf = 0;
            let last: number | null = null;
            let elapsed = 0;
            let onScreen = false;
            const tick = (now: number) => {
                if (last !== null) elapsed += (now - last) * 0.001;
                last = now;
                play(elapsed);
                raf = requestAnimationFrame(tick);
            };
            const start = () => {
                if (raf !== 0) return;
                last = null;
                raf = requestAnimationFrame(tick);
            };
            const stop = () => {
                cancelAnimationFrame(raf);
                raf = 0;
            };
            const sync = () => {
                if (onScreen && document.visibilityState === "visible") start();
                else stop();
            };

            const ro = new ResizeObserver(() => {
                resize();
                if (reduce) still();
            });
            ro.observe(stage);
            resize();
            still();

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

            teardown = () => {
                stop();
                ro.disconnect();
                io?.disconnect();
                document.removeEventListener("visibilitychange", sync);
                scene.traverse((o) => {
                    if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line) {
                        o.geometry.dispose();
                        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
                        else o.material.dispose();
                    }
                });
                renderer.dispose();
            };
        })();

        return () => {
            disposed = true;
            teardown?.();
        };
    }, []);

    return <canvas ref={ref} className="scene-gl" aria-hidden="true" />;
}
