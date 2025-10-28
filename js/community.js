// community.js - Community page functionality for South African Digital Pulse
// Student: Rofhiwa Sikhweni
// This handles community events, discussions, and collaboration features

class CommunityManager {
    constructor() {
        this.events = this.getSampleEvents();
        this.discussions = this.getSampleDiscussions();
        this.collaborations = this.getSampleCollaborations();
        
        this.init();
    }

    init() {
        console.log('Community manager initialized');
        this.setupEventListeners();
        this.animateCommunityElements();
    }

    getSampleEvents() {
        // Sample community events data
        return [
            {
                id: 1,
                title: "Digital Arts Workshop: Johannesburg",
                date: "2025-02-15",
                time: "14:00 - 17:00",
                location: "Maboneng Precinct, Johannesburg",
                description: "Hands-on workshop focusing on digital illustration techniques and software tools for emerging artists.",
                category: "workshop",
                attendees: 24,
                image: this.getEventImage(1)
            },
            {
                id: 2,
                title: "Creative Tech Meetup: Cape Town",
                date: "2025-02-22", 
                time: "18:30 - 21:00",
                location: "Woodstock Exchange, Cape Town",
                description: "Networking event for digital creators, developers, and designers to share projects and collaborate.",
                category: "networking",
                attendees: 35,
                image: this.getEventImage(2)
            },
            {
                id: 3,
                title: "Online Portfolio Review Session",
                date: "2025-03-05",
                time: "19:00 - 20:30",
                location: "Virtual (Zoom)",
                description: "Get feedback on your digital portfolio from experienced industry professionals and peers.",
                category: "online",
                attendees: 15,
                image: this.getEventImage(3)
            }
        ];
    }

    getSampleDiscussions() {
        // Sample community discussions
        return [
            {
                id: 1,
                title: "Best Digital Art Tools for South African Artists",
                author: "Thando M",
                replies: 23,
                views: 156,
                lastActive: "2 hours ago",
                category: "tools",
                excerpt: "What software and hardware are you using for your digital art projects? Let's share recommendations..."
            },
            {
                id: 2,
                title: "Upcoming Exhibition Opportunities in Gauteng",
                author: "Sarah K",
                replies: 15,
                views: 89,
                lastActive: "1 day ago", 
                category: "opportunities",
                excerpt: "Compiling a list of galleries and spaces looking for digital artwork submissions..."
            },
            {
                id: 3,
                title: "Building a Sustainable Creative Career in SA",
                author: "David L",
                replies: 42,
                views: 234,
                lastActive: "3 days ago",
                category: "career",
                excerpt: "How are fellow creators building sustainable careers in the South African creative industry?"
            }
        ];
    }

    getSampleCollaborations() {
        // Sample collaboration opportunities
        return [
            {
                id: 1,
                title: "3D Artist Needed for Animation Project",
                author: "Zanele P",
                posted: "1 day ago",
                skills: ["3D Modeling", "Animation", "Blender"],
                description: "Working on a short film about South African folklore. Need a 3D artist for character modeling and animation.",
                type: "paid"
            },
            {
                id: 2,
                title: "Web Developer for Art Collective Website",
                author: "Cultural Collective",
                posted: "3 days ago",
                skills: ["HTML/CSS", "JavaScript", "UI/UX"],
                description: "Local art collective needs help building an online showcase platform for our members' work.",
                type: "volunteer"
            },
            {
                id: 3,
                title: "Sound Designer for Interactive Installation",
                author: "Innovation Lab",
                posted: "1 week ago", 
                skills: ["Sound Design", "Audio Engineering", "Interactive Media"],
                description: "Collaborate on an interactive art installation exploring urban sounds of Johannesburg.",
                type: "paid"
            }
        ];
    }

    getEventImage(eventId) {
        // Return appropriate event images
        const images = [
            'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1581094794322-7caea3019146?w=400&h=250&fit=crop'
        ];
        return images[(eventId - 1) % images.length];
    }

    setupEventListeners() {
        // Set up event registration buttons
        this.setupRegistrationHandlers();
        
        // Set up discussion interaction
        this.setupDiscussionHandlers();
        
        // Set up collaboration interest buttons
        this.setupCollaborationHandlers();
        
        // Set up view all buttons
        this.setupViewAllHandlers();
    }

