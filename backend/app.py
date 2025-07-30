# backend/app.py
# Phone Anxiety Practice App - Backend API

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import random
from enum import Enum

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class ScenarioType(str, Enum):
    PIZZA_ORDER = "pizza_order"
    FRIEND_CALL = "friend_call"
    APPOINTMENT = "appointment"
    CUSTOMER_SERVICE = "customer_service"
    EMERGENCY = "emergency"

class Scenario(BaseModel):
    id: str
    type: ScenarioType
    title: str
    description: str
    difficulty: DifficultyLevel
    duration_seconds: int
    prompts: List[str]
    responses: Dict[str, List[str]]

class SessionStart(BaseModel):
    scenario_id: str
    user_id: Optional[str] = None

class SessionUpdate(BaseModel):
    session_id: str
    user_response: str
    timestamp: float

class SessionComplete(BaseModel):
    session_id: str
    completed: bool
    score: float
    feedback: str

class Progress(BaseModel):
    user_id: str
    total_sessions: int
    completed_sessions: int
    average_score: float
    achievements: List[str]
    streak_days: int

# In-memory storage (for MVP)
scenarios_db = {
    "pizza_easy": Scenario(
        id="pizza_easy",
        type=ScenarioType.PIZZA_ORDER,
        title="Order a Pizza",
        description="Practice ordering a pizza from your favorite restaurant",
        difficulty=DifficultyLevel.EASY,
        duration_seconds=120,
        prompts=[
            "Hello! Welcome to Mario's Pizza. How can I help you today?",
            "What size pizza would you like?",
            "What toppings would you like on that?",
            "Would you like anything else with your order?",
            "Can I get your address for delivery?"
        ],
        responses={
            "greeting": ["Hi, I'd like to order a pizza", "Hello, can I place an order?"],
            "size": ["I'd like a large pizza", "Can I get a medium pizza?"],
            "toppings": ["Pepperoni and mushrooms please", "Just cheese is fine"],
            "extras": ["No thank you", "Can I add a drink?"],
            "address": ["It's 123 Main Street", "My address is..."]
        }
    ),
    "friend_easy": Scenario(
        id="friend_easy",
        type=ScenarioType.FRIEND_CALL,
        title="Call a Friend",
        description="Practice calling a friend to make plans",
        difficulty=DifficultyLevel.EASY,
        duration_seconds=90,
        prompts=[
            "Hey! How's it going?",
            "What have you been up to?",
            "Want to hang out this weekend?",
            "Great! What time works for you?"
        ],
        responses={
            "greeting": ["Hi! I'm doing well, how are you?", "Hey, good to hear from you!"],
            "update": ["Not much, just working", "Been pretty busy lately"],
            "plans": ["Yeah, that sounds fun!", "Sure, what did you have in mind?"],
            "time": ["Saturday afternoon works", "How about 2pm?"]
        }
    ),
    "appointment_medium": Scenario(
        id="appointment_medium",
        type=ScenarioType.APPOINTMENT,
        title="Schedule a Doctor's Appointment",
        description="Practice scheduling a medical appointment",
        difficulty=DifficultyLevel.MEDIUM,
        duration_seconds=180,
        prompts=[
            "Good morning, Dr. Smith's office. How can I help you?",
            "What's the reason for your visit?",
            "When would you like to come in?",
            "We have an opening next Tuesday at 3pm. Does that work?",
            "Can I get your insurance information?"
        ],
        responses={
            "greeting": ["Hi, I need to schedule an appointment", "I'd like to make an appointment please"],
            "reason": ["I need a regular checkup", "I've been having headaches"],
            "timing": ["Sometime next week would be good", "What times do you have available?"],
            "confirm": ["Yes, that works for me", "Tuesday at 3pm is perfect"],
            "insurance": ["I have Blue Cross Blue Shield", "My insurance is..."]
        }
    )
}

sessions_db = {}
progress_db = {}

# API Endpoints
@app.get("/api/scenarios")
async def get_scenarios(difficulty: Optional[DifficultyLevel] = None):
    """Get all available scenarios, optionally filtered by difficulty"""
    scenarios = list(scenarios_db.values())
    if difficulty:
        scenarios = [s for s in scenarios if s.difficulty == difficulty]
    return {"scenarios": scenarios}

