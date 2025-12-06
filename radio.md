---
layout: radio
title: Nusantara Stellar Radio
description: A cosmic radio interface from the Golden Triangle sector
---
<div class="stars" id="stars"></div>

<div class="radio-container">
  <div class="pattern-overlay"></div>
  <div class="compass-rose"></div>

  <div class="header">
    <h1 class="station-name">JALUR BINTANG</h1>
    <p class="subtitle">STELLAR TRADE ROUTE COMMUNICATIONS</p>
  </div>

  <div class="control-panel">
    <div class="frequency-dial">
      <div class="dial-container">
        <div class="dial" id="dial">
          <div class="dial-pointer"></div>
        </div>
      </div>
      <div class="frequency-display" id="frequency">
        147.3 MHz
      </div>
      <div class="signal-strength">
        <div class="signal-bar active"></div>
        <div class="signal-bar active"></div>
        <div class="signal-bar active"></div>
        <div class="signal-bar"></div>
        <div class="signal-bar"></div>
      </div>
    </div>

    <div class="main-display">
      <div class="now-playing">♫ NOW BROADCASTING ♫</div>
      <div class="track-info">
        <div class="track-title" id="trackTitle">Story 5 - clipping.</div>
        <div class="track-artist" id="trackArtist">Splendor and Misery</div>
      </div>
      <div class="waveform" id="waveform"></div>
      <div class="controls">
        <button class="control-btn" id="prevBtn" title="Previous">⏮</button>
        <button class="control-btn" id="playBtn" title="Play/Pause">▶</button>
        <button class="control-btn" id="nextBtn" title="Next">⏭</button>
        <button class="control-btn" id="shuffleBtn" title="Shuffle">🔀</button>
      </div>
    </div>

    <div class="volume-control">
      <div class="volume-dial-container">
        <div class="volume-dial" id="volumeDial">
          <div class="volume-dial-pointer"></div>
        </div>
      </div>
      <div class="volume-label">Volume</div>
    </div>
  </div>

  <div class="station-list" id="stationList">
    <div class="station-item active" data-freq="147.3" data-title="Story 5 - clipping." data-artist="Splendor and Misery">
      <div class="station-freq">147.3 MHz</div>
      <div class="station-name-small">Escape Pod Chronicles</div>
    </div>
    <div class="station-item" data-freq="156.7" data-title="Banned from Argo - Leslie Fish" data-artist="Spacer Ballads">
      <div class="station-freq">156.7 MHz</div>
      <div class="station-name-small">Merchant Marine Frequencies</div>
    </div>
    <div class="station-item" data-freq="142.1" data-title="Season of the Witch - Donovan" data-artist="Mystic Navigation">
      <div class="station-freq">142.1 MHz</div>
      <div class="station-name-small">Trade Wind Transmissions</div>
    </div>
    <div class="station-item" data-freq="159.4" data-title="River Man - Nick Drake" data-artist="Stellar Drift">
      <div class="station-freq">159.4 MHz</div>
      <div class="station-name-small">Deep Space Meditation</div>
    </div>
    <div class="station-item" data-freq="151.8" data-title="The Breach - clipping." data-artist="Ship Systems Alert">
      <div class="station-freq">151.8 MHz</div>
      <div class="station-name-small">Emergency Broadcast</div>
    </div>
  </div>
</div>

<script src="/assets/js/radio.js" defer></script> 