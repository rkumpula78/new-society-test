// Phone Anxiety Support App - Main Page
import { useState, useEffect } from 'react';
import { Phone, Heart, Brain, BookOpen, TrendingUp, Wind } from 'lucide-react';

// Component imports (we'll create these next)
import BreathingExercise from '../components/BreathingExercise';
import AffirmationsComponent from '../components/Affirmations';
import DuringCallSupport from '../components/DuringCallSupport';
import PostCallReflection from '../components/PostCallReflection';
import ProgressTracker from '../components/ProgressTracker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type AppState = 'home' | 'pre-call' | 'during-call' | 'post-call' | 'progress';

export default function PhoneAnxietyApp() {
  const [appState, setAppState] = useState<AppState>('home');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sessions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to create session');
      
      const data = await response.json();
      setSessionId(data.session_id);
      setUserId(data.user_id);
      
      // Store in localStorage for persistence
      localStorage.setItem('phoneAnxiety_sessionId', data.session_id);
      localStorage.setItem('phoneAnxiety_userId', data.user_id);
    } catch (err) {
      setError('Failed to initialize session. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'home':
        return (
          <div className="home-container">
            <h1 className="title">
              <Phone className="icon" /> Phone Anxiety Support
            </h1>
            <p className="subtitle">Your companion for managing phone call anxiety</p>
            
            <div className="card-grid">
              <div className="card" onClick={() => setAppState('pre-call')}>
                <Heart className="card-icon" />
                <h3>Pre-Call Preparation</h3>
                <p>Breathing exercises and positive affirmations</p>
              </div>
              
              <div className="card" onClick={() => setAppState('during-call')}>
                <Brain className="card-icon" />
                <h3>During Call Support</h3>
                <p>Visual guides and calming messages</p>
              </div>
              
              <div className="card" onClick={() => setAppState('post-call')}>
                <BookOpen className="card-icon" />
                <h3>Post-Call Reflection</h3>
                <p>Journal your experience and track progress</p>
              </div>
              
              <div className="card" onClick={() => setAppState('progress')}>
                <TrendingUp className="card-icon" />
                <h3>Your Progress</h3>
                <p>View your journey and improvements</p>
              </div>
            </div>
          </div>
        );
      
      case 'pre-call':
        return (
          <div className="section-container">
            <button className="back-button" onClick={() => setAppState('home')}>
              ← Back
            </button>
            <h2 className="section-title">Pre-Call Preparation</h2>
            <p className="section-subtitle">Take a moment to prepare yourself</p>
            
            <div className="exercise-tabs">
              <div className="tab-content">
                <BreathingExercise sessionId={sessionId} />
                <AffirmationsComponent sessionId={sessionId} />
              </div>
            </div>
            
            <button 
              className="primary-button"
              onClick={() => setAppState('during-call')}
            >
              I'm Ready for My Call
            </button>
          </div>
        );
      
      case 'during-call':
        return (
          <div className="section-container">
            <button className="back-button" onClick={() => setAppState('home')}>
              ← Back
            </button>
            <DuringCallSupport />
            <button 
              className="primary-button"
              onClick={() => setAppState('post-call')}
            >
              Call Completed
            </button>
          </div>
        );
      
      case 'post-call':
        return (
          <div className="section-container">
            <button className="back-button" onClick={() => setAppState('home')}>
              ← Back
            </button>
            <PostCallReflection 
              sessionId={sessionId} 
              onComplete={() => setAppState('home')}
            />
          </div>
        );
      
      case 'progress':
        return (
          <div className="section-container">
            <button className="back-button" onClick={() => setAppState('home')}>
              ← Back
            </button>
            <ProgressTracker userId={userId} />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="app-container loading">
        <Wind className="loading-icon" />
        <p>Setting up your session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container error">
        <p className="error-message">{error}</p>
        <button onClick={initializeSession}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {renderContent()}
      
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .app-container.loading, .app-container.error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading-icon {
          width: 48px;
          height: 48px;
          color: #667eea;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-message {
          color: #e53e3e;
          margin-bottom: 1rem;
        }

        .home-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          text-align: center;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .icon {
          width: 40px;
          height: 40px;
          color: #667eea;
        }

        .subtitle {
          text-align: center;
          color: #4a5568;
          font-size: 1.125rem;
          margin-bottom: 3rem;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          color: #667eea;
          margin: 0 auto 1rem;
        }

        .card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .card p {
          color: #718096;
          font-size: 0.875rem;
        }

        .section-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .back-button {
          background: none;
          border: none;
          color: #667eea;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .back-button:hover {
          color: #5a67d8;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          text-align: center;
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .primary-button {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          display: block;
          margin: 2rem auto 0;
          transition: background 0.3s ease;
        }

        .primary-button:hover {
          background: #5a67d8;
        }

        .exercise-tabs {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (max-width: 640px) {
          .title {
            font-size: 2rem;
          }
          
          .card-grid {
            grid-template-columns: 1fr;
          }
          
          .section-container {
            padding: 1rem 0;
          }
        }
      `}</style>
    </div>
  );
}