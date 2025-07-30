// Breathing Exercise Component
import { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface BreathingExerciseProps {
  sessionId: string | null;
}

export default function BreathingExercise({ sessionId }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);

  // 4-7-8 breathing pattern
  const breathingPattern = {
    inhale: 4,
    hold: 7,
    exhale: 8
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setExerciseTime(prev => prev + 1);
        setCount(prev => {
          if (prev >= breathingPattern[phase] - 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
            } else if (phase === 'hold') {
              setPhase('exhale');
            } else {
              setPhase('inhale');
              setCycles(c => c + 1);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(0);
    setCycles(0);
    setExerciseTime(0);
  };

  const stopExercise = async () => {
    setIsActive(false);
    
    // Save exercise data
    if (sessionId && exerciseTime > 0) {
      try {
        await fetch(`${API_URL}/api/exercises/breathing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            type: 'breathing',
            duration: exerciseTime,
            completed: true
          })
        });
      } catch (error) {
        console.error('Failed to save exercise:', error);
      }
    }
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out completely...';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale':
        return 1 + (count / breathingPattern.inhale) * 0.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1.5 - (count / breathingPattern.exhale) * 0.5;
    }
  };

  return (
    <div className="breathing-container">
      <h3 className="exercise-title">
        <Wind className="exercise-icon" />
        4-7-8 Breathing Exercise
      </h3>
      <p className="exercise-description">
        This breathing technique helps calm your nervous system and reduce anxiety.
      </p>
      
      <div className="breathing-visual">
        <div 
          className="breathing-circle"
          style={{ transform: `scale(${getCircleScale()})` }}
        >
          <span className="breath-count">{count + 1}</span>
        </div>
        
        {isActive && (
          <div className="phase-info">
            <p className="phase-message">{getPhaseMessage()}</p>
            <p className="cycle-count">Cycle {cycles + 1}</p>
          </div>
        )}
      </div>
      
      <div className="controls">
        {!isActive ? (
          <button className="control-button start" onClick={startExercise}>
            Start Exercise
          </button>
        ) : (
          <button className="control-button stop" onClick={stopExercise}>
            End Exercise
          </button>
        )}
      </div>
      
      {cycles > 0 && (
        <p className="completion-message">
          Great job! You've completed {cycles} breathing cycle{cycles > 1 ? 's' : ''}.
        </p>
      )}

      <style jsx>{`
        .breathing-container {
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
          color: #667eea;
        }

        .exercise-description {
          color: #4a5568;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        .breathing-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 0;
          min-height: 200px;
        }

        .breathing-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 1s ease-in-out;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        .breath-count {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .phase-info {
          margin-top: 2rem;
          text-align: center;
        }

        .phase-message {
          font-size: 1.125rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .cycle-count {
          color: #718096;
          font-size: 0.875rem;
        }

        .controls {
          display: flex;
          justify-content: center;
          margin: 2rem 0 1rem;
        }

        .control-button {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-button.start {
          background: #667eea;
          color: white;
        }

        .control-button.start:hover {
          background: #5a67d8;
        }

        .control-button.stop {
          background: #e53e3e;
          color: white;
        }

        .control-button.stop:hover {
          background: #c53030;
        }

        .completion-message {
          text-align: center;
          color: #48bb78;
          font-weight: 500;
          margin-top: 1rem;
        }

        @media (max-width: 640px) {
          .breathing-circle {
            width: 100px;
            height: 100px;
          }
          
          .breath-count {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}