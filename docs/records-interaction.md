# Records: interaction & UI reduction (v10)

Design and implementation pass reducing flat DOM chrome to print/CRT essentials while upgrading 3D sleeve browsing, hover feedback, record handling motion, and responsive framing.

## Non-3D UI reduction

- **One quiet control surface.** Replaced the top-right status card, permanent five-row bottom dashboard, floating tutorial banner, and orphaned below-stage precut box with a single slim bottom dock (`#record-stage` stays unobstructed).
- **Context-aware actions, no disabled button walls.** The dock shows only what applies to the active state: crate stepper (`← 1/10 →`) while browsing, a single contextual primary button (`Take out record` → `Place on platter` → `Put it on` → `Pause` / `Resume`, or `Listen` / `Play|Pause [Provider]`), inline volume only when active and supported by the source, track picker only when a pressing has multiple tracks, and progressive-disclosure drawers (`Sleeve`, `Press`, `Tune`).
- **One right-side drawer at a time.** `Sleeve`, `Press` (all physical disc sources: prepared lossless Polygondwanaland tracks, quick demo, local device files, synthetic test record), and `Tune` (keyboard/precision mirror of 3D deck controls, cartridge/groove adjustments, and table knock) share one right-hand editorial drawer on desktop (`392px`, high-opacity theme surface) and expand in normal vertical flow below the dock on narrow screens (`<= 900px`) so nothing overlaps the 3D stage or clips service embeds.
- **Needle telemetry.** Replaced the legacy scope box/hidden canvas with a single-line monospace readout tucked under the camera bar in `Needle` view.
- **Honest loading and limits.** Prepared tracks and MP3 cuts disclose exact download sizes (MiB) and decoded memory budgets, display a hairline top progress bar + percentage + `Cancel` button while loading, and present a direct native full-recording fallback when a track exceeds the phone decoded memory cap (`96 MiB`).

## 3D vinyl selection, motion & camera

- **Spread-and-present crate (`fan.js`).** Replaced the fixed-depth stack (where selecting sleeves 3–9 buried them behind earlier jackets) with a symmetric spread centered on the selected sleeve. The selected cover always sits proud and unobstructed in front (`+10 mm` lift, `-26 mm` forward, `-8°` ergonomic back-lean) framed by a hairline theme accent (`#ffb000` CRT amber in dark mode, `#a13d21` print oxblood in light mode). Opposite-side neighbors carry a smooth depth bias so they never z-fight and maintain `> 60 mm` clearance from the turntable plinth.
- **Distinct hover vs. selected.** Hovering an unselected sleeve lifts it `+44 mm` along the crate plane, tilts it upright, brings it to full brightness, and adds a subtle paper rim—visibly distinct from the selected sleeve's accent frame. Hovering interactive 3D deck controls (Start/Stop, 33/45, Cue, Pitch, Volume, Anti-skate, Tonearm, held disc) updates pointer cursors and a whisper-quiet hover caption.
- **Intentional browse-then-act.** Swiping across the sleeves or clicking a background sleeve brings that sleeve smoothly to the front without opening drawers or triggering unrequested third-party embeds. Clicking the front sleeve acts directly: takes out *Polygondwanaland* when empty, opens *Polygondwanaland* details without interrupting playback when a record is already out, or opens a streaming album's sleeve choices.
- **Weighted record handling (`placement.js`).** Derived exact sleeve mid-plane home poses and tilted extraction axes from the frozen `sleeveMatrix`. Extraction slides strictly along the jacket opening (`inOutCubic`) and arcs smoothly into a tilted held presentation; placement carries along a parabolic arc over the spindle and settles strictly vertically (`outQuint`) onto the mat; return lifts cleanly off the spindle, aligns to the jacket mouth, and slides home. Zero idle motion once settled; `fan.isAnimating` allows the render loop to sleep when idle; `prefers-reduced-motion` snaps immediately.
- **Drawer-aware camera framing (`main.js`).** Opening a desktop drawer smoothly shifts the camera target along the view-right axis and shifts the dock left so the turntable or crate stays centered in the unobstructed viewport. Manual orbit/pan/zoom always yields control immediately.

## Preserved invariants & accessibility

- Held disc participates in picking and occludes sleeves; clicking it places the record without switching albums.
- Clicking a sleeve while playing opens details without stopping or returning the pressing.
- Cancelled/pinched arm gestures carry `cancel: true` and never seek or toggle service playback; `serviceRadius`/`serviceFraction` remain exact inverses; `serviceAngle` renders held arm position; `#record-status` mutates only on phase transitions.
- Zero external provider or media requests on initial load; physical audio and service playback remain mutually exclusive.
- Keyboard parity: canvas supports arrows (orbit), `+/-` (zoom), `[`/`]` or `PageUp`/`PageDown` (crate stepping); `Escape` closes open drawers; all controls meet 44 px touch targets on mobile.

## Integration review

Codex reviewed the code and desktop/phone captures independently of Neon. Corrections preserve action-specific pause/motor status, freeze hover together with the sleeve during record handling, refresh prepared-loading availability when operations settle/cancel, and make the phone full-recording fallback start the selected track. The public media activation from bf7e759 remains enabled.
