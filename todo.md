# EnTalk Questions Tool Frontend Implementation

## Progress Tracking

- [x] Analyze existing API endpoints
- [x] Create HTML frontend structure
- [x] Implement user authentication (register, login, profile)
- [x] Develop event browsing interface
- [x] Build question generation feature
- [x] Add styling and responsive design
- [ ] Test frontend-API integration
- [ ] Deploy frontend application

## API Endpoints Analysis

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/me - Get current user info (protected)
- PUT /api/auth/updateprofile - Update user profile (protected)
- PUT /api/auth/updatepassword - Update user password (protected)

### Events
- GET /api/events - Get all events (public)
- GET /api/events/:id - Get event by ID (public)
- POST /api/events - Create a new event (protected, organizer/admin only)
- PUT /api/events/:id - Update event (protected, organizer/admin only)
- DELETE /api/events/:id - Delete event (protected, organizer/admin only)
- POST /api/events/:id/register - Register for an event (protected)
- POST /api/events/:id/cancel - Cancel registration (protected)

### Questions
- POST /api/questions/generate - Generate questions with OpenAI (protected)
- POST /api/questions/save - Save generated questions (protected)
- GET /api/questions/event/:eventId - Get questions for an event (protected)
