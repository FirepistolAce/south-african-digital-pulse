// animations.js - GSAP animations for South African Digital Pulse
// This implements the required 4+ GSAP animations per page

class PageAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
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
        const currentPage = window.location.pathname.split('/').pop();
        
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
        // ANIMATION 1: Navigation entrance animation
        this.animateNavigation();
        
        // ANIMATION 2: Page load sequence with timeline
        this.pageLoadTimeline();
        
        // ANIMATION 3: Scroll-triggered animations for sections
        this.setupScrollAnimations();
        
        // ANIMATION 4: Interactive hover animations
        this.setupHoverAnimations();
    }

    animateNavigation() {
        // Animate navigation sliding in from left
        if (typeof gsap !== 'undefined') {
            gsap.from('#main-nav', {
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }
    }

    pageLoadTimeline() {
        // GSAP Timeline for sequenced page loading animations
        const tl = gsap.timeline();
        
        // Animate main content area
        tl.from('.main-content', {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
        });
        
        // Animate page header if it exists
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            tl.from(pageHeader, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.3");
        }
        
        return tl;
    }

    setupScrollAnimations() {
        // ScrollTrigger animations for various elements
        if (typeof ScrollTrigger !== 'undefined') {
            // Animate sections as they come into view
            gsap.utils.toArray('section').forEach(section => {
                gsap.from(section, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: "play none none reverse"
                    }
                });
            });
            
            // Animate feature cards with stagger
            const featureCards = document.querySelectorAll('.feature-card');
            if (featureCards.length > 0) {
                gsap.from(featureCards, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.community-highlights',
                        start: 'top 70%',
                        toggleActions: "play none none reverse"
                    }
                });
            }
        }
    }

    setupHoverAnimations() {
        // Button hover animations
        const buttons = document.querySelectorAll('.cta-button, .view-all-btn, .submit-btn');
        buttons.forEach(button => {
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
        
        // Card hover animations
        const cards = document.querySelectorAll('.news-card, .event-card, .feature-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupHomeAnimations() {
        // Home page specific animations
        
        // ANIMATION 5: Hero section timeline
        const heroTl = gsap.timeline();
        heroTl.from('.hero-text h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        .from('.tagline', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5")
        .from('.cta-button', {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.3");
        
        // ANIMATION 6: SVG Motion Path animation
        this.animateCulturalSVG();
        
        // ANIMATION 7: Stats counter animation
        this.animateStats();
    }

    animateCulturalSVG() {
        // Motion path animation for the cultural SVG
        const motionPath = document.getElementById('cultural-path');
        const animatedDot = document.getElementById('animated-dot');
        
        if (motionPath && animatedDot && typeof gsap !== 'undefined') {
            gsap.to(animatedDot, {
                motionPath: {
                    path: motionPath,
                    align: motionPath,
                    alignOrigin: [0.5, 0.5]
                },
                duration: 8,
                repeat: -1,
                ease: "none"
            });
        }
    }

    animateStats() {
        // Animate statistics counting up
        const statItems = document.querySelectorAll('.stat-item h3');
        if (statItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
            statItems.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count')) || 100;
                
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: stat.parentElement,
                        start: 'top 80%',
                        toggleActions: "play none none reverse"
                    },
                    onUpdate: function() {
                        const value = Math.floor(parseFloat(this.targets()[0].innerText));
                        this.targets()[0].innerText = value;
                    }
                });
            });
        }
    }

    setupMediaAnimations() {
        // Media page specific animations
        if (typeof ScrollTrigger !== 'undefined') {
            // Animate filter buttons
            const filterButtons = document.querySelectorAll('.filter-btn');
            gsap.from(filterButtons, {
                x: -20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.filter-controls',
                    start: 'top 80%',
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    setupCommunityAnimations() {
        // Community page specific animations
        if (typeof ScrollTrigger !== 'undefined') {
            // Stagger animation for event cards
            const eventCards = document.querySelectorAll('.event-card');
            gsap.from(eventCards, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.community-events',
                    start: 'top 70%',
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    setupAboutAnimations() {
        // About page specific animations
        if (typeof ScrollTrigger !== 'undefined') {
            // Animate team member section
            gsap.from('.team-member', {
                x: -50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: '.team-section',
                    start: 'top 70%',
                    toggleActions: "play none none reverse"
                }
            });
            
            // Animate FAQ items
            const faqItems = document.querySelectorAll('.faq-item');
            gsap.from(faqItems, {
                y: 20,
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
}

// Initialize animations
const pageAnimations = new PageAnimations();

// Export for global access if needed
window.pageAnimations = pageAnimations;