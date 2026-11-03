// Composition: where a sentence goes on the wall. Writing gets places, not coordinates. Given a map of
// free plaster and where she is standing right now, a page searches near a focus for the block that
// fits, flowing its words around whatever is in the way: a line steps past a cord, wraps around her.
// Pure and deterministic. It knows nothing of canvases or light, only rectangles on a wall.

/** Baked free-wall rows (`bake/wall_map.py`), read in painting pixels. */
export class WallMap {
  constructor({ cell, rows }) { this.cell = cell; this.rows = rows; this.limit = null; }
  /** `:` cells are free but cross something thin, like the cord. */
  isFree(x, y, thin = false) {
    // A narrow screen only shows part of the wall, and writing nobody can see is not writing.
    if (this.limit && (x < this.limit[0] || x > this.limit[1])) return false;
    const c = this.rows[Math.floor(y / this.cell)]?.[Math.floor(x / this.cell)];
    return c === "." || (thin && c === ":");
  }
}

/** Where she is on screen, as painting pixels: head and hair, then the body. Occupied by her, however she is posed. */
export function figureOccupancy([x, y]) {
  return [
    { x, y: y - 345, rx: 110, ry: 150 }, // Head and crown.
    { x: x - 60, y: y - 200, rx: 60, ry: 170 }, // Fall of hair.
    { x, y: y - 120, rx: 100, ry: 130 }, // Body and arms.
  ];
}
const inside = (ellipses, x, y) => ellipses.some(e => ((x - e.x) / e.rx) ** 2 + ((y - e.y) / e.ry) ** 2 < 1);

/**
 * Is this rectangle on the wall free? Sampled, since words are small and perspective is mild.
 * @param {object} wall needs `toPixel(s,t)` and `map`
 */
export function rectFree(wall, s0, t0, s1, t1, occupancy = [], thin = false) {
  const across = Math.ceil((s1 - s0) / (wall.scale * 16)), up = Math.ceil((t1 - t0) / (wall.scale * 16));
  for (let i = 0; i <= across; i++) for (let j = 0; j <= up; j++) {
    const [x, y] = wall.toPixel(s0 + (s1 - s0) * i / across, t0 + (t1 - t0) * j / up);
    if (!wall.map.isFree(x, y, thin) || inside(occupancy, x, y)) return false;
  }
  return true;
}

/** Flow one page from a top-left corner. Returns placements and a cost, or null when it does not fit. */
function flow(page, wall, origin, limit, base, occupancy, taken) {
  const { size, lineHeight, gap, lines: maxLines } = base, step = size * 0.2;
  const placed = [];
  let x = 0, line = 0, drop = 0, skips = 0, crossings = 0, previous = page[0]?.phrase;
  for (let i = 0; i < page.length; i++) {
    const word = page[i], height = size * (word.style.scale ?? 1), width = word.widthEm * height;
    const headroom = height * 0.9 * (word.style.stretch ?? 1);
    // A voice's pause is a good place to break, if the phrase will not fit on this line.
    if (x > 0 && word.phrase !== previous) {
      const rest = page.slice(i).filter(w => w.phrase === word.phrase).reduce((sum, w) => sum + w.widthEm * size + gap, 0);
      if (x + rest > limit) { x = 0; line++; }
    }
    let start = x;
    for (;;) {
      if (line >= maxLines) return null;
      if (x + width > limit) {
        if (x === 0 && width > limit) return null;
        x = 0; line++;
        continue;
      }
      const baseline = origin.t - lineHeight * line - drop - height;
      const s0 = origin.s + x, s1 = s0 + width, t0 = baseline - height * 0.28, t1 = baseline + headroom;
      if (!taken.some(r => s0 < r.s1 && s1 > r.s0 && t0 < r.t1 && t1 > r.t0) && rectFree(wall, s0, t0, s1, t1, occupancy, true)) {
        placed.push({ word, s: origin.s + x, t: baseline, width, size: height, line });
        // The cord over a word is fine; she stands in front of things. It still costs a little.
        if (!rectFree(wall, origin.s + x, baseline - height * 0.28, origin.s + x + width, baseline + headroom, occupancy, false)) crossings++;
        break;
      }
      x += step; skips++;
      // A word may step past something a little. A big gap mid-line would read as two columns: wrap instead.
      if (x > limit || (x > 0 && skips > 0 && x - start > height * 0.9 && start > 0)) { x = 0; line++; start = 0; }
    }
    if (word.style.stretch && x === 0) drop += size * (word.style.stretch - 1);
    x += width + gap; previous = word.phrase;
  }
  return { placed, skips, crossings, lines: line + 1 };
}

/**
 * Find the best place for a page.
 * @param {object[]} page words with widthEm, phrase and style
 * @param {object} wall {map, toPixel, wallAt, scale}
 * @param {{x:number,y:number}} focus painting pixel the block wants to be near
 * @param {object} base {size(metres), leading, width(px), lines}
 * @param {object[]} occupancy her ellipses
 * @param {{s0:number,s1:number,t0:number,t1:number}[]} taken wall rectangles other writing still holds
 */
export function composePage(page, wall, focus, base, occupancy = [], taken = []) {
  const metrics = { size: base.size, lineHeight: base.size * base.leading, gap: base.size * 0.34, lines: base.lines };
  return search(page, wall, focus, base, metrics, occupancy, taken);
}

function search(page, wall, focus, base, metrics, occupancy, taken) {
  // Natural width first. Other measures are only worth searching if nothing at this one fits.
  return searchAt([1], page, wall, focus, base, metrics, occupancy, taken) ?? searchAt([0.7, 1.35], page, wall, focus, base, metrics, occupancy, taken);
}

function searchAt(widths, page, wall, focus, base, metrics, occupancy, taken) {
  let best = null;
  for (let dy = -216; dy <= 216; dy += 24) for (let dx = -270; dx <= 270; dx += 30) {
    const px = { x: focus.x + dx, y: focus.y + dy };
    if (!wall.map.isFree(px.x, px.y, true)) continue;
    const origin = wall.wallAt(px);
    for (const stretch of widths) {
      const limit = base.width * stretch * wall.scale;
      const result = flow(page, wall, origin, limit, metrics, occupancy, taken);
      if (!result) continue;
      const last = result.placed.at(-1), first = result.placed[0];
      const [cx, cy] = wall.toPixel((first.s + last.s + last.width) / 2, (first.t + last.t) / 2);
      const orphan = result.lines > 1 && result.placed.filter(p => p.line === result.lines - 1).length === 1 && page.length > 3 ? 0.3 : 0;
      const cost = Math.hypot(cx - focus.x, (cy - focus.y) * 1.2) / 100 + result.lines * 0.12 + result.skips * 0.035 + result.crossings * 0.35 + orphan;
      if (!best || cost < best.cost) best = { ...result, cost };
    }
  }
  return best;
}
