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
