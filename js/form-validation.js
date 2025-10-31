

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
        
        if (this.form) {
            this.init();
        } else {
            console.log('Form element not found:', formId);
        }
    }

    init() {
        // Set up form validation when the class is created
        this.initializeFields();
        this.setupEventListeners();
        this.setupRealTimeValidation();
        
        console.log('Form validator initialized for contact form');
    }

    initializeFields() {
        // Get all form fields that need validation
        this.fields = {
            name: this.form.querySelector('#userName'),
            email: this.form.querySelector('#userEmail'),
            subject: this.form.querySelector('#userSubject'),
            message: this.form.querySelector('#userMessage')
        };
    }

    setupEventListeners() {
        // Handle form submission
        this.form.addEventListener('submit', (event) => {
            this.handleFormSubmission(event);
        });

        // Add input event listeners for real-time validation
        Object.values(this.fields).forEach(field => {
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            }
        });
    }

    setupRealTimeValidation() {
        // Set up real-time validation for email format
        if (this.fields.email) {
            this.fields.email.addEventListener('input', (event) => {
                this.validateEmailFormat(event.target);
            });
        }
    }

    handleFormSubmission(event) {
        // Prevent the form from submitting normally
        event.preventDefault();
        
        console.log('Form submission attempted');
        
        // Validate all fields
        const isValid = this.validateAllFields();
        
        if (isValid) {
            this.showSuccessState();
            this.form.reset();
            this.clearAllErrors();
        } else {
            this.showErrorState();
        }
    }

    validateAllFields() {
        // Validate each field and return overall validity
        let allValid = true;
        
        // Check required fields
        if (this.fields.name) {
            if (!this.validateRequired(this.fields.name)) {
                allValid = false;
            }
        }
        
        if (this.fields.email) {
            if (!this.validateRequired(this.fields.email) || !this.validateEmail(this.fields.email)) {
                allValid = false;
            }
        }
        
        if (this.fields.message) {
            if (!this.validateRequired(this.fields.message)) {
                allValid = false;
            }
        }
        
        return allValid;
    }

    validateField(field) {
        // Validate a single field and show appropriate feedback
        if (!field) return true;
        
        const fieldName = field.getAttribute('name') || field.id;
        let isValid = true;
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            // Field-specific validation
            switch (fieldName) {
                case 'userEmail':
                case 'email':
                    if (!this.validateEmail(field)) {
                        isValid = false;
                    }
                    break;
                    
                case 'userName':
                case 'name':
                    if (!this.validateName(field)) {
                        isValid = false;
                    }
                    break;
                    
                case 'userMessage':
                case 'message':
                    if (!this.validateMessage(field)) {
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (isValid) {
            this.showFieldSuccess(field);
        }
        
        return isValid;
    }

    validateRequired(field) {
        // Check if required field has value
        const value = field.value.trim();
        if (!value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        return true;
    }

    validateEmail(field) {
        // Validate email format
        const email = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    validateEmailFormat(field) {
        // Real-time email format validation
        const email = field.value.trim();
        
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                this.showFieldSuccess(field);
            }
        }
    }

    validateName(field) {
        // Validate name field (minimum 2 characters)
        const name = field.value.trim();
        
        if (name && name.length < 2) {
            this.showFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
        
        return true;
    }

    validateMessage(field) {
        // Validate message field (minimum 10 characters)
        const message = field.value.trim();
        
        if (message && message.length < 10) {
            this.showFieldError(field, 'Message should be at least 10 characters long');
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        // Show error message for a specific field
        this.clearFieldError(field);
        
        // Add error class to field
        field.classList.add('field-error');
        field.classList.remove('field-success');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('aria-live', 'polite');
        
        // Insert error message after the field
        field.parentNode.appendChild(errorElement);
        
        // Animate the error message
        this.animateError(errorElement);
        
        // Store the error for reference
        this.errors[field.name || field.id] = errorElement;
    }

    showFieldSuccess(field) {
        // Show success state for a valid field
        this.clearFieldError(field);
        
        field.classList.add('field-success');
        field.classList.remove('field-error');
        
        // Animate the success state
        this.animateSuccess(field);
    }

    clearFieldError(field) {
        // Remove error state from a field
        field.classList.remove('field-error');
        
        // Remove error message if it exists
        const fieldName = field.name || field.id;
        if (this.errors[fieldName]) {
            this.errors[fieldName].remove();
            delete this.errors[fieldName];
        }
    }

    clearAllErrors() {
        // Clear all error states and messages
        Object.values(this.fields).forEach(field => {
            if (field) {
                this.clearFieldError(field);
            }
        });
        
        this.errors = {};
    }

    animateError(errorElement) {
        // Animate error message appearance
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(errorElement, 
                { 
                    opacity: 0, 
                    y: -10,
                    scale: 0.8
                },
                { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.2)"
                }
            );
        }
    }

    animateSuccess(field) {
        // Animate success state
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(field,
                {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderColor: '#4CAF50'
                },
                {
                    backgroundColor: '#ffffff',
                    borderColor: '#ddd',
                    duration: 1.5,
                    ease: "power2.out"
                }
            );
        }
    }

    showSuccessState() {
        // Show overall form success state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Update button to show success
        submitButton.textContent = 'Message Sent Successfully!';
        submitButton.disabled = true;
        
        // Animate success state
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(submitButton,
                {
                    backgroundColor: '#4CAF50'
                },
                {
                    backgroundColor: '#3C7F7F',
                    duration: 0.5,
                    delay: 2,
                    onComplete: () => {
                        // Reset button after animation
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }
                }
            );
        }
        
        // Show success message
        this.showSuccessMessage();
    }

    showSuccessMessage() {
        // Display success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✓</span>
                <div class="success-text">
                    <h4>Thank You for Your Message!</h4>
                    <p>Your message has been sent successfully. I will get back to you soon.</p>
                </div>
            </div>
        `;
        
        // Insert success message before the form
        this.form.parentNode.insertBefore(successMessage, this.form);
        
        // Animate success message
        this.animateSuccessMessage(successMessage);
    }

    animateSuccessMessage(messageElement) {
        // Animate success message appearance
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(messageElement,
                {
                    opacity: 0,
                    y: -30,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.5)"
                }
            );
            
            // Remove message after 5 seconds
            gsap.delayedCall(5, () => {
                gsap.to(messageElement, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    onComplete: () => {
                        messageElement.remove();
                    }
                });
            });
        }
    }

    showErrorState() {
        // Show overall form error state
        const submitButton = this.form.querySelector('button[type="submit"]');
        
        // Shake animation for error state
        if (typeof gsap !== 'undefined') {
            gsap.to(submitButton, {
                x: 10,
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
        
        // Scroll to first error
        this.scrollToFirstError();
    }

    scrollToFirstError() {
        // Scroll to the first field with an error
        const firstErrorField = Object.values(this.fields).find(field => 
            field && field.classList.contains('field-error')
        );
        
        if (firstErrorField) {
            firstErrorField.focus();
            
            if (typeof gsap !== 'undefined') {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: { y: firstErrorField, offsetY: 100 },
                    ease: "power2.inOut"
                });
            }
        }
    }
}

// Enhanced CSS styles for form validation
const formValidationStyles = `
.field-error {
    border-color: #e74c3c !important;
    background-color: #ffeaea !important;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1) !important;
}

.field-success {
    border-color: #27ae60 !important;
    background-color: #e8f5e8 !important;
    box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1) !important;
}

