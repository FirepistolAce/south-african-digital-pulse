// navigation.js - Fixed responsive nav (prevents accidental hover expansion, supports horizontal mobile bar)

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
        this._pointerEnterHandler = null;
        this._pointerLeaveHandler = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createNavigation());
        } else {
            this.createNavigation();
        }

        // Keep nav presentation accurate if viewport size changes
        window.addEventListener('resize', () => {
            this.updateNavPresentation();
            this.setupPointerExpansion(); // rebind pointer handlers for the current mode
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

        // Initial presentation: set mobile or sidebar class
        this.updateNavPresentation();

        // Accessibility and keyboard handling
        this.attachKeyboardHandlers();

        // Mark active page
        this.setActivePage();

        // Setup pointer enter/leave behavior (desktop only)
        this.setupPointerExpansion();

        console.log('Navigation created');
    }

    updateNavPresentation() {
        if (!this.navContainer) return;
        const isMobile = window.matchMedia('(max-width: 767px)').matches;

        // Remove both classes then add correct one
        this.navContainer.classList.remove('mobile-nav', 'sidebar-nav', 'expanded');

        if (isMobile) {
            this.navContainer.classList.add('mobile-nav');
            // On mobile we want horizontal bar with labels visible - CSS handles that
        } else {
            this.navContainer.classList.add('sidebar-nav');
            // do not auto-expand; expansion will occur on pointerenter only
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

        if (!activeFound && items.length) {
            items[0].classList.add('active');
            items[0].setAttribute('aria-current', 'page');
        }
    }

    setupPointerExpansion() {
        if (!this.navContainer) return;

        // remove previous handlers if they exist
        if (this._pointerEnterHandler) {
            this.navContainer.removeEventListener('pointerenter', this._pointerEnterHandler);
        }
        if (this._pointerLeaveHandler) {
            this.navContainer.removeEventListener('pointerleave', this._pointerLeaveHandler);
        }

        // Only set pointer handlers on desktop (non-mobile)
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        if (isMobile) {
            // Ensure expanded class is not present on mobile (mobile uses different layout)
            this.navContainer.classList.remove('expanded');
            return;
        }

        // Pointer enter: expand nav (only when pointer truly enters)
        this._pointerEnterHandler = (e) => {
            // Guard: ignore if this event came from a child entering — only expand if the nav itself or its immediate content is entered.
            // pointerenter is sufficient: it fires when entering the element.
            this.navContainer.classList.add('expanded');
        };

        // Pointer leave: collapse nav
        this._pointerLeaveHandler = (e) => {
            // Collapse when pointer leaves the nav container
            this.navContainer.classList.remove('expanded');
        };

        this.navContainer.addEventListener('pointerenter', this._pointerEnterHandler);
        this.navContainer.addEventListener('pointerleave', this._pointerLeaveHandler);

        // Prevent touch interactions expanding nav accidentally
        this.navContainer.addEventListener('touchstart', () => {
            this.navContainer.classList.remove('expanded');
        }, { passive: true });
    }
}

// Initialize navigation when script loads
const navigation = new NavigationSystem();
