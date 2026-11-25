# Records: implementation and verification

Six starter records from albums and artists Jonas named. Aja and Lifeforce are representative choices from named artists, not an inferred ranking. The private library is not shipped and personal liner notes remain unwritten. Album context is factual, not ghostwritten memories.

## Current design

Jonas's feedback on 2026-11-25 asks for a browsable glassy 3D catalogue, a realistic turntable, album and track context, and optional vinyl sound. This supersedes the earlier proposal for a simplified engraved deck. Neon built the acrylic crate, open dust cover, detailed tonearm, machined platter, strobe, controls and feet; Codex integrated playback and the interface.

Sleeves can be selected directly or with the labelled album selector and previous/next buttons. Place by tap, drag into the platter snap zone, or button. Cue the arm by tap/drag or button. Invalid drops return to the sleeve. Both themes use site tokens; materials also use physical metal/rubber/glass values. Idle/offscreen rendering stops; reduced motion removes continuous rotation. No new dependency or build pipeline.

## Playback contract

The first YouTube integration returned error 150 for all six music playlists in a clean browser. That failure is reproduced, not assumed universal. YouTube Music remains an outbound full-listening link.

The current integration uses the visible official Spotify embed and its [iframe API](https://developer.spotify.com/documentation/embeds/references/iframe-api). In the tested signed-out session these are roughly 30-second previews, clearly labelled in the controls and progress display. The album links open full listening on the provider. The native player remains visible for browser gesture requirements and provider errors. Playback availability can vary by browser, region and account.

No provider script/frame loads until consent plus a playback action. The checkbox alone makes no connection. Album changes, return, disconnect and provider replacement destroy the previous frame. Confirmed playback events drive status, track selection, preview time, record rotation and needle position. Full track durations are separate from preview duration. Generation checks discard stale connections. A failed script can be retried.

Natural Light also offers the artist's full [Bandcamp album](https://danmangan.bandcamp.com/album/natural-light). Its native controls own playback. The page explicitly states that the deck and surface-noise effect do not follow Bandcamp; there is no fabricated external progress.

Optional surface noise is generated locally with Web Audio, off by default. It accompanies confirmed Spotify playback, stops on pause/disconnect/hidden page, and never filters or downloads the commercial stream. Agent browser launches use --mute-audio; ?mute=1 additionally suppresses local noise.

## Data and architecture

`_data/records.json` feeds the HTML catalogue, scene and public `/records.json`. It contains six albums and 66 numbered tracks with provider URIs, streaming-edition durations and factual context. Spotify metadata was inspected in the public official embeds on 2026-11-25:

| Album | Spotify album ID | Tracks |
| --- | --- | ---: |
| Excitable Boy | 03WJAI8NnJHvCNqnlLw8kg | 13 |
| The Overload | 7KWBJQVkPOkkyC4A3EaNA6 | 11 |
| American Head | 2s79HMasjZVNXwoqXTe1X2 | 13 |
| Natural Light | 5mbEX4VVc8PY11n3RPqrGT | 13 |
| Aja | 1hOK2ey9W76x9GnftSRgrw | 7 |
| Trust in the Lifeforce of the Deep Mystery | 2mvz0NPBCPTbSEgRViuDLK | 9 |

Excitable Boy includes four bonus recordings in this streaming edition. The catalogue is not a physical pressing track map. Groove movement is expressive playback feedback, not precise audio seeking.

`vinyl: true` gates page CSS and ES modules. `main.js` owns selection and controls, `playback.js` provider lifecycle, `texture.js` local sound, `scene.js` the procedural view and gestures. The renderer reuses `six-springs/lib/three.module.js` and its existing license. Covers are local. No-JS has the HTML catalogue and links; WebGL failure retains every DOM playback control.

## Verification and remaining acceptance

Use the standard Ruby prebuild scripts and Jekyll build. On this Windows setup the missing executable shim is handled by `bundle exec ruby -e "load Gem.bin_path('jekyll', 'jekyll')" -- build`.

Real browser tests are run with muted Chromium, not synthetic provider success. All six opening tracks and the selected-track controls have been heard by the browser audio pipeline (non-paused media, advancing currentTime), and Bandcamp's Play control starts real audio. Captures cover dark/light, placed, and 390px layouts. Detailed final regression evidence is recorded with this PR.

Real mobile Safari/Android device playback, regional availability, and Jonas's assessment of feel remain acceptance checks. Keep the PR a draft; do not merge or deploy without Jonas.

## Sources

Album metadata, official playlist IDs and cover artwork resolved from these public YouTube Music album pages on 2026-11-25. Artwork remains credited to the respective artists/labels; used only to identify the records, not licensed as original site art.
- Warren Zevon — Excitable Boy: https://music.youtube.com/browse/MPREb_TNptpDKdduK
  Cover source: https://yt3.googleusercontent.com/vwFRcTWk2B3WfcLLUXXURyCdWgQ91ziCXQ3HfuWl6kxNa_Ssu2x0k8cDU4eY4JWVnYviDR-YAOMhmLfA=w544-h544-s-l90-rj
- Steely Dan — Aja: https://music.youtube.com/browse/MPREb_jSbekZ09Zov
  Cover source: https://yt3.googleusercontent.com/ri7MwyQD1jpyC1cC67xXqyMtu0awjpCkSGbYuJaoNvMQnsNPXkQqTaJ_6o5mIJ3Do27hiyVrvOn-bKo=w544-h544-l90-rj
- Yard Act — The Overload: https://music.youtube.com/browse/MPREb_wmYbXhR7eBE
  Cover source: https://yt3.googleusercontent.com/LkLUAPEyUU5BwUvkvrwchQEbVKxeJS1gEtERxjLh2YKNxe6O1c_8qjW5TFBMM8phe1HpRwsjqHIPKgMIVQ=w544-h544-l90-rj
- Dan Mangan — Natural Light: https://music.youtube.com/browse/MPREb_79GGmG52a5o
  Cover source: https://yt3.googleusercontent.com/mvQ7fUg-LFB73MMpu8KD6A8R6TjOaIqask7Js0Bmz-1920Bv6rP1MdyQ4Tl1LR95gBaV5BOGsdlozVTV=w544-h544-l90-rj
- The Comet Is Coming — Trust In The Lifeforce Of The Deep Mystery: https://music.youtube.com/browse/MPREb_fV3VWgik6b7
  Cover source: https://yt3.googleusercontent.com/45p1L8JbsEl_pcLRmMpbl9Wqh2enVvMnYGZfuoyUdl85WqRFOhP28KeyQPmQ7vyYC7_fD_a-XvcDiR4c=w544-h544-l90-rj
- The Flaming Lips — American Head: https://music.youtube.com/browse/MPREb_aFh9iLCBCs9
  Cover source: https://yt3.googleusercontent.com/0BcFKYMgnY_dZMC2MpHFITtDBYF3nOssm1Y0PNMy9hid0eYkeqSbCM4OEXZxAuBF1wcIhTe2HpDCyfc=w544-h544-l90-rj

## V2 review and final regression evidence

Claude Opus 5.5 (high, 8% weekly quota remaining) reviewed the v2 code and placed/phone captures. Codex applied the findings: preserve the cued arm during connection; expose retry when controller creation times out; handle paused-at-zero and actual terminal-position events; ignore previous-track updates during a track switch; use single-track previews consistently; map groove feedback into cumulative album duration; suspend disabled local audio; capture sleeve pointers so outside release clears selection; tighten phone framing and increase helper text. These corrections were checked by Codex and have not had a second independent review.

Final muted Chromium verification on 2026-11-25:

- Six real opening previews, with non-paused audio and advancing currentTime; real selected-track changes, pause and resume.
- Consent alone makes no provider request. Album replacement, return and disconnect remove the iframe. Bandcamp plays real audio and enabling Spotify replaces it cleanly.
- Direct 3D sleeve selection, rejected off-platter drag, successful record drop and arm tap that starts real audio.
- A complete preview, final status after the provider's last update, replay, and blocked-script recovery into real playback. The observed Spotify terminal update has position equal to duration while isPaused is still false; the adapter explicitly handles this.
- Optional surface-noise gain on/off and pause behaviour; zero application JavaScript errors; no-JS six-album links; 390px reduced-motion layout without horizontal overflow.
- Dark/light and placed/playing captures inspected. Jekyll prebuild/build, JS syntax and git whitespace checks pass.

Evidence files remain local at `H:/Personal Projects/records-verification/v2/` (`playtest.json`, `extra-test.json`, `end-probe.json` and PNG captures). Verification scripts live in private vault scratch; they are not site build dependencies. Real physical-phone playback and feel remain unverified.


## Fan desk revision (2026-11-25)

Jonas requested a fan that opens and flicks through albums, glass hover information, a single listening scene, functional knobs and more realistic motion/materials. The desk now keeps navigation, transport, album/track information and settings together. The text catalogue remains a progressive-enhancement fallback. Album details and settings are glass overlays; the official streaming player remains visible in a compact dock. Portrait layout arranges the fan behind the deck instead of shrinking two side-by-side objects.

The fan opens/folds, highlights sleeves on hover, and browses by horizontal swipe or horizontal/Shift-wheel. Ordinary vertical wheel remains page scrolling. Touch uses horizontal swipes and tap-to-place, with labelled buttons and ranges for precise adjustments. A press released outside the canvas is captured, preventing stale drags. Album changes return the old record before changing its label and sleeve; repeated changes keep the most recent request.

The scene reports physical completion to the controller: record home, arm parked, needle down. Cueing starts the motor, lifts the arm, swings above the groove and lowers it before requesting audio. Track changes lift/park first. Returning a record waits for arm clearance. If the scene is offscreen, mechanical transitions complete without rendering so library controls cannot deadlock. Provider buffering/availability is still external; this is authored motion rather than a physics simulation or a guarantee of gapless timing.

Physical controls have supported effects:

- Start/cue control lowers or lifts the needle.
- Track encoder chooses a track when a record is placed.
- Surface knob adjusts locally generated crackle, with a matching keyboard range and opt-in checkbox.
- 33⅓/45 buttons alter the simulated platter RPM with motor inertia. Spotify audio speed and pitch remain unchanged, explicitly stated in the UI.

The model adds knurled knobs, engraved controls, layered metalwork, darker grooved vinyl and refined studio reflections. The acrylic tray supports the opened fan. The dust cover stays open; closing it is not exposed as a control. No dependency or downloaded model is added.

Claude Opus 5.5 high reviewed the v3 code and captures. Codex addressed ready-state resume, outside-pointer release, offscreen settle events, record-return selection, fan support and portrait overlap. Final regression evidence is in the private local v3 verification directory. Corrections are checked by Codex; no second independent review is claimed.

The v3 real-provider run passes all six albums, pause/resume, track replacement, end/replay, cancellation before connection, surface gain, Bandcamp replacement, reduced-motion playback and WebGL fallback. Direct interaction checks pass hover information, horizontal wheel/flick browsing, rotary surface level, track encoder, 45 RPM and rapid/latest-wins album replacement. Separate synthetic-provider regression checks cover autoplay-blocked ready/resume, offscreen catalogue selection and outside-canvas pointer release; they do not establish provider availability. Build, syntax and whitespace checks pass. Physical-phone performance and playback remain unverified.


## Control visibility and clearance revision (2026-11-25)

This revision supersedes the v3 park-between-tracks behaviour. Track changes now lift the stylus, move directly to the target groove, and lower before loading the next URI in the existing Spotify controller. Pausing holds the lifted arm over the record. Return/disconnect still parks it. The scene ignores old provider updates while a new physical cue is pending.

A visible glass control strip offers Play/Pause, previous/next track, a crackle checkbox, level slider and three-second audition. Clicking the physical knobs opens the track list or precise slider. Track-knob drags commit once on release rather than repeatedly interrupting playback. The locally generated crackle buffer is normalized and its level raised; inactive audio suspends. This is an added sound layer, not EQ, pitch modulation or processing of Spotify/Bandcamp streams.

The 33/45 buttons were partly inside the platter footprint. A dedicated front apron now carries them clear of the rim. The acrylic tray's front lip is lower, and the presentation camera is higher. Actual browser mesh geometry was exported into an isolated Blender scene, with 28 arm poses, and inspected from low front, side, top (lid hidden for inspection) and three-quarter views. Triangle tests cover the arm and button solids against platter/record/lid/knobs; they are a bounded clearance check, not proof that every mesh pairing is collision-free. The first arm-only audit missed the fixed-button collision, which Jonas identified in a screenshot. Source geometry remains procedural Three.js; the Blender file is an inspection copy.

Spotify duration labels now distinguish a returned preview duration from a full track rather than assuming every session is limited to 30 seconds. The official iframe retains encrypted-media permission. Full-track access depends on Spotify's session/browser support; a separate Web Playback SDK integration would require Premium authorization. No account integration was added.

The Throne and Wheel mixtape uses individual YouTube video IDs, the IFrame API, youtube-nocookie.com and an explicit origin. Its error handler skips failed videos. A same-browser comparison with those settings played The HU's Wolf Totem (396.625s) and Google's API example, while the mixtape's Wu-Tang and Khruangbin IDs and a Records probe returned 150/auth. There is no YouTube Music login mechanism in that implementation. This verifies upload-specific availability differences, not a guaranteed full-album route.

Validation: all six actual Spotify opening previews, selected-track playback, pause/resume, end/replay, Bandcamp, reduced motion and WebGL failure pass in muted Chromium. Focused tests verify the three-second crackle audition produces signal and then suspends, track changes retain the same iframe and keep the arm over the record while lifting, and pause/return move as described. Both theme and mobile captures inspected. Real signed-in Spotify full-track playback and real mobile hardware remain unverified.

Private evidence: `H:/Personal Projects/records-verification/v4/`, including `flow.json`, `extra.json`, `youtube-compare.json`, `clearance.json`, `turntable-clearance.blend` and browser/Blender captures. No private library data is included in the website.

Primary provider references: [Spotify embed troubleshooting](https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting), [Spotify SDK requirements](https://developer.spotify.com/documentation/web-playback-sdk/reference), [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference).


Gemini 4 Neon (high) reviewed v4 code and the multi-angle captures. Its findings were corrected: canceling a groove transfer clears the seek latch; the canvas reservation sits outside the render box; the extended apron grows forward with matching cover depth and clear corner screws; crackle test feedback is visible and resets, with an explicit zero-level message; rapid skips and replay reuse the connected player and reset progress; captured knob drags commit outside the canvas and preserve multiple detents; paused arm drag can park; returned URI determines expected duration; disposed audio ignores late continuations. The invisible arm hit volume also no longer masks the track knob, verified with actual pointer clicks. Agent audio muting is applied only at browser launch.

Review corrections were tested directly, without a second delegate review. Synthetic-provider regression tests exercise full-duration labels, rapid skip/replay reuse, cancel/return/consent/album change during transfer, equal canvas pixel scaling on desktop/mobile, and crackle status completion. Actual-provider checks cover short arm transfers, pause position, iframe reuse and audible audition; actual pointer tests cover both speed buttons, knob disclosure/focus, and release-only selection. These checks complement the complete six-album real-playback suite; they do not establish signed-in full-track availability or real-phone acceptance.

### Strobe lamp clearance correction

The fixed strobe lamp was intersecting the platter rim. Its complete assembly now sits outside the platter well at deck coordinates (-1.67, 0.715, 1.10), with a rectangular hood and an amber window aimed radially at the speed markings. The base remains on the top plate and clear of Start/Stop. Named lamp meshes make it explicit in future geometry audits.

Validation: Jekyll build, JavaScript syntax and diff checks pass. The current browser meshes were exported and inspected in Blender from low-front, lamp-face and overhead views. A static BVH check found no lamp intersections with any other exported visible deck mesh. The inner foot edge has 0.0404 scene units clearance from the platter well and 0.0994 from the rotating skirt. This small geometry-only correction was directly checked, without a new independent review; playback behavior is unchanged.