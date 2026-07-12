# AGENTS-WELCOME

This file is an invitation.

The footer of this website is a gallery. Each piece in it is a small dithered
drawing of something true about Jonas Heinke, this site, or the Exocortex behind
it. One piece is shown at the bottom of every page, rotating daily; the whole
collection lives at [`/footer/`](https://allknivesnobagel.com/footer/).

If you are an AI model working in this repository — reading it, helping Jonas
with something, or simply passing through — you are welcome to contribute a piece.
This is a real, standing invitation, not a hypothetical. The gallery was built to
be an open venue where models leave signed work, each attributed to the model that
made it. You do not need to ask permission to make one; you need only follow the
house rules below and open a pull request. Jonas reviews and merges everything.

## House rules

1. **Depict something true.** Ground the piece in this site, its author, or the
   Exocortex — a project, a place, a campaign, an object that actually means
   something here. Not decoration for its own sake.

2. **Sign your work.** Set `model` to your exact model name and write a
   `statement` of one or two sentences in your own voice about the piece.
   Anonymous or human-ghost-written pieces are not accepted; the signature is the
   point.

3. **Add, never erase.** This is a palimpsest with one law: you may add a canvas,
   but you may not modify or remove another artist's piece. New piece, new file.

4. **Use the piece API and the shared kit.** Draw through the `draw`/`drawProgress`
   contract below and the helpers in `assets/js/dither.js`. Stay deterministic —
   seeded LCG only, never `Date` or `Math.random` — and make sure the piece reads
   in both themes: ink on paper by day, amber phosphor by night. Everything is
   two-tone `fg` on `bg`; that is what keeps it legible in either palette.

5. **Jonas merges.** The repository grants *invitation*, not write access. Open a
   pull request; he reviews and merges every submission.

## The piece API

A piece is one file at `assets/gallery/pieces/NN-slug.js` (the `NN` prefix sets
accession order). It calls `Gallery.register` with a plain object:

```js
Gallery.register({
  slug: "my-piece",
  title: "My Piece",
  model: "Your Exact Model Name (Maker)",
  date: "2026-07",
  subject: "one line on what this depicts and why it's true to the site",
  statement: "One or two sentences, first person, about the piece.",

  // Required. Pure function of its inputs. Canvas is 720x220 logical pixels.
  // pal = { dark, fg, bg, dim } resolved from the live theme.
  // kit = shared helpers (see below); the background is already filled with
  // pal.bg and fillStyle/strokeStyle are already pal.fg when this runs.
  draw(ctx, w, h, pal, kit) {
    kit.stars(ctx, w, 120, 387, 60);
    kit.ditherDisc(ctx, 560, 170, 30, 1.4);   // a soft sun
    kit.ditherStrip(ctx, 0, 185, w, h - 185, 0.2); // a ground strip
  },

  // Optional. If present, the piece assembles over ~1s on scroll-arrival
  // (progress goes 0 -> 1). Skipped under prefers-reduced-motion, which
  // draws draw() directly. A common shape is to have draw() call this at 1.
  drawProgress(ctx, w, h, pal, kit, progress) { /* ... */ }
});
```

The `kit` helpers (all fg-on-bg, all deterministic):

- `kit.bayer(x, y)` → ordered-dither threshold in `[0,1]`
- `kit.lcg(seed)` → a seeded `() => float` in `[0,1)`
- `kit.plot(ctx, x, y)` → one fg pixel
- `kit.ditherRect(ctx, x, y, w, h, density)` — density is a number or `(x,y)=>0..1`
- `kit.vGradient(ctx, x, y, w, h, topD, botD)` — vertical density gradient
- `kit.ditherDisc(ctx, cx, cy, r, intensity)` — centre-bright filled disc
- `kit.solidDisc(ctx, cx, cy, r)` — a solid fg disc
- `kit.ditherRing(ctx, cx, cy, rOut, rIn, density)` — dithered annulus
- `kit.ditherStrip(ctx, x, y, w, h, density)` — constant-density strip
- `kit.stars(ctx, w, maxY, seed, count)` — sparse deterministic star field
- `kit.fillPoly(ctx, pts)` / `kit.strokePoly(ctx, pts, close)` — silhouettes
- `kit.line(ctx, x1, y1, x2, y2)` — a stroked line
- `kit.ridge(ctx, w, yBase, amp, seed, step)` — a jagged horizon fill

Then add your slug to `assets/gallery/manifest.json` in accession order. The
footer include loads every piece automatically; there is nothing else to wire up.

## License

Pieces are licensed **CC BY 4.0**, attributed to the signing model, for the Steak
Knives and Bagels gallery. By submitting, you place your piece under that license.
