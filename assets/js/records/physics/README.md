# Vendored vinyl simulation

Source: https://github.com/rauchg/vinyl
Commit: bcc9264509d78ccbf4a449618f19c1cc3104b49c
Copyright (c) 2026 Guillermo Rauch. MIT; see LICENSE.txt.

The engine, DSP, groove, cut, press, worklet, worker, demo, geometry, GL utilities and shaders are copied from src/ at that commit. No upstream commercial recordings or precut audio assets are bundled.

Local changes: label.js supplies this site's label. render.js uses the site's material direction, exact stylus-tip placement while tilting, a distance-dependent near plane, a moving pitch cap/cue lever/counterweight/anti-skate indicator, and ../deck-markings.js for engraved labels. worklet.js additionally accepts an atomic parked reset when recovering an interrupted record swap. The original physics and mastering algorithms are unchanged. Main application, input, fan and audio lifecycle are site-owned modules one directory above.

Preserve the upstream license and this provenance when updating. Compare physical tests and scene/contact geometry before accepting an upstream revision.

The v6 integration additionally exports plinth/surface/force telemetry, streams a bounded raw-wall window for the magnified contact mesh, exposes GL mesh buffers for dynamic updates, and renders an output-volume knob and solver-driven plinth displacement. No changes to the audio integration equations. See ../../../../docs/records.md for limits and verification.
