from fastapi import FastAPI, Request
from app.chatbot import generate_reply

app = FastAPI()

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")
    reply = generate_reply(user_input)
    return {"response": reply}
