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
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
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

            // Number keys for direct navigation
            if (e.key >= '0' && e.key <= '9' && e.ctrlKey) {
                e.preventDefault();
                const slideNum = parseInt(e.key);
                if (slideNum > 0 && slideNum <= this.totalSlides) {
                    this.goToSlide(slideNum - 1);
                }
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
