/**
 * Sidenotes Component
 * Processes sidenote anchors and creates positioned sidenotes
 */
class Sidenotes {
    constructor(options = {}) {
        this.options = {
            sidenotesSelector: '.sidenotes',
            anchorSelector: '.sidenote-anchor',
            contentSelectors: ['.essay-content', '.post-body', '.project-content'],
            sidenoteClass: 'sidenote',
            referenceClass: 'sidenote-ref',
            debug: false,
            ...options
        };

        this.sidenotesContainer = document.querySelector(this.options.sidenotesSelector);
        this.anchors = [];
        this.sidenotes = [];

        if (this.sidenotesContainer) {
            this.init();
        }
    }

    init() {
        this.findAnchors();
        this.processSidenotes();
        this.setupResizeHandler();
    }

    findAnchors() {
        // Find anchors in any of the specified content areas
        this.anchors = [];
        this.options.contentSelectors.forEach(selector => {
            const content = document.querySelector(selector);
            if (content) {
                const anchorsInContent = content.querySelectorAll(this.options.anchorSelector);
                this.anchors.push(...anchorsInContent);
            }
        });

        if (this.options.debug) {
            console.log('Found sidenote anchors:', this.anchors.length);
        }
    }

    processSidenotes() {
        if (!this.sidenotesContainer || this.anchors.length === 0) return;

        // Clear existing sidenotes
        this.sidenotesContainer.innerHTML = '';
        this.sidenotes = [];

        this.anchors.forEach((anchor, index) => {
            const noteNumber = index + 1;

            // Get original text
            let originalText = anchor.getAttribute('data-original-text');
            if (!originalText) {
                originalText = anchor.textContent.trim();
                anchor.setAttribute('data-original-text', originalText);
            }

            if (this.options.debug) {
                console.log(`Processing note ${noteNumber}:`, originalText);
            }

            // Create sidenote
            const sidenote = this.createSidenote(noteNumber, originalText);
            this.sidenotesContainer.appendChild(sidenote);
            this.sidenotes.push(sidenote);

            // Update anchor
            this.updateAnchor(anchor, noteNumber);

            // Position sidenote
            this.positionSidenote(anchor, sidenote);
        });
    }

    createSidenote(number, text) {
        const sidenote = document.createElement('div');
        sidenote.className = this.options.sidenoteClass;
        sidenote.innerHTML = `<sup>${number}</sup> ${text}`;
        return sidenote;
    }

    updateAnchor(anchor, number) {
        // Clear anchor content and add reference number
        const reference = document.createElement('sup');
        reference.className = this.options.referenceClass;
        reference.textContent = number;

        anchor.textContent = '';
        anchor.appendChild(reference);
    }

    positionSidenote(anchor, sidenote) {
        // Use requestAnimationFrame for better positioning accuracy
        requestAnimationFrame(() => {
            const anchorRect = anchor.getBoundingClientRect();
            const containerRect = this.sidenotesContainer.getBoundingClientRect();
            const topPosition = anchorRect.top - containerRect.top + window.scrollY;

            sidenote.style.top = `${Math.max(0, topPosition)}px`;

            if (this.options.debug) {
                console.log(`Positioned sidenote at ${topPosition}px`);
            }
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.processSidenotes();
            }, 100);
        });
    }

    // Public method to refresh sidenotes
    refresh() {
        this.findAnchors();
        this.processSidenotes();
    }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if sidenotes container exists
    if (document.querySelector('.sidenotes')) {
        // Delay initialization to ensure content is fully rendered
        setTimeout(() => {
            window.sidenotesInstance = new Sidenotes();
        }, 100);
    }
});

// Export for manual initialization
window.Sidenotes = Sidenotes; 