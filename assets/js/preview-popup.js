class PreviewPopup {
    constructor(options = {}) {
        this.options = {
            selector: '[data-preview]',
            popupClass: 'preview-popup',
            showDelay: 200,
            hideDelay: 200,
            offset: 20,
            ...options
        };
        
        this.popup = null;
        this.timeout = null;
        this.currentTarget = null;
        
        this.init();
    }
    
    init() {
        // Create popup if it doesn't exist
        if (!this.popup) {
            this.popup = this.createPopup();
            document.body.appendChild(this.popup);
        }
        
        // Add event listeners
        document.querySelectorAll(this.options.selector).forEach(element => {
            element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
        
        // Add popup event listeners
        this.popup.addEventListener('mouseenter', () => clearTimeout(this.timeout));
        this.popup.addEventListener('mouseleave', this.hidePopup.bind(this));
    }
    
    createPopup() {
        const popup = document.createElement('div');
        popup.className = this.options.popupClass;
        popup.innerHTML = `
            <div class="preview-header">
                <h3 class="preview-title"></h3>
                <time class="preview-date"></time>
            </div>
            <div class="preview-description"></div>
            <div class="preview-tags"></div>
        `;
        return popup;
    }
    
    handleMouseEnter(event) {
        clearTimeout(this.timeout);
        this.currentTarget = event.target;
        
        this.timeout = setTimeout(() => {
            this.showPopup(event.target);
        }, this.options.showDelay);
    }
    
    handleMouseLeave() {
        this.hidePopup();
    }
    
    showPopup(target) {
        // Get data from target
        const data = {
            title: target.dataset.title || '',
            date: target.dataset.date || '',
            description: target.dataset.description || '',
            tags: target.dataset.tags || ''
        };
        
        // Update popup content
        this.popup.querySelector('.preview-title').textContent = data.title;
        this.popup.querySelector('.preview-date').textContent = data.date;
        this.popup.querySelector('.preview-description').textContent = data.description;
        this.popup.querySelector('.preview-tags').textContent = data.tags ? `Tags: ${data.tags}` : '';
        
        // Position popup
        const rect = target.getBoundingClientRect();
        const popupRect = this.popup.getBoundingClientRect();
        
        let left = rect.right + this.options.offset;
        let top = rect.top;
        
        // Check right edge
        if (left + popupRect.width > window.innerWidth) {
            left = rect.left - popupRect.width - this.options.offset;
        }
        
        // Check bottom edge
        if (top + popupRect.height > window.innerHeight) {
            top = window.innerHeight - popupRect.height - this.options.offset;
        }
        
        // Show and position popup
        this.popup.style.left = `${left}px`;
        this.popup.style.top = `${top}px`;
        this.popup.style.display = 'block';
        this.popup.classList.add('fade-in');
    }
    
    hidePopup() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.popup.classList.add('fade-out');
            setTimeout(() => {
                this.popup.style.display = 'none';
                this.popup.classList.remove('fade-in', 'fade-out');
            }, 200);
        }, this.options.hideDelay);
    }
}

// Initialize with default options
document.addEventListener('DOMContentLoaded', () => {
    const previewPopup = new PreviewPopup();
}); 