# Record-player implementation notes

Six starter records selected from the artists/albums Jonas named. Aja and Lifeforce are representative records from named artists, not an inferred ranking. Personal notes are intentionally empty.

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

## Architecture

The view reuses the already vendored six-springs/lib/three.module.js and its sibling core module/license. No new packages, CDN or build pipeline. records.json data feeds HTML and the public /records.json endpoint. Page-specific assets are gated by vinyl: true.

No Google/YouTube request before consent AND Lower needle. Disconnect destroys the iframe; already loaded API code cannot undo earlier external requests. This is a whole-album playlist integration; availability is controlled by YouTube. The 3D view follows provider events rather than inventing progress. ?mute=1 is only for silent agent verification, never a production default.

Run the standard Ruby prebuild scripts and Jekyll build. Manual checks: both themes, small viewport, keyboard placement/cue/return, reduced motion, JavaScript/WebGL off, denied provider, album replacement during connection, disconnect, player-side pause and playlist switching.

Draft feature only: do not deploy or merge without Jonas.

## First-version verification (2026-11-25)

- Standard prebuild scripts and Jekyll build pass. This Windows installation has no `jekyll` executable shim; equivalent command: `bundle exec ruby -e "load Gem.bin_path('jekyll', 'jekyll')" -- build`.
- Headless Chromium: actual record dragging, keyboard place/cue/lift, album replacement, explicit consent, disconnect, reduced motion at 390px, both themes, no-JS links, WebGL failure, blocked provider script and no feature assets on About pass. No application JS errors.
- Synthetic YouTube event fixture verifies play/pause/resume, error/retry and stale-event rejection. This does not prove music availability.
- All six official album playlists returned YouTube error 150 in the clean test session. Three official music-video probes also returned 150 (`errorCode: auth`); Google's documented API sample video played on both embed hosts. The exact cause of music restrictions is not established. Do not claim the six albums are playable here or that every browser/region will fail. Keep this PR a draft until playback acceptance with Jonas.
- Natural Light has an explicit alternative using [the artist's Bandcamp album](https://danmangan.bandcamp.com/album/natural-light), embed album ID `2684530334`. Its visible Play control successfully started audio, confirmed with a non-paused media element and advancing currentTime in the muted test browser. Bandcamp owns playback controls; the scene intentionally stays still because the embed exposes no supported remote playback-state API used here. It does not satisfy the full needle-to-music interaction for every album.
- No provider connection occurs before the visitor chooses to load a player. The complete private library and ranking data are not shipped. There are six public starter records, not a ranked collection.
- Remaining acceptance: real mobile Safari/Android device playback, chosen-album availability in a normal browser session, and Jonas's judgment of handling/selection. Personal liner notes, full-catalog ranking and precise track grooves are later work.

The still scene retains its drawing buffer so compositor captures preserve it while requestAnimationFrame sleeps. Pixel ratio is capped at 1.5; rendering stops when idle, offscreen or hidden. No new dependency or build step is required.

## Opus review follow-up

Claude Opus 5.5 high reviewed `a146dd0` and captures, requesting four corrections. The follow-up accepts real PLAYING events after a track error, allows a late-ready player to recover after a timeout, explicitly closes Bandcamp when enabling YouTube, aligns needle state and buttons during connecting/buffering/autoplay-blocked states, and makes record drops settle from their release position within a generous platter zone (rejected drops return). Arm drags must cross the halfway cue threshold; tapping remains available.

Targeted Chromium checks passed for off-platter rejection, continuity on release, error-to-playing recovery, delayed-ready recovery after timeout, buffering pause, connecting disablement, ready-state needle lift, selected-sleeve no-op, Bandcamp-to-YouTube replacement and matching caption. Existing keyboard/stale-event/provider-denial/WebGL fallback checks also pass. New captures include a **synthetic-provider** placed/playing state; these do not establish real YouTube album availability. Local muted verification scripts remain in the vault scratch folder, not a new site build dependency.

Also addressed: mobile vertical scrolling over the canvas, named semantic group for the stage, token-derived Bandcamp colors when loaded, darker platter mat, and the stylesheet flag registry. The correction commit was checked by Codex but has not had a second independent review. Playback release limitations above remain unchanged; the PR stays draft.
