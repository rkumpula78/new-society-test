# backend/app.py
# this file defines a minimal FastAPI server for the SAAS template.
# it is not intended for heavy production usage.

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    text: str

@app.get("/hello")
async def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/echo")
async def echo_message(msg: Message):
    # simply return the incoming message
    return {"echo": msg.text}
