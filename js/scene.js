// Scène 3D décorative : colonne vertébrale stylisée low-poly (Three.js).
// Desktop et mobile (qualité adaptée). Non chargée si prefers-reduced-motion ou sans WebGL.
import * as THREE from 'three';

const COLORS = {
  bone: new THREE.Color('#EEF3F8'),
  process: new THREE.Color('#D9E4EF'),
  highlight: new THREE.Color('#6FD6CA'),
  disc: new THREE.Color('#2BB3A3'),
  discGlow: new THREE.Color('#A6F2E8'),
  accent: '#2BB3A3'
};

// Position de la colonne pour chaque section (data-scene).
// anchor : élément HTML que la colonne suit (sinon x = fraction de la demi-largeur visible)
// y : décalage vertical (en unités de la colonne si anchor) · s : échelle · rot : orientation (rad)
// op : opacité du canvas · hl : cervicales + mâchoire · spread : vertèbres écartées (vue « éclatée »)
const DESKTOP = {
  hero:      { anchor: '.hero-visual',   y: -0.2, s: 0.88, rot: -0.6, op: 1,    hl: 0, spread: 0 },
  about:     { x: 0.68,  y: 0.2,  s: 0.82, rot: 0.9,  op: 0.3,  hl: 0, spread: 0 },
  domains:   { x: -0.7,  y: 0,    s: 0.82, rot: -0.9, op: 0.24, hl: 0, spread: 0.7 },
  maxillo:   { anchor: '.maxillo-stage', y: -2.1, s: 1.5,  rot: 0.75, op: 1,    hl: 1, spread: 0 },
  languages: { x: 0.64,  y: 0,    s: 0.8,  rot: -0.6, op: 0.26, hl: 0, spread: 0 },
  contact:   { x: 0.72,  y: 0,    s: 0.78, rot: 0.6,  op: 0.14, hl: 0, spread: 0 }
};
const MOBILE = {
  hero:      { anchor: '.hero-visual',   y: 0,    s: 0.48, rot: -0.6, op: 1,    hl: 0, spread: 0 },
  about:     { x: 0.55,  y: 0,    s: 0.6,  rot: 0.9,  op: 0.16, hl: 0, spread: 0 },
  domains:   { x: -0.55, y: 0,    s: 0.6,  rot: -0.9, op: 0.14, hl: 0, spread: 0.7 },
  maxillo:   { anchor: '.maxillo-stage', y: -2.1, s: 0.95, rot: 0.75, op: 1,    hl: 1, spread: 0 },
  languages: { x: 0.5,   y: 0,    s: 0.6,  rot: -0.6, op: 0.16, hl: 0, spread: 0 },
  contact:   { x: 0.55,  y: 0,    s: 0.55, rot: 0.6,  op: 0.1,  hl: 0, spread: 0 }
};
const KEYS = ['x', 'y', 's', 'rot', 'op', 'hl', 'spread'];
const N = 24;
const CERVICAL = 7;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x) => x * x * (3 - 2 * x);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const damp = (dt, rate) => 1 - Math.exp(-dt * rate);

