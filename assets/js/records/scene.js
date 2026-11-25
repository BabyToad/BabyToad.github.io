// Reuse the site's existing, licensed Three.js distribution. No CDN/build tooling.
import * as THREE from '../../../six-springs/lib/three.module.js';

const VINYL_RADIUS = 1.2;
const SLEEVE_SIZE = 2.48;
const SLEEVE_THICK = 0.062;
const PLATTER_RADIUS = 1.32;
const PLATTER_X = -0.52;
const PLATTER_Z = 0.06;
const PLATTER_SURFACE_Y = 0.945;
const DECK_X = 1.42;
const DECK_Z = 0.14;
const CRATE_X = -2.52;
const CRATE_Z = 0.24;
const CRATE_ROT_Y = 0.28;
const SNAP_RADIUS = 1.78;
const ARM_PARK_Y = 0;
const ARM_OUTER_GROOVE_Y = -0.43;
const ARM_INNER_GROOVE_Y = -0.77;

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function createBrushedTextures() {
  const size = 512;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');
  const rand = seeded(40219);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    const streak = 116 + Math.floor(rand() * 26);
    bCtx.fillStyle = `rgb(${streak},${streak},${streak})`;
    bCtx.fillRect(0, y, size, 1);
    for (let k = 0; k < 5; k++) {
      const x = Math.floor(rand() * size);
      const len = 30 + Math.floor(rand() * 140);
      const v = 96 + Math.floor(rand() * 64);
      bCtx.fillStyle = `rgba(${v},${v},${v},0.35)`;
      bCtx.fillRect(x, y, len, 1);
    }
  }
  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2, 2);
  return bump;
}

function createVinylTextures() {
  const size = 1024;
  const half = size / 2;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  bCtx.fillStyle = '#787878';
  bCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#383838';
  rCtx.fillRect(0, 0, size, size);

  const rand = seeded(91827);
  // Subtle hourglass anisotropic sheen baked softly into roughness
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const sheen = Math.pow(Math.abs(Math.cos(rad - 0.7)), 3);
    const val = Math.round(52 - sheen * 26);
    rCtx.strokeStyle = `rgba(${val},${val},${val},0.16)`;
    rCtx.lineWidth = 5;
    rCtx.beginPath();
    rCtx.moveTo(half + Math.cos(rad) * (half * 0.36), half + Math.sin(rad) * (half * 0.36));
    rCtx.lineTo(half + Math.cos(rad) * (half * 0.97), half + Math.sin(rad) * (half * 0.97));
    rCtx.stroke();
  }

  // Track silent bands (smooth glossy gaps between LP tracks)
  const silentBands = [0.43, 0.56, 0.70, 0.83, 0.955];
  for (let r = half * 0.35; r < half * 0.985; r += 1.45) {
    const norm = r / half;
    const inGap = silentBands.some(g => Math.abs(norm - g) < 0.011);
    const leadOut = norm < 0.415;
    const amp = inGap ? 4 : leadOut ? 14 : 36;
    const shade = Math.round(128 + (rand() - 0.5) * amp + Math.sin(r * 2.1) * (amp * 0.45));
    bCtx.strokeStyle = `rgb(${shade},${shade},${shade})`;
    bCtx.lineWidth = inGap ? 1.6 : 1.1;
    bCtx.beginPath();
    bCtx.arc(half, half, r, 0, Math.PI * 2);
    bCtx.stroke();

    const roughV = inGap ? 26 : leadOut ? 42 : Math.round(56 + rand() * 34);
    rCtx.strokeStyle = `rgba(${roughV},${roughV},${roughV},0.55)`;
    rCtx.lineWidth = 1.25;
    rCtx.beginPath();
    rCtx.arc(half, half, r, 0, Math.PI * 2);
    rCtx.stroke();
  }

  // Outer raised lip
  bCtx.strokeStyle = '#c8c8c8';
  bCtx.lineWidth = 4;
  bCtx.beginPath();
  bCtx.arc(half, half, half * 0.988, 0, Math.PI * 2);
  bCtx.stroke();

  const bump = new THREE.CanvasTexture(bumpCanvas);
  const rough = new THREE.CanvasTexture(roughCanvas);
  bump.anisotropy = 4;
  rough.anisotropy = 4;
  return { bump, rough };
}

