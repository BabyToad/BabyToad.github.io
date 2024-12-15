document.addEventListener('DOMContentLoaded', () => {
    function processSidenotes() {
        const sidenotesContainer = document.querySelector('.sidenotes');
        // Look for sidenote anchors in both essay parts and regular content
        const anchors = document.querySelectorAll('.essay-content .sidenote-anchor');
        
        console.log('Processing sidenotes:', anchors.length);
        
        // Clear existing sidenotes
        if (sidenotesContainer) {
            sidenotesContainer.innerHTML = '';
            
            anchors.forEach((anchor, index) => {
                const originalText = anchor.textContent;
                console.log('Processing note:', originalText);
                
                const sidenote = document.createElement('div');
                sidenote.className = 'sidenote';
                sidenote.innerHTML = `<sup>${index + 1}</sup> ${originalText}`;
                
                anchor.textContent = '';
                const referenceNumber = document.createElement('sup');
                referenceNumber.className = 'sidenote-ref';
                referenceNumber.textContent = index + 1;
                anchor.appendChild(referenceNumber);
                
                const anchorRect = anchor.getBoundingClientRect();
                const containerRect = document.querySelector('.essay-container').getBoundingClientRect();
                const topOffset = anchorRect.top - containerRect.top;
                sidenote.style.top = `${topOffset}px`;
                sidenotesContainer.appendChild(sidenote);
            });
        }
    }

    // Process initially
    setTimeout(processSidenotes, 100);

    // Reprocess on window resize
    window.addEventListener('resize', () => {
        setTimeout(processSidenotes, 100);
    });

    // Make function available globally
    window.processSidenotes = processSidenotes;
}); 