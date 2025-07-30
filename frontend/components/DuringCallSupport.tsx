// During Call Support Component
import { useState, useEffect } from 'react';
import { Phone, Wind, MessageCircle, Pause, Play } from 'lucide-react';

export default function DuringCallSupport() {
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  const calmingTips = [
    "You're doing great. Keep breathing slowly.",
    "It's okay to pause and collect your thoughts.",
    "Remember: This call will end, and you'll be okay.",
    "Focus on your breath between speaking.",
    "You have everything you need to handle this.",
    "Take your time. There's no rush.",
    "Your feelings are valid, and you're managing them well.",
    "One moment at a time. You've got this."
  ];

  useEffect(() => {
    const breathInterval = setInterval(() => {
      if (isBreathing) {
        setBreathCount(prev => (prev + 1) % 4);
      }
    }, 4000); // 4 seconds per breath cycle

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % calmingTips.length);
    }, 10000); // Change tip every 10 seconds

    return () => {
      clearInterval(breathInterval);
      clearInterval(tipInterval);
    };
  }, [isBreathing, calmingTips.length]);

  const getBreathPhase = () => {
    switch (breathCount) {
      case 0:
      case 1:
        return 'Breathe In';
      case 2:
      case 3:
        return 'Breathe Out';
      default:
        return 'Breathe';
    }
  };

  const getBreathScale = () => {
    switch (breathCount) {
      case 0:
      case 1:
        return 1.2;
      case 2:
      case 3:
        return 0.8;
      default:
        return 1;
    }
  };

  return (
    <div className="during-call-container">
      <h2 className="section-title">
        <Phone className="phone-icon active" />
        During Your Call
      </h2>
      
      <div className="support-sections">
        {/* Visual Breathing Guide */}
        <div className="breathing-section">
          <h3 className="section-subtitle">
            <Wind className="section-icon" />
            Visual Breathing Guide
          </h3>
          
          <div className="breathing-indicator">
            <div 
              className="breath-circle"
              style={{ transform: `scale(${getBreathScale()})` }}
            >
              <span className="breath-text">{getBreathPhase()}</span>
            </div>
          </div>
          
          <button 
            className="pause-button"
            onClick={() => setIsBreathing(!isBreathing)}
          >
            {isBreathing ? (
              <>
                <Pause className="button-icon" /> Pause Breathing Guide
              </>
            ) : (
              <>
                <Play className="button-icon" /> Resume Breathing Guide
              </>
            )}
          </button>
        </div>

        {/* Calming Messages */}
        <div className="messages-section">
          <h3 className="section-subtitle">
            <MessageCircle className="section-icon" />
            Calming Reminders
          </h3>
          
          <div className="message-card">
            <p className="calming-message">{calmingTips[currentTip]}</p>
          </div>
          
          <div className="quick-tips">
            <h4>Quick Tips:</h4>
            <ul>
              <li>Speak slowly and clearly</li>
              <li>It's okay to say "Let me think about that"</li>
              <li>Keep your feet flat on the floor</li>
              <li>Relax your shoulders</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .during-call-container {
          max-width: 800px;
          margin: 0 auto;
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

        .phone-icon {
          width: 32px;
          height: 32px;
        }

        .phone-icon.active {
          color: #48bb78;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .support-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .breathing-section, .messages-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .section-subtitle {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          width: 20px;
          height: 20px;
          color: #667eea;
        }

        .breathing-indicator {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .breath-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 4s ease-in-out;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        .breath-text {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .pause-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 auto;
          padding: 0.5rem 1rem;
          background: #e2e8f0;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          color: #4a5568;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .pause-button:hover {
          background: #cbd5e0;
        }

        .button-icon {
          width: 16px;
          height: 16px;
        }

        .message-card {
          background: #f7fafc;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #667eea;
        }

        .calming-message {
          color: #2d3748;
          font-size: 1.125rem;
          line-height: 1.6;
          font-weight: 500;
        }

        .quick-tips {
          margin-top: 1.5rem;
        }

        .quick-tips h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.75rem;
        }

        .quick-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .quick-tips li {
          color: #718096;
          font-size: 0.875rem;
          padding: 0.25rem 0;
          padding-left: 1.25rem;
          position: relative;
        }

        .quick-tips li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #48bb78;
        }

        @media (max-width: 640px) {
          .support-sections {
            grid-template-columns: 1fr;
          }
          
          .breath-circle {
            width: 120px;
            height: 120px;
          }
          
          .breath-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}