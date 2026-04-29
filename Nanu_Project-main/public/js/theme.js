(function() {
    // 1. Immediately apply theme to avoid flash
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Theme Toggle Logic
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleButton();
    };

    function updateToggleButton() {
        const btn = document.getElementById('theme-toggle-btn');
        if (!btn) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        btn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
        btn.title = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }

    // 3. Inject Toggle Button and Styles
    function injectThemeElements() {
        // Add styles for the toggle button
        const style = document.createElement('style');
        style.textContent = `
            #theme-toggle-btn {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                color: var(--text-main);
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                margin-left: 10px;
            }
            #theme-toggle-btn:hover {
                transform: scale(1.1);
                border-color: var(--neon-green);
                box-shadow: var(--glow);
            }
            @media (max-width: 768px) {
                #theme-toggle-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    margin-left: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Create the button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.onclick = window.toggleTheme;
        
        // Find navbar to inject into
        const navLinks = document.querySelector('.nav-links') || 
                         document.getElementById('adminNav') || 
                         document.querySelector('aside nav');
        
        if (navLinks) {
            navLinks.appendChild(toggleBtn);
        } else {
            // Fallback for pages without standard navbar
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.top = '20px';
            toggleBtn.style.right = '20px';
            toggleBtn.style.zIndex = '9999';
            document.body.appendChild(toggleBtn);
        }
        
        updateToggleButton();
    }

    // Initialize UI elements when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectThemeElements);
    } else {
        injectThemeElements();
    }
})();
