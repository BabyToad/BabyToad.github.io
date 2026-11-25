# Records: physical player

This version replaces the earlier provider-driven turntable with a local groove simulation adapted from [Guillermo Rauch's vinyl](https://github.com/rauchg/vinyl), pinned at `bcc9264509d78ccbf4a449618f19c1cc3104b49c`. One renderer and one physical engine share metre-scale geometry. There is no second decorative deck or provider playback underneath it.

## Listening contract

The house pressing is a three-track synthesised demo from the upstream MIT-licensed code. It is cut in a worker on page load; audio starts only after a visitor's gesture. Local audio files are decoded, cut into a stereo groove and passed to an AudioWorklet. They are never uploaded, persisted or associated silently with a commercial album. The label and source badge use the files' own names.

Ten curated sleeves contain cover art, factual context, numbered track lists and outbound listening links. They do not supply recordings. Browsing a sleeve leaves the current physical pressing alone, and the source badge remains explicit about what is on the platter. Spotify, YouTube and Bandcamp scripts/frames are not loaded. The old additive crackle, previews and provider adapters are removed.

Groove wall displacement drives the stylus/contact model, cartridge and playback equalization. Motor speed, pitch, cue lift, hand contact, tracking force, anti-skate and record condition affect this model. Dust and scratches alter groove geometry; they are not an unrelated noise overlay. This is a newly simulated pressing from a digital source, not a reconstruction of an original vinyl master or a laboratory-validated model of a particular deck.

## Interaction and visual design

The camera freely orbits, pans and zooms. Room, Records, Deck and Needle offer smooth focus moves; Reset recovers the starting view. Reduced motion makes preset moves and sleeve selection immediate. The platter still reflects the physical audio source while playing.

Objects are handled; empty space moves the camera. Mouse/touch drags handle the arm, platter, pitch slider, anti-skate dial and output-volume knob. Volume is also always visible in the transport strip. Two fingers always control the camera, safely releasing any object hold. A sleeve tap opens its details, and a horizontal fan drag browses without wrapping at either end. Previous/next buttons also browse and disable at the collection ends. The Look only button lets any one-finger drag move the camera. Wheel zoom requires the focused canvas or Ctrl/Meta; ordinary unfocused scrolling remains page scrolling. A visible Collection link exits the touch surface.

DOM controls provide motor, cue, speed, automatic placement, track cueing and adjustments. The canvas has keyboard orbit/zoom controls; all listening and album information has an HTML alternative. Cover textures remain full colour; interface typography and colors use the site's print/CRT design. Materials use physical metal, paper and acrylic values.

The rendered diamond's contact point is pinned to the engine's `stylusXY` and contact height. The pitch cap, cue lever and counterweight move with their controls. The record shader reads visualization data from the actual cut. New pressings wait for the motor to coast down and the needle to clear before replacing the disc. An interrupted audio context or a 12-second recovery deadline installs the cut into an atomically stopped, raised and parked mechanism; a later tap resumes audio. Idle GPU rendering stops after mechanical motion settles; audio simulation continues while its context is active. Offscreen/hidden stages do not render, and hiding releases held objects.

## Groove inspection and physical-control feedback

After audio activation, **Grooves** opens a magnified 3D contact model in the same canvas. Five neighboring V-shaped grooves are triangulated from the current pressing's raw wall samples; their 45-degree walls and land use real proportions in micrometre units. The tip's 18 µm seating radius and its radial/vertical position come from the same solver that produces audio. A cutaway highlights the V profile and spherical seating section, with a 100 µm scale bar. Raw cut walls are shown unfiltered: the solver also reconstructs and filters them for the selected stylus scan radius, so transient raw-wall overlap on dust/scratches is not a contact-solver failure. The 18 µm seating radius is shared by all stylus types; their along-groove scan radii differ. The upper diamond/shank is an illustrative model; the view is a local sampled surface, not the entire record tessellated at audio resolution. It is not a second audio engine or cosmetic waveform. The normal deck retains the coarse cut-derived surface shader.

The worklet sends a small wall window only during the relevant needle/groove inspection (2D trace or 3D mesh, not both); full groove arrays remain transferred to the worklet once. Orbit and zoom inspect the contact model; the transport still operates the real motor/cue. The microscope has its own local frame, so entering/leaving it is a deliberate view cut. Its camera excludes the overlaid controls from its usable viewport. Raised or parked needles are reported explicitly.

Tracking force and anti-skate were already active in the solver. Live inner/outer wall loads, contact loss and plinth displacement now make their consequences inspectable. A clean record may still track at several settings without dramatic audible damage. The knob drives output gain, not an invented cartridge property. Light, firm and heavy knocks feed the existing damped plinth model; the rendered platter/plinth now reflect its real displacement without magnification. No fake shake or added crackle is used.

## YouTube feasibility, checked 2026-11-25

A visible official IFrame player can play eligible recordings and report time/state, with play/pause/seek/volume control. In the same muted clean Chromium session, The HU's official Wolf Totem (jM8dCGIm6yc) and Google's API control played; Yard Act's official The Overload (tQ2ANR_vF2E) returned error 150/auth. The HU also sought to 30 seconds and paused. A valid origin/referrer was supplied. This is evidence of track-specific availability, not a diagnosis of every 150 response or a logged-in-user guarantee.

The [IFrame API](https://developers.google.com/youtube/iframe_api_reference) does not expose PCM for local groove cutting, and [YouTube policies](https://developers.google.com/youtube/terms/developer-policies) prohibit separating/modifying the supplied audio/video. A future streaming mode must keep a visible player and label its mechanism as transport visualization; pitch, scratching, wall-contact audio and physical damage cannot be promised for that stream. No provider code was reintroduced by this change.

There is a separate promising source for real physical playback: the band's [Polygondwanaland release page](https://kinggizzardandthelizardwizard.com/polygondwanaland) explicitly permits downloading/copying/pressing the album and supplies digital masters. That is a candidate for an artist-authorized built-in pressing. No music assets were downloaded, hosted or published in this change; browser memory/cutting limits still apply.

## Architecture and data

Jekyll remains the only site build. `vinyl: true` gates the page stylesheet and native ES module. No package dependencies or framework are added.

- `main.js`: page state, mastering lifecycle, controls and telemetry/render bridge.
- `audio.js`: gesture activation, worklet lifecycle and one-time transfer of groove walls.
- `micro-surface.js`: sampled V-wall mesh and magnified contact rendering.
- `input.js`: object/camera gesture ownership and equivalent pointer behavior.
- `fan.js`, `deck-markings.js`: sleeves, back-cover track lists and physical control markings.
- `physics/`: pinned MIT engine, renderer, DSP, mastering worker and demo; provenance and local changes are listed in its README.

`_data/records.json` feeds the page, `/records.json` and the full-text export. Ten albums, 100 tracks. The first six retain their previously inspected streaming editions; *Excitable Boy* includes four bonus tracks. Four additions were chosen from Jonas's backlog under his instruction: *Dying Surfer Meets His Maker*, *Masana Temples*, *Kind of Blue* (five-track edition), and *Polygondwanaland*. Apple catalogue metadata and covers were retrieved with his explicit permission. Provenance URLs are stored alongside those entries. No private inventory, agent ranking or invented personal memories are published.

Local cutting is capped at 3 minutes/20 MB on small screens and 10 minutes/80 MB on larger screens. Mono inputs share one channel buffer. File metadata is checked before full decoding, then decoded duration is checked again. These are conservative input limits, not a mobile-memory guarantee. Cancellation invalidates unfinished jobs; the prior pressing remains available. Worklet wall arrays are transferred, not duplicated. A fresh cut is made when re-pressing.

## Validation

Build with the two Ruby prebuild scripts and Jekyll. On this Windows setup: `bundle exec ruby -e "load Gem.bin_path('jekyll', 'jekyll')" -- build`.

Development verification is outside the shipped site in `H:/Personal Projects/records-verification/v5/`. Browser instrumentation and mute settings exist only in the test harness. Product code contains no agent mute flags or test globals.

The muted desktop Chromium flow checks real AudioWorklet output, nominal/45 RPM, track cueing, needle lift, stopped idle rendering, the drawn Start button, pitch dragging, sleeve selection, local WAV cutting and playback, re-pressing, cancellation, and absence of external requests/page errors. Captures include both themes, playing, sleeve inspection, needle close-up, overhead, rear and side views. Touch-emulated Chromium additionally covers small-screen layout and gestures, history recovery and no-JS/WebGL fallbacks. Targeted recovery tests also verify a cut finishing while audio is suspended, resumed physical playback, transferred wall buffers, manual platter/arm handling, and actual worklet volume/speed/pitch/stylus/force/anti-skate settings before any transport action. Claude Opus 5.5 reviewed the design, prototype, candidate and recovery delta. All requested fixes were applied; the final one-line parameter restoration was directly regression-tested without another review. Test evidence is recorded on PR #25.

Real iPhone/Safari audio activation and real mid-range-phone memory/performance still need hardware acceptance. Emulation is not evidence of those properties. Keep the PR draft until Jonas reviews the result. Nothing in this work authorizes merging or deployment.

Additional v6 evidence lives in H:/Personal Projects/records-verification/v6/. Real worklet tests verify mute, volume knob dragging, force and anti-skate response, knock displacement, 3D wall rendering, both themes, and narrow-screen framing. The two optional dependency-free checks are `node scripts/test-records.mjs` and `node scripts/test-records-controls.mjs`. The latter checks force response, anti-skate balance, knock displacement, zero output at mute and V-wall dimensions. Physical force/contact results are model behavior, not hardware calibration.

## Earlier versions

The v1–v4 provider integrations and procedural Three.js deck are preserved in Git history through `bf48d0b`. Their Spotify preview tests and Blender clearance checks describe that retired implementation, not this version. The current physical renderer is the adapted upstream WebGL2 model; both the engine and rendered contact point now use the same geometry.

Claude Opus 5.5 high reviewed the v6 delta and captures. Requested idle-render, knob-hit, raw-surface clarity, replacement-state and contact-visibility changes were addressed; the final corrections were checked directly without a second review. Recovery checks verify disabled early entry, no GL errors, immediate macro-view return, suspended re-press returning to Needle, and zero idle Needle frames over a one-second observation. Heavy knock (8) passes the engine stability guard. Real mobile hardware remains unverified.
