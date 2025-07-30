// Progress Tracker Component
import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Calendar, Award } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ProgressTrackerProps {
  userId: string | null;
}

interface ProgressData {
  total_sessions: number;
  total_exercises: number;
  avg_pre_anxiety: number;
  avg_post_anxiety: number;
  last_session: string | null;
}

export default function ProgressTracker({ userId }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProgress();
    }
  }, [userId]);

  const loadProgress = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/api/progress/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to load progress');
      }
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError('Unable to load your progress. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getAnxietyReduction = () => {
    if (!progress || progress.avg_pre_anxiety === 0) return 0;
    const reduction = ((progress.avg_pre_anxiety - progress.avg_post_anxiety) / progress.avg_pre_anxiety) * 100;
    return Math.round(reduction);
  };

  const getAchievementLevel = () => {
    if (!progress) return 'Beginner';
    const { total_sessions } = progress;
    if (total_sessions >= 20) return 'Expert';
    if (total_sessions >= 10) return 'Advanced';
    if (total_sessions >= 5) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <div className="progress-container">
        <div className="loading-state">
          <Activity className="loading-icon" />
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-container">
        <div className="empty-state">
          <p>No progress data available yet. Complete your first session to start tracking!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <h2 className="section-title">
        <TrendingUp className="section-icon" />
        Your Progress
      </h2>
      
      <div className="stats-grid">
        {/* Sessions Completed */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Calendar className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{progress.total_sessions}</h3>
            <p className="stat-label">Sessions Completed</p>
          </div>
        </div>

        {/* Exercises Done */}
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Activity className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{progress.total_exercises}</h3>
            <p className="stat-label">Exercises Completed</p>
          </div>
        </div>

        {/* Anxiety Reduction */}
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{getAnxietyReduction()}%</h3>
            <p className="stat-label">Avg Anxiety Reduction</p>
          </div>
        </div>

        {/* Achievement Level */}
        <div className="stat-card">
          <div className="stat-icon-wrapper gold">
            <Award className="stat-icon" />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{getAchievementLevel()}</h3>
            <p className="stat-label">Current Level</p>
          </div>
        </div>
      </div>

      {/* Anxiety Trends */}
      {progress.total_sessions > 0 && (
        <div className="anxiety-trends">
          <h3 className="trends-title">Anxiety Levels</h3>
          <div className="anxiety-bars">
            <div className="anxiety-bar">
              <label>Before Calls</label>
              <div className="bar-container">
                <div 
                  className="bar-fill pre"
                  style={{ width: `${(progress.avg_pre_anxiety / 10) * 100}%` }}
                />
                <span className="bar-value">{progress.avg_pre_anxiety.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="anxiety-bar">
              <label>After Calls</label>
              <div className="bar-container">
                <div 
                  className="bar-fill post"
                  style={{ width: `${(progress.avg_post_anxiety / 10) * 100}%` }}
                />
                <span className="bar-value">{progress.avg_post_anxiety.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Session */}
      <div className="last-session">
        <p>Last session: <strong>{formatDate(progress.last_session)}</strong></p>
      </div>

      {/* Motivational Message */}
      <div className="motivation-card">
        <p className="motivation-text">
          {progress.total_sessions === 0 
            ? "Start your journey today! Every call is a step towards overcoming anxiety."
            : progress.total_sessions < 5
            ? "Great start! Keep practicing and you'll see improvement."
            : progress.total_sessions < 10
            ? "You're making excellent progress! Your dedication is paying off."
            : "Amazing work! You've come so far in managing your phone anxiety."}
        </p>
      </div>

      <style jsx>{`
        .progress-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .loading-state, .error-state, .empty-state {
          text-align: center;
          padding: 3rem;
          color: #4a5568;
        }

        .loading-icon {
          width: 48px;
          height: 48px;
          color: #667eea;
          margin: 0 auto 1rem;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-message {
          color: #e53e3e;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          text-align: center;
          margin-bottom: 2rem;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.blue {
          background: #e6f2ff;
        }

        .stat-icon-wrapper.purple {
          background: #f3e8ff;
        }

        .stat-icon-wrapper.green {
          background: #e6fffa;
        }

        .stat-icon-wrapper.gold {
          background: #fef3c7;
        }

        .stat-icon {
          width: 24px;
          height: 24px;
        }

        .stat-icon-wrapper.blue .stat-icon {
          color: #3182ce;
        }

        .stat-icon-wrapper.purple .stat-icon {
          color: #805ad5;
        }

        .stat-icon-wrapper.green .stat-icon {
          color: #38a169;
        }

        .stat-icon-wrapper.gold .stat-icon {
          color: #d69e2e;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #718096;
          margin: 0;
        }

        .anxiety-trends {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .trends-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .anxiety-bars {
          space-y: 1.5rem;
        }

        .anxiety-bar {
          margin-bottom: 1.5rem;
        }

        .anxiety-bar label {
          display: block;
          font-size: 0.875rem;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .bar-container {
          position: relative;
          height: 32px;
          background: #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 1rem;
        }

        .bar-fill.pre {
          background: linear-gradient(90deg, #e53e3e 0%, #c53030 100%);
        }

        .bar-fill.post {
          background: linear-gradient(90deg, #38a169 0%, #2f855a 100%);
        }

        .bar-value {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 600;
          color: #2d3748;
        }

        .last-session {
          text-align: center;
          color: #718096;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .motivation-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }

        .motivation-text {
          color: white;
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-card {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}