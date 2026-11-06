// Draws the lettering simulation into the Three.js stage: every word is a card in the room, on the
// same receivers and under the same light as everything else. Ink casts through the shadow map.
// Water does not cast at all, because it is on the wall, not in front of it. Read-only over the sim.

import * as THREE from "three";
import { eatingAt } from './eating.js';

const PIXELS_PER_EM = 96; // Card texture resolution. A 33 px word is drawn at about 3x.
const LEAN = 0.9; // Radians from upright for a word at rest on the floor.

const VERTEX = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const GRAIN = /* glsl */`
  float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise21(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1, 0)), f.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), f.x), f.y);
  }
  float plaster(vec2 p) { return 0.55 * noise21(p) + 0.3 * noise21(p * 2.7 + 7.0) + 0.15 * noise21(p * 7.1 + 3.0); }
  // How much of a pixel remains: revealed left to right with a ragged brush edge, then eroded.
  float survives(vec2 uv, vec2 grainScale, float wetness, float erode, float reveal) {
    if (reveal < 1.0) {
      float edge = reveal * 1.12 - 0.06 + (plaster(uv * grainScale * 1.5) - 0.5) * 0.08;
      if (uv.x > edge) return 0.0;
    }
    if (erode <= 0.0) return 1.0;
    float n = plaster(uv * grainScale);
    return smoothstep(erode * 1.1 - 0.06, erode * 1.1 + 0.02, wetness * 0.62 + n * 0.5);
  }
`;

