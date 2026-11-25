// 3D record cradle and sleeves sharing the deck's camera, depth buffer and metre scale.
import * as G from './physics/gl-util.js';

const Rx = a => {
  const m = G.ident(), c = Math.cos(a), s = Math.sin(a);
  m[5] = c; m[6] = s; m[9] = -s; m[10] = c;
  return m;
};

const VS = `#version 300 es
in vec3 aP; in vec3 aN;
uniform mat4 uVP, uM;
out vec2 uv; out vec3 normal;
void main() {
  uv = vec2(aP.x / .315 + .5, aP.z / .315);
  normal = mat3(uM) * aN;
  gl_Position = uVP * uM * vec4(aP, 1.);
}`;

const FS = `#version 300 es
precision highp float;
in vec2 uv; in vec3 normal;
uniform sampler2D uCover, uBack;
uniform float uSelected, uHovered, uDim;
uniform vec3 uAccent, uStand, uHoverRim;
uniform int uMode;
out vec4 color;
void main() {
  vec3 N = normalize(normal);
  float key = max(dot(N, normalize(vec3(-.25, -.78, .58))), 0.0);
  float fill = max(dot(N, normalize(vec3(.35, .55, .75))), 0.0);
  float light = .58 + .38 * key + .14 * fill;
  if (uMode == 1) {
    // Cardboard spine & edges
    color = vec4(vec3(.16, .145, .13) * light * uDim, 1.);
    return;
  }
  if (uMode == 2) {
    // Architectural matte record cradle
    float top = smoothstep(.2, .95, N.z);
    vec3 base = uStand * (.72 + .35 * key + .14 * top);
    color = vec4(base, 1.);
    return;
  }
  vec3 c = uMode == 3
    ? texture(uBack, vec2(1. - uv.x, uv.y)).rgb
    : texture(uCover, uv).rgb;
  // Subtle depth separation for recessed sleeves; hovered & selected sleeves pop to full light.
  float lit = mix(.78, 1.0, max(uDim, max(uSelected, uHovered)));
  c *= light * lit;
  float edge = min(min(uv.x, 1. - uv.x), min(uv.y, 1. - uv.y));
  // Selected sleeve: crisp accent hairline; Hovered (unselected): subtle bright top/edge sheen.
  float selRing = (1.0 - smoothstep(.0045, .007, edge)) * uSelected;
  float hovRing = (1.0 - smoothstep(.0035, .006, edge)) * uHovered * (1.0 - uSelected);
  c = mix(c, uAccent, selRing * .92);
  c = mix(c, uHoverRim, hovRing * .58);
  c += vec3(.045) * uHovered * (1.0 - uSelected) * smoothstep(.55, 1.0, uv.y);
  color = vec4(c, 1.);
}`;

const SLEEVE_HALF = 0.1575;
const CRATE_X = -0.60;
const BASE_Z = -0.072;

