(function () {
    'use strict';

    function initializeAlternates(component) {
        const panels = Array.from(component.querySelectorAll('[data-image-panel]'));
        const options = Array.from(component.querySelectorAll('[data-image-index]'));

        if (panels.length < 2 || panels.length !== options.length) return;

        function selectMedia(index) {
            panels.forEach((panel, panelIndex) => {
                const active = panelIndex === index;
                panel.classList.toggle('is-active', active);
                panel.setAttribute('aria-hidden', String(!active));
                panel.toggleAttribute('inert', !active);

                if (!active && panel instanceof HTMLVideoElement) {
                    panel.pause();
                }
            });

            options.forEach((option, optionIndex) => {
                const active = optionIndex === index;
                option.classList.toggle('is-active', active);
                option.setAttribute('aria-pressed', String(active));
            });
        }

        options.forEach((option) => {
            option.addEventListener('click', () => {
                selectMedia(Number(option.dataset.imageIndex));
            });
        });

        selectMedia(0);
    }

    function initializeAll() {
        document.querySelectorAll('[data-image-alternates]').forEach(initializeAlternates);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }
})();
