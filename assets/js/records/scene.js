// Reuse the site's existing, licensed Three.js distribution. No CDN/build tooling.
import * as THREE from '../../../six-springs/lib/three.module.js';

const VINYL_RADIUS = 1.16;
const SLEEVE_SIZE = 2.40;
const SLEEVE_THICK = 0.058;
const PLATTER_RADIUS = 1.29;
const PLATTER_X = -0.58;
const PLATTER_Z = 0.04;
const PLATTER_SURFACE_Y = 0.945;
const DECK_X = 1.72;
const DECK_Z = 0.16;
const CRATE_X = -2.90;
const CRATE_Z = 0.26;
const CRATE_ROT_Y = 0.18;
const SNAP_RADIUS = 1.82;
const ARM_PARK_Y = 0;
const ARM_OUTER_GROOVE_Y = -0.47;
const ARM_INNER_GROOVE_Y = -0.80;
const LID_OPEN_ANGLE = -1.00;

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
  const roughCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = size;
  roughCanvas.width = roughCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');
  const rCtx = roughCanvas.getContext('2d');
  const rand = seeded(40219);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#5a5a5a';
  rCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y++) {
    const streak = 110 + Math.floor(rand() * 36);
    bCtx.fillStyle = `rgb(${streak},${streak},${streak})`;
    bCtx.fillRect(0, y, size, 1);

    const rStreak = 68 + Math.floor(rand() * 38);
    rCtx.fillStyle = `rgb(${rStreak},${rStreak},${rStreak})`;
    rCtx.fillRect(0, y, size, 1);

    for (let k = 0; k < 6; k++) {
      const x = Math.floor(rand() * size);
      const len = 36 + Math.floor(rand() * 160);
      const v = 86 + Math.floor(rand() * 82);
      bCtx.fillStyle = `rgba(${v},${v},${v},0.38)`;
      bCtx.fillRect(x, y, len, 1);
    }
  }
  const bump = new THREE.CanvasTexture(bumpCanvas);
  const rough = new THREE.CanvasTexture(roughCanvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  rough.wrapS = rough.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2, 2);
  rough.repeat.set(2, 2);
  bump.anisotropy = 4;
  rough.anisotropy = 4;
  return { bump, rough };
}

