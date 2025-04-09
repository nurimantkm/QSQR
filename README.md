# EnTalk Questions Tool Frontend

A web-based frontend application for the EnTalk Questions Tool that connects to the existing API at https://qsflow-1.onrender.com/.

## Features

- **User Authentication**: Register, login, and profile management
- **Event Management**: Browse, create, and register for English conversation events
- **AI-Powered Question Generation**: Generate tailored conversation questions using OpenAI
- **Question Management**: Save, organize, and use question sets during events
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
entalk-frontend/
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── events.html             # Events browsing and management
├── questions.html          # Question generation and management
├── profile.html            # User profile management
├── css/
│   └── styles.css          # Custom styles
└── js/
    ├── api.js              # API service for backend communication
    ├── auth.js             # Authentication module
    ├── events.js           # Events management module
    ├── questions.js        # Question generation module
    ├── profile.js          # Profile management module
    └── app.js              # Main application module
```

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Internet connection to access the API

### Installation

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Register for an account or login with existing credentials

### Deployment

To deploy this frontend to a production environment:

1. Upload all files to any static web hosting service (GitHub Pages, Netlify, Vercel)
2. Ensure the API base URL in `js/api.js` is correctly set to `https://qsflow-1.onrender.com/api`
3. Configure CORS on the backend if necessary

## API Integration

This frontend connects to the EnTalk Questions Tool API with the following endpoints:

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/me - Get current user info
- PUT /api/auth/updateprofile - Update user profile
- PUT /api/auth/updatepassword - Update user password

### Events
- GET /api/events - Get all events
- GET /api/events/:id - Get event by ID
- POST /api/events - Create a new event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event
- POST /api/events/:id/register - Register for an event
- POST /api/events/:id/cancel - Cancel registration

### Questions
- POST /api/questions/generate - Generate questions with OpenAI
- POST /api/questions/save - Save generated questions
- GET /api/questions/event/:eventId - Get questions for an event

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 for responsive design
- Font Awesome for icons
- Fetch API for AJAX requests

## License

This project is licensed under the MIT License.

## Acknowledgments

- EnTalk English Speaking Club for the concept and requirements
- OpenAI for the question generation API