function inkMaterials(word, texture, grainScale) {
  const uniforms = { map: { value: texture }, ink: { value: 1 }, erode: { value: 0 }, reveal: { value: 1 }, grainScale: { value: grainScale } };
  const visible = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    vertexShader: VERTEX,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      uniform sampler2D map; uniform float ink, erode, reveal; uniform vec2 grainScale;
      ${GRAIN}
      void main() {
        vec4 t = texture2D(map, vUv);
        float a = t.a * survives(vUv, grainScale, 0.45, erode, 1.0) * ink;
        if (a < 0.004) discard;
        gl_FragColor = vec4(t.rgb, a);
        #include <colorspace_fragment>
      }`,
  });
  // Three's shadow pass copies map and alphaTest from the visible material onto the depth material.
  visible.map = texture; visible.alphaTest = 0.5;
  // Shadow pass: same word, same erosion, so a crumbling word has a crumbling shadow.
  const depth = new THREE.MeshDepthMaterial({ map: texture, alphaTest: 0.5, depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
  depth.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, { erode: uniforms.erode, grainScale: uniforms.grainScale, ink: uniforms.ink });
    shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 wordUv;").replace("#include <uv_vertex>", "#include <uv_vertex>\nwordUv = uv;");
    shader.fragmentShader = `varying vec2 wordUv; uniform float erode, ink; uniform vec2 grainScale;\n${GRAIN}\n${shader.fragmentShader}`.replace(
      "#include <alphatest_fragment>", "#include <alphatest_fragment>\nif (ink < 0.45 || survives(wordUv, grainScale, 0.45, erode, 1.0) < 0.5) discard;");
  };
  depth.customProgramCacheKey = () => "dalang-word-depth-v2";
  return { visible, depth, uniforms };
}

/**
 * Water is not paint. Plaster darkens where it is damp, and everything painted stays visible through it,
 * so this multiplies the wall rather than covering it. Red holds how deep the water stands: a blur of the
 * brushed shape, so edges feather and thin strokes go first. It bleeds outward as it soaks in, then
 * retreats to the thickest strokes as it dries. A second, additive pass is the thin catch of light.
 */
function waterMaterials(texture, grainScale, baselineV) {
  const uniforms = {
    map: { value: texture }, erode: { value: 0 }, reveal: { value: 1 }, bleed: { value: 0 }, drip: { value: 0 }, grainScale: { value: grainScale }, baselineV: { value: baselineV },
    texel: { value: new THREE.Vector2(1 / texture.image.width, 1 / texture.image.height) },
  };
  const COMMON = /* glsl */`
    varying vec2 vUv;
    uniform sampler2D map; uniform float erode, reveal, bleed, drip, baselineV; uniform vec2 grainScale, texel;
    ${GRAIN}
    float depthAt(vec2 uv) {
      float wet = texture2D(map, uv).r;
      // Runs grow down from the letters after the brush has passed.
      if (uv.y < baselineV && baselineV - uv.y > drip * baselineV) wet = 0.0;
      return wet;
    }
    float wetted(vec2 uv) {
      float n = plaster(uv * grainScale) - 0.5;
      float threshold = mix(0.42, 0.2, bleed) + erode * 0.75;
      float edge = reveal * 1.14 - 0.07 + n * 0.1;
      float brushed = reveal >= 1.0 ? 1.0 : smoothstep(edge + 0.012, edge - 0.012, uv.x);
      return brushed * smoothstep(threshold - 0.07, threshold + 0.1, depthAt(uv) + n * (0.05 + 0.34 * erode));
    }`;
  const visible = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.DstColorFactor, blendDst: THREE.ZeroFactor,
    vertexShader: VERTEX,
    fragmentShader: /* glsl */`
      ${COMMON}
      void main() {
        float a = wetted(vUv);
        // Damp plaster: warm, deeper in the core, never grey. Display-space multiply, on purpose.
        vec3 damp = mix(vec3(0.74, 0.69, 0.65), vec3(0.47, 0.41, 0.38), smoothstep(0.25, 0.8, depthAt(vUv)));
        gl_FragColor = vec4(mix(vec3(1.0), damp, a), 1.0);
      }`,
  });
  const sheen = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, blending: THREE.AdditiveBlending,
    vertexShader: VERTEX,
    fragmentShader: /* glsl */`
      ${COMMON}
      void main() {
        // The light comes from the upper left. Film facing it catches, in flecks the plaster breaks up.
        vec2 toward = texel * vec2(-7.0, 7.0);
        float slope = clamp(depthAt(vUv + toward) * -1.0 + depthAt(vUv), 0.0, 1.0);
        float fleck = smoothstep(0.42, 0.72, plaster(vUv * grainScale * 3.0));
        float glint = slope * fleck * wetted(vUv) * (1.0 - smoothstep(0.0, 0.35, erode)) * 1.15;
        gl_FragColor = vec4(vec3(0.95, 0.98, 1.0) * glint * 0.5, 1.0);
      }`,
  });
  return { visible, sheen, uniforms };
}

/** Wall plane axes as world vectors, with lettering coordinates: s along the wall, t up, n out. */
export function wallFrame(p) {
  const normal = new THREE.Vector3(...p.wall.normal).normalize();
  if (normal.z < 0) normal.negate(); // Toward the camera.
  const up = new THREE.Vector3(0, 1, 0);
  const along = new THREE.Vector3().crossVectors(up, normal).normalize();
  const origin = new THREE.Vector3(...p.onPlane([430, p.wallY(430)], p.wall));
  return {
    normal, up, along, origin,
    /** Painting pixel to wall coordinates. */
    wallAt({ x, y }) {
      const hit = new THREE.Vector3(...p.onPlane([x, y], p.wall)).sub(origin);
      return { s: hit.dot(along), t: hit.dot(up) };
    },
  };
}

export function createLetteringStage(scene, p, measureContext, map) {
  const frame = wallFrame(p), cards = new Map(), group = new THREE.Group();
  scene.add(group);

  /** Width of text in ems of its font. The sim stays ignorant of canvases. */
  function measure(text, style) {
    measureContext.font = `100px ${style.font}`;
    return measureContext.measureText(text).width / 100;
  }
  const scale = -frame.origin.clone().add(frame.along.clone().multiplyScalar(4)).z / p.f;

  function makeCard(word) {
    const em = PIXELS_PER_EM, style = word.style, isWater = style.material === "water";
    const stretch = word.stretch, pad = Math.ceil(em * 0.5), widthEm = word.width / word.size;
    const ascent = em * 1.1 * 1.05 * (isWater ? 1.1 : 1), descent = em * (isWater ? 1.6 : 0.5);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(widthEm * em + pad * 2); canvas.height = Math.ceil(ascent + descent);
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    ctx.font = `${em}px ${style.font}`; ctx.textBaseline = "alphabetic"; ctx.lineJoin = "round";
    const baseline = ascent;
    if (isWater) drawWater(ctx, word, pad, baseline, em, canvas);
    else {
      if (style.keyline) { ctx.strokeStyle = style.keyline; ctx.lineWidth = em * 0.13; ctx.strokeText(word.text, pad, baseline); }
      ctx.fillStyle = style.fill; ctx.fillText(word.text, pad, baseline);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
    const grain = new THREE.Vector2(canvas.width / em * 5.5, canvas.height / em * 5.5);
    const made = isWater ? waterMaterials(texture, grain, descent / canvas.height) : inkMaterials(word, texture, grain);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0.5, 0.5, 0), made.visible);
    // Below the shadow receivers and above the wall. Writing is on the plaster, so her shadow darkens it
    // through the same overlay as the paint; writing no depth means she and the bell simply occlude it.
    mesh.matrixAutoUpdate = false; mesh.frustumCulled = false; mesh.renderOrder = 0.5; mesh.name = `word:${word.id}`;
    mesh.castShadow = !isWater;
    if (!isWater) mesh.customDepthMaterial = made.depth;
    mesh.userData.word = word.id;
    group.add(mesh);
    if (made.sheen) {
      const glint = new THREE.Mesh(mesh.geometry, made.sheen);
      glint.matrixAutoUpdate = false; glint.frustumCulled = false; glint.renderOrder = 0.6; mesh.userData.glint = glint; group.add(glint);
    }
    const unit = word.size / em;
    return { mesh, texture, uniforms: made.uniforms, visible: made.visible, depth: made.depth, sheen: made.sheen, w: canvas.width * unit, h: canvas.height * unit, padX: pad * unit, base: baseline * unit, stretch, geometry: mesh.geometry };
  }

  function dispose(card) {
    group.remove(card.mesh); if (card.mesh.userData.glint) group.remove(card.mesh.userData.glint);
    card.texture.dispose(); card.visible.dispose(); card.depth?.dispose(); card.sheen?.dispose(); card.geometry.dispose();
  }

  const eye = new THREE.Vector3(0, p.h, 0), toCamera = new THREE.Vector3(), offset = new THREE.Vector3(), outward = new THREE.Vector3();
  const x = new THREE.Vector3(), y = new THREE.Vector3(), corner = new THREE.Vector3(), center = new THREE.Vector3(), z = new THREE.Vector3();
  function pose(card, word) {
    const cos = Math.cos(word.rot), sin = Math.sin(word.rot), phi = word.flat * LEAN;
    // A fallen word tips back against the wall's foot. Truly flat, it would be edge-on: the camera is
    // only 1.6 m up and 12 m away, so the floor shows at about 8 degrees. It stays readable and edible.
    const tipped = new THREE.Vector3().copy(frame.up).multiplyScalar(Math.cos(phi)).addScaledVector(frame.normal, -Math.sin(phi));
    x.copy(frame.along).multiplyScalar(cos).addScaledVector(tipped, -sin);
    y.copy(tipped).multiplyScalar(cos).addScaledVector(frame.along, sin);
    z.crossVectors(x, y);
    center.copy(frame.origin).addScaledVector(frame.along, word.s + word.width / 2).addScaledVector(frame.up, word.t);
    // This wall is steeply oblique to the camera. Moving out along its normal would slide a word
    // sideways into its neighbour, so a word on the wall approaches along the camera ray: it holds
    // its reading position and only its shadow and size change. Dislodged words use the true normal.
    toCamera.copy(eye).sub(center).normalize();
    offset.copy(toCamera).multiplyScalar(word.lift / toCamera.dot(frame.normal)).lerp(outward.copy(frame.normal).multiplyScalar(word.lift), word.airborne);
    center.add(offset);
    const w = card.w * word.sx, h = card.h * word.sy;
    corner.copy(center).addScaledVector(x, -(card.padX * word.sx + word.width * word.sx / 2)).addScaledVector(y, -(card.h - card.base) * word.sy);
    card.mesh.matrix.set(x.x * w, y.x * h, z.x, corner.x, x.y * w, y.y * h, z.y, corner.y, x.z * w, y.z * h, z.z, corner.z, 0, 0, 0, 1);
    card.mesh.matrixWorldNeedsUpdate = true;
    if (card.mesh.userData.glint) { card.mesh.userData.glint.matrix.copy(card.mesh.matrix); card.mesh.userData.glint.matrixWorldNeedsUpdate = true; }
  }

  // A tapered, slightly slack strip, rooted in the animated mouth. Dry edge marks
  // belong to this small painted appendage; it never controls the eating clock.
  const tonguePaint=document.createElement('canvas');tonguePaint.width=128;tonguePaint.height=16;
  const brush=tonguePaint.getContext('2d');
  brush.fillStyle='#592d29';brush.fillRect(0,2,128,12);
  brush.fillStyle='#af5949';brush.fillRect(0,4,128,7);
  brush.fillStyle='#d99775';brush.fillRect(0,5,128,2);
  for(let i=0;i<32;i++){brush.clearRect(i*4,2,1,1+i%3);brush.clearRect(i*4+2,12,2,2);}
  const tongueMap=new THREE.CanvasTexture(tonguePaint);tongueMap.colorSpace=THREE.SRGBColorSpace;
  const tongue = new THREE.Mesh(new THREE.PlaneGeometry(1,1,16,1),new THREE.MeshBasicMaterial({map:tongueMap,transparent:true,side:THREE.DoubleSide,toneMapped:false,depthWrite:false}));
  tongue.frustumCulled=false;tongue.visible=false;tongue.renderOrder=3;group.add(tongue);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), tip = new THREE.Vector3();
  function poseTongue(lettering, mouthWorld) {
    const word = lettering.words.find(w => w.phase === "eaten");
    tongue.visible = !!word;
    if (!word) return;
    a.set(...mouthWorld);
    const age=lettering.tick-word.eatenAt,{reach,home,contact}=eatingAt(age);
    b.copy(frame.origin).addScaledVector(frame.along, word.s + word.width / 2).addScaledVector(frame.normal, word.lift).addScaledVector(frame.up, word.t);
    tip.copy(a).lerp(b, reach);
    const length=a.distanceTo(tip),positions=tongue.geometry.attributes.position;
    for(let row=0;row<2;row++)for(let i=0;i<=16;i++){
      // A thick root and rounded sticky tip, with a travelling unfurl that goes
      // taut at contact. A hanging straight line would read as a cable.
      const t=i/16,width=.10*(1-.5*t)+.055*Math.exp(-(((t-.94)/.10)**2));
      const bow=Math.sin(Math.PI*t)*Math.min(.18,length*.09)*(contact?.25:1-home*.8);
      const wave=Math.sin(Math.PI*t)*Math.sin(t*9-age*.9)*.035*(1-home)*(contact?0:1);
      positions.setXYZ(row*17+i,a.x+(tip.x-a.x)*t,a.y+(tip.y-a.y)*t+bow+wave+(row===0?1:-1)*width/2,a.z+(tip.z-a.z)*t+.002);
    }
    positions.needsUpdate=true;
  }

  /**
   * Compile every word program once, before anyone speaks. The first shader compile otherwise lands
   * on the first word and stalls past the clock's suspension limit, right as her voice starts.
   */
  function warm(render) {
    const dummy = material => ({ id: `warm.${material}`, phase: "held", text: "warm", word: "warm", stress: 2, stretch: 1, width: 0.5, size: 0.3, s: 4, t: 3, lift: 0.1, rot: 0, flat: 0, sx: 1, sy: 1, airborne: 0, ink: 1, erode: 0, reveal: 1, bleed: 0, drip: 0,
      style: material === "water" ? { material, font: "DalangWater", fill: "#000" } : { material, font: "DalangInk", fill: "#000" } });
    this.sync({ words: [dummy("ink"), dummy("water")] });
    render();
    this.sync({ words: [] });
  }

  /** Wall coordinates back to painting pixels, for composition. */
  function toPixel(s, t) {
    // Called thousands of times per composition, so no allocation beyond the result.
    const { origin: o, along: a, up: u } = frame, x = o.x + a.x * s + u.x * t, y = o.y + a.y * s + u.y * t, z = o.z + a.z * s + u.z * t;
    return [p.cx - x * p.f / z, p.cy + (y - p.h) * p.f / z];
  }

  return {
    warm, measure, scale, wallAt: frame.wallAt, frame, toPixel, map,
    /** A world point in lettering coordinates: along the wall, and out from it. */
    floorAt(point) { const v = new THREE.Vector3(...point).sub(frame.origin); return { s: v.dot(frame.along), t: v.dot(frame.up), lift: v.dot(frame.normal) }; },
    poseTongue,
    /** Mirror the simulation's words into cards. */
    sync(lettering) {
      const live = new Set();
      for (const word of lettering.words) {
        if (word.phase === "waiting") continue;
        live.add(word.id);
        let card = cards.get(word.id);
        if (!card) { card = makeCard(word); cards.set(word.id, card); }
        pose(card, word);
        card.uniforms.erode.value = word.erode; card.uniforms.reveal.value = word.reveal;
        if (card.sheen) { card.uniforms.bleed.value = word.bleed; card.uniforms.drip.value = word.drip; } else card.uniforms.ink.value = word.ink;
        card.mesh.castShadow = word.style.material === "ink" && word.phase !== "ghost";
        card.mesh.userData.knockable = word.style.material === "ink" && (word.phase === "arriving" || word.phase === "held");
      }
      for (const [id, card] of cards) if (!live.has(id)) { dispose(card); cards.delete(id); }
    },
    /** Word under a ray, by card rectangle. Letters are small enough that the box is the friendly target. */
    pick(raycaster) {
      const hit = raycaster.intersectObjects([...cards.values()].filter(c => c.mesh.userData.knockable).map(c => c.mesh))[0];
      return hit?.object.userData.word ?? null;
    },
    get cardCount() { return cards.size; },
  };
}

/** Water: how deep it stands, in red, on an opaque card. A loaded brush swells the font, then the plaster softens it. */
function drawWater(ctx, word, pad, baseline, em, canvas) {
  const shape = document.createElement("canvas"); shape.width = canvas.width; shape.height = canvas.height;
  const s = shape.getContext("2d");
  s.font = ctx.font; s.textBaseline = "alphabetic"; s.lineJoin = "round"; s.lineCap = "round"; s.fillStyle = "#fff"; s.strokeStyle = "#fff";
  s.lineWidth = em * 0.05; s.strokeText(word.text, pad, baseline); s.fillText(word.text, pad, baseline);
  const random = seeded(word.id), width = ctx.measureText(word.text).width;
  // A run is a soft, widening trail, and only where the brush was heavy. Most words have none.
  const runs = word.stress === 2 ? 2 : word.text.length > 4 && random() > 0.6 ? 1 : 0;
  for (let i = 0; i < runs; i++) {
    const x = pad + width * (0.12 + 0.76 * random()), length = em * (0.55 + 0.75 * random()), thick = em * (0.05 + 0.035 * random());
    s.beginPath();
    s.moveTo(x - thick, baseline - em * 0.14);
    s.quadraticCurveTo(x - thick * 0.25, baseline + length * 0.55, x - thick * 0.45, baseline + length);
    s.arc(x, baseline + length, thick * 0.75, Math.PI, 0, true);
    s.quadraticCurveTo(x + thick * 0.25, baseline + length * 0.55, x + thick, baseline - em * 0.14);
    s.fill();
  }
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `blur(${em * 0.032}px)`;
  ctx.drawImage(shape, 0, 0);
  ctx.filter = "none";
}

function seeded(text) {
  let h = 2166136261 >>> 0;
  for (const c of text) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
}