.error-message {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 6px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}

.error-message::before {
    content: "⚠";
    font-size: 0.8rem;
}

.form-success-message {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
}

.success-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.success-icon {
    background: white;
    color: #27ae60;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.success-text h4 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
}

.success-text p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
}

/* Enhanced form styles */
.contact-form {
    position: relative;
}

.form-group {
    margin-bottom: 25px;
    position: relative;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #7F3C3C;
    font-size: 1rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Josefin Sans', sans-serif;
    transition: all 0.3s ease;
    background: #ffffff;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3C7F7F;
    box-shadow: 0 0 0 3px rgba(60, 127, 127, 0.1);
    background: #f8fdfd;
}

.form-group textarea {
    resize: vertical;
    min-height: 140px;
    line-height: 1.5;
}

.submit-btn {
    background: linear-gradient(135deg, #7F3C3C, #3C7F7F);
    color: white;
    border: none;
    padding: 16px 40px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    font-family: 'Josefin Sans', sans-serif;
    position: relative;
    overflow: hidden;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(127, 60, 60, 0.3);
}

.submit-btn:active {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

/* Loading animation for submit button */
.submit-btn.loading::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: button-spin 0.8s linear infinite;
}

@keyframes button-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
    .form-group input,
    .form-group textarea {
        padding: 12px 14px;
        font-size: 16px; /* Prevents zoom on iOS */
    }
    
    .submit-btn {
        padding: 14px 30px;
    }
    
    .success-content {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }
}
`;

// Inject the form validation styles
const formStyleElement = document.createElement('style');
formStyleElement.textContent = formValidationStyles;
document.head.appendChild(formStyleElement);

// Initialize form validation when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        window.formValidator = new FormValidator('contactForm');
        console.log('Form validation system ready');
    } else {
        console.log('Contact form not found on this page');
    }
});