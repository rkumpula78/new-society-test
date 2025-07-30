# Phone Anxiety Practice App MVP

A supportive web application designed to help users overcome phone anxiety through guided practice sessions in a safe, encouraging environment.

## Features

- **Practice Scenarios**: Multiple real-life phone call scenarios with varying difficulty levels
  - Easy: Ordering pizza, calling a friend
  - Medium: Scheduling appointments
  - More scenarios can be easily added

- **Interactive Practice Sessions**: 
  - Step-by-step conversation prompts
  - Text input or simulated voice recording
  - Real-time positive reinforcement
  - Response history tracking

- **Progress Tracking**:
  - Session completion statistics
  - Average performance scores
  - Achievement badges for milestones
  - Motivational messages

- **Calming UI Design**:
  - Soft color palette with gradients
  - Clean, modern interface
  - Clear visual hierarchy
  - Responsive layout

## Running the Application

### Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app:app --reload
   ```

   The API will be available at http://localhost:8000

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

## Architecture

- **Frontend**: Next.js with React, TypeScript, and styled-jsx for styling
- **Backend**: FastAPI with in-memory storage (suitable for MVP)
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks for local state

## API Endpoints

- `GET /api/scenarios` - List all practice scenarios
- `GET /api/scenarios/{id}` - Get specific scenario details
- `POST /api/sessions/start` - Start a new practice session
- `POST /api/sessions/update` - Submit user response
- `POST /api/sessions/complete` - Complete session and calculate score
- `GET /api/progress/{user_id}` - Get user progress and achievements
- `GET /api/tips` - Get helpful tips for phone anxiety

## Future Enhancements

- Real voice recording and playback
- AI-powered conversation responses
- More diverse scenarios
- User authentication and persistent storage
- Social features (sharing progress, community support)
- Detailed analytics and insights
- Mobile app version