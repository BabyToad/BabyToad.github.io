document.addEventListener('DOMContentLoaded', () => {
    function processSidenotes() {
        const sidenotesContainer = document.querySelector('.sidenotes');
        const anchors = document.querySelectorAll('.essay-content .sidenote-anchor');
        
        if (!sidenotesContainer || !anchors.length) return;
        
        console.log('Processing sidenotes:', anchors.length);
        sidenotesContainer.innerHTML = '';
        
        anchors.forEach((anchor, index) => {
            const noteNumber = index + 1;
            
            // Get original text, either from data attribute or current content
            let originalText = anchor.getAttribute('data-original-text');
            if (!originalText) {
                originalText = anchor.textContent;
                // Store original text for future reference
                anchor.setAttribute('data-original-text', originalText);
            }
            
            console.log(`Processing note ${noteNumber}:`, originalText);
            
            // Find the parent essay part
            const parentPart = anchor.closest('.essay-part');
            const isPartExpanded = parentPart?.getAttribute('data-expanded') === 'true';
            
            // Create and position the sidenote
            const sidenote = document.createElement('div');
            sidenote.className = 'sidenote';
            sidenote.innerHTML = `<sup>${noteNumber}</sup> ${originalText}`;
            
            // Only position and show if parent part is expanded
            if (isPartExpanded) {
                const anchorPosition = anchor.getBoundingClientRect();
                const containerPosition = sidenotesContainer.getBoundingClientRect();
                const topPosition = anchorPosition.top - containerPosition.top;
                
                console.log(`Note ${noteNumber} at position:`, topPosition);
                sidenote.style.top = `${topPosition}px`;
                sidenote.style.display = 'block';
            } else {
                sidenote.style.display = 'none';
            }
            
            sidenotesContainer.appendChild(sidenote);
            
            // Clear anchor text and add only the reference number
            const referenceNumber = document.createElement('sup');
            referenceNumber.className = 'sidenote-ref';
            referenceNumber.textContent = noteNumber;
            anchor.textContent = ''; // Clear the text
            anchor.appendChild(referenceNumber);
        });
    }

    // Handle section expansion/collapse
    document.querySelectorAll('.essay-part-header').forEach(header => {
        const part = header.closest('.essay-part');
        const content = part.querySelector('.essay-part-content');
        const icon = part.querySelector('.expand-icon');
        
        header.addEventListener('click', () => {
            const isExpanded = part.getAttribute('data-expanded') === 'true';
            part.setAttribute('data-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
            icon.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0)';
            
            // Wait for collapse animation to complete
            setTimeout(processSidenotes, 300);
        });
    });

    // Initial processing
    setTimeout(processSidenotes, 100);

    // Reprocess on resize
    window.addEventListener('resize', () => {
        setTimeout(processSidenotes, 100);
    });
    
    // Make function available globally if needed
    window.processSidenotes = processSidenotes;
}); 