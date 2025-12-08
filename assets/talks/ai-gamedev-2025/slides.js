/* ===================================
   AI for Game Developers 2025 Talk
   Presentation JavaScript
   =================================== */

class Presentation {
    constructor() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.presenterMode = false;
        this.timer = null;
        this.timerStartTime = null;
        this.timerInterval = null;

        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupURLNavigation();
        this.updateUI();
        this.setupProgressiveReveals();
        this.loadFromURL();

        // Add touch support for mobile
        this.setupTouchNavigation();
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

                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePresenterMode();
                    break;

                case 'Escape':
                    if (this.presenterMode) {
                        this.togglePresenterMode();
                    }
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

        if (this.presenterMode) {
            this.updatePresenterMode();
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

    togglePresenterMode() {
        this.presenterMode = !this.presenterMode;
        const presenterElement = document.querySelector('.presenter-mode');
        const presentationUI = document.querySelector('.presentation-ui');

        if (this.presenterMode) {
            // Enter presenter mode
            presenterElement.style.display = 'grid';
            presentationUI.style.display = 'none';
            this.updatePresenterMode();
            this.setupPresenterTimer();
        } else {
            // Exit presenter mode
            presenterElement.style.display = 'none';
            presentationUI.style.display = 'block';
            this.stopPresenterTimer();
        }
    }

    updatePresenterMode() {
        // Clone current slide to presenter view
        const currentSlide = this.slides[this.currentIndex].cloneNode(true);
        currentSlide.classList.add('active');
        const container = document.querySelector('.presenter-slide-container');
        container.innerHTML = '';
        container.appendChild(currentSlide);

        // Show next slide preview
        const nextPreview = document.querySelector('.presenter-next-preview');
        if (this.currentIndex < this.totalSlides - 1) {
            const nextSlide = this.slides[this.currentIndex + 1];
            const nextTitle = nextSlide.querySelector('h1, h2')?.textContent || 'Next slide';
            nextPreview.innerHTML = `<p>${nextTitle}</p>`;
        } else {
            nextPreview.innerHTML = '<p>End of presentation</p>';
        }

        // Show presenter notes
        const notes = this.slides[this.currentIndex].querySelector('.presenter-notes');
        const notesContent = document.querySelector('.notes-content');
        if (notes && notesContent) {
            notesContent.textContent = notes.textContent.trim();
        } else if (notesContent) {
            notesContent.textContent = 'No notes for this slide.';
        }
    }

    setupPresenterTimer() {
        const timerControl = document.querySelector('.timer-control');
        const timerDisplay = document.querySelector('.timer-display');

        if (!timerControl || !timerDisplay) return;

        timerControl.onclick = () => {
            if (this.timerInterval) {
                // Stop timer
                this.stopPresenterTimer();
                timerControl.textContent = 'Start';
            } else {
                // Start timer
                this.timerStartTime = Date.now();
                this.timerInterval = setInterval(() => {
                    const elapsed = Date.now() - this.timerStartTime;
                    const minutes = Math.floor(elapsed / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }, 1000);
                timerControl.textContent = 'Stop';
            }
        };
    }

    stopPresenterTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
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
