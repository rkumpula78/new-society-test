# Phone Anxiety Support App - FastAPI Backend

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
import json

app = FastAPI()

# Add CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory storage for MVP (replace with database in production)
sessions = {}
exercises = {}
reflections = {}
progress = {}

# Pydantic models
class Message(BaseModel):
    text: str

class Session(BaseModel):
    user_id: str
    created_at: datetime = datetime.now()

class Exercise(BaseModel):
    session_id: str
    type: str  # breathing, affirmation
    duration: int  # seconds
    completed: bool = False
    timestamp: datetime = datetime.now()

class Reflection(BaseModel):
    session_id: str
    pre_call_anxiety: int  # 1-10
    post_call_anxiety: int  # 1-10
    notes: str
    timestamp: datetime = datetime.now()

class Progress(BaseModel):
    user_id: str
    total_sessions: int = 0
    total_exercises: int = 0
    avg_pre_anxiety: float = 0.0
    avg_post_anxiety: float = 0.0
    last_session: Optional[datetime] = None

# Original endpoints
@app.get("/hello")
async def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/echo")
async def echo_message(msg: Message):
    return {"echo": msg.text}

# Phone Anxiety App endpoints
@app.post("/api/sessions/create")
async def create_session():
    """Create a new user session"""
    session_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())  # In production, use proper auth
    
    session = Session(user_id=user_id)
    sessions[session_id] = session.dict()
    
    # Initialize user progress if new user
    if user_id not in progress:
        progress[user_id] = Progress(user_id=user_id).dict()
    
    return {"session_id": session_id, "user_id": user_id}

@app.post("/api/exercises/breathing")
async def save_breathing_exercise(exercise: Exercise):
    """Save breathing exercise completion"""
    if exercise.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    exercise_id = str(uuid.uuid4())
    exercises[exercise_id] = exercise.dict()
    
    # Update progress
    user_id = sessions[exercise.session_id]["user_id"]
    if user_id in progress:
        progress[user_id]["total_exercises"] += 1
    
    return {"exercise_id": exercise_id, "status": "saved"}

@app.post("/api/exercises/affirmation")
async def save_affirmation_exercise(exercise: Exercise):
    """Save affirmation exercise completion"""
    if exercise.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    exercise_id = str(uuid.uuid4())
    exercises[exercise_id] = exercise.dict()
    
    # Update progress
    user_id = sessions[exercise.session_id]["user_id"]
    if user_id in progress:
        progress[user_id]["total_exercises"] += 1
    
    return {"exercise_id": exercise_id, "status": "saved"}

@app.post("/api/reflections")
async def save_reflection(reflection: Reflection):
    """Save post-call reflection"""
    if reflection.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    reflection_id = str(uuid.uuid4())
    reflections[reflection_id] = reflection.dict()
    
    # Update progress
    user_id = sessions[reflection.session_id]["user_id"]
    if user_id in progress:
        user_progress = progress[user_id]
        
        # Calculate running averages
        total = user_progress["total_sessions"]
        user_progress["avg_pre_anxiety"] = (
            (user_progress["avg_pre_anxiety"] * total + reflection.pre_call_anxiety) / (total + 1)
        )
        user_progress["avg_post_anxiety"] = (
            (user_progress["avg_post_anxiety"] * total + reflection.post_call_anxiety) / (total + 1)
        )
        user_progress["total_sessions"] += 1
        user_progress["last_session"] = datetime.now().isoformat()
    
    return {"reflection_id": reflection_id, "status": "saved"}

@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    """Get user progress data"""
    if user_id not in progress:
        raise HTTPException(status_code=404, detail="User not found")
    
    return progress[user_id]

@app.get("/api/affirmations")
async def get_affirmations():
    """Get list of positive affirmations"""
    affirmations = [
        "I am capable of handling this phone call",
        "My voice matters and deserves to be heard",
        "I can take breaks if I need them",
        "It's okay to feel nervous, I can work through it",
        "I have prepared well for this conversation",
        "I am strong and can manage my anxiety",
        "This feeling is temporary and will pass",
        "I've done this before and I can do it again",
        "I am in control of my breathing and my thoughts",
        "Every phone call is a chance to grow stronger"
    ]
    return {"affirmations": affirmations}
