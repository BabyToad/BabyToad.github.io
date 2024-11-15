document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('random-quote');
    
    // Get quotes data from a data attribute we'll add to the quotes-box
    const quotesBox = document.querySelector('.quotes-box');
    const quotes = JSON.parse(quotesBox.dataset.quotes);

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function displayQuote(quote) {
        if (!quote) return;
        
        quoteElement.innerHTML = `
            <p>${quote.text}</p>
            <span class="quote-author">— ${quote.author}</span>
            ${quote.source ? `<span class="quote-source">, ${quote.source}</span>` : ''}
        `;
        quoteElement.classList.add('quote-fade');
    }

    // Add refresh button
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-quote';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.setAttribute('aria-label', 'Get new quote');
    quotesBox.appendChild(refreshButton);

    // Handle refresh click
    refreshButton.addEventListener('click', () => {
        quoteElement.classList.remove('quote-fade');
        setTimeout(() => {
            displayQuote(getRandomQuote());
        }, 300);
    });

    // Initial quote
    displayQuote(getRandomQuote());
}); 