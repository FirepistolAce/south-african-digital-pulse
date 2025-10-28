// community.js - Working Community Page Functionality
// Student: Rofhiwa Sikhweni
// This file provides complete working functionality for the community page
// Including event registration, discussion opening, and collaboration interest

class CommunityManager {
    constructor() {
        // Initialize sets to track user interactions
        this.registeredEvents = new Set(); // Tracks which events user registered for
        this.interestedCollaborations = new Set(); // Tracks collaboration interests
        this.openedDiscussions = new Set(); // Tracks opened discussions
        
        // Initialize the community manager
        this.init();
    }

    init() {
        // This method initializes all community functionality
        console.log('Community manager initialized with working functionality');
        
        // Set up event listeners and animations
        this.setupEventListeners();
        this.animateCommunityElements();
    }

    // EVENT REGISTRATION FUNCTIONALITY
    registerForEvent(eventId) {
        // This method handles event registration and unregistration
        // It toggles the registration state and provides user feedback
        
        // Find the event card and button elements
        const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        const button = eventCard.querySelector('.register-btn');
        const eventTitle = eventCard.querySelector('h3').textContent;
        
        // Check if user is already registered for this event
        if (this.registeredEvents.has(eventId)) {
            // User wants to unregister
            this.registeredEvents.delete(eventId);
            button.textContent = 'Register for Event';
            button.classList.remove('registered');
            this.showNotification(`❌ Unregistered from: ${eventTitle}`);
        } else {
            // User wants to register
            this.registeredEvents.add(eventId);
            button.textContent = 'Registered ✓';
            button.classList.add('registered');
            this.showNotification(`✅ Successfully registered for: ${eventTitle}`);
        }
        
        // Provide visual feedback for the button click
        this.animateButtonFeedback(button);
        
        // Update the attendee count display
        this.updateEventAttendeeCount(eventId);
    }

    updateEventAttendeeCount(eventId) {
        // This method simulates updating the attendee count
        // In a real application, this would connect to a backend
        
        const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        const attendeeCount = eventCard.querySelector('.attendee-count');
        
        // Extract current count from the text
        const currentCount = parseInt(attendeeCount.textContent.match(/\d+/)[0]);
        
        // Update count based on registration state
        if (this.registeredEvents.has(eventId)) {
            attendeeCount.textContent = `👥 ${currentCount + 1} attendees`;
        } else {
            attendeeCount.textContent = `👥 ${currentCount - 1} attendees`;
        }
    }

    // DISCUSSION FORUM FUNCTIONALITY
    openDiscussion(threadId) {
        // This method handles opening a discussion thread
        // It shows a modal with the discussion content
        
        const discussion = document.querySelector(`[data-thread-id="${threadId}"]`);
        const discussionTitle = discussion.querySelector('h3').textContent;
        
        // Mark discussion as opened
        this.openedDiscussions.add(threadId);
        discussion.classList.add('discussion-opened');
        
        // Show notification that discussion is opening
        this.showNotification(`📖 Opening discussion: ${discussionTitle}`);
        
        // Simulate loading time, then show modal
        setTimeout(() => {
            this.showDiscussionModal(threadId, discussionTitle);
        }, 800);
    }

    showDiscussionModal(threadId, title) {
        // This method creates and displays a modal with discussion content
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'discussion-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal" onclick="this.closest('.discussion-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="discussion-content">
                        <p><strong>Discussion Details:</strong></p>
                        <p>This modal shows how a full discussion thread would appear in the complete application. It would include:</p>
                        <ul>
                            <li>Original post content</li>
                            <li>Comments and replies from community members</li>
                            <li>User profiles and timestamps</li>
                            <li>Like and reply functionality</li>
                        </ul>
                        <p>For this demo, we're showing the interaction pattern when a user clicks on a discussion thread.</p>
                    </div>
                    <div class="comment-section">
                        <h4>Add your comment:</h4>
                        <textarea placeholder="Share your thoughts, ask questions, or provide feedback..." rows="4"></textarea>
                        <button class="post-comment-btn" onclick="communityManager.postComment(this)">Post Comment</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the page
        document.body.appendChild(modal);
        
        // Animate the modal appearance
        this.animateModalAppearance(modal);
    }

    postComment(button) {
        // This method handles posting a new comment
        // It provides feedback when the comment button is clicked
        
        const textarea = button.previousElementSibling;
        const commentText = textarea.value.trim();
        
        if (commentText) {
            this.showNotification('💬 Comment posted successfully!');
            textarea.value = ''; // Clear the textarea
        } else {
            this.showNotification('⚠️ Please enter a comment before posting.');
        }
    }

    // COLLABORATION FUNCTIONALITY
    expressInterest(collabId) {
        // This method handles expressing interest in collaboration opportunities
        // It toggles the interest state and provides user feedback
        
        const collab = document.querySelector(`[data-collab-id="${collabId}"]`);
        const button = collab.querySelector('.interest-btn');
        const collabTitle = collab.querySelector('h3').textContent;
        
        // Check if user already expressed interest
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
        
        // Provide visual feedback for the button click
        this.animateButtonFeedback(button);
    }

    // VIEW ALL BUTTON FUNCTIONALITY
    showAllEvents() {
        // This method handles the "View All Events" button click
        // It simulates loading more events
        
        this.showNotification('📅 Loading all upcoming events...');
        
        // Simulate API call delay
        setTimeout(() => {
            this.showNotification('✅ All events loaded successfully!');
            // In a real application, this would fetch and display more events
        }, 1500);
    }

    showAllDiscussions() {
        // This method handles the "View All Discussions" button click
        // It simulates loading more discussions
        
        this.showNotification('💬 Loading all community discussions...');
        
        // Simulate API call delay
        setTimeout(() => {
            this.showNotification('✅ All discussions loaded successfully!');
            // In a real application, this would fetch and display more discussions
        }, 1500);
    }

    showAllCollaborations() {
        // This method handles the "View All Opportunities" button click
        // It simulates loading more collaboration opportunities
        
        this.showNotification('🤝 Loading all collaboration opportunities...');
        
        // Simulate API call delay
        setTimeout(() => {
            this.showNotification('✅ All opportunities loaded successfully!');
            // In a real application, this would fetch and display more collaborations
        }, 1500);
    }

    // SEARCH FUNCTIONALITY FOR COMMUNITY PAGE
    setupEventListeners() {
       