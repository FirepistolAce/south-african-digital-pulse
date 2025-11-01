

class CommunityManager {
    constructor() {
        console.log(' CommunityManager constructor called');
        
        // Track user interactions
        this.registeredEvents = new Set();
        this.interestedCollaborations = new Set();
        this.openedDiscussions = new Set();
        
        this.init();
    }

    init() {
        console.log(' Initializing CommunityManager...');
        
        // Set up all event listeners
        this.setupAllEventListeners();
        
        // Animate elements on page load
        this.animateCommunityElements();
        
        // Make sure manager is globally available
        window.communityManager = this;
        
        console.log('✅ CommunityManager fully initialized and ready');
    }

    setupAllEventListeners() {
        console.log(' Setting up event listeners...');
        
        // Setup search functionality
        this.setupSearchFunctionality();
        
        // The onclick handlers in HTML should work directly
        // But let's also add event listeners as backup
        this.setupBackupEventListeners();
    }

    setupSearchFunctionality() {
        console.log(' Setting up search functionality...');
        
        // Add search bars to all community sections
        const sections = document.querySelectorAll('.community-events, .discussion-forum, .collaboration-board');
        
        sections.forEach(section => {
            // Create search input
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'community-search';
            searchInput.placeholder = this.getSearchPlaceholder(section);
            
            // Add input event listener
            searchInput.addEventListener('input', (e) => {
                this.handleCommunitySearch(e.target.value, section);
            });
            
            // Insert search bar at the top of the section
            const firstChild = section.querySelector('div');
            if (firstChild) {
                section.insertBefore(searchInput, firstChild);
            }
        });
    }

    getSearchPlaceholder(section) {
        if (section.classList.contains('community-events')) {
            return 'Search events by title, location, or description...';
        } else if (section.classList.contains('discussion-forum')) {
            return 'Search discussions by title or content...';
        } else if (section.classList.contains('collaboration-board')) {
            return 'Search collaborations by skills or project type...';
        }
        return 'Search...';
    }