    setupRegistrationHandlers() {
        // Handle event registration
        const registerButtons = document.querySelectorAll('.register-btn');
        registerButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.handleEventRegistration(event);
            });
        });
    }

    handleEventRegistration(event) {
        const button = event.target;
        const eventCard = button.closest('.event-card');
        const eventTitle = eventCard.querySelector('h3').textContent;
        
        // Toggle registration state
        if (button.textContent.includes('Register')) {
            button.textContent = 'Registered ✓';
            button.classList.add('registered');
            this.showNotification(`Successfully registered for: ${eventTitle}`);
        } else {
            button.textContent = 'Register';
            button.classList.remove('registered');
            this.showNotification(`Registration cancelled for: ${eventTitle}`);
        }
        
        // Animate the button change
        this.animateButtonFeedback(button);
    }

    setupDiscussionHandlers() {
        // Handle discussion thread interactions
        const discussionThreads = document.querySelectorAll('.discussion-thread');
        discussionThreads.forEach(thread => {
            thread.addEventListener('click', () => {
                this.showDiscussionDetails(thread);
            });
        });
    }

    showDiscussionDetails(thread) {
        const title = thread.querySelector('h3').textContent;
        this.showNotification(`Opening discussion: ${title}`);
        
        // In a real implementation, this would navigate to the discussion page
        console.log('Navigating to discussion:', title);
    }

    setupCollaborationHandlers() {
        // Handle collaboration interest
        const interestButtons = document.querySelectorAll('.interest-btn');
        interestButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.handleCollaborationInterest(event);
            });
        });
    }

    handleCollaborationInterest(event) {
        event.stopPropagation();
        const button = event.target;
        const collaboration = button.closest('.collab-opportunity');
        const title = collaboration.querySelector('h3').textContent;
        
        if (button.textContent.includes('Express Interest')) {
            button.textContent = 'Interest Expressed ✓';
            button.classList.add('interested');
            this.showNotification(`Interest expressed in: ${title}`);
        } else {
            button.textContent = 'Express Interest';
            button.classList.remove('interested');
            this.showNotification(`Interest removed from: ${title}`);
        }
        
        this.animateButtonFeedback(button);
    }

    setupViewAllHandlers() {
        // Handle view all buttons
        const viewAllButtons = document.querySelectorAll('.view-all-btn');
        viewAllButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleViewAll(button);
            });
        });
    }

    handleViewAll(button) {
        const section = button.closest('section');
        const sectionTitle = section.querySelector('h2').textContent;
        
        this.showNotification(`Loading all ${sectionTitle.toLowerCase()}...`);
        
        // Animate the button click
        this.animateButtonFeedback(button);
    }

    animateCommunityElements() {
        // Animate community page elements on load
        if (typeof gsap !== 'undefined') {
            // Stagger animation for event cards
            gsap.fromTo('.event-card', 
                {
                    x: -30,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.community-events',
                        start: 'top 80%'
                    }
                }
            );
            
            // Animation for discussion threads
            gsap.fromTo('.discussion-thread', 
                {
                    y: 25,
                    opacity: 0,
                    rotationX: 10
                },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: '.discussion-forum',
                        start: 'top 80%'
                    }
                }
            );
            
            // Animation for collaboration opportunities
            gsap.fromTo('.collab-opportunity', 
                {
                    scale: 0.8,
                    opacity: 0
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: {
                        trigger: '.collaboration-board',
                        start: 'top 80%'
                    }
                }
            );
        }
    }

    animateButtonFeedback(button) {
        // Animate button feedback
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(button,
                {
                    scale: 1.1,
                    backgroundColor: '#5FAFAF'
                },
                {
                    scale: 1,
                    backgroundColor: '',
                    duration: 0.3,
                    ease: "back.out(1.5)"
                }
            );
        }
    }

    showNotification(message) {
        // Show temporary notification
        const notification = document.createElement('div');
        notification.className = 'community-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate notification
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(notification,
                {
                    y: -50,
                    opacity: 0
                },
                {
                    y: 20,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(1.2)"
                }
            );
            
            // Remove after 3 seconds
            gsap.delayedCall(3, () => {
                gsap.to(notification, {
                    y: -50,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => notification.remove()
                });
            });
        }
    }
}

// Community page styles
const communityStyles = `
.community-notification {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #7F3C3C, #3C7F7F);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    max-width: 90%;
    text-align: center;
}

.event-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border-left: 4px solid #7F3C3C;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.event-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(127, 60, 60, 0.05), transparent);
    transition: left 0.6s ease;
}

.event-card:hover::before {
    left: 100%;
}

.event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.event-card h3 {
    color: #7F3C3C;
    margin-bottom: 10px;
    font-size: 1.3rem;
}

.event-date {
    color: #3C7F7F;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.event-date::before {
    content: '📅';
}

.event-location {
    color: #666;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.event-location::before {
    content: '📍';
}

.register-btn {
    background: #3C7F7F;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.register-btn:hover {
    background: #5FAFAF;
    transform: translateY(-2px);
}

.register-btn.registered {
    background: #27ae60;
}

.discussion-thread {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.discussion-thread:hover {
    border-color: #3C7F7F;
    box-shadow: 0 4px 15px rgba(60, 127, 127, 0.1);
    transform: translateX(5px);
}

.discussion-thread h3 {
    color: #1E1E1E;
    margin-bottom: 8px;
    font-size: 1.1rem;
}

.thread-meta {
    color: #888;
    font-size: 0.85rem;
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.collab-opportunity {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 15px;
    border-left: 4px solid #3C7F7F;
    transition: all 0.3s ease;
}

.collab-opportunity:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.collab-opportunity h3 {
    color: #7F3C3C;
    margin-bottom: 10px;
    font-size: 1.2rem;
}

.skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0;
}

.skill-tag {
    background: rgba(127, 60, 60, 0.1);
    color: #7F3C3C;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.interest-btn {
    background: transparent;
    color: #7F3C3C;
    border: 2px solid #7F3C3C;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.interest-btn:hover {
    background: #7F3C3C;
    color: white;
}

.interest-btn.interested {
    background: #7F3C3C;
    color: white;
}

.view-all-btn {
    background: linear-gradient(135deg, #7F3C3C, #3C7F7F);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 20px;
}

.view-all-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(127, 60, 60, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
    .event-card,
    .discussion-thread,
    .collab-opportunity {
        padding: 15px;
    }
    
    .thread-meta {
        flex-direction: column;
        gap: 5px;
    }
    
    .skills-list {
        gap: 6px;
    }
}
`;

// Inject community styles
const communityStyleElement = document.createElement('style');
communityStyleElement.textContent = communityStyles;
document.head.appendChild(communityStyleElement);

// Initialize community manager
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the community page
    const communitySections = document.querySelector('.community-events');
    if (communitySections) {
        window.communityManager = new CommunityManager();
        console.log('Community manager initialized');
    }
});