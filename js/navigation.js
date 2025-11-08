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

    // ===== SVG Icons =====
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

    // ===== Initialization =====
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createNavigation());
        } else {
            this.createNavigation();
        }

        window.addEventListener('resize', () => this.updateNavPresentation());
        this.updateNavPresentation();
    }

    createNavigation() {
        this.navContainer = document.getElementById('nav-container');
        if (!this.navContainer) {
            console.error('Navigation container not found');
            return;
        }

        const html = `
            <nav id="main-nav" aria-label="Main navigation">
                <ul class="nav-list">
                    ${this.pages.map(p => `
                        <li class="nav-li">
                            <a href="${p.file}" class="nav-item" data-file="${p.file}" aria-label="${p.description}">
                                <span class="nav-icon">${p.icon}</span>
                                <span class="nav-text">${p.name}</span>
                            </a>
                        </li>`).join('')}
                </ul>
            </nav>
        `;

        this.navContainer.innerHTML = html;
        this.updateNavPresentation();
        this.attachKeyboardHandlers();
        this.setActivePage();
    }

    updateNavPresentation() {
        if (!this.navContainer) return;
        this.isMobile = window.matchMedia('(max-width: 767px)').matches;
        this.navContainer.classList.remove('mobile-nav', 'sidebar-nav');

        if (this.isMobile) {
            this.navContainer.classList.add('mobile-nav');
        } else {
            this.navContainer.classList.add('sidebar-nav');
        }

        // --- Ensure horizontal fit for mobile ---
        const navList = this.navContainer.querySelector('.nav-list');
        if (this.isMobile) {
            navList.style.display = 'flex';
            navList.style.flexDirection = 'row';
            navList.style.flexWrap = 'nowrap';
            navList.style.justifyContent = 'space-around';
            navList.style.alignItems = 'center';
            navList.style.width = '100%';
            navList.style.overflowX = 'hidden';
        } else {
            navList.removeAttribute('style');
        }
    }

    attachKeyboardHandlers() {
        const items = this.navContainer?.querySelectorAll('.nav-item') || [];
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
        const current = window.location.pathname.split('/').pop() || 'index.html';
        const items = this.navContainer?.querySelectorAll('.nav-item') || [];
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

        if (!activeFound && items.length) {
            items[0].classList.add('active');
            items[0].setAttribute('aria-current', 'page');
        }
    }
}

// === Inline SVG styling ===
const addSvgIconStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .nav-icon svg {
            width: 22px;
            height: 22px;
            transition: transform 0.3s ease;
        }

        .nav-item.active .nav-icon svg {
            color: var(--text-light);
        }

        .nav-item:hover .nav-icon svg {
            transform: scale(1.1);
        }

        /* Force single row on mobile */
        .mobile-nav .nav-list {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: space-evenly !important;
            align-items: center !important;
            gap: 0 !important;
        }

        .mobile-nav .nav-li {
            flex: 1 1 auto !important;
            text-align: center !important;
        }

        .mobile-nav .nav-item {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            font-size: 0.75rem !important;
            padding: 0.25rem 0 !important;
        }

        .mobile-nav .nav-icon {
            margin: 0;
        }
    `;
    document.head.appendChild(style);
};

const initializeNavigation = () => {
    addSvgIconStyles();
    new NavigationSystem();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}
