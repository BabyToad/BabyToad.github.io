/* AKNB player — terminal instrument panel for .thought-video figures.
   Two rows: full-width timeline with movement ticks, then transport
   with volume. Chapters via data-chapters="sec:NAME,sec:NAME" on the
   <video>. Progressive enhancement; no ambient motion. */
(function () {
    'use strict';

    var VOL_KEY = 'aknb-vol';

    function fmt(t) {
        if (!isFinite(t) || t < 0) return '--:--';
        t = Math.floor(t);
        var m = Math.floor(t / 60), s = t % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function parseChapters(video) {
        var raw = video.getAttribute('data-chapters');
        if (!raw) return [];
        return raw.split(',').map(function (c) {
            var i = c.indexOf(':');
            return { t: parseFloat(c.slice(0, i)), name: c.slice(i + 1) };
        }).filter(function (c) { return isFinite(c.t); });
    }

    function enhance(fig) {
        var video = fig.querySelector('video');
        if (!video || fig.classList.contains('aknb-enhanced')) return;

        video.removeAttribute('controls');
        fig.classList.add('aknb-enhanced');

        var chapters = parseChapters(video);
        var bar = document.createElement('div');
        bar.className = 'aknb-controls';
        bar.innerHTML =
            '<div class="aknb-timeline">' +
            '<input class="aknb-seek" type="range" min="0" max="1000" step="1"' +
            ' value="0" aria-label="Seek">' +
            '<div class="aknb-ticks" aria-hidden="true"></div>' +
            '</div>' +
            '<div class="aknb-row">' +
            '<button class="aknb-play" aria-label="Play">▶</button>' +
            '<span class="aknb-time"><span class="aknb-cur">00:00</span>' +
            ' / <span class="aknb-dur">--:--</span></span>' +
            '<span class="aknb-chapter"></span>' +
            '<button class="aknb-mute" aria-label="Mute">MUTE</button>' +
            '<input class="aknb-vol" type="range" min="0" max="100" step="5"' +
            ' value="100" aria-label="Volume">' +
            '<button class="aknb-theater-btn" aria-label="Theater mode">THTR</button>' +
            '<button class="aknb-fs" aria-label="Fullscreen">FULL</button>' +
            '</div>';

        fig.insertBefore(bar, fig.querySelector('figcaption'));

        var play = bar.querySelector('.aknb-play');
        var cur = bar.querySelector('.aknb-cur');
        var dur = bar.querySelector('.aknb-dur');
        var seek = bar.querySelector('.aknb-seek');
        var ticks = bar.querySelector('.aknb-ticks');
        var chapterEl = bar.querySelector('.aknb-chapter');
        var mute = bar.querySelector('.aknb-mute');
        var vol = bar.querySelector('.aknb-vol');
        var theater = bar.querySelector('.aknb-theater-btn');
        var fs = bar.querySelector('.aknb-fs');
        var scrubbing = false;

        function drawTicks() {
            if (!video.duration || !chapters.length) return;
            ticks.innerHTML = '';
            chapters.forEach(function (c) {
                if (c.t <= 0 || c.t >= video.duration) return;
                var el = document.createElement('span');
                el.style.left = (c.t / video.duration * 100).toFixed(2) + '%';
                ticks.appendChild(el);
            });
        }

        function chapterAt(t) {
            var name = '';
            for (var i = 0; i < chapters.length; i++) {
                if (t >= chapters[i].t) name = chapters[i].name;
            }
            return name;
        }

        function setVolume(v, fromSlider) {
            video.volume = Math.min(1, Math.max(0, v));
            if (video.volume > 0 && video.muted && fromSlider) video.muted = false;
            try { localStorage.setItem(VOL_KEY, String(video.volume)); } catch (e) {}
        }

        function reflect() {
            play.textContent = video.paused ? '▶' : '❚❚';
            play.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
            mute.classList.toggle('active', video.muted);
            var v = video.muted ? 0 : video.volume * 100;
            vol.value = Math.round(v);
            vol.style.setProperty('--p', v.toFixed(0));
        }

        function tick() {
            cur.textContent = fmt(video.currentTime);
            chapterEl.textContent = chapterAt(video.currentTime);
            if (!scrubbing && video.duration) {
                var p = video.currentTime / video.duration;
                seek.value = Math.round(p * 1000);
                seek.style.setProperty('--p', (p * 100).toFixed(2));
            }
        }

        video.addEventListener('loadedmetadata', function () {
            dur.textContent = fmt(video.duration);
            drawTicks();
        });
        video.addEventListener('durationchange', function () {
            dur.textContent = fmt(video.duration);
            drawTicks();
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
        vol.addEventListener('input', function () {
            setVolume(vol.value / 100, true);
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
                var t = seek.value / 1000 * video.duration;
                cur.textContent = fmt(t);
                chapterEl.textContent = chapterAt(t);
            }
        });
        seek.addEventListener('change', function () {
            if (video.duration) {
                video.currentTime = seek.value / 1000 * video.duration;
            }
            scrubbing = false;
        });

        fig.addEventListener('keydown', function (e) {
            if (e.target === seek || e.target === vol) return;
            var k = e.key;
            if (k === ' ' || k === 'k') {
                e.preventDefault();
                video.paused ? video.play() : video.pause();
            } else if (k === 'ArrowLeft') {
                video.currentTime = Math.max(0, video.currentTime - 5);
            } else if (k === 'ArrowRight') {
                video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
            } else if (k === 'ArrowUp') {
                e.preventDefault();
                setVolume(video.volume + 0.05, true);
            } else if (k === 'ArrowDown') {
                e.preventDefault();
                setVolume(video.volume - 0.05, true);
            } else if (k === 'm') {
                video.muted = !video.muted;
            } else if (k === 't') {
                theater.click();
            } else if (k === 'f') {
                fs.click();
            }
        });
        fig.tabIndex = -1;

        try {
            var saved = parseFloat(localStorage.getItem(VOL_KEY));
            if (isFinite(saved)) video.volume = Math.min(1, Math.max(0, saved));
        } catch (e) {}

        reflect();
        tick();
        drawTicks();
        if (video.duration) dur.textContent = fmt(video.duration);
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
