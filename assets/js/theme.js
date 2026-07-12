/* theme.js — theme persistence + progressive-scan theme switch.
   Default dark; persists to localStorage. The switch runs through the View
   Transitions API (progressive top-to-bottom scan, styled in
   css/components/dither.css); browsers without it, or prefers-reduced-motion,
   switch instantly. Loaded with `defer`. To fully avoid FOUC, mirror the
   stored theme in an inline <head> snippet (see redesign report). */
(function () {
  'use strict';

  const STORAGE_KEY = 'theme';
  const DEFAULT_THEME = 'dark';
  const root = document.documentElement;

  // Apply the stored theme as early as this script runs (a head snippet is
  // still preferred to eliminate the flash entirely — see report).
  let stored;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { stored = null; }
  root.setAttribute('data-theme', stored || DEFAULT_THEME);

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reflect the active theme onto the toggle button; the CSS-only icon swap is
  // keyed on [data-theme], with [data-mode] kept for any listeners.
  function reflectButton(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.setAttribute('data-mode', theme);
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    reflectButton(theme);
  }

  function switchTheme(theme) {
    if (document.startViewTransition && !reduced()) {
      document.startViewTransition(() => applyTheme(theme));
    } else {
      applyTheme(theme);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    reflectButton(root.getAttribute('data-theme'));
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      switchTheme(current === 'light' ? 'dark' : 'light');
    });
  });

  // Exposed for other scripts / manual switching.
  window.setTheme = switchTheme;
})();
