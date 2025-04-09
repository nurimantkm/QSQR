/**
 * Participant API Service for EnTalk Questions Tool
 * Handles API requests for the participant experience
 */

// API Base URL
const API_BASE_URL = 'https://qsflow-1.onrender.com/api';

// Participant API Service
const ParticipantAPI = {
    // Get questions for an event
    getQuestionsForEvent: async (eventId) => {
        try {
            // For public access, we don't require authentication for this endpoint
            const response = await fetch(`${API_BASE_URL}/questions/event/${eventId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch questions');
            }
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    },
    
    // Submit question feedback
    submitQuestionFeedback: async (eventId, questionId, liked) => {
        try {
            // Create a unique participant ID if not exists
            let participantId = localStorage.getItem('entalk_participant_id');
            if (!participantId) {
                participantId = 'participant_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('entalk_participant_id', participantId);
            }
            
            const response = await fetch(`${API_BASE_URL}/questions/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventId,
                    questionId,
                    participantId,
                    liked
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit question feedback');
            }
            
            return true;
        } catch (error) {
            console.error('Error submitting question feedback:', error);
            // Don't throw error for feedback submission to prevent disrupting the user experience
            return false;
        }
    },
    
    // Submit session feedback
    submitSessionFeedback: async (eventId, feedbackData) => {
        try {
            // Get participant ID
            let participantId = localStorage.getItem('entalk_participant_id');
            if (!participantId) {
                participantId = 'participant_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('entalk_participant_id', participantId);
            }
            
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participantId,
                    ...feedbackData
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit session feedback');
            }
            
            return true;
        } catch (error) {
            console.error('Error submitting session feedback:', error);
            throw error;
        }
    },
    
    // Get event details
    getEventDetails: async (eventId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch event details');
            }
            
            const data = await response.json();
            return data.data || null;
        } catch (error) {
            console.error('Error fetching event details:', error);
            throw error;
        }
    }
};

// Export the API object
window.ParticipantAPI = ParticipantAPI;
