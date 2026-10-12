// Scène 3D décorative : colonne vertébrale stylisée low-poly (Three.js).
// Chargée uniquement sur desktop, sans prefers-reduced-motion et avec WebGL.
import * as THREE from 'three';

const COLORS = {
  bone: new THREE.Color('#EEF3F8'),
  process: new THREE.Color('#D9E4EF'),
  highlight: new THREE.Color('#6FD6CA'),
  disc: '#2BB3A3',
  accent: '#2BB3A3'
};

// Position de la colonne pour chaque section (data-scene).
// x : fraction de la demi-largeur visible · y : décalage vertical · s : échelle
// rot : orientation (rad) · op : opacité du canvas · hl : mise en valeur cervicale + mâchoire
const KEYFRAMES = {
  hero:      { x: 0.42,  y: -0.25, s: 0.88, rot: -0.6, op: 1,    hl: 0 },
  about:     { x: 0.68,  y: 0.2,  s: 0.82, rot: 0.9,  op: 0.28, hl: 0 },
  domains:   { x: -0.7,  y: 0,    s: 0.82, rot: -0.9, op: 0.2,  hl: 0 },
  maxillo:   { x: -0.5,  y: -3.1, s: 1.5,  rot: 0.75, op: 1,    hl: 1 },
  languages: { x: 0.64,  y: 0,    s: 0.8,  rot: -0.6, op: 0.24, hl: 0 },
  contact:   { x: 0.72,  y: 0,    s: 0.78, rot: 0.6,  op: 0.12, hl: 0 }
};
const KEYS = ['x', 'y', 's', 'rot', 'op', 'hl'];
const CERVICAL = 7;

