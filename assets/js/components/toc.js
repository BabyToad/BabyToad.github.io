/**
 * Simple Table of Contents Component
 * Helps readers navigate long-form content and jump to sections
 */
class TableOfContents {
    constructor(options = {}) {
        // Get heading selector from TOC element data attribute or default
        const tocElement = document.querySelector('#toc');
        const headingLevels = tocElement?.dataset.headings || 'h2';

        this.options = {
            tocSelector: '#toc',
            contentSelector: 'article, .post-content, .essay-content, .rules-content, main',
            headingSelector: headingLevels,
            minHeadings: 3,
            ...options
        };

        this.toc = document.querySelector(this.options.tocSelector);
        this.tocList = this.toc?.querySelector('ul');
        this.headings = [];
        this.tocItems = [];
        this.currentSection = null;

        if (this.toc) {
            this.init();
        }
    }

    init() {
        this.findContent();
        if (this.shouldShowTOC()) {
            this.generateTOC();
            this.setupScrollTracking();
            this.setupSmoothScrolling();
        } else {
            this.hideTOC();
        }
    }

    findContent() {
        // Try content selectors in order of preference
        const selectors = this.options.contentSelector.split(', ');
        for (const selector of selectors) {
            const content = document.querySelector(selector.trim());
            if (content) {
                this.contentArea = content;
                this.headings = Array.from(content.querySelectorAll(this.options.headingSelector));
                break;
            }
        }
    }

    shouldShowTOC() {
        return this.headings.length >= this.options.minHeadings;
    }

    hideTOC() {
        if (this.toc) {
            this.toc.style.display = 'none';
        }
    }

    generateTOC() {
        if (!this.tocList || this.headings.length === 0) return;

        // Clear existing TOC items
        this.tocList.innerHTML = '';
        this.tocItems = [];

        this.headings.forEach((heading, index) => {
            // Generate unique ID for heading
            const id = this.generateHeadingId(heading.textContent, index);
            heading.id = id;

            // Create TOC item
            const tocItem = this.createTOCItem(heading, id);
            this.tocList.appendChild(tocItem);
            this.tocItems.push(tocItem);
        });
    }

    generateHeadingId(text, index) {
        const baseId = text.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

        // Ensure uniqueness
        const id = baseId || `heading-${index}`;
        return document.getElementById(id) ? `${id}-${index}` : id;
    }

    createTOCItem(heading, id) {
        const li = document.createElement('li');
        li.className = 'toc-item';

        li.setAttribute('data-level', heading.tagName.toLowerCase());

        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';

        // Desktop: add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progress = document.createElement('div');
        progress.className = 'progress';
        progressBar.appendChild(progress);

        li.appendChild(link);
        li.appendChild(progressBar);

        return li;
    }

    setupScrollTracking() {
        if (this.headings.length === 0) return;

        const updateProgress = () => {
            this.updateTotalProgress();
            this.updateSectionProgress();
            this.highlightCurrentSection();
        };

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial update
        updateProgress();
    }

    highlightCurrentSection() {
        let current = null;
        const scrollPos = window.scrollY + 100; // Offset for better UX

        // Find the current section
        for (let i = 0; i < this.headings.length; i++) {
            if (this.headings[i].offsetTop <= scrollPos) {
                current = i;
            }
        }

        // Update highlighting
        this.tocItems.forEach((item, index) => {
            item.classList.toggle('active', index === current);
        });

        this.currentSection = current;
    }

    updateTotalProgress() {
        const totalProgress = document.getElementById('total-progress');
        if (!totalProgress) return;

        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        totalProgress.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    updateSectionProgress() {
        this.headings.forEach((heading, index) => {
            let progress = 0;

            if (index < this.headings.length - 1) {
                // Normal case: calculate progress to next heading
                const nextHeading = this.headings[index + 1];
                progress = Math.max(0, Math.min(1,
                    (window.scrollY - heading.offsetTop) /
                    (nextHeading.offsetTop - heading.offsetTop)
                )) * 100;
            } else {
                // Last section: calculate progress to end of content
                const contentEnd = this.contentArea.offsetTop + this.contentArea.offsetHeight;
                progress = Math.max(0, Math.min(1,
                    (window.scrollY - heading.offsetTop) /
                    (contentEnd - heading.offsetTop)
                )) * 100;
            }

            const progressBar = this.tocItems[index]?.querySelector('.progress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        });
    }

    setupSmoothScrolling() {
        this.tocItems.forEach(item => {
            const link = item.querySelector('.toc-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
    }

    // Public method to refresh TOC if content changes
    refresh() {
        this.init();
    }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if TOC element exists before initializing
    if (document.querySelector('#toc')) {
        window.tocInstance = new TableOfContents();
    }
});

// Export for manual initialization if needed
window.TableOfContents = TableOfContents;