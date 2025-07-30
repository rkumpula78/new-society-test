// Post-Call Reflection Component
import { useState } from 'react';
import { BookOpen, Save, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface PostCallReflectionProps {
  sessionId: string | null;
  onComplete: () => void;
}

export default function PostCallReflection({ sessionId, onComplete }: PostCallReflectionProps) {
  const [preCallAnxiety, setPreCallAnxiety] = useState(5);
  const [postCallAnxiety, setPostCallAnxiety] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId) {
      setError('No active session found. Please refresh the page.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/reflections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          pre_call_anxiety: preCallAnxiety,
          post_call_anxiety: postCallAnxiety,
          notes: notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save reflection');
      }

      setSaved(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      setError('Failed to save your reflection. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getAnxietyLabel = (level: number) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return '#48bb78';
    if (level <= 6) return '#ecc94b';
    return '#e53e3e';
  };

  if (saved) {
    return (
      <div className="reflection-container">
        <div className="success-message">
          <Save className="success-icon" />
          <h3>Reflection Saved!</h3>
          <p>Great job completing your phone call. Keep up the good work!</p>
        </div>
        
        <style jsx>{`
          .success-message {
            text-align: center;
            padding: 3rem;
          }
          
          .success-icon {
            width: 48px;
            height: 48px;
            color: #48bb78;
            margin: 0 auto 1rem;
          }
          
          .success-message h3 {
            font-size: 1.5rem;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }
          
          .success-message p {
            color: #4a5568;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reflection-container">
      <h2 className="section-title">
        <BookOpen className="section-icon" />
        Post-Call Reflection
      </h2>
      <p className="section-subtitle">
        Take a moment to reflect on your experience
      </p>

      <form onSubmit={handleSubmit} className="reflection-form">
        {/* Pre-call anxiety */}
        <div className="form-group">
          <label htmlFor="pre-anxiety">
            How anxious were you <strong>before</strong> the call?
          </label>
          <div className="slider-container">
            <input
              id="pre-anxiety"
              type="range"
              min="1"
              max="10"
              value={preCallAnxiety}
              onChange={(e) => setPreCallAnxiety(Number(e.target.value))}
              className="anxiety-slider"
            />
            <div className="slider-labels">
              <span>1</span>
              <span className="current-value" style={{ color: getAnxietyColor(preCallAnxiety) }}>
                {preCallAnxiety} - {getAnxietyLabel(preCallAnxiety)}
              </span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Post-call anxiety */}
        <div className="form-group">
          <label htmlFor="post-anxiety">
            How anxious do you feel <strong>now</strong>?
          </label>
          <div className="slider-container">
            <input
              id="post-anxiety"
              type="range"
              min="1"
              max="10"
              value={postCallAnxiety}
              onChange={(e) => setPostCallAnxiety(Number(e.target.value))}
              className="anxiety-slider"
            />
            <div className="slider-labels">
              <span>1</span>
              <span className="current-value" style={{ color: getAnxietyColor(postCallAnxiety) }}>
                {postCallAnxiety} - {getAnxietyLabel(postCallAnxiety)}
              </span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Anxiety comparison */}
        {postCallAnxiety < preCallAnxiety && (
          <div className="improvement-message">
            Great job! Your anxiety decreased by {preCallAnxiety - postCallAnxiety} points!
          </div>
        )}

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">
            How did the call go? What would you like to remember?
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write about your experience... What went well? What was challenging? What would you do differently next time?"
            rows={6}
            className="reflection-textarea"
          />
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Reflection'}
        </button>
      </form>

      <style jsx>{`
        .reflection-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          text-align: center;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .section-icon {
          width: 32px;
          height: 32px;
          color: #667eea;
        }

        .section-subtitle {
          text-align: center;
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .reflection-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .slider-container {
          padding: 0 0.5rem;
        }

        .anxiety-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
          background: #e2e8f0;
        }

        .anxiety-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .anxiety-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #718096;
        }

        .current-value {
          font-weight: 600;
        }

        .improvement-message {
          background: #c6f6d5;
          color: #22543d;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 500;
        }

        .reflection-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
        }

        .reflection-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e53e3e;
          background: #fff5f5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .error-icon {
          width: 20px;
          height: 20px;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #5a67d8;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .reflection-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}