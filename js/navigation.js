// navigation.js - Dynamic navigation system for South African Digital Pulse
// This creates consistent navigation across all pages as required by the brief

class NavigationSystem {
    constructor() {
        // Define navigation structure based on my design document
        this.pages = [
            { 
                name: 'Home', 
                icon: '🏠', 
                file: 'index.html',
                description: 'Return to homepage'
            },
            { 
                name: 'Media', 
                icon: '📰', 
                file: 'media.html',
                description: 'Browse news and media content'
            },
            { 
                name: 'Community', 
                icon: '👥', 
                file: 'community.html',
                description: 'View community events and discussions'
            },
            { 
                name: 'About', 
                icon: 'ℹ️', 
                file: 'about.html',
                description: 'Learn about this project'
            }
        ];
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded before creating navigation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createNavigation();
                this.setActivePage();
            });
        } else {
            // DOM already loaded
            this.createNavigation();
            this.setActivePage();
        }
    }

    createNavigation() {
        const navContainer = document.getElementById('nav-container');
        
        if (!navContainer) {
            console.error('Navigation container element not found');
            return;
        }

        // Build navigation HTML
        const navHTML = `
            <nav id="main-nav" aria-label="Main website navigation">
                <ul class="nav-list">
                    ${this.pages.map(page => `
                        <li>
                            <a href="${page.file}" class="nav-item" aria-label="${page.description}">
                                <span class="nav-icon" aria-hidden="true">${page.icon}</span>
                                <span class="nav-text">${page.name}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
        `;

        navContainer.innerHTML = navHTML;
        console.log('Navigation menu generated successfully');
    }

    setActivePage() {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop();
        const navItems = document.querySelectorAll('.nav-item');
        
        let activeFound = false;
        
        navItems.forEach(item => {
            const link = item.getAttribute('href');
            
            if (link === currentPage) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
                activeFound = true;
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });
        
        // If no active page found, highlight home
        if (!activeFound && navItems.length > 0) {
            navItems[0].classList.add('active');
            navItems[0].setAttribute('aria-current', 'page');
        }
    }
}

// Initialize navigation when script loads
const navigation = new NavigationSystem();