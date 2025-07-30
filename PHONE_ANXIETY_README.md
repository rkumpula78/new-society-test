# Phone Anxiety Support App

A calming, supportive web application designed to help users manage phone call anxiety through breathing exercises, positive affirmations, and progress tracking.

## Features

### 1. Pre-Call Preparation
- **4-7-8 Breathing Exercise**: A guided breathing technique to calm the nervous system
- **Positive Affirmations**: Curated affirmations to boost confidence before calls

### 2. During-Call Support
- **Visual Breathing Guide**: Real-time breathing indicator to maintain calm during calls
- **Calming Messages**: Rotating supportive messages and quick tips
- **Pause/Resume Control**: Ability to pause the breathing guide as needed

### 3. Post-Call Reflection
- **Anxiety Level Tracking**: Rate anxiety before and after calls (1-10 scale)
- **Journaling**: Space to reflect on the call experience
- **Progress Feedback**: See immediate anxiety reduction after calls

### 4. Progress Tracking
- **Session Statistics**: Track total sessions and exercises completed
- **Anxiety Trends**: View average anxiety levels over time
- **Achievement Levels**: Progress from Beginner to Expert based on usage
- **Motivational Messages**: Personalized encouragement based on progress

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Accessing the App

1. Open your browser and go to `http://localhost:3000`
2. Click on "Phone Anxiety Support App" from the home page
3. The app will automatically create a session for you

## Technical Details

### Backend (FastAPI)
- **In-memory storage** for MVP (replace with database for production)
- **RESTful API endpoints** for session management, exercises, and progress tracking
- **CORS enabled** for frontend communication

### Frontend (Next.js + React)
- **Mobile-responsive design** optimized for phone usage
- **Local state management** with React hooks
- **Session persistence** using localStorage
- **Styled JSX** for component-scoped styling

## API Endpoints

- `POST /api/sessions/create` - Create a new user session
- `POST /api/exercises/breathing` - Save breathing exercise data
- `POST /api/exercises/affirmation` - Save affirmation exercise data
- `POST /api/reflections` - Save post-call reflection
- `GET /api/progress/{user_id}` - Get user progress data
- `GET /api/affirmations` - Get list of affirmations

## Design Philosophy

The app uses:
- **Soft, calming colors** (purples, blues, greens)
- **Gentle animations** for breathing exercises
- **Clear, simple UI** to reduce cognitive load
- **Encouraging language** throughout the experience
- **Mobile-first design** for accessibility

## Future Enhancements

- User authentication and persistent accounts
- Database integration for data persistence
- More exercise types (progressive muscle relaxation, visualization)
- Call scheduling and reminders
- Social features for community support
- Analytics dashboard for deeper insights