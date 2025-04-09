/**
 * Participant Experience for EnTalk Questions Tool
 * Handles swipe-based question interface and feedback collection
 */

// Main Participant Module
const Participant = {
    // Current event ID
    eventId: null,
    
    // Current questions
    questions: [],
    
    // Current question index
    currentIndex: 0,
    
    // Liked questions
    likedQuestions: [],
    
    // Initialize participant experience
    init: async () => {
        try {
            console.log('Initializing EnTalk Participant Experience...');
            
            // Get event ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            Participant.eventId = urlParams.get('event');
            
            // Check if event ID is provided
            if (!Participant.eventId) {
                console.error('No event ID provided');
                Participant.showError('No event ID provided. Please scan a valid QR code.');
                return;
            }
            
            // Set up event listeners
            Participant.setupEventListeners();
            
            // Show swipe instructions initially
            const swipeInstructions = document.getElementById('swipe-instructions');
            if (swipeInstructions) {
                swipeInstructions.classList.remove('d-none');
            }
            
            console.log('EnTalk Participant Experience initialized successfully');
        } catch (error) {
            console.error('Participant initialization error:', error);
            Participant.showError('Failed to initialize. Please try again.');
        }
    },
    
    // Load questions for the event
    loadQuestions: async () => {
        try {
            // Show loading
            const loadingContainer = document.getElementById('loading-container');
            if (loadingContainer) {
                loadingContainer.classList.remove('d-none');
            }
            
            // Fetch questions from API
            const questions = await ParticipantAPI.getQuestionsForEvent(Participant.eventId);
            
            // Hide loading
            if (loadingContainer) {
                loadingContainer.classList.add('d-none');
            }
            
            // Check if questions were returned
            if (!questions || questions.length === 0) {
                Participant.showError('No questions available for this event.');
                return;
            }
            
            // Store questions
            Participant.questions = questions;
            
            // Show first question
            Participant.showQuestion(0);
            
            return questions;
        } catch (error) {
            console.error('Load questions error:', error);
            
            // Hide loading
            const loadingContainer = document.getElementById('loading-container');
            if (loadingContainer) {
                loadingContainer.classList.add('d-none');
            }
            
            Participant.showError('Failed to load questions. Please try again.');
            throw error;
        }
    },
    
    // Show a specific question
    showQuestion: (index) => {
        // Check if index is valid
        if (index < 0 || index >= Participant.questions.length) {
            Participant.showNoMoreQuestions();
            return;
        }
        
        // Get question
        const question = Participant.questions[index];
        
        // Get question container
        const questionContainer = document.getElementById('question-container');
        
        // Create question card from template
        const template = document.getElementById('question-card-template');
        if (!template) return;
        
        // Clone template
        const clone = template.content.cloneNode(true);
        
        // Set question data
        clone.querySelector('.question-text').textContent = question.question;
        
        // Set follow-up question if available
        const followUpElement = clone.querySelector('.question-follow-up');
        if (followUpElement && question.followUp) {
            followUpElement.textContent = question.followUp;
        } else if (followUpElement) {
            followUpElement.classList.add('d-none');
        }
        
        // Set difficulty badge
        const difficultyBadge = clone.querySelector('.difficulty-badge');
        if (difficultyBadge) {
            let difficultyText = 'Intermediate';
            
            if (question.difficulty === 1) {
                difficultyText = 'Beginner';
                difficultyBadge.style.backgroundColor = '#28a745';
            } else if (question.difficulty === 3) {
                difficultyText = 'Advanced';
                difficultyBadge.style.backgroundColor = '#ffc107';
                difficultyBadge.style.color = '#212529';
            }
            
            difficultyBadge.textContent = difficultyText;
        }
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'question-card';
        card.appendChild(clone);
        
        // Add card to container
        questionContainer.appendChild(card);
        
        // Set up swipe functionality
        Participant.setupSwipe(card, index);
        
        // Update current index
        Participant.currentIndex = index;
    },
    
    // Set up swipe functionality for a card
    setupSwipe: (card, index) => {
        // Create Hammer manager
        const hammer = new Hammer(card);
        
        // Configure horizontal swipe recognition
        hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        
        // Variables for tracking swipe
        let xPos = 0;
        let yPos = 0;
        let rotate = 0;
        let swiping = false;
        
        // Handle pan event
        hammer.on('pan', (e) => {
            if (!swiping) {
                swiping = true;
            }
            
            // Calculate position and rotation
            xPos = e.deltaX;
            yPos = e.deltaY;
            rotate = xPos * 0.1; // Rotate proportional to swipe distance
            
            // Apply transform
            card.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotate}deg)`;
            
            // Add swiping class based on direction
            if (xPos > 50) {
                card.classList.add('swiping-right');
                card.classList.remove('swiping-left');
            } else if (xPos < -50) {
                card.classList.add('swiping-left');
                card.classList.remove('swiping-right');
            } else {
                card.classList.remove('swiping-left', 'swiping-right');
            }
        });
        
        // Handle pan end event
        hammer.on('panend', (e) => {
            swiping = false;
            
            // Check if swipe was far enough
            if (xPos > 150) {
                // Swipe right (like)
                card.classList.add('swipe-right');
                Participant.handleSwipe(index, true);
            } else if (xPos < -150) {
                // Swipe left (dislike)
                card.classList.add('swipe-left');
                Participant.handleSwipe(index, false);
            } else {
                // Reset position
                card.style.transform = '';
                card.classList.remove('swiping-left', 'swiping-right');
            }
        });
    },
    
    // Handle swipe action
    handleSwipe: (index, liked) => {
        // Get question
        const question = Participant.questions[index];
        
        // Submit feedback
        ParticipantAPI.submitQuestionFeedback(Participant.eventId, question._id, liked);
        
        // If liked, add to liked questions
        if (liked) {
            Participant.likedQuestions.push(question);
        }
        
        // Remove card after animation completes
        setTimeout(() => {
            // Remove current card
            const questionContainer = document.getElementById('question-container');
            if (questionContainer.firstChild) {
                questionContainer.removeChild(questionContainer.firstChild);
            }
            
            // Show next question
            Participant.showQuestion(index + 1);
        }, 300);
    },
    
    // Show no more questions message
    showNoMoreQuestions: () => {
        // Get question container
        const questionContainer = document.getElementById('question-container');
        
        // Create no more questions card from template
        const template = document.getElementById('no-more-questions-template');
        if (!template) return;
        
        // Clone template
        const clone = template.content.cloneNode(true);
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'question-card no-more-card';
        card.appendChild(clone);
        
        // Add card to container
        questionContainer.appendChild(card);
        
        // Set up show feedback button
        const showFeedbackBtn = card.querySelector('#show-feedback-btn');
        if (showFeedbackBtn) {
            showFeedbackBtn.addEventListener('click', Participant.showFeedbackForm);
        }
    },
    
    // Show error message
    showError: (message) => {
        // Get question container
        const questionContainer = document.getElementById('question-container');
        
        // Create error card from template
        const template = document.getElementById('error-card-template');
        if (!template) return;
        
        // Clone template
        const clone = template.content.cloneNode(true);
        
        // Set error message
        const errorMessage = clone.querySelector('p');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'question-card error-card';
        card.appendChild(clone);
        
        // Add card to container
        questionContainer.appendChild(card);
        
        // Set up retry button
        const retryBtn = card.querySelector('#retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                // Remove error card
                questionContainer.removeChild(card);
                
                // Try loading questions again
                Participant.loadQuestions();
            });
        }
    },
    
    // Show feedback form
    showFeedbackForm: () => {
        const feedbackContainer = document.getElementById('feedback-container');
        if (feedbackContainer) {
            feedbackContainer.classList.remove('d-none');
        }
    },
    
    // Submit feedback
    submitFeedback: async (event) => {
        event.preventDefault();
        
        try {
            // Get form data
            const newWords = document.getElementById('new-words').value;
            const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
            const comments = document.getElementById('feedback-comments').value;
            
            // Prepare feedback data
            const feedbackData = {
                newWords,
                rating: parseInt(rating),
                comments,
                likedQuestions: Participant.likedQuestions.map(q => q._id)
            };
            
            // Submit feedback
            await ParticipantAPI.submitSessionFeedback(Participant.eventId, feedbackData);
            
            // Hide feedback form
            const feedbackContainer = document.getElementById('feedback-container');
            if (feedbackContainer) {
                feedbackContainer.classList.add('d-none');
            }
            
            // Show thank you message
            const thankYouContainer = document.getElementById('thank-you-container');
            if (thankYouContainer) {
                thankYouContainer.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Submit feedback error:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    },
    
    // Set up event listeners
    setupEventListeners: () => {
        // Start questions button
        const startQuestionsBtn = document.getElementById('start-questions-btn');
        if (startQuestionsBtn) {
            startQuestionsBtn.addEventListener('click', () => {
                // Hide instructions
                const swipeInstructions = document.getElementById('swipe-instructions');
                if (swipeInstructions) {
                    swipeInstructions.classList.add('d-none');
                }
                
                // Load questions
                Participant.loadQuestions();
            });
        }
        
        // Feedback form
        const feedbackForm = document.getElementById('feedback-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', Participant.submitFeedback);
        }
    }
};

// Initialize participant experience on page load
document.addEventListener('DOMContentLoaded', () => {
    Participant.init();
});

// Export Participant module
window.Participant = Participant;
