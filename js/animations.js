class PageAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for GSAP to load and DOM to be ready
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded yet, waiting...');
            setTimeout(() => this.init(), 100);
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAnimations();
            });
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Run page-specific animations based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Common animations for all pages
        this.setupCommonAnimations();
        
        // Page-specific animations
        switch(currentPage) {
            case 'index.html':
            case '':
                this.setupHomeAnimations();
                break;
            case 'media.html':
                this.setupMediaAnimations();
                break;
            case 'community.html':
                this.setupCommunityAnimations();
                break;
            case 'about.html':
                this.setupAboutAnimations();
                break;
        }
        
        console.log('GSAP animations initialized for', currentPage);
    }

    setupCommonAnimations() {
        // ANIMATION 1: Navigation entrance animation - FIXED SELECTOR
        this.animateNavigation();
        
        // ANIMATION 2: Page load sequence with timeline
        this.pageLoadTimeline();
        
        // ANIMATION 3: Scroll-triggered animations for sections
        this.setupScrollAnimations();
        
        // ANIMATION 4: Interactive hover animations
        this.setupHoverAnimations();
    }

    animateNavigation() {
        // Animate navigation sliding in from left - FIXED: Changed #main-nav to #nav-container
        if (typeof gsap !== 'undefined') {
            gsap.from('#nav-container', {
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }
    }

    pageLoadTimeline() {
        if (typeof gsap === 'undefined') return;
        
        // GSAP Timeline for sequenced page loading animations
        const tl = gsap.timeline();
        
        // Animate main content area
        tl.from('.main-content', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out"
        });
        
        // Animate page header if it exists
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            tl.from(pageHeader, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3");
        }
        
        return tl;
    }

    setupScrollAnimations() {
        // Only initialize if ScrollTrigger is available
        if (typeof ScrollTrigger === 'undefined') {
            console.warn('ScrollTrigger not available');
            return;
        }

        // Initialize ScrollTrigger
        ScrollTrigger.refresh();

        // Animate sections as they come into view
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: "play none none reverse",
                    markers: false // Set to true for debugging
                }
            });
        });
        
        // Animate feature cards with stagger - FIXED: Check if elements exist
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
            gsap.from(featureCards, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: featureCards[0].closest('section') || '.community-highlights',
                    start: 'top 75%',
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    setupHoverAnimations() {
        // Button hover animations - FIXED: Added safety checks
        const buttons = document.querySelectorAll('.cta-button, .view-all-btn, .submit-btn, .btn');
        buttons.forEach(button => {
            if (!button) return;
            
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
        
        // Card hover animations - FIXED: Added safety checks
        const cards = document.querySelectorAll('.news-card, .event-card, .feature-card, .discussion-thread, .collab-opportunity');
        cards.forEach(card => {
            if (!card) return;
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupHomeAnimations() {
        if (typeof gsap === 'undefined') return;
        
        // Home page specific animations
        
        // ANIMATION 5: Hero section timeline - FIXED: Updated selectors for new hero structure
        const heroTl = gsap.timeline();
        
        // Animate hero elements if they exist
        const heroHeading = document.querySelector('.hero-heading');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCta = document.querySelector('.hero-cta');
        
        if (heroHeading) {
            heroTl.from(heroHeading, {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }
        
        if (heroSubtitle) {
            heroTl.from(heroSubtitle, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5");
        }
        
        if (heroCta) {
            heroTl.from(heroCta, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3");
        }
        
        // ANIMATION 6: SA Letters grid animation
        this.animateSALetters();
    }

    animateSALetters() {
        // Animate the South African letters grid
        const saLetters = document.querySelectorAll('.sa-letter');
        if (saLetters.length > 0 && typeof gsap !== 'undefined') {
            gsap.from(saLetters, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.5,
                ease: "back.out(1.7)"
            });
        }
    }

    setupMediaAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // Media page specific animations
        // Animate filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            gsap.from(filterButtons, {
                x: -30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: filterButtons[0].closest('.filter-controls') || filterButtons[0],
                    start: 'top 80%',
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    setupCommunityAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // Community page specific animations
        // Stagger animation for event cards
        const eventCards = document.querySelectorAll('.event-card');
        if (eventCards.length > 0) {
            gsap.from(eventCards, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: eventCards[0].closest('section') || '.community-events',
                    start: 'top 75%',
                    toggleActions: "play none none reverse"
                }
            });
        }
        
        // Animate discussion threads
        const discussionThreads = document.querySelectorAll('.discussion-thread');
        if (discussionThreads.length > 0) {
            gsap.from(discussionThreads, {
                x: -30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: discussionThreads[0].closest('section') || '.discussion-forum',
                    start: 'top 75%',
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    setupAboutAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // About page specific animations
        // Animate team member section
        const teamMembers = document.querySelectorAll('.team-member');
        if (teamMembers.length > 0) {
            gsap.from(teamMembers, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.team-section',
                    start: 'top 75%',
                    toggleActions: "play none none reverse"
                }
            });
        }
        
        // Animate FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length > 0) {
            gsap.from(faqItems, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.faq-section',
                    start: 'top 80%',
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    // Utility method to refresh animations when new content loads
    refreshAnimations() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
}

// Initialize animations when GSAP is ready
function initializeAnimations() {
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Initialize our animations
        window.pageAnimations = new PageAnimations();
    } else {
        // Retry after a short delay if GSAP isn't loaded yet
        setTimeout(initializeAnimations, 100);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}

// Export for global access
window.PageAnimations = PageAnimations;