export function createScene(canvas, { sections, isRTL = () => false, onError } = {}) {
  const compactMQ = window.matchMedia('(max-width: 899px)');
  const lowPower = compactMQ.matches || (navigator.hardwareConcurrency || 8) <= 4;
  let pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: (window.devicePixelRatio || 1) < 2, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe0f2, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(3, 4, 6);
  const rim = new THREE.DirectionalLight(0x7fdcd1, 1.2);
  rim.position.set(-5, -1, -4);
  // Lumière turquoise qui suit la souris (ou l'inclinaison du téléphone)
  const cursorLight = new THREE.PointLight(0x5fd4c6, 0, 7, 1.6);
  scene.add(key, rim, cursorLight);

  const rig = new THREE.Group();      // position / échelle (scroll)
  const spine = new THREE.Group();    // orientation (souris, scroll, temps)
  rig.add(spine);
  scene.add(rig);

  const disposables = [];
  const track = (item) => { disposables.push(item); return item; };

  /* ---------- Colonne : courbure cervicale, thoracique, lombaire ---------- */
  const curve = new THREE.CatmullRomCurve3([
    [0, 2.95, 0.12], [0, 2.25, 0.32], [0, 1.5, 0.12], [0, 0.6, -0.3],
    [0, -0.3, -0.24], [0, -1.2, 0.1], [0, -2.0, 0.32], [0, -2.75, 0.05]
  ].map((p) => new THREE.Vector3(...p)), false, 'centripetal');

  const UP = new THREE.Vector3(0, 1, 0);
  const tOf = (i) => 0.02 + (i / (N - 1)) * 0.95;

  const boneMat = track(lowPower
    ? new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.04, flatShading: true })
    : new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.45, metalness: 0.02, clearcoat: 0.6, clearcoatRoughness: 0.35, flatShading: true
    }));
  const discMat = track(new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.3, emissive: '#0d5e56', emissiveIntensity: 0.35, flatShading: true
  }));

  const bodyGeo = track(new THREE.CylinderGeometry(1, 1, 1, 8));
  const spinousGeo = track(new THREE.ConeGeometry(1, 1, 6).rotateX(-Math.PI / 2)); // pointe vers l'arrière
  const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));

  const bodies = new THREE.InstancedMesh(bodyGeo, boneMat, N);
  const spinous = new THREE.InstancedMesh(spinousGeo, boneMat, N);
  const transverse = new THREE.InstancedMesh(boxGeo, boneMat, N * 2);
  const discs = new THREE.InstancedMesh(bodyGeo, discMat, N - 1);
  const instanced = [bodies, spinous, transverse, discs];
  instanced.forEach((mesh) => {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    spine.add(mesh);
  });

  // Données fixes par vertèbre (position de repos, matrices locales des pièces, entrée animée)
  const verts = [];
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const s = 0.6 + 0.6 * Math.pow(u, 0.9);
    const t = tOf(i);
    const len = 0.42 * s;
    const tilt = -0.25 - 0.45 * Math.sin(u * Math.PI);
    verts.push({
      u, s,
      p: curve.getPointAt(t),
      q: new THREE.Quaternion().setFromUnitVectors(UP, curve.getTangentAt(t).negate()),
      body: new THREE.Matrix4().makeScale(0.36 * s, 0.13 + 0.05 * u, 0.3 * s),
      spin: new THREE.Matrix4().makeTranslation(0, 0, -0.24 * s)
        .multiply(new THREE.Matrix4().makeRotationX(tilt))
        .multiply(new THREE.Matrix4().makeTranslation(0, 0, -len / 2))
        .multiply(new THREE.Matrix4().makeScale(0.075 * s, 0.07 * s, len)),
      trans: [-1, 1].map((side) => new THREE.Matrix4().makeTranslation(side * 0.4 * s, 0.02, -0.13 * s)
        .multiply(new THREE.Matrix4().makeRotationY(side * 0.35))
        .multiply(new THREE.Matrix4().makeScale(0.34 * s, 0.06, 0.09 * s))),
      dir: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
      axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
      delay: 0.15 + i * 0.035,
      // état animé
      ap: new THREE.Vector3(), aq: new THREE.Quaternion(), e: 0
    });
  }

  // Sacrum stylisé
  const sacrum = new THREE.Mesh(track(new THREE.ConeGeometry(0.62, 0.9, 5)), boneMat);
  sacrum.rotation.set(Math.PI + 0.35, 0, 0);
  spine.add(sacrum);
  const sacrumOffset = new THREE.Vector3(0, -0.38, -0.08);

  /* ---------- Mâchoire / ATM (section maxillo-faciale) ---------- */
  const jawMat = track(new THREE.MeshStandardMaterial({
    color: COLORS.accent, emissive: '#0d5e56', emissiveIntensity: 0.45,
    roughness: 0.3, flatShading: true, transparent: true, opacity: 0
  }));
  // Le pivot est placé au niveau des articulations temporo-mandibulaires : la mâchoire s'ouvre autour.
  const jawPivot = new THREE.Group();
  jawPivot.position.set(0, 3.6, 0.3);
  const jaw = new THREE.Group();
  jaw.position.set(0, -0.32, 0.1);
  jawPivot.add(jaw);
  jaw.add(new THREE.Mesh(
    track(new THREE.TorusGeometry(0.62, 0.055, 6, 32, Math.PI * 1.12).rotateX(Math.PI / 2).rotateY(0.06 * Math.PI)),
    jawMat
  ));
  const jointGeo = track(new THREE.IcosahedronGeometry(0.11, 0));
  const ramusGeo = track(new THREE.CylinderGeometry(0.045, 0.05, 0.36, 5));
  const joints = [];
  for (const side of [-1, 1]) {
    const joint = new THREE.Mesh(jointGeo, jawMat);
    joint.position.set(side * 0.62, 0.32, -0.1);
    const ramus = new THREE.Mesh(ramusGeo, jawMat);
    ramus.position.set(side * 0.62, 0.15, -0.06);
    jaw.add(joint, ramus);
    joints.push(joint);
  }
  // Halos pulsants autour des ATM
  const haloMat = track(new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0, depthWrite: false }));
  const haloGeo = track(new THREE.TorusGeometry(0.2, 0.012, 4, 40));
  const halos = joints.map((joint) => {
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.copy(joint.position);
    halo.rotation.y = Math.PI / 2;
    jaw.add(halo);
    return halo;
  });
  jawPivot.visible = false;
  spine.add(jawPivot);

  /* ---------- Anneaux de mouvement & particules ---------- */
  const ringMat = track(new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, opacity: 0.35 }));
  const rings = [1.55, 1.9, 2.3].map((r, i) => {
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(r, i === 2 ? 0.004 : 0.006, 4, 160)), ringMat);
    ring.userData.base = [Math.PI / 2 + [0.35, -0.5, 0.15][i], [-0.2, 0.3, 0][i]];
    ring.position.y = [0.8, -0.9, 0][i];
    rig.add(ring);
    return ring;
  });

  const COUNT = lowPower ? 140 : 320;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.random() * 1.8;
    positions.set([Math.cos(a) * r, (Math.random() - 0.5) * 7.5, Math.sin(a) * r], i * 3);
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dustMat = track(new THREE.PointsMaterial({
    color: COLORS.accent, size: lowPower ? 0.045 : 0.035, transparent: true, opacity: 0.55, depthWrite: false
  }));
  const dust = new THREE.Points(dustGeo, dustMat);
  rig.add(dust);

  /* ---------- Mise à jour des instances ---------- */
  const B = new THREE.Matrix4();
  const M = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const color = new THREE.Color();

  function updateSpine(time, introT, spread, flex) {
    const swayAmp = 0.025 + flex * 0.11;
    for (let i = 0; i < N; i++) {
      const v = verts[i];
      const e = easeOutCubic(clamp((introT - v.delay) / 1.1));
      const wave = Math.sin(time * 1.1 - i * 0.35);

      pos.copy(v.p);
      pos.y *= 1 + spread * 0.45;
      pos.x += Math.sin(i * 1.7) * spread * 0.12 + wave * swayAmp * (0.3 + v.u);
      pos.addScaledVector(v.dir, (1 - e) * 3.5);

      euler.set(Math.sin(time * 0.9 - i * 0.3) * (0.02 + flex * 0.06), 0, wave * (0.03 + flex * 0.1));
      qa.setFromEuler(euler);
      qb.setFromAxisAngle(v.axis, (1 - e) * 2.4);
      v.aq.copy(v.q).multiply(qa).multiply(qb);
      v.ap.copy(pos);
      v.e = e;

      B.compose(pos, v.aq, scl.setScalar(Math.max(e, 0.001)));
      bodies.setMatrixAt(i, M.multiplyMatrices(B, v.body));
      spinous.setMatrixAt(i, M.multiplyMatrices(B, v.spin));
      transverse.setMatrixAt(i * 2, M.multiplyMatrices(B, v.trans[0]));
      transverse.setMatrixAt(i * 2 + 1, M.multiplyMatrices(B, v.trans[1]));
    }
    for (let i = 0; i < N - 1; i++) {
      const a = verts[i], b = verts[i + 1];
      const e = Math.min(a.e, b.e);
      pos.lerpVectors(a.ap, b.ap, 0.5);
      qa.slerpQuaternions(a.aq, b.aq, 0.5);
      scl.set(0.32 * a.s * e + 0.0001, 0.05 * e + 0.0001, 0.27 * a.s * e + 0.0001);
      discs.setMatrixAt(i, M.compose(pos, qa, scl));
    }
    const last = verts[N - 1];
    sacrum.position.copy(last.ap).addScaledVector(sacrumOffset, 1 + spread * 0.45);
    sacrum.scale.setScalar(Math.max(last.e, 0.001));
    instanced.forEach((mesh) => { mesh.instanceMatrix.needsUpdate = true; });
  }

  function updateColors(time, hl) {
    // Une onde lumineuse parcourt la colonne de haut en bas
    const pulsePos = ((time * 0.22) % 1.5) - 0.25;
    for (let i = 0; i < N; i++) {
      const u = verts[i].u;
      const pulse = Math.exp(-(((u - pulsePos) / 0.07) ** 2)) * 0.6;
      const cervical = i < CERVICAL ? hl * (1 - i / (CERVICAL + 2)) : 0;
      const k = Math.max(pulse, cervical);
      bodies.setColorAt(i, color.copy(COLORS.bone).lerp(COLORS.highlight, k));
      spinous.setColorAt(i, color.copy(COLORS.process).lerp(COLORS.highlight, k));
      transverse.setColorAt(i * 2, color);
      transverse.setColorAt(i * 2 + 1, color);
      if (i < N - 1) discs.setColorAt(i, color.copy(COLORS.disc).lerp(COLORS.discGlow, Math.max(pulse * 1.4, cervical * 0.6)));
    }
    instanced.forEach((mesh) => { mesh.instanceColor.needsUpdate = true; });
  }

  /* ---------- Scroll → keyframes ---------- */
  let anchors = [];
  let frames = DESKTOP;
  const anchorEls = {};
  let halfH = 1, halfW = 1;

  function measure() {
    frames = compactMQ.matches ? MOBILE : DESKTOP;
    anchors = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return { center: r.top + window.scrollY + r.height / 2, kf: frames[el.dataset.scene] ?? frames.hero };
    });
  }

  // Convertit une keyframe en valeurs « monde » (les ancres suivent leur élément HTML)
  function resolve(kf, out) {
    const dir = isRTL() ? -1 : 1;
    KEYS.forEach((k) => { out[k] = kf[k] ?? 0; });
    if (kf.anchor) {
      const el = anchorEls[kf.anchor] ??= document.querySelector(kf.anchor);
      const r = el?.getBoundingClientRect();
      if (r && r.width) {
        out.x = ((r.left + r.width / 2) / window.innerWidth * 2 - 1) * halfW;
        out.y = -((r.top + r.height / 2) / window.innerHeight * 2 - 1) * halfH + kf.y * kf.s;
      } else {
        out.x = 0;
      }
    } else {
      out.x = kf.x * halfW * dir;
    }
    out.rot = kf.rot * dir;
    return out;
  }

  const ka = {}, kb = {};
  const target = {};
  function targetFromScroll() {
    const y = window.scrollY + window.innerHeight / 2;
    if (!anchors.length) return resolve(frames.hero, target);
    if (y <= anchors[0].center) return resolve(anchors[0].kf, target);
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      if (y <= b.center) {
        const k = smooth((y - a.center) / (b.center - a.center));
        resolve(a.kf, ka);
        resolve(b.kf, kb);
        KEYS.forEach((key) => { target[key] = ka[key] + (kb[key] - ka[key]) * k; });
        return target;
      }
    }
    return resolve(anchors[anchors.length - 1].kf, target);
  }

  /* ---------- Interaction : souris, gyroscope, vitesse de scroll ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: 0 };
  const onPointer = (e) => {
    if (e.pointerType === 'touch') return;
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.active = 1;
  };
  const onOrientation = (e) => {
    if (e.gamma == null || e.beta == null) return;
    pointer.tx = clamp(e.gamma / 30, -1, 1);
    pointer.ty = clamp((e.beta - 45) / 30, -1, 1);
    pointer.active = 0.7;
  };
  // Gyroscope : disponible sans autorisation sur Android ; iOS exige une permission, on s'en passe.
  const useGyro = 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function'
    && window.matchMedia('(pointer: coarse)').matches;

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
    measure();
  }

  const resizeObserver = new ResizeObserver(() => measure());
  resizeObserver.observe(document.body);
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointer, { passive: true });
  if (useGyro) window.addEventListener('deviceorientation', onOrientation, { passive: true });
  const onLost = (e) => { e.preventDefault(); onError?.(); };
  canvas.addEventListener('webglcontextlost', onLost);
  resize();

  /* ---------- Boucle ---------- */
  const clock = new THREE.Clock();
  const state = { ...targetFromScroll() };
  let introT = 0;
  let lastScroll = window.scrollY;
  let flex = 0;
  const spin = { offset: 0, vel: 0 };
  let slowFrames = 0, sampled = 0;

  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    introT += dt;

    // Vitesse de scroll → flexion de la colonne + rotation à ressort
    const scrollV = dt > 0 ? (window.scrollY - lastScroll) / dt : 0;
    lastScroll = window.scrollY;
    flex += (clamp(Math.abs(scrollV) / 2500) - flex) * damp(dt, 5);
    spin.vel += clamp(scrollV, -4000, 4000) * 0.00006;
    spin.vel += (-spin.offset * 9 - spin.vel * 3.2) * dt;
    spin.offset += spin.vel * dt;

    const t = targetFromScroll();
    const k = damp(dt, 3.5);
    KEYS.forEach((key) => { state[key] += (t[key] - state[key]) * k; });
    pointer.x += (pointer.tx - pointer.x) * damp(dt, 4);
    pointer.y += (pointer.ty - pointer.y) * damp(dt, 4);
    const intro = smooth(clamp(introT / 1.4));

    rig.position.set(state.x, state.y + Math.sin(time * 0.6) * 0.05, 0);
    rig.scale.setScalar(state.s * (0.92 + 0.08 * intro));

    spine.rotation.y = state.rot + Math.sin(time * 0.25) * 0.3 + pointer.x * 0.55 + spin.offset + (1 - intro) * 1.2;
    spine.rotation.x = pointer.y * 0.18;
    spine.rotation.z = Math.sin(time * 0.4) * 0.025;

    updateSpine(time, introT, state.spread, flex);
    updateColors(time, state.hl);

    // Mâchoire : apparition, ouverture/fermeture douce, halos sur les ATM
    jawMat.opacity = state.hl * intro;
    jawPivot.visible = state.hl > 0.02;
    if (jawPivot.visible) {
      jawPivot.rotation.x = 0.6 + (0.5 + 0.5 * Math.sin(time * 1.5)) * 0.22 * state.hl;
      jawPivot.rotation.y = Math.sin(time * 0.9) * 0.06;
      const h = (time * 0.8) % 1;
      halos.forEach((halo) => halo.scale.setScalar(0.6 + h * 1.6));
      haloMat.opacity = (1 - h) * 0.8 * state.hl;
    }

    rings.forEach((ring, i) => {
      ring.rotation.x = ring.userData.base[0] + pointer.y * 0.25;
      ring.rotation.y = ring.userData.base[1] + pointer.x * 0.2;
      ring.rotation.z = time * [0.18, -0.12, 0.07][i] + spin.offset * 0.5;
      ring.scale.setScalar(1 + Math.sin(time * 0.8 + i) * 0.03 + flex * 0.12);
    });
    ringMat.opacity = 0.3 * intro + flex * 0.25;
    dust.rotation.y = time * 0.03 + spin.offset * 0.6;
    dust.position.y = Math.sin(time * 0.3) * 0.15;

    cursorLight.position.set(pointer.x * halfW, -pointer.y * halfH, 2.5);
    cursorLight.intensity += (pointer.active * (lowPower ? 4 : 6) - cursorLight.intensity) * damp(dt, 3);

    // Légère parallaxe de caméra
    camera.position.x += (pointer.x * 0.3 - camera.position.x) * damp(dt, 3);
    camera.position.y += (-pointer.y * 0.2 - camera.position.y) * damp(dt, 3);
    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, 0);

    canvas.style.opacity = (state.op * intro).toFixed(3);
    renderer.render(scene, camera);

    // Qualité adaptative : si l'appareil peine, on réduit la résolution
    if (introT > 2 && sampled < 120) {
      sampled++;
      if (dt > 1 / 40) slowFrames++;
      if (sampled === 120 && slowFrames > 60 && pixelRatio > 1) {
        pixelRatio = 1;
        renderer.setPixelRatio(1);
      }
    }
  });

  return {
    destroy() {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrientation);
      canvas.removeEventListener('webglcontextlost', onLost);
      resizeObserver.disconnect();
      disposables.forEach((d) => d.dispose?.());
      instanced.forEach((mesh) => mesh.dispose());
      renderer.dispose();
      canvas.style.opacity = '0';
    }
  };
}