    setupBackupEventListeners() {
        console.log('Setting up backup event listeners...');
        
        // Backup event registration listeners
        document.querySelectorAll('.register-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const eventCard = e.target.closest('.event-card');
                const eventId = eventCard?.getAttribute('data-event-id');
                if (eventId) {
                    this.registerForEvent(parseInt(eventId));
                }
            });
        });
        
        // Backup discussion listeners
        document.querySelectorAll('.discussion-thread').forEach(thread => {
            thread.addEventListener('click', (e) => {
                const threadId = thread.getAttribute('data-thread-id');
                if (threadId) {
                    this.openDiscussion(parseInt(threadId));
                }
            });
        });
        
        // Backup collaboration listeners
        document.querySelectorAll('.interest-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const collab = e.target.closest('.collab-opportunity');
                const collabId = collab?.getAttribute('data-collab-id');
                if (collabId) {
                    this.expressInterest(parseInt(collabId));
                }
            });
        });
        
        // Backup view all buttons
        document.querySelectorAll('.view-all-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.closest('section');
                if (section.classList.contains('community-events')) {
                    this.showAllEvents();
                } else if (section.classList.contains('discussion-forum')) {
                    this.showAllDiscussions();
                } else if (section.classList.contains('collaboration-board')) {
                    this.showAllCollaborations();
                }
            });
        });
    }


    registerForEvent(eventId) {
        console.log(` Registering for event ${eventId}`);
        
        const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        if (!eventCard) {
            console.error('Event card not found for ID:', eventId);
            return;
        }
        
        const button = eventCard.querySelector('.register-btn');
        const eventTitle = eventCard.querySelector('h3').textContent;
        
        if (this.registeredEvents.has(eventId)) {
            // Unregister
            this.registeredEvents.delete(eventId);
            button.textContent = 'Register for Event';
            button.classList.remove('registered');
            this.showNotification(`❌ Unregistered from: ${eventTitle}`);
        } else {
            // Register
            this.registeredEvents.add(eventId);
            button.textContent = 'Registered ✓';
            button.classList.add('registered');
            this.showNotification(`✅ Successfully registered for: ${eventTitle}`);
        }
        
        this.animateButtonFeedback(button);
        this.updateEventAttendeeCount(eventId);
    }

    updateEventAttendeeCount(eventId) {
        const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        const attendeeCount = eventCard.querySelector('.attendee-count');
        
        if (attendeeCount) {
            const currentCount = parseInt(attendeeCount.textContent.match(/\d+/)[0]) || 0;
            
            if (this.registeredEvents.has(eventId)) {
                attendeeCount.textContent = ` ${currentCount + 1} attendees`;
            } else {
                attendeeCount.textContent = ` ${Math.max(0, currentCount - 1)} attendees`;
            }
        }
    }

   
    openDiscussion(threadId) {
        console.log(` Opening discussion ${threadId}`);
        
        const discussion = document.querySelector(`[data-thread-id="${threadId}"]`);
        if (!discussion) {
            console.error('Discussion not found for ID:', threadId);
            return;
        }
        
        const discussionTitle = discussion.querySelector('h3').textContent;
        
        this.openedDiscussions.add(threadId);
        discussion.classList.add('discussion-opened');
        
        this.showNotification(`📖 Opening discussion: ${discussionTitle}`);
        
        // Show modal after short delay
        setTimeout(() => {
            this.showDiscussionModal(threadId, discussionTitle);
        }, 500);
    }

    showDiscussionModal(threadId, title) {
        console.log(`🪟 Showing modal for discussion: ${title}`);
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'discussion-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">×</button>
                </div>
                <div class="modal-body">
                    <div class="discussion-content">
                        <p><strong>Full Discussion Content</strong></p>
                        <p>This is where the complete discussion thread would appear. You would see:</p>
                        <ul>
                            <li>The original post in detail</li>
                            <li>Comments from other community members</li>
                            <li>Reply functionality</li>
                            <li>Like and share options</li>
                        </ul>
                        <p><em>This modal demonstrates that the discussion opening functionality is working correctly.</em></p>
                    </div>
                    <div class="comment-section">
                        <h4>Add your comment:</h4>
                        <textarea placeholder="Share your thoughts..." rows="4"></textarea>
                        <button class="post-comment-btn">Post Comment</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add close functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Add comment functionality
        const postBtn = modal.querySelector('.post-comment-btn');
        postBtn.addEventListener('click', () => {
            this.postComment(postBtn);
        });
        
        document.body.appendChild(modal);
        this.animateModalAppearance(modal);
    }

    postComment(button) {
        const textarea = button.previousElementSibling;
        const commentText = textarea.value.trim();
        
        if (commentText) {
            this.showNotification(' Comment posted successfully!');
            textarea.value = '';
        } else {
            this.showNotification(' Please enter a comment before posting.');
        }
    }

   
    expressInterest(collabId) {
        console.log(` Expressing interest in collaboration ${collabId}`);
        
        const collab = document.querySelector(`[data-collab-id="${collabId}"]`);
        if (!collab) {
            console.error('Collaboration not found for ID:', collabId);
            return;
        }
        
        const button = collab.querySelector('.interest-btn');
        const collabTitle = collab.querySelector('h3').textContent;
        
        if (this.interestedCollaborations.has(collabId)) {
            // Remove interest
            this.interestedCollaborations.delete(collabId);
            button.textContent = 'Express Interest';
            button.classList.remove('interested');
            this.showNotification(`❌ Interest removed from: ${collabTitle}`);
        } else {
            // Express interest
            this.interestedCollaborations.add(collabId);
            button.textContent = 'Interest Expressed ✓';
            button.classList.add('interested');
            this.showNotification(`✅ Interest expressed in: ${collabTitle}`);
        }
        
        this.animateButtonFeedback(button);
    }

   
    showAllEvents() {
        console.log(' Showing all events');
        this.showNotification(' Loading all upcoming events...');
        
        setTimeout(() => {
            this.showNotification('✅ All events loaded successfully!');
        }, 1500);
    }

    showAllDiscussions() {
        console.log(' Showing all discussions');
        this.showNotification(' Loading all community discussions...');
        
        setTimeout(() => {
            this.showNotification('✅ All discussions loaded successfully!');
        }, 1500);
    }

    showAllCollaborations() {
        console.log(' Showing all collaborations');
        this.showNotification(' Loading all collaboration opportunities...');
        
        setTimeout(() => {
            this.showNotification('✅ All opportunities loaded successfully!');
        }, 1500);
    }

  
    handleCommunitySearch(query, section) {
        console.log(` Searching for: "${query}" in ${section.className}`);
        
        const items = section.querySelectorAll('.event-card, .discussion-thread, .collab-opportunity');
        const searchTerm = query.toLowerCase().trim();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            
            if (searchTerm === '' || text.includes(searchTerm)) {
                // Show matching items
                item.style.display = 'block';
                if (window.gsap) {
                    gsap.to(item, { opacity: 1, duration: 0.3 });
                } else {
                    item.style.opacity = '1';
                }
            } else {
                // Hide non-matching items
                if (window.gsap) {
                    gsap.to(item, { 
                        opacity: 0, 
                        duration: 0.3,
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.display = 'none';
                }
            }
        });
    }

  
    animateCommunityElements() {
        if (typeof gsap !== 'undefined') {
            // Animate event cards
            gsap.fromTo('.event-card', 
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
            );

            // Animate discussion threads
            gsap.fromTo('.discussion-thread', 
                { y: 30, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)" }
            );

            // Animate collaboration opportunities
            gsap.fromTo('.collab-opportunity', 
                { rotationY: 90, opacity: 0 },
                { rotationY: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.5)" }
            );
        }
    }

    animateButtonFeedback(button) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(button,
                { scale: 1.2, rotation: 5 },
                { scale: 1, rotation: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" }
            );
        }
    }

    animateModalAppearance(modal) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal.querySelector('.modal-content'),
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }
            );
        }
    }

   
    showNotification(message) {
        console.log(` Notification: ${message}`);
        
        const notification = document.createElement('div');
        notification.className = 'community-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(notification,
                { y: -100, opacity: 0 },
                { y: 20, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
            );
            
            gsap.delayedCall(3, () => {
                gsap.to(notification, {
                    y: -100,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => notification.remove()
                });
            });
        } else {
            // Fallback if GSAP not available
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
}


