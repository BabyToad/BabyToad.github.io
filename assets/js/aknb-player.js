/* AKNB player — terminal instrument panel for .thought-video figures.
   Progressive enhancement: installs only when JS runs; otherwise the
   native controls attribute stays untouched. No ambient motion. */
(function () {
    'use strict';

    function fmt(t) {
        if (!isFinite(t) || t < 0) return '--:--';
        t = Math.floor(t);
        var m = Math.floor(t / 60), s = t % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function enhance(fig) {
        var video = fig.querySelector('video');
        if (!video || fig.classList.contains('aknb-enhanced')) return;

        video.removeAttribute('controls');
        fig.classList.add('aknb-enhanced');

        var bar = document.createElement('div');
        bar.className = 'aknb-controls';
        bar.innerHTML =
            '<button class="aknb-play" aria-label="Play">▶</button>' +
            '<span class="aknb-time"><span class="aknb-cur">00:00</span>' +
            ' / <span class="aknb-dur">--:--</span></span>' +
            '<input class="aknb-seek" type="range" min="0" max="1000" step="1"' +
            ' value="0" aria-label="Seek">' +
            '<button class="aknb-mute" aria-label="Mute">MUTE</button>' +
            '<button class="aknb-theater-btn" aria-label="Theater mode">THTR</button>' +
            '<button class="aknb-fs" aria-label="Fullscreen">FULL</button>';

        var caption = fig.querySelector('figcaption');
        fig.insertBefore(bar, caption);

        var play = bar.querySelector('.aknb-play');
        var cur = bar.querySelector('.aknb-cur');
        var dur = bar.querySelector('.aknb-dur');
        var seek = bar.querySelector('.aknb-seek');
        var mute = bar.querySelector('.aknb-mute');
        var theater = bar.querySelector('.aknb-theater-btn');
        var fs = bar.querySelector('.aknb-fs');
        var scrubbing = false;

        function reflect() {
            play.textContent = video.paused ? '▶' : '❚❚';
            play.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
            mute.classList.toggle('active', video.muted);
        }

        function tick() {
            cur.textContent = fmt(video.currentTime);
            if (!scrubbing && video.duration) {
                var p = video.currentTime / video.duration;
                seek.value = Math.round(p * 1000);
                seek.style.setProperty('--p', (p * 100).toFixed(2));
            }
        }

        video.addEventListener('loadedmetadata', function () {
            dur.textContent = fmt(video.duration);
        });
        video.addEventListener('durationchange', function () {
            dur.textContent = fmt(video.duration);
        });
        video.addEventListener('timeupdate', tick);
        video.addEventListener('play', reflect);
        video.addEventListener('pause', reflect);
        video.addEventListener('volumechange', reflect);
        video.addEventListener('click', function () {
            video.paused ? video.play() : video.pause();
        });

        play.addEventListener('click', function () {
            video.paused ? video.play() : video.pause();
        });
        mute.addEventListener('click', function () {
            video.muted = !video.muted;
        });
        theater.addEventListener('click', function () {
            var on = fig.classList.toggle('aknb-theater');
            theater.classList.toggle('active', on);
        });
        fs.addEventListener('click', function () {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (fig.requestFullscreen) {
                fig.requestFullscreen();
            }
        });

        seek.addEventListener('input', function () {
            scrubbing = true;
            seek.style.setProperty('--p', (seek.value / 10).toFixed(2));
            if (video.duration) {
                cur.textContent = fmt(seek.value / 1000 * video.duration);
            }
        });
        seek.addEventListener('change', function () {
            if (video.duration) {
                video.currentTime = seek.value / 1000 * video.duration;
            }
            scrubbing = false;
        });

        fig.addEventListener('keydown', function (e) {
            if (e.target === seek) return;
            var k = e.key;
            if (k === ' ' || k === 'k') {
                e.preventDefault();
                video.paused ? video.play() : video.pause();
            } else if (k === 'ArrowLeft') {
                video.currentTime = Math.max(0, video.currentTime - 5);
            } else if (k === 'ArrowRight') {
                video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
            } else if (k === 'm') {
                video.muted = !video.muted;
            } else if (k === 't') {
                theater.click();
            } else if (k === 'f') {
                fs.click();
            }
        });
        fig.tabIndex = -1;

        reflect();
        tick();
    }

    function init() {
        document.querySelectorAll('.thought-video').forEach(enhance);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
