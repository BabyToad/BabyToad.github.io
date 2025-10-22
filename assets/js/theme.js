// Apply saved theme immediately to prevent flash
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    // Function to update theme with transition
    function setTheme(theme, withTransition = true) {
        if (withTransition) {
            // Add transition class for smooth theme change
            document.body.classList.add('theme-transition');
        }

        // Set the theme
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);

        if (withTransition) {
            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        }
    }

    function updateIcon(theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Initial icon setup (theme already applied above)
    updateIcon(savedTheme);

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme, true);
    });
}); 