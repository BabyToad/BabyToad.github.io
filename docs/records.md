# Records: physical player

This version replaces the earlier provider-driven turntable with a local groove simulation adapted from [Guillermo Rauch's vinyl](https://github.com/rauchg/vinyl), pinned at `bcc9264509d78ccbf4a449618f19c1cc3104b49c`. One renderer and one physical engine share metre-scale geometry. There is no second decorative deck or provider playback underneath it.

## Listening contract

The house pressing is a three-track synthesised demo from the upstream MIT-licensed code. It is cut in a worker on page load; audio starts only after a visitor's gesture. Local audio files are decoded, cut into a stereo groove and passed to an AudioWorklet. They are never uploaded, persisted or associated silently with a commercial album. The label and source badge use the files' own names.

Ten curated sleeves contain cover art, factual context, numbered track lists and outbound listening links. They do not supply recordings. Browsing a sleeve leaves the current physical pressing alone, and the source badge remains explicit about what is on the platter. Spotify, YouTube and Bandcamp scripts/frames are not loaded. The old additive crackle, previews and provider adapters are removed.

Groove wall displacement drives the stylus/contact model, cartridge and playback equalization. Motor speed, pitch, cue lift, hand contact, tracking force, anti-skate and record condition affect this model. Dust and scratches alter groove geometry; they are not an unrelated noise overlay. This is a newly simulated pressing from a digital source, not a reconstruction of an original vinyl master or a laboratory-validated model of a particular deck.

## Interaction and visual design

The camera freely orbits, pans and zooms. Room, Records, Deck and Needle offer smooth focus moves; Reset recovers the starting view. Reduced motion makes preset moves and sleeve selection immediate. The platter still reflects the physical audio source while playing.

Objects are handled; empty space moves the camera. Mouse/touch drags handle the arm, platter, pitch slider and anti-skate dial. Two fingers always control the camera, safely releasing any object hold. A sleeve tap opens its details, and a horizontal fan drag browses without wrapping at either end. Previous/next buttons also browse. The Look only button lets any one-finger drag move the camera. Wheel zoom requires the focused canvas or Ctrl/Meta; ordinary unfocused scrolling remains page scrolling. A visible Collection link exits the touch surface.

DOM controls provide motor, cue, speed, automatic placement, track cueing and adjustments. The canvas has keyboard orbit/zoom controls; all listening and album information has an HTML alternative. Cover textures remain full colour; interface typography and colors use the site's print/CRT design. Materials use physical metal, paper and acrylic values.

The rendered diamond's contact point is pinned to the engine's `stylusXY` and contact height. The pitch cap, cue lever and counterweight move with their controls. The record shader reads visualization data from the actual cut. New pressings wait for the motor to coast down and the needle to clear before replacing the disc. Idle GPU rendering stops after mechanical motion settles; audio simulation continues while its context is active. Offscreen/hidden stages do not render, and hiding releases held objects.

## Architecture and data

Jekyll remains the only site build. `vinyl: true` gates the page stylesheet and native ES module. No package dependencies or framework are added.

- `main.js`: page state, mastering lifecycle, controls and telemetry/render bridge.
- `audio.js`: gesture activation, worklet lifecycle and one-time transfer of groove walls.
- `input.js`: object/camera gesture ownership and equivalent pointer behavior.
- `fan.js`, `deck-markings.js`: sleeves, back-cover track lists and physical control markings.
- `physics/`: pinned MIT engine, renderer, DSP, mastering worker and demo; provenance and local changes are listed in its README.

`_data/records.json` feeds the page, `/records.json` and the full-text export. Ten albums, 100 tracks. The first six retain their previously inspected streaming editions; *Excitable Boy* includes four bonus tracks. Four additions were chosen from Jonas's backlog under his instruction: *Dying Surfer Meets His Maker*, *Masana Temples*, *Kind of Blue* (five-track edition), and *Polygondwanaland*. Apple catalogue metadata and covers were retrieved with his explicit permission. Provenance URLs are stored alongside those entries. No private inventory, agent ranking or invented personal memories are published.

Local cutting is capped at 3 minutes/20 MB on small screens and 10 minutes/80 MB on larger screens. File metadata is checked before full decoding, then decoded duration is checked again. These are conservative input limits, not a mobile-memory guarantee. Cancellation invalidates unfinished jobs; the prior pressing remains available. Worklet wall arrays are transferred, not duplicated. A fresh cut is made when re-pressing.

## Validation

Build with the two Ruby prebuild scripts and Jekyll. On this Windows setup: `bundle exec ruby -e "load Gem.bin_path('jekyll', 'jekyll')" -- build`.

Development verification is outside the shipped site in `H:/Personal Projects/records-verification/v5/`. Browser instrumentation and mute settings exist only in the test harness. Product code contains no agent mute flags or test globals.

The muted desktop Chromium flow checks real AudioWorklet output, nominal/45 RPM, track cueing, needle lift, stopped idle rendering, the drawn Start button, pitch dragging, sleeve selection, local WAV cutting and playback, re-pressing, cancellation, and absence of external requests/page errors. Captures include both themes, playing, sleeve inspection, needle close-up, overhead, rear and side views. Touch-emulated Chromium additionally covers small-screen layout and gestures, history recovery and no-JS/WebGL fallbacks. Test evidence and any outstanding findings are recorded on PR #25.

Real iPhone/Safari audio activation and real mid-range-phone memory/performance still need hardware acceptance. Emulation is not evidence of those properties. Keep the PR draft until Jonas reviews the result. Nothing in this work authorizes merging or deployment.

## Earlier versions

The v1–v4 provider integrations and procedural Three.js deck are preserved in Git history through `bf48d0b`. Their Spotify preview tests and Blender clearance checks describe that retired implementation, not this version. The current physical renderer is the adapted upstream WebGL2 model; both the engine and rendered contact point now use the same geometry.