export function createScene(canvas, { sections, isRTL = () => false, onError } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe0f2, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(3, 4, 6);
  const rim = new THREE.DirectionalLight(0x7fdcd1, 1.1);
  rim.position.set(-5, -1, -4);
  scene.add(key, rim);

  const rig = new THREE.Group();      // position / échelle pilotées par le scroll
  const spine = new THREE.Group();    // rotation pilotée par la souris
  rig.add(spine);
  scene.add(rig);

  const disposables = [];
  const track = (...items) => { disposables.push(...items); return items[0]; };

  /* ---------- Colonne : courbure cervicale, thoracique, lombaire ---------- */
  const curve = new THREE.CatmullRomCurve3([
    [0, 2.95, 0.12], [0, 2.25, 0.32], [0, 1.5, 0.12], [0, 0.6, -0.3],
    [0, -0.3, -0.24], [0, -1.2, 0.1], [0, -2.0, 0.32], [0, -2.75, 0.05]
  ].map((p) => new THREE.Vector3(...p)), false, 'centripetal');

  const N = 24;
  const UP = new THREE.Vector3(0, 1, 0);
  const frame = (t) => {
    const p = curve.getPointAt(t);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, curve.getTangentAt(t).negate());
    return { p, q };
  };
  const tOf = (i) => 0.02 + (i / (N - 1)) * 0.95;

  const boneMat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.04, flatShading: true }));
  const discMat = track(new THREE.MeshStandardMaterial({
    color: COLORS.disc, roughness: 0.35, emissive: '#0d5e56', emissiveIntensity: 0.3, flatShading: true
  }));

  const bodyGeo = track(new THREE.CylinderGeometry(1, 1, 1, 8));
  const spinousGeo = track(new THREE.ConeGeometry(1, 1, 6).rotateX(-Math.PI / 2)); // pointe vers -z (arrière)
  const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));

  const bodies = new THREE.InstancedMesh(bodyGeo, boneMat, N);
  const spinous = new THREE.InstancedMesh(spinousGeo, boneMat, N);
  const transverse = new THREE.InstancedMesh(boxGeo, boneMat, N * 2);
  const discs = new THREE.InstancedMesh(bodyGeo, discMat, N - 1);
  spine.add(bodies, spinous, transverse, discs);

  const m = new THREE.Matrix4();
  const tmp = new THREE.Matrix4();
  const one = new THREE.Vector3(1, 1, 1);
  const sizes = [];

  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const s = 0.6 + 0.6 * Math.pow(u, 0.9);
    sizes.push(s);
    const { p, q } = frame(tOf(i));
    const base = new THREE.Matrix4().compose(p, q, one);

    // corps vertébral
    m.copy(base).multiply(tmp.makeScale(0.36 * s, 0.13 + 0.05 * u, 0.3 * s));
    bodies.setMatrixAt(i, m);

    // apophyse épineuse, inclinée vers le bas (plus marquée en thoracique)
    const len = 0.42 * s;
    const tilt = -0.25 - 0.45 * Math.sin(u * Math.PI);
    m.copy(base)
      .multiply(tmp.makeTranslation(0, 0, -0.24 * s))
      .multiply(new THREE.Matrix4().makeRotationX(tilt))
      .multiply(new THREE.Matrix4().makeTranslation(0, 0, -len / 2))
      .multiply(new THREE.Matrix4().makeScale(0.075 * s, 0.07 * s, len));
    spinous.setMatrixAt(i, m);

    // apophyses transverses
    for (const side of [-1, 1]) {
      m.copy(base)
        .multiply(tmp.makeTranslation(side * 0.4 * s, 0.02, -0.13 * s))
        .multiply(new THREE.Matrix4().makeRotationY(side * 0.35))
        .multiply(new THREE.Matrix4().makeScale(0.34 * s, 0.06, 0.09 * s));
      transverse.setMatrixAt(i * 2 + (side > 0 ? 1 : 0), m);
    }

    // disque intervertébral
    if (i < N - 1) {
      const mid = frame((tOf(i) + tOf(i + 1)) / 2);
      m.compose(mid.p, mid.q, new THREE.Vector3(0.32 * s, 0.05, 0.27 * s));
      discs.setMatrixAt(i, m);
    }
  }

  // Sacrum stylisé
  const sacrumGeo = track(new THREE.ConeGeometry(0.62, 0.9, 5));
  const sacrum = new THREE.Mesh(sacrumGeo, boneMat);
  const end = frame(1);
  sacrum.position.copy(end.p).add(new THREE.Vector3(0, -0.38, -0.08));
  sacrum.rotation.set(Math.PI + 0.35, 0, 0);
  spine.add(sacrum);

  function paintHighlight(amount) {
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const k = i < CERVICAL ? amount * (1 - i / (CERVICAL + 2)) : 0;
      bodies.setColorAt(i, c.copy(COLORS.bone).lerp(COLORS.highlight, k));
      spinous.setColorAt(i, c.copy(COLORS.process).lerp(COLORS.highlight, k));
      transverse.setColorAt(i * 2, c);
      transverse.setColorAt(i * 2 + 1, c);
    }
    bodies.instanceColor.needsUpdate = true;
    spinous.instanceColor.needsUpdate = true;
    transverse.instanceColor.needsUpdate = true;
  }
  paintHighlight(0);

  /* ---------- Mâchoire / ATM (section maxillo-faciale) ---------- */
  const jaw = new THREE.Group();
  const jawMat = track(new THREE.MeshStandardMaterial({
    color: COLORS.accent, emissive: '#0d5e56', emissiveIntensity: 0.4,
    roughness: 0.3, flatShading: true, transparent: true, opacity: 0
  }));
  const arcGeo = track(new THREE.TorusGeometry(0.62, 0.055, 6, 32, Math.PI * 1.12).rotateX(Math.PI / 2).rotateY(0.06 * Math.PI));
  jaw.add(new THREE.Mesh(arcGeo, jawMat));
  const jointGeo = track(new THREE.IcosahedronGeometry(0.11, 0));
  for (const side of [-1, 1]) {
    const joint = new THREE.Mesh(jointGeo, jawMat);
    joint.position.set(side * 0.62, 0.32, -0.1);
    const ramusGeo = track(new THREE.CylinderGeometry(0.045, 0.05, 0.36, 5));
    const ramus = new THREE.Mesh(ramusGeo, jawMat);
    ramus.position.set(side * 0.62, 0.15, -0.06);
    jaw.add(joint, ramus);
  }
  jaw.position.set(0, 3.15, 0.4);
  jaw.rotation.x = 0.6;
  jaw.visible = false;
  spine.add(jaw);

  /* ---------- Anneaux de mouvement & particules ---------- */
  const ringMat = track(new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.35 }));
  const rings = [1.55, 1.9].map((r, i) => {
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(r, 0.006, 4, 160)), ringMat);
    ring.rotation.set(Math.PI / 2 + (i ? -0.5 : 0.35), i ? 0.3 : -0.2, 0);
    ring.position.y = i ? -0.9 : 0.8;
    rig.add(ring);
    return ring;
  });

  const COUNT = 280;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.random() * 1.6;
    positions.set([Math.cos(a) * r, (Math.random() - 0.5) * 7, Math.sin(a) * r], i * 3);
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dustMat = track(new THREE.PointsMaterial({ color: COLORS.accent, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
  const dust = new THREE.Points(dustGeo, dustMat);
  rig.add(dust);

  /* ---------- Scroll → keyframes ---------- */
  let anchors = [];
  function measure() {
    anchors = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return { center: r.top + window.scrollY + r.height / 2, kf: KEYFRAMES[el.dataset.scene] ?? KEYFRAMES.hero };
    });
  }

  const smooth = (x) => x * x * (3 - 2 * x);
  function targetFromScroll() {
    const y = window.scrollY + window.innerHeight / 2;
    if (!anchors.length) return { ...KEYFRAMES.hero };
    if (y <= anchors[0].center) return { ...anchors[0].kf };
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      if (y <= b.center) {
        const k = smooth((y - a.center) / (b.center - a.center));
        const out = {};
        KEYS.forEach((key) => { out[key] = a.kf[key] + (b.kf[key] - a.kf[key]) * k; });
        return out;
      }
    }
    return { ...anchors[anchors.length - 1].kf };
  }

  /* ---------- Interaction ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    measure();
  }

  const resizeObserver = new ResizeObserver(() => measure());
  resizeObserver.observe(document.body);
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  const onLost = (e) => { e.preventDefault(); onError?.(); };
  canvas.addEventListener('webglcontextlost', onLost);
  resize();

  /* ---------- Boucle ---------- */
  const clock = new THREE.Clock();
  const state = { ...targetFromScroll() };
  let lastHl = -1;
  let intro = 0;
  const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;

  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    const target = targetFromScroll();
    const k = 1 - Math.exp(-dt * 3.5);
    KEYS.forEach((key) => { state[key] += (target[key] - state[key]) * k; });
    pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 4));
    pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 4));
    intro = Math.min(1, intro + dt / 1.4);

    const dir = isRTL() ? -1 : 1;
    const halfW = halfH * camera.aspect;
    rig.position.set(state.x * dir * halfW, state.y + Math.sin(time * 0.6) * 0.05, 0);
    rig.scale.setScalar(state.s * (0.92 + 0.08 * smooth(intro)));

    spine.rotation.y = state.rot * dir + Math.sin(time * 0.25) * 0.3 + pointer.x * 0.5;
    spine.rotation.x = pointer.y * 0.15;
    spine.rotation.z = Math.sin(time * 0.4) * 0.025;

    rings[0].rotation.z = time * 0.18;
    rings[1].rotation.z = -time * 0.12;
    dust.rotation.y = time * 0.03;

    if (Math.abs(state.hl - lastHl) > 0.01) {
      lastHl = state.hl;
      paintHighlight(state.hl);
      jawMat.opacity = state.hl;
      jaw.visible = state.hl > 0.02;
    }
    jaw.rotation.y = Math.sin(time * 0.9) * 0.06;

    canvas.style.opacity = (state.op * smooth(intro)).toFixed(3);
    renderer.render(scene, camera);
  });

  return {
    destroy() {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      resizeObserver.disconnect();
      disposables.forEach((d) => d.dispose?.());
      [bodies, spinous, transverse, discs].forEach((mesh) => mesh.dispose());
      renderer.dispose();
      canvas.style.opacity = '0';
    }
  };
}
