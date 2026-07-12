/* dither-img.js — progressive enhancement: images develop from Bayer dither to
   the true image on scroll-arrival; hr.dither / canvas.dither-rule become
   Bayer-gradient strips. Loaded with `defer`. Without JS, nothing happens
   (plain <img>, plain <hr>). Depends on window.Dither (dither.js). */
(function () {
  'use strict';

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  // ---- Images: img[data-dither] ----------------------------------------

  function developImage(img) {
    const w = Math.round(img.clientWidth || img.getBoundingClientRect().width);
    const h = Math.round(img.clientHeight || img.getBoundingClientRect().height);
    if (!w || !h) return; // not laid out; leave the plain image

    // Wrap the image so the canvas can overlay it without shifting layout.
    let wrapper = img.parentElement;
    if (!wrapper || !wrapper.classList.contains('dither-wrap')) {
      wrapper = document.createElement('span');
      wrapper.className = 'dither-wrap';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }

    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    cv.className = 'dither-canvas';
    wrapper.appendChild(cv);
    img.style.visibility = 'hidden';

    const reveal = () => {
      img.style.visibility = '';
      cv.remove();
    };

    window.Dither.develop(cv, img, { final: true, onDone: reveal });
  }

  function treatImage(img) {
    const run = () => developImage(img);
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
  }

  function observeImages() {
    const imgs = document.querySelectorAll('img[data-dither]');
    if (!imgs.length) return;

    if (!('IntersectionObserver' in window)) {
      imgs.forEach(treatImage);
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          obs.unobserve(e.target);
          treatImage(e.target);
        }
      });
    }, { threshold: 0.15 });
    imgs.forEach(img => io.observe(img));
  }

  // ---- Rules: hr.dither and canvas.dither-rule -------------------------

  function treatRule(el) {
    let cv;
    if (el.tagName === 'CANVAS') {
      cv = el;
    } else {
      // Replace the <hr> with an equivalent canvas, carrying its direction.
      cv = document.createElement('canvas');
      cv.className = 'dither-rule';
      if (el.dataset.dir) cv.dataset.dir = el.dataset.dir;
      el.replaceWith(cv);
    }

    const draw = () => {
      const width = Math.max(1, Math.round(
        cv.clientWidth || (cv.parentElement && cv.parentElement.clientWidth) || 0
      ));
      if (!width) return;
      cv.width = width;
      cv.height = 8;
      window.Dither.rule(cv, cv.dataset.dir || 'lr');
    };

    draw();
    window.Dither.onThemeChange(() => window.Dither.rule(cv, cv.dataset.dir || 'lr'));
    return draw;
  }

  function observeRules() {
    const rules = document.querySelectorAll('hr.dither, canvas.dither-rule');
    if (!rules.length) return;
    const redraws = [];
    rules.forEach(el => redraws.push(treatRule(el)));
    // Rules depend on container width; re-fit on resize.
    window.addEventListener('resize', debounce(() => {
      redraws.forEach(fn => fn());
    }, 150));
  }

  function init() {
    if (!window.Dither) return;
    observeImages();
    observeRules();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