export class AlbumFan {
  constructor(renderer, albums, invalidate) {
    this.renderer = renderer;
    this.gl = renderer.gl;
    this.albums = albums;
    this.invalidate = invalidate;
    this.amount = 0;
    this.cards = [];
    this.hover = null;
    this.frozen = false;
    this.hoverAmt = new Float32Array(albums.length);
    this.selectAmt = new Float32Array(albums.length);
    this.selectAmt[0] = 1;

    const gl = this.gl;
    this.program = G.program(gl, VS, FS);
    this.face = G.mesh(gl, new Float32Array([
      -SLEEVE_HALF, -.0016, 0, 0, -1, 0,
       SLEEVE_HALF, -.0016, 0, 0, -1, 0,
       SLEEVE_HALF, -.0016, .315, 0, -1, 0,
      -SLEEVE_HALF, -.0016, 0, 0, -1, 0,
       SLEEVE_HALF, -.0016, .315, 0, -1, 0,
      -SLEEVE_HALF, -.0016, .315, 0, -1, 0
    ]));
    const backVerts = [
      [-SLEEVE_HALF, .0016, 0], [-SLEEVE_HALF, .0016, .315], [SLEEVE_HALF, .0016, .315],
      [-SLEEVE_HALF, .0016, 0], [SLEEVE_HALF, .0016, .315], [SLEEVE_HALF, .0016, 0]
    ];
    const back = [];
    for (const v of backVerts) back.push(...v, 0, 1, 0);
    this.backFace = G.mesh(gl, new Float32Array(back));
    this.edge = G.mesh(gl, G.box(-SLEEVE_HALF, -.0015, 0, SLEEVE_HALF, .0015, .315));

    // Minimalist open-front architectural record plinth resting solidly on FLOOR_Z (-0.080).
    this.tray = G.mesh(gl, G.merge(
      // Sleek matte base slab
      G.box(-0.95, -0.068, -0.080, -0.24, 0.242, BASE_Z),
      // Delicate front stop rail (leaves front cover art unobstructed)
      G.box(-0.95, -0.068, BASE_Z, -0.24, -0.060, BASE_Z + 0.005),
      // Clean backstop rail
      G.box(-0.95, 0.233, BASE_Z, -0.24, 0.242, BASE_Z + 0.036)
    ));

    this.textures = albums.map(a => {
      const t = this._createTexture(null);
      const img = new Image();
      img.onload = () => {
        this._uploadTexture(t, img);
        invalidate();
      };
      img.src = a.cover;
      return t;
    });

    this.backs = albums.map((a, idx) => this._createTexture(this._renderBack(a, idx)));
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!this.backs) return;
        albums.forEach((a, idx) => this._uploadTexture(this.backs[idx], this._renderBack(a, idx)));
        invalidate();
      }).catch(() => {});
    }
  }

  _createTexture(image) {
    const gl = this.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    if (image) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([42, 37, 32, 255]));
    }
    for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
    return t;
  }

  _uploadTexture(t, image) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  _renderBack(album, idx) {
    const c = document.createElement('canvas');
    c.width = c.height = 768;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#efe8d9';
    ctx.fillRect(0, 0, 768, 768);
    ctx.strokeStyle = '#c5b89e';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 712, 712);

    ctx.fillStyle = '#675d4c';
    ctx.font = '500 18px "JetBrains Mono", Consolas, monospace';
    ctx.fillText(`NO. ${String(idx + 1).padStart(2, '0')} / ${String(this.albums.length).padStart(2, '0')}  ·  ${album.year}`, 54, 78);

    ctx.fillStyle = '#221c14';
    ctx.font = '400 36px "Newsreader", Georgia, serif';
    ctx.fillText(album.title, 54, 128, 660);
    ctx.fillStyle = '#675d4c';
    ctx.font = 'italic 24px "Newsreader", Georgia, serif';
    ctx.fillText(album.artist, 54, 162, 660);

    ctx.strokeStyle = '#d4c8b0';
    ctx.beginPath(); ctx.moveTo(54, 186); ctx.lineTo(714, 186); ctx.stroke();

    const maxRows = 16;
    album.tracks.slice(0, maxRows).forEach((t, i) => {
      const y = 226 + i * 30;
      ctx.fillStyle = '#8b8272';
      ctx.font = '500 17px "JetBrains Mono", Consolas, monospace';
      ctx.fillText(String(i + 1).padStart(2, '0'), 54, y);
      ctx.fillStyle = '#221c14';
      ctx.font = '400 22px "Newsreader", Georgia, serif';
      ctx.fillText(t.title, 96, y, 618);
    });

    ctx.strokeStyle = '#d4c8b0';
    ctx.beginPath(); ctx.moveTo(54, 692); ctx.lineTo(714, 692); ctx.stroke();
    ctx.fillStyle = '#675d4c';
    ctx.font = '500 16px "JetBrains Mono", Consolas, monospace';
    ctx.fillText(
      album.audioTracks?.length ? 'OFFICIAL MASTER · PHYSICAL PRESSING READY' : 'LISTENING COLLECTION',
      54, 722
    );
    return c;
  }

  sleevePose(i) {
    const delta = i - this.amount;
    const ad = Math.abs(delta);
    const s = 3.55 * Math.tanh(delta / 3.3);
    const sel = this.selectAmt[i] || 0;
    const hov = this.hoverAmt[i] || 0;
    const peek = hov * (1 - sel);

    // Selected cover sits unobstructed in front; neighbors fan symmetrically to left & right
    // with generous cover-edge visibility and smooth depth separation so opposite sides never z-fight.
    const x = CRATE_X + s * 0.054;
    const y = -0.026 + 0.052 * (1 - Math.exp(-ad * 2.1)) + ad * 0.0175 - 0.0035 * Math.tanh(delta * 2.5) - peek * 0.015;
    const roll = s * 0.074 * (1 - 0.35 * peek);
    const lean = -0.135 - 0.065 * (1 - Math.exp(-ad * 1.6)) + peek * 0.06;
    const cornerLift = SLEEVE_HALF * Math.abs(Math.sin(roll));
    const z = BASE_Z + cornerLift + sel * 0.010 + peek * 0.044 + (sel * hov) * 0.007;

    return { x, y, z, roll, lean, ad, sel, hov };
  }

  sleeveMatrix(i) {
    const p = this.sleevePose(i);
    return G.chain(G.T(p.x, p.y, p.z), G.Ry(p.roll), Rx(p.lean));
  }

  recordHome(i) {
    const p = this.sleevePose(i);
    const m = this.sleeveMatrix(i);
    // Exact mid-plane center of the 315mm sleeve and its upward extraction axis.
    const pose = [
      m[12] + m[8] * SLEEVE_HALF,
      m[13] + m[9] * SLEEVE_HALF,
      m[14] + m[10] * SLEEVE_HALF,
      Math.PI / 2 + p.lean,
      p.roll
    ];
    const axis = [m[8], m[9], m[10]];
    return { pose, axis };
  }

  isAnimating(selected) {
    if (this.frozen) return false;
    if (!this.frozen && Math.abs(this.amount - selected) > 0.0008) return true;
    for (let i = 0; i < this.albums.length; i++) {
      const targetSel = i === selected ? 1 : 0;
      const targetHov = i === this.hover ? 1 : 0;
      if (Math.abs(this.selectAmt[i] - targetSel) > 0.002) return true;
      if (Math.abs(this.hoverAmt[i] - targetHov) > 0.002) return true;
    }
    return false;
  }

  draw(selected, dt, reduced = false, light = false) {
    if (!this.frozen) {
      if (reduced) {
        this.amount = selected;
      } else {
        this.amount += (selected - this.amount) * (1 - Math.exp(-dt * 11));
        if (Math.abs(this.amount - selected) < 0.0005) this.amount = selected;
      }
    }
    const kSel = reduced ? 1 : (1 - Math.exp(-dt * 12));
    const kHov = reduced ? 1 : (1 - Math.exp(-dt * 16));
    for (let i = 0; i < this.albums.length; i++) {
      const tSel = i === selected ? 1 : 0;
      const tHov = i === this.hover ? 1 : 0;
      if (!this.frozen) {
        this.selectAmt[i] += (tSel - this.selectAmt[i]) * kSel;
        if (Math.abs(this.selectAmt[i] - tSel) < 0.001) this.selectAmt[i] = tSel;
      }
      if (!this.frozen) {
        this.hoverAmt[i] += (tHov - this.hoverAmt[i]) * kHov;
        if (Math.abs(this.hoverAmt[i] - tHov) < 0.001) this.hoverAmt[i] = tHov;
      }
    }

    const gl = this.gl, { p, u } = this.program;
    gl.useProgram(p);
    gl.uniformMatrix4fv(u.uVP, false, this.renderer.cam.vp);
    gl.uniform1i(u.uCover, 0);
    gl.uniform1i(u.uBack, 1);
    // Print oxblood in light mode, CRT terminal amber in dark mode.
    gl.uniform3fv(u.uAccent, light ? [0.631, 0.239, 0.129] : [1.0, 0.690, 0.0]);
    gl.uniform3fv(u.uStand, light ? [0.34, 0.29, 0.23] : [0.095, 0.085, 0.074]);
    gl.uniform3fv(u.uHoverRim, light ? [0.22, 0.18, 0.14] : [0.92, 0.88, 0.80]);
    this.cards = [];

    const drawMesh = (mesh, M, mode) => {
      gl.uniformMatrix4fv(u.uM, false, M);
      gl.uniform1i(u.uMode, mode);
      gl.bindVertexArray(mesh.vao);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    };

    // Solid architectural cradle first so depth buffer grounds the sleeves.
    gl.uniform1f(u.uSelected, 0);
    gl.uniform1f(u.uHovered, 0);
    gl.uniform1f(u.uDim, 1);
    drawMesh(this.tray, G.ident(), 2);

    // Draw sleeves from farthest to closest relative to active focus.
    const order = Array.from({ length: this.albums.length }, (_, i) => i)
      .sort((a, b) => Math.abs(b - this.amount) - Math.abs(a - this.amount));

    for (const i of order) {
      const pose = this.sleevePose(i);
      const M = this.sleeveMatrix(i);
      const dim = Math.max(0.15, Math.exp(-pose.ad * 0.28));
      gl.uniform1f(u.uSelected, pose.sel);
      gl.uniform1f(u.uHovered, pose.hov);
      gl.uniform1f(u.uDim, dim);
      drawMesh(this.edge, M, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.backs[i]);
      drawMesh(this.face, M, 0);
      drawMesh(this.backFace, M, 3);

      const vp = G.mul(this.renderer.cam.vp, M);
      const pts = [
        [-SLEEVE_HALF, -.0016, 0],
        [ SLEEVE_HALF, -.0016, 0],
        [ SLEEVE_HALF, -.0016, .315],
        [-SLEEVE_HALF, -.0016, .315]
      ].map(v => {
        const q = [0, 1, 2, 3].map(r => vp[r] * v[0] + vp[4 + r] * v[1] + vp[8 + r] * v[2] + vp[12 + r]);
        return [(q[0] / q[3] + 1) / 2, (1 - q[1] / q[3]) / 2, q[3]];
      });
      this.cards.push({ i, pts });
    }
  }

  pick(x, y, occluderDepth = Infinity) {
    const b = this.renderer.canvas.getBoundingClientRect();
    const p = [(x - b.left) / b.width, (y - b.top) / b.height];
    let hit = null, depth = occluderDepth;
    for (const card of this.cards) {
      if (card.pts.some(v => v[2] <= 0)) continue;
      let inside = false;
      for (let i = 0, j = 3; i < 4; j = i++) {
        const a = card.pts[i], bb = card.pts[j];
        if ((a[1] > p[1]) !== (bb[1] > p[1]) && p[0] < (bb[0] - a[0]) * (p[1] - a[1]) / (bb[1] - a[1]) + a[0]) {
          inside = !inside;
        }
      }
      if (!inside) continue;
      for (const ids of [[0, 1, 2], [0, 2, 3]]) {
        const [a, bb, c] = ids.map(idx => card.pts[idx]);
        const den = (bb[1] - c[1]) * (a[0] - c[0]) + (c[0] - bb[0]) * (a[1] - c[1]);
        if (Math.abs(den) < 1e-10) continue;
        const l = ((bb[1] - c[1]) * (p[0] - c[0]) + (c[0] - bb[0]) * (p[1] - c[1])) / den;
        const m = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / den;
        const n = 1 - l - m;
        if (Math.min(l, m, n) < -1e-7) continue;
        const z = 1 / (l / a[2] + m / bb[2] + n / c[2]);
        if (z < depth) { hit = card.i; depth = z; }
      }
    }
    return hit;
  }

  dispose() {
    for (const t of [...this.textures, ...this.backs]) this.gl.deleteTexture(t);
    this.backs = null;
    this.gl.deleteProgram(this.program.p);
  }
}