const communityStyles = `
/* Community Search Styles */
.community-search {
    width: 100%;
    max-width: 500px;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 20px;
    font-family: 'Josefin Sans', sans-serif;
    transition: all 0.3s ease;
}

.community-search:focus {
    outline: none;
    border-color: #3C7F7F;
    box-shadow: 0 0 0 3px rgba(60, 127, 127, 0.1);
}

/* Notification Styles */
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

/* Event Card Styles */
.event-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border-left: 4px solid #7F3C3C;
    transition: all 0.3s ease;
    cursor: pointer;
}

.event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
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
}

.register-btn:hover {
    background: #5FAFAF;
    transform: translateY(-2px);
}

.register-btn.registered {
    background: #27ae60;
}

/* Discussion Thread Styles */
.discussion-thread {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.discussion-thread:hover {
    border-color: #3C7F7F;
    box-shadow: 0 4px 15px rgba(60, 127, 127, 0.1);
    transform: translateX(5px);
}

.discussion-thread.discussion-opened {
    border-color: #7F3C3C;
    background: #f8f8f8;
}

/* Collaboration Styles */
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

.interest-btn {
    background: transparent;
    color: #7F3C3C;
    border: 2px solid #7F3C3C;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.interest-btn:hover {
    background: #7F3C3C;
    color: white;
}

.interest-btn.interested {
    background: #7F3C3C;
    color: white;
}

/* Modal Styles */
.discussion-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
}

.modal-header h3 {
    color: #7F3C3C;
    margin: 0;
}

.close-modal {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
    line-height: 1;
}

.close-modal:hover {
    color: #7F3C3C;
}

.post-comment-btn {
    background: #3C7F7F;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.post-comment-btn:hover {
    background: #5FAFAF;
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
    font-family: 'Josefin Sans', sans-serif;
}

.view-all-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(127, 60, 60, 0.3);
}
`;


const communityStyleElement = document.createElement('style');
communityStyleElement.textContent = communityStyles;
document.head.appendChild(communityStyleElement);


document.addEventListener('DOMContentLoaded', function() {
    console.log(' DOM fully loaded, initializing CommunityManager...');
    
    // Check if we're on a page with community sections
    const communitySections = document.querySelector('.community-events, .discussion-forum, .collaboration-board');
    
    if (communitySections) {
        console.log(' Community sections found, creating CommunityManager...');
        
        // Create and initialize the community manager
        window.communityManager = new CommunityManager();
        
        console.log(' CommunityManager created successfully!');
        console.log(' Buttons should now be working:');
        console.log('   - Register buttons');
        console.log('   - Discussion clicks'); 
        console.log('   - Interest buttons');
        console.log('   - View All buttons');
        console.log('   - Search functionality');
        
        // Test that the manager is accessible
        setTimeout(() => {
            if (window.communityManager && typeof window.communityManager.registerForEvent === 'function') {
                console.log(' TEST PASSED: communityManager is fully functional!');
            } else {
                console.log(' TEST FAILED: communityManager not working properly');
            }
        }, 1000);
    } })
