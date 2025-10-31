// navigation.js - Simplified for hover-only desktop navigation and mobile bottom nav
class NavigationSystem {
    constructor() {
        this.pages = [
            { name: 'Home', icon: '🏠', file: 'index.html', description: 'Return to homepage' },
            { name: 'Media', icon: '📰', file: 'media.html', description: 'Browse news and media' },
            { name: 'Community', icon: '👥', file: 'community.html', description: 'View community events' },
            { name: 'Profile', icon: '👤', file: 'profile.html', description: 'Your profile' },
            { name: 'About', icon: 'ℹ️', file: 'about.html', description: 'Learn about the project' }
        ];

        this.navContainer = null;
        this.isMobile = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createNavigation());
        } else {
            this.createNavigation();
        }

        // Update navigation when viewport changes
        window.addEventListener('resize', () => {
            this.updateNavPresentation();
        });
    }

    createNavigation() {
        this.navContainer = document.getElementById('nav-container');
        if (!this.navContainer) {
            console.error('Navigation container element not found');
            return;
        }

        const html = `
            <nav id="main-nav" aria-label="Main website navigation">
                <ul class="nav-list">
                    ${this.pages.map(p => `
                        <li>
                            <a href="${p.file}" class="nav-item" data-file="${p.file}" aria-label="${p.description}">
                                <span class="nav-icon" aria-hidden="true">${p.icon}</span>
                                <span class="nav-text">${p.name}</span>
                            </a>
                        </li>`).join('')}
                </ul>
            </nav>
        `;

        this.navContainer.innerHTML = html;

        // Set initial presentation
        this.updateNavPresentation();

        // Attach event handlers
        this.attachKeyboardHandlers();
        this.setActivePage();

        console.log('Navigation created successfully');
    }

    updateNavPresentation() {
        if (!this.navContainer) return;
        
        this.isMobile = window.matchMedia('(max-width: 767px)').matches;

        // Remove all navigation classes
        this.navContainer.classList.remove('mobile-nav', 'sidebar-nav', 'expanded');

        if (this.isMobile) {
            // Mobile layout - bottom navigation
            this.navContainer.classList.add('mobile-nav');
        } else {
            // Desktop layout - sidebar navigation (hover-only)
            this.navContainer.classList.add('sidebar-nav');
        }
    }

    attachKeyboardHandlers() {
        if (!this.navContainer) return;
        const items = this.navContainer.querySelectorAll('.nav-item');
        items.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    setActivePage() {
        if (!this.navContainer) return;
        const current = window.location.pathname.split('/').pop() || 'index.html';
        const items = this.navContainer.querySelectorAll('.nav-item');
        let activeFound = false;
        
        items.forEach(i => {
            const file = i.getAttribute('data-file');
            if (file === current) {
                i.classList.add('active');
                i.setAttribute('aria-current', 'page');
                activeFound = true;
            } else {
                i.classList.remove('active');
                i.removeAttribute('aria-current');
            }
        });

        // Default to first item if no active page found
        if (!activeFound && items.length) {
            items[0].classList.add('active');
            items[0].setAttribute('aria-current', 'page');
        }
    }
}

// Initialize navigation system
const navigation = new NavigationSystem();