@app.get("/api/scenarios/{scenario_id}")
async def get_scenario(scenario_id: str):
    """Get a specific scenario by ID"""
    if scenario_id not in scenarios_db:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenarios_db[scenario_id]

@app.post("/api/sessions/start")
async def start_session(session_data: SessionStart):
    """Start a new practice session"""
    if session_data.scenario_id not in scenarios_db:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    session_id = f"session_{datetime.now().timestamp()}"
    sessions_db[session_id] = {
        "id": session_id,
        "scenario_id": session_data.scenario_id,
        "user_id": session_data.user_id,
        "started_at": datetime.now().isoformat(),
        "responses": [],
        "current_prompt": 0,
        "completed": False
    }
    
    scenario = scenarios_db[session_data.scenario_id]
    return {
        "session_id": session_id,
        "scenario": scenario,
        "current_prompt": scenario.prompts[0] if scenario.prompts else None
    }

@app.post("/api/sessions/update")
async def update_session(update: SessionUpdate):
    """Update session with user response"""
    if update.session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions_db[update.session_id]
    scenario = scenarios_db[session["scenario_id"]]
    
    # Record the response
    session["responses"].append({
        "prompt_index": session["current_prompt"],
        "response": update.user_response,
        "timestamp": update.timestamp
    })
    
    # Move to next prompt
    session["current_prompt"] += 1
    
    # Check if session is complete
    if session["current_prompt"] >= len(scenario.prompts):
        session["completed"] = True
        next_prompt = None
    else:
        next_prompt = scenario.prompts[session["current_prompt"]]
    
    return {
        "session_id": update.session_id,
        "completed": session["completed"],
        "next_prompt": next_prompt,
        "encouragement": random.choice([
            "Great job! Keep going!",
            "You're doing amazing!",
            "That was perfect!",
            "Excellent response!",
            "You're getting more confident!"
        ])
    }

@app.post("/api/sessions/complete")
async def complete_session(completion: SessionComplete):
    """Complete a session and calculate score"""
    if completion.session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions_db[completion.session_id]
    session["completed"] = True
    session["score"] = completion.score
    session["feedback"] = completion.feedback
    
    # Update user progress
    if session["user_id"]:
        user_id = session["user_id"]
        if user_id not in progress_db:
            progress_db[user_id] = {
                "user_id": user_id,
                "total_sessions": 0,
                "completed_sessions": 0,
                "total_score": 0,
                "achievements": [],
                "last_session": None
            }
        
        progress = progress_db[user_id]
        progress["total_sessions"] += 1
        if completion.completed:
            progress["completed_sessions"] += 1
            progress["total_score"] += completion.score
        progress["last_session"] = datetime.now().isoformat()
        
        # Check for achievements
        if progress["completed_sessions"] == 1:
            progress["achievements"].append("First Call Complete!")
        if progress["completed_sessions"] == 5:
            progress["achievements"].append("5 Calls Milestone!")
        if progress["completed_sessions"] == 10:
            progress["achievements"].append("Phone Pro!")
    
    return {
        "message": "Session completed successfully",
        "final_score": completion.score,
        "achievements": progress_db.get(session["user_id"], {}).get("achievements", [])
    }

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    """Get user progress and achievements"""
    if user_id not in progress_db:
        return Progress(
            user_id=user_id,
            total_sessions=0,
            completed_sessions=0,
            average_score=0.0,
            achievements=[],
            streak_days=0
        )
    
    progress = progress_db[user_id]
    avg_score = progress["total_score"] / progress["completed_sessions"] if progress["completed_sessions"] > 0 else 0
    
    return Progress(
        user_id=user_id,
        total_sessions=progress["total_sessions"],
        completed_sessions=progress["completed_sessions"],
        average_score=avg_score,
        achievements=progress["achievements"],
        streak_days=0  # Simplified for MVP
    )

@app.get("/api/tips")
async def get_tips():
    """Get helpful tips for phone anxiety"""
    return {
        "tips": [
            "Take deep breaths before making a call",
            "Write down key points you want to cover",
            "Practice with easier scenarios first",
            "Remember: it's okay to pause and think",
            "Celebrate small victories!",
            "Use a calm, steady voice",
            "Smile while talking - it helps your tone",
            "Keep a glass of water nearby"
        ]
    }
