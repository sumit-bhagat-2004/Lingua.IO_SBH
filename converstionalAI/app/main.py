from fastapi import FastAPI, Request
from pydantic import BaseModel
from .model import generate_response

app = FastAPI()

class ChatRequest(BaseModel):
    session_id: str
    user_input: str

@app.post("/chat")
async def chat(req: ChatRequest):
    response = await generate_response(req.session_id, req.user_input)
    return {"response": response}