function createKnurlTexture() {
  const w = 256;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#606060';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 64; i++) {
    const x = (i / 64) * w;
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(x, 4, 2, h - 8);
    ctx.fillStyle = '#282828';
    ctx.fillRect(x + 2, 4, 1.5, h - 8);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createVinylTextures() {
  const size = 1024;
  const half = size / 2;
  const colorCanvas = document.createElement('canvas');
  const bumpCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = size;
  bumpCanvas.width = bumpCanvas.height = size;
  roughCanvas.width = roughCanvas.height = size;

  const cCtx = colorCanvas.getContext('2d');
  const bCtx = bumpCanvas.getContext('2d');
  const rCtx = roughCanvas.getContext('2d');

  // Rich jet-black pressed PVC base
  cCtx.fillStyle = '#070708';
  cCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#787878';
  bCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#222222';
  rCtx.fillRect(0, 0, size, size);

  const rand = seeded(91827);
  // Subtle hourglass studio groove highlight wedges in roughness + very faint micro-tint in color
  for (let a = 0; a < 360; a += 1) {
    const rad = (a * Math.PI) / 180;
    const lobe1 = Math.pow(Math.abs(Math.cos(rad - 0.68)), 7);
    const lobe2 = Math.pow(Math.abs(Math.cos(rad + 0.85)), 9) * 0.45;
    const sheen = Math.min(1, lobe1 + lobe2);
    if (sheen > 0.04) {
      const cVal = Math.round(8 + sheen * 34);
      cCtx.strokeStyle = `rgba(${cVal},${cVal},${Math.round(cVal * 1.03)},${(sheen * 0.42).toFixed(3)})`;
      cCtx.lineWidth = 4;
      cCtx.beginPath();
      cCtx.moveTo(half + Math.cos(rad) * (half * 0.36), half + Math.sin(rad) * (half * 0.36));
      cCtx.lineTo(half + Math.cos(rad) * (half * 0.965), half + Math.sin(rad) * (half * 0.965));
      cCtx.stroke();

      const rVal = Math.round(74 - sheen * 54);
      rCtx.strokeStyle = `rgba(${rVal},${rVal},${rVal},0.35)`;
      rCtx.lineWidth = 5;
      rCtx.beginPath();
      rCtx.moveTo(half + Math.cos(rad) * (half * 0.36), half + Math.sin(rad) * (half * 0.36));
      rCtx.lineTo(half + Math.cos(rad) * (half * 0.965), half + Math.sin(rad) * (half * 0.965));
      rCtx.stroke();
    }
  }

  // Distinct track silent bands (glossy smooth dark rings separating tracks)
  const silentBands = [0.435, 0.565, 0.695, 0.825, 0.948];
  for (let r = half * 0.35; r < half * 0.985; r += 1.35) {
    const norm = r / half;
    const inGap = silentBands.some(g => Math.abs(norm - g) < 0.0115);
    const leadOut = norm < 0.415;

    if (inGap) {
      cCtx.strokeStyle = 'rgba(3,3,4,0.88)';
      cCtx.lineWidth = 2.0;
      cCtx.beginPath();
      cCtx.arc(half, half, r, 0, Math.PI * 2);
      cCtx.stroke();

      bCtx.strokeStyle = '#7c7c7c';
      bCtx.lineWidth = 1.6;
      bCtx.beginPath();
      bCtx.arc(half, half, r, 0, Math.PI * 2);
      bCtx.stroke();

      rCtx.strokeStyle = 'rgba(18,18,18,0.85)';
      rCtx.lineWidth = 1.8;
      rCtx.beginPath();
      rCtx.arc(half, half, r, 0, Math.PI * 2);
      rCtx.stroke();
    } else {
      const amp = leadOut ? 18 : 52;
      const shade = Math.round(128 + (rand() - 0.5) * amp + Math.sin(r * 2.4) * (amp * 0.55));
      bCtx.strokeStyle = `rgb(${shade},${shade},${shade})`;
      bCtx.lineWidth = 1.05;
      bCtx.beginPath();
      bCtx.arc(half, half, r, 0, Math.PI * 2);
      bCtx.stroke();

      const cTone = leadOut ? 11 : Math.round(12 + (rand() * 14));
      cCtx.strokeStyle = `rgba(${cTone},${cTone},${cTone + 2},0.28)`;
      cCtx.lineWidth = 0.9;
      cCtx.beginPath();
      cCtx.arc(half, half, r, 0, Math.PI * 2);
      cCtx.stroke();

      const roughV = leadOut ? 34 : Math.round(62 + rand() * 38);
      rCtx.strokeStyle = `rgba(${roughV},${roughV},${roughV},0.55)`;
      rCtx.lineWidth = 1.1;
      rCtx.beginPath();
      rCtx.arc(half, half, r, 0, Math.PI * 2);
      rCtx.stroke();
    }
  }

  // Subtle glossy outer beaded rim catchlight
  cCtx.strokeStyle = 'rgba(42,40,38,0.65)';
  cCtx.lineWidth = 4;
  cCtx.beginPath();
  cCtx.arc(half, half, half * 0.988, 0, Math.PI * 2);
  cCtx.stroke();

  bCtx.strokeStyle = '#d4d4d4';
  bCtx.lineWidth = 4;
  bCtx.beginPath();
  bCtx.arc(half, half, half * 0.988, 0, Math.PI * 2);
  bCtx.stroke();

  const color = new THREE.CanvasTexture(colorCanvas);
  const bump = new THREE.CanvasTexture(bumpCanvas);
  const rough = new THREE.CanvasTexture(roughCanvas);
  color.colorSpace = THREE.SRGBColorSpace;
  color.anisotropy = 4;
  bump.anisotropy = 4;
  rough.anisotropy = 4;
  return { color, bump, rough };
}

function createRubberMatTexture() {
  const size = 512;
  const half = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#707070';
  ctx.fillRect(0, 0, size, size);
  const ribs = [0.23, 0.28, 0.47, 0.52, 0.72, 0.77, 0.91, 0.96];
  for (const frac of ribs) {
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(half, half, half * frac, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#383838';
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
  ctx.fillStyle = '#181614';
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
      g.addColorStop(0, '#f7f2e7');
      g.addColorStop(0.62, '#c4bca9');
      g.addColorStop(1, '#4f4940');
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

function createKnobScaleTexture(stepped = false) {
  const size = 256;
  const half = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  const count = stepped ? 12 : 11;
  const startA = Math.PI * 0.75;
  const spanA = stepped ? Math.PI * 2 : Math.PI * 1.5;

  for (let i = 0; i < count; i++) {
    const a = startA + (i / (stepped ? count : count - 1)) * spanA;
    const r0 = half * 0.72;
    const r1 = half * (i === 0 || i === count - 1 || stepped ? 0.90 : 0.84);
    ctx.strokeStyle = 'rgba(232,226,212,0.82)';
    ctx.lineWidth = (i === 0 || i === count - 1) ? 4 : 2.5;
    ctx.beginPath();
    ctx.moveTo(half + Math.cos(a) * r0, half + Math.sin(a) * r0);
    ctx.lineTo(half + Math.cos(a) * r1, half + Math.sin(a) * r1);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStudioEnvironment(pmrem, isDark, accentHex) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(isDark ? '#12100d' : '#c6bcb0');
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

  // Sculpted overhead studio softbox strips (separated by dark ceiling gap so reflections have crisp metallic contrast!)
  panel(14, 3.8, isDark ? '#fff2dc' : '#fffaf0', isDark ? 2.6 : 3.0, -2, 11.5, -2.5, Math.PI / 2, 0);
  panel(12, 2.4, isDark ? '#e8dcc8' : '#ffffff', isDark ? 1.8 : 2.2, 2.5, 11.5, 4.5, Math.PI / 2, 0);
  // Crisp left studio strip (specular highlights on chrome tonearm, knurled knobs & acrylic edges)
  panel(3.2, 11, isDark ? '#f7ecd8' : '#ffffff', isDark ? 2.2 : 2.6, -13, 4.8, 3.5, 0, Math.PI / 2.2);
  // Right warm fill card
  panel(4.2, 10, isDark ? accentHex : '#f8ead2', isDark ? 1.05 : 1.75, 13.5, 4.0, 3.0, 0, -Math.PI / 2.2);
  // Rear rim light (catches open dustcover edge & top edges of fanned sleeves)
  panel(18, 4.0, isDark ? '#ffe7be' : '#fff7e8', isDark ? 1.85 : 2.2, 0, 6.8, -11.5, 0.25, 0);
  // Dark floor & studio flags so chrome, brushed aluminum & black vinyl read with high-contrast depth
  panel(32, 32, isDark ? '#050403' : '#3a332b', 1, 0, -5, 0, -Math.PI / 2, 0);

  const rt = pmrem.fromScene(envScene, 0.032);
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
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const world = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(29, 1.5, 0.1, 70);
  const lookTarget = new THREE.Vector3(-0.62, 1.12, 0.12);
  const camDir = new THREE.Vector3(0.22, 4.85, 8.85).normalize();

  // Studio Lighting
  const hemiLight = new THREE.HemisphereLight(0xfff6e8, 0x2a241d, 0.82);
  world.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.35);
  keyLight.position.set(-4.8, 10.8, 6.6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -7.8;
  keyLight.shadow.camera.right = 7.2;
  keyLight.shadow.camera.top = 6.0;
  keyLight.shadow.camera.bottom = -5.5;
  keyLight.shadow.camera.near = 1.5;
  keyLight.shadow.camera.far = 28;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.025;
  keyLight.shadow.radius = 2.5;
  world.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffe9c8, 1.25);
  rimLight.position.set(6.0, 6.5, -5.8);
  world.add(rimLight);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  let envRT = null;

  // Procedural textures
  const brushed = createBrushedTextures();
  const knurlBump = createKnurlTexture();
  const vinylTex = createVinylTextures();
  const rubberBump = createRubberMatTexture();
  const strobeTex = createStrobeTexture();
  const dialTex = createDialTexture();
  const surfaceScaleTex = createKnobScaleTexture(false);
  const trackScaleTex = createKnobScaleTexture(true);
  const proceduralTextures = [
    brushed.bump, brushed.rough, knurlBump,
    vinylTex.color, vinylTex.bump, vinylTex.rough,
    rubberBump, strobeTex, dialTex, surfaceScaleTex, trackScaleTex
  ];

  const disposableMaterials = [];
  const trackMat = mat => { disposableMaterials.push(mat); return mat; };

  // Shared PBR & Glass Materials
  const mats = {
    subChassis: trackMat(new THREE.MeshStandardMaterial({ color: '#181512', roughness: 0.74, metalness: 0.28 })),
    brushedDeck: trackMat(new THREE.MeshStandardMaterial({
      color: '#342f2a', roughness: 0.36, metalness: 0.82,
      bumpMap: brushed.bump, bumpScale: 0.009, roughnessMap: brushed.rough
    })),
    brushedSilver: trackMat(new THREE.MeshStandardMaterial({
      color: '#cec6b7', roughness: 0.24, metalness: 0.90,
      bumpMap: brushed.bump, bumpScale: 0.005, roughnessMap: brushed.rough
    })),
    knurledMetal: trackMat(new THREE.MeshStandardMaterial({
      color: '#c9c1b2', roughness: 0.28, metalness: 0.90, bumpMap: knurlBump, bumpScale: 0.018
    })),
    chrome: trackMat(new THREE.MeshStandardMaterial({ color: '#eae4d9', roughness: 0.10, metalness: 0.97 })),
    darkMetal: trackMat(new THREE.MeshStandardMaterial({ color: '#221e1a', roughness: 0.40, metalness: 0.68 })),
    brass: trackMat(new THREE.MeshStandardMaterial({ color: '#c19c54', roughness: 0.26, metalness: 0.90 })),
    rubber: trackMat(new THREE.MeshStandardMaterial({
      color: '#171513', roughness: 0.88, metalness: 0.03, bumpMap: rubberBump, bumpScale: 0.014
    })),
    footRubber: trackMat(new THREE.MeshStandardMaterial({ color: '#12100e', roughness: 0.94, metalness: 0.02 })),
    strobeBand: trackMat(new THREE.MeshStandardMaterial({ map: strobeTex, roughness: 0.30, metalness: 0.76 })),
    dial: trackMat(new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.48, metalness: 0.22 })),
    surfaceScale: trackMat(new THREE.MeshBasicMaterial({ map: surfaceScaleTex, transparent: true, opacity: 0.65, depthWrite: false })),
    trackScale: trackMat(new THREE.MeshBasicMaterial({ map: trackScaleTex, transparent: true, opacity: 0.55, depthWrite: false })),
    accent: trackMat(new THREE.MeshStandardMaterial({
      color: '#ffb000', emissive: '#ffb000', emissiveIntensity: 0.22, roughness: 0.30, metalness: 0.14
    })),
    accentGlow: trackMat(new THREE.MeshStandardMaterial({
      color: '#ffb000', emissive: '#ffb000', emissiveIntensity: 0.65, roughness: 0.18, metalness: 0.05
    })),
    led33: trackMat(new THREE.MeshStandardMaterial({
      color: '#ffb000', emissive: '#ffb000', emissiveIntensity: 1.0, roughness: 0.2, metalness: 0.05
    })),
    led45: trackMat(new THREE.MeshStandardMaterial({
      color: '#463f36', emissive: '#ffb000', emissiveIntensity: 0.05, roughness: 0.35, metalness: 0.1
    })),
    plinthGlass: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#2b251f', transparent: true, opacity: 0.58, roughness: 0.06, metalness: 0.05,
      ior: 1.49, reflectivity: 0.94, clearcoat: 1.0, clearcoatRoughness: 0.035, envMapIntensity: 1.95
    })),
    dustcoverGlass: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#dcd4c6', transparent: true, opacity: 0.16, roughness: 0.045, metalness: 0.05,
      ior: 1.49, reflectivity: 0.96, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 2.15,
      depthWrite: false, side: THREE.DoubleSide
    })),
    crateGlass: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#dfd7c8', transparent: true, opacity: 0.21, roughness: 0.055, metalness: 0.05,
      ior: 1.49, reflectivity: 0.94, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 2.0,
      depthWrite: false, side: THREE.DoubleSide
    })),
    glassEdge: trackMat(new THREE.LineBasicMaterial({ color: '#f3ece0', transparent: true, opacity: 0.36 })),
    plinthEdge: trackMat(new THREE.LineBasicMaterial({ color: '#e6dccb', transparent: true, opacity: 0.28 })),
    vinylTop: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#ffffff', map: vinylTex.color, roughness: 0.32, metalness: 0.12,
      clearcoat: 1.0, clearcoatRoughness: 0.11,
      bumpMap: vinylTex.bump, bumpScale: 0.024, roughnessMap: vinylTex.rough, envMapIntensity: 0.72
    })),
    vinylRim: trackMat(new THREE.MeshPhysicalMaterial({
      color: '#09090a', roughness: 0.24, metalness: 0.08, clearcoat: 0.95, clearcoatRoughness: 0.10, envMapIntensity: 0.9
    })),
    snapRing: trackMat(new THREE.MeshBasicMaterial({
      color: '#ffb000', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false
    })),
    jacketBack: trackMat(new THREE.MeshStandardMaterial({ color: '#24201b', roughness: 0.80, metalness: 0.02 })),
    innerPaper: trackMat(new THREE.MeshStandardMaterial({ color: '#ebe4d6', roughness: 0.88, metalness: 0 })),
    slotDark: trackMat(new THREE.MeshStandardMaterial({ color: '#12100e', roughness: 0.95, metalness: 0 })),
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
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 42), mats.shadowFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  floor.renderOrder = -1;
  world.add(floor);

  const interactiveTargets = [];
  function tagHit(obj, data) {
    obj.userData = data;
    interactiveTargets.push(obj);
    return obj;
  }

  // =========================================================================
  // 1. HI-FI TURNTABLE DECK
  // =========================================================================
  const deck = new THREE.Group();
  deck.position.set(DECK_X, 0, DECK_Z);
  world.add(deck);

  // Four machined isolation feet (bottom y=0, top y=0.22)
  for (const fx of [-1.68, 1.68]) {
    for (const fz of [-1.24, 1.64]) {
      const foot = new THREE.Group();
      foot.position.set(fx, 0, fz);
      deck.add(foot);
      addMesh(new THREE.CylinderGeometry(0.19, 0.21, 0.05, 32), mats.footRubber, foot, 0, 0.025, 0);
      addMesh(new THREE.CylinderGeometry(0.22, 0.22, 0.09, 32), mats.knurledMetal, foot, 0, 0.095, 0);
      addMesh(new THREE.CylinderGeometry(0.245, 0.245, 0.036, 32), mats.brushedSilver, foot, 0, 0.158, 0);
      addMesh(new THREE.CylinderGeometry(0.20, 0.22, 0.045, 32), mats.subChassis, foot, 0, 0.198, 0);
    }
  }

  // Recessed acoustic sub-chassis base
  const subGeo = new THREE.ExtrudeGeometry(roundedRectShape(3.88, 3.42, 0.10), {
    depth: 0.13, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2
  });
  subGeo.rotateX(Math.PI / 2);subGeo.translate(0,0,.20);
  addMesh(subGeo, mats.subChassis, deck, 0, 0.35, 0);

  // Internal motor housing & brass drive pulley glimpsed beneath the clear acrylic plinth
  const motorGroup = new THREE.Group();
  motorGroup.position.set(-1.58, 0.44, -0.96);
  deck.add(motorGroup);
  addMesh(new THREE.CylinderGeometry(0.22, 0.24, 0.14, 24), mats.darkMetal, motorGroup, 0, 0, 0, false);
  const pulley = addMesh(new THREE.CylinderGeometry(0.085, 0.085, 0.19, 24), mats.brass, motorGroup, 0, 0.06, 0, false);
  const beltRing = addMesh(new THREE.TorusGeometry(0.68, 0.014, 8, 48), mats.footRubber, deck, -1.00, 0.50, -0.36, false);
  beltRing.rotation.x = Math.PI / 2;

  // Thick beveled transparent acrylic plinth body
  const plinthGeo = new THREE.ExtrudeGeometry(roundedRectShape(4.16, 3.70, 0.12), {
    depth: 0.30, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3
  });
  plinthGeo.rotateX(Math.PI / 2);plinthGeo.translate(0,0,.20);
  const plinthMesh = addMesh(plinthGeo, mats.plinthGlass, deck, 0, 0.66, 0, false);
  plinthMesh.receiveShadow = true;
  plinthMesh.renderOrder = 2;
  addEdges(plinthMesh, mats.plinthEdge, 28);

  // Brushed metal recessed top deck plate (top surface y = 0.713)
  const topPlateGeo = new THREE.ExtrudeGeometry(roundedRectShape(3.84, 3.42, 0.08), {
    depth: 0.04, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2
  });
  topPlateGeo.rotateX(Math.PI / 2);topPlateGeo.translate(0,0,.22);
  addMesh(topPlateGeo, mats.brushedDeck, deck, 0, 0.705, 0);

  // Corner machined hex screws on top plate
  for (const sx of [-1.76, 1.76]) {
    for (const sz of [-1.34, 1.82]) {
      addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.016, 12), mats.brushedSilver, deck, sx, 0.716, sz, false);
    }
  }

  // Recessed platter well bezel ring
  const wellRing = addMesh(new THREE.RingGeometry(1.29, 1.35, 72), mats.darkMetal, deck, PLATTER_X, 0.714, PLATTER_Z, false);
  wellRing.rotation.x = -Math.PI / 2;

  // Platter snap-zone highlight ring (visible only during active record drag)
  const snapRingMesh = addMesh(new THREE.RingGeometry(1.23, 1.33, 72), mats.snapRing, deck, PLATTER_X, 0.954, PLATTER_Z, false);
  snapRingMesh.rotation.x = -Math.PI / 2;
  snapRingMesh.renderOrder = 6;

  // Platter Assembly (accelerates/decelerates smoothly with motor)
  const platterGroup = new THREE.Group();
  platterGroup.position.set(PLATTER_X, 0.715, PLATTER_Z);
  deck.add(platterGroup);

  const platterProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(PLATTER_RADIUS, 0.0),
    new THREE.Vector2(PLATTER_RADIUS, 0.025),
    new THREE.Vector2(1.235, 0.165),
    new THREE.Vector2(1.205, 0.190),
    new THREE.Vector2(0.0, 0.190)
  ];
  addMesh(new THREE.LatheGeometry(platterProfile, 96), mats.brushedSilver, platterGroup, 0, 0, 0);

  // Sloped Technics-style strobe dot band on platter rim
  const strobeSkirt = addMesh(
    new THREE.CylinderGeometry(1.238, 1.291, 0.136, 96, 1, true),
    mats.strobeBand, platterGroup, 0, 0.095, 0, false
  );
  strobeSkirt.receiveShadow = true;

  // Molded anti-static rubber slipmat (top surface at deck y = 0.945)
  addMesh(new THREE.CylinderGeometry(1.195, 1.205, 0.04, 96), mats.rubber, platterGroup, 0, 0.210, 0);
  const matCenter = addMesh(new THREE.CylinderGeometry(0.39, 0.40, 0.008, 48), mats.footRubber, platterGroup, 0, 0.231, 0, false);
  matCenter.receiveShadow = true;

  // Machined brass spindle bushing + stainless steel center spindle
  addMesh(new THREE.CylinderGeometry(0.085, 0.095, 0.018, 32), mats.brass, platterGroup, 0, 0.236, 0, false);
  addMesh(new THREE.CylinderGeometry(0.030, 0.032, 0.21, 24), mats.chrome, platterGroup, 0, 0.34, 0);
  addMesh(new THREE.ConeGeometry(0.030, 0.026, 24), mats.chrome, platterGroup, 0, 0.458, 0, false);

  // =========================================================================
  // 1B. FUNCTIONAL PHYSICAL DECK CONTROLS (Start/Cue, 33/45 RPM, Knobs)
  // =========================================================================
  // Start/Stop tactile switch (front-left) -> triggers 'arm' cue/play toggle
  addMesh(new THREE.BoxGeometry(0.42, 0.028, 0.28), mats.darkMetal, deck, -1.60, 0.72, 1.48);
  const startBtn = addMesh(new THREE.BoxGeometry(0.35, 0.044, 0.21), mats.brushedSilver, deck, -1.60, 0.74, 1.48);
  const startStrip = addMesh(new THREE.BoxGeometry(0.28, 0.012, 0.024), mats.accentGlow, deck, -1.60, 0.764, 1.55, false);
  tagHit(startBtn, { kind: 'arm' });

  // 33⅓ RPM & 45 RPM speed selector buttons (visual RPM only; parent truth-labels)
  addMesh(new THREE.BoxGeometry(0.20, 0.02, 0.14), mats.darkMetal, deck, -1.16, 0.718, 1.52);
  const btn33 = addMesh(new THREE.BoxGeometry(0.16, 0.038, 0.11), mats.brushedSilver, deck, -1.16, 0.735, 1.52);
  tagHit(btn33, { kind: 'speed', rpm: 33.333 });
  addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.016, 16), mats.led33, deck, -1.16, 0.724, 1.38, false);

  addMesh(new THREE.BoxGeometry(0.20, 0.02, 0.14), mats.darkMetal, deck, -0.92, 0.718, 1.52);
  const btn45 = addMesh(new THREE.BoxGeometry(0.16, 0.038, 0.11), mats.brushedSilver, deck, -0.92, 0.735, 1.52);
  tagHit(btn45, { kind: 'speed', rpm: 45 });
  addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.016, 16), mats.led45, deck, -0.92, 0.724, 1.38, false);

  // Fixed strobe lamp outside the platter well; local +X faces the speed markings.
  // Keep the entire housing and foot clear, not just the lamp's centre point.
  const strobeTower = new THREE.Group();
  strobeTower.name = 'strobeLamp';
  strobeTower.position.set(-1.67, 0.715, 1.10);
  strobeTower.rotation.y = Math.atan2(strobeTower.position.z - PLATTER_Z, PLATTER_X - strobeTower.position.x);
  deck.add(strobeTower);
  const strobeFoot = addMesh(new THREE.BoxGeometry(0.26, 0.018, 0.24), mats.darkMetal, strobeTower, 0, 0.009, 0);
  strobeFoot.name = 'strobeFoot';
  const strobeHousing = addMesh(new THREE.BoxGeometry(0.20, 0.15, 0.18), mats.darkMetal, strobeTower, 0, 0.093, 0);
  strobeHousing.name = 'strobeHousing';
  const strobeHood = addMesh(new THREE.BoxGeometry(0.235, 0.018, 0.205), mats.brushedSilver, strobeTower, 0.012, 0.177, 0);
  strobeHood.name = 'strobeHood';
  const strobeLens = addMesh(new THREE.BoxGeometry(0.012, 0.060, 0.125), mats.accentGlow, strobeTower, 0.103, 0.108, 0, false);
  strobeLens.name = 'strobeLens';
  const strobeLight = new THREE.PointLight(0xffb000, 0.55, 2.3, 2);
  strobeLight.position.set(0.145, 0.108, 0);
  strobeTower.add(strobeLight);

  // Rotary Surface-Noise Potentiometer Knob (front-right control bay)
  const surfaceKnobGroup = new THREE.Group();
  surfaceKnobGroup.position.set(1.56, 0.716, 1.08);
  deck.add(surfaceKnobGroup);
  const surfaceScaleRing = addMesh(new THREE.PlaneGeometry(0.46, 0.46), mats.surfaceScale, surfaceKnobGroup, 0, 0.002, 0, false);
  surfaceScaleRing.rotation.x = -Math.PI / 2;
  addMesh(new THREE.CylinderGeometry(0.165, 0.175, 0.022, 32), mats.darkMetal, surfaceKnobGroup, 0, 0.011, 0);

  const surfaceDial = new THREE.Group();
  surfaceDial.position.y = 0.022;
  surfaceKnobGroup.add(surfaceDial);
  const surfaceKnobBody = addMesh(new THREE.CylinderGeometry(0.135, 0.145, 0.135, 36), mats.knurledMetal, surfaceDial, 0, 0.068, 0);
  addMesh(new THREE.CylinderGeometry(0.125, 0.135, 0.022, 36), mats.brushedSilver, surfaceDial, 0, 0.142, 0);
  addMesh(new THREE.BoxGeometry(0.022, 0.018, 0.085), mats.accentGlow, surfaceDial, 0, 0.152, -0.068, false);
  tagHit(surfaceKnobBody, { kind: 'surface' });
  const surfaceHitMat = trackMat(new THREE.MeshBasicMaterial({ visible: false }));
  const surfaceHit = addMesh(new THREE.CylinderGeometry(0.24, 0.24, 0.26, 16), surfaceHitMat, surfaceKnobGroup, 0, 0.12, 0, false);
  tagHit(surfaceHit, { kind: 'surface' });

  // Rotary Stepped Track Selector Encoder Knob (right control bay above surface knob)
  const trackKnobGroup = new THREE.Group();
  trackKnobGroup.position.set(1.58, 0.716, 0.48);
  deck.add(trackKnobGroup);
  const trackScaleRing = addMesh(new THREE.PlaneGeometry(0.42, 0.42), mats.trackScale, trackKnobGroup, 0, 0.002, 0, false);
  trackScaleRing.rotation.x = -Math.PI / 2;
  addMesh(new THREE.CylinderGeometry(0.148, 0.158, 0.022, 32), mats.darkMetal, trackKnobGroup, 0, 0.011, 0);

  const trackDial = new THREE.Group();
  trackDial.position.y = 0.022;
  trackKnobGroup.add(trackDial);
  const trackKnobBody = addMesh(new THREE.CylinderGeometry(0.12, 0.128, 0.125, 36), mats.knurledMetal, trackDial, 0, 0.062, 0);
  addMesh(new THREE.CylinderGeometry(0.11, 0.12, 0.020, 36), mats.brushedSilver, trackDial, 0, 0.132, 0);
  addMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.014, 14), mats.accent, trackDial, 0, 0.144, -0.068, false);
  tagHit(trackKnobBody, { kind: 'track' });
  const trackHit = addMesh(new THREE.CylinderGeometry(0.22, 0.22, 0.24, 16), surfaceHitMat, trackKnobGroup, 0, 0.11, 0, false);
  tagHit(trackHit, { kind: 'track' });

  // Power/play indicator LED bezel (front-right)
  addMesh(new THREE.CylinderGeometry(0.052, 0.058, 0.022, 24), mats.brushedSilver, deck, 1.18, 0.72, 1.32, false);
  const playLed = addMesh(new THREE.SphereGeometry(0.034, 16, 12), mats.accentGlow, deck, 1.18, 0.732, 1.32, false);

  // =========================================================================
  // 2. PRECISION S-SHAPED TONEARM ASSEMBLY
  // =========================================================================
  const armStation = new THREE.Group();
  armStation.position.set(1.20, 0.715, -0.78);
  deck.add(armStation);

  // Circular recessed armbase & VTA height adjustment collar
  addMesh(new THREE.CylinderGeometry(0.42, 0.45, 0.045, 48), mats.darkMetal, armStation, 0, 0.022, 0);
  addMesh(new THREE.CylinderGeometry(0.35, 0.37, 0.06, 48), mats.brushedSilver, armStation, 0, 0.072, 0);
  addMesh(new THREE.CylinderGeometry(0.24, 0.26, 0.14, 36), mats.darkMetal, armStation, 0, 0.165, 0);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), mats.chrome, armStation, Math.cos(a) * 0.39, 0.048, Math.sin(a) * 0.39, false);
  }

  // Anti-skate dial knob beside armbase
  const antiSkate = new THREE.Group();
  antiSkate.position.set(0.34, 0.09, 0.24);
  armStation.add(antiSkate);
  addMesh(new THREE.CylinderGeometry(0.082, 0.092, 0.07, 24), mats.darkMetal, antiSkate, 0, 0, 0);
  addMesh(new THREE.CylinderGeometry(0.068, 0.068, 0.024, 24), mats.brushedSilver, antiSkate, 0, 0.045, 0);

  // Cueing lift bar & animated chrome cue lever
  addMesh(new THREE.CylinderGeometry(0.024, 0.027, 0.34, 16), mats.chrome, armStation, -0.22, 0.17, 0.36);
  const cueBar = addMesh(new THREE.TorusGeometry(0.22, 0.017, 10, 24, Math.PI * 0.55), mats.darkMetal, armStation, -0.02, 0.34, 0.38);
  cueBar.rotation.x = Math.PI / 2;
  cueBar.rotation.z = 0.7;

  const cueLeverPivot = new THREE.Group();
  cueLeverPivot.position.set(0.24, 0.12, 0.44);
  armStation.add(cueLeverPivot);
  const cueLeverRod = addMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.26, 12), mats.chrome, cueLeverPivot, 0.07, 0.09, 0);
  cueLeverRod.rotation.z = -0.58;
  const cueLeverKnob = addMesh(new THREE.SphereGeometry(0.032, 12, 10), mats.darkMetal, cueLeverPivot, 0.16, 0.17, 0);
  tagHit(cueLeverRod, { kind: 'arm' });
  tagHit(cueLeverKnob, { kind: 'arm' });

  // Tonearm rest post (cradles the wand snugly when parked)
  const armRest = new THREE.Group();
  armRest.position.set(0.06, 0, 1.18);
  armStation.add(armRest);
  addMesh(new THREE.CylinderGeometry(0.046, 0.056, 0.03, 18), mats.brushedSilver, armRest, 0, 0.015, 0);
  addMesh(new THREE.CylinderGeometry(0.026, 0.030, 0.38, 16), mats.darkMetal, armRest, 0, 0.205, 0);
  const restClip = addMesh(new THREE.TorusGeometry(0.042, 0.014, 10, 18, Math.PI * 1.25), mats.darkMetal, armRest, 0, 0.415, 0);
  restClip.rotation.y = Math.PI / 2;
  restClip.rotation.z = Math.PI * 0.88;

  // Rotating tonearm gimbal yaw group
  const armYaw = new THREE.Group();
  armYaw.position.set(0, 0.391, 0); // deck-local y = 1.106 -> stylus kisses vinyl at y = 0.975 (vinyl top 0.973)
  armStation.add(armYaw);

  // Outer gimbal U-yoke arch & bearing caps
  addMesh(new THREE.BoxGeometry(0.32, 0.04, 0.16), mats.darkMetal, armYaw, 0, -0.11, 0);
  addMesh(new THREE.BoxGeometry(0.045, 0.25, 0.14), mats.brushedSilver, armYaw, -0.145, 0.01, 0);
  addMesh(new THREE.BoxGeometry(0.045, 0.25, 0.14), mats.brushedSilver, armYaw, 0.145, 0.01, 0);
  addMesh(new THREE.BoxGeometry(0.33, 0.042, 0.14), mats.brushedSilver, armYaw, 0, 0.14, 0);
  addMesh(new THREE.CylinderGeometry(0.042, 0.042, 0.035, 20), mats.chrome, armYaw, 0, 0.172, 0);
  const leftBearing = addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.04, 20), mats.chrome, armYaw, -0.17, 0.015, 0);
  leftBearing.rotation.z = Math.PI / 2;
  const rightBearing = addMesh(new THREE.CylinderGeometry(0.036, 0.036, 0.04, 20), mats.chrome, armYaw, 0.17, 0.015, 0);
  rightBearing.rotation.z = Math.PI / 2;

  // Pitching tonearm wand group (lifts smoothly off armrest / groove & lowers with silicone damping)
  const armPitch = new THREE.Group();
  armPitch.position.set(0, 0.015, 0);
  armYaw.add(armPitch);

  addMesh(new THREE.CylinderGeometry(0.085, 0.085, 0.18, 24), mats.darkMetal, armPitch, 0, 0, 0);

  // Rear counterweight stub + knurled brushed counterweight + calibrated tracking force dial
  const stub = addMesh(new THREE.CylinderGeometry(0.032, 0.032, 0.56, 18), mats.chrome, armPitch, 0, 0, -0.28);
  stub.rotation.x = Math.PI / 2;
  const cwBody = addMesh(new THREE.CylinderGeometry(0.118, 0.118, 0.26, 36), mats.knurledMetal, armPitch, 0, 0, -0.40);
  cwBody.rotation.x = Math.PI / 2;
  const cwDial = addMesh(new THREE.CylinderGeometry(0.122, 0.122, 0.068, 36), mats.dial, armPitch, 0, 0, -0.245);
  cwDial.rotation.x = Math.PI / 2;
  const cwCap = addMesh(new THREE.CylinderGeometry(0.095, 0.115, 0.032, 32), mats.darkMetal, armPitch, 0, 0, -0.545);
  cwCap.rotation.x = Math.PI / 2;

  // S-shaped chrome tonearm tube
  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0.54),
    new THREE.Vector3(0.098, 0, 1.08),
    new THREE.Vector3(0.025, 0, 1.48),
    new THREE.Vector3(-0.13, -0.015, 1.78)
  ]);
  const armTube = addMesh(new THREE.TubeGeometry(armCurve, 44, 0.028, 16, false), mats.chrome, armPitch, 0, 0, 0);
  tagHit(armTube, { kind: 'arm' });

  // Bayonet locking collar, angled headshell, finger lift & moving-magnet cartridge
  const headGroup = new THREE.Group();
  headGroup.position.set(-0.13, -0.015, 1.78);
  headGroup.rotation.y = -0.39;
  armPitch.add(headGroup);

  const collar = addMesh(new THREE.CylinderGeometry(0.046, 0.044, 0.085, 24), mats.darkMetal, headGroup, 0, 0, 0.03);
  collar.rotation.x = Math.PI / 2;
  tagHit(collar, { kind: 'arm' });

  const headshell = addMesh(new THREE.BoxGeometry(0.14, 0.042, 0.30), mats.darkMetal, headGroup, 0, 0.012, 0.21);
  tagHit(headshell, { kind: 'arm' });
  addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), mats.chrome, headGroup, -0.038, 0.036, 0.24, false);
  addMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 10), mats.chrome, headGroup, 0.038, 0.036, 0.24, false);

  const liftCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.065, 0.015, 0.16),
    new THREE.Vector3(0.155, 0.025, 0.19),
    new THREE.Vector3(0.195, 0.065, 0.26)
  ]);
  const fingerLift = addMesh(new THREE.TubeGeometry(liftCurve, 14, 0.009, 8, false), mats.chrome, headGroup, 0, 0, 0, false);
  tagHit(fingerLift, { kind: 'arm' });

  const cartBody = addMesh(new THREE.BoxGeometry(0.115, 0.082, 0.21), mats.subChassis, headGroup, 0, -0.042, 0.22);
  tagHit(cartBody, { kind: 'arm' });
  const stylusHousing = addMesh(new THREE.BoxGeometry(0.105, 0.048, 0.095), mats.accent, headGroup, 0, -0.068, 0.295);
  tagHit(stylusHousing, { kind: 'arm' });
  const cantilever = addMesh(new THREE.CylinderGeometry(0.004, 0.006, 0.062, 8), mats.chrome, headGroup, 0, -0.102, 0.325, false);
  cantilever.rotation.x = 0.36;

  // Invisible hit volume for effortless arm tap/drag (kept clear of rotary knobs!)
  const armHitMat = trackMat(new THREE.MeshBasicMaterial({ visible: false }));
  const armHit = addMesh(new THREE.BoxGeometry(0.56, 0.48, 2.45), armHitMat, armPitch, -0.08, 0.02, 0.90, false);
  tagHit(armHit, { kind: 'arm' });

  // =========================================================================
  // 3. TRANSPARENT ACRYLIC DUSTCOVER (GEOMETRY-SAFE OPEN/CLOSE TOGGLE)
  // =========================================================================
  const hingeZ = -1.60;
  const hingeY = 0.67;
  for (const hx of [-1.28, 1.28]) {
    addMesh(new THREE.BoxGeometry(0.24, 0.12, 0.09), mats.brushedSilver, deck, hx, hingeY - 0.01, hingeZ - 0.02);
    const pin = addMesh(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 16), mats.chrome, deck, hx, hingeY + 0.04, hingeZ);
    pin.rotation.z = Math.PI / 2;
  }

  const dustcover = new THREE.Group();
  dustcover.position.set(0, hingeY + 0.04, hingeZ);
  dustcover.rotation.x = LID_OPEN_ANGLE;
  deck.add(dustcover);

  const dcW = 4.10;
  const dcD = 3.66;
  const dcH = 0.60; // Clears gimbal top (1.278) and spindle (1.188) cleanly even when closed!
  const dcT = 0.036;

  function addGlassPanel(w, h, d, x, y, z, parent, mat, edgeMat, order = 4) {
    const panelMesh = addMesh(new THREE.BoxGeometry(w, h, d), mat, parent, x, y, z, false);
    panelMesh.renderOrder = order;
    addEdges(panelMesh, edgeMat, 30);
    return panelMesh;
  }

  for (const hx of [-1.28, 1.28]) {
    addMesh(new THREE.BoxGeometry(0.22, 0.16, 0.068), mats.darkMetal, dustcover, hx, 0.10, 0.02, false);
  }
  addGlassPanel(dcW, dcT, dcD, 0, dcH, dcD / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 5);
  addGlassPanel(dcW, dcH, dcT, 0, dcH / 2, dcD - dcT / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 5);
  addGlassPanel(dcW, dcH, dcT, 0, dcH / 2, dcT / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 4);
  addGlassPanel(dcT, dcH, dcD - dcT * 2, -dcW / 2 + dcT / 2, dcH / 2, dcD / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 4);
  addGlassPanel(dcT, dcH, dcD - dcT * 2, dcW / 2 - dcT / 2, dcH / 2, dcD / 2, dustcover, mats.dustcoverGlass, mats.glassEdge, 4);

  // The cover stays open: its tab is modeled, but closing it is not a playback control.
  addMesh(new THREE.BoxGeometry(0.54, 0.042, 0.075), mats.brushedSilver, dustcover, 0, 0.025, dcD + 0.018, false);

  // =========================================================================
  // 4. PHOTOREAL 12" BLACK VINYL RECORD & PROCEDURAL PAPER LABEL
  // =========================================================================
  const record = new THREE.Group();
  world.add(record);

  // Beaded PVC disc rim & base body
  const vinylDisc = addMesh(new THREE.CylinderGeometry(VINYL_RADIUS, VINYL_RADIUS, 0.024, 96), mats.vinylRim, record, 0, 0, 0);
  tagHit(vinylDisc, { kind: 'record' });

  // Exact polar UV-mapped grooved top & bottom vinyl playing surfaces
  const vinylTopFace = addMesh(new THREE.CircleGeometry(VINYL_RADIUS - 0.004, 128), mats.vinylTop, record, 0, 0.013, 0, false);
  vinylTopFace.rotation.x = -Math.PI / 2;
  vinylTopFace.receiveShadow = true;
  tagHit(vinylTopFace, { kind: 'record' });

  const vinylBotFace = addMesh(new THREE.CircleGeometry(VINYL_RADIUS - 0.004, 96), mats.vinylTop, record, 0, -0.013, 0, false);
  vinylBotFace.rotation.x = Math.PI / 2;

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = labelCanvas.height = 512;
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.anisotropy = 4;
  const labelMat = trackMat(new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.66, metalness: 0.02 }));

  // Paper center label with true circular spindle cutout
  const labelFace = addMesh(new THREE.RingGeometry(0.036, 0.382, 64), labelMat, record, 0, 0.015, 0, false);
  labelFace.rotation.x = -Math.PI / 2;
  tagHit(labelFace, { kind: 'record' });

  const labelBack = addMesh(new THREE.RingGeometry(0.036, 0.382, 48), labelMat, record, 0, -0.015, 0, false);
  labelBack.rotation.x = Math.PI / 2;

  // =========================================================================
  // 5. OPEN-SIDED TRANSPARENT ACRYLIC FAN CRADLE & BROWSABLE SLEEVES
  // =========================================================================
  const crate = new THREE.Group();
  crate.position.set(CRATE_X, 0, CRATE_Z);
  crate.rotation.y = CRATE_ROT_Y;
  world.add(crate);

  // Crate rubber feet
  for (const cx of [-1.76, 1.04]) {
    for (const cz of [-1.02, 0.90]) {
      addMesh(new THREE.CylinderGeometry(0.11, 0.12, 0.05, 20), mats.footRubber, crate, cx, 0.025, cz);
    }
  }

  // Sleek wide beveled clear acrylic gallery base slab
  addGlassPanel(5.30, 0.076, 2.34, -1.10, 0.088, -0.06, crate, mats.crateGlass, mats.glassEdge, 2);

  // Low dark rubberized grip rails on base (keeps sleeves physically grounded without blocking fan tilt)
  addMesh(new THREE.BoxGeometry(4.90, 0.024, 0.14), mats.footRubber, crate, -1.10, 0.138, 0.68, false);
  addMesh(new THREE.BoxGeometry(4.90, 0.024, 0.14), mats.footRubber, crate, -1.10, 0.138, -0.34, false);

  // Sculpted clear acrylic rear backrest spine (tilted gently to cradle fanned sleeves without clipping)
  const backWall = addGlassPanel(5.20, 1.32, 0.055, -1.10, 0.78, -1.18, crate, mats.crateGlass, mats.glassEdge, 3);
  backWall.rotation.x = -0.20;

  // Low beveled acrylic side cheek retainers (kept low y<=0.46 so fanned sleeves sweep freely above with zero clipping!)
  const cheekShape = new THREE.Shape();
  cheekShape.moveTo(-1.14, 0.12);
  cheekShape.lineTo(0.42, 0.12);
  cheekShape.lineTo(0.42, 0.34);
  cheekShape.quadraticCurveTo(-0.30, 0.38, -1.14, 0.56);
  cheekShape.closePath();
  const cheekGeo = new THREE.ExtrudeGeometry(cheekShape, {
    depth: 0.05, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2
  });
  cheekGeo.rotateY(-Math.PI / 2);

  const leftCheek = addMesh(cheekGeo, mats.crateGlass, crate, -1.94, 0, 0, false);
  leftCheek.renderOrder = 3;
  addEdges(leftCheek, mats.glassEdge, 24);

  const rightCheek = addMesh(cheekGeo, mats.crateGlass, crate, 1.32, 0, 0, false);
  rightCheek.renderOrder = 3;
  addEdges(rightCheek, mats.glassEdge, 24);

  // Clear acrylic front showcase lip + inlaid accent bar under active sleeve
  addGlassPanel(2.84, 0.11, 0.052, 0.18, 0.175, 1.07, crate, mats.crateGlass, mats.glassEdge, 4);
  addMesh(new THREE.BoxGeometry(2.38, 0.036, 0.034), mats.accent, crate, 0.32, 0.142, 1.03, false);

  // Brushed aluminum corner standoff pins joining the acrylic base, cheeks & backrest
  for (const bx of [-1.965, 1.295]) {
    for (const [by, bz] of [[0.22, 0.32], [0.22, -1.06], [0.46, -1.06]]) {
      const bolt = addMesh(new THREE.CylinderGeometry(0.042, 0.042, 0.088, 16), mats.brushedSilver, crate, bx, by, bz, false);
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
      mat.color.set('#ffffff');
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
  const sleeveMouthGeo = new THREE.BoxGeometry(0.014, SLEEVE_SIZE - 0.05, SLEEVE_THICK - 0.020);
  const sleeveInnerGeo = new THREE.BoxGeometry(0.010, SLEEVE_SIZE - 0.10, SLEEVE_THICK - 0.034);

  function addSleeveEntry(album, idx) {
    const group = new THREE.Group();
    crate.add(group);

    const edgeTone = trackMat(new THREE.MeshStandardMaterial({
      color: '#ded6c5', roughness: 0.78, metalness: 0.02
    }));
    const frontMat = trackMat(new THREE.MeshStandardMaterial({
      color: '#d8d0c0', roughness: 0.42, metalness: 0.02
    }));

    // Six-face material array: +x(open mouth), -x(spine), +y(top), -y(bottom), +z(front), -z(back)
    const board = addMesh(sleeveBoardGeo, [
      mats.slotDark, edgeTone, edgeTone, edgeTone, mats.jacketBack, mats.jacketBack
    ], group, 0, 0, 0);
    board.userData = { kind: 'sleeve', sleeveId: album.id };

    const frontFace = addMesh(sleeveCoverGeo, frontMat, group, 0, 0, SLEEVE_THICK / 2 + 0.002, false);
    frontFace.receiveShadow = true;
    frontFace.userData = { kind: 'sleeve', sleeveId: album.id };

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
      rot: new THREE.Vector3(-0.11, 0, 0),
      targetRot: new THREE.Vector3(-0.11, 0, 0),
      initialized: false
    };
    sleeveEntries.push(entry);
    ensureCoverTexture(album, frontMat);
    return entry;
  }

  catalogue.forEach((album, idx) => addSleeveEntry(album, idx));

  // =========================================================================
  // STATE, PHYSICS KINEMATICS & SETTLED LATCH
  // =========================================================================
  let state = {
    album: catalogue[0] || null,
    placed: false,
    cued: false,
    playing: false,
    browserOpen: true,
    motor: false,
    rpm: 33.333,
    surface: 0,
    progress: 0
  };

  let frame = 0;
  let disposed = false;
  let visible = true;
  let lastTime = 0;
  let stageAspect = 1.5;

  // Continuous mechanical state variables
  let placeProgress = 0;        // 0 = peeking in sleeve, 1 = seated on spindle
  let armSwing = 0;             // 0 = over armrest, 1 = over target vinyl groove
  let armDrop = 1;              // 0 = lifted clear, 1 = resting (on armrest if swing=0, on vinyl if swing=1)
  let seekingGroove = false;
  let grooveProgress = 0;       // 0..1 outer-to-inner groove tracking
  let platterAngle = 0;         // current platter & placed vinyl rotation (rad)
  let platterVel = 0;           // current angular speed (rad/s), smoothly ramps with inertia
  let lidOpen = true;           // dustcover target open/close state
  let lidAngle = LID_OPEN_ANGLE;
  let surfaceVal = 0;           // smoothed 0..1 rotary surface-noise knob
  let trackKnobAngle = 0;       // target stepped encoder rotation
  let trackKnobCurr = 0;        // smoothed encoder rotation
  let swipeOffset = 0;          // subtle elastic horizontal swipe preview on the fan
  let speedPress33 = 0;         // tactile button press animation
  let speedPress45 = 0;
  let needleSettledLatched = false;
  let armSettledLatched = false;
  let recordHomeLatched = false;

  let drag = null;
  let settle = null;
  let hoveredSleeveId = null;
  let hoveredKind = null;
  let lastReportedHover = null;
  let vinylHoverNudge = 0;
  let snapGlow = 0;
  let lastWheelBrowseAt = 0;

  const platterWorldPos = new THREE.Vector3(DECK_X + PLATTER_X, PLATTER_SURFACE_Y + 0.014, DECK_Z + PLATTER_Z);
  const flatQuat = new THREE.Quaternion();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.58);
  const dragClampMin = new THREE.Vector3(-4.8, 1.58, -2.1);
  const dragClampMax = new THREE.Vector3(3.6, 1.58, 2.2);

  // Scratch objects (zero per-frame allocations)
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

  function getFanSpreadScale() {
    // Full dramatic fan on desktop; gently compacts on narrow portrait screens so everything fits comfortably
    return THREE.MathUtils.clamp((stageAspect - 0.62) / 0.62, 0.56, 1.0);
  }

  function computeSleeveTargets() {
    const count = sleeveEntries.length;
    if (!count) return;
    const selIdx = getSelectedIndex();
    const open = state.browserOpen !== false;
    const spread = open ? getFanSpreadScale() : 0;
    const backCount = Math.max(1, count - 1);

    for (let i = 0; i < count; i++) {
      const entry = sleeveEntries[i];
      const rank = (i - selIdx + count) % count;

      if (rank === 0) {
        // Active sleeve: prominently forward on the front showcase rail, 100% unobstructed
        entry.targetPos.set(
          open ? 0.34 : 0.24,
          0.145 + SLEEVE_SIZE / 2,
          open ? 0.84 : 0.80
        );
        entry.targetRot.set(-0.10, open ? -0.05 : 0, open ? -0.025 : 0);
      } else if (open) {
        // Fanned open: generously spread leftward & arched upward around a fan pivot so every cover is clearly visible
        const u = backCount > 1 ? rank / backCount : 1;
        const x = 0.34 - rank * 0.46 * spread;
        const y = 0.145 + SLEEVE_SIZE / 2 + rank * 0.095 + Math.sin(u * Math.PI) * 0.14;
        const z = 0.52 - rank * 0.23;
        const rotZ = rank * 0.082 * spread;
        const rotY = rank * 0.042 * spread;
        const rotX = -0.115 - rank * 0.014;
        entry.targetPos.set(x, y, z);
        entry.targetRot.set(rotX, rotY, rotZ);
      } else {
        // Folded compactly into the acrylic cradle
        const t = backCount > 1 ? (rank - 1) / (backCount - 1) : 0;
        entry.targetPos.set(
          0.18 - t * 0.26,
          0.18 + SLEEVE_SIZE / 2 + t * 0.32,
          0.32 - t * 1.06
        );
        entry.targetRot.set(-0.15 - t * 0.05, 0, 0);
      }

      if (open && rank > 0) {
        const rotation = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(entry.targetRot.x, entry.targetRot.y, entry.targetRot.z)).elements;
        entry.targetPos.y = .145 + (SLEEVE_SIZE * (Math.abs(rotation[1]) + Math.abs(rotation[5])) + SLEEVE_THICK * Math.abs(rotation[9])) / 2;
      }
      if (!entry.initialized) {
        entry.pos.copy(entry.targetPos);
        entry.rot.copy(entry.targetRot);
        entry.group.position.copy(entry.pos);
        entry.group.rotation.set(entry.rot.x, entry.rot.y, entry.rot.z);
        entry.initialized = true;
      }
    }
  }

  function computeVinylHome(outPos, outQuat, nudge = 0) {
    const selEntry = sleeveEntries[getSelectedIndex()];
    if (selEntry) {
      crate.updateMatrixWorld(true);
      // Vinyl peeks clearly out of the open right mouth of the selected sleeve (label crescent & grooves visible)
      tmpPos.set(0.92 + nudge, 0.03, 0.0);
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

    // Pressed paper ring indentation
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 232, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.20)';
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

    const nextEnv = createStudioEnvironment(pmrem, isDark, accent);
    world.environment = nextEnv.texture;
    if (envRT) envRT.dispose();
    envRT = nextEnv;

    if (isDark) {
      mats.subChassis.color.set('#151310');
      mats.brushedDeck.color.set('#332e29');
      mats.brushedDeck.roughness = 0.34;
      mats.brushedDeck.metalness = 0.84;
      mats.brushedSilver.color.set('#d2cab9');
      mats.knurledMetal.color.set('#cbc3b4');
      mats.darkMetal.color.set('#201c18');
      mats.plinthGlass.color.set('#2a241e');
      mats.plinthGlass.opacity = 0.60;
      mats.dustcoverGlass.color.set('#ddd5c7');
      mats.dustcoverGlass.opacity = 0.16;
      mats.crateGlass.color.set('#dfd7c8');
      mats.crateGlass.opacity = 0.21;
      mats.glassEdge.color.set('#f1e9da');
      mats.glassEdge.opacity = 0.36;
      mats.plinthEdge.color.set('#e6dac5');
      mats.plinthEdge.opacity = 0.28;
      mats.jacketBack.color.set('#211d18');
      mats.shadowFloor.opacity = 0.44;
      mats.surfaceScale.color.set('#e8e2d4');
      mats.trackScale.color.set('#e8e2d4');
      hemiLight.color.set('#fff3de');
      hemiLight.groundColor.set('#181410');
      hemiLight.intensity = 0.72;
      keyLight.intensity = 2.45;
      rimLight.color.set('#ffe4b8');
      rimLight.intensity = 1.30;
      renderer.toneMappingExposure = 1.08;
    } else {
      mats.subChassis.color.set('#26201a');
      mats.brushedDeck.color.set('#bdb29d');
      mats.brushedDeck.roughness = 0.32;
      mats.brushedDeck.metalness = 0.78;
      mats.brushedSilver.color.set('#dcd4c5');
      mats.knurledMetal.color.set('#c4baa7');
      mats.darkMetal.color.set('#2c251f');
      mats.plinthGlass.color.set('#ddd3c1');
      mats.plinthGlass.opacity = 0.56;
      mats.dustcoverGlass.color.set('#f8f3ea');
      mats.dustcoverGlass.opacity = 0.20;
      mats.crateGlass.color.set('#f4eee2');
      mats.crateGlass.opacity = 0.24;
      mats.glassEdge.color.set(ink);
      mats.glassEdge.opacity = 0.28;
      mats.plinthEdge.color.set(borderStrong);
      mats.plinthEdge.opacity = 0.48;
      mats.jacketBack.color.set('#362f28');
      mats.shadowFloor.opacity = 0.20;
      mats.surfaceScale.color.set(ink);
      mats.trackScale.color.set(ink);
      hemiLight.color.set('#fffbf2');
      hemiLight.groundColor.set('#8f826d');
      hemiLight.intensity = 0.86;
      keyLight.intensity = 2.25;
      rimLight.color.set('#fff3dc');
      rimLight.intensity = 1.12;
      renderer.toneMappingExposure = 1.02;
    }

    mats.accent.color.set(accent);
    mats.accent.emissive.set(accent);
    mats.accentGlow.color.set(accent);
    mats.accentGlow.emissive.set(accent);
    mats.led33.emissive.set(accent);
    mats.led45.emissive.set(accent);
    mats.snapRing.color.set(accent);
    strobeLight.color.set(accent);

    const baseEdge = new THREE.Color(isDark ? '#c6bca9' : '#e4dbc9');
    sleeveEntries.forEach((entry, i) => {
      const shade = 0.92 + ((i * 37) % 15) * 0.01;
      entry.edgeTone.color.copy(baseEdge).multiplyScalar(shade);
    });

    drawLabel();
    schedule();
  }

  // =========================================================================
  // INTERACTION: FAN BROWSE/SWIPE/WHEEL, HOVER INFO, KNOBS, RECORD & ARM DRAG
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

  function reportHover(nextId) {
    const normalized = nextId || null;
    if (normalized === lastReportedHover) return;
    lastReportedHover = normalized;
    queueMicrotask(() => {
      if (!disposed && lastReportedHover === normalized) {
        action('hover', normalized);
      }
    });
  }

  function pickTarget(event) {
    setPointerFromEvent(event);
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects([...interactiveTargets, ...sleeveHitTargets], false);
    if (!hits.length) return null;
    // The generous invisible arm target must not mask a visible knob or button.
    const hit = hits[0].object === armHit ? (hits.find(h => h.object !== armHit) || hits[0]) : hits[0];
    const data = hit.object.userData;
    if (!data) return null;
    if (data.kind === 'sleeve') {
      const selId = state.album?.id;
      if (data.sleeveId === selId) {
        return { kind: state.placed ? 'sleeve-active' : 'record', id: data.sleeveId };
      }
      return { kind: 'select', id: data.sleeveId };
    }
    return data;
  }

  function updateCursor(hit) {
    if (drag) {
      renderer.domElement.style.cursor = drag.hit === 'surface' || drag.hit === 'track' ? 'ew-resize' : 'grabbing';
      return;
    }
    if (!hit) {
      renderer.domElement.style.cursor = 'default';
    } else if (hit.kind === 'select' || hit.kind === 'speed' || hit.kind === 'lid') {
      renderer.domElement.style.cursor = 'pointer';
    } else if (hit.kind === 'surface' || hit.kind === 'track') {
      renderer.domElement.style.cursor = 'ew-resize';
    } else if (hit.kind === 'record' && state.placed) {
      renderer.domElement.style.cursor = 'default';
    } else if (hit.kind === 'sleeve-active') {
      renderer.domElement.style.cursor = 'grab';
    } else {
      renderer.domElement.style.cursor = 'grab';
    }
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    const hit = pickTarget(event);
    if (!hit) return;

    if (hit.kind === 'speed') {
      if (hit.rpm > 38) speedPress45 = 1; else speedPress33 = 1;
      state.rpm = hit.rpm;
      action('speed', hit.rpm);
      schedule();
      return;
    }
    if (hit.kind === 'record' && state.placed) return;

    if (hit.kind === 'select' || hit.kind === 'sleeve-active') {
      drag = {
        hit: 'fan',
        sleeveId: hit.id,
        isSelected: hit.kind === 'sleeve-active',
        x: event.clientX,
        y: event.clientY,
        swiping: false
      };
      // Capture release even outside the canvas; touch-action still permits native vertical scrolling.
      renderer.domElement.setPointerCapture(event.pointerId);
      return;
    }

    if (hit.kind === 'surface') {
      drag = {
        hit: 'surface',
        x: event.clientX,
        y: event.clientY,
        startVal: surfaceVal,
        lastEmitted: surfaceVal,
        moved: false
      };
      renderer.domElement.setPointerCapture(event.pointerId);
      host.classList.add('is-dragging');
      updateCursor(hit);
      return;
    }

    if (hit.kind === 'track') {
      const rect = renderer.domElement.getBoundingClientRect();
      const knobCenter = new THREE.Vector3();
      trackKnobGroup.getWorldPosition(knobCenter);
      knobCenter.project(camera);
      const knobScreenX = rect.left + (knobCenter.x * 0.5 + 0.5) * rect.width;
      drag = {
        hit: 'track',
        x: event.clientX,
        y: event.clientY,
        knobScreenX,
        stepAccum: 0,
        stepped: false
      };
      renderer.domElement.setPointerCapture(event.pointerId);
      host.classList.add('is-dragging');
      updateCursor(hit);
      return;
    }

    // Record or tonearm drag
    drag = {
      hit: hit.kind,
      x: event.clientX,
      y: event.clientY,
      startArm: armSwing
    };
    if (hit.kind === 'record' && !lidOpen) {
      lidOpen = true; // Geometry safety: open lid before placing record
    }
    reportHover(null);
    renderer.domElement.setPointerCapture(event.pointerId);
    host.classList.add('is-dragging');
    updateCursor(hit);
  }

  function onPointerMove(event) {
    if (!drag) {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        const hit = pickTarget(event);
        const nextSleeve = (hit?.kind === 'select' || hit?.kind === 'sleeve-active' || (hit?.kind === 'record' && hit.id))
          ? hit.id
          : (hit?.kind === 'record' ? state.album?.id || null : null);
        const nextKind = hit?.kind || null;
        updateCursor(hit);
        if (nextSleeve !== hoveredSleeveId || nextKind !== hoveredKind) {
          hoveredSleeveId = nextSleeve;
          hoveredKind = nextKind;
          reportHover(nextSleeve);
          action('control', nextKind);
          schedule();
        }
      }
      return;
    }

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const moved = Math.hypot(dx, dy);

    if (drag.hit === 'fan') {
      if (!drag.swiping && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        drag.swiping = true;
        try { renderer.domElement.setPointerCapture(event.pointerId); } catch (_) {}
        host.classList.add('is-dragging');
      }
      if (drag.swiping) {
        swipeOffset = THREE.MathUtils.clamp(dx / 160, -0.55, 0.55);
        schedule();
      }
      return;
    }

    if (drag.hit === 'surface') {
      if (moved > 3) drag.moved = true;
      const delta = (dx - dy * 0.85) / 150;
      const next = THREE.MathUtils.clamp(drag.startVal + delta, 0, 1);
      const rounded = Math.round(next * 100) / 100;
      surfaceVal = next;
      state.surface = rounded;
      if (Math.abs(rounded - drag.lastEmitted) >= 0.01) {
        drag.lastEmitted = rounded;
        action('surface', rounded);
      }
      schedule();
      return;
    }

    if (drag.hit === 'track') {
      const delta = (dx - dy * 0.5) / 36;
      const whole = Math.trunc(delta - drag.stepAccum);
      if (whole !== 0) {
        drag.stepAccum += whole;
        drag.stepped = true;
        const dir = whole > 0 ? 1 : -1;
        trackKnobAngle -= whole * (Math.PI / 6);
        schedule();
      }
      return;
    }

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
    } else if (drag.hit === 'arm') {
      drag.arm = THREE.MathUtils.clamp(drag.startArm + ((drag.x - event.clientX) / rect.width) * 3.1, 0, 1);
    }
    schedule();
  }

  function onPointerUp(event) {
    if (!drag) return;
    const held = drag;
    const rect = renderer.domElement.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;

    if (held.hit === 'fan') {
      const dx = event.clientX - held.x;
      const dy = event.clientY - held.y;
      drag = null;
      swipeOffset = 0;
      host.classList.remove('is-dragging');
      updateCursor(null);
      if (held.swiping && Math.abs(dx) > 32) {
        action('browse', dx < 0 ? 1 : -1);
      } else if (inside && Math.hypot(dx, dy) < 14 && !held.isSelected && held.sleeveId) {
        action('select', held.sleeveId);
      }
      schedule();
      return;
    }

    if (held.hit === 'surface') {
      drag = null;
      host.classList.remove('is-dragging');
      updateCursor(null);
      if (inside && !held.moved) {
        action('surface-control');
      }
      schedule();
      return;
    }

    if (held.hit === 'track') {
      drag = null;
      host.classList.remove('is-dragging');
      updateCursor(null);
      if(held.stepped && held.stepAccum!==0)action('track',held.stepAccum);
      if (inside && !held.stepped) {
        action('track-control');
      }
      schedule();
      return;
    }

    const tapped = !held.position && held.arm === undefined;
    const recordDrop = Boolean(
      held.position &&
      Math.hypot(held.position.x - platterWorldPos.x, held.position.z - platterWorldPos.z) < SNAP_RADIUS
    );
    const armDrop = held.arm !== undefined && (held.arm >= 0.5) !== Boolean(state.cued || state.held);

    cancelDrag();
    if (inside && (tapped || (held.hit === 'record' ? recordDrop : armDrop))) {
      action(held.hit === 'arm' && held.arm !== undefined && held.arm < .5 ? 'park' : held.hit);
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
      armSwing = drag.arm;
    }
    drag = null;
    swipeOffset = 0;
    host.classList.remove('is-dragging');
    updateCursor(null);
    schedule();
  }

  function onPointerLeave() {
    if (hoveredSleeveId !== null || hoveredKind !== null) {
      hoveredSleeveId = null;
      hoveredKind = null;
      reportHover(null);
      action('control', null);
      if (!drag) renderer.domElement.style.cursor = 'default';
      schedule();
    }
  }

  function onWheel(event) {
    const hit = pickTarget(event);
    // Allow turning rotary knobs smoothly with mouse wheel when directly hovering them
    if (hit?.kind === 'surface') {
      event.preventDefault();
      const step = (event.deltaY < 0 ? 0.06 : -0.06);
      const next = Math.round(THREE.MathUtils.clamp(surfaceVal + step, 0, 1) * 100) / 100;
      if (next !== state.surface) {
        surfaceVal = next;
        state.surface = next;
        action('surface', next);
        schedule();
      }
      return;
    }
    if (hit?.kind === 'track') {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelBrowseAt > 160) {
        lastWheelBrowseAt = now;
        const dir = event.deltaY > 0 ? 1 : -1;
        trackKnobAngle -= dir * (Math.PI / 6);
        action('track', dir);
        schedule();
      }
      return;
    }

    // Horizontal wheel or Shift+wheel flicks through the fanned sleeve catalogue without hijacking vertical page scroll
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 6;
    const isShiftWheel = event.shiftKey && Math.abs(event.deltaY) > 6;
    if (isHorizontal || isShiftWheel) {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelBrowseAt > 210) {
        lastWheelBrowseAt = now;
        const delta = isHorizontal ? event.deltaX : event.deltaY;
        action('browse', delta > 0 ? 1 : -1);
      }
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', cancelDrag);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

  // =========================================================================
  // RENDER LOOP (ZERO IDLE RAF; ON-DEMAND & MOTOR/PLAYING ONLY)
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

    // 1. Animate 3D fanned sleeves (spread / fold / hover pop / swipe nudge)
    const selId = state.album?.id;
    const swipeDamp = drag?.hit === 'fan' ? swipeOffset : 0;
    for (const entry of sleeveEntries) {
      const isSelected = entry.album.id === selId;
      const hoverTarget = (!drag && hoveredSleeveId === entry.album.id && !isSelected) ? 1 : 0;
      entry.hover = instant ? hoverTarget : THREE.MathUtils.damp(entry.hover, hoverTarget, 12, dt);
      if (Math.abs(entry.hover - hoverTarget) < 0.002) entry.hover = hoverTarget;
      else animating = true;

      // Hover lifts smoothly along each sleeve's own fan tilt axis so fanned covers never collide
      const fanLift = entry.hover * 0.36;
      const tx = entry.targetPos.x - Math.sin(entry.targetRot.z) * fanLift + swipeDamp * (isSelected ? 0.35 : 0.22);
      const ty = entry.targetPos.y + Math.cos(entry.targetRot.z) * fanLift;
      const tz = entry.targetPos.z + entry.hover * 0.08;
      const trx = entry.targetRot.x + entry.hover * 0.05;
      const tryy = entry.targetRot.y;
      const trz = entry.targetRot.z;

      if (instant) {
        entry.pos.set(tx, ty, tz);
        entry.rot.set(trx, tryy, trz);
      } else {
        entry.pos.x = THREE.MathUtils.damp(entry.pos.x, tx, 9, dt);
        entry.pos.y = THREE.MathUtils.damp(entry.pos.y, ty, 9, dt);
        entry.pos.z = THREE.MathUtils.damp(entry.pos.z, tz, 9, dt);
        entry.rot.x = THREE.MathUtils.damp(entry.rot.x, trx, 9, dt);
        entry.rot.y = THREE.MathUtils.damp(entry.rot.y, tryy, 9, dt);
        entry.rot.z = THREE.MathUtils.damp(entry.rot.z, trz, 9, dt);
        const posErr = Math.hypot(entry.pos.x - tx, entry.pos.y - ty, entry.pos.z - tz);
        const rotErr = Math.hypot(entry.rot.x - trx, entry.rot.y - tryy, entry.rot.z - trz);
        if (posErr < 0.002 && rotErr < 0.002) {
          entry.pos.set(tx, ty, tz);
          entry.rot.set(trx, tryy, trz);
        } else {
          animating = true;
        }
      }
      entry.group.position.copy(entry.pos);
      entry.group.rotation.set(entry.rot.x, entry.rot.y, entry.rot.z);
    }

    // 2. Peeking vinyl hover invitation
    const nudgeTarget = (!state.placed && !drag && hoveredKind === 'record') ? 0.14 : 0;
    vinylHoverNudge = instant ? nudgeTarget : THREE.MathUtils.damp(vinylHoverNudge, nudgeTarget, 10, dt);
    if (Math.abs(vinylHoverNudge - nudgeTarget) < 0.002) vinylHoverNudge = nudgeTarget;
    else animating = true;

    // 3. Dustcover open/close smooth motion (auto-opens if placing/returning record)
    const lidTarget = (lidOpen || placeProgress > 0.02 && placeProgress < 0.98) ? LID_OPEN_ANGLE : 0;
    lidAngle = instant ? lidTarget : THREE.MathUtils.damp(lidAngle, lidTarget, 7, dt);
    if (Math.abs(lidAngle - lidTarget) < 0.002) lidAngle = lidTarget;
    else animating = true;
    dustcover.rotation.x = lidAngle;

    // 4. Multi-phase Tonearm Kinematics (Lift -> Lateral Swing -> Controlled Descent)
    //    And safe interlock: on record return, lift & clear arm BEFORE vinyl lifts off spindle!
    const wantPlace = Boolean(state.placed);
    const wantCue = Boolean(state.cued && wantPlace);
    const holdArm = Boolean(state.held && wantPlace);
    const desiredGroove = THREE.MathUtils.clamp(state.progress || 0,0,1);

    if (drag?.hit === 'arm' && drag.arm !== undefined) {
      armSwing = drag.arm;
      armDrop = instant ? 0 : THREE.MathUtils.damp(armDrop, 0, 14, dt);
      animating = true;
    } else if (instant) {
      armSwing = wantCue || holdArm ? 1 : 0;
      armDrop = holdArm ? 0 : 1;seekingGroove=false;
    } else if ((holdArm || (seekingGroove && wantCue)) && placeProgress >= .995 && !drag && !settle) {
      armDrop=THREE.MathUtils.damp(armDrop,0,16,dt);
      if(armDrop<.01)armDrop=0;
      if(seekingGroove && armDrop<.08 && Math.abs(grooveProgress-desiredGroove)<.002)seekingGroove=false;
      if(wantCue||armDrop>0||seekingGroove)animating=true;
    } else if (wantCue && placeProgress >= 0.995 && !drag && !settle) {
      // Cue ON: 1) lift clear, 2) swing over groove, 3) controlled silicone-damped descent
      if (armSwing < 0.992) {
        armDrop = THREE.MathUtils.damp(armDrop, 0, 11, dt);
        if (armDrop < 0.22) {
          armSwing = THREE.MathUtils.damp(armSwing, 1, 6.2, dt);
        }
        if (Math.abs(armSwing - 1) < 0.004) armSwing = 1;
        animating = true;
      } else {
        armSwing = 1;
        armDrop = THREE.MathUtils.damp(armDrop, 1, 4.6, dt);
        if (Math.abs(armDrop - 1) < 0.004) armDrop = 1;
        else animating = true;
      }
    } else {
      // Cue OFF / Returning / Unplaced: 1) lift stylus vertically off groove, 2) sweep to rest, 3) settle into cradle
      if (armSwing > 0.008) {
        armDrop = THREE.MathUtils.damp(armDrop, 0, 12, dt);
        if (armDrop < 0.22) {
          armSwing = THREE.MathUtils.damp(armSwing, 0, 7.0, dt);
        }
        if (armSwing < 0.004) armSwing = 0;
        animating = true;
      } else {
        armSwing = 0;
        armDrop = THREE.MathUtils.damp(armDrop, 1, 8.5, dt);
        if (Math.abs(armDrop - 1) < 0.004) armDrop = 1;
        else animating = true;
      }
    }

    // 5. Record placement progress (waits for arm clearance before lifting off spindle on return!)
    const targetPlace = wantPlace ? 1 : 0;
    const armClearedPlatter = armSwing < 0.26 && (armSwing < 0.02 || armDrop < 0.35);
    const canMoveRecord = wantPlace || armClearedPlatter || instant;

    if (canMoveRecord && !drag?.position && !settle) {
      placeProgress = instant ? targetPlace : THREE.MathUtils.damp(placeProgress, targetPlace, 5.8, dt);
      if (Math.abs(placeProgress - targetPlace) < 0.0015) placeProgress = targetPlace;
      else animating = true;
    } else if (!wantPlace && placeProgress > 0.001) {
      // Keep animating while waiting for tonearm to finish clearing the platter
      animating = true;
    }

    // 6. Groove tracking progress while cued
    const targetGroove = ((wantCue || holdArm) && typeof state.progress === 'number')
      ? THREE.MathUtils.clamp(state.progress, 0, 1) : 0;
    if(!seekingGroove || armDrop<.08)grooveProgress = instant ? targetGroove : THREE.MathUtils.damp(grooveProgress, targetGroove, seekingGroove?12:4.5, dt);
    if (Math.abs(grooveProgress - targetGroove) < 0.0015) grooveProgress = targetGroove;
    else animating = true;

    // 7. Motor inertia spin-up / coast-down (33.333 or 45 RPM)
    const motorOn = Boolean(state.motor || state.playing);
    const rpm = (typeof state.rpm === 'number' && state.rpm > 0) ? state.rpm : 33.333;
    const targetVel = (motorOn && !instant) ? (Math.PI * 2 * (rpm / 60)) : 0;
    if (instant) {
      platterVel = 0;
    } else {
      const rate = targetVel > platterVel ? 3.2 : 2.1;
      platterVel = THREE.MathUtils.damp(platterVel, targetVel, rate, dt);
      if (targetVel === 0 && platterVel < 0.012) platterVel = 0;
      if (platterVel > 0) {
        platterAngle -= platterVel * dt;
        pulley.rotation.y -= platterVel * dt * 2.8;
        animating = true;
      } else if (Math.abs(platterVel - targetVel) > 0.01) {
        animating = true;
      }
    }
    platterGroup.rotation.y = platterAngle;

    // 8. Vinyl record 3D placement arc (clear of crate, deck & spindle, vertical dock)
    computeVinylHome(tmpHomePos, tmpHomeQuat, vinylHoverNudge);
    tmpSpinQuat.setFromAxisAngle(upAxis, platterAngle);

    if (drag?.position) {
      record.position.copy(drag.position);
      if (drag.inSnap) record.position.y -= 0.14;
      tmpEuler.set(0, 0, 0);
      tmpTiltQuat.setFromEuler(tmpEuler);
      record.quaternion.slerp(tmpTiltQuat, instant ? 1 : Math.min(1, dt * 16));
      animating = true;
    } else if (settle) {
      settle.progress = instant ? 1 : Math.min(1, settle.progress + dt * 3.4);
      const eased = THREE.MathUtils.smoothstep(settle.progress, 0, 1);
      const destPos = wantPlace ? platterWorldPos : tmpHomePos;
      const destQuat = wantPlace ? tmpSpinQuat : tmpHomeQuat;
      record.position.lerpVectors(settle.fromPos, destPos, eased);
      record.position.y += Math.sin(eased * Math.PI) * 0.28;
      record.quaternion.slerpQuaternions(settle.fromQuat, destQuat, eased);
      if (settle.progress >= 1) {
        settle = null;
        placeProgress = targetPlace;
      } else {
        animating = true;
      }
    } else {
      // Horizontal travel completes by p=0.84 so the final 16% drops straight vertically down onto the spindle!
      const horizT = THREE.MathUtils.smoothstep(placeProgress, 0.04, 0.84);
      const x = THREE.MathUtils.lerp(tmpHomePos.x, platterWorldPos.x, horizT);
      const z = THREE.MathUtils.lerp(tmpHomePos.z, platterWorldPos.z, horizT);
      const baseY = THREE.MathUtils.lerp(tmpHomePos.y, platterWorldPos.y, THREE.MathUtils.smoothstep(placeProgress, 0.10, 1.0));
      const liftArc = Math.sin(Math.pow(placeProgress, 0.78) * Math.PI) * 1.02;
      record.position.set(x, baseY + liftArc, z);
      record.quaternion.slerpQuaternions(tmpHomeQuat, tmpSpinQuat, THREE.MathUtils.smoothstep(placeProgress, 0.06, 0.72));
    }

    // Snap zone platter ring glow while dragging record
    const snapTarget = (drag?.hit === 'record' && drag.inSnap) ? 0.68 : (drag?.hit === 'record' ? 0.20 : 0);
    snapGlow = instant ? snapTarget : THREE.MathUtils.damp(snapGlow, snapTarget, 12, dt);
    if (Math.abs(snapGlow - snapTarget) < 0.005) snapGlow = snapTarget; else animating = true;
    mats.snapRing.opacity = snapGlow;

    // 9. Apply Tonearm Yaw, Silicone-Damped Pitch & Cueing Lever Motion
    const cuedAngle = THREE.MathUtils.lerp(ARM_OUTER_GROOVE_Y, ARM_INNER_GROOVE_Y, grooveProgress);
    armYaw.rotation.y = THREE.MathUtils.lerp(ARM_PARK_Y, cuedAngle, armSwing);
    const loweredPitch = THREE.MathUtils.lerp(-0.042, 0.0, THREE.MathUtils.smoothstep(armSwing, 0.0, 0.25));
    armPitch.rotation.x = THREE.MathUtils.lerp(-0.118, loweredPitch, armDrop);
    cueLeverPivot.rotation.x = (1 - armDrop) * 0.55;

    // 10. Physical Rotary Knobs, Speed Buttons & LEDs
    const targetSurface = typeof state.surface === 'number' ? THREE.MathUtils.clamp(state.surface, 0, 1) : 0;
    if (drag?.hit !== 'surface') {
      surfaceVal = instant ? targetSurface : THREE.MathUtils.damp(surfaceVal, targetSurface, 12, dt);
      if (Math.abs(surfaceVal - targetSurface) < 0.002) surfaceVal = targetSurface; else animating = true;
    }
    // 270-degree potentiometer sweep (+135° to -135° around Y)
    surfaceDial.rotation.y = THREE.MathUtils.lerp(Math.PI * 0.75, -Math.PI * 0.75, surfaceVal);

    trackKnobCurr = instant ? trackKnobAngle : THREE.MathUtils.damp(trackKnobCurr, trackKnobAngle, 14, dt);
    if (Math.abs(trackKnobCurr - trackKnobAngle) < 0.002) trackKnobCurr = trackKnobAngle; else animating = true;
    trackDial.rotation.y = trackKnobCurr;

    if (speedPress33 > 0) {
      speedPress33 = instant ? 0 : Math.max(0, speedPress33 - dt * 6);
      if (speedPress33 > 0) animating = true;
    }
    if (speedPress45 > 0) {
      speedPress45 = instant ? 0 : Math.max(0, speedPress45 - dt * 6);
      if (speedPress45 > 0) animating = true;
    }
    btn33.position.y = 0.735 - speedPress33 * 0.012;
    btn45.position.y = 0.735 - speedPress45 * 0.012;

    const is45 = rpm > 38;
    mats.led33.emissiveIntensity = is45 ? 0.06 : 1.1;
    mats.led45.emissiveIntensity = is45 ? 1.1 : 0.06;
    mats.led33.color.copy(is45 ? mats.darkMetal.color : mats.accent.color);
    mats.led45.color.copy(is45 ? mats.accent.color : mats.darkMetal.color);

    const isActive = Boolean(state.playing);
    const isLit = isActive || motorOn || wantCue;
    playLed.scale.setScalar(isActive ? 1.18 : 1.0);
    mats.accentGlow.emissiveIntensity = isActive ? 1.38 : (isLit ? 0.85 : 0.30);
    strobeLight.intensity = isActive ? 1.40 : (motorOn ? 0.95 : 0.25);
    startStrip.scale.x = isLit ? 1.05 : 0.92;
    strobeLens.scale.setScalar(isLit ? 1.06 : 1.0);

    // 11. Emit 'settled', 'needle' exactly once when needle & record have physically settled
    const needleReady =
      wantCue &&
      !drag &&
      !settle &&
      placeProgress >= 0.998 &&
      armSwing >= 0.998 &&
      armDrop >= 0.998;
    if (needleReady && !needleSettledLatched) {
      needleSettledLatched = true;
      queueMicrotask(() => {
        if (!disposed && state.cued && state.placed && needleSettledLatched) {
          action('settled', 'needle');
        }
      });
    }
    if (!wantCue && armSwing === 0 && armDrop === 1 && !armSettledLatched) {
      armSettledLatched = true;
      queueMicrotask(() => {
        if (!disposed && !state.cued && armSettledLatched) action('settled', 'arm');
      });
    }
    if (!wantPlace && placeProgress === 0 && !settle && !drag && !recordHomeLatched) {
      recordHomeLatched = true;
      queueMicrotask(() => {
        if (!disposed && !state.placed && recordHomeLatched) action('settled', 'record');
      });
    }

    renderer.render(world, camera);

    if (animating) {
      schedule();
    } else {
      lastTime = 0;
    }
  }

  // =========================================================================
  // RESPONSIVE CAMERA FRAMING & LIFECYCLE OBSERVERS
  // =========================================================================
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    stageAspect = w / h;
    renderer.setSize(w, h, false);
    camera.aspect = stageAspect;

    // Portrait uses the same physical objects arranged in depth, keeping both large enough to use.
    const portrait = w < 720;
    deck.position.set(portrait ? 0 : DECK_X, 0, portrait ? 1.8 : DECK_Z);
    crate.position.set(portrait ? .65 : CRATE_X, 0, portrait ? -4.0 : CRATE_Z);
    platterWorldPos.set(deck.position.x + PLATTER_X, PLATTER_SURFACE_Y + .014, deck.position.z + PLATTER_Z);
    dragClampMin.z = portrait ? -5 : -2.1;
    dragClampMax.z = portrait ? 4 : 2.2;
    camDir.set(portrait ? 0 : .22, portrait ? 9.8 : 5.8, 8.85).normalize();

    computeSleeveTargets();

    const spread = getFanSpreadScale();
    const vFovRad = THREE.MathUtils.degToRad(camera.fov);
    const tanHalfV = Math.tan(vFovRad / 2);

    // Tightly bound full fanned catalogue + hi-fi deck with open dustcover across desktop (~1.8) & mobile (~0.85)
    const leftBound = -4.37 - spread * 1.55;
    const rightBound = 3.92;
    const centerX = (leftBound + rightBound) * 0.5;
    const pad = stageAspect < 1.0 ? 1.04 : 1.07;
    const halfW = portrait ? 3.0 : (rightBound - leftBound) * 0.5 * pad;
    const halfH = portrait ? 3.8 : 2.48 * pad;

    const distH = halfW / (tanHalfV * stageAspect) + 1.65;
    const distV = halfH / tanHalfV + 1.65;
    const dist = Math.max(distH, distV);

    const yBias = stageAspect < 1.0 ? 0.08 : 0.02;
    lookTarget.set(portrait ? -.25 : centerX, portrait ? 1.25 : 1.12 + yBias, portrait ? -1.0 : .12);
    camera.position.copy(lookTarget).addScaledVector(camDir, dist);
    camera.lookAt(lookTarget);
    camera.updateProjectionMatrix();
    schedule();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function completeHiddenMotion() {
    if (visible && !document.hidden || disposed) return;
    drag = null;settle = null;
    placeProgress = state.placed ? 1 : 0;
    armSwing = (state.cued || state.held) && state.placed ? 1 : 0;armDrop = state.held?0:1;seekingGroove=false;
    if (armSwing && state.cued && !needleSettledLatched) {
      needleSettledLatched = true;
      queueMicrotask(() => {if (!disposed && state.cued && state.placed && needleSettledLatched) action('settled', 'needle');});
    }
    if (!armSwing && !armSettledLatched) {
      armSettledLatched = true;
      queueMicrotask(() => {if (!disposed && !state.cued && armSettledLatched) action('settled', 'arm');});
    }
    if (!state.placed && !recordHomeLatched) {
      recordHomeLatched = true;
      queueMicrotask(() => {if (!disposed && !state.placed && recordHomeLatched) action('settled', 'record');});
    }
  }
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible) schedule();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      completeHiddenMotion();
    }
  });
  intersection.observe(host);

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      completeHiddenMotion();
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

  for(const [name,obj] of Object.entries({btn33,btn45,startBtn,vinylDisc,armTube,headshell,cartBody,stylusHousing,cantilever,wellRing}))obj.name=name;
  computeSleeveTargets();
  applyTheme();
  resize();

  return {
    setState(next) {
      if (!next) return;
      const nextAlbum = next.album || state.album;
      const changed = Boolean(nextAlbum?.id && state.album?.id !== nextAlbum.id);
      const nextBrowserOpen = next.browserOpen !== undefined ? Boolean(next.browserOpen) : (state.browserOpen !== false);
      const browserChanged = nextBrowserOpen !== (state.browserOpen !== false);

      // Support callers that omit albums[] or pass a record dynamically
      if (nextAlbum?.id && !sleeveEntries.some(e => e.album.id === nextAlbum.id)) {
        catalogue.push(nextAlbum);
        const entry = addSleeveEntry(nextAlbum, sleeveEntries.length);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        entry.edgeTone.color.set(isDark ? '#c6bca9' : '#e4dbc9');
      }

      const nextPlaced = Boolean(next.placed);
      const nextCued = Boolean(next.cued);
      const nextPlaying = Boolean(next.playing);
      const nextMotor = next.motor !== undefined ? Boolean(next.motor) : (nextPlaying || nextCued);
      const nextRpm = typeof next.rpm === 'number' && next.rpm > 0 ? next.rpm : state.rpm;
      const nextSurface = typeof next.surface === 'number' ? THREE.MathUtils.clamp(next.surface, 0, 1) : state.surface;

      if((next.trackIndex!==state.trackIndex || next.cueId!==state.cueId) && nextPlaced && nextCued && armSwing>.8){seekingGroove=true;needleSettledLatched=false;}
      if (!nextCued || !nextPlaced || changed) {
        seekingGroove=false;
        needleSettledLatched = false;
      }
      if (nextCued) armSettledLatched = false;
      if (nextPlaced) recordHomeLatched = false;
      if (nextPlaced && !state.placed) {
        lidOpen = true; // Geometry-safe auto-open when placing record
      }

      state = {
        album: nextAlbum,
        placed: nextPlaced,
        cued: nextCued,
        playing: nextPlaying,
        held: Boolean(next.held),
        cueId:next.cueId,
        browserOpen: nextBrowserOpen,
        motor: nextMotor,
        rpm: nextRpm,
        surface: nextSurface,
        trackIndex: next.trackIndex,
        progress: next.progress
      };

      if (changed) {
        drag = null;
        settle = null;
        swipeOffset = 0;
        host.classList.remove('is-dragging');
        platterAngle = 0;
        computeSleeveTargets();
        drawLabel();
      } else if (browserChanged) {
        computeSleeveTargets();
      }

      completeHiddenMotion();

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
      renderer.domElement.removeEventListener('wheel', onWheel);
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
