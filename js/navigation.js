
class NavigationSystem {
    constructor() {
        this.pages = [
            { name: 'Home', icon: this.getHomeIcon(), file: 'index.html', description: 'Return to homepage' },
            { name: 'Media', icon: this.getImageIcon(), file: 'media.html', description: 'Browse news and media' },
            { name: 'Resources', icon: this.getBookOpenIcon(), file: 'resources.html', description: 'Learning resources and tools' },
            { name: 'Community', icon: this.getUsersIcon(), file: 'community.html', description: 'View community events' },
            { name: 'Profile', icon: this.getProfileIcon(), file: 'profile.html', description: 'Your profile' },
            { name: 'About', icon: this.getInfoIcon(), file: 'about.html', description: 'Learn about the project' }
        ];

        this.navContainer = null;
        this.isMobile = false;
        this.init();
    }

    // SVG Icons converted from Lucide React to inline SVG
    getHomeIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>`;
    }

    getImageIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>`;
    }

    getBookOpenIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>`;
    }

    getUsersIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>`;
    }

    getProfileIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>`;
    }

    getInfoIcon() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="16" y2="12"></line>
            <line x1="12" x2="12.01" y1="8" y2="8"></line>
        </svg>`;
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

        // Initial check
        this.updateNavPresentation();
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

        console.log('Navigation created successfully with SVG icons');
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

// Add CSS for SVG icons
const addSvgIconStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .nav-icon svg {
            width: 24px;
            height: 24px;
            transition: all 0.3s ease;
        }
        
        .nav-item.active .nav-icon svg {
            color: var(--text-light);
        }
        
        .nav-item:hover .nav-icon svg {
            transform: scale(1.1);
        }
        
        /* Mobile adjustments for SVG icons */
        .mobile-nav .nav-icon svg {
            width: 20px;
            height: 20px;
        }
    `;
    document.head.appendChild(style);
};

// Initialize navigation system
const initializeNavigation = () => {
    // Add SVG icon styles
    addSvgIconStyles();
    
    // Initialize navigation
    const navigation = new NavigationSystem();
};

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}