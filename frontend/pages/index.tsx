// frontend/pages/index.tsx
// Phone Anxiety Practice App - Main Interface

import { useEffect, useState } from 'react';
import { Phone, Award, TrendingUp, Heart, Volume2, Mic, CheckCircle, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Scenario {
  id: string;
  type: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration_seconds: number;
  prompts: string[];
}

interface Session {
  session_id: string;
  scenario: Scenario;
  current_prompt: string;
}

interface Progress {
  total_sessions: number;
  completed_sessions: number;
  average_score: number;
  achievements: string[];
  streak_days: number;
}

export default function PhoneAnxietyApp() {
  const [view, setView] = useState<'home' | 'scenarios' | 'practice' | 'progress'>('home');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [userResponse, setUserResponse] = useState<string>('');
  const [encouragement, setEncouragement] = useState<string>('');
  const [sessionResponses, setSessionResponses] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [userId] = useState(`user_${Date.now()}`); // Simple user ID for MVP

  // Load scenarios on mount
  useEffect(() => {
    fetchScenarios();
    fetchProgress();
    fetchTips();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scenarios`);
      const data = await response.json();
      setScenarios(data.scenarios);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/progress/${userId}`);
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchTips = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tips`);
      const data = await response.json();
      setTips(data.tips);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  const startSession = async (scenario: Scenario) => {
    try {
      const response = await fetch(`${API_URL}/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenario.id, user_id: userId })
      });
      const data = await response.json();
      setCurrentSession(data);
      setCurrentPrompt(data.current_prompt);
      setSelectedScenario(scenario);
      setView('practice');
      setSessionResponses([]);
      setUserResponse('');
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const submitResponse = async () => {
    if (!currentSession || !userResponse.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/sessions/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: currentSession.session_id,
          user_response: userResponse,
          timestamp: Date.now()
        })
      });
      const data = await response.json();
      
      setSessionResponses([...sessionResponses, userResponse]);
      setEncouragement(data.encouragement);
      setUserResponse('');
      
      if (data.completed) {
        await completeSession();
      } else {
        setCurrentPrompt(data.next_prompt);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const completeSession = async () => {
    if (!currentSession) return;

    try {
      const score = 85 + Math.random() * 15; // Simplified scoring for MVP
      const response = await fetch(`${API_URL}/api/sessions/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: currentSession.session_id,
          completed: true,
          score: score,
          feedback: "Great job completing the practice session!"
        })
      });
      const data = await response.json();
      
      // Show completion message
      setEncouragement(`Session complete! Score: ${score.toFixed(0)}%`);
      
      // Refresh progress
      fetchProgress();
      
      // Return to home after delay
      setTimeout(() => {
        setView('home');
        setCurrentSession(null);
        setSelectedScenario(null);
      }, 3000);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input for MVP
      setTimeout(() => {
        setUserResponse("This is my practice response");
        setIsRecording(false);
      }, 2000);
    }
  };

  // Render different views
  const renderHome = () => (
    <div className="home-view">
      <div className="hero-section">
        <Phone className="hero-icon" size={64} />
        <h1>Phone Confidence Builder</h1>
        <p>Practice phone calls in a safe, supportive environment</p>
      </div>

      <div className="action-cards">
        <div className="card" onClick={() => setView('scenarios')}>
          <Phone size={32} />
          <h3>Start Practice</h3>
          <p>Choose from various real-life scenarios</p>
        </div>
        <div className="card" onClick={() => setView('progress')}>
          <TrendingUp size={32} />
          <h3>View Progress</h3>
          <p>Track your improvement over time</p>
        </div>
      </div>

      <div className="tips-section">
        <h3>Helpful Tips</h3>
        <div className="tips-carousel">
          {tips.slice(0, 3).map((tip, index) => (
            <div key={index} className="tip-card">
              <Heart size={20} />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {progress && progress.completed_sessions > 0 && (
        <div className="stats-preview">
          <div className="stat">
            <span className="stat-value">{progress.completed_sessions}</span>
            <span className="stat-label">Calls Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{progress.average_score.toFixed(0)}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderScenarios = () => (
    <div className="scenarios-view">
      <div className="header">
        <button onClick={() => setView('home')} className="back-button">← Back</button>
        <h2>Choose a Scenario</h2>
      </div>

      <div className="difficulty-tabs">
        <button className="tab active">All</button>
        <button className="tab">Easy</button>
        <button className="tab">Medium</button>
        <button className="tab">Hard</button>
      </div>

      <div className="scenarios-grid">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={`scenario-card ${scenario.difficulty}`}>
            <div className="scenario-header">
              <h3>{scenario.title}</h3>
              <span className={`difficulty-badge ${scenario.difficulty}`}>
                {scenario.difficulty}
              </span>
            </div>
            <p>{scenario.description}</p>
            <div className="scenario-footer">
              <span className="duration">~{Math.floor(scenario.duration_seconds / 60)} min</span>
              <button 
                className="start-button"
                onClick={() => startSession(scenario)}
              >
                Start <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPractice = () => (
    <div className="practice-view">
      <div className="practice-header">
        <button onClick={() => setView('scenarios')} className="back-button">← End Call</button>
        <h2>{selectedScenario?.title}</h2>
      </div>

      <div className="call-interface">
        <div className="caller-display">
          <Phone className="phone-icon" size={48} />
          <p className="caller-name">Practice Partner</p>
          <p className="call-status">In Call</p>
        </div>

        <div className="conversation-area">
          <div className="prompt-bubble">
            <Volume2 size={20} />
            <p>{currentPrompt}</p>
          </div>

          {encouragement && (
            <div className="encouragement">
              <CheckCircle size={16} />
              {encouragement}
            </div>
          )}

          <div className="response-area">
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your response here or use the microphone..."
              className="response-input"
              rows={3}
            />
            <div className="response-actions">
              <button 
                className={`record-button ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
              >
                <Mic size={20} />
                {isRecording ? 'Recording...' : 'Record'}
              </button>
              <button 
                className="submit-button"
                onClick={submitResponse}
                disabled={!userResponse.trim()}
              >
                Send Response
              </button>
            </div>
          </div>
        </div>

        <div className="response-history">
          <h4>Your Responses:</h4>
          {sessionResponses.map((response, index) => (
            <div key={index} className="history-item">
              <CheckCircle size={16} />
              {response}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="progress-view">
      <div className="header">
        <button onClick={() => setView('home')} className="back-button">← Back</button>
        <h2>Your Progress</h2>
      </div>

      {progress && (
        <>
          <div className="progress-stats">
            <div className="stat-card">
              <Phone size={32} />
              <h3>{progress.total_sessions}</h3>
              <p>Total Sessions</p>
            </div>
            <div className="stat-card">
              <CheckCircle size={32} />
              <h3>{progress.completed_sessions}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card">
              <TrendingUp size={32} />
              <h3>{progress.average_score.toFixed(0)}%</h3>
              <p>Average Score</p>
            </div>
          </div>

          {progress.achievements.length > 0 && (
            <div className="achievements">
              <h3>Achievements</h3>
              <div className="achievement-list">
                {progress.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-badge">
                    <Award size={24} />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="motivation">
            <Heart size={24} />
            <p>Every call you make is a step towards greater confidence!</p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="phone-anxiety-app">
      <style jsx>{`
        .phone-anxiety-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }

        .home-view {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 50px;
        }

        .hero-icon {
          color: #5c6bc0;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 2.5rem;
          color: #37474f;
          margin-bottom: 10px;
        }

        h2 {
          font-size: 2rem;
          color: #37474f;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 1.5rem;
          color: #546e7a;
          margin-bottom: 10px;
        }

        p {
          color: #78909c;
          line-height: 1.6;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-align: center;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .card svg {
          color: #5c6bc0;
          margin-bottom: 15px;
        }

        .tips-section {
          background: white;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .tips-carousel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .tip-card {
          background: #f5f5f5;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: start;
          gap: 10px;
        }

        .tip-card svg {
          color: #ec407a;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .stats-preview {
          display: flex;
          justify-content: center;
          gap: 40px;
          background: white;
          border-radius: 16px;
          padding: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #5c6bc0;
        }

        .stat-label {
          display: block;
          color: #78909c;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .scenarios-view, .practice-view, .progress-view {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-button {
          background: none;
          border: none;
          color: #5c6bc0;
          cursor: pointer;
          font-size: 1rem;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: rgba(92, 107, 192, 0.1);
        }

        .difficulty-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .tab {
          padding: 10px 20px;
          border: none;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: #5c6bc0;
          color: white;
        }

        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .scenario-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          transition: transform 0.2s;
        }

        .scenario-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }

        .scenario-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }

        .difficulty-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-badge.easy {
          background: #c8e6c9;
          color: #2e7d32;
        }

        .difficulty-badge.medium {
          background: #fff3cd;
          color: #f57c00;
        }

        .difficulty-badge.hard {
          background: #ffcdd2;
          color: #c62828;
        }

        .scenario-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .duration {
          color: #78909c;
          font-size: 0.9rem;
        }

        .start-button {
          background: #5c6bc0;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.2s;
        }

        .start-button:hover {
          background: #4a5ab5;
        }

        .practice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .call-interface {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .caller-display {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
        }

        .phone-icon {
          color: #4caf50;
          margin-bottom: 10px;
        }

        .caller-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #37474f;
          margin-bottom: 5px;
        }

        .call-status {
          color: #4caf50;
          font-size: 0.9rem;
        }

        .conversation-area {
          margin-bottom: 30px;
        }

        .prompt-bubble {
          background: #e3f2fd;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: start;
          gap: 15px;
        }

        .prompt-bubble svg {
          color: #1976d2;
          flex-shrink: 0;
        }

        .encouragement {
          background: #c8e6c9;
          color: #2e7d32;
          border-radius: 8px;
          padding: 12px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .response-area {
          margin-top: 20px;
        }

        .response-input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          resize: none;
          transition: border-color 0.2s;
        }

        .response-input:focus {
          outline: none;
          border-color: #5c6bc0;
        }

        .response-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .record-button {
          background: #f5f5f5;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .record-button.recording {
          background: #ef5350;
          color: white;
        }

        .submit-button {
          background: #5c6bc0;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          cursor: pointer;
          flex: 1;
          transition: background 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #4a5ab5;
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .response-history {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }

        .history-item {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 12px;
          margin-top: 10px;
          display: flex;
          align-items: start;
          gap: 10px;
        }

        .history-item svg {
          color: #4caf50;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .stat-card svg {
          color: #5c6bc0;
          margin-bottom: 15px;
        }

        .achievements {
          background: white;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .achievement-list {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 20px;
        }

        .achievement-badge {
          background: linear-gradient(135deg, #ffd54f, #ffca28);
          color: #5d4037;
          border-radius: 25px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
        }

        .motivation {
          background: white;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .motivation svg {
          color: #ec407a;
        }

        .motivation p {
          font-size: 1.1rem;
          color: #546e7a;
          margin: 0;
        }
      `}</style>

      {view === 'home' && renderHome()}
      {view === 'scenarios' && renderScenarios()}
      {view === 'practice' && renderPractice()}
      {view === 'progress' && renderProgress()}
    </div>
  );
}
