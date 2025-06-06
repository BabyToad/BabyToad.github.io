// === Animated Star Field ===
function createStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    const size = Math.random() * 3 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
  }
}

// === Waveform Animation ===
function createWaveform() {
  const waveform = document.getElementById('waveform');
  if (!waveform) return;
  waveform.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    bar.style.left = (i * 4) + 'px';
    bar.style.animationDelay = (i * 0.1) + 's';
    bar.style.height = Math.random() * 60 + 20 + '%';
    waveform.appendChild(bar);
  }
}

// === Signal Strength Animation ===
function updateSignalStrength() {
  const bars = document.querySelectorAll('.signal-bar');
  const strength = Math.floor(Math.random() * 5) + 1;
  bars.forEach((bar, index) => {
    bar.classList.toggle('active', index < strength);
  });
}

// === Dial Rotation and Frequency Update ===
let currentRotation = 0;
function tuneDial() {
  const dial = document.getElementById('dial');
  currentRotation += 45;
  dial.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
  // Generate random frequency
  const freq = (140 + Math.random() * 20).toFixed(1);
  document.getElementById('frequency').textContent = freq + ' MHz';
  updateSignalStrength();
}

// === Station List Interactivity ===
function selectStation(element) {
  document.querySelectorAll('.station-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
  // Update display
  document.getElementById('frequency').textContent = element.dataset.freq + ' MHz';
  document.getElementById('trackTitle').textContent = element.dataset.title;
  document.getElementById('trackArtist').textContent = element.dataset.artist;
  updateSignalStrength();
}

// === Controls (Visual Only) ===
let isPlaying = false;
function playPause() {
  const btn = document.getElementById('playBtn');
  isPlaying = !isPlaying;
  btn.textContent = isPlaying ? '⏸' : '▶';
  // Animate waveform based on play state
  const waveBars = document.querySelectorAll('.wave-bar');
  waveBars.forEach(bar => {
    bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
  });
}
function nextTrack() {
  const stations = document.querySelectorAll('.station-item');
  const current = document.querySelector('.station-item.active');
  const currentIndex = Array.from(stations).indexOf(current);
  const nextIndex = (currentIndex + 1) % stations.length;
  stations[nextIndex].click();
}
function prevTrack() {
  const stations = document.querySelectorAll('.station-item');
  const current = document.querySelector('.station-item.active');
  const currentIndex = Array.from(stations).indexOf(current);
  const prevIndex = currentIndex === 0 ? stations.length - 1 : currentIndex - 1;
  stations[prevIndex].click();
}
function shuffle() {
  const stations = document.querySelectorAll('.station-item');
  const randomIndex = Math.floor(Math.random() * stations.length);
  stations[randomIndex].click();
}
let currentVolume = 75;
let currentVolumeRotation = 0;

function adjustVolume(rotation) {
  const volumeDial = document.getElementById('volumeDial');
  if (!volumeDial) return;
  
  // Limit rotation to 270 degrees (0-100%)
  currentVolumeRotation = Math.max(0, Math.min(270, rotation));
  currentVolume = Math.round((currentVolumeRotation / 270) * 100);
  
  volumeDial.style.transform = `translate(-50%, -50%) rotate(${currentVolumeRotation}deg)`;
  
  // Update any visual feedback for volume level
  const waveBars = document.querySelectorAll('.wave-bar');
  waveBars.forEach(bar => {
    const baseHeight = parseInt(bar.style.height) || 50;
    bar.style.height = `${baseHeight * (currentVolume / 100)}%`;
  });
}

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  createWaveform();
  updateSignalStrength();
  setInterval(updateSignalStrength, 5000);

  // Dial
  const dial = document.getElementById('dial');
  if (dial) dial.addEventListener('click', tuneDial);

  // Station list
  document.querySelectorAll('.station-item').forEach(item => {
    item.addEventListener('click', function() { selectStation(this); });
  });

  // Controls
  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.addEventListener('click', playPause);
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  const shuffleBtn = document.getElementById('shuffleBtn');
  if (shuffleBtn) shuffleBtn.addEventListener('click', shuffle);

  // Volume
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function() { adjustVolume(this.value); });
    adjustVolume(volumeSlider.value);
  }

  // Volume dial
  const volumeDial = document.getElementById('volumeDial');
  if (volumeDial) {
    let isDragging = false;
    let startAngle = 0;
    let startRotation = 0;

    volumeDial.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = volumeDial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      startRotation = currentVolumeRotation;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const rect = volumeDial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      const rotation = startRotation + (angle - startAngle);
      
      adjustVolume(rotation);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Initialize volume
    adjustVolume(currentVolumeRotation);
  }

  // Start waveform animation as paused
  playPause();
}); 