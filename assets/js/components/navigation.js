class MobileNavigation {
    constructor() {
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.body = document.body;

        if (this.mobileToggle && this.navLinks) {
            this.init();
        }
    }

    init() {
        this.mobileToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking nav links
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navLinks.classList.contains('active');

        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navLinks.classList.add('active');
        this.mobileToggle.classList.add('active');
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});