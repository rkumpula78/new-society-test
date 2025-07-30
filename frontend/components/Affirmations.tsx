// Affirmations Component
import { useState, useEffect } from 'react';
import { Heart, RefreshCw, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AffirmationsComponentProps {
  sessionId: string | null;
}

export default function AffirmationsComponent({ sessionId }: AffirmationsComponentProps) {
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    loadAffirmations();
  }, []);

  const loadAffirmations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/affirmations`);
      const data = await response.json();
      setAffirmations(data.affirmations);
      setLoading(false);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Failed to load affirmations:', error);
      setLoading(false);
    }
  };

  const nextAffirmation = () => {
    if (currentIndex < affirmations.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const completeExercise = async () => {
    setCompleted(true);
    
    if (sessionId && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      try {
        await fetch(`${API_URL}/api/exercises/affirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            type: 'affirmation',
            duration: duration,
            completed: true
          })
        });
      } catch (error) {
        console.error('Failed to save exercise:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="affirmations-container">
        <p>Loading affirmations...</p>
      </div>
    );
  }

  return (
    <div className="affirmations-container">
      <h3 className="exercise-title">
        <Heart className="exercise-icon" />
        Positive Affirmations
      </h3>
      <p className="exercise-description">
        Read these affirmations aloud or in your mind. Take your time with each one.
      </p>
      
      <div className="affirmation-card">
        <p className="affirmation-text">
          "{affirmations[currentIndex]}"
        </p>
        
        <div className="affirmation-progress">
          <span className="progress-text">
            {currentIndex + 1} of {affirmations.length}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / affirmations.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="controls">
        {!completed ? (
          <>
            <button 
              className="control-button secondary"
              onClick={nextAffirmation}
              disabled={currentIndex === affirmations.length - 1}
            >
              <RefreshCw className="button-icon" />
              Next Affirmation
            </button>
            
            <button 
              className="control-button primary"
              onClick={completeExercise}
            >
              <Check className="button-icon" />
              Complete Exercise
            </button>
          </>
        ) : (
          <p className="completion-message">
            Wonderful! You've completed the affirmation exercise.
          </p>
        )}
      </div>

      <style jsx>{`
        .affirmations-container {
          background: #f7fafc;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .exercise-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .exercise-icon {
          width: 24px;
          height: 24px;
          color: #ed64a6;
        }

        .exercise-description {
          color: #4a5568;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        .affirmation-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin: 1.5rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .affirmation-text {
          font-size: 1.25rem;
          color: #2d3748;
          line-height: 1.6;
          font-weight: 500;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .affirmation-progress {
          margin-top: 1.5rem;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #718096;
          display: block;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ed64a6 0%, #b83280 100%);
          transition: width 0.3s ease;
        }

        .controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .control-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .button-icon {
          width: 18px;
          height: 18px;
        }

        .control-button.primary {
          background: #48bb78;
          color: white;
        }

        .control-button.primary:hover {
          background: #38a169;
        }

        .control-button.secondary {
          background: #667eea;
          color: white;
        }

        .control-button.secondary:hover {
          background: #5a67d8;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .completion-message {
          text-align: center;
          color: #48bb78;
          font-weight: 500;
          margin: 1rem 0;
        }

        @media (max-width: 640px) {
          .affirmation-text {
            font-size: 1.125rem;
          }
          
          .controls {
            flex-direction: column;
            width: 100%;
          }
          
          .control-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}