function createRubberMatTexture() {
  const size = 512;
  const half = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#707070';
  ctx.fillRect(0, 0, size, size);
  const ribs = [0.22, 0.27, 0.46, 0.51, 0.72, 0.77, 0.91, 0.96];
  for (const frac of ribs) {
    ctx.strokeStyle = '#c8c8c8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(half, half, half * frac, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(half, half, half * frac - 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function createStrobeTexture() {
  const w = 1024;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1b1917';
  ctx.fillRect(0, 0, w, h);

  const rows = [
    { y: 12, count: 144, r: 2.2 },
    { y: 27, count: 108, r: 4.1 },
    { y: 42, count: 120, r: 2.6 },
    { y: 54, count: 144, r: 2.0 }
  ];
  for (const row of rows) {
    for (let i = 0; i < row.count; i++) {
      const x = ((i + 0.5) / row.count) * w;
      const g = ctx.createRadialGradient(x - 0.8, row.y - 0.8, 0.4, x, row.y, row.r);
      g.addColorStop(0, '#f4efe4');
      g.addColorStop(0.65, '#bfb7a6');
      g.addColorStop(1, '#5a5348');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, row.y, row.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function createDialTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#181614';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#e8e2d4';
  for (let i = 0; i < 32; i++) {
    const x = (i / 32) * 256;
    const major = i % 4 === 0;
    ctx.fillRect(x, major ? 8 : 20, major ? 3 : 1.5, major ? 40 : 22);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

function createStudioEnvironment(pmrem, isDark, accentHex) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(isDark ? '#14110e' : '#dbd2c2');
  const tempGeo = [];
  const tempMat = [];

  function panel(w, h, color, intensity, x, y, z, rx = 0, ry = 0) {
    const geo = new THREE.PlaneGeometry(w, h);
    const col = new THREE.Color(color).multiplyScalar(intensity);
    const mat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    envScene.add(m);
    tempGeo.push(geo);
    tempMat.push(mat);
  }

  // Overhead warm softbox
  panel(18, 12, isDark ? '#fff1da' : '#fffaf0', isDark ? 2.4 : 2.8, 0, 11, 1, Math.PI / 2, 0);
  // Crisp left studio strip (specular highlights on chrome tonearm & acrylic edges)
  panel(3.5, 11, isDark ? '#f5ead6' : '#ffffff', isDark ? 2.1 : 2.5, -12, 4.5, 4, 0, Math.PI / 2.2);
  // Right warm fill card
  panel(4.5, 10, isDark ? accentHex : '#f8ecd6', isDark ? 1.15 : 1.9, 13, 3.8, 3, 0, -Math.PI / 2.2);
  // Rear rim light (catches open dustcover edge & top of vinyl sleeves)
  panel(16, 4.5, isDark ? '#ffe7be' : '#fff8eb', isDark ? 1.75 : 2.1, 0, 6.5, -11, 0.25, 0);
  // Front-top subtle bounce for vinyl clearcoat & acrylic front lip
  panel(12, 3, isDark ? '#d9cbb4' : '#f7f1e6', isDark ? 0.9 : 1.35, -1, 5.2, 12, -0.35, Math.PI);
  // Dark floor contrast band so metals read as genuine metal
  panel(28, 28, isDark ? '#070605' : '#574e40', 1, 0, -5, 0, -Math.PI / 2, 0);

  const rt = pmrem.fromScene(envScene, 0.035);
  tempGeo.forEach(g => g.dispose());
  tempMat.forEach(m => m.dispose());
  return rt;
}

export function createTurntable(host, action, onLost, albums = []) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.setClearColor(0, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const world = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(29, 1.45, 0.1, 60);
  const lookTarget = new THREE.Vector3(-0.24, 1.04, 0.12);
  const camDir = new THREE.Vector3(0.30, 5.05, 8.75).normalize();

  // Studio Lighting
  const hemiLight = new THREE.HemisphereLight(0xfff6e8, 0x2a241d, 0.9);
  world.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.3);
  keyLight.position.set(-4.6, 10.5, 6.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -6.5;
  keyLight.shadow.camera.right = 6.5;
  keyLight.shadow.camera.top = 5.5;
  keyLight.shadow.camera.bottom = -5.5;
  keyLight.shadow.camera.near = 1.5;
  keyLight.shadow.camera.far = 26;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.025;
  keyLight.shadow.radius = 2.5;
  world.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffe9c8, 1.15);
  rimLight.position.set(5.5, 6.2, -5.8);
  world.add(rimLight);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  let envRT = null;

  // Procedural textures
  const brushedBump = createBrushedTextures();
  const vinylTex = createVinylTextures();
  const rubberBump = createRubberMatTexture();
  const strobeTex = createStrobeTexture();
  const dialTex = createDialTexture();
  const proceduralTextures = [brushedBump, vinylTex.bump, vinylTex.rough, rubberBump, strobeTex, dialTex];

  const disposableMaterials = [];
  const trackMat = mat => { disposableMaterials.push(mat); return mat; };

  // Shared PBR & Glass Materials
  const mats = {
    subChassis: trackMat(new THREE.MeshStandardMaterial({ color: '#1b1815', roughness: 0.76, metalness: 0.25 })),
    brushedDeck: trackMat(new THREE.MeshStandardMaterial({
      color: '#3c3630', roughness: 0.34, metalness: 0.78, bumpMap: brushedBump, bumpScale: 0.008, roughnessMap: brushedBump
    })),
    brushedSilver: trackMat(new THREE.MeshStandardMaterial({
      color: '#cbc3b4', roughness: 0.26, metalness: 0.88, bumpMap: brushedBump, bumpScale: 0.005
    })),
    chrome: trackMat(new THREE.MeshStandardMaterial({ color: '#e6e0d5', roughness: 0.12, metalness: 0.96 })),
    darkMetal: trackMat(new THREE.MeshStandardMaterial({ color: '#24201c', roughness: 0.42, metalness: 0.65 })),
    brass: trackMat(new THREE.MeshStandardMaterial({ color: '#b8944f', roughness: 0.28, metalness: 0.88 })),
    rubber: trackMat(new THREE.MeshStandardMaterial({
      color: '#191715', roughness: 0.86, metalness: 0.04, bumpMap: rubberBump, bumpScale: 0.012
    })),
    footRubber: trackMat(new THREE.MeshStandardMaterial({ color: '#141210', roughness: 0.92, metalness: 0.02 })),
    strobeBand: trackMat(new THREE.MeshStandardMaterial({ map: strobeTex, roughness: 0.32, metalness: 0.72 })),
    dial: trackMat(new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.5, metalness: 0.2 })),
    accent: trackMat(new THREE.MeshStandardMaterial({
      color: '#ffb000', emissive: '#ffb000', emissiveIntensity: 0.2, roughness: 0.32, metalness: 0.15
    })),
    accentGlow: trackMat(new THREE.MeshStandardMaterial({
      color: '#ffb000', emissive: '#ffb000', emissiveIntensity: 0.65, roughness: 0.2, metalness: 0.05
    })),
    plinthGlass: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#2c2721', transparent: true, opacity: 0.56, roughness: 0.07, metalness: 0.05,
      ior: 1.49, reflectivity: 0.92, clearcoat: 1.0, clearcoatRoughness: 0.04, envMapIntensity: 1.9
    })),
    dustcoverGlass: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#d8d0c2', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.05,
      ior: 1.49, reflectivity: 0.95, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 2.1,
      depthWrite: false, side: THREE.DoubleSide
    })),
    crateGlass: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#ded6c8', transparent: true, opacity: 0.21, roughness: 0.06, metalness: 0.05,
      ior: 1.49, reflectivity: 0.94, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 1.95,
      depthWrite: false, side: THREE.DoubleSide
    })),
    glassEdge: trackMat(new THREE.LineBasicMaterial({ color: '#f3ece0', transparent: true, opacity: 0.36 })),
    plinthEdge: trackMat(new THREE.LineBasicMaterial({ color: '#e6dccb', transparent: true, opacity: 0.28 })),
    vinyl: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#11100f', roughness: 0.26, metalness: 0.08, clearcoat: 0.92, clearcoatRoughness: 0.14,
      bumpMap: vinylTex.bump, bumpScale: 0.015, roughnessMap: vinylTex.rough, envMapIntensity: 1.45
    })),
    snapRing: trackMat(new THREE.MeshBasicMaterial({
      color: '#ffb000', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false
    })),
    jacketBack: trackMat(new THREE.MeshStandardMaterial({ color: '#27221d', roughness: 0.78, metalness: 0.02 })),
    innerPaper: trackMat(new THREE.MeshStandardMaterial({ color: '#ebe4d6', roughness: 0.88, metalness: 0 })),
    slotDark: trackMat(new THREE.MeshStandardMaterial({ color: '#141210', roughness: 0.95, metalness: 0 })),
    shadowFloor: trackMat(new THREE.ShadowMaterial({ opacity: 0.28 }))
  };

  function addMesh(geometry, material, parent, x = 0, y = 0, z = 0, shadow = true) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(x, y, z);
    item.castShadow = shadow;
    item.receiveShadow = shadow;
    parent.add(item);
    return item;
  }

  function addEdges(meshObj, edgeMat, threshold = 24) {
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(meshObj.geometry, threshold), edgeMat);
    meshObj.add(edges);
    return edges;
  }

  // Contact shadow floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), mats.shadowFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  world.add(floor);

  // =========================================================================
  // 1. HI-FI TURNTABLE DECK
  // =========================================================================
  const deck = new THREE.Group();
  deck.position.set(DECK_X, 0, DECK_Z);
  world.add(deck);

  // Four machined isolation feet (bottom y=0, top y=0.22)
  for (const fx of [-1.62, 1.62]) {
    for (const fz of [-1.22, 1.22]) {
      const foot = new THREE.Group();
      foot.position.set(fx, 0, fz);
      deck.add(foot);
      addMesh(new THREE.CylinderGeometry(0.19, 0.21, 0.05, 32), mats.footRubber, foot, 0, 0.025, 0);
      addMesh(new THREE.CylinderGeometry(0.22, 0.22, 0.09, 32), mats.darkMetal, foot, 0, 0.095, 0);
      addMesh(new THREE.CylinderGeometry(0.245, 0.245, 0.036, 32), mats.brushedSilver, foot, 0, 0.158, 0);
      addMesh(new THREE.CylinderGeometry(0.20, 0.22, 0.045, 32), mats.subChassis, foot, 0, 0.198, 0);
    }
  }

  // Recessed acoustic sub-chassis base
  const subGeo = new THREE.ExtrudeGeometry(roundedRectShape(3.78, 2.98, 0.10), {
    depth: 0.13, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2
  });
  subGeo.rotateX(Math.PI / 2);
  addMesh(subGeo, mats.subChassis, deck, 0, 0.35, 0);

  // Subtle internal motor & brass drive pulley glimpsed beneath the clear acrylic plinth
  const motorGroup = new THREE.Group();
  motorGroup.position.set(-1.52, 0.44, -0.96);
  deck.add(motorGroup);
  addMesh(new THREE.CylinderGeometry(0.22, 0.24, 0.14, 24), mats.darkMetal, motorGroup, 0, 0, 0, false);
  addMesh(new THREE.CylinderGeometry(0.085, 0.085, 0.19, 24), mats.brass, motorGroup, 0, 0.06, 0, false);
  const beltRing = addMesh(new THREE.TorusGeometry(0.68, 0.014, 8, 48), mats.footRubber, deck, -0.94, 0.50, -0.36, false);
  beltRing.rotation.x = Math.PI / 2;

  // Main thick beveled transparent acrylic plinth body
  const plinthGeo = new THREE.ExtrudeGeometry(roundedRectShape(4.06, 3.26, 0.12), {
    depth: 0.30, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3
  });
  plinthGeo.rotateX(Math.PI / 2);
  const plinthMesh = addMesh(plinthGeo, mats.plinthGlass, deck, 0, 0.66, 0, false);
  plinthMesh.receiveShadow = true;
  plinthMesh.renderOrder = 2;
  addEdges(plinthMesh, mats.plinthEdge, 28);

  // Brushed metal recessed top deck plate
  const topPlateGeo = new THREE.ExtrudeGeometry(roundedRectShape(3.72, 2.92, 0.08), {
    depth: 0.04, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2
  });
  topPlateGeo.rotateX(Math.PI / 2);
  addMesh(topPlateGeo, mats.brushedDeck, deck, 0, 0.705, 0);

  // Corner hex mounting screws on top plate
  for (const sx of [-1.70, 1.70]) {
    for (const sz of [-1.30, 1.30]) {
      addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.016, 12), mats.brushedSilver, deck, sx, 0.716, sz, false);
    }
  }

  // Recessed platter well bezel ring
  const wellRing = addMesh(new THREE.RingGeometry(1.32, 1.38, 72), mats.darkMetal, deck, PLATTER_X, 0.714, PLATTER_Z, false);
  wellRing.rotation.x = -Math.PI / 2;

  // Platter snap-zone highlight ring (visible only during active record drag over snap zone)
  const snapRingMesh = addMesh(new THREE.RingGeometry(1.26, 1.36, 72), mats.snapRing, deck, PLATTER_X, 0.955, PLATTER_Z, false);
  snapRingMesh.rotation.x = -Math.PI / 2;
  snapRingMesh.renderOrder = 6;

  // Platter Assembly (rotates with vinyl at 33⅓ RPM when playing)
  const platterGroup = new THREE.Group();
  platterGroup.position.set(PLATTER_X, 0.715, PLATTER_Z);
  deck.add(platterGroup);

  const platterProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(PLATTER_RADIUS, 0.0),
    new THREE.Vector2(PLATTER_RADIUS, 0.025),
    new THREE.Vector2(1.265, 0.165),
    new THREE.Vector2(1.235, 0.190),
    new THREE.Vector2(0.0, 0.190)
  ];
  addMesh(new THREE.LatheGeometry(platterProfile, 96), mats.brushedSilver, platterGroup, 0, 0, 0);

  // Sloped strobe dot band on platter rim
  const strobeSkirt = addMesh(
    new THREE.CylinderGeometry(1.268, 1.321, 0.136, 96, 1, true),
    mats.strobeBand, platterGroup, 0, 0.095, 0, false
  );
  strobeSkirt.receiveShadow = true;

  // Molded anti-static rubber slipmat
  addMesh(new THREE.CylinderGeometry(1.225, 1.235, 0.04, 96), mats.rubber, platterGroup, 0, 0.210, 0);
  // Subtle recessed label ring on rubber mat
  const matCenter = addMesh(new THREE.CylinderGeometry(0.41, 0.42, 0.008, 48), mats.footRubber, platterGroup, 0, 0.231, 0, false);
  matCenter.receiveShadow = true;

  // Machined spindle bushing + stainless steel center spindle
  addMesh(new THREE.CylinderGeometry(0.088, 0.098, 0.018, 32), mats.brass, platterGroup, 0, 0.236, 0, false);
  const spindlePin = addMesh(new THREE.CylinderGeometry(0.032, 0.034, 0.21, 24), mats.chrome, platterGroup, 0, 0.34, 0);
  addMesh(new THREE.ConeGeometry(0.032, 0.028, 24), mats.chrome, platterGroup, 0, 0.459, 0, false);
  spindlePin.castShadow = true;

  // Deck Front Controls: Start/Stop, 33/45 RPM, Strobe Illuminator Tower, Pitch Fader, Power LED
  // Start/Stop button (front-left)
  addMesh(new THREE.BoxGeometry(0.42, 0.028, 0.28), mats.darkMetal, deck, -1.52, 0.72, 1.14);
  addMesh(new THREE.BoxGeometry(0.35, 0.042, 0.21), mats.brushedSilver, deck, -1.52, 0.74, 1.14);
  const startStrip = addMesh(new THREE.BoxGeometry(0.28, 0.012, 0.025), mats.accentGlow, deck, -1.52, 0.763, 1.21, false);

  // 33 / 45 RPM speed buttons
  addMesh(new THREE.BoxGeometry(0.15, 0.03, 0.11), mats.darkMetal, deck, -1.08, 0.725, 1.19);
  addMesh(new THREE.BoxGeometry(0.15, 0.03, 0.11), mats.darkMetal, deck, -0.89, 0.725, 1.19);
  addMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.016, 16), mats.accentGlow, deck, -1.08, 0.745, 1.10, false);

  // Strobe illuminator prism tower angled toward the spinning strobe dots
  const strobeTower = new THREE.Group();
  strobeTower.position.set(-1.58, 0.715, 0.74);
  strobeTower.rotation.y = 0.56;
  deck.add(strobeTower);
  addMesh(new THREE.CylinderGeometry(0.09, 0.11, 0.16, 24), mats.darkMetal, strobeTower, 0, 0.08, 0);
  addMesh(new THREE.CylinderGeometry(0.082, 0.082, 0.025, 24), mats.brushedSilver, strobeTower, 0, 0.165, 0);
  const strobeLens = addMesh(new THREE.BoxGeometry(0.075, 0.055, 0.04), mats.accentGlow, strobeTower, 0.06, 0.10, 0, false);
  const strobeLight = new THREE.PointLight(0xffb000, 0.55, 2.2, 2);
  strobeLight.position.set(-1.38, 0.85, 0.62);
  deck.add(strobeLight);

  // Pitch control fader (right side of deck)
  addMesh(new THREE.BoxGeometry(0.30, 0.014, 1.18), mats.darkMetal, deck, 1.62, 0.716, 0.42, false);
  addMesh(new THREE.BoxGeometry(0.045, 0.016, 0.96), mats.slotDark, deck, 1.62, 0.720, 0.42, false);
  addMesh(new THREE.BoxGeometry(0.16, 0.055, 0.19), mats.brushedSilver, deck, 1.62, 0.752, 0.42);
  addMesh(new THREE.BoxGeometry(0.164, 0.012, 0.022), mats.darkMetal, deck, 1.62, 0.781, 0.42, false);
  // Tiny pitch center LED
  addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 16), mats.accentGlow, deck, 1.41, 0.72, 0.42, false);

  // Power/play indicator LED bezel (front-right)
  addMesh(new THREE.CylinderGeometry(0.055, 0.062, 0.022, 24), mats.brushedSilver, deck, 1.24, 0.72, 1.22, false);
  const playLed = addMesh(new THREE.SphereGeometry(0.036, 16, 12), mats.accentGlow, deck, 1.24, 0.732, 1.22, false);

  // =========================================================================
  // 2. PRECISION S-SHAPED TONEARM ASSEMBLY
  // =========================================================================
  const armBaseX = 1.22;
  const armBaseZ = -0.76;
  const armStation = new THREE.Group();
  armStation.position.set(armBaseX, 0.715, armBaseZ);
  deck.add(armStation);

  // Circular recessed armbase & VTA height adjustment collar
  addMesh(new THREE.CylinderGeometry(0.42, 0.45, 0.045, 48), mats.darkMetal, armStation, 0, 0.022, 0);
  addMesh(new THREE.CylinderGeometry(0.35, 0.37, 0.055, 48), mats.brushedSilver, armStation, 0, 0.068, 0);
  addMesh(new THREE.CylinderGeometry(0.24, 0.26, 0.10, 36), mats.darkMetal, armStation, 0, 0.135, 0);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), mats.chrome, armStation, Math.cos(a) * 0.39, 0.048, Math.sin(a) * 0.39, false);
  }

  // Anti-skate dial knob beside armbase
  const antiSkate = new THREE.Group();
  antiSkate.position.set(0.34, 0.08, 0.24);
  armStation.add(antiSkate);
  addMesh(new THREE.CylinderGeometry(0.085, 0.095, 0.07, 24), mats.darkMetal, antiSkate, 0, 0, 0);
  addMesh(new THREE.CylinderGeometry(0.072, 0.072, 0.025, 24), mats.brushedSilver, antiSkate, 0, 0.045, 0);

  // Cueing lift bar & mini chrome cue lever
  addMesh(new THREE.CylinderGeometry(0.025, 0.028, 0.22, 16), mats.chrome, armStation, -0.22, 0.11, 0.36);
  const cueBar = addMesh(new THREE.TorusGeometry(0.22, 0.018, 10, 24, Math.PI * 0.55), mats.darkMetal, armStation, -0.02, 0.23, 0.38);
  cueBar.rotation.x = Math.PI / 2;
  cueBar.rotation.z = 0.7;
  const cueLever = addMesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 12), mats.chrome, armStation, 0.28, 0.17, 0.44);
  cueLever.rotation.z = -0.55;
  addMesh(new THREE.SphereGeometry(0.032, 12, 10), mats.darkMetal, armStation, 0.38, 0.25, 0.44);

  // Tonearm rest post (cradles the wand cleanly when parked)
  const armRest = new THREE.Group();
  armRest.position.set(0.06, 0, 1.18);
  armStation.add(armRest);
  addMesh(new THREE.CylinderGeometry(0.048, 0.058, 0.03, 18), mats.brushedSilver, armRest, 0, 0.015, 0);
  addMesh(new THREE.CylinderGeometry(0.028, 0.032, 0.28, 16), mats.darkMetal, armRest, 0, 0.155, 0);
  const restClip = addMesh(new THREE.TorusGeometry(0.042, 0.015, 10, 18, Math.PI * 1.25), mats.darkMetal, armRest, 0, 0.30, 0);
  restClip.rotation.y = Math.PI / 2;
  restClip.rotation.z = Math.PI * 0.88;

  // Rotating tonearm gimbal yaw group
  const armYaw = new THREE.Group();
  armYaw.position.set(0, 0.355, 0); // deck-local y = 1.07
  armStation.add(armYaw);

  // Outer gimbal U-yoke arch & bearing caps
  addMesh(new THREE.BoxGeometry(0.32, 0.04, 0.16), mats.darkMetal, armYaw, 0, -0.11, 0);
  addMesh(new THREE.BoxGeometry(0.045, 0.25, 0.14), mats.brushedSilver, armYaw, -0.145, 0.01, 0);
  addMesh(new THREE.BoxGeometry(0.045, 0.25, 0.14), mats.brushedSilver, armYaw, 0.145, 0.01, 0);
  addMesh(new THREE.BoxGeometry(0.33, 0.042, 0.14), mats.brushedSilver, armYaw, 0, 0.14, 0);
  // Top & side precision gimbal bearing screws
  addMesh(new THREE.CylinderGeometry(0.042, 0.042, 0.035, 20), mats.chrome, armYaw, 0, 0.172, 0);
  const leftBearing = addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.04, 20), mats.chrome, armYaw, -0.17, 0.015, 0);
  leftBearing.rotation.z = Math.PI / 2;
  const rightBearing = addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.04, 20), mats.chrome, armYaw, 0.17, 0.015, 0);
  rightBearing.rotation.z = Math.PI / 2;

  // Pitching tonearm wand group (lifts smoothly off armrest & drops stylus onto groove)
  const armPitch = new THREE.Group();
  armPitch.position.set(0, 0.015, 0); // deck-local y = 1.085
  armYaw.add(armPitch);

  // Inner gimbal pivot block
  addMesh(new THREE.CylinderGeometry(0.085, 0.085, 0.18, 24), mats.darkMetal, armPitch, 0, 0, 0);

  // Rear counterweight stub + machined brushed counterweight + calibrated tracking force dial
  const stub = addMesh(new THREE.CylinderGeometry(0.032, 0.032, 0.56, 18), mats.chrome, armPitch, 0, 0, -0.28);
  stub.rotation.x = Math.PI / 2;
  const cwBody = addMesh(new THREE.CylinderGeometry(0.118, 0.118, 0.26, 36), mats.brushedSilver, armPitch, 0, 0, -0.40);
  cwBody.rotation.x = Math.PI / 2;
  const cwDial = addMesh(new THREE.CylinderGeometry(0.122, 0.122, 0.068, 36), mats.dial, armPitch, 0, 0, -0.245);
  cwDial.rotation.x = Math.PI / 2;
  const cwCap = addMesh(new THREE.CylinderGeometry(0.095, 0.115, 0.032, 32), mats.darkMetal, armPitch, 0, 0, -0.545);
  cwCap.rotation.x = Math.PI / 2;

  // S-shaped chrome tonearm tube
  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0.52),
    new THREE.Vector3(0.095, 0, 1.06),
    new THREE.Vector3(0.03, 0, 1.46),
    new THREE.Vector3(-0.125, -0.015, 1.76)
  ]);
  const armTube = addMesh(new THREE.TubeGeometry(armCurve, 44, 0.028, 16, false), mats.chrome, armPitch, 0, 0, 0);
  armTube.userData.action = 'arm';

  // Bayonet locking collar, angled headshell, finger lift & moving-magnet cartridge
  const headGroup = new THREE.Group();
  headGroup.position.set(-0.125, -0.015, 1.76);
  headGroup.rotation.y = -0.38;
  armPitch.add(headGroup);

  const collar = addMesh(new THREE.CylinderGeometry(0.046, 0.044, 0.085, 24), mats.darkMetal, headGroup, 0, 0, 0.03);
  collar.rotation.x = Math.PI / 2;
  collar.userData.action = 'arm';

  // Headshell body
  const headshell = addMesh(new THREE.BoxGeometry(0.14, 0.042, 0.30), mats.darkMetal, headGroup, 0, 0.012, 0.21);
  headshell.userData.action = 'arm';
  // Top mounting bolts
  addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), mats.chrome, headGroup, -0.038, 0.036, 0.24, false);
  addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), mats.chrome, headGroup, 0.038, 0.036, 0.24, false);

  // Curved chrome finger lift wire
  const liftCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.065, 0.015, 0.16),
    new THREE.Vector3(0.155, 0.025, 0.19),
    new THREE.Vector3(0.195, 0.065, 0.26)
  ]);
  const fingerLift = addMesh(new THREE.TubeGeometry(liftCurve, 14, 0.009, 8, false), mats.chrome, headGroup, 0, 0, 0, false);
  fingerLift.userData.action = 'arm';

  // Moving-magnet cartridge body + accent stylus housing + cantilever needle
  const cartBody = addMesh(new THREE.BoxGeometry(0.115, 0.082, 0.21), mats.subChassis, headGroup, 0, -0.042, 0.22);
  cartBody.userData.action = 'arm';
  const stylusHousing = addMesh(new THREE.BoxGeometry(0.105, 0.048, 0.095), mats.accent, headGroup, 0, -0.068, 0.295);
  stylusHousing.userData.action = 'arm';
  const cantilever = addMesh(new THREE.CylinderGeometry(0.004, 0.006, 0.062, 8), mats.chrome, headGroup, 0, -0.102, 0.325, false);
  cantilever.rotation.x = 0.36;

  // Generous invisible hit volume for effortless arm tap/drag
  const armHitMat = trackMat(new THREE.MeshBasicMaterial({ visible: false }));
  const armHit = addMesh(new THREE.BoxGeometry(0.74, 0.56, 2.55), armHitMat, armPitch, -0.08, 0.02, 0.85, false);
  armHit.userData.action = 'arm';

  // =========================================================================
  // 3. OPEN TRANSPARENT ACRYLIC DUSTCOVER & SPRING HINGES
  // =========================================================================
  const hingeZ = -1.58;
  const hingeY = 0.67;
  // Two rear brushed-metal spring hinge brackets
  for (const hx of [-1.26, 1.26]) {
    addMesh(new THREE.BoxGeometry(0.24, 0.12, 0.09), mats.brushedSilver, deck, hx, hingeY - 0.01, hingeZ - 0.02);
    const pin = addMesh(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 16), mats.chrome, deck, hx, hingeY + 0.04, hingeZ);
    pin.rotation.z = Math.PI / 2;
  }

  const dustcover = new THREE.Group();
  dustcover.position.set(0, hingeY + 0.04, hingeZ);
  dustcover.rotation.x = -0.98; // ~56 deg open, cleanly framing the platter behind the deck
  deck.add(dustcover);

  const dcW = 4.02;
  const dcD = 3.16;
  const dcH = 0.44;
  const dcT = 0.036;

  function addGlassPanel(w, h, d, x, y, z, parent, mat, edgeMat, order = 4) {
    const panelMesh = addMesh(new THREE.BoxGeometry(w, h, d), mat, parent, x, y, z, false);
    panelMesh.renderOrder = order;
    addEdges(panelMesh, edgeMat, 30);
    return panelMesh;
  }

  // Clamp tabs gripping the rear dustcover wall
  for (const hx of [-1.26, 1.26]) {
    addMesh(new THREE.BoxGeometry(0.22, 0.16, 0.068), mats.darkMetal, dustcover, hx, 0.10, 0.02, false);
  }
  // Top hood pane
  addGlassPanel(dcW, dcT, dcD, 0, dcH, dcD / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 5);
  // Front lip
  addGlassPanel(dcW, dcH, dcT, 0, dcH / 2, dcD - dcT / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 5);
  // Rear hinge wall
  addGlassPanel(dcW, dcH, dcT, 0, dcH / 2, dcT / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 4);
  // Left & Right side walls
  addGlassPanel(dcT, dcH, dcD - dcT * 2, -dcW / 2 + dcT / 2, dcH / 2, dcD / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 4);
  addGlassPanel(dcT, dcH, dcD - dcT * 2, dcW / 2 - dcT / 2, dcH / 2, dcD / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 4);

  // =========================================================================
  // 4. REALISTIC 12" VINYL RECORD & PROCEDURAL PAPER LABEL
  // =========================================================================
  const record = new THREE.Group();
  world.add(record);

  const vinylDisc = addMesh(new THREE.CylinderGeometry(VINYL_RADIUS, VINYL_RADIUS, 0.026, 96), mats.vinyl, record, 0, 0, 0);
  vinylDisc.userData.action = 'record';

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = labelCanvas.height = 512;
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.anisotropy = 4;
  const labelMat = trackMat(new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.64, metalness: 0.02 }));
  const labelFace = addMesh(new THREE.CircleGeometry(0.395, 64), labelMat, record, 0, 0.0145, 0, false);
  labelFace.rotation.x = -Math.PI / 2;
  labelFace.userData.action = 'record';

  // Back side label (subtle when vinyl lifts/tilts during drag)
  const labelBack = addMesh(new THREE.CircleGeometry(0.395, 48), labelMat, record, 0, -0.0145, 0, false);
  labelBack.rotation.x = Math.PI / 2;
  labelBack.userData.action = 'record';

  // =========================================================================
  // 5. TRANSPARENT ACRYLIC RECORD CRATE & BROWSABLE 3D SLEEVES
  // =========================================================================
  const crate = new THREE.Group();
  crate.position.set(CRATE_X, 0, CRATE_Z);
  crate.rotation.y = CRATE_ROT_Y;
  world.add(crate);

  // Crate rubber feet
  for (const cx of [-1.24, 1.24]) {
    for (const cz of [-1.18, 0.92]) {
      addMesh(new THREE.CylinderGeometry(0.11, 0.12, 0.05, 20), mats.footRubber, crate, cx, 0.025, cz);
    }
  }

  // Clear acrylic base slab (extends forward to create an open-sided front showcase ledge)
  addGlassPanel(2.96, 0.075, 2.48, 0, 0.088, -0.14, crate, mats.crateGlass, mats.glassEdge, 2);

  // Subtle stepped acrylic support rails inside the bin (grounds the rising stacked sleeves)
  for (let r = 0; r < 4; r++) {
    const railZ = 0.16 - r * 0.36;
    const railH = 0.07 + r * 0.08;
    addMesh(new THREE.BoxGeometry(2.70, railH, 0.22), mats.subChassis, crate, 0, 0.125 + railH / 2, railZ, false);
  }

  // Swooped acrylic side walls enclosing the stacked bin (z = -1.36 .. +0.46)
  // Front showcase ledge (z = +0.46 .. +1.08) stays open-sided so vinyl slides out cleanly!
  const sideWallShape = new THREE.Shape();
  sideWallShape.moveTo(-1.36, 0.12);
  sideWallShape.lineTo(0.46, 0.12);
  sideWallShape.lineTo(0.46, 0.64);
  sideWallShape.bezierCurveTo(0.18, 0.72, -0.25, 1.48, -0.82, 1.62);
  sideWallShape.lineTo(-1.36, 1.66);
  sideWallShape.closePath();

  const sideWallGeo = new THREE.ExtrudeGeometry(sideWallShape, {
    depth: 0.055, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2
  });
  // ExtrudeGeometry builds in XY plane; rotateY(-PI/2) maps shape +X -> +Z, shape +Y -> +Y
  sideWallGeo.rotateY(-Math.PI / 2);

  const leftWall = addMesh(sideWallGeo, mats.crateGlass, crate, -1.45, 0, 0, false);
  leftWall.renderOrder = 3;
  addEdges(leftWall, mats.glassEdge, 24);

  const rightWall = addMesh(sideWallGeo, mats.crateGlass, crate, 1.505, 0, 0, false);
  rightWall.renderOrder = 3;
  addEdges(rightWall, mats.glassEdge, 24);

  // Angled clear acrylic rear backrest wall
  const backWall = addGlassPanel(2.96, 1.66, 0.055, 0, 0.94, -1.42, crate, mats.crateGlass, mats.glassEdge, 3);
  backWall.rotation.x = -0.18;

  // Low clear acrylic front retaining lip + active accent showcase rail
  addGlassPanel(2.96, 0.30, 0.055, 0, 0.27, 1.07, crate, mats.crateGlass, mats.glassEdge, 4);
  addMesh(new THREE.BoxGeometry(2.56, 0.036, 0.036), mats.accent, crate, 0.04, 0.145, 1.04, false);

  // Machined brushed-metal standoff bolts joining acrylic panels
  for (const bx of [-1.47, 1.47]) {
    for (const [by, bz] of [[0.24, 0.36], [0.24, -1.26], [1.46, -1.30]]) {
      const bolt = addMesh(new THREE.CylinderGeometry(0.045, 0.045, 0.09, 16), mats.brushedSilver, crate, bx, by, bz, false);
      bolt.rotation.z = Math.PI / 2;
    }
  }

  // Dynamic browsable sleeve entries
  const loader = new THREE.TextureLoader();
  const coverTextures = new Map();
  const sleeveEntries = [];
  const sleeveHitTargets = [];
  let catalogue = Array.isArray(albums) ? albums.slice() : [];

  function ensureCoverTexture(album, mat) {
    if (!album?.id || !album.cover) return;
    if (coverTextures.has(album.id)) {
      mat.map = coverTextures.get(album.id);
      mat.needsUpdate = true;
      return;
    }
    loader.load(album.cover, texture => {
      if (disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      coverTextures.set(album.id, texture);
      const entry = sleeveEntries.find(e => e.album.id === album.id);
      if (entry) {
        entry.frontMat.map = texture;
        entry.frontMat.color.set('#ffffff');
        entry.frontMat.needsUpdate = true;
        schedule();
      }
    });
  }

  const sleeveBoardGeo = new THREE.BoxGeometry(SLEEVE_SIZE, SLEEVE_SIZE, SLEEVE_THICK);
  const sleeveCoverGeo = new THREE.PlaneGeometry(SLEEVE_SIZE - 0.016, SLEEVE_SIZE - 0.016);
  const sleeveMouthGeo = new THREE.BoxGeometry(0.014, SLEEVE_SIZE - 0.05, SLEEVE_THICK - 0.022);
  const sleeveInnerGeo = new THREE.BoxGeometry(0.010, SLEEVE_SIZE - 0.10, SLEEVE_THICK - 0.036);

  function addSleeveEntry(album, idx) {
    const group = new THREE.Group();
    crate.add(group);

    const edgeTone = trackMat(new THREE.MeshStandardMaterial({
      color: '#ded6c5', roughness: 0.78, metalness: 0.02
    }));
    const frontMat = trackMat(new THREE.MeshStandardMaterial({
      color: '#d8d0c0', roughness: 0.44, metalness: 0.02
    }));

    // Six-face material array: +x(open mouth), -x(spine), +y(top), -y(bottom), +z(front), -z(back)
    const board = addMesh(sleeveBoardGeo, [
      mats.slotDark, edgeTone, edgeTone, edgeTone, mats.jacketBack, mats.jacketBack
    ], group, 0, 0, 0);
    board.userData = { sleeveId: album.id };

    const frontFace = addMesh(sleeveCoverGeo, frontMat, group, 0, 0, SLEEVE_THICK / 2 + 0.002, false);
    frontFace.receiveShadow = true;
    frontFace.userData = { sleeveId: album.id };

    // Visible recessed right-edge sleeve opening & white paper inner sleeve hint
    addMesh(sleeveMouthGeo, mats.slotDark, group, SLEEVE_SIZE / 2 - 0.004, 0, 0, false);
    addMesh(sleeveInnerGeo, mats.innerPaper, group, SLEEVE_SIZE / 2 - 0.008, 0, 0.003, false);

    sleeveHitTargets.push(board, frontFace);

    const entry = {
      album,
      index: idx,
      group,
      edgeTone,
      frontMat,
      hover: 0,
      pos: new THREE.Vector3(),
      targetPos: new THREE.Vector3(),
      rotX: -0.15,
      targetRotX: -0.15,
      initialized: false
    };
    sleeveEntries.push(entry);
    ensureCoverTexture(album, frontMat);
    return entry;
  }

  catalogue.forEach((album, idx) => addSleeveEntry(album, idx));

  // =========================================================================
  // STATE, LAYOUT TARGETS & COORDINATE TRANSFORMS
  // =========================================================================
  let state = { album: catalogue[0] || null, placed: false, cued: false, playing: false };
  let frame = 0;
  let disposed = false;
  let visible = true;
  let lastTime = 0;
  let placeProgress = 0;
  let cueProgress = 0;
  let grooveProgress = 0;
  let platterAngle = 0;
  let drag = null;
  let pendingSelect = null;
  let settle = null;
  let hoveredSleeveId = null;
  let hoveredAction = null;
  let vinylHoverNudge = 0;
  let snapGlow = 0;

  const platterWorldPos = new THREE.Vector3(DECK_X + PLATTER_X, PLATTER_SURFACE_Y + 0.015, DECK_Z + PLATTER_Z);
  const flatQuat = new THREE.Quaternion();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.46);
  const dragClampMin = new THREE.Vector3(-4.2, 1.46, -2.1);
  const dragClampMax = new THREE.Vector3(3.4, 1.46, 2.2);

  // Scratch vectors & quaternions (zero per-frame allocations)
  const tmpPos = new THREE.Vector3();
  const tmpHomePos = new THREE.Vector3();
  const tmpHomeQuat = new THREE.Quaternion();
  const tmpSleeveWorldQuat = new THREE.Quaternion();
  const tmpVinylLocalQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
  const tmpTiltQuat = new THREE.Quaternion();
  const tmpSpinQuat = new THREE.Quaternion();
  const tmpEuler = new THREE.Euler();
  const upAxis = new THREE.Vector3(0, 1, 0);

  function getSelectedIndex() {
    if (!state.album?.id) return 0;
    const idx = sleeveEntries.findIndex(e => e.album.id === state.album.id);
    return idx >= 0 ? idx : 0;
  }

  function computeSleeveTargets() {
    const count = sleeveEntries.length;
    if (!count) return;
    const selIdx = getSelectedIndex();
    const backCount = Math.max(1, count - 1);

    for (let i = 0; i < count; i++) {
      const entry = sleeveEntries[i];
      const rank = (i - selIdx + count) % count;
      if (rank === 0) {
        // Selected sleeve: front showcase ledge, full cover unobstructed
        entry.targetPos.set(0.06, 0.145 + SLEEVE_SIZE / 2, 0.78);
        entry.targetRotX = -0.14;
      } else {
        // Surrounding sleeves: ordered cyclically behind selected, stepped upward & slightly left
        const t = backCount > 1 ? (rank - 1) / (backCount - 1) : 0;
        const z = 0.24 - t * 1.24;
        const y = 0.22 + SLEEVE_SIZE / 2 + t * 0.44;
        const x = -0.02 - t * 0.14;
        entry.targetPos.set(x, y, z);
        entry.targetRotX = -0.16 - t * 0.06;
      }
      if (!entry.initialized) {
        entry.pos.copy(entry.targetPos);
        entry.rotX = entry.targetRotX;
        entry.group.position.copy(entry.pos);
        entry.group.rotation.set(entry.rotX, 0, 0);
        entry.initialized = true;
      }
    }
  }

  function computeVinylHome(outPos, outQuat, nudge = 0) {
    const selEntry = sleeveEntries[getSelectedIndex()];
    if (selEntry) {
      crate.updateMatrixWorld(true);
      // Vinyl peeks out of the open right mouth of the selected sleeve
      tmpPos.set(0.68 + nudge, 0.04, 0.0);
      selEntry.group.localToWorld(tmpPos);
      outPos.copy(tmpPos);
      selEntry.group.getWorldQuaternion(tmpSleeveWorldQuat);
      outQuat.copy(tmpSleeveWorldQuat).multiply(tmpVinylLocalQuat);
    } else {
      outPos.set(CRATE_X + 0.5, 1.35, CRATE_Z + 0.6);
      outQuat.copy(flatQuat);
    }
  }

  // =========================================================================
  // LABEL DRAWING & THEME SYNCHRONIZATION
  // =========================================================================
  function drawLabel() {
    const ctx = labelCanvas.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue('--accent').trim() || '#ffb000';
    const accentInk = css.getPropertyValue('--accent-ink').trim() || '#141210';

    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle concentric vinyl pressing ring shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 232, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 152, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = accentInk;
    ctx.textAlign = 'center';
    ctx.font = '600 20px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('AKNB · STEREO · 33⅓', 256, 108);

    ctx.fillRect(156, 126, 200, 2);

    const artist = (state.album?.artist || 'RECORDS').toUpperCase();
    ctx.font = '700 26px "JetBrains Mono", Consolas, monospace';
    ctx.fillText(artist, 256, 174, 380);

    const title = state.album?.title || '';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText(title, 256, 344, 380);

    ctx.font = '500 18px "JetBrains Mono", Consolas, monospace';
    ctx.fillText(state.album?.year ? `SIDE A · ${state.album.year}` : 'SIDE A', 256, 392);

    // Center spindle cutout
    ctx.fillStyle = '#0e0c0a';
    ctx.beginPath();
    ctx.arc(256, 256, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 24, 0, Math.PI * 2);
    ctx.stroke();

    labelTexture.needsUpdate = true;
  }

  function applyTheme() {
    const docEl = document.documentElement;
    const isDark = docEl.getAttribute('data-theme') !== 'light';
    const css = getComputedStyle(docEl);
    const token = name => css.getPropertyValue(name).trim();

    const accent = token('--accent') || (isDark ? '#ffb000' : '#a13d21');
    const ink = token('--ink') || (isDark ? '#e8e2d4' : '#221c14');
    const borderStrong = token('--border-strong') || (isDark ? '#524a3e' : '#b8a988');

    // Rebuild procedural studio environment for theme-accurate glass & metal reflections
    const nextEnv = createStudioEnvironment(pmrem, isDark, accent);
    world.environment = nextEnv.texture;
    if (envRT) envRT.dispose();
    envRT = nextEnv;

    if (isDark) {
      mats.subChassis.color.set('#171411');
      mats.brushedDeck.color.set('#37322c');
      mats.brushedDeck.roughness = 0.34;
      mats.brushedDeck.metalness = 0.80;
      mats.brushedSilver.color.set('#ccc4b5');
      mats.darkMetal.color.set('#221e1a');
      mats.plinthGlass.color.set('#2c2620');
      mats.plinthGlass.opacity = 0.60;
      mats.dustcoverGlass.color.set('#dcd4c6');
      mats.dustcoverGlass.opacity = 0.16;
      mats.crateGlass.color.set('#dfd7c8');
      mats.crateGlass.opacity = 0.20;
      mats.glassEdge.color.set('#efe7d8');
      mats.glassEdge.opacity = 0.36;
      mats.plinthEdge.color.set('#e5d9c4');
      mats.plinthEdge.opacity = 0.28;
      mats.jacketBack.color.set('#231f1a');
      mats.shadowFloor.opacity = 0.42;
      hemiLight.color.set('#fff2dc');
      hemiLight.groundColor.set('#1c1712');
      hemiLight.intensity = 0.78;
      keyLight.intensity = 2.35;
      rimLight.color.set('#ffe4b8');
      rimLight.intensity = 1.25;
      renderer.toneMappingExposure = 1.08;
    } else {
      // Print / Light mode: rich satin champagne-aluminum, charcoal sub-chassis,
      // smoked-warm crystal glass & oxblood accents — tactile hi-fi contrast, never a white slab.
      mats.subChassis.color.set('#2a241e');
      mats.brushedDeck.color.set('#c4b9a4');
      mats.brushedDeck.roughness = 0.36;
      mats.brushedDeck.metalness = 0.68;
      mats.brushedSilver.color.set('#d8d0c1');
      mats.darkMetal.color.set('#302922');
      mats.plinthGlass.color.set('#dfd5c3');
      mats.plinthGlass.opacity = 0.56;
      mats.dustcoverGlass.color.set('#f8f3ea');
      mats.dustcoverGlass.opacity = 0.20;
      mats.crateGlass.color.set('#f5efe3');
      mats.crateGlass.opacity = 0.24;
      mats.glassEdge.color.set(ink);
      mats.glassEdge.opacity = 0.26;
      mats.plinthEdge.color.set(borderStrong);
      mats.plinthEdge.opacity = 0.46;
      mats.jacketBack.color.set('#383129');
      mats.shadowFloor.opacity = 0.18;
      hemiLight.color.set('#fffbf2');
      hemiLight.groundColor.set('#9c8e78');
      hemiLight.intensity = 0.95;
      keyLight.intensity = 2.15;
      rimLight.color.set('#fff4e0');
      rimLight.intensity = 1.05;
      renderer.toneMappingExposure = 1.02;
    }

    mats.accent.color.set(accent);
    mats.accent.emissive.set(accent);
    mats.accentGlow.color.set(accent);
    mats.accentGlow.emissive.set(accent);
    mats.snapRing.color.set(accent);
    strobeLight.color.set(accent);

    // Slightly varied cardboard edge tones so stacked sleeves separate crisply
    const baseEdge = new THREE.Color(isDark ? '#c5bba8' : '#e4dbc9');
    sleeveEntries.forEach((entry, i) => {
      const shade = 0.92 + ((i * 37) % 15) * 0.01;
      entry.edgeTone.color.copy(baseEdge).multiplyScalar(shade);
    });

    drawLabel();
    schedule();
  }

  // =========================================================================
  // INTERACTION: BROWSE SLEEVES, DRAG/DROP RECORD, DRAG/TAP TONEARM
  // =========================================================================
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function setPointerFromEvent(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    return rect;
  }

  function pickTarget(event) {
    setPointerFromEvent(event);
    ray.setFromCamera(pointer, camera);
    const targets = [vinylDisc, labelFace, armTube, collar, headshell, fingerLift, cartBody, stylusHousing, armHit, ...sleeveHitTargets];
    const hits = ray.intersectObjects(targets, false);
    if (!hits.length) return null;
    const obj = hits[0].object;
    if (obj.userData.sleeveId) {
      const selId = state.album?.id;
      if (obj.userData.sleeveId === selId) return { kind: 'record' };
      return { kind: 'select', id: obj.userData.sleeveId };
    }
    if (obj.userData.action) return { kind: obj.userData.action };
    return null;
  }

  function updateCursor(hit) {
    if (drag) {
      renderer.domElement.style.cursor = 'grabbing';
      return;
    }
    if (!hit) {
      renderer.domElement.style.cursor = 'default';
    } else if (hit.kind === 'select') {
      renderer.domElement.style.cursor = 'pointer';
    } else if (hit.kind === 'record' && state.placed) {
      renderer.domElement.style.cursor = 'default';
    } else {
      renderer.domElement.style.cursor = 'grab';
    }
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    const hit = pickTarget(event);
    if (!hit) return;

    if (hit.kind === 'select') {
      pendingSelect = { id: hit.id, x: event.clientX, y: event.clientY };
      renderer.domElement.setPointerCapture(event.pointerId);
      return;
    }
    if (hit.kind === 'record' && state.placed) return;

    drag = {
      hit: hit.kind,
      x: event.clientX,
      y: event.clientY,
      startArm: cueProgress
    };
    renderer.domElement.setPointerCapture(event.pointerId);
    host.classList.add('is-dragging');
    updateCursor(hit);
  }

  function onPointerMove(event) {
    if (!drag) {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        const hit = pickTarget(event);
        const nextSleeve = hit?.kind === 'select' ? hit.id : null;
        const nextAction = hit && hit.kind !== 'select' ? hit.kind : null;
        updateCursor(hit);
        if (nextSleeve !== hoveredSleeveId || nextAction !== hoveredAction) {
          hoveredSleeveId = nextSleeve;
          hoveredAction = nextAction;
          schedule();
        }
      }
      return;
    }

    const moved = Math.hypot(event.clientX - drag.x, event.clientY - drag.y);
    if (moved < 6 && !drag.position && drag.arm === undefined) return;

    const rect = setPointerFromEvent(event);
    ray.setFromCamera(pointer, camera);

    if (drag.hit === 'record') {
      const hitPt = ray.ray.intersectPlane(dragPlane, new THREE.Vector3());
      if (hitPt) {
        drag.position = hitPt.clamp(dragClampMin, dragClampMax);
        const distToPlatter = Math.hypot(drag.position.x - platterWorldPos.x, drag.position.z - platterWorldPos.z);
        drag.inSnap = distToPlatter < SNAP_RADIUS;
      }
    } else {
      drag.arm = THREE.MathUtils.clamp(drag.startArm + ((drag.x - event.clientX) / rect.width) * 3.1, 0, 1);
    }
    schedule();
  }

  function onPointerUp(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;

    if (pendingSelect) {
      const sel = pendingSelect;
      pendingSelect = null;
      const moved = Math.hypot(event.clientX - sel.x, event.clientY - sel.y);
      if (inside && moved < 14) {
        action('select', sel.id);
      }
      return;
    }

    if (!drag) return;
    const held = drag;
    const tapped = !held.position && held.arm === undefined;
    const recordDrop = Boolean(held.position && Math.hypot(held.position.x - platterWorldPos.x, held.position.z - platterWorldPos.z) < SNAP_RADIUS);
    const armDrop = held.arm !== undefined && (held.arm >= 0.5) !== Boolean(state.cued);

    cancelDrag();
    if (inside && (tapped || (held.hit === 'record' ? recordDrop : armDrop))) {
      action(held.hit);
    }
  }

  function cancelDrag() {
    if (drag?.position) {
      settle = {
        fromPos: record.position.clone(),
        fromQuat: record.quaternion.clone(),
        progress: 0
      };
    }
    if (drag?.arm !== undefined) {
      cueProgress = drag.arm;
    }
    drag = null;
    pendingSelect = null;
    host.classList.remove('is-dragging');
    updateCursor(null);
    schedule();
  }

  function onPointerLeave() {
    if (hoveredSleeveId !== null || hoveredAction !== null) {
      hoveredSleeveId = null;
      hoveredAction = null;
      if (!drag) renderer.domElement.style.cursor = 'default';
      schedule();
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', cancelDrag);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);

  // =========================================================================
  // RENDER LOOP (ZERO IDLE RAF; ON-DEMAND & PLAYING ONLY)
  // =========================================================================
  function schedule() {
    if (!frame && !disposed && visible && !document.hidden) {
      frame = requestAnimationFrame(render);
    }
  }

  function render(time) {
    frame = 0;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
    lastTime = time;
    const instant = reduced.matches;
    let animating = false;

    // 1. Animate 3D crate sleeves (selected glides forward, hovered lifts smoothly)
    const selId = state.album?.id;
    for (const entry of sleeveEntries) {
      const hoverTarget = (!drag && hoveredSleeveId === entry.album.id && entry.album.id !== selId) ? 1 : 0;
      entry.hover = instant ? hoverTarget : THREE.MathUtils.damp(entry.hover, hoverTarget, 12, dt);
      if (Math.abs(entry.hover - hoverTarget) < 0.002) entry.hover = hoverTarget;
      else animating = true;

      const tx = entry.targetPos.x;
      const ty = entry.targetPos.y + entry.hover * 0.28;
      const tz = entry.targetPos.z + entry.hover * 0.04;
      const trx = entry.targetRotX + entry.hover * 0.05;

      if (instant) {
        entry.pos.set(tx, ty, tz);
        entry.rotX = trx;
      } else {
        entry.pos.x = THREE.MathUtils.damp(entry.pos.x, tx, 9, dt);
        entry.pos.y = THREE.MathUtils.damp(entry.pos.y, ty, 9, dt);
        entry.pos.z = THREE.MathUtils.damp(entry.pos.z, tz, 9, dt);
        entry.rotX = THREE.MathUtils.damp(entry.rotX, trx, 9, dt);
        if (Math.hypot(entry.pos.x - tx, entry.pos.y - ty, entry.pos.z - tz) < 0.002 && Math.abs(entry.rotX - trx) < 0.002) {
          entry.pos.set(tx, ty, tz);
          entry.rotX = trx;
        } else {
          animating = true;
        }
      }
      entry.group.position.copy(entry.pos);
      entry.group.rotation.set(entry.rotX, 0, 0);
    }

    // 2. Peeking vinyl hover invitation
    const nudgeTarget = (!state.placed && !drag && hoveredAction === 'record') ? 0.14 : 0;
    vinylHoverNudge = instant ? nudgeTarget : THREE.MathUtils.damp(vinylHoverNudge, nudgeTarget, 10, dt);
    if (Math.abs(vinylHoverNudge - nudgeTarget) < 0.002) vinylHoverNudge = nudgeTarget;
    else animating = true;

    // 3. Record placement & tonearm cue progress
    const targetPlace = state.placed ? 1 : 0;
    const targetCue = state.cued ? 1 : 0;
    const targetGroove = (state.cued && typeof state.progress === 'number')
      ? THREE.MathUtils.clamp(state.progress, 0, 1) : 0;

    placeProgress = instant ? targetPlace : THREE.MathUtils.damp(placeProgress, targetPlace, 7, dt);
    cueProgress = instant ? targetCue : THREE.MathUtils.damp(cueProgress, targetCue, 7.5, dt);
    grooveProgress = instant ? targetGroove : THREE.MathUtils.damp(grooveProgress, targetGroove, 4, dt);

    if (Math.abs(placeProgress - targetPlace) < 0.001) placeProgress = targetPlace; else animating = true;
    if (Math.abs(cueProgress - targetCue) < 0.001) cueProgress = targetCue; else animating = true;
    if (Math.abs(grooveProgress - targetGroove) < 0.001) grooveProgress = targetGroove; else animating = true;

    // 4. Platter & Vinyl 33⅓ RPM spin
    if (state.playing && !instant) {
      platterAngle -= dt * Math.PI * 2 * (33.333 / 60);
      animating = true;
    }
    platterGroup.rotation.y = platterAngle;

    // 5. Vinyl record 3D position & orientation
    computeVinylHome(tmpHomePos, tmpHomeQuat, vinylHoverNudge);
    tmpSpinQuat.setFromAxisAngle(upAxis, platterAngle);

    if (drag?.position) {
      record.position.copy(drag.position);
      // Lower slightly toward spindle when hovering over accepted snap zone
      if (drag.inSnap) record.position.y -= 0.14;
      tmpEuler.set(0, 0, 0);
      tmpTiltQuat.setFromEuler(tmpEuler);
      record.quaternion.slerp(tmpTiltQuat, instant ? 1 : Math.min(1, dt * 16));
      animating = true;
    } else if (settle) {
      settle.progress = instant ? 1 : Math.min(1, settle.progress + dt * 3.4);
      const eased = THREE.MathUtils.smoothstep(settle.progress, 0, 1);
      const destPos = state.placed ? platterWorldPos : tmpHomePos;
      const destQuat = state.placed ? tmpSpinQuat : tmpHomeQuat;
      record.position.lerpVectors(settle.fromPos, destPos, eased);
      record.position.y += Math.sin(eased * Math.PI) * 0.22;
      record.quaternion.slerpQuaternions(settle.fromQuat, destQuat, eased);
      if (settle.progress >= 1) {
        settle = null;
        placeProgress = targetPlace;
      } else {
        animating = true;
      }
    } else {
      const arc = Math.sin(placeProgress * Math.PI);
      record.position.lerpVectors(tmpHomePos, platterWorldPos, placeProgress);
      record.position.y += arc * 0.62;
      record.quaternion.slerpQuaternions(tmpHomeQuat, tmpSpinQuat, THREE.MathUtils.smoothstep(placeProgress, 0.08, 0.88));
    }

    // Snap zone platter ring glow while dragging over platter
    const snapTarget = (drag?.hit === 'record' && drag.inSnap) ? 0.65 : (drag?.hit === 'record' ? 0.18 : 0);
    snapGlow = instant ? snapTarget : THREE.MathUtils.damp(snapGlow, snapTarget, 12, dt);
    if (Math.abs(snapGlow - snapTarget) < 0.005) snapGlow = snapTarget; else animating = true;
    mats.snapRing.opacity = snapGlow;

    // 6. Tonearm yaw & vertical lift kinematics
    const activeArm = drag?.arm !== undefined ? drag.arm : cueProgress;
    const cuedAngle = THREE.MathUtils.lerp(ARM_OUTER_GROOVE_Y, ARM_INNER_GROOVE_Y, grooveProgress);
    armYaw.rotation.y = THREE.MathUtils.lerp(ARM_PARK_Y, cuedAngle, activeArm);

    // Lift cleanly while parked on rest (0) and higher mid-transit (0.5), then lower onto vinyl at (1)
    const transitLift = Math.sin(activeArm * Math.PI) * 0.095;
    const parkLift = (1 - activeArm) * 0.045;
    const dragExtraLift = drag?.arm !== undefined ? 0.04 : 0;
    armPitch.rotation.x = -(parkLift + transitLift + dragExtraLift);

    // 7. LED & Strobe illuminator feedback
    const isActive = Boolean(state.playing);
    const isLit = isActive || Boolean(state.cued);
    playLed.scale.setScalar(isActive ? 1.18 : 1.0);
    mats.accentGlow.emissiveIntensity = isActive ? 1.35 : (isLit ? 0.8 : 0.32);
    strobeLight.intensity = isActive ? 1.35 : (isLit ? 0.7 : 0.25);
    startStrip.scale.x = isActive ? 1.05 : 0.92;
    strobeLens.scale.setScalar(isLit ? 1.06 : 1.0);

    renderer.render(world, camera);

    if (animating) {
      schedule();
    } else {
      lastTime = 0;
    }
  }

  // =========================================================================
  // RESPONSIVE FRAMING & LIFECYCLE OBSERVERS
  // =========================================================================
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    const aspect = w / h;
    renderer.setSize(w, h, false);
    camera.aspect = aspect;

    // Fit full side-by-side acrylic crate + open-dustcover turntable cleanly on both desktop (~1.45) & mobile (~0.85)
    const vFovRad = THREE.MathUtils.degToRad(camera.fov);
    const tanHalfV = Math.tan(vFovRad / 2);
    const pad = aspect < 1.0 ? 1.04 : 1.08;
    const halfW = (w < 720 ? 4.0 : 4.25) * pad;
    const halfH = 2.38 * pad;

    const distH = halfW / (tanHalfV * aspect) + 1.55;
    const distV = halfH / tanHalfV + 1.55;
    const dist = Math.max(distH, distV);

    // Slightly elevate look target on portrait mobile so composition sits balanced vertically
    const yBias = aspect < 1.0 ? 0.08 : 0;
    lookTarget.set(-0.24, 1.04 + yBias, 0.12);
    camera.position.copy(lookTarget).addScaledVector(camDir, dist);
    camera.lookAt(lookTarget);
    camera.updateProjectionMatrix();
    schedule();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const intersection = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible) schedule();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }
  });
  intersection.observe(host);

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    } else {
      schedule();
    }
  }

  function onContextLost(event) {
    event.preventDefault();
    disposed = true;
    cancelAnimationFrame(frame);
    frame = 0;
    renderer.domElement.hidden = true;
    onLost?.();
  }

  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', schedule);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);

  computeSleeveTargets();
  applyTheme();
  resize();

  return {
    setState(next) {
      if (!next) return;
      const nextAlbum = next.album || state.album;
      const changed = nextAlbum?.id && state.album?.id !== nextAlbum.id;

      // Gracefully support callers that omit albums[] or add a record dynamically
      if (nextAlbum?.id && !sleeveEntries.some(e => e.album.id === nextAlbum.id)) {
        catalogue.push(nextAlbum);
        const entry = addSleeveEntry(nextAlbum, sleeveEntries.length);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        entry.edgeTone.color.set(isDark ? '#c5bba8' : '#e4dbc9');
      }

      state = {
        album: nextAlbum,
        placed: Boolean(next.placed),
        cued: Boolean(next.cued),
        playing: Boolean(next.playing),
        trackIndex: next.trackIndex,
        progress: next.progress
      };

      if (changed) {
        drag = null;
        pendingSelect = null;
        settle = null;
        host.classList.remove('is-dragging');
        platterAngle = 0;
        computeSleeveTargets();
        drawLabel();
      }
      schedule();
    },

    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', schedule);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', cancelDrag);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      const seenGeometries = new Set();
      world.traverse(obj => {
        if (obj.geometry && !seenGeometries.has(obj.geometry)) {
          seenGeometries.add(obj.geometry);
          obj.geometry.dispose();
        }
      });
      disposableMaterials.forEach(m => m.dispose());
      proceduralTextures.forEach(t => t.dispose());
      labelTexture.dispose();
      coverTextures.forEach(t => t.dispose());
      if (envRT) envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    }
  };
}
