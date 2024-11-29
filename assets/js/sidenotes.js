document.addEventListener('DOMContentLoaded', () => {
    console.log('Sidenotes script loaded');
    
    function processSidenotes() {
        const sidenotesContainer = document.querySelector('.sidenotes');
        const anchors = document.querySelectorAll('.essay-part[data-expanded="true"] .sidenote-anchor');
        
        console.log('Processing sidenotes:', anchors.length);
        
        // Clear existing sidenotes
        sidenotesContainer.innerHTML = '';
        
        if (anchors.length > 0) {
            anchors.forEach((anchor, index) => {
                // Store the original text BEFORE any modifications
                const originalText = anchor.textContent;
                console.log('Processing note:', originalText);
                
                // Create the sidenote with the stored text
                const sidenote = document.createElement('div');
                sidenote.className = 'sidenote';
                sidenote.innerHTML = `<sup>${index + 1}</sup> ${originalText}`;
                
                // Now modify the anchor
                anchor.textContent = '';
                const referenceNumber = document.createElement('sup');
                referenceNumber.className = 'sidenote-ref';
                referenceNumber.textContent = index + 1;
                anchor.appendChild(referenceNumber);
                
                // Position and append the sidenote
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

    // Handle part expansion/collapse
    const parts = document.querySelectorAll('.essay-part');
    parts.forEach(part => {
        const header = part.querySelector('.essay-part-header');
        header.addEventListener('click', () => {
            setTimeout(processSidenotes, 100);
        });
    });
}); 