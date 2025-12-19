/* ===================================
   AI for Game Developers 2025 Talk
   Presentation JavaScript
   =================================== */

class Presentation {
    constructor() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.detailMode = false;

        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupURLNavigation();
        this.updateUI();
        this.setupProgressiveReveals();
        this.loadFromURL();
        this.setupTouchNavigation();
        this.restoreDetailMode();
        this.buildSlideIndex();
        this.setupQuickNav();
    }

    // ===================================
    // Quick Navigation (Ctrl+O)
    // ===================================

    buildSlideIndex() {
        this.slideIndex = this.slides.map((slide, i) => {
            const num = slide.dataset.slide || (i + 1).toString();
            const section = slide.dataset.section || '';
            const h2 = slide.querySelector('h2, .section-title, h1');
            const title = h2 ? h2.textContent.trim() : '';
            return { index: i, num, section, title };
        });
    }

    setupQuickNav() {
        this.quickNav = document.getElementById('quick-nav');
        this.quickNavInput = this.quickNav?.querySelector('.quick-nav-input');
        this.quickNavResults = this.quickNav?.querySelector('.quick-nav-results');
        this.quickNavOpen = false;
        this.quickNavSelectedIndex = 0;
        this.quickNavFiltered = [];

        if (!this.quickNav) return;

        // Input filtering
        this.quickNavInput.addEventListener('input', (e) => {
            this.filterQuickNav(e.target.value);
        });

        // Backdrop click to close
        this.quickNav.querySelector('.quick-nav-backdrop').addEventListener('click', () => {
            this.closeQuickNav();
        });

        // Results click
        this.quickNavResults.addEventListener('click', (e) => {
            const item = e.target.closest('.quick-nav-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                this.goToSlide(index);
                this.closeQuickNav();
            }
        });
    }

    openQuickNav() {
        if (!this.quickNav) return;

        this.quickNavOpen = true;
        this.quickNav.classList.add('visible');
        this.quickNavInput.value = '';
        this.quickNavSelectedIndex = 0;
        this.filterQuickNav('');

        // Focus after transition
        setTimeout(() => {
            this.quickNavInput.focus();
        }, 50);
    }

    closeQuickNav() {
        if (!this.quickNav) return;

        this.quickNavOpen = false;
        this.quickNav.classList.remove('visible');
        this.quickNavInput.blur();
    }

    filterQuickNav(query) {
        const q = query.toLowerCase().trim();

        // Filter slides
        this.quickNavFiltered = this.slideIndex.filter(slide => {
            if (!q) return true;
            return slide.num.includes(q) ||
                   slide.section.toLowerCase().includes(q) ||
                   slide.title.toLowerCase().includes(q);
        });

        // Reset selection
        this.quickNavSelectedIndex = 0;

        // Render results
        this.renderQuickNavResults();
    }

    renderQuickNavResults() {
        if (this.quickNavFiltered.length === 0) {
            this.quickNavResults.innerHTML = '<div class="quick-nav-empty">No matching slides</div>';
            return;
        }

        this.quickNavResults.innerHTML = this.quickNavFiltered.map((slide, i) => {
            const isCurrent = slide.index === this.currentIndex;
            const isSelected = i === this.quickNavSelectedIndex;
            const classes = ['quick-nav-item'];
            if (isCurrent) classes.push('current');
            if (isSelected) classes.push('selected');

            return `
                <div class="${classes.join(' ')}" data-index="${slide.index}">
                    <span class="slide-num">${slide.num}</span>
                    <span class="slide-section">${slide.section}</span>
                    <span class="slide-title">${slide.title || '(untitled)'}</span>
                </div>
            `;
        }).join('');

        // Scroll selected into view
        this.scrollSelectedIntoView();
    }

    scrollSelectedIntoView() {
        const selected = this.quickNavResults.querySelector('.quick-nav-item.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' });
        }
    }

    selectQuickNavItem(direction) {
        const maxIndex = this.quickNavFiltered.length - 1;
        if (maxIndex < 0) return;

        if (direction === 'up') {
            this.quickNavSelectedIndex = this.quickNavSelectedIndex > 0
                ? this.quickNavSelectedIndex - 1
                : maxIndex;
        } else {
            this.quickNavSelectedIndex = this.quickNavSelectedIndex < maxIndex
                ? this.quickNavSelectedIndex + 1
                : 0;
        }

        this.renderQuickNavResults();
    }

    navigateToSelected() {
        if (this.quickNavFiltered.length === 0) return;

        const selected = this.quickNavFiltered[this.quickNavSelectedIndex];
        if (selected) {
            this.goToSlide(selected.index);
            this.closeQuickNav();
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Quick Nav keyboard handling (works even in input)
            if (this.quickNavOpen) {
                switch(e.key) {
                    case 'Escape':
                        e.preventDefault();
                        this.closeQuickNav();
                        return;

                    case 'ArrowUp':
                        e.preventDefault();
                        this.selectQuickNavItem('up');
                        return;

                    case 'ArrowDown':
                        e.preventDefault();
                        this.selectQuickNavItem('down');
                        return;

                    case 'Enter':
                        e.preventDefault();
                        this.navigateToSelected();
                        return;
                }
                // Allow typing in the input
                return;
            }

            // Ctrl+O to open quick nav
            if ((e.key === 'o' || e.key === 'O') && e.ctrlKey) {
                e.preventDefault();
                this.openQuickNav();
                return;
            }

            // Ignore if typing in input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.next();
                    break;

                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.previous();
                    break;

                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;

                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;

                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;

                // Detail mode disabled for now - uncomment when ready
                // case 'd':
                // case 'D':
                // case 'p':
                // case 'P':
                //     e.preventDefault();
                //     this.toggleDetailMode();
                //     break;

                case 'Escape':
                    // Reserved for future detail mode
                    break;
            }

            // Number keys for percentage-based navigation (Ctrl+0 = 0%, Ctrl+5 = 50%, etc.)
            if (e.key >= '0' && e.key <= '9' && e.ctrlKey) {
                e.preventDefault();
                const percent = parseInt(e.key) / 10;
                const targetIndex = Math.floor(percent * (this.totalSlides - 1));
                this.goToSlide(targetIndex);
            }
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    this.next();
                } else {
                    // Swipe right - previous slide
                    this.previous();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    setupURLNavigation() {
        window.addEventListener('hashchange', () => {
            this.loadFromURL();
        });

        // Update URL when slide changes
        this.updateURL = (index) => {
            const slideNumber = index + 1;
            window.history.replaceState(null, null, `#slide-${slideNumber}`);
        };
    }

    loadFromURL() {
        const hash = window.location.hash;
        if (hash.startsWith('#slide-')) {
            const slideNumber = parseInt(hash.replace('#slide-', ''));
            if (slideNumber > 0 && slideNumber <= this.totalSlides) {
                this.goToSlide(slideNumber - 1, false);
            }
        }
    }

    setupProgressiveReveals() {
        // Find all slides with progressive reveals
        this.slides.forEach((slide, slideIndex) => {
            const revealItems = slide.querySelectorAll('.reveal-item');
            if (revealItems.length > 0) {
                // Mark slide as having reveals
                slide.dataset.hasReveals = 'true';
                slide.dataset.currentReveal = '0';

                // Initially hide all reveal items
                revealItems.forEach(item => item.classList.remove('revealed'));
            }
        });
    }

    advanceReveal(slide) {
        const revealItems = slide.querySelectorAll('.reveal-item');
        if (revealItems.length === 0) return false;

        const currentReveal = parseInt(slide.dataset.currentReveal || '0');

        if (currentReveal < revealItems.length) {
            // Reveal next item
            revealItems[currentReveal].classList.add('revealed');
            slide.dataset.currentReveal = (currentReveal + 1).toString();
            return true; // Still revealing
        }

        return false; // All revealed
    }

    resetReveals(slide) {
        const revealItems = slide.querySelectorAll('.reveal-item');
        revealItems.forEach(item => item.classList.remove('revealed'));
        slide.dataset.currentReveal = '0';
    }

    next() {
        const currentSlide = this.slides[this.currentIndex];

        // Check if current slide has unrevealed items
        if (currentSlide.dataset.hasReveals === 'true') {
            const stillRevealing = this.advanceReveal(currentSlide);
            if (stillRevealing) {
                return; // Don't advance slide yet
            }
        }

        // Move to next slide
        if (this.currentIndex < this.totalSlides - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }

    previous() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }

    goToSlide(index, updateURL = true) {
        if (index < 0 || index >= this.totalSlides) return;

        // Reset reveals on current slide when leaving
        const currentSlide = this.slides[this.currentIndex];
        this.resetReveals(currentSlide);

        // Update active slide
        this.slides[this.currentIndex].classList.remove('active');
        this.currentIndex = index;
        this.slides[this.currentIndex].classList.add('active');

        // Reveal all items immediately when navigating to a slide via keyboard
        // (only progressive reveal when using space/arrow on current slide)
        const newSlide = this.slides[this.currentIndex];
        if (newSlide.dataset.hasReveals === 'true') {
            const revealItems = newSlide.querySelectorAll('.reveal-item');
            revealItems.forEach(item => item.classList.add('revealed'));
            newSlide.dataset.currentReveal = revealItems.length.toString();
        }

        this.updateUI();

        if (updateURL) {
            this.updateURL(index);
        }
    }

    updateUI() {
        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        // Update slide counter
        const currentCounter = document.querySelector('.slide-counter .current');
        const totalCounter = document.querySelector('.slide-counter .total');
        if (currentCounter) currentCounter.textContent = this.currentIndex + 1;
        if (totalCounter) totalCounter.textContent = this.totalSlides;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    toggleDetailMode() {
        this.detailMode = !this.detailMode;
        document.body.classList.toggle('detail-mode-active', this.detailMode);
        sessionStorage.setItem('detailMode', this.detailMode ? 'active' : 'inactive');
    }

    restoreDetailMode() {
        if (sessionStorage.getItem('detailMode') === 'active') {
            this.detailMode = true;
            document.body.classList.add('detail-mode-active');
        }
    }
}

// Initialize presentation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.presentation = new Presentation();
    });
} else {
    window.presentation = new Presentation();
}

// Prevent context menu on right-click during presentation
document.addEventListener('contextmenu', (e) => {
    if (!e.ctrlKey) {
        e.preventDefault();
    }
});

// Print functionality
window.addEventListener('beforeprint', () => {
    // Show all slides for printing
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
        slide.style.position = 'relative';
    });
});

// ===================================
// Diagram Tooltips
// ===================================

class DiagramTooltips {
    constructor() {
        this.tooltip = document.getElementById('diagram-tooltip');
        if (!this.tooltip) return;

        this.hoverables = document.querySelectorAll('.svg-diagram .hoverable');
        this.init();
    }

    init() {
        this.hoverables.forEach(element => {
            element.addEventListener('mouseenter', (e) => this.showTooltip(e));
            element.addEventListener('mouseleave', () => this.hideTooltip());
            element.addEventListener('mousemove', (e) => this.moveTooltip(e));
        });
    }

    showTooltip(e) {
        const target = e.currentTarget;
        const tooltipText = target.getAttribute('data-tooltip');

        if (!tooltipText) return;

        // Format the tooltip content - first line becomes the title
        const lines = tooltipText.split('\n');
        let html = '';

        if (lines[0].includes(':')) {
            // First line has a title (e.g., "PRETRAINING: description")
            const [title, ...rest] = lines[0].split(':');
            html = `<strong>${title}</strong>${rest.join(':').trim()}`;
            if (lines.length > 1) {
                html += '\n' + lines.slice(1).join('\n');
            }
        } else {
            html = tooltipText;
        }

        this.tooltip.innerHTML = html;
        this.tooltip.classList.add('visible');
        this.moveTooltip(e);
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    moveTooltip(e) {
        const svgDiagram = e.currentTarget.closest('.svg-diagram');
        const rect = svgDiagram.getBoundingClientRect();

        // Position tooltip relative to the svg-diagram container
        let x = e.clientX - rect.left + 15;
        let y = e.clientY - rect.top + 15;

        // Prevent tooltip from going off-screen right
        const tooltipWidth = this.tooltip.offsetWidth;
        if (x + tooltipWidth > rect.width) {
            x = e.clientX - rect.left - tooltipWidth - 15;
        }

        // Prevent tooltip from going off-screen bottom
        const tooltipHeight = this.tooltip.offsetHeight;
        if (y + tooltipHeight > rect.height) {
            y = e.clientY - rect.top - tooltipHeight - 15;
        }

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }
}

// Initialize tooltips when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DiagramTooltips();
    });
} else {
    new DiagramTooltips();
}
