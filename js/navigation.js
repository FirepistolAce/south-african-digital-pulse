// navigation.js - Responsive navigation (desktop sidebar + mobile bottom bar)
// Generates nav into #nav-container and manages active state
// Keeps selectors consistent with existing CSS: #nav-container, .nav-list, .nav-item, .nav-icon, .nav-text

class NavigationSystem {
  constructor() {
    this.pages = [
      { name: 'Home', icon: '🏠', file: 'index.html', description: 'Return to homepage' },
      { name: 'Media', icon: '📰', file: 'media.html', description: 'Browse media & content' },
      { name: 'Community', icon: '👥', file: 'community.html', description: 'Community hub & events' },
      { name: 'About', icon: 'ℹ️', file: 'about.html', description: 'About this project' },
      { name: 'Profile', icon: '👤', file: 'profile.html', description: 'View your profile' }
    ];

    this.container = document.getElementById('nav-container');
    this.init();
  }

  init() {
    if (!this.container) {
      console.error('Navigation container not found (#nav-container).');
      return;
    }

    // Build and attach markup
    this.createNavigation();

    // Set active link
    this.setActivePage();

    // Keyboard accessibility: allow navigation via arrow keys when focused
    this.addKeyboardSupport();

    // Update active state on history navigation
    window.addEventListener('popstate', () => this.setActivePage());
  }

  createNavigation() {
    // Build nav markup with semantic nav element
    const nav = document.createElement('nav');
    nav.id = 'main-nav';
    nav.setAttribute('aria-label', 'Main website navigation');

    // Create list container
    const ul = document.createElement('ul');
    ul.className = 'nav-list';

    // Build list items
    this.pages.forEach(page => {
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.className = 'nav-item';
      a.href = page.file;
      a.setAttribute('aria-label', page.description);

      // Icon span (keeps visual icon)
      const icon = document.createElement('span');
      icon.className = 'nav-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = page.icon;

      // Text label
      const text = document.createElement('span');
      text.className = 'nav-text';
      text.textContent = page.name;

      a.appendChild(icon);
      a.appendChild(text);
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);

    // Add an invisible skip link for accessibility (skip nav)
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link visually-hidden';
    skipLink.href = '#content';
    skipLink.textContent = 'Skip to main content';
    this.container.appendChild(skipLink);

    this.container.appendChild(nav);
  }

  setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const items = this.container.querySelectorAll('.nav-item');

    let found = false;
    items.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage || (href === 'index.html' && currentPage === '')) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
        found = true;
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });

    // If none matched (e.g. server paths), fall back to first
    if (!found && items.length) {
      items[0].classList.add('active');
      items[0].setAttribute('aria-current', 'page');
    }
  }

  addKeyboardSupport() {
    // Enable arrow key navigation when focus is within nav-list
    const ul = this.container.querySelector('.nav-list');
    if (!ul) return;

    ul.addEventListener('keydown', (e) => {
      const focusable = Array.from(ul.querySelectorAll('.nav-item'));
      const idx = focusable.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = focusable[(idx + 1) % focusable.length];
        next.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
        prev.focus();
      }
    });

    // Make nav-items focusable (for keyboard)
    ul.querySelectorAll('.nav-item').forEach(a => a.setAttribute('tabindex', '0'));
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavigationSystem());
} else {
  new NavigationSystem();